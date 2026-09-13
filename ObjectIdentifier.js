/* -------------------------------------------
   FMOD Studio Script Example:
   Identifies selected objects in the editor
   ------------------------------------------- */

studio.menu.addMenuItem({
 name: "Identify Selected Objects",
 keySequence: "Alt+I",
 execute: () => {
  studio.window
   .editorSelection()
   .concat(studio.window.browserSelection())
   .forEach((element) => {
    element.dump();
   });
 },
});
