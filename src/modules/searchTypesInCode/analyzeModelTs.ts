import { removeTsSymbols } from '@/modules/searchTypesInCode/removeTsSymbols';
import { analyzeModelType } from '@/utils/types';

type analyzeModelResponseType = {
  info: analyzeModelType[];
  metadata: {
    hasMapped: string[];
  };
};
export const analyzeModel = (model: analyzeModelType[]): analyzeModelResponseType => {
  const hasMapped = model.map((item) => removeTsSymbols(item.name));

  return {
    info: model,
    metadata: {
      hasMapped,
    },
  };
};
