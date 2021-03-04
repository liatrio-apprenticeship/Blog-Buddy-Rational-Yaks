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
        
        let sql =  `SELECT title, author FROM blogs ORDER BY title`;

        var blogfields = [];
        blogfields = setHeaderJsonDetails(blogfields);
        // let before = blogfields.length;

        // console.log("BEFORE: " + before);

        // if (before == 0) {
        //     bot.reply("Sorry, there doesn't seem to be any blogs");
        // }

        let result = await controller.plugins.db.all(sql);
        console.log(result);

        for (let i = 0; i < 45; i++) {

            blogfields.push(
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `*${ result[i].title}* \n ${ result[i].author }`
                    }
                }
            )
            

        }

        // Stringify the final message for Slack
        blogfields = JSON.stringify(setFooterJsonDetails(blogfields));

        await bot.reply(message, {blocks: blogfields});

        // await controller.plugins.db.each(sql, function(err, row) {
        //     if (err) {
        //         bot.reply(message, "Could not find any entries.");
        //     }
        //     bot.reply(message, {
        //         blocks: [
        //             {
        //                 "type": "section",
        //                 "text": {
        //                     "type": "mrkdwn",
        //                     "text": `*${row.title}*` + "\n" + row.author
        //                 }
        //             },
        //             {
        //                 "type": "divider"
        //             }
        //         ]
        //     })
        // })
        

    });
}