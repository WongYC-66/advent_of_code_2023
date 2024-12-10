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

const printGrid = (grid) => {
    console.log(grid.map(arr => arr.join('')))
}

const labelBoundary = (grid, boundaryCoords) => {
    let M = grid.length
    let N = grid[0].length
    let plotted_grid = Array.from(Array(M), () => Array(N).fill("."))

    for (let str of boundaryCoords) {
        let [r, c] = str.split('-')
        plotted_grid[r][c] = '#'
    }
    return plotted_grid
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

const solve = (grid) => {
    let [boundaryCoords, boundaryIntervals] = getBoundaryCoords(grid)

    let label_grid = labelBoundary(grid, boundaryCoords)
    printGrid(label_grid)
    console.log(boundaryIntervals)

    // use ray casting algorithm
    const ROW_MAX = grid.length
    const COL_MAX = grid[0].length

    let res = 0
    for (let r = 0; r < ROW_MAX; r++) {
        for (let c = 0; c < COL_MAX; c++) {
            let cell = grid[r][c]
            if (cell != '.') continue
            if (isCrossBoundaryCountOdd(r, c, boundaryIntervals)){ 
                res += 1
                label_grid[r][c] = 'I'
            }
        }
    }
    printGrid(label_grid)
    return res
}

const isCrossBoundaryCountOdd = (r, c, boundaryIntervals) => {
    // to the top
    let count = 0

    const isVerticalIntersect = ([r2, c2], [r3, c3]) => {
        // assume from bottom[node] to top boundary
        if(r <= r2 || r <= r3) return false   // if line below node, invalid
        let minC = Math.min(c2, c3)
        let maxC = Math.max(c2, c3)
        return (minC <= c && c <= maxC) // is within column
    }

    boundaryIntervals.forEach(([p1, p2]) => {
        if(isVerticalIntersect(p1, p2)) count += 1
    })
    console.log(r, c, count, count % 2 === 1)
    return count % 2 === 1
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
    let boundaryIntervals = []

    let [r, c] = findS(grid)
    let turningPoint = [r, c] // default "S"
    let steps = 0

    while (true) {
        steps += 1
        let coord = `${r}-${c}`
        let currR = r
        let currC = c

        if (seen.has(coord) || coord == `null-null`) {
            break
        }
        seen.add(coord)

        let char = grid[r][c]
        // console.log(char, coord)

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

        const isBackToS = (r == null && c == null)
        // record intervals if next loop is a turning point
        if (isBackToS || !/[|\-.]/.test(grid[r][c])) {  // is TurningPoint
            boundaryIntervals.push([turningPoint, [currR, currC]])
            turningPoint = [r, c]
        }
    }

    // return seen
    return [seen, boundaryIntervals]
}

const main = async (fileName) => {
    // fileName = fileName ? fileName : "sample2.txt"
    // fileName = fileName ? fileName : "sample5.txt"
    // fileName = fileName ? fileName : "sample3.txt"
    fileName = fileName ? fileName : "sample4.txt"
    // fileName = fileName ? fileName : "input.txt"
    let rawFile = await readFile(`${fileName}`)
    // console.log(rawFile)
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
    // expected input.txt = ???
    //  149 too low
}


main()

module.exports = {
    main
}