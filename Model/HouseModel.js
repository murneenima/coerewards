const mongoose = require('mongoose')
var Schema = mongoose.Schema

//===========================
var HouseSchema = new Schema({
    House_name:{
        type:String,
        required:true
    },
    House_MemberID:{
        type:String,
        unique:true,
        required:true
    },
    House_MemberPoint:{
        type:Number,
        required:true
    }
})

var House = mongoose.model('House',HouseSchema)
module.exports = House