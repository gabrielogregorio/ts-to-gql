import { modelPrepareType } from '@/modules/searchTypesInCode/analyzeQueryOrMutationTs';

export const generateGraphqlQueryOrMutation = (items: modelPrepareType[]): string =>
  items
    .map((item) => {
      const insideTest = `(${item.nameInputParam2})`;
      return `  ${item.nameResolver}${item.nameInputParam ? insideTest : ''}: ${item.response}`;
    })
    .join('\n');
