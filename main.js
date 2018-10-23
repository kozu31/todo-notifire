const electron = require('electron')
const path = require('path')
const nn = require('node-notifier')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow = null

app.on('ready', () => {
  mainWindow = new BrowserWindow(
    {
      width: 800,
      height: 600
    }
  )
  mainWindow.loadURL(path.join('file://', __dirname, 'index.html'))
  mainWindow.on('closed', () => {
  })
  mainWindow.isMinimized()
})

exports.notificationMainProcess = () => {
  nn.notify({
    title: 'Notification Main Process',
    message: 'Notification Main Process Message',
    wait: true
  })
}
