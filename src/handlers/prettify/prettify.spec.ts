import { prettify } from '@/handlers/prettify';

const example = `
type ModelPostSelect {
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
    id: Number!
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


type HandlePostResponse {
  includeLike: Boolean!
}`;

const expectFormat = `type ModelPostSelect {
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
  id: Number!
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

type HandlePostResponse {
  includeLike: Boolean!
}
`;

describe('prettify()', () => {
  it('should format graphql schema', () => {
    expect(prettify(example)).toEqual(expectFormat);
  });
});
