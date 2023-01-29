import { getRecursiveContentInRegion } from '@/handlers/getRecursiveRegion';
import { transformTsToGraphql } from '@/handlers/tsToGraphql';

export const searchTypeOrInterfaceAndGetContent = (list: string[], code: string) =>
  list.map((name) => {
    const reGetInterfacesAndTypes = (name: string): RegExp => new RegExp(`${name}\\s{0,50}([^$]*)`);
    const options = reGetInterfacesAndTypes(name).exec(code);
    const resultInterface = getRecursiveContentInRegion(options[1], {
      startDelimiter: '{',
      endDelimiter: '}',
      skipStrings: true,
      ignoreCharactersOutString: [',', ';'],
    });

    const discoveryTypeQuery = (queryName: string) => {
      if (queryName.toLocaleLowerCase().includes('input')) {
        return 'input';
      }
      return 'type';
    };

    const removeFirstBreakLineIfExists = (content: string) => content.replace(/^\n{0,10}/g, '');

    return {
      graphqlContentType: removeFirstBreakLineIfExists(
        transformTsToGraphql(resultInterface, [{ from: 'Types.ObjectId', to: 'ID' }]),
      ),
      graphqlName: name,
      graphqlType: discoveryTypeQuery(name),
    };
  });

export const textMountedSearchTypes = (
  content: {
    graphqlContentType: string;
    graphqlName: string;
    graphqlType: string;
  }[],
): string => content.map((item) => `${item.graphqlType} ${item.graphqlName} ${item.graphqlContentType}`).join('\n\n');
