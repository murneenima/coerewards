const mongoose = require('mongoose')
var Schema = mongoose.Schema
autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/DBcoe");
autoIncrement.initialize(connection);
//===========================
var RewardSchema = new Schema({
    Reward_Name :{
        type:String,
        required:true
    },
    Reward_Point:{
        type:Number,
        required:true
    },
    Reward_Photo:{
        type:String,
        required:true
    },
    Reward_Quantity:{
        type:Number,
        required:true
    },
    Reward_Status:{
        type:String,
        default:"in stock"
    }   
})
RewardSchema.plugin(autoIncrement.plugin, {
    model: 'Reward',
    field: 'Reward_ID',
    startAt:100,
    incrementBy: 1
});

var Reward = mongoose.model('Reward',RewardSchema)
module.exports = Reward