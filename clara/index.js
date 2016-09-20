const {BrowserWindow} = require('electron')
const {app} = require('electron')

app.on('ready', function() {
  var bwindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Clara Probe - ClaRA Framework"
  })
  bwindow.loadURL('file://' + __dirname + '/html/main.html')
})
