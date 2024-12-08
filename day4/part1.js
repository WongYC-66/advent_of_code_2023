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

const toScores = ([nums1, nums2]) => {
    nums1= new Set(nums1)
    let match = 0
    nums2.forEach(n => match += nums1.has(n))

    if(!match) return 0
    return 2 ** (match - 1)
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
        cards.push([nums1, nums2])
    })

    console.log(rawFile)

    let scores = cards.map(toScores)
    let res = scores.reduce((s, x) => s + x, 0)
    console.log(scores)
    console.log(res)
    return res
}


main()