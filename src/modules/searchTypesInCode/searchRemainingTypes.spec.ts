import { searchRemainingTypes } from '@/modules/searchTypesInCode/searchRemainingTypes';

describe('searchRemainingTypes()', () => {
  const fullCodeMerged = `type responseGraphql = {
  name: string
}
`;

  it('should try analyze but not exists types not analyzed', () => {
    const typesNotAnalyzed: string[] = [];
    expect(searchRemainingTypes({ fullCodeMerged, typesNotAnalyzed })).toEqual('');
  });

  it('should search type not mapped', () => {
    const typesNotAnalyzed = ['responseGraphql'];
    expect(searchRemainingTypes({ fullCodeMerged, typesNotAnalyzed })).toEqual(
      `type responseGraphql {\n  name: String!\n}`,
    );
  });
});
