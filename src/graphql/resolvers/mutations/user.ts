/* eslint-disable @typescript-eslint/no-unused-vars */
interface IInputCreateUserPayload {
  createUserPayload: {
    username: string;
    password: string;
    name: string;
  };
}

interface IInputUpdateUserPayload {
  updateUserPayload: {
    username: string;
    name: string;
    image: string;
  };
}

type CreateUserResponse = {
  id: string;
};

type UpdateUserResponse = {
  count: number;
};

type deleteUserResponse = {
  count: number;
};

type IInputIdUser = {
  input: {
    id: string;
  };
};

type tokenRequest = {
  token: string;
};

type GqlMutationUser = {
  createUser: (_: unknown, createUserPayload: IInputCreateUserPayload) => Promise<CreateUserResponse>;
  updateUser: (
    _: unknown,
    updateUserPayload: IInputUpdateUserPayload,
    token: tokenRequest,
  ) => Promise<UpdateUserResponse>;
  deleteUser: (_: unknown, id: IInputIdUser, token: tokenRequest) => Promise<deleteUserResponse>;
};

export const UserResolverMutation: GqlMutationUser = {
  createUser: async (_, { createUserPayload: { username, name, password } }) => ({ id: 'aaa' }),

  updateUser: async (_, { updateUserPayload: { username, name, image } }, { token }) => ({ count: 1 }),

  deleteUser: async (_, body, { token }) => ({ count: 1 }),
};
