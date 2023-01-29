import { GqlModelPostSelect } from '@/models/Post';

interface IRequestId {
  id: number;
}

type GqlQueryPost = {
  getPosts: () => Promise<GqlModelPostSelect[]>;
  getPost: (_: unknown, id: IRequestId) => Promise<GqlModelPostSelect>;
};

export const QueryPostResolver: GqlQueryPost = {
  async getPosts(): Promise<GqlModelPostSelect[]> {
    return [];
  },

  async getPost(_, { id }): Promise<GqlModelPostSelect> {
    return {} as unknown as GqlModelPostSelect;
  },
};
