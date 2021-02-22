# Botkit Starter Kit

This is a Botkit starter kit for slack, created with the [Yeoman generator](https://github.com/howdyai/botkit/tree/master/packages/generator-botkit#readme).

To complete the configuration of this bot, make sure to update the included `.env` file with your platform tokens and credentials.

[Botkit Docs](https://botkit.ai/docs/v4)

This bot is powered by [a folder full of modules](https://botkit.ai/docs/v4/core.html#organize-your-bot-code). 
Edit the samples, and add your own in the [features/](features/) folder.

NOTE:

This bot was developed in a Mac environment. If you are working in a Windows or Linux environment, you may receive docker issues when running "docker-compose up" in regards to the bot_vol/npm_scripts.sh file.

For Windows:

    1. Install Notepad++

    2. Import npm_scripts.sh

    3. Edit -> EOL Conversion -> Unix (LF)
    
    4. Save

For Linux:

    1. Install dos2unix ( sudo apt-get install -y dos2unix )

    2. Run "dos2unix path/to/file"
 
