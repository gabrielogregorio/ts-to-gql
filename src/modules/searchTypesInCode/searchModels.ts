import { getMagicsInfo } from '@/modules/searchTypesInCode/searchAndPrepare';
import { definitionTypeTsToGql } from '@/utils/tsTypeToGql';

// TODO: REFACTOR
type model = {
  nameModel: string;
  content: string;
};

const searchAndPrepare = (code: string, prefix: string): model[] =>
  getMagicsInfo(code, prefix).map((item) => ({
    nameModel: item.name,
    content: definitionTypeTsToGql(item.content || '', [{ from: 'Types.ObjectId', to: 'ID' }]),
  }));

export const searchModels = (code: string, prefix: string): { queries: string; listModelsMapped: string[] } => {
  const items: model[] = searchAndPrepare(code, prefix);
  const listModelsMapped: string[] = [];

  const queries = items
    .map((item) => {
      listModelsMapped.push(item.nameModel);

      return `type ${item.nameModel} ${item?.content?.replace(/^\n/, '')}`;
    })
    .join('\n\n');

  return {
    queries,
    listModelsMapped,
  };
};
