import { ModelUserSelect } from '@/models/User';

interface IQueryGetUserInput {
  createUserPayload: {
    id: string;
  };
}

type tokenRequest = {
  token: string;
};

type QueryUser = {
  getUsers: () => Promise<ModelUserSelect[]>;
  getUser: (_: unknown, id: IQueryGetUserInput) => Promise<ModelUserSelect>;
  getMe: (_: unknown, args: unknown, token: tokenRequest) => Promise<ModelUserSelect>;
};

export const QueryUserResolver: QueryUser = {
  async getUsers(): Promise<ModelUserSelect[]> {
    return [];
  },

  async getUser(_, { createUserPayload: { id } }): Promise<ModelUserSelect> {
    return {} as unknown as ModelUserSelect;
  },

  getMe: async (_, args, { token }): Promise<ModelUserSelect> => ({} as unknown as ModelUserSelect),
};
