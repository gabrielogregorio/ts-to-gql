import { searchRemainingTypes } from '@/modules/searchTypesInCode/searchRemainingTypes';

describe('searchRemainingTypes()', () => {
  const fullCode = `type responseGraphql = {
  name: string
}
`;

  it('should try analyze but not exists types not analyzed', () => {
    const typesNotAnalyzed: string[] = [];
    expect(searchRemainingTypes({ fullCode, typesNotAnalyzed })).toEqual('');
  });

  it('should search type not mapped', () => {
    const typesNotAnalyzed = ['responseGraphql'];
    expect(searchRemainingTypes({ fullCode, typesNotAnalyzed })).toEqual(`type responseGraphql {\n  name: String!\n}`);
  });
});
