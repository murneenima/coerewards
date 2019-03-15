const mongoose = require('mongoose')
var Schema = mongoose.Schema

//===========================
var EventTypeSchema = new Schema({
    EventType_ID:{
        type:String,
        required:true
    },
    EventType_Name:{
        type:String,
        unique:true,
        required:true
    }
})

var EventType = mongoose.model('EventType',EventTypeSchema)
module.exports = EventType