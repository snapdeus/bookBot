# bookBot
posts a book in chunks in discord 

If you would like to use this code, please do so. The way it works is as follows:

createJson.js will take an input file, defined as infile and will chunk it up into chunks less than or equal to 1900 characters.  
It will output all of these chunks to a file called output.json.

Then, inside the folder cronjobs, the sendChapters.js file handles the logic for grabbing chunks, cacheing the index location (the 'bookmark' if you will)
and the message.id of the last chunk sent (to let the user go back to the previous bookmark if they need to refresh themselves). 

the sendChapters function is export to app.book.js, the main file, which uses node-cron to send a chunk of text everday at 3:30pm (it's 19:30 on my server).

Enjoy!
