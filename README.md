# FMOD Hotkeys

Please feel free to request new functionalities or suggest fixes to help me improve this project

## Script organization

Each script file contains a single, self-contained functionality - no duplicate menu items, hotkeys or global variables across files. Copy only the files you want into your FMOD Scripts folder.

See **[FEATURES.md](FEATURES.md)** for the full hotkey list.

## Installing

Double-click **Install-FmodHotkeys.bat** (Windows) to copy every `.js` script into `%LOCALAPPDATA%\FMOD Studio\Scripts`, which loads them for **all** projects. Run it again after any script edit, then "Scripts > Reload" in FMOD Studio. To uninstall, delete the scripts from that folder.

Scripts prefixed with `NOM_` are courtesy of <https://github.com/nightonmars/FMOD-Organisation-scripts> - credit and thanks to nightonmars!

## Highlighted scripts

- **FmodHotkeys_BatchEditTransitions.js** — `Shift + X` opens a dialog to batch edit transition markers/regions: re-target them to a destination (auto-named after it), add parameter conditions (float ranges or label names), switch AND/OR trigger logic, and clear all conditions in one click.

- More to come!

## Instruction from FMOD documentation

Script files are automatically evaluated every time you load a project. FMOD Studio reads scripts from any files with the .js extension in the following locations:

### System scripts directory

- Windows: %localappdata%/FMOD Studio/Scripts
- Mac: ~/Library/Preferences/FMOD Studio/Scripts
- Linux: ~/.config/fmod-studio/Scripts

### Built-in scripts directory

- Windows: %fmod_install_directory%/Scripts
- Mac: %fmod_bundle%/Scripts
- Linux: %fmod_install_directory%/Scripts

### Project scripts directory

- %project_root_directory%/Scripts

After adding or altering a script in one of these directories, you can select "Scripts > Reload" to use the newly updated script.

## Bonus script

I also made an identifier script to help me understand Fmod better so I can add more functionalities. All the info is dumped into the console window
