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

  public static info(message: unknown): void {
    console.info(`${this.baseStart('INFO ')}`, message);
  }

  public static error(message: unknown): void {
    console.error(`${this.baseStart('ERROR')}`, message);
  }

  public static debug(message: unknown): void {
    console.debug(`${this.baseStart('DEBUG')}`, message);
  }

  public static warning(message: unknown): void {
    console.warn(`${this.baseStart('WARN ')}`, message);
  }
}
