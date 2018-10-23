const NN = require('node-notifier')

module.exports = {
  notification: (param) => {
    NN.notify({
      title: param.title ? param.title : 'Todo Notifier',
      message: param.message ? param.message : 'Sample Notification',
      wait: true
    })
  }
}
