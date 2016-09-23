const builder = require('protobufjs').loadProtoFile(__dirname + "/proto/xMsgMeta.proto"),
    xMsgMetaBuilder = builder.build("org.jlab.coda.xmsg.data.xMsgMeta");

class xMsgMeta {
  constructor(buffer){
    this.meta = xMsgMetaBuilder.decode(buffer);
  }

  get author() {
    return this.meta.author;
  }

  get composition() {
    return this.meta.composition;
  }

  get mimetype() {
    return this.meta.dataType;
  }


}

exports.xMsgMeta = xMsgMeta;
// Usage from outside:
// var meta = require('./data/meta.js');
// var xmsgmeta = new meta.xMsgMeta(metadata);
