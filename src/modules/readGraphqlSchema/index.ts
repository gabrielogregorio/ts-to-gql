import fsNode from 'fs';

export const readGraphqlSchema = (pathSchema: string): string => fsNode.readFileSync(pathSchema, 'utf8').toString();
