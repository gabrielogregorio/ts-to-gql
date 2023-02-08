import { extractQueryOrMutationSignatures } from '@/handlers/extractQueryOrMutationSignatures';
import { tsTypeToGql } from '@/utils/tsTypeToGql';

export type modelPrepareType = {
  nameResolver: string;
  response: string;
  nameInputParam2: string;
  nameRealSignature: string | undefined;
  nameInputParam: string | undefined;
  inputParam: string | undefined;
  needMapping: string;
};

const removePromise = (type: string): string => {
  const LENGTH_TO_REMOVE_TEXT_PROMISE = 8;
  if (type.startsWith('Promise<')) {
    return type.slice(LENGTH_TO_REMOVE_TEXT_PROMISE, type.length - 1);
  }
  return type;
};

export const analyzeQueryOrMutationTs = (
  code: string,
  itemsX: {
    name: string;
    content: string;
    type: 'model' | 'mutation' | 'query';
  }[],
): { items: modelPrepareType[]; keys: string[] } => {
  const items: modelPrepareType[] = [];
  const keys: string[] = [];

  itemsX.forEach(({ content }) => {
    const queryOrMutationSignatures = extractQueryOrMutationSignatures(content || '', code);

    queryOrMutationSignatures.forEach((signatures) => {
      const param = `${signatures.parameterResolver?.namePayloadGraphql}: ${signatures.parameterResolver?.value}`;
      const showParam =
        signatures.parameterResolver?.value === 'unknown' || signatures.parameterResolver?.value === undefined
          ? ''
          : param;
      const responseGraphql = tsTypeToGql(removePromise(signatures.responseResolver), false, []);

      if (
        showParam &&
        signatures?.parameterResolver?.contentExtracted === undefined &&
        signatures !== undefined &&
        signatures.parameterResolver !== undefined
      ) {
        keys.push(signatures.parameterResolver?.value?.replace(/[!\]\\[]/g, ''));
      }

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
        needMapping: responseGraphql,
      });
    });
  });

  return { items, keys };
};
