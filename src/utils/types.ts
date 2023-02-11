export type analyzeModelType = {
  name: string;
  content: string;
};

export type fromToType = {
  from: string;
  to: string;
};

export const defaultFromType: fromToType[] = [{ from: 'Types.ObjectId', to: 'ID' }];
