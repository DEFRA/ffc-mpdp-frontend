require('./insights').setup()
const { createServer } = require('./server')

async function startServer () {
  const server = await createServer()
  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
}

startServer()
