var ipc = require('electron').ipcRenderer;
var subscriber = require('../helpers/subscriber');
let set = new Set();


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
        a.addEventListener('click', function () {
          ipc.send('start-histogram', topic)
        });
        li.appendChild(a);
        ul.appendChild(li);

        console.log(new Date().toLocaleString() + ': DPE found', topic);
    }
});

window.onclosed = function(){
    aliVeSubscription.unsubscribe()
};

window.onerror = function(error, url, line) {
    ipc.send('errorInWindow', error);
};
