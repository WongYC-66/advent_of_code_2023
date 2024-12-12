// https://adventofcode.com/2023/day/18
const { readFile } = require("../lib.js")
const converter = require('hex2dec');

const extractData = (rawFile) => {
    let decoded = []    // [['R', '6', _]]

    const codeToDir = {
        '0': 'R',
        '1': 'D',
        '2': 'L',
        '3': 'U',
    }

    rawFile
        .map(str => str.split(" "))
        .forEach(([_, __, colorCode]) => {
            let lenCode = "0x" + colorCode.slice(2, 7)
            let dirCode = colorCode[7]
            decoded.push([codeToDir[dirCode], converter.hexToDec(lenCode), null])
        })

    return decoded
}

function calcPolygonArea(vertices) {
    let area = 0;

    // area

    // p1 = (1, 6), p2 = (3,1), p3 = (7,2)
    // 2A =  |1 3| + |3 7| + |7 1|
    //       |6 1|   |1 2|   |2 6|
    // 2A = (1 - 18) + (6 - 7) + (42 - 2)
    // A = () / 2
    // Math.abs(A)

    for (let i = 0; i < vertices.length; i++) {
        let p1 = vertices[i]
        let p2 = vertices[(i + 1) % vertices.length]

        area += (p1.x * p2.y)
        area -= (p1.y * p2.x)
    }

    let edge = 0
    for (let i = 0; i < vertices.length; i++) {
        let p1 = vertices[i]
        let p2 = vertices[(i + 1) % vertices.length]
        edge += Math.abs((p1.x - p2.x) + (p1.y - p2.y))
    }

    return (Math.abs(area) / 2) + (edge / 2) + 1
}

const digR = (r, c, len) => {
    return [r, c + len] // ->
}

const digD = (r, c, len) => {
    return [r + len, c]     // down
}

const digL = (r, c, len) => {
    return [r, c - len]  // <-
}

const digU = (r, c, len) => {
    return [r - len, c]     // up
}

const solve = (digCommands) => {

    const vertices = [] // [{x: __, y: __}]

    const dirToNextLocFnMap = {
        'R': digR,
        'D': digD,
        'L': digL,
        'U': digU,
    }

    // dig 
    let r = 0
    let c = 0
    for (let [dir, len, _] of digCommands) {
        len = Number(len)
        let nextLocFn = dirToNextLocFnMap[dir]
        let [nR, nC,] = nextLocFn(r, c, len)
        vertices.push({ x: nC, y: nR, })
        r = nR
        c = nC
    }
    console.log(vertices)

    let res = calcPolygonArea(vertices)

    return res
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    console.log(rawFile)

    let digCommands = extractData(rawFile)
    console.log(digCommands)

    let res = solve(digCommands)
    console.log(res)
    return res
    // expected sample.txt = 952408144115
    // expected input.txt = 52240187443190
}

main()