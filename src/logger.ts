enum Level {
  INFO = 'INFO',
  ERROR = 'ERROR',
  WARN = 'WARN',
  DEBUG = 'DEBUG',
}
interface LogLevel {
  level: Level;
}

const INFO: LogLevel = { level: Level.INFO };
const ERROR: LogLevel = { level: Level.ERROR };
const WARN: LogLevel = { level: Level.WARN };
const DEBUG: LogLevel = { level: Level.DEBUG };

/**
 * Represents a logger that can be used to log messages with different log levels.
 */
export class Logger {
  private readonly prefix: string;

  /**
   * Creates a new instance of the Logger class.
   * @param prefix The prefix to be added to each log message.
   */
  constructor(prefix: string) {
    this.prefix = prefix;
  }

  /**
   * Logs an informational message.
   * @param args The arguments to be logged.
   */
  info(...args: any[]) {
    this.logInternal(INFO, ...args);
  }

  /**
   * Logs a warning message.
   * @param args The arguments to be logged.
   */
  warn(...args: any[]) {
    this.logInternal(WARN, ...args);
  }

  /**
   * Logs an error message.
   * @param args The arguments to be logged.
   */
  error(...args: any[]) {
    this.logInternal(ERROR, ...args);
  }

  /**
   * Logs a debug message.
   * @param args The arguments to be logged.
   */
  debug(...args: any[]) {
    if (process.env.ECO_PAGES_DEBUG === 'true') {
      this.logInternal(DEBUG, ...args);
    }
  }

  private logInternal(level?: LogLevel, ...args: any[]) {
    const colorCode = level
      ? {
          [Level.INFO]: '\x1b[32m', // Green
          [Level.ERROR]: '\x1b[31m', // Red
          [Level.WARN]: '\x1b[33m', // Yellow
          [Level.DEBUG]: '\x1b[36m', // Cyan
        }[level.level]
      : '';

    const logStart = `${colorCode ? colorCode : ''}${this.prefix}`;
    const logEnd = '\x1b[0m';

    console.log(logStart, ...args, logEnd);
  }
}
