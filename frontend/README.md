# frontend

Government dashboard + driver (taxi) interface, built with **HTML/CSS/JS** and
**PHP** as templating (includes/components) — no framework.

**This version was rebuilt with English/LTR as the default language**, with a
🌐 language toggle button in the navbar (and on the login/taxi screens) that
switches the whole UI to Arabic/RTL and back, instantly, without a page reload.

## Running locally (XAMPP)

The project lives at `D:\XAMPP\htdocs\JSYP-ROYOSO`, so just start Apache from
XAMPP and open:

```
http://localhost/JSYP-ROYOSO/frontend/login.php
```

Pick "Government" and you'll land on `dashboard/index.php`, or "Driver" and
you'll land on `taxi/index.php`.

## How the bilingual (i18n) system works

Everything lives in **`assets/js/i18n.js`**, loaded on every page before
`api.js`/`dashboard.js`/`taxi.js`:

- **`UI_STRINGS`** — translations for static chrome (menus, titles, buttons,
  placeholders). Any element tagged `data-i18n="key"` gets its text replaced;
  `data-i18n-placeholder="key"` does the same for input placeholders.
- **`DATA_TRANSLATIONS`** — English/Arabic copies of the *dynamic* content
  that comes from `data/mock.json` (KPI labels, road names, alerts, chart
  labels...), keyed by the same `id`s used in `mock.json`. This keeps
  `mock.json`'s shape completely untouched — the Frontend/Backend contract
  described below still holds.
- Clicking `#langBtn` calls `toggleLang()`, which:
  1. flips `localStorage.jrip_lang` between `"en"`/`"ar"`
  2. sets `<html lang>` and `<html dir>` (so the whole layout mirrors to
     RTL automatically, no separate RTL stylesheet needed)
  3. re-applies all `[data-i18n]` text
  4. fires a `langchange` event that `dashboard.js`/`taxi.js` listen for, to
     re-render the mock.json-driven parts of the page in the new language.
- Language choice persists (via `localStorage`) across page navigations.

If you add new static text: wrap it in `data-i18n="your_key"` and add
`your_key` to **both** the `en` and `ar` blocks of `UI_STRINGS`. If you add
new dynamic content in `mock.json`, add its translation to the matching
section of `DATA_TRANSLATIONS`, keyed by that item's `id`.

## Data (important)

- All pages currently read from `data/mock.json` via `assets/js/api.js`.
- Once the backend (Node.js — `index.js` at the project root) is ready, just
  change `assets/js/api.js`:
  ```js
  const USE_MOCK = false;
  const API_BASE = "http://localhost:3000/api"; // or the real server URL
  ```
  The backend must return the exact same **shape** as `mock.json` — otherwise
  you'll also need to update the render functions in `dashboard.js` /
  `taxi.js`.

## File structure

```
frontend/
├── login.php                → login gate (Government / Driver), 🌐 toggle
├── includes/
│   ├── sidebar.php           → shared sidebar (uses $activePage, i18n keys)
│   ├── navbar.php             → shared topbar (uses $pageTitleKey, 🌐 toggle)
│   └── footer.php              → closes HTML + shared JS includes
│
├── dashboard/
│   ├── index.php               → main dashboard
│   ├── monitoring.php           → detailed road map + alerts
│   ├── maintenance.php           → full maintenance priority list
│   ├── reports.php                → charts
│   ├── settings.php                → settings (placeholder)
│   └── components/
│       ├── cards.php                → KPI cards
│       ├── map.php                   → map + short priority list
│       ├── chart.php                  → the three charts
│       └── alerts.php                  → alerts list
│
├── taxi/
│   └── index.php               → driver interface (road status, report button, nearby alerts), 🌐 toggle
│
├── assets/
│   ├── css/
│   │   ├── variables.css       → colors/sizing (edit here to restyle)
│   │   ├── base.css             → reset + generic elements (dir-agnostic)
│   │   ├── layout.css            → sidebar/topbar/grid
│   │   ├── dashboard.css          → dashboard component styles
│   │   └── taxi.css                → driver interface styles
│   └── js/
│       ├── i18n.js               → 🌐 translation + RTL/LTR switcher (load first)
│       ├── api.js                 → data-fetching layer (mock now → API later)
│       ├── dashboard.js            → renders all dashboard components
│       └── taxi.js                  → driver interface logic
│
└── data/
    └── mock.json               → ⚠️ the contract agreed between Frontend and Backend
```

## Rules to follow before building the backend

1. Any backend endpoint must return exactly the same **shape** as
   `mock.json` (same field names, same data types) — that way switching from
   mock to a real API is a one-line change with no view-layer edits.
2. The map uses **Leaflet** (free, no API key) instead of Google Maps —
   simpler and faster for a hackathon.
3. Charts use **Chart.js**.
4. Every page supports PHP `include` — if you add a new page, copy the same
   structure from `dashboard/reports.php` (the simplest example).

## Live AI dashboard connection

1. Open a terminal in the project root.
2. Activate the Python virtual environment.
3. Run: `python ai/camera/camera_stream.py`
4. Keep Flask running on `http://127.0.0.1:5000`.
5. Open: `http://localhost/JSYP-ROYOSO/frontend/dashboard/index.php`

The dashboard now reads from `ai/camera/jrip_data.db`. Every accepted camera detection is inserted into SQLite, so the data remains after stopping the camera or restarting the computer. The page refreshes its cards, map, priority list, and charts every five seconds.
