const {ipcRenderer} = require('electron');
var cp = require('child_process');


var service;

window.onerror = function(error, url, line) {
    ipcRenderer.send('errorInWindow', error);
};


ipcRenderer.on('new-histo-config', (event, args) => {
  // args[0] includes the topic of the service
  // args[1] includes the id of the <div> to draw
});

ipcRenderer.on('set-service-to-subscribe', (event, args) => {
  service = args[0];
})

var child = cp.fork('./clara/renderers/subscriber-renderer');

child.on('message', function(args){
  // here i receive the data for the plot
  require('../helpers/1_d_histogram').oneDimensionalHisto(args);
});

var one_d_histo = document.getElementById('start-1d-histo');
one_d_histo.addEventListener('click', function () {
    child.send('');
    ipcRenderer.send('logger', 'Launching 1D Histogram');
});
