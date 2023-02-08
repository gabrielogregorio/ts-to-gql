import { prettify } from '@/modules/prettify';
import { getOnlyKey } from '@/modules/searchTypesInCode/getOnlyKey';
import { getTypesNotMapped } from '@/modules/searchTypesInCode/getTypesNotMapped';
import { searchRemainingTypes } from '@/modules/searchTypesInCode/searchRemainingTypes';
import { searchSignatures } from '@/modules/searchTypesInCode/searchSignatures';
import { modelPrepareType, analyzeQueryOrMutationTs } from '@/modules/searchTypesInCode/analyzeQueryOrMutationTs';
import { generateGraphqlQueryOrMutation } from '@/modules/searchTypesInCode/generateGraphqlQueryOrMutation';
import { generateGraphqlModel } from '@/modules/searchTypesInCode/generateGraphqlModel';

type searchTypesInCodeResponseType = {
  models: string;
  queries: string;
  mutations: string;
  otherTypes: string;
};

type searchTypesInCodeType = {
  fullCode: string;
  prefixModel: string;
  prefixMutation: string;
  prefixQuery: string;
};

const generateGraphqlInputs = (items: { items: modelPrepareType[]; keys: string[] }): string =>
  items.items
    .map((item) => {
      if (item?.nameRealSignature && item?.inputParam) {
        return `input ${item?.nameRealSignature} ${item?.inputParam}`;
      }
      return '';
    })
    .join('\n\n');

export const searchTypesInCode = ({
  fullCode,
  prefixModel,
  prefixMutation,
  prefixQuery,
}: searchTypesInCodeType): searchTypesInCodeResponseType => {
  const models = searchSignatures(fullCode, prefixModel, 'model');
  const queries = searchSignatures(fullCode, prefixQuery, 'query');
  const mutation = searchSignatures(fullCode, prefixMutation, 'mutation');

  const querySearch = analyzeQueryOrMutationTs(fullCode, queries);
  const mutationSearch = analyzeQueryOrMutationTs(fullCode, mutation);

  const keysMapped = models.map((item) => getOnlyKey(item.hasMapped));
  const keysNotMapped = [
    ...querySearch.items.map((item) => getOnlyKey(item.needMapping)),
    ...mutationSearch.items.map((item) => getOnlyKey(item.needMapping)),
  ];

  const typesNotAnalyzed = getTypesNotMapped(keysNotMapped, keysMapped);
  const otherTypes = searchRemainingTypes({ typesNotAnalyzed, fullCode });

  return {
    models: generateGraphqlModel(models),
    queries: prettify(
      `\n${generateGraphqlInputs(querySearch)}\ntype ${'Query'} {\n${generateGraphqlQueryOrMutation(querySearch)}\n}`,
    ),
    mutations: prettify(
      `\n${generateGraphqlInputs(mutationSearch)}\ntype ${'Mutation'} {\n${generateGraphqlQueryOrMutation(
        mutationSearch,
      )}\n}`,
    ),
    otherTypes,
  };
};
