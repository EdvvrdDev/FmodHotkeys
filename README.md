# FMOD Hotkeys

Please feel free to request new functionalities or suggest fixes to help me improve this project

## Script organization
Each script file contains a single, self-contained functionality - no duplicate menu items, hotkeys or global variables across files. Copy only the files you want into your FMOD Scripts folder.

| File | Functionality | Hotkey |
| --- | --- | --- |
| FmodHotkeys_Regions.js | Create loop / magnet / transition / destination regions and destination markers based on selection | Shift+L, Shift+M, Shift+T, Shift+D, Ctrl+Shift+D |
| FmodHotkeys_NewEvents.js | Create new event with timeline sheet or action sheet (instead of having to click again to select the sheet type) | Ctrl+Alt+T, Ctrl+Alt+Shift+T |
| FmodHotkeys_ProjectActions.js | Refresh Modified Assets; Save and Build All | Shift+Alt+R, F8 |
| NOM_AddLabelledParam.js | Quick Label Parameter Generator (by [nightonmars](https://github.com/nightonmars/FMOD-Organisation-scripts)) | Shift+P |
| NOM_AddEventsToBank.js | Add multiple events to bank(s), create new bank, remove/re-organise events - defaults to the Master bank (by [nightonmars](https://github.com/nightonmars/FMOD-Organisation-scripts)) | Ctrl+Shift+B |
| NOM_AddSingleEventToBank.js | Add single event to a bank (by [nightonmars](https://github.com/nightonmars/FMOD-Organisation-scripts)) | Ctrl+B |
| ObjectIdentifier.js | Bonus dev tool: dumps info about selected objects to the console | Alt+I |

Scripts prefixed with `NOM_` are courtesy of https://github.com/nightonmars/FMOD-Organisation-scripts - credit and thanks to nightonmars!

- More to come!

## Instruction from FMOD documentation 
Script files are automatically evaluated every time you load a project. FMOD Studio reads scripts from any files with the .js extension in the following locations:

### System scripts directory:
- Windows: %localappdata%/FMOD Studio/Scripts
- Mac: ~/Library/Preferences/FMOD Studio/Scripts
- Linux: ~/.config/fmod-studio/Scripts

### Built-in scripts directory:
- Windows: %fmod_install_directory%/Scripts
- Mac: %fmod_bundle%/Scripts
- Linux: %fmod_install_directory%/Scripts

### Project scripts directory:
- %project_root_directory%/Scripts

After adding or altering a script in one of these directories, you can select "Scripts > Reload" to use the newly updated script.


## Bonus script:
I also made an identifier script to help me understand Fmod better so I can add more functionalities. All the info is dumped into the console window





