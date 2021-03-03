module.exports = function(controller) {
    controller.hears(['help', 'help me', 'need assistance!', 'save me!!!'], 'message', async(bot, message) => {
        await bot.reply(message,{
            blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Hello! This is Blog Buddy :) - Here's a list of of commands I can execute."
                    }
                },
                {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Usage: /blog-help <COMMAND> [OPTIONS]\n"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "list - Displays all up to date blogs written by Liatrio employees.\n" //change
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "list - Displays all up to date blogs written by Liatrio employees.\n" //change
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "list - Displays all up to date blogs written by Liatrio employees.\n"
                    }
                },
                
            ]
        })
    });
}

