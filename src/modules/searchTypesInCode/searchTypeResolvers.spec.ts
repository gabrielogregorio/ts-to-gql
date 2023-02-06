import { searchTypeResolvers } from '@/modules/searchTypesInCode/searchTypeResolvers';

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
      getUsers: () => Promise<GqlGqlModelUserSelect[]>;
      getUser: (_: unknown, id: IInput) => Promise<GqlGqlModelUserSelect>;
      getMe: (_: unknown, args: unknown, token: tokenRequest) => Promise<GqlGqlModelUserSelect>;
    };

    interface IInputRequestId {
      inputInside2: {
        id: number;
      }
    }

    type GqlQueryPost = {
      getPosts: () => Promise<GqlGqlModelPostSelect[]>;
      getPost: (_: unknown, id: IInputRequestId) => Promise<GqlGqlModelPostSelect>;
    };

    export const QueryPostResolver: GqlQueryPost = {
      async getPosts(): Promise<GqlGqlModelPostSelect[]> {
        return [];
      },

      async getPost(_, { id }): Promise<GqlGqlModelPostSelect> {
        return {} as unknown as GqlGqlModelPostSelect;
      },
    };

`;

    expect(searchTypeResolvers(mock, 'Query', 'GqlQuery')).toEqual({
      keys: [
        'GqlGqlModelUserSelect',
        'GqlGqlModelUserSelect',
        'GqlGqlModelUserSelect',
        'GqlGqlModelUserSelect',
        'GqlGqlModelUserSelect',
        'GqlGqlModelUserSelect',
        'GqlGqlModelPostSelect',
        'GqlGqlModelPostSelect',
        'GqlGqlModelPostSelect',
        'GqlGqlModelPostSelect',
      ],
      values: `input IInput {
  id: String!
}

input IInputRequestId {
  id: Int!
}

type Query {
  getUsers: [GqlGqlModelUserSelect]!
  getUser(inputInside: IInput): GqlGqlModelUserSelect!
  getMe: GqlGqlModelUserSelect!
  getPosts: [GqlGqlModelPostSelect]!
  getPost(inputInside2: IInputRequestId): GqlGqlModelPostSelect!
}
`,
    });
  });
});
