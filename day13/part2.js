// https://adventofcode.com/2023/day/13
const { readFile } = require("../lib.js")

const extractData = (rawFile) => {
    let allGrid = []
    let tmp = []

    for (let r of rawFile) {
        if (r == '') {
            allGrid.push(tmp)
            tmp = []
        } else {
            tmp.push(r)
        }
    }
    allGrid.push(tmp)
    return allGrid
}

const isHorizontalMirror = (r, grid) => {
    let M = grid.length
    let r2 = r + 1
    while (r >= 0 && r2 < M) {
        if (grid[r] != grid[r2]) return false
        r -= 1
        r2 += 1
    }
    return true
}

const isVerticalMirror = (c, colMap) => {
    let N = Object.keys(colMap).length
    let c2 = c + 1
    while (c >= 0 && c2 < N) {
        if (colMap[c] != colMap[c2]) return false
        c -= 1
        c2 += 1
    }
    return true
}

const makeVerticalMap = (grid) => {
    let M = grid.length
    let N = grid[0].length

    let colMap = {}

    for (let c = 0; c < N; c++) {
        let arr = []
        for (let r = 0; r < M; r++) {
            arr.push(grid[r][c])
        }
        colMap[c] = arr.join("")
    }
    return colMap
}

const findVal = (grid, colMap, oriVal = undefined) => {
    let M = grid.length
    let N = grid[0].length
    // check horizontal
    for (let r = 0; r < M - 1; r++) {
        if (isHorizontalMirror(r, grid)) {
            let val = (r + 1) * 100
            if(val != oriVal) return val
        }
    }

    // check vertical
    for (let c = 0; c < N - 1; c++) {
        if (isVerticalMirror(c, colMap)) {
            let val = (c + 1)
            if(val != oriVal) return val
        }
    }

    return -1   // could not find
}

const findNewVal = (grid) => {
    let M = grid.length
    let N = grid[0].length
    
    let colMap = makeVerticalMap(grid)
    
    let oriVal = findVal(grid, colMap)
    console.log(grid)
    console.log(colMap)
    console.log(oriVal)

    const updateGridAndColMap = (newSymbol, r, c, oriHori, oriVerti) => {
        // newVal is '#' or '.'
        let newHori = oriHori.split('')
        newHori[c] = newSymbol
        grid[r] = newHori.join('')

        let newVerti = oriVerti.split('')
        newVerti[r] = newSymbol
        colMap[c] = newVerti.join('')
    }

    // brute force backtrack
    for (let r = 0; r < M; r++) {
        for (let c = 0; c < N; c++) {
            let newSymbol = grid[r][c] == '.' ? '#' : '.'

            let oriHori = grid[r]
            let oriVerti = colMap[c]

            updateGridAndColMap(newSymbol, r, c, oriHori, oriVerti)

            // check
            let newVal = findVal(grid, colMap, oriVal)
            // undo
            grid[r] = oriHori
            colMap[c] = oriVerti

            // decision
            // console.log(r, c, newVal, newSymbol)
            if (newVal == -1 || newVal == oriVal) continue   // couldn't find, skip
            return newVal   // found
        }
    }

}


const sum = (arr) => {
    return arr.reduce((s, x) => s + x, 0)
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    console.log(rawFile)

    const allGrid = extractData(rawFile)
    console.log(allGrid)

    const vals = allGrid.map(findNewVal)
    console.log(vals)

    let res = sum(vals)
    console.log(res)
    return res
    // expected sample.txt = 400
    // expected input.txt = 35335
}


main()