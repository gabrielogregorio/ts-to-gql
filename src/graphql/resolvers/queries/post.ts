import { GqlModelPostSelect } from '@/models/Post';

interface IInputQueryPostRequestId {
  id: {
    id: number;
  };
}

type GqlQueryPost = {
  getPosts: () => Promise<GqlModelPostSelect[]>;
  getPost: (_: unknown, id: IInputQueryPostRequestId) => Promise<GqlModelPostSelect>;
};

export const QueryPostResolver: GqlQueryPost = {
  async getPosts(): Promise<GqlModelPostSelect[]> {
    return [];
  },

  async getPost(_, { id: { id } }): Promise<GqlModelPostSelect> {
    return {} as unknown as GqlModelPostSelect;
  },
};
