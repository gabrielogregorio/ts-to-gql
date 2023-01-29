import { fromInterfaceGetResolverNameParamsAndReturn } from '@/handlers/fromInterfaceGetResolverNameParamsAndReturn';
import { getRecursiveContentInRegion } from '@/handlers/getRecursiveRegion';
import { tsToGraphql } from '@/handlers/tsToGraphql';

type model = {
  nameResolver: string;
  param: string;
  response: string;
};

const removePromise = (type: string) => {
  if (type.startsWith('Promise<')) {
    return type.slice(8, type.length - 1);
  }
  return type;
};
const searchAndPrepare = (code: string, type: 'Query' | 'Mutation'): { items: model[]; keys: string[] } => {
  const searchFirstOcurrence = new RegExp(
    `[type|interface]\\s{1,50}(Gql${type}\\w{1,500})\\s{0,500}=\\s{0,500}([^$]*)`,
  );
  let count = 0;
  let indexToStart = 0;

  const items: model[] = [];
  const keys: string[] = [];

  while (true) {
    const textToAnalyse = code.slice(indexToStart, code.length);
    const results = searchFirstOcurrence.exec(textToAnalyse);
    if (Boolean(results) === false) {
      break;
    }
    indexToStart = indexToStart + results.index + results[1].length;

    const content = getRecursiveContentInRegion(results[2], {
      startDelimiter: '{',
      endDelimiter: '}',
      skipStrings: true,
    });
    const itemsss = fromInterfaceGetResolverNameParamsAndReturn(content);

    itemsss.forEach((local) => {
      const param = `${local.params?.[1]?.key}: ${local.params?.[1]?.value}`;
      const showParam = local.params?.[1]?.value === 'unknown' || local.params?.[1]?.value === undefined ? '' : param;
      const responseGraphql = tsToGraphql(removePromise(local.response), false, []);

      if (showParam) {
        keys.push(local.params?.[1]?.value?.replace(/[!\]\\[]/g, ''));
      }

      if (responseGraphql) {
        keys.push(responseGraphql.replace(/[!\]\\[]/g, ''));
      }

      items.push({
        nameResolver: local.nameResolver,
        param: showParam,
        response: responseGraphql,
      });
    });

    count += 1;

    if (count === 20) {
      break;
    }
  }

  return { items, keys };
};

export const searchQueries = (code: string, type: 'Query' | 'Mutation'): { values: string; keys: string[] } => {
  const items = searchAndPrepare(code, type);
  return {
    values: `type ${type} {
${items.items
  .map((item) => `  ${item.nameResolver}${item.param ? `(${item.param})` : ''}: ${item.response}`)
  .join('\n')}
}`,
    keys: items.keys,
  };
};
