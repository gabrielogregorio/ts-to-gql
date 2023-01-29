export const tsToGraphql = (
  typeTs: string,
  typeIsOptional: boolean,
  replaceValueTo: { from: string; to: string }[] = [],
): string => {
  let finalValue = typeTs.trim().replace(';', '');

  replaceValueTo.forEach((itemTo) => {
    if (itemTo.from === finalValue) {
      finalValue = itemTo.to;
    }

    if (`${itemTo.from}[]` === finalValue) {
      finalValue = `${itemTo.to}[]`;
    }
  });

  const typehandled = finalValue;

  if (typehandled === 'string') {
    return `String${typeIsOptional ? '' : '!'}`;
  }

  if (typehandled === 'string') {
    return `String${typeIsOptional ? '' : '!'}`;
  }

  if (typehandled === 'string[]') {
    return `[String]${typeIsOptional ? '' : '!'}`;
  }

  if (typehandled === 'number') {
    return `Number${typeIsOptional ? '' : '!'}`;
  }

  if (typehandled === 'number[]') {
    return `[Number]${typeIsOptional ? '' : '!'}`;
  }

  if (typehandled === 'boolean') {
    return `Boolean${typeIsOptional ? '' : '!'}`;
  }

  if (typehandled === 'boolean[]') {
    return `[Boolean]${typeIsOptional ? '' : '!'}`;
  }

  if (typehandled.endsWith('[]')) {
    return `[${typehandled.slice(0, typehandled.length - 2)}]${typeIsOptional ? '' : '!'}`;
  }

  return `${typehandled}${typeIsOptional ? '' : '!'}`;
};

export const transformTsToGraphql = (
  itemsType: string,
  replaceValueTo: { from: string; to: string }[] = [],
): string => {
  let mountedSchema = '';

  itemsType.split('\n').forEach((line) => {
    const [key, type] = line.split(':');
    if (key && type && type.trim() !== '{' && type.trim() !== '}' && type.trim() !== '[' && type.trim() !== ']') {
      const typeIsRequired = key.includes('?');
      const keyHandled = key.replace('?', '');
      mountedSchema += `\n${keyHandled}: ${tsToGraphql(type, typeIsRequired, replaceValueTo)}`;
    } else if (key && type && type.trim() === '{') {
      mountedSchema += `\n${key}${type}`;
    } else if (line.trim()) {
      mountedSchema += `\n${line}`;
    }
  });

  return mountedSchema;
};
