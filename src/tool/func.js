const User = require('../app/models/user/UserManagementModel')
const Project = require('../app/models/user/projectID')
const PhaseOne = require('../app/models/data/cabinPhaseOne')
const PhaseTwo = require('../app/models/data/cabinPhaseTwo')
const PhaseThree = require('../app/models/data/cabinPhaseThree')
const PhaseSummary = require('../app/models/data/cabinSummary')
const DI = require('../app/models/IO/DI')
const DO = require('../app/models/IO/DO')
const DASetting = require('../app/models/alarm/cabinDigitalAlarm')
const AASetting = require('../app/models/alarm/cabinAnalogAlarms')
const DigitalAlert = require('../app/models/alarm/dAlert')
const AnalogAlert = require('../app/models/alarm/aAlert')
const {mongooseToObject} = require('../tool/mongoose')
const jwt = require('jsonwebtoken')
module.exports.arrayCabinDataToObject = (arr, date) => {
        var rv = {};
        var i = 0
        for ( ; i < arr.length; ++i)
          rv[i] = arr[i];
        rv[i] = date
        return rv;
    }

/* Site func */
module.exports.checkAdmin = async () => {
  var adminPhone = process.env.phone
  var admin = await User.findOne({phone: adminPhone})
  if(admin) return true
  return false
}

module.exports.createAdmin = async () => {
  console.log(process.env.email)
  var newUser = new User({
    email: process.env.email,
    role: 'admin',
    username: process.env.admin,
    phone: process.env.phone,
    password: process.env.password,
    //project_id: [ process.env.project_id_1, process.env.project_id_2, process.env.project_id_3]
  })
  newUser.save()
    .then((result) => {
      console.log('New Admin is creacted!')
    })
    .catch(err => {console.log(err)})
}

module.exports.checkStateProject = (state) => {
  state = state.toLowerCase()
  return state === 'active' ? true : false
}

module.exports.findDeviceById = async (deviceID, exec) => {
  await Project.findOne({_id: deviceID}, exec)
}

/* Check JSON */
module.exports.isJSON = (str) => {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

/* Convert JSON Phase One To Object */
module.exports.Json2Object = (object) => {
  if(object.V1N) {
    return {
      /* Phase One */
      V1N: object.V1N,
      V12: object.V12,
      I1: object.I1,
      KW1: object.KW1,
      KVA1: object.KVA1,
      KVAR1: object.KVAR1,
      PF1: object.PF1,
      freq: object.f,

      /* Phase Two */
      V2N: object.V2N,
      V23: object.V23,
      I2: object.I2,
      KW2: object.KW2,
      KVA2: object.KVA2,
      KVAR2: object.KVAR2,
      PF2: object.PF2,
      KWH: object.KWH,

      /* Phase Three */
      V3N: object.V3N,
      V31: object.V31,
      I3: object.I3,
      KW3: object.KW3,
      KVA3: object.KVA3,
      KVAR3: object.KVAR3,
      PF3: object.PF3,

      /* Phase Sum */
      VLN: object.AV_LN,
      VLL: object.AV_LL,
      I: object.AI,
      KW0: object.Total_KW,
      KVA0: object.Total_KVA,
      KVAR0: object.Total_KVAR,
      PF0: object.A_VF
    }
  }
  else if(object.SensorA) {
    return {
      DI0: object.SensorA,
      DI1: object.SensorB,
      DO0: object.RelayA,
      DO1: object.RelayB
    }
  }
  else {
    console.log('Error: JSON do not expect')
  }
}

/* Calculate Elapsed Time In Second */
module.exports.elapsedTimeInSecond = (start, end) => {
  let startInSecond = Math.floor(start / 1000) 
  let endInSecond = Math.floor(end / 1000) 
  return endInSecond - startInSecond
}

/* Save Phase One Data*/
module.exports.saveData2PhaseOne = (data, time) => {
  var phaseOneData = {
    device_id: "60df0995d808801a6cab9964",
    nsample: 9,
    samples: {
      VLN     :   data.V1N,
      VLL     :   data.V12,
      I      :   data.I1,
      KW      :   data.KW1,
      KVAR    :   data.KVAR1,
      KVA     :   data.KVA1,
      PF      :   data.PF1,
      freq   : data.freq,
      timeStamp : time
    }
  }
  const newPhaseOneData = new PhaseOne(phaseOneData)
  newPhaseOneData.save()
    .then()
    .catch(err => {console.log(err)})
}

/* Save Phase Two Data*/
module.exports.saveData2PhaseTwo = (data, time) => {
  var phaseTwoData = {
    device_id: "60df0995d808801a6cab9964",
    nsample: 9,
    samples: {
      VLN     :   data.V2N,
      VLL     :   data.V23,
      I      :   data.I2,
      KW      :   data.KW2,
      KVAR    :   data.KVAR2,
      KVA     :   data.KVA2,
      PF      :   data.PF2,
      KWH     : data.KWH,
      timeStamp : time
    }
  }
  const newPhaseTwoData = new PhaseTwo(phaseTwoData)
  newPhaseTwoData.save()
    .then()
    .catch(err => {console.log(err)})
}

/* Save Phase Three Data*/
module.exports.saveData2PhaseThree = (data, time) => {
  var phaseThreeData = {
    device_id: "60df0995d808801a6cab9964",
    nsample: 8,
    samples: {
      VLN     :   data.V3N,
      VLL     :   data.V31,
      I      :   data.I3,
      KW      :   data.KW3,
      KVAR    :   data.KVAR3,
      KVA     :   data.KVA3,
      PF      :   data.PF3,
      timeStamp : time
    }
  }
  const newPhaseThreeData = new PhaseThree(phaseThreeData)
  newPhaseThreeData.save()
    .then()
    .catch(err => {console.log(err)})
}

/* Save Phase Summary Data */
module.exports.saveData2PhaseSummary = (data, time) => {
  var phaseSummaryData = {
    device_id: "60df0995d808801a6cab9964",
    nsample: 8,
    samples: {
      VLN     :   data.VLN,
      VLL     :   data.VLL,
      I      :   data.I,
      KW      :   data.KW0,
      KVAR    :   data.KVAR0,
      KVA     :   data.KVA0,
      PF      :   data.PF0,
      timeStamp : time
    }
  }
  const newPhaseSummaryData = new PhaseSummary(phaseSummaryData)
  newPhaseSummaryData.save()
    .then()
    .catch(err => {console.log(err)})
}

/* Save IO Data */
module.exports.saveIO = (data,time) => {
  var DIData = {
    device_id: "60df0995d808801a6cab9964",
    samples: {
      DI0     :   data.DI0,
      DI1     :   data.DI1,
      timeStamp : time
    }
  }
  var DOData = {
    device_id: "60df0995d808801a6cab9964",
    samples: {
      DO0     :   data.DO0,
      DO1     :   data.DO1,
      timeStamp : time
    }
  }
  const newDI = new DI(DIData) 
  const newDO = new DO(DOData)
  newDI.save()
    .then()
    .catch(err => {console.log(err)})
  newDO.save()
    .then()
    .catch(err => {console.log(err)})
}

/* Data Table func */
module.exports.findDataById = (id, phase , exec) => {
  if(phase === '0') {
    PhaseSummary.find({device_id: id})
    .then(exec)
    .catch(err => console.log(err))
  }
  else if (phase === '1') {
      PhaseOne.find({device_id: id})
      .then(exec)
      .catch(err => console.log(err))
  }
  else if(phase === '2') {
      PhaseTwo.find({device_id: id})
      .then(exec)
      .catch(err => console.log(err))
  }
  else if(phase === '3') {
      PhaseThree.find({device_id: id})
      .then(exec)
      .catch(err => console.log(err))
  }
}

/* Phase 1 func */
module.exports.findPhaseOneDataById = async (id, exec) => {
  await PhaseOne.find({device_id: id}, exec)
}

/* Check Digital Alarm */
module.exports.checkDigitalAlarm = async (tagname, previousValue, recentValue, timeStamp) => {
  await DASetting.find({tagname: tagname}, (err, alarm) => {
    if(alarm.length){
      if(previousValue !== recentValue){
        var digitalAlert = new DigitalAlert({tagname: tagname, value: recentValue, timestamps: timeStamp})
        digitalAlert.save()
          .then(() => {console.log('Alarm: A Digital Alert was created!!!')})
          .catch((err) => {console.log(err)})
      }
    }
  })
}

/** Check Dir of value analog */
module.exports.checkDirAnalogAlarm = (preValue, recentValue) => {
  if(preValue > recentValue){
    return -1
  }
  else if (preValue < recentValue){
    return 1
  }
  else return 0
}

/* Check Analog Alarm */
module.exports.checkAnalogAlarm = async (tagname, dir, preState, recentValue, timeStamp) => {
  await AASetting.findOne({tagname: tagname}, (err, alarm) => {
    var state
    if(dir === 0){
      return 0
    }
    else if(dir === 1){
      if((recentValue>0)&&(recentValue<(alarm.lowlow+alarm.deadband))){
        state = 'lowlow'
        // console.log('1')
      }
      else if ((recentValue>(alarm.lowlow+alarm.deadband))&&(recentValue<(alarm.low+alarm.deadband))){
        state = 'low'
        // console.log('2')
      }
      else if ((recentValue>(alarm.low+alarm.deadband))&&(recentValue<(alarm.ok-alarm.deviation+alarm.deadband))){
        state = 'deviation'
        // console.log('3')
      }
      else if((recentValue>(alarm.ok-alarm.deviation+alarm.deadband))&&(recentValue<(alarm.ok+alarm.deviation))){
        state = 'stable'
        // console.log('4')
      }
      else if ((recentValue>(alarm.ok+alarm.deviation))&&(recentValue<alarm.high)){
        // console.log('5')
        state = 'deviation'
      }
      else if((recentValue>alarm.high)&&(recentValue<alarm.highhigh)){
        state = 'high'
        // console.log('6')
      }
      else if(recentValue>alarm.highhigh){
        state = 'highhigh'
        // console.log('7')
      }
    }
    else if (dir === -1){
      if(recentValue>(alarm.highhigh-alarm.deadband)){
        state = 'highhigh'
      }
      else if((recentValue<(alarm.highhigh-alarm.deadband))&&(recentValue>(alarm.high-alarm.deadband))){
        state = 'high'
      }
      else if((recentValue<(alarm.high-alarm.deadband))&&(recentValue>(alarm.ok+alarm.deviation-alarm.deadband))){
        state = 'deviation'
      }
      else if((recentValue<(alarm.ok+alarm.deviation-alarm.deadband))&&(recentValue>(alarm.ok-alarm.deviation))){
        state = 'stable'
      }
      else if((recentValue<(alarm.ok-alarm.deviation))&&(recentValue>alarm.low)){
        state = 'deviation'
      }
      else if((recentValue<alarm.low)&&(recentValue>alarm.lowlow)){
        state = 'low'
      }
      else if((recentValue<alarm.lowlow)&&(recentValue>0)){
        state = 'lowlow'
      }
    }
    if(state === preState){
      return 0
    }
    else {
      var newAlarm = new AnalogAlert({
        tagname: tagname,
        value: recentValue,
        state: state,
        timestamps: timeStamp
      })
      newAlarm.save()
        .then(() => {
          console.log(`Alarm ${tagname}: A Analog Alert was created!!!`)
        })
        .catch(err => {console.log(err)})
    }
  })
}
/* check state of analog alarm */
module.exports.checkStateAnalog = (tagname, dir, recentValue) => {
  AASetting.findOne({tagname: tagname}, (err, alarm) => {
    if(dir === 0){
      return 0
    }
    else if(dir === 1){
      if((recentValue>0)&&(recentValue<(alarm.lowlow+alarm.deadband))){
        return 'lowlow'
        // console.log('1')
      }
      else if ((recentValue>(alarm.lowlow+alarm.deadband))&&(recentValue<(alarm.low+alarm.deadband))){
        return 'low'
        // console.log('2')
      }
      else if ((recentValue>(alarm.low+alarm.deadband))&&(recentValue<(alarm.ok-alarm.deviation+alarm.deadband))){
        return 'deviation'
        // console.log('3')
      }
      else if((recentValue>(alarm.ok-alarm.deviation+alarm.deadband))&&(recentValue<(alarm.ok+alarm.deviation))){
        return 'stable'
        // console.log('4')
      }
      else if ((recentValue>(alarm.ok+alarm.deviation))&&(recentValue<alarm.high)){
        // console.log('5')
        return 'deviation'
      }
      else if((recentValue>alarm.high)&&(recentValue<alarm.highhigh)){
        return 'high'
        // console.log('6')
      }
      else if(recentValue>alarm.highhigh){
        return 'highhigh'
        // console.log('7')
      }
    }
    else if (dir === -1){
      if(recentValue>(alarm.highhigh-alarm.deadband)){
        return 'highhigh'
      }
      else if((recentValue<(alarm.highhigh-alarm.deadband))&&(recentValue>(alarm.high-alarm.deadband))){
        return 'high'
      }
      else if((recentValue<(alarm.high-alarm.deadband))&&(recentValue>(alarm.ok+alarm.deviation-alarm.deadband))){
        return 'deviation'
      }
      else if((recentValue<(alarm.ok+alarm.deviation-alarm.deadband))&&(recentValue>(alarm.ok-alarm.deviation))){
        return 'stable'
      }
      else if((recentValue<(alarm.ok-alarm.deviation))&&(recentValue>alarm.low)){
        return 'deviation'
      }
      else if((recentValue<alarm.low)&&(recentValue>alarm.lowlow)){
        return 'low'
      }
      else if((recentValue<alarm.lowlow)&&(recentValue>0)){
        return 'lowlow'
      }
    }
  })
}
  /* Save the previous digital value */
  module.exports.setPreviousDV = (object) => {
    return {
      preDI0: object.DI0,
      preDI1: object.DI1,
      preDO0: object.DO0,
      preDO1: object.DO1
    }
  }

  /* convert 0 - 1 to ON - OFF */
  module.exports.convertLogicLevel = (strIn) => {
    if(strIn === '0'){
      return 'OFF'
    }
    else if(strIn === '1'){
      return 'ON'
    }
}

/* Convert Date To String */
module.exports.date2String = (date) => {
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
}  

/* get time hh:mm:ss */
module.exports.getHHMMSS = (date) => {
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
} 

/* get dd:mm:yy */
module.exports.getDDMMYY = (date) => {
  return `${date.getDate()}:${date.getMonth()+1}:${date.getFullYear()}`
}

