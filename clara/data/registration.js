const builder = require('protobufjs').loadProtoFile(__dirname + "/proto/xMsgRegistration.proto"),
    xMsgRegistrationBuilder = builder.build("org.jlab.coda.xmsg.data.xMsgRegistration");

class xMsgRegistration {
  constructor(buffer){
    this.register = xMsgRegistrationBuilder.decode(buffer);
  }

  get name() {
    return this.register.name;
  }

  get description() {
    return this.register.description;
  }

  get host() {
    return this.register.host;
  }

  get port() {
    return this.register.port;
  }
}

exports.xMsgRegistration = xMsgRegistration;
