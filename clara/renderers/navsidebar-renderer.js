const REGEX = /([^:_%]+(%([\d]+))?_(java|python|cpp)):\w+:\w+$/g;
const ALL_SERVICES_MSG = ["allSubscriber", "probeService", "allSubscriber"];

const xMsgRegistration = require('../data/registration.js').xMsgRegistration;

var {ipcRenderer} = require('electron');
var myip = require('quick-local-ip');
var socket = require('zmq').socket('req');


socket.on('message', function () {
    // message, sender, status, data[]
    for (i = 3; i < arguments.length; i++) {
      var reg = new xMsgRegistration(arguments[i]),
          m = reg.name.match(REGEX);
      var first = true;
      var first_service = "";
      if (m) {
        var div = document.getElementById('nav-services'),
            button = document.createElement('button');

        button.setAttribute('class', 'nav-button');
        button.setAttribute('data-section', 'graphs');
        if (first) {
          first_service = 'button-graphs-' + m[0];
          first = false;
        }
        button.setAttribute('id', 'button-graphs-' + m[0]);
        button.setAttribute('type', 'button');
        button.appendChild(document.createTextNode(m[0]));
        button.addEventListener('click', function() {
          ipcRenderer.send('start-plotting', m[0]);
        });
        div.appendChild(button);
      }
    }
    // Click the first one to take us to the service histogram view;
    var button = document.getElementById(first_service);
    button.click();
});

socket.connect('tcp://' + myip.getLocalIP4() + ":8888");
socket.send(ALL_SERVICES_MSG);

setTimeout(function() {
  socket.unref();
}, 1000);

window.onclosed = function(){
   socket.close();
};

window.onerror = function(error, url, line) {
   ipcRenderer.send('errorInWindow', error);
};
