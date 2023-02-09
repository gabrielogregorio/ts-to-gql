import { typeGql } from '@/modules/types';
import { definitionTypeTsToGql } from '@/utils/tsTypeToGql';

export const generateGraphqlModel = (
  listModelsMapped: {
    name: string;
    content: string;
    type: typeGql;
  }[],
): string =>
  listModelsMapped
    .map(
      (item) =>
        `type ${item.name.replace(/^\n*/, '')} ${definitionTypeTsToGql(item?.content.trim()?.replace(/^\n/, '') || '', [
          { from: 'Types.ObjectId', to: 'ID' },
        ])}`,
    )
    .join('\n\n');
