/* -------------------------------------------
   FMOD Hotkeys - Tab to Next Instrument (DEBUG/TEST)
   Pro Tools style navigation: moves the timeline cursor
   ("playhead") to the start of the next instrument on the
   timeline of the current event.

   NOTE: bound to Tab for now - if FMOD/Qt swallows Tab for
   focus navigation, we may need to rebind (e.g. Ctrl+Right).
   ------------------------------------------- */

// Returns the event selected in the "Events" browser tab, regardless of
// which browser tab is currently focused (Events/Assets/...), so this
// hotkey works from any tab.
function FH_getEventsTabEvent() {
    try {
        var event = studio.window.browserCurrent("Events");
        if (event && event.isOfExactType("Event")) {
            return event;
        }
        console.log("[TabNext] Events tab lookup returned no event - falling back to active tab");
    } catch (e) {
        console.warn("[TabNext] browserCurrent(\"Events\") failed: " + e + " - falling back to active tab");
    }
    // Fallback: whatever the active browser tab has selected
    var current = studio.window.browserCurrent();
    if (current && current.isOfExactType("Event")) {
        return current;
    }
    return null;
}

studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Move Cursor to Next Instrument",
    keySequence: "Tab",
    isEnabled: function() {
        return FH_getEventsTabEvent() !== null;
    },
    execute: function() {
        try {
            var event = FH_getEventsTabEvent();
            if (!event) {
                console.warn("[TabNext] No event found (tried Events tab and active tab).");
                return;
            }

            // Collect the start times of all instruments on all tracks
            var starts = [];
            (event.groupTracks || []).forEach(function(track) {
                (track.modules || []).forEach(function(module) {
                    starts.push(module.start);
                });
            });
            console.log("[TabNext] Instrument starts: " + (starts.length ? starts.join(", ") : "(none)"));

            if (starts.length === 0) {
                console.warn("[TabNext] Event '" + event.name + "' has no instruments.");
                return;
            }

            // Current cursor position on the timeline (seconds)
            var cursor = event.getCursorPosition(event.timeline);
            console.log("[TabNext] Cursor at: " + cursor);

            // Find the closest start AFTER the cursor. Small epsilon so that
            // when the cursor sits exactly on an instrument start, Tab moves
            // on to the following one instead of staying in place.
            var EPSILON = 0.0001;
            var next = null;
            starts.forEach(function(start) {
                if (start > cursor + EPSILON && (next === null || start < next)) {
                    next = start;
                }
            });

            if (next === null) {
                console.log("[TabNext] No instrument after the cursor - staying put.");
                return;
            }

            event.setCursorPosition(event.timeline, next);
            console.log("[TabNext] Cursor moved to: " + next);
        } catch (e) {
            console.error("[TabNext] Failed: " + e);
        }
    }
});
