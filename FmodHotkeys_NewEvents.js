/* -------------------------------------------
   FMOD Hotkeys - New Events
   Create new events with a specific sheet type ready to go
   (instead of having to click again to select the sheet type).
   ------------------------------------------- */

//Function 1: Add new event with a timeline sheet
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Add new event with a timeline sheet",
    keySequence: "Ctrl+Alt+T",
    execute: function() {
        var event = studio.project.create("Event");
        event.name = "New Timeline Event";
        event.addGroupTrack("Audio Track");
    }
});

//Function 2: Add new action sheet event
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Add new action sheet event",
    keySequence: "Ctrl+Alt+Shift+T",
    execute: function() {
        var event = studio.project.create("Event");
        event.name = "New Action Event";

        // Events created via the scripting API get a timeline sheet by
        // default (unlike in the GUI) - disable it for a pure action event.
        // Guarded: some FMOD versions may not support isProxyEnabled.
        try {
            if (event.timeline) {
                event.timeline.isProxyEnabled = false;
            }
        } catch (e) {
            console.warn("FMOD Hotkeys: could not disable timeline sheet: " + e);
        }

        // Add an action sheet to the event
        var actionSheet = studio.project.create("ActionSheet");
        event.relationships.parameters.add(actionSheet);

        // An action sheet is implemented as a multi instrument internally:
        // it is INVALID while its root instrument (actionSheet.modules) is
        // empty - FMOD flags the event as malformed on save. The GUI creates
        // this root automatically; the API does not, so assign one. The root
        // is not a visible instrument box, the sheet still looks empty.
        var root = studio.project.create("MultiSound");
        actionSheet.modules = root;
        if (event.masterTrack) {
            root.audioTrack = event.masterTrack;
        }
        if (!actionSheet.modules) {
            console.error("FMOD Hotkeys: action sheet root did not attach - the event will be flagged as malformed");
        }
    }
});
