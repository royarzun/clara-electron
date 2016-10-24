
class Subscriber {

    constructor(topic) {
        this.sock = require('zmq').socket('sub');
        this.topic = topic;
    }

    subscribe(callback) {
        this.sock.connect('tcp://' + require('quick-local-ip').getLocalIP4() + ':7772');
        this.sock.subscribe(this.topic);
        this.sock.on('message', callback);
    }

    unsubscribe() {
        this.sock.unsubscribe(this.topic);
    }
}

exports.Subscriber = Subscriber;
