module.exports = function stupid(M, k, p) {
  let maxSubMatrix = 0;
  for (let i = 0; i < M.length; i++) {
    for (let j = 0; j < M[0].length; j++) {
      for (let d = i; d < M.length; d++) {
        for (let f = j; f < M[0].length; f++) {
          let sumSubmatrix = 0;
          if (d + k <= M.length && f + p <= M[0].length) {
            for (let r = d; r < d + k; r++) {
              for (let c = f; c < f + p; c++) {
                sumSubmatrix += M[r][c];
              }
            }
            maxSubMatrix = Math.max(maxSubMatrix, sumSubmatrix);
          }
        }
      }
    }
  }
  return maxSubMatrix;
}
