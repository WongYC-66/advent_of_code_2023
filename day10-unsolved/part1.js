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

const solve = (grid) => {
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
        console.log(char, coord)

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

    return (steps - 1) / 2
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

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    console.log(rawFile)
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")

    let res = solve(rawFile)
    console.log(res)
    return res
    // expected sample.txt = 8
    // expected input.txt = 1798691765
}


main()