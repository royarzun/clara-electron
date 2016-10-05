
class Subscriber {

    constructor(topic) {
        this.sock = require('zmq').socket('sub');
        this.topic = topic;
    }

    subscribe(callback) {
        var myip = require('quick-local-ip');
        this.sock.connect('tcp://' + myip.getLocalIP4() + ':7772');
        this.sock.subscribe(this.topic);
        console.log('Subscriber connected to clara SUB port: 7772');
        this.sock.on('message', callback);
    }

    unsubscribe() {
        this.sock.unsubscribe(this.topic);
    }
}

exports.Subscriber = Subscriber;
