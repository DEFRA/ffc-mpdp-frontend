const cookieConfig = require('../config').cookie

module.exports = {
  plugin: require('@hapi/crumb'),
  options: {
    cookieOptions: {
      isSecure: cookieConfig.isSecure
    }
  }
}
