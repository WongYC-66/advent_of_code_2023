// https://adventofcode.com/2023/day/7
const { readFile } = require("../lib.js")

const cardStrength = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']

const extractData = (rawFile) => {
    let pairs = []
    rawFile.forEach(str => {
        let [cards, score] = str.split(' ')
        pairs.push([cards, Number(score)])
    })
    return pairs
}

const check = (cards) => {
    // Five of a kind,  7
    // Four of a kind,  6
    // Full house,      5
    // Three of a kind, 4
    // Two pair,        3
    // One pair,        2
    // High card        1

    let sorted = cards.split('').sort().join('')
    console.log(sorted)

    let regex_five_of_a_kind = /(.)\1{4}/
    let regex_four_of_a_kind = /(.)\1{3}/
    let regex_full_house = /(.)\1{2}(.)\2{1}|(.)\3{1}(.)\4{2}/  // 55566 or 55666
    let regex_three_of_a_kind = /(.)\1{2}/
    let regex_two_pair = /(.)\1(.)\2|(.)\3.(.)\4/       // 5566 or 55x66 
    let regex_one_pair = /(.)\1/

    let allRegex = [
        [regex_five_of_a_kind, 7],
        [regex_four_of_a_kind, 6],
        [regex_full_house, 5],
        [regex_three_of_a_kind, 4],
        [regex_two_pair, 3],
        [regex_one_pair, 2],
    ]

    let res = allRegex.find(([regex, type]) => regex.test(sorted))
    if (!res) return 1   // is highCard
    console.log(sorted, res[1])
    return res[1]
}

const findTypes = (pairs) => {
    let withType = pairs.map(([cards, num]) => [cards, num, check(cards)])
    return withType
}

const countWinnings = (sortedTypedPairs) => {
    let sum = 0
    sortedTypedPairs.forEach(([_, bids, __], i) => sum += bids * (i + 1))
    return sum
}

const mySortFn = (a, b) => {
    // [ '32T3K', 765, 2 ]
    //  [ 'T55J5', 684, 4 ]
    if (a[2] != b[2]) return a[2] - b[2]    // sort by rank ASC

    for (let i = 0; i < a[0].length; i++) {
        // iterate thru cards, compare them
        let c1 = a[0][i]
        let c2 = b[0][i]
        if (c1 == c2) continue // same char
        // diff 
        return cardStrength.indexOf(c1) - cardStrength.indexOf(c2)
    }

    return 0
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")
    console.log(rawFile)

    const pairs = extractData(rawFile)

    const sortedTypedPairs = findTypes(pairs).sort(mySortFn)

    console.log(pairs)
    console.log(sortedTypedPairs)

    let res = countWinnings(sortedTypedPairs)
    console.log(res)
    return res
    // expected sample.txt = 6440
    // expected input.txt = 250946742
}


main()