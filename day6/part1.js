// https://adventofcode.com/2023/day/6
const { readFile } = require("../lib.js")

const extractData = (rawFile) => {
    let splitFn = str => str.split(':')[1].trim().replaceAll(/ +/g, " ").split(' ').map(Number)
    let times = splitFn(rawFile[0])
    let distances = splitFn(rawFile[1])

    let pairs = []

    times.forEach((t, i) => pairs.push([t, distances[i]]))
    return pairs
}

const findWaysToWin = ([time, distance]) => {
    let res = 0
    for (let t = 1; t < time - 1; t++) {
        let speed = t
        let travelled = speed * (time - t)
        if(travelled > distance) res += 1
    }
    return res
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    console.log(rawFile)

    const pairs = extractData(rawFile)
    let solve = pairs.map(findWaysToWin)
    
    console.log(pairs)
    console.log(solve)

    let res = solve.reduce((p, x) => p * x, 1)
    console.log(res)
    return res
    // expected sample.txt = 288
    // expected input.txt = 4811940
}


main()