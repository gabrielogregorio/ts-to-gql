import { mapFilesAndGenerateBigFile } from '@/handlers/mapFilesAndGenerateBigFile';
import { mergeGqlTypes } from '@/handlers/mergeGqlTypes';
import { removePrefixSchema } from '@/handlers/removePrefixSchema';
import { saveGraphqlSchema } from '@/handlers/saveGraphqlSchema';
import { searchTypesInCode } from '@/handlers/searchTypesInCode';
import { Log } from '@/log/index';

export * as ExtraTypes from './gql';

type searchGraphqlSchemaType = {
  pathScanProject: string;
  pathSaveSchema?: string;
  removePrefixFromSchema?: boolean;
  isProduction: boolean;
  fixSchema?: (schema: string) => string;
  prefixModel?: string;
  prefixMutation?: string;
  prefixQuery?: string;
};

export const searchGraphqlSchema = ({
  pathScanProject,
  isProduction,
  removePrefixFromSchema = false,
  pathSaveSchema = './schema.ts_to_gql.graphql',
  prefixModel = 'GqlModel',
  prefixMutation = 'GqlMutation',
  prefixQuery = 'GqlQuery',
  fixSchema = (schema: string): string => schema,
}: searchGraphqlSchemaType): string => {
  if (isProduction) {
    return '';
  }
  Log.info('running in developer mode');

  const fullCodeMerged = mapFilesAndGenerateBigFile({ pathScanProject });

  const typesToMerge = searchTypesInCode({
    fullCodeMerged,
    prefixModel,
    prefixMutation,
    prefixQuery,
  });

  const completeGqlModel = fixSchema(mergeGqlTypes(typesToMerge));

  let graphqlSchemaHandled = completeGqlModel;
  if (removePrefixFromSchema) {
    graphqlSchemaHandled = removePrefixSchema({
      graphqlSchema: completeGqlModel,
      prefixModel,
      prefixMutation,
      prefixQuery,
    });
  }

  saveGraphqlSchema(pathSaveSchema, graphqlSchemaHandled);

  return graphqlSchemaHandled;
};
