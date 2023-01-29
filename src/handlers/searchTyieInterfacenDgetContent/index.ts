import { getRecursiveContentInRegion } from '@/handlers/getRecursiveRegion';
import { linesTsToGraphql } from '@/handlers/tsToGraphql';

type typeResponse =
  | undefined
  | {
      graphqlContentType: string;
      graphqlName: string;
    };

const reGetInterfacesAndTypes = (name: string): RegExp => new RegExp(`${name}\\s{0,50}([^$]*)`);

export const searchTypeOrInterfaceAndGetContent = (list: string[], code: string): typeResponse[] => {
  const items = list.map((name) => {
    const options = reGetInterfacesAndTypes(name).exec(code);
    if (Boolean(options) === false) {
      return undefined;
    }
    const resultInterface = getRecursiveContentInRegion(options[1], {
      startDelimiter: '{',
      endDelimiter: '}',
      skipStrings: true,
      ignoreCharactersOutString: [',', ';'],
    });

    const removeFirstBreakLineIfExists = (content: string): string => content.replace(/^\n{0,10}/g, '');

    return {
      graphqlContentType: removeFirstBreakLineIfExists(
        linesTsToGraphql(resultInterface, [{ from: 'Types.ObjectId', to: 'ID' }]),
      ),
      graphqlName: name,
    };
  });

  return items.filter((item) => item !== undefined);
};

export const textMountedSearchTypes = (
  content: {
    graphqlContentType: string;
    graphqlName: string;
  }[],
): string => content.map((item) => `type ${item.graphqlName} ${item.graphqlContentType}`).join('\n\n');
