afterEach(async () => {
  try {
    if (globalThis.__SERVER__) {
      await globalThis.__SERVER__.stop()
    }
    require('applicationinsights').dispose()
  }
  catch(e) {
    console.log(JSON.stringify(globalThis.__SERVER__))
    console.error(e)
  }
})
