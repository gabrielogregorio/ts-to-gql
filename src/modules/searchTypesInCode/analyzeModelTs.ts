import { getOnlyKey } from '@/modules/searchTypesInCode/getOnlyKey';

type infoType = {
  name: string;
  content: string;
  type: 'model' | 'mutation' | 'query';
};

export const analyzeModel = (
  model: {
    name: string;
    needMapping: string;
    hasMapped: string;
    content: string;
    type: 'model' | 'mutation' | 'query';
  }[],
): {
  info: infoType[];
  metadata: {
    hasMapped: string[];
  };
} => {
  const info: infoType[] = [];

  model.forEach((item) => {
    info.push({
      name: item.name,
      content: item.content,
      type: item.type,
    });
  });

  const hasMapped = model.map((item) => getOnlyKey(item.hasMapped));

  return {
    info,
    metadata: {
      hasMapped,
    },
  };
};
