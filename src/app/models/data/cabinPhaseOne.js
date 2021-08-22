const mongoose = require('mongoose')

const Schema = mongoose.Schema

const cabinPhaseOne = new Schema({
    device_id: {
      type: String,
      required: true
      },
    nsample: {
      type:Number,
      required: true 
      },
    samples: {
      VLN     :   Number,
      VLL     :   Number,
      I      :   Number,
      KW      :   Number,
      KVAR    :   Number,
      KVA     :   Number,
      PF      :   Number,
      freq    :   Number,
      timeStamp : Date
    }
  },{
    timestamps: true
  })  

//Cabin Phase 1 Model 
module.exports = mongoose.model('CabinPhaseOne', cabinPhaseOne)
