const fs = require("fs");
const { PriorityQueue } = require('@datastructures-js/priority-queue');

// npm install @datastructures-js/priority-queue



const solve = (arr) => {

    const M = arr.length
    const N = arr[0].length
    // START = [0, 1]
    // END = [M -1 , N - 2]

    const dirs = [
        [-1, 0],        // dr,dc,symbolCannot
        [+1, 0],
        [0, -1],
        [0, +1],
    ]


    const checkIfJunction = (r, c) => {
        if (arr[r][c] == "#") return false
        let count = 0
        for (let [dr, dc] of dirs) {
            let nR = r + dr
            let nC = c + dc
            if (nR < 0 || nR == M || nC < 0 || nC == N || arr[nR][nC] == "#") continue
            count += 1
        }
        return count >= 3
    }

    const getAllNodes = () => {
        let nodes = [[0, 1]]   // start
        for (let r = 1; r < M - 1; r++) {
            for (let c = 1; c < N - 1; c++) {
                if (checkIfJunction(r, c)) nodes.push([r, c])
            }
        }
        nodes.push([M - 1, N - 2]) // end
        return nodes
    }

    const bfs = ([r1, c1], [r2, c2]) => {
        // find the shortest dist between these 2 nodes
        let visited = new Set()
        let q = [[r1, c1, 0]] // [r,c,step]

        while (q.length) {
            let [r, c, step] = q.shift()

            let key = toKey([r, c])
            if (visited.has(key)) continue
            visited.add(key)

            for (let [dr, dc] of dirs) {
                let nR = r + dr
                let nC = c + dc
                if (nR < 0 || nR == M || nC < 0 || nC == N) continue
                if (arr[nR][nC] === '#') continue

                if (nR === r2 && nC === c2) {
                    return step + 1 // foound
                }

                if (checkIfJunction(nR, nC)) continue

                q.push([nR, nC, step + 1])
            }
        }
        return -1
    }

    const toKey = ([r, c]) => `${r},${c}`

    const makeGraph = (arr) => {
        let combo = new Set()
        let graph = {}
        for (let [i, nodeA] of arr.entries()) {
            for (let [j, nodeB] of arr.entries()) {
                if (i == j) continue
                let nodes = [nodeA, nodeB].sort((a, b) => a[0] - b[0] || a[1] - b[1])
                let comboKey = `${toKey(nodes[0])}->${toKey(nodes[1])}`
                if (combo.has(comboKey)) continue
                combo.add(comboKey)
                let dist = bfs(nodeA, nodeB)
                if (dist !== -1) {
                    graph[toKey(nodeA)] ??= []
                    graph[toKey(nodeB)] ??= []
                    graph[toKey(nodeA)].push([...nodeB, dist])
                    graph[toKey(nodeB)].push([...nodeA, dist])
                }
            }
        }
        return graph
    }

    let nodes = getAllNodes()
    let graph = makeGraph(nodes)

    console.log(nodes)
    console.log(graph)

    console.log(nodes.length)

    const dfs = (r, c, visited) => {
        // find the longest to end
        let res = -Infinity
        if (r == M - 1 && c == N - 2) {
            return 0
        }
        let currNode = toKey([r, c])

        for (let [nR, nC, step] of graph[currNode]) {
            if(visited[nR][nC]) continue
            visited[nR][nC] = true

            res = Math.max(
                res,
                dfs(nR, nC, visited) + step
            )

            // backtrack
            visited[nR][nC] = false
        }

        return res
    }

    let visited = Array(M).fill().map(_ => Array(N).fill(false))
    visited[0][1] = true

    return dfs(0, 1, visited)
}



const main = (fileName) => {
    console.time("main")
    const lines = fs.readFileSync(fileName, "utf8")
        .split("\r\n");

    const arr = []

    for (let ln of lines) {
        ln = ln.replaceAll(/[\^v<>]/g, ".")
        arr.push(ln.split(''))
        console.log(ln)
    }

    // console.log(arr)
    let res = solve(arr)
    console.timeEnd("main")
    return res
}


// console.log(main("sample.txt"))   // RUN FOR SAMPLE , expected = 154

console.log(main("input.txt"))   // RUN FOR FULL INPUT, CORRECT = 6542
// 4810 , too low



