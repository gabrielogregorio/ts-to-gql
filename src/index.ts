import { mapFilesAndGenerateBigFile } from '@/modules/mapFilesAndGenerateBigFile';
import { saveGraphqlSchema } from '@/modules/saveGraphqlSchema';
import { searchTypesInCode } from '@/modules/searchTypesInCode';
import { handleFinalSchema } from '@/modules/handleFinalSchema';
import { readFile } from '@/modules/readFile';

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
    return readFile(pathSaveSchema);
  }

  const fullCode = mapFilesAndGenerateBigFile({ pathScanProject });

  const typesMapped = searchTypesInCode({
    fullCode,
    prefixModel,
    prefixMutation,
    prefixQuery,
  });

  const graphqlSchema = handleFinalSchema(typesMapped, {
    fixSchema,
    prefixModel,
    prefixMutation,
    prefixQuery,
    removePrefixFromSchema,
  });

  saveGraphqlSchema(pathSaveSchema, graphqlSchema);

  return graphqlSchema;
};
