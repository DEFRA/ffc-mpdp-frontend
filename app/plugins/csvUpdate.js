const config = require('../config')
const fs = require('fs/promises')

async function fetchCSVFileData () {
  const response = await fetch(`${config.backendEndpoint}/downloadall`)

  if (response.ok) {
    const data = await response.text()
    await fs.writeFile('app/data/downloads/ffc-payment-data.csv', data)
    console.log('Local CSV file successfully updated')
  }
}

module.exports = {
  name: 'CSV Update',
  register: async () => {
    await fetchCSVFileData()
    setInterval(fetchCSVFileData, config.csvFileUpdateInterval)
  }
}
