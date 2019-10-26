module.exports = class DPS310 {
    constructor() {
      this.requiredKeys = [];
      this.keys = ['gpio3', 'vcc', 'gnd', 'scl', 'sda'];
      this.ioKeys = ['gpio3', 'vcc', 'gnd', 'scl', 'sda'];
  
      this.configration = {
        DPS310__STD_SLAVE_ADDRESS: 0x77,
      };
  
      this.DPS310__OSR_SE = 3;
      this.DPS310__LSB = 0x01;
      this.DPS310__PRS_STD_MR = 2;
      this.DPS310__PRS_STD_OSR = 3;
      this.DPS310__TEMP_STD_MR = 2;
      this.DPS310__TEMP_STD_OSR = 3;
  
      this.DPS310__SUCCEEDED = 0;
      this.DPS310__FAIL_UNKNOWN = -1;
      this.DPS310__FAIL_INIT_FAILED = -2;
      this.DPS310__FAIL_TOOBUSY = -3;
      this.DPS310__FAIL_UNFINISHED = -4;
      this.prsMr = 0;
      this.prsOsr = 0;
      this.tempMr = 0;
      this.tempOsr = 0;
      this.m_lastTempScal = 0;
      this.mode = {
        IDLE: 0x00,
        CMD_PRS: 0x01,
        CMD_TEMP: 0x02,
        INVAL_OP_CMD_BOTH: 0x03, //invalid
        INVAL_OP_CONT_NONE: 0x04, //invalid
        CONT_PRS: 0x05,
        CONT_TMP: 0x06,
        CONT_BOTH: 0x07,
      };
      this.opMode = this.mode.IDLE;
      this.bitFileds = {
        DPS310__REG_INFO_PROD_ID: {
          address: 0x0d,
          mask: 0x0f,
          shift: 0,
        },
        DPS310__REG_INFO_REV_ID: {
          address: 0x0d,
          mask: 0xf0,
          shift: 4,
        },
        DPS310__REG_INFO_TEMP_SENSORREC: {
          address: 0x28,
          mask: 0x80,
          shift: 7,
        },
        DPS310__REG_INFO_TEMP_SENSOR: {
          address: 0x07,
          mask: 0x80,
          shift: 7,
        },
        DPS310__REG_INFO_OPMODE: {
          address: 0x08,
          mask: 0x07,
          shift: 0,
        },
        DPS310__REG_INFO_FIFO_FL: {
          address: 0x0c,
          mask: 0x80,
          shift: 7,
        },
        DPS310__REG_INFO_FIFO_EN: {
          address: 0x09,
          mask: 0x02,
          shift: 1,
        },
        /*      DPS310__REG_INFO_FIFO_EMPTY: {
                address: 0x0b,
                mask: 0x01,
                shift: 0,
              },*/
        /*      DPS310__REG_INFO_FIFO_FULL: {
                address: 0x0b,
                mask: 0x02,
                shift: 1,
              },*/
        /*      DPS310__REG_INFO_INT_HL: {
                address: 0x09,
                mask: 0x80,
                shift: 7,
              },*/
        /*      DPS310__REG_INFO_INT_SEL: {
                address: 0x09,
                mask: 0x70,
                shift: 4,
              },*/
        DPS310__REG_INFO_TEMP_MR: {
          address: 0x07,
          mask: 0x70,
          shift: 4,
        },
        DPS310__REG_INFO_TEMP_OSR: {
          address: 0x07,
          mask: 0x07,
          shift: 0,
        },
        DPS310__REG_INFO_PRS_MR: {
          address: 0x06,
          mask: 0x70,
          shift: 4,
        },
        DPS310__REG_INFO_PRS_OSR: {
          address: 0x06,
          mask: 0x07,
          shift: 0,
        },
        DPS310__REG_INFO_PRS_SE: {
          address: 0x09,
          mask: 0x04,
          shift: 2,
        },
        DPS310__REG_INFO_PRS_RDY: {
          address: 0x08,
          mask: 0x10,
          shift: 4,
        },
        DPS310__REG_INFO_TEMP_SE: {
          address: 0x09,
          mask: 0x08,
          shift: 3,
        },
        DPS310__REG_INFO_TEMP_RDY: {
          address: 0x08,
          mask: 0x20,
          shift: 5,
        },
      };
  
      this.dataBlock = {
        DPS310__REG_ADR_COEF: {
          address: 0x10,
          length: 18,
        },
        DPS310__REG_ADR_PRS: {
          address: 0x00,
          length: 3,
        },
        DPS310__REG_ADR_TEMP: {
          address: 0x03,
          length: 3,
        },
      };
  
      this.coeffs = {};
      this.scaling_facts = [
        524288,
        1572864,
        3670016,
        7864320,
        253952,
        516096,
        1040384,
        2088960,
      ];
    }
    //縺薙％縺ｾ縺ｧ蛻晄悄蛹�
  
    static info() {
      return {
        name: 'DPS310',
        datasheet: '',
      };
    }
  
    wired(obniz) {
      this.obniz = obniz;
  
      this.obniz.setVccGnd(this.params.vcc, null, '3v');
      this.obniz.setVccGnd(null, this.params.gnd, '5v');
      this.obniz.wait(50);
  
      this.address = 0x77;
  
      this.params.sda = this.params.sda;
      this.params.scl = this.params.scl;
      this.params.clock = this.params.clock || 100 * 1000;
      this.params.mode = 'master';
      this.params.pull = '3v';
      this.i2c = obniz.getI2CWithConfig(this.params);
  
      this.obniz.wait(10);
    }
  
    async readByte(regAddress) {
      this.obniz.i2c0.write(this.address, [regAddress]);
      await this.obniz.wait(1);
      // console.log('readByte ' + regAddress);
      let results = await this.obniz.i2c0.readWait(this.address, 1);
      // console.log('readByte finished');
      return results[0];
    }
  
    async readByteBitfield(field) {
      let regAddress = field.address,
        mask = field.mask,
        shift = field.shift;
      let ret = await this.readByte(regAddress);
      if (ret < 0) {
        return ret;
      }
      if (mask !== undefined) {
        ret = ret & mask;
      }
      if (shift !== undefined) {
        ret = ret >> shift;
      }
      return ret;
    }
  
    async readBlock(datablock) {
      let address = datablock.address,
        length = datablock.length;
      await this.obniz.wait(1);
      this.i2c.write(this.address, [address]);
      let results = await this.i2c.readWait(this.address, length);
      return results;
    }
  
    async writeByte(regAddress, data, check) {
      this.i2c.write(this.address, [regAddress, data]);
      if (check) {
        if ((await this.readByte(regAddress)) !== data) {
          throw new Error('DPS310 data write failed');
        }
      }
    }
  
    async writeByteBitfield(field, data, check) {
      let old = await this.readByte(field.address);
      let sendData = (old & ~field.mask) | ((data << field.shift) & field.mask);
  
      await this.writeByte(field.address, sendData, check);
    }
  
    async setOpModeDetail(background, temperature, pressure) {
      let opMode =
        ((background & this.DPS310__LSB) << 2) |
        ((temperature & this.DPS310__LSB) << 1) |
        (pressure & this.DPS310__LSB);
      return await this.setOpMode(opMode);
    }
    async setOpMode(opMode) {
      opMode &=
        this.bitFileds.DPS310__REG_INFO_OPMODE.mask >>
        this.bitFileds.DPS310__REG_INFO_OPMODE.shift;
  
      await this.writeByte(
        this.bitFileds.DPS310__REG_INFO_OPMODE.address,
        opMode
      );
      this.opMode = opMode;
      // int16_t Dps310::setOpMode(uint8_t opMode)
      // {
      //   //Filter irrelevant bits
      //   opMode &= DPS310__REG_MASK_OPMODE >> DPS310__REG_SHIFT_OPMODE;
      //   //Filter invalid OpModes
      //   if(opMode == INVAL_OP_CMD_BOTH || opMode == INVAL_OP_CONT_NONE)
      //   {
      //     return DPS310__FAIL_UNKNOWN;
      //   }
      //   //Set OpMode
      //   if(writeByte(DPS310__REG_ADR_OPMODE, opMode))
      //   {
      //     return DPS310__FAIL_UNKNOWN;
      //   }
      //   m_opMode = (Dps310::Mode)opMode;
      //   return DPS310__SUCCEEDED;
      // }
    }
    async standby() {
      this.setOpMode(this.mode.IDLE);
      await this.writeByteBitfield(this.bitFileds.DPS310__REG_INFO_FIFO_FL, 1);
      await this.writeByteBitfield(this.bitFileds.DPS310__REG_INFO_FIFO_EN, 0);
    }
    async configTemp(tempMr, tempOsr) {
      await this.writeByteBitfield(
        this.bitFileds.DPS310__REG_INFO_TEMP_MR,
        tempMr
      );
      await this.writeByteBitfield(
        this.bitFileds.DPS310__REG_INFO_TEMP_OSR,
        tempOsr
      );
  
      if (tempOsr > this.DPS310__OSR_SE) {
        await this.writeByteBitfield(this.bitFileds.DPS310__REG_INFO_TEMP_SE, 1);
      } else {
        await this.writeByteBitfield(this.bitFileds.DPS310__REG_INFO_TEMP_SE, 0);
      }
  
      this.tempMr = tempMr;
      this.tempOsr = tempOsr;
    }
  
    async configPressure(prsMr, prsOsr) {
      // int16_t Dps310::configPressure(uint8_t prsMr, uint8_t prsOsr)
      // {
      //   //mask parameters
  
      await this.writeByteBitfield(this.bitFileds.DPS310__REG_INFO_PRS_MR, prsMr);
      await this.writeByteBitfield(
        this.bitFileds.DPS310__REG_INFO_PRS_OSR,
        prsOsr
      );
  
      if (prsOsr > this.DPS310__OSR_SE) {
        await this.writeByteBitfield(this.bitFileds.DPS310__REG_INFO_PRS_SE, 1);
      } else {
        await this.writeByteBitfield(this.bitFileds.DPS310__REG_INFO_PRS_SE, 0);
      }
      this.prsMr = prsMr;
      this.prsOsr = prsOsr;
    }
  
    async readCoeffs() {
      console.log('readCoeffs');
      let buffer = await this.readBlock(this.dataBlock.DPS310__REG_ADR_COEF);
  
      console.log('readCoeffs finished');
      this.coeffs.m_c0Half = (buffer[0] << 4) | ((buffer[1] >> 4) & 0x0f);
      if (this.coeffs.m_c0Half & (1 << 11)) {
        this.coeffs.m_c0Half -= 1 << 12;
      }
      this.coeffs.m_c0Half = this.coeffs.m_c0Half / 2;
  
      this.coeffs.m_c1 = ((buffer[1] & 0x0f) << 8) | buffer[2];
      if (this.coeffs.m_c1 & (1 << 11)) {
        this.coeffs.m_c1 -= 1 << 12;
      }
  
      this.coeffs.m_c00 =
        (buffer[3] << 12) | (buffer[4] << 4) | ((buffer[5] >> 4) & 0x0f);
  
      if (this.coeffs.m_c00 & (1 << 19)) {
        this.coeffs.m_c00 -= 1 << 20;
      }
  
      this.coeffs.m_c10 =
        ((buffer[5] & 0x0f) << 16) | (buffer[6] << 8) | buffer[7];
      if (this.coeffs.m_c10 & (1 << 19)) {
        this.coeffs.m_c10 -= 1 << 20;
      }
  
      this.coeffs.m_c01 = (buffer[8] << 8) | buffer[9];
      if (this.coeffs.m_c01 & (1 << 15)) {
        this.coeffs.m_c01 -= 1 << 16;
      }
  
      this.coeffs.m_c11 = (buffer[10] << 8) | buffer[11];
      if (this.coeffs.m_c11 & (1 << 15)) {
        this.coeffs.m_c11 -= 1 << 16;
      }
  
      this.coeffs.m_c20 = (buffer[12] << 8) | buffer[13];
      if (this.coeffs.m_c20 & (1 << 15)) {
        this.coeffs.m_c20 -= 1 << 16;
      }
  
      this.coeffs.m_c21 = (buffer[14] << 8) | buffer[15];
      if (this.coeffs.m_c21 & (1 << 15)) {
        this.coeffs.m_c21 -= 1 << 16;
      }
  
      this.coeffs.m_c30 = (buffer[16] << 8) | buffer[17];
      if (this.coeffs.m_c30 & (1 << 15)) {
        this.coeffs.m_c30 -= 1 << 16;
      }
    }
  
    async init() {
      console.log('start init');
      let prodId = await this.readByteBitfield(
        this.bitFileds.DPS310__REG_INFO_PROD_ID
      );
      if (prodId != 0) {
        console.error('prodId');
        return;
      }
      console.log('prodId OK');
      console.log('reading bits...');
      await this.readByteBitfield(this.bitFileds.DPS310__REG_INFO_REV_ID);
  
      await this.readByteBitfield(this.bitFileds.DPS310__REG_INFO_TEMP_SENSORREC);
  
      console.log('setting bits...');
      await this.writeByteBitfield(
        this.bitFileds.DPS310__REG_INFO_TEMP_SENSOR,
        0
      );
  
      await this.readCoeffs();
      await this.standby();
      //
      // //set measurement precision and rate to standard values;
      await this.configTemp(this.DPS310__TEMP_STD_MR, this.DPS310__TEMP_STD_OSR);
      await this.configPressure(
        this.DPS310__PRS_STD_MR,
        this.DPS310__PRS_STD_OSR
      );
      await this.standby();
      //
      // //perform a first temperature measurement
      // //the most recent temperature will be saved internally
      // //and used for compensation when calculating pressure
      // int32_t trash;
  
      await this.measureTempOnce();
      //
      // //make sure the DPS310 is in standby after initialization
      await this.standby();
      //
      // // Fix IC with a fuse bit problem, which lead to a wrong temperature
      // // Should not affect ICs without this problem
      await this.correctTemp();
    }
  
    async getSingleResult() {
      //read finished bit for current opMode
      let rdy;
      switch (this.opMode) {
        case this.mode.CMD_TEMP: //temperature
          rdy = await this.readByteBitfield(
            this.bitFileds.DPS310__REG_INFO_TEMP_RDY
          );
          break;
        case this.mode.CMD_PRS: //pressure
          rdy = await this.readByteBitfield(
            this.bitFileds.DPS310__REG_INFO_PRS_RDY
          );
          break;
        default:
          //DPS310 not in command mode
          return this.DPS310__FAIL_TOOBUSY;
      }
  
      let oldMode;
      //read new measurement result
      switch (rdy) {
        case this.DPS310__FAIL_UNKNOWN: //could not read ready flag
          throw new Error('DPS310__FAIL_UNKNOWN');
        case 0: //ready flag not set, measurement still in progress
          return this.obniz.wait(10).then(() => {
            return this.getSingleResult();
          });
        case 1: //measurement ready, expected case
          oldMode = this.opMode;
          this.opMode = this.mode.IDLE; //opcode was automatically reseted by DPS310
          switch (oldMode) {
            case this.mode.CMD_TEMP: //temperature
              return await this.getTemp(); //get and calculate the temperature value
            case this.mode.CMD_PRS: //pressure
              return await this.getPressure(); //get and calculate the pressure value
            default:
              throw new Error('DPS310__FAIL_UNKNOWN'); //should already be filtered above
          }
      }
      throw new Error('DPS310__FAIL_UNKNOWN');
    }
  
    async startMeasureTempOnce(oversamplingRate) {
      await this.configTemp(0, oversamplingRate);
      await this.setOpModeDetail(0, 1, 0);
    }
    async startMeasurePressureOnce(oversamplingRate) {
      await this.configPressure(0, oversamplingRate);
      //set device to pressure measuring mode
      await this.setOpModeDetail(0, 0, 1);
    }
  
    calcPressure(raw) {
      let prs = raw;
  
      //scale pressure according to scaling table and oversampling
      prs /= this.scaling_facts[this.prsOsr];
  
      //Calculate compensated pressure
      prs =
        this.coeffs.m_c00 +
        prs *
        (this.coeffs.m_c10 +
          prs * (this.coeffs.m_c20 + prs * this.coeffs.m_c30)) +
        this.m_lastTempScal *
        (this.coeffs.m_c01 +
          prs * (this.coeffs.m_c11 + prs * this.coeffs.m_c21));
  
      //return pressure
      return prs;
    }
  
    calcTemp(raw) {
      let temp = raw;
  
      //scale temperature according to scaling table and oversampling
      temp /= this.scaling_facts[this.tempOsr];
  
      //update last measured temperature
      //it will be used for pressure compensation
      this.m_lastTempScal = temp;
  
      //Calculate compensated temperature
      temp = this.coeffs.m_c0Half + this.coeffs.m_c1 * temp;
  
      //return temperature
      return temp;
    }
  
    async correctTemp() {
      this.writeByte(0x0e, 0xa5);
      this.writeByte(0x0f, 0x96);
      this.writeByte(0x62, 0x02);
      this.writeByte(0x0e, 0x00);
      this.writeByte(0x0f, 0x00);
  
      await this.measureTempOnce();
    }
  
    async measureTempOnce(oversamplingRate) {
      if (oversamplingRate === undefined) {
        oversamplingRate = this.tempOsr;
      }
      await this.startMeasureTempOnce(oversamplingRate);
      await this.obniz.wait(100);
      let ret = await this.getSingleResult();
      return ret;
    }
  
    async measurePressureOnce(oversamplingRate) {
      if (oversamplingRate === undefined) {
        oversamplingRate = this.prsOsr;
      }
      //start the measurement
      await this.startMeasurePressureOnce(oversamplingRate);
  
      await this.obniz.wait(100);
      // //wait until measurement is finished
      // delay(calcBusyTime(0U, m_prsOsr)/DPS310__BUSYTIME_SCALING);
      // delay(DPS310__BUSYTIME_FAILSAFE);
  
      let ret = await this.getSingleResult();
      return ret;
    }
  
    async getTemp() {
      let data = await this.readBlock(this.dataBlock.DPS310__REG_ADR_TEMP);
  
      //compose raw temperature value from buffer
      let temp = (data[0] << 16) | (data[1] << 8) | data[2];
      //recognize non-32-bit negative numbers
      //and convert them to 32-bit negative numbers using 2's complement
      if (temp & (1 << 23)) {
        temp -= 1 << 24;
      }
      let result = this.calcTemp(temp);
      // console.log(
      //   '貂ｩ蠎ｦ��' + JSON.stringify(data) + ' -> ' + temp + ' -> ' + result
      // );
      return result;
    }
  
    async getPressure() {
      let data = await this.readBlock(this.dataBlock.DPS310__REG_ADR_PRS);
  
      let prs = (data[0] << 16) | (data[1] << 8) | data[2];
      if (prs & (1 << 23)) {
        prs -= 1 << 24;
      }
  
      let result = this.calcPressure(prs);
      // console.log(
      //   '豌怜悸��' + JSON.stringify(data) + ' -> ' + prs + ' -> ' + result
      // );
      return result;
    }
  }