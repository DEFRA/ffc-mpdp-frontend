require('./insights').setup()
const createServer = require('./server');

(async () => {
  try {
    (await createServer()).start()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
