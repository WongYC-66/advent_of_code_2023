const fs = require("fs");

class Block {
    constructor(x1, y1, z1, x2, y2, z2, label) {
        this.x1 = x1
        this.y1 = y1
        this.z1 = z1
        this.x2 = x2
        this.y2 = y2
        this.z2 = z2
        this.label = label
    }
}

const main = (fileName) => {

    // const LABELS = "ABCDEFG"
    let i = 0

    const lines = fs.readFileSync(fileName, "utf8")
        .split("\r\n");

    const blocks = []

    let regex = /^(\d+),(\d+),(\d+)~(\d+),(\d+),(\d+)$/
    for (let ln of lines) {
        // console.log(ln)
        let [x1, y1, z1, x2, y2, z2] = ln.match(regex)
            .slice(1, 7)
            .map(Number)
        // blocks.push(new Block(x1, y1, z1, x2, y2, z2, LABELS[i++]))
        blocks.push(new Block(x1, y1, z1, x2, y2, z2, String(i++)))
    }
    // console.log(blocks)

    sortByZ(blocks)

    let placedBlocks = []

    for (let b of blocks) {
        let firstCollided = findCollided(b, placedBlocks)
        let bHeight = Math.abs(b.z2 - b.z1)
        if (!firstCollided) {
            // first block
            let groundZ = 1
            let newB = new Block(b.x1, b.y1, groundZ, b.x2, b.y2, groundZ + bHeight, b.label)
            placedBlocks.push(newB)
            continue
        }

        // found the first collided block
        // console.log({ b, firstCollided })
        let newZ = Math.max(firstCollided.z1, firstCollided.z2) + 1
        let newB = new Block(b.x1, b.y1, newZ, b.x2, b.y2, newZ + bHeight, b.label)
        placedBlocks.push(newB)
    }

    // build blockToSupportMap
    let blockToSupportingBlocks = buildBlockToSupportingBlocksMap(placedBlocks)

    let removables = getRomovables(blockToSupportingBlocks)

    // console.log(blocks)
    // console.log(placedBlocks.toReversed())
    // console.log(blockToSupportingBlocks)
    console.log(removables)

    return removables.length
}

const getRomovables = (blockToSupportingBlocks) => {
    let allSupports = Object.values(blockToSupportingBlocks)

    // console.log(blockToSupportingBlocks)
    // console.log(allSupports)

    return Object.keys(blockToSupportingBlocks).filter(idToRemove => {
        let relatedSupports = allSupports.filter((supports) => supports.has(idToRemove))
        // console.log(idToRemove, relatedSupports)
        return relatedSupports.every((support) => support.size >= 2)
    })
}

const buildBlockToSupportingBlocksMap = (placedBlocks) => {
    let res = {}

    for (let b1 of placedBlocks) {
        let blocksBelow = placedBlocks.filter(b2 => {
            if (b1.label === b2.label) return false
            let isB1onB2 = Math.max(b2.z1, b2.z2) + 1 === Math.min(b1.z1, b1.z2)
            return isB1onB2 && canCollide(b1, b2)
        })
        res[b1.label] = new Set(blocksBelow.map(b => b.label))
    }

    return res
}

const findCollided = (b, blocks) => {
    // iterate from end of blocks to front
    if (!blocks.length) return undefined
    return blocks.filter(b2 => canCollide(b, b2))
        .sort((a, b) => Math.max(a.z1, a.z2) - Math.max(b.z1, b.z2))        // the highest Z block, will be the one collided
        .at(-1)
}

const canCollide = (a, b) => {
    return xAxisCollide(a, b) && yAxisCollide(a, b)
}

const xAxisCollide = (a, b) => {
    return a.x2 >= b.x1 && a.x1 <= b.x2
}

const yAxisCollide = (a, b) => {
    return a.y2 >= b.y1 && a.y1 <= b.y2
}

const sortByZ = (arr) => {
    arr.sort((a, b) => Math.min(a.z1, a.z2) - Math.min(b.z1, b.z2)) // by Z, ASC
}


// console.log(main("sample.txt"))   // RUN FOR SAMPLE

console.log(main("input.txt"))   // RUN FOR FULL INPUT

// 454, INCORRECT, somebody else
// 426 CORRECT


