import { mapFilesAndGenerateBigFile } from '@/handlers/mapFilesAndGenerateBigFile';
import { mergeGqlTypes } from '@/handlers/mergeGqlTypes';
import { saveGraphqlSchema } from '@/handlers/saveGraphqlSchema';
import { searchTypesInCode } from '@/handlers/searchTypesInCode';
import { Log } from '@/log/index';

const saveGraphqlSchemaPath: string = './schema.ts_to_gql.graphql';

export const generateGraphqlSchema = ({ baseUrl }: { baseUrl: string }): string => {
  Log.info('running in developer mode');

  const fullCodeMerged = mapFilesAndGenerateBigFile({ baseUrl });

  const typesToMerge = searchTypesInCode(fullCodeMerged);

  const completeGqlModel = mergeGqlTypes(typesToMerge);

  saveGraphqlSchema(saveGraphqlSchemaPath, completeGqlModel);

  return completeGqlModel;
};
