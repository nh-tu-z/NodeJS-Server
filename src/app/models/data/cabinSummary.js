const mongoose = require('mongoose')

const Schema = mongoose.Schema

const cabinPhaseSummary = new Schema({
  device_id :{
    type: String,
    required :true

},
nsample:{
    type:Number ,
    required:true
},
samples:{
    VLN     :   Number,
    VLL     :   Number,
    I      :   Number,
    KW      :   Number,
    KVAR    :   Number,
    KVA     :   Number,
    PF      :   Number,
    timeStamp : Date
}
  },{
    timestamps: true
  }) 

//Cabin Phase 3 Model
module.exports = mongoose.model('CabinPhaseSummary', cabinPhaseSummary)
