var Obniz = require("obniz");
var DPS310 = require("./DPS310");

var obniz = new Obniz("9800-4747");
obniz.onconnect = async function () {
    Obniz.PartsRegistrate(DPS310);
        obniz.setVccGnd(11,9,'5v');
        var sensor = obniz.wired("DPS310", {sda:0, scl:1, gnd:2});

        await sensor.init();

        var sitOrStandThreshold = 99500.0;
        var sitDown = false;
        
        while(1) {
          let data = await sensor.measurePressureOnce();
          
          if(data > sitOrStandThreshold && !sitDown) {
            sitDown = true;
            console.log("sitDown");
            const startTime = Date.now();
          }
          
          if(data < sitOrStandThreshold && sitDown) {
            sitDown = false; 
            console.log("standUp");
            const endTime = Data.now();
            const stretch = endTime - startTime;
            console.log(stretch);
          }  
          console.log("standUp");
          await obniz.wait(1000);
        } 
}