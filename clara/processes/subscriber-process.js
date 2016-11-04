const {Subscriber} = require('../helpers/subscriber.js');
const {Requester} = require('../helpers/requester.js');
const {xMsgData} = require('../data/data.js');
const {xMsgMeta} = require('../data/meta.js');


let topic = process.argv[2].toString('utf8');
let dataType = process.argv[3].toString('utf8');

var data = {},
    subcription = new Subscriber('data:' + topic),
    req = new Requester();

req.send(require('../data/request.js').createRequest(topic, 'serviceReportData?1'));

subcription.subscribe(function(topic, meta, msgData) {
    var metadata = new xMsgMeta(meta),
        serializedData = new xMsgData(msgData);

    try{
      var deserializedData = serializedData.fromDataType(dataType);
      if (deserializedData) {
        data = deserializedData;
      }
    } catch (e) {
      console.log(e);
    }
});

process.on('message', function () {
    process.send(data);
});

process.on('exit', function () {
    subscription.unsubscribe();
});
