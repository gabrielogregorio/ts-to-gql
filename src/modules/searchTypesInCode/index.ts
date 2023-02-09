import { prettify } from '@/modules/prettify';
import { getTypesNotMapped } from '@/modules/searchTypesInCode/getTypesNotMapped';
import { searchRemainingTypes } from '@/modules/searchTypesInCode/searchRemainingTypes';
import { searchSignatures } from '@/modules/searchTypesInCode/searchSignatures';
import { analyzeQueryOrMutationTs } from '@/modules/searchTypesInCode/analyzeQueryOrMutationTs';
import { generateGraphqlQueryOrMutation } from '@/modules/searchTypesInCode/generateGraphqlQueryOrMutation';
import { generateGraphqlModel } from '@/modules/searchTypesInCode/generateGraphqlModel';
import { generateGraphqlInputs } from '@/modules/generateGraphqlInputs';
import { analyzeModel } from '@/modules/searchTypesInCode/analyzeModelTs';

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
  const modelSearch = analyzeModel(models);

  const keysNotMapped = [...querySearch.needMapping, ...mutationSearch.needMapping];

  const typesNotAnalyzed = getTypesNotMapped(keysNotMapped, modelSearch.metadata.hasMapped);
  const otherTypes = searchRemainingTypes({ typesNotAnalyzed, fullCode });

  return {
    models: generateGraphqlModel(modelSearch.info),
    queries: prettify(
      `\n${generateGraphqlInputs(querySearch.info)}\ntype ${'Query'} {\n${generateGraphqlQueryOrMutation(
        querySearch.info,
      )}\n}`,
    ),
    mutations: prettify(
      `\n${generateGraphqlInputs(mutationSearch.info)}\ntype ${'Mutation'} {\n${generateGraphqlQueryOrMutation(
        mutationSearch.info,
      )}\n}`,
    ),
    otherTypes,
  };
};
