const zmq = require('zmq'),
    sock = zmq.socket('sub');

const builder = require('protobufjs').loadProtoFile("./assets/proto/xMsgMeta.proto"),
    xMsgMeta = builder.build("org.jlab.coda.xmsg.data.xMsgMeta");

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
            var ul = document.getElementById('dpe-list');
            var li = document.createElement("li");
            var a = document.createElement("a")
            a.appendChild(document.createTextNode(topic));
            a.href = "#"
            li.appendChild(a);
            ul.appendChild(li);

            //console.log(meta.dataType);
        }
    });

} catch (err) {
    console.log(err);
}

function getMimetype(metadata) {
    var meta = xMsgMeta.decode(metadata);
    return meta.dataType;
}
