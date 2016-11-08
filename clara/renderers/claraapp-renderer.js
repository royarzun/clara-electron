const REGEX = /([^:_%]+(%([\d]+))?_(java|python|cpp)):\w+:\w+$/g;
const ALL_SERVICES_MSG = ['allSubscriber', 'probeService', 'allSubscriber'];

const {xMsgRegistration} = require('../data/registration.js');
const {ipcRenderer} = require('electron');
const socket = require('zmq').socket('req');

var yaml = require('js-yaml'),
    fs = require('fs'),
    cytoscape = require('cytoscape'),
    cydagre = require('cytoscape-dagre'),
    dagre = require('dagre'),
    services_set = new Set();

// Create the list of services, so the user could add this services nodes to the
// chain composition.
require('../../assets/js/demo-btns.js').addListeners();


cydagre(cytoscape, dagre); // register extension

var cy = cytoscape({
    container: document.getElementById('cy'),
    panningEnabled: false,
    zoomingEnabled: false,
    layout: {
        name: 'dagre'
    },

    style: [{
            selector: 'node',
            style: {
                'content': 'data(id)',
                'text-opacity': 0.5,
                'text-valign': 'center',
                'text-halign': 'right',
                'width': 48,
                'height': 48,
                'background-color': '#11479e'
            }
        },

        {
            selector: 'edge',
            style: {
                'width': 4,
                'target-arrow-shape': 'triangle',
                'line-color': '#9dbaea',
                'target-arrow-color': '#9dbaea',
                'curve-style': 'bezier'
            }
        },

        {
            selector: ':selected',
            style: {
                'background-color': 'black',
            }
        },
    ],

    elements: {
        nodes: [],
        edges: []
    },
});
var lastSelection;
let nodes = new Set();
var ctrlPressed = false;

function printOutput(text){
  var p = document.getElementById('output');
  p.innerHTML = text;
}
function clearOutput(){
  var p = document.getElementById('output');
  p.innerHTML = "";
}

cy.nodes().on('click', function(event) {
    if (ctrlPressed) {
      // if one node is selected we will connect to the next one clicked
      // try to connect
      ipcRenderer.send('logger', 'adding edge...(' + lastSelection + ', ' + this.id() + ')');

      if (lastSelection == this.id() ){
        clearOutput();
        ctrlPressed = false;
        lastSelection = this.id();
        return;
      }
      cy.add({
        group: 'edges',
        data: {
          source: lastSelection,
          target: this.id()
        }
      });
      ctrlPressed = false;
      clearOutput();
      lastSelection = this.id();
    } else {
      this.select();
      ctrlPressed = false;
      clearOutput();
      lastSelection = this.id();
    }

});

cy.nodes().on('cxttapstart', function(event) {
    ipcRenderer.send('logger', 'here i will launch the modal');
});

socket.on('message', function() {
    // message, sender, status, data[]
    for (i = 3; i < arguments.length; i++) {
        var registration = new xMsgRegistration(arguments[i]),
            filtered_service = registration.name.match(REGEX);
        if (filtered_service) {
            if (!services_set.has(filtered_service[0])) {
                var div = document.getElementById('terminal'),
                    control = document.createElement('div'),
                    span = document.createElement('span'),
                    button = document.createElement('button');
                control.setAttribute('class', 'demo-controls')
                button.setAttribute('class', 'demo-button-small');
                button.setAttribute('id', filtered_service[0]);
                button.setAttribute('type', 'button');
                button.appendChild(document.createTextNode(filtered_service[0]));
                button.addEventListener('click', function() {
                  if (!nodes.has(this.id)) {
                    cy.add({
                      group: 'nodes',
                      data: {
                        id: this.id,
                        classpath: this.dataset.class
                      },
                      position: {
                        x: 200,
                        y: 200
                      }});
                      nodes[this.id] = this.id;
                    }
                  });
                control.appendChild(button);
                control.appendChild(span);
                div.appendChild(control);
                services_set.add(filtered_service[0]);
            }
        }
    }
});

socket.connect(require('./utils.js').getLocalRegistrarAddress);

setInterval(function() {
    socket.send(ALL_SERVICES_MSG);
}, 5000);

setTimeout(function() {
    socket.unref();
}, 1000);

document.addEventListener('keydown', function(event) {
    var node = cy.$(':selected');
    if (!node.id()) return;

    switch (event.key) {
      case "Backspace":
        ipcRenderer.send('logger', 'deleting: ' + node.id());
        node.remove();
        break;
      case "c":
        ipcRenderer.send('logger', 'ready to connect: ' + node.id());
        printOutput('ready to connect...')
        ctrlPressed = true
        break;
      default:
        break;
    }
});

// We should load the available services for deployment, we will do this by
// reading a YAML file with the list of available services.
// var availableServices;
// let nodes = new Set();
//
// try {
//     availableServices = yaml.safeLoad(fs.readFileSync('./assets/services.yml', 'utf8')).services;
//     for (var i = 0; i < availableServices.length; i++) {
//         var ul = document.getElementById('node-list'),
//             li = document.createElement('li');
//         li.appendChild(document.createTextNode(availableServices[i].name));
//         li.setAttribute("id", availableServices[i].name);
//         li.setAttribute("data-classpath", availableServices[i].class)
//         li.addEventListener('click', function() {
//             if (!nodes.has(this.id)) {
//                 cy.add({
//                     group: "nodes",
//                     data: {
//                         id: this.id,
//                         classpath: this.dataset.class
//                     },
//                     position: {
//                         x: 200,
//                         y: 200
//                     }
//                 });
//                 nodes[this.id] = this.id;
//             }
//         });
//         ul.appendChild(li);
//     }
//
// } catch (e) {
//     ipcRenderer.send('logger', e);
// }
