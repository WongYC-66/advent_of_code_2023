// https://adventofcode.com/2023/day/20
const { readFile } = require("../lib.js")

const extractData = (rawFile) => {
    let graph = {}
    let parts = {}

    for (let str of rawFile) {
        let [left, right] = str.split("->")
        let type = left[0]
        let label = left.includes("broadcaster") ? "broadcaster" : left.trim().slice(1,)
        let next = right.split(',').map(s => s.trim())
        graph[label] = next

        // add to parts
        let part = { type }
        if (type == "%") {
            part.status = 0     // flipflop default to off
        }

        if (label != "broadcaster") parts[label] = part
    }
    giveConjunctionDefaults(parts, rawFile)

    return { graph, parts }
}

const giveConjunctionDefaults = (parts, rawFile) => {
    for (let str of rawFile) {
        let [left, right] = str.split("->")
        let label = left.includes("broadcaster") ? "broadcaster" : left.trim().slice(1,)
        let next = right.split(',').map(s => s.trim())

        next.forEach(nextLabel => {
            if (parts[nextLabel] && parts[nextLabel].type == '&') {
                if (!parts[nextLabel].inputStats) parts[nextLabel].inputStats = {}
                parts[nextLabel].inputStats[label] = 0
            }
        })
    }
}

const press = (graph, parts) => {
    let lowCount = 0
    let highCount = 0

    // bfs
    let q = [{ module: 'broadcaster', highPulse: false, prevModule: null }]    // 0 low, 1 high

    while (q.length) {
        let { module, highPulse, prevModule } = q.shift()
        // console.log({ module, highPulse, prevModule })
        if (highPulse) {
            highCount += 1
        } else {
            lowCount += 1
        }

        let nextPulse = null

        // modify current stats/ pulse to send to next
        if (module === "broadcaster") {

            nextPulse = false   // broadcast send LowPulse

        } else if (parts[module] && parts[module].type == '%' && !highPulse) {
            // flipflop change stat when lowPulse
            parts[module].status = !parts[module].status

            // when change state, update pulse to send
            nextPulse = parts[module].status ? true : false // turns ON and send HighPulse ; turns OFF and send LowPulse

        } else if (parts[module] && parts[module].type == "&") {
            // conjunction update state
            parts[module].inputStats[prevModule] = highPulse

            // when all inputs all high, send LowPulse, otherwise highPulse
            nextPulse = Object.values(parts[module].inputStats).every(Boolean) ? false : true
        }

        if (nextPulse === null) continue
        // console.log("next : ",graph[module])
        // continue
        // if has next pulse, add to queue
        graph[module].forEach(nextModule => {
            q.push({
                module: nextModule,
                highPulse: nextPulse,
                prevModule: module
            })
        })

    }
    return [lowCount, highCount]
}

const solve = (graph, parts) => {
    const PRESS_COUNT = 1000
    let lowTotal = 0, highTotal = 0
    for (let i = 0; i < PRESS_COUNT; i++) {
        let [low, high] = press(graph, parts)   // mutate states
        lowTotal += low
        highTotal += high
    }
    // console.log({ lowTotal, highTotal })
    return lowTotal * highTotal
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    // let rawFile = await readFile("sample2.txt")
    let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    console.log(rawFile)

    let { graph, parts } = extractData(rawFile)
    console.log(graph)
    console.log(parts)


    let res = solve(graph, parts)
    console.log(res)
    return res
    // expected sample.txt = 32000000
    // expected sample2.txt = 11687500
    // expected input.txt = ???
}

main()