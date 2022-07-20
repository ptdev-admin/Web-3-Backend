require('dotenv').config({path: './config.env'})
const express = require('express')
const cors = require('cors')
const { Db } = require('mongodb')
const bodyParser = require('body-parser')

const app = express()
const dbo = require('./db')
const router = express.Router()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
router.use(cors())
router.options('*', cors())



//api endpoint to create a new user with username and password
router.route('/users').post((req, res) => {
    const dbConnect = dbo.getDb();
    const userDocument = {$setOnInsert: {
        user: req.body.user,
        name: req.body.name,
        pswd: req.body.pswd,
        email: req.body.email,
        country: req.body.country,
        referral: req.body.referral
    }}
    dbConnect.collection("users").updateOne({user: req.body.user}, userDocument, {upsert: true}, (err, result) => {
        if (err) {
            res.status(400).send("Error inserting user")
        } else {
            console.log(`Added a new user: ${userDocument.user}`)
            res.status(204).send("new user added")
        }
    });   
});

//api endpoint to get all users
router.route('/users').get((req, res) => {
    const dbConnect = dbo.getDb();
    dbConnect.collection("users").find({}).toArray().then(userCol => res.send(userCol))
});

//api endpoint to delete all user data
router.route('/users').delete((req, res) => {
    const dbConnect = dbo.getDb()
	dbConnect.collection("users").remove({})
    res.send('deleted all')
})



//api endpoint for team selected in head to head
router.route('/teampicks').put((req, res) => {
    const dbConnect = dbo.getDb();
    const updatePicks = {
        $set: {
            user: req.body.user,
            teampicks: req.body.teampicks
        },
    }
    dbConnect.collection("teampicks").updateOne({user: req.body.user}, updatePicks, {upsert: true}, (err, result) => {
        if (err) {
            res.status(400).send("Error retrieving user selection");
        } else {
            console.log(`${picks.user} selected ${picks.teampicks}`)
            res.status(204).send("user selection added");
        }
    })
})

//api endpoint to get all team picks
router.route('/teampicks').get((req, res) => {
    const dbConnect = dbo.getDb();
    dbConnect.collection("teampicks").find({}).toArray().then(pickCol => res.send(pickCol))
});

//api endpoint to delete all pick data
router.route('/teampicks').delete((req, res) => {
    const dbConnect = dbo.getDb()
	dbConnect.collection("teampicks").remove({})
    res.send('deleted all')
})



app.use(router);

//global error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke.')
    process.exit();
})

//connect to our database
dbo.connectToServer((err) => {
    if(err){
        console.error(err);
        process.exit();
    }
})

//takes in a port and error function
const port = process.env.PORT
app.listen(port, err => {
    if(err) console.error(err)
    console.log("Listening on PORT:", port)
})