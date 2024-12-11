// https://adventofcode.com/2023/day/15
const { readFile } = require("../lib.js")

const sum = (arr) => {
    return arr.reduce((s, x) => s + x, 0)
}

const hash = (str) => {
    let v = 0
    for (let c of str) {
        v += c.charCodeAt(0)
        v *= 17
        v %= 256
    }

    return v
}

const generateHash = (arr) => {
    let hashmap = {}    // {0 : [[label, power]]}

    const extractInfoNeg = (str) => {
        let label = str.slice(0, -1)
        let box = hash(label)
        return [label, box]
    }

    arr.forEach(str => {
        if (str.endsWith("-")) {
            let [label, box] = extractInfoNeg(str)
            if (hashmap[box]) hashmap[box] = hashmap[box].filter(([l, _]) => l != label)
            if (hashmap[box]?.length === 0) delete hashmap[box]
        } else {
            let [label, power] = str.split("=")
            let box = hash(label)
            if (!hashmap[box]) hashmap[box] = []

            // check if there is any with same Label
            let idx = hashmap[box].findIndex(([l, _]) => l == label)
            if (idx != -1) {
                hashmap[box][idx] = [label, power] // found, modify
            } else {
                hashmap[box].push([label, power]) // append if not found
            }
        }
    })
    return hashmap
}

const findScores = (hashmap) => {
    let sum = 0

    for (let box in hashmap) {
        let boxVal = Number(box) + 1
        hashmap[box].forEach(([_, power], i) => {
            sum += boxVal * (i + 1) * power
        })
    }
    return sum
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

    let hashMap = generateHash(codes)
    console.log(hashMap)

    let res = findScores(hashMap)
    console.log(res)
    return res
    // expected sample.txt = 145
    // expected input.txt = 212449
}


main()