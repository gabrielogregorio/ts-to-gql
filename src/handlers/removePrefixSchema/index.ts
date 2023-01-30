type removePrefixSchemaType = {
  graphqlSchema: string;
  prefixModel: string;
  prefixMutation: string;
  prefixQuery: string;
};

export const removePrefixSchema = ({
  graphqlSchema,
  prefixModel,
  prefixMutation,
  prefixQuery,
}: removePrefixSchemaType): string =>
  graphqlSchema
    .replace(new RegExp(prefixModel, 'g'), '')
    .replace(new RegExp(prefixMutation, 'g'), '')
    .replace(new RegExp(prefixQuery, 'g'), '');
