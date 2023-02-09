export const removeTsSymbols = (gqlKey: string): string => gqlKey.replace(/[!\]\\[<>]/g, '').replace('Promise', '');
