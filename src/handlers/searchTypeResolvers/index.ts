import { getRecursiveContentInRegion } from '@/handlers/getRecursiveRegion';
import { tsToGraphql } from '@/handlers/tsToGraphql';
import { extractQueryOrMutationSignatures } from '@/handlers/extractQueryOrMutationSignatures';
import { prettify } from '@/handlers/prettify';

// FIXME: REFACTOR

type model = {
  nameResolver: string;
  response: string;
  nameInputParam2: string;
  nameRealSignature: string;
  nameInputParam: string;
  inputParam: string | undefined;
};

const removePromise = (type: string): string => {
  const LENGTH_TO_REMOVE_TEXT_PROMISE = 8;
  if (type.startsWith('Promise<')) {
    return type.slice(LENGTH_TO_REMOVE_TEXT_PROMISE, type.length - 1);
  }
  return type;
};

const regexSearchFirstOccurrenceQueryOrMutation = (type: 'Query' | 'Mutation'): RegExp =>
  new RegExp(`[type|interface]\\s{1,50}(Gql${type}\\w{1,500})\\s{0,500}=\\s{0,500}([^$]*)`);

const searchAndPrepare = (code: string, type: 'Query' | 'Mutation'): { items: model[]; keys: string[] } => {
  let count = 0;
  let indexToIgnoreFirstOccurrence = 0;

  const items: model[] = [];
  const keys: string[] = [];

  while (true) {
    const textToAnalyze = code.slice(indexToIgnoreFirstOccurrence, code.length);
    const resultFirstOccurrenceQueryOrMutation = regexSearchFirstOccurrenceQueryOrMutation(type).exec(textToAnalyze);
    if (Boolean(resultFirstOccurrenceQueryOrMutation) === false) {
      break;
    }

    const positionFirstOccurrence = resultFirstOccurrenceQueryOrMutation.index;
    const lengthNameQueryOrMutation = resultFirstOccurrenceQueryOrMutation[1].length;
    indexToIgnoreFirstOccurrence = indexToIgnoreFirstOccurrence + positionFirstOccurrence + lengthNameQueryOrMutation;

    const contentQueryOrMutation = getRecursiveContentInRegion(resultFirstOccurrenceQueryOrMutation[2], {
      startDelimiter: '{',
      endDelimiter: '}',
      skipStrings: true,
    });
    const queryOrMutationSignatures = extractQueryOrMutationSignatures(contentQueryOrMutation, code);

    queryOrMutationSignatures.forEach((signatures) => {
      const param = `${signatures.parameterResolver?.namePayloadGraphql}: ${signatures.parameterResolver?.value}`;
      const showParam =
        signatures.parameterResolver?.value === 'unknown' || signatures.parameterResolver?.value === undefined
          ? ''
          : param;
      const responseGraphql = tsToGraphql(removePromise(signatures.responseResolver), false, []);

      if (showParam && signatures.parameterResolver.contentExtracted === undefined) {
        keys.push(signatures.parameterResolver?.value?.replace(/[!\]\\[]/g, ''));
      }

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

    count += 1;

    if (count === 20) {
      break;
    }
  }

  return { items, keys: [...new Set(keys)] };
};

export const searchTypeResolvers = (code: string, type: 'Query' | 'Mutation'): { values: string; keys: string[] } => {
  const items = searchAndPrepare(code, type);
  const getInputs = (): string =>
    items.items
      .map((item) => {
        if (item?.nameRealSignature && item?.inputParam) {
          return `input ${item?.nameRealSignature} ${item?.inputParam}`;
        }
        return '';
      })
      .join('\n\n');

  const getQueryOrMutation = (): string =>
    items.items
      .map((item) => {
        const insideTest = `(${item.nameInputParam2})`;
        return `  ${item.nameResolver}${item.nameInputParam ? insideTest : ''}: ${item.response}`;
      })
      .join('\n');

  return {
    values: prettify(`\n${getInputs()}\ntype ${type} {\n${getQueryOrMutation()}\n}`),
    keys: items.keys,
  };
};
