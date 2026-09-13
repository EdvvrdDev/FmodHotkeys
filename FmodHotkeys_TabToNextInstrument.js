/* -------------------------------------------
   FMOD Hotkeys - Tab Instrument Navigation (DEBUG/TEST)
   Pro Tools style timeline navigation:
   - Tab: cursor to the start of the next instrument
   - Shift+Tab: cursor to the end of the previous instrument
   (Plain Tab is safe - no tab-based navigation exists in
   FMOD Studio to collide with.)
   ------------------------------------------- */

// Returns the event selected in the "Events" browser tab, regardless of
// which browser tab is currently focused (Events/Assets/...), so this
// hotkey works from any tab. Returns null when no event is selected
// in the Events tab.
function FH_getEventsTabEvent() {
    try {
        var event = studio.window.browserCurrent("Events");
        return event && event.isOfExactType("Event") ? event : null;
    } catch {
        return null;
    }
}

// Moves the timeline cursor: backwards = snap to the end of the previous
// instrument, forwards = snap to the start of the next one. Instruments
// without a usable length contribute their start only (no snap end).
function FH_snapCursor(event, backwards) {
    try {
        var starts = [];
        var ends = [];
        (event.groupTracks || []).forEach((track) => {
            (track.modules || []).forEach((module) => {
                starts.push(module.start);
                if (typeof module.length === "number" && module.length > 0) {
                    ends.push(module.start + module.length);
                }
            });
        });
        console.log(
            "[TabNext] Instrument starts: " +
                (starts.length ? starts.join(", ") : "(none)"),
        );

        var cursor = event.getCursorPosition(event.timeline);
        console.log("[TabNext] Cursor at: " + cursor);

        // Epsilon so that sitting exactly on a snap point moves to the
        // next/previous one instead of staying in place.
        var EPSILON = 0.0001;
        var target = null;
        if (backwards) {
            ends.forEach((end) => {
                if (
                    end < cursor - EPSILON &&
                    (target === null || end > target)
                ) {
                    target = end;
                }
            });
        } else {
            starts.forEach((start) => {
                if (
                    start > cursor + EPSILON &&
                    (target === null || start < target)
                ) {
                    target = start;
                }
            });
        }

        if (target === null) {
            console.log(
                backwards
                    ? "[TabNext] No instrument end before the cursor - staying put."
                    : "[TabNext] No instrument after the cursor - staying put.",
            );
            return;
        }

        event.setCursorPosition(event.timeline, target);
        console.log("[TabNext] Cursor moved to: " + target);
    } catch (e) {
        console.error("[TabNext] Failed: " + e);
    }
}

studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Move Cursor to Next Instrument",
    keySequence: "Tab",
    isEnabled: () => FH_getEventsTabEvent() !== null,
    execute: () => {
        var event = FH_getEventsTabEvent();
        if (event) {
            FH_snapCursor(event, false);
        } else {
            console.warn("[TabNext] No event found in the Events tab.");
        }
    },
});

studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Move Cursor to Previous Instrument End",
    keySequence: "Shift+Tab",
    isEnabled: () => FH_getEventsTabEvent() !== null,
    execute: () => {
        var event = FH_getEventsTabEvent();
        if (event) {
            FH_snapCursor(event, true);
        } else {
            console.warn("[TabNext] No event found in the Events tab.");
        }
    },
});
