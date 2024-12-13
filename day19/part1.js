// https://adventofcode.com/2023/day/19
const { readFile } = require("../lib.js")

const extractData = (rawFile) => {
    let graph = {}
    let parts = []

    // extract 
    let isWorflow = true
    for (let str of rawFile) {
        if (str == "") {
            isWorflow = false
            continue
        }
        if (isWorflow) {
            let regex = /(\w+)({.+?})/
            let [_, key, conditions] = str.match(regex)
            // console.log(key, conditions)
            graph[key] = conditions
        } else {
            let specs = str.slice(1, -1).split(',')
            let part = {}
            specs.forEach(s => {
                let [key, val] = s.split('=')
                part[key] = Number(val)
            })
            parts.push(part)
        }
    }

    // process conditionals
    for (let k in graph) {
        let str = graph[k].slice(1, -1)
        let conditionals = []
        str.split(",").forEach(s => {
            if (s.includes(":")) {
                let regex = /(.)([<>])(\d+):(.+)/
                let [_, mat, symbol, val, next] = s.match(regex)
                conditionals.push([mat, symbol, Number(val), next])
            } else {
                conditionals.push([true, true, true, s])
            }
        })
        graph[k] = conditionals
    }

    return { graph, parts }
}

const myFilterFn = (part, graph) => {
    console.log(part)
    const dfs = (curr) => {
        console.log(curr)
        if (curr == "A") return true
        if (curr == "R") return false

        for (let [spec, symbol, val, next] of graph[curr]) {
            if(spec == true) return dfs(next) // last

            let isPass = false
            if (symbol == ">") {
                isPass = part[spec] > val
            } else if (symbol == "<") {
                isPass = part[spec] < val
            }
            if (isPass) return dfs(next)    // skip the rest
        }
    }

    return dfs("in")
}

const findSum = (passedPart) => {
    let sum = 0
    passedPart.forEach(part => {
        let partSum = Object.values(part).reduce((s, x) => s + x, 0)
        sum += partSum
    })
    return sum
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    console.log(rawFile)

    let { graph, parts } = extractData(rawFile)
    console.log(graph)
    console.log(parts)

    let passedPart = parts.filter(part => myFilterFn(part, graph))
    console.log(passedPart)

    let res = findSum(passedPart)
    console.log(res)
    return res
    // expected sample.txt = 19114
    // expected input.txt = 421983
}

main()