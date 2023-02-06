import { GqlModelUserSelect } from '@/models/User';

type ObjectId = string;

export type GqlModelPostSelect = {
  id: ObjectId;
  author: GqlModelUserSelect;
  body?: string;
  img?: string;
  likes: ObjectId[];
};
