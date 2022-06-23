const greedy = require("./greedy");
const genetic = require("./genetic");
const stupid = require("./stupid");
const performance = require("perf_hooks").performance;

const plotly = require('plotly')('arthurcode', '82uIb57RnzJrUNYabQrl');

String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substring(0, index) +
    replacement +
    this.substring(index + replacement.length)
  );
};

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const generate = (n, m, min, max) => {
  return Array.from({ length: n }, () =>
    Array.from({ length: m }, () => getRandomInt(min, max))
  );
};
const testAlgorithm = (algorithm, values) => {
  const results = [];
  for (let value of values) {
    const startTime = performance.now();
    const result = algorithm(...value);
    const endTime = performance.now();
    results.push({ value: result, time: endTime - startTime, matrixSize: value[0].length });
  }
  return { result: results, name: algorithm.name };
};

function test(
  algorithms,
  times,
  [min, max],
  [gens, iterations, crossOverParameter, mutationParameter]
) {
  const result = [];
  const values = [];
  let matrixSize = 0;
  for (let i = 0; i < times; i++) {
    matrixSize += 50;
    const matrix = generate(matrixSize, matrixSize, min, max);
    const k = getRandomInt(1, matrixSize - 1);
    const p = getRandomInt(1, matrixSize - 1);
    values.push([
      matrix,
      k,
      p,
      gens,
      max,
      iterations,
      crossOverParameter,
      mutationParameter,
    ]);
  }
  for (let algorithm of algorithms) {
    result.push(testAlgorithm(algorithm, values));
  }
  plotly.plot(result.map(test => {
      const dataset = {};
      dataset.x = test.result.map(result => result.matrixSize);
      dataset.y = test.result.map(result => result.time);
      dataset.type = "scatter";
      return dataset;
  }), {filename: "time-chart", fileopt: "overwrite"}, function (err, msg) {
      console.log(msg);
  });
  plotly.plot(result.map(test => {
      const dataset = {};
      dataset.x = test.result.map(result => result.matrixSize);
      dataset.y = test.result.map(result => result.value);
      dataset.type = "scatter";
      return dataset;
  }), {filename: "value-chart", fileopt: "overwrite"}, function (err, msg) {
      console.log(msg);
  });
  return result;
}

const testing = test([greedy, genetic, stupid], 10, [50, 40, -1000, 3000], [10000, 2, 0.5, 0.1]);

console.dir(
  testing,
  { depth: null }
);