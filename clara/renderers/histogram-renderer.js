const {ipcRenderer} = require('electron');
var cp = require('child_process');


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
  if (args.h1f) require('../helpers/1_d_histogram').oneDimensionalHisto(args.h1f);
  if (args.h2f) require('../helpers/2_d_histogram').twoDimensionalHisto(args.h2f);
});

var buttonH1 = document.getElementById('h1f-button');
buttonH1.addEventListener('click', function(){
    ipcRenderer.send('logger', 'Launching 1D Histogram');
    child.send('h1f');
});

var buttonH2 = document.getElementById('h2f-button');
buttonH2.addEventListener('click', function(){
    ipcRenderer.send('logger', 'Launching 2D Histogram');
    child.send('h2f');
});
