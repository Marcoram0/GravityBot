// Intents, Import code, Require code
const { Client, Intents } = require("discord.js")
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,] });
const config = require("./config.json");
const chalk = require('chalk');
const fetch = require("node-fetch");
const moment = require("moment"); require("moment-duration-format");;
const duration = moment.duration(client.uptime).format(" H [hrs], m [mins]");
const ora = require('ora')


// Presence
client.on('ready', function () {


    //Booting animation
    const spinne = ora().start();
    spinne.color = 'red';
    spinne.spinner = "aesthetic"
    setTimeout(() => {
        spinne.stop();
        console.log(chalk.green`
        
░██╗░░░░░░░██╗░█████╗░██████╗░██╗░░░░░██████╗░██████╗░░█████╗░████████╗
░██║░░██╗░░██║██╔══██╗██╔══██╗██║░░░░░██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝
░╚██╗████╗██╔╝██║░░██║██████╔╝██║░░░░░██║░░██║██████╦╝██║░░██║░░░██║░░░
░░████╔═████║░██║░░██║██╔══██╗██║░░░░░██║░░██║██╔══██╗██║░░██║░░░██║░░░
░░╚██╔╝░╚██╔╝░╚█████╔╝██║░░██║███████╗██████╔╝██████╦╝╚█████╔╝░░░██║░░░
░░░╚═╝░░░╚═╝░░░╚════╝░╚═╝░░╚═╝╚══════╝╚═════╝░╚═════╝░░╚════╝░░░░╚═╝░░░

`)
    }, 5000);
    // Count client users
    let users = 0;
    client.guilds.cache.forEach(guild => users = users + guild.memberCount);
    // Log message
    setTimeout(() => {
        console.log(chalk.red(`${client.user.username}`, chalk.blue('is ready on'), chalk.red(`${client.guilds.cache.size} Guilds`), chalk.blue('and helping out'), chalk.red(`${users} Members`

        ))
        );
    }, 5250)

});


// Login
client.login(config.token)



















