@echo off
rem Installs all FMOD Hotkeys scripts for ALL projects by copying them
rem into FMOD Studio's user scripts directory. Run again after edits.

set "DEST=%LOCALAPPDATA%\FMOD Studio\Scripts"

if not exist "%DEST%" (
    echo Creating "%DEST%"
    mkdir "%DEST%"
)

echo Copying scripts to "%DEST%"
rem Clean first so renamed/removed scripts don't linger and keep
rem registering old hotkeys (e.g. duplicate Alt+C bindings)
del /Q "%DEST%\*.js"
copy /Y "%~dp0*.js" "%DEST%"

echo.
echo Done. Restart FMOD Studio or run "Scripts ^> Reload" to pick them up.
pause
