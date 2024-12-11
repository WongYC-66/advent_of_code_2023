// https://adventofcode.com/2023/day/14
const { readFile } = require("../lib.js")

const sum = (arr) => {
    return arr.reduce((s, x) => s + x, 0)
}

const printGrid = (grid) => {
    console.log()
    grid.forEach(arr => console.log(arr.join('')))
}

const tiltNorth = (grid) => {
    let M = grid.length
    let N = grid[0].length

    const tiltColumn = (c, grid) => {
        let l = 0
        for (let r = 0; r < M; r++) {
            if (grid[r][c] == 'O') {
                swap(l, c, r, c, grid)
                l += 1
            } else if (grid[r][c] == '#') {
                l = r + 1
            }
        }
    }
    for (let c = 0; c < N; c++) {
        tiltColumn(c, grid)
    }
}

const tiltSouth = (grid) => {
    let M = grid.length
    let N = grid[0].length

    const tiltColumn = (c, grid) => {
        let l = M - 1
        for (let r = M - 1; r >= 0; r--) {
            if (grid[r][c] == 'O') {
                swap(l, c, r, c, grid)
                l -= 1
            } else if (grid[r][c] == '#') {
                l = r - 1
            }
        }
    }
    for (let c = 0; c < N; c++) {
        tiltColumn(c, grid)
    }
}

const tiltWest = (grid) => {
    let M = grid.length
    let N = grid[0].length
    const tiltRow = (r, grid) => {
        let l = 0
        for (let c = 0; c < N; c++) {
            if (grid[r][c] == 'O') {
                swap(r, l, r, c, grid)
                l += 1
            } else if (grid[r][c] == '#') {
                l = c + 1
            }
        }
    }
    for (let r = 0; r < M; r++) {
        tiltRow(r, grid)
    }
}

const tiltEast = (grid) => {
    let M = grid.length
    let N = grid[0].length
    const tiltRow = (r, grid) => {
        let l = N - 1
        for (let c = N - 1; c >= 0; c--) {
            if (grid[r][c] == 'O') {
                swap(r, l, r, c, grid)
                l -= 1
            } else if (grid[r][c] == '#') {
                l = c - 1
            }
        }
    }
    for (let r = 0; r < M; r++) {
        tiltRow(r, grid)
    }
}


const swap = (r1, c1, r2, c2, grid) => {
    let tmp = grid[r1][c1]
    grid[r1][c1] = grid[r2][c2]
    grid[r2][c2] = tmp
}

const getScore = (grid) => {
    let sum = 0
    let M = grid.length
    let N = grid[0].length
    for (let r = 0; r < M; r++) {
        for (let c = 0; c < N; c++) {
            if (grid[r][c] != 'O') continue
            sum += M - r
        }
    }
    return sum
}

const cycle = (grid) => {
    tiltNorth(grid)
    tiltWest(grid)
    tiltSouth(grid)
    tiltEast(grid)
}

const gridToSnapshot = (grid) => {
    return grid.map(arr => arr.join(''))
}

const gridToString = (grid) => {
    return grid.flat().join('')
}

const solve = (grid) => {
    const cycles = 1000000000

    let stringToCycle = {}
    let cycleInfo = null

    for (let i = 1; i < cycles; i++) {
        cycle(grid)
        let snapShot = gridToSnapshot(grid)
        let gridStr = gridToString(grid)
        if (gridStr in stringToCycle) {
            cycleInfo = [i, stringToCycle[gridStr].cycle]
            break
        }

        stringToCycle[gridStr] = { cycle: i, snapShot }
    }

    // console.log(stringToCycle)
    // console.log(cycleInfo)

    let [n2, n1] = cycleInfo
    let cycleSize = n2 - n1
    let nonRepeating = n1 - 1
    let targetCycle = ((cycles - nonRepeating - 1) % cycleSize) + n1
    console.log({ nonRepeating, cycles, targetCycle })

    // return grid
    grid = findSnapshotWithCycleNumber(targetCycle, stringToCycle)
    return grid
}

const findSnapshotWithCycleNumber = (cycle, stringToCycle) => {
    for (let k in stringToCycle) {
        if (stringToCycle[k].cycle === cycle)
            return stringToCycle[k].snapShot.map(str => str.split(''))
    }
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    // console.log(rawFile)

    let grid = rawFile.map(str => str.split(''))
    // printGrid(grid)

    grid = solve(grid)
    // printGrid(grid)

    let res = getScore(grid)
    console.log(res)
    return res
    // expected sample.txt = 64
    // expected input.txt = 84328
}


main()