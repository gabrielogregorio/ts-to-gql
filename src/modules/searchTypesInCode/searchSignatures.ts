import { searchContentRegions } from '@/modules/searchTypesInCode/searchContentRegions';
import { analyzeModelType } from '@/utils/types';

export const searchSignatures = (code: string, prefix: string): analyzeModelType[] =>
  searchContentRegions(code, prefix);
