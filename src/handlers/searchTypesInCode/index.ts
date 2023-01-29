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

export const searchTypesInCode = (fullCodeMerged: string): searchTypesInCodeResponseType => {
  const models = searchModels(fullCodeMerged);
  const queries = searchTypeResolvers(fullCodeMerged, 'Query');
  const mutation = searchTypeResolvers(fullCodeMerged, 'Mutation');
  const typesNotAnalyzed = GetTypesNotMapped([...queries.keys, ...mutation.keys], models.listModelsMapped);
  const otherTypes = searchRemainingTypes({ typesNotAnalyzed, fullCodeMerged });

  return {
    models: models.queries,
    queries: queries.values,
    mutations: mutation.values,
    otherTypes,
  };
};
