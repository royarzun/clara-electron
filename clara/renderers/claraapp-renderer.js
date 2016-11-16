const REGEX = /([^:_%]+(%([\d]+))?_(java|python|cpp)):\w+:\w+$/g;
const ALL_SERVICES_MSG = ['allSubscriber', 'probeService', 'allSubscriber'];

const {xMsgRegistration} = require('../data/registration.js');
const {ipcRenderer} = require('electron');
const socket = require('zmq').socket('req');

var yaml = require('js-yaml'),
    fs = require('fs'),
    cytoscape = require('cytoscape'),
    cydagre = require('cytoscape-dagre'),
    cyhandle = require('cytoscape-edgehandles'),
    dagre = require('dagre'),
    services_set = new Set();

// Create the list of services, so the user could add this services nodes to the
// chain composition.
require('../../assets/js/demo-btns.js').addListeners();


cydagre(cytoscape, dagre); // register extension
cyhandle(cytoscape);


var cy = cytoscape({
    container: document.getElementById('container'),
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

// the default values of each option are outlined below:
var defaults = {
  preview: true, // whether to show added edges preview before releasing selection
  stackOrder: 4, // Controls stack order of edgehandles canvas element by setting it's z-index
  handleSize: 10, // the size of the edge handle put on nodes
  handleColor: '#ff0000', // the colour of the handle and the line drawn from it
  handleLineType: 'ghost', // can be 'ghost' for real edge, 'straight' for a straight line, or 'draw' for a draw-as-you-go line
  handleLineWidth: 1, // width of handle line in pixels
  handleIcon: false, // Pass an Image-object to use as icon on handle. Icons are resized according to zoom and centered in handle.
  handleNodes: 'node', // selector/filter function for whether edges can be made from a given node
  hoverDelay: 150, // time spend over a target node before it is considered a target selection
  cxt: false, // whether cxt events trigger edgehandles (useful on touch)
  enabled: true, // whether to start the extension in the enabled state
  toggleOffOnLeave: false, // whether an edge is cancelled by leaving a node (true), or whether you need to go over again to cancel (false; allows multiple edges in one pass)
  edgeType: function( sourceNode, targetNode ) {
    // can return 'flat' for flat edges between nodes or 'node' for intermediate node between them
    // returning null/undefined means an edge can't be added between the two nodes
    return 'flat';
  },
  loopAllowed: function( node ) {
    // for the specified node, return whether edges from itself to itself are allowed
    return false;
  },
  nodeLoopOffset: -50, // offset for edgeType: 'node' loops
  nodeParams: function( sourceNode, targetNode ) {
    // for edges between the specified source and target
    // return element object to be passed to cy.add() for intermediary node
    return {};
  },
  edgeParams: function( sourceNode, targetNode, i ) {
    // for edges between the specified source and target
    // return element object to be passed to cy.add() for edge
    // NB: i indicates edge index in case of edgeType: 'node'
    return {};
  },
  start: function( sourceNode ) {
    // fired when edgehandles interaction starts (drag on handle)
  },
  complete: function( sourceNode, targetNodes, addedEntities ) {
    // fired when edgehandles is done and entities are added
  },
  stop: function( sourceNode ) {
    // fired when edgehandles interaction is stopped (either complete with added edges or incomplete)
  }
};

cy.edgehandles( defaults );

let nodes = new Set();

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
      default:
        break;
    }
});
