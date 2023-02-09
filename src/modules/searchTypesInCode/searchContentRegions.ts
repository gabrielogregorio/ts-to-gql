import { getRecursiveContentInRegion } from '@/utils/getRecursiveRegion';

const regexSearchFirstOccurrenceQueryOrMutation = (prefix: string): RegExp =>
  new RegExp(`[type|interface]\\s{1,50}(${prefix}[a-zA-Z0-9_]{1,500})\\s{0,500}={0,1}\\s{0,500}([^$]*)`);

type typesGetMagic = {
  name: string;
  content: string;
};

export const searchContentRegions = (code: string, prefix: string): typesGetMagic[] => {
  let preventInfiniteLoop = 0;
  let indexToIgnoreFirstOccurrence = 0;

  const info: typesGetMagic[] = [];

  const INDEX_TO_BREAK_LOOP: number = 2000;
  while (true) {
    preventInfiniteLoop += 1;

    if (preventInfiniteLoop === INDEX_TO_BREAK_LOOP) {
      break;
    }

    const textToAnalyze = code.slice(indexToIgnoreFirstOccurrence, code.length);
    const resultFirstOccurrenceQueryOrMutation = regexSearchFirstOccurrenceQueryOrMutation(prefix).exec(textToAnalyze);
    if (Boolean(resultFirstOccurrenceQueryOrMutation) === false || resultFirstOccurrenceQueryOrMutation === null) {
      break;
    }

    const INDEX_NAME_TYPE = 1;
    const INDEX_CONTENT_TYPE = 2;
    const positionFirstOccurrence = resultFirstOccurrenceQueryOrMutation.index;
    const lengthNameQueryOrMutation = resultFirstOccurrenceQueryOrMutation[INDEX_NAME_TYPE].length;
    indexToIgnoreFirstOccurrence = indexToIgnoreFirstOccurrence + positionFirstOccurrence + lengthNameQueryOrMutation;
    const contentNominal = resultFirstOccurrenceQueryOrMutation[INDEX_CONTENT_TYPE];

    const content = getRecursiveContentInRegion(contentNominal, {
      startDelimiter: '{',
      endDelimiter: '}',
      skipStrings: true,
    });

    const name = resultFirstOccurrenceQueryOrMutation[INDEX_NAME_TYPE];
    info.push({
      name,
      content: content || '',
    });
  }

  return info;
};
