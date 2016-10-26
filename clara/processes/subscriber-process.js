var Subscriber = require('../helpers/subscriber').Subscriber;
const {requester} = require('../helpers/requester.js');
const {xMsgData} = require('../data/data.js');
const {xMsgMeta} = require('../data/meta.js');


let topic = process.argv[2].toString('utf8');
var data = {},
    subcription = new Subscriber('data:' + topic);


var req = new requester();
req.send(require('../data/request.js').createRequest(topic, 'serviceReportData?1'));
subcription.subscribe(function(topic, meta, msgData) {

    var metadata = new xMsgMeta(meta);
    var serializedData = new xMsgData(msgData);
    try{
      // TODO: Since we are using NAIADS as test case, im just catching messages
      // with ARRAY of STRINGS, because i know its here where the stats are coming
      // from, for real case mimetype should be provided from metadata. 
      data = serializedData.STRINGA;
    } catch (e) {
      console.log(e);
    }
});

process.on('message', function() {
    process.send(data);
});
