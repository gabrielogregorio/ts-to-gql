import { searchTypeOrInterfaceAndGetContent, textMountedSearchTypes } from '@/helpers/searchTyieInterfacenDgetContent';

export const searchRemainingTypes = ({
  fullCodeMerged,
  typesNotAnalyzed,
}: {
  fullCodeMerged: string;
  typesNotAnalyzed: string[];
}): string => textMountedSearchTypes(searchTypeOrInterfaceAndGetContent(typesNotAnalyzed, fullCodeMerged));
