const threatListViewSelector = require('../../selectors/threatListViewSelector.js')
const attackPathPopupSelector = require('../../selectors/attackPathPopupSelector.js');
const attackTreeSelector = require('../../selectors/attackTreeSelector.js');
const navBarSelector = require('../../selectors/navBarSelector.js');
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
                    },
                })
            }
        });
    })

    beforeEach(() => {// Logging In and Loading Project
        cy.viewport(1920, 1080);
        cy.login();
        cy.loadProject(projectId);
    })

    it('Attack Tree Button in Threat List View page (MAIN-TC-1988, MAIN-TC-1990, MAIN-TC-1992)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).should('exist');
            cy.get(threatListViewSelector.attackTreeButton).click().then(() => {
                cy.get(attackTreeSelector.attackTreeDialog).should('exist');
                cy.get(threatListViewSelector.threatListViewAttackPathTextArea).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialog).should('not.be.visible');
                })
            })
        })
    })

    it('Tree in Attack Path Popup (MAIN-TC-1993, MAIN-TC-1994, MAIN-TC-1995, MAIN-TC-1996)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click().then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownNewTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogNewTreePopupName).type('Automation Tree').then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogNewTreePopupConfirmButton).click();
                        });
                    });
                });
            });
            let initialLocation;
            cy.get(threatListViewSelector.threatListViewAttackPathTextArea).click().then(() => {
                cy.get(attackPathPopupSelector.attackPathDialogAttackTreeIcon).then(($el) => {
                    initialLocation = $el.offset();
                });
                cy.get(attackPathPopupSelector.attackPathDialogLinkTreeButton).click().then(() => {
                    cy.get(attackPathPopupSelector.attackPathDialogAttackTreeIcon).then(($el) => {
                        const newLocation = $el.offset();
                        expect(newLocation).not.to.deep.equal(initialLocation);
                    });
                    cy.get(attackPathPopupSelector.attackPathDialogAttackTreeIcon).should('exist').click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialog).should('exist');
                    })
                })
            })
            cy.get(attackPathPopupSelector.attackPathDialogAttackTreeIcon).click().then(() => { // Pressing the tree button again to close
                cy.get(attackTreeSelector.attackTreeDialog).should('not.be.visible');
            })
        })
    })

    it('Attack Tree in Local Storage (MAIN-TC-1997, MAIN-TC-1998,MAIN-TC-2000))', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.window().then((win) => {
                const diagramId = win.localStorage.getItem('diagramId');
                expect(diagramId).to.not.exist;
            });
            cy.get(threatListViewSelector.attackTreeButton).click().then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogSelectTree).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogNewTreePopupConfirmButton).click().then(() => {
                                cy.wait(3000);
                                cy.window().then((win) => {
                                    const diagramId = win.localStorage.getItem('diagramId');
                                    expect(diagramId).to.exist;
                                });
                            })
                        })
                    })
                })
            })
        })
    })

    it('Verify the  Header, Canvas, Footer in Attack tree panel(MAIN-TC-2001)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click().then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogSelectTree).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogNewTreePopupConfirmButton).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogHeader).should('exist').should('be.visible');
                                cy.get(attackTreeSelector.attackTreeDialogCanvas).should('exist').should('be.visible');
                                cy.get(attackTreeSelector.attackTreeDialogFooter).should('exist').should('be.visible');
                            })
                        })
                    })
                })
            })
        })
    })

    it('Verify the Header Components (MAIN-TC-2002)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click().then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click({ force: true }).then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogSelectTree).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogNewTreePopupConfirmButton).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(0).should('exist').invoke('text').should('contain', 'Tree');
                                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).should('exist').click().then(() => {
                                    cy.get(attackTreeSelector.attackTreeDialogDropDown).should('exist');
                                })
                                cy.get(attackTreeSelector.attackTreeDialogLoadedTreeButton).should('exist').invoke('text').should('include', 'Loaded: Automation Tree');
                                cy.get(attackTreeSelector.attackTreeDialogSaveIcon).should('exist');
                                cy.get(attackTreeSelector.attackTreeDialogPlayIcon).should('exist');
                                cy.get(attackTreeSelector.attackTreeDialogFooter).should('exist');
                            })
                        })
                    })
                })
            })
        })
    })

    it('Verify the Components when No project is Loaded (MAIN-TC-2003, MAIN-TC-3219)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click().then(() => {
                cy.get(attackTreeSelector.attackTreeDialogHeader).should('exist').should('be.visible');
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).should('be.enabled');
                cy.get(attackTreeSelector.attackTreeDialogLoadedTreeButton).should('exist').invoke('text').should('include', 'Loaded: None');
                cy.get(attackTreeSelector.attackTreeDialogSaveIcon).should('not.be.enabled');
                cy.get(attackTreeSelector.attackTreeDialogPlayIcon).should('not.be.enabled');
                cy.get(attackTreeSelector.attackTreeDialogFooter).should('not.exist');
            })
        })
    })

    it('Attack tree panel "Tree Button Dropdown" option (MAIN-TC-2004)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click().then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogDropDown).should('exist');
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownNewTree).invoke('text').should('contain', 'New Tree');
                    //cy.get(attackTreeSelector.attackTreeDialogTreeDropDownChange).should('not.be.enabled').invoke('text').should('contain', 'Change Tree Name');
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownDeleteTree).invoke('text').should('contain', 'Delete Tree');
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).invoke('text').should('contain', 'Load Tree');
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownSaveTree).should('not.be.enabled').invoke('text').should('contain', 'Save Tree As');
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLinkAttackPath).invoke('text').should('contain', 'Link Attack Path');
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLinkVulnerability).invoke('text').should('contain', 'Link Vulnerability');
                })
            })
        })
        cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
            cy.get(attackTreeSelector.attackTreeDialogSelectTree).click().then(() => {
                cy.get(attackTreeSelector.attackTreeDialogNewTreePopupConfirmButton).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                        //cy.get(attackTreeSelector.attackTreeDialogTreeDropDownChange).should('be.enabled').invoke('text').should('contain', 'Change Tree Name');
                        cy.get(attackTreeSelector.attackTreeDialogTreeDropDownDeleteTree).invoke('text').should('contain', 'Delete Tree');
                        cy.get(attackTreeSelector.attackTreeDialogTreeDropDownSaveTree).should('be.enabled').invoke('text').should('contain', 'Save Tree As');
                    })
                })
            })
        })
    })

    it('"New Tree" Dialog (MAIN-TC-2005, MAIN-TC-2006, MAIN-TC-2007)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click().then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownNewTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogNewTreePopup).should('exist');
                        cy.get(attackTreeSelector.attackTreeDialogNewTreePopupConfirmButton).should('not.be.enabled');
                        cy.get(attackTreeSelector.attackTreeDialogNewTreePopupName).type('Automation Tree 2');
                        cy.get(attackTreeSelector.attackTreeDialogNewTreePopupConfirmButton).should('be.enabled').click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogLoadedTreeButton).invoke('text').should('include', 'Automation Tree 2');
                        })

                    })
                })
            })
        })
    })

    it.skip('"Change Tree Name" Dialog (MAIN-TC-2008)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click().then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogSelectTree).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogNewTreePopupConfirmButton).click().then(() => {
                                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownChange).click().then(() => {
                                        cy.get(attackTreeSelector.attackTreeDialogChangeTreeNamePopup).should('exist');
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    it('Zoom Functionalities (MAIN-TC-3231, MAIN-TC-3232, MAIN-TC-3233)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click({ force: true }).then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {
                        cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).click().then(() => {
                            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click().then(() => {
                                let initialZoomValue;                                // Get the initial zoom value
                                cy.get(attackTreeSelector.attackTreeCanvasZoomDisplay).invoke('text').then((text) => {
                                    initialZoomValue = parseFloat(text.trim().replace('Zoom ', '').replace('%', '')); // Extract numeric part
                                });
                                // Click the zoom-in button
                                cy.get(attackTreeSelector.attackTreeCanvasZoomInButton).click().then(() => {
                                    // Get the new zoom value and verify
                                    cy.get(attackTreeSelector.attackTreeCanvasZoomDisplay).invoke('text').then((text) => {
                                        const newZoomValue = parseFloat(text.trim().replace('Zoom ', '').replace('%', '')); // Extract numeric part
                                        expect(newZoomValue).to.be.gt(initialZoomValue);
                                    });
                                })//Reset Button
                                cy.get(attackTreeSelector.attackTreeCanvasResetZoomButton).click().then(() => {
                                    cy.get(attackTreeSelector.attackTreeCanvasZoomDisplay).should('include.text', '100%');
                                })
                                //Zoom Out         
                                cy.get(attackTreeSelector.attackTreeCanvasZoomDisplay).invoke('text').then((text) => {
                                    initialZoomValue = parseFloat(text.trim().replace('Zoom ', '').replace('%', '')); // Extract numeric part
                                });
                                // Click the zoom-in button
                                cy.get(attackTreeSelector.attackTreeCanvasZoomOutButton).click().then(() => {
                                    // Get the new zoom value and verify
                                    cy.get(attackTreeSelector.attackTreeCanvasZoomDisplay).invoke('text').then((text) => {
                                        const newZoomValue = parseFloat(text.trim().replace('Zoom ', '').replace('%', '')); // Extract numeric part
                                        expect(newZoomValue).to.be.lt(initialZoomValue);
                                    });
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    it('"Load & Delete Tree" Dialog (MAIN-TC-2009, MAIN-TC-2010, MAIN-TC-2012, MAIN-TC-2013, MAIN-TC-2014, MAIN-TC-2028)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click().then(() => {                            //Attack Tree open
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {            //Tree drop down click
                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click().then(() => {    //Load Tree click
                        cy.get(attackTreeSelector.attackTreeDialogLoadTreePopup).should('exist');           //Load tree popup
                        cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).should('exist');      //select project
                        cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupCancelButton).click();       //Cancel the pop up
                    })
                })
            })
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {                //Again tree drop down
                cy.get(attackTreeSelector.attackTreeDialogTreeDropDownDeleteTree).click().then(() => {      //Click delete tree
                    cy.get(attackTreeSelector.attackTreeDialogSelectTree).click().then(() => {              //select tree
                        cy.get(attackTreeSelector.attackTreeDialogDeleteTreePopupDeleteButton).click().then(() => {//press delete btn
                            cy.get(attackTreeSelector.attackTreeDialogDeleteTreePopupDeleteButton).click()      //delete button(1st )
                        })                                                                                   //1st tree deleted
                    })
                })
            })
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {                //click tree
                cy.get(attackTreeSelector.attackTreeDialogTreeDropDownDeleteTree).click().then(() => {      //select delete
                    cy.get(attackTreeSelector.attackTreeDialogDeleteTreePopup).should('exist');             //delete popup
                    cy.get(attackTreeSelector.attackTreeDialogDeleteTreePopupDeleteButton).should('not.be.enabled');    //delete btn not enable
                    cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).should('exist').click().then(() => {  //select tree
                        cy.get(attackTreeSelector.attackTreeDialogDeleteTreePopupDeleteButton).should('be.enabled').click().then(() => { //click delete
                            cy.get(attackTreeSelector.attackTreeDialogDeleteTreePopupDeleteButton).click().then(() => {         //again click delet(2nd deleted)
                                cy.wait(5000); //to wait till the delete snack bar message disappears
                                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {                //again click tree
                                    cy.get(attackTreeSelector.attackTreeDialogTreeDropDownDeleteTree).click()
                                    cy.get(navBarSelector.subsequentSnackBarElement).should('exist').invoke('text').should('include', 'No Trees found. Please, create new Tree').then(() => { //working fine
                                        cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click().then(() => {
                                            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click()
                                            cy.get(navBarSelector.subsequentSnackBarElement).should('exist').invoke('text').should('include', 'No Trees found. Please, create new Tree');
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

describe('CLEANUP: Project Deletion', () => {
    it('Deleting The Project If Created', () => {
        cy.viewport(1920, 1080);
        cy.login().then(() => {
            cy.deleteProject(projectName);
        })
    })
})
