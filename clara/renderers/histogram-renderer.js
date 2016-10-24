const {ipcRenderer} = require('electron');
var cp = require('child_process');
var child;
var histosFormat;
var serviceName;
var messagePusher;

window.onerror = function(error, url, line) {
    ipcRenderer.send('errorInWindow', error);
};

function removeDemoNodes() {
    var elements = document.getElementsByClassName('demo');
    if (elements) {
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    }
}

function createDemoNodes(title, names) {
    var i;
    document.getElementById('graphs-title').innerHTML = title;
    serviceName = title;
    var section = document.getElementById('graphs-section')
    removeDemoNodes();
    for (i = 0; i < names.length; i++) {
        var demoText = `
          <div class="demo">
            <div id="` + names[i] + `-graph" data-servicename="` + serviceName +`"></div>
          </div>`;
        section.insertAdjacentHTML('beforeend', demoText);
    }

    child = cp.fork('./clara/renderers/subscriber-renderer', [serviceName]);
    var messagePusher = setInterval(function () {
        child.send("send_data")}, 5000);
    child.on('message', function (args) {
        ipcRenderer.send('logger', args);
        histosFormat.draw(args);
    });
}

let subscribers = []

ipcRenderer.on('histogram-format', (event, description, title) => {
    //Load from clara/histogram-format the reader for the delivered data
    try {
        histosFormat = require('../histogram-format/' + description);
    } catch (e) {
        // The next arg after format should the types of graphs to create
        // This should be an array, for now i just create a known array for the
        // NAIADS case.

        // Default format for NOW is NAIADS
        histosFormat = require('../histogram-format/naiads');
        createDemoNodes(title, ['h1f', 'h2f', 'p1f', 'p2f']);
    }
});
