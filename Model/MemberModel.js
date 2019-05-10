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
    Member_Total:{
        type:Number,
        default:0
    },
    Member_Available:{
        type:Number,
        default:0
    },
    Member_House:{
        type:String,
        required:true  
    },
    Member_Status:{
        type:String,
        default:"Active"
    },
    Member_Tel:{
        type:String,
        required:true,
        minlength:10,
        unique:true
    },
    Member_Admin:{
        type:String,
        required:true  
    }    
})
// MemberSchema.methods.add = function(Member_Total, callback){
//     this.Member_Total = Member_Total;
//     return this.save(callback);
// }
var Member = mongoose.model('Member',MemberSchema)
module.exports = Member
