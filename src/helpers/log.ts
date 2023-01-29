import { getActualMoment } from '@/handlers/getActualMoment';

type levelsType = 'ERROR' | 'INFO ' | 'WARN ' | 'DEBUG';

const colors: { [key in levelsType]: string } = {
  'INFO ': '36',
  ERROR: '31;1',
  'WARN ': '33',
  DEBUG: '37;1',
};

/* eslint-disable no-console */
export class Log {
  private static baseStart(level: levelsType): string {
    const start = `${level} - tsToGraphql`;
    return `[${this.applyColors(start, colors[level])}] ${getActualMoment()}:`;
  }

  private static runningInTerminal = (): boolean => Boolean(process.stdout.isTTY);

  private static applyColors(level: string, color: string): string {
    if (this.runningInTerminal()) {
      return `\x1B[${color}m${level}\x1B[0m`;
    }
    return level;
  }

  public static info(message: unknown, message2: unknown = ''): void {
    console.info(`${this.baseStart('INFO ')}`, message, message2);
  }

  public static error(message: unknown, message2: unknown = ''): void {
    console.error(`${this.baseStart('ERROR')}`, message, message2);
  }

  public static debug(message: unknown, message2: unknown = ''): void {
    console.debug(`${this.baseStart('DEBUG')}`, message, message2);
  }

  public static warning(message: unknown, message2: unknown = ''): void {
    console.warn(`${this.baseStart('WARN ')}`, message, message2);
  }
}
