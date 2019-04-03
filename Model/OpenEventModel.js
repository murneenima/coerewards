const mongoose = require('mongoose')
var Schema = mongoose.Schema
autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/DBcoe");
autoIncrement.initialize(connection);
//===========================
var OpenEventSchema = new Schema({
    OpenEvent_Name:{
        type:String,
        required:true
    },
    OpenEvent_Point:{
        type:Number,
        required:true
    },
    OpenEvent_StartDate:{
        type:Date,
        required:true
    },
    OpenEvent_EndDate:{
        type:Date,
        required:true
    },
    OpenEvent_StartTime:{
        type:String,
        required:true
    },
    OpenEvent_EndTime:{
        type:String,
        required:true
    },
    OpenEvent_Semeter:{
        type:Number,
        required:true
    },
    EventType_ID:{
        type:String,
        required:true
    },
    CreatedBy_ID:{
        type:String,
        required:true
    },
    OpenEvent_Location:{
        type:String,
        required:true
    },
    OpenEvent_Picture:{
        type:String
    },
    OpenEvent_Descrip:{
        type:String
    },
    OpenEvent_Year:{
        type:String
    },
    OpenEvent_Count:{
        type:Number,
        default:1
    },
    OpenEvent_Status:{
        type:String,
        default:"N/A"
    }
})
OpenEventSchema.plugin(autoIncrement.plugin, {
    model: 'OpenEvent',
    field: 'OpenEvent_ID',
    startAt:100,
    incrementBy: 1
});

var OpenEvent = mongoose.model('OpenEvent',OpenEventSchema)
module.exports = OpenEvent