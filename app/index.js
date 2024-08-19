require('./insights').setup()
const { start } = require('./server')

const init = async () => {
  try {
    await start()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

init()
