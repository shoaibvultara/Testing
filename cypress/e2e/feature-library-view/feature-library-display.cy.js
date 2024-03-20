const featureLibrarySelector = require("../../selectors/featureLibrarySelector");
const projectLibrarySelector = require("../../selectors/projectLibrarySelector");
const moduleLibrarySelector = require("../../selectors/moduleLibrarySelector");
const navBarSelector = require("../../selectors/navBarSelector");
import { recurse } from 'cypress-recurse'
var projectName;

describe('Feature Library Display', () => {
    var projectId;
    var assetName;
    var featureType;
    var featureRole;

    before(() => {//Creating Project
        cy.viewport(1920, 1080);
        cy.login();
        // Generate a random project name
        cy.generateProjectName().then(($generatedName) => {
            projectName = $generatedName;
            assetName = 'Ethernet message';
            featureType = 'Data Transmission';
            featureRole = 'Data Redirector';
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
    })

    beforeEach(() => {// Logging in and loading the created project
        cy.viewport(1920, 1080);
        cy.login().then(() => {
            cy.loadProject(projectId);
        })
    })

    it('Verify the "Create New Feature" button working with empty String Feature Name:" " (MAIN-TC-509)', () => {
        cy.visit(Cypress.env('baseURL') + '/library'); // Go to Library Page
        cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
        cy.wait(1000);
        cy.get(featureLibrarySelector.createNewFeatureButton).click().then(() => {
            cy.get(featureLibrarySelector.featureNameFieldBox).click().clear();
            cy.get(featureLibrarySelector.showAssetLibraryButton).click();
            cy.get(featureLibrarySelector.featureNameErrorMessage).should('be.visible');
            cy.get(featureLibrarySelector.createFeatureDisabledButton).should('be.disabled');
        })
    })

    it('Verify the Searching of Available Assets in "Edit Feature" Dialog (MAIN-TC-552)', () => {
        cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page
            cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
            cy.wait(1000);
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
            cy.wait(2000);
            cy.get(featureLibrarySelector.assetChipDialog).should('be.visible').contains(assetName);
        })
    })

    it('Verify the clicking at "Edit Feature" button (MAIN-TC-525, MAIN-TC-581)', () => {
        cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page 
            cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
            cy.wait(1000);
        }).then(() => {
            cy.get(featureLibrarySelector.editFeatureButton).eq(0).click();
            cy.get(featureLibrarySelector.confirmChangesButton).should('be.visible');
            cy.get(featureLibrarySelector.deleteFeatureButton).should('be.visible');
            cy.get(featureLibrarySelector.showAssetLibraryButton).should('be.visible');
            cy.get(featureLibrarySelector.editFeatureRole).scrollIntoView().should('be.visible').click()
        }).then(() => {
            cy.get(featureLibrarySelector.editFeatureRoleOptionButton).contains('Redirector').should('be.visible');
        })
    })

    it('Verify the user can read the feature in feature library tab (MAIN-TC-564, MAIN-TC-540)', () => {
        cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page
            cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
            cy.wait(1000);
        }).then(() => {
            cy.get(featureLibrarySelector.featureContentTextArea).each(($featureContentTextArea) => {
                cy.wrap($featureContentTextArea).should('be.visible'); // Assert that each feature content textarea are visible
            })
        })
    })

    it('Verify the existing assets can be read from feature library tab (MAIN-TC-542)', () => {
        let featureName = 'TC_564_FTR>' + projectName;
        cy.createNewFeature(featureName, assetName, featureType).then(() => {
            cy.visit(Cypress.env('baseURL') + '/library'); // Go to Library Page
            cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
            cy.wait(1000);
        }).then(() => {
            let indexOfRecord = 0;
            cy.get(featureLibrarySelector.featureContentTextArea).each(($element) => {
                if ($element.text() == featureName) {
                    cy.get(featureLibrarySelector.editFeatureButton).eq(indexOfRecord).click();
                    return false;// to exist from the .each() loop
                }
                indexOfRecord++;
            }).then(() => {
                cy.get(featureLibrarySelector.featureAssetDialog).last().contains(assetName).should('be.visible');
                cy.get(navBarSelector.dialogCloseIcon).click();
            }).then(() => {
                cy.deleteFeature(featureName);
            })
        })
    })

    it('Verify the updated feature type is displayed properly in feature library in "Edit feature" (MAIN-TC-537, MAIN-TC-536)', () => {
        let featureName = 'TC_537_FTR>' + projectName;
        cy.createNewFeature(featureName, assetName, featureType).then(() => {
            cy.visit(Cypress.env('baseURL') + '/library'); // Go to Library Page
            cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
            cy.wait(1000);
        }).then(() => {
            let indexOfRecord = 0;
            cy.get(featureLibrarySelector.featureContentTextArea).each(($element) => {
                if ($element.text() == featureName) {
                    cy.get(featureLibrarySelector.editFeatureButton).eq(indexOfRecord).click();
                    return false;// to exist from the .each() loop
                }
                indexOfRecord++;
            }).then(() => {
                cy.get(featureLibrarySelector.featureTypeFieldButton).should('contain', featureType)
                cy.get(navBarSelector.dialogCloseIcon).click();
            }).then(() => {
                cy.deleteFeature(featureName);
            })
        })
    })

    it('Verify the updated feature name in Module library page (MAIN-TC-535)', () => {
        let featureName = 'FTR>' + projectName;
        let updatedFeatureName = 'TC535_FTR_' + projectName.substring(20);
        let moduleName = 'Module_' + projectName.substring(20);
        let moduleCategory = 'Medical';
        cy.createNewFeature(featureName, assetName, featureType).then(() => {
            cy.createNewModule(moduleName, moduleCategory)
        }).then(() => {
            cy.editModuleFeature(moduleName, featureName, featureRole)
        }).then(() => {
            cy.get(navBarSelector.dialogCloseIcon).click();
            cy.visit(Cypress.env('baseURL') + '/library'); // Go to Library Page
            cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
            cy.wait(1000);
        }).then(() => {
            let indexOfRecord = 0;
            cy.get(featureLibrarySelector.featureContentTextArea).each(($element) => {
                if ($element.text() == featureName) {
                    cy.get(featureLibrarySelector.editFeatureButton).eq(indexOfRecord).click();
                    return false;// to exist from the .each() loop
                }
                indexOfRecord++;
            }).then(() => {
                recurse(() =>
                    cy.get(featureLibrarySelector.featureNameFieldBox).clear().type(updatedFeatureName),
                    ($inputField) => $inputField.val() === updatedFeatureName,
                    { delay: 1000 })
                    .should('have.value', updatedFeatureName)
            }).then(() => {
                cy.get(featureLibrarySelector.confirmChangesButton).click();
            }).then(() => {
                cy.visit(Cypress.env('baseURL') + '/library'); // Go to Library Page (It redirects to Module page by default)
                cy.wait(2000);
                cy.get(projectLibrarySelector.librarySideNavModuleAnchor).click();
            }).then(() => {
                let indexOfRecord = 0;
                cy.get(moduleLibrarySelector.moduleNameContentTextArea).each(($element) => {
                    if ($element.val() === moduleName) {
                        cy.get(moduleLibrarySelector.moduleFeatureContentArea).eq(indexOfRecord).should('contain', updatedFeatureName);
                        return false;// to exist from the .each() loop
                    }
                    indexOfRecord++;
                })
            }).then(() => {
                cy.deleteModule(moduleName);
            })
        }).then(() => {
            cy.deleteFeature(updatedFeatureName);
        })
    })

    it('Verify Show All and refresh buttons functionality and their loading spinners (MAIN-TC-469, MAIN-TC-495, MAIN-TC-501, MAIN-TC-502)', () => {
        cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page
            cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click(); // Go to Feature tab
        }).then(() => {
            cy.get(featureLibrarySelector.featureLibraryShowAllButton).click();
        }).then(() => {
            cy.get(navBarSelector.circleProgressSpinner).should('exist');
            cy.get(navBarSelector.subsequentSnackBarElement)
                .should('be.visible')
                .and('include.text', 'All')
                .and('include.text', 'features in your feature library are shown');
        }).then(() => {
            cy.get(featureLibrarySelector.featureLibraryRefreshButton).click().then(() => {
                cy.get(navBarSelector.circleProgressSpinner).should('exist');
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