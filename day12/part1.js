// https://adventofcode.com/2023/day/12
const { readFile } = require("../lib.js")

const findCombination = (str) => {
    let [s, nums] = str.split(' ')
    nums = nums.split(',').map(Number)

    let M = s.length
    let N = nums.length
    console.log(s, nums)
    console.log(M, N)
    let ways = 0

    const check = (i, size) => {
        if (i + size - 1 >= M) return false  // out of range
        // (6,3) must be ?##. or ###. or ??#. or ???.
        if (s[i + size] == '#') return false
        let chars = s.slice(i, i + size).split('')
        return chars.every(c => c != '.')
    }

    const remainHasNotHash = (i) => {
        let chars = s.slice(i,).split('')
        return chars.every(c => c != '#')
    }

    const dfs = (i, j) => {
        if (i >= M) {
            if (j == N) {
                ways += 1
            }
            return
        }

        if (j == N) {
            if (remainHasNotHash(i)) {
                ways += 1
            }
            return
        }

        let size = nums[j]
        let c = s[i]
        let canMatch = check(i, size)
        if (c == '#') {
            if (canMatch) {
                dfs(i + size + 1, j + 1) // skip "."
            }
            return  // if # and can't match, dying sequence
        }

        if (c == "?") {
            if (canMatch) {
                dfs(i + size + 1, j + 1) // skip "."
            }
        }
        // or skip this "?" or "."
        dfs(i + 1, j)
    }

    dfs(0, 0)
    return ways
}

const sum = (arr) => {
    return arr.reduce((s, x) => s + x, 0)
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    console.log(rawFile)

    let combinations = rawFile.map(findCombination)

    let res = sum(combinations)
    console.log(res)
    return res
    // expected sample.txt = 21
    // expected input.txt = ???
}


main()