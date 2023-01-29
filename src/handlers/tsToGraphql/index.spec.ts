import { linesTsToGraphql, tsToGraphql } from '@/handlers/tsToGraphql';

describe('tsToGraphql(), linesTsToGraphql()', () => {
  it('should transform lines to ts graphql', () => {
    const mockInput = `
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

    const mockData = `
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
    expect(linesTsToGraphql(mockInput, [{ from: 'Types.ObjectId', to: 'ID' }])).toEqual(mockData);
  });

  it('should transform ts graphql', () => {
    expect(tsToGraphql('string', false, [])).toEqual('String!');
    expect(tsToGraphql('string', true, [])).toEqual('String');
    expect(tsToGraphql('string[]', false, [])).toEqual('[String]!');
    expect(tsToGraphql('string[]', true, [])).toEqual('[String]');

    expect(tsToGraphql('number', false, [])).toEqual('Number!');
    expect(tsToGraphql('number', true, [])).toEqual('Number');
    expect(tsToGraphql('number[]', false, [])).toEqual('[Number]!');
    expect(tsToGraphql('number[]', true, [])).toEqual('[Number]');

    expect(tsToGraphql('boolean', false, [])).toEqual('Boolean!');
    expect(tsToGraphql('boolean', true, [])).toEqual('Boolean');
    expect(tsToGraphql('boolean[]', false, [])).toEqual('[Boolean]!');
    expect(tsToGraphql('boolean[]', true, [])).toEqual('[Boolean]');

    expect(tsToGraphql('IAuth', false, [])).toEqual('IAuth!');
    expect(tsToGraphql('IAuth', true, [])).toEqual('IAuth');
    expect(tsToGraphql('IAuth[]', false, [])).toEqual('[IAuth]!');
    expect(tsToGraphql('IAuth[]', true, [])).toEqual('[IAuth]');

    expect(tsToGraphql('typesPostgresql', false, [{ from: 'typesPostgresql', to: 'ID_TEST' }])).toEqual('ID_TEST!');
    expect(tsToGraphql('typesPostgresql', true, [{ from: 'typesPostgresql', to: 'ID_TEST' }])).toEqual('ID_TEST');
  });
});
