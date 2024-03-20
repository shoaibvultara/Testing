const threatListViewSelector = require('../../selectors/threatListViewSelector.js')
const attackPathPopupSelector = require('../../selectors/attackPathPopupSelector.js');
const attackTreeSelector = require('../../selectors/attackTreeSelector.js');
const navBarSelector = require('../../selectors/navBarSelector.js');
import { recurse } from 'cypress-recurse'

var projectName;

describe('Attack Tree', () => {
    var projectId;

    //Creating Project
    before(() => {
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
            expect(newDesignData.project).to.not.be.undefined;            //Have to change because 
            // Extract the project ID from the nested structure
            projectId = newDesignData.project.id;                         //projectId to be used 
            expect(projectId).to.not.be.undefined;
            cy.log("Project ID is: " + projectId);
        })
        cy.getCookie('accessToken').then((cookie) => {
            if (cookie) {
                const cookieValue = cookie.value;
                // Make the API request to generate threats
                cy.request({
                    url: `${Cypress.env('apiURL')}/projects/threatsDb`,
                    method: 'POST',
                    body: {
                        threat: {
                            threatRowNumber: 1, id: "threatid" + 1, projectId: projectId, asset: "Asset Test " + 1,
                            threatScenario: "Threat Scenario " + 1, attackPathName: "Attack Path Name " + 1,
                            damageScenario: "Damage Scenario " + 1, impactF: 1, impacctO: 1, riskLevel: 1,
                            riskScore: 1, treatment: "no treatment", securityPropertyCia: "c"
                        }
                    }
                })
            }
        });
    })

    beforeEach(() => {// Logging In and Loading Project
        cy.viewport(1920, 1080);
        cy.login();
        cy.loadProject(projectId);
    })

    it('“Save Tree As” header option(MAIN-TC-2029, MAIN-TC-2030)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click().then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownNewTree).click().then(() => {
                        recurse(
                            () => cy.get(attackTreeSelector.attackTreeDialogNewTreePopupName).clear().type('Automation Tree'),
                            ($inputField) => $inputField.val() == 'Automation Tree',
                            { delay: 1000 }
                        );
                        cy.get(attackTreeSelector.attackTreeDialogNewTreePopupConfirmButton).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogTreeDropDownSaveTree).click().then(() => {
                                    cy.get(attackTreeSelector.attackTreeDialogSaveTreeAsPopup).should('exist');
                                    cy.get(attackTreeSelector.attackTreeDialogSaveTreeAsPopupConfirmButton).should('be.enabled')
                                    cy.get(attackTreeSelector.attackTreeDialogSaveTreeAsPopupName).clear().then(() => {
                                        cy.get(attackTreeSelector.attackTreeDialogSaveTreeAsPopupConfirmButton).should('not.be.enabled')
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    it('Creating Model then Save As and Save Button Color (MAIN-TC-2031, MAIN-TC-2034)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click().then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownNewTree).click().then(() => {
                        recurse(
                            () => cy.get(attackTreeSelector.attackTreeDialogNewTreePopupName).clear().type('Automation Tree'),
                            ($inputField) => $inputField.val() == 'Automation Tree',
                            { delay: 1000 }
                        ).then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogNewTreePopupConfirmButton).click().then(() => {
                                cy.wait(3000);
                                cy.get(attackTreeSelector.attackTreeDialogNode).eq(0).realClick().realMouseDown().realMouseMove(50, -300).get(attackTreeSelector.attackTreeDialogCanvas).realMouseUp().then(() => {
                                    cy.wait(3000);
                                    cy.get(attackTreeSelector.attackTreeDialogNode).eq(1).realClick().realMouseDown().realMouseMove(-20, -280).get(attackTreeSelector.attackTreeDialogCanvasElement).eq(0).realMouseUp();
                                })
                            })
                        })
                        cy.get(attackTreeSelector.attackTreeButtonColor).should('have.css', 'background-image').and('include', 'attack-tree-unsaved-changes-icon.svg');
                        cy.get(attackTreeSelector.attackTreeDialogSaveIcon).click({ force: true }).then(() => {
                            cy.get(attackTreeSelector.attackTreeButtonColor).should('have.css', 'background-image').and('include', 'attack-tree-button.svg');
                            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogTreeDropDownSaveTree).click().then(() => {
                                    recurse(
                                        () => cy.get(attackTreeSelector.attackTreeDialogSaveTreeAsPopupName).clear().type('Save As Automation Tree'),
                                        ($inputField) => $inputField.val() == 'Save As Automation Tree',
                                        { delay: 1000 }
                                    ).then(() => {
                                        cy.get(attackTreeSelector.attackTreeDialogSaveTreeAsPopupConfirmButton).click().then(() => {
                                            cy.get(attackTreeSelector.attackTreeDialogLoadedTreeButton).invoke('text').should('include', 'Save As Automation');
                                            cy.get(attackTreeSelector.attackTreeDialogCanvasElement).eq(0).should('exist');
                                            cy.get(attackTreeSelector.attackTreeDialogCanvasElement).eq(1).should('exist');
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    it('Confirm Button Functionality Test when Panel is “Loaded”(MAIN-TC-2033)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click().then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogNode).eq(0).realClick({ force: true }).realMouseDown().realMouseMove(50, -200).get(attackTreeSelector.attackTreeDialogCanvas).realMouseUp();
                            }).then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                                        cy.get(attackTreeSelector.attackTreeDialogLoadTreePopup).should('exist');
                                        cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).should('exist').should('be.enabled');
                                        cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupCancelButton).click();
                                    })
                                })
                                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownSaveTree).click().then(() => {
                                        cy.get(attackTreeSelector.attackTreeDialogLoadTreePopup).should('exist');
                                        cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).should('exist').should('be.enabled');
                                        cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupCancelButton).click();
                                    })
                                })
                            })
                            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogTreeDropDownNewTree).click().then(() => {
                                    cy.get(attackTreeSelector.attackTreeDialogLoadTreePopup).should('exist');
                                    cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click().then(() => {
                                        recurse(
                                            () => cy.get(attackTreeSelector.attackTreeDialogNewTreePopupName).clear().type('New Tree'),
                                            ($inputField) => $inputField.val() == 'New Tree',
                                            { delay: 1000 }
                                        );
                                        cy.get(attackTreeSelector.attackTreeDialogNewTreePopupConfirmButton).click();
                                        cy.get(attackTreeSelector.attackTreeDialogCanvasElement).eq(0).should('not.be.visible');
                                        cy.get(attackTreeSelector.attackTreeDialogCanvasElement).eq(1).should('not.be.visible');
                                    });
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    it('Panel State Verification Test when changes are unsaved(MAIN-TC-2035)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click({ force: true }).then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogLoadedTreeButton).invoke('text').should('include', 'Automation Tree');
                                cy.get(attackTreeSelector.attackTreeDialogSaveIcon).should('exist');
                                cy.get(attackTreeSelector.attackTreeDialogFooter).should('exist');
                                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownSaveTree).should('be.enabled');
                                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownChange).should('be.enabled');
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    it('Verify 4 Components in Footer (MAIN-TC-2036)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click({ force: true }).then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click({ force: true }).then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogAND).should('exist');
                                cy.get(attackTreeSelector.attackTreeDialogOR).should('exist');
                                cy.get(attackTreeSelector.attackTreeDialogNode).should('exist');
                                cy.get(attackTreeSelector.attackTreeDialogSAND).should('exist');
                            })
                        })
                    })
                })
            })
        })
    })

    it('Components of Node on Canvas(MAIN-TC-2037, MAIN-TC-2038)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click({ force: true }).then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogNode).eq(0).realClick({ force: true }).realMouseDown().realMouseMove(50, -200).get(attackTreeSelector.attackTreeDialogCanvas).realMouseUp().then(() => {
                                    cy.get(attackTreeSelector.attackTreeDialogCanvasComponentLogo).should('exist');
                                    cy.get(attackTreeSelector.attackTreeDialogCanvasComponentName).should('exist');
                                    cy.get(attackTreeSelector.attackTreeDialogCanvasComponent3Dots).should('exist');
                                    cy.get(attackTreeSelector.attackTreeDialogCanvasComponentNodeText).should('exist');
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    it('Canvas Component Menu Test (MAIN-TC-2042)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click({ force: true }).then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogCanvasComponent3Dots).eq(0).click().then(() => {
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuNodeTextOption).should('exist');
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuDeleteTypeOption).should('exist');
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuChangeTypeOption).should('exist');
                                });
                            })
                        })
                    })
                })
            })
        })
    })

    it('Automatic NodeText Assignment Test(MAIN-TC-2041)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click().then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogNewTreePopupConfirmButton).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogCanvasComponentName).eq(0).invoke('text').should('contain', 'Node');
                                cy.get(attackTreeSelector.attackTreeDialogCanvasComponentNodeText).eq(0).invoke('text').should('contain', 'Node1');
                                cy.get(attackTreeSelector.attackTreeDialogCanvasComponentName).eq(1).invoke('text').should('contain', 'OR');
                                cy.get(attackTreeSelector.attackTreeDialogCanvasComponentNodeText).eq(1).invoke('text').should('contain', 'OR2');
                            })
                        })
                    })
                })
            })
        })
    })

    it('Dragging multiple nodes on Canvas(MAIN-TC-2039)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click({ force: true }).then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogNode).eq(0).realClick({ force: true }).realMouseDown().realMouseMove(50, -200).get(attackTreeSelector.attackTreeDialogCanvas).realMouseUp().then(() => {
                                    cy.get(attackTreeSelector.attackTreeDialogNode).eq(0).realClick({ force: true }).realMouseDown().realMouseMove(80, -500).get(attackTreeSelector.attackTreeDialogCanvas).realMouseUp().then(() => {
                                        cy.get(attackTreeSelector.attackTreeDialogLoadTreeEmptyMessage).should('exist').invoke('text').should('include', 'Only 1 root node is allowed');
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    it('Node Drop-down and Changing Node (MAIN-TC-3213, MAIN-TC-3212, MAIN-TC-3220)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click({ force: true }).then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogCanvasComponent3Dots).eq(0).click().then(() => {
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuDropDown).should('exist');
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuNodeTextOption).should('exist');
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuAssignValueOption).should('exist');
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuChangeTypeOption).should('exist');
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuControlOption).should('exist');
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuLinkChildTreeOption).should('exist');
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuDeleteTypeOption).should('exist');
                                    //Changing Node
                                    cy.get(attackTreeSelector.attackTreeDialogCanvasComponentName).eq(0).invoke('text').should('contain', 'Node');
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuChangeTypeOption).eq(0).click().then(() => {
                                        cy.get(attackTreeSelector.attackTreeCanvasComponentMenuChangeNodeOROption).eq(0).click().then(() => {
                                            cy.get(attackTreeSelector.attackTreeDialogCanvasComponentName).eq(0).invoke('text').should('contain', 'OR');
                                        });
                                    });
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    it('Unlinking the 2nd Component (MAIN-TC-3214, MAIN-TC-3215)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click({ force: true }).then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogCanvasElement).eq(1).realClick({ force: true }).realMouseDown().realMouseMove(80, -500).get(attackTreeSelector.attackTreeDialogCanvas).realMouseUp().then(() => {
                                    cy.get(attackTreeSelector.attackTreeCanvasDragChildComponentConfirmationDialog).should('exist').invoke('text').should('contain', 'The selected node and all of its children will be deleted.').then(() => {
                                        cy.get(attackTreeSelector.attackTreeDialogDeleteTreePopupDeleteButton).click().then(() => {
                                            cy.get(attackTreeSelector.attackTreeDialogCanvasElement).eq(1).should('not.exist');
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    it('Link Attack Path from tree drop down (MAIN-TC-3216)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click({ force: true }).then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLinkAttackPath).click().then(() => {
                                        cy.get(attackTreeSelector.attackTreeDialogLinkAttackPathPopup).should('exist');
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    it('Link Vulnerability from tree drop down (MAIN-TC-3217)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click({ force: true }).then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLinkVulnerability).click().then(() => {
                                        cy.get(attackTreeSelector.attackTreeDialogLinkVulnerabilityPathPopup).should('exist');
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    it('"OR Component" Drop-down & Changing Node(MAIN-TC-3221, MAIN-TC-3222)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click({ force: true }).then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogCanvasComponentName).should('contain', 'OR');  //verifying the OR Gate 
                                cy.get(attackTreeSelector.attackTreeDialogCanvasComponent3Dots).eq(1).click().then(() => {
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuDropDown).should('exist');
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuNodeTextOption).should('exist');
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuChangeTypeOption).should('exist');
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuDeleteTypeOption).should('exist');
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuControlOption).should('not.exist');
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuLinkChildTreeOption).should('not.exist');
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuAssignValueOption).should('not.exist');
                                    //Changing OR to Node
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuChangeTypeOption).eq(1).click().then(() => {
                                        cy.get(attackTreeSelector.attackTreeCanvasComponentMenuChangeNodeNodeOption).eq(1).click().then(() => {
                                            cy.get(attackTreeSelector.attackTreeDialogCanvasComponentName).invoke('text').should('include', 'Node');  //verifying the OR Gate 
                                            cy.get(attackTreeSelector.attackTreeDialogCanvasComponent3Dots).eq(1).click().then(() => {
                                                cy.get(attackTreeSelector.attackTreeCanvasComponentMenuDropDown).should('exist');
                                                cy.get(attackTreeSelector.attackTreeCanvasComponentMenuNodeTextOption).should('exist');
                                                cy.get(attackTreeSelector.attackTreeCanvasComponentMenuChangeTypeOption).should('exist');
                                                cy.get(attackTreeSelector.attackTreeCanvasComponentMenuDeleteTypeOption).should('exist');
                                                cy.get(attackTreeSelector.attackTreeCanvasComponentMenuControlOption).should('exist');
                                                cy.get(attackTreeSelector.attackTreeCanvasComponentMenuLinkChildTreeOption).should('exist');
                                                cy.get(attackTreeSelector.attackTreeCanvasComponentMenuAssignValueOption).should('exist');
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    it('Apply attack tree to threat" button (MAIN-TC-3218)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click({ force: true }).then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogApplyAttackTreeToThreat).click().then(() => {
                                    cy.get(attackTreeSelector.attackTreeDialogApplyAttackTreePopup).should('exist');
                                    cy.get(attackTreeSelector.attackTreeDialogApplyAttackPopupHeading).invoke('text').should('contain', 'Linked Threats');
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    it('Control in 3 dot drop down of a node (MAIN-TC-3223)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click({ force: true }).then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogCanvasComponent3Dots).eq(0).click().then(() => {
                                    cy.get(attackTreeSelector.attackTreeCanvasComponentMenuControlOption).eq(0).click().then(() => {
                                        cy.get(attackTreeSelector.attackTreeCanvasControlPopup).should('exist');
                                    })
                                })
                            })
                        })
                    })
                })
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
