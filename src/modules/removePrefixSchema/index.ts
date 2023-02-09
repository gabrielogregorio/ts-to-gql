type removePrefixSchemaType = {
  prefixModel: string;
  prefixMutation: string;
  prefixQuery: string;
};

export const removePrefixSchema = (
  graphqlSchema: string,
  { prefixModel, prefixMutation, prefixQuery }: removePrefixSchemaType,
): string =>
  graphqlSchema
    .replace(new RegExp(prefixModel, 'g'), '')
    .replace(new RegExp(prefixMutation, 'g'), '')
    .replace(new RegExp(prefixQuery, 'g'), '');
