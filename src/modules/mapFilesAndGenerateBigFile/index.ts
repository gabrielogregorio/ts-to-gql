import { mapFiles } from '@/modules/mapFiles';
import fsNode from 'fs';

export const mapFilesAndGenerateBigFile = ({ pathScanProject }: { pathScanProject: string }): string => {
  const items: string[] = mapFiles(pathScanProject);
  return items.map((item) => fsNode.readFileSync(item, { encoding: 'utf-8' })).join('\n');
};
