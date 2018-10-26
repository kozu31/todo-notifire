const electron = require('electron')
const path = require('path')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow = null

app.on('ready', () => {
  mainWindow = new BrowserWindow(
    {
      width: 1200,
      height: 800
    }
  )
  mainWindow.loadURL(path.join('file://', __dirname, 'index.html'))
  mainWindow.isMinimized()
})
app.on('window-all-closed', () => {
  app.quit()
})
