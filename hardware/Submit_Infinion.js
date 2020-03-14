// JavaScript source code
const Obniz = require("obniz");
var DPS310 = require("./DPS310");

var obniz1 = new Obniz("9735-6357");
var obniz2 = new Obniz("6379-9359");

var posture = 0;


var getPast = (function () {
    var lastDate = NaN;
    return function () {
        var now = Date.now();
        var past = now - lastDate;
        lastDate = now;
        return past;
    }
})();

//姿勢推定・DPS３１０
obniz1.onconnect = async function () {

    Obniz.PartsRegistrate(DPS310);
    obniz1.setVccGnd(4, 3, '5v');
    var sensor = obniz1.wired("DPS310", { sda: 0, scl: 1, gnd: 2 });
    let pastData = NaN;
    const check_pressure_dif = 10;
    await sensor.init();

    obniz1.display.clear();
    obniz1.display.print("Posture Sensing");

    obniz1.repeat(async function () {

        let nowData = await sensor.measurePressureOnce();
        var pressure_dif = nowData - pastData;
        console.log(pressure_dif);

        if (pressure_dif < check_pressure_dif) {
            posture = 1;
            console.log("Standing");
        } else if (pressure_dif > check_pressure_dif) {
            posture = 0;
            console.log("Sitting");

            while (pressure_dif > -check_pressure_dif) {
                let nowData = await sensor.measurePressureOnce();
                var pressure_dif = nowData - pastData;
                console.log(pressure_dif);

                pastData = nowData;

                await obniz1.wait(1000);
            }
            console.log("Standing");
        }
        
        pastData = nowData;
    }, 1000);
}

obniz2.onconnect = async function () {

    obniz2.setVccGnd(4, 3, '5v');
    var leaf1 = obniz2.wired("ServoMotor", { signal: 1, gnd: 0 });
    var leaf2 = obniz2.wired("ServoMotor", { signal: 2 });
    var leaf3 = obniz2.wired("ServoMotor", { signal: 3 });
    var i = 0;

    obniz2.display.clear();
    obniz2.display.print("Move ServoMotor");

    obniz2.repeat(async function () {

        if (posture == 1) {
            leaf1.angle(0);
            i = 0;
        } else if (posture == 0 && i < 100) {
            leaf1.angle(i);
            i += 5;
            await obniz2.wait(300);
        } else if (posture == 0 && i >= 100){
            console.log("Stand Up!!")
        }

    }, 1000);

}