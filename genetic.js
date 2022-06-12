export function genetic(
  M,
  k,
  p,
  gens,
  maxValueForBytes,
  iterations,
  crossOverParameter,
  mutationParameter
) {
    // console.log(M, k, p)
  const g = gens;
  const m = M.length;
  const n = M[0].length;
  const maxBytes = maxValueForBytes.toString(2).length;
  const crossOverIndex = Math.ceil(maxBytes * 4 * crossOverParameter);
  const valuesToBeMutated = maxBytes * 4 * g * mutationParameter;
  // we need 4 variables for generation init
  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };
  const genRandomPairs = () => {
    const r1 = getRndInteger(0, m - k);
    const r2 = r1 + k;
    const c1 = getRndInteger(0, n - p);
    const c2 = c1 + p;
    // console.log({ r1, r2, c1, c2 });
    return { r1, r2, c1, c2 };
  };

  const generation = [];
  for (let i = 0; i < g; i++) {
    generation.push(genRandomPairs());
  }
  // console.log(generation);

  const calculateF = (interval) => {
    let FValue = 0;
    if (
      interval.r1 > interval.r2 ||
      interval.c1 > interval.c2 ||
      interval.r2 > m - 1 ||
      interval.c2 > n - 1 ||
      interval.c2 - interval.c1 !== p ||
      interval.r2 - interval.r1 !== k
    ) {
      return 0;
    }
    for (let i = interval.r1; i <= interval.r2; i++) {
      for (let j = interval.c1; j <= interval.c2; j++) {
        FValue += M[i][j];
      }
    }
    return FValue;
  };

  let generationCalculatedF = generation
    .map((chromosome) => {
      return { ...chromosome, FValue: calculateF(chromosome) };
    })
    .filter((chromosome) => chromosome.FValue != undefined);

  // console.log(generationCalculatedF);

  const FValueSum = generationCalculatedF.reduce((prev, current) => {
    return {
      FValue: prev.FValue + current.FValue,
    };
  }).FValue;

  // console.log(FValueSum);

  generationCalculatedF = generationCalculatedF.map((chromosome) => {
    return {
      ...chromosome,
      FPValue: chromosome.FValue / FValueSum,
    };
  });
  // console.log(generationCalculatedF);

  let newGeneration = generationCalculatedF.map(() =>
    Object.assign({ RWRand: Math.random() })
  );

  // Fortune WHEEL :)

  let comulative = 0;
  for (let i = 0; i < generationCalculatedF.length; i++) {
    generationCalculatedF[i].interval = [
      comulative,
      generationCalculatedF[i].FPValue + comulative,
    ];
    comulative += generationCalculatedF[i].FPValue;
  }
  // console.log(
//     "Probability distribution",
//     generationCalculatedF.reduce((prev, current) =>
//       Object.assign({ FPValue: prev.FPValue + current.FPValue })
//     )
//   );
  // console.log(generationCalculatedF);

  newGeneration = newGeneration.map((chromosome) => {
    return {
      parent: generationCalculatedF.find(
        (parentChromosome) =>
          chromosome.RWRand > parentChromosome.interval[0] &&
          chromosome.RWRand < parentChromosome.interval[1]
      ),
    };
  });

  // console.log(newGeneration);

  const generateBytes = (number, maxBytes) => {
    let binaryNumber = number.toString(2);
    while (binaryNumber.length < maxBytes) {
      binaryNumber = `0${binaryNumber}`;
    }
    return binaryNumber;
  };

  newGeneration = newGeneration.map((chromosome) => {
    let tempR1 = generateBytes(chromosome.parent.r1, maxBytes);
    let tempR2 = generateBytes(chromosome.parent.r2, maxBytes);
    let tempC1 = generateBytes(chromosome.parent.c1, maxBytes);
    let tempC2 = generateBytes(chromosome.parent.c2, maxBytes);
    return {
      ...chromosome,
      binary: {
        rep: [tempR1, tempR2, tempC1, tempC2].join(""),
      },
    };
  });

  const crossOver = (ch1, ch2) => {
    const temp = ch1.binary.rep
      .slice(0, crossOverIndex)
      .concat(ch2.binary.rep.slice(crossOverIndex));
    ch2.binary.rep = ch2.binary.rep
      .slice(0, crossOverIndex)
      .concat(ch1.binary.rep.slice(crossOverIndex));
    ch1.binary.rep = temp;
  };

  for (let i = 0; i < g - 2; i += 2) {
    crossOver(newGeneration[i], newGeneration[i + 1]);
  }

  const mutate = (generation) => {
    const mutatedIndexes = [];
    const hasIndexBeenMutated = (index) =>
      mutatedIndexes.find((x) => x[0] === index[0] && x[1] === index[1]);
    const invertGene = (chromosome, index) => {
      chromosome.binary.rep = chromosome.binary.rep.replaceAt(
        index,
        String(chromosome.binary.rep[index] ^ 1)
      );
    };

    for (let i = 0; i < valuesToBeMutated; i++) {
      let index = [];
      do {
        index = [getRndInteger(0, g), getRndInteger(0, maxBytes * 4)];
      } while (hasIndexBeenMutated(index));
      {
        index = [getRndInteger(0, g), getRndInteger(0, maxBytes * 4)];
      }
      invertGene(generation[index[0]], index[1]);
    }
  };

  mutate(newGeneration);

  newGeneration = newGeneration.map((chromosome) => {
    const r1 = parseInt(chromosome.binary.rep.slice(0, maxBytes), 2);
    const r2 = parseInt(chromosome.binary.rep.slice(maxBytes, maxBytes * 2), 2);
    const c1 = parseInt(
      chromosome.binary.rep.slice(maxBytes * 2, maxBytes * 3),
      2
    );
    const c2 = parseInt(
      chromosome.binary.rep.slice(maxBytes * 3, maxBytes * 4),
      2
    );
    // console.log(r1, r2, c1, c2);
    chromosome.newFValue = calculateF({ r1, r2, c1, c2 });
    return chromosome;
  });

  const correctAnswer = Math.max(
    ...newGeneration.map((chromosome) => chromosome.newFValue)
  );

  // console.log(newGeneration);
  // console.log(M);
  // console.log(correctAnswer);

  return correctAnswer;
}
