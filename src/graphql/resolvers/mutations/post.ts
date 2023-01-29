import { GqlModelPostSelect } from '@/models/Post';

type tokenRequest = {
  token: string;
};

type DeletePostResponse = {
  count: Number;
};

interface IInputCreatePostPayload {
  createPostPayload: {
    body: String;
    img: String;
    video: String;
  };
}

interface IInputUpdatePostPayload {
  updatePostPayload: {
    body: String;
    img: String;
    video: String;
    id: String;
  };
}

interface IInputHandlePostPayload {
  handlePostPayload: {
    postId: String;
  };
}

interface IInputHandleDeletePayload {
  id: {
    id: String;
  };
}

type UpdatePostResponse = {
  count: Number;
};

type HandlePostResponse = {
  includeLike: Boolean;
};

type GqlMutationPost = {
  createPost: (
    _: unknown,
    createPostPayload: IInputCreatePostPayload,
    token: tokenRequest,
  ) => Promise<GqlModelPostSelect>;
  updatePost: (
    _: unknown,
    updatePostPayload: IInputUpdatePostPayload,
    token: tokenRequest,
  ) => Promise<UpdatePostResponse>;
  deletePost: (_: unknown, id: IInputHandleDeletePayload, token: tokenRequest) => Promise<DeletePostResponse>;
  handleLike: (
    _: unknown,
    handlePostPayload: IInputHandlePostPayload,
    token: tokenRequest,
  ) => Promise<HandlePostResponse>;
};

export const MutationPostResolver: GqlMutationPost = {
  createPost: async (_, { createPostPayload: { body, img, video } }, { token }) =>
    ({} as unknown as GqlModelPostSelect),

  updatePost: async (_, { updatePostPayload: { body, img, video, id } }) => ({ count: 2 }),

  handleLike: async (_, { handlePostPayload: { postId } }, { token }) => ({
    includeLike: true,
  }),

  deletePost: async (_, { id }, { token }) => ({ count: 10 }),
};
