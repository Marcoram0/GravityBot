
// Intents, Import code, Require code
const { Client, Intents } = require("discord.js")
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,] });
const config = require("./config.json");
const chalk = require('chalk')





// Presence
client.on('ready', function () {

    //Booting animation
    const P = ['Booting \\', 'Booting |', 'Booting /', 'Booting -'];
    let x = 0;
    const loader = setInterval(() => {
        process.stdout.write(chalk.cyan`\r${P[x++]}`);
        x %= P.length;
    }, 100);

    setTimeout(() => {
        clearInterval(loader);
        console.clear();
    }, 4999);


    setTimeout(() => {
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

    setTimeout(() => {
        console.log(chalk.red(`${client.user.username}`, chalk.blue('is ready on'), chalk.red(`${client.guilds.cache.size} Guilds`), chalk.blue('and helping out'), chalk.red(`${users} Members`)));
    }, 5500)
});









// Login
client.login(config.token)
