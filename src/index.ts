import { mapFilesAndGenerateBigFile } from '@/handlers/mapFilesAndGenerateBigFile';
import { mergeGqlTypes } from '@/handlers/mergeGqlTypes';
import { removePrefixSchema } from '@/handlers/removePrefixSchema';
import { saveGraphqlSchema } from '@/handlers/saveGraphqlSchema';
import { searchTypesInCode } from '@/handlers/searchTypesInCode';
import { Log } from '@/log/index';
import fsNode from 'fs';

const getGraphqlSchema = (pathSchema: string): string => fsNode.readFileSync(pathSchema, 'utf8').toString();

export * from './gql';

type searchGqlSchemaAndBuildType = {
  pathScanProject: string;
  pathSaveSchema?: string;
  removePrefixFromSchema?: boolean;
  isProduction: boolean;
  fixSchema?: (schema: string) => string;
  prefixModel?: string;
  prefixMutation?: string;
  prefixQuery?: string;
};

export const searchGqlSchemaAndBuild = ({
  pathScanProject,
  isProduction,
  removePrefixFromSchema = false,
  pathSaveSchema = './schema.ts_to_gql.graphql',
  prefixModel = 'GqlModel',
  prefixMutation = 'GqlMutation',
  prefixQuery = 'GqlQuery',
  fixSchema = (schema: string): string => schema,
}: searchGqlSchemaAndBuildType): string => {
  if (isProduction) {
    return getGraphqlSchema(pathSaveSchema);
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
