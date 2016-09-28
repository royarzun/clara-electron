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
        var ul = document.getElementById('dpe-list'),
            li = document.createElement('li'),
            a = document.createElement('a');

        a.appendChild(document.createTextNode(m[0]));
        a.href = '#';

        li.appendChild(a);
        ul.appendChild(li);
      }
    }
});

socket.connect("tcp://" + myip.getLocalIP4() + ":8888");
socket.send(["allSubscriber", "probeService", "allSubscriber"]);


setTimeout(function() {
  socket.unref();
}, 1000);


// window.onclosed = function(){
//    socket.close();
// };
//
window.onerror = function(error, url, line) {
   ipc.send('errorInWindow', error);
};
