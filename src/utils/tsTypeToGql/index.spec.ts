import { definitionTypeTsToGql, tsTypeToGql } from '@/utils/tsTypeToGql';

describe('tsTypeToGql(), definitionTypeTsToGql()', () => {
  it('should transform lines to ts graphql', () => {
    const mockInput: string = `
      key: string
      key: string[]
      key?: string
      key?: string[]

      key: Types.ObjectId
      key: Types.ObjectId[]
      key?: Types.ObjectId
      key?: Types.ObjectId[]

      key: IAuth
      key: IAuth[]`;

    const mockData: string = `
      key: String!
      key: [String]!
      key: String
      key: [String]
      key: ID!
      key: [ID]!
      key: ID
      key: [ID]
      key: IAuth!
      key: [IAuth]!`;
    expect(definitionTypeTsToGql(mockInput, [{ from: 'Types.ObjectId', to: 'ID' }])).toEqual(mockData);
  });

  it('should transform ts graphql', () => {
    expect(tsTypeToGql('string', false, [])).toEqual('String!');
    expect(tsTypeToGql('string', true, [])).toEqual('String');
    expect(tsTypeToGql('string[]', false, [])).toEqual('[String]!');
    expect(tsTypeToGql('string[]', true, [])).toEqual('[String]');

    expect(tsTypeToGql('number', false, [])).toEqual('Int!');
    expect(tsTypeToGql('number', true, [])).toEqual('Int');
    expect(tsTypeToGql('number[]', false, [])).toEqual('[Int]!');
    expect(tsTypeToGql('number[]', true, [])).toEqual('[Int]');

    expect(tsTypeToGql('boolean', false, [])).toEqual('Boolean!');
    expect(tsTypeToGql('boolean', true, [])).toEqual('Boolean');
    expect(tsTypeToGql('boolean[]', false, [])).toEqual('[Boolean]!');
    expect(tsTypeToGql('boolean[]', true, [])).toEqual('[Boolean]');

    expect(tsTypeToGql('IAuth', false, [])).toEqual('IAuth!');
    expect(tsTypeToGql('IAuth', true, [])).toEqual('IAuth');
    expect(tsTypeToGql('IAuth[]', false, [])).toEqual('[IAuth]!');
    expect(tsTypeToGql('IAuth[]', true, [])).toEqual('[IAuth]');

    expect(tsTypeToGql('typesPostgresql', false, [{ from: 'typesPostgresql', to: 'ID_TEST' }])).toEqual('ID_TEST!');
    expect(tsTypeToGql('typesPostgresql', true, [{ from: 'typesPostgresql', to: 'ID_TEST' }])).toEqual('ID_TEST');
  });
});
