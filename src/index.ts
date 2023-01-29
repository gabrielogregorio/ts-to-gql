import { Log } from '@/helpers/log';
import { mapFilesAndGenerateBigFile } from '@/helpers/mapFilesAndGenerateBigFile';
import { saveGraphqlSchema } from '@/helpers/saveGraphqlSchema';
import { mergeGqlTypes } from '@/handlers/mergeGqlTypes';
import { searchTypesInCode } from '@/handlers/searchTypesInCode';

const saveGraphqlSchemaPath: string = './schema.ts_to_gql.graphql';

export const generateGraphqlSchema = (): string => {
  Log.info('running in developer mode');

  const fullCodeMerged = mapFilesAndGenerateBigFile();

  const typesToMerge = searchTypesInCode(fullCodeMerged);

  const completeGqlModel = mergeGqlTypes(typesToMerge);

  saveGraphqlSchema(saveGraphqlSchemaPath, completeGqlModel);

  return completeGqlModel;
};

generateGraphqlSchema();
