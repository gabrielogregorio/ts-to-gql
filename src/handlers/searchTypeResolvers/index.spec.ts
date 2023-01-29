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

    type GqlQueryUser = {
      getUsers: () => Promise<GqlModelUserSelect[]>;
      getUser: (_: unknown, id: IInput) => Promise<GqlModelUserSelect>;
      getMe: (_: unknown, args: unknown, token: tokenRequest) => Promise<GqlModelUserSelect>;
    };

    interface IInputRequestId {
      inputInside2: {
        id: number;
      }
    }

    type GqlQueryPost = {
      getPosts: () => Promise<GqlModelPostSelect[]>;
      getPost: (_: unknown, id: IInputRequestId) => Promise<GqlModelPostSelect>;
    };

    export const QueryPostResolver: GqlQueryPost = {
      async getPosts(): Promise<GqlModelPostSelect[]> {
        return [];
      },

      async getPost(_, { id }): Promise<GqlModelPostSelect> {
        return {} as unknown as GqlModelPostSelect;
      },
    };

`;

    expect(searchTypeResolvers(mock, 'Query')).toEqual({
      keys: ['GqlModelUserSelect', 'GqlModelPostSelect'],
      values: `input IInput {
  id: String!
}

input IInputRequestId {
  id: Number!
}

type Query {
  getUsers: [GqlModelUserSelect]!
  getUser(inputInside: IInput): GqlModelUserSelect!
  getMe: GqlModelUserSelect!
  getPosts: [GqlModelPostSelect]!
  getPost(inputInside2: IInputRequestId): GqlModelPostSelect!
}
`,
    });
  });
});
