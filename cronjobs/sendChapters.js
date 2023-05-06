require('dotenv').config();
const { QuickDB } = require("quick.db");
const book = require('../output.json');
const initialDB = new QuickDB({ filePath: `./json.sqlite` });
let config;
if (process.env.NODE_ENV?.trim() === 'development') {
    config = require('../config/config.test.json');
} else {
    config = require('../config/config.json');
}


async function createThread(channel, bookName) {
    if (!channel.threads.cache.find(x => x.name === bookName)) {
        const thread = await channel.threads.create({
            name: bookName,
            autoArchiveDuration: 4320,
            reason: `Reading ${ bookName }`,
        });

        console.log(`Created thread: ${ thread.name }`);
        return thread
    } else {
        const thread = channel.threads.cache.find(x => x.name === bookName)
        return thread
    }
}

module.exports.sendChapters = async (channel, bookName) => {
    try {
        const db = initialDB.table(`${ bookName }`)

        const thread = await createThread(channel, bookName);


        if (!(await db.has('startingIndex'))) {
            await db.set('startingIndex', 0);
        }
        if (!(await db.has('lastMessageId'))) {
            await db.set('lastMessageId', false);
        }
        let startingIndex = await db.get('startingIndex');

        let lastMessageId = await db.get('lastMessageId');
        if (lastMessageId) {
            thread.send(`**LAST BOOKMARK:**\n https://discord.com/channels/${ config.GUILD_ID }/${ thread.id }/${ lastMessageId }\n *NOW READING PART ${ startingIndex / 5 }/172*`);
        } else {
            //NOTE NEED TO FIX: BOOK.LENGTH WILL NOT ALWAYS BE DIVISIBLE BY 5
            thread.send(`Now reading part ${ startingIndex / 5 }/${ book.length / 5 }`);
        }
        let IdArray = [];
        let promises = [];
        for (let i = startingIndex; i < startingIndex + 5; i++) {
            const promise = await thread.send(book[i])
                .then(sent => {
                    let id = sent.id;
                    IdArray.push(id);
                });
            promises.push(promise);
        }
        await Promise.all(promises);

        const lastMessageIdFromArray = IdArray[0];
        await db.set('lastMessageId', lastMessageIdFromArray);
        await db.set('startingIndex', startingIndex + 5);

    } catch (e) {
        console.log(e);
    }
};