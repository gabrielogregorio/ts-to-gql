import { searchTypeOrInterfaceAndGetContent, textMountedSearchTypes } from '@/handlers/searchTyieInterfacenDgetContent';

type searchRemainingTypesType = {
  fullCode: string;
  typesNotAnalyzed: string[];
};

export const searchRemainingTypes = ({ fullCode, typesNotAnalyzed }: searchRemainingTypesType): string => {
  const items = searchTypeOrInterfaceAndGetContent(typesNotAnalyzed, fullCode);

  return textMountedSearchTypes(items || []);
};
