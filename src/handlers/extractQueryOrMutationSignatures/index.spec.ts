import { extractQueryOrMutationSignatures } from '@/handlers/extractQueryOrMutationSignatures';

const mockFullCode = `
type InputCreatePostPayload = {
  myInputs: {
    name: string
  }
}

`;

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
      contentExtracted: `{\n    name: String!\n  }`,
      value: 'InputCreatePostPayload',
    },
    responseResolver: 'Promise<IPostSelect>',
  },
  {
    nameResolver: 'updatePost',
    parameterResolver: undefined,
    responseResolver: 'Promise<UpdatePostResponse>',
  },
  {
    nameResolver: 'handleLike',
    parameterResolver: undefined,
    responseResolver: 'Promise<HandlePostResponse>',
  },
  {
    nameResolver: 'deletePost',
    parameterResolver: undefined,
    responseResolver: 'Promise<DeletePostResponse>',
  },
];
describe('extractQueryOrMutationSignatures()', () => {
  it('should get params items', () => {
    expect(extractQueryOrMutationSignatures(mockContentResolvers, mockFullCode)).toEqual(mockResponse);
  });
});
