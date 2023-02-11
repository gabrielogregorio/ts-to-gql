import { definitionTypeTsToGql } from '@/utils/tsTypeToGql';
import { analyzeModelType } from '@/utils/types';

export const generateGraphqlModel = (listModelsMapped: analyzeModelType[]): string =>
  listModelsMapped
    .map(
      (item) =>
        `type ${item.name.replace(/^\n*/, '')} ${definitionTypeTsToGql(item?.content.trim()?.replace(/^\n/, '') || '', [
          { from: 'Types.ObjectId', to: 'ID' },
        ])}`,
    )
    .join('\n\n');
