/* -------------------------------------------
   FMOD Hotkeys - Regions & Markers
   Add loop / magnet / transition / destination regions
   and destination markers based on the current editor selection.
   ------------------------------------------- */

// Checks whether an object is an Event (guarded - selection
// elements may be plain structs without ManagedObject methods)
function FH_isEvent(obj) {
    return !!(obj && obj.isOfExactType && obj.isOfExactType("Event"));
}

// Resolves the Event that owns the given timeline selection, without
// depending on which browser tab is focused.
function FH_getSelectionEvent(selection) {
    // 1) Resolve from the selected timeline items themselves
    for (var i = 0; i < selection.length; i++) {
        var element = selection[i];
        if (!element) {
            continue;
        }

        // The selection itself is an event
        if (FH_isEvent(element)) {
            return element;
        }
        // Owner first, via what the element sits on. For nested event
        // instruments (EventSound etc.) .event is the REFERENCED event,
        // not the owner - so it must be checked last.
        // Regions and markers know their timeline, which knows its event
        if (element.timeline && FH_isEvent(element.timeline.event)) {
            return element.timeline.event;
        }
        // Or their marker / track, which belongs to the event
        if (element.markerTrack && FH_isEvent(element.markerTrack.event)) {
            return element.markerTrack.event;
        }
        if (element.track && FH_isEvent(element.track.event)) {
            return element.track.event;
        }
        // EventSound-style instruments sit on an audioTrack (GroupTrack)
        if (element.audioTrack) {
            if (FH_isEvent(element.audioTrack.event)) {
                return element.audioTrack.event;
            }
            if (
                element.audioTrack.timeline &&
                FH_isEvent(element.audioTrack.timeline.event)
            ) {
                return element.audioTrack.timeline.event;
            }
        }
        // Last resort before .event: a timeline exposed as the parameter
        if (element.parameter && FH_isEvent(element.parameter.event)) {
            return element.parameter.event;
        }
        // Ambiguous - owner for plain instruments, the referenced event
        // for nested event instruments
        if (FH_isEvent(element.event)) {
            return element.event;
        }
    }

    // 2) Fallback: the event selected in the "Events" browser tab -
    //    works even when another browser tab (e.g. Assets) is focused
    try {
        var eventsTabItem = studio.window.browserCurrent("Events");
        if (FH_isEvent(eventsTabItem)) {
            return eventsTabItem;
        }
    } catch (e) {
        // tabName parameter not supported in this FMOD version
        console.error(
            "FH: browserCurrent('Events') fallback unavailable: " + e.message,
        );
        return null;
    }
    return null;
}

// Shared enable check: only offer these hotkeys when there is a valid
// timeline selection whose owning event can be resolved
function FH_hasTimelineSelection() {
    var selection = studio.window.editorSelection();
    return selection.length > 0 && FH_getSelectionEvent(selection) !== null;
}

// Normalizes any selected timeline element to a {start, length} span.
// Instruments expose start/length; markers and existing regions expose
// position(/length). Elements with neither (tracks, automation points)
// return null and are skipped.
function FH_elementSpan(element) {
    if (!element) {
        return null;
    }
    var start = null;
    if (typeof element.start === "number") {
        start = element.start;
    } else if (typeof element.position === "number") {
        start = element.position;
    }
    if (start === null) {
        return null;
    }
    return {
        start: start,
        length: typeof element.length === "number" ? element.length : 0,
    };
}

// Shared by all region/marker hotkeys: one MarkerTrack per run, one item
// per positionable selected timeline element (instruments, markers,
// regions). Other selection types are skipped. propsFn(event) returns
// extra properties (e.g. { selector: event, looping: 2 }). NamedMarkers
// have no length property, so setting length is skipped for them
// automatically.
function FH_addTimelineItems(entityName, namePrefix, propsFn) {
    var selections = studio.window.editorSelection();
    var event = FH_getSelectionEvent(selections);
    console.log(
        "FH debug: " +
            selections.length +
            " element(s); event=" +
            (event ? event.name : "null"),
    );
    if (!event) {
        return;
    }

    var track = studio.project.create("MarkerTrack");
    track.event = event;

    var created = 0;
    selections.forEach((element) => {
        var span = FH_elementSpan(element);
        console.log(
            "FH debug: " +
                (element && element.entity ? element.entity.name : "?") +
                " -> " +
                (span ? span.start + " +" + span.length : "skipped"),
        );
        if (!span) {
            return;
        }
        var item = studio.project.create(entityName);
        created++;
        item.name = namePrefix + " " + created;
        item.position = span.start;
        if (item.length !== undefined && span.length > 0) {
            item.length = span.length;
        }
        item.timeline = event.timeline;
        item.markerTrack = track;
        if (propsFn) {
            var props = propsFn(event);
            for (var key in props) {
                item[key] = props[key];
            }
        }
    });
    console.log("FH debug: created " + created + " item(s)");
}

//Function 1: Add Loop Region to all currently selected Event
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Add Loop Region to selections",
    keySequence: "Shift+L",
    isEnabled: () => FH_hasTimelineSelection(),
    execute: () => {
        FH_addTimelineItems("LoopRegion", "Loop Region", (event) => ({
            selector: event,
        }));
    },
});

//Function 2: Add Magnet Region to all currently selected Event
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Add Magnet Region to selections",
    keySequence: "Shift+M",
    isEnabled: () => FH_hasTimelineSelection(),
    execute: () => {
        FH_addTimelineItems("LoopRegion", "Magnet Region", () => {
            return { looping: 2 }; // Magnet Region
        });
    },
});

//Function 3: Add Transition Region to selections
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Add Transition Region to selections",
    keySequence: "Shift+T",
    isEnabled: () => FH_hasTimelineSelection(),
    execute: () => {
        FH_addTimelineItems(
            "TransitionRegion",
            "Transition Region",
            (event) => ({ selector: event }),
        );
    },
});

//Function 4: Add Destination Region to selections
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Add Destination Region to selections",
    keySequence: "Shift+D",
    isEnabled: () => FH_hasTimelineSelection(),
    execute: () => {
        FH_addTimelineItems("LoopRegion", "Destination Region", (event) => {
            return { looping: 0, selector: event }; // non looping aka destination region
        });
    },
});

//Function 5: Add Destination Marker to selections
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Add Destination Marker to start of selections",
    keySequence: "Ctrl+Shift+D",
    isEnabled: () => FH_hasTimelineSelection(),
    execute: () => {
        FH_addTimelineItems("NamedMarker", "Destination Marker", (event) => ({
            selector: event,
        }));
    },
});
