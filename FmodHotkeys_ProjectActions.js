/* -------------------------------------------
   FMOD Hotkeys - Project Actions
   Refresh modified assets, and save + build with one key.
   ------------------------------------------- */

//Function 1: Refresh Modified Assets
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Refresh Modified Assets",
    keySequence: "Shift+Alt+R",
    execute: function() {
        studio.window.triggerAction("RefreshModifiedAssets");
        alert("Assets refreshed!")
    }
});

//Function 2: Save and then build for all platforms with a single button
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Save and Build All",
    keySequence: "F8",
    execute: function () {
        // Save the project
        studio.project.save()
        // Build for all platforms
        studio.project.build()
        alert("Saved and Built for all platforms!");
    }
});
