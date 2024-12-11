// https://adventofcode.com/2023/day/15
const { readFile } = require("../lib.js")

const sum = (arr) => {
    return arr.reduce((s, x) => s + x, 0)
}

const hash = (str) => {
    let v = 0
    for(let c of str){
        v += c.charCodeAt(0)
        v *= 17
        v %= 256
    }

    return v
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    console.log(rawFile)

    let codes = rawFile[0].split(',')
    console.log(codes)
    let scores = codes.map(hash)
    console.log(scores)

    let res = sum(scores)
    console.log(res)
    return res
    // expected sample.txt = 1320
    // expected input.txt = 510273
}


main()