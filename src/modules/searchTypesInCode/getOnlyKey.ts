export const getOnlyKey = (gqlKey: string): string => gqlKey.replace(/[!\]\\[<>]/g, '').replace('Promise', '');
