import { prettify } from '@/handlers/prettify';
import { searchAndPrepare } from '@/handlers/searchTypeResolvers/searchAndPrepare';

export const searchTypeResolvers = (
  code: string,
  type: 'Query' | 'Mutation',
  prefix: string,
): { values: string; keys: string[] } => {
  const items = searchAndPrepare(code, prefix);
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
