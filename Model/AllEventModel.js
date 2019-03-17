const mongoose = require('mongoose')
var Schema = mongoose.Schema
autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/DBcoe");
autoIncrement.initialize(connection);
//===========================
var AllEventSchema = new Schema({
    AllEvent_Name:{
        type:String,
        required:true
    },
    AllEvent_Point:{
        type:String,
        required:true
    },
    AllEvent_StartDate:{
        type:Date,
        required:true
    },
    AllEvent_EndDate:{
        type:Date,
        required:true
    },
    AllEvent_Semeter:{
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
    AllEvent_Location:{
        type:String,
        required:true
    },
    AllEvent_Picture:{
        type:String
    },
    AllEvent_Descrip:{
        type:String
    },
    AllEvent_Count:{
        type:Number,
        default:"0"
    }
})
AllEventSchema.plugin(autoIncrement.plugin, {
    model: 'AllEvent',
    field: 'AllEvent_ID',
    startAt:100,
    incrementBy: 1
});

var AllEvent = mongoose.model('AllEvent',AllEventSchema)
module.exports = AllEvent