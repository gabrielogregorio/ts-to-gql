import fsNode from 'fs';

export const readFile = (path: string): string => fsNode.readFileSync(path, { encoding: 'utf-8' }).toString();
