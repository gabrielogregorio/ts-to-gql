import { GetTypesNotMapped } from '@/handlers/getTypesNotMapped';
import { searchModels } from '@/handlers/searchModels';
import { searchRemainingTypes } from '@/handlers/searchRemainingTypes';
import { searchTypeResolvers } from '@/handlers/searchTypeResolvers';

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
  const typesNotAnalyzed = GetTypesNotMapped([...queries.keys, ...mutation.keys], models.listModelsMapped);
  const otherTypes = searchRemainingTypes({ typesNotAnalyzed, fullCodeMerged });

  return {
    models: models.queries,
    queries: queries.values,
    mutations: mutation.values,
    otherTypes,
  };
};
