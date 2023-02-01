import { extractQueryOrMutationSignatures } from '@/handlers/extractQueryOrMutationSignatures';

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
    parameterResolver: undefined,
    responseResolver: 'Promise<IPostSelect>',
  },
  {
    nameResolver: 'createPost',
    parameterResolver: {
      namePayloadGraphql: 'myInputs',
      contentExtracted: mockResponseString,
      value: 'InputCreatePostPayload',
    },
    responseResolver: 'Promise<IPostSelect>',
  },
  {
    nameResolver: 'updatePost',
    parameterResolver: {
      contentExtracted: mockResponseString,
      namePayloadGraphql: 'input',
      value: 'IInputUpdatePostPayload',
    },
    responseResolver: 'Promise<UpdatePostResponse>',
  },
  {
    nameResolver: 'handleLike',
    parameterResolver: {
      contentExtracted: mockResponseString,
      namePayloadGraphql: 'input',
      value: 'IInputHandlePostPayload',
    },
    responseResolver: 'Promise<HandlePostResponse>',
  },
  {
    nameResolver: 'deletePost',
    parameterResolver: {
      contentExtracted: mockResponseString,
      namePayloadGraphql: 'input',
      value: 'IInputDeletePost',
    },
    responseResolver: 'Promise<DeletePostResponse>',
  },
];
describe('extractQueryOrMutationSignatures()', () => {
  it('should get params items', () => {
    expect(extractQueryOrMutationSignatures(mockContentResolvers, mockFullCode)).toEqual(mockResponse);
  });
});
