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
  const g = gens;
  const m = M.length;
  const n = M[0].length;
  const maxBytes = maxValueForBytes.toString(2).length;
  const crossOverIndex = Math.ceil(maxBytes * 4 * crossOverParameter);
  const valuesToBeMutated = maxBytes * 4 * g * mutationParameter;
  let correctAnswer = 0;

  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };
  const genRandomPairs = () => {
    const r1 = getRndInteger(0, m - k);
    const r2 = r1 + k;
    const c1 = getRndInteger(0, n - p);
    const c2 = c1 + p;
    return { r1, r2, c1, c2 };
  };

  const generation = [];
  for (let i = 0; i < g; i++) {
    generation.push(genRandomPairs());
  }

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
    for (let i = interval.r1; i < interval.r2; i++) {
      for (let j = interval.c1; j < interval.c2; j++) {
        FValue += M[i][j];
      }
    }
    return FValue;
  };

  const generateBytes = (number, maxBytes) => {
    let binaryNumber = number.toString(2);
    while (binaryNumber.length < maxBytes) {
      binaryNumber = `0${binaryNumber}`;
    }
    return binaryNumber;
  };

  const crossOver = (ch1, ch2) => {
    const temp = ch1.binary.rep
      .slice(0, crossOverIndex)
      .concat(ch2.binary.rep.slice(crossOverIndex));
    ch2.binary.rep = ch2.binary.rep
      .slice(0, crossOverIndex)
      .concat(ch1.binary.rep.slice(crossOverIndex));
    ch1.binary.rep = temp;
  };

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
      mutatedIndexes.push(index);
    }
  };

  let generationCalculatedF = generation
    .map((chromosome) => {
      return { ...chromosome, FValue: calculateF(chromosome) };
    })
    .filter((chromosome) => chromosome.FValue !== undefined);

  for (let iter = 0; iter < iterations; iter++) {
    try {
      const FValueSum = generationCalculatedF.reduce((prev, current) => {
        return {
          FValue: prev.FValue + current.FValue,
        };
      }).FValue;

      generationCalculatedF = generationCalculatedF.map((chromosome) => {
        return {
          ...chromosome,
          FPValue: chromosome.FValue / FValueSum,
        };
      });

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

      newGeneration = newGeneration.map((chromosome) => {
        return {
          parent: generationCalculatedF.find(
            (parentChromosome) =>
              chromosome.RWRand > parentChromosome.interval[0] &&
              chromosome.RWRand < parentChromosome.interval[1]
          ),
        };
      });

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

      for (let i = 0; i < g - 2; i += 2) {
        crossOver(newGeneration[i], newGeneration[i + 1]);
      }
      mutate(newGeneration);

      newGeneration = newGeneration.map((chromosome) => {
        const r1 = parseInt(chromosome.binary.rep.slice(0, maxBytes), 2);
        const r2 = parseInt(
          chromosome.binary.rep.slice(maxBytes, maxBytes * 2),
          2
        );
        const c1 = parseInt(
          chromosome.binary.rep.slice(maxBytes * 2, maxBytes * 3),
          2
        );
        const c2 = parseInt(
          chromosome.binary.rep.slice(maxBytes * 3, maxBytes * 4),
          2
        );
        chromosome.current = { r1, r2, c1, c2 };
        chromosome.newFValue = calculateF({ r1, r2, c1, c2 });
        return chromosome;
      });
      correctAnswer = Math.max(
        ...newGeneration.map((chromosome) => chromosome.newFValue)
      );
      generationCalculatedF = newGeneration.map((chromosome) => {
        return { ...chromosome.current, FValue: chromosome.newFValue };
      });
    } catch (error) {
      return 0;
    }
  }

  return correctAnswer;
}
