module.exports = {
    projectBomAddNewBomButton: 'button:contains("Add New BOM")',
    projectBomAddFromMicroLibraryButton: 'button:contains("Add from Micro Library")',
    addNewBomFormVersionInput: 'input[formcontrolname="bomVersion"]',
    addFromMicroLibraryFilterOption: 'input[ng-reflect-placeholder="Filter"]',
    addFromMicroLibraryFilterListOption: 'mat-list-option',
    projectBomIdTableHeader: 'th:contains(ID)',
    projectBomVendorCell: 'p[class="bom-table-data"]',
    projectBomProductCell: 'td[class*="mat-column-product"]',
    projectBomComponentCell: 'td[class*="mat-column-component"]',

    projectBomImportBomButton: 'button:contains("Import BOM")',
    projectBomSearchAvailableBomInput: 'input[placeholder="Search Avaliable BOM"]',
    projectBomMoreActionsButton: 'button:contains("more_horiz")',

    addNewBomDialogProductInput: 'input[ng-reflect-name="product"]',
    addNewBomDialogVendorInput: 'input[ng-reflect-name="vendor"]',
    addNewBomDialogPartSelect: 'mat-select[ng-reflect-name="part"]',
    addNewBomDialogPartOption: 'mat-option',
    addNewBomDialogConfirmButton: '.mdc-button__label:contains("Confirm")',

    importBomDialogChooseFileButton: 'input[type="file"]',
    importBomDialogNextButton: 'button:contains("Next")',
    importBomDialogVultaraFieldSelect: 'mat-select',
    importBomDialogVultaraFieldPartOption: 'mat-option:contains("Part")',
    importBomDialogVultaraFieldVendorOption: 'mat-option:contains("Vendor")',
    importBomDialogVultaraFieldProductOption: 'mat-option:contains("Product")',

    moreActionsButtonDeleteBomButton: 'button:contains("Delete BOM")',
    moreActionsButtonDuplicateBomButton: 'button:contains("Duplicate BOM")',

    deleteLinkedVulnerability: 'input[type="checkbox"]' ,
    deletionDialogDeleteButton: '.mdc-button__label:contains("Confirm")',
    linkToAssetTab: 'h2:contains(Link To Asset)',
    connectedGatewayDialog: 'mat-label:contains(Connected Gateway)',
    editBomDialogComponentField: 'input[formcontrolname="componentName"]',
}
