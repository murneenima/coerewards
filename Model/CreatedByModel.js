const mongoose = require('mongoose')
var Schema = mongoose.Schema
autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/DBcoe");
autoIncrement.initialize(connection);
//===========================
var CreatedBySchema = new Schema({
    CreatedBy_Name:{
        type:String,
        required:true
    }
})
CreatedBySchema.plugin(autoIncrement.plugin, {
    model: 'CreatedBy',
    field: 'CreatedBy_ID',
    startAt: 000,
    incrementBy: 1
});

var CreatedBy = mongoose.model('CreatedBy',CreatedBySchema)
module.exports = CreatedBy