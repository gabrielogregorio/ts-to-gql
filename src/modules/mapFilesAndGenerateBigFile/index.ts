import { mapFiles } from '@/modules/mapFiles';
import { readFile } from '@/modules/readFile';

export const mapFilesAndGenerateBigFile = ({ pathScanProject }: { pathScanProject: string }): string => {
  const pathFiles: string[] = mapFiles(pathScanProject);
  return pathFiles.map((pathFile) => readFile(pathFile)).join('\n');
};
