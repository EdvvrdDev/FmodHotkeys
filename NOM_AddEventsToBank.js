/* -------------------------------------------
   NOM - Add Events To Bank
   Add multiple events to bank(s), create a new bank,
   and remove / re-organise events.

   Credit: nightonmars - FMOD-Organisation-scripts
   https://github.com/nightonmars/FMOD-Organisation-scripts
   ------------------------------------------- */

var bankPath;
var newBank;
var removeBank;

//Add Multiple Events to banks with a prompt for the bank name, uses the currently selected events in the browser, if no events are selected it will show an error message. Also includes an option to create a new bank and to remove events from a bank.
studio.menu.addMenuItem({
  name: "FMOD Hotkeys\\NOM\\Add Events To Bank",
  keySequence: "Ctrl+Shift+B",
  execute: execute,
  isEnabled: function() { 
    return studio.window.browserSelection().length;
  }
});

function execute() {
  var objects = studio.window.browserSelection();
  bankPath = "bank:/Master"; // default target bank, matches the pre-filled dialog field
//  var events = "";

  if(objects.length > 0) {
    var items = [
      {
        widgetType: studio.ui.widgetType.Label,
        column: 0,
        row: 0,
        text: "Event Name:",
        alignment: studio.ui.alignment.AlignTop
      }
    ];

    objects.forEach(function(object, index) {
      if(object.isOfExactType("Event")) {
        items.push(
          {
            widgetType: studio.ui.widgetType.LineEdit,
            alignment: studio.ui.alignment.AlignTop,
            column: 0,
            row: index + 1,
            text: object.name,
            onTextEdited: function() {
            object.name = this.text();
            }
          }
        );
        }
    });

    // Add the  new bank path labels and input below the last event
    var rowIndex = objects.length + 1; //lenght of events selected in the browser, makes the widget dynamic
    items.push(
      {
        widgetType: studio.ui.widgetType.Label,
        column: 0,
        row: rowIndex,
        text: "OPTIONAL: new bank",
        alignment: studio.ui.alignment.AlignTop,
      }
    );

    items.push(
      {
        widgetType: studio.ui.widgetType.LineEdit,
        column: 0,
        row: rowIndex + 1,
        text: "",
        onTextEdited: function() {
          newBank = this.text();
        }
      }
    );

    // Add the new bank confirmation button
    items.push(
      {
        widgetType: studio.ui.widgetType.PushButton,
        column: 0,
        row: rowIndex + 2,
        text: "Confirm New Bank",
        onClicked: function() {  
          var bank = studio.project.create("Bank");
          bank.name = newBank;
          if (newBank) {
          studio.system.message("New bank created: "+bank.name);
        }
        }
      }
    );

    //Remove events from a bank
    items.push(
      {
        widgetType: studio.ui.widgetType.Label,
        column: 0,
        row: rowIndex + 3,
        text: "Bank to remove - NOTE: if moving events between banks, do this first",
        alignment: studio.ui.alignment.AlignTop,
      }
    );

    items.push(
      {
        widgetType: studio.ui.widgetType.LineEdit,
        column: 0,
        row: rowIndex + 4,
        text: "bank:/", //make sure thare are no spaces or the lookup will fail. 
        onTextEdited: function() {
        removeBank = this.text();
        }
      }
    );

     // Add the remove confirmation button
    items.push(
      {
        widgetType: studio.ui.widgetType.PushButton,
        column: 0,
        row: rowIndex + 5,
        text: "Confirm Removal",
        onClicked: function () {
            if (removeBank) {
                studio.system.message("Bank to remove is: " + removeBank);
            }
            var bankToRemove = studio.project.lookup(removeBank);
            if (!bankToRemove) {
                studio.system.message("Bank to remove not found: ");
            } else {
                // Log the bank path when it's found
                /*studio.system.message(
                    "Bank found to remove: " + bankToRemove.getPath()
                );*/
            }

            // find the event path
            var eventPathsToRemove = objects.map(function (object) {
                return object.getPath();
            });

            eventPathsToRemove.forEach(function (eventPath) {
                var event = studio.project.lookup(eventPath); 

                try {
                    bankToRemove.relationships.events.remove(event); 
                } catch (e) {
                    studio.system.message(
                        "Error removing event from bank: " 
                    );
                }
            }); // Close the forEach loop
        },
    }
);

    // Add the bank path 
    items.push(
      {
        widgetType: studio.ui.widgetType.Label,
        column: 0,
        row: rowIndex + 6,
        text: "Bank Path:",
        alignment: studio.ui.alignment.AlignTop,
      }
    );

    items.push(
      {
        widgetType: studio.ui.widgetType.LineEdit,
        column: 0,
        row: rowIndex + 7,
        text: "bank:/Master", // pre-filled default; bankPath is initialized to the same value in execute()
        onTextEdited: function() {
          bankPath = this.text();
        }
      }
    );

    // Add the confirmation button
    items.push(
      {
        widgetType: studio.ui.widgetType.PushButton,
        column: 0,
        row: rowIndex + 8,
        text: "Confirm Bank Path",
        onClicked: function() {          
          if (bankPath) {
          studio.system.message("Bank path is: " + bankPath);
          this.closeDialog(); 
      ;}  

          // Find the bank
          var bank = studio.project.lookup(bankPath);
          if (!bank) {
            studio.system.message("Bank not found: " + bank);
          }
            //find the event path
            var eventPaths = objects.map(function(object) {
            return object.getPath();
            });

   
            eventPaths.forEach(function(eventPath) {
            var event = studio.project.lookup(eventPath);

            try {
              event.relationships.banks.add(bank);
            } catch (e) {
           studio.system.message("Error adding bank to event: " + e.message);
            }
          });
        }
      }
    );

    if(items.length > 0) {
      studio.ui.showModalDialog({
        windowTitle: "Add Events to Bank",
        windowHeight: 30,
        widgetType: studio.ui.widgetType.Layout,
        layout: studio.ui.layoutType.GridLayout,
        sizePolicy: studio.ui.sizePolicy.Fixed,
        items: items,
        onAccepted: function() {
          // spare for extra logic
        }
      });
    } else {
      console.error("Error: no events selected.");
      alert("Error: no events selected.");
    }
  } else {
    console.error("Error: browser selection empty.");
  }
}
