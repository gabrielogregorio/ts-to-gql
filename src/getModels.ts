import { transformTsToGraphql, tsToGraphql } from './tsToGraphql';

const INCREMENT_PREVENT_LOOP: number = 1;
export const LIMIT_PREVENT_INFINITE_LOOPS: number = 200;

export const getModels = (code) => {
  const regexGroup1NameInterfaceGroup2TypesAndKeys = /interface\s*([a-zA-Z0-9]{2,})\s*\{([^}]*)/gi;
  let preventLoop: number = 0;
  let schemaPartial = '';
  while (true) {
    preventLoop += INCREMENT_PREVENT_LOOP;
    if (LIMIT_PREVENT_INFINITE_LOOPS === preventLoop) {
      break;
    }

    const regexRouter: RegExpExecArray | null = regexGroup1NameInterfaceGroup2TypesAndKeys.exec(code);

    if (regexRouter) {
      const nameType = regexRouter[1];
      const itemsType = regexRouter[2];

      const removePrefixI = (nameKey: string) => nameKey.slice(1, nameType.length);
      schemaPartial += `\ntype ${removePrefixI(nameType)} {${transformTsToGraphql(itemsType)}
}

      `;
    }

    if (!regexRouter) {
      break;
    }
  }

  return schemaPartial;
};
