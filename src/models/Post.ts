import { ModelUserSelect } from '@/models/User';

type ObjectId = string;

export type ModelPostSelect = {
  id: ObjectId;
  author: ModelUserSelect;
  body?: string;
  img?: string;
  likes: ObjectId[];
};
