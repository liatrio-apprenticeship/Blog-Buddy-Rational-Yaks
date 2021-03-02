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

const Database = require('sqlite-async').verbose();

// let db = new sqlite3.Database('blog.db', (err) => {
//   if (err) {
//     console.error(err.message);
//   } else {
//     console.log('Connected to the blog database.');
//   }
// });

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

    Database.open('blog.db')
        .then(db => {
            controller.addPluginExtension("db", db);
            // load traditional developer-created local custom feature modules
            controller.loadModules(__dirname + '/features');
        })
        .catch(err => {
            console.error('Connect to db failed', err);
            process.exit(1);
        })
    // load traditional developer-created local custom feature modules
    // controller.loadModules(__dirname + '/features');



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

async function wait_on(sql) {
    let response = "---";
    var promises = [];
    var promises2 = [];

    var foo = db.all(sql);
    console.log(foo); 
    // db.each(sql, (err, row) => {
    
        // var p = new Promise(function(resolve, reject) {
        //     asyncPush(arr, 'foo', resolve);
        // });

        // p.then(function() {
        //     var a = getArr();
        //     console.log(a);
        //     console.log(a[0]);
        //     console.log(JSON.stringify(a, null, 2));
        //   });
          

        //console.log("before pushing: " + row.author);
        // promises.push(row.author);
        //console.log("after pushing");


        // const p3 = new Promise(function(resolve, reject) {
        //     resolve(row.author);
        //     reject(console.log("ERROR___________________________________________"));
        // });
        // promises2.push(p3);
    // });

    //promises2[0].then(success => console.log("success!!!: ", success));

    /*or (var i = 0; i < promises2.length; i++) {
        // console.log(promises[i]);
        //console.log(promises2[i].then);
    };*/

    /*
    Promise.all(promises2).then(function(values) {
        console.log(values);
        //console.log(values.then)
    });
    */

    /*
    const result = new Promise((resolve, reject) => {
        db.each(sql, (err, row) => {
            if (err) {
                reject(err);
            }
            response += row.author + " ";
        });  

        
    })

    resolve(response);
    return result;
    */
}
  
/*
const userAllowedToDeployWithPromise = (sql) => {
    //return new Promise(function(resolve, reject) {
    
      controller.storage.users.get(user_id, function(err, stored_user) {
        //let result = (some calculations from stored_user here);
        resolve(result);
      });
    
        let response = "function internal -- ";

        db.each(sql, (err, row) => {
            if (err) {
                reject(err);
            }
            response += row.author + " ";
        }); 
        
        //resolve(response);

        return response;

    //});
    
  };
*/

// controller.hears(new RegExp(/^blog filter author (.*?)$/i), 'message', async(bot, message) => {
//     let param = message.matches[1];
//     let sql = `SELECT author FROM blogs`;

//     /* Make a request to another API */
//     //const response = "And... nothing " + await wait_on(sql);
//     const response2 = await wait_on(sql);
    
//     /* Reply based on the response */
//     await bot.reply(message, `Sanity check`);
//     //await bot.reply(message, `Response from API: ${response.output}`);
//     console.log(response2);
//     await bot.reply(message, `Response from API: ${response2}`);
    

//     //let this_is_text = "---///";
//     //text8 = await this.wait_on(sql);
//     //const result = await this.wait_on(sql);
//     //const result2 = await wait_on(sql);
//     //response = await wait_on(sql);

//     //wait_on(sql).then(function(value) {
//     //    this_is_text = value;
//     //});

//     //let allowed_promise = "----> " + userAllowedToDeployWithPromise(sql); // deploy w promise
//     //let allowed_promise = "----> " + then.userAllowedToDeployWithPromise(sql);

//     //const allowed_promise = await bot.userAllowedToDeployWithPromise(sql);

//     const content = {
//         blocks: [
//             {
//                 "type": "section",
//                 "text": {
//                     "type": "plain_text",
//                     "text": "This is a plain text section block.",
//                     //"text": wait_on(sql).then + " ",
//                     //"text": this_is_text + " ",
//                     "emoji": true
//                 }
//             }
//         ] // insert valid JSON following Block Kit specs
//     };

//     /*
//     return new Promise((resolve, reject) => {
//         //myDatabase.get(message.user).then(function(user) {
//         wait_on(sql).then(function(user) {
//             if (user) {
//                 resolve(true);
//             } else {
//                 resolve(false);
//             }
//         }).catch(reject);
//     });
//     */

//     //await um = wait_on(sql);

//     //await bot.reply(message, content);

//     //await bot.reply(message, allowed_promise);





//     //WHERE author LIKE '%$Chris%'
//     //ORDER BY author`;
    
//     /*
//     let response = "---";

//     db.each(sql, (err, row) => {
//         if (err) {
//             reject(err);
//         }
//         // process each row here
//         //response = response + `${row.author} ${row.title} - ${row.link_liatrio}\n`;
//         //console.log(`${row.author} ${row.title} - ${row.link_liatrio}\n`);
//         //console.log(row.author);
        
        
//         //response = `${row.author}`;
//         response += row.author + " ";
//         //console.log(response);
//     });
//     */

//     /*
//     let p = new Promise((resolve, reject) => {
//         db.each(sql, (err, row) => {
//             if (err) {
//                 reject(err);
//             }
//             // process each row here
//             //response = response + `${row.author} ${row.title} - ${row.link_liatrio}\n`;
//             //console.log(`${row.author} ${row.title} - ${row.link_liatrio}\n`);
//             //console.log(row.author);
            
            
//             //response = `${row.author}`;
//             response += row.author + " ";
//             console.log(response);
//         });

//         resolve(response);
//     });
//     */
    
//     // close the database connection
    

//     //await bot.
//     //`This app is running Botkit ${ controller.version }.`

//     //await bot.reply(message, `${response}`);
    

// //
//     //let response2 = "TEST";
//     //await bot.reply(message,`No author found matching: ${param}`); // This is fine
//     //await bot.reply(message,`...: ${response2}`);
// //
//     //await bot.reply(message,`Test...: ${response}`); // Nothing

//     /*
//     p.then((successMessage) => {
//         // successMessage is whatever we passed in the resolve(...) function above.
//         // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
//         console.log("Yay! " + successMessage);
//         bot.reply(message,`Test...: ${response}`);
//       });
//     */

//     //await bot.reply(message,`Test2...: ${response}`);

//     /*
//     await bot.sendWebhook({
//         text: 'This is an incoming webhook' + response,
//         channel: '#yaks-devops-test-channel',
//       },function(err,res) {
//         if (err) {
//           // ...
//         }
//       });  
//     */

//     //db.close();

//     //await bot.reply(message, response);

//     /*
//     db.get(sql, (err, row) => {
//         if (err) {
//           return console.error(err.message);
//         }
//         return row
//           ? db.each(sql,params, (err, result) => {
//             // process each row here
//          })
//           : await bot.reply(message,`No author found matching: ${param}`);
      
//       });
//     */

// });
