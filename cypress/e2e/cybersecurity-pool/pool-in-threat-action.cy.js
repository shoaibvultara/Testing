import { recurse } from 'cypress-recurse';
const cybersecurityGoalSelector = require('../../selectors/cybersecurityGoalSelector.js');
const cybersecurityPoolSelector = require('../../selectors/cybersecurityPoolSelector.js');
const navBarSelector = require('../../selectors/navBarSelector.js');
const threatListViewSelector = require('../../selectors/threatListViewSelector.js');
var projectName;

describe('Cybersecurity Pools In Threat List View', () => {
    var projectId;

    before(() => {//Creating Project
        cy.viewport(1920, 1080);
        cy.login();
        //Generate a random project name
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
        }).then(() => {
            cy.createModel().then(() => {
                cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
                    cy.get(threatListViewSelector.threatListViewExpandThreatIcon).should('be.visible');
                })
            })
        })
    })

    beforeEach(() => {// Logging in and loading the created project
        cy.viewport(1920, 1080);
        cy.login();
        cy.loadProject(projectId);
    })

    it('Verify the adding a new goal from threat list view (MAIN-TC-190, , MAIN-TC-633)', () => {
        let threatRow = 1;
        let goalDescription = 'Adding New Goal From ThreatListView';
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.expandThreat(threatRow);
        }).then(() => {
            cy.changeThreatTreatment(threatRow, 'reduce').then(() => {
                cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                    .should('have.length', 2).first().click({ force: true });//1st add goal, 2nd add control
            }).then(() => {
                recurse(
                    () => cy.get(threatListViewSelector.threatListViewAddGoalDialogDescription).clear().type(goalDescription),
                    ($inputField) => $inputField.val() === goalDescription,
                    { delay: 1000 }
                ).then(() => {
                    cy.get(navBarSelector.confirmDialogueConfirmButton).click();
                }).then(() => {
                    cy.get(threatListViewSelector.threatListViewExpandedRecordId).contains('GL 1').should('be.visible');
                    cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).should('be.visible');
                })
            })
        })
    })

    it('Verify the updated goal is reflecting in all its threats (MAIN-TC-29)', () => {
        let threatRow = 1;
        let goalDescription = 'this description should be updated';
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.threatListViewExpandThreatIcon).should('be.visible').then(() => {
                cy.get('body').then($pageContent => {
                    if ($pageContent.find(threatListViewSelector.threatListViewExpandedThreatDiv).length == 0) {//check if the threat is not expanded
                        cy.expandThreat(threatRow);
                    }
                })
            })
        }).then(() => {
            cy.changeThreatTreatment(threatRow, 'reduce').then(() => {
                cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                    .should('have.length', 2).first().click({ force: true });//1st add goal, 2nd add control
            }).then(() => {
                recurse(
                    () => cy.get(threatListViewSelector.threatListViewAddGoalDialogDescription).clear().type(goalDescription),
                    ($inputField) => $inputField.val() === goalDescription,
                    { delay: 1000 }
                ).then(() => {
                    cy.get(navBarSelector.confirmDialogueConfirmButton).click();
                }).then(() => {
                    cy.get(threatListViewSelector.threatListViewExpandedRecordId).contains('GL').should('be.visible');
                    cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).should('be.visible');
                })
            })
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
                cy.get(cybersecurityPoolSelector.goalPoolGoalContentTextArea).should('include.value', goalDescription).then(() => {
                    goalDescription = 'this description should remain';
                    cy.updateGoal({ row: 0, newGoalContent: goalDescription }).then(() => {
                        cy.get(cybersecurityPoolSelector.goalPoolGoalContentTextArea).should('include.value', goalDescription);
                    })
                })
            })
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
                cy.get(threatListViewSelector.threatListViewExpandedRecordId).contains('GL').should('be.visible');
                cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).should('be.visible');
            })
        })
    })

    it('Verify goals can be reused in the same project (MAIN-TC-122, MAIN-TC-372, MAIN-TC-374)', () => {
        let threatRow = 1;
        let goalDescription = 'this goal will be added to two threats';
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.saveAsNewThreat(threatRow);
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandThreatIcon).should('be.visible').then(() => {
                cy.get('body').then($pageContent => {
                    if ($pageContent.find(threatListViewSelector.threatListViewExpandedThreatDiv).length == 0) {//check if the threat is not expanded
                        cy.expandThreat(threatRow);
                    }
                })
            })
        }).then(() => {//add goal to first threat
            cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                .should('have.length', 2).first().click({ force: true });//1st add goal, 2nd add control
            recurse(
                () => cy.get(threatListViewSelector.threatListViewAddGoalDialogDescription).clear().type(goalDescription),
                ($inputField) => $inputField.val() === goalDescription,
                { delay: 1000 }
            ).then(() => {
                cy.get(navBarSelector.confirmDialogueConfirmButton).click();
            }).then(() => {
                cy.get(threatListViewSelector.threatListViewExpandedRecordId).contains('GL').should('be.visible');
                cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).should('be.visible');
            })
        }).then(() => {//add the goal to the second threat
            cy.foldThreat(threatRow).then(() => {
                threatRow = 2;
                cy.expandThreat(threatRow).then(() => {
                    cy.changeThreatTreatment(threatRow, 'reduce');
                    cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                        .should('have.length', 2).first().click({ force: true });//1st add goal, 2nd add control
                    cy.get(threatListViewSelector.threatListViewAddNewGoalFromPool).click().then(() => {
                        cy.get(navBarSelector.dropDownOption).contains(goalDescription).click();
                    }).then(() => {
                        cy.get(navBarSelector.confirmDialogueConfirmButton).click();
                    }).then(() => {
                        cy.get(threatListViewSelector.threatListViewExpandedRecordId).contains('GL').should('be.visible');
                        cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).should('be.visible');
                    })
                }).then(() => {
                    cy.foldThreat(threatRow);
                })
            })
        })
    })

    it('Remove functionality of Goal from Threat (MAIN-TC-125, MAIN-TC-127)', () => {
        let threatRow = 1;
        let goalDescription = 'MAIN-TC-125';
        let goalNum;
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.expandThreat(threatRow);
        }).then(() => {
            cy.changeThreatTreatment(threatRow, 'reduce').then(() => {
                cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                    .should('have.length', 2).first().click({ force: true });//1st add goal, 2nd add control
            }).then(() => {
                recurse(
                    () => cy.get(threatListViewSelector.threatListViewAddGoalDialogDescription).clear().type(goalDescription),
                    ($inputField) => $inputField.val() === goalDescription,
                    { delay: 1000 }
                ).then(() => {
                    cy.get(navBarSelector.confirmDialogueConfirmButton).click();
                }).then(() => {
                    cy.get(threatListViewSelector.threatListViewExpandedRecordId).contains('GL').should('be.visible').then((recordId) => {
                        goalNum = recordId.text();
                    });
                    cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).should('be.visible');
                })
            })
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).click().then(() => {
                cy.get(threatListViewSelector.poolDialogRemoveButton).click()
            }).then(() => {
                cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Cybersecurity goal removed successfully!')
            })
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon).should('have.length', 2).first().click({ force: true }).then(() => {//1st add goal, 2nd add control
                cy.get(threatListViewSelector.threatListViewAddNewGoalFromPool).click().then(() => {
                    cy.get(navBarSelector.dropDownOption).contains(goalDescription).click();
                }).then(() => {
                    cy.get(navBarSelector.confirmDialogueConfirmButton).click();
                }).then(() => {
                    cy.get(threatListViewSelector.threatListViewExpandedRecordId).contains(goalNum).should('be.visible');
                    cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).should('be.visible');
                })
            })
        }).then(() => {
            cy.foldThreat(threatRow);
        })
    })

    it('Verify the deleted goal is not visible in threat view (MAIN-TC-129)', () => {
        let threatRow = 1;
        let goalDescription = 'MAIN-TC-129';
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.expandThreat(threatRow);
        }).then(() => {
            cy.changeThreatTreatment(threatRow, 'reduce').then(() => {
                cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                    .should('have.length', 2).first().click({ force: true });//1st add goal, 2nd add control
            }).then(() => {
                recurse(
                    () => cy.get(threatListViewSelector.threatListViewAddGoalDialogDescription).clear().type(goalDescription),
                    ($inputField) => $inputField.val() === goalDescription,
                    { delay: 1000 }
                ).then(() => {
                    cy.get(navBarSelector.confirmDialogueConfirmButton).click();
                }).then(() => {
                    cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).should('be.visible');
                })
            }).then(() => {
                cy.deleteGoal(goalDescription);
            }).then(() => {
                cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
                    cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).should('not.exist');
                })
            })
        }).then(() => {
            cy.foldThreat(threatRow);
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