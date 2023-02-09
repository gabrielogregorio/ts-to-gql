/* eslint-disable @typescript-eslint/no-unused-vars */
import { GqlModelUserSelect } from '@/models/User';

interface IQueryGetUserInput {
  createUserPayload: {
    id: string;
  };
}

type tokenRequest = {
  token: string;
};

type GqlQueryUser = {
  getUsers: () => Promise<GqlModelUserSelect[]>;
  getUser: (_: unknown, id: IQueryGetUserInput) => Promise<GqlModelUserSelect>;
  getMe: (_: unknown, args: unknown, token: tokenRequest) => Promise<GqlModelUserSelect>;
};

export const QueryUserResolver: GqlQueryUser = {
  async getUsers(): Promise<GqlModelUserSelect[]> {
    return [];
  },

  async getUser(_, { createUserPayload: { id } }): Promise<GqlModelUserSelect> {
    return {} as unknown as GqlModelUserSelect;
  },

  getMe: async (_, args, { token }): Promise<GqlModelUserSelect> => ({} as unknown as GqlModelUserSelect),
};
