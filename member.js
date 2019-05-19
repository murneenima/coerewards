const express = require('express')
const mongoose = require('mongoose')
const rounter = express.Router();


var Member = require('./Model/MemberModel')
var House = require('./Model/HouseModel')
var AllEvent = require('./Model/AllEventModel')

rounter.use(express.static('public'))
rounter.use(express.static('uploads'));










module.exports = rounter;