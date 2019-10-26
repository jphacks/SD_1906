const Obniz = require("obniz");
var DPS310 = require("./DPS310");

var obniz1 = new Obniz("9800-4747");
var obniz2 = new Obniz("1552-7989");

var checkElapsedTime = (function(startTime){
    var nowTime = Date.now();
    return function(){
        var elapsedTime = nowTime - startTime;
        return elapsedTime;
    }

}());

obniz1.onconnect = async function () {
    Obniz.PartsRegistrate(DPS310);
    obniz1.setVccGnd(4,3,'5v');
    var sensor = obniz1.wired("DPS310", {sda:0, scl:1, gnd:2});
    let pastData = NaN;
    const check_pressure_dif = 200; 
    var posture_sitting;
    var keep_posture;

    await sensor.init();
    let nowData = await sensor.measurePressureOnce();
    var pressure_dif = nowData - pastData;

    if(pressure_dif > check_pressure_dif){
        posture_sitting = 0;
        keep_posture = 1;
        console.log('Sitting');
    }else if(pressure_dif < -check_pressure_dif){
        posture_sitting = 1;
        keep_posture = 1;
        console.log('Standing');
    }else if(posture_sitting == 0 && pressure_dif < check_pressure_dif && pressure_dif > -check_pressure_dif){
        keep_posture = 0;
        console.log('keep sitting');
    }else if(posture_sitting == 1 && pressure_dif > -check_pressure_dif && pressure_dif < check_pressure_dif){
        keep_posture = 0;
        console.log('keep standing');
    }

    if(posture_sitting == 0 && keep_posture == 1){
        obniz2.onconnect(0);
    }else if(posture_sitting == 1 && keep_posture == 1){
        obniz2.onconnect(1);
    }else if(posture_sitting == 0 && keep_posture == 0){
        obniz2.onconnect(2);
    }else if(posture_sitting == 1 && keep_posture == 0){
        obniz2.onconnect(3);
    }
    pastData = nowData;
}

obniz2.onconnect = async function (posture) {

    var i = 0;
    var leaf1 = obniz2.wired("ServoMotor", {signal:1, gnd:0});
    var leaf2 = obniz2.wired("ServoMotor", {signal:2});
    var leaf3 = obniz2.wired("ServoMotor", {signal:3});

    if(posture == 0){
        var sittingTime = Date.now();
        obniz1.onconnect();
    }else if(posture == 1){
        var standingTime = Date.now();
        obniz1.onconnect();
    }else if(posture == 2){
        if(checkElapsedTime(sittingTime) > 18000){
                if(i > 0){
                    leaf1.angle(i);
                    leaf2.angle(180-i);
                    leaf3.angle(i);
                    i = i - 1;
                    setTimeout(obniz1.onconnect(), 500);
                }
        }else{
            obniz2.onconnect();
        }
    }else if(posture == 3){
        if(checkElapsedTime(standingTime) > 6000){
                if(i < 80){
                    leaf1.angle(i);
                    leaf2.angle(180-i);
                    leaf3.angle(i);
                    i = i + 1;
                    setTimeout(obniz1.onconnect(), 100);
                }
        };
    }
}