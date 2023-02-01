import { splitParams } from '@/handlers/extractQueryOrMutationSignatures/splitParams';
import { searchTypeOrInterfaceAndGetContent } from '@/handlers/searchTyieInterfacenDgetContent';
import { Log } from '@/log/index';
import { getRecursiveContentInRegion } from '@/utils/getRecursiveRegion';

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
    throw new Error(
      `O input '${graphqlUtilType.value}' não foi encontrado no código, favor, verificar se ele está em algum lugar!`,
    );
  }

  const reGetPatternPayloads = /^\s{0,50}{\s{0,50}([\w]{1,999})\s{0,50}(\{[^$]{0,999})/;
  const resultRePatternPayload = reGetPatternPayloads.exec(extraTypeData?.graphqlContentType || '');
  if (Boolean(resultRePatternPayload) === false || resultRePatternPayload === null) {
    throw new Error(
      `O input '${graphqlUtilType.value}' precisa seguir o padrão de payloads, tendo um tipo dentro de outro tipo. Favor, fazer o ajuste.`,
    );
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
