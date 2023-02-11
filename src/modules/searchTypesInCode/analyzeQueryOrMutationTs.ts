import { removeTsSymbols } from '@/modules/searchTypesInCode/removeTsSymbols';
import { tsTypeToGql } from '@/utils/tsTypeToGql';
import { extractInfoResolvers } from '@/handlers/extractInfoResolvers';
import { analyzeModelType } from '@/utils/types';

export type modelPrepareType = {
  nameResolver: string;
  responseGraphql: string;
  parameterTransformedInGraphql: string;
  parameterResolver: string | undefined;
  namePayloadGraphql: string | undefined;
  contentExtracted: string | undefined;
};

type analyzeQueryOrMutationTsResponse = {
  info: modelPrepareType[];
  needMapping: string[];
};

export const analyzeQueryOrMutationTs = (
  code: string,
  resolvers: analyzeModelType[],
): analyzeQueryOrMutationTsResponse => {
  const info: modelPrepareType[] = [];

  resolvers.forEach(({ content }) => {
    // OK
    const infoResolvers = extractInfoResolvers(content || '', code);

    infoResolvers.forEach((signatures) => {
      const namePayloadGraphql: string = signatures?.parameterResolver?.namePayloadGraphql || '';
      const parameterResolver: string = signatures?.parameterResolver?.value || '';
      const contentExtracted: string = signatures?.parameterResolver?.contentExtracted || '';
      const responseResolver: string = signatures?.responseResolver.replace('Promise', '').replace(/[><]/g, '') || '';
      const nameResolver: string = signatures?.nameResolver || '';

      const parameterTransformedInGraphql = parameterResolver ? `${namePayloadGraphql}: ${parameterResolver}` : '';
      const responseGraphql = tsTypeToGql(responseResolver, false, []);

      info.push({
        nameResolver,
        parameterTransformedInGraphql,
        parameterResolver,
        namePayloadGraphql,
        contentExtracted,
        responseGraphql,
      });
    });
  });

  const needMapping = info.map((item) => removeTsSymbols(item.responseGraphql));

  return { info, needMapping };
};
