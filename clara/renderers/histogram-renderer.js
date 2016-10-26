const {ipcRenderer} = require('electron');
var utils = require('./utils.js');
var cp = require('child_process');
var subscriberProcess;
var histosFormat;
var messagePusher;

window.onerror = function(error, url, line) {
    ipcRenderer.send('errorInWindow', error);
};

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
        require('./utils.js').createNodes(title, ['h1f', 'h2f', 'p1f', 'p2f'], function () {
            subscriberProcess = cp.fork('./clara/processes/subscriber-process.js', [title]);
            messagePusher = setInterval(function() {
                subscriberProcess.send('feed')
            }, 5000);

            subscriberProcess.on('message', function(args) {
                histosFormat.draw(args);
            });
        });
    }
});
