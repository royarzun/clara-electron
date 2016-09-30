const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')
var ipc = ipcMain;

let mainWindow

ipc.on('start-histogram', (event, args) => {
  event.sender.send('new-histo-config', args)
})

ipc.on('logger', (event, args) => {
  console.log(args);
});

app.on('ready', function() {
    var mainWindow = new BrowserWindow({
        width: 1280,
        height: 900,
        title: "Clara Probe - ClaRA Framework"
    });
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
