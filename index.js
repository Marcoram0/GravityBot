// Intents, Import code, Require code
const { Client, Intents, MessageEmbed } = require("discord.js")
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,] });
const config = require("./config.json");
const chalk = require('chalk');
const fetch = require("node-fetch");
const moment = require("moment"); require("moment-duration-format");;
const duration = moment.duration(client.uptime).format(" H [hrs], m [mins]");
const ora = require('ora')
const fs = require("fs");

// Bot online events ---------------------------------------------------------------------------------------------------------------------------------------------
client.on('ready', function () {

    let users = 0; client.guilds.cache.forEach(guild => users = users + guild.memberCount); // Get total discord users
    const allguilds = client.guilds.cache.size // Define server count


    // Boot Log in discord channel
    const boot = new MessageEmbed()
        .setColor('#00FFFF')
        .setTitle('Bot is online!')
        .setDescription(`Worldbot is back on **${client.guilds.cache.size}** guilds with a total of **${users}** members `)
    client.channels.cache.get(config.logchannel).send({
        embeds: [boot]
    })


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

    // Log message
    setTimeout(() => {
        console.log(chalk.red(`${client.user.username}`, chalk.blue('is ready on'), chalk.red(`${allguilds} Guilds`), chalk.blue('and helping out'), chalk.red(`${users} Members`))
        );
    }, 5250)
});


// Command builder ---------------------------------------------------------------------------------------------------------------------------------------------
client.on('messageCreate', message => {
    let commands
    commands = client.application?.commands


    // Info
    commands?.create({
        name: 'info',
        description: 'information to the bot',
    })
})



// Command input ---------------------------------------------------------------------------------------------------------------------------------------------

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) { return }
    const { commandName, options } = interaction

    // Info command
    if (commandName === 'info') {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('primary')
                    .setLabel('⭯ Refresh bot')
                    .setStyle('PRIMARY'),
            );
        // Log 
        const logembed = new MessageEmbed()
            .setTitle(`/info`)
            .setThumbnail(`${interaction.user.avatarURL()}`)
            .setColor('#00FFFF')
            .addFields(
                { name: 'User', value: (`**${interaction.user.username}**`), inline: false },
                { name: 'Guild', value: (`**${interaction.guild.name}**`), inline: false },
                { name: 'Channel', value: (`**${interaction.channel.name}**`), inline: false },
            )
        client.channels.cache.get(config.logchannel).send({
            embeds: [logembed]
        })
        // Command reply
        const duration = moment.duration(client.uptime).format(" H [hrs], m [mins]");
        const guilds = client.guilds.cache.size
        const info = new MessageEmbed()
            .setDescription(`<@${interaction.user.id}> dumbass:`)
            .setFooter(`Worldbot | © Marcoram`)
            .setColor('CFAA11')
            .addFields(
                { name: 'Servers:', value: (`${guilds}`), inline: true },
                { name: 'Uptime:', value: (`${duration}`), inline: true },
                { name: '/info', value: ('more informations about the bot'), inline: false },
            )
        interaction.reply({
            embeds: [info],
            components: [row]
        })
    }
})
// Restart button---------------------------------------------------------------------------------------------------------------------------------------------

client.on('interactionCreate', interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'primary') {
        if (!interaction.member.id == config.ownerid)
            interaction.reply({ content: "Bot is restarting....." })
        // Log message
        const logembed = new MessageEmbed()
            .setTitle(`Bot restarted`)
            .setThumbnail(`${interaction.user.avatarURL()}`)
            .setColor('#00FFFF')
            .addFields(
                { name: 'User', value: (`**${interaction.user.username}**`), inline: false },
                { name: 'Guild', value: (`**${interaction.guild.name}**`), inline: false },
                { name: 'Channel', value: (`**${interaction.channel.name}**`), inline: false },
            )
        client.channels.cache.get(logchannel).send({
            embeds: [logembed]
        })
        process.exit(1)
    }
})

// Wordle --------------------------------------------------------------------------------------------------------------------------------------------
let currentGame = {
    running: false,
    word: "ERROR",
    guesses: []
}

let wordlist = [];
fs.readFile('5letterwords.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    wordlist = data.split("\n");
});

function getAccuracyString(word, guess) {
    let accuracyString = "";

    for (let i = 0; i < 5; i++) {
        if (guess[i] == word[i]) {
            accuracyString += ":green_square:";
        } else {
            let yellow = false;
            for (let j = 0; j < 5; j++) {
                if (guess[i] == word[j] && guess[j] != word[j]) {
                    yellow = true;
                }
            }
            if (yellow) {
                accuracyString += ":yellow_square:";
            } else {
                accuracyString += ":black_large_square:";
            }
        }
    }

    return accuracyString;
}

client.on("messageCreate", async message => {
    if (message.author.bot) return;
    if (message.content.toLowerCase() == "!wordle") {
        const perms = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`Wordle Started`)
            .setFooter(`Worldbot | © Marcoram`)
            .setDescription(`<@${message.author.id}>, type any 5 letter word to begin`)
        message.channel.send({
            embeds: [perms]
        })

        currentGame.running = true;
        currentGame.word = wordlist[Math.floor(Math.random() * wordlist.length)];
    }
    if (message.content.length == 5 && currentGame.running) {

        currentGame.guesses.push(message.content.toUpperCase());

        let outputtitle = "";
        let outputdesc = "";
        for (let i = 0; i < currentGame.guesses.length; i++) {
            outputtitle = ` `
            outputdesc += `${getAccuracyString(currentGame.word, currentGame.guesses[i])}\u2001-\u2001${currentGame.guesses[i]}\n`
            outputdesc += `\n`
        }
        if (getAccuracyString(currentGame.word, currentGame.guesses[currentGame.guesses.length - 1]) == ":green_square::green_square::green_square::green_square::green_square:") {
            outputtitle = "You won 👑";
            outputdesc = `The word was ${currentGame.word}`;
            currentGame.guesses.length = 0;

            currentGame.running = false;
        } else if (currentGame.guesses.length == 6) {
            outputtitle = "You lost 😕";
            outputdesc = `The word was ${currentGame.word}`;
            currentGame.guesses.length = 0;




            currentGame.running = false;
        }

        const wordleembed = new MessageEmbed()
            .setTitle(`${outputtitle}`)
            .setDescription(`${outputdesc}`)
            .setFooter(`Worldbot | © Marcoram`)
            .setColor('#00ff00');



        message.channel.messages.fetch({ limit: 1 }).then(messages => {
            message.channel.bulkDelete(messages);
        })

        const filter = m => m.author.id == "922337248756760626"
        const edited = (await message.channel.messages.fetch()).find(filter)

        edited.edit({
            embeds: [wordleembed]
        })
    };
});

// Login ---------------------------------------------------------------------------------------------------------------------------------------------
client.login(config.token)



















