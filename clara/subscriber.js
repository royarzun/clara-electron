const zmq = require('zmq'),
    sock = zmq.socket('sub');
let set = new Set();


try {
    var myip = require('quick-local-ip');
    sock.connect('tcp://' + myip.getLocalIP4() + ':7772');
    sock.subscribe('dpeAlive');
    console.log('Subscriber connected to clara SUB port: 7772');

    sock.on('message', function(topic, metadata, data) {
        var topic = data.toString('binary').split("?")[0];
        if (!set.has(topic)) {
            set.add(topic);
            console.log(new Date().toLocaleString() + ": DPE found", topic);
        }
    });

} catch (err) {
    console.log(err);
}
