const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const request = require('request');
const bcrypt = require('bcryptjs');
const app = express()
const multer = require('multer')
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
app.get('/MemberInsert', (req, res) => {
    res.render('admin_MemberInsert.hbs', {})
    //console.log('hello')
})

app.get('/error', (req, res) => {
    res.render('admin_error.hbs', {})
    //console.log('hello')
})

app.get('/Main', (req, res) => {
    res.render('admin_Main.hbs', {})
    //console.log('hello')
})

app.get('/SeeMoreEvent', (req, res) => {
    res.render('admin_EventCard.hbs', {})
    //console.log('hello')
})

app.get('/BehaviorContent', (req, res) => {
    res.render('admin_BehaviorContent.hbs', {})
    //console.log('hello')
})

app.get('/edit', (req, res) => {
    res.render('admin_edit.hbs', {})
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
// ========================= Member ====================================
// ==================== save data and upload photo =====================
app.post('/save', upload.single('photos'), function (req, res) {
    console.log(req.file)
    let newMember = new Member({
        Member_ID: req.body.Member_ID,
        Member_Password: req.body.Member_Password,
        Member_Name: req.body.Member_Name,
        Member_Lastname: req.body.Member_Lastname,
        Member_House: req.body.Member_House,
        Member_Profile: req.file.path,
        Member_Status: req.body.Member_Status,
        Member_Tel: req.body.Member_Tel
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
})

app.post('/edit', (req, res) => {
    let id = req.body.Member_ID
    Member.findOne({ Member_ID: id }).then((d) => {
        d.Member_ID = id
        d.Member_Name = req.body.Member_Name
        d.Member_Lastname = req.body.Member_Lastname
        d.Member_House = req.body.Member_House
        d.Member_Status = req.body.Member_Status
        d.Member_Name = req.body.Member_Name
        d.Member_Tel = req.body.Member_Tel

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

app.post('/removeMember', (req, res) => {
    console.log('dataIn :', req.body.id)
    Member.remove({ Member_ID: req.body.id }).then((data) => {
        console.log('Member deleted success')

        House.remove({ House_MemberID: req.body.id }).then((data) => {
            console.log('Member In House deleted success')
        }, (err) => {
            res.status(400).send(err)
        })
    }, (err) => {
        res.status(400).send(err)
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
    let newAllEvent = new AllEvent({
        AllEvent_Name: req.body.Event_Name,
        AllEvent_Point: req.body.Event_Point,
        AllEvent_StartDate: req.body.Event_StartDate,
        AllEvent_EndDate: req.body.Event_EndDate,
        AllEvent_StartTime: req.body.Event_StartTime,
        AllEvent_EndTime: req.body.Event_EndTime,
        AllEvent_Semeter: req.body.Event_Semester,
        EventType_ID: req.body.Event_Type,
        CreatedBy_ID: req.body.Event_CreatedBy,
        AllEvent_Location: req.body.Event_Location,
        AllEvent_Picture: req.file.path,
        AllEvent_Descrip: req.body.Event_Description,
        AllEvent_Year: req.body.Event_Year
    })
    newAllEvent.save().then((doc) => {
        let newOpenEvent = new OpenEvent({
            OpenEvent_Name: req.body.Event_Name,
            OpenEvent_Point: req.body.Event_Point,
            OpenEvent_StartDate: req.body.Event_StartDate,
            OpenEvent_EndDate: req.body.Event_EndDate,
            OpenEvent_StartTime: req.body.Event_StartTime,
            OpenEvent_EndTime: req.body.Event_EndTime,
            OpenEvent_Semeter: req.body.Event_Semester,
            EventType_ID: req.body.Event_Type,
            CreatedBy_ID: req.body.Event_CreatedBy,
            OpenEvent_Location: req.body.Event_Location,
            OpenEvent_Picture: req.file.path,
            OpenEvent_Descrip: req.body.Event_Description,
            OpenEvent_Year: req.body.Event_Year
        })
        newOpenEvent.save().then((doc) => {
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
    })
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

// ============= เปิดกิจกรรม ====================
app.post('/saveOpenEvent', upload.single('photos'), function (req, res) {
    if (req.file == undefined) {
        console.log('hello')
        AllEvent.find({
            AllEvent_ID: req.body.Event_ID
        }).then((data) => {
            console.log('data is' + data[0])
            let newOpenEvent = new OpenEvent({
                OpenEvent_Name: req.body.Event_Name,
                OpenEvent_Point: req.body.Event_Point,
                OpenEvent_StartDate: req.body.Event_StartDate,
                OpenEvent_EndDate: req.body.Event_EndDate,
                OpenEvent_StartTime: req.body.Event_StartTime,
                OpenEvent_EndTime: req.body.Event_EndTime,
                OpenEvent_Semeter: req.body.Event_Semester,
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
                    })
                })
            }, (err) => {
                //res.render('admin_error.hbs',{})
                res.status(400).send(err)
            })
        })
    }else{
        AllEvent.find({
        AllEvent_ID: req.body.Event_ID
    }).then((data) => {
        console.log('data is' + data[0])
        let newOpenEvent = new OpenEvent({
            OpenEvent_Name: req.body.Event_Name,
            OpenEvent_Point: req.body.Event_Point,
            OpenEvent_StartDate: req.body.Event_StartDate,
            OpenEvent_EndDate: req.body.Event_EndDate,
            OpenEvent_StartTime: req.body.Event_StartTime,
            OpenEvent_EndTime: req.body.Event_EndTime,
            OpenEvent_Semeter: req.body.Event_Semester,
            EventType_ID: req.body.Event_Type,
            CreatedBy_ID: req.body.Event_CreatedBy,
            OpenEvent_Location: req.body.Event_Location,
            OpenEvent_Picture: req.file.path,
            OpenEvent_Descrip: req.body.Event_Description,
            OpenEvent_Count: data[0].AllEvent_Count + 1

        })

        newOpenEvent.save().then((doc) => {

            AllEvent.findOne({AllEvent_ID: req.body.Event_ID},function(err,data){
                if(data){
                    data.AllEvent_Count += 1
                    data.save(function(err) {
                        if (err) // do something
                        console.log('is fail to update COUNT ON ALLEVENT')
                        else 
                        console.log('is UPdated COUNT ALLEVENT')
                    });
                }else{
                    console.log(err);
                }
            });

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
app.post('/saveBehavior', (req, res) => {
    let newBehavior = new Behavior({
        Behavior_Name: req.body.Behavior_Name,
        Behavior_Point: req.body.Behavior_Point,
        Behavior_Description: req.body.Behavior_Description
    })

    newBehavior.save().then((doc) => {
        console.log('Success to save BEHAVIOR data')
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


//===================================================
app.listen(3000, () => {
    console.log('listin port 3000')
})