# bookBot
posts a book in chunks in discord 

If you would like to use this code, please do so. The way it works is as follows:

createJson.js will take an input file, defined as infile and will chunk it up into chunks less than or equal to 1900 characters.  
It will output all of these chunks to a JSON array in a file called output.json.

Then, inside the folder cronjobs, the sendChapters.js file handles the logic for grabbing chunks, cacheing the index location (the 'bookmark' if you will)
and the message.id of the last chunk sent (to let the user go back to the previous bookmark if they need to refresh themselves). This is stored in an
sqLite db for persistence. Finally, sendChapters.js sets up all the chunks to be sent in an array of promises, which is awaited in order to ensure they are executed in order. It then sends the text to the discord channel.

the sendChapters function is export to app.book.js, the main file, which uses node-cron to send a chunk of text everday at 3:30pm (it's 19:30 on my server).

An example of my config file is:

{

    "BOT_TOKEN": "YOUR BOT TOKEN",

    "BOOK_CHANNEL": "YOUR BOOKCLUB CHANNEL",

    "GUILD_ID": "YOUR GUILD ID"
    
}

I use two config files, one for dev and one for prod. You do not have to do this and can remove the if statement for the config if you so desire in both sendChapters.js and app.book.js

Enjoy!
