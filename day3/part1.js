// https://adventofcode.com/2023/day/1
const fs = require('node:fs/promises');

const readFile = async (fileName) => {
    try {
        const data = await fs.readFile(`./${fileName}`, { encoding: 'utf8' });
        // console.log(data);
        return data
    } catch (err) {
        console.log(err);
    }
}

const findEngines = (grid) => {
    let M = grid.length
    let N = grid[0].length
    let arr = []

    let dirs = [
        [0, -1],  // left 
        [-1, -1],  // top left 
        [-1, 0],  // top
        [-1, +1],  // top right 
        [0, +1],  // right
        [+1, +1],  // bot right
        [+1, 0],  // bot 
        [+1, -1],  // bot left
    ]

    for (let r = 0; r < M; r++) {

        let hasSymbol = false
        let str = ''

        for (let c = 0; c < N; c++) {
            let char = grid[r][c]

            if (/\d/.test(char)) {
                // if a number
                str += char
                // if (!hasSymbol) {
                dirs.forEach(([dr, dc]) => {
                    let nR = r + dr
                    let nC = c + dc
                    if (nR < 0 || nR == M || nC < 0 || nC == N) return
                    let nearbyChar = grid[nR][nC]
                    if (/\D/.test(nearbyChar) && !(/\./.test(nearbyChar))) {
                        hasSymbol = true
                    }
                })
                // }
            } else {
                if (str != '' && hasSymbol) {
                    // is a dot, add previous accummulated str
                    arr.push(Number(str))
                }
                str = ''
                hasSymbol = false
            }
        }

        // switch row
        if (str != '' && hasSymbol) {
            // is a dot, add previous accummulated str
            arr.push(Number(str))
        }
    }
    return arr
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    console.log(rawFile)
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")

    console.log(rawFile)
    let engines = findEngines(rawFile)
    console.log(engines)
    let res = engines.reduce((s, x) => s + x, 0)
    console.log(res)
    return res
}


main()