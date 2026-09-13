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
        // Markers / regions / instruments referencing their owning event
        if (FH_isEvent(element.event)) {
            return element.event;
        }
        // Regions and markers know their timeline, which knows its event
        if (element.timeline && FH_isEvent(element.timeline.event)) {
            return element.timeline.event;
        }
        // Or their marker / group track, which belongs to the event
        if (element.markerTrack && FH_isEvent(element.markerTrack.event)) {
            return element.markerTrack.event;
        }
        if (element.track && FH_isEvent(element.track.event)) {
            return element.track.event;
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
        /* tabName parameter not supported - no fallback */ return null;
    }
    return null;
}

// Shared enable check: only offer these hotkeys when there is a valid
// timeline selection whose owning event can be resolved
function FH_hasTimelineSelection() {
    var selection = studio.window.editorSelection();
    return selection.length > 0 && FH_getSelectionEvent(selection) !== null;
}

// Shared by all region/marker hotkeys: one MarkerTrack per run, one item
// per selected timeline element. propsFn(event) returns extra properties
// (e.g. { selector: event, looping: 2 }). NamedMarkers have no length
// property, so setting length is skipped for them automatically.
function FH_addTimelineItems(entityName, namePrefix, propsFn) {
    var selections = studio.window.editorSelection();
    var event = FH_getSelectionEvent(selections);
    if (!event) {
        return;
    }

    var track = studio.project.create("MarkerTrack");
    track.event = event;

    selections.forEach((element, index) => {
        var item = studio.project.create(entityName);
        item.name = namePrefix + " " + (index + 1);
        item.position = element.start;
        if (item.length !== undefined) {
            item.length = element.length;
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
