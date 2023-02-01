import { ModelPostSelect } from '@/models/Post';

type tokenRequest = {
  token: string;
};

type DeletePostResponse = {
  count: number;
};

interface IInputCreatePostPayload {
  createPostPayload: {
    body: string;
    img: string;
    video: string;
  };
}

interface IInputUpdatePostPayload {
  updatePostPayload: {
    body: string;
    img: string;
    video: string;
    id: string;
  };
}

interface IHandlePostLikePayload {
  handlePostPayload: {
    postId: string;
  };
}

interface IInputHandleDeletePayload {
  id: {
    id: string;
  };
}

type UpdatePostResponse = {
  count: number;
};

type HandlePostResponse = {
  includeLike: boolean;
};

type MutationPost = {
  createPost: (_: unknown, createPostPayload: IInputCreatePostPayload, token: tokenRequest) => Promise<ModelPostSelect>;
  updatePost: (
    _: unknown,
    updatePostPayload: IInputUpdatePostPayload,
    token: tokenRequest,
  ) => Promise<UpdatePostResponse>;
  deletePost: (_: unknown, id: IInputHandleDeletePayload, token: tokenRequest) => Promise<DeletePostResponse>;
  handleLike: (_: unknown, handlePostPayload: IHandlePostLikePayload, token: tokenRequest) => HandlePostResponse;
};

export const MutationPostResolver: MutationPost = {
  createPost: async (_, { createPostPayload: { body, img, video } }, { token }) => ({} as unknown as ModelPostSelect),
  updatePost: async (_, { updatePostPayload: { body, img, video, id } }) => ({ count: 2 }),
  handleLike: (_, { handlePostPayload: { postId } }, { token }) => ({
    includeLike: true,
  }),

  deletePost: async (_, { id }, { token }) => ({ count: 10 }),
};
