const {
    ipcRenderer
} = require('electron');
var cp = require('child_process');


window.onerror = function(error, url, line) {
    ipcRenderer.send('errorInWindow', error);
};

var subscribers = []
// Find all buttons that were created in the step before:
for (elementId in document.getElementsByClassName('trigger')){
  var element = document.getElementById(elementId);
  if (element) {
    element.addEventListener('click', function(){
      var id = this.id.replace('-button', '');
      if (this.textContent == "Start"){
        subscribers[id] = setInterval(function(){child.send(id);}, 5000);
        this.textContent = "Stop";
      } else {
        this.textContent = "Start";
        clearInterval(subscribers[id]);
      }
    });
  }
}

ipcRenderer.on('new-histo-config', (event, args) => {
    // args[0] includes the topic of the service
    // args[1] includes the id of the <div> to draw
});

ipcRenderer.on('set-service-to-subscribe', (event, args) => {
    service = args[0];
})

var child = cp.fork('./clara/renderers/subscriber-renderer');
child.on('message', function(args) {
    // here i receive the data for the plot
    if (args.h1f) require('../helpers/1_d_histogram').oneDimensionalHisto(args.h1f);
    if (args.h2f) require('../helpers/2_d_histogram').twoDimensionalHisto(args.h2f);
    if (args.p1f) require('../helpers/1_d_profile').oneDimensionalProfile(args.p1f);
    if (args.p2f) require('../helpers/2_d_profile').twoDimensionalProfile(args.p2f);
});
