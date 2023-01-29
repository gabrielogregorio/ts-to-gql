import { GetTypesNotMapped } from '@/handlers/getTypesNotMapped';

describe('GetTypesNotMapped()', () => {
  it('should get all types', () => {
    expect(GetTypesNotMapped(['userType', 'newType', 'postType'], [])).toEqual(['userType', 'newType', 'postType']);
  });

  it('should ignore postType', () => {
    expect(GetTypesNotMapped(['userType', 'newType', 'postType'], ['postType'])).toEqual(['userType', 'newType']);
  });

  it('should not get types, but all are analyzed', () => {
    expect(GetTypesNotMapped(['userType', 'postType'], ['postType', 'userType'])).toEqual([]);
  });
});
