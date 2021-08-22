const mongoose = require('mongoose')
const User = require('../user/UserManagementModel')
const Schema = mongoose.Schema

const tokenVerificationSchema = new Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: User 
        },
    token: { 
        type: String,
         required: true
         },
    createdAt: { 
        type: Date,
         required: true, 
         default: Date.now, 
         expires: '24h' 
        }

})

//Token Verification Model
module.exports = mongoose.model("tokenverification", tokenVerificationSchema)
