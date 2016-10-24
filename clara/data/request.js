const {xMsgMetaBuilder} = require('./meta.js');

function createRequest(topic, data){
    var metadata = new xMsgMetaBuilder();
    metadata.setDataType('text/string');
    return [topic, metadata.toBuffer(), data];
}

exports.createRequest = createRequest;
