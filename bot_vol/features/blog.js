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

module.exports = function(controller) {
    controller.hears(new RegExp(/^blog filter author (.*?)$/i), 'message', async(bot, message) => {
        
        let sql = `SELECT author FROM blogs`;
        const result = await controller.plugins.db.all(sql);

       console.log(result);

    });

    controller.hears('bb list', 'message', async(bot, message) => {
        
        let sql = `SELECT title, author, summary, link_liatrio FROM blogs ORDER BY title`;
        let result;

        var blogfields = [];
        var remaining = [];
        blogfields = setHeaderJsonDetails(blogfields);

        result = await controller.plugins.db.all(sql);

        for (let i = 0; i < 40; i++) {
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

        for(let j = 41; j < result.length; j++) {
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
}