//require statements
require('dotenv').config({path: './config.env'});
const express = require('express');
const { Db } = require('mongodb');
const bodyParser = require('body-parser');

//create the app and PORT
const app = express();
//const PORT = 3001;

//get MongoDB driver connection
const dbo = require('./db');

//create an express router
const router = express.Router();

//middleware items
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



///// ENDPOINTS /////



//api endpoint to create a new user
router.route('/new-user').post((req, res) => {
    //get the database
    const dbConnect = dbo.getDb();
    //this is a "row" in our database
    const userDocument = {
        user: req.body.user,
        pswd: req.body.pswd
    };

    dbConnect
        .collection("users")
        //insert a row into the table
        .insertOne(userDocument, (err, result) => {
            if (err) {
                res.status(400).send("Error inserting user");
            } else {
                console.log(result);
                console.log(`Added a new user: ${userDocument.user}`)
                res.status(204).send();
            }
        });
});

//api endpoint to get users
router.route('/users').get((req, res) => {
    //get the database
    const dbConnect = dbo.getDb();
    dbConnect.collection("users").find({}).toArray().then(userCol => res.send(userCol))
});

//api endpoint to check if user exists
router.route('/check-user').get((req, res) => {
    //get the database
    const dbConnect = dbo.getDb();
    dbConnect.collection("users").find({user: req.body.user}).toArray().then(userCol => res.send(userCol))
});



//api endpoint for team selected in head to head
router.route('/new-teampicks').post((req, res) => {
    //get the database
    const dbConnect = dbo.getDb();
    //this is a "row" in our database
    const picks = {
        user: req.body.user,
        teampicks: req.body.teampicks
    };

    dbConnect
        .collection("teampicks")
        //insert a row into the table
        .insertOne(picks, (err, result) => {
            if (err) {
                res.status(400).send("Error retrieving user selection");
            } else {
                console.log(result);
                console.log(`${picks.user} selected ${picks.teampicks}`)
                res.status(204).send();
            }
        });
});

//api endpoint to get picks for a certain user
router.route('/user-teampicks').get((req, res) => {
    //get the database
    const dbConnect = dbo.getDb();
    dbConnect.collection("teampicks").find({user: req.body.user}).toArray().then(userCol => res.send(userCol))
});



///// ***** /////



//tell the app to use the router
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