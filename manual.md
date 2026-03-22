# Black Moon

**VS Code Extension: Instruction Manual**  
*God's in his heaven. All's right with the world.*

---

## Table of Contents

1. [Overview](#1-overview)
2. [Installation](#2-installation)
3. [The MAGI System Panel](#3-the-magi-system-panel)
4. [Angel Alert Notifications](#4-angel-alert-notifications)
5. [Status Bar](#5-status-bar)
6. [Settings](#6-settings)
7. [Commands](#7-commands)
8. [Theme Color Reference](#8-theme-color-reference)
9. [File Structure](#9-file-structure)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Overview

Black Moon transforms VS Code into the NERV Command Center from Neon Genesis Evangelion. Every file you open is a battle report. Every error is an Angel. Every save is a synchronization event.

The extension has three components that work together:

| Component | What it does |
|---|---|
| **NERV Dark Theme** | Full Evangelion color system across the entire editor: syntax, UI, terminal, git |
| **MAGI System Panel** | Live sidebar HUD showing errors, sync rate, MAGI units, and AT-Field status |
| **Status Bar** | Always-visible NERV readout at the bottom with live sync rate and pilot name |

---

## 2. Installation

### From the VSIX file

1. Open VS Code.
2. Go to the **Extensions panel** (`Ctrl+Shift+X` on Windows/Linux, `Cmd+Shift+X` on Mac).
3. Click the **···** menu at the top right of the Extensions panel.
4. Select **Install from VSIX...**
5. Navigate to `black-moon-1.0.0.vsix` and select it.
6. Click **Reload Now** when VS Code prompts you.

> The extension activates automatically on startup once installed. You will see `NERV COMMAND CENTER ONLINE` briefly in the status bar when VS Code loads.

### Applying the Theme

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open the Command Palette.
2. Type `Color Theme` and select **Preferences: Color Theme**.
3. Select **NERV Dark**.

The editor, sidebar, terminal, tabs, and status bar will all switch to the Evangelion palette immediately.

### Opening the MAGI Panel

There are three ways:

- Click the **hexagonal NERV icon** in the Activity Bar on the far left.
- Press `Ctrl+Shift+P` and run **Black Moon: Open Command Center**.
- Click **NERV** in the status bar at the bottom left.

---

## 3. The MAGI System Panel

The MAGI panel is the live HUD sidebar. It reads your actual workspace state and updates every 3 seconds.

### Boot Sequence

Every time the panel opens, a NERV boot screen plays: logo, tagline, progress bar, then fades into the live panel. This takes about 2.5 seconds.

### Operator

| Field | What it shows |
|---|---|
| Pilot name | Your name as configured in settings. Defaults to `IKARI`. |
| Mission | The name of your current VS Code workspace folder. |
| Active file | The file currently open in the editor. |

### Synchronization

A large percentage readout with an animated bar. Fluctuates between 97% and 99.9% to evoke Eva's pilot synchronization rate. Updates every 3 seconds.

### MAGI Supercomputer

Three independently pulsing capacity bars for **MELCHIOR-1**, **BALTHASAR-2**, and **CASPAR-3**, the three supercomputers that run NERV in the show. Values are randomized on each refresh and pulse at slightly different rates.

### Battle Status

This section reads from your actual workspace:

| Cell | Color | What it shows |
|---|---|---|
| **ANGELS** | Red | Total errors across all open files |
| **WARNINGS** | Amber | Total warnings across all open files |
| **SECTORS** | Cyan | Number of files currently open in the editor |

### AT-Field Status

Reacts dynamically to your error count:

| Errors | Integrity | Threat Level |
|---|---|---|
| 0 | 100% | `NOMINAL` (green) |
| 1–2 | 74% | `CAUTION` (amber) |
| 3–5 | 48% | `ELEVATED` (orange) |
| 6+ | 12% | `CRITICAL` (red) |

### Action Buttons

| Button | What it does |
|---|---|
| `VIEW ERRORS` | Opens VS Code's Problems panel with all errors and file locations |
| `ANGEL ALERT` | Manually fires a random Angel Alert notification |

### Clock

A live clock at the bottom of the panel showing the current time and sector label (`SECTOR 3-G`, named after Tokyo-3's location in the show). Updates every second.

---

## 4. Angel Alert Notifications

When your code has errors, Black Moon fires a notification in VS Code's notification system styled as a NERV emergency broadcast.

### Automatic Alerts

Triggers when VS Code's language server detects one or more errors in any open file. The notification shows:

- A random NERV alert message
- The filename and error count
- A **View Errors** button that opens the Problems panel
- A **Dismiss** button

> Alerts are throttled to once every 8 seconds to avoid spamming while you type. If errors come in rapidly, only the first one fires a notification.

### Alert Messages

The extension rotates through these randomly:

- `⚠ ANGEL DETECTED — PATTERN BLUE CONFIRMED`
- `⚠ AT-FIELD BREACH — SECTOR 7-G`
- `⚠ UNKNOWN ENTITY IN CODEBASE — SCRAMBLE UNITS`
- `⚠ SYNCHRONIZATION FAILURE — CHECK PILOT STATUS`
- `⚠ MAGI OVERRIDE REQUESTED — STAND BY`
- `⚠ THIRD IMPACT PROTOCOL — ERRORS DETECTED`

### Disabling Alerts

Add this to your `settings.json`:

```json
"nerv.enableAlerts": false
```

---

## 5. Status Bar

The status bar at the bottom of VS Code always shows three NERV items:

| Item | Position | Description |
|---|---|---|
| `🛡 NERV` | Bottom left | Click to open the MAGI System panel |
| `PILOT: IKARI` | Bottom left | Your pilot name from settings |
| `SYNC: 99.2%  ▪▪▪▪▪` | Bottom right | Live sync rate, updates every 3 seconds. Click to open panel. |

---

## 6. Settings

Open your `settings.json` (`Ctrl+Shift+P` → **Open User Settings JSON**) and add any of the following:

| Setting | Default | Description |
|---|---|---|
| `nerv.pilotName` | `"IKARI"` | Your pilot name shown in the status bar and MAGI panel |
| `nerv.enableAlerts` | `true` | Set to `false` to disable Angel Alert notifications |
| `nerv.magiUpdateInterval` | `3000` | Panel refresh rate in milliseconds |

Example:

```json
"nerv.pilotName": "AYANAMI",
"nerv.enableAlerts": true,
"nerv.magiUpdateInterval": 2000
```

---

## 7. Commands

All commands are available via `Ctrl+Shift+P` (`Cmd+Shift+P` on Mac):

| Command | What it does |
|---|---|
| `Black Moon: Open Command Center` | Opens and focuses the MAGI System panel |
| `Black Moon: Trigger Angel Alert` | Fires a random Angel Alert notification manually |
| `Black Moon: Toggle MAGI Status` | Alias for Open Command Center |

---

## 8. Theme Color Reference

### Core Palette

| Color | Hex | Used for |
|---|---|---|
| NERV Orange | `#FF6600` | Active tabs, cursor, line highlights, status bar, MAGI bars |
| Amber | `#FFAA00` | Strings, operator name, sync rate readout |
| Angel Red | `#FF2244` | Errors, diff deletions, critical AT-Field state |
| AT-Field Green | `#00FF88` | Success, diff additions, nominal status |
| Cyan | `#00CCFF` | Links, info items, open editor count |
| Near-Black | `#050508` | Editor background |
| Deep Black | `#030306` | Activity bar, title bar, tab strip |

### Syntax Highlighting

| Token | Color |
|---|---|
| Keywords (`if`, `const`, `return`) | `#FF3355` |
| Functions | `#FFAA00` |
| Strings | `#00DD77` |
| Numbers | `#FF8800` |
| Classes / Types | `#FFCC00` |
| Comments | `#2E2E48` (intentionally dim) |
| Variables | `#C0C0D8` |

---

## 9. File Structure

```
nerv-command-center/
├── package.json              ← Extension manifest, commands, settings, theme declaration
├── out/
│   └── extension.js          ← Main extension logic (status bar, alerts, panel provider)
├── media/
│   ├── panel.css             ← MAGI sidebar styling
│   └── panel.js              ← MAGI sidebar live update logic
├── themes/
│   └── nerv-dark.json        ← Full VS Code color theme
└── icons/
    ├── nerv-icon.svg         ← Activity bar icon
    └── icon16/48/128.png     ← Extension icons
```

### What to edit for common customizations

| What you want to change | File |
|---|---|
| Theme colors (editor, sidebar, terminal) | `themes/nerv-dark.json` |
| Syntax highlighting colors | `themes/nerv-dark.json` → `tokenColors` section |
| MAGI panel visual design | `media/panel.css` |
| MAGI panel data and logic | `media/panel.js` and `out/extension.js` |
| Alert messages | `out/extension.js` → `ANGEL_ALERTS` array |
| Status bar text format | `out/extension.js` → `getSyncRateText()` function |
| Extension name, commands, settings | `package.json` |

---

## 10. Troubleshooting

**MAGI panel is blank or not loading**  
Click the NERV icon in the activity bar to focus the panel. If still blank, run **Developer: Reload Window** from the Command Palette.

**Theme did not apply after installation**  
Go to **Preferences: Color Theme** and manually select **NERV Dark**.

**Angel Alerts are not firing on errors**  
Check that `nerv.enableAlerts` is not set to `false` in your settings. Also make sure a language extension is installed (e.g. the TypeScript or ESLint extension) that provides diagnostics. Black Moon reads from VS Code's diagnostic system, it doesn't generate errors itself.

**Status bar items are not visible**  
The extension may not have activated. Try running any Black Moon command from the Command Palette, or reload the window with **Developer: Reload Window**.

**Fonts look different from screenshots**  
The theme uses your system monospace font for the editor. The MAGI panel loads **Share Tech Mono** and **Orbitron** from Google Fonts, an internet connection is required on first load.

**VSIX install fails**  
Ensure you are on VS Code **1.85.0 or later**. The extension is not compatible with older versions.

---

*Black Moon · Special Agency NERV · v1.0.0*
