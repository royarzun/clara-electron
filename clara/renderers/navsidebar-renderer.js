var ipc = require('electron').ipcRenderer;
var subscriber = require('../helpers/subscriber');
let set = new Set();


window.onerror = function(error, url, line) {
    ipc.send('errorInWindow', error);
};

var aliVeSubscription = new subscriber.Subscriber();
aliVeSubscription.subscribe('dpeAlive', function(topic, metadata, data) {
    var topic = data.toString('binary').split('?')[0];
    if (!set.has(topic)) {
        set.add(topic);

        var ul = document.getElementById('dpe-list'),
            li = document.createElement('li'),
            a = document.createElement('a');

        a.appendChild(document.createTextNode(topic));
        a.href = '#';
        li.appendChild(a);
        ul.appendChild(li);
        console.log(new Date().toLocaleString() + ': DPE found', topic);
    }
});
