/* -------------------------------------------
   NOM - Add Single Event To Bank
   Add the currently selected event to a bank.

   Credit: nightonmars - FMOD-Organisation-scripts
   https://github.com/nightonmars/FMOD-Organisation-scripts
   ------------------------------------------- */

studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\NOM\\AddSingleEventToBank",
    keySequence: "Ctrl+B",
    execute: function () {
        //select the event in the browser
       var event = studio.window.browserCurrent();

       // Prompt the user for the bank path
       var bankPath = studio.system.getText("Enter the bank path:", "bank:/Master");

       if (!event) {
            studio.system.message("No event selected in the browser.");
            return;
        }

        // Find the bank
        var bank = studio.project.lookup(bankPath);
        if (!bank) {
            studio.system.message("Bank not found: " + bankPath);
            return;
        }

        // Add the bank to the event's relationships
        try {
            event.relationships.banks.add(bank);
        } catch (e) {
            studio.system.message("Error adding bank to event: " + e.message);
        }
    }
});
