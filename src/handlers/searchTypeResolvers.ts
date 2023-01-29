import { getRecursiveContentInRegion } from '@/handlers/getRecursiveRegion';
import { tsToGraphql } from '@/handlers/tsToGraphql';
import { extractQueryOrMutationSignatures } from '@/handlers/extractQueryOrMutationSignatures';
import { Log } from '@/helpers/log';

type model = {
  nameResolver: string;
  response: string;
  nameInputParam2: string;
  nameRealSignature: string;
  nameInputParam: string;
  inputParam: string | undefined;
};

const removePromise = (type: string) => {
  if (type.startsWith('Promise<')) {
    return type.slice(8, type.length - 1);
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
      const param = `${signatures.params?.key}: ${signatures.params?.value}`;
      const showParam = signatures.params?.value === 'unknown' || signatures.params?.value === undefined ? '' : param;
      const responseGraphql = tsToGraphql(removePromise(signatures.response), false, []);

      if (showParam && signatures.params.contentExtracted === undefined) {
        // ignore extracted content
        keys.push(signatures.params?.value?.replace(/[!\]\\[]/g, ''));
      }

      if (responseGraphql) {
        keys.push(responseGraphql.replace(/[!\]\\[]/g, ''));
      }

      items.push({
        nameResolver: signatures.nameResolver,
        nameInputParam2: showParam,
        nameRealSignature: signatures.params?.value,
        nameInputParam: signatures?.params?.key,
        inputParam: signatures?.params?.contentExtracted,
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

  return {
    values: `

    ${items.items
      .map((item) => {
        if (item?.nameRealSignature && item?.inputParam) {
          return `input ${item?.nameRealSignature} ${item?.inputParam}`;
        }
        return '';
      })
      .join('\n')}

    type ${type} {
${items.items
  .map((item) => `  ${item.nameResolver}${item.nameInputParam ? `(${item.nameInputParam2})` : ''}: ${item.response}`)
  .join('\n')}
}`,
    keys: items.keys,
  };
};
