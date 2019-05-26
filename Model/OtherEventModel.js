const mongoose = require('mongoose')
var Schema = mongoose.Schema
autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/DBcoe");
autoIncrement.initialize(connection);
//===========================
var OtherEventSchema = new Schema({
    OtherEvent_Name:{
        type:String,
        required:true
    },
    OtherEvent_Point:{
        type:String,
        required:true
    },
    OtherEvent_Admin:{
        type:String,
        required:true
    }
})
OtherEventSchema.plugin(autoIncrement.plugin, {
    model: 'OtherEvent',
    field: 'OtherEvent_ID',
    startAt:100,
    incrementBy: 1
});

var OtherEvent = mongoose.model('OtherEvent',OtherEventSchema)
module.exports = OtherEvent