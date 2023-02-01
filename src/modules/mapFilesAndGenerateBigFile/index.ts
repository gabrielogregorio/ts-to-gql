import { Log } from '@/log/index';
import fsNode from 'fs';
import path from 'path';

const readdirSync = (fileOrDirectory: string, listFiles: string[], ignoreFolders: string[]): string[] => {
  const isDirectory = fsNode.statSync(fileOrDirectory).isDirectory();
  if (isDirectory && ignoreFolders.includes(fileOrDirectory) === false) {
    fsNode
      .readdirSync(fileOrDirectory)
      .forEach((file) =>
        readdirSync(listFiles[listFiles.push(path.join(fileOrDirectory, file)) - 1], listFiles, ignoreFolders),
      );
  }

  return listFiles;
};

const USE_ONLY_FILES_END_WITH = '.ts';
const ignoreFiles = ['.spec.ts', '.spec.tsx', '.test.ts', '.test.tsx'];
const ignoreFolders = ['node_modules'];

const mapFiles = (basePath: string): string[] => {
  Log.warning(`consider only '${USE_ONLY_FILES_END_WITH}' files`);
  Log.warning(`ignoring '${ignoreFolders}' folders`);
  Log.warning(`ignoring '${ignoreFiles}' files`);

  const allFiles = readdirSync(basePath, [], ignoreFolders);
  const files: string[] = [];

  allFiles.forEach((file: string) => {
    if (file.endsWith(USE_ONLY_FILES_END_WITH) && ignoreFiles.every((item) => file.endsWith(item) === false)) {
      files.push(file);
    }
  });

  Log.info(`find '${files.length}' files to analyze`);

  return files;
};

export const mapFilesAndGenerateBigFile = ({ pathScanProject }: { pathScanProject: string }): string => {
  const items: string[] = mapFiles(pathScanProject);
  return items.map((item) => fsNode.readFileSync(item, { encoding: 'utf-8' })).join('\n');
};
