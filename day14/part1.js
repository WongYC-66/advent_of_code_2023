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
    let N = grid[0].length

    for (let c = 0; c < N; c++) {
        tiltColumn(c, grid)
    }
}

const tiltColumn = (c, grid) => {
    let M = grid.length
    // 2 pointers
    let l = 0

    for (let r = 0; r < M; r++) {
        if (grid[r][c] == 'O') {
            swap(l, c, r, c, grid)
            l += 1
        } else if(grid[r][c] == '#'){
            l = r + 1
        }
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
    for(let r = 0 ; r < M ; r++){
        for(let c = 0 ; c < N ; c++){
            if(grid[r][c] != 'O') continue
            sum += M - r
        }
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

    let grid = rawFile.map(str => str.split(''))
    printGrid(grid)

    tiltNorth(grid)
    printGrid(grid)

    let res = getScore(grid)
    console.log(res)
    return res
    // expected sample.txt = 136
    // expected input.txt = 108641
}


main()