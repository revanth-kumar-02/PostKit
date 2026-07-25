import { envConfig } from '@/config/env.config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private prefix: string;

  constructor(prefix = '[PostKit]') {
    this.prefix = prefix;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `${this.prefix} [${timestamp}] [${level.toUpperCase()}]: ${message}`;
  }

  public debug(message: string, ...args: unknown[]): void {
    if (envConfig.isDev) {
      console.debug(this.formatMessage('debug', message), ...args);
    }
  }

  public info(message: string, ...args: unknown[]): void {
    if (envConfig.isDev) {
      console.info(this.formatMessage('info', message), ...args);
    }
  }

  public warn(message: string, ...args: unknown[]): void {
    console.warn(this.formatMessage('warn', message), ...args);
  }

  public error(message: string, ...args: unknown[]): void {
    console.error(this.formatMessage('error', message), ...args);
  }
}

export const logger = new Logger();
