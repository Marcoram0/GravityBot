// Intents, Import code, Require code
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,] });
const config = require("./config.json");
const chalk = require('chalk');
const fetch = require("node-fetch");
const moment = require("moment"); require("moment-duration-format");;
const ora = require('ora')
const fs = require("fs");
const { HangMan  } = require('djs-games');
const { type } = require("os");

let typerwordlist = [];
fs.readFile('TyperWords.txt', 'utf8', (err, data) => {
	if (err) {
		console.error(err);
		return;
	}
	typerwordlist = data.split("\n");
});
let wordlewordlist = [];
fs.readFile('5letterwords.txt', 'utf8', (err, data) => {
	if (err) {
		console.error(err);
		return;
	}
	wordlewordlist = data.split("\n");
});


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
	// Typer
	commands?.create({
		name: 'typer',
		description: 'Typing race',
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
				{ name: '!wordle', value: ('Play Wordle'), inline: false },
			)
		interaction.reply({
			embeds: [info],
			components: [row]
		})
	}
// Typer
 else if (commandName === 'typer') {
	
let word = "ERROR"



const logembed = new MessageEmbed()
			.setTitle(`/typer`)
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

word = typerwordlist[Math.floor(Math.random() * typerwordlist.length)];

const readyembed = new MessageEmbed()
		.setColor("#960202")
		.setTitle(`Initializing...`)

interaction.reply({ embeds: [readyembed] })

const beginEmbed = new MessageEmbed()
		.setColor("#960202")
		.setTitle(`**Choosing a word...**`)
	

	interaction.channel.send({ embeds: [beginEmbed] }).then(emsg => {

			
	interaction.channel.awaitMessages({ word, max: 1, time: 60000 })
	.then(async collected => {
		collected.first().react('🎉')

				let winnerEmbed = new MessageEmbed()
					.setColor("#00ff00")
					.setTitle(`Well Done`)
					.setDescription(`Game begins in 5 seconds...\nGame begins in 4 seconds...\nGame begins in 3 seconds...\nGame begins in 2 seconds...\nGame begins in 1 second...
\nThe word is ${word}\n\n**GG!**\n**The winner is ${collected.first().author}**`)
					.setTimestamp()
				emsg.edit({ embeds: [winnerEmbed] })
			}).catch(err => {

				let timeEmbed = new MessageEmbed()
					.setColor("#FF0000")
					.setTitle(`Oh no`)
					.setDescription(`**You guys were to late to type the word correctly!**`)
					.setTimestamp()
				return emsg.edit({ embeds: [timeEmbed] })
			})

		setTimeout(() => {

			let second1 = new MessageEmbed()
				.setColor("#b80404")
				.setTitle(`Loading...`)
				.setDescription(` **Games begins in 5 seconds...**\nGame begins in 4 seconds...\nGame begins in 3 seconds...\nGame begins in 2 seconds...\nGame begins in 1 second...`)
				.setTimestamp()

			emsg.edit({ embeds: [second1] })

			setTimeout(() => {

				let second2 = new MessageEmbed()
					.setColor("#ff0000")
					.setTitle(`Loading...`)
					.setDescription(`Game begins in 5 seconds...\n**Game begins in 4 seconds...**\nGame begins in 3 seconds...\nGame begins in 2 seconds...\nGame begins in 1 second...`)
					.setTimestamp()

				emsg.edit({ embeds: [second2] })

				setTimeout(() => {

					let second3 = new MessageEmbed()
						.setColor("#c45f00")
						.setTitle(`Loading...`)
						.setDescription(`Game begins in 5 seconds...\nGame begins in 4 seconds...\n**Game begins in 3 seconds...**\nGame begins in 2 seconds...\nGame begins in 1 second...`)
						.setTimestamp()

					emsg.edit({ embeds: [second3] })

					setTimeout(() => {

						let second4 = new MessageEmbed()
							.setColor("#e06e02")
							.setTitle(`Loading...`)
							.setDescription(`Game begins in 5 seconds...\nGame begins in 4 seconds...\nGame begins in 3 seconds...\n**Game begins in 2 seconds...**\nGame begins in 1 second...`)
							.setTimestamp()

						emsg.edit({ embeds: [second4] })

						setTimeout(() => {

							let second5 = new MessageEmbed()
								.setColor("#ff7c00")
								.setTitle(`Loading...`)
								.setDescription(`Game begins in 5 seconds...\nGame begins in 4 seconds...\nGame begins in 3 seconds...\nGame begins in 2 seconds...\n**Game begins in 1 second...**\nThe word is...`)
								.setTimestamp()

							emsg.edit({ embeds: [second5] })

							setTimeout(() => {

								let second6 = new MessageEmbed()
									.setColor(word)
									.setTitle(`Fast Typer`)
									.setDescription(`Game begins in 5 seconds...\nGame begins in 4 seconds...\nGame begins in 3 seconds...\nGame begins in 2 seconds...\nGame begins in 1 second...\n**The word is... ${word}**`)
									.setTimestamp()

								emsg.edit({ embeds: [second6] })

							}, 1000)

						}, 1000)

					}, 1000)

				}, 1000)

			}, 1000)

		}, 1000)

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

function getAccuracyString(word, guess) {
	let accuracyString = "";

	for (let i = 0; i < 5; i++) {
		if (guess[i] == word[i]) {
			accuracyString += "🟩";
		} else {
			let yellow = false;
			for (let j = 0; j < 5; j++) {
				if (guess[i] == word[j] && guess[j] != word[j]) {
					yellow = true;
				}
			}
			if (yellow) {
				accuracyString += "🟨";
			} else {
				accuracyString += "⬛";
			}
		}
	}

	return accuracyString;
}

client.on("messageCreate", async message => {
	if (message.author.bot) return;
	if (message.content.toLowerCase() == "!wordle") {
		const perms = new MessageEmbed()
			.setColor('#FFFF00')
			.setTitle(`Wordle Started`)
			.setFooter(`Worldbot | © Marcoram`)
			.setDescription(`<@${message.author.id}>, type any 5 letter word to begin`)
		message.channel.send({
			embeds: [perms]
		})

		currentGame.running = true;
		currentGame.word = wordlewordlist[Math.floor(Math.random() * wordlewordlist.length)];
	}
	if (message.content.length == 5 && currentGame.running) {

		currentGame.guesses.push(message.content.toUpperCase());

		let outputtitle = "";
		let outputdesc = "";
		let outputcolor = "";
		for (let i = 0; i < currentGame.guesses.length; i++) {
			outputtitle = ` `
			outputcolor = `#FFFF00`
			outputdesc += `${getAccuracyString(currentGame.word, currentGame.guesses[i])}\u2001-\u2001${currentGame.guesses[i]}\n`
			outputdesc += `\n`
		}
		if (getAccuracyString(currentGame.word, currentGame.guesses[currentGame.guesses.length - 1]) == "🟩🟩🟩🟩🟩") {
			outputtitle = "You won 👑";
			outputdesc = `The word was ${currentGame.word}`;
			outputcolor = `#00ff00`
			currentGame.guesses.length = 0;

			currentGame.running = false;
		} else if (currentGame.guesses.length == 6) {
			outputtitle = "You lost 😕";
			outputdesc = `The word was ${currentGame.word}`;
			outputcolor = `#ff0000`
			currentGame.guesses.length = 0;
			currentGame.running = false;
		}

		const wordleembed = new MessageEmbed()
			.setTitle(`${outputtitle}`)
			.setDescription(`${outputdesc}`)
			.setFooter(`Worldbot | © Marcoram`)
			.setColor(`${outputcolor}`);



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



client.on("messageCreate", async message => {
	if (message.author.bot) return;
	if (message.content.toLowerCase() == "!hangman") {
		const game = new HangMan({
			message: message,
			theme: 'coding', // 'sport', 'coding', 'nature', 'popular game', 'phone brand', 'color', 'camping', 'music instrument'
			hangManHat: '🎓',
			hangManHead: '🙉',
			hangManShirt: '👚 ',
			hangManPants: '👖 ',
			hangManBoots: '👟👟',
		  })
		  
	}
})
client.on("messageCreate", async message => {
	let word = "ERROR"
	this.word = ""
	this.message = message
	if (message.author.bot) return;
	if (message.content.toLowerCase() == "!type") {

word = typerwordlist[Math.floor(Math.random() * typerwordlist.length)];

let beginEmbed = new MessageEmbed()
	.setColor("#960202")
	.setTitle(`Fast Typer`)
	.setDescription(`**Choosing a word...**`)
	.setTimestamp()

message.channel.send({ embeds: [beginEmbed] }).then(emsg => {

	
	message.channel.awaitMessages({ word, max: 1, time: 60000 })
			.then(async collected => {
		console.log(collected)
				collected.first().react('🎉')

			let winnerEmbed = new MessageEmbed()
				.setColor("YELLOW")
				.setTitle(`Fast Typer`)
				.setDescription(`Game begins in 5 seconds...\nGame begins in 4 seconds...\nGame begins in 3 seconds...\nGame begins in 2 seconds...\nGame begins in 1 second...
\nThe word is ${word}\n\n**GG!**\n**The winner is ${collected.first().author}**`)
				.setTimestamp()
			emsg.edit({ embeds: [winnerEmbed] })
		}).catch(err => {

			let timeEmbed = new MessageEmbed()
				.setColor("#960202")
				.setTitle(`Fast Typer`)
				.setDescription(`**You guys were to late to type the word correctly!**`)
				.setTimestamp()
			return emsg.edit({ embeds: [timeEmbed] })
		})

	setTimeout(() => {

		let second1 = new MessageEmbed()
			.setColor("#b80404")
			.setTitle(`Fast Typer`)
			.setDescription(` **Games begins in 5 seconds...**\nGame begins in 4 seconds...\nGame begins in 3 seconds...\nGame begins in 2 seconds...\nGame begins in 1 second...`)
			.setTimestamp()

		emsg.edit({ embeds: [second1] })

		setTimeout(() => {

			let second2 = new MessageEmbed()
				.setColor("#ff0000")
				.setTitle(`Fast Typer`)
				.setDescription(`Game begins in 5 seconds...\n**Game begins in 4 seconds...**\nGame begins in 3 seconds...\nGame begins in 2 seconds...\nGame begins in 1 second...`)
				.setTimestamp()

			emsg.edit({ embeds: [second2] })

			setTimeout(() => {

				let second3 = new MessageEmbed()
					.setColor("#c45f00")
					.setTitle(`Fast Typer`)
					.setDescription(`Game begins in 5 seconds...\nGame begins in 4 seconds...\n**Game begins in 3 seconds...**\nGame begins in 2 seconds...\nGame begins in 1 second...`)
					.setTimestamp()

				emsg.edit({ embeds: [second3] })

				setTimeout(() => {

					let second4 = new MessageEmbed()
						.setColor("#e06e02")
						.setTitle(`Fast Typer`)
						.setDescription(`Game begins in 5 seconds...\nGame begins in 4 seconds...\nGame begins in 3 seconds...\n**Game begins in 2 seconds...**\nGame begins in 1 second...`)
						.setTimestamp()

					emsg.edit({ embeds: [second4] })

					setTimeout(() => {

						let second5 = new MessageEmbed()
							.setColor("#ff7c00")
							.setTitle(`Fast Typer`)
							.setDescription(`Game begins in 5 seconds...\nGame begins in 4 seconds...\nGame begins in 3 seconds...\nGame begins in 2 seconds...\n**Game begins in 1 second...**\nThe word is...`)
							.setTimestamp()

						emsg.edit({ embeds: [second5] })

						setTimeout(() => {

							let second6 = new MessageEmbed()
								.setColor("#00ff00")
								.setTitle(`Fast Typer`)
								.setDescription(`Game begins in 5 seconds...\nGame begins in 4 seconds...\nGame begins in 3 seconds...\nGame begins in 2 seconds...\nGame begins in 1 second...\n**The word is... ${word}**`)
								.setTimestamp()

							emsg.edit({ embeds: [second6] })

						}, 1000)

					}, 1000)

				}, 1000)

			}, 1000)

		}, 1000)

	}, 1000)

})
}
}
)






// Login ---------------------------------------------------------------------------------------------------------------------------------------------
client.login(config.token)