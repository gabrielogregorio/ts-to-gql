import { prettify } from '@/modules/prettify';

const example = `
type GqlGqlModelPostSelect {
  id: ObjectId!
    author: GqlGqlModelUserSelect!
      body: String
        img: String

   likes: [ObjectId]!
}

type GqlGqlModelUserSelect {
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
  getPosts: [GqlGqlModelPostSelect]!
  getPost(id: IInputQueryPostRequestId): GqlGqlModelPostSelect!
    getUsers: [GqlGqlModelUserSelect]!
  getUser(createUserPayload: IQueryGetUserInput): GqlGqlModelUserSelect!
  getMe: GqlGqlModelUserSelect!
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

const expectFormat = `type GqlGqlModelPostSelect {
  id: ObjectId!
  author: GqlGqlModelUserSelect!
  body: String
  img: String
  likes: [ObjectId]!
}

type GqlGqlModelUserSelect {
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
  getPosts: [GqlGqlModelPostSelect]!
  getPost(id: IInputQueryPostRequestId): GqlGqlModelPostSelect!
  getUsers: [GqlGqlModelUserSelect]!
  getUser(createUserPayload: IQueryGetUserInput): GqlGqlModelUserSelect!
  getMe: GqlGqlModelUserSelect!
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
