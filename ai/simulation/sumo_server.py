"""JRIP SUMO simulation API.

Run independently on port 5002:
    python ai/simulation/sumo_server.py

Requirements:
- SUMO installed and available through SUMO_HOME or PATH.
- Python packages: flask, traci, sumolib.

The service generates a small road network automatically, runs a real SUMO
simulation, applies the selected road-impact scenario, and streams metrics to
JRIP's monitoring page.
"""

from __future__ import annotations

import os
import shutil
import subprocess
import tempfile
import threading
import time
from pathlib import Path
from typing import Any

from flask import Flask, jsonify, request

app = Flask(__name__)

STATE_LOCK = threading.Lock()
STOP_EVENT = threading.Event()
WORKER: threading.Thread | None = None

STATE: dict[str, Any] = {
    "status": "ready",
    "progress": 0.0,
    "elapsed": 0.0,
    "duration": 600,
    "scenario": "detected",
    "vehicles": 0,
    "average_speed": 0.0,
    "congestion": "Ready",
    "estimated_delay": 0.0,
    "diversion": "—",
    "recommendation": "Select a scenario and start the simulation.",
    "priority": "Pending analysis",
    "error": None,
}

SCENARIO_SPEEDS = {
    "detected": 9.5,
    "pothole": 7.5,
    "closure": 4.5,
    "maintenance": 6.0,
}


def _cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Cache-Control"] = "no-store"
    return response


app.after_request(_cors)


def _copy_state() -> dict[str, Any]:
    with STATE_LOCK:
        return dict(STATE)


def _update_state(**values: Any) -> None:
    with STATE_LOCK:
        STATE.update(values)


def _find_binary(name: str) -> str | None:
    direct = shutil.which(name)
    if direct:
        return direct

    sumo_home = os.environ.get("SUMO_HOME")
    if sumo_home:
        candidate = Path(sumo_home) / "bin" / (f"{name}.exe" if os.name == "nt" else name)
        if candidate.exists():
            return str(candidate)
    return None


def _load_sumo_modules():
    try:
        import traci  # type: ignore
        import sumolib  # type: ignore
        return traci, sumolib
    except ImportError:
        sumo_home = os.environ.get("SUMO_HOME")
        if sumo_home:
            tools = str(Path(sumo_home) / "tools")
            if tools not in os.sys.path:
                os.sys.path.append(tools)
            import traci  # type: ignore
            import sumolib  # type: ignore
            return traci, sumolib
        raise RuntimeError(
            "SUMO Python tools were not found. Install SUMO and set SUMO_HOME, "
            "or install traci and sumolib with pip."
        )


def _congestion(speed_kmh: float) -> str:
    if speed_kmh >= 35:
        return "Low"
    if speed_kmh >= 24:
        return "Medium"
    if speed_kmh >= 14:
        return "High"
    return "Severe"


def _decision(congestion: str, delay: float) -> tuple[str, str, str]:
    if congestion == "Severe":
        return (
            "Alternative route required",
            "Immediate intervention is recommended. Divert traffic and repair the affected segment as soon as possible.",
            "Critical priority",
        )
    if congestion == "High":
        return (
            "Alternative route advised",
            "Prioritize repair, activate a temporary diversion and deploy traffic control near the detected incident.",
            "High priority",
        )
    if congestion == "Medium":
        return (
            "Off-peak diversion",
            "Use a partial lane closure during off-peak hours and notify drivers before maintenance begins.",
            "Medium priority",
        )
    message = "Traffic remains stable. Schedule routine maintenance without closing the full road."
    if delay >= 10:
        message += f" Predicted delay is approximately {delay:.1f} minutes."
    return "Keep current route", message, "Low priority"


def _prepare_scenario(directory: Path, sumolib: Any, scenario: str, incidents: int) -> tuple[Path, str]:
    netgenerate = _find_binary("netgenerate")
    if not netgenerate:
        raise RuntimeError("netgenerate was not found. Ensure SUMO's bin folder is in PATH.")

    net_file = directory / "jrip.net.xml"
    subprocess.run(
        [
            netgenerate,
            "--grid",
            "--grid.number=4",
            "--grid.length=180",
            "--default.lanenumber=2",
            "--default.speed=13.89",
            "--tls.guess=true",
            "--output-file",
            str(net_file),
        ],
        check=True,
        capture_output=True,
        text=True,
    )

    net = sumolib.net.readNet(str(net_file))
    edges = [edge for edge in net.getEdges() if not edge.getID().startswith(":") and edge.allows("passenger")]
    if len(edges) < 2:
        raise RuntimeError("SUMO generated network does not contain usable passenger edges.")

    best_path = None
    for source in edges:
        for target in reversed(edges):
            if source.getID() == target.getID():
                continue
            result = net.getShortestPath(source, target)
            if result and result[0] and len(result[0]) >= 4:
                best_path = result[0]
                break
        if best_path:
            break

    if not best_path:
        raise RuntimeError("Could not create a valid route through the generated SUMO network.")

    route_edges = " ".join(edge.getID() for edge in best_path)
    affected_edge = best_path[len(best_path) // 2].getID()
    vehicle_count = min(300, max(60, 80 + incidents * 12))

    routes_file = directory / "jrip.rou.xml"
    routes_file.write_text(
        f'''<?xml version="1.0" encoding="UTF-8"?>
<routes>
  <vType id="passenger" accel="2.6" decel="4.5" sigma="0.5" length="5" maxSpeed="16.67" guiShape="passenger"/>
  <route id="mainRoute" edges="{route_edges}"/>
  <flow id="jripFlow" type="passenger" route="mainRoute" begin="0" end="600" number="{vehicle_count}" departLane="best" departSpeed="max"/>
</routes>
''',
        encoding="utf-8",
    )

    config_file = directory / "jrip.sumocfg"
    config_file.write_text(
        '''<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <input>
    <net-file value="jrip.net.xml"/>
    <route-files value="jrip.rou.xml"/>
  </input>
  <time>
    <begin value="0"/>
    <step-length value="1"/>
  </time>
  <processing>
    <time-to-teleport value="-1"/>
  </processing>
</configuration>
''',
        encoding="utf-8",
    )
    return config_file, affected_edge


def _run_simulation(scenario: str, duration: int, incidents: int) -> None:
    traci = None
    label = f"jrip-{int(time.time() * 1000)}"
    try:
        traci, sumolib = _load_sumo_modules()
        sumo_binary = _find_binary("sumo")
        if not sumo_binary:
            raise RuntimeError("SUMO was not found. Add SUMO/bin to PATH or set SUMO_HOME.")

        with tempfile.TemporaryDirectory(prefix="jrip_sumo_") as temp:
            workdir = Path(temp)
            config_file, affected_edge = _prepare_scenario(workdir, sumolib, scenario, incidents)

            traci.start(
                [sumo_binary, "-c", str(config_file), "--no-step-log", "true", "--duration-log.disable", "true"],
                label=label,
            )
            connection = traci.getConnection(label)

            impact_speed = SCENARIO_SPEEDS.get(scenario, SCENARIO_SPEEDS["detected"])
            if scenario == "closure":
                lanes = connection.edge.getLaneNumber(affected_edge)
                if lanes > 1:
                    connection.lane.setDisallowed(f"{affected_edge}_1", ["passenger"])
            connection.edge.setMaxSpeed(affected_edge, impact_speed)

            baseline_speed = 50.0
            cumulative_delay_seconds = 0.0
            last_metrics = (0, 0.0)

            for step in range(duration + 1):
                if STOP_EVENT.is_set():
                    _update_state(status="stopped")
                    break

                connection.simulationStep()
                vehicle_ids = connection.vehicle.getIDList()
                speeds = [connection.vehicle.getSpeed(vehicle_id) for vehicle_id in vehicle_ids]
                avg_speed_kmh = (sum(speeds) / len(speeds) * 3.6) if speeds else last_metrics[1]
                if vehicle_ids:
                    last_metrics = (len(vehicle_ids), avg_speed_kmh)

                cumulative_delay_seconds += sum(
                    max(0.0, connection.vehicle.getWaitingTime(vehicle_id)) for vehicle_id in vehicle_ids
                ) / max(len(vehicle_ids), 1)
                estimated_delay = cumulative_delay_seconds / 60.0
                congestion = _congestion(avg_speed_kmh)
                diversion, recommendation, priority = _decision(congestion, estimated_delay)

                _update_state(
                    status="running",
                    progress=min(100.0, (step / max(duration, 1)) * 100.0),
                    elapsed=float(step),
                    vehicles=len(vehicle_ids),
                    average_speed=round(avg_speed_kmh, 1),
                    congestion=congestion,
                    estimated_delay=round(estimated_delay, 1),
                    diversion=diversion,
                    recommendation=recommendation,
                    priority=priority,
                    affected_edge=affected_edge,
                    baseline_speed=baseline_speed,
                    error=None,
                )

                if connection.simulation.getMinExpectedNumber() <= 0 and step > 20:
                    break

                # Keep the API visibly streaming while still finishing quickly.
                time.sleep(0.04)

            if not STOP_EVENT.is_set():
                _update_state(status="completed", progress=100.0)
    except Exception as exc:  # Surface setup/runtime errors to the dashboard.
        _update_state(status="error", error=str(exc), recommendation=str(exc), priority="Configuration required")
    finally:
        try:
            if traci is not None and label in traci.getConnection("default").getLabel():
                traci.switch(label)
                traci.close(False)
        except Exception:
            try:
                if traci is not None:
                    traci.getConnection(label).close(False)
            except Exception:
                pass
        STOP_EVENT.clear()


@app.route("/")
def index():
    return jsonify(
        {
            "service": "JRIP SUMO Simulation API",
            "status": "online",
            "endpoints": {
                "start": "POST /api/simulation/start",
                "status": "GET /api/simulation/status",
                "stop": "POST /api/simulation/stop",
                "reset": "POST /api/simulation/reset",
            },
        }
    )


@app.route("/api/simulation/status", methods=["GET", "OPTIONS"])
def simulation_status():
    return jsonify(_copy_state())


@app.route("/api/simulation/start", methods=["POST", "OPTIONS"])
def simulation_start():
    global WORKER
    if request.method == "OPTIONS":
        return jsonify({"ok": True})

    with STATE_LOCK:
        if STATE["status"] == "running":
            return jsonify({"ok": False, "message": "A simulation is already running.", "state": dict(STATE)}), 409

    payload = request.get_json(silent=True) or {}
    scenario = str(payload.get("scenario", "detected"))
    if scenario not in SCENARIO_SPEEDS:
        return jsonify({"ok": False, "message": "Unsupported scenario."}), 400

    try:
        duration = max(60, min(3600, int(payload.get("duration", 600))))
        incidents = max(0, min(1000, int(payload.get("incidents", 0))))
    except (TypeError, ValueError):
        return jsonify({"ok": False, "message": "duration and incidents must be integers."}), 400

    STOP_EVENT.clear()
    _update_state(
        status="starting",
        progress=0.0,
        elapsed=0.0,
        duration=duration,
        scenario=scenario,
        vehicles=0,
        average_speed=0.0,
        congestion="Starting",
        estimated_delay=0.0,
        diversion="Calculating…",
        recommendation="SUMO is preparing the road network and scenario.",
        priority="Analysis running",
        error=None,
    )

    WORKER = threading.Thread(target=_run_simulation, args=(scenario, duration, incidents), daemon=True)
    WORKER.start()
    return jsonify({"ok": True, "state": _copy_state()}), 202


@app.route("/api/simulation/stop", methods=["POST", "OPTIONS"])
def simulation_stop():
    if request.method == "OPTIONS":
        return jsonify({"ok": True})
    STOP_EVENT.set()
    _update_state(status="stopping")
    return jsonify({"ok": True, "state": _copy_state()})


@app.route("/api/simulation/reset", methods=["POST", "OPTIONS"])
def simulation_reset():
    if request.method == "OPTIONS":
        return jsonify({"ok": True})
    if _copy_state()["status"] in {"running", "starting", "stopping"}:
        STOP_EVENT.set()
    _update_state(
        status="ready",
        progress=0.0,
        elapsed=0.0,
        vehicles=0,
        average_speed=0.0,
        congestion="Ready",
        estimated_delay=0.0,
        diversion="—",
        recommendation="Select a scenario and start the simulation.",
        priority="Pending analysis",
        error=None,
    )
    return jsonify({"ok": True, "state": _copy_state()})


if __name__ == "__main__":
    print("JRIP SUMO Simulation API: http://127.0.0.1:5002")
    print("Install SUMO and set SUMO_HOME before starting a simulation.")
    app.run(host="0.0.0.0", port=5002, debug=False, threaded=True)
