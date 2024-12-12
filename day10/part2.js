// https://adventofcode.com/2023/day/10
const { readFile } = require("../lib.js")

const N = [-1, 0]
const S = [+1, 0]
const E = [0, +1]
const W = [0, -1]

let charToDir = {
    '|': [N, S],
    '-': [E, W],
    'L': [N, E],
    'J': [N, W],
    '7': [S, W],
    'F': [S, E],
}

const findS = (grid) => {
    let M = grid.length
    let N = grid[0].length
    for (let r = 0; r < M; r++) {
        for (let c = 0; c < N; c++) {
            if (grid[r][c] == 'S') return [r, c]
        }
    }
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

    return (Math.abs(area) / 2) - (edge / 2) + 1
}

const getBoundaryCoords = (grid) => {
    const ROW_MAX = grid.length
    const COL_MAX = grid[0].length

    const isValidCoord = (r, c) => {
        return (r >= 0 && r < ROW_MAX) && (c >= 0 && c < COL_MAX)
    }

    const canConnect = (nR, nC) => {
        let nextChar = grid[nR][nC]
        if (nextChar == '.') return false
        let coords = charToDir[nextChar].map(([dr, dc]) => [nR + dr, nC + dc])
        return coords.some(([r, c]) => grid[r][c] == 'S')
    }

    const getNextCoord = (r, c) => {
        let curr = grid[r][c]
        for (let [dr, dc] of charToDir[curr]) {
            let nR = r + dr
            let nC = c + dc
            let nextCoord = `${nR}-${nC}`
            if (seen.has(nextCoord)) continue
            return [nR, nC]
        }
        return [null, null]
    }

    let seen = new Set()
    let vertices = []

    let [r, c] = findS(grid)
    let steps = 0

    while (true) {
        steps += 1
        let coord = `${r}-${c}`

        if (seen.has(coord) || coord == `null-null`) {
            break
        }
        seen.add(coord)

        let char = grid[r][c]

        // if is turningPoint = vertex
        if (/[SLJF7]/.test(char)) {
            vertices.push({ x: c, y: r })
        }

        // find next
        if (char == 'S') {
            for (let [dr, dc] of [N, S, E, W]) {
                let nR = r + dr
                let nC = c + dc
                if (!isValidCoord(nR, nC)) continue
                if (canConnect(nR, nC)) {
                    r = nR
                    c = nC
                    break
                }
            }
        } else {
            [r, c] = getNextCoord(r, c)
        }


    }

    return [seen, vertices]
}

const solve = (grid) => {
    let [boundaryCoords, vertices] = getBoundaryCoords(grid)

    let enclosed_area = calcPolygonArea(vertices)    
    return enclosed_area

    // ray-casting algo - Horizontal-crossing-boundary
    // https://www.youtube.com/watch?v=zhmzPQwgPg0&t=501s

    // let enclosed_tiles = 0

    // let M = grid.length
    // let N = grid[0].length

    // const plotted_grid = grid.map(str => str.split(''))

    // for (let r = 0; r < M; r++) {
    //     // imagine 1 line from this point to the LeftMost of grid
    //     // crossable =>   |   FJ  F---J   L7  L----7
    //     let cross = 0

    //     for (let c = 0; c < N; c++) {
    //         let char = grid[r][c]
    //         let str = `${r}-${c}`

    //         if (boundaryCoords.has(str)) {   // filter out junk pipe that is not connected 
    //             if (['F', '7', '|'].includes(char)) cross += 1
    //         } else {
    //             // console.log({ r, c, cross })
    //             if (cross % 2 === 1) {
    //                 // isOdd
    //                 enclosed_tiles += 1
    //                 plotted_grid[r][c] = 'I'
    //             } else {
    //                 plotted_grid[r][c] = 'O'
    //             }
    //         }
    //     }
    // }

    // printGrid(plotted_grid)

    // return enclosed_tiles
}


const main = async (fileName) => {
    // fileName = fileName ? fileName : "sample2.txt"
    // fileName = fileName ? fileName : "sample5.txt"
    // fileName = fileName ? fileName : "sample3.txt"
    // fileName = fileName ? fileName : "sample4.txt"
    fileName = fileName ? fileName : "input.txt"
    let rawFile = await readFile(`${fileName}`)
    console.log(rawFile)
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")

    let res = solve(rawFile)
    console.log(res)
    return res
    // expected sample2.txt = 4
    // expected sample3.txt = 8
    // expected sample4.txt = 10
    // expected sample5.txt = 4
    // expected input.txt = 407
}


main()

module.exports = {
    main
}