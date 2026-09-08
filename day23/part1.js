const fs = require("fs");

const solve = (arr) => {

    const M = arr.length
    const N = arr[0].length
    // START = [0, 1]
    // END = [M -1 , N - 2]

    const dirs = [
        [-1, 0, "v"],        // dr,dc,symbolCannot
        [+1, 0, "^"],
        [0, -1, ">"],
        [0, +1, "<"],
    ]

    let locToStep = Array(M).fill().map(_ => Array(N).fill(-1))

    console.log({ M, N })

    const dfs = (r, c, step, prevR, prevC) => {
        if (r == M - 1 && c == N - 2) {
            return step
        }

        if (locToStep[r][c] !== -1 && locToStep[r][c] >= step) {
            return 0
        }
        locToStep[r][c] = step

        // console.log({ r, c, step })
        let res = 0

        if (arr[r][c] == ".") {
            // find neighbor "."
            for (let [dr, dc, blockSymbol] of dirs) {
                let nR = r + dr
                let nC = c + dc
                if (nR < 0 || nR == M || nC < 0 || nC == N) continue
                if (nR == prevR && nC == prevC) continue // dont go uturn
                if (arr[nR][nC] == "#") continue // wall
                if (arr[nR][nC] == blockSymbol) continue // cannot go slide
                res = Math.max(res, dfs(nR, nC, step + 1, r, c))
            }
        }

        // "<" ">"  "^" "v"
        switch (arr[r][c]) {
            case "^":
                res = dfs(r - 1, c, step + 1, r, c)
                break;
            case "v":
                res = dfs(r + 1, c, step + 1, r, c)
                break;
            case "<":
                res = dfs(r, c - 1, step + 1, r, c)
                break;
            case ">":
                res = dfs(r, c + 1, step + 1, r, c)
                break;
        }

        return res
    }

    return dfs(0, 1, 0, -1, -1)   // starting S is not counted
}

const main = (fileName) => {

    const lines = fs.readFileSync(fileName, "utf8")
        .split("\r\n");

    const arr = []

    for (let ln of lines) {
        arr.push(ln.split(''))
        console.log(ln)
    }

    // console.log(arr)
    return solve(arr)
}


// console.log(main("sample.txt"))   // RUN FOR SAMPLE , #94

console.log(main("input.txt"))   // RUN FOR FULL INPUT, CORRECT = 2230




