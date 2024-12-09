// https://adventofcode.com/2023/day/7
const { dir } = require("console")
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

const findStartNodes = (graph) => {
    let nodes = []
    for (let node in graph) {
        if (node.endsWith('A')) nodes.push(node)
    }
    return nodes
}

const findIdxWithZ = (node, dirs, graph) => {
    // assume will have way to reached
    let N = dirs.length
    let i = 0
    let step = 0
    let seen = new Set()
    let res = []

    while (true) {
        let state = `${i}-${node}`
        if (seen.has(state))
            break   // cycle
        seen.add(state)

        if (node.endsWith('Z'))
            res.push(step)

        let [left, right] = graph[node]
        node = dirs[i] == 'L' ? left : right

        step += 1
        i = (i + 1) % N
    }

    console.log(step)
    return res
}

const gcd = (a, b) => {
    if (a == 0)
        return b;
    return gcd(b % a, a);
}

const lcm = (a, b) => {
    return (a * b) / gcd(a, b)
}



const main = async () => {
    // let rawFile = await readFile("sample2.txt")
    let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    console.log(rawFile)

    let [dirs, graph] = extractData(rawFile)
    let startNodes = findStartNodes(graph)
    let indexWithZ = startNodes.map(node => findIdxWithZ(node, dirs, graph))    // loop until it hit cycle of self
    
    console.log(dirs)
    console.log(graph)
    console.log(startNodes)
    console.log(indexWithZ)
    
    // find LCM of all
    let res = indexWithZ.reduce((accu, x) => lcm(accu, x), 1)
    console.log(res)
    return res
    // expected sample.txt = 6
    // expected input.txt = 23977527174353
}


main()

// Step 0: You are at 11A and 22A.
// Step 1: You choose all of the left paths, leading you to 11B and 22B.
// Step 2: You choose all of the right paths, leading you to 11Z and 22C.
// Step 3: You choose all of the left paths, leading you to 11B and 22Z.
// Step 4: You choose all of the right paths, leading you to 11Z and 22B.
// Step 5: You choose all of the left paths, leading you to 11B and 22C.
// Step 6: You choose all of the right paths, leading you to 11Z and 22Z.