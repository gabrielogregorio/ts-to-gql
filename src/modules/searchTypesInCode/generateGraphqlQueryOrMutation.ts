import { modelPrepareType } from '@/modules/searchTypesInCode/analyzeQueryOrMutationTs';

export const generateGraphqlQueryOrMutation = (items: { items: modelPrepareType[]; keys: string[] }): string =>
  items.items
    .map((item) => {
      const insideTest = `(${item.nameInputParam2})`;
      return `  ${item.nameResolver}${item.nameInputParam ? insideTest : ''}: ${item.response}`;
    })
    .join('\n');
