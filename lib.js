const fs = require('node:fs/promises');

async function readFile(fileName) {
    try {
        const data = await fs.readFile(`./${fileName}`, { encoding: 'utf8' });
        return data
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    readFile
}