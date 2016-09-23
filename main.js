const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')
var ipc = require('electron').ipcMain;

let mainWindow

app.on('ready', function() {
    var mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: "Clara Probe - ClaRA Framework"
    })
    mainWindow.loadURL('file://' + __dirname + '/main.html');
    // Closing procedure for probe app
    mainWindow.on('closed', function() {
        console.log('Closing the app...');
        mainWindow = null;
    })
})

app.on('closed', function() {
    app.quit();
})

ipc.on('errorInWindow', function(event, data) {
    console.log(data);
});
