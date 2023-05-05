require('dotenv').config();


const fs = require('fs');
const Discord = require('discord.js');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');

let config;
let botId;
if (process.env.NODE_ENV?.trim() === 'development') {
    config = require('./config/config.test.json');
    botId = '';
} else {
    botId = '';
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

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}





client.on('ready', () => {
    console.log(`${ client.user.tag } logged in`);

    const retrieveEpisodeAndSend = async () => {
        const { embedMsg } = await randomEpisodes.getRandomShow();
        const channel = client.channels.cache.get(config.EPISODE_CHANNEL);
        channel.send({ embeds: [embedMsg] });
    };

    cron.schedule('0 15 * * *', () => {
        retrieveEpisodeAndSend();
    });



});


client.on('messageCreate', message => {


    if (!message.content.startsWith(prefix) || message.author.bot) return;



    const args = message.content.slice(prefix.length).trim().split(' ');

    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    // if (command.name === 'chat' && message.author.id !== `584777613411614739`) {
    //     message.reply("Only for the admin right now...")
    //     return
    // }

    try {
        command.execute(client, message, args, message.member);

    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});




process.on("uncaughtException", (err, origin,) => {
    console.error(err, origin);
});


client.login(config.BOT_TOKEN);