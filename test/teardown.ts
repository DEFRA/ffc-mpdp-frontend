afterEach(async () => {
  if (globalThis.__SERVER__) {  
    await global.__SERVER__.stop()
  }
  require('applicationinsights').dispose()
})
