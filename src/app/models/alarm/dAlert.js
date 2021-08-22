const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')

const Schema = mongoose.Schema

const digitalAlert = new Schema({
    device_id: {type: String, default: '60df0995d808801a6cab9964', require: true},
    tagname: {type:String, require: true},
    value: {type:String, require: true},
    timestamps: {type: Date, require: true}
  },{
    timestamps: true
  }) 
  
  
//Alarms Model
module.exports = mongoose.model('Dalert', digitalAlert)