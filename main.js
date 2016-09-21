const electron = require('electron')
const {app} = electron
const {BrowserWindow} = electron
const {ipcMain} = electron

app.on('ready', function() {
  var bwindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Clara Probe - ClaRA Framework"
  })
  bwindow.loadURL('file://' + __dirname + '/html/main.html')
  const {zmq} = require('zmq')
    , sock = zmq.socket('sub');

  sock.connect('tcp://127.0.0.1:7771');
  sock.subscribe('dpeAlive');
  console.log('Subscriber connected to port 7771');

  sock.on('message', function(topic, message) {
    console.log('received a message related to:', topic, 'containing message:', message);
  });
})
