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
                let [val, start, range] = str.split(' ').map(Number)
                return [start, start + range - 1, val]
            })      // [[start, end, val]]
            .sort((a, b) => a[0] - b[0])    // sort in asc
        newMap[newKey] = arr
    }
    return newMap
}

const findValFromMap = (n, intervals) => {
    let res = n
    for (let [start, end, nextValStart] of intervals) {
        if (start <= n && n <= end) {
            // within this range
            let gap = n - start
            res = nextValStart + gap
            break
        }
    }
    console.log(n, " -> ", res)
    return res
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    console.log(rawFile)
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")

    let allMap = {}
    let seeds = rawFile.splice(0, 1)[0].split(":")[1].trim().split(' ').map(Number)

    let M = rawFile.length
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
    const intervalMap = makeIntervalMap(allMap)

    console.log(rawFile)
    console.log(seeds)
    console.log(allMap)
    console.log(intervalMap)

    let res = seeds
        .map(n => findValFromMap(n, intervalMap['seed-to-soil']))
        .map(n => findValFromMap(n, intervalMap['soil-to-fertilizer']))
        .map(n => findValFromMap(n, intervalMap['fertilizer-to-water']))
        .map(n => findValFromMap(n, intervalMap['water-to-light']))
        .map(n => findValFromMap(n, intervalMap['light-to-temperature']))
        .map(n => findValFromMap(n, intervalMap['temperature-to-humidity']))
        .map(n => findValFromMap(n, intervalMap['humidity-to-location']))

   

    console.log(res)
    res = Math.min(...res)
    console.log(res)
    return res
}


main()