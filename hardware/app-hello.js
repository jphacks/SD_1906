const Obniz = require("obniz");

var obniz = new Obniz("1552-7989");

obniz.onconnect = async function () {

  obniz.display.clear();
  obniz.display.print("Move ServoMotor");
  
  var servo1 = obniz.wired("ServoMotor", {signal:1, gnd:0});
  var servo2 = obniz.wired("ServoMotor", {signal:2});
  var servo3 = obniz.wired("ServoMotor", {signal:3});
  servo1.angle(80.0);
  servo2.angle(80.0);
  servo3.angle(80.0);
}