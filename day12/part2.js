// https://adventofcode.com/2023/day/12
const { readFile } = require("../lib.js")

const unfold = (str, numsStr) => {
    const scale = 5

    let newStr = Array(scale).fill(str).join('?')
    let newNums = Array(scale).fill(numsStr).join(',').split(',').map(Number)

    return [newStr, newNums]
}

const findCombination = (str) => {
    let [oriS, oriNums] = str.split(' ')
    // let [s, nums] = str.split(' ')
    // nums = nums.split(',').map(Number)

    let [s, nums] = unfold(oriS, oriNums)

    let M = s.length
    let N = nums.length
    console.log(s, nums)
    console.log(M, N)

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

    let memo = {}

    const dfs = (i, j) => {
        // console.log({ i, j })
        if (j == N) {
            if (remainHasNotHash(i)) {
                // console.log("matched", { i, j })
                return 1
            }
            return 0
        }
        if (i >= M) {
            return 0
        }

        let key = `${i}-${j}`
        if (key in memo) return memo[key]

        let size = nums[j]
        let c = s[i]
        let canMatch = check(i, size)

        let res = 0
        if (canMatch) {
            res += dfs(i + size + 1, j + 1)
            if (c == '?')
                res += dfs(i + 1, j)
        } else {
            if (c != '#')
                res += dfs(i + 1, j)
        }

        return memo[key] = res
    }
    return dfs(0, 0)
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
    console.log(combinations)

    let res = sum(combinations)
    console.log(res)
    return res
    // expected sample.txt = 525152
    // expected input.txt = ???
}


main()