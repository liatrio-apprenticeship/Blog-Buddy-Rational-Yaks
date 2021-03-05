module.exports = function(controller) {
	controller.hears(['help', 'help me', 'need assistance!', 'save me!!!'], 'message', async(bot, message) => {
		await bot.reply(message,{
			blocks: [
					{
						"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": "Hello, Blog Buddy at your service :nerd_face: - Here's a list of of commands I can execute."
						}
					},
					{
						"type": "divider"
					},
					{
						"type": "divider"
					},
					{
						"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": "`Usage:` bb <COMMAND> [OPTION]\n\n"
						}
					},
					{
						"type": "divider"
					},
					{
						"type": "divider"
					},

					{
						"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": `*Commands:* \n`
						}
					},

					  
					{
						"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": "`list` - Displays all up to date blogs written by Liatrio team members.\n" //change
						}
					},
					{
						"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": "`filter [OPTIONS]` - Based on specified options, filter will return the specified crtieria. i.e. filter author <author_name> will return blogs written by that author.\n\n" //change
						}
					},
					{
						"type": "divider"
					},
					{
						"type": "divider"
					},
					{
						"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": `*Options:* \n`
						}
					},
					{
						"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": "`author` - Displays all blogs written by a certain author.\n"
						}
					},
					{
						"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": "`title` - Displays all blogs containing a specified title.\n"
						}
					},
					{
						"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": "`random` - Returns a randomly selected blog.\n"
						}
					},
					{
						"type": "divider"
					},
					{
						"type": "divider"
					},
			
		    ]
        })
    });
}

