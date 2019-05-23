const mongoose = require('mongoose')
var Schema = mongoose.Schema
autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/DBcoe");
autoIncrement.initialize(connection);
//===========================
var RedeemRewardSchema = new Schema({
    Reward_ID :{
        type:String,
        required:true
    },
    Reward_Name :{
        type:String,
        required:true
    },
    Reward_Point:{
        type:Number,
        required:true
    },
    Member_ID:{
        type:Number,
        required:true
    },
    RedeemReward_Quantity:{
        type:Number,
        required:true
    },
    RedeemReward_Date:{
        type:String,
        required:true
    },
    RedeemReward_Admin:{
        type:String,
        required:true
    },
    RedeemReward_Year:{
        type:String,
        required:true
    },

})
RedeemRewardSchema.plugin(autoIncrement.plugin, {
    model: 'RedeemReward',
    field: 'RedeemReward_ID',
    startAt:100,
    incrementBy: 1
});

var RedeemReward = mongoose.model('RedeemReward',RedeemRewardSchema)
module.exports = RedeemReward