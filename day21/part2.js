// https://adventofcode.com/2023/day/21
const { readFile } = require("../lib.js")

const printGrid = (grid) => {
    console.log(grid.map(arr => arr.join('')))
}

const solve = (grid, MAX_STEP) => {
    let M = grid.length
    let N = grid[0].length

    const findStart = () => {
        for (let r = 0; r < M; r++) {
            for (let c = 0; c < N; c++) {
                if (grid[r][c] == 'S') return [r, c]
            }
        }
    }

    const isTheSpotRock = (r, c) => {
        r %= M
        c %= N
        if (r < 0) r = M + r
        if (c < 0) c = N + c
        return grid[r][c] == '#'
    }

    const dirs = [[-1, 0], [+1, 0], [0, -1], [0, +1]]

    let [r, c] = findStart(grid)

    let q = [[r, c, 0]]

    let step = 0
    let seen = new Set()
    while (step < MAX_STEP) {
        let len = q.length
        for (let i = 0; i < len; i++) {
            let [r, c, count] = q.shift()

            let key = [r, c, count].join('-')
            if (seen.has(key)) continue
            seen.add(key)

            for (let [dr, dc] of dirs) {
                let nR = r + dr
                let nC = c + dc
                // if (nR < 0 || nR == M || nC < 0 || nC == N) continue
                if (isTheSpotRock(nR, nC)) continue
                q.push([nR, nC, count + 1])
            }
        }
        step += 1
    }

    let visited = new Set()
    while (q.length) {
        let [r, c] = q.pop()
        let key = [r, c].join('-')
        visited.add(key)
    }

    return visited.size
}

const main = async () => {

    let rawFile = await readFile("sample.txt")
    // let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    console.log(rawFile)

    // const MAX_STEP = 6
    // const MAX_STEP = 10
    // const MAX_STEP = 50
    const MAX_STEP = 100
    // const MAX_STEP = 500
    // const MAX_STEP = 1000
    // const MAX_STEP = 5000
    // const MAX_STEP = 26501365


    let res = solve(rawFile, MAX_STEP)
    console.log(res)
    return res
    // expected sample.txt = 16         // 6 step
    // expected sample.txt = 50         // 10 step
    // expected sample.txt = 1594       // 50 step
    // expected sample.txt = 6536       // 100 step
    // expected sample.txt = 167004     // 500 step
    // expected sample.txt = 668697     // 1000 step
    // expected sample.txt = 16733044   // 5000 step
    // expected input.txt = ??          // 26501365

}

const run = async () => {
    console.time("runtime");
    await main()
    console.timeEnd("runtime");
}

run()