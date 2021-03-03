//  __   __  ___        ___
// |__) /  \  |  |__/ |  |  
// |__) \__/  |  |  \ |  |  

// This is the main file for the blog-buddy bot.

// Import Botkit's core features
const { Botkit } = require('botkit');
const { BotkitCMSHelper } = require('botkit-plugin-cms');

// Import a platform-specific adapter for slack.

const { SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware } = require('botbuilder-adapter-slack');

const { MongoDbStorage } = require('botbuilder-storage-mongodb');

// Import sqlite3 module
const sqlite3 = require('sqlite3').verbose();

// Create new db obj
let db = new sqlite3.Database('/home/node/sqlite/blog.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the sqlite3 database.');
  });

// Load process.env values from .env file
require('dotenv').config();

let storage = null;
if (process.env.MONGO_URI) {
    storage = mongoStorage = new MongoDbStorage({
        url : process.env.MONGO_URI,
    });
}

const adapter = new SlackAdapter({
    // REMOVE THIS OPTION AFTER YOU HAVE CONFIGURED YOUR APP!
    //enable_incomplete: true,

    // parameters used to secure webhook endpoint
    verificationToken: process.env.VERIFICATION_TOKEN,
    clientSigningSecret: process.env.CLIENT_SIGNING_SECRET,  

    // auth token for a single-team app
    botToken: process.env.BOT_TOKEN,

    // credentials used to set up oauth for multi-team apps
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    scopes: ['bot'], 
    redirectUri: process.env.REDIRECT_URI,
 
    // functions required for retrieving team-specific info
    // for use in multi-team apps
    getTokenForTeam: getTokenForTeam,
    getBotUserByTeam: getBotUserByTeam,
});

// Use SlackEventMiddleware to emit events that match their original Slack event types.
adapter.use(new SlackEventMiddleware());

// Use SlackMessageType middleware to further classify messages as direct_message, direct_mention, or mention
adapter.use(new SlackMessageTypeMiddleware());

const controller = new Botkit({
    webhook_uri: '/api/messages',

    adapter: adapter,

    storage
});

if (process.env.CMS_URI) {
    controller.usePlugin(new BotkitCMSHelper({
        uri: process.env.CMS_URI,
        token: process.env.CMS_TOKEN,
    }));
}

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {

    // load traditional developer-created local custom feature modules
    controller.loadModules(__dirname + '/features');

    /* catch-all that uses the CMS to trigger dialogs */
    if (controller.plugins.cms) {
        controller.on('message,direct_message', async (bot, message) => {
            let results = false;
            results = await controller.plugins.cms.testTrigger(bot, message);

            if (results !== false) {
                // do not continue middleware!
                return false;
            }
        });
    }

});



controller.webserver.get('/', (req, res) => {

    res.send(`This app is running Botkit ${ controller.version }.`);

});


controller.webserver.get('/install', (req, res) => {
    // getInstallLink points to slack's oauth endpoint and includes clientId and scopes
    res.redirect(controller.adapter.getInstallLink());
});

controller.webserver.get('/install/auth', async (req, res) => {
    try {
        const results = await controller.adapter.validateOauthCode(req.query.code);

        console.log('FULL OAUTH DETAILS', results);

        // Store token by team in bot state.
        tokenCache[results.team_id] = results.bot.bot_access_token;

        // Capture team to bot id
        userCache[results.team_id] =  results.bot.bot_user_id;

        res.json('Success! Bot installed.');

    } catch (err) {
        console.error('OAUTH ERROR:', err);
        res.status(401);
        res.send(err.message);
    }
});

// Slash Commands
controller.on('slash_command',  async function(bot,message){
	switch(message.command){
		case "/blog-help":
			bot.replyPublic(message,"Blog Buddy is a slack bot that helps Liatrio keep track of all its blogs.\n" +
						"Usage: /blog-help <COMMAND> [OPTIONS]\n\n" +
						"Commands: \n" +
						"list - Displays all up to date blogs written by Liatrio employees.\n" +
						"filter - Displays certain blogs based on specific criteria.\n\n" + 
						"Options: \n" +
						"author - Displays blogs by a specific author.\n" +
						"title  - Displays blogs by a specific title.\n" +
						"summary - Gives a breif description of blogs that have been selected."
						);
			let column_names = ['Author', 'Title', 'Summary'];

        case "/blog-list":
            var blogTitles = []; // empty vector to hold blog titles;
            console.log(message);

            let channel = message.channel_id;
            console.log("Current Channel is: " + channel);

            try {
                // Call the chat.postMessage method using the WebClient
                const result = await chat.postMessage({
                  channel: channelId,
                  text: "Hello world"
                });
              
                console.log(result);
              }
              catch (error) {
                console.error(error);
              }

            // bot.replyPublic(message, "Here is the list of current blogs:\n");

            // let sql = `SELECT title FROM blogs`;

            // db.all(sql, [], (err, rows) => {
            //     if (err) {
            //       throw err;
            //     }
            //     rows.forEach((row) => {
            //       bot.replyPublic(row.title);
            //       console.log(row.title);
            //     });
            //   });

            

	}//switch statement
});

let tokenCache = {};
let userCache = {};

if (process.env.TOKENS) {
    tokenCache = JSON.parse(process.env.TOKENS);
} 

if (process.env.USERS) {
    userCache = JSON.parse(process.env.USERS);
} 

async function getTokenForTeam(teamId) {
    if (tokenCache[teamId]) {
        return new Promise((resolve) => {
            setTimeout(function() {
                resolve(tokenCache[teamId]);
            }, 150);
        });
    } else {
        console.error('Team not found in tokenCache: ', teamId);
    }
}

async function getBotUserByTeam(teamId) {
    if (userCache[teamId]) {
        return new Promise((resolve) => {
            setTimeout(function() {
                resolve(userCache[teamId]);
            }, 150);
        });
    } else {
        console.error('Team not found in userCache: ', teamId);
    }
}


// Need to find a way to close (async ?)
// db.close((err) => {
//     if (err) {
//       return console.error(err.message);
//     }
//     console.log('Close the database connection.');
//   });

