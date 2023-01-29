import { searchTypeOrInterfaceAndGetContent, textMountedSearchTypes } from '@/handlers/searchTyieInterfacenDgetContent';

export const searchRemainingTypes = ({
  fullCodeMerged,
  typesNotAnalyzed,
}: {
  fullCodeMerged: string;
  typesNotAnalyzed: string[];
}): string => textMountedSearchTypes(searchTypeOrInterfaceAndGetContent(typesNotAnalyzed, fullCodeMerged));
