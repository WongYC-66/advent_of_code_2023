// https://adventofcode.com/2023/day/2
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

const onlyValidGame = ([_, str]) => {
    str = str.replaceAll(";", ",")
    let arr = str.split(",").map(s => s.trim())
    let limit = {
        red : 12,
        green : 13,
        blue : 14,
    }
    console.log(arr)
    return arr.every(s => {
        let [num, color] = s.split(' ')
        return Number(num) <= limit[color]
    })
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    console.log(rawFile)
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")

    let gameArr = []
    rawFile.forEach(str => {
        let [game_id, remains] = str.split(":")
        let id = game_id.split(" ")[1]
        gameArr.push([Number(id), remains])
    })

    console.log(rawFile)
    // console.log(gameArr)
    let res = gameArr.filter(onlyValidGame).reduce((s, x) => s + x[0], 0)
    console.log(res)
    return res
}


main()