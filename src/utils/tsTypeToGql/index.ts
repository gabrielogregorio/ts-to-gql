type fromToType = {
  from: string;
  to: string;
};

const removeSymbols = (lineCode: string): string => lineCode.trim().replace(';', '');

const replaceTypeForCustomTypes = (targetType: string, fromTo: fromToType[]): string => {
  let finalType = targetType;
  fromTo.forEach((itemTo) => {
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
  const typeTsHandled = replaceTypeForCustomTypes(removeSymbols(typeTs), fromTo);

  const typeIsOptional = isOptional ? '' : '!';

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
  let finalSchemaInGraphql = '';

  const linesOriginalSchema = originalSchemaTs.split('\n');

  linesOriginalSchema.forEach((lineOriginalSchema) => {
    const [key, type] = lineOriginalSchema.split(':');

    const existsKeyAndValue = key && type;
    const isBracket = type?.trim() === '{';
    const isNotBracket = !isBracket;

    const isAvailableKeyValue = existsKeyAndValue && isNotBracket;
    const isStartBracket = existsKeyAndValue && isBracket;
    const existsSomething = lineOriginalSchema.trim();

    if (isAvailableKeyValue) {
      const keyHandled = removeOptionalCharacter(key);
      const typeGraphqlHandled = tsTypeToGql(type, keyIsOptional(key), fromTo);
      finalSchemaInGraphql += `\n${keyHandled}: ${typeGraphqlHandled}`;
    } else if (isStartBracket) {
      finalSchemaInGraphql += removeColonFromKeyType(key, type);
    } else if (existsSomething) {
      finalSchemaInGraphql += `\n${lineOriginalSchema}`;
    }
  });

  return finalSchemaInGraphql;
};
