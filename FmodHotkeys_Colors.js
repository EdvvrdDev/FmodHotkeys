/* -------------------------------------------
   FMOD Hotkeys - Assign Contrasting Colors
   Assigns a different color to every selected
   item that can be colored (folders, events,
   tracks, instruments, ...).
   Colors cycle through a contrasting palette,
   so adjacent selections never share a color.

   Select items in any browser or on the
   timeline and press Alt+C.
   ------------------------------------------- */

// Only names verified against FMOD's own example scripts
const FHC_palette = ["Red", "Blue", "Yellow", "Cyan", "Magenta", "Green"];

// The object a color actually applies to. GroupTracks aren't colorable
// themselves - their mixer group is (same as FMOD's RandomizeColors example)
function FHC_colorTarget(item) {
    if (item && item.mixerGroup && item.mixerGroup.color !== undefined) {
        return item.mixerGroup;
    }
    return item;
}

// Colors every selected object that has a color property; returns the count
function FHC_assignContrastingColors(items) {
    const seen = {};
    let colored = 0;
    items.forEach((item) => {
        // Objects without a color property read as undefined here;
        // colorable ones accept the string names FMOD's UI uses
        const target = FHC_colorTarget(item);
        if (target && target.color !== undefined && !seen[target.id]) {
            seen[target.id] = true;
            target.color = FHC_palette[colored % FHC_palette.length];
            colored++;
        }
    });
    return colored;
}

studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Assign Contrasting Colors",
    keySequence: "Alt+C",
    isEnabled: () =>
        studio.window.browserSelection().length > 0 ||
        studio.window.editorSelection().length > 0,
    execute: () => {
        // Timeline selections win over the browser: the open event is always
        // auto-selected in the browser, so it would hijack the run otherwise
        const editor = studio.window.editorSelection();
        const hasColorableEditor = editor.some((item) => {
            const target = FHC_colorTarget(item);
            return target && target.color !== undefined;
        });
        const colored = FHC_assignContrastingColors(
            hasColorableEditor ? editor : studio.window.browserSelection(),
        );
        if (colored === 0) {
            studio.system.message(
                "None of the selected items can be assigned a color.",
            );
            return;
        }
        studio.system.message(`Colored ${colored} item(s).`);
    },
});
