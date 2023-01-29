import { fromInterfaceGetResolverNameParamsAndReturn } from '@/handlers/fromInterfaceGetResolverNameParamsAndReturn';
import { getRecursiveContentInRegion } from '@/handlers/getRecursiveRegion';
import { searchModels } from '@/handlers/searchModels';
import { searchQueries } from '@/handlers/searchQueries';
import { transformTsToGraphql } from '@/handlers/tsToGraphql';
import { searchTypeOrInterfaceAndGetContent, textMountedSearchTypes } from '@/helpers/searchTyieInterfacenDgetContent';

const getInterface = (code: string) => {
  const regexSearchinterfaceMutationInFirstGroup = /interface IGraphqlMutation.*([^}]*)/;
  return regexSearchinterfaceMutationInFirstGroup.exec(code)[1];
};

const mockCode = `

interface IPostSelect {
  id: Types.ObjectId;
  author: IUserSelect;
  body?: string;
  img?: string;
  likes: Types.ObjectId[];
}

type DeletePostResponse = {
  count: number;
};

interface InputCreatePostPayload {
  createPostPayload: {
    body: string;
    img: string;
    video: string;
  };
}

interface IInputUpdatePostPayload {
  updatePostPayload: {
    body: string;
    img: string;
    video: string;
    id: string;
  };
}

interface IInputHandlePostPayload {
  handlePostPayload: {
    postId: string;
  };
}

type UpdatePostResponse = {
  count: number;
};

type HandlePostResponse = {
  includeLike: boolean;
};

interface IToken {
  token: string;
}

interface IInputDeletePost {
  id: string;
}


interface IGraphqlMutationPost {
  getThis: () => Promise<IPostSelect>;
  createPost: (
    _: any,
    createPostPayload: InputCreatePostPayload,
    context: IToken,
  ) => Promise<IPostSelect>;
  updatePost: (_: any, updatePostPayload: IInputUpdatePostPayload) => Promise<UpdatePostResponse>;
  handleLike: (
    _: any,
    handlePostPayload: IInputHandlePostPayload,
    context: IToken,
  ) => Promise<HandlePostResponse>;
  deletePost: (_: any, id: IInputDeletePost) => Promise<DeletePostResponse>;
}

`;

describe('', () => {
  const mockContentWithoutInterfaceBase = `
  getThis: () => Promise<IPostSelect>;
  createPost: (
    _: any,
    createPostPayload: InputCreatePostPayload,
    context: IToken,
  ) => Promise<IPostSelect>;
  updatePost: (_: any, updatePostPayload: IInputUpdatePostPayload) => Promise<UpdatePostResponse>;
  handleLike: (
    _: any,
    handlePostPayload: IInputHandlePostPayload,
    context: IToken,
  ) => Promise<HandlePostResponse>;
  deletePost: (_: any, id: IInputDeletePost) => Promise<DeletePostResponse>;
`;

  it('should extract content mutation Query', () => {
    expect(getInterface(mockCode)).toEqual(mockContentWithoutInterfaceBase);
  });

  const mockResolverParamsAndResponse = [
    {
      nameResolver: 'getThis',
      params: [],
      response: 'Promise<IPostSelect>',
    },
    {
      nameResolver: 'createPost',
      params: [
        { key: '_', value: 'any' },
        { key: 'createPostPayload', value: 'InputCreatePostPayload' },
        { key: 'context', value: 'IToken' },
      ],
      response: 'Promise<IPostSelect>',
    },
    {
      nameResolver: 'updatePost',
      params: [
        { key: '_', value: 'any' },
        { key: 'updatePostPayload', value: 'IInputUpdatePostPayload' },
      ],
      response: 'Promise<UpdatePostResponse>',
    },
    {
      nameResolver: 'handleLike',
      params: [
        { key: '_', value: 'any' },
        { key: 'handlePostPayload', value: 'IInputHandlePostPayload' },
        { key: 'context', value: 'IToken' },
      ],
      response: 'Promise<HandlePostResponse>',
    },
    {
      nameResolver: 'deletePost',
      params: [
        { key: '_', value: 'any' },
        { key: 'id', value: 'IInputDeletePost' },
      ],
      response: 'Promise<DeletePostResponse>',
    },
  ];

  it('should get params items', () => {
    expect(fromInterfaceGetResolverNameParamsAndReturn(mockContentWithoutInterfaceBase)).toEqual(
      mockResolverParamsAndResponse,
    );
  });

  it('', () => {
    const mockInput = `
    key: string
    key: string[]
    key?: string
    key?: string[]

    key: number
    key: number[]
    key?: number
    key?: number[]

    key: boolean
    key: boolean[]
    key?: boolean
    key?: boolean[]

    key: what
    key: what[]
    key?: what
    key?: what[]

    key: Types.ObjectId
    key: Types.ObjectId[]
    key?: Types.ObjectId
    key?: Types.ObjectId[]

    key: IAuth
    key: IAuth[]`;

    const mockData = `
    key: String!
    key: [String]!
    key: String
    key: [String]
    key: Number!
    key: [Number]!
    key: Number
    key: [Number]
    key: Boolean!
    key: [Boolean]!
    key: Boolean
    key: [Boolean]
    key: what!
    key: [what]!
    key: what
    key: [what]
    key: ID!
    key: [ID]!
    key: ID
    key: [ID]
    key: IAuth!
    key: [IAuth]!`;
    expect(transformTsToGraphql(mockInput, [{ from: 'Types.ObjectId', to: 'ID' }])).toEqual(mockData);
  });

  const mockListAllOtherTypes = [
    {
      graphqlContentType:
        '{\n' +
        '  createPostPayload {\n' +
        '    body: String!\n' +
        '    img: String!\n' +
        '    video: String!\n' +
        '  }\n' +
        '}',
      graphqlName: 'InputCreatePostPayload',
      graphqlType: 'input',
    },
    {
      graphqlContentType: '{\n  token: String!\n}',
      graphqlName: 'IToken',
      graphqlType: 'type',
    },
    {
      graphqlContentType:
        '{\n' +
        '  id: ID!\n' +
        '  author: IUserSelect!\n' +
        '  body: String\n' +
        '  img: String\n' +
        '  likes: [ID]!\n' +
        '}',
      graphqlName: 'IPostSelect',
      graphqlType: 'type',
    },
    {
      graphqlContentType:
        '{\n' +
        '  updatePostPayload {\n' +
        '    body: String!\n' +
        '    img: String!\n' +
        '    video: String!\n' +
        '    id: String!\n' +
        '  }\n' +
        '}',
      graphqlName: 'IInputUpdatePostPayload',
      graphqlType: 'input',
    },
    {
      graphqlContentType: '{\n  count: Number!\n}',
      graphqlName: 'UpdatePostResponse',
      graphqlType: 'type',
    },
    {
      graphqlContentType: '{\n  handlePostPayload {\n    postId: String!\n  }\n}',
      graphqlName: 'IInputHandlePostPayload',
      graphqlType: 'input',
    },
    {
      graphqlContentType: '{\n  includeLike: Boolean!\n}',
      graphqlName: 'HandlePostResponse',
      graphqlType: 'type',
    },
    {
      graphqlContentType: '{\n  id: String!\n}',
      graphqlName: 'IInputDeletePost',
      graphqlType: 'input',
    },
  ];

  it('', () => {
    const typesUsedNoPromises = new Set([
      'InputCreatePostPayload',
      'IToken',
      'IPostSelect',
      'IInputUpdatePostPayload',
      'UpdatePostResponse',
      'IInputHandlePostPayload',
      'IToken',
      'HandlePostResponse',
      'IInputDeletePost',
    ]);

    expect(searchTypeOrInterfaceAndGetContent([...typesUsedNoPromises], mockCode)).toEqual(mockListAllOtherTypes);
  });

  it('should mount full model graphql extras', () => {
    expect(textMountedSearchTypes(mockListAllOtherTypes)).toEqual(`input InputCreatePostPayload {
  createPostPayload {
    body: String!
    img: String!
    video: String!
  }
}

type IToken {
  token: String!
}

type IPostSelect {
  id: ID!
  author: IUserSelect!
  body: String
  img: String
  likes: [ID]!
}

input IInputUpdatePostPayload {
  updatePostPayload {
    body: String!
    img: String!
    video: String!
    id: String!
  }
}

type UpdatePostResponse {
  count: Number!
}

input IInputHandlePostPayload {
  handlePostPayload {
    postId: String!
  }
}

type HandlePostResponse {
  includeLike: Boolean!
}

input IInputDeletePost {
  id: String!
}`);
  });

  it('getRecursiveContentInRegion - should get complex json', () => {
    const localMock3 = `

interface IInputUpdatePostPayload {
  updatePostPayload {
    body: string;
    img: string;
    handlePostPayload {
      postId: string;
    };
    id: string;
  };
}} {}

interface IInputHandlePostPayload {
  handlePostPayload {
    postId: string;
  };
}`;

    expect(
      getRecursiveContentInRegion(localMock3, {
        startDelimiter: '{',
        endDelimiter: '}',
        skipStrings: true,
      }),
    ).toEqual(`{
  updatePostPayload {
    body: string;
    img: string;
    handlePostPayload {
      postId: string;
    };
    id: string;
  };
}`);
  });

  it('getRecursiveContentInRegion - should get a json with one dept, and strings', () => {
    const localMock2 = `

interface IInputUpdatePostPayload {
  updatePostPayload {
    body: string;
    img: string;
    video: "{ -> )";
    video: '{ -> )';
    video2: \`{ -> )\`;
    id: string;
  };
}

interface IInputHandlePostPayload {
  handlePostPayload {
    postId: string;
  };
}`;

    expect(
      getRecursiveContentInRegion(localMock2, {
        startDelimiter: '{',
        endDelimiter: '}',
        skipStrings: true,
      }),
    ).toEqual(`{
  updatePostPayload {
    body: string;
    img: string;
    video: "{ -> )";
    video: '{ -> )';
    video2: \`{ -> )\`;
    id: string;
  };
}`);
  });

  it('getRecursiveContentInRegion - should get a simple object ', () => {
    const localMock = `

interface IInputUpdatePostPayload {
  id: string;
}

interface IInputHandlePostPayload {
  handlePostPayload {
    postId: string;
  };
}`;

    expect(
      getRecursiveContentInRegion(localMock, {
        startDelimiter: '{',
        endDelimiter: '}',
        skipStrings: true,
      }),
    ).toEqual(`{
  id: string;
}`);
  });

  it('', () => {
    const mock = `generateGraphqlSchema();

    import { GqlModelUserSelect } from '@/models/User';

    type ObjectId = string;

    export type GqlModelPostSelect = {
      id: ObjectId;
      author: GqlModelUserSelect;
      body?: string;
      img?: string;
      likes: ObjectId[];
    };

    type ObjectId = string;

    export type GqlModelUserSelect = {
      id: ObjectId;
      username: string;
      name: string;
      image: string;
    };

    export const tsToGraphql = (typeTs: string, typeIsOptional: boolean) => {
      const typehandled = typeTs.trim().replace(';', '');
      if (typehandled === 'string') {
        return \`String\${typeIsOptional ? '' : '!'}\`;
      }

      if (typehandled === 'string[]') {
        return \`[String]\${typeIsOptional ? '' : '!'}\`;
      }`;

    expect(searchModels(mock)).toEqual({
      finishKeys: ['GqlModelPostSelect', 'GqlModelUserSelect'],
      queries: `type GqlModelPostSelect \n{
      id: ObjectId!
      author: GqlModelUserSelect!
      body: String
      img: String
      likes: [ObjectId]!
    }

type GqlModelUserSelect \n{
      id: ObjectId!
      username: String!
      name: String!
      image: String!
    }`,
    });
  });

  it('', () => {
    const mock = `

    interface IInput {
      id: string;
    }

    type tokenRequest = {
      token: string;
    };

    type GqlQueryUser = {
      getUsers: () => Promise<GqlModelUserSelect[]>;
      getUser: (_: unknown, id: IInput) => Promise<GqlModelUserSelect>;
      getMe: (_: unknown, args: unknown, token: tokenRequest) => Promise<GqlModelUserSelect>;
    };

    interface IRequestId {
      id: number;
    }

    type GqlQueryPost = {
      getPosts: () => Promise<GqlModelPostSelect[]>;
      getPost: (_: unknown, id: IRequestId) => Promise<GqlModelPostSelect>;
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

    expect(searchQueries(mock, 'Query')).toEqual({
      keys: [
        'GqlModelUserSelect',
        'IInput',
        'GqlModelUserSelect',
        'GqlModelUserSelect',
        'GqlModelPostSelect',
        'IRequestId',
        'GqlModelPostSelect',
      ],
      values: `type Query {
  getUsers: [GqlModelUserSelect]!
  getUser(id: IInput): GqlModelUserSelect!
  getMe: GqlModelUserSelect!
  getPosts: [GqlModelPostSelect]!
  getPost(id: IRequestId): GqlModelPostSelect!
}`,
    });
  });
});
