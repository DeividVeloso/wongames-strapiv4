import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  e2e: {
    viewportWidth: 1024,
    viewportHeight: 1000,
    baseUrl: 'http://localhost:3000',
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
})
