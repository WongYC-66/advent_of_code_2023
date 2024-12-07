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

const findDigit = (str, searchPattern) => {
    let curr = ''
    for(let c of str){
        curr += c
        for(let pattern of searchPattern){
            if(curr.includes(pattern))
                return pattern
        }
    }
}

const findLastDigit = (str, searchPattern) => {
    let curr = ''
    str = str.split('').reverse().join('')
    for(let c of str){
        curr = c + curr
        for(let pattern of searchPattern){
            if(curr.includes(pattern))
                return pattern
        }
    }
}

const to2Digit = (str) => {
    const numMap = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
    }
    const searchPattern = [
        '1', 'one',
        '2', 'two',
        '3', 'three',
        '4', 'four',
        '5', 'five',
        '6', 'six',
        '7', 'seven',
        '8', 'eight',
        '9', 'nine'
    ]

    let pairs = [
        findDigit(str, searchPattern),
        findLastDigit(str, searchPattern),
    ]

    pairs = pairs.map(str => {
        if (str in numMap) return numMap[str]
        return str
    })
    console.log(pairs)
    return Number(pairs.join(''))
}

const main = async () => {
    // let rawFile = await readFile("sample2.txt")
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