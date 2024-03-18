module.exports = {
    // Weakness Active List Page Action Buttons
    weaknessActiveListPageTab: 'span.mdc-tab__text-label:contains("Active List")',  // Weakness Active List Page Tab
    addNewWeaknessButton: 'button:contains("+ Add New Weakness")',  // Add New Weakness Button
    weaknessCalenderIconButton: 'button[aria-label="Open calendar"]',  // Calender Icon Button
    weaknessCalenderDateField: 'span.mat-calendar-body-cell-content.mat-focus-indicator.mat-calendar-body-today',  // Chooses "Today" date by default
    weaknessResponsibleFieldButton: 'mat-select[formcontrolname="responsibleUserId"]',  // Responsible Field Button
    weaknessResponsibleUserIdDropDownList: 'mat-option',  // You can select the Resposible User by changing ('Automation Test User') with the desired one
    weaknessIdentificationMethodFieldBox: 'input[formcontrolname="identificationMethod"]',  // Identification Method Field Box
    weaknessSourceNotesFieldBox: 'textarea[formcontrolname="sourceNotes"]',  // Source Notes Field Box
    weaknessSourceNotesLinkFieldBox: 'input[formcontrolname="sourceLink"]',  // Source Notes Link Field Box
    weaknessComponentFieldButton: 'mat-select[formcontrolname="component"]',  // Component Field Box
    weaknessComponentDropDownList: 'mat-option',  // Component Dropdown list
    weaknessAttackSurfaceFieldBox: 'input[formcontrolname="attackSurface"]',  // Attack Surface(s) Field box
    weaknessAssetFieldBox: 'input[formcontrolname="asset"]',  // Asset(s) Field Box
    weaknessDescriptionFieldBox: 'textarea[formcontrolname="weaknessDescription"]',  // Weakness Description(required)* Field Box
    weaknessCweIdFieldBox: 'input[formcontrolname="cweId"]',  // CWE ID Field Box
    weaknessCweWeaknessTypeFieldButton: 'mat-label:contains("CWE Weakness Type")',  // CWE Weakness Type Field Button
    weaknessCweWeaknessTypeDropDownList: 'mat-option',  
    weaknessCweWeaknessCategoryFieldButton: 'mat-label:contains("CWE Weakness Category")',  // CWE Weakness Category Field Button
    weaknessCweWeaknessCategoryDropDownList: 'mat-option',  
    weaknessDialogCancelButton: 'button:contains("Cancel")',  // Cancel Button 
    weaknessDialogConfirmButton: 'button:contains("Confirm")',  // Confirm Button
    weaknessActiveListRefreshButton: 'button:contains(" Refresh ")',  // Weakness Active List Tab Refresh Button
    weaknessActiveListSearchFieldBox: 'input[matinput][placeholder="Search"]',  // Weakness Active List Tab Search Box
    addingNewWeaknessSnackBar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',  // New Weakness added Snack Bar
    vulnerabilityAnalysisButton: 'div.weakness-vulnerability-analysis-status-label.vulnerability-analysis-label-not-started:contains("Not started")',
    analyzeWeaknessExploitableButton: 'mat-select[formcontrolname="exploitable"]',  // Exploitable Field Box in Analyze Weakness Dialog
    analyzeWeaknessExploitableDropDownList: 'mat-option',
    analyzeWeaknessExploitableRationaleFieldBox: 'textarea[formcontrolname="exploitableRationale"]',  // Exploitable Rationale Field Box in Analyze Weakness Dialog
    preControlRiskValueFieldBox: 'input[formcontrolname="preControlRiskValue"]',  // Pre-Control Risk Value Field Box in Analyze Weakness Dialog
    riskRationaleFieldBox: 'textarea[formcontrolname="riskRationale"]',  // Risk Rationale Field Box in Analyze Weakness Dialog
    analysisReviewedCheckBox: 'input[type="checkbox"]',  // Analysis Reviewed Check Box
    analyzeWeaknessConfirmButton: 'button:contains("Confirm")',  // Confirm Button in Analyze Weakness Dialog
    analyzeWeaknessSnackBar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',  // Analyze Weakness Snack Bar

    // Weakness Archived List Page Action Buttons
    weaknessArchivedListPageTab: 'span.mdc-tab__text-label:contains("Archived List")',  // Weakness Archived List Page Tab
    weaknessArchivedListRefreshButton: 'button:contains(" Refresh ")',  // Weakness Archived List Tab Refresh Button
    weaknessArchivedListSearchFieldBox: 'input[matinput][placeholder="Search"]',  // Weakness Archived List Tab Search Box

    // Weakness Dropdown Action Buttons
    weaknessDropDownActionButton: 'mat-icon.mat-icon-no-color:contains("more_horiz")',  // Weakness Dropdown Action Button
    deleteWeaknessButton: '.mdc-list-item__primary-text:contains("Delete Weakness")',  // Delete Weakness Button
    confirmToDeleteWeaknessButton: '.mdc-button__label:contains("Delete")',  // Delete Button in Confirmation To Delete Weakness Dialog
    cancelToDeleteWeaknessButton: '.close-dialog-btn:contains("Cancel")',  // Cancel Button in Confirmation To Delete Weakness Dialog
    deleteWeaknessSnackBar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',  // Delete Weakness Snack Bar
    eventLinkingButton: '.mdc-list-item__primary-text:contains("Event Linking")',  // Event Linking Button
    eventLinkingCheckBox: 'input[type="checkbox"]',  // Event Linking Check Box
    eventLinkingConfirmButton: 'button:contains("Confirm")',  // Confirm Button in Event Linking Dialog
    eventLinkingCancelButton: 'button:contains("Cancel")',  // Cancel Button in Event Linking Dialog
    eventLinkingConfirmationToCancelYesButton: 'button:contains("Yes")',  // Yes Button in Confirmation to Discard Event Linking Changes Dialog
    eventLinkingSnackBar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',  // Event Linking Snack Bar
    vulnerabilityLinkingButton: '.mdc-list-item__primary-text:contains("Vulnerability Linking")',  // Vulnerability Linking Button
    generateVulnerabilityFromThisWeaknessButton: 'button:contains(Generate Vulnerability from this Weakness)',  // Generate Vulnerability from this Weakness Button in Vulnerability Linking Dialog
    vulnerabilityLinkingCheckBox: 'input[type="checkbox"]',  // Vulnerability Linking Check Box
    vulnerabilityLinkingConfirmButton: 'button:contains("Confirm")',  // Confirm Button in Vulnerabilty Linking Dialog
    vulnerabilityLinkingCancelButton: 'button:contains("Confirm")',  // Cancel Button in Vulnerabilty Linking Dialog
    vulnerabilityLinkingConfirmationToCancelYesButton: 'button:contains("Yes")',  // Yes Button in Confirmation to Discard Vulnerability Linking Changes Dialog 
    vulnerabilityLinkingSnackBar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',  // Vulnerability Linking Snack Bar
    highlightWeaknessButton: '.mdc-list-item__primary-text:contains("Highlight")',  // Highlight Weakness Button   
    highlightWeaknessSnackBar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',  // Highlight Weakness Snack Bar 
    attachmentButton: 'button:contains(Attachments)',  // Attachments button in Dropdown action list
    weaknessAttachmentTextDialog: 'h1.global-dialog-title-style',  // Header Text in Weakness Attachments Dialog
    weaknessContentTextArea: 'textarea',
}