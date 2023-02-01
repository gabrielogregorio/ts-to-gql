import { getTypesNotMapped } from '@/modules/searchTypesInCode/getTypesNotMapped';
import { searchModels } from '@/modules/searchTypesInCode/searchModels';
import { searchRemainingTypes } from '@/modules/searchTypesInCode/searchRemainingTypes';
import { searchTypeResolvers } from '@/modules/searchTypesInCode/searchTypeResolvers';

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

export const searchTypesInCode = ({
  fullCodeMerged,
  prefixModel,
  prefixMutation,
  prefixQuery,
}: searchTypesInCodeType): searchTypesInCodeResponseType => {
  const models = searchModels(fullCodeMerged, prefixModel);
  const queries = searchTypeResolvers(fullCodeMerged, 'Query', prefixQuery);
  const mutation = searchTypeResolvers(fullCodeMerged, 'Mutation', prefixMutation);
  const typesNotAnalyzed = getTypesNotMapped([...queries.keys, ...mutation.keys], models.listModelsMapped);
  const otherTypes = searchRemainingTypes({ typesNotAnalyzed, fullCodeMerged });

  return {
    models: models.queries,
    queries: queries.values,
    mutations: mutation.values,
    otherTypes,
  };
};
