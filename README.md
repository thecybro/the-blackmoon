# Black Moon

> *God's in his heaven. All's right with the world.*

**Black Moon** transforms VS Code into the NERV Command Center from Neon Genesis Evangelion. Every file is a battle report. Every error is an Angel. Every keystroke is a synchronization event.

![Version](https://img.shields.io/badge/version-1.0.0-ff6600?style=flat-square) ![VS Code](https://img.shields.io/badge/VS%20Code-1.85+-050508?style=flat-square&logo=visualstudiocode) ![License](https://img.shields.io/badge/license-MIT-ff6600?style=flat-square)

---

## What's inside

### NERV Dark Theme
A full Evangelion color system built from scratch: editor, activity bar, sidebar, terminal, diff viewer, git decorations, debug console, and every other VS Code surface. Orange burns on near-black. Strings glow green. Errors bleed red. Semantic token highlighting fully supported.

### MAGI Supercomputer Panel
A live sidebar HUD modeled after NERV's MAGI supercomputer. Reads your actual workspace in real time:

- **Synchronization rate:** Live animated meter
- **MELCHIOR · BALTHASAR · CASPAR:** Three independently pulsing capacity bars
- **Battle Status:** Your real error and warning counts, labeled ANGELS / WARNINGS / SECTORS
- **AT-Field integrity:** Degrades from 100% to CRITICAL as errors accumulate
- **Live clock:** Sector time readout, updates every second

### Angel Alert Notifications
When your code throws errors, NERV fires a rotating alert: *"⚠ AT-FIELD BREACH — SECTOR 7-G [main.ts: 3 errors]"*  with a direct shortcut to the Problems panel. Throttled so it never spams.

### Status Bar Integration
`🛡 NERV` and your pilot name on the left. A live fluctuating sync rate on the right. Everything clickable to open the MAGI panel.

### Boot Sequence
Opening the MAGI panel plays a full boot animation: NERV logo, tagline, progress bar, then fades into the live HUD.

---

## Installation

**From VSIX:**
1. Open VS Code
2. `Extensions` → `···` → **Install from VSIX...**
3. Select `black-moon-1.0.0.vsix`
4. Reload when prompted

**Apply the theme:**
`Ctrl+Shift+P` → `Color Theme` → **NERV Dark**

**Open the panel:**
Click the hexagonal icon in the activity bar, or run `Black Moon: Open Command Center` from the Command Palette.

> For detailed usage, settings, and troubleshooting — see the [Instruction Manual](MANUAL.md).


---

## Configuration

```json
{
  "nerv.pilotName": "IKARI",
  "nerv.enableAlerts": true,
  "nerv.magiUpdateInterval": 3000
}
```

| Setting | Default | Description |
|---|---|---|
| `nerv.pilotName` | `"IKARI"` | Your pilot designation shown in the status bar and panel |
| `nerv.enableAlerts` | `true` | Angel Alert notifications on diagnostic errors |
| `nerv.magiUpdateInterval` | `3000` | MAGI panel refresh rate in milliseconds |

---

## Commands

| Command | Description |
|---|---|
| `Black Moon: Open Command Center` | Focus the MAGI panel |
| `Black Moon: Trigger Angel Alert` | Fire a manual Angel Alert |
| `Black Moon: Toggle MAGI Status` | Toggle the MAGI panel |

---

## Color Palette

| | Hex | Role |
|---|---|---|
| ![#FF6600](https://placehold.co/12x12/FF6600/FF6600.png) | `#FF6600` | Primary — cursor, active tabs, MAGI bars |
| ![#FFAA00](https://placehold.co/12x12/FFAA00/FFAA00.png) | `#FFAA00` | Amber — strings, sync rate |
| ![#FF2244](https://placehold.co/12x12/FF2244/FF2244.png) | `#FF2244` | Angel Red — errors, deletions |
| ![#00FF88](https://placehold.co/12x12/00FF88/00FF88.png) | `#00FF88` | AT-Field Green — success, additions |
| ![#00CCFF](https://placehold.co/12x12/00CCFF/00CCFF.png) | `#00CCFF` | Cyan — links, info |
| ![#050508](https://placehold.co/12x12/050508/050508.png) | `#050508` | Near-Black — editor background |

---

## The lore

The **Black Moon** is the massive ancient vessel buried beneath Tokyo-3 that NERV headquarters is built inside, the hidden foundation of everything. The MAGI are the three supercomputers (each containing a fragment of their creator's soul) that make every critical decision NERV faces.

Your editor is now built on the same foundation.

---

*Special Agency NERV: Tokyo-3*

