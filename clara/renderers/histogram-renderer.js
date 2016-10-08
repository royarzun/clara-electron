const {
    ipcRenderer
} = require('electron');
var cp = require('child_process');
var histosFormat;

window.onerror = function(error, url, line) {
    ipcRenderer.send('errorInWindow', error);
};

var subscribers = []
    // Find all buttons that were created in the step before:
for (elementId in document.getElementsByClassName('trigger')) {
    var element = document.getElementById(elementId);
    if (element) {
        element.addEventListener('click', function() {
            var id = this.id.replace('-button', '');
            if (this.textContent == "Start") {
                subscribers[id] = setInterval(function() {
                    child.send(id);
                }, 5000);
                this.textContent = "Stop";
            } else {
                this.textContent = "Start";
                clearInterval(subscribers[id]);
            }
        });
    }
}

ipcRenderer.on('histogram-format', (event, args) => {
    //Load from clara/histogram-format the reader for the delivered data
    try {
        histosFormat = require('../histogram-format/' + args);
    } catch (e) {
        // Default format for now is NAIADS
        histosFormat = require('../histogram-format/naiads');
    }
});

var child = cp.fork('./clara/renderers/subscriber-renderer');
child.on('message', function(args) {
    // here i receive the data for the plot
    histosFormat.draw(args);
});
