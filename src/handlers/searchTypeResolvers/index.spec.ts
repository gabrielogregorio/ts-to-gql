import { searchTypeResolvers } from '@/handlers/searchTypeResolvers';

describe('searchTypeResolvers()', () => {
  it('should search resolvers and signatures', () => {
    const mock = `

    interface IInput {
      inputInside: {
        id: string;
      }
    }

    type tokenRequest = {
      token: string;
    };

    type QueryUser = {
      getUsers: () => Promise<ModelUserSelect[]>;
      getUser: (_: unknown, id: IInput) => Promise<ModelUserSelect>;
      getMe: (_: unknown, args: unknown, token: tokenRequest) => Promise<ModelUserSelect>;
    };

    interface IInputRequestId {
      inputInside2: {
        id: number;
      }
    }

    type QueryPost = {
      getPosts: () => Promise<ModelPostSelect[]>;
      getPost: (_: unknown, id: IInputRequestId) => Promise<ModelPostSelect>;
    };

    export const QueryPostResolver: QueryPost = {
      async getPosts(): Promise<ModelPostSelect[]> {
        return [];
      },

      async getPost(_, { id }): Promise<ModelPostSelect> {
        return {} as unknown as ModelPostSelect;
      },
    };

`;

    expect(searchTypeResolvers(mock, 'Query', 'Query')).toEqual({
      keys: [
        'ModelUserSelect',
        'ModelUserSelect',
        'ModelUserSelect',
        'ModelUserSelect',
        'ModelUserSelect',
        'ModelUserSelect',
        'ModelPostSelect',
        'ModelPostSelect',
        'ModelPostSelect',
        'ModelPostSelect',
      ],
      values: `input IInput {
  id: String!
}

input IInputRequestId {
  id: Int!
}

type Query {
  getUsers: [ModelUserSelect]!
  getUser(inputInside: IInput): ModelUserSelect!
  getMe: ModelUserSelect!
  getPosts: [ModelPostSelect]!
  getPost(inputInside2: IInputRequestId): ModelPostSelect!
}
`,
    });
  });
});
