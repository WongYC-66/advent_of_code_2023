// https://adventofcode.com/2023/day/7
const { readFile } = require("../lib.js")

const extractData = (rawFile) => {
    let dirs = rawFile[0]
    let graph = {}       //  ['AAA' : ['BBB', 'BBB']]

    let regex = /\w{3}/g
    for (let i = 2; i < rawFile.length; i++) {
        let [src, left, right] = rawFile[i].match(regex)
        graph[src] = [left, right]
    }
    return [dirs, graph]
}

const travel = (dirs, graph) => {
    // assume will have way to reached
    let N = dirs.length

    let step = 0
    let curr = 'AAA'
    let i = 0

    while (curr != 'ZZZ') {
        let [left, right] = graph[curr]
        curr = dirs[i] == 'L' ? left : right
        
        step += 1
        i = (i + 1) % N
    }

    return step
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    console.log(rawFile)

    let [dirs, graph] = extractData(rawFile)
    console.log(dirs)
    console.log(graph)

    let res = travel(dirs, graph)
    console.log(res)
    return res
    // expected sample.txt = 6
    // expected input.txt = 21797
}


main()