import { prettify } from '@/handlers/prettify';

const example = `
type GqlModelPostSelect {
  id: ObjectId!
    author: GqlModelUserSelect!
      body: String
        img: String

   likes: [ObjectId]!
}

type GqlModelUserSelect {
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


type HandlePostResponse {
  includeLike: Boolean!
}`;

const expectFormat = `type GqlModelPostSelect {
  id: ObjectId!
  author: GqlModelUserSelect!
  body: String
  img: String
  likes: [ObjectId]!
}

type GqlModelUserSelect {
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

type HandlePostResponse {
  includeLike: Boolean!
}
`;

describe('prettify()', () => {
  it('should format graphql schema', () => {
    expect(prettify(example)).toEqual(expectFormat);
  });
});
