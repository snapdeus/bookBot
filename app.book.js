require('dotenv').config();


const fs = require('fs');
const Discord = require('discord.js');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');
const { sendChapters } = require('./cronjobs/sendChapters');

let config;
if (process.env.NODE_ENV?.trim() === 'development') {
    config = require('./config/config.test.json');
} else {
    config = require('./config/config.json');
}





const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.commands = new Discord.Collection();



const prefix = "!";




const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${ file }`);
    client.commands.set(command.name, command);
}




client.on('ready', () => {
    console.log(`${ client.user.tag } logged in`);
    const channel = client.channels.cache.get(config.BOOK_CHANNEL);

    // sendChapters(channel, config.CLOUDSPLITTER)

    cron.schedule('30 19 * * *', () => {
        sendChapters(channel, config.CLOUDSPLITTER);
    });



});

//IF I WANT TO ADD COMMANDS LATER...
// client.on('messageCreate', message => {
//     if (!message.content.startsWith(prefix) || message.author.bot) return;
//     const args = message.content.slice(prefix.length).trim().split(' ');
//     const commandName = args.shift().toLowerCase();
//     if (!client.commands.has(commandName)) return;
//     const command = client.commands.get(commandName);
//     try {
//         command.execute(client, message, args, message.member);
//     } catch (error) {
//         console.error(error);
//         message.reply('there was an error trying to execute that command!');
//     }
// });


process.on("uncaughtException", (err, origin,) => {
    console.error(err, origin);
});


client.login(config.BOT_TOKEN);