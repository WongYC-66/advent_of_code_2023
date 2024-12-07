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

const findPower = ([_, str]) => {
    str = str.replaceAll(";", ",")
    let maxMap = {
        red: -Infinity,
        green: -Infinity,
        blue: -Infinity
    }
    let arr = str.split(",").map(s => s.trim())
    console.log(arr)
    arr.forEach(s => {
        let [num, color] = s.split(' ')
        maxMap[color] = Math.max(maxMap[color], Number(num))
    })

    return Object.values(maxMap).reduce((p, x) => p * x, 1)
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
    let res = gameArr.map(findPower).reduce((s, x) => s + x, 0)
    console.log(res)
    return res
}


main()