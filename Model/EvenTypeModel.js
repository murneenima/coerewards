const mongoose = require('mongoose')
var Schema = mongoose.Schema

//===========================
var EventTypeSchema = new Schema({
    EventType_ID:{
        type:Number,
        unique:true,
        default:"0"
    },
    EventType_Name:{
        type:String,
        required:true
    }
})

var EventType = mongoose.model('EventType',EventTypeSchema)
module.exports = EventType