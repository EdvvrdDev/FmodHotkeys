/* -------------------------------------------
   FMOD Hotkeys - Batch Rename (Upgraded)
   FMOD's Batch Rename example dialog, redesigned:
   - Replace: find/replace (+ occurrence, case,
     regex) with a lowercase_underscores toggle
   - Append / Prepend: with an incremental number
     toggle and -/+ buttons to adjust the start
     number
   - Strip whitespace: one-click transform
   Live preview before Apply.

   Select items in a browser and press Shift+R.
   ------------------------------------------- */

studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Batch Rename",
    isEnabled: () => studio.window.browserSelection().length,
    keySequence: "Shift+R",
    execute: () => {
        // Shared preview + commit handler (same pattern as FMOD's example)
        function doBatchRename(widget, commit) {
            var action = widget.findWidget("m_action").currentIndex();
            var findStr = widget.findWidget("m_findText").text();
            var replaceStr = widget.findWidget("m_replaceText").text();
            var occurrenceType = widget
                .findWidget("m_occurrence")
                .currentIndex();
            var caseSensitive = widget
                .findWidget("m_caseSensitive")
                .isChecked();
            var useRegex = widget.findWidget("m_regexEnabled").isChecked();
            var lowerOn = widget.findWidget("m_lowerToggle").isChecked();
            var numOn = widget.findWidget("m_numToggle").isChecked();
            var numBase =
                parseInt(widget.findWidget("m_numBase").text(), 10) || 0;

            // Field visibility per operation:
            // 0 Replace: find/replace/occurrence/case/regex + lowercase toggle
            // 1-2 Append/Prepend: find/replace/case/regex + number controls
            // 3 Strip whitespace: nothing extra
            var isReplace = action === 0;
            var isAppendPrepend = action === 1 || action === 2;
            var isRegexAction = isReplace || isAppendPrepend;
            widget.findWidget("m_findLabel").setVisible(isRegexAction);
            widget.findWidget("m_findText").setVisible(isRegexAction);
            widget.findWidget("m_actionLabel").setVisible(isRegexAction);
            widget.findWidget("m_replaceText").setVisible(isRegexAction);
            widget.findWidget("m_occurrenceLabel").setVisible(isReplace);
            widget.findWidget("m_occurrence").setVisible(isReplace);
            widget.findWidget("m_caseSensitive").setVisible(isRegexAction);
            widget.findWidget("m_regexEnabled").setVisible(isRegexAction);
            widget.findWidget("m_lowerToggle").setVisible(isReplace);
            widget.findWidget("m_numToggle").setVisible(isAppendPrepend);
            var numRowVisible = isAppendPrepend && numOn;
            widget.findWidget("m_numLabel").setVisible(numRowVisible);
            widget.findWidget("m_numRow").setVisible(numRowVisible);
            widget
                .findWidget("m_actionLabel")
                .setText(action === 2 ? "Prepend with" : "Replace/Append with");
            widget
                .findWidget("m_findLabel")
                .setText(isReplace ? "Find" : "Filter");

            // Build up the regex
            var regexStr = "";
            var regexFlags = caseSensitive ? "" : "i";
            if (findStr.length) {
                regexStr = useRegex ? findStr : RegExp.escape(findStr);
                if (isReplace) {
                    // Occurrence type only applies to Replace
                    switch (occurrenceType) {
                        case 0:
                            regexFlags += "g";
                            break; // All
                        case 2:
                            regexStr = regexStr + "(?!.*" + regexStr + ")";
                            break; // Last
                    }
                }
            }

            // Generate preview and optionally commit changes
            var previewStr = "";
            try {
                var regex = regexStr.length
                    ? new RegExp(regexStr, regexFlags)
                    : null;
                studio.window.browserSelection().forEach((item, index) => {
                    if (
                        item.isOfType("WorkspaceItem") ||
                        item.isOfType("Asset")
                    ) {
                        var oldName;
                        if (item.isOfType("Asset")) {
                            oldName = item.getAssetPath();
                        } else {
                            oldName = item.name;
                        }
                        var newName = oldName;
                        switch (action) {
                            case 0: {
                                // Replace
                                newName = regex
                                    ? newName.replace(regex, replaceStr)
                                    : newName;
                                if (lowerOn) {
                                    newName = newName
                                        .trim()
                                        .replace(/\s+/g, "_")
                                        .toLowerCase();
                                }
                                break;
                            }
                            case 1: {
                                // Append
                                if (!regex || newName.search(regex) != -1) {
                                    newName = newName + replaceStr;
                                }
                                if (numOn) {
                                    newName = newName + " " + (numBase + index);
                                }
                                break;
                            }
                            case 2: {
                                // Prepend
                                if (!regex || newName.search(regex) != -1) {
                                    newName = replaceStr + newName;
                                }
                                if (numOn) {
                                    // Number goes in FRONT for prepend
                                    newName = numBase + index + " " + newName;
                                }
                                break;
                            }
                            case 3:
                                newName = newName.replace(/\s+/g, "");
                                break; // Strip whitespace
                        }
                        newName = newName.trim();

                        if (oldName == newName) {
                            previewStr +=
                                newName
                                    .toHtmlEscaped()
                                    .replace(/ /g, "&nbsp;") +
                                '<font color="Gray"> unchanged</font><br />';
                        } else {
                            previewStr += oldName
                                .toHtmlEscaped()
                                .replace(/ /g, "&nbsp;");
                            previewStr +=
                                '<font color="Gray"> to </font><font color="YellowGreen">';
                            previewStr +=
                                newName
                                    .toHtmlEscaped()
                                    .replace(/ /g, "&nbsp;") + "</font><br />";
                        }
                        if (commit) {
                            if (item.isOfType("Asset")) {
                                item.setAssetPath(newName);
                            } else {
                                item.name = newName;
                            }
                        }
                    }
                });
            } catch {
                previewStr +=
                    '<font color="Red">Invalid regular expression specified.</font>';
            }
            widget.findWidget("m_preview").setHtml(previewStr);
        }

        // -/+ adjust the start number of the incremental mode
        function adjustNumber(widget, delta) {
            var field = widget.findWidget("m_numBase");
            var n = Math.max(0, (parseInt(field.text(), 10) || 0) + delta);
            field.setText(String(n));
            doBatchRename(widget);
        }

        studio.ui.showModalDialog({
            windowTitle: "Batch Rename",
            windowWidth: 340,
            widgetType: studio.ui.widgetType.Layout,
            layout: studio.ui.layoutType.VBoxLayout,
            // Apply the initial field visibility at construction - the
            // description's isVisible flags alone aren't honored on first render
            onConstructed: function () {
                doBatchRename(this);
            },
            items: [
                { widgetType: studio.ui.widgetType.Label, text: "Operation" },
                {
                    widgetType: studio.ui.widgetType.ComboBox,
                    widgetId: "m_action",
                    items: [
                        { text: "Replace" }, // 0
                        { text: "Append" }, // 1
                        { text: "Prepend" }, // 2
                        { text: "Strip whitespace" }, // 3
                    ],
                    currentIndex: 0,
                    onCurrentIndexChanged: function () {
                        doBatchRename(this);
                    },
                },
                {
                    widgetType: studio.ui.widgetType.Label,
                    widgetId: "m_findLabel",
                    text: "Find",
                },
                {
                    widgetType: studio.ui.widgetType.LineEdit,
                    widgetId: "m_findText",
                    text: "",
                    onTextEdited: function () {
                        doBatchRename(this);
                    },
                },
                {
                    widgetType: studio.ui.widgetType.Label,
                    widgetId: "m_actionLabel",
                    text: "Replace with",
                },
                {
                    widgetType: studio.ui.widgetType.LineEdit,
                    widgetId: "m_replaceText",
                    text: "",
                    regExpValidator: '^[^<>:\\\\/"|*?]*$',
                    onTextEdited: function () {
                        doBatchRename(this);
                    },
                },
                {
                    widgetType: studio.ui.widgetType.Label,
                    widgetId: "m_occurrenceLabel",
                    text: "Occurrence",
                },
                {
                    widgetType: studio.ui.widgetType.ComboBox,
                    widgetId: "m_occurrence",
                    items: [
                        { text: "All" }, // 0
                        { text: "First" }, // 1
                        { text: "Last" }, // 2
                    ],
                    currentIndex: 0,
                    onCurrentIndexChanged: function () {
                        doBatchRename(this);
                    },
                },
                {
                    widgetType: studio.ui.widgetType.CheckBox,
                    widgetId: "m_caseSensitive",
                    text: "Case sensitive",
                    isChecked: false,
                    onToggled: function () {
                        doBatchRename(this);
                    },
                },
                {
                    widgetType: studio.ui.widgetType.CheckBox,
                    widgetId: "m_regexEnabled",
                    text: "Use regular expressions",
                    isChecked: false,
                    onToggled: function () {
                        doBatchRename(this);
                    },
                },
                {
                    widgetType: studio.ui.widgetType.CheckBox,
                    widgetId: "m_lowerToggle",
                    text: "lowercase_underscores (engine-safe)",
                    isChecked: false,
                    onToggled: function () {
                        doBatchRename(this);
                    },
                },
                {
                    widgetType: studio.ui.widgetType.CheckBox,
                    widgetId: "m_numToggle",
                    text: "Incremental number",
                    isChecked: false,
                    onToggled: function () {
                        doBatchRename(this);
                    },
                },
                {
                    widgetType: studio.ui.widgetType.Label,
                    widgetId: "m_numLabel",
                    text: "Start number:",
                    isVisible: false,
                },
                {
                    widgetType: studio.ui.widgetType.Layout,
                    widgetId: "m_numRow",
                    layout: studio.ui.layoutType.HBoxLayout,
                    isVisible: false,
                    items: [
                        {
                            widgetType: studio.ui.widgetType.PushButton,
                            text: "-",
                            onClicked: function () {
                                adjustNumber(this, -1);
                            },
                        },
                        {
                            widgetType: studio.ui.widgetType.LineEdit,
                            widgetId: "m_numBase",
                            text: "1",
                            onTextEdited: function () {
                                doBatchRename(this);
                            },
                        },
                        {
                            widgetType: studio.ui.widgetType.PushButton,
                            text: "+",
                            onClicked: function () {
                                adjustNumber(this, 1);
                            },
                        },
                    ],
                },
                { widgetType: studio.ui.widgetType.Label, text: "Preview" },
                {
                    widgetType: studio.ui.widgetType.TextEdit,
                    widgetId: "m_preview",
                    html: '<font color="Gray">Enter parameters to preview changes. Use <i>$n</i> within the replacement text to use captured groups.</font>',
                    isReadOnly: true,
                },
                {
                    widgetType: studio.ui.widgetType.Layout,
                    layout: studio.ui.layoutType.HBoxLayout,
                    contentsMargins: { left: 0, top: 12, right: 0, bottom: 0 },
                    items: [
                        {
                            widgetType: studio.ui.widgetType.Spacer,
                            sizePolicy: {
                                horizontalPolicy:
                                    studio.ui.sizePolicy.MinimumExpanding,
                            },
                        },
                        {
                            widgetType: studio.ui.widgetType.PushButton,
                            text: "Apply",
                            onClicked: function () {
                                doBatchRename(this, true);
                                this.closeDialog();
                            },
                        },
                    ],
                },
            ],
        });
    },
});
