const re = /([^:_%]+(%([\d]+))?_(java|python|cpp)):\w+:\w+$/g;
const xMsgRegistration = require('../data/registration.js').xMsgRegistration;
var ipc = require('electron').ipcRenderer;
var myip = require('quick-local-ip');
var zmq = require('zmq');
var socket = zmq.socket('req');

socket.on("message", function () {
    // message, sender, status, data[]
    for (i = 3; i < arguments.length; i++) {
      var reg = new xMsgRegistration(arguments[i]),
          m = reg.name.match(re);
      if (m) {
        var div = document.getElementById('services-nav'),
            button = document.createElement('button');

        button.setAttribute('class', 'nav-button');
        button.setAttribute('data-section', 'graphs');
        button.setAttribute('id', 'button-graphs');
        button.setAttribute('type', 'button');
        button.appendChild(document.createTextNode(m[0]));
        button.addEventListener('click', function() {
          ipc.send('start-plotting', m[0]);
        });
        div.appendChild(button);
      }
    }
});

socket.connect("tcp://" + myip.getLocalIP4() + ":8888");
socket.send(["allSubscriber", "probeService", "allSubscriber"]);


setTimeout(function() {
  socket.unref();
}, 1000);


window.onclosed = function(){
   socket.close();
};

window.onerror = function(error, url, line) {
   ipc.send('errorInWindow', error);
};
