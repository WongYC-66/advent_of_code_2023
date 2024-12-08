// https://adventofcode.com/2023/day/3
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

    let symbolMap = {}      // coordinate : [nums] like { '0-1' : [100,200]} 

    for (let r = 0; r < M; r++) {

        let str = ''
        let coords = new Set()

        for (let c = 0; c < N; c++) {
            let char = grid[r][c]

            if (/\d/.test(char)) {
                // if a number
                str += char

                dirs.forEach(([dr, dc]) => {
                    let nR = r + dr
                    let nC = c + dc
                    if (nR < 0 || nR == M || nC < 0 || nC == N) return
                    let nearbyChar = grid[nR][nC]
                    if (/\D/.test(nearbyChar) && !(/\./.test(nearbyChar))) {
                        // is a symbol
                        let coord = `${nR}-${nC}`
                        coords.add(coord)
                    }
                })
            } else {
                //  nonDigit
                if (str != '') {
                    coords.forEach(coordStr => {
                        if (!symbolMap[coordStr]) symbolMap[coordStr] = []
                        symbolMap[coordStr].push(Number(str))
                    })
                }
                str = ''
                coords = new Set()
            }
        }

        // switch row, add in the buffer
        if (str != '') {
            coords.forEach(coordStr => {
                if (!symbolMap[coordStr]) symbolMap[coordStr] = []
                symbolMap[coordStr].push(Number(str))
            })
        }
    }

    console.log(symbolMap)
    let pairs = Object.values(symbolMap)
        .filter(arr => arr.length === 2)
        

    return pairs.map(arr => arr[0] * arr[1])
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    console.log(rawFile)
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")

    console.log(rawFile)
    let gearRatios = findEngines(rawFile)
    console.log(gearRatios)
    let res = gearRatios.reduce((s, x) => s + x, 0)
    console.log(res)
    return res
}


main()