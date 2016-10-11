const {ipcRenderer} = require('electron');
var yaml = require('js-yaml'),
    fs   = require('fs'),
    cytoscape = require('cytoscape'),
    cydagre = require('cytoscape-dagre'),
    dagre = require('dagre');

// We should load the available services for deployment, we will do this by
// reading a YAML file with the list of available services.
var availableServices;

try {
  availableServices = yaml.safeLoad(fs.readFileSync('./assets/services.yml', 'utf8'));
} catch (e) {
  ipcRenderer.send('logger', e);
}

// Create the list of services, so the user could add this services nodes to the
// chain composition.
require('../../assets/js/demo-btns.js').addListeners();


cydagre( cytoscape, dagre ); // register extension

var cy = cytoscape({
	container: document.getElementById('cy'),
  boxSelectionEnabled: false,
  autounselectify: true,
  zoomingEnabled: false,
	layout: {
		name: 'dagre'
	},

	style: [
		{
			selector: 'node',
			style: {
				'content': 'data(id)',
				'text-opacity': 0.5,
				'text-valign': 'center',
				'text-halign': 'right',
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
		}
	],

	elements: {
		nodes: [
			{ data: { id: 'n0' } },
			{ data: { id: 'n1' } },
			{ data: { id: 'n2' } },
			{ data: { id: 'n3' } },
			{ data: { id: 'n4' } },
			{ data: { id: 'n5' } },
			{ data: { id: 'n6' } },
			{ data: { id: 'n7' } },
			{ data: { id: 'n8' } },
			{ data: { id: 'n9' } }
		],
		edges: [
			{ data: { source: 'n0', target: 'n1' } },
			{ data: { source: 'n1', target: 'n2' } },
			{ data: { source: 'n1', target: 'n3' } },
			{ data: { source: 'n4', target: 'n5' } },
			{ data: { source: 'n4', target: 'n6' } },
			{ data: { source: 'n6', target: 'n7' } },
			{ data: { source: 'n6', target: 'n8' } },
			{ data: { source: 'n8', target: 'n9' } },
		]
	},
});
