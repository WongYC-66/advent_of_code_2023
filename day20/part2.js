// https://adventofcode.com/2023/day/20
const { readFile } = require("../lib.js")

const findLCM = (arr) => {
    let lcm = 1
    for (let n of arr) {
        lcm = Math.abs(lcm * n) / gcd(lcm, n)
    }
    return lcm
}

const gcd = (n1, n2) => {
    if (n2 === 0) {
        return n1
    }
    return gcd(n2, n1 % n2)
}

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

const press = (graph, parts, cycle, i) => {
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

        // part2
        if (module in cycle && nextPulse) {
            cycle[module] = i
        }
    }
    return [lowCount, highCount]
}

const solve = (graph, parts) => {
    let cycle = {}
    let feed = "rg" // rg -> rx
    for (let [module, next] of Object.entries(graph)) {
        if (next.includes(feed)) {
            cycle[module] = 0
        }
    }
    console.log(cycle)

    const PRESS_COUNT = 10000
    let lowTotal = 0, highTotal = 0
    for (let i = 1; i < PRESS_COUNT; i++) {
        let [low, high] = press(graph, parts, cycle, i)   // mutate states
        lowTotal += low
        highTotal += high

        if (Object.values(cycle).every(Boolean)) {
            console.log("found : ", cycle)
            break
        }
    }

    console.log(cycle)
    // found the 1st cycle that sends HIGH input to 'rg' , then will send 1 LOW to 'rx'
    let LCM = findLCM(Object.values(cycle))
    return LCM
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


    let res = solve(graph, parts)
    console.log(res)
    return res
    // expected sample.txt = ??
    // expected input.txt = 224602953547789
}

main()