type fromToType = {
  from: string;
  to: string;
};

const clearGraphqlTrash = (lineCode: string): string => lineCode.trim().replace(';', '');

const replaceTypeForOther = (targetType: string, fromTo: fromToType[]): string => {
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
export const tsToGraphql = (typeTs: string, isOptional: boolean, fromTo: fromToType[] = []): string => {
  const typeTsHandled = replaceTypeForOther(clearGraphqlTrash(typeTs), fromTo);

  const isOptionalSymbol = isOptional ? '' : '!';

  const typesToGqlLiterals = {
    string: () => `String${isOptionalSymbol}`,
    'string[]': () => `[String]${isOptionalSymbol}`,

    number: () => `Number${isOptionalSymbol}`,
    'number[]': () => `[Number]${isOptionalSymbol}`,

    boolean: () => `Boolean${isOptionalSymbol}`,
    'boolean[]': () => `[Boolean]${isOptionalSymbol}`,

    default: (): string => {
      if (typeTsHandled.endsWith('[]')) {
        const INDEX_IGNORE_LIST_SYMBOL: number = 2;
        return `[${typeTsHandled.slice(0, typeTsHandled.length - INDEX_IGNORE_LIST_SYMBOL)}]${isOptionalSymbol}`;
      }

      return `${typeTsHandled}${isOptionalSymbol}`;
    },
  };

  // @ts-ignore
  return typesToGqlLiterals[typeTsHandled]?.() || typesToGqlLiterals.default();
};

const keyIsOptional = (key: string): boolean => key.includes('?');

const removeOptionalCharacter = (key: string): string => key.replace('?', '');

const removeColonFromKeyType = (key: string, type: string): string => `\n${key}${type}`;

export const linesTsToGraphql = (originalSchemaTs: string, fromTo: fromToType[] = []): string => {
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
      const typeGraphqlHandled = tsToGraphql(type, keyIsOptional(key), fromTo);
      finalSchemaInGraphql += `\n${keyHandled}: ${typeGraphqlHandled}`;
    } else if (isStartBracket) {
      finalSchemaInGraphql += removeColonFromKeyType(key, type);
    } else if (existsSomething) {
      finalSchemaInGraphql += `\n${lineOriginalSchema}`;
    }
  });

  return finalSchemaInGraphql;
};
