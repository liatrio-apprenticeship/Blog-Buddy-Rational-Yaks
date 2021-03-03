module.exports = function(controller) {
    controller.hears(new RegExp(/^bb filter title (.*?)$/i), 'message', async(bot, message) => {

        let param = message.matches[1];

        let sql = `SELECT author, title, link_liatrio FROM blogs WHERE title LIKE \'%${ param }%\'`;

        const result = await controller.plugins.db.all(sql);

        console.log(result);

        let response = "";

        for (let i = 0; i < result.length; i++) {
            response += result[i].author + " - " + result[i].title + " " + result[i].link_liatrio + "\n";
        }

        await bot.reply(message, "Query:\n" + response);
    
    });
}
