var Subscriber = require('../helpers/subscriber').Subscriber;
const {requester} = require('../helpers/requester.js');
const {xMsgData} = require('../data/data.js');
const {xMsgMeta} = require('../data/meta.js');


let topic = process.argv[2].toString('utf8');
let data = {},
    subcription = new Subscriber('data:' + topic);


var req = new requester();
req.send(require('../data/request.js').createRequest(topic, 'serviceReportData?1'));
subcription.subscribe(function(topic, meta, msgData) {

    var metadata = new xMsgMeta(meta);
    var serializedData = new xMsgData(msgData);

    if (metadata.mimetype == "text/string") {
      var jsonString = serializedData.STRING;
      if (jsonString != 'OK') {
          try {
              data = JSON.parse(jsonString);
          } catch (e) {
              console.log(e);
          }
      }
    }
});

process.on('message', function(args) {
    process.send({
      'data': data
    });
});
