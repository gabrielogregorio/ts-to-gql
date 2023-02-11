import fsNode from 'fs';

export const saveGraphqlSchema = (path: string, graphqlSchema: string): void => {
  fsNode.writeFileSync(path, graphqlSchema);
};
