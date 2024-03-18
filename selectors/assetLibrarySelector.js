module.exports = {

    createNewAssetButton: 'button:contains(Create New Asset)',  // Create New Asset Button in Asset Library page
    assetNameFieldBox: 'input[value="New asset"]',  // Asset Name Field Box in New Asset Dialog
    assetNameContentTextArea: 'input[name="assetName"]',  // Asset Context Area in Asset library page
    assetTypeFieldButton: 'mat-select[ng-reflect-name="assetType"]',  // Asset Type Field Button in New Asset Dialog
    assetTypeContentArea: 'mat-label:contains(Asset Type)',  // Asset Type Content Area in Asset library page
    assetTypeDropdownList: 'mat-option[role="option"]',  // Asset Type Dropdown List in New Asset Dialog
    assetTypeContentAreaDropdownList: 'mat-option',  // Asset Type Dropdown List in Asset library page
    subtypeFieldButton: 'mat-select[ng-reflect-name="assetSubType"]',  // Asset Subtype Field Button in New Asset Dialog
    subTypeContentArea: 'mat-label:contains(Subtype)',  // Asset SubType Content Area in Asset library page
    subtypeDropdownList: 'mat-option[role="option"]',  // Asset Subtype Dropdown List in New Asset Dialog
    subTypeContentAreaDropdownList: 'mat-option',  // Asset SubType Dropdown List in Asset library page
    tagsFieldBox: 'input[maxlength="28"]',  // Tags Field Box in New Asset Dialog
    newAssetDialogConfirmButton: 'button:contains("Confirm")',  // Confirm button in New Asset Dialog
    newAssetDialogCancelButton: 'button:contains("Cancel")',  // Cancel button in New Asset Dialog
    addNewAssetSnackBar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',  // Add New Asset Snack Bar
    assetLibraryRefreshButton: 'button:contains("Refresh")',  // Refresh Button in Asset Library Page
    assetLibraryShowAllButton: 'button:contains("Show All")',  // Show All button in Asset Library Page
    assetLoaderIcon: 'mat-progress-spinner[role="progressbar"]',  // Assets Loader Icon
    assetLibrarySearchBox: 'input[placeholder="Search Available Assets"]',  // Search Box in Asset Library Page
    updateAssetButton: '.mdc-button__label:contains("Update")',  // Update Button in Asset Library Page
    disabledUpdateAssetButton: 'button[ng-reflect-disabled="true"]:contains(Update)',  // Update Button in Asset Library Page
    updateAssetSnackBar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',  // Update Asset Snack Bar
    deleteAssetButton: '.mdc-button__label:contains("Delete")',  // Delete Button in Asset Library Page
    assetLibraryConfirmToDeleteButton: '.mdc-button__label:contains("Delete")',  // Delete Button in Confirmation to Delete Dialog
    assetLibraryCancelToDeleteButton: '.mdc-button__label:contains("Cancel")',  // Cancel Button in Confirmation to Delete Dialog
    deleteAssetSnackBar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',  // Delete Feature Snack Bar
}