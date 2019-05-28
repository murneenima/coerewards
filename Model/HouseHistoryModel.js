const mongoose = require('mongoose')
var Schema = mongoose.Schema

//===========================
var HouseHistorySchema = new Schema({
    House_name:{
        type:String,
        required:true
    },
    House_MemberID:{
        type:String,
        required:true
    },
    MemberName:{
        type:String,
    },
    MemberLastname:{
        type:String,
    },
    House_MemberPoint:{
        type:Number,
        required:true
    },
    House_Year:{
        type:String,
        required:true
    },
    House_Admin:{
        type:String,
        required:true
    }
})

var HouseHistory = mongoose.model('HouseHistory',HouseHistorySchema)
module.exports = HouseHistory