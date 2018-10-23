const nedb = require('nedb')
const path = require('path')

const db = new nedb({
  filename: path.join(__dirname, 'data.db'),
  autoload: true
})

module.exports = {
  insertData: (doc, callback) => {
    doc.created = new Date()
    db.insert(doc, (err, res) => {
      if (err) {
        console.log(err)
        callback()
        return
      }
      callback(res)
    })
  },
  updateData: (doc, param, multi, callback) => {
    doc.updated = new Date()
    db.update(param, { $set: doc }, { multi }, (err, res) => {
      if (err) {
        console.log(err)
        callback()
        return
      }
      callback(res)
    })
  },
  removeData: (param, multi, callback) => {
    db.remove(param, { multi }, (err, res) => {
      if (err) {
        console.log(err)
        callback()
        return
      }
      callback(res)
    })
  },
  findData: (param, sort, callback) => {
    db.find(param).sort(sort).exec((err, res) => {
      if (err) {
        console.log(err)
        callback()
        return
      }
      callback(res)
    })
  }
}
