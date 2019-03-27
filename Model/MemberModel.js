const mongoose = require('mongoose')
var Schema = mongoose.Schema

//==========================
var MemberSchema = new Schema({
    Member_Profile:{
        type:String,
        required:true
    },
    Member_ID:{
        type:String,
        unique:true,
        required:true,
        minlength:8
    },
    Member_Password:{
        type:String,
        minlength:5,
    },
    Member_Name:{
        type:String,
        required:true,
    },
    Member_Lastname:{
        type:String,
        required:true
    },
    Member_Point:{
        type:String,
        default:"0"
    },
    Member_MinusPoint:{
        type:String,
        default:"0"
    },
    Member_House:{
        type:String,
        required:true  
    },
    Member_Status:{
        type:String,
        required:true,
        default:"Active"
    },
    Member_Tel:{
        type:String,
        required:true,
        minlength:10,
        unique:true
    }    
})

var Member = mongoose.model('Member',MemberSchema)
module.exports = Member
