module.exports = function(controller) {
    controller.hears(new RegExp(/^blog filter author (.*?)$/i), 'message', async(bot, message) => {
        
        let sql = `SELECT author FROM blogs`;
        const result = await controller.plugins.db.all(sql);

        console.log(results);
    
    }
}