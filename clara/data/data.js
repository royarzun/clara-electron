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

  fromDataType(dataType) {
    switch (dataType) {
      case "binary/sint32":
        return this.FLSINT32;
      case "binary/array-sint32":
        return this.FLSINT32A;
      case "binary/sint64":
        return this.FLSINT64;
      case "binary/array-sint64":
        return this.FLSINT64A;
      case "binary/float":
        return this.FLOAT;
      case "binary/array-float":
        return this.FLOATA;
      case "binary/double":
        return this.DOUBLE;
      case "binary/array-double":
        return this.DOUBLEA;
      case "text/string":
        return this.STRING;
      case "binary/array-string":
        return this.STRINGA;
      case "binary/bytes":
        return this.BYTES;
      case "binary/array-bytes":
        return this.BYTESA;
      default:
        return null;
    }
  }
}

exports.xMsgData = xMsgData;
