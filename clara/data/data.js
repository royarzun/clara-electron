const builder = require('protobufjs').loadProtoFile(__dirname + "/proto/xMsgData.proto"),
    xMsgDataBuilder = builder.build("org.jlab.coda.xmsg.data.xMsgData");

class xMsgData {
  constructor(buffer){
    this.data = xMsgDataBuilder.decode(buffer);
  }

  get BYTES() {
    return this.data.BYTES;
  }

  get BYTESA() {
    return this.data.BYTESA;
  }

  get DOUBLE() {
    return this.data.DOUBLE;
  }

  get DOUBLEA() {
    return this.data.DOUBLEA;
  }

  get FLOAT() {
    return this.data.FLOAT;
  }

  get FLOATA() {
    return this.data.FLOATA;
  }

  get FLSINT32() {
    return this.data.FLSINT32;
  }

  get FLSINT32A() {
    return this.data.FLSINT32A;
  }

  get FLSINT64() {
    return this.data.FLSINT64;
  }

  get FLSINT64A() {
    return this.data.FLSINT64A;
  }

  get STRING() {
    return this.data.STRING;
  }

  get STRINGA() {
    return this.data.STRINGA;
  }
}

exports.xMsgData = xMsgData;
