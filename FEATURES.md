# FMOD Hotkeys — Features

## Timeline Regions & Markers

- **Shift + L** — Create loop regions from the current selection(s)
- **Shift + M** — Create magnet regions from the current selection(s)
- **Shift + T** — Create transition regions from the current selection(s)
- **Shift + D** — Create destination regions from the current selection(s)
- **Ctrl + Shift + D** — Create destination markers at the start of the selection(s)
- All region hotkeys work on multiple selected ranges at once — and from any browser tab (Events *or* Assets). Selections may mix types: instruments are used directly, markers/regions are anchored at their position, and unpositionable elements (tracks, automation points) are skipped instead of failing the run

## Event Creation

- **Ctrl + Alt + T** — New event with a timeline sheet (no extra clicks to pick the sheet type)
- **Ctrl + Alt + Shift + T** — New event with an action sheet

## Timeline Navigation *(experimental)*

- **Tab** — Jump the timeline cursor to the start of the next instrument, Pro Tools–style
- **Shift + Tab** — Jump the timeline cursor to the end of the previous instrument

## Transition Editing

- **Shift + X** — Batch edit transitions (markers **and** regions) via a dialog: re-target all selected transitions to a destination marker/region (auto-naming them after it), add a parameter condition (with min/max) to all of them, and switch trigger condition mode (AND/OR), plus a button to clear all conditions from the selected transitions (for big refactors). Select transition regions on the timeline to edit just those, or anything inside an event to edit every transition region it owns
- **X** — Companion to Batch Edit Transitions: type new min/max values directly, one prefilled pair of fields per trigger condition on the selected transitions (blank = keep current). Includes a Reset button that sets each continuous condition to its parameter's full range

## Project Actions

- **Shift + Alt + R** — Refresh modified assets

- **F8** — Save the project and build for all platforms in one press

## Bank & Parameter Organization *(by [nightonmars](https://github.com/nightonmars/FMOD-Organisation-scripts))*

- **Ctrl + B** — Add the selected event to a bank
- **Ctrl + Shift + B** — Add multiple events to bank(s), create a new bank, or remove/re-organize events via a dialog — defaults to the Master bank
- **Shift + P** — Quick label parameter generator with a dialog for name + comma-separated labels

## Selection Organization

- **Alt + C** — Assign contrasting colors: every colorable item in the editor/browser selection (folders, events, tracks via their mixer groups) gets a different color, cycling a contrasting palette so neighbors never match. Timeline selections take priority over browser selections
- **Shift + R** — Upgraded Batch Rename: FMOD's Batch Rename dialog (Replace / Append / Prepend with find, occurrence, case sensitivity, regex and live preview) plus extra transforms — engine-safe `lowercase_underscores`, strip whitespace, increment trailing number (keeps zero padding), and append number by selection position

## Developer Tools

- **Alt + I** — Object identifier: dumps the current editor/browser selection's structure to the console
