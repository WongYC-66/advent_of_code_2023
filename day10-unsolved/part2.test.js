const { main } = require('./part2.js')

describe('main', () => {
    test('sample 2', async () => {
        expect(await main("./day10/sample2.txt")).toBe(4);
    });

    test('sample 3', async () => {
        expect(await main("./day10/sample3.txt")).toBe(8);
    });

    test('sample 4', async () => {
        expect(await main("./day10/sample4.txt")).toBe(10);
    });

    test('sample 5', async () => {
        expect(await main("./day10/sample5.txt")).toBe(4);
    });
});