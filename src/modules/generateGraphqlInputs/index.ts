import { modelPrepareType } from '@/modules/searchTypesInCode/analyzeQueryOrMutationTs';

export const generateGraphqlInputs = (inputs: modelPrepareType[]): string => {
  const graphqlInputs = inputs.map(({ inputResolverContent, inputResolverName }) => {
    if (inputResolverName && inputResolverContent) {
      return `input ${inputResolverName} ${inputResolverContent}`;
    }
    return '';
  });

  return graphqlInputs.join('\n');
};
