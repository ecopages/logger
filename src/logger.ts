enum Level {
  INFO = 'INFO',
  ERROR = 'ERROR',
  WARN = 'WARN',
  DEBUG = 'DEBUG',
}
interface LogOptions {
  level: Level;
}

interface LoggerOptions {
  debug?: boolean;
}

const INFO: LogOptions = { level: Level.INFO };
const ERROR: LogOptions = { level: Level.ERROR };
const WARN: LogOptions = { level: Level.WARN };
const DEBUG: LogOptions = { level: Level.DEBUG };

/**
 * Represents a logger that can be used to log messages with different log levels.
 */
export class Logger {
  private readonly prefix: string;
  private options: LoggerOptions = {
    debug: false,
  };

  /**
   * Creates a new instance of the Logger class.
   * @param prefix The prefix to be added to each log message.
   */
  constructor(prefix: string, options?: LoggerOptions) {
    this.prefix = prefix;
    if (options) {
      this.options = options;
    }
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
   * This method will only log messages if the debug option is set to true.
   * @param args The arguments to be logged.
   */
  debug(...args: any[]) {
    if (this.options.debug) {
      this.logInternal(DEBUG, ...args);
    }
  }

  private logInternal(logOptions?: LogOptions, ...args: any[]) {
    const colorCode = logOptions
      ? {
          [Level.INFO]: '\x1b[32m', // Green
          [Level.ERROR]: '\x1b[31m', // Red
          [Level.WARN]: '\x1b[33m', // Yellow
          [Level.DEBUG]: '\x1b[36m', // Cyan
        }[logOptions.level]
      : '';

    const logStart = `${colorCode ? colorCode : ''}${this.prefix}`;
    const logEnd = '\x1b[0m';

    console.log(logStart, ...args, logEnd);
  }
}
