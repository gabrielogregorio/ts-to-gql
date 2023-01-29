export const GetTypesNotMapped = (types: string[], typesMapped: string[]): string[] => {
  const notAnalyzed = [];
  types.forEach((item) => {
    if (typesMapped.includes(item) === false && notAnalyzed.includes(item) === false) {
      notAnalyzed.push(item);
    }
  });

  return notAnalyzed;
};
