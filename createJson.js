const fs = require('fs');
let config;
if (process.env.NODE_ENV?.trim() === 'development') {
    config = require('./config/config.test.json');
} else {
    config = require('./config/config.json');
}

const bookName = config.REDDENING;


const infile = `${ bookName }.txt`;
const outfile = `${ bookName }.json`;

function parseAndWriteChunks(inputFile, outputFile) {
    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        const sentences = data.match(/[^.!?]+[.!?]+/g) || [];
        const chunks = [];
        let currentChunk = '';

        for (const sentence of sentences) {
            const potentialChunk = currentChunk + sentence;

            if (potentialChunk.length <= 1850) {
                currentChunk = potentialChunk;
            } else {
                chunks.push(currentChunk);
                currentChunk = sentence;
            }
        }

        if (currentChunk.length > 0) {
            chunks.push(currentChunk);
        }

        const outputData = JSON.stringify(chunks);

        fs.writeFile(outputFile, outputData, JSON, (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log(`File "${ outputFile }" written successfully.`);
        });
    });
    fs.appendFile('.gitignore', `\n${ outfile }\n${ infile }`, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}

parseAndWriteChunks(infile, outfile);

