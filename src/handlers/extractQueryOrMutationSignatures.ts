import { getRecursiveContentInRegion } from '@/handlers/getRecursiveRegion';
import { Log } from '@/helpers/log';
import { searchTypeOrInterfaceAndGetContent } from '@/helpers/searchTyieInterfacenDgetContent';

const splitParams = (params: string) =>
  params.split(',').map((item) => {
    const itemToUse = item.trim();
    if (itemToUse.split(':').length === 2) {
      return { key: itemToUse.split(':')[0].trim(), value: itemToUse.split(':')[1].trim() };
    }

    if (itemToUse !== '') {
      console.error(`splitParams - error - unknown param = '${itemToUse}'`);
    }
  });

export const extractQueryOrMutationSignatures = (code: string, fullCode: string) => {
  const regexParameters =
    /^\s{0,50}([\w0-9_]{2,})\s{0,50}:\s{0,50}\(([^\\)]{0,500})\s{0,50}\)\s{0,}=\s{0,}>\s{0,}([^;]{1,500});\s{0,50}$/gim;

  const INCREMENT_PREVENT_LOOP = 1;
  const LIMIT_PREVENT_INFINITE_LOOPS: number = 200;
  const parameters: {
    nameResolver: string;
    params: { key: string; value: string; contentExtracted: string } | undefined;
    response: string;
  }[] = [];
  let preventLoop: number = 0;
  while (true) {
    preventLoop += INCREMENT_PREVENT_LOOP;
    if (LIMIT_PREVENT_INFINITE_LOOPS === preventLoop) {
      break;
    }

    const regexRouter: RegExpExecArray | null = regexParameters.exec(code);
    let queue:
      | {
          key: string;
          value: string;
          contentExtracted: string;
        }
      | undefined;
    if (regexRouter) {
      const litstParams = splitParams(regexRouter[2].replace(/\n/g, ''));
      const utilParam = litstParams[1];
      if (utilParam && utilParam.value !== 'unknown' && utilParam.value !== 'any') {
        const inputParamExtracted = searchTypeOrInterfaceAndGetContent([utilParam.value], fullCode)[0];

        const detectIfSeguePadrao = /^\s{0,50}{\s{0,50}([\w]{1,})\s{0,50}(\{[^$]{0,})/;

        const result = detectIfSeguePadrao.exec(inputParamExtracted.graphqlContentType);
        if (Boolean(result) === false) {
          Log.error(
            `ERRO, o tipo '${utilParam.value}' precisa seguir o padrão de payloads. replace 'interface IInputRequestId { id: number }' to 'interface IInputRequestId { myInputExample: { id: number} }'`,
          );
        } else {
          const valueFinal = getRecursiveContentInRegion(result[2], {
            startDelimiter: '{',
            endDelimiter: '}',
            skipStrings: true,
          });

          queue = {
            key: result[1],
            value: utilParam.value,
            contentExtracted: valueFinal,
          };
        }
      }
      parameters.push({
        nameResolver: regexRouter[1].replace(/\n/g, ''),
        params: queue,
        response: regexRouter[3].replace(/\n/g, ''),
      });
    }

    if (!regexRouter) {
      break;
    }
  }
  return parameters;
};
