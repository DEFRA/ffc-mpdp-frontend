// @ts-check
const { defineConfig, devices } = require('@playwright/test')

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: '.',
  // testDir: './features',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://find-farm-and-land-payment-data.defra.gov.uk/',
    headless: false,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry'
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'acceptance',
      use: {
        browserName: 'chromium',
        ...devices['Desktop Chrome'],
        headless: true,
        screenshot: 'only-on-failure'
      },
      retries: 1
    },
    {
      name: 'local',
      use: {
        browserName: 'chromium',
        baseURL: 'http://localhost:3001',
        ...devices['Desktop Chrome'],
        headless: true,
        screenshot: 'only-on-failure'
      },
      retries: 1
    },
    {
      name: 'dev',
      use: {
        browserName: 'chromium',
        baseURL: 'https://ffc-mpdp-frontend-dev.azure.defra.cloud/',
        ...devices['Desktop Firefox'],
        headless: true,
        screenshot: 'only-on-failure'
      },
      retries: 1
    },
    {
      name: 'test',
      use: {
        browserName: 'chromium',
        baseURL: 'https://ffc-mpdp-frontend-test.azure.defra.cloud/',
        ...devices['Desktop Chrome'],
        headless: true,
        screenshot: 'only-on-failure'
      },
      retries: 0
    },
    {
      name: 'pre-prod',
      use: {
        browserName: 'chromium',
        baseURL: 'https://ffc-mpdp-frontend-pre.azure.defra.cloud/',
        headless: true,
        screenshot: 'only-on-failure'
      },
      retries: 0
    },
    {
      name: 'prod',
      use: {
        browserName: 'chromium',
        baseURL: 'https://find-farm-and-land-payment-data.defra.gov.uk/',
        ...devices['Desktop Chrome'],
        headless: true,
        screenshot: 'only-on-failure'
      },
      retries: 0
    },

    /* Test against mobile viewports. */
    {
      name: 'mobile-chrome',
      use: {
        browserName: 'chromium',
        ...devices['Pixel 5'],
        headless: false,
        screenshot: 'only-on-failure'
      }
    },
    {
      name: 'mobile-safari',
      use: {
        browserName: 'webkit',
        ...devices['iPhone 12'],
        headless: true,
        screenshot: 'only-on-failure'
      }
    },
    /* Test against branded browsers. */
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        headless: true,
        screenshot: 'only-on-failure'
      }
    },
    {
      name: 'google-chrome',
      use: {
        browserName: 'chromium',
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        headless: true,
        screenshot: 'only-on-failure'
      }
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        headless: false,
        screenshot: 'only-on-failure'
      }
    },
    {
      name: 'safari',
      use: {
        browserName: 'webkit',
        headless: false,
        screenshot: 'only-on-failure'
      }
    }
  ]
})
