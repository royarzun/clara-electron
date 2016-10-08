const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')

let mainWindow

ipcMain.on('config-service', (event, description, title) => {
  event.sender.send('histogram-format', description, title);
});

ipcMain.on('errorInWindow', function(event, data) {
    console.log(data);
});

ipcMain.on('logger', (event, args) => {
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
});
