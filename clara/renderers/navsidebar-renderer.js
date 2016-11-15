const REGEX = /([^:_%]+(%([\d]+))?_(java|python|cpp)):\w+:\w+$/g;
const ALL_SERVICES_MSG = ['allSubscriber', 'probeService', 'allSubscriber'];

const {xMsgRegistration} = require('../data/registration.js');
const {ipcRenderer} = require('electron');
const socket = require('zmq').socket('req');
const probServices = require('./utils.js').probServices;

var services_set = new Set();


socket.on('message', function() {
    // message, sender, status, data[]
    for (var i = 3; i < arguments.length; i++) {
        var registration = new xMsgRegistration(arguments[i]),
            filtered_service = registration.name.match(REGEX);
        if (filtered_service) {
            if (!services_set.has(filtered_service[0]) && __isProbable(filtered_service[0])) {
                var div = document.getElementById('nav-services'),
                    button = document.createElement('button');

                button.setAttribute('class', 'nav-button');
                button.setAttribute('id', 'button-graphs-' + filtered_service[0]);
                button.setAttribute('type', 'button');
                button.setAttribute('data-format', registration.description);
                button.setAttribute('data-section', 'graphs');
                button.appendChild(document.createTextNode(filtered_service[0]));
                button.addEventListener('click', function() {
                    ipcRenderer.send('config-service', this.dataset.format, this.textContent);
                });
                div.appendChild(button);
                services_set.add(filtered_service[0]);
            }
        }
    }
});

function __isProbable(serviceToCheck) {
    var S = require('string');
    for (var i = 0; i < probServices.length; i++) {
        if (S(serviceToCheck).endsWith(':' + probServices[i])) {
            return true;
        }
    }
    return false;
}

socket.connect(require('./utils.js').getLocalRegistrarAddress);

setInterval(function() {
    socket.send(ALL_SERVICES_MSG);
}, 5000);

setTimeout(function() {
    socket.unref();
}, 1000);

window.onclosed = function() {
    socket.close();
};

window.onerror = function(error, url, line) {
    ipcRenderer.send('errorInWindow', error);
};
