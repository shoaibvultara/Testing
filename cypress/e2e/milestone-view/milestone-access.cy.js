import { recurse } from 'cypress-recurse'
const navBarSelector = require('../../selectors/navBarSelector.js');
const threatListViewSelector = require('../../selectors/threatListViewSelector.js');
var projectName;

describe('Milestone Access Privileges', () => {
    var projectId;
    var milestoneName;

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
        //setup the milestone data
        milestoneName = 'Automation_Milestone';
        cy.intercept('POST', Cypress.env('apiURL') + '/milestones/projectMilestoneDb*').as('postRequest');
        cy.createMilestone(milestoneName).then(() => {
            cy.get('@postRequest').its('response.statusCode').should('eq', 200);
            recurse(
                () => cy.get(navBarSelector.subsequentSnackBarElement).should('have.length', 2),//both snack bars appeared
                ($snackBar) => cy.wait(10),
                { delay: 1000 }
            )
        });
    })

    beforeEach(() => {// Logging in and loading the created project
        cy.viewport(1920, 1080);
        cy.login();
        cy.loadProject(projectId);
    })

    it('Verify the Milestone creation process (MAIN-TC-1794)', () => {
        cy.visit(Cypress.env('baseURL'));
        milestoneName = 'MAIN-TC-1794';
        cy.intercept('POST', Cypress.env('apiURL') + '/milestones/projectMilestoneDb*').as('postRequest');
        cy.createMilestone(milestoneName).then(() => {
            cy.get('@postRequest').its('response.statusCode').should('eq', 200);
            recurse(
                () => cy.get(navBarSelector.subsequentSnackBarElement).should('have.length', 2),//both snack bars appeared
                ($snackBar) => cy.wait(10),
                { delay: 1000 }
            )
        });
    })

    it('Verify the user should be able to Load Milestone on all pages (MAIN-TC-844)', () => {
        //Goal
        cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal');
        cy.get(navBarSelector.navBarProjectButton).click(); // Click project in navigation bar
        cy.get(navBarSelector.projectListLoadMilestoneButton).should('be.enabled'); // load a milestone
        //Vulnerabilities
        cy.visit(Cypress.env('baseURL') + '/vulnerabilities');
        cy.get(navBarSelector.navBarProjectButton).click(); // Click project in navigation bar
        cy.get(navBarSelector.projectListLoadMilestoneButton).should('be.enabled'); // load a milestone
        //Assumption
        cy.visit(Cypress.env('baseURL') + '/assumptions');
        cy.get(navBarSelector.navBarProjectButton).click(); // Click project in navigation bar
        cy.get(navBarSelector.projectListLoadMilestoneButton).should('be.enabled'); // load a milestone
        //control
        cy.visit(Cypress.env('baseURL') + '/cybersecurity-control');
        cy.get(navBarSelector.navBarProjectButton).click(); // Click project in navigation bar
        cy.get(navBarSelector.projectListLoadMilestoneButton).should('be.enabled'); // load a milestone
        //other-notification
        cy.visit(Cypress.env('baseURL') + '/notifications?view=others');
        cy.get(navBarSelector.navBarProjectButton).click(); // Click project in navigation bar
        cy.get(navBarSelector.projectListLoadMilestoneButton).should('be.enabled'); // load a milestone
        //risk-notification
        cy.visit(Cypress.env('baseURL') + '/notifications?view=threats');
        cy.get(navBarSelector.navBarProjectButton).click(); // Click project in navigation bar
        cy.get(navBarSelector.projectListLoadMilestoneButton).should('be.enabled'); // load a milestone
        //weakness
        cy.visit(Cypress.env('baseURL') + '/weaknesses');
        cy.get(navBarSelector.navBarProjectButton).click(); // Click project in navigation bar
        cy.get(navBarSelector.projectListLoadMilestoneButton).should('be.enabled'); // load a milestone
    })

    it('Verify user shall not be able to edit anything when milestone is loaded in threatListView page (MAIN-TC-1361, MAIN-TC-2163)', () => {
        milestoneName = 'MAIN-TC-1361-2163';
        cy.createModel();//create a model to generate threats to test
        cy.intercept('POST', Cypress.env('apiURL') + '/milestones/projectMilestoneDb*').as('postRequest');
        cy.createMilestone(milestoneName).then(() => {
            cy.get('@postRequest').its('response.statusCode').should('eq', 200);
            recurse(
                () => cy.get(navBarSelector.subsequentSnackBarElement).should('have.length', 2),//both snack bars appeared
                ($snackBar) => cy.wait(10),
                { delay: 1000 }
            )
        });
        cy.loadMilestone(milestoneName);
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            //more actions button
            cy.get(threatListViewSelector.threatListViewThreatActionsButton).eq(0).should('have.css', 'pointer-events', 'none');
            //validation button
            cy.get(threatListViewSelector.threatListViewThreatCheckBoxInput).eq(4).should('have.css', 'pointer-events', 'none');
            //review button
            cy.get(threatListViewSelector.threatListViewThreatCheckBoxInput).eq(3).should('have.css', 'pointer-events', 'none');
            //treatment selection
            cy.get(threatListViewSelector.threatListViewThreatTreatmentSelect).eq(0).should('have.css', 'user-select', 'none');
            //threat selection
            cy.get(threatListViewSelector.threatListViewThreatCheckBoxInput).eq(1).should('have.css', 'pointer-events', 'none');
            //threat scenario dialog
            cy.get(threatListViewSelector.threatListViewThreatScenarioTextArea).eq(0).click();
            cy.get(threatListViewSelector.threatScenarioCheckCircleIcon).should('not.exist');
            //attack path dialog
            cy.get(threatListViewSelector.threatListViewAttackPathColumn).eq(0).click();
            cy.get(navBarSelector.confirmDialogueConfirmButton).should('be.disabled').then(() => {
                cy.get(threatListViewSelector.dialogCloseIcon).click();
            });
            //damage scenario dialog
            cy.get(threatListViewSelector.threatListViewDamageScenarioColumn).eq(0).click();
            cy.get(navBarSelector.confirmDialogueConfirmButton).should('be.disabled').then(() => {
                cy.get(threatListViewSelector.confirmDialogCancelButton).click();
            });
            //feasibility dialog
            cy.get(threatListViewSelector.threatListViewFeasibilityButton).eq(0).click();
            cy.get(navBarSelector.confirmDialogueConfirmButton).should('be.disabled').then(() => {
                cy.get(threatListViewSelector.confirmDialogCancelButton).click();
            });
            //impact dialog
            cy.get(threatListViewSelector.threatListViewImpactButton).eq(0).click();
            cy.get(navBarSelector.confirmDialogueConfirmButton).should('be.disabled');
        });
    })

    it('Verify that the project notes are not editable in the milestone view (MAIN-TC-1613)', () => {
        cy.visit(Cypress.env('baseURL'));
        milestoneName = 'Automation_Milestone';
        cy.loadMilestone(milestoneName).then(() => {
            cy.get(navBarSelector.navBarProfileIcon).click();
            cy.get(navBarSelector.profileListProjectButton).click();
            cy.get(navBarSelector.ProjectDialogProjectNotesTextArea).should('be.disabled');
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