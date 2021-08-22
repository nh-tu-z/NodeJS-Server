const mongoose = require('mongoose')

const Schema = mongoose.Schema

const DO = new Schema({
    device_id: {
      type: String,
      required: true
      },
    samples: {
      DO0     :   Number,
      DO1     :   Number,
      timeStamp : Date
    }
  },{
    timestamps: true
  })  

//DI Model
module.exports = mongoose.model('DO', DO)