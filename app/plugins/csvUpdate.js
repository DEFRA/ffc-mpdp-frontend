const config = require('../config')
const fs = require('fs')

module.exports = {
  name: 'CSV Update',
  register: async () => {
    try {
      const response = await fetch(`${config.backendEndpoint}/downloadall`)

      if (response.ok) {
        const data = await response.text()
        fs.writeFileSync('app/data/downloads/ffc-payment-data.csv', data)
        console.log('Local CSV file successfully updated')
      }
    } catch (error) {
      console.error(error)
    }
  }
}
