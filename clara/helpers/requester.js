
class Requester {

    constructor() {
        this.sock = require('zmq').socket('pub');
        var myip = require('quick-local-ip');
        this.sock.connect('tcp://' + myip.getLocalIP4() + ':7771');
    }

    send(request) {
        this.sock.send(request);
    }
}

exports.requester = requester;
