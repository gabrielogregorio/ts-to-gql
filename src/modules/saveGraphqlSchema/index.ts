import { Log } from '@/log/index';
import fsNode from 'fs';

export const saveGraphqlSchema = (path: string, graphqlSchema: string): void => {
  try {
    fsNode.writeFileSync(path, graphqlSchema);
    Log.info('graphql schema created');
  } catch (error: unknown) {
    throw new Error(`Erro ao salvar schema no path '${path}', favor, verificar as permissões ${error}`);
  }
};
