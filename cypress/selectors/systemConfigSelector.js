module.exports = {
    //side nav bar
    systemConfigSideNavAttackTreeAnchor: 'mat-nav-list > a:contains(Attack Tree)',
    systemConfigSideNavCustomFieldAnchor: 'mat-nav-list > a:contains(Custom Fields)',
    systemConfigSideNavVulnerabilitySlaAnchor: 'mat-nav-list > a:contains(Vulnerability SLA)',
    systemConfigSideNavRiskDeterminationAnchor: 'mat-nav-list > a:contains(Risk Determination)',
    systemConfigSideNavFeasibilityAndImpactExpandAnchor: 'mat-panel-title:contains(Feasibility and Impact)',
    systemConfigSideNavImpactRatingAnchor: 'mat-nav-list > a:contains(Impact Rating)',

    //Custom fields Tab
    customFieldPageText: 'h1:contains(Custom Fields)',
    createCustomFieldButton: 'button:contains(Create custom field)',
    addCustomFieldTextDialog: 'h1:contains(Add Custom Field)',
    addCustomNameField: 'input[ng-reflect-name="name"]',
    addCustomCategoryField: 'mat-select[formcontrolname="category"]',
    addCustomTypeField: 'mat-select[formcontrolname="type"]',
    customFieldDialogCancelButton: 'button:contains(Cancel)',
    customFieldDialogConfirmButton: 'button:contains(Confirm)', 
    customFieldDeleteIcon: 'mat-icon:contains(delete)',
    customFieldNameContentArea: 'td[class*="mat-column-name"]',

    //global system Config
    globalDropDownListOption: 'mat-option',
    confirmToDeleteButton: 'button:contains(Delete)',
    confirmToDeleteTextDialog: 'h1:contains(CONFIRM TO DELETE)',
    systemConfigSnackBar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',
}