import { generateGraphqlSchema } from '../index';

describe('', () => {
  it('', () => {
    expect(generateGraphqlSchema()).toEqual(
      `type GqlModelPostSelect \n{
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
}
  type Query {
  getPosts: [GqlModelPostSelect]!
  getPost(id: IRequestId): GqlModelPostSelect!
  getUsers: [GqlModelUserSelect]!
  getUser(id: IInput): GqlModelUserSelect!
  getMe: GqlModelUserSelect!
}
  type Mutation {
  createPost(createPostPayload: IInputCreatePostPayload): GqlModelPostSelect!
  updatePost(updatePostPayload: IInputUpdatePostPayload): UpdatePostResponse!
  deletePost(id: IInputHandleDeletePayload): DeletePostResponse!
  handleLike(handlePostPayload: IInputHandlePostPayload): HandlePostResponse!
  createUser(createUserPayload: IInputCreateUserPayload): CreateUserResponse!
  updateUser(updateUserPayload: IInputUpdateUserPayload): UpdateUserResponse!
  deleteUser(id: idUser): deleteUserResponse!
}
  type IRequestId {
  id: Number!
}

input IInput {
  createPostPayload {
    body: String!
    img: String!
    video: String!
  }
}

input IInputCreatePostPayload {
  createPostPayload {
    body: String!
    img: String!
    video: String!
  }
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

input IInputHandleDeletePayload {
  id {
    id: String!
  }
}

type DeletePostResponse {
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

input IInputCreateUserPayload {
  createUserPayload {
    username: String!
    password: String!
    name: String!
  }
}

type CreateUserResponse {
  id: String!
}

input IInputUpdateUserPayload {
  updateUserPayload {
    username: String!
    name: String!
    image: String!
  }
}

type UpdateUserResponse {
  count: Number!
}

type idUser {
  id: String!
}

type deleteUserResponse {
  count: Number!
}`,
    );
  });
});
