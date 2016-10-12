const {ipcRenderer} = require('electron');
var yaml = require('js-yaml'),
    fs = require('fs'),
    cytoscape = require('cytoscape'),
    cydagre = require('cytoscape-dagre'),
    dagre = require('dagre');

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
        nodes: [{
            data: {
                id: 'n4'
            }
        }, {
            data: {
                id: 'n5'
            }
        }, {
            data: {
                id: 'n6'
            }
        }, {
            data: {
                id: 'n7'
            }
        }, {
            data: {
                id: 'n8'
            }
        }, {
            data: {
                id: 'n9'
            }
        }],
        edges: [{
            data: {
                source: 'n4',
                target: 'n5'
            }
        }, {
            data: {
                source: 'n4',
                target: 'n6'
            }
        }, {
            data: {
                source: 'n6',
                target: 'n7'
            }
        }, {
            data: {
                source: 'n6',
                target: 'n8'
            }
        }, {
            data: {
                source: 'n8',
                target: 'n9'
            }
        }, ]
    },
});

cy.nodes().on('click', function(event) {
    this.select();
});

cy.nodes().on('cxttapstart', function(event) {
    ipcRenderer.send('logger', 'here i will launch the modal');
});

document.addEventListener('keydown', function(event) {
    ipcRenderer.send('logger', 'deleting a node...');
    if (event.key == "Backspace") {
        cy.$(':selected').remove();
    }
});



// We should load the available services for deployment, we will do this by
// reading a YAML file with the list of available services.
var availableServices;
let nodes = new Set();

try {
    availableServices = yaml.safeLoad(fs.readFileSync('./assets/services.yml', 'utf8')).services;
    for (var i = 0; i < availableServices.length; i++) {
        var ul = document.getElementById('node-list'),
            li = document.createElement('li');
        li.appendChild(document.createTextNode(availableServices[i].name));
        li.setAttribute("id", availableServices[i].name);
        li.setAttribute("data-classpath", availableServices[i].class)
        li.addEventListener('click', function() {
            if (!nodes.has(this.id)) {
                cy.add({
                    group: "nodes",
                    data: {
                        id: this.id,
                        classpath: this.dataset.class
                    },
                    position: {
                        x: 200,
                        y: 200
                    }
                });
                nodes[this.id] = this.id;
            }
        });
        ul.appendChild(li);
    }

} catch (e) {
    ipcRenderer.send('logger', e);
}
