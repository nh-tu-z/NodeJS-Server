const mongoose = require('mongoose')

const Schema = mongoose.Schema

const DI = new Schema({
    device_id: {
      type: String,
      required: true
      },
    samples: {
      DI0     :   Number,
      DI1     :   Number,
      timeStamp : Date
    }
  },{
    timestamps: true
  })  

//DI Model
module.exports = mongoose.model('DI', DI)