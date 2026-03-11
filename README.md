# FMOD Hotkeys

Please feel free to request new functionalities or suggest fixes to help me improve this project

## Current functionalities: 
- Create loop regions based on selection
- Create Magnet regions based on selection
- Create new event with timeline sheet (instead of having to click again to select the type of sheet)
- Refresh Modified Assets 
- Add single event or multiple events to bank(s)
- Quick Label Parameter Generator
- More to come!

![Screenshot](https://github.com/IntonationStudio/FmodHotkeys/blob/main/FmodHotKeyShowcase.png)

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


# FMOD-EventBank-Organisation-scripts
Scripts to organise events assignments to banks.
Add to the Scripts folder in the FMOD application or to your project folder (add folder called Scripts): 

There are two scripts: 
•	One for adding single events to a bank - use with the shortcut (or add your own) for it to be more effective than the right-click method. 
•	The second script allows for adding multiple event to a bank, create a new bank, remove and re-organise events.

To add your own shortcut, open the script in a text editor and look for: "keysequence:". 

How to use: 




