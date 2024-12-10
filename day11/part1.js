// https://adventofcode.com/2023/day/11
const { readFile } = require("../lib.js")

const expand = (rawFile) => {
    let grid = rawFile.map(s => s.split(''))
    let M = grid.length
    let N = grid[0].length

    const expandByRow = (arr) => {
        let newArr = []
        for (let r of arr) {
            newArr.push(r)
            if (r.every(c => c == '.')) {
                newArr.push(Array(N).fill('.'))
            }
        }
        return newArr
    }

    const expandByCol = (arr) => {
        let colIdx = []
        for (let c = 0; c < N; c++) {
            let colCells = []
            for (let r = 0; r < arr.length; r++) {
                colCells.push(arr[r][c])
            }
            if (colCells.every(cell => cell == '.')) colIdx.push(c)
        }

        let offset = 0
        for (let c of colIdx) {
            arr.forEach(r => {
                r.splice(c + offset, 0, '.')
            })
            offset += 1
        }
        return arr
    }

    grid = expandByRow(grid)
    grid = expandByCol(grid)
    return grid
}

const printGrid = grid => {
    console.log("\n")
    grid.forEach(arr => console.log(arr.join('')))
}

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

const findManhattanDistance = ([r1, c1, r2, c2]) => {
    return Math.abs(r1 - r2) + Math.abs(c1 - c2)
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

    let expandedUniverse = expand(rawFile)
    printGrid(expandedUniverse)

    let allGalaxyCoord = findGalaxy(expandedUniverse)
    console.log(allGalaxyCoord)

    let galaxyPairs = generatePairs(allGalaxyCoord)
    console.log(galaxyPairs)

    let dists = galaxyPairs.map(findManhattanDistance)

    let res = sum(dists)
    console.log(res)
    return res
    // expected sample.txt = 374
    // expected input.txt = 10173804
}


main()