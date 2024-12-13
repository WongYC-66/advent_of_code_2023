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

const getStateRange = (state) => {
    let sum = 1
    sum *= state.xmax - state.xmin + 1
    sum *= state.mmax - state.mmin + 1
    sum *= state.amax - state.amin + 1
    sum *= state.smax - state.smin + 1
    return sum
}

const solve = (graph) => {
    let initialState = { // initial state
        curr: "in",              // curr workflow
        xmin: 1, xmax: 4000,
        mmin: 1, mmax: 4000,
        amin: 1, amax: 4000,
        smin: 1, smax: 4000,
    }

    let total = 0

    const dfs = (state) => {
        // console.log(state.curr)
        // base case
        if (state.curr == "R") return
        if (state.curr == "A") {
            total += getStateRange(state)
            return
        }

        let workflows = graph[state.curr]
        // when passing thru workflow, modify curr, if branches out, 
        // create a copy of currstate and dfs the branches
        workflows.forEach(([spec, symbol, limit, next]) => {
            let nextState = { ...state, curr: next }         // next state for deeper level dfs

            if (symbol === "<") {            // <2500 split 1-4000  into 1-2499 and 2500-4000
                nextState[`${spec}max`] = Math.min(nextState[`${spec}max`], limit - 1)
                dfs(nextState)
                // modify curr state for nextfallback
                // state[`${spec}min`] = Math.max(state[`${spec}min`], nextState[`${spec}max`] + 1)
                state[`${spec}min`] = Math.max(state[`${spec}min`], limit)
            } else if (symbol === ">") { // >2500 split 1-4000  into 1-2500 and 2501-4000
                nextState[`${spec}min`] = Math.max(nextState[`${spec}min`], limit + 1)
                dfs(nextState)
                // state[`${spec}max`] = Math.min(state[`${spec}max`], nextState[`${spec}min`] - 1)
                state[`${spec}max`] = Math.min(state[`${spec}max`], limit)
            } else {
                // unconditional fallback
                dfs(nextState)
            }
        })
    }

    dfs(initialState)

    return total
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    console.log(rawFile)

    let { graph, _ } = extractData(rawFile)
    console.log(graph)

    let res = solve(graph)
    console.log(res)
    return res
    // expected sample.txt = 167409079868000
    // expected input.txt = 129249871135292
}

main()