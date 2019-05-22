const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const request = require('request');
const bcrypt = require('bcryptjs');
const app = express()
const multer = require('multer')
const schedule = require('node-schedule');
const moment = require('moment');
const session = require('express-session')
const image2base64 = require('image-to-base64');
autoIncrement = require('mongoose-auto-increment');
var academic_year = 2563;

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
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
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
var Admin = require('./Model/AdminModel')
var RedeemReward = require('./Model/RedeemRewardMode')

//=========================================
mongoose.connect('mongodb://localhost:27017/DBcoe').then((doc) => {
    console.log('@@@@ Success to connect with Database @@@')
}, (err) => {
    console.log('!!!!!!!!!! error to connect with database !!!!!!!!!')
})
// var connection = mongoose.createConnection("mongodb://localhost/DBcoe");


autoIncrement.initialize(mongoose.createConnection('mongodb://localhost:27017/DBcoe'), { useNewUrlParser: true });

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

//app.use('/member', MemberRounter)
// session

app.use(session({
    secret: '1234DFs@ad1234!@#$sd',
    resave: false,
    saveUninitialized: true
}))
// ================ API Get ================
// 1 Admin
app.get('/forAdmin', (req, res) => {
    let name = req.session.displayName
    if (req.session.displayName) {
        res.render('admin_Admin.hbs', {
            data: encodeURI(JSON.stringify(name))
        })
    } else {
        res.redirect('/login')
    }
})

// 2 Alumni 
app.get('/Alumni', (req, res) => {
    let name = req.session.displayName
    if (req.session.displayName) {
        res.render('admin_Alumni.hbs', {
            data: encodeURI(JSON.stringify(name))
        })
    } else {
        res.redirect('/login')
    }
})

// 3  Behavior_All
app.get('/EditBehavior', (req, res) => {
    let name = req.session.displayName
    if (req.session.displayName) {
        Behavior.find({}, (err, dataBehavior) => {
            if (err) console.log(err)
        }).then((dataBehavior) => {
            res.render('admin_BehaviorAll.hbs', {
                dataBehavior: encodeURI(JSON.stringify(dataBehavior))
            })
        })
        // res.render('admin_Alumni.hbs', {
        //     data : encodeURI(JSON.stringify(name))
        // })
    } else {
        res.redirect('/login')
    }
})

//4 admin_BehaviorContent
app.get('/BehaviorContent', (req, res) => {
    let name = req.session.displayName
    if (req.session.displayName) {
        res.render('admin_BehaviorContent.hbs', {
            data: encodeURI(JSON.stringify(name))
        })
    } else {
        res.redirect('/login')
    }
})

//5 admin_BehaviorEdit
app.post('/behavior/:id', (req, res) => {
    let id = req.params.id
    let name = req.session.displayName
    if (req.session.displayName) {
        Behavior.find({ Behavior_ID: id }, (err, data) => {
            if (err) console.log(err)
        }).then((data) => {
            res.render('admin_BehaviorEdit.hbs', {
                dataBehavior: encodeURI(JSON.stringify(data))
            })
        })
    } else {
        res.redirect('/login')
    }
})
//6 admin_CreatedByDisplay
app.get('/CreatedByDisplay', (req, res) => {
    let name = req.session.displayName
    if (req.session.displayName) {
        CreatedBy.find({}, (err, data) => {
            if (err) console.log(err)
        }).then((dataCB) => {
            res.render('admin_CreatedByDisplay.hbs', {
                dataCB: encodeURI(JSON.stringify(dataCB))
            })
        })
    } else {
        res.redirect('/login')
    }
})
// 7 admin_CreatedByInsert
app.get('/CreatedByInsert', (req, res) => {
    let name = req.session.displayName
    if (req.session.displayName) {
        res.render('admin_CreatedByInsert.hbs', {})
    } else {
        res.redirect('/login')
    }
})

//8 admin_error
app.get('/error', (req, res) => {
    let name = req.session.displayName
    if (req.session.displayName) {
        res.render('admin_error.hbs', {
            data: encodeURI(JSON.stringify(name))
        })
    } else {
        res.redirect('/login')
    }
})

//9 admin_errorTel NO
//10 admin_EventAll
app.get('/AllEvent', (req, res) => {
    let data = {}
    let name = req.session.displayName
    if (req.session.displayName) {
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
    } else {
        res.redirect('/login')
    }
})

//11 admin_EventCard
app.get('/SeeMoreEvent', (req, res) => {
    if (req.session.displayName) {
        OpenEvent.find({}, (err, dataEvent) => {
            if (err) console.log(err)
        }).then((data) => {
            res.render('admin_EventCard.hbs', {
                data: encodeURI(JSON.stringify(data))
            })
        })
    } else {
        res.redirect('/login')
    }
})


//12 admin_EventContent
app.get('/EventContent', (req, res) => {
    let data = {}
    let name = req.session.displayName
    if (req.session.displayName) {
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
    } else {
        res.redirect('/login')
    }
})

//13 admin_EventEdit.hbs
//14 admin_EventOpen.hbs
//15 admin_EventTypeDisplay.hbs
app.get('/EventTypeDisplay', (req, res) => {
    let name = req.session.displayName
    if (req.session.displayName) {
        EventType.find({}, (err, data) => {
            if (err) console.log(err)
        }).then((dataEV) => {
            res.render('admin_EventTypeDisplay.hbs', {
                dataEV: encodeURI(JSON.stringify(dataEV))
            })
        })
    } else {
        res.redirect('/login')
    }
})

//16 admin_EventTypeInsert.hbs
app.get('/EventTypeInsert', (req, res) => {
    let name = req.session.displayName
    if (req.session.displayName) {
        res.render('admin_EventTypeInsert.hbs', {})
    } else {
        res.redirect('/login')
    }
})

//17 admin_HouseBill.hbs
app.get('/Bill', (req, res) => {
    let bill = 'Bill Gates'
    let name = req.session.displayName
    if (req.session.displayName) {
        Member.find({ Member_House: bill }, (err, dataHouse) => {
            if (err) console.log(err)
        }).then((dataHouse) => {
            res.render('admin_HouseBill.hbs', {
                dataHouse: encodeURI(JSON.stringify(dataHouse))
            })
        })
    } else {
        res.redirect('/login')
    }
})

//18 admin_HouseLarry.hbs
app.get('/Larry', (req, res) => {
    let larry = 'Larry Page'
    let name = req.session.displayName
    if (req.session.displayName) {
        Member.find({ Member_House: larry }, (err, dataHouse) => {
            if (err) console.log(err)
        }).then((dataHouse) => {
            res.render('admin_HouseLarry.hbs', {
                dataHouse: encodeURI(JSON.stringify(dataHouse))
            })
        })
    } else {
        res.redirect('/login')
    }
})

//19 admin_HouseElon.hbs
app.get('/Elon', (req, res) => {
    let elon = 'Elon Mask'
    let name = req.session.displayName
    if (req.session.displayName) {
        Member.find({ Member_House: elon }, (err, dataHouse) => {
            if (err) console.log(err)
        }).then((dataHouse) => {
            res.render('admin_HouseElon.hbs', {
                dataHouse: encodeURI(JSON.stringify(dataHouse))
            })
        })
    } else {
        res.redirect('/login')
    }
})

//20 admin_HouseMark.hbs
app.get('/Mark', (req, res) => {
    let mark = 'Mark Zuckerberg'
    let name = req.session.displayName
    if (req.session.displayName) {
        Member.find({ Member_House: mark }, (err, dataHouse) => {
            if (err) console.log(err)
        }).then((dataHouse) => {
            res.render('admin_HouseMark.hbs', {
                dataHouse: encodeURI(JSON.stringify(dataHouse))
            })
        })
    } else {
        res.redirect('/login')
    }
})

//21 admin_Login
//22 admin_Main.hbs
app.get('/Main', (req, res) => {
    let name = req.session.displayName
    let data = {}
    if (req.session.displayName) {
        Member.find({}, (err, data) => {
            if (err) console.log(err)
        }).then((dataMember) => {
            data.member = dataMember

            OpenEvent.find({}, (err, data) => {
                if (err) console.log(err)
            }).then((dataOpenEvent) => {
                data.openevent = dataOpenEvent

                Reward.find({}, (err, dataReward) => {
                    if (err) console.log(err)
                }).then((dataReward) => {
                    data.reward = dataReward
                    data.name = name

                    House.find({}, (err, dataHouse) => {
                        data.house = dataHouse

                        res.render('admin_Main.hbs', {
                            data: encodeURI(JSON.stringify(data))
                        })
                    }, (err) => {
                        res.status(400).send(err)
                    })
                })
            })
        })

    } else {
        res.redirect('/login')
    }
})

//23 admin_MemberAll.hbs
app.get('/MemberAll', (req, res) => {
    let name = req.session.displayName
    if (req.session.displayName) {
        Member.find({}, (err, dataMember) => {
            if (err) console.log(err)
        }).then((dataMember) => {
            res.render('admin_MemberAll.hbs', {
                dataMember: encodeURI(JSON.stringify(dataMember))
            })
        })
    } else {
        res.redirect('/login')
    }
})

//24 MemberEdit
//25 admin_MemberInsert.hbs
app.get('/MemberInsert', (req, res) => {
    let name = req.session.displayName
    if (req.session.displayName) {
        res.render('admin_MemberInsert.hbs', {})
    } else {
        res.redirect('/login')
    }
})

// 26 admin_Point_Dec.hbs
app.get('/DecreasePoint', (req, res) => {
    let name = req.session.displayName
    if (req.session.displayName) {
        Behavior.find({}, (err, dataBehavior) => {
            if (err) console.log(err)
        }).then((dataBehavior) => {
            res.render('admin_Point_Dec.hbs', {
                dataBehavior: encodeURI(JSON.stringify(dataBehavior))
            })
        }, (err) => {
            res.status(400).send(err)
        })
    } else {
        res.redirect('/login')
    }
})

//27 admin_Point_Inc.hbs
app.get('/IncreasePoint', (req, res) => {
    let name = req.session.displayName
    if (req.session.displayName) {
        OpenEvent.find({}, (err, dataOpenEvent) => {
            if (err) console.log(err)
        }).then((dataOpenEvent) => {
            res.render('admin_Point_Inc.hbs', {
                dataOpenEvent: encodeURI(JSON.stringify(dataOpenEvent))
            })
        }, (err) => {
            res.status(400).send(err)
        })
    } else {
        res.redirect('/login')
    }
})

//28 admin_Point_IncByGroup.hbs
//29 admin_Point_IncByIndi.hbs
//30 dmin_Report.hbs
app.get('/getReport', (req, res) => {
    let name = req.session.displayName
    if (req.session.displayName) {
        res.render('admin_Report.hbs', {})
    } else {
        res.redirect('/login')
    }
})

//31 admin_RewardAll.hbs
app.get('/editReward', (req, res) => {
    let name = req.session.displayName
    if (req.session.displayName) {
        Reward.find({}, (err, dataReaward) => {
            if (err) console.log(err)
        }).then((dataReward) => {
            res.render('admin_RewardAll.hbs', {
                dataReward: encodeURI(JSON.stringify(dataReward))
            })
        }, (err) => {
            res.status(400).send(err)
        })
    } else {
        res.redirect('/login')
    }
})

//32 admin_RewardContent.hbs
app.get('/rewardContent', (req, res) => {
    let name = req.session.displayName
    if (req.session.displayName) {
        res.render('admin_RewardContent.hbs', {})
    } else {
        res.redirect('/login')
    }
    //console.log('hello')
})

//33 admin_RewardEdit.hbs
//34 admin_Year.hbs
app.get('/getYear', (req, res) => {
    let name = req.session.displayName
    if (req.session.displayName) {
        res.render('admin_Year.hbs', {})
    } else {
        res.redirect('/login')
    }
})

app.get('/SeeMoreReward', (req, res) => {
    if (req.session.displayName) {
        Reward.find({}, (err, dataEvent) => {
            if (err) console.log(err)
        }).then((dataReward) => {
            res.render('admin_RewardCard.hbs', {
                data: encodeURI(JSON.stringify(dataReward))
            })
        })
    } else {
        res.redirect('/login')
    }
})

app.get('/RedeemRewards', (req, res) => {
    if (req.session.displayName) {
        let stock = "in stock"
        let data = {}
        Reward.find({ Reward_Status: stock }, (err, data) => {
            if (err) console.log(err)
        }).then((dataReward) => {
            data.reward = dataReward

            Member.find({}, (err, data) => {
                if (err) console.log(err)
            }).then((dataMember) => {
                data.member = dataMember

                res.render('admin_RewardRedeem.hbs', {
                    data: encodeURI(JSON.stringify(data))
                })
            })
        })
    } else {
        res.redirect('/login')
    }
})

// ****************************************************************************************
// ====================== API Post =============================
app.post('/admin/save', function (req, res) {
    let name = req.session.displayName
    if (req.session.displayName) {
        // res.render('admin_Admin.hbs', {
        //     data : encodeURI(JSON.stringify(name))
        // })
        let newAdmin = new Admin({
            Admin_Name: req.body.Admin_Name,
            Admin_Surname: req.body.Admin_Surname,
            Admin_Username: req.body.Admin_Username,
            Admin_Password: req.body.Admin_Password
        })
        newAdmin.save().then((doc) => {
            res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
            
                <title>Success</title>
            
                <!-- Bootstrap CSS CDN -->
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4"
                    crossorigin="anonymous">
                <style>
                    @import "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700";
                    h4 {
                        color: crimson;
                    }
            
                    p {
                        font-family: 'Poppins', sans-serif;
                        font-size: 1.1em;
                        font-weight: 300;
                        line-height: 1.7em;
                        color: #999;
                    }
                </style>
            </head>
            <body>
                <div class="container d-flex justify-content-center align-items-center">
                    <div class="row mt-5 ">
            
                        <div class="alert alert-success" role="alert">
                            <h3 class="alert-heading">Succes !</h3>
                            <p style="font-size: 25px;color: rgb(114, 121, 121);font-family: 'Poppins', sans-serif;">บันทึกข้อมูล Admin ลงฐานข้อมูลสำเร็จ </p>
                            <hr>
                            <p class="d-flex justify-content-end">
                                    <a class="btn btn-lg btn-outline-success" href="http://localhost:3000/forAdmin" role="button">ตกลง</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="line"></div>
            </body>
            
            </html>
            `)
        }, (err) => {
            //res.render('admin_error.hbs',{})
            res.status(400).send(err)
        })
    } else {
        res.redirect('/login')
    }


})

// ================= Login/Logout ============
app.get('/login', (req, res) => {
    res.render('admin_Login.hbs', {})
})

app.post('/login/admin', function (req, res) {
    let username = req.body.Username
    let password = req.body.Password
    let admin_error = ` <!DOCTYPE html>
    <html lang="en">  
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>ระบบจัดการคะแนนและกลุ่มบ้าน</title>
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
        crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy"
        crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
        crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Kanit" rel="stylesheet">

        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: 'Kanit', sans-serif !important;
            }
    
            a {
                font-family: 'Kanit', sans-serif !important;
                color:black;
            }
        </style>
    </head>
    
    <body>
        <div class="container text-white ">
            <div class="row mt-5 justify-content-center ">
                <div class="col-lg-4 mt-5 ">
                    <div class="card bg-info text-white text-center ">
                        <div class="card-body">
                            <h3 class="pb-1">Please Login Again !!</h3>
                            <form action="http://localhost:3000/login/admin" method="POST">
                                <div class="form-group">
                                    <input name="Username" type="text" class="input-font py-4 form-control" id="Username" aria-describedby="emailHelp" placeholder="Username">
                                </div>
                                <div class="form-group">
                                    <input name="Password" type="password" class="input-font py-4 form-control" id="Password" placeholder="Password">
                                </div>
    
                                <button type="submit" class="input-font btn btn-block btn-outline-light">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    
    </html>`


    Admin.find({
        Admin_Username: username,
        Admin_Password: password
    }).then((admin) => {
        if (admin.length == 1) { //เจอข้อมูล 1 คน 
            //console.log(admin[0].Admin_Name)
            req.session.displayName = admin[0].Admin_Name

            res.redirect('/Main')
            console.log('login success')
        } else if (admin.length == 0) {
            res.send(admin_error)
        }
    }, (err) => {
        res.send(400).send(err)
    })
})

app.get('/logout', function (req, res) {
    delete req.session.displayName
    res.redirect('/login')
})

// ========================= Member ====================================
// ==================== save data and upload photo =====================
app.post('/save', upload.single('photos'), function (req, res) {
    if (req.session.displayName) {
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
                    let img_base64 = ""


                    if (req.file == undefined) {
                        res.render('admin_errorFile.hbs')
                        return 0;
                    } else {
                        image2base64(req.file.path) // you can also to use url
                            .then(
                                (response) => {
                                    img_base64 = "data:" + req.file.mimetype + ";base64," + response
                                    //console.log(response); //cGF0aC90by9maWxlLmpwZw==

                                    let newMember = new Member({
                                        Member_ID: req.body.Member_ID,
                                        Member_Password: req.body.Member_Password,
                                        Member_Name: req.body.Member_Name,
                                        Member_Lastname: req.body.Member_Lastname,
                                        Member_House: req.body.Member_House,
                                        Member_Profile: img_base64,
                                        Member_Tel: req.body.Member_Tel,
                                        Member_Total: point,
                                        Member_Available: point,
                                        Member_Admin: req.session.displayName
                                    })
                                    newMember.save().then((doc) => {
                                        let newHouse = new House({
                                            House_name: req.body.Member_House,
                                            House_MemberID: req.body.Member_ID,
                                            House_MemberPoint: point
                                        })

                                        newHouse.save().then((doc) => {
                                            res.render('admin_MemberInsert.hbs', {})
                                        })
                                    }, (err) => {
                                        //res.render('admin_error.hbs',{})
                                        res.status(400).send(err)
                                    })
                                }
                            )
                            .catch(
                                (error) => {
                                    console.log(error);
                                }
                            )
                    }

                }
            }, (err) => {
                res.send(400).send(err)
            })
        })
    } else {
        res.redirect('/login')
    }
})

app.post('/editMember', (req, res) => {
    if (req.session.displayName) {
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
                res.redirect('/MemberAll')
            }, (e) => {
                res.status(400).send(e)
            }, (err) => {
                res.status(400).send(err)
            })
        })
    } else {
        res.redirect('/login')
    }

})

app.post('/resetPassword', (req, res) => {
    if (req.session.displayName) {
        let password = "password"
        console.log('dataIn :', req.body.id)
        Member.findOne({ Member_ID: req.body.id }).then((d) => {
            d.Member_Password = password

            d.save().then((success) => {
                console.log(' **** Success to reset password ****')
                res.redirect('/MemberAll')
            }, (e) => {
                res.status(400).send(e)
            }, (err) => {
                res.status(400).send(err)
            })
        })
    } else {
        res.redirect('/login')
    }

})

app.post('/member/:edit', (req, res, next) => {
    //console.log('dataIn :', req.params.edit)
    if (req.session.displayName) {
        let id = req.params.edit
        let data = {}
        Member.find({ Member_ID: id }, (err, dataMember) => {
            if (err) console.log(err)
        }).then((dataMember) => {
            data.member = dataMember

            JoinEvent.find({ Member_ID: id }, (err, data) => {
                if (err) console.log(err)
            }).then((dataJoinEvent) => {
                data.joinevent = dataJoinEvent

                JoinBehavior.find({ Member_ID: id }, (err, data) => {
                    if (err) console.log(err)
                }).then((dataJoinBehavior) => {
                    data.joinbehavior = dataJoinBehavior

                    RedeemReward.find({ Member_ID: id }, (err, data) => {
                        if (err) console.log(err)
                    }).then((dataRedeemReward) => {
                        data.redeemreward = dataRedeemReward

                        Year.find({}, (err, data) => {
                            if (err) console.log(err)
                        }).then((dataYear) => {
                            data.year = dataYear

                            res.render('admin_MemberEdit.hbs', {
                                data: encodeURI(JSON.stringify(data))
                            })
                        }, (err) => {
                            res.status(400).send(err)
                        })
                    })
                })
            })

        })
    } else {
        res.redirect('/login')
    }

})

app.post('/member/edit/data', (req, res) => {
    if (req.session.displayName) {
        let id = req.body.Member_ID
        Member.findOne({ Member_ID: id }).then((d) => {
            d.Member_ID = id
            d.Member_Name = req.body.Member_Name
            d.Member_Lastname = req.body.Member_Lastname
            d.Member_House = req.body.Member_House
            d.Member_Status = req.body.Member_Status
            d.Member_Name = req.body.Member_Name

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
    } else {
        res.redirect('/login')
    }
})

// ============== Event Type ===================
app.post('/saveEventType', (req, res) => {
    if (req.session.displayName) {
        let newEventType = new EventType({
            EventType_Name: req.body.EventType_Name,
        })
        newEventType.save().then((doc) => {
            res.redirect('/EventTypeInsert')
        }, (err) => {
            res.status(400).send(err)
        })
    } else {
        res.redirect('/login')
    }
})

app.post('/removeEventType', (req, res) => {
    if (req.session.displayName) {
        console.log('dataIn :', req.body.id)
        EventType.remove({ EventType_ID: req.body.id }).then((data) => {
            console.log('Event Type deleted success')
        }, (err) => {
            res.status(400).send(err)
        })
    } else {
        res.redirect('/login')
    }

})

// ============== Created By ===================
app.post('/saveCreatedBy', (req, res) => {
    if (req.session.displayName) {
        let newCreatedBy = new CreatedBy({
            CreatedBy_Name: req.body.CreatedBy_Name
        })
        newCreatedBy.save().then((doc) => {
            console.log(doc)
            res.redirect('/CreatedByInsert')
        }, (err) => {
            res.status(400).send(err)
        })
    } else {
        res.redirect('/login')
    }

})

app.post('/removeCreatedBy', (req, res) => {
    if (req.session.displayName) {
        console.log('dataIn :', req.body.id)
        CreatedBy.remove({ CreatedBy_ID: req.body.id }).then((data) => {
            console.log('Created By deleted success')
        }, (err) => {
            res.status(400).send(err)
        })
    } else {
        res.redirect('/login')
    }

})

// ============= All Event ===================
app.post('/saveEvent', upload.single('photos'), function (req, res) {
    if (req.session.displayName) {
        let img_event = "http://togetherasonefoundation.org/wp-content/uploads/2019/01/EVENTS.png"
        let img_base64 = ""
        if (req.file == undefined) {
            console.log(' No file')
            let newAllEvent = new AllEvent({
                AllEvent_Name: req.body.Event_Name,
                AllEvent_Point: req.body.Event_Point,
                AllEvent_Semeter: req.body.Event_Semester,
                EventType_ID: req.body.Event_Type,
                CreatedBy_ID: req.body.Event_CreatedBy,
                AllEvent_Location: req.body.Event_Location,
                AllEvent_Picture: img_event,
                AllEvent_Descrip: req.body.Event_Description
            })
            newAllEvent.save().then((doc) => {
                console.log('Succes to save data on ALL EVENT and OPEN EVENT')
                res.redirect('/EventContent')


            }, (err) => {
                //res.render('admin_error.hbs',{})
                res.status(400).send(err)
            })
        } else {
            console.log(' Have file')

            image2base64(req.file.path).then((response) => {
                img_base64 = "data:" + req.file.mimetype + ";base64," + response

                let newAllEvent = new AllEvent({
                    AllEvent_Name: req.body.Event_Name,
                    AllEvent_Point: req.body.Event_Point,
                    AllEvent_Semeter: req.body.Event_Semester,
                    EventType_ID: req.body.Event_Type,
                    CreatedBy_ID: req.body.Event_CreatedBy,
                    AllEvent_Location: req.body.Event_Location,
                    AllEvent_Picture: img_base64,
                    AllEvent_Descrip: req.body.Event_Description
                })
                newAllEvent.save().then((doc) => {
                    console.log('Succes to save data on ALL EVENT and OPEN EVENT')
                    res.redirect('/EventContent')
                }, (err) => {
                    //res.render('admin_error.hbs',{})
                    res.status(400).send(err)
                })

            }).catch((error) => {
                console.log(error); //Exepection error....
            })
        }
    } else {
        res.redirect('/login')
    }

})

app.post('/event/:id', (req, res) => {
    if (req.session.displayName) {
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

                    Year.find({}, (err, data) => {
                        if (err) console.log(err)
                    }).then((year) => {
                        data.year = year
                        res.render('admin_EventOpen.hbs', {
                            data: encodeURI(JSON.stringify(data))
                        })
                    }, (err) => {
                        res.status(400).send(err)
                    })
                })
            })
        })
    } else {
        res.redirect('/login')
    }
})

app.post('/event/edit/:id', (req, res) => {
    if (req.session.displayName) {
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
    } else {
        res.redirect('/login')
    }

})

app.post('/editEventContent', upload.single('photos'), function (req, res) {
    if (req.session.displayName) {
        let img_base64 = ""
        let id = req.body.Event_ID

        if (req.file == undefined) {
            console.log('didnot change file')

            AllEvent.findOne({ AllEvent_ID: id }).then((d) => {
                d.AllEvent_Name = req.body.Event_Name
                d.AllEvent_Point = req.body.Event_Point
                d.AllEvent_Semeter = req.body.Event_Semester
                d.EventType_ID = req.body.Event_Type
                d.CreatedBy_ID = req.body.Event_CreatedBy
                d.AllEvent_Location = req.body.Event_Location
                d.AllEvent_Descrip = req.body.Event_Description

                d.save().then((success) => {
                    console.log('#### Finish to edit EVENT Content')
                    res.redirect('/AllEvent')
                }, (e) => {
                    res.status(400).send(e)
                }, (err) => {
                    res.status(400).send(err)
                })
            })

        } else {
            console.log('==== Have picture file =====')
            image2base64(req.file.path).then((response) => {
                img_base64 = "data:" + req.file.mimetype + ";base64," + response

                AllEvent.findOne({ AllEvent_ID: id }).then((d) => {
                    d.AllEvent_Name = req.body.Event_Name
                    d.AllEvent_Point = req.body.Event_Point
                    d.AllEvent_Semeter = req.body.Event_Semester
                    d.EventType_ID = req.body.Event_Type
                    d.CreatedBy_ID = req.body.Event_CreatedBy
                    d.AllEvent_Picture = img_base64
                    d.AllEvent_Location = req.body.Event_Location
                    d.AllEvent_Descrip = req.body.Event_Description

                    d.save().then((success) => {
                        console.log('#### Finish to edit EVENT Content')
                        res.redirect('/AllEvent')
                    }, (e) => {
                        res.status(400).send(e)
                    }, (err) => {
                        res.status(400).send(err)
                    })
                })


            }).catch((error) => {
                console.log(error); //Exepection error....
            })
        }

    } else {
        res.redirect('/login')
    }
})

app.get('/displayOpenEvnt/:id' , function (req,res){
    if(req.session.displayName){
        let id =req.params.id
        let data ={}
        //console.log(id)
        OpenEvent.find({OpenEvent_ID:id},(err,dataEvent)=>{
            if(err) console.log(err)
        }).then((data1)=>{
            data.event = data1

            CreatedBy.find({}, (err, data) => {
                if (err) console.log(err)
            }).then((createdby) => {
                data.createdby = createdby

                EventType.find({}, (err, data) => {
                    if (err) console.log(err)
                }).then((eventtype) => {
                    data.eventtype = eventtype

                    Year.find({}, (err, data) => {
                        if (err) console.log(err)
                    }).then((year) => {
                        data.year = year

                        res.render('admin_EventOpenDetail.hbs', {
                            data: encodeURI(JSON.stringify(data))
                        })
                    }, (err) => {
                        res.status(400).send(err)
                    })
                })
            })
            
        })
    }else{
        res.redirect('/login')
    }
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
    Year.find({ Year_StartDate: ymd }).then((d3) => {
        for (let i = 0; i < d3.length; i++) {
            //console.log(academic_year)
            //console.log('==============')
            //console.log(d3[i].Year_Year)
            let year = d3[i].Year_Year
            academic_year = year
            //console.log(academic_year)    
        }
    })


});

// ============= เปิดกิจกรรม ====================
app.post('/saveOpenEvent', upload.single('photos'), function (req, res) {
    if (req.session.displayName) {
        let img_event = "http://togetherasonefoundation.org/wp-content/uploads/2019/01/EVENTS.png"
        let img_base64 = ""
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
                    OpenEvent_Count: data[0].AllEvent_Count + 1,

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
                    res.redirect('/AllEvent')
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
                image2base64(req.file.path).then((response) => {
                    img_base64 = "data:" + req.file.mimetype + ";base64," + response


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
                        OpenEvent_Picture: img_base64,
                        OpenEvent_Descrip: req.body.Event_Description,
                        OpenEvent_Count: data[0].AllEvent_Count + 1,
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
                        res.redirect('/AllEvent')
                    }, (err) => {
                        //res.render('admin_error.hbs',{})
                        res.status(400).send(err)
                    })
                }).catch((error) => {
                    console.log(error); //Exepection error....
                })
            })
        }
    } else {
        res.redirect('/login')
    }
})

// ===================== Behavior ==================
app.post('/saveBehavior', (req, res) => {
    if (req.session.displayName) {
        let newBehavior = new Behavior({
            Behavior_Name: req.body.Behavior_Name,
            Behavior_Point: req.body.Behavior_Point,
            Behavior_Description: req.body.Behavior_Description
        })

        newBehavior.save().then((doc) => {
            console.log('!! Success to save BEHAVIOR data !!')
            res.redirect('/BehaviorContent')
        }, (err) => {
            res.status(400).send(err)
        })
    } else {
        res.redirect('/login')
    }
})

app.post('/saveEditBehavior', (req, res) => {
    if (req.session.displayName) {
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
    } else {
        res.redirect('/login')
    }
})

// ====================== Reward ================
app.post('/saveReward', upload.single('photos'), function (req, res) {
    if (req.session.displayName) {
        let img_re = "data:image/png;base64,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"
        let img_base64 = ""
        if (req.file == undefined) {
            console.log('No file')
            let newReward = new Reward({
                Reward_Name: req.body.Reward_Name,
                Reward_Point: req.body.Reward_Point,
                Reward_Photo: img_re,
                Reward_Quantity: req.body.Reward_Quantity,
            })
            newReward.save().then((doc) => {
                console.log('@@@@ save REWARD data success @@@@')
                res.render('admin_RewardContent.hbs', {})
            }, (err) => {
                res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
            
                <title>Success</title>
            
                <!-- Bootstrap CSS CDN -->
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4"
                    crossorigin="anonymous">
                <style>
                    @import "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700";
                    h4 {
                        color: crimson;
                    }
            
                    p {
                        font-family: 'Poppins', sans-serif;
                        font-size: 1.1em;
                        font-weight: 300;
                        line-height: 1.7em;
                        color: #999;
                    }
                </style>
            </head>
            <body>
                <div class="container d-flex justify-content-center align-items-center">
                    <div class="row mt-5 ">
            
                        <div class="alert alert-success" role="alert">
                            <h3 class="alert-heading">Error !</h3>
                            <p style="font-size: 25px;color: rgb(114, 121, 121);font-family: 'Poppins', sans-serif;">ไม่สามารถบันทึกข้อมูลได้ กรุณากรอกข้อมูลให้ครบถ้วน </p>
                            <hr>
                            <p class="d-flex justify-content-end">
                                    <a class="btn btn-lg btn-outline-success" href="http://localhost:3000/rewardContent" role="button">ตกลง</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="line"></div>
            </body>
            
            </html>
            `)
            })
        } else {
            console.log('Have file')
            image2base64(req.file.path).then((response) => {
                img_base64 = "data:" + req.file.mimetype + ";base64," + response
                let newReward = new Reward({
                    Reward_Name: req.body.Reward_Name,
                    Reward_Point: req.body.Reward_Point,
                    Reward_Photo: img_base64,
                    Reward_Quantity: req.body.Reward_Quantity
                })
                newReward.save().then((doc) => {
                    console.log('@@@@ save REWARD data success @@@@')
                    res.render('admin_RewardContent.hbs', {})
                }, (err) => {
                    res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
            
                <title>Success</title>
            
                <!-- Bootstrap CSS CDN -->
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4"
                    crossorigin="anonymous">
                <style>
                    @import "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700";
                    h4 {
                        color: crimson;
                    }
            
                    p {
                        font-family: 'Poppins', sans-serif;
                        font-size: 1.1em;
                        font-weight: 300;
                        line-height: 1.7em;
                        color: #999;
                    }
                </style>
            </head>
            <body>
                <div class="container d-flex justify-content-center align-items-center">
                    <div class="row mt-5 ">
            
                        <div class="alert alert-success" role="alert">
                            <h3 class="alert-heading">Error !</h3>
                            <p style="font-size: 25px;color: rgb(114, 121, 121);font-family: 'Poppins', sans-serif;">ไม่สามารถบันทึกข้อมูลได้ กรุณากรอกข้อมูลให้ครบถ้วน </p>
                            <hr>
                            <p class="d-flex justify-content-end">
                                    <a class="btn btn-lg btn-outline-success" href="http://localhost:3000/forAdmin" role="button">ตกลง</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="line"></div>
            </body>
            
            </html>
            `)
                })
            }).catch((error) => {
                console.log(error); //Exepection error....
            })


        }
    } else {
        res.redirect('/login')
    }
})

app.post('/rewardedit/:id', (req, res) => {
    if (req.session.displayName) {
        let id = req.params.id
        console.log(id)
        Reward.find({ Reward_ID: req.params.id }, (err, dataReaward) => {
            if (err) console.log(err)
        }).then((dataReward) => {
            res.render('admin_RewardEdit.hbs', {
                dataReward: encodeURI(JSON.stringify(dataReward))
            })
        })
    } else {
        res.redirect('/login')
    }

})

app.post('/saveEditReward', upload.single('photos'), function (req, res) {
    if (req.session.displayName) {
        if (req.file == undefined) {
            console.log('no file')
            Reward.findOne({ Reward_ID: req.body.Reward_ID }).then((data) => {
                data.Reward_Name = req.body.Reward_Name,
                    data.Reward_Point = req.body.Reward_Point,
                    data.Reward_Quantity = req.body.Reward_Quantity,
                    data.Reward_Status = req.body.Reward_Status

                data.save().then((success) => {
                    console.log('!! UPDATE data on REWARD success !!')
                    res.redirect('/editReward')
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
                    res.redirect('/editReward')
                }, (e) => {
                    res.status(400).send(e)
                }, (err) => {
                    res.status(400).send(err)
                })
            })
        }
    } else {
        res.redirect('/login')
    }

})

app.get('/displayReward/:id', function (req, res) {
    if (req.session.displayName) {
        let id = req.params.id

        Reward.find({ Reward_ID: id }, (err, dataReaward) => {
            if (err) console.log(err)
        }).then((dataReward) => {
            res.render('admin_RewardEdit.hbs', {
                dataReward: encodeURI(JSON.stringify(dataReward))
            })
        })

    } else {
        res.redirect('/login')
    }
})

// บันทึกข้อมูลการแลกของรางวัล
app.post('/saveRedeemReward', function (req, res) {
    if (req.session.displayName) {
        console.log(academic_year)
        let date_save = moment().format('DD-MM-YYYY')

        Reward.findOne({ Reward_ID: req.body.Reward_ID }).then((reward) => {
            let re_quantity = parseFloat(reward.Reward_Quantity)
            let re_point = parseFloat(reward.Reward_Point)
            let redeem_quantity = parseFloat(req.body.Member_RewardQuantity)


            reward.Reward_Quantity = re_point - redeem_quantity
            reward.save().then((success) => {
                console.log('@@@@ Save QUANTITY Reward success @@@@')

                // บันทึกข้อมูลคะแนนของสมาชิก
                Member.findOne({ Member_ID: req.body.Member_ID }).then((member) => {
                    let member_available_point = parseFloat(member.Member_Available)
                    member.Member_Available = member_available_point - (redeem_quantity * re_point)
                    console.log(member.Member_Available)
                    member.save().then((success) => {
                        console.log('@@@ Save Member AVAILABLE POINT Success @@@')


                        let newRedeemReward = new RedeemReward({
                            Reward_ID: req.body.Reward_ID,
                            Reward_Name: req.body.Reward_Name,
                            Reward_Point: req.body.Reward_Point,
                            Member_ID: req.body.Member_ID,
                            RedeemReward_Quantity: req.body.Member_RewardQuantity,
                            RedeemReward_Date: date_save,
                            RedeemReward_Admin: req.session.displayName,
                            RedeemReward_Year: academic_year
                        })

                        newRedeemReward.save().then((doc) => {
                            console.log('@@@@@@ Save data to REDEEM REWARD table Success')
                            res.redirect('/RedeemRewards')
                        }, (err) => {
                            //res.render('admin_error.hbs',{})
                            res.status(400).send(err)
                        })


                    }, (err) => {
                        res.status(400).send(err)
                    })


                })

            }, (e) => {
                res.status(400).send(e)
            }, (err) => {
                res.status(400).send(err)
            })
        })
    } else {
        res.redirect('/login')
    }
})
//================== Point ===================
// แสดงผลหน้า เพิ่มคะแนนรายบุคคล
app.post('/IncPointIndividual/:id', (req, res) => {
    if (req.session.displayName) {
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
    } else {
        res.redirect('/login')
    }
})

// แสดงผลหน้า เพิ่มคะแนนรายกลุ่ม
app.post('/IncPointGroup/:id', (req, res) => {
    if (req.session.displayName) {
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
    } else {
        res.redirect('/login')
    }
})
// แสดงผลหน้า ลบคะแนนรายบุคคล
app.post('/DecPointIndividual/:id', (req, res) => {
    if (req.session.displayName) {
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
    } else {
        res.redirect('/login')
    }
})

// แสดงผลหน้า ลบคะแนนรายกลุ่ม
app.post('/DecPointGroup/:id', (req, res) => {
    if (req.session.displayName) {
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

                res.render('admin_Point_DecByGroup.hbs', {
                    data: encodeURI(JSON.stringify(data))
                })
            }, (err) => {
                res.status(400).send(err)
            })
        })
    } else {
        res.redirect('/login')
    }
})

// save คะแนนรายบุคคล
app.post('/IncEventIndividual', (req, res) => {
    if (req.session.displayName) {
        let date_save = moment().format('DD-MM-YYYY');
        let name = req.session.displayName
        let newJoinEvent = new JoinEvent({
            Member_ID: req.body.Member_ID,
            OpenEvent_ID: req.body.OpenEvent_ID,
            OpenEvent_Name: req.body.OpenEvent_Name,
            OpenEvent_Point: req.body.OpenEvent_Point,
            JoinEvent_Date: date_save,
            JoinEvent_Admin: req.session.displayName,
            JoinEvent_Year: academic_year
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

                        House.findOne({ House_MemberID: id }).then((house) => {
                            let house_member_point = parseFloat(house.House_MemberPoint)
                            let point = parseFloat(req.body.OpenEvent_Point)
                            house.House_MemberPoint = house_member_point + point;

                            house.save().then((success) => {
                                console.log('@@@@ Update POINT in House table @@@@')
                                res.redirect('/IncreasePoint')

                            })
                        }, (e) => {
                            res.status(400).send(e)
                        }, (err) => {
                            res.status(400).send(err)
                        })
                    })
            })

        }, (err) => {
            res.status(400).send(err)
        })
    } else {
        res.redirect('/login')
    }


})
// ลบคะแนนรายบุุคล
app.post('/DecBehaviorIndividual', (req, res) => {
    if (req.session.displayName) {
        let date_save = moment().format('DD-MM-YYYY');
        let newJoinBehavior = new JoinBehavior({

            Member_ID: req.body.Member_ID,
            Behavior_ID: req.body.Behavior_ID,
            Behavior_Point: req.body.Behavior_Point,
            JoinBehavior_Date: date_save,
            Behavior_Name: req.body.Behavior_Name,
            JoinBehavior_Admin: req.session.displayName,
            JoinBehavior_Year: academic_year

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

                        House.findOne({ House_MemberID: id }).then((house) => {
                            let house_member_point = parseFloat(house.House_MemberPoint)
                            let point = parseFloat(req.body.Behavior_Point)
                            house.House_MemberPoint = house_member_point - point;

                            house.save().then((success) => {
                                console.log('@@@@ Update POINT in House table @@@@')
                                res.redirect('/DecreasePoint')

                            })
                        }, (e) => {
                            res.status(400).send(e)
                        }, (err) => {
                            res.status(400).send(err)
                        })

                    })
            })
        }, (err) => {
            res.status(400).send(err)
        })
    } else {
        res.redirect('/login')
    }
})
// เพิ่มคะแนนรายกลุ่ม
app.post('/savePointByGroup', function (req, res) {
    let date_save = moment().format('DD-MM-YYYY');
    let name = req.session.displayName
    let id = req.body.id
    //console.log(id)
    if (req.session.displayName) {

        let newJoinEvent2 = new JoinEvent({
            Member_ID: req.body.id,
            OpenEvent_ID: req.body.id_event,
            OpenEvent_Point: req.body.point_event,
            OpenEvent_Name: req.body.event_name,
            JoinEvent_Date: date_save,
            JoinEvent_Admin: req.session.displayName,
            JoinEvent_Year: academic_year
        })


        newJoinEvent2.save().then((doc) => {
            console.log('@@@@ save DATA in JOIN EVENT @@@@')

            Member.findOne({ Member_ID: id }).then((d2) => {
                let total = parseFloat(d2.Member_Total)
                let available = parseFloat(d2.Member_Available)
                let eventpoint = parseFloat(req.body.point_event)
                console.log(d2.Member_Total)
                d2.Member_Total = total + eventpoint,
                    d2.Member_Available = available + eventpoint,
                    d2.save().then((success) => {
                        console.log(d2.Member_Total)
                        console.log(' **** Success to save Member_Point ****')


                        House.findOne({ House_MemberID: id }).then((house) => {
                            let house_member_point = parseFloat(house.House_MemberPoint)
                            let point = parseFloat(req.body.point_event)
                            house.House_MemberPoint = house_member_point + point;

                            house.save().then((success) => {
                                console.log('@@@@ Update POINT in House table @@@@')
                                res.redirect('/IncreasePoint')
                            })
                        }, (e) => {
                            res.status(400).send(e)
                        }, (err) => {
                            res.status(400).send(err)
                        })
                    })
            })
        }, (err) => {
            res.status(400).send(err)
        })
    } else {
        res.redirect('/login')
    }
})
// ลบคะแนนรายกลุ่ม
app.post('/saveDecPointGroup', function (req, res) {
    let date_save = moment().format('DD-MM-YYYY');
    let name = req.session.displayName
    let id = req.body.id
    //console.log(id)
    if (req.session.displayName) {
        let date_save = moment().format('DD-MM-YYYY');
        let newJoinBehavior = new JoinBehavior({
            Member_ID: id,
            Behavior_ID: req.body.id_behavior,
            Behavior_Point: req.body.point_behavior,
            JoinBehavior_Date: date_save,
            Behavior_Name: req.body.behavior_name,
            JoinBehavior_Admin: req.session.displayName,
            JoinBehavior_Year: academic_year

        })

        newJoinBehavior.save().then((doc) => {
            console.log('!!! JOIN BEHAVIOR save success !!!')

            //console.log(id)
            Member.findOne({ Member_ID: id }).then((d2) => {
                let total = parseFloat(d2.Member_Total)
                let available = parseFloat(d2.Member_Available)
                let eventpoint = parseFloat(req.body.point_behavior)

                console.log(d2.Member_Total)
                d2.Member_Total = total - eventpoint,
                    d2.Member_Available = available - eventpoint,
                    d2.save().then((success) => {
                        console.log(' **** Success to ลบ Member_Point ****')

                        House.findOne({ House_MemberID: id }).then((house) => {
                            let house_member_point = parseFloat(house.House_MemberPoint)
                            let point = parseFloat(req.body.point_behavior)
                            house.House_MemberPoint = house_member_point - point;

                            house.save().then((success) => {
                                console.log('@@@@ Update POINT in House table @@@@')
                                res.redirect('/DecreasePoint')

                            })
                        }, (e) => {
                            res.status(400).send(e)
                        }, (err) => {
                            res.status(400).send(err)
                        })
                    })
            })
        }, (err) => {
            res.status(400).send(err)
        })

    } else {
        res.redirect('/login')
    }
})

// ============== Year ========================
app.post('/saveYear', function (req, res) {
    if (req.session.displayName) {
        let newYear = new Year({
            Year_Year: req.body.Year_Year,
            Year_StartDate: req.body.Year_StartDate,
            Year_EndDate: req.body.Year_EndDate,
            Year_StartTime: req.body.Year_StartTime,
            Year_EndTime: req.body.Year_EndTime,
        })

        newYear.save().then((doc) => {
            console.log('@@@@ save YEAR data success @@@@')
            res.redirect('/getYear')
        }, (err) => {
            res.status(400).send(err)
        })
    } else {
        res.redirect('/login')
    }

})

// ============== Report =============

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
// ข้อมูลกิจกรรมที่เปิด
app.get('/send_OpenEvent', function (req, res, next) {
    OpenEvent.find({}).exec(function (error, openevent) {
        if (error) {
            res.send(error);
        } else {
            res.json(openevent);
        }
    });
})
// ข้อมูลของรางวัล
app.get('/send_Reward', function (req, res, next) {
    Reward.find({}).exec(function (error, reward) {
        if (error) {
            res.send(error);
        } else {
            res.json(reward);
        }
    });
})
// ข้อมูลคะแนนของแต่ละบ้าน
app.get('/send_House', function (req, res, next) {
    House.find({}).exec(function (error, house) {
        if (error) {
            res.send(error);
        } else {
            res.json(house);
        }
    });
})
//ข้อมูล ประวัติการแลกของรางวัล
app.get('/send_RedeemReward', function (req, res, next) {
    RedeemReward.find({}).exec(function (error, redeemreward) {
        if (error) {
            res.send(error);
        } else {
            res.json(redeemreward);
        }
    });
})

// ข้อมูลพฤติกรรม
app.get('/send_Behavior', function (req, res, next) {
    Behavior.find({}).exec(function (error, Behavior) {
        if (error) {
            res.send(error);
        } else {
            res.json(Behavior);
        }
    });
})

// ข้อมูลการเข้าร่วมกิจกรรมของนักศึกษา (Join Event)
app.get('/send_JoinEvent', function (req, res, next) {
    JoinEvent.find({}).exec(function (error, JoinEvent) {
        if (error) {
            res.send(error);
        } else {
            res.json(JoinEvent);
        }
    });
})

// ข้อมูลการทำผิด (Join  Behavior)
app.get('/send_BehaviorHistory', function (req, res, next) {
    JoinBehavior.find({}).exec(function (error, JoinBehavior) {
        if (error) {
            res.send(error);
        } else {
            res.json(Joi)
        }
    })
})

// ###################### register ######################
app.get('/register', function (req, res, next) {
    res.render('register.hbs', {})
})

app.post('/admin/register', function (req, res) {

    // res.render('admin_Admin.hbs', {
    //     data : encodeURI(JSON.stringify(name))
    // })
    let newAdmin = new Admin({
        Admin_Name: req.body.Admin_Name,
        Admin_Surname: req.body.Admin_Surname,
        Admin_Username: req.body.Admin_Username,
        Admin_Password: req.body.Admin_Password
    })
    newAdmin.save().then((doc) => {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
            
                <title>Success</title>
            
                <!-- Bootstrap CSS CDN -->
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4"
                    crossorigin="anonymous">
                <style>
                    @import "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700";
                    h4 {
                        color: crimson;
                    }
            
                    p {
                        font-family: 'Poppins', sans-serif;
                        font-size: 1.1em;
                        font-weight: 300;
                        line-height: 1.7em;
                        color: #999;
                    }
                </style>
            </head>
            <body>
                <div class="container d-flex justify-content-center align-items-center">
                    <div class="row mt-5 ">
            
                        <div class="alert alert-success" role="alert">
                            <h3 class="alert-heading">Succes !</h3>
                            <p style="font-size: 25px;color: rgb(114, 121, 121);font-family: 'Poppins', sans-serif;">บันทึกข้อมูล Admin ลงฐานข้อมูลสำเร็จ </p>
                            <hr>
                            <p class="d-flex justify-content-end">
                                    <a class="btn btn-lg btn-outline-success" href="http://localhost:3000/forAdmin" role="button">ตกลง</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="line"></div>
            </body>
            
            </html>
            `)
    }, (err) => {
        //res.render('admin_error.hbs',{})
        res.status(400).send(err)
    })

})

