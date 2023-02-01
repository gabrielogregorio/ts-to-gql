import { searchGqlSchemaAndBuild } from '../index';

describe('', () => {
  it('', () => {
    expect(searchGqlSchemaAndBuild({ pathScanProject: './src', isProduction: false })).toEqual(
      `type ModelPostSelect {
  id: ObjectId!
  author: ModelUserSelect!
  body: String
  img: String
  likes: [ObjectId]!
}

type ModelUserSelect {
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
  getPosts: [ModelPostSelect]!
  getPost(id: IInputQueryPostRequestId): ModelPostSelect!
  getUsers: [ModelUserSelect]!
  getUser(createUserPayload: IQueryGetUserInput): ModelUserSelect!
  getMe: ModelUserSelect!
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

input IHandlePostLikePayload {
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
  createPost(createPostPayload: IInputCreatePostPayload): ModelPostSelect!
  updatePost(updatePostPayload: IInputUpdatePostPayload): UpdatePostResponse!
  deletePost(id: IInputHandleDeletePayload): DeletePostResponse!
  handleLike(handlePostPayload: IHandlePostLikePayload): HandlePostResponse!
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
