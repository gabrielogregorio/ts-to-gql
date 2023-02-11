import { extractInfoResolvers } from '@/handlers/extractInfoResolvers';

const mockFullCode = `
type IInputDeletePost = {
  input: {
    name: string
  }
}

type IInputHandlePostPayload = {
  input: {
    name: string
  }
}

type IInputUpdatePostPayload = {
  input: {
    name: string
  }
}

type InputCreatePostPayload = {
  myInputs: {
    name: string
  }
}
`;

const mockResponseString = '{\n    name: String!\n  }';

const mockContentResolvers = `
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

const mockResponse = [
  {
    nameResolver: 'getThis',
    inputResolverName: undefined,
    responseResolver: 'Promise<IPostSelect>',
  },
  {
    nameResolver: 'createPost',
    inputResolverName: {
      namePayloadGraphql: 'myInputs',
      inputResolverContent: mockResponseString,
      value: 'InputCreatePostPayload',
    },
    responseResolver: 'Promise<IPostSelect>',
  },
  {
    nameResolver: 'updatePost',
    inputResolverName: {
      inputResolverContent: mockResponseString,
      namePayloadGraphql: 'input',
      value: 'IInputUpdatePostPayload',
    },
    responseResolver: 'Promise<UpdatePostResponse>',
  },
  {
    nameResolver: 'handleLike',
    inputResolverName: {
      inputResolverContent: mockResponseString,
      namePayloadGraphql: 'input',
      value: 'IInputHandlePostPayload',
    },
    responseResolver: 'Promise<HandlePostResponse>',
  },
  {
    nameResolver: 'deletePost',
    inputResolverName: {
      inputResolverContent: mockResponseString,
      namePayloadGraphql: 'input',
      value: 'IInputDeletePost',
    },
    responseResolver: 'Promise<DeletePostResponse>',
  },
];
describe('extractInfoResolvers()', () => {
  it('should get params items', () => {
    expect(extractInfoResolvers(mockContentResolvers, mockFullCode)).toEqual(mockResponse);
  });
});
