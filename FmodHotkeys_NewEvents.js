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

//Function 2: Add new action sheet event with a multi instrument ready to go
//Action sheet recipe from FMOD support: https://qa.fmod.com/t/creating-a-multi-instrument-in-an-action/20588
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Add new action sheet event with a multi instrument",
    keySequence: "Ctrl+Alt+Shift+T",
    execute: function() {
        var event = studio.project.create("Event");
        event.name = "New Action Event";

        // Events created via the scripting API get a timeline sheet by
        // default (unlike in the GUI) - disable it for a pure action event
        event.timeline.isProxyEnabled = false;

        // Parent the action sheet to the event FIRST - otherwise the
        // instrument link below is dropped when the sheet gets re-parented
        var actionSheet = studio.project.create("ActionSheet");
        event.relationships.parameters.add(actionSheet);

        // Link a multi instrument into the sheet. 'modules' is a to-many
        // relationship, so assign it via the relationship API; direct
        // assignment (actionSheet.modules = sound) silently gets lost.
        var sound = studio.project.create("MultiSound");
        var linked = false;
        try {
            actionSheet.relationships.modules.add(sound);
            linked = actionSheet.modules && actionSheet.modules.length > 0;
        } catch (e) { linked = false; }
        if (!linked) {
            actionSheet.modules = sound;
        }

        // Route the instrument through the event's master track
        if (event.masterTrack) {
            sound.audioTrack = event.masterTrack;
        }
    }
});
