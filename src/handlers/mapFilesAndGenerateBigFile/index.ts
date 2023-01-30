import { mapFiles } from '@/handlers/mapFiles';
import fsPromise from 'fs';

export const mapFilesAndGenerateBigFile = ({ pathScanProject }: { pathScanProject: string }): string => {
  const items: string[] = mapFiles(pathScanProject);
  return items.map((item) => fsPromise.readFileSync(item, { encoding: 'utf-8' })).join('\n');
};
