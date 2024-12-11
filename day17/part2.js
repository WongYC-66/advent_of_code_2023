// https://adventofcode.com/2023/day/17
const { readFile } = require("../lib.js")
const { PriorityQueue } = require('@datastructures-js/priority-queue');

const dirs = {
    'N': [-1, 0],
    'S': [+1, 0],
    'E': [0, +1],
    'W': [0, -1],
}

const oppositeLetter = {
    'N': 'S',
    'S': 'N',
    'E': 'W',
    'W': 'E',
}

const solve = (grid) => {

    let M = grid.length
    let N = grid[0].length

    //djistra algo
    const minHeap = new PriorityQueue((a, b) => a.cost - b.cost)  // sort by cost ASC, [r,c,cost]
    minHeap.enqueue({ r: 0, c: 0, cost: 0, prevDir: null, dirCount: 0, steps: [[0, 0]] })

    let seen = new Set()

    while (minHeap.size()) {
        let { r, c, cost, prevDir, dirCount, steps } = minHeap.dequeue()
        // console.log({ r, c, prevDir, dirCount })

        if (r == M - 1 && c == N - 1 && dirCount >= 4) {
            console.log('found - ', cost)
            console.log(steps)
            return cost // found the lowest cost to each bottom right
        }

        let hashStr = `${r}-${c}-${prevDir}-${dirCount}`
        if (seen.has(hashStr)) continue
        seen.add(hashStr)

        for (let dir in dirs) {
            // dir = N/S/E/W
            let [dr, dc] = dirs[dir]
            let nR = r + dr
            let nC = c + dc
            if (nR < 0 || nR == M || nC < 0 || nC == N) continue
            let atTopLeft = (r == 0 && c == 0)
            if (!atTopLeft && dirCount < 4 && prevDir != dir) continue
            if (dir == oppositeLetter[prevDir]) continue // cannot walk reverse

            let nextDirCount = dir == prevDir ? dirCount + 1 : 1
            if (nextDirCount >= 11) continue  // at most 10 block

            let nextSteps = steps.slice()
            nextSteps.push([nR, nC])
            minHeap.enqueue({
                r: nR,
                c: nC,
                cost: cost + Number(grid[nR][nC]),
                prevDir: dir,
                dirCount: nextDirCount,
                steps: nextSteps
            })
        }
    }


    // use iterative DP
    // let M = grid.length
    // let N = grid[0].length
    // let offset = 3

    // let dp = Array.from(Array(M + 2 * offset), () => Array(N + 2 * offset).fill(Infinity))
    // console.log(M, N)
    // console.log(dp.length, dp[0].length)

    // for (let r = dp.length - 1 - offset; r >= offset; r--) {
    //     for (let c = dp[0].length - 1 - offset; c >= offset; c--) {
    //         let options = [
    //             // left 3
    //             dp[r][c - 1],
    //             dp[r][c - 2],
    //             dp[r][c - 3],
    //             // right 3
    //             dp[r][c + 1],
    //             dp[r][c + 2],
    //             dp[r][c + 3],
    //             // bottom 3
    //             dp[r + 1][c],
    //             dp[r + 2][c],
    //             dp[r + 3][c],
    //             // top 3
    //             dp[r - 1][c],
    //             dp[r - 2][c],
    //             dp[r - 3][c],
    //         ]
    //         let minCost = Math.min(...options)
    //         if (minCost == Infinity) minCost = 0
    //         console.log(r, c, r - offset, c - offset)
    //         dp[r][c] = Number(grid[r - offset][c - offset]) + minCost
    //     }
    // }

    // console.log(dp)
    // console.log(dp.length)
    // console.log(dp[0].length)
    // return dp[offset][offset]


}


const main = async () => {
    // let rawFile = await readFile("sample.txt")
    // let rawFile = await readFile("sample2.txt")
    let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    console.log(rawFile)

    let res = solve(rawFile)
    console.log(res)
    return res
    // expected sample.txt = 94
    // expected sample2.txt = 71
    // expected input.txt = 1027
}


main()