type splitParamsResponse =
  | {
      key: string;
      value: string;
    }
  | undefined;

const LENGTH_HAS_KEY_VALUE: number = 2;

export const splitParams = (params: string): splitParamsResponse[] =>
  params.split(',').map((param): splitParamsResponse | undefined => {
    const itemToUse = param.trim();
    if (itemToUse.split(':').length === LENGTH_HAS_KEY_VALUE) {
      return { key: itemToUse.split(':')[0].trim(), value: itemToUse.split(':')[1].trim() };
    }

    return undefined;
  });
