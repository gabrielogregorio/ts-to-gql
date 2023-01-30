import { mapFiles } from '@/handlers/mapFiles';
import fsPromise from 'fs';

export const mapFilesAndGenerateBigFile = ({ baseUrl }: { baseUrl: string }): string => {
  const items: string[] = mapFiles(baseUrl);
  return items.map((item) => fsPromise.readFileSync(item, { encoding: 'utf-8' })).join('\n');
};
