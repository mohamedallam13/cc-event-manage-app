# CC Event Manager

A Google Apps Script tool that automates event creation end-to-end — spinning up the associated Google Sheet, Google Form, and calendar entry in one action, then registering everything in a central database.

![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=flat&logo=google&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-WebApp-blue)

---

## Overview

Managing community events requires creating multiple Google Workspace resources per event — a dedicated sheet for registrations, a form for sign-ups, and a calendar entry. This tool automates all of that from a single form submission, and records the event in a master database for ongoing tracking.

---

## Features

- Single-action event scaffolding: creates Sheet, Form, and Calendar entry automatically
- Registers the new event in a master database (Google Sheets)
- Admin UI for entering event details and triggering creation
- Client/server split architecture

---

## Tech Stack

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Platform      | Google Apps Script                  |
| UI            | HTML5, CSS3, Vanilla JavaScript     |
| Integrations  | Google Sheets, Forms, Drive, Calendar |
| Deploy        | clasp CLI                           |

---

## Project Structure

```
cc-event-manage-app/
├── README.md
├── AGENT.md
├── .gitignore
└── src/
    ├── appsscript.json  # GAS manifest (Sheets, Forms, Calendar scopes)
    ├── client/          # Event creation form UI
    └── server/          # doGet(), Sheets/Forms/Drive/Calendar API calls
```

---

## Getting Started

### Prerequisites

- A Google account with Google Apps Script access
- [clasp](https://github.com/google/clasp) installed globally

```bash
npm install -g @google/clasp
clasp login
```

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mohamedallam13/cc-event-manage-app.git
   cd cc-event-manage-app
   ```

2. Link to your Apps Script project:
   ```bash
   clasp create --type webapp --title "CC Event Manager" --rootDir src
   ```

3. Push source files:
   ```bash
   clasp push
   ```

---

## Deployment

1. In the Apps Script editor, go to **Deploy > New deployment**
2. Select type: **Web app**
3. Set access to admin users only
4. Click **Deploy** and share the Web App URL with event organisers

---

## Author

**Mohamed Allam** — [GitHub](https://github.com/mohamedallam13) · [Email](mailto:mohamedallam.tu@gmail.com)
