const Obniz = require("obniz");

var getPast = (function() {
  var lastDate = NaN;
  return function() {
    var now = Date.now();
    var past = now - lastDate;
    lastDate = now;
    return past;
  };
})();

var obniz = new Obniz("1552-7989");

  obniz.onconnect = async function () {

  obniz.display.clear();
  obniz.display.print("Move ServoMotor");
  
  var i = 10;
  var time = 0;
  var Past = 0;
  var leaf1 = obniz.wired("ServoMotor", {signal:1, gnd:0});
  var leaf2 = obniz.wired("ServoMotor", {signal:2});
  var leaf3 = obniz.wired("ServoMotor", {signal:3});
  leaf1.angle(80);
  leaf2.angle(80);
  leaf3.angle(80);

    obniz.repeat(async function(){
      if(i > 0){
        leaf1.angle(i);
        leaf2.angle(i);
        leaf3.angle(i);
        i = i - 1;
      }else{
        i = 10;
        Past = getPast();
        console.log(Past);
        if(Past != NaN){
          time = time + Past;
          console.log(time);
        }
      }
    }, 1000);
}