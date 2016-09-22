const {app, BrowserWindow, ipcMain} = require('electron')

let mainWindow

app.on('ready', function() {
  var mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Clara Probe - ClaRA Framework"
  })
  mainWindow.loadURL('file://' + __dirname + '/clara/html/main.html')
  subscriber = require('./clara/subscriber');
  // Closing procedure for probe app
  mainWindow.on('closed', function() {
    console.log('Closing the app...');
    mainWindow = null;
  })
})

app.on('closed', function () {
  app.quit();
})

function makeSingleInstance () {
  if (process.mas) return false

  return app.makeSingleInstance(function () {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}
