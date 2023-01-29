type searchTypesInCodeType = {
  models: string;
  queries: string;
  mutations: string;
  otherTypes: string;
};

export const mergeGqlTypes = ({ models, queries, mutations, otherTypes }: searchTypesInCodeType): string =>
  `${models}\n  ${queries}\n  ${mutations}\n  ${otherTypes}`;
