const generateSpaces = (size: number): string => Array(size).fill(' ').join('');

const removeAllBlankLines = (code: string): string =>
  code
    .split('\n')
    .filter((item) => item.trim() !== '')
    .join('\n');

const applyFormatInCode = (code: string): string => {
  const SPACES_BY_LEVEL = 2;
  let depth = 0;

  return code
    .split('\n')
    .map((item) => {
      const startBracketLine = item.includes('{');
      const endBracketLine = item.includes('}');

      let returnItem = '';
      if (startBracketLine && endBracketLine) {
        returnItem = `${generateSpaces(depth)}${item.trim()}`;
      } else if (startBracketLine) {
        returnItem = `${generateSpaces(depth)}${item.trim()}`;
        depth += SPACES_BY_LEVEL;
      } else if (endBracketLine) {
        depth -= SPACES_BY_LEVEL;
        returnItem = `${generateSpaces(depth)}${item.trim()}`;
      } else {
        returnItem = `${generateSpaces(depth)}${item.trim()}`;
      }
      return returnItem;
    })
    .join('\n');
};

const addSpacesAfterBracket = (code: string): string =>
  code
    .split('\n')
    .map((item) => {
      if (item === '}') {
        return `${item}\n`;
      }
      return item;
    })
    .join('\n');

export const prettify = (graphqlSchema: string): string => {
  const prettifyCode = applyFormatInCode(graphqlSchema);

  const removeAllSpacesTrashed = removeAllBlankLines(prettifyCode);

  return addSpacesAfterBracket(removeAllSpacesTrashed);
};
