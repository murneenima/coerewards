const express = require('express')
const mongoose = require('mongoose')
const rounter = express.Router();


var Member = require('./Model/MemberModel')
var House = require('./Model/HouseModel')
var AllEvent = require('./Model/AllEventModel')

rounter.use(express.static('public'))
rounter.use(express.static('uploads'));


rounter.post('/:edit',(req,res,next)=>{
    //console.log('dataIn :', req.params.edit)
    let id = req.params.edit
    Member.find({Member_ID:id},(err,dataMember)=>{
        if(err) console.log(err)
    }).then((dataMember)=>{
        res.render('admin_MemberEdit.hbs',{
            dataMember:encodeURI(JSON.stringify(dataMember))
        })
    })
})

rounter.post('/edit/data',(req,res)=>{
   let id = req.body.Member_ID
    Member.findOne({Member_ID:id}).then((d)=>{
        d.Member_ID = id
        d.Member_Name = req.body.Member_Name
        d.Member_Lastname = req.body.Member_Lastname
        d.Member_House = req.body.Member_House
        d.Member_Status = req.body.Member_Status
        d.Member_Name = req.body.Member_Name

        d.save().then((success)=>{
            console.log(' **** Success to edit Member ****')
            Member.find({},(err,dataMember)=>{
                if(err) console.log(err)
            }).then((dataMember)=>{
                res.render('admin_MemberAll.hbs',{
                    dataMember:encodeURI(JSON.stringify(dataMember))
                })
            })
        },(e)=>{
            res.status(400).send(e)
        },(err)=>{
            res.status(400).send(err)
        })
    })    
})







module.exports = rounter;