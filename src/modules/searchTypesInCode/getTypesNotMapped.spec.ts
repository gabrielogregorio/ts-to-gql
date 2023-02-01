import { getTypesNotMapped } from '@/modules/searchTypesInCode/getTypesNotMapped';

describe('getTypesNotMapped()', () => {
  it('should get all types', () => {
    expect(getTypesNotMapped(['userType', 'newType', 'postType'], [])).toEqual(['userType', 'newType', 'postType']);
  });

  it('should ignore postType', () => {
    expect(getTypesNotMapped(['userType', 'newType', 'postType'], ['postType'])).toEqual(['userType', 'newType']);
  });

  it('should not get types, but all are analyzed', () => {
    expect(getTypesNotMapped(['userType', 'postType'], ['postType', 'userType'])).toEqual([]);
  });
});
