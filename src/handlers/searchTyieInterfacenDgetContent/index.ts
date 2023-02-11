import { getRecursiveContentInRegion } from '@/utils/getRecursiveRegion';
import { definitionTypeTsToGql } from '@/utils/tsTypeToGql';

type typeResponse = {
  graphqlContentType: string;
  graphqlName: string;
};

const removeFirstBreakLineIfExists = (content: string): string => content.replace(/^\n{0,10}/g, '');

const reGetInterfacesAndTypes = (name: string): RegExp => new RegExp(`${name}\\s{0,50}([^$]*)`);

export const searchTypeOrInterfaceAndGetContent = (list: string[], code: string): typeResponse[] =>
  list.map((name) => {
    const options = reGetInterfacesAndTypes(name).exec(code);
    if (Boolean(options) === false || options === null) {
      throw new Error(`tipo ${name} não encontrado no código, favor, verificar se esse tipo existe no código!`);
    }

    const resultInterface = getRecursiveContentInRegion(options[1], {
      startDelimiter: '{',
      endDelimiter: '}',
      skipStrings: true,
      ignoreCharactersOutString: [',', ';'],
    });

    return {
      graphqlContentType: removeFirstBreakLineIfExists(
        definitionTypeTsToGql(resultInterface || '', [{ from: 'Types.ObjectId', to: 'ID' }]),
      ),
      graphqlName: name,
    };
  });

type textMountedSearchTypesType = {
  graphqlContentType: string;
  graphqlName: string;
};

export const textMountedSearchTypes = (content: textMountedSearchTypesType[]): string =>
  content.map((item) => `type ${item.graphqlName} ${item.graphqlContentType}`).join('\n\n');
