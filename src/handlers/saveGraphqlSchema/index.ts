import { Log } from '@/log/index';
import fsNode from 'fs';

export const saveGraphqlSchema = (path: string, graphqlSchema: string): void => {
  try {
    fsNode.writeFileSync(path, graphqlSchema);
    Log.info('graphql schema created');
  } catch (error: unknown) {
    Log.error(`Error on save ${path}, please, check permissions`);
  }
};
