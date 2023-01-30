import { getRecursiveContentInRegion } from '@/handlers/getRecursiveRegion';
import { tsToGraphql } from '@/handlers/tsToGraphql';
import { extractQueryOrMutationSignatures } from '@/handlers/extractQueryOrMutationSignatures';
import { Log } from '@/log/index';

// FIXME: REFACTOR

type model = {
  nameResolver: string;
  response: string;
  nameInputParam2: string;
  nameRealSignature: string | undefined;
  nameInputParam: string | undefined;
  inputParam: string | undefined;
};

const removePromise = (type: string): string => {
  const LENGTH_TO_REMOVE_TEXT_PROMISE = 8;
  if (type.startsWith('Promise<')) {
    return type.slice(LENGTH_TO_REMOVE_TEXT_PROMISE, type.length - 1);
  }
  return type;
};

const regexSearchFirstOccurrenceQueryOrMutation = (prefix: string): RegExp =>
  new RegExp(`[type|interface]\\s{1,50}(${prefix}\\w{1,500})\\s{0,500}={0,1}\\s{0,500}([^$]*)`);

// FIXME: DUPLICATED searchAndPrepare()

// eslint-disable-next-line sonarjs/cognitive-complexity
export const searchAndPrepare = (code: string, prefix: string): { items: model[]; keys: string[] } => {
  let preventInfiniteLoop = 0;

  let indexToIgnoreFirstOccurrence = 0;

  const items: model[] = [];
  const keys: string[] = [];

  const INDEX_TO_BREAK_LOOP: number = 2000;
  while (true) {
    preventInfiniteLoop += 1;

    if (preventInfiniteLoop === INDEX_TO_BREAK_LOOP) {
      Log.warning('possible infinite loop in searchAndPrepare()');
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

    const contentQueryOrMutation = getRecursiveContentInRegion(
      resultFirstOccurrenceQueryOrMutation[INDEX_CONTENT_TYPE],
      {
        startDelimiter: '{',
        endDelimiter: '}',
        skipStrings: true,
      },
    );
    const queryOrMutationSignatures = extractQueryOrMutationSignatures(contentQueryOrMutation || '', code);

    queryOrMutationSignatures.forEach((signatures) => {
      const param = `${signatures.parameterResolver?.namePayloadGraphql}: ${signatures.parameterResolver?.value}`;
      const showParam =
        signatures.parameterResolver?.value === 'unknown' || signatures.parameterResolver?.value === undefined
          ? ''
          : param;
      const responseGraphql = tsToGraphql(removePromise(signatures.responseResolver), false, []);

      if (
        showParam &&
        signatures?.parameterResolver?.contentExtracted === undefined &&
        signatures !== undefined &&
        signatures.parameterResolver !== undefined
      ) {
        keys.push(signatures.parameterResolver?.value?.replace(/[!\]\\[]/g, ''));
      }

      // FIXME: verify if necessary
      keys.push(signatures.responseResolver.replace(/[!\]\\[<>]/g, '').replace('Promise', ''));
      if (responseGraphql) {
        keys.push(responseGraphql.replace(/[!\]\\[]/g, ''));
      }

      items.push({
        nameResolver: signatures.nameResolver,
        nameInputParam2: showParam,
        nameRealSignature: signatures.parameterResolver?.value,
        nameInputParam: signatures?.parameterResolver?.namePayloadGraphql,
        inputParam: signatures?.parameterResolver?.contentExtracted,
        response: responseGraphql,
      });
    });
  }

  return { items, keys };
};
