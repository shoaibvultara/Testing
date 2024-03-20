const threatListViewSelector = require('../../selectors/threatListViewSelector.js');
const impactPopupSelector = require('../../selectors/impactPopupSelectors.js');
const navBarSelector = require('../../selectors/navBarSelector.js');
var projectName;

describe('Impact', () => {
  var projectId;

  before(() => {              //Creating Project
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
    cy.createModel().then(() => {
      cy.visit(Cypress.env('baseURL') + '/threats');
    }).then(() => {
      cy.get(navBarSelector.loader).should('not.exist');
    })
  })
  beforeEach(() => {// Logging In and Loading Project
    cy.viewport(1920, 1080);
    cy.login();
    cy.loadProject(projectId);
  })

  it('Threat No in Impact Popup (MAIN-TC-1626, MAIN-TC-1627)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.get(navBarSelector.loader).should('not.exist');
      cy.get(threatListViewSelector.threatListViewImpactButton).eq(0).click();
    }).then(() => {
      cy.get(impactPopupSelector.impactPopup).should('be.visible').then(() => {
        cy.get(impactPopupSelector.impactPopupTitle).invoke('text').should('include', 'Impact for Threat #1')
      })
    })
  })

  it('Risk level and Impact rating in Impact Popup (MAIN-TC-1643)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      let riskValue;
      let Rating;
      cy.get(threatListViewSelector.threatListViewRiskButton).eq(0).invoke('text').then((text) => {
        riskValue = text.trim();
        cy.get(threatListViewSelector.threatListViewImpactButton).eq(0).invoke('text').then((text) => {
          Rating = text.trim();
          cy.get(threatListViewSelector.threatListViewImpactButton).eq(0).click();
          cy.get(impactPopupSelector.impactPopupRatingAndLevelParagraph).invoke('text').should('include', Rating)
        })
        cy.get(impactPopupSelector.impactPopupRatingAndLevelParagraph).invoke('text').should('include', riskValue);
      })
    })
  })

  it('Color dot with Each Impact Category (MAIN-TC-1645)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.get(threatListViewSelector.threatListViewImpactButton).eq(0).click()
        .then(() => {
          for (let i = 0; i < 4; i++) {
            cy.get(impactPopupSelector.impactPopupCategoryDropDown).eq(i).click();
            cy.get(impactPopupSelector.impactPopupCategoryDropdownModerateOption).click();
          }
        })
        .then(() => {
          for (let i = 0; i < 4; i++) {
            cy.get(impactPopupSelector.impactPopupCategoryDropDownColor).eq(i).should('exist');
          }
        })
    })
  })

  it('Edit the Reviewed Threat(MAIN-TC-1681) ', () => {
    cy.visit(Cypress.env('baseURL') + '/threats');
    cy.get(threatListViewSelector.threatListViewReviewCheckBox).eq(0).click()//Marking threat as reviewed
      .then(() => {
        cy.get(threatListViewSelector.threatListViewImpactButton).eq(0).click();
      }).then(() => {
        cy.get(impactPopupSelector.impactPopupCategoryDropDown).eq(0).should('not.be.enabled');
        cy.get(impactPopupSelector.impactPopupDamageScenarioTextArea).should('not.be.enabled');
      })
    cy.get(impactPopupSelector.impactPopupCancelButton).click().then(() => {
      cy.wait(3000);
      cy.get(threatListViewSelector.threatListViewReviewCheckBox).eq(0).click({ force: true })//Marking threat as unreviewed
      cy.wait(3000);
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewReviewCheckBox).eq(0).click({ force: true })
      cy.wait(3000);
    }).then(() => {
      cy.get(impactPopupSelector.impactPopupConfirmButton).click({ force: true });
      cy.wait(3000);
    })
  })

  it('Verify that when the user changes the treatment and opens Impact, then "before & after treatment view" should appear (MAIN-TC-1682, MAIN-TC-1683)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.get(threatListViewSelector.threatListViewThreatTreatmentSelect).eq(0).click().then(() => {
        cy.get(threatListViewSelector.threatTreatmentReduceOption).click();
      }).then(() => {
        cy.get(threatListViewSelector.threatListViewImpactButton).eq(0).click({ force: true }).then(() => {
          cy.get(impactPopupSelector.impactPopupCategoryHeading).should('include.text', '(After Treatment)');
          cy.get(impactPopupSelector.impactPopupDamageScenarioHeading).should('include.text', '(After Treatment)');
        })
      })
    })
  })

  it('Verify impact rating and risk level is updated according to the view(MAIN-TC-1684)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.get(threatListViewSelector.threatListViewThreatTreatmentSelect).eq(0).click();
    })
    cy.get(threatListViewSelector.threatTreatmentRetainOption).click({ force: true }).then(() => {
      cy.get(threatListViewSelector.threatListViewImpactButton).eq(0).click();
    }).then(() => {
      for (let i = 0; i < 4; i++) {
        cy.get(impactPopupSelector.impactPopupCategoryDropDown).eq(i).click();
        cy.get(impactPopupSelector.impactPopupCategoryDropdownNegligibleOption).click();
      }
    }).then(() => {
      cy.get(impactPopupSelector.impactAfterTreatmentText).invoke('text').should('include', 'Negligible');
    }).then(() => {
      for (let i = 0; i < 4; i++) {
        cy.get(impactPopupSelector.impactPopupCategoryDropDown).eq(i).click();
        cy.get(impactPopupSelector.impactPopupCategoryDropdownModerateOption).click();
      }
    }).then(() => {
      cy.get(impactPopupSelector.impactAfterTreatmentText).invoke('text').should('include', 'Moderate');
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