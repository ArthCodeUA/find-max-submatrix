const getArraySum = (array) => array.reduce((p, c) => p + c);
const getMatrixSum = (matrix) => getArraySum(matrix.map((array) => getArraySum(array)));
const isValidRow = (row, i, matrix) => row[0] === 0 || row[0] === matrix.length - 1;
const getWorstRow = (matrix) => matrix.map((row, i) => [i, getArraySum(row)]).sort((a, b) => a[1] - b[1]).find(isValidRow)[0];
const transpose = (matrix) => matrix[0].map((_, col) => matrix.map(x => x[col]));

export function greedy(matrix, k, p) {
    let count = 0;
    while(matrix.length * matrix[0].length !== k * p) {
        if (matrix.length > (count % 2 === 0 ? k : p)) {
            const worstRow = getWorstRow(matrix);
            matrix = matrix.slice(0, worstRow).concat(matrix.slice(worstRow + 1));
        }
        matrix = transpose(matrix);
        count++;
    }
    return getMatrixSum(matrix);
};