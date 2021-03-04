function setHeaderJsonDetails(blogfields) {
    blogfields.push(
        {
            "type": "divider"
        },
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "Liatrio's Blog Buddy",
                "emoji": true
            }
        } 
    );

    return blogfields;
}

function setFooterJsonDetails(blogfields) {
    blogfields.push(
        {
            "type": "divider"
        }
    );

    return blogfields;
}

function noResult(blogfields, param, option) {
    if (option == "author") {
        blogfields.push(
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Sorry, the author \'${ param }\' does not match any search results.`
                }
            }
        );
    } else if (option == "title") {
        blogfields.push(
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Sorry, the title \'${ param }\' does not match any search results.`
                }
            }
        );
    } else if (option == "summary") {
        blogfields.push(
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Sorry, the keyword \'${ param }\' does not match any summaries.`
                }
            }
        );
    } else {
        blogfields.push(
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Sorry, the filter \'${ param }\' is not valid. \nYou can filter by either \'author\', \'title\', or \'summary\'.`
                }
            }
        );        
    }

    return blogfields;
}

function between(min, max) {  
    return Math.floor(
      Math.random() * (max - min) + min
    )
}

module.exports = function(controller) {
    controller.hears(new RegExp(/^bb filter (\S*) (\S*)$/i), 'message', async(bot, message) => {

        let filter = message.matches[1];
        let sql = "";
        let result;

        // Setup the reply formatting for the header
        var blogfields = [];
        blogfields = setHeaderJsonDetails(blogfields);

        var fields = [];

        if (filter == "author") {
            let query = message.matches[2];
            console.log("I heard author");
            sql = `SELECT title, link_liatrio FROM blogs WHERE author = \'${ query }\'`;

            result = await controller.plugins.db.all(sql);

            for (let i = 0; i < result.length; i++) // Format the database query
                fields.push({"type": "mrkdwn", "text": `:liatrio: <${result[i].link_liatrio}|${result[i].title}>`});
            
            if (fields && fields.length > 0) { // If there were no search results that matched
                blogfields.push(
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `All blogs created by ${query}:`
                        }
                    },
                    { // Push the results of the formatted query
                        "type": "section",
                        "fields": fields
                    }
                ); 

            } else { // If there were search results that matched
                blogfields = noResult(blogfields, query, "author");
            }

        } else if (filter == "title") {
            let query = message.matches[2];
            console.log("I heard title");
            sql = `SELECT author, title, link_liatrio FROM blogs WHERE title LIKE \'%${ query }%\'`;

            result = await controller.plugins.db.all(sql);

            for (let i = 0; i < result.length; i++) // Format the database query
                fields.push({"type": "mrkdwn", "text": `:liatrio: ${result[i].author} - <${result[i].link_liatrio}|${result[i].title}>`});
            
            if (fields && fields.length > 0) { // If there were no search results that matched
                blogfields.push({ // // Push the results of the formatted query
                    "type": "section",
                    "fields": fields
                });
            } else { // If there were search results that matched
                blogfields = noResult(blogfields, query, "title");
            }

        } else if (filter == "summary") {
            let query = message.matches[2];
            console.log("I heard summary");
            sql = `SELECT author, title, summary, link_liatrio FROM blogs WHERE summary LIKE \'%${ query }%\'`;

            result = await controller.plugins.db.all(sql);

            let before = blogfields.length

            for (let i = 0; i < result.length; i++) {
                blogfields.push(
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `:liatrio: ${result[i].author} - <${result[i].link_liatrio}|${result[i].title}>\n${result[i].summary}`
                        }
                    }
                )
            }

            if (before == blogfields.length) { // No search results were found
                blogfields = noResult(blogfields, query, "summary");
            }

        } else {
            console.log("I heard other");
            blogfields = noResult(blogfields, filter, "other");
        }

        // Stringify the final message for Slack
        blogfields = JSON.stringify(setFooterJsonDetails(blogfields));

        await bot.reply(message, {blocks: blogfields});
    
    });
}

module.exports = function(controller) {
    controller.hears(new RegExp(/^bb random$/i), 'message', async(bot, message) => {
        let filter = message.matches[1];
        let sql = "";
        let result;

        // Setup the reply formatting for the header
        var blogfields = [];
        blogfields = setHeaderJsonDetails(blogfields);

        sql = `SELECT author, title, summary, link_liatrio FROM blogs`;

        result = await controller.plugins.db.all(sql);

        var rand_int = between(0, result.length - 1);

        blogfields.push(
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `:liatrio: ${result[rand_int].author} - <${result[rand_int].link_liatrio}|${result[rand_int].title}>\n${result[rand_int].summary}`
                }
            }
        )

        // Stringify the final message for Slack
        blogfields = JSON.stringify(setFooterJsonDetails(blogfields));

        await bot.reply(message, {blocks: blogfields});

    });
}