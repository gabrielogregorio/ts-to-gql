import { mergeGqlTypes, searchTypesInCodeType } from '@/modules/mergeGqlTypes';
import { removePrefixSchema } from '@/modules/removePrefixSchema';

type extrasType = {
  fixSchema: (schema: string) => string;
  removePrefixFromSchema: boolean;
  prefixModel: string;
  prefixMutation: string;
  prefixQuery: string;
};

export const handleFinalSchema = (
  typesToMerge: searchTypesInCodeType,
  { fixSchema, prefixModel, prefixMutation, prefixQuery, removePrefixFromSchema }: extrasType,
): string => {
  const completeGqlModel = fixSchema(mergeGqlTypes(typesToMerge));

  let graphqlSchemaHandled = completeGqlModel;
  if (removePrefixFromSchema) {
    graphqlSchemaHandled = removePrefixSchema(completeGqlModel, {
      prefixModel,
      prefixMutation,
      prefixQuery,
    });
  }

  return graphqlSchemaHandled;
};
