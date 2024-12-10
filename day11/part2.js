// https://adventofcode.com/2023/day/11
const { readFile } = require("../lib.js")

const findGalaxy = (grid) => {
    let coords = []
    let M = grid.length
    let N = grid[0].length

    for (let r = 0; r < M; r++) {
        for (let c = 0; c < N; c++) {
            if (grid[r][c] == '#') coords.push([r, c])
        }
    }
    return coords
}

const printGrid = grid => {
    console.log("\n")
    grid.forEach(arr => console.log(arr.join('')))
}

const generatePairs = (allGalaxyCoord) => {
    let pairs = []
    let N = allGalaxyCoord.length
    for (let i = 0; i < N - 1; i++) {
        for (let j = i + 1; j < N; j++) {
            let [r1, c1] = allGalaxyCoord[i]
            let [r2, c2] = allGalaxyCoord[j]
            pairs.push([r1, c1, r2, c2])
        }
    }
    return pairs
}

const findManhattanDistanceWithScale = ([r1, c1, r2, c2], scale, spaceMap) => {
    let count = 0

    for (let rowIdx of spaceMap.row) {
        let minR = Math.min(r1, r2)
        let maxR = Math.max(r1, r2)
        if (minR < rowIdx && rowIdx < maxR) count += 1   // pass thru the gap
    }

    for (let colIdx of spaceMap.col) {
        let minC = Math.min(c1, c2)
        let maxC = Math.max(c1, c2)
        if (minC < colIdx && colIdx < maxC) count += 1   // pass thru the gap
    }

    // console.log(r1, c1, r2, c2)
    // console.log("count : ", count, " dist: ", Math.abs(r1 - r2) + Math.abs(c1 - c2) + count * scale - count)

    return Math.abs(r1 - r2) + Math.abs(c1 - c2) + (count * scale) - count
}
const sum = (arr) => {
    return arr.reduce((s, x) => s + x, 0)
}

const generateSpaceMap = (grid) => {
    let spaceMap = {
        row: new Set(),
        col: new Set(),
    }
    // find ROW index that is clear
    for (let r = 0; r < grid.length; r++) {
        let row = grid[r]
        if (row.every(c => c == '.')) {
            spaceMap['row'].add(r)
        }
    }

    // find COL index that is clear
    for (let c = 0; c < grid[0].length; c++) {
        let colCells = []
        for (let r = 0; r < grid.length; r++) {
            colCells.push(grid[r][c])
        }
        if (colCells.every(cell => cell == '.')) {
            spaceMap['col'].add(c)
        }
    }
    return spaceMap
}


const main = async () => {
    let rawFile = await readFile("sample.txt")
    // let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    console.log(rawFile)

    const scale = 1000000

    let grid = rawFile.map(r => r.split(''))
    let spaceMap = generateSpaceMap(grid)
    let allGalaxyCoord = findGalaxy(grid)
    let galaxyPairs = generatePairs(allGalaxyCoord)

    let dists = galaxyPairs.map(pair => findManhattanDistanceWithScale(pair, scale, spaceMap))

    printGrid(grid)
    console.log(spaceMap)
    console.log(allGalaxyCoord)
    // console.log(galaxyPairs)


    let res = sum(dists)
    console.log(res)
    return res
    // expected sample.txt = 1030  // scale 10
    // expected sample.txt = 8410  // scale 100
    // expected input.txt = 634324905172 // scale 1000000
}


main()