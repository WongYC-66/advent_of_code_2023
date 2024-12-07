// https://adventofcode.com/2023/day/1
const fs = require('node:fs/promises');

const readFile = async (fileName) => {
    try {
        const data = await fs.readFile(`./${fileName}`, { encoding: 'utf8' });
        // console.log(data);
        return data
    } catch (err) {
        console.log(err);
    }
}

const to2Digit = (str) => {
    let nums = str.match(/\d/g)
    let pairs = [nums[0], nums.at(-1)]
    return Number(pairs.join(''))
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    console.log(rawFile)
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")

    console.log(rawFile)
    let sum = rawFile.map(to2Digit).reduce((s, x) => s + x, 0)

    console.log(sum)
    return sum
}


main()