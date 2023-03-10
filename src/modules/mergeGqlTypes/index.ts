import { prettify } from '@/modules/prettify';

export type searchTypesInCodeType = {
  models: string;
  queries: string;
  mutations: string;
  otherTypes: string;
};

export const mergeGqlTypes = ({ models, queries, mutations, otherTypes }: searchTypesInCodeType): string => {
  const schemaGraphql = `${models}\n  ${queries}\n  ${mutations}\n  ${otherTypes}`;

  return prettify(schemaGraphql);
};
