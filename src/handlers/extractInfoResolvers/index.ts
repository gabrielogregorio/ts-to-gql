import { INCREMENT_PREVENT_LOOP, LIMIT_PREVENT_INFINITE_LOOPS } from '@/constants/index';
import { getUtilParamAndValues, paramsType } from '@/handlers/extractInfoResolvers/getUtilParamAndValues';

type extractInfoResolversResponse = {
  nameResolver: string;
  parameterResolver: paramsType | undefined;
  responseResolver: string;
};

export const extractInfoResolvers = (code: string, fullCode: string): extractInfoResolversResponse[] => {
  const reGetSignatures =
    /^\s{0,50}([\w_]{2,})\s{0,50}:\s{0,50}\(([^\\)]{0,500})\s{0,50}\)\s{0,999}=\s{0,999}>\s{0,999}([^;]{1,500});\s{0,50}$/gim;

  const parameters: extractInfoResolversResponse[] = [];

  let preventLoop: number = 0;
  while (true) {
    preventLoop += INCREMENT_PREVENT_LOOP;
    if (LIMIT_PREVENT_INFINITE_LOOPS === preventLoop) {
      break;
    }

    const resultReGetSignatures: RegExpExecArray | null = reGetSignatures.exec(code);
    if (!resultReGetSignatures) {
      break;
    }

    const INDEX_NAME_RESOLVER: number = 1;
    const INDEX_PARAMS_POSITION: number = 2;
    const INDEX_RESPONSE_RESOLVER: number = 3;

    const nameResolver = resultReGetSignatures[INDEX_NAME_RESOLVER].replace(/\n/g, '');
    const paramsResolver = resultReGetSignatures[INDEX_PARAMS_POSITION];
    const responseResolver = resultReGetSignatures[INDEX_RESPONSE_RESOLVER].replace(/\n/g, '');

    const parameterResolver = getUtilParamAndValues(paramsResolver, fullCode);

    parameters.push({
      nameResolver,
      parameterResolver,
      responseResolver,
    });
  }
  return parameters;
};
