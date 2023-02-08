import { getMagicsInfo } from '@/modules/searchTypesInCode/getMagicInfos';

type modelPrepareType = {
  nameModel: string;
  content: string;
};

export const searchModels = (
  code: string,
  prefix: string,
  type: 'model' | 'mutation' | 'query',
): {
  name: string;
  content: string;
  keysNotResolved: string[];
  type: 'model' | 'mutation' | 'query';
}[] => {
  const items: modelPrepareType[] = getMagicsInfo(code, prefix).map((item) => ({
    nameModel: item.name,
    content: item.content,
  }));

  return items.map((item) => ({ name: item.nameModel, content: item.content, keysNotResolved: [], type }));
};
