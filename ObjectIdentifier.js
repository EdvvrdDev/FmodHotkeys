/* -------------------------------------------
   FMOD Studio Script Example:
   Identifies selected objects in the editor
   -------------------------------------------
 */

studio.menu.addMenuItem({
    name: "Identify Selected Objects",
    keySequence: "Alt+I",
    execute: function() {

        if (studio.window.editorSelection().length != 0) {
            var selection = studio.window.editorSelection();
            console.log(selection);
            
            selection.forEach(element => {
                    element.dump();});
        }
        
        if(studio.window.browserSelection().length != 0) {
            var selection = studio.window.browserSelection();
            console.log(selection);
            
            selection.forEach(element => {
                    element.dump();});
        }
    }
});
