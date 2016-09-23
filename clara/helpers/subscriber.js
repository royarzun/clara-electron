var ipc = require('electron').ipcRenderer;

let set = new Set();


window.onerror = function(error, url, line) {
    ipc.send('errorInWindow', error);
};

class Subscriber {

    constructor() {
        this.sock = require('zmq').socket('sub');
    }

    subscribe(sub_topic, callback) {
        var myip = require('quick-local-ip');
        this.sock.connect('tcp://' + myip.getLocalIP4() + ':7772');
        this.sock.subscribe(sub_topic);
        console.log('Subscriber connected to clara SUB port: 7772');
        this.sock.on('message', callback);
    }
}

exports.Subscriber = Subscriber;
