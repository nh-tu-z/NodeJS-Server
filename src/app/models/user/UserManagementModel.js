const mongoose = require('mongoose')
const Project = require('./projectID.js')

const Schema = mongoose.Schema

const myUser = new Schema({
  username: {
    type: String,
    required: true 
  },
  phone: {
    type:String,
    required: true 
  },
  email: {
    type:String, 
    required: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: [
      "admin",
      "viewer",
      "controller"
    ], 
    default: 'viewer'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true 
  },
  project_id: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: Project
  }]
},{
  timestamps: true
})

//User Model
module.exports = mongoose.model('user', myUser)



