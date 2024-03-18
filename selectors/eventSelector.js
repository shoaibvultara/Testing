module.exports = {

    // Add New Event Action buttons Selectors
    addNewEventButton : 'button.add-event-btn', // Add New Event Button
    addNewEventDialogText : 'h1:contains(Add New Event)',  // Add New Event Text in the Dialog
    triggerNameFieldButton : 'mat-select[formcontrolname="eventTriggerName"]',  // Trigger Name Field Button
    triggerNameDropDownList : 'mat-option',  // Trigger Name DropDown List
    priorityFieldButton : 'mat-select[formcontrolname="eventPriority"]',  // Priority Field Button
    priorityDropDownList : 'mat-option',  // Priority DropDown List
    eventStatusFieldButton : 'mat-select[formcontrolname="eventStatus"]',  // Event Status Field Button
    eventStatusDropDownList : 'mat-option',  // Event Status DropDown List
    eventResponsibleFieldButton : 'mat-select[formcontrolname="responsibleUserId"]',  // Responsible Field Button
    eventResponsibleUserIdDropDownList : 'mat-option', // Event Responsible User DropDown List
    eventDetailFieldBox : 'textarea.mat-mdc-input-element[formcontrolname="eventDetails"]',  // Event Details Field box
    evaluationNoteFieldBox : 'textarea[formcontrolname="evaluationNotes"]',  // Evaluation Noted Field Box
    evaluationStatusFieldButton : 'mat-select[formcontrolname="evaluationStatus"]',  // Evaluation Status Field Button
    evaluationStatusDropDownList : 'mat-option',  // Evaluation Status Dropdown List
    confirmNewEventButton : 'button:contains("Confirm")',  // Confirm Button in Add New Event dialog
    cancelNewEventDialogButton : 'button:contains("Cancel")',  // Cancel Button in Add New Event dialog
    addNewEventSnackBar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',  // Snack Bar message for adding New Event
    weaknessLinkingDialogCheckBox : 'input[type="checkbox"]',  // Weakness Linking Dialog Check box
    confirmWeaknessLinkingDialogButton : 'button:contains("Confirm")',  // Confirm Button in Weakness Linking dialog
    cancelWeaknessLinkingDialogButton : 'button:contains("Cancel")',  // Cancel Button in Weakness Linking dialog
    addingWeaknessSnackBar : 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]', // Snack Bar message after adding Weakness to the New Event
    generateWeaknessFromThisEventButton : '.mdc-button__label:contains("Generate Weakness from this Event")',  // Generate Weakness From This Event Button in the Weakness Linking Dialog
    weaknessLinkingTextDialog: 'h1',
    eventDetailTextAreaField : 'textarea',  //  Event Details Text area in the Event page

    // Search Event Box
    searchEventBox : 'input[placeholder="Search Event"]',  // Search Event Field box 

    // Event dropdown actions
    eventDropDownActionButton : 'mat-icon.mat-icon-no-color:contains("more_horiz")',  //Event Dropdown action button
    deleteEventButton : '.mdc-list-item__primary-text:contains(" Delete Event ")',  //Delete Event button
    confrimDialogDeleteEventButton : '.mdc-button__label:contains("Delete")',  // Delete button in Confirmation Dialog
    confrimDialogCancelEventButton : '.close-dialog-btn:contains("Cancel")',  // Cancel button in Confirmation Dialog
    deleteEventSnackBar : 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',  //Snack Bar message for Deleting an Event
    
    // Weakness Linking
    weaknessLinkingButton : '.mdc-list-item__primary-text:contains(" Weakness Linking ")',  // Weakness Linking Button

    // Event Row 
    eventRow : 'td[class="mat-mdc-cell mdc-data-table__cell cdk-cell cdk-column-details mat-column-details ng-star-inserted"]', 
    editEventDialogText : 'h1:contains(Edit Event ID)',  // Edit Event Text in the Dialog
}