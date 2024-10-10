const { Before, After, setWorldConstructor } = require('@cucumber/cucumber')
const { chromium, firefox, webkit } = require('playwright')
const { projects } = require('../playwright.config.js')
const HomePage = require('../pageModels/home-page')
const SearchPage = require('../pageModels/search-page')

class CustomWorld {
  constructor () {
    this.browser = null
    this.page = null
    this.context = null
    this.project = null
    this.homePage = null
    this.searchPage = null
  }
}

setWorldConstructor(CustomWorld)

Before(async function () {
  this.project = process.env.PROJECT || 'chromium'
  const projectConfig = projects.find((p) => p.name === this.project)

  if (!projectConfig) {
    throw new Error(`Project configuration for '${this.project}' not found.`)
  }

  const browserType = {
    chromium,
    firefox,
    webkit
  }[projectConfig.use.browserName]

  if (!browserType) {
    throw new Error(`Unknown browser type: ${projectConfig.use.browserName}`)
  }

  this.browser = await browserType.launch({ headless: false })
  this.context = await this.browser.newContext(projectConfig.use)

  this.page = await this.context.newPage()
  if (projectConfig.use.baseURL) {
    this.baseURL = projectConfig.use.baseURL
  }

  this.homePage = new HomePage(this.page)
  this.searchPage = new SearchPage(this.page)
})

After(async function () {
  await this.page.close()
  await this.context.close()
  await this.browser.close()
})
