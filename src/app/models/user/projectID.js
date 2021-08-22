const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema({
    nameProject:{
        type: String,
        required :true
    },
    addressProject: {
        type: String,
        unique :true ,
        required :true
    },
    activeProject:{
        type :Boolean ,
        default :true
    },
    timeCreate: {
         type: Date,
         default: Date.now 
    },
    tokenProject :{ 
        type : String ,
        required : true,
    }
})

//Project ID Model
module.exports = mongoose.model("project", projectSchema)