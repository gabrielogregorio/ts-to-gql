export const getActualMoment = (): string =>
  new Date().toLocaleString('en-US', { timeStyle: 'medium', hourCycle: 'h24' });
