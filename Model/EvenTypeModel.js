const mongoose = require('mongoose')
var Schema = mongoose.Schema
autoIncrement = require('mongoose-auto-increment');


var connection = mongoose.createConnection("mongodb://localhost/DBcoe");
autoIncrement.initialize(connection);
//===========================
var EventTypeSchema = new Schema({
    EventType_Name:{
        type:String,
        required:true
    }
})

EventTypeSchema.plugin(autoIncrement.plugin, {
    model: 'EventType',
    field: 'EventType_ID',
    startAt: 000,
    incrementBy: 1
});
//EventTypeSchema.plugin(autoIncrement.plugin, 'EventType');
//var EventType = connection.model('EventType', EventTypeSchema);
var EventType = mongoose.model('EventType',EventTypeSchema)
module.exports = EventType