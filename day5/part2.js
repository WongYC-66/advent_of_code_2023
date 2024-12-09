// https://adventofcode.com/2023/day/5
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

const makeIntervalMap = allMap => {
    let newMap = {}

    for (let key in allMap) {
        let newKey = key.split(" ")[0]
        let arr = allMap[key]
        arr = arr
            .map(str => {
                let [dest, src, range] = str.split(' ').map(Number)
                return [src, src + range - 1, dest - src]
            })      // [[start, end, val]]
            .sort((a, b) => a[0] - b[0])    // sort in asc
        newMap[newKey] = arr
    }
    return newMap
}

const findIntervalFromMap = (queue, intervals) => {
    // input : range // [5, 8]
    // return : intervals   // [ [1,3,offset], [2,4,offset]]
    let solve = []

    while (queue.length) {
        let [start2, end2] = queue.shift()
        let split = false

        for (let [start1, end1, offset] of intervals) {
            // get overlapped Value
            let overlapS = Math.max(start1, start2)
            let overlapE = Math.min(end1, end2)
            if (overlapS > overlapE) continue    // no overlap

            // overlap
            // matched the overlapped section and push to q
            split = true
            let overlap = [overlapS, overlapE].map(n => n + offset)
            solve.push(overlap)

            if (start2 < start1)
                queue.push([start2, start1 - 1])
            if (end1 < end2)
                queue.push([end1 + 1, end2])
        }

        if (!split) // nothing match, cant split further
            solve.push([start2, end2])
    }
    // console.log(n, " -> ", res)
    solve = solve.map(arr => arr.join(','))
    solve = new Set(solve)
    solve = [...solve].map(str => str.split(',').map(Number)).sort((a, b) => a[0] - b[0])
    console.log(solve)
    return solve
}

const reSeeds = (seeds) => {
    let seedIntervals = []
    for (let i = 0; i < seeds.length; i += 2) {
        let start = seeds[i]
        let range = seeds[i + 1]
        seedIntervals.push([start, start + range - 1])
    }
    return seedIntervals
}

const extractData = (rawFile) => {
    let M = rawFile.length
    let allMap = {}

    let i = 0
    let currKey = ''

    while (i < M) {
        if (rawFile[i] == '') {
            currKey = rawFile[i + 1]
            i += 2
        } else {
            if (!allMap[currKey]) allMap[currKey] = []
            allMap[currKey].push(rawFile[i])
            i += 1
        }
    }

    return allMap
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")

    let seeds = rawFile.splice(0, 1)[0].split(":")[1].trim().split(' ').map(Number)
    let allMap = extractData(rawFile)
    let intervalMap = makeIntervalMap(allMap)
    seeds = reSeeds(seeds, intervalMap['seed-to-soil'])


    // console.log(rawFile)
    console.log(allMap)
    console.log(intervalMap)
    console.log(seeds)

    let res = findIntervalFromMap(seeds, intervalMap['seed-to-soil'])
    res = findIntervalFromMap(res, intervalMap['soil-to-fertilizer'])
    res = findIntervalFromMap(res, intervalMap['fertilizer-to-water'])
    res = findIntervalFromMap(res, intervalMap['water-to-light'])
    res = findIntervalFromMap(res, intervalMap['light-to-temperature'])
    res = findIntervalFromMap(res, intervalMap['temperature-to-humidity'])
    res = findIntervalFromMap(res, intervalMap['humidity-to-location'])

    console.log("--------")
    console.log(res)
    res = Math.min(...res.flat())
    console.log(res)
    return res
}


main()


let s = `

[79,92] [55,67]   seeds
[81, 94] [57, 69] seed-to-soil
[81, 94] [57, 69] soil-to-fertilzier
[81, 94] [53, 56] [61, 69] fertilizer-to-water
[74, 87] [46, 49] [54, 62] water-to-light
[74, 87] [32, 56] [82, 85] [90, 98] light-to-temp
[74, 87] [33, 57] [82, 85] [90, 98] temp-to-humidity
[78, 80] [33, 55] [56, 57] [82, 85] [90, 92] [93, 96] [97, 98]

`