const mongoose = require('mongoose')
var Schema = mongoose.Schema
autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/DBcoe");
autoIncrement.initialize(connection);
//===========================
var JoinEventSchema = new Schema({
    Member_ID:{
        type:String,
        required:true
    },
    OpenEvent_ID:{
        type:String,
        required:true
    },
    OpenEvent_Point:{
        type:Number,
        required:true
    },
    JoinEvent_Date:{
        type:String,
        required:true
    },
    JoinEvent_Status:{
        type:String,
        default:"in used"
    }
}) 

var JoinEvent = mongoose.model('JoinEvent',JoinEventSchema)
module.exports = JoinEvent