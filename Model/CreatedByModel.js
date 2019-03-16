const mongoose = require('mongoose')
var Schema = mongoose.Schema

//===========================
var CreatedBySchema = new Schema({
    CreatedBy_ID:{
        type:Number,
        unique:true,
        default:"0"
    },
    CreatedBy_Name:{
        type:String,
        required:true
    }
})

var CreatedBy = mongoose.model('CreatedBy',CreatedBySchema)
module.exports = CreatedBy