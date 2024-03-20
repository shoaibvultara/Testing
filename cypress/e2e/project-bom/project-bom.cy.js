import { recurse } from 'cypress-recurse';
const projectBomSelector = require('../../selectors/projectBomSelector.js');
const modelingViewSelector = require('../../selectors/modelingViewSelector.js');
const projectTriggerSelector = require('../../selectors/projectTriggerSelector.js');
const navBarSelector = require("../../selectors/navBarSelector");
var projectName;

describe('Project BOM Test Suite', () => {
    var projectId;
    var bom;

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
        cy.createModel().then(() => {
            bom = {
                vendor: 'Automation_Vendor',
                product: 'Automation_Product',
                version: '0',
                part: 'Application',
                component: 'Module0',
            }
            cy.addNewBom(bom).then(() => {
                cy.get(projectBomSelector.projectBomMoreActionsButton).should('have.length', 1);
            })
        })
    })

    beforeEach(() => {// Logging in and loading the created project
        cy.viewport(1920, 1080);
        cy.login();
        cy.loadProject(projectId);
        bom = {
            vendor: 'Automation_Vendor',
            product: 'Automation_Product',
            version: '0',
            part: 'Application',
            component: 'Module0',
        };
    })

    it('Verify that the "Add from Micro Library" button is displayed on the Project BOM page, existing BOM must have a column BOM ID (MAIN-TC-1839, MAIN-TC-2392, MAIN-TC-3058)', () => {
        cy.visit(Cypress.env('baseURL') + '/project-bom').then(() => {
            cy.get(projectBomSelector.projectBomAddFromMicroLibraryButton).should('be.visible').click();
            cy.wait(1000);
            cy.get(projectBomSelector.addNewBomFormVersionInput).should('exist').then(() => {
                recurse(() =>
                    cy.get(projectBomSelector.addNewBomFormVersionInput).clear().type(bom.version),
                    ($inputField) => $inputField.val() === bom.version,
                    { delay: 1000 })
                    .should('have.value', bom.version);
            }).then(() => {
                cy.get(navBarSelector.confirmDialogueCancelButton).click();
                cy.get(projectBomSelector.projectBomIdTableHeader).should('be.visible');
            })
        })
    })

    it('Verify that user can add project BOM, where BOM are already present (MAIN-TC-2393)', () => {
        cy.visit(Cypress.env('baseURL') + '/project-bom').then(() => {
            bom.vendor = bom.product = 'MAIN-TC-2393';
            cy.addNewBom(bom).then(() => {
                cy.get(projectBomSelector.projectBomMoreActionsButton).should('have.length.at.least', 2);
                cy.get(projectBomSelector.projectBomVendorCell).should('be.visible').then(($vendorCell) => {
                    expect($vendorCell).to.include.text(bom.vendor);
                })
                cy.get(projectBomSelector.projectBomProductCell).should('be.visible').then(($productCell) => {
                    expect($productCell).to.include.text(bom.product);
                })
            })
        })
    })

    it('Verify that if user updates the name of component it is also updated in ProjectBOM page (MAIN-TC-2201)', () => {
        cy.visit(Cypress.env('baseURL') + '/modeling').then(() => {
            cy.get(modelingViewSelector.drawingCanvasModule)
                .rightclick()
                .then(() => {
                    cy.get(modelingViewSelector.drawingCanvasMicrocontroller).rightclick({ force: true }).then(() => {
                        cy.get(modelingViewSelector.componentSpecSoftwareBomLabel).click();
                        cy.get(modelingViewSelector.componentSpecSoftwareBomOption).contains(bom.vendor).click();
                    })
                });
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/project-bom').then(() => {
                cy.get(projectBomSelector.projectBomComponentCell).should('be.visible').then(($vendorCell) => {
                    expect($vendorCell).to.include.text(bom.component);
                })
            })
        }).then(() => {
            bom.component = 'New Component Name';
            cy.visit(Cypress.env('baseURL') + '/modeling').then(() => {
                cy.get(modelingViewSelector.drawingCanvasModule)
                    .rightclick()
                    .then(() => {
                        cy.get(modelingViewSelector.drawingCanvasMicrocontroller).rightclick({ force: true }).then(() => {
                            cy.wait(1000);
                            recurse(
                                () => cy.get(modelingViewSelector.componentSpecComponentNameInput).clear().type(bom.component),
                                ($inputField) => $inputField.val() === bom.component,
                                { delay: 1000 }
                            );
                        })
                    }).then(() => {
                        cy.get(modelingViewSelector.modelingViewSaveIcon).click();
                    })
            })
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/project-bom').then(() => {
                cy.get(projectBomSelector.projectBomComponentCell).should('be.visible').then(($vendorCell) => {
                    expect($vendorCell).to.include.text(bom.component);
                })
            })
        })
    })

    it('Verify that automatic project trigger generation for the Project BOM (MAIN-TC-2407)', () => {
        cy.visit(Cypress.env('baseURL') + '/monitoring').then(() => {
            cy.get(projectTriggerSelector.projectTriggerListTab).should('be.visible').then(() => {
                cy.get(projectTriggerSelector.projectTriggerListTab).click();
            }).then(() => {
                cy.get(projectTriggerSelector.generateTriggerButton).click().then(() => {
                    cy.get(projectTriggerSelector.selectAllText).click();
                    cy.get(projectTriggerSelector.ProjectBomText).click();
                }).then(() => {
                    cy.get(projectTriggerSelector.generateTriggerDialogGenerateButton).click().then(() => {
                        cy.get(projectTriggerSelector.triggerNameTextArea).eq(0).should('have.attr', 'ng-reflect-model', bom.product);
                        cy.get(projectTriggerSelector.triggerNameTextArea).eq(3).should('have.attr', 'ng-reflect-model', bom.vendor);
                    })
                })
            })
        })
    })

    it('Verify the new tab, "Link to Asset" in the SBOM edit dialog window (MAIN-TC-3118)', () => {
        cy.visit(Cypress.env('baseURL') + '/project-bom').then(() => {
            bom.vendor = bom.product = 'MAIN-TC-3118';
            cy.addNewBom(bom).then(() => {
                cy.wait(2000);
                cy.visit(Cypress.env('baseURL') + '/project-bom').then(() => {
                    cy.get(projectBomSelector.projectBomVendorCell).eq(0).click();
                }).then(() => {
                    cy.get(projectBomSelector.linkToAssetTab).should('be.visible').click().then(() => {
                        cy.get(projectBomSelector.connectedGatewayDialog).should('be.visible');
                    })
                })
            })
        })
    })

    it('Verify that the user is not allowed to edit the Component field in the Edit BOM dialog window (MAIN-TC-1848)', () => {
        cy.visit(Cypress.env('baseURL') + '/project-bom').then(() => {
            bom.vendor = bom.product = 'MAIN-TC-1848';
            cy.addNewBom(bom).then(() => {
                cy.visit(Cypress.env('baseURL') + '/project-bom').then(() => {
                    cy.get(projectBomSelector.projectBomVendorCell).eq(0).click();
                }).then(() => {
                    cy.get(projectBomSelector.editBomDialogComponentField).should('be.disabled');
                })
            })
        })
    })

    it('Verify the user input search/Filter option on the Add from micro library dialog (MAIN-TC-1854, MAIN-TC-3059, MAIN-TC-3060)', () => {
        let filterOption = 'core i5-7640x';
        cy.visit(Cypress.env('baseURL') + '/project-bom').then(() => {
            cy.get(projectBomSelector.projectBomAddFromMicroLibraryButton).click()
        }).then(() => {
            cy.wait(1000);
            cy.get(projectBomSelector.addFromMicroLibraryFilterOption).should('exist');
            recurse(() =>
                cy.get(projectBomSelector.addFromMicroLibraryFilterOption).clear().type(filterOption),
                ($inputField) => $inputField.val() === filterOption,
                { delay: 1000 })
                .should('have.value', filterOption);
        }).then(() => {
            cy.wait(1000);
            cy.get(projectBomSelector.addFromMicroLibraryFilterListOption).should('contain', filterOption);
        })
    })

    it('Verify the chip button displayed when the user selects an SBOM from the list (MAIN-TC-1864, MAIN-TC-1838)', () => {
        cy.visit(Cypress.env('baseURL') + "/modeling").then(() => {
            cy.get(navBarSelector.navBarViewButton).click();
        }).then(() => {
            cy.get(navBarSelector.viewListProjectBomButton).should('be.visible');
        }).then(() => {
            bom.vendor = bom.product = 'MAIN-TC-1864';
            cy.addNewBom(bom);
            cy.wait(1000);
        }).then(() => {
            cy.visit(Cypress.env("baseURL") + "/modeling").then(() => {
                cy.get(modelingViewSelector.drawingCanvasMicrocontroller).rightclick();
                cy.wait(2000);
            }).then(() => {
                cy.get(modelingViewSelector.componentSpecSoftwareBomLabel).click();
                cy.get(modelingViewSelector.componentSpecSoftwareBomOption).contains(bom.vendor).click();
            }).then(() => {
                cy.get(modelingViewSelector.modelingViewSnackBar).should('include.text', 'Changes saved successfully.');
                cy.get(modelingViewSelector.componentSpecSoftwareBomChipDialog).should('contain', bom.vendor)
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