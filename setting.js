const jsonfile = require('jsonfile')
const path = require('path')
const filePath = path.join(__dirname, 'parametor.json')
const setting = jsonfile.readFileSync(filePath, 'utf-8')

module.exports = {
  get: (key) => {
    return setting[key]
  },
  set: (key, value) => {
    setting[key] = value
    jsonfile.writeFile(filePath, setting, { spaces: 2, EOL: '\r\n' })
  }

}
