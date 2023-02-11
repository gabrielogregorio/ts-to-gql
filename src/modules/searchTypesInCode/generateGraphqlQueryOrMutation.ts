import { modelPrepareType } from '@/modules/searchTypesInCode/analyzeQueryOrMutationTs';

export const generateGraphqlQueryOrMutation = (items: modelPrepareType[]): string =>
  items
    .map((item) => {
      const insideTest = `(${item.parameterTransformedInGraphql})`;
      return `  ${item.nameResolver}${item.namePayloadGraphql ? insideTest : ''}: ${item.responseGraphql}`;
    })
    .join('\n');
