import { ModelPostSelect } from '@/models/Post';

interface IInputQueryPostRequestId {
  id: {
    id: number;
  };
}

type QueryPost = {
  getPosts: () => Promise<ModelPostSelect[]>;
  getPost: (_: unknown, id: IInputQueryPostRequestId) => Promise<ModelPostSelect>;
};

export const QueryPostResolver: QueryPost = {
  async getPosts(): Promise<ModelPostSelect[]> {
    return [];
  },

  async getPost(_, { id: { id } }): Promise<ModelPostSelect> {
    return {} as unknown as ModelPostSelect;
  },
};
