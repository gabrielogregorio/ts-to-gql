import { modelPrepareType } from '@/modules/searchTypesInCode/analyzeQueryOrMutationTs';

export const generateGraphqlInputs = (items: modelPrepareType[]): string =>
  items
    .map((item) => {
      if (item?.nameRealSignature && item?.inputParam) {
        return `input ${item?.nameRealSignature} ${item?.inputParam}`;
      }
      return '';
    })
    .join('\n\n');
