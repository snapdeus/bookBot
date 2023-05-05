const Discord = require("discord.js");
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const text = require('../output.json');

module.exports = {
    name: "test",
    usage: 'test',

    // Execute contains content for the command
    async execute(client, message, args) {


        // const embed = new EmbedBuilder()
        //     .setTitle('Some title')
        //     .setDescription(`||${ text[2] }||`);


        // message.channel.send({ embeds: [embed] });


        const text1 = text[1].replace(/\\r\\n|\\r|\\n/g, '\n');
        console.log(text1.length);
        message.channel.send(`${ text1 }`);

    }
};