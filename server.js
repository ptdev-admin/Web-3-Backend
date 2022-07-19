//require statements
require('dotenv').config({path: './config.env'});
const express = require('express');
const { Db } = require('mongodb');
const bodyParser = require('body-parser');

//create the app and PORT
const app = express();
const PORT = 3001;

//get MongoDB driver connection
const dbo = require('./db');

//create an express router
const router = express.Router();

//middleware items
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



//api endpoint to create a new user
router.route('/new-user').post((req, res) => {
    //get the database
    const dbConnect = dbo.getDb();
    //this is a "row" in our database
    const userDocument = {
        user: req.body.user
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
    //res.send(dbConnect.collection("users"))
    res.send('user get check')
});



//api endpoint for team selected in head to head
router.route('/user-teampicks').post((req, res) => {
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
app.listen(PORT, err => {
    if(err) console.error(err)
    console.log("Listening on PORT:", PORT)
})