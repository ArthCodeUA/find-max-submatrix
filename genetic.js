export function genetic(M, k, p, gens, maxValueForBytes, iterations) {
  const g = gens;
  const maxBytes = maxValueForBytes.toString(2).length;
  // we need 4 variables for generation init
  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };
  const genRandomPairs = () => {
    const r1 = getRndInteger(0, m);
    const r2 = getRndInteger(r1, r1 + k > m ? m : r1 + k);
    const c1 = getRndInteger(0, n);
    const c2 = getRndInteger(c1, c1 + p > n ? n : c1 + p);
    return { r1, r2, c1, c2 };
  };

  const generation = [];
  for (let i = 0; i < g; i++) {
    generation.push(genRandomPairs());
  }
  console.log(generation);

  const calculateF = (interval) => {
    let FValue = 0;
    if (interval.r1 > interval.r2 || interval.c1 > interval.c2) {
      return undefined;
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

  console.log(generationCalculatedF);

  const FValueSum = generationCalculatedF.reduce((prev, current) => {
    return {
      FValue: prev.FValue + current.FValue,
    };
  }).FValue;

  console.log(FValueSum);

  generationCalculatedF = generationCalculatedF.map((chromosome) => {
    return {
      ...chromosome,
      FPValue: chromosome.FValue / FValueSum,
    };
  });
  console.log(generationCalculatedF);

  let newGeneration = generationCalculatedF.map(() =>
    Object.assign({ RWRand: Math.random() })
  );

  let comulative = 0;
  for (let i = 0; i < generationCalculatedF.length; i++) {
    generationCalculatedF[i].interval = [
      comulative,
      generationCalculatedF[i].FPValue + comulative,
    ];
    comulative += generationCalculatedF[i].FPValue;
  }
  console.log(
    "Probability distribution",
    generationCalculatedF.reduce((prev, current) =>
      Object.assign({ FPValue: prev.FPValue + current.FPValue })
    )
  );
  console.log(generationCalculatedF);

  newGeneration = newGeneration.map((chromosome) => {
    return {
      parent: generationCalculatedF.find(
        (parentChromosome) =>
          chromosome.RWRand > parentChromosome.interval[0] &&
          chromosome.RWRand < parentChromosome.interval[1]
      ),
    };
  });

  console.log(newGeneration);

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

  console.log(newGeneration);
}
