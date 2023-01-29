import { mapFiles } from '@/handlers/mapFiles';
import fsPromise from 'fs';

export const mapFilesAndGenerateBigFile = (): string => {
  const items: string[] = mapFiles('.');
  return items.map((item) => fsPromise.readFileSync(item, { encoding: 'utf-8' })).join('\n');
};
