# AGENT.md — cc-event-manage-app

## Purpose
A Google Apps Script tool that automates event creation — spinning up related Google Sheets, Forms, and calendar entries, then registering them in a central database.

## Structure
```
cc-event-manage-app/
├── README.md
├── AGENT.md
├── .gitignore
└── src/
    ├── appsscript.json  ← GAS manifest
    ├── client/          ← HTML/CSS/JS frontend (event creation UI)
    └── server/          ← GAS server-side scripts (Sheets, Forms, Drive API calls)
```

## Key Facts
- **Platform:** Google Apps Script WebApp
- **Integrations:** Google Sheets, Google Forms, Google Drive, Google Calendar
- **Purpose:** Single-click event scaffolding — creates all associated resources automatically
- **Entry point:** `server/` contains the `doGet()` / `doPost()` functions

## Development Notes
- All source files live under `src/` — push with clasp from that directory
- No Node/npm at runtime; ES5-compatible GAS code only
