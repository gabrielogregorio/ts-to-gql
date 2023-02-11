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
const ignoreExtensions = ['.spec.ts', '.spec.tsx', '.test.ts', '.test.tsx'];
const ignoreFolders = ['node_modules'];

export const mapFiles = (basePath: string): string[] => {
  const allFiles = readdirSync(basePath, [], ignoreFolders);
  const files: string[] = [];

  allFiles.forEach((file: string) => {
    if (file.endsWith(USE_ONLY_FILES_END_WITH) && ignoreExtensions.every((item) => file.endsWith(item) === false)) {
      files.push(file);
    }
  });

  return files;
};
