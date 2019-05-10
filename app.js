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
var Admin = require('./Model/AdminModel')

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
// session
 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))
// ================ API Get ================
// 1 Admin
app.get('/forAdmin',(req,res)=>{
    let name =  req.session.displayName
    if(req.session.displayName){
        res.render('admin_Admin.hbs', {
            data : encodeURI(JSON.stringify(name))
        })
    }else{
        res.redirect('/login')
    }
})

// 2 Alumni 
app.get('/Alumni',(req,res)=>{
    let name =  req.session.displayName
    if(req.session.displayName){
        res.render('admin_Alumni.hbs', {
            data : encodeURI(JSON.stringify(name))
        })
    }else{
        res.redirect('/login')
    }
})

// 3  Behavior_All
app.get('/EditBehavior', (req, res) => {
    let name =  req.session.displayName
    if(req.session.displayName){
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
    }else{
        res.redirect('/login')
    }
})

//4 admin_BehaviorContent
app.get('/BehaviorContent', (req, res) => {
    let name =  req.session.displayName
    if(req.session.displayName){
        res.render('admin_BehaviorContent.hbs', {
            data : encodeURI(JSON.stringify(name))
        })
    }else{
        res.redirect('/login')
    }
})

//5 admin_BehaviorEdit
app.post('/behavior/:id', (req, res) => {
    let id = req.params.id
    let name =  req.session.displayName
    if(req.session.displayName){
        Behavior.find({ Behavior_ID: id }, (err, data) => {
            if (err) console.log(err)
        }).then((data) => {
            res.render('admin_BehaviorEdit.hbs', {
                dataBehavior: encodeURI(JSON.stringify(data))
            })
        })
    }else{
        res.redirect('/login')
    }
})
//6 admin_CreatedByDisplay
app.get('/CreatedByDisplay', (req, res) => {
    let name =  req.session.displayName
    if(req.session.displayName){
        CreatedBy.find({}, (err, data) => {
            if (err) console.log(err)
        }).then((dataCB) => {
            res.render('admin_CreatedByDisplay.hbs', {
                dataCB: encodeURI(JSON.stringify(dataCB))
            })
        })
    }else{
        res.redirect('/login')
    }
})
// 7 admin_CreatedByInsert
app.get('/CreatedByInsert', (req, res) => {
    let name =  req.session.displayName
    if(req.session.displayName){
        res.render('admin_CreatedByInsert.hbs', {})
    }else{
        res.redirect('/login')
    }
})

//8 admin_error
app.get('/error', (req, res) => {
    let name =  req.session.displayName
    if(req.session.displayName){
        res.render('admin_error.hbs', {
            data : encodeURI(JSON.stringify(name))
        })
    }else{
        res.redirect('/login')
    }
})

//9 admin_errorTel NO
//10 admin_EventAll
app.get('/AllEvent', (req, res) => {
    let data = {}
    let name =  req.session.displayName
    if(req.session.displayName){
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
    }else{
        res.redirect('/login')
    }
})

//11 admin_EventCard
app.get('/SeeMoreEvent', (req, res) => {
    let data = {}
    let name =  req.session.displayName
    if(req.session.displayName){
        OpenEvent.find({}, (err, dataEvent) => {
            if (err) console.log(err)
        }).then((dataEvent) => {
            data.dataEvent = dataEvent
            data.name = name
            res.render('admin_EventCard.hbs', {
                dataEvent: encodeURI(JSON.stringify(dataEvent))
            })
        })
    }else{
        res.redirect('/login')
    }
})

//12 admin_EventContent
app.get('/EventContent', (req, res) => {
    let data = {}
    let name =  req.session.displayName
    if(req.session.displayName){
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
    }else{
        res.redirect('/login')
    }
})

//13 admin_EventEdit.hbs
//14 admin_EventOpen.hbs
//15 admin_EventTypeDisplay.hbs
app.get('/EventTypeDisplay', (req, res) => {
    let name =  req.session.displayName
    if(req.session.displayName){
        EventType.find({}, (err, data) => {
            if (err) console.log(err)
        }).then((dataEV) => {
            res.render('admin_EventTypeDisplay.hbs', {
                dataEV: encodeURI(JSON.stringify(dataEV))
            })
        })
    }else{
        res.redirect('/login')
    }
})

//16 admin_EventTypeInsert.hbs
app.get('/EventTypeInsert', (req, res) => {
    let name =  req.session.displayName
    if(req.session.displayName){
        res.render('admin_EventTypeInsert.hbs', {})
    }else{
        res.redirect('/login')
    }
})

//17 admin_HouseBill.hbs
app.get('/Bill', (req, res) => {
    let bill = 'Bill Gates'
    let name =  req.session.displayName
    if(req.session.displayName){
        Member.find({ Member_House: bill }, (err, dataHouse) => {
            if (err) console.log(err)
        }).then((dataHouse) => {
            res.render('admin_HouseBill.hbs', {
                dataHouse: encodeURI(JSON.stringify(dataHouse))
            })
        })
    }else{
        res.redirect('/login')
    }
})

//18 admin_HouseLarry.hbs
app.get('/Larry', (req, res) => {
    let larry = 'Larry Page'
    let name =  req.session.displayName
    if(req.session.displayName){
        Member.find({ Member_House: larry }, (err, dataHouse) => {
            if (err) console.log(err)
        }).then((dataHouse) => {
            res.render('admin_HouseLarry.hbs', {
                dataHouse: encodeURI(JSON.stringify(dataHouse))
            })
        })
    }else{
        res.redirect('/login')
    }  
})

//19 admin_HouseElon.hbs
app.get('/Elon', (req, res) => {
    let elon = 'Elon Mask'
    let name =  req.session.displayName
    if(req.session.displayName){
        Member.find({ Member_House: elon }, (err, dataHouse) => {
            if (err) console.log(err)
        }).then((dataHouse) => {
            res.render('admin_HouseElon.hbs', {
                dataHouse: encodeURI(JSON.stringify(dataHouse))
            })
        })
    }else{
        res.redirect('/login')
    }   
})

//20 admin_HouseMark.hbs
app.get('/Mark', (req, res) => {
    let mark = 'Mark Zuckerberg'
    let name =  req.session.displayName
    if(req.session.displayName){
        Member.find({ Member_House: mark }, (err, dataHouse) => {
            if (err) console.log(err)
        }).then((dataHouse) => {
            res.render('admin_HouseMark.hbs', {
                dataHouse: encodeURI(JSON.stringify(dataHouse))
            })
        })
    }else{
        res.redirect('/login')
    } 
})

//21 admin_Login
//22 admin_Main.hbs
app.get('/Main', (req, res) => {
    let name =  req.session.displayName
    if(req.session.displayName){
        res.render('admin_Main.hbs', {
            data : encodeURI(JSON.stringify(name))
        })
    }else{
        res.redirect('/login')
    }
})

//23 admin_MemberAll.hbs
app.get('/MemberAll', (req, res) => {
    let name =  req.session.displayName
    if(req.session.displayName){
        Member.find({}, (err, dataMember) => {
            if (err) console.log(err)
        }).then((dataMember) => {
            res.render('admin_MemberAll.hbs', {
                dataMember: encodeURI(JSON.stringify(dataMember))
            })
        })
    }else{
        res.redirect('/login')
    }
})

//24 MemberEdit
//25 admin_MemberInsert.hbs
app.get('/MemberInsert', (req, res) => {
    let name =  req.session.displayName
    if(req.session.displayName){
        res.render('admin_MemberInsert.hbs', {})
    }else{
        res.redirect('/login')
    }
})

// 26 admin_Point_Dec.hbs
app.get('/DecreasePoint', (req, res) => {
    let name =  req.session.displayName
    if(req.session.displayName){
        Behavior.find({}, (err, dataBehavior) => {
            if (err) console.log(err)
        }).then((dataBehavior) => {
            res.render('admin_Point_Dec.hbs', {
                dataBehavior: encodeURI(JSON.stringify(dataBehavior))
            })
        }, (err) => {
            res.status(400).send(err)
        })
    }else{
        res.redirect('/login')
    }
})

//27 admin_Point_Inc.hbs
app.get('/IncreasePoint', (req, res) => {
    let name =  req.session.displayName
    if(req.session.displayName){
        OpenEvent.find({}, (err, dataOpenEvent) => {
            if (err) console.log(err)
        }).then((dataOpenEvent) => {
            res.render('admin_Point_Inc.hbs', {
                dataOpenEvent: encodeURI(JSON.stringify(dataOpenEvent))
            })
        }, (err) => {
            res.status(400).send(err)
        })
    }else{
        res.redirect('/login')
    }
})

//28 admin_Point_IncByGroup.hbs
//29 admin_Point_IncByIndi.hbs
//30 dmin_Report.hbs
app.get('/getReport',(req,res)=>{
    let name =  req.session.displayName
    if(req.session.displayName){
        res.render('admin_Report.hbs',{})
    }else{
        res.redirect('/login')
    }
})

//31 admin_RewardAll.hbs
app.get('/editReward', (req, res) => {
    let name =  req.session.displayName
    if(req.session.displayName){
        Reward.find({}, (err, dataReaward) => {
            if (err) console.log(err)
        }).then((dataReward) => {
            res.render('admin_RewardAll.hbs', {
                dataReward: encodeURI(JSON.stringify(dataReward))
            })
        }, (err) => {
            res.status(400).send(err)
        })
    }else{
        res.redirect('/login')
    }
})

//32 admin_RewardContent.hbs
app.get('/rewardContent', (req, res) => {
    let name =  req.session.displayName
    if(req.session.displayName){
        res.render('admin_RewardContent.hbs', {})
    }else{
        res.redirect('/login')
    }
    //console.log('hello')
})

//33 admin_RewardEdit.hbs
//34 admin_Year.hbs
app.get('/getYear',(req,res)=>{
    let name =  req.session.displayName
    if(req.session.displayName){
        res.render('admin_Year.hbs',{})
    }else{
        res.redirect('/login')
    }
})

// ****************************************************************************************
// ====================== API Post =============================
app.post('/admin/save',function (req,res){
    let name =  req.session.displayName
    if(req.session.displayName){
        // res.render('admin_Admin.hbs', {
        //     data : encodeURI(JSON.stringify(name))
        // })
        let newAdmin = new Admin({
            Admin_Name : req.body.Admin_Name ,
            Admin_Surname: req.body.Admin_Surname ,
            Admin_Username: req.body.Admin_Username ,
            Admin_Password: req.body.Admin_Password 
        })
        newAdmin.save().then((doc)=>{
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
        },(err) => {
            //res.render('admin_error.hbs',{})
            res.status(400).send(err)
        })
    }else{
        res.redirect('/login')
    }
    
    
})

// ================= Login/Logout ============
app.get('/login',(req,res)=>{
    res.render('admin_Login.hbs',{})
})

app.post('/login/admin',function(req,res){
    let username = req.body.Username
    let password = req.body.Password
    let admin_error = ` <!DOCTYPE html>
    <html lang="en">  
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>ระบบจัดการคะแนนและกลุ่มบ้าน</title>
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
        Admin_Username:username,
        Admin_Password:password
    }).then((admin)=>{
        if(admin.length == 1){ //เจอข้อมูล 1 คน 
            //console.log(admin[0].Admin_Name)
            req.session.displayName = admin[0].Admin_Name
  
            res.redirect('/Main')
            console.log('login success')
        }else if(admin.length == 0){
            res.send(admin_error)
        }
    },(err)=>{
        res.send(400).send(err)
    })
})

app.get('/logout',function (req,res){
    delete req.session.displayName
    res.redirect('/login')
})

// ========================= Member ====================================
// ==================== save data and upload photo =====================
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
                    Member_Available: point,
                    Member_Admin:req.session.displayName
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
            res.redirect('/MemberAll')
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
            res.redirect('/MemberAll')
        }, (e) => {
            res.status(400).send(e)
        }, (err) => {
            res.status(400).send(err)
        })
    })
})
// ============== Event Type ===================


app.post('/saveEventType', (req, res) => {
    let newEventType = new EventType({
        EventType_Name: req.body.EventType_Name,
    })
    newEventType.save().then((doc) => {
        res.redirect('/EventTypeInsert')
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


app.post('/saveCreatedBy', (req, res) => {
    let newCreatedBy = new CreatedBy({
        CreatedBy_Name: req.body.CreatedBy_Name
    })
    newCreatedBy.save().then((doc) => {
        console.log(doc)
        res.redirect('/CreatedByInsert')
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
            console.log('Succes to save data on ALL EVENT and OPEN EVENT')
            res.redirect('/EventContent')
            // EventType.find({}, (err, data) => {
            //     if (err) console.log(err)
            // }).then((dataEV) => {
            //     data.EventType = dataEV

            //     CreatedBy.find({}, (err, data) => {
            //         if (err) console.log(err)
            //     }).then((dataCB) => {
            //         data.CreatedBy = dataCB

            //         res.render('admin_EventContent.hbs', {
            //             data: encodeURI(JSON.stringify(data))
            //         })
            //     })
            // })
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
            console.log('Succes to save data on ALL EVENT and OPEN EVENT')
            res.redirect('/EventContent')
        }, (err) => {
            //res.render('admin_error.hbs',{})
            res.status(400).send(err)
        })
    }
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

                Year.find({},(err,data)=>{
                    if (err) console.log(err)
                }).then((year)=>{
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
                res.redirect('/AllEvent')
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
        console.log('!! Success to save BEHAVIOR data !!')
        res.redirect('/BehaviorContent')
    }, (err) => {
        res.status(400).send(err)
    })
})



// app.post('/behavior/:id', (req, res) => {
//     let id = req.params.id
//     Behavior.find({ Behavior_ID: id }, (err, data) => {
//         if (err) console.log(err)
//     }).then((data) => {
//         res.render('admin_BehaviorEdit.hbs', {
//             dataBehavior: encodeURI(JSON.stringify(data))
//         })
//     })
// })

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
})

//================== Point ===================

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
                    res.redirect('/IncreasePoint')
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
                    res.redirect('/DecreasePoint')
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
app.post('/saveYear', function (req,res){
    let newYear = new Year({
        Year_Year : req.body.Year_Year,
        Year_StartDate : req.body.Year_StartDate,
        Year_EndDate : req.body.Year_EndDate,
    })

    newYear.save().then((doc)=>{
        console.log('@@@@ save YEAR data success @@@@')
        res.redirect('/getYear')
    },(err)=>{
        res.status(400).send(err)
    })
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

