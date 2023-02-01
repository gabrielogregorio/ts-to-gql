import { searchTypeOrInterfaceAndGetContent, textMountedSearchTypes } from '@/handlers/searchTyieInterfacenDgetContent';

type searchRemainingTypesType = {
  fullCodeMerged: string;
  typesNotAnalyzed: string[];
};

export const searchRemainingTypes = ({ fullCodeMerged, typesNotAnalyzed }: searchRemainingTypesType): string => {
  const items = searchTypeOrInterfaceAndGetContent(typesNotAnalyzed, fullCodeMerged);

  return textMountedSearchTypes(items || []);
};
