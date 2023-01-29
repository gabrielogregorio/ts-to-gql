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

export const fromInterfaceGetResolverNameParamsAndReturn = (code: string) => {
  const regexParameters =
    /^\s{0,50}([\w0-9_]{2,})\s{0,50}:\s{0,50}\(([^\\)]{0,500})\s{0,50}\)\s{0,}=\s{0,}>\s{0,}([^;]{1,500});\s{0,50}$/gim;

  const INCREMENT_PREVENT_LOOP = 1;
  const LIMIT_PREVENT_INFINITE_LOOPS: number = 200;
  const parameters: {
    nameResolver: string;
    params: { key: string; value: string }[];
    response: string;
  }[] = [];
  let preventLoop: number = 0;
  while (true) {
    preventLoop += INCREMENT_PREVENT_LOOP;
    if (LIMIT_PREVENT_INFINITE_LOOPS === preventLoop) {
      break;
    }

    const regexRouter: RegExpExecArray | null = regexParameters.exec(code);

    if (regexRouter) {
      parameters.push({
        nameResolver: regexRouter[1].replace(/\n/g, ''),
        params: splitParams(regexRouter[2].replace(/\n/g, '')),
        response: regexRouter[3].replace(/\n/g, ''),
      });
    }

    if (!regexRouter) {
      break;
    }
  }
  return parameters;
};
