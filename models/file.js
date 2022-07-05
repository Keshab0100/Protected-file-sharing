const mongoose = require('mongoose')

const file = mongoose.Schema({
    path : {
        type : String,
        required : true
    },
    originalName : {
        type : String,
        required : true
    },
    password : {
        type : String
    },
    downCount : {
        type : Number,
        required : true,
        default : 0
    }
})

module.exports = mongoose.model("file", file)