const mongoose = require('mongoose')
var Schema = mongoose.Schema
autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/DBcoe");
autoIncrement.initialize(connection);
//===========================
var BehaviorSchema = new Schema({
    Behavior_Name:{
        type:String,
        required:true
    },
    Behavior_Point:{
        type:Number,
        required:true
    },
    Behavior_Description:{
        type:String,
        required:true
    }
})
BehaviorSchema.plugin(autoIncrement.plugin, {
    model: 'Behavior',
    field: 'Behavior_ID',
    startAt: 000,
    incrementBy: 1
});

var Behavior = mongoose.model('Behavior',BehaviorSchema)
module.exports = Behavior