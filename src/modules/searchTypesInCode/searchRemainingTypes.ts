import { searchTypeOrInterfaceAndGetContent, textMountedSearchTypes } from '@/handlers/searchTyieInterfacenDgetContent';

export const searchRemainingTypes = ({
  fullCodeMerged,
  typesNotAnalyzed,
}: {
  fullCodeMerged: string;
  typesNotAnalyzed: string[];
  // @ts-ignore
}): string => textMountedSearchTypes(searchTypeOrInterfaceAndGetContent(typesNotAnalyzed, fullCodeMerged));
