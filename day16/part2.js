// https://adventofcode.com/2023/day/16
const { readFile } = require("../lib.js")

const letterToVector = {
    "N": [-1, 0],
    "S": [+1, 0],
    "E": [0, +1],
    "W": [0, -1],
}
const symbolToNextDir = {
    '/': {
        'E': ["N"],
        'S': ["W"],
        'W': ["S"],
        'N': ["E"],
    },
    '\\': {
        'E': ["S"],
        'N': ["W"],
        'W': ["N"],
        'S': ["E"],
    },
    '|': {
        'S': ["S"],
        'N': ["N"],
        'W': ["N", "S"],
        'E': ["N", "S"],
    },
    '-': {
        'E': ["E"],
        'W': ["W"],
        'N': ["W", "E"],
        'S': ["W", "E"],
    }
}

const solve = (rawFile, initialState) => {
    let ROW_MAX = rawFile.length
    let COL_MAX = rawFile[0].length
    const grid = rawFile

    let visited = Array.from(Array(ROW_MAX), () => Array(COL_MAX).fill(false))

    const generateNextLoc = (r, c, vectors) => {
        // console.log({ r, c, vectors })
        let locations = []
        for (let [dr, dc, nextDir] of vectors) {
            let nR = r + dr
            let nC = c + dc
            if (nR < 0 || nR == ROW_MAX || nC < 0 || nC == COL_MAX) continue
            locations.push([nR, nC, nextDir])
        }
        return locations
    }

    let seenStates = new Set()

    const iterativeDFS = () => {
        let q = initialState ? [initialState] : [[0, 0, "E"]]

        while (q.length) {
            let [r, c, incomingDir] = q.pop()    // dfs

            let state = `${r}-${c}-${incomingDir}`
            if (seenStates.has(state)) continue
            seenStates.add(state)
            visited[r][c] = true

            let symbol = grid[r][c]
            let vectors = symbol == '.'
                ? [[...letterToVector[incomingDir], incomingDir]]
                : symbolToNextDir[symbol][incomingDir].map(dir => [...letterToVector[dir], dir])

            let nextCoords = generateNextLoc(r, c, vectors)
            // console.log(nextCoords)
            nextCoords.forEach(([nR, nC, dir]) => {
                q.push([nR, nC, dir])
            })
        }
    }

    iterativeDFS()
    // NOT_WORKING : recursive dfs stack overflow
    // let dfs = (r, c, incomingDir) => {
    //     console.log({ r, c, incomingDir })
    //     // 0,1, "E"

    //     let state = `${r}-${c}-${incomingDir}`
    //     if(seenStates.has(state)) return 
    //     seenStates.add(state)
    //     visited[r][c] = true

    //     let symbol = grid[r][c]
    //     let vectors = symbol == '.'
    //         ? [[...letterToVector[incomingDir], incomingDir]]
    //         : symbolToNextDir[symbol][incomingDir].map(dir => [...letterToVector[dir], dir])

    //     let nextCoords = generateNextLoc(r, c, vectors)
    //     console.log(nextCoords)
    //     nextCoords.forEach(([nR, nC, dir]) => dfs(nR, nC, dir))
    // }

    // dfs(0, 0, "E")

    return visited.flat().filter(Boolean).length
}

const generateInitialStates = (grid) => {
    let M = grid.length
    let N = grid[0].length
    console.log({M, N})
    let states = []
    // topRow
    for (let c = 0; c < N; c++) {
        states.push([0, c, "S"])
    }

    // bottomRow
    for (let c = 0; c < N; c++) {
        states.push([M - 1, c, "N"])
    }

    // leftColumn
    for (let r = 0; r < M; r++) {
        states.push([r, 0, "E"])
    }

    // rightColumn
    for (let r = 0; r < M; r++) {
        states.push([r, N - 1, "W"])
    }

    return states
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    console.log(rawFile)

    let allInitialStates = generateInitialStates(rawFile)
    console.log(allInitialStates)

    let energizes = allInitialStates.map(state => solve(rawFile, state))
    console.log(energizes)

    let res = Math.max(...energizes)
    console.log(res)
    return res
    // expected sample.txt = 51
    // expected input.txt = 8221
}


main()