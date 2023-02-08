import { prettify } from '@/modules/prettify';
import { getTypesNotMapped } from '@/modules/searchTypesInCode/getTypesNotMapped';
import { modelPrepareType, searchAndPrepare } from '@/modules/searchTypesInCode/searchAndPrepare';
import { searchModels } from '@/modules/searchTypesInCode/searchModels';
import { searchRemainingTypes } from '@/modules/searchTypesInCode/searchRemainingTypes';
import { definitionTypeTsToGql } from '@/utils/tsTypeToGql';

type searchTypesInCodeResponseType = {
  models: string;
  queries: string;
  mutations: string;
  otherTypes: string;
};

type searchTypesInCodeType = {
  fullCodeMerged: string;
  prefixModel: string;
  prefixMutation: string;
  prefixQuery: string;
};

const getInputs = (items: { items: modelPrepareType[]; keys: string[] }): string =>
  items.items
    .map((item) => {
      if (item?.nameRealSignature && item?.inputParam) {
        return `input ${item?.nameRealSignature} ${item?.inputParam}`;
      }
      return '';
    })
    .join('\n\n');

export const searchTypesInCode = ({
  fullCodeMerged,
  prefixModel,
  prefixMutation,
  prefixQuery,
}: searchTypesInCodeType): searchTypesInCodeResponseType => {
  const models = searchModels(fullCodeMerged, prefixModel, 'model');
  const queries = searchModels(fullCodeMerged, prefixQuery, 'query');
  const mutation = searchModels(fullCodeMerged, prefixMutation, 'mutation');

  const querySearch = searchAndPrepare(fullCodeMerged, prefixQuery, queries);
  const mutationSearch = searchAndPrepare(fullCodeMerged, prefixMutation, mutation);

  const handleCreateModel = (
    listModelsMapped: {
      name: string;
      content: string;
      keysNotResolved: string[];
      type: 'model' | 'mutation' | 'query';
    }[],
  ): string =>
    listModelsMapped
      .map(
        (item) =>
          `type ${item.name.replace(/^\n*/, '')} ${definitionTypeTsToGql(
            item?.content.trim()?.replace(/^\n/, '') || '',
            [{ from: 'Types.ObjectId', to: 'ID' }],
          )}`,
      )
      .join('\n\n');

  const handleCreateQueryOrMutation = (items: { items: modelPrepareType[]; keys: string[] }): string =>
    items.items
      .map((item) => {
        const insideTest = `(${item.nameInputParam2})`;
        return `  ${item.nameResolver}${item.nameInputParam ? insideTest : ''}: ${item.response}`;
      })
      .join('\n');

  const keysMapped = models.map((item) => item.name.replace(/[!\]\\[<>]/g, '').replace('Promise', ''));
  const keysNotMapped = [
    ...querySearch.items.map((item) => item.response.replace(/[!\]\\[<>]/g, '').replace('Promise', '')),
    ...mutationSearch.items.map((item) => item.response.replace(/[!\]\\[<>]/g, '').replace('Promise', '')),
  ];

  const typesNotAnalyzed = getTypesNotMapped(keysNotMapped, keysMapped);
  const otherTypes = searchRemainingTypes({ typesNotAnalyzed, fullCodeMerged });

  return {
    models: handleCreateModel(models),
    queries: prettify(`\n${getInputs(querySearch)}\ntype ${'Query'} {\n${handleCreateQueryOrMutation(querySearch)}\n}`),
    mutations: prettify(
      `\n${getInputs(mutationSearch)}\ntype ${'Mutation'} {\n${handleCreateQueryOrMutation(mutationSearch)}\n}`,
    ),
    otherTypes,
  };
};
