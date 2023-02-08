import { searchContentRegions } from '@/modules/searchTypesInCode/searchContentRegions';

type modelPrepareType = {
  nameModel: string;
  content: string;
};

export const searchSignatures = (
  code: string,
  prefix: string,
  type: 'model' | 'mutation' | 'query',
): {
  name: string;
  needMapping: string;
  hasMapped: string;
  content: string;
  type: 'model' | 'mutation' | 'query';
}[] => {
  const items: modelPrepareType[] = searchContentRegions(code, prefix).map((item) => ({
    nameModel: item.name,
    content: item.content,
  }));

  return items.map((item) => ({
    name: item.nameModel,
    content: item.content,
    hasMapped: item.nameModel,
    needMapping: '',
    type,
  }));
};
