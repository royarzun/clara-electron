

const zmq = require('zmq'), sock = zmq.socket('sub');

try {
  sock.connect('tcp://129.57.114.188:7772');
  sock.subscribe('dpeAlive');
  console.log('Subscriber connected to clara SUB port: 7772');

  sock.on('message', function(topic, message) {
    console.log('received a message related to:', topic, 'containing message:', message);
  });
} catch(err) {
  console.log(err);
}
