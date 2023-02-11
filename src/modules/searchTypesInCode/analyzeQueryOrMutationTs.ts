import { removeTsSymbols } from '@/modules/searchTypesInCode/removeTsSymbols';
import { tsTypeToGql } from '@/utils/tsTypeToGql';
import { extractInfoResolvers } from '@/handlers/extractInfoResolvers';
import { analyzeModelType } from '@/utils/types';

export type modelPrepareType = {
  nameResolver: string;
  responseGraphql: string;
  parameterTransformedInGraphql: string;
  inputResolverName: string | undefined;
  namePayloadGraphql: string | undefined;
  inputResolverContent: string | undefined;
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
    const infoResolvers = extractInfoResolvers(content || '', code);

    infoResolvers.forEach((signatures) => {
      const namePayloadGraphql: string = signatures?.inputResolverName?.namePayloadGraphql || '';
      const inputResolverName: string = signatures?.inputResolverName?.value || '';
      const inputResolverContent: string = signatures?.inputResolverName?.inputResolverContent || '';
      const responseResolver: string = signatures?.responseResolver.replace('Promise', '').replace(/[><]/g, '') || '';
      const nameResolver: string = signatures?.nameResolver || '';

      const parameterTransformedInGraphql = inputResolverName ? `${namePayloadGraphql}: ${inputResolverName}` : '';
      const responseGraphql = tsTypeToGql(responseResolver, false, []);

      info.push({
        nameResolver,
        parameterTransformedInGraphql,
        inputResolverName,
        namePayloadGraphql,
        inputResolverContent,
        responseGraphql,
      });
    });
  });

  const needMapping = info.map((item) => removeTsSymbols(item.responseGraphql));

  return { info, needMapping };
};
