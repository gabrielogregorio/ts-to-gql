import { generateGraphqlSchema } from '../index';

describe('', () => {
  it('', () => {
    expect(generateGraphqlSchema({ baseUrl: './src' })).toEqual(
      `type GqlModelPostSelect
{
  id: ObjectId!
  author: GqlModelUserSelect!
  body: String
  img: String
  likes: [ObjectId]!
}

type GqlModelUserSelect
{
  id: ObjectId!
  username: String!
  name: String!
  image: String!
}

input IInputQueryPostRequestId {
  id: Int!
}

input IQueryGetUserInput {
  id: String!
}

type Query {
  getPosts: [GqlModelPostSelect]!
  getPost(id: IInputQueryPostRequestId): GqlModelPostSelect!
  getUsers: [GqlModelUserSelect]!
  getUser(createUserPayload: IQueryGetUserInput): GqlModelUserSelect!
  getMe: GqlModelUserSelect!
}

input IInputCreatePostPayload {
  body: String!
  img: String!
  video: String!
}

input IInputUpdatePostPayload {
  body: String!
  img: String!
  video: String!
  id: String!
}

input IInputHandleDeletePayload {
  id: String!
}

input IInputHandlePostPayload {
  postId: String!
}

input IInputCreateUserPayload {
  username: String!
  password: String!
  name: String!
}

input IInputUpdateUserPayload {
  username: String!
  name: String!
  image: String!
}

input IInputIdUser {
  id: String!
}

type Mutation {
  createPost(createPostPayload: IInputCreatePostPayload): GqlModelPostSelect!
  updatePost(updatePostPayload: IInputUpdatePostPayload): UpdatePostResponse!
  deletePost(id: IInputHandleDeletePayload): DeletePostResponse!
  handleLike(handlePostPayload: IInputHandlePostPayload): HandlePostResponse!
  createUser(createUserPayload: IInputCreateUserPayload): CreateUserResponse!
  updateUser(updateUserPayload: IInputUpdateUserPayload): UpdateUserResponse!
  deleteUser(input: IInputIdUser): deleteUserResponse!
}

type UpdatePostResponse {
  count: Int!
}

type DeletePostResponse {
  count: Int!
}

type HandlePostResponse {
  includeLike: Boolean!
}

type CreateUserResponse {
  id: String!
}

type UpdateUserResponse {
  count: Int!
}

type deleteUserResponse {
  count: Int!
}
`,
    );
  });
});
