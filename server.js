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



///// USERS /////

//api endpoint to create a new user with username and password
router.route('/users').post((req, res) => {
    const dbConnect = dbo.getDb();
    const userDocument = {$setOnInsert: {
        user: req.body.user,
        name: req.body.name,
        pswd: req.body.pswd,
        email: req.body.email,
        country: req.body.country,
        state: req.body.state,
        referral: req.body.referral,
        points: 0
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

//api endpoint to update a user's points based on their picks
router.route('/users').put((req, res) => {
    const dbConnect = dbo.getDb()
    const incPoints = {
        $inc: {
            points: req.body.points
        }
    }
    dbConnect.collection("users").updateOne({user: req.body.user}, incPoints, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send("User pick points added: " + req.body.points);
        }
    })
})

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



///// TEAM PICKS /////

//api endpoint for team selected in head to head
router.route('/teampicks').put((req, res) => {
    const dbConnect = dbo.getDb();
    const updatePicks = {
        $set: {
            user: req.body.user,
            teampicks: req.body.teampicks,
            time: req.body.time
        },
    }
    dbConnect.collection("teampicks").updateOne({user: req.body.user}, updatePicks, {upsert: true}, (err, result) => {
        if (err) {
            res.send("Error retrieving user selection");
        } else {
            res.send("User selection added");
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



///// PLAYER IDS /////

//api endpoint for storing player ids
router.route('/player-ids').put((req, res) => {
    const dbConnect = dbo.getDb();
    const updatePicks = {
        $set: {
            id: 'official',
            ids: req.body.ids
        },
    }
    dbConnect.collection("player-ids").updateOne({id: 'official'}, updatePicks, {upsert: true}, (err, result) => {
        if (err) {
            res.send("Error updating player ids");
        } else {
            res.send("Player ids added");
        }
    })
})

//api endpoint to get all player ids
router.route('/player-ids').get((req, res) => {
    const dbConnect = dbo.getDb();
    dbConnect.collection("player-ids").find({}).toArray().then(pickCol => res.send(pickCol))
});

//api endpoint to delete all player ids
router.route('/player-ids').delete((req, res) => {
    const dbConnect = dbo.getDb()
	dbConnect.collection("player-ids").remove({})
    res.send('deleted all')
})



///// TEAM ROSTERS /////

//api endpoint for storing team rosters
router.route('/rosters').put((req, res) => {
    const dbConnect = dbo.getDb();
    const updateRoster = {
        $set: {
            team: req.body.team,
            roster: req.body.rost
        },
    }
    dbConnect.collection("rosters").updateOne({team: req.body.team}, updateRoster, {upsert: true}, (err, result) => {
        if (err) {
            res.send("Error updating rosters");
        } else {
            res.send("Rosters added");
        }
    })
})

//api endpoint to get all team rosters
router.route('/rosters').get((req, res) => {
    const dbConnect = dbo.getDb();
    dbConnect.collection("rosters").find({}).toArray().then(pickCol => res.send(pickCol))
});

//api endpoint to delete all team rosters
router.route('/rosters').delete((req, res) => {
    const dbConnect = dbo.getDb()
	dbConnect.collection("rosters").remove({})
    res.send('deleted all')
})



///// HEAD TO HEAD CHAT /////

//api endpoint to create a new chat message head to head
router.route('/chat-hth').post((req, res) => {
    const dbConnect = dbo.getDb();
    const chatDocument = {
        user: req.body.user,
        msg: req.body.msg,
    }
    dbConnect.collection("chat-hth").insert(chatDocument, (err, result) => {
        if (err) {
            res.status(400).send("Error inserting chat msg")
        } else {
            console.log(`Added a new msg: ${chatDocument.msg}`)
            res.status(204).send("new msg added to chat")
        }
    });   
});

//api endpoint to get all chats head to head
router.route('/chat-hth').get((req, res) => {
    const dbConnect = dbo.getDb();
    dbConnect.collection("chat-hth").find({}).toArray().then(hthCol => res.send(hthCol))
});

//api endpoint to delete all chats head to head
router.route('/chat-hth').delete((req, res) => {
    const dbConnect = dbo.getDb()
	dbConnect.collection("chat-hth").remove({})
    res.send('deleted all')
})



///// STAT VS STAT CHAT /////

//api endpoint to create a new chat message stat vs stat
router.route('/chat-svs').post((req, res) => {
    const dbConnect = dbo.getDb();
    const chatDocument = {
        user: req.body.user,
        msg: req.body.msg,
    }
    dbConnect.collection("chat-svs").insert(chatDocument, (err, result) => {
        if (err) {
            res.status(400).send("Error inserting chat msg")
        } else {
            console.log(`Added a new msg: ${chatDocument.msg}`)
            res.status(204).send("new msg added to chat")
        }
    });   
});

//api endpoint to get all chats stat vs stat
router.route('/chat-svs').get((req, res) => {
    const dbConnect = dbo.getDb();
    dbConnect.collection("chat-svs").find({}).toArray().then(hthCol => res.send(hthCol))
});

//api endpoint to delete all chats stat vs stat
router.route('/chat-svs').delete((req, res) => {
    const dbConnect = dbo.getDb()
	dbConnect.collection("chat-svs").remove({})
    res.send('deleted all')
})



///// LEADERBOARD CHAT /////

//api endpoint to create a new chat message leaderboard
router.route('/chat-leader').post((req, res) => {
    const dbConnect = dbo.getDb();
    const chatDocument = {
        user: req.body.user,
        msg: req.body.msg,
    }
    dbConnect.collection("chat-leader").insert(chatDocument, (err, result) => {
        if (err) {
            res.status(400).send("Error inserting chat msg")
        } else {
            console.log(`Added a new msg: ${chatDocument.msg}`)
            res.status(204).send("new msg added to chat")
        }
    });   
});

//api endpoint to get all chats leaderboard
router.route('/chat-leader').get((req, res) => {
    const dbConnect = dbo.getDb();
    dbConnect.collection("chat-leader").find({}).toArray().then(hthCol => res.send(hthCol))
});

//api endpoint to delete all chats leaderboard
router.route('/chat-leader').delete((req, res) => {
    const dbConnect = dbo.getDb()
	dbConnect.collection("chat-leader").remove({})
    res.send('deleted all')
})



///// PLAYER PAGE CHAT /////

//api endpoint to create a new chat message player page
router.route('/chat-player').post((req, res) => {
    const dbConnect = dbo.getDb();
    const chatDocument = {
        user: req.body.user,
        msg: req.body.msg,
    }
    dbConnect.collection("chat-player").insert(chatDocument, (err, result) => {
        if (err) {
            res.status(400).send("Error inserting chat msg")
        } else {
            console.log(`Added a new msg: ${chatDocument.msg}`)
            res.status(204).send("new msg added to chat")
        }
    });   
});

//api endpoint to get all chats player page
router.route('/chat-player').get((req, res) => {
    const dbConnect = dbo.getDb();
    dbConnect.collection("chat-player").find({}).toArray().then(hthCol => res.send(hthCol))
});

//api endpoint to delete all chats player page
router.route('/chat-player').delete((req, res) => {
    const dbConnect = dbo.getDb()
	dbConnect.collection("chat-player").remove({})
    res.send('deleted all')
})



///// TEAM PAGE CHAT /////

//api endpoint to create a new chat message team page
router.route('/chat-team').post((req, res) => {
    const dbConnect = dbo.getDb();
    const chatDocument = {
        user: req.body.user,
        msg: req.body.msg,
    }
    dbConnect.collection("chat-team").insert(chatDocument, (err, result) => {
        if (err) {
            res.status(400).send("Error inserting chat msg")
        } else {
            console.log(`Added a new msg: ${chatDocument.msg}`)
            res.status(204).send("new msg added to chat")
        }
    });   
});

//api endpoint to get all chats team page
router.route('/chat-team').get((req, res) => {
    const dbConnect = dbo.getDb();
    dbConnect.collection("chat-team").find({}).toArray().then(hthCol => res.send(hthCol))
});

//api endpoint to delete all chats team page
router.route('/chat-team').delete((req, res) => {
    const dbConnect = dbo.getDb()
	dbConnect.collection("chat-team").remove({})
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