require('dotenv').config();
const Discord = require('discord.js');
const { QuickDB } = require("quick.db");
const book = require('../output.json');
const db = new QuickDB({ filePath: `./json.sqlite` });
let config;
if (process.env.NODE_ENV?.trim() === 'development') {
    config = require('../config/config.test.json');
} else {
    config = require('../config/config.json');
}



module.exports.sendChapters = async (channel) => {
    try {
        if (!(await db.has('startingIndex'))) {
            await db.set('startingIndex', 0);
        }
        if (!(await db.has('lastMessageId'))) {
            await db.set('lastMessageId', false);
        }
        let startingIndex = await db.get('startingIndex');

        let lastMessageId = await db.get('lastMessageId');
        if (lastMessageId) {
            channel.send(`**LAST BOOKMARK**\n https://discord.com/channels/${ config.GUILD_ID }/${ config.BOOK_CHANNEL }/${ lastMessageId }\n *NOW READING PART ${ startingIndex / 5 }/172*`);
        } else {
            channel.send(`Now reading part ${ startingIndex / 5 }/172`);
        }
        let IdArray = [];
        let promises = [];
        for (let i = startingIndex; i < startingIndex + 5; i++) {
            const promise = await channel.send("||" + book[i] + "||")
                .then(sent => {
                    let id = sent.id;
                    console.log(i, id);
                    IdArray.push(id);
                });
            promises.push(promise);
        }
        await Promise.all(promises);

        console.log(IdArray);
        const lastMessageIdFromArray = IdArray[0];
        await db.set('lastMessageId', lastMessageIdFromArray);
        await db.set('startingIndex', startingIndex + 5);

    } catch (e) {
        console.log(e);
    }
};