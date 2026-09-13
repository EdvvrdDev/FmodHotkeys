# FMOD Hotkeys

Please feel free to request new functionalities or suggest fixes to help me improve this project

## Script organization

Each script file contains a single, self-contained functionality - no duplicate menu items, hotkeys or global variables across files. Copy only the files you want into your FMOD Scripts folder.

See **[FEATURES.md](FEATURES.md)** for the full hotkey list.

## Installing

Double-click **Install-FmodHotkeys.bat** (Windows) to copy every `.js` script into `%LOCALAPPDATA%\FMOD Studio\Scripts`, which loads them for **all** projects. Run it again after any script edit, then "Scripts > Reload" in FMOD Studio. To uninstall, delete the scripts from that folder.

Scripts prefixed with `NOM_` are courtesy of <https://github.com/nightonmars/FMOD-Organisation-scripts> - credit and thanks to nightonmars!

## Highlighted scripts

- **FmodHotkeys_BatchEditTransitions.js** — `Shift + X` opens a dialog to batch edit transition markers/regions: re-target them to a destination (auto-named after it), add parameter conditions (float ranges or label names), switch AND/OR trigger logic, and clear all conditions in one click. `X` tweaks existing condition min/max values directly, one field pair per trigger condition.

- More to come!

## Bonus script

I also made an identifier script to help me understand Fmod better so I can add more functionalities. All the info is dumped into the console window

Advanced users can skip the installer entirely - FMOD's own documentation explains how the script directories work if you'd rather wire things up yourself.
