// https://adventofcode.com/2023/day/13
const { readFile } = require("../lib.js")

const extractData = (rawFile) => {
    let allGrid = []
    let tmp = []

    for (let r of rawFile) {
        if (r == '') {
            allGrid.push(tmp)
            tmp = []
        } else {
            tmp.push(r)
        }
    }
    allGrid.push(tmp)
    return allGrid
}

const isHorizontalMirror = (r, grid) => {
    let M = grid.length
    let r2 = r + 1
    while (r >= 0 && r2 < M) {
        if (grid[r] != grid[r2]) return false
        r -= 1
        r2 += 1
    }
    return true
}

const isVerticalMirror = (c, colMap) => {
    let N = Object.keys(colMap).length
    let c2 = c + 1
    while (c >= 0 && c2 < N) {
        if (colMap[c] != colMap[c2]) return false
        c -= 1
        c2 += 1
    }
    return true
}

const makeVerticalMap = (grid) => {
    let M = grid.length
    let N = grid[0].length

    let colMap = {}

    for (let c = 0; c < N; c++) {
        let arr = []
        for (let r = 0; r < M; r++) {
            arr.push(grid[r][c])
        }
        colMap[c] = arr.join("")
    }
    return colMap
}

const findVal = (grid) => {
    let M = grid.length
    let N = grid[0].length

    // check horizontal
    for (let r = 0; r < M - 1; r++) {
        if (isHorizontalMirror(r, grid)) {
            return (r + 1) * 100
        }
    }

    // check vertical
    let colMap = makeVerticalMap(grid)
    for (let c = 0; c < N - 1; c++) {
        if (isVerticalMirror(c, colMap)) {
            return (c + 1)
        }
    }
}


const sum = (arr) => {
    return arr.reduce((s, x) => s + x, 0)
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    console.log(rawFile)

    const allGrid = extractData(rawFile)
    console.log(allGrid)

    const vals = allGrid.map(findVal)
    console.log(vals)

    let res = sum(vals)
    console.log(res)
    return res
    // expected sample.txt = 405
    // expected input.txt = ???
}


main()