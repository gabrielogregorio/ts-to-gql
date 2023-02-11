import { fromToType } from '@/utils/types';

const removeSymbols = (lineCode: string): string => lineCode.trim().replace(';', '');

const replaceTypeForCustomTypes = (targetType: string, fromTo: fromToType[]): string => {
  let finalType: string = targetType;
  fromTo.forEach((itemTo: fromToType) => {
    if (itemTo.from === finalType) {
      finalType = itemTo.to;
    }

    if (`${itemTo.from}[]` === finalType) {
      finalType = `${itemTo.to}[]`;
    }
  });

  return finalType;
};

const tsTypeIsArray = (tsType: string): boolean => tsType.endsWith('[]');
const tsArrayToGqlArray = (tsTypeArray: string): string => {
  const INDEX_IGNORE_LIST_SYMBOL: number = 2;
  return `[${tsTypeArray.slice(0, tsTypeArray.length - INDEX_IGNORE_LIST_SYMBOL)}]`;
};

export const tsTypeToGql = (typeTs: string, isOptional: boolean, fromTo: fromToType[] = []): string => {
  const typeTsHandled: string = replaceTypeForCustomTypes(removeSymbols(typeTs), fromTo);

  const typeIsOptional: string = isOptional ? '' : '!';

  const typesToGqlLiterals: { [key in string | 'default']: () => string } = {
    string: () => `String${typeIsOptional}`,
    'string[]': () => `[String]${typeIsOptional}`,

    number: () => `Int${typeIsOptional}`,
    'number[]': () => `[Int]${typeIsOptional}`,

    boolean: () => `Boolean${typeIsOptional}`,
    'boolean[]': () => `[Boolean]${typeIsOptional}`,

    default: (): string => {
      if (tsTypeIsArray(typeTsHandled)) {
        return `${tsArrayToGqlArray(typeTsHandled)}${typeIsOptional}`;
      }

      return `${typeTsHandled}${typeIsOptional}`;
    },
  };

  return typesToGqlLiterals[typeTsHandled]?.() || typesToGqlLiterals.default();
};

const keyIsOptional = (key: string): boolean => key.includes('?');

const removeOptionalCharacter = (key: string): string => key.replace('?', '');

const removeColonFromKeyType = (key: string, type: string): string => `\n${key}${type}`;

export const definitionTypeTsToGql = (originalSchemaTs: string, fromTo: fromToType[] = []): string => {
  let finalSchemaInGraphql: string = '';

  const linesOriginalSchema: string[] = originalSchemaTs.split('\n');

  linesOriginalSchema.forEach((lineOriginalSchema: string) => {
    const [key, type] = lineOriginalSchema.split(':');

    const existsKeyAndValue: string = key && type;
    const isBracket: boolean = type?.trim() === '{';
    const isNotBracket: boolean = !isBracket;

    const isAvailableKeyValue: boolean = Boolean(existsKeyAndValue) && isNotBracket;
    const isStartBracket: boolean = Boolean(existsKeyAndValue) && isBracket;
    const existsSomething: string = lineOriginalSchema.trim();

    if (isAvailableKeyValue) {
      const keyHandled: string = removeOptionalCharacter(key);
      const typeGraphqlHandled: string = tsTypeToGql(type, keyIsOptional(key), fromTo);
      finalSchemaInGraphql += `\n${keyHandled}: ${typeGraphqlHandled}`;
    } else if (isStartBracket) {
      finalSchemaInGraphql += removeColonFromKeyType(key, type);
    } else if (existsSomething) {
      finalSchemaInGraphql += `\n${lineOriginalSchema}`;
    }
  });

  return finalSchemaInGraphql;
};
