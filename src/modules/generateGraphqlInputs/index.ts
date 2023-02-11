import { modelPrepareType } from '@/modules/searchTypesInCode/analyzeQueryOrMutationTs';

export const generateGraphqlInputs = (inputs: modelPrepareType[]): string => {
  const graphqlInputs = inputs.map((input) => {
    const hasNameAndContentResolver = input?.parameterResolver && input?.contentExtracted;
    if (hasNameAndContentResolver) {
      return `input ${input?.parameterResolver} ${input?.contentExtracted}`;
    }
    return '';
  });

  return graphqlInputs.join('\n');
};
