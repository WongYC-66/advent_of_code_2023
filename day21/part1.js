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

    const dirs = [[-1, 0], [+1, 0], [0, -1], [0, +1]]

    let [r, c] = findStart(grid)

    let q = [[r, c, MAX_STEP]]

    let visited = Array.from(Array(M), () => Array(N).fill(false))
    let ans = new Set()

    while (q.length) {
        let [r, c, step] = q.shift()
        
        if(visited[r][c]) continue
        visited[r][c] = true
        
        let key = [r, c, step].join('-')
        if (step % 2 === 0) { // if even, can always travel back to this spot
            ans.add(key)
        }

        if (step == 0) continue

        for (let [dr, dc] of dirs) {
            let nR = r + dr
            let nC = c + dc
            if (nR < 0 || nR == M || nC < 0 || nC == N) continue
            if (grid[nR][nC] == '#') continue
            q.push([nR, nC, step - 1])
        }
    }

    return ans.size
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    console.log(rawFile)

    // const MAX_STEP = 6
    const MAX_STEP = 64


    let res = solve(rawFile, MAX_STEP)
    console.log(res)
    return res
    // expected sample.txt = 16
    // expected input.txt = 3532
}

main()