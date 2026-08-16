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

// Resolves the Event that owns the given timeline selection.
// This intentionally does NOT rely on studio.window.browserCurrent(),
// because that returns whatever is selected in the active browser tab
// (e.g. an audio asset when the Assets tab is focused), which used to
// disable these hotkeys unless the Events tab was active.
function FH_getSelectionEvent(selection) {
    // 1) Resolve from the selected timeline items themselves
    for (var i = 0; i < selection.length; i++) {
        var element = selection[i];
        if (!element) { continue; }

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

    // 2) Fallback: the browser's current item is an event (Events tab active)
    var browserItem = studio.window.browserCurrent();
    if (FH_isEvent(browserItem)) {
        return browserItem;
    }

    // 3) Fallback: whatever the editor currently has focused
    var editorItem = studio.window.editorCurrent();
    if (FH_isEvent(editorItem)) {
        return editorItem;
    }

    return null;
}

// Shared enable check: only offer these hotkeys when there is a valid
// timeline selection whose owning event can be resolved
function FH_hasTimelineSelection() {
    var selection = studio.window.editorSelection();
    return selection.length > 0 && FH_getSelectionEvent(selection) !== null;
}

//Function 1: Add Loop Region to all currently selected Event
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Add Loop Region to selections",
    keySequence: "Shift+L",
    isEnabled: function() { return FH_hasTimelineSelection(); },
    execute: function() {
        // Retrieve the current selections and resolve the event that owns them
        var selections = studio.window.editorSelection();
        var event = FH_getSelectionEvent(selections);
        if (!event) { return; }
        var timeLine = event.timeline;
        
        var track = studio.project.create("MarkerTrack");
        track.event = event;

        selections.forEach(function(element, index) {
            var loopRegion = studio.project.create("LoopRegion");
            loopRegion.name = "Loop Region " + (index + 1);
            loopRegion.position = element.start;
            loopRegion.length = element.length;
            loopRegion.selector = event;
            loopRegion.timeline = timeLine;
            loopRegion.markerTrack = track;
        });
    }
});

//Function 2: Add Magnet Region to all currently selected Event
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Add Magnet Region to selections",
    keySequence: "Shift+M",
    isEnabled: function() { return FH_hasTimelineSelection(); },
    execute: function() {
        // Retrieve the current selections and resolve the event that owns them
        var selections = studio.window.editorSelection();
        var event = FH_getSelectionEvent(selections);
        if (!event) { return; }
        var timeLine = event.timeline;
        
        var track = studio.project.create("MarkerTrack");
        track.event = event;

        selections.forEach(function(element, index) {
            var loopRegion = studio.project.create("LoopRegion");
            loopRegion.name = "Magnet Region " + (index + 1);
            loopRegion.position = element.start;
            loopRegion.length = element.length;
            loopRegion.looping = 2; // Magnet Region
            loopRegion.timeline = timeLine;
            loopRegion.markerTrack = track;
        });
    }
});

//Function 3: Add Transition Region to selections
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Add Transition Region to selections",
    keySequence: "Shift+T",
    isEnabled: function() { return FH_hasTimelineSelection(); },
    execute: function() {
        // Retrieve the current selections and resolve the event that owns them
        var selections = studio.window.editorSelection();
        var event = FH_getSelectionEvent(selections);
        if (!event) { return; }
        var timeLine = event.timeline;
        
        var track = studio.project.create("MarkerTrack");
        track.event = event;

        selections.forEach(function(element, index) {
            var TransitionRegion = studio.project.create("TransitionRegion");
            TransitionRegion.name = "Transition Region " + (index + 1);
            TransitionRegion.position = element.start;
            TransitionRegion.length = element.length;
            TransitionRegion.selector = event;
            TransitionRegion.timeline = timeLine;
            TransitionRegion.markerTrack = track;
        });
    }
});

//Function 4: Add Destination Region to selections
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Add Destination Region to selections",
    keySequence: "Shift+D",
    isEnabled: function() { return FH_hasTimelineSelection(); },
    execute: function() {
        // Retrieve the current selections and resolve the event that owns them
        var selections = studio.window.editorSelection();
        var event = FH_getSelectionEvent(selections);
        if (!event) { return; }
        var timeLine = event.timeline;
        
        var track = studio.project.create("MarkerTrack");
        track.event = event;

        selections.forEach(function(element, index) {
            var DestinationRegion = studio.project.create("LoopRegion");
            DestinationRegion.name = "Destination Region " + (index + 1);
            DestinationRegion.looping = 0; // non looping aka destination region
            DestinationRegion.position = element.start;
            DestinationRegion.length = element.length;
            DestinationRegion.selector = event;
            DestinationRegion.timeline = timeLine;
            DestinationRegion.markerTrack = track;
        });
    }
});

//Function 5: Add Destination Marker to selections
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Add Destination Marker to start of selections",
    keySequence: "Ctrl+Shift+D",
    isEnabled: function() { return FH_hasTimelineSelection(); },
    execute: function() {
        // Retrieve the current selections and resolve the event that owns them
        var selections = studio.window.editorSelection();
        var event = FH_getSelectionEvent(selections);
        if (!event) { return; }
        var timeLine = event.timeline;
        
        var track = studio.project.create("MarkerTrack");
        track.event = event;

        selections.forEach(function(element, index) {
            var DestinationMarker = studio.project.create("NamedMarker");
            DestinationMarker.name = "Destination Marker " + (index + 1);
            DestinationMarker.position = element.start;
            DestinationMarker.selector = event;
            DestinationMarker.timeline = timeLine;
            DestinationMarker.markerTrack = track;
        });
    }
});
