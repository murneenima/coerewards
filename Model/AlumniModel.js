const mongoose = require('mongoose')
var Schema = mongoose.Schema

//==========================
var AlumniSchema = new Schema({
    Alumni_Profile:{
        type:String,
        required:true
    },
    Alumni_ID:{
        type:String,
        unique:true,
        required:true,
        minlength:8
    },
    Alumni_Password:{
        type:String,
        minlength:5,
    },
    Alumni_Name:{
        type:String,
        required:true,
    },
    Alumni_Lastname:{
        type:String,
        required:true
    },
    Alumni_Total:{
        type:Number,
        default:0
    },
    Alumni_Available:{
        type:Number,
        default:0
    },
    Alumni_House:{
        type:String,
        required:true  
    },
    Alumni_Status:{
        type:String,
        default:"Alumni"
    },
    Alumni_Tel:{
        type:String,
        required:true,
        minlength:10,
        unique:true
    },
    Alumni_Admin:{
        type:String 
    }   
})

var Alumni = mongoose.model('Alumni',AlumniSchema)
module.exports = Alumni
