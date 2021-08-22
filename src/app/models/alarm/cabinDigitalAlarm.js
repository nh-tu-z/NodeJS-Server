const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')

const Schema = mongoose.Schema

const digitalAlarms = new Schema({
    device_id: {type: String, default: '60df0995d808801a6cab9964'},
    tagname: {type:String, },
  },{
    timestamps: true
  }) 
  
/* Soft delete plugin */
digitalAlarms.plugin(mongooseDelete, { overrideMethods: 'all' })
  
//Alarms Model
module.exports = mongoose.model('DigitalAlarm', digitalAlarms)
