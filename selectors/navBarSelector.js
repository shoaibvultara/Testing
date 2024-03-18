module.exports = { 
    //Nav. bar buttons & icons:
    navBarProjectButton: 'button:contains("Project")', 
    navBarEditButton: 'button:contains("Edit")', 
    navBarViewButton: 'button:contains("View")', 
    navBarLibraryButton: 'button:contains("Library")',
    navBarSocButton: 'button:contains("SOC")',
    navBarExportButton: 'button:contains("Export")',
    navBarSettingsButton: 'button:contains("Settings")',
    navBarLeftSeparator: '#navbar > mat-toolbar > mat-divider:nth-child(3)',
    navBarModelingViewIcon: '[aria-label="Modeling View"]',
    navBarThreatListViewIcon: '[aria-label="Threat List View"]',
    navBarWeaknessListViewIcon: '[aria-label="Weakness List View"]',
    navBarVulnerabilityListViewIcon: '[aria-label="Vulnerability List View"]',
    navBarRunTheModelIcon: '#navbar > mat-toolbar > div:nth-child(4) > button:nth-child(5)',
    navBarNotificationIcon: '#navbar > mat-toolbar > button:nth-child(8) > span.mat-mdc-button-touch-target',
    navBarProfileIcon: 'button:contains("account_circle")',
    navBarMilestoneIcon: '#navbar > mat-toolbar > button > img',

    //Project button list buttons
    projectListNewProjectButton : 'button:contains("New Project")',
    projectListDeleteProjectButton : 'button:contains("Delete Project")',
    projectListNewMilestoneButton:'button:contains("New Milestone")',
    projectListLoadMilestoneButton:'button:contains("Load Milestone")',

    //Milestone dialog
    newMilestoneTitleHeader: 'h1:contains("New Milestone")',
    newMilestoneNameInput: 'input[ng-reflect-name="name"]',
    loadMilestoneTitleHeader:'h1:contains("Load Milestone")',
    loadMilestoneSelectionList:'mat-list-option > span',

    //Delete Project dialogue window buttons
    deleteProjectDialogWindow: 'mat-list-option',
    deleteProjectDialogWindowContinueButton : 'button:contains("Continue")',

    //New Project form inputs
    newProjectForm : '[id=mat-mdc-dialog-0]',
    newProjectFormProjectNameInput : 'input[formcontrolname="name"]',
    newProjectFormProjectNotesInput : 'textarea[formcontrolname="notes"]',
    newProjectFormConfirmButton : 'button:contains(Confirm)',

    //Edit button list buttons
    editListNewDesignButton: 'button:contains("New Design")',
    editListRestoreThreatButton: 'button:contains("Restore Threat")',
    editListMapThreatListToWP29Button: 'button:contains("Map Threat List to WP29")',
    editListShowMappingButton: 'button:contains(Show Mapping)',

    //View button list buttons
    viewListAssumptionButton : 'button:contains("Assumption")',
    viewListThreatListButton : 'button:contains("Threat List")',
    viewListVulnerabilityButton : 'button:contains("Vulnerability")',
    viewListDashboardButton : 'button:contains("Dashboard")',
    viewListProjectBomButton : 'button:contains("Project BOM")',
    viewListEventButton : 'button:contains("Event")',
    viewListWeaknessListButton : 'button:contains("Weakness List")',
    viewListMonitoringButton : 'button:contains("Monitoring")',
    viewListPoolButton: 'button:contains(Pool)',

    //Export button list buttons
    exportListGenerateReportButton : 'button:contains("Generate Report")',
    reportTypeFieldButton: 'mat-label:contains(Report Type*)',
    reportTypeDropDownOptionList: 'mat-option',
    optionsCheckBox: 'input[type="checkbox"]',
    generateButton: 'button:contains(Generate)',
    notificationSnackBar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',
    notificationMenuOthersTab: '.notification-page-tab-right:contains(Others)',
    downloadReportMessage: 'p.message:contains(Click to download the file.)',
    generateReportTextDialog: 'h1.global-dialog-title-style',
    generateReportDialogCancelButton: 'button:contains(Cancel)',

    //Settings button list buttons
    settingsListAdminButton : 'button:contains("Admin")',
    settingsListSystemButton : 'button:contains("System")',

    //Notification icon menu buttons
    notificationMenu : '[id=mat-menu-panel-1]',

    //Profile icon list buttons
    profileListUserProfileHeader : '#mat-menu-panel-2 > div > h3:nth-child(1) > span',
    profileListUsernameHeader : '#mat-menu-panel-2 > div > h3:nth-child(2) > span',
    profileListRoleHeader : '#mat-menu-panel-2 > div > h3:nth-child(3) > span',
    profileListMilestoneHeader : '#mat-menu-panel-2 > div > h3:nth-child(5) > span',
    profileListChangePasswordHeader : 'button:contains("Change Password")',
    profileListLogoutButton: 'button:contains("Logout")',
    profileListProjectButton: 'button:contains(" Project:")',

    //Edit Project Details dialog
    ProjectDialogProjectNotesTextArea: 'textarea[formcontrolname="notes"]',

    //Change password form
    changePasswordForm : '#mat-mdc-dialog-0 > div > div',

    //Delete Confirmation Dialogues
    confirmToDeleteDialogue : '.confirm-dialog-title',
    confirmDialogueCloseButton : '.close-dialog-btn',
    confirmDialogueCancelButton : 'button:contains(Cancel)',
    confirmDialogueDeleteButton : 'button:contains(Delete)',
    confirmDialogueConfirmButton : 'button:contains(Confirm)',
    confirmDialogueParagraph: '.confirmation-dialog-message',

    //global selectors 
    loader: 'div[class*="ngx-spinner-overlay"]',
    subsequentSnackBarElement:'simple-snack-bar',
    circleProgressSpinner: 'mat-progress-spinner',
    dialogMessageParagraph: 'p.confirmation-dialog-message',
    dialogCloseIcon: 'mat-icon:contains(close)',
    dropDownOption: 'mat-option',
    } 