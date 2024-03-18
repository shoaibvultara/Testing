module.exports = {
    //side nav bar
    librarySideNavModuleAnchor: 'mat-nav-list > a:contains(Module)',
    librarySideNavFeatureAnchor: 'mat-nav-list > a:contains(Feature)',
    librarySideNavAssetAnchor: 'mat-nav-list > a:contains(Asset)',
    librarySideNavGoalClaimAnchor: 'mat-nav-list > a:contains(Goal & Claim)',
    librarySideNavControlAnchor: 'mat-nav-list > a:contains(Control)',
    librarySideNavRequirementAnchor: 'mat-nav-list > a:contains(Requirement)',
    librarySideNavPolicyAnchor: 'mat-nav-list > a:contains(Policy)',
    librarySideNavAttackActionAnchor: 'mat-nav-list > a:contains(Attack Action)',

    //more button drop down options
    libraryMoreOptionsButton: 'button:contains(more_horiz)',
    projectLibraryCreateNewButton: 'button:contains(Create New)',
    linkingDialogShowAllButton: 'button[role="switch"]',
    linkingDialogCheckboxInput: 'input[type="checkbox"]',

    //control library
    moreOptionsLinkedRequirementsButton: 'button:contains(Linked Requirements)',
    moreOptionsDeleteControlButton: 'button:contains(Delete Control)',

    //requirement library
    requirementLibraryDeleteButton: 'button:contains(delete)',
    requirementLibraryDescriptionCell: 'textarea[class*="requirement-page-description"]',
    reqLibraryAddUpdateRequirementDialog: 'add-update-requirement',

    //goal library
    cybersecurityGoalTab: 'div[mattablabelwrapper]:contains(Cybersecurity Goal)',
    moreOptionsDeleteGoalButton: 'button:contains(Delete Goal)',
    moreOptionsLinkedControlsButton: 'button:contains(Linked Controls)',
    searchForGoalInput: 'input[placeholder="Search Available Goals"]',

    //claim library
    cybersecurityClaimTab: 'div[mattablabelwrapper]:contains(Cybersecurity Claim)',
    moreOptionsDeleteClaimButton: 'button:contains(Delete Claim)',    

    //policy library
    createNewPolicyButton: 'button:contains(Create New Policy)',
    deletePolicyIcon: 'mat-icon:contains(delete)',
    policyNumberTableCell: 'td[class*="mat-column-no"]',
    policyEnabledCheckbox: 'input[type="checkbox"]',
}