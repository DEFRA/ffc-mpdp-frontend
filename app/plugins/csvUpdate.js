const config = require('../config')
const fs = require('fs/promises')

async function fetchCSVFileData (text) {
  const response = await fetch(`${config.backendEndpoint}/downloadall`)

  if (!response.ok) {
    throw new Error('Unable to fetch CSV file from backend')
  }

  const data = await response.text()
  await fs.writeFile('app/data/downloads/ffc-payment-data.csv', data)
  console.log('Local CSV file successfully updated', text)
}

module.exports = {
  name: 'CSV Update',
  register: async () => {
    await fetchCSVFileData('start')
    setInterval(fetchCSVFileData, config.csvFileUpdateInterval)
  }
}
