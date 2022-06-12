import { greedy } from "./greedy.js";

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const generate = (n, m, min, max) => {
    return Array.from({length: n}, () => Array.from({length: m}, () => getRandomInt(min, max)));
};
const testAlgorithm = (algorithm, values) => {
    const results = [];
    for(let value of values) {
        const startTime = performance.now();
        const result = algorithm(value.matrix, value.k, value.p);
        const endTime = performance.now();
        results.push({value: result, time: endTime - startTime});
    }
    return {result: results, name: algorithm.name};
};

function test(algorithms, times, [n, m, min, max]) {
    const result = [];
    const values = [];
    for (let i = 0; i < times; i++) {
        const matrix = generate(n, m, min, max);
        const k = getRandomInt(1, n - 1);
        const p = getRandomInt(1, m - 1);
        values.push({matrix: matrix, k: k, p: p});
    }
    for(let algorithm of algorithms) {
        result.push(testAlgorithm(algorithm, values));
    }
    return result;
}

console.dir(test([greedy, greedy], 5, [5, 5, -5, 5]), {depth: null});