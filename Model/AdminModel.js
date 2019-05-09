const mongoose = require('mongoose')
var Schema = mongoose.Schema
autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/DBcoe");
autoIncrement.initialize(connection);
//===========================
var AdminSchema = new Schema({
    Admin_Username:{
        type:String,
        required:true,
        unique:true
    },
    Admin_Password:{
        type:String,
        required:true,
    },
    Admin_Name:{
        type:String,
        required:true
    },
    Admin_Surname:{
        type:String,
        required:true
    }
})


var Admin = mongoose.model('Admin',AdminSchema)
module.exports = Admin