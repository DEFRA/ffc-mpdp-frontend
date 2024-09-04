const config = require('../config')
const { writeFile } = require('fs')

async function fetchCSVFileData () {
  const response = await fetch(`${config.backendEndpoint}/downloadall`)

  if (!response.ok) {
    throw new Error('Unable to fetch CSV file from backend')
  }

  const data = await response.text()

  writeFile('app/data/downloads/ffc-payment-data.csv', data, (err) => {
    if (err) {
      throw err
    }

    console.log('Local CSV file successfully updated')
  })
}

module.exports = {
  name: 'CSV Update',
  register: async () => {
    await fetchCSVFileData()
  }
}
