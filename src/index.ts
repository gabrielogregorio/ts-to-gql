import { Log } from '@/log/index';
import fsNode from 'fs';
import { mapFilesAndGenerateBigFile } from '@/modules/mapFilesAndGenerateBigFile';
import { saveGraphqlSchema } from '@/modules/saveGraphqlSchema';
import { searchTypesInCode } from '@/modules/searchTypesInCode';
import { handleFinalSchema } from '@/modules/handleFinalSchema';

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

  const fullCode = mapFilesAndGenerateBigFile({ pathScanProject });

  const typesToMerge = searchTypesInCode({
    fullCode,
    prefixModel,
    prefixMutation,
    prefixQuery,
  });

  const graphqlSchemaHandled = handleFinalSchema(typesToMerge, {
    fixSchema,
    prefixModel,
    prefixMutation,
    prefixQuery,
    removePrefixFromSchema,
  });

  saveGraphqlSchema(pathSaveSchema, graphqlSchemaHandled);

  return graphqlSchemaHandled;
};
