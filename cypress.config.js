const { defineConfig } = require("cypress");
const { registerAIOTestsPlugin } = require('cypress-aiotests-reporter/src') // Import the necessary plugin if not already imported

module.exports = defineConfig({
  projectId: "tkumcu",
  env: {
    baseURL: "http://localhost:4200",
    apiURL: "http://localhost:4201/api",
    authURL: "http://localhost:4321/auth",
    username: "vultara_automation_test",
    password: "tJVJhiHmlIWR",
    projectId: "tkumcu",
    aioTests: {
      enableReporting: true,
      cloud: {
        apiKey: "NjI3NjRiZjItNjE5NC0zNWYwLWFkMjAtYzZiNmM2MjMwNmQ4LjQ5N2U4YWQxLTQzNTQtNDE4YS04ZDI2LTcwZTU5NTY0NDFhMQ==",
      },
      jiraProjectId: "KAN",
      cycleDetails: {
        createNewCycle: true,
        cycleName: "Automation Run " + new Date().toISOString(),
        //cycleKey: "MAIN-CY-123",
      },
      addNewRun: true,
      addAttachmentToFailedCases: true,
      createNewRunForRetries: true,
    },
  },
  //projectId: "6ca4i2",
  e2e: {
    setupNodeEvents(on, config) {
      registerAIOTestsPlugin(on, config);
      // implement node event listeners here
    },
  },
});

