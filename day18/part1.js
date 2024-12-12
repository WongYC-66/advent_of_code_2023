// https://adventofcode.com/2023/day/18
const { readFile } = require("../lib.js")

const printGrid = (grid) => {
    console.log(grid.map(arr => arr.join('')))
}

const getSize = (digCommands) => {
    let minR = Infinity
    let maxR = -Infinity
    let minC = Infinity
    let maxC = -Infinity

    let r = 0
    let c = 0

    for (let [dir, len, _] of digCommands) {
        len = Number(len)
        if (dir == 'R') {
            c += len
        } else if (dir == 'D') {
            r += len
        } else if (dir == 'L') {
            c -= len
        } else {
            // 'U'
            r -= len
        }
        minR = Math.min(minR, r)
        maxR = Math.max(maxR, r)
        minC = Math.min(minC, c)
        maxC = Math.max(maxC, c)
    }

    let M = maxR - minR + 1
    let N = maxC - minC + 1
    return [M, N]
}

const digR = (r, c, len, grid) => {
    // ->
    for (let i = 1; i <= len; i++) {
        grid[r][c + i] = '#'
    }
    return [r, c + len]
}

const digD = (r, c, len, grid) => {
    // down
    for (let i = 1; i <= len; i++) {
        grid[r + i][c] = '#'
    }
    return [r + len, c]
}

const digL = (r, c, len, grid) => {
    // <-
    for (let i = 1; i <= len; i++) {
        grid[r][c - i] = '#'
    }
    return [r, c - len]
}

const digU = (r, c, len, grid) => {
    // up
    for (let i = 1; i <= len; i++) {
        grid[r - i][c] = '#'
    }
    return [r - len, c]
}

const checkInside = (r, c, intervals) => {
    let isInside = false
    for (let [p1r, p1c, p2r, p2c] of intervals) {
        if (r > Math.min(p1r, p2r)) {
            if (r <= Math.max(p1r, p2r)) {
                if (c <= Math.max(p1c, p2c)) {
                    const c_intersection = ((r - p1r) * (p2c - p1c)) / (p2r - p1r) + p1c;
                    if (p1c === p2c || c <= c_intersection) {
                        isInside = !isInside;
                    }
                }
            }
        }
    }
    // console.log(r,c,isInside)
    return isInside
}

const digInterior = (grid, intervals) => {
    let M = grid.length
    let N = grid[0].length
    // ray-casting algo => check horziontal to leftmost
    // for (let r = 0; r < M; r++) {
    //     let edge = 0
    //     let c = 0
    //     while (c < col_boundary) {
    //         if (grid[r][c] == '#') {    // hit a dug edge boundary,
    //             while (grid[r][c] == '#') {
    //                 c += 1
    //             }
    //             edge += 1
    //         }
    //         if (c >= col_boundary) break
    //         // "."
    //         if (edge % 2 === 1) { // odd = internal
    //             grid[r][c] = '#'
    //         }
    //         c += 1
    //     }

    // }
    for (let r = 0; r < M; r++) {
        for (let c = 0; c < N; c++) {
            if (grid[r][c] == '#') continue
            let isInside = checkInside(r, c, intervals)
            if (isInside) grid[r][c] = '#'
        }
    }
}

const solve = (digCommands) => {

    let [M, N] = getSize(digCommands)
    console.log({ M, N })

    // since we dont know direction, make twice big, and place our dig area at center
    let grid = Array.from(Array(3 * M), () => Array(3 * N).fill("."))
    // let grid = Array.from(Array(M), () => Array(N).fill("."))
    let row_offset = M
    let col_offset = N
    // let row_offset = 0
    // let col_offset = 0
    grid[0 + row_offset][0 + col_offset] = '#'

    const digFnMap = {
        'R': digR,
        'D': digD,
        'L': digL,
        'U': digU,
    }

    const intervals = [] // [[p1, p2], [p2, p3], ...]

    // dig 
    let r = 0 + row_offset
    let c = 0 + col_offset
    for (let [dir, len, _] of digCommands) {
        // console.log(dir, len, r, c, _)
        len = Number(len)
        let digFn = digFnMap[dir]
        let [nR, nC,] = digFn(r, c, len, grid)
        intervals.push([r, c, nR, nC])
        r = nR
        c = nC
    }

    // dig interior
    // const row_boundary = row_offset + M
    // const col_boundary = col_offset + N
    console.log(intervals)
    // digInterior(grid, row_boundary, col_boundary)
    digInterior(grid, intervals)

    printGrid(grid)
    return grid.flat().filter(c => c == '#').length
}


const main = async () => {
    let rawFile = await readFile("sample.txt")
    // let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    console.log(rawFile)

    let digCommands = rawFile.map(str => str.split(" "))
    console.log(digCommands)

    let res = solve(digCommands)
    console.log(res)
    return res
    // expected sample.txt = 62
    // expected input.txt = 47527
}

main()