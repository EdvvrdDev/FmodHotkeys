/* -------------------------------------------
   FMOD Hotkeys - Batch Edit Transitions
   Re-target / add conditions to / change the condition mode of
   multiple transition markers & regions from one dialog.
   Transitions are auto-named after their destination.

   Select the transitions on the timeline (or anything
   inside an event that owns transitions) and press Shift+X.
   ------------------------------------------- */

function FHB_isEvent(obj) {
    return !!(obj && obj.isOfExactType && obj.isOfExactType("Event"));
}

// Transitions come in two flavours: TransitionMarker and TransitionRegion
function FHB_isTransition(obj) {
    return !!(
        obj &&
        obj.isOfExactType &&
        (obj.isOfExactType("TransitionRegion") ||
            obj.isOfExactType("TransitionMarker"))
    );
}

// Resolves the Event that owns the given timeline selection, without
// depending on which browser tab is focused (same logic as Regions script)
function FHB_getSelectionEvent(selection) {
    for (const element of selection) {
        if (!element) {
            continue;
        }
        if (FHB_isEvent(element)) {
            return element;
        }
        if (FHB_isEvent(element.event)) {
            return element.event;
        }
        if (element.timeline && FHB_isEvent(element.timeline.event)) {
            return element.timeline.event;
        }
        if (element.markerTrack && FHB_isEvent(element.markerTrack.event)) {
            return element.markerTrack.event;
        }
        if (element.track && FHB_isEvent(element.track.event)) {
            return element.track.event;
        }
    }
    return null;
}

// Collects transitions: those selected on the timeline,
// otherwise every transition marker/region of the owning event
function FHB_getTransitions(selection) {
    const transitions = [];
    for (const element of selection) {
        if (FHB_isTransition(element)) {
            transitions.push(element);
        }
    }
    if (transitions.length > 0) {
        return transitions;
    }

    const event = FHB_getSelectionEvent(selection);
    if (!event) {
        return [];
    }
    for (const track of event.markerTracks) {
        for (const marker of track.markers) {
            if (FHB_isTransition(marker)) {
                transitions.push(marker);
            }
        }
    }
    return transitions;
}

// Finds a destination (marker or region) by exact name on the event's marker tracks
function FHB_findDestination(event, name) {
    for (const track of event.markerTracks) {
        for (const marker of track.markers) {
            if (marker.name === name) {
                return marker;
            }
        }
    }
    return null;
}

// Collects every parameter in the project: global presets and event-local
// game parameters, via the documented Entity.findInstances API
function FHB_collectParameters() {
    const found = {};
    ["ParameterPreset", "GameParameter"].forEach((entityName) => {
        studio.project.model[entityName].findInstances().forEach((p) => {
            if (p && p.isValid && !found[p.id]) {
                found[p.id] = p;
            }
        });
    });
    return Object.keys(found)
        .map((k) => found[k])
        .sort((a, b) =>
            FHB_parameterLabel(a).localeCompare(FHB_parameterLabel(b)),
        );
}

// Display label: full path where available (ParameterPreset), else name
function FHB_parameterLabel(p) {
    if (typeof p.getPath === "function") {
        return p.getPath();
    }
    return p.name || p.id;
}

// Display a value without float round-trip noise (0.30000000000000004 -> 0.3).
// Rounding to 6 decimals is cosmetic only - stored values keep full precision.
function FHB_formatValue(v) {
    return typeof v === "number"
        ? String(Math.round(v * 1e6) / 1e6)
        : String(v);
}

// Numeric for continuous parameters, label string for labelled ones
function FHB_parseValue(text, fallback) {
    const trimmed = text.trim();
    if (trimmed === "") {
        return fallback;
    }
    const num = parseFloat(trimmed);
    return Number.isNaN(num) ? trimmed : num;
}

studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Batch Edit Transitions",
    keySequence: "Shift+X",
    isEnabled: () => studio.window.editorSelection().length > 0,
    execute: () => {
        const selection = studio.window.editorSelection();
        let parameterPath = ""; // display label set by the picker
        let parameterObject = null; // picked object, overrides any lookup
        const transitions = FHB_getTransitions(selection);
        if (transitions.length === 0) {
            studio.system.message(
                "No transitions found. Select transition markers/regions on the timeline, or anything inside an event that has them.",
            );
            return;
        }

        studio.ui.showModalDialog({
            windowTitle: "Batch Edit Transitions",
            windowWidth: 420,
            windowHeight: 40,
            widgetType: studio.ui.widgetType.Layout,
            layout: studio.ui.layoutType.GridLayout,
            sizePolicy: studio.ui.sizePolicy.Fixed,
            items: [
                {
                    widgetType: studio.ui.widgetType.Label,
                    column: 0,
                    row: 0,
                    text: `${transitions.length} transition(s) found. Leave a field blank to keep it unchanged.`,
                },
                {
                    widgetType: studio.ui.widgetType.Label,
                    column: 0,
                    row: 1,
                    text: "Destination (exact name of a marker/region in the event):",
                },
                {
                    widgetType: studio.ui.widgetType.LineEdit,
                    column: 0,
                    row: 2,
                    widgetId: "m_destination",
                    text: "",
                },
                {
                    widgetType: studio.ui.widgetType.Label,
                    column: 0,
                    row: 3,
                    text: "Add parameter condition (optional):",
                },
                {
                    widgetType: studio.ui.widgetType.Label,
                    column: 0,
                    row: 4,
                    text: "Parameter (name or parameter:/path):",
                },
                {
                    widgetType: studio.ui.widgetType.LineEdit,
                    column: 0,
                    row: 5,
                    widgetId: "m_parameter",
                    text: "",
                    // Typing manually overrides any Browse selection
                    onTextEdited: () => {
                        parameterPath = "";
                        parameterObject = null;
                    },
                },
                {
                    widgetType: studio.ui.widgetType.PushButton,
                    column: 0,
                    row: 6,
                    sizePolicy: studio.ui.sizePolicy.Expanding,
                    text: "Browse...",
                    // `this` must be the dialog for findWidget - no arrow function
                    onClicked: function () {
                        const presets = FHB_collectParameters();
                        if (presets.length === 0) {
                            studio.system.message(
                                "No parameter presets found in the project.",
                            );
                            return;
                        }
                        let chosen = null;
                        // showModalDialog is synchronous - this returns the choice
                        studio.ui.showModalDialog({
                            windowTitle: "Select Parameter",
                            windowWidth: 380,
                            windowHeight: 40,
                            widgetType: studio.ui.widgetType.Layout,
                            layout: studio.ui.layoutType.GridLayout,
                            sizePolicy: studio.ui.sizePolicy.Fixed,
                            items: [
                                {
                                    widgetType: studio.ui.widgetType.Label,
                                    column: 0,
                                    row: 0,
                                    text: `${presets.length} parameter(s) found:`,
                                },
                                {
                                    widgetType: studio.ui.widgetType.ComboBox,
                                    column: 0,
                                    row: 1,
                                    widgetId: "m_pick",
                                    items: presets.map((p) => ({
                                        text: FHB_parameterLabel(p),
                                    })),
                                    currentIndex: 0,
                                },
                                {
                                    widgetType: studio.ui.widgetType.PushButton,
                                    column: 0,
                                    row: 2,
                                    text: "Select",
                                    onClicked: function () {
                                        chosen =
                                            presets[
                                                this.findWidget(
                                                    "m_pick",
                                                ).currentIndex()
                                            ];
                                        this.closeDialog();
                                    },
                                },
                                {
                                    widgetType: studio.ui.widgetType.PushButton,
                                    column: 1,
                                    row: 2,
                                    text: "Cancel",
                                    onClicked: function () {
                                        this.closeDialog();
                                    },
                                },
                            ],
                        });
                        if (chosen) {
                            // Show the selection in the field (setText first: it fires
                            // onTextEdited, which clears the stored pick)
                            this.findWidget("m_parameter").setText(
                                FHB_parameterLabel(chosen),
                            );
                            parameterObject = chosen;
                            parameterPath = FHB_parameterLabel(chosen);
                            studio.system.message(
                                `Parameter selected: ${parameterPath}`,
                            );
                        }
                    },
                },
                {
                    widgetType: studio.ui.widgetType.Label,
                    column: 0,
                    row: 7,
                    text: "Min (float, or label index):",
                },
                {
                    widgetType: studio.ui.widgetType.LineEdit,
                    column: 0,
                    row: 8,
                    widgetId: "m_min",
                    text: "0",
                },
                {
                    widgetType: studio.ui.widgetType.Label,
                    column: 0,
                    row: 9,
                    text: "Max (blank = same as min):",
                },
                {
                    widgetType: studio.ui.widgetType.LineEdit,
                    column: 0,
                    row: 10,
                    widgetId: "m_max",
                    text: "1",
                },
                {
                    widgetType: studio.ui.widgetType.Label,
                    column: 0,
                    row: 11,
                    text: "Trigger condition mode:",
                },
                {
                    widgetType: studio.ui.widgetType.ComboBox,
                    column: 0,
                    row: 12,
                    widgetId: "m_condition",
                    items: [
                        { text: "(unchanged)" },
                        { text: "AND" },
                        { text: "OR" },
                    ],
                    currentIndex: 0,
                },
                {
                    widgetType: studio.ui.widgetType.PushButton,
                    column: 0,
                    row: 13,
                    text: "Apply to all",
                    onClicked: function () {
                        const destinationName =
                            this.findWidget("m_destination").text();
                        // 0 = skip, 1 = AND, 2 = OR
                        const conditionIndex =
                            this.findWidget("m_condition").currentIndex();

                        // Resolve the destination once - all transitions here share one event
                        let destination = null;
                        if (destinationName) {
                            const event =
                                FHB_getSelectionEvent(selection) ||
                                (transitions[0].markerTrack &&
                                    transitions[0].markerTrack.event);
                            destination = event
                                ? FHB_findDestination(event, destinationName)
                                : null;
                            if (!destination) {
                                studio.system.message(
                                    `Destination "${destinationName}" not found in this event - destination left unchanged.`,
                                );
                            }
                        }

                        // Resolve the parameter condition (optional)
                        // Picker selection wins over whatever is typed in the field
                        let parameter = parameterObject;
                        const parameterName = (
                            parameterObject
                                ? parameterPath
                                : this.findWidget("m_parameter").text()
                        ).trim();
                        if (!parameter && parameterName) {
                            const event =
                                FHB_getSelectionEvent(selection) ||
                                (transitions[0].markerTrack &&
                                    transitions[0].markerTrack.event);
                            // 1) A parameter selected in the browser wins outright
                            const browserParam = studio.window
                                .browserSelection()
                                .find(
                                    (o) =>
                                        o &&
                                        o.isOfExactType &&
                                        o.isOfExactType("Parameter"),
                                );
                            // 2) Path lookup: typed path, or bare name -> parameter:/name
                            const lookupPath = parameterName.includes(":")
                                ? parameterName
                                : `parameter:/${parameterName}`;
                            // 3) Event parameters: entries are ParameterProxy (global) or
                            //    GameParameter (local); addParameterCondition needs the
                            //    preset / game parameter itself, not the proxy
                            const eventParam = event
                                ? event.parameters
                                      .map((p) => p.preset || p)
                                      .find(
                                          (p) =>
                                              p.name.toLowerCase() ===
                                              parameterName.toLowerCase(),
                                      )
                                : null;
                            parameter =
                                browserParam ||
                                studio.project.lookup(lookupPath) ||
                                eventParam;
                            if (!parameter) {
                                // Help debugging: dump what this event actually has
                                console.log(
                                    "Parameters on this event:",
                                    event
                                        ? event.parameters.map((p) => p.name)
                                        : [],
                                );
                                studio.system.message(
                                    `Parameter "${parameterName}" not found - no condition added. Check the console for this event's parameter list, or select the parameter in the browser before running.`,
                                );
                            }
                        }
                        const min = FHB_parseValue(
                            this.findWidget("m_min").text(),
                            0,
                        );
                        const max = FHB_parseValue(
                            this.findWidget("m_max").text(),
                            undefined,
                        ); // blank max = same as min (per docs)

                        let updated = 0;
                        transitions.forEach((transition, index) => {
                            if (destination) {
                                transition.destination = destination;
                                // Auto-name after the destination, numbered when batching several
                                transition.name =
                                    transitions.length > 1
                                        ? `${destination.name} ${index + 1}`
                                        : destination.name;
                            }
                            if (conditionIndex > 0) {
                                transition.triggerConditionMode =
                                    conditionIndex - 1; // 0 = AND, 1 = OR
                            }
                            if (parameter) {
                                try {
                                    transition.addParameterCondition(
                                        parameter,
                                        min,
                                        max,
                                    );
                                } catch (e) {
                                    studio.system.message(
                                        `Failed to add condition to "${transition.name}": ${e.message}`,
                                    );
                                }
                            }
                            updated++;
                        });

                        studio.system.message(
                            `Updated ${updated} transition(s).`,
                        );
                        this.closeDialog();
                    },
                },
                {
                    widgetType: studio.ui.widgetType.PushButton,
                    column: 0,
                    row: 14,
                    text: "Clear all conditions",
                    onClicked: function () {
                        let cleared = 0;
                        transitions.forEach((transition) => {
                            (transition.triggerConditions || []).forEach(
                                (condition) => {
                                    try {
                                        cleared += studio.project.deleteObject(
                                            condition,
                                        )
                                            ? 1
                                            : 0;
                                    } catch (e) {
                                        studio.system.message(
                                            `Failed to clear condition on "${transition.name}": ${e.message}`,
                                        );
                                    }
                                },
                            );
                        });
                        studio.system.message(
                            `Cleared ${cleared} condition(s).`,
                        );
                        this.closeDialog();
                    },
                },
            ],
        });
    },
});

/* -------------------------------------------
   FMOD Hotkeys - Edit Transition Condition Values
   Companion to Batch Edit Transitions: only tweaks the min/max
   range of existing parameter conditions, typed in directly.
   One min/max pair per condition found on the selected transitions.
   Select transitions (or anything inside an event that owns
   transitions) and press X.
   ------------------------------------------- */

// Short row label: a condition's `parameter` is usually a bare GameParameter
// (no name, no path - that's where the hex GUIDs came from). Resolve the name
// from its owning ParameterPreset instead.
function FHB_shortParamName(p) {
    if (p && p.name) {
        return p.name;
    }
    if (p && p.isValid) {
        const preset =
            studio.project.model.ParameterPreset.findInstances().find(
                (o) => o.parameter && o.parameter.id === p.id,
            );
        if (preset) {
            return preset.name;
        }
    }
    return "?";
}

studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Edit Transition Condition Values",
    keySequence: "X",
    isEnabled: () => studio.window.editorSelection().length > 0,
    execute: () => {
        const selection = studio.window.editorSelection();
        const transitions = FHB_getTransitions(selection);

        // One row per trigger condition across all selected transitions
        const rows = [];
        transitions.forEach((transition) =>
            (transition.triggerConditions || []).forEach((condition) => {
                if (condition) {
                    rows.push({ transition, condition });
                }
            }),
        );
        if (rows.length === 0) {
            studio.system.message(
                "No parameter conditions found on the selected transitions. Use Shift+X to add conditions first.",
            );
            return;
        }

        // Build the grid dynamically: min | max per condition
        const items = [
            {
                widgetType: studio.ui.widgetType.Label,
                column: 0,
                row: 0,
                text: `${rows.length} condition(s) on ${transitions.length} transition(s).`,
            },
            {
                widgetType: studio.ui.widgetType.Label,
                column: 1,
                row: 0,
                text: "Blank = keep current.",
            },
            {
                widgetType: studio.ui.widgetType.Label,
                column: 1,
                row: 1,
                text: "Min",
            },
            {
                widgetType: studio.ui.widgetType.Label,
                column: 2,
                row: 1,
                text: "Max",
            },
        ];
        rows.forEach((row, i) => {
            items.push({
                widgetType: studio.ui.widgetType.Label,
                column: 0,
                row: i + 2,
                text: `${FHB_shortParamName(row.condition.parameter)}:`,
            });
            items.push({
                widgetType: studio.ui.widgetType.LineEdit,
                column: 1,
                row: i + 2,
                widgetId: `m_min_${i}`,
                text: FHB_formatValue(row.condition.minimum),
            });
            items.push({
                widgetType: studio.ui.widgetType.LineEdit,
                column: 2,
                row: i + 2,
                widgetId: `m_max_${i}`,
                text: FHB_formatValue(row.condition.maximum),
            });
        });
        items.push({
            widgetType: studio.ui.widgetType.PushButton,
            column: 0,
            row: rows.length + 3,
            sizePolicy: studio.ui.sizePolicy.Expanding,
            text: "Apply",
            onClicked: function () {
                let updated = 0;
                rows.forEach((row, i) => {
                    const min = FHB_parseValue(
                        this.findWidget(`m_min_${i}`).text(),
                        row.condition.minimum,
                    );
                    const max = FHB_parseValue(
                        this.findWidget(`m_max_${i}`).text(),
                        row.condition.maximum,
                    );
                    try {
                        row.condition.minimum = min;
                        row.condition.maximum = max;
                        updated++;
                    } catch (e) {
                        studio.system.message(
                            `Failed to update condition ${i + 1}: ${e.message}`,
                        );
                    }
                });
                studio.system.message(`Updated ${updated} condition(s).`);
                this.closeDialog();
            },
        });
        items.push({
            widgetType: studio.ui.widgetType.PushButton,
            column: 1,
            columnSpan: 2,
            row: rows.length + 3,
            sizePolicy: studio.ui.sizePolicy.Expanding,
            text: "Reset",
            onClicked: function () {
                let reset = 0;
                rows.forEach((row, i) => {
                    const p = row.condition.parameter;
                    // Labelled parameters: min is a label string, numeric range
                    // doesn't apply (parameterType 2 = labelled)
                    if (!p || !p.isValid || p.parameterType === 2) {
                        return;
                    }
                    try {
                        const min = p.minimum === undefined ? 0 : p.minimum;
                        const max = p.maximum === undefined ? 1 : p.maximum;
                        row.condition.minimum = min;
                        row.condition.maximum = max;
                        this.findWidget(`m_min_${i}`).setText(
                            FHB_formatValue(min),
                        );
                        this.findWidget(`m_max_${i}`).setText(
                            FHB_formatValue(max),
                        );
                        reset++;
                    } catch (e) {
                        studio.system.message(
                            `Failed to reset condition ${i + 1}: ${e.message}`,
                        );
                    }
                });
                studio.system.message(
                    `Reset ${reset} condition(s) to full parameter range.`,
                );
            },
        });

        studio.ui.showModalDialog({
            windowTitle: "Edit Transition Condition Values",
            windowWidth: 420,
            windowHeight: 100 + rows.length * 28,
            widgetType: studio.ui.widgetType.Layout,
            layout: studio.ui.layoutType.GridLayout,
            sizePolicy: studio.ui.sizePolicy.Fixed,
            items,
        });
    },
});
