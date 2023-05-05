const fs = require('fs');
const infile = 'cloudsplitter.txt';
const outfile = 'output.json';

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

            if (potentialChunk.length <= 1900) {
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
}

parseAndWriteChunks(infile, outfile);