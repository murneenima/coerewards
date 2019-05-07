const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const request = require('request');
const bcrypt = require('bcryptjs');
const app = express()
const multer = require('multer')
const schedule = require('node-schedule');
const moment = require('moment');
autoIncrement = require('mongoose-auto-increment');


// =========== image===========
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    //ตั้งชื่อไฟล์
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    // reject file
    if (file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

//var upload = multer({ dest: 'uploads/' })

//===================================
const MemberRounter = require('./member')

// ===========================================
var Member = require('./Model/MemberModel')
var House = require('./Model/HouseModel')
var EventType = require('./Model/EvenTypeModel')
var CreatedBy = require('./Model/CreatedByModel')
var AllEvent = require('./Model/AllEventModel')
var OpenEvent = require('./Model/OpenEventModel')
var Behavior = require('./Model/BehaviorModel')
var Reward = require('./Model/RewardModel')
var JoinEvent = require('./Model/JoinEventModel')
var JoinBehavior = require('./Model/JoinBehaviorModal')
var Year = require('./Model/YearModel')

//=========================================
mongoose.connect('mongodb://localhost:27017/DBcoe').then((doc) => {
    console.log('@@@@ Success to connect with Database @@@')
}, (err) => {
    console.log('!!!!!!!!!! error to connect with database !!!!!!!!!')
})
// var connection = mongoose.createConnection("mongodb://localhost/DBcoe");
autoIncrement.initialize(mongoose.createConnection('mongodb://localhost:27017/DBcoe'));

app.use(express.static('public'))
app.use("/", express.static(__dirname + "/public"));
app.use("/views", express.static(__dirname + "/views"));
app.use(express.static('uploads'));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.set('view engine', 'hbs')
app.use(bodyParser.json()) // ส่งข้อมูลแบบ JSon
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use((req, res, next) => { // allow the other to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader("Access-Control-Expose-Headers", "X-HMAC-CSRF, X-Secret, WWW-Authenticate");
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization, X-Access-Token')
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

app.use('/member', MemberRounter)

//==================================================================


app.get('/error', (req, res) => {
    res.render('admin_error.hbs', {})
    //console.log('hello')
})

app.get('/Main', (req, res) => {
    res.render('admin_Main.hbs', {})
    //console.log('hello')
})

app.get('/SeeMoreEvent', (req, res) => {
    OpenEvent.find({}, (err, dataEvent) => {
        if (err) console.log(err)
    }).then((dataEvent) => {
        res.render('admin_EventCard.hbs', {
            dataEvent: encodeURI(JSON.stringify(dataEvent))
        })
    })
    //console.log('hello')
})

app.get('/edit', (req, res) => {
    res.render('admin_edit.hbs', {})
    //console.log('hello')
})

// ========================= Member ====================================
// ==================== save data and upload photo =====================
app.get('/MemberInsert', (req, res) => {
    res.render('admin_MemberInsert.hbs', {})
    //console.log('hello')
})

app.get('/MemberAll', (req, res) => {
    Member.find({}, (err, dataMember) => {
        if (err) console.log(err)
    }).then((dataMember) => {
        res.render('admin_MemberAll.hbs', {
            dataMember: encodeURI(JSON.stringify(dataMember))
        })
    })
})

// app.post('/sign_in',(req,res)=>{
//     let studentIDInput = req.body.studentID
//     let passwordInput = req.body.password

//     Student.find({
//      studentID : studentIDInput,
//     password : passwordInput
// }).then((student)=>{
//     if(student.length == 1){ //เจอข้อมูล 1 คน 
//         res.render('admin_member.hbs')// ที่เป็น 0 เพราะมันเจอที่ ตน ที่ 0 มันต้องมีแค่คนเดียว
//         //  res.render('admin_success.hbs',{
//         //     studentID:student[0].studentID,
//         //     name:student[0].name,
//         //     surname:student[0].surname,
//         //     house:studentID[0].house
//         // }) 
//         console.log('login success')
//     }else if(student.length == 0){
//         res.status(400).send('sorry id not found')
//     }
// },(err)=>{
//     res.send(400).send(err)
// })
// })

app.post('/save', upload.single('photos'), function (req, res) {
    let data = {};
    //console.log(req.file)
    let point = req.body.Member_Point
    if (point == "") {
        point = "0";

    } else {
        point = req.body.Member_Point
    }
    console.log(point)

    Member.find({ Member_ID: req.body.Member_ID }, (err, data) => {
        if (err) console.log(err)
    }).then((id) => {
        data.ID = id

        Member.find({ Member_Tel: req.body.Member_Tel }, (err, data) => {
            if (err) console.log(err)
        }).then((tel) => {
            data.tel = tel
            if (data.ID.length == 1) {
                console.log('ID Duplicated')
                res.render('admin_error.hbs')
            }
            if (data.tel.length == 1) {
                console.log('Tel Duplicated')
                res.render('admin_errorTel.hbs')
            }
            if (data.ID.length == 0 && data.tel.length == 0) {
                let newMember = new Member({
                    Member_ID: req.body.Member_ID,
                    Member_Password: req.body.Member_Password,
                    Member_Name: req.body.Member_Name,
                    Member_Lastname: req.body.Member_Lastname,
                    Member_House: req.body.Member_House,
                    Member_Profile: req.file.path,
                    Member_Tel: req.body.Member_Tel,
                    Member_Total: point,
                    Member_Available: point
                })
                newMember.save().then((doc) => {

                    let newHouse = new House({
                        House_name: req.body.Member_House,
                        House_MemberID: req.body.Member_ID
                    })

                    newHouse.save().then((doc) => {
                        res.render('admin_MemberInsert.hbs', {})
                    })

                }, (err) => {
                    //res.render('admin_error.hbs',{})
                    res.status(400).send(err)
                })
            }

        }, (err) => {
            res.send(400).send(err)
        })
        if (data.length == 1) {
            res.render('admin_error.hbs')
        } else if (data.length == 0) {
            let newMember = new Member({
                Member_ID: req.body.Member_ID,
                Member_Password: req.body.Member_Password,
                Member_Name: req.body.Member_Name,
                Member_Lastname: req.body.Member_Lastname,
                Member_House: req.body.Member_House,
                Member_Profile: req.file.path,
                Member_Tel: req.body.Member_Tel,
                Member_Total: point,
                Member_Available: point
            })
            newMember.save().then((doc) => {

                let newHouse = new House({
                    House_name: req.body.Member_House,
                    House_MemberID: req.body.Member_ID
                })

                newHouse.save().then((doc) => {
                    res.render('admin_MemberInsert.hbs', {})
                })

            }, (err) => {
                //res.render('admin_error.hbs',{})
                res.status(400).send(err)
            })
        }
    })
})

app.post('/editMember', (req, res) => {
    console.log('Edit Member')
    let id = req.body.Member_ID1
    Member.findOne({ Member_ID: id }).then((d) => {
        d.Member_ID = id
        d.Member_Name = req.body.Member_Name1
        d.Member_Lastname = req.body.Member_Lastname1
        d.Member_Tel = req.body.Member_Tel1
        d.Member_Status = req.body.Member_Status1

        d.save().then((success) => {
            console.log(' **** Success to edit Member ****')
            Member.find({}, (err, dataMember) => {
                if (err) console.log(err)
            }).then((dataMember) => {
                res.render('admin_MemberAll.hbs', {
                    dataMember: encodeURI(JSON.stringify(dataMember))
                })
            })
        }, (e) => {
            res.status(400).send(e)
        }, (err) => {
            res.status(400).send(err)
        })
    })
})

app.post('/resetPassword', (req, res) => {
    let password = "password"
    console.log('dataIn :', req.body.id)
    Member.findOne({ Member_ID: req.body.id }).then((d) => {
        d.Member_Password = password

        d.save().then((success) => {
            console.log(' **** Success to reset password ****')

            Member.find({}, (err, dataMember) => {
                if (err) console.log(err)
            }).then((dataMember) => {
                res.render('admin_MemberAll.hbs', {
                    dataMember: encodeURI(JSON.stringify(dataMember))
                })
            })
        }, (e) => {
            res.status(400).send(e)
        }, (err) => {
            res.status(400).send(err)
        })
    })
})

//======================== HOUSE ====================
app.get('/Bill', (req, res) => {
    let bill = 'Bill Gates'
    Member.find({ Member_House: bill }, (err, dataHouse) => {
        if (err) console.log(err)
    }).then((dataHouse) => {
        res.render('admin_HouseBill.hbs', {
            dataHouse: encodeURI(JSON.stringify(dataHouse))
        })
    })
})

app.get('/Larry', (req, res) => {
    let bill = 'Larry Page'
    Member.find({ Member_House: bill }, (err, dataHouse) => {
        if (err) console.log(err)
    }).then((dataHouse) => {
        res.render('admin_HouseLarry.hbs', {
            dataHouse: encodeURI(JSON.stringify(dataHouse))
        })
    })
})

app.get('/Elon', (req, res) => {
    let bill = 'Elon Mask'
    Member.find({ Member_House: bill }, (err, dataHouse) => {
        if (err) console.log(err)
    }).then((dataHouse) => {
        res.render('admin_HouseElon.hbs', {
            dataHouse: encodeURI(JSON.stringify(dataHouse))
        })
    })
})

app.get('/Mark', (req, res) => {
    let bill = 'Mark Zuckerberg'
    Member.find({ Member_House: bill }, (err, dataHouse) => {
        if (err) console.log(err)
    }).then((dataHouse) => {
        res.render('admin_HouseMark.hbs', {
            dataHouse: encodeURI(JSON.stringify(dataHouse))
        })
    })
})

// ============== Event Type ===================
app.get('/EventTypeDisplay', (req, res) => {
    EventType.find({}, (err, data) => {
        if (err) console.log(err)
    }).then((dataEV) => {
        res.render('admin_EventTypeDisplay.hbs', {
            dataEV: encodeURI(JSON.stringify(dataEV))
        })
    })
})

app.get('/EventTypeInsert', (req, res) => {
    res.render('admin_EventTypeInsert.hbs', {})
})

app.post('/saveEventType', (req, res) => {
    let newEventType = new EventType({
        EventType_Name: req.body.EventType_Name,
    })
    newEventType.save().then((doc) => {
        //console.log(doc)
        res.render('admin_EventTypeInsert.hbs', {})
    }, (err) => {
        res.status(400).send(err)
    })

})

app.post('/removeEventType', (req, res) => {
    console.log('dataIn :', req.body.id)
    EventType.remove({ EventType_ID: req.body.id }).then((data) => {
        console.log('Event Type deleted success')
    }, (err) => {
        res.status(400).send(err)
    })
})

// ============== Created By ===================
app.get('/CreatedByDisplay', (req, res) => {
    CreatedBy.find({}, (err, data) => {
        if (err) console.log(err)
    }).then((dataCB) => {
        res.render('admin_CreatedByDisplay.hbs', {
            dataCB: encodeURI(JSON.stringify(dataCB))
        })
    })
})

app.get('/CreatedByInsert', (req, res) => {
    res.render('admin_CreatedByInsert.hbs', {})
})

app.post('/saveCreatedBy', (req, res) => {
    let newCreatedBy = new CreatedBy({
        CreatedBy_Name: req.body.CreatedBy_Name
    })
    newCreatedBy.save().then((doc) => {
        console.log(doc)
        res.render('admin_CreatedByInsert.hbs', {})
    }, (err) => {
        res.status(400).send(err)
    })
})

app.post('/removeCreatedBy', (req, res) => {
    console.log('dataIn :', req.body.id)
    CreatedBy.remove({ CreatedBy_ID: req.body.id }).then((data) => {
        console.log('Created By deleted success')
    }, (err) => {
        res.status(400).send(err)
    })
})

// ============= All Event ===================
app.get('/EventContent', (req, res) => {
    let data = {}
    EventType.find({}, (err, data) => {
        if (err) console.log(err)
    }).then((dataEV) => {
        data.EventType = dataEV

        CreatedBy.find({}, (err, data) => {
            if (err) console.log(err)
        }).then((dataCB) => {
            data.CreatedBy = dataCB
            res.render('admin_EventContent.hbs', {
                data: encodeURI(JSON.stringify(data))
            })
        }, (err) => {
            res.status(400).send(err)
        })
    })

})

app.post('/saveEvent', upload.single('photos'), function (req, res) {
    //console.log(req.file)
    let pic_path = 'uploads/EVENTS.jpg'
    if (req.file == undefined) {
        console.log(' No file')
        let newAllEvent = new AllEvent({
            AllEvent_Name: req.body.Event_Name,
            AllEvent_Point: req.body.Event_Point,
            AllEvent_Semeter: req.body.Event_Semester,
            EventType_ID: req.body.Event_Type,
            CreatedBy_ID: req.body.Event_CreatedBy,
            AllEvent_Location: req.body.Event_Location,
            AllEvent_Picture: pic_path,
            AllEvent_Descrip: req.body.Event_Description,
        })
        newAllEvent.save().then((doc) => {
            let data = {}
            EventType.find({}, (err, data) => {
                if (err) console.log(err)
            }).then((dataEV) => {
                data.EventType = dataEV

                CreatedBy.find({}, (err, data) => {
                    if (err) console.log(err)
                }).then((dataCB) => {
                    data.CreatedBy = dataCB

                    console.log('Succes to save data on ALL EVENT and OPEN EVENT')
                    res.render('admin_EventContent.hbs', {
                        data: encodeURI(JSON.stringify(data))
                    })
                })
            })
        }, (err) => {
            //res.render('admin_error.hbs',{})
            res.status(400).send(err)
        })
    } else {
        console.log(' Have file')
        let newAllEvent = new AllEvent({
            AllEvent_Name: req.body.Event_Name,
            AllEvent_Point: req.body.Event_Point,
            AllEvent_Semeter: req.body.Event_Semester,
            EventType_ID: req.body.Event_Type,
            CreatedBy_ID: req.body.Event_CreatedBy,
            AllEvent_Location: req.body.Event_Location,
            AllEvent_Picture: req.file.path,
            AllEvent_Descrip: req.body.Event_Description,
        })
        newAllEvent.save().then((doc) => {
            let data = {}
            EventType.find({}, (err, data) => {
                if (err) console.log(err)
            }).then((dataEV) => {
                data.EventType = dataEV

                CreatedBy.find({}, (err, data) => {
                    if (err) console.log(err)
                }).then((dataCB) => {
                    data.CreatedBy = dataCB

                    console.log('Succes to save data on ALL EVENT and OPEN EVENT')
                    res.render('admin_EventContent.hbs', {
                        data: encodeURI(JSON.stringify(data))
                    })
                })
            })
        }, (err) => {
            //res.render('admin_error.hbs',{})
            res.status(400).send(err)
        })
    }



})

app.get('/AllEvent', (req, res) => {
    let data = {}
    AllEvent.find({}, (err, event) => {
        if (err) console.log(err)
    }).then((event) => {
        data.event = event

        CreatedBy.find({}, (err, data) => {
            if (err) console.log(err)
        }).then((CB) => {
            data.createdby = CB
            res.render('admin_EventAll.hbs', {
                data: encodeURI(JSON.stringify(data))
            })
        }, (err) => {
            res.status(400).send(err)
        })
    })
})

app.post('/event/:id', (req, res) => {
    let id = req.params.id
    let data = {}
    AllEvent.find({ AllEvent_ID: id }, (err, data) => {
        if (err) console.log(err)
    }).then((event) => {
        data.event = event

        CreatedBy.find({}, (err, data) => {
            if (err) console.log(err)
        }).then((createdby) => {
            data.createdby = createdby

            EventType.find({}, (err, data) => {
                if (err) console.log(err)
            }).then((eventtype) => {
                data.eventtype = eventtype

                res.render('admin_EventOpen.hbs', {
                    data: encodeURI(JSON.stringify(data))
                })
            }, (err) => {
                res.status(400).send(err)
            })
        })
    })
})

app.post('/event/edit/:id', (req, res) => {
    let id = req.params.id
    let data = {}
    AllEvent.find({ AllEvent_ID: id }, (err, data) => {
        if (err) console.log(err)
    }).then((event) => {
        data.event = event

        CreatedBy.find({}, (err, data) => {
            if (err) console.log(err)
        }).then((createdby) => {
            data.createdby = createdby

            EventType.find({}, (err, data) => {
                if (err) console.log(err)
            }).then((eventtype) => {
                data.eventtype = eventtype

                res.render('admin_EventEdit.hbs', {
                    data: encodeURI(JSON.stringify(data))
                })
            }, (err) => {
                res.status(400).send(err)
            })
        })
    })
})

var j = schedule.scheduleJob('* * * * *', function () {
    var day_format = moment().format('dddd');
    // console.log(day_format)
    var open_status = "Online"
    var open_status2 = "Offline"
    var ymd = moment().format('YYYY-MM-DD');
    // var day = moment().format('DD');
    // var month = moment().format('MMMM')
    // var year = moment().format('YYYY')
    var time = moment().format('HH:mm')
    // console.log(ymd)
    // console.log(time)

    OpenEvent.find({ OpenEvent_StartDate: ymd, OpenEvent_StartTime: time }).then((d1) => {
        //console.log(d)
        if (d1.length == 0) {
            return 0;
        } else {
            console.log(d1.length)
            for (let i = 0; i < d1.length; i++) {
                d1[i].OpenEvent_Status = open_status

                d1[i].save().then((success) => {
                    console.log('!! Update OPEN EVENT Status to ONLINE Success')
                }, (e) => {
                    res.status(400).send(e)
                }, (err) => {
                    res.status(400).send(err)
                })
            }

        }
    })

    OpenEvent.find({ OpenEvent_EndDate: ymd, OpenEvent_EndTime: time }).then((d2) => {
        if (d2.length == 0) {
            return 0;
        } else {
            console.log(d2.length)
            for (let i = 0; i < d2.length; i++) {
                d2[i].OpenEvent_Status = open_status2

                d2[i].save().then((success) => {
                    console.log('!! Update OPEN EVENT Status to OFFLINE Success')
                }, (e) => {
                    res.status(400).send(e)
                }, (err) => {
                    res.status(400).send(err)
                })
            }
        }
    })
});

// ============= เปิดกิจกรรม ====================
app.post('/saveOpenEvent', upload.single('photos'), function (req, res) {
    if (req.file == undefined) {
        AllEvent.find({
            AllEvent_ID: req.body.Event_ID
        }).then((data) => {
            console.log(' No file')
            let newOpenEvent = new OpenEvent({
                OpenEvent_Name: req.body.Event_Name,
                OpenEvent_Point: req.body.Event_Point,
                OpenEvent_StartDate: req.body.Event_StartDate,
                OpenEvent_EndDate: req.body.Event_EndDate,
                OpenEvent_StartTime: req.body.Event_StartTime,
                OpenEvent_EndTime: req.body.Event_EndTime,
                OpenEvent_Semeter: req.body.Event_Semester,
                OpenEvent_Year: req.body.Event_Year,
                EventType_ID: req.body.Event_Type,
                CreatedBy_ID: req.body.Event_CreatedBy,
                OpenEvent_Location: req.body.Event_Location,
                OpenEvent_Picture: data[0].AllEvent_Picture,
                OpenEvent_Descrip: req.body.Event_Description,
                OpenEvent_Count: data[0].AllEvent_Count + 1

            })

            newOpenEvent.save().then((doc) => {
                AllEvent.findOne({ AllEvent_ID: req.body.Event_ID }, function (err, data) {
                    if (data) {
                        data.AllEvent_Count += 1
                        data.save(function (err) {
                            if (err) // do something
                                console.log('is fail to update COUNT ON ALLEVENT')
                            else
                                console.log('is UPdated COUNT ALLEVENT')
                        });
                    } else {
                        console.log(err);
                    }
                });

                let data = {}
                AllEvent.find({}, (err, event) => {
                    if (err) console.log(err)
                }).then((event) => {
                    data.event = event

                    CreatedBy.find({}, (err, data) => {
                        if (err) console.log(err)
                    }).then((CB) => {
                        data.createdby = CB
                        res.render('admin_EventAll.hbs', {
                            data: encodeURI(JSON.stringify(data))
                        })
                    }, (err) => {
                        res.status(400).send(err)
                    })
                })



            }, (err) => {
                //res.render('admin_error.hbs',{})
                res.status(400).send(err)
            })
        })
    } else {
        AllEvent.find({
            AllEvent_ID: req.body.Event_ID
        }).then((data) => {
            console.log('for Have file')
            let newOpenEvent = new OpenEvent({
                OpenEvent_Name: req.body.Event_Name,
                OpenEvent_Point: req.body.Event_Point,
                OpenEvent_StartDate: req.body.Event_StartDate,
                OpenEvent_EndDate: req.body.Event_EndDate,
                OpenEvent_StartTime: req.body.Event_StartTime,
                OpenEvent_EndTime: req.body.Event_EndTime,
                OpenEvent_Semeter: req.body.Event_Semester,
                OpenEvent_Year: req.body.Event_Year,
                EventType_ID: req.body.Event_Type,
                CreatedBy_ID: req.body.Event_CreatedBy,
                OpenEvent_Location: req.body.Event_Location,
                OpenEvent_Picture: req.file.path,
                OpenEvent_Descrip: req.body.Event_Description,
                OpenEvent_Count: data[0].AllEvent_Count + 1

            })

            newOpenEvent.save().then((doc) => {

                AllEvent.findOne({ AllEvent_ID: req.body.Event_ID }, function (err, data) {
                    if (data) {
                        data.AllEvent_Count += 1
                        data.save(function (err) {
                            if (err) // do something
                                console.log('is fail to update COUNT ON ALLEVENT')
                            else
                                console.log('is UPdated COUNT ALLEVENT')
                        });
                    } else {
                        console.log(err);
                    }
                });

                let data = {}
                AllEvent.find({}, (err, event) => {
                    if (err) console.log(err)
                }).then((event) => {
                    data.event = event

                    CreatedBy.find({}, (err, data) => {
                        if (err) console.log(err)
                    }).then((CB) => {
                        data.createdby = CB
                        res.render('admin_EventAll.hbs', {
                            data: encodeURI(JSON.stringify(data))
                        })
                    }, (err) => {
                        res.status(400).send(err)
                    })
                })
            }, (err) => {
                //res.render('admin_error.hbs',{})
                res.status(400).send(err)
            })
        })
    }


})

// ===================== Behavior ==================
app.get('/BehaviorContent', (req, res) => {
    res.render('admin_BehaviorContent.hbs', {})
    //console.log('hello')
})

app.post('/saveBehavior', (req, res) => {
    let newBehavior = new Behavior({
        Behavior_Name: req.body.Behavior_Name,
        Behavior_Point: req.body.Behavior_Point,
        Behavior_Description: req.body.Behavior_Description
    })

    newBehavior.save().then((doc) => {
        console.log('!! Success to save BEHAVIOR data !!')
        res.render('admin_BehaviorContent.hbs', {})
    }, (err) => {
        res.status(400).send(err)
    })
})

app.get('/EditBehavior', (req, res) => {
    Behavior.find({}, (err, dataBehavior) => {
        if (err) console.log(err)
    }).then((dataBehavior) => {
        res.render('admin_BehaviorAll.hbs', {
            dataBehavior: encodeURI(JSON.stringify(dataBehavior))
        })
    })
})

app.post('/behavior/:id', (req, res) => {
    let id = req.params.id
    Behavior.find({ Behavior_ID: id }, (err, data) => {
        if (err) console.log(err)
    }).then((data) => {
        res.render('admin_BehaviorEdit.hbs', {
            dataBehavior: encodeURI(JSON.stringify(data))
        })
    })
})

app.post('/saveEditBehavior', (req, res) => {
    Behavior.findOne({ Behavior_ID: req.body.Behavior_ID }).then((d) => {
        //console.log(d)
        // console.log('dataIn :', req.body.id)
        // console.log('hello')
        d.Behavior_Name = req.body.Behavior_Name,
            d.Behavior_Point = req.body.Behavior_Point,
            d.Behavior_Description = req.body.Behavior_Description

        d.save().then((success) => {
            console.log('!! UPDATE data on BEHAVIOR success !!')

            Behavior.find({}, (err, dataBehavior) => {
                if (err) console.log(err)
            }).then((dataBehavior) => {
                res.render('admin_BehaviorAll.hbs', {
                    dataBehavior: encodeURI(JSON.stringify(dataBehavior))
                })
            })
        }, (e) => {
            res.status(400).send(e)
        }, (err) => {
            res.status(400).send(err)
        })
    })


})

// ====================== Reward ================
// reward content
app.get('/rewardContent', (req, res) => {
    res.render('admin_RewardContent.hbs', {})
    //console.log('hello')
})

// edit reward
app.get('/editReward', (req, res) => {
    Reward.find({}, (err, dataReaward) => {
        if (err) console.log(err)
    }).then((dataReward) => {
        res.render('admin_RewardAll.hbs', {
            dataReward: encodeURI(JSON.stringify(dataReward))
        })
    }, (err) => {
        res.status(400).send(err)
    })

})

app.post('/saveReward', upload.single('photos'), function (req, res) {
    let newReward = new Reward({
        Reward_Name: req.body.Reward_Name,
        Reward_Point: req.body.Reward_Point,
        Reward_Photo: req.file.path,
        Reward_Quantity: req.body.Reward_Quantity,
    })

    newReward.save().then((doc) => {
        console.log('@@@@ save REWARD data success @@@@')
        res.render('admin_RewardContent.hbs', {})
    }, (err) => {
        res.status(400).send(err)
    })
})

app.post('/rewardedit/:id', (req, res) => {
    let id = req.params.id
    Reward.find({ Reward_ID: req.params.id }, (err, dataReaward) => {
        if (err) console.log(err)
    }).then((dataReward) => {
        res.render('admin_RewardEdit.hbs', {
            dataReward: encodeURI(JSON.stringify(dataReward))
        })
    })
})

app.post('/saveEditReward', upload.single('photos'), function (req, res) {
    if (req.file == undefined) {
        console.log('no file')
        Reward.findOne({ Reward_ID: req.body.Reward_ID }).then((data) => {
            data.Reward_Name = req.body.Reward_Name,
                data.Reward_Point = req.body.Reward_Point,
                data.Reward_Quantity = req.body.Reward_Quantity,
                data.Reward_Status = req.body.Reward_Status

            data.save().then((success) => {
                console.log('!! UPDATE data on REWARD success !!')

                Reward.find({}, (err, dataReaward) => {
                    if (err) console.log(err)
                }).then((dataReward) => {
                    res.render('admin_RewardAll.hbs', {
                        dataReward: encodeURI(JSON.stringify(dataReward))
                    })
                }, (err) => {
                    res.status(400).send(err)
                })

            }, (e) => {
                res.status(400).send(e)
            }, (err) => {
                res.status(400).send(err)
            })
        })
    } else {
        console.log('have file')
        Reward.findOne({ Reward_ID: req.body.Reward_ID }).then((data) => {
            data.Reward_Name = req.body.Reward_Name,
                data.Reward_Point = req.body.Reward_Point,
                data.Reward_Quantity = req.body.Reward_Quantity,
                data.Reward_Status = req.body.Reward_Status,
                data.Reward_Photo = req.file.path

            data.save().then((success) => {
                console.log('!! UPDATE data on REWARD success !!')

                Reward.find({}, (err, dataReaward) => {
                    if (err) console.log(err)
                }).then((dataReward) => {
                    res.render('admin_RewardAll.hbs', {
                        dataReward: encodeURI(JSON.stringify(dataReward))
                    })
                }, (err) => {
                    res.status(400).send(err)
                })

            }, (e) => {
                res.status(400).send(e)
            }, (err) => {
                res.status(400).send(err)
            })
        })
    }
})

//================== Point ===================
// Inc by group
app.get('/IncreasePoint', (req, res) => {
    OpenEvent.find({}, (err, dataOpenEvent) => {
        if (err) console.log(err)
    }).then((dataOpenEvent) => {
        res.render('admin_Point_Inc.hbs', {
            dataOpenEvent: encodeURI(JSON.stringify(dataOpenEvent))
        })
    }, (err) => {
        res.status(400).send(err)
    })
})

// Dec by group
app.get('/DecreasePoint', (req, res) => {
    Behavior.find({}, (err, dataBehavior) => {
        if (err) console.log(err)
    }).then((dataBehavior) => {
        res.render('admin_Point_Dec.hbs', {
            dataBehavior: encodeURI(JSON.stringify(dataBehavior))
        })
    }, (err) => {
        res.status(400).send(err)
    })

})

app.post('/IncPointIndividual/:id', (req, res) => {
    let data = {}
    let id = req.params.id
    OpenEvent.find({ OpenEvent_ID: id }, (err, dataOpenEvent) => {
        if (err) console.log(err)
    }).then((dataOpenEvent) => {
        data.OpenEvent = dataOpenEvent

        Member.find({}, (err, data) => {
            if (err) console.log(err)
        }).then((Member) => {
            data.Member = Member

            res.render('admin_Point_IncByIndi.hbs', {
                data: encodeURI(JSON.stringify(data))
            })
        }, (err) => {
            res.status(400).send(err)
        })
    })
})

app.post('/IncPointGroup/:id', (req, res) => {
    let data = {}
    let id = req.params.id
    OpenEvent.find({ OpenEvent_ID: id }, (err, dataOpenEvent) => {
        if (err) console.log(err)
    }).then((dataOpenEvent) => {
        data.OpenEvent = dataOpenEvent

        Member.find({}, (err, data) => {
            if (err) console.log(err)
        }).then((Member) => {
            data.Member = Member

            res.render('admin_Point_IncByGroup.hbs', {
                data: encodeURI(JSON.stringify(data))
            })
        }, (err) => {
            res.status(400).send(err)
        })
    })
})

app.post('/DecPointIndividual/:id', (req, res) => {
    let data = {}
    let id = req.params.id
    Behavior.find({ Behavior_ID: id }, (err, dataBehavior) => {
        if (err) console.log(err)
    }).then((dataBehavior) => {
        data.Behavior = dataBehavior

        Member.find({}, (err, data) => {
            if (err) console.log(err)
        }).then((Member) => {
            data.Member = Member

            res.render('admin_Point_DecByIndi.hbs', {
                data: encodeURI(JSON.stringify(data))
            })
        }, (err) => {
            res.status(400).send(err)
        })
    })
})

app.post('/IncEventIndividual', (req, res) => {

    let date_save = moment().format('DD-MM-YYYY');
    let newJoinEvent = new JoinEvent({
        Member_ID: req.body.Member_ID,
        OpenEvent_ID: req.body.OpenEvent_ID,
        OpenEvent_Point: req.body.OpenEvent_Point,
        JoinEvent_Date: date_save,
    })

    newJoinEvent.save().then((doc) => {
        console.log('!!! JOIN EVENT save success !!!')

        let id = req.body.Member_ID
        //console.log(id)
        Member.findOne({ Member_ID: id }).then((d2) => {
            let total = parseFloat(d2.Member_Total)
            let available = parseFloat(d2.Member_Available)
            let eventpoint = parseFloat(req.body.OpenEvent_Point)
            console.log(d2.Member_Total)
            d2.Member_Total = total + eventpoint,
                d2.Member_Available = available + eventpoint,
                d2.save().then((success) => {
                    console.log(' **** Success to edit Member_Point ****')

                    OpenEvent.find({}, (err, dataOpenEvent) => {
                        if (err) console.log(err)
                    }).then((dataOpenEvent) => {
                        res.render('admin_Point_Inc.hbs', {
                            dataOpenEvent: encodeURI(JSON.stringify(dataOpenEvent))
                        })
                    }, (err) => {
                        res.status(400).send(err)
                    })
                }, (e) => {
                    res.status(400).send(e)
                }, (err) => {
                    res.status(400).send(err)
                })

        })

    }, (err) => {
        res.status(400).send(err)
    })
})

app.post('/DecBehaviorIndividual', (req, res) => {

    let date_save = moment().format('DD-MM-YYYY');
    let newJoinBehavior = new JoinBehavior({

        Member_ID: req.body.Member_ID,
        Behavior_ID: req.body.Behavior_ID,
        Behavior_Point: req.body.Behavior_Point,
        JoinBehavior_Date: date_save,

    })

    newJoinBehavior.save().then((doc) => {
        console.log('!!! JOIN BEHAVIOR save success !!!')

        let id = req.body.Member_ID
        //console.log(id)
        Member.findOne({ Member_ID: id }).then((d2) => {
            let total = parseFloat(d2.Member_Total)
            let available = parseFloat(d2.Member_Available)
            let eventpoint = parseFloat(req.body.Behavior_Point)

            console.log(d2.Member_Total)
            d2.Member_Total = total - eventpoint,
                d2.Member_Available = available - eventpoint,
                d2.save().then((success) => {
                    console.log(' **** Success to edit Member_Point ****')

                    Behavior.find({}, (err, dataBehavior) => {
                        if (err) console.log(err)
                    }).then((dataBehavior) => {
                        res.render('admin_Point_Dec.hbs', {
                            dataBehavior: encodeURI(JSON.stringify(dataBehavior))
                        })
                    }, (err) => {
                        res.status(400).send(err)
                    })

                }, (e) => {
                    res.status(400).send(e)
                }, (err) => {
                    res.status(400).send(err)
                })

        })

    }, (err) => {
        res.status(400).send(err)
    })
})

// ============== Year ========================
app.get('/getYear',(req,res)=>{
    res.render('admin_Year.hbs',{})
})

app.post('/saveYear', function (req,res){
    let newYear = new Year({
        Year_Year : req.body.Year_Year,
        Year_StartDate : req.body.Year_StartDate,
        Year_EndDate : req.body.Year_EndDate,
    })

    newYear.save().then((doc)=>{
        console.log('@@@@ save YEAR data success @@@@')
        res.render('admin_Year.hbs',{})
    },(err)=>{
        res.status(400).send(err)
    })
})

// ================ admin ================
app.get('/forAdmin',(req,res)=>{
    res.render('admin_Admin.hbs',{})
})

// ============== Report =============
app.get('/getReport',(req,res)=>{
    res.render('admin_Report.hbs')
})

// ============ Alumni ==========
app.get('/Alumni',(req,res)=>{
    res.render('admin_Alumni.hbs',{})
})

//===================================================
app.listen(3000, () => {
    console.log('listin port 3000')
})

// ======= API for Mobile ====================
app.get('/send_Member', function (req, res, next) {
    Member.find({}).exec(function (error, member) {
        if (error) {
            res.send(error);
        } else {
            res.json(member);
        }
    });
})

app.get('/send_OpenEvent', function (req, res, next) {
    OpenEvent.find({}).exec(function (error, openevent) {
        if (error) {
            res.send(error);
        } else {
            res.json(openevent);
        }
    });
})

app.get('/send_Reward', function (req, res, next) {
    Reward.find({}).exec(function (error, reward) {
        if (error) {
            res.send(error);
        } else {
            res.json(reward);
        }
    });
})

app.get('/send_House', function (req, res, next) {
    House.find({}).exec(function (error, house) {
        if (error) {
            res.send(error);
        } else {
            res.json(house);
        }
    });
})

