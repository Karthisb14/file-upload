const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    phone:{
        type: Number,
        required: true
    },
    age:{
        type:Number,
        required: true
    },
    employee_id:{
        type: Number,
        required:true
    }
})

const userfile = mongoose.model('usersdata', userSchema)

module.exports = userfile