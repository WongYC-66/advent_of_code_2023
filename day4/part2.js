// https://adventofcode.com/2023/day/4
const fs = require('node:fs/promises');

const readFile = async (fileName) => {
    try {
        const data = await fs.readFile(`./${fileName}`, { encoding: 'utf8' });
        // console.log(data);
        return data
    } catch (err) {
        console.log(err);
    }
}

const findCardCount = (cards) => {
    // console.log(cards)
    let count = {}
    for (let [card_id, nums1, nums2] of cards) {
        if (!count[card_id]) {
            count[card_id] = 1
        } else {
            count[card_id] += 1
        }

        nums1 = new Set(nums1)
        let match = 0
        nums2.forEach(n => match += nums1.has(n))

        console.log(card_id, match)
        for (let i = 1; i <= match; i++) {
            let next = card_id + i
            count[next] = (count[next] || 0) + count[card_id]
        }
        // console.log(count)
    }
    console.log(count)
    return Object.values(count).reduce((s, x) => s + x, 0)
}

const main = async () => {
    // let rawFile = await readFile("sample.txt")
    let rawFile = await readFile("input.txt")
    console.log(rawFile)
    rawFile = rawFile
        .replaceAll("\r", "")
        .split("\n")

    let cards = []
    let splitFn = s => s.trim().replaceAll("  ", " ").split(" ").map(Number)
    rawFile.forEach(str => {
        let [card_id, remains] = str.split(":")
        let [nums1, nums2] = remains.trim().split("|")
        nums1 = splitFn(nums1)
        nums2 = splitFn(nums2)
        card_id = card_id.match(/\d+/)[0]
        cards.push([Number(card_id), nums1, nums2])
    })

    console.log(rawFile)

    let countOfCards = findCardCount(cards)
    console.log(countOfCards)
    return countOfCards
}


main()