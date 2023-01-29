import { extractQueryOrMutationSignatures } from '@/handlers/extractQueryOrMutationSignatures';

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
describe('', () => {
  it('should get params items', () => {
    expect(extractQueryOrMutationSignatures(mockContentWithoutInterfaceBase, '')).toEqual(
      mockResolverParamsAndResponse,
    );
  });
});
