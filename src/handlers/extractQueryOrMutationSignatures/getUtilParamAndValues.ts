import { splitParams } from '@/handlers/extractQueryOrMutationSignatures/splitParams';
import { getRecursiveContentInRegion } from '@/handlers/getRecursiveRegion';
import { searchTypeOrInterfaceAndGetContent } from '@/handlers/searchTyieInterfacenDgetContent';
import { Log } from '@/log/index';

export type paramsType = {
  namePayloadGraphql: string;
  value: string;
  contentExtracted: string;
};

const typeToIgnore = ['unknown', 'any'];

export const getUtilParamAndValues = (paramsResolver: string, fullCode: string): paramsType | undefined => {
  const params = splitParams(paramsResolver.replace(/\n/g, ''));
  const graphqlUtilType = params[1];

  if (
    Boolean(graphqlUtilType) === false ||
    typeToIgnore.includes(graphqlUtilType?.value || '') ||
    graphqlUtilType?.value === undefined
  ) {
    return undefined;
  }

  const extraTypeData = searchTypeOrInterfaceAndGetContent([graphqlUtilType.value], fullCode)[0];

  if (Boolean(extraTypeData) === false) {
    Log.error(`O tipo '${graphqlUtilType.value}' não foi encontrado definido no código`);
    return undefined;
  }

  const reGetPatternPayloads = /^\s{0,50}{\s{0,50}([\w]{1,})\s{0,50}(\{[^$]{0,})/;
  const resultRePatternPayload = reGetPatternPayloads.exec(extraTypeData?.graphqlContentType || '');
  if (Boolean(resultRePatternPayload) === false || resultRePatternPayload === null) {
    Log.error(
      `O tipo '${graphqlUtilType.value}' precisa seguir o padrão de payloads. substitua 'interface MyInterface { id: number }' para interface MyInterface { exampleInput: { id: number } }`,
    );

    return undefined;
  }

  const INDEX_NAME_PAYLOAD_GRAPHQL = 1;
  const INDEX_TYPE_INSIDE_PAYLOAD_GRAPHQL = 2;

  const namePayloadGraphql = resultRePatternPayload[INDEX_NAME_PAYLOAD_GRAPHQL];
  const typeInsidePayloadGraphql = resultRePatternPayload[INDEX_TYPE_INSIDE_PAYLOAD_GRAPHQL];

  const contentExtracted = getRecursiveContentInRegion(typeInsidePayloadGraphql, {
    startDelimiter: '{',
    endDelimiter: '}',
    skipStrings: true,
  });

  return {
    namePayloadGraphql,
    value: graphqlUtilType.value,
    contentExtracted: contentExtracted || '',
  };
};
