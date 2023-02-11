import { definitionTypeTsToGql } from '@/utils/tsTypeToGql';
import { analyzeModelType, defaultFromType } from '@/utils/types';

export const generateGraphqlModel = (listModels: analyzeModelType[]): string => {
  const graphqlModels = listModels.map(
    (model) => `type ${model.name} ${definitionTypeTsToGql(model?.content || '', defaultFromType)}`,
  );

  return graphqlModels.join('\n\n');
};
