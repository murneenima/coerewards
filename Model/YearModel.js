const mongoose = require('mongoose')
var Schema = mongoose.Schema
autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/DBcoe");
autoIncrement.initialize(connection);
//===========================
var YearSchema = new Schema({
    Year_Year :{
        type:String,
        required:true
    },
    Year_StartDate:{
        type:Date,
        required:true
    },
    Year_EndDate:{
        type:Date,
        required:true
    }
})
YearSchema.plugin(autoIncrement.plugin, {
    model: 'Year',
    field: 'Year_ID',
    startAt:100,
    incrementBy: 1
});

var Year = mongoose.model('Year',YearSchema)
module.exports = Year