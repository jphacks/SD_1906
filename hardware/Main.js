const Obniz = require("obniz");
var DPS310 = require("./DPS310");

var obniz1 = new Obniz("1552-7989");
var obniz2 = new Obniz("9800-4747");


var getPast = (function(){
    var lastDate = NaN;
  return function() {
    var now = Date.now();
    var past = now - lastDate;
    lastDate = now;
    return past;
  }
})();

obniz1.onconnect = async function () {
    
    Obniz.PartsRegistrate(DPS310);
    obniz1.setVccGnd(4,3,'5v');
    var sensor = obniz1.wired("DPS310", {sda:0, scl:1, gnd:2});
    let pastData = NaN;
    const check_pressure_dif = 100; 
    var angle = 80;
    var posture = 0;
    await sensor.init();
    moveMotor(80, 0);
    console.log("set angle");

    while(1){

        let nowData = await sensor.measurePressureOnce();
        var pressure_dif = nowData - pastData;
        var elapsedTime = 0;
        console.log(pressure_dif);

        if(pressure_dif > check_pressure_dif){

            var sittingTime = Date.now();
            angle = 80;
            posture = 0;
            console.log("sitting");
            
            while(pressure_dif > -check_pressure_dif){
                nowData = await sensor.measurePressureOnce();
                pressure_dif = nowData - pastData;
                console.log(pressure_dif);
                console.log("keep sitting");
                pastData = nowData;
                obniz1.wait(300);

                if(elapsedTime > 5000){
                    moveMotor(angle, posture);
                    angle--;
                }
            }

        }else if(pressure_dif < -check_pressure_dif + 60){

            var standingTime = Date.now();
            angle = 0;
            posture = 1;
            console.log("standing");
            
            while(pressure_dif < check_pressure_dif){
                nowData = await sensor.measurePressureOnce();
                pressure_dif = nowData - pastData;
                console.log(pressure_dif);
                console.log("keep standing");
                pastData = nowData;
                obniz1.wait(300);

                if(checkElapsedTime(standingTime) > 6000){
                    moveMotor(angle, posture);
                    angle++;
                }
            }

        }
        pastData = nowData;
        obniz1.wait(1000);
    }
}
moveMotor = async function(angle, posture){
    var obniz2 = new Obniz("9800-4747");
    obniz2.onconnect = async function () {

        var leaf1 = obniz2.wired("ServoMotor", {signal:1, gnd:0});
        var leaf2 = obniz2.wired("ServoMotor", {signal:2});
        var leaf3 = obniz2.wired("ServoMotor", {signal:3});

        if(angle > 0 && posture == 0){
            leaf1.angle(angle);
            leaf2.angle(180-angle);
            leaf3.angle(angle);
            console.log("leaf");
        }

        if(angle < 80 && posture == 1){
            leaf1.angle(angle);
            leaf2.angle(180-angle);
            leaf3.angle(angle);
        }
        
    }
}