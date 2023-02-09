type getRecursiveContentInRegionType = {
  startDelimiter: string;
  endDelimiter: string;
  skipStrings: boolean;
  ignoreCharactersOutString?: string[];
};

export const getRecursiveContentInRegion = (
  regionContent: string,
  { startDelimiter, endDelimiter, ignoreCharactersOutString = [], skipStrings = true }: getRecursiveContentInRegionType,
): string | undefined => {
  let counterDept: number = 0;
  let started: boolean = false;
  let finish: boolean = false;
  let regionCaptured: string = '';

  const startEndMicroString: string = "'";
  let microStringDept: number = 0;

  const startEndLargeString: string = '"';
  let largeStringDept: number = 0;

  const startEndLiterals: string = '`';
  let literalsDept: number = 0;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  regionContent.split('').forEach((world: string) => {
    if (finish) {
      return;
    }

    if (ignoreCharactersOutString.includes(world)) {
      return;
    }

    if (skipStrings) {
      if (world === startEndMicroString) {
        if (microStringDept === 0) {
          microStringDept += 1;
        } else {
          microStringDept -= 1;
        }
      }

      if (world === startEndLargeString) {
        if (largeStringDept === 0) {
          largeStringDept += 1;
        } else {
          largeStringDept -= 1;
        }
      }

      if (world === startEndLiterals) {
        if (literalsDept === 0) {
          literalsDept += 1;
        } else {
          literalsDept -= 1;
        }
      }

      if (literalsDept || largeStringDept || microStringDept) {
        regionCaptured += world;
        return;
      }
    }

    if (world === startDelimiter) {
      started = true;
      counterDept += 1;
    }

    if (counterDept) {
      regionCaptured += world;
    }

    if (world === endDelimiter) {
      counterDept -= 1;
    }

    if (started && counterDept === 0) {
      finish = true;
    }
  });

  return regionCaptured || undefined;
};
