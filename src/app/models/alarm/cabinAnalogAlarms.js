const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')

const Schema = mongoose.Schema

const cabinAnalogAlarm = new Schema({
    device_id: {type: String, default: '60df0995d808801a6cab9964'},
    tagname: {type:String, require: true},
    highhigh: {type:Number, require: true},
    high: {type: Number, require: true},
    low: {type: Number, require: true},
    lowlow: {type: Number, require: true},
    deadband: {type: Number, require: true},
    deviation: {type: Number, require: true},
    ok: {type: Number, require: true, default: 210}
  },{
    timestamps: true
  }) 

/* Soft delete plugin */
cabinAnalogAlarm.plugin(mongooseDelete, { overrideMethods: 'all' })
  
//Alarms Model
module.exports = mongoose.model('AnalogAlarm', cabinAnalogAlarm)
