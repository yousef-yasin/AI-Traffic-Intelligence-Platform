JRIP SUMO Stage 3
=================

1) Install SUMO for Windows from the official SUMO website.
2) Set SUMO_HOME to the SUMO installation folder, for example:
   setx SUMO_HOME "C:\Program Files (x86)\Eclipse\Sumo"
3) Open a new PowerShell window and install the Python packages:
   pip install -r ai\simulation\requirements.txt
4) Start the persistent dashboard API as usual:
   python ai\camera\api_server.py
5) Start the SUMO simulation API:
   python ai\simulation\sumo_server.py
6) Open monitoring.php and use Start / Stop / Reset.

The monitoring page talks to:
- Dashboard data API: http://127.0.0.1:5001
- SUMO simulation API: http://127.0.0.1:5002
