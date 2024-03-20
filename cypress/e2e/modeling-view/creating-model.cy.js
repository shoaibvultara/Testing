const navBarSelector = require('../../selectors/navBarSelector.js');
const modelingViewSelector = require('../../selectors/modelingViewSelector.js');
import { recurse } from 'cypress-recurse';
var projectName;

describe('Creating Model', () => {
  var projectId;  //to store the project Id which is used in next test case to draw a diagram and delete the project

  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.login();
    cy.loadProject(projectId);
  });

  before('Creating a New Project (MAIN-TC-756)', () => {
    cy.viewport(1920, 1080);
    cy.login();
    // Generate a random project name
    cy.generateProjectName().then(($generatedName) => {
      projectName = $generatedName;
      cy.createProject(projectName);
    })
    // Get the project ID from local storage
    cy.window().then((win) => {
      const newDesignData = JSON.parse(win.localStorage.getItem('newDesign'));
      expect(newDesignData).to.not.be.null;
      expect(newDesignData.project).to.not.be.undefined;
      // Extract the project ID from the nested structure
      projectId = newDesignData.project.id;                         //projectId to be used 
      expect(projectId).to.not.be.undefined;
      cy.log("Project ID is: " + projectId);
    })
  })

  it('1. Modeling Page Cases: Deleting the Components(MAIN-TC-787, MAIN-TC-788, MAIN-TC-789, MAIN-TC-786)', () => {
    cy.visit(Cypress.env("baseURL")).then(() => {
      cy.get(navBarSelector.navBarLeftSeparator).should('exist').then(() => {
        cy.get(navBarSelector.navBarEditButton).click().then(() => {//Click Edit in navigation bar to open it
          cy.get(navBarSelector.editListRestoreThreatButton).should('not.be.enabled').then(() => {
            cy.get(navBarSelector.navBarEditButton).click({ force: true });//Click Edit in navigation bar to close it
          })
        })
      }).then(() => {
        // Open Modeling Page
        cy.visit(Cypress.env("baseURL") + "/modeling").url().should('contain', '/modeling').then(() => {
          const dataTransfer = new DataTransfer();
          cy.get(modelingViewSelector.componentLibraryMicrocontroller)
            .trigger('dragstart', { dataTransfer, force: true }).then(() => {
              cy.get(modelingViewSelector.modelingViewCanvas)
                .trigger('drop', { dataTransfer, force: true, clientX: 400, clientY: 400 });
            });
          cy.get(modelingViewSelector.componentLibraryModule)
            .trigger('dragstart', { dataTransfer, force: true }).then(() => {
              cy.get(modelingViewSelector.modelingViewCanvas)
                .trigger('drop', { dataTransfer, force: true, clientX: 800, clientY: 400 });
            });
          cy.get(modelingViewSelector.componentLibraryCommunicationLine)
            .trigger('dragstart', { dataTransfer, force: true }).then(() => {
              cy.get(modelingViewSelector.modelingViewCanvas)
                .trigger('drop', { dataTransfer, force: true, clientX: 600, clientY: 400 });
            });
        });
      }).then(() => {
        // Deleting Micro controller 
        cy.get(modelingViewSelector.drawingCanvasMicrocontroller)
          .rightclick().wait(500).then(() => {
            cy.get(modelingViewSelector.componentSpecRemoveMicroButton).click({ force: true });
            cy.get(navBarSelector.confirmToDeleteDialogue).should('include.text', 'CONFIRM TO DELETE');
            cy.get(navBarSelector.confirmDialogueCancelButton).click();
          });
      }).then(() => {
        // Deleting the Module
        cy.get(modelingViewSelector.drawingCanvasModule)
          .rightclick().wait(500).then(() => {
            cy.get(modelingViewSelector.componentSpecRemoveModuleButton).click({ force: true });
            cy.get(navBarSelector.confirmToDeleteDialogue).should('include.text', 'CONFIRM TO DELETE');
            cy.get(navBarSelector.confirmDialogueCancelButton).click();
          });
      }).then(() => {
        // Deleting the communication line
        cy.get(modelingViewSelector.drawingCanvasCommunicationLine)
          .rightclick({ force: true }).wait(500).then(() => {
            cy.get(modelingViewSelector.componentSpecRemoveLineButton).click({ force: true });
            cy.get(navBarSelector.confirmToDeleteDialogue).should('include.text', 'CONFIRM TO DELETE');
            cy.get(navBarSelector.confirmDialogueCancelButton).click();
          });
      })
    })
  });

  it('2. Model Creation: Verifying Project Name and Save Button on canvas(MAIN-TC-2045)', () => {
    // Open Modeling Page
    cy.visit(Cypress.env("baseURL") + "/modeling");
    cy.url().should('contain', '/modeling'); // Assertion to check if modeling page is opened

    // Working on Drag and Drop
    const dataTransfer = new DataTransfer();
    cy.get(modelingViewSelector.componentLibraryMicrocontroller)
      .trigger('dragstart', { dataTransfer, force: true }).then(() => {
        cy.get(modelingViewSelector.modelingViewCanvas)
          .trigger('drop', { dataTransfer, force: true, clientX: 400, clientY: 400 });
      });

    cy.get(modelingViewSelector.componentLibraryModule)
      .trigger('dragstart', { dataTransfer, force: true }).then(() => {
        cy.get(modelingViewSelector.modelingViewCanvas)
          .trigger('drop', { dataTransfer, force: true, clientX: 800, clientY: 400 });
      });

    cy.get(modelingViewSelector.componentLibraryCommunicationLine)
      .trigger('dragstart', { dataTransfer, force: true }).then(() => {
        cy.get(modelingViewSelector.modelingViewCanvas)
          .trigger('drop', { dataTransfer, force: true, clientX: 600, clientY: 400 });
      });

    //cy.wait(2000);

    // Connecting the Wire with Actor and Module
    cy.get(modelingViewSelector.drawingCanvasLineStartCircle).realClick().realMouseDown().realMouseMove(-250, 0).get(modelingViewSelector.drawingCanvasMicrocontroller).realMouseUp();
    cy.get(modelingViewSelector.drawingCanvasLineEndCircle).realClick().realMouseDown().realMouseMove(50, 0).get(modelingViewSelector.drawingCanvasModule).eq(0).realMouseUp();

    // Asserting the project name is being shown on canvas
    cy.get(modelingViewSelector.modelingViewProjectNameDiv).should('include.text', 'Automation_Project:');
    cy.get(modelingViewSelector.modelingViewSaveIcon).should('exist').click(); // Assertion Save button and saving project
    cy.wait(2000);
  });


  it('3. Logical Line in Transmission Media drop-down (MAIN-TC-2497, MAIN-TC-2498, MAIN-TC-2501)', () => {
    // Open Modeling Page
    cy.visit(Cypress.env("baseURL") + "/modeling");
    cy.url().should('contain', '/modeling'); // Assertion to check if modeling page is opened  

    cy.get(modelingViewSelector.drawingCanvasMicrocontroller).rightclick().then(() => {
      cy.wait(500);
      cy.get(modelingViewSelector.componentSpecComponentNameInput).clear().type('Automation Test Micro');
      cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleSelect).click()
      cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleTestOption).click(); // Selecting from Drop Down
      cy.get(modelingViewSelector.componentSpecFeatureSettingsSubmitButton).click();
    });

    // Adding features to Module
    cy.get(modelingViewSelector.drawingCanvasModule).rightclick().then(() => {
      cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleSelect).click();
      cy.get(modelingViewSelector.moduleSelectBatteryOption).click();
      cy.get(modelingViewSelector.componentSpecFeatureSettingsSubmitButton).click({ force: true });
    });

    // Comm Line
    cy.get(modelingViewSelector.drawingCanvasCommunicationLine).rightclick({ force: true }).then(() => {
      cy.get(modelingViewSelector.communicationLineSpecNameInput).clear().type("Communication Line 1")
      cy.get(modelingViewSelector.communicationLineSpecTransmissionSelect).click()
      cy.get(modelingViewSelector.transmissionMediaLogicalLineOption).click();
      cy.wait(1000);
      cy.get(modelingViewSelector.communicationLineSpecBaseProtocolSelect).click()
      cy.get(modelingViewSelector.baseProtocolLogicalLineOption).should('contain', 'Logical Line');
      cy.wait(500);
      cy.get(modelingViewSelector.drawingCanvasCommunicationLine).rightclick({ force: true });
    });

    cy.get(navBarSelector.navBarRunTheModelIcon).click({ force: true }); // Run the model
    cy.wait(1000);
    cy.get(modelingViewSelector.modelingViewSnackBar).invoke('text').should('include', 'Error: No threat is found');
  });

  it('Verify that when user right-click on sensor input, features that do NOT have any “process” type of asset should be disabled (MAIN-TC-2623, MAIN-TC-868)', () => {
    cy.visit(Cypress.env("baseURL") + "/modeling").then(() => {
      let initialTopPosition;
      let initialLeftPosition;
      //delete micro controller
      cy.get(modelingViewSelector.drawingCanvasMicrocontroller).rightclick().then(() => {
        cy.get(modelingViewSelector.componentSpecRemoveMicroButton).click().then(() => {
          cy.get(navBarSelector.confirmDialogueDeleteButton).click();
        })
      }).then(() => {
        //delete comm line
        cy.wait(1000);
        cy.get(modelingViewSelector.drawingCanvasCommunicationLine).rightclick({ force: true }).then(() => {
          cy.get(modelingViewSelector.componentSpecRemoveLineButton).click().then(() => {
            cy.get(navBarSelector.confirmDialogueDeleteButton).click();
          })
        })
      })
      const dataTransfer = new DataTransfer();
      //place sensor input
      cy.get(modelingViewSelector.componentLibrarySensorInput).trigger('dragstart', { dataTransfer, force: true })
        .then(() => {
          cy.get(modelingViewSelector.modelingViewCanvas).trigger('drop', { dataTransfer, force: true, clientX: 600, clientY: 100 });
        })
      cy.wait(500);
      //connect sensor with module
      cy.get(modelingViewSelector.drawingCanvasLineEndCircle)
        .realClick({ scrollBehavior: false })
        .realMouseDown()
        .realMouseMove(50, 0)
        .get(modelingViewSelector.drawingCanvasModule)
        .realMouseUp({ force: true });
      cy.wait(500);
      //select module features using pre-defined module 'front facing camera' in library
      cy.get(modelingViewSelector.drawingCanvasModule).rightclick().then(() => {
        cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleSelect).click().then(() => {
          cy.get(modelingViewSelector.componentSpecFeatureSettingFrontFacingCameraOption).click();
        }).then(() => {
          cy.get(modelingViewSelector.componentSpecFeatureSettingsSubmitButton).click().then(() => {
            cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Features confirmed. Security assets updated!');
          })
        })
      })
      //loading finished after submitting features
      cy.get(navBarSelector.loader).should('not.exist');
      //assert sensor feature labels are disabled
      cy.get(modelingViewSelector.drawingCanvasSensorInput).rightclick().then(() => {
        cy.get(modelingViewSelector.modelingViewComponentSettingsTab).should('be.visible').then(() => {
          cy.get(modelingViewSelector.componentSpecFeatureDropDownArrow).first().click().then(() => {
            cy.get(modelingViewSelector.communicationLineLaneDepartureAlertMessageLabel).should('have.css', 'pointer-events', "none"); // not clickable
            cy.get(modelingViewSelector.communicationLineLaneDepartureAlertSwCodeLabel).should('have.css', 'pointer-events', "none") // not clickable
          }).then(() => {
            //display sensor input protocol text
            cy.get(modelingViewSelector.componentSpecSensorInputMediaLabel).click({ force: true }).then(() => {
              cy.get(modelingViewSelector.componentSpecSensorInputMediaShortRange).click().then(() => {
                cy.get(modelingViewSelector.componentSpecSensorInputTypeLabel).click({ force: true }).then(() => {
                  cy.get(modelingViewSelector.componentSpecSensorInputTypeOCHV).click().then(() => {
                    cy.get(modelingViewSelector.componentSpecSensorDisplayProtocolLabel).click({ force: true });
                  })
                })
              })
            }).then(() => {
              //store the initial position
              cy.get(modelingViewSelector.drawingCanvasSensorInputProtocolTextOCHV).scrollIntoView().then(($text) => {
                initialTopPosition = $text.position().top;
                initialLeftPosition = $text.position().left;
                cy.log(initialTopPosition);
              });
            }).then(() => {
              //move the text
              cy.get(modelingViewSelector.drawingCanvasSensorInputProtocolTextOCHV).move({ deltaX: 100, deltaY: 100 }).then(() => {
                cy.get(modelingViewSelector.componentSpecSensorDisplayProtocolLabel).click({ force: true }).then(() => {
                  cy.get(modelingViewSelector.componentSpecSensorDisplayProtocolLabel).click({ force: true });
                })
              })
            }).then(() => {
              //assert the position is reverted
              cy.get(modelingViewSelector.drawingCanvasSensorInputProtocolTextOCHV).scrollIntoView().should(($text) => {
                expect($text.position().top).to.equal(initialTopPosition);
                expect($text.position().left).to.equal(initialLeftPosition);
              });
            })
          })
        })
      })
    });
  })

  it('Verify that if features not confirmed, a snack bar message shows that they are not confirmed yet and a new design could be created(MAIN-TC-2560, MAIN-TC-956, MAIN-TC-1791)', () => {
    // Visit another page if needed.
    cy.visit(Cypress.env("baseURL") + "/modeling").then(() => {
      //place module
      const dataTransfer = new DataTransfer();
      cy.get(modelingViewSelector.componentLibraryModule).trigger('dragstart', { dataTransfer, force: true })
        .then(() => {
          cy.get(modelingViewSelector.modelingViewCanvas).trigger('drop', { dataTransfer, force: true, clientX: 600, clientY: 800 });
        })
      cy.wait(500);
      //select asset
      cy.get(modelingViewSelector.drawingCanvasModule).last().rightclick().then(() => {
        cy.get(modelingViewSelector.securitySettingTab).click().then(() => {
          let assetName = 'CAN';
          recurse(
            () => cy.get(modelingViewSelector.assetComponentSearchBox).clear().type(assetName),
            ($inputField) => $inputField.val() === assetName,
            { delay: 1000 }
          ).then(() => {
            cy.get(modelingViewSelector.assetComponentDropdownList).contains(assetName).should('be.visible').click();
          })
        }).then(() => {
          //assert it is not stuck and the snack bar msg exists
          cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Confirm Features to commit security assets');
        }).then(() => {
          cy.get(navBarSelector.navBarEditButton).click().then(() => {
            cy.get(navBarSelector.editListNewDesignButton).click().then(() => {
              recurse(
                () => cy.get(navBarSelector.confirmDialogTypeConfirmInput).clear().type('confirm'),
                ($inputField) => $inputField.val() === 'confirm',
                { delay: 1000 }
              ).then(() => {
                cy.intercept('DELETE', '*').as('deleteRequest');
                cy.get(navBarSelector.confirmDialogueConfirmButton).last().click().then(() => {
                  cy.wait(5000);
                  cy.get('@deleteRequest').its('response.statusCode').should('eq', 200);
                })
              }).then(() => {
                cy.get(modelingViewSelector.drawingCanvasCommunicationLine).should('not.exist');
                cy.get(modelingViewSelector.drawingCanvasMicrocontroller).should('not.exist');
                cy.get(modelingViewSelector.drawingCanvasModule).should('not.exist');
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