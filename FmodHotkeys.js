/* -------------------------------------------
   FMOD Studio Script Example:
   Add a new loop region to the currently selected events first instrument
   -------------------------------------------
 */

var bankPath;
var newBank;
var removeBank;
this.uiEventMacros = function() {
  return execute();
};

   //Function 1: Add Loop Region to all currently selected Event
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Add Loop Region to selections",
    keySequence: "Shift+L",
    isEnabled: function() { var event = studio.window.browserCurrent(); return event && event.isOfExactType("Event"); },
    execute: function() {
        // Retrieve the current selected event
        var event = studio.window.browserCurrent();
        var selections = studio.window.editorSelection();
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
    isEnabled: function() { var event = studio.window.browserCurrent(); return event && event.isOfExactType("Event"); },
    execute: function() {
        // Retrieve the current selected event
        var event = studio.window.browserCurrent();
        var selections = studio.window.editorSelection();
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


//Function 3: Add new event with a timeline sheet
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Add new event with a timeline sheet",
    keySequence: "Ctrl+Alt+T",
    execute: function() {
        var event = studio.project.create("Event");
        event.name = "New Timeline Event";
        event.addGroupTrack("Audio Track");
    }
});

//Function 4: Add Transition Region to selections
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Add Transition Region to selections",
    keySequence: "Shift+T",
    isEnabled: function() { var event = studio.window.browserCurrent(); return event && event.isOfExactType("Event"); },
    execute: function() {
        // Retrieve the current selected event
        var event = studio.window.browserCurrent();
        var selections = studio.window.editorSelection();
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

//Function 5: Add Destination Region to selections
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Add Destination Region to selections",
    keySequence: "Shift+D",
    isEnabled: function() { var event = studio.window.browserCurrent(); return event && event.isOfExactType("Event"); },
    execute: function() {
        // Retrieve the current selected event
        var event = studio.window.browserCurrent();
        var selections = studio.window.editorSelection();
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

//Function 6: Add Destination Marker to selections
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Add Destination Marker to start of selections",
    keySequence: "Ctrl+Shift+D",
    isEnabled: function() { var event = studio.window.browserCurrent(); return event && event.isOfExactType("Event"); },
    execute: function() {
        // Retrieve the current selected event
        var event = studio.window.browserCurrent();
        var selections = studio.window.editorSelection();
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

//Function 7: Refresh Modified Assets
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Refresh Modified Assets",
    keySequence: "Shift+Alt+R",
    execute: function() {
        studio.window.triggerAction("RefreshModifiedAssets");
        alert("Assets refreshed!")
    }
});

//Function 8: Better add parameter with labels, prompts user for parameter name and labels in a modal dialog, adds the parameter to the currently selected event in the browser
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\NOM\\Add Labelled Param",
    keySequence: "Shift+P",
    execute: function () {
        var labelsText = "";
        var paramName = "";
        

            studio.ui.showModalDialog({
            windowTitle: "Add Labelled Parameter",
            widgetType: studio.ui.widgetType.Layout,
            layout: studio.ui.layoutType.GridLayout,
            sizePolicy: studio.ui.sizePolicy.Expanding,
            windowWidth: 400,
            windowHeight: 100,
            items: [
                {
                    widgetType: studio.ui.widgetType.Label,
                    column: 0,
                    row: 0,
                    text: "Parameter Name:",
                    alignment: studio.ui.alignment.AlignTop | studio.ui.alignment.AlignLeft
                },
                {
                    widgetType: studio.ui.widgetType.LineEdit,
                    column: 0,
                    row: 1,
                    text: "",
                    sizePolicy: studio.ui.sizePolicy.Expanding,
                    onTextEdited: function () {
                        paramName = this.text();
                    }
                },
                {
                    widgetType: studio.ui.widgetType.Label,
                    column: 0,
                    row: 2,
                    text: "Enter comma-separated labels:",
                    alignment: studio.ui.alignment.AlignTop | studio.ui.alignment.AlignLeft
                },
                {
                    widgetType: studio.ui.widgetType.LineEdit,
                    column: 0,
                    row: 3,
                    text: "",
                    sizePolicy: studio.ui.sizePolicy.Expanding,
                    onTextEdited: function () {
                        labelsText = this.text();
                    }
                },
                {
                    widgetType: studio.ui.widgetType.PushButton,
                    column: 0,
                    row: 4,
                    text: "Create Labeled Parameter",
                    onClicked: function () {
                        var labels = labelsText.split(",").map(function(label) {
                            return label.trim();
                        }).filter(function(label) {
                            return label.length > 0;
                        });

                        if (labels.length === 0) {
                            studio.system.message("Please enter at least one valid label.");
                            return;
                        }

                        if (!paramName || paramName.trim().length === 0) {
                            studio.system.message("Please enter a valid parameter name.");
                            return;
                        }

                        var event = studio.window.browserCurrent();
                        if (!event) {
                            studio.system.message("No event selected in the browser.");
                            return;
                        }

                        try {
                            event.addGameParameter({ 
                                name: paramName.trim(),
                                type: studio.project.parameterType.UserEnumeration, 
                                enumerationLabels: labels, 
                                min: 0, 
                                max: labels.length - 1
                            });
                            
                            // studio.system.message("Labeled parameter added with labels: " + labels.join(", ")); 
    
                        } catch (e) {
                            studio.system.message("Error adding parameter: " + e.message);
                        }
                        this.closeDialog(); 
                    }
                }
            ]
        });
    }
});

//Function 9: Add Multiple Events to banks with a prompt for the bank name, uses the currently selected events in the browser, if no events are selected it will show an error message. Also includes an option to create a new bank and to remove events from a bank.
/**
 * Menu item entry
 */
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
  var out = [];
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
        out.push(object);
        
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

        // Get the event path
        var eventPath = object.getPath().length; 
        if (!eventPath) {         
        console.log("event found path " +eventPath);} 
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
        text: "bank:/",
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
            else{
            };
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

  return out;
}

//Function 10: Add single Events to a new bank with a prompt for the bank name, uses the currently selected event in the browser, if no event is selected it will show an error message.
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\NOM\\AddSingleEventToBank",
    keySequence: "Ctrl+B",
    execute: function () {
        //select the event in the browers
       var event = studio.window.browserCurrent();
        
       //gets the path and sets it to the var
       var eventPath = event.getPath()
       // Prompt the user for the bank path
       var bankPath = studio.system.getText("Enter the bank path:", "bank:/Master");
      

        // Find the event
        var event = studio.project.lookup(eventPath);
        if (!event) {
            studio.system.message("Event not found: " + eventPath);
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


//Function 11: Save and then build for all platforms with a single button
studio.menu.addMenuItem({
    name: "FMOD Hotkeys\\Save and Build All",
    keySequence: "F8",
    execute: function () {
        // Save the project
        studio.project.save()
        // Build for all platforms
        studio.project.build()
        alert("Saved and Built for all platforms!");
    }
});


      
