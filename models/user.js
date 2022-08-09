// Importing modules 
const mongoose = require('mongoose'); 

//User Schema
const UserSchema = new mongoose.Schema({
    first_name:{
        type: String,
        require: true
    },
    last_name:{
        type: String,
        require: true
    },
    phone_number:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    username:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
})
const User =  mongoose.model('User', UserSchema)
module.exports = User