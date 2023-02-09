import { removeTsSymbols } from '@/modules/searchTypesInCode/removeTsSymbols';
import { typeGql } from '@/modules/types';

type infoType = {
  name: string;
  content: string;
  type: typeGql;
};

type analyzeModelType = {
  name: string;
  needMapping: string;
  hasMapped: string;
  content: string;
  type: typeGql;
};

type analyzeModelResponseType = {
  info: infoType[];
  metadata: {
    hasMapped: string[];
  };
};
export const analyzeModel = (model: analyzeModelType[]): analyzeModelResponseType => {
  const info: infoType[] = [];

  model.forEach((item) => {
    info.push({
      name: item.name,
      content: item.content,
      type: item.type,
    });
  });

  const hasMapped = model.map((item) => removeTsSymbols(item.hasMapped));

  return {
    info,
    metadata: {
      hasMapped,
    },
  };
};
