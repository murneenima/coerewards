const mongoose = require('mongoose')
var Schema = mongoose.Schema
autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/DBcoe");
autoIncrement.initialize(connection);
//===========================
var JoinBehaviorSchema = new Schema({
    Member_ID:{
        type:String,
        required:true
    },
    Member_Name:{
        type:String,
        required:true
    },
    Member_Lastname:{
        type:String,
        required:true
    },
    Behavior_ID:{
        type:String,
        required:true
    },
    Behavior_Name:{
        type:String,
        required:true
    },
    Behavior_Point:{
        type:Number,
        required:true
    },
    JoinBehavior_Date:{
        type:String,
        required:true
    },
    JoinBehavior_Status:{
        type:String,
        default:"in used"
    },
    JoinBehavior_Admin:{
        type:String,
        required:true
    },
    JoinBehavior_Year:{
        type:String,
        required:true
    }
}) 

var JoinBehavior = mongoose.model('JoinBehavior',JoinBehaviorSchema)
module.exports = JoinBehavior