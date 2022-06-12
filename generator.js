import { greedy } from "./greedy.js";
import { genetic } from "./genetic.js";
import { performance } from "perf_hooks";

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const generate = (n, m, min, max) => {
    return Array.from({length: n}, () => Array.from({length: m}, () => getRandomInt(min, max)));
};
const testAlgorithm = (algorithm, values) => {
    const results = [];
    for(let value of values) {
        const startTime = performance.now();
        const result = algorithm(...value);
        const endTime = performance.now();
        results.push({value: result, time: endTime - startTime});
    }
    return {result: results, name: algorithm.name};
};

function test(algorithms, times, [n, m, min, max], [gens, iterations, crossOverParameter, mutationParameter]) {
    const result = [];
    const values = [];
    for (let i = 0; i < times; i++) {
        const matrix = generate(n, m, min, max);
        const k = getRandomInt(1, n - 1);
        const p = getRandomInt(1, m - 1);
        values.push([matrix, k, p, gens, max, iterations, crossOverParameter, mutationParameter]);
    }
    for(let algorithm of algorithms) {
        result.push(testAlgorithm(algorithm, values));
    }
    return result;
}

console.dir(test([genetic, greedy], 5, [50, 50, -100, 300], [10000, 0, .5, .1]), {depth: null});
// test([genetic], 1, [50, 50, -10000, 10000], [10000, 0, .5, .1]);