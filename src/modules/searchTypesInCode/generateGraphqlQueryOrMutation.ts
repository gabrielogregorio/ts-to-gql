import { modelPrepareType } from '@/modules/searchTypesInCode/analyzeQueryOrMutationTs';

export const generateGraphqlQueryOrMutation = (queries: modelPrepareType[]): string => {
  const queriesGraphql = queries.map((query) => {
    const functionGraphql = `(${query.parameterTransformedInGraphql})`;

    return `${query.nameResolver}${query.namePayloadGraphql ? functionGraphql : ''}: ${query.responseGraphql}`;
  });

  return queriesGraphql.join('\n');
};
