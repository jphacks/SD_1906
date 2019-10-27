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

var onLED5 = false;
var onLED6 = false;
var onLED7 = false;
var onLED8 = false;
var onLED9 = false;
var onLED10 = false;
  
function adjustLED(){
  obniz2.io5.output(onLED5);
  obniz2.io6.output(onLED6);
  obniz2.io7.output(onLED7);
  obniz2.io8.output(onLED8);
  obniz2.io9.output(onLED9);
  obniz2.io10.output(onLED10);
}

obniz1.onconnect = async function () {
    
    Obniz.PartsRegistrate(DPS310);
    obniz1.setVccGnd(4,3,'5v');
    var sensor = obniz1.wired("DPS310", {sda:0, scl:1, gnd:2});
    let pastData = NaN;
    const check_pressure_dif = 100; 
    var angle = 30;
    var posture = 0;
    await sensor.init();
    moveMotor(80, 0);
    console.log("set angle");

    while(1){

        let nowData = await sensor.measurePressureOnce();
        var pressure_dif = nowData - pastData;
        var elapsedTime = 0;
        var PastTime1 = 0;
        var PastTime2 = 0;
        console.log(pressure_dif);

        if(pressure_dif > check_pressure_dif){

            var sittingTime = Date.now();
            angle = 30;
            posture = 0;
            console.log("sitting");
            
            while(pressure_dif > -check_pressure_dif){
                nowData = await sensor.measurePressureOnce();
                pressure_dif = nowData - pastData;
                console.log(pressure_dif);
                console.log("keep sitting");
                pastData = nowData;
                PastTime1 = getPast();
                elapsedTime = PastTime1 + PastTime2;
                PastTime2 = elapsedTime;
                obniz1.wait(300);

                if(elapsedTime > 1800000){
                    moveMotor(angle, posture);
                    angle--;
                }
            }

        }else if(pressure_dif < -check_pressure_dif + 70){

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
                PastTime1 = getPast();
                elapsedTime = PastTime1 + PastTime2;
                PastTime2 = elapsedTime;
                obniz1.wait(300);

                if(elapsedTime > 60000){
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
        obniz2.io4.output(false);

        if(angle > 0 && posture == 0){
            leaf1.angle(angle);
            leaf2.angle(180-angle);
            leaf3.angle(angle);
            console.log("move leaf");
            if(angle < 29 && onLED5) onLED5 = false; 
            else if(angle < 25 && onLED6) onLED6 = false;
            else if(angle < 20 && onLED7) onLED7 = false;
            else if(angle < 15 && onLED8) onLED8 = false;
            else if(angle < 10 && onLED9) onLED9 = false;
            else if(angle < 5 && onLED10) onLED10 = false;
            adjustLED();
        }

        if(angle < 30 && posture == 1){
            leaf1.angle(angle);
            leaf2.angle(180-angle);
            leaf3.angle(angle);
            if(angle < 29 && !onLED5) onLED5 = true; 
            else if(angle < 25 && !onLED6) onLED6 = true;
            else if(angle < 20 && !onLED7) onLED7 = true;
            else if(angle < 15 && !onLED8) onLED8 = true;
            else if(angle < 10 && !onLED9) onLED9 = true;
            else if(angle < 5 && !onLED10) onLED10 = true;
            adjustLED();
        }
        
    }
}