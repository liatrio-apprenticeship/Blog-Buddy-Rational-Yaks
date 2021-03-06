function setHeaderJsonDetails(blogfields) {
    blogfields.push(
        {
            "type": "divider",
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
    
    controller.hears(new RegExp(/^blog filter author$/i), 'message', async(bot, message) => {
        
        let sql = `SELECT author FROM blogs`;
        const result = await controller.plugins.db.all(sql);

       console.log(result);

    });

    //////////////// List Commands

    controller.hears(new RegExp(/^bb list$/i), 'message', async(bot, message) => {
        
        let sql = `SELECT title, author, summary, link_liatrio FROM blogs ORDER BY title`;
        let result;

        var blogfields = [];
        var remaining = [];
        blogfields = setHeaderJsonDetails(blogfields);

        result = await controller.plugins.db.all(sql);

        for (let i = 0; i < 47; i++) {
            blogfields.push(
                {
                    "type" : "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `:liatrio: ${result[i].author} - <${result[i].link_liatrio}|${result[i].title}>\n${result[i].summary}`
                    }
                },
            )
        }

        for(let j = 47; j < result.length; j++) {
            remaining.push(
                {
                    "type" : "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `:liatrio: ${result[j].author} - <${result[j].link_liatrio}|${result[j].title}>\n${result[j].summary}`
                    }
                },
            )
        }


        blogfields = JSON.stringify(setFooterJsonDetails(blogfields));
        remaining = JSON.stringify(remaining);

        await bot.reply(message, {blocks: blogfields});
        await bot.replyInThread(message, {blocks: remaining});
    
    });

    controller.hears(new RegExp(/^bb recent$/i), 'message', async(bot, message) => {
        
        let sql = `SELECT kickoff, author, link_liatrio, title, summary FROM blogs ORDER BY kickoff DESC`;
        const result = await controller.plugins.db.all(sql);

        // Stringify the header message for Slack
        var header = [];
        header.push(
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `The 10 most recent :liatrio: blogs:`
                }
            }
        ); 

        header = JSON.stringify(setFooterJsonDetails(header));

        await bot.reply(message, {blocks: header});

        var numbers = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"]

        var blogfields = [];
        for (let i = 0; i < 10; i++) {
            blogfields.push(
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `${numbers[i]} ${result[i].kickoff} - <${result[i].link_liatrio}|${result[i].title}> by ${result[i].author}\n${result[i].summary}`
                    }
                }
            )
        }
        blogfields = JSON.stringify(setFooterJsonDetails(blogfields));
        await bot.reply(message, {blocks: blogfields});

        // Stringify the footer message for Slack
        var footer = [];
        footer = JSON.stringify(setFooterJsonDetails(footer));
        await bot.reply(message, {blocks: footer});

    });

    //////////////// Filter Commands

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
            sql = `SELECT title, link_liatrio FROM blogs WHERE author = ?`;

            result = await controller.plugins.db.all(sql, query);

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
            sql = `SELECT author, title, link_liatrio FROM blogs WHERE title LIKE ?`;

            result = await controller.plugins.db.all(sql, "%" + query + "%");

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
            sql = `SELECT author, title, summary, link_liatrio FROM blogs WHERE summary LIKE ?`;

            result = await controller.plugins.db.all(sql, "%" + query + "%");

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
