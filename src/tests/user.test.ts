import { searchTypeOrInterfaceAndGetContent, textMountedSearchTypes } from '@/handlers/searchTyieInterfacenDgetContent';
import { searchModels } from '@/modules/searchTypesInCode/searchModels';

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


interface GqlMutationPost {
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
    },
    {
      graphqlContentType: '{\n  token: String!\n}',
      graphqlName: 'IToken',
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
    },
    {
      graphqlContentType: '{\n  count: Int!\n}',
      graphqlName: 'UpdatePostResponse',
    },
    {
      graphqlContentType: '{\n  handlePostPayload {\n    postId: String!\n  }\n}',
      graphqlName: 'IInputHandlePostPayload',
    },
    {
      graphqlContentType: '{\n  includeLike: Boolean!\n}',
      graphqlName: 'HandlePostResponse',
    },
    {
      graphqlContentType: '{\n  id: String!\n}',
      graphqlName: 'IInputDeletePost',
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
    expect(textMountedSearchTypes(mockListAllOtherTypes)).toEqual(`type InputCreatePostPayload {
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

type IInputUpdatePostPayload {
  updatePostPayload {
    body: String!
    img: String!
    video: String!
    id: String!
  }
}

type UpdatePostResponse {
  count: Int!
}

type IInputHandlePostPayload {
  handlePostPayload {
    postId: String!
  }
}

type HandlePostResponse {
  includeLike: Boolean!
}

type IInputDeletePost {
  id: String!
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

    expect(searchModels(mock, 'GqlModel', 'model')).toEqual([
      {
        content:
          '{\n      id: ObjectId;\n      author: GqlModelUserSelect;\n      body?: string;\n      img?: string;\n      likes: ObjectId[];\n    }',
        keysNotResolved: [],
        name: 'GqlModelPostSelect',
        type: 'model',
      },
      {
        content: '{\n      id: ObjectId;\n      username: string;\n      name: string;\n      image: string;\n    }',
        keysNotResolved: [],
        name: 'GqlModelUserSelect',
        type: 'model',
      },
    ]);
  });
});
