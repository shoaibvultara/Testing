import "@4tw/cypress-drag-drop";
import "cypress-real-events/support";
import "cypress-localstorage-commands";
import "cypress-log-to-output";
const navBarSelector = require('../selectors/navBarSelector.js');
const monitoringPageSelector = require('../selectors/monitoringPageSelector.js');
const projectTriggerSelector = require('../selectors/projectTriggerSelector.js');

Cypress.Commands.add("addNewInformation", (contentSummary) => {
    cy.visit(Cypress.env('baseURL') + '/monitoring').then(() => {
        cy.get(projectTriggerSelector.activeListTab).click().then(() => {
            cy.get(monitoringPageSelector.monitoringAddNewInfoButton).click();
            cy.get(monitoringPageSelector.addNewInfoDialogContentTextArea).clear().type(contentSummary);
            cy.get(navBarSelector.confirmDialogueConfirmButton).click();
        })
    })
});