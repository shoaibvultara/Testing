const assetLibrarySelector = require("../../selectors/assetLibrarySelector");
const projectLibrarySelector = require("../../selectors/projectLibrarySelector");
const modelingViewSelector = require("../../selectors/modelingViewSelector");
const featureLibrarySelector = require("../../selectors/featureLibrarySelector");
const navBarSelector = require("../../selectors/navBarSelector");
import { recurse } from 'cypress-recurse'
var projectName;

describe('Asset Library Management', () => {
    var projectId;
    var assetName;
    var updatedAssetName;
    var assetType;
    var subType;
    var tagName;

    before(() => {//Creating Project
        cy.viewport(1920, 1080);
        cy.login();
        // Generate a random project name
        cy.generateProjectName().then(($generatedName) => {
            projectName = $generatedName;
            cy.createProject(projectName);
        })
        cy.window().then((win) => {
            const newDesignData = JSON.parse(win.localStorage.getItem('newDesign'));
            expect(newDesignData).to.not.be.null;
            expect(newDesignData.project).to.not.be.undefined;
            // Extract the project ID from the nested structure
            projectId = newDesignData.project.id;//projectId to be used 
            expect(projectId).to.not.be.undefined;
            cy.log("Project ID is: " + projectId);
        })
        // Generate a random feature name
        cy.generateProjectName().then(($generatedName) => {
            assetName = 'ASET>' + $generatedName;
            updatedAssetName = 'new ASET' + $generatedName;
            assetType = 'Computing Resource';
            subType = 'General Data';
            tagName = 'Automation_Test';
        })
    })

    beforeEach(() => {// Logging in and loading the created project
        cy.viewport(1920, 1080);
        cy.login().then(() => {
            cy.loadProject(projectId);
        })
    })

    it('Verify to add the new asset and verify Assets for a micro component (MAIN-TC-596, MAIN-TC-595, MAIN-TC-2559, MAIN-TC-912))', () => {
        let componentSpecFeature = 'test linking';
        cy.createNewAsset(assetName, assetType, subType, tagName).then(() => {
            cy.visit(Cypress.env("baseURL") + "/modeling");
        }).then(() => {
            const dataTransfer = new DataTransfer();
            cy.get(modelingViewSelector.componentLibraryMicrocontroller).trigger('dragstart', { dataTransfer, force: true });
            cy.get(modelingViewSelector.modelingViewCanvas).trigger('drop', { dataTransfer, force: true, clientX: 400, clientY: 400 });
        }).then(() => {
            cy.get(modelingViewSelector.drawingCanvasMicrocontroller).rightclick();
        }).then(() => {
            cy.wait(2000);
            cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleSelect).click();
            cy.get(modelingViewSelector.componentSpecFeatureSettingTestOption).click();
        }).then(() => {
            cy.get(modelingViewSelector.componentSpecFeaturesSettingsFeaturesSelect).click();
            cy.get(modelingViewSelector.componentSpecFeaturesSettingsFeaturesDropdownList).contains(componentSpecFeature).click();
        }).then(() => {
            cy.get(modelingViewSelector.addFeatureRoleFieldButton).click();
            cy.get(modelingViewSelector.addFeatureRoleDropdownList).first().click();
        }).then(() => {
            cy.get(modelingViewSelector.addFeatureConfirmButton).last().click();
            cy.get(modelingViewSelector.componentSpecFeatureSettingsSubmitButton).click();
        }).then(() => {
            cy.get(modelingViewSelector.securitySettingTab).click();
        }).then(() => {
            recurse(() =>
                cy.get(modelingViewSelector.assetComponentSearchBox).clear().type(assetName),
                ($inputField) => $inputField.val() === assetName,
                { delay: 1000 })
                .should('have.value', assetName);
        }).then(() => {
            cy.get(modelingViewSelector.assetComponentDropdownList).contains(assetName).should('be.visible').click();
            cy.get(modelingViewSelector.assetPropertiesFeatureButtonField).click();
            cy.wait(2000);
        }).then(() => {
            cy.get(modelingViewSelector.assetPropertiesFeatureDropdownList).first().click();
            cy.get(modelingViewSelector.assetPropertiesConfirmButton).last().click();
        }).then(() => {
            cy.get(modelingViewSelector.assetComponentSpinner).should('not.exist');
            cy.get(modelingViewSelector.assetComponentContentTextArea).contains(assetName).should('be.visible');
        })
    })

    it('Verify the updated asset name is showing correctly in all its associated features (MAIN-TC-606, MAIN-TC-604)', () => {
        cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page 
            cy.wait(2000);
            cy.get(projectLibrarySelector.librarySideNavAssetAnchor).click();  // Go to Asset tab
        }).then(() => {
            let indexOfRecord = 0;
            cy.get(assetLibrarySelector.assetNameContentTextArea).each(($element) => {
                if ($element.val() === assetName) {
                    cy.get(assetLibrarySelector.assetNameContentTextArea).eq(indexOfRecord).click().clear().type(updatedAssetName);
                    cy.get(assetLibrarySelector.updateAssetButton).eq(indexOfRecord).click();
                    cy.get(assetLibrarySelector.snackBarMessage).should('include.text', 'Asset successfully updated')
                    return false;// to exist from the .each() loop
                }
                indexOfRecord++;
            }).then(() => {
                cy.visit(Cypress.env('baseURL') + '/library'); // Go to Library Page
                cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
                cy.wait(3000);
            }).then(() => {
                cy.get(featureLibrarySelector.createNewFeatureButton).click();
                cy.get(featureLibrarySelector.showAssetLibraryButton).click();
            }).then(() => {
                recurse(() =>
                    cy.get(featureLibrarySelector.searchAvailableAssetFieldBox).click({ force: true }).clear().type(updatedAssetName),
                    ($inputField) => $inputField.val() === updatedAssetName,
                    { delay: 1000 })
                    .should('have.value', updatedAssetName);
            }).then(() => {
                cy.get(featureLibrarySelector.assetChipDialog).contains(updatedAssetName).should('exist');
            })
        })
    })

    it('Verify that if User clicked on "Delete" button in Confirmation to delete box of Asset tab in library page the asset is deleted successfully (MAIN-TC-2779, MAIN-TC-607, MAIN-TC-599)', () => {
        cy.deleteAsset(updatedAssetName);
    })

    it('Verify the newly added asset is shown properly in feature library (MAIN-TC-543, MAIN-TC-544, MAIN-TC-554, MAIN-TC-584, MAIN-TC-590, MAIN-TC-591, MAIN-TC-603)', () => {
        let assetName = 'TC-543_ASET>' + projectName;
        cy.createNewAsset(assetName, assetType, subType, tagName).then(() => {
            cy.visit(Cypress.env('baseURL') + '/library'); // Go to Library Page
        }).then(() => {
            cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
            cy.wait(3000);
        }).then(() => {
            cy.get(featureLibrarySelector.createNewFeatureButton).click();
            cy.get(featureLibrarySelector.showAssetLibraryButton).click();
        }).then(() => {
            recurse(() =>
                cy.get(featureLibrarySelector.searchAvailableAssetFieldBox).click({ force: true }).clear().type(assetName),
                ($inputField) => $inputField.val() === assetName,
                { delay: 1000 })
                .should('have.value', assetName);
        }).then(() => {
            cy.get(featureLibrarySelector.assetChipDialog).contains(assetName).should('exist');
            cy.get(navBarSelector.dialogCloseIcon).click();
        }).then(() => {
            cy.get(projectLibrarySelector.librarySideNavAssetAnchor).click();
        }).then(() => {
            recurse(() =>
                cy.get(assetLibrarySelector.assetLibrarySearchBox).clear().type(assetName),
                ($inputField) => $inputField.val() === assetName,
                { delay: 1000 })
                .should('have.value', assetName);
        }).then(() => {
            cy.get(navBarSelector.circleProgressSpinner).should('exist');
            cy.get(assetLibrarySelector.assetNameContentTextArea).should('have.value', assetName);
        }).then(() => {
            cy.get(assetLibrarySelector.assetLibraryShowAllButton).click();
        }).then(() => {
            cy.get(navBarSelector.subsequentSnackBarElement)
                .should('be.visible')
                .and('include.text', 'All')
                .and('include.text', 'assets in your asset library are shown');
        }).then(() => {
            cy.get(assetLibrarySelector.assetLibraryRefreshButton).click();
        }).then(() => {
            cy.get(navBarSelector.circleProgressSpinner).should('exist');
        }).then(() => {
            cy.deleteAsset(assetName);
        })
    })

    it('Verify the user shall select the sub-Type for "Data At Rest" and "Data-In Transit" assets in order to update them (MAIN-TC-965)', () => {
        let assetName = 'TC-965_ASET>' + projectName;
        cy.createNewAsset(assetName, assetType, subType, tagName).then(() => {
            cy.visit(Cypress.env('baseURL') + '/library'); // Go to Library Page 
        }).then(() => {
            cy.wait(2000);
            cy.get(projectLibrarySelector.librarySideNavAssetAnchor).click();  // Go to Asset tab
        }).then(() => {
            recurse(
                () => cy.wrap(Cypress.$(assetLibrarySelector.assetLoaderIcon).length),
                ($loaderExist) => $loaderExist == false,//length === 0
                { delay: 1000 }
            )
        }).then(() => {
            let indexOfRecord = 0;
            let assetType = 'Data In Transit';
            cy.get(assetLibrarySelector.assetNameContentTextArea).each(($element) => {
                if ($element.val() === assetName) {
                    cy.get(assetLibrarySelector.assetTypeContentArea).eq(indexOfRecord).click({ force: true }).then(() => {
                        cy.get(assetLibrarySelector.globalDropDownOption).contains(assetType).click();
                        cy.get(assetLibrarySelector.updateAssetButton).eq(indexOfRecord).should('not.be.enabled');
                    }).then(() => { })
                        cy.get(assetLibrarySelector.subTypeContentArea).eq(indexOfRecord).click({ force: true }).then(() => {
                            cy.get(assetLibrarySelector.globalDropDownOption).contains(subType).click();
                            cy.get(assetLibrarySelector.updateAssetButton).eq(indexOfRecord).click();
                        }).then(() => {
                            cy.get(assetLibrarySelector.snackBarMessage).should('include.text', 'Asset successfully updated')
                        })
                    return false;// to exist from the .each() loop
                }
                indexOfRecord++;
            }).then(() => {
                cy.deleteAsset(assetName);
            })
        })
    })

    it('Verify Updating the Asset Name to empty string in Feature Library (MAIN-TC-598)', () => {
        let assetName = 'TC-598_ASET>' + projectName;
        cy.createNewAsset(assetName, assetType, subType, tagName).then(() => {
            cy.visit(Cypress.env('baseURL') + '/library'); // Go to Library Page 
        }).then(() => {
            cy.get(projectLibrarySelector.librarySideNavAssetAnchor).click();  // Go to Asset tab
            cy.wait(2000);
        }).then(() => {
            let indexOfRecord = 0;
            cy.get(assetLibrarySelector.assetNameContentTextArea).each(($element) => {
                if ($element.val() === assetName) {
                    cy.get(assetLibrarySelector.assetNameContentTextArea).eq(indexOfRecord).click().clear();
                    cy.get(assetLibrarySelector.updateAssetButton).eq(indexOfRecord).should('not.be.enabled');
                    return false;// to exist from the .each() loop
                }
                indexOfRecord++;
            }).then(() => {
                cy.deleteAsset(assetName);
            })
        })
    })
})

describe('CLEANUP: Project Deletion', () => {
    it('Deleting The Project If Created', () => {
        cy.viewport(1920, 1080);
        cy.login().then(() => {
            cy.deleteProject(projectName);
        })
    })
})