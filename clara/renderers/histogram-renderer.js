const {
    ipcRenderer
} = require('electron');
var cp = require('child_process');
var histosFormat;

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
    var section = document.getElementById('graphs-section');
    removeDemoNodes();
    for (i = 0; i < names.length; i++) {
        var demoText = `
          <div class="demo">
            <div class="demo-wrapper">
              <button id="open-file-demo-toggle" class="js-container-target demo-toggle-button">` + names[i] + `
                <div class="demo-meta u-avoid-clicks">HighCharts.js</div>
              </button>
              <div class="demo-box">
                <div class="demo-controls">
                  <button class="demo-button trigger" id="` + names[i] + `-button">Start</button>
                </div>
                <div id="` + names[i] + `-graph"></div>
              </div>
            </div>
          </div>`;
        section.insertAdjacentHTML('beforeend', demoText);
    }
    require('../../assets/js/demo-btns.js').addListeners();
}


ipcRenderer.on('histogram-format', (event, description, title) => {
    //Load from clara/histogram-format the reader for the delivered data
    try {
        histosFormat = require('../histogram-format/' + description);
    } catch (e) {
        // The next arg after format should the types of graphs to create
        // This should be an array, for now i just create a known array for the
        // NAIADS case.
        createDemoNodes(title, ['h1f', 'h2f', 'p1f', 'p2f']);
        createTriggers();
        // Default format for NOW is NAIADS
        histosFormat = require('../histogram-format/naiads');
    }
});

function createTriggers() {
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
}


var child = cp.fork('./clara/renderers/subscriber-renderer');
child.on('message', function(args) {
    // here i receive the data for the plot
    histosFormat.draw(args);
});
