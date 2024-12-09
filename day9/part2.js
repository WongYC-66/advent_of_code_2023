// https://adventofcode.com/2023/day/7
const { readFile } = require("../lib.js")

const extractData = (rawFile) => {
    return rawFile.map(s => s.split(' ').map(Number))
}

const findFrontPrediction = (nums) => {
    if (nums.every(n => n == 0)) {
        return 0
    }
    let nextRow = []
    for (let i = 1; i < nums.length; i++) {
        nextRow.push(nums[i] - nums[i - 1])
    }

    return nums.at(0) - findFrontPrediction(nextRow)
}

const sum = (arr) => {
    return arr.reduce((s, x) => s + x , 0)
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    console.log(rawFile)

    let allHistory = extractData(rawFile)
    console.log(allHistory)

    let prediction = allHistory.map(findFrontPrediction)
    console.log(prediction)

    let res = sum(prediction)
    console.log(res)
    return res
    // expected sample.txt = 114
    // expected input.txt = 1798691765
}


main()