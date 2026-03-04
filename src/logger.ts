const Level = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  WARN: 'WARN',
  DEBUG: 'DEBUG',
  TIMER: 'TIMER',
} as const;

export type LevelType = (typeof Level)[keyof typeof Level];

type LogArgument = string | number | boolean | object | null | undefined;

interface LogOptions {
  level: LevelType;
}

export interface ColorConfig {
  INFO: string;
  ERROR: string;
  WARN: string;
  DEBUG: string;
  TIMER: string;
}

export interface LoggerOptions {
  /**
   * If a debug option is set to true, debug messages will be logged.
   */
  debug?: boolean;
  /**
   * If a color option is set to true, the logger will log messages with default colors.
   */
  color?: boolean;
  /**
   * If a timestamp option is set to true, the logger will log messages with a timestamp.
   */
  timestamp?: boolean;
  /**
    * Format of the timestamp (rendered using `toLocaleString('en-US', ...)`).
    * Possible values:
    * - 'full' = date + time
    * - 'time' = time only
    * - 'short' = short date + time
   */
  timestampFormat?: 'full' | 'time' | 'short';
  /**
   * Custom colors for different log levels.
   * In browser: use CSS color values (e.g., '#00ff00', 'red', etc.)
   * In Node.js: use ANSI color codes (e.g., '\x1b[32m')
   */
  colors?: Partial<ColorConfig>;
  /**
   * If true, logs when timers start. Useful for debugging.
   */
  verboseTimer?: boolean;
}

const INFO: LogOptions = { level: Level.INFO };
const ERROR: LogOptions = { level: Level.ERROR };
const WARN: LogOptions = { level: Level.WARN };
const DEBUG: LogOptions = { level: Level.DEBUG };

const isBrowser = typeof window !== 'undefined';

const defaultBrowserColors: ColorConfig = {
  INFO: 'color: #00ff00', // Green
  ERROR: 'color: #ff0000', // Red
  WARN: 'color: #ffff00', // Yellow
  DEBUG: 'color: #00ffff', // Cyan
  TIMER: 'color: #ff00ff', // Magenta
} as const;

const defaultNodeColors: ColorConfig = {
  INFO: '\x1b[32m', // Green
  ERROR: '\x1b[31m', // Red
  WARN: '\x1b[33m', // Yellow
  DEBUG: '\x1b[36m', // Cyan
  TIMER: '\x1b[35m', // Magenta
} as const;

/**
 * Represents a logger that can be used to log messages with different log levels.
 */
export class Logger {
  private readonly prefix: string;
  private readonly colors: ColorConfig;
  private options: LoggerOptions = {
    debug: false,
    color: true,
    timestampFormat: 'time',
    verboseTimer: false,
  };
  private readonly timers: Map<string, number> = new Map();

  /**
   * Creates a new instance of the Logger class.
   * @param prefix The prefix to be added to each log message.
   */
  constructor(prefix: string, options?: LoggerOptions) {
    this.prefix = prefix;
    if (options) {
      this.options = {
        ...this.options,
        ...options,
      };
    }

    // Initialize colors with defaults and any custom overrides
    this.colors = {
      ...(isBrowser ? defaultBrowserColors : defaultNodeColors),
      ...options?.colors,
    };
  }

  /**
   * Logs an informational message.
   * @param args The arguments to be logged.
   */
  info(...args: LogArgument[]) {
    this.logInternal(INFO, ...args);
    return this;
  }

  /**
   * Logs a warning message.
   * @param args The arguments to be logged.
   */
  warn(...args: LogArgument[]) {
    this.logInternal(WARN, ...args);
    return this;
  }

  /**
   * Logs an error message.
    * When an {@link Error} is provided, its stack (or name/message fallback)
    * is logged so stack traces remain visible.
   * @param args The arguments to be logged.
   */
  error(...args: LogArgument[]) {
    this.logInternal(ERROR, ...args);
    return this;
  }

  /**
   * Logs a debug message.
   * This method will only log messages if the debug option is set to true.
   * @param args The arguments to be logged.
   */
  debug(...args: LogArgument[]) {
    if (this.options.debug) {
      this.logInternal(DEBUG, ...args);
    }
    return this;
  }

  /**
   * Starts a timer with a label.
    * Timer behavior is unified across color modes:
    * - with `color: true`, output is colorized
    * - with `color: false`, output is plain text
   * @param label The label for the timer.
   */
  time(label: string, level: LevelType = Level.TIMER) {
    this.timers.set(label, performance.now());
    if (this.options.verboseTimer) {
      if (isBrowser) {
        if (this.options.color) {
          console.log(`%c${this.prefix} ${label}: start`, this.getColor(level));
        } else {
          console.log(`${this.prefix} ${label}: start`);
        }
      } else {
        if (this.options.color) {
          const color = this.getColor(level);
          console.log(`${color}${this.prefix} ${label}: start${'\x1b[0m'}`);
        } else {
          console.log(`${this.prefix} ${label}: start`);
        }
      }
    }
  }

  /**
   * Ends a timer with a label.
    * Logs a warning if the timer label was not started.
   * @param label The label for the timer.
   */
  timeEnd(label: string, level: LevelType = Level.TIMER) {
    const startTime = this.timers.get(label);
    if (startTime === undefined) {
      console.warn(`Timer '${this.prefix} ${label}' does not exist`);
      return;
    }

    const duration = performance.now() - startTime;
    this.timers.delete(label);

    if (isBrowser) {
      if (this.options.color) {
        console.log(`%c${this.prefix} ${label}: ${duration.toFixed(2)}ms`, this.getColor(level));
      } else {
        console.log(`${this.prefix} ${label}: ${duration.toFixed(2)}ms`);
      }
    } else {
      if (this.options.color) {
        const color = this.getColor(level);
        console.log(`${color}${this.prefix} ${label}: ${duration.toFixed(2)}ms${'\x1b[0m'}`);
      } else {
        console.log(`${this.prefix} ${label}: ${duration.toFixed(2)}ms`);
      }
    }
  }

  private getTimestamp(): string {
    if (!this.options.timestamp) return '';

    const date = new Date();
    let options: Intl.DateTimeFormatOptions;

    switch (this.options.timestampFormat) {
      case 'full':
        options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        };
        break;
      case 'short':
        options = {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        };
        break;
      default:
        options = {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        };
    }

    return `[${date.toLocaleString('en-US', options)}] `;
  }

  private getColor(level: LevelType): string {
    return this.colors[level] ?? '';
  }

  private getFormatSpecifier(arg: any): string {
    if (arg === null) return '%s';
    if (arg === undefined) return '%s';

    switch (typeof arg) {
      case 'object':
        return '%o';
      case 'number':
        return '%d';
      case 'boolean':
        return '%s';
      default:
        return '%s';
    }
  }

  private normalizeLogArgs(level: LevelType | undefined, args: any[]): any[] {
    if (level !== Level.ERROR) {
      return args;
    }

    return args.map((arg) => {
      if (arg instanceof Error) {
        return arg.stack ?? `${arg.name}: ${arg.message}`;
      }

      return arg;
    });
  }

  private getConsoleMethod(level?: LevelType): (...data: any[]) => void {
    switch (level) {
      case Level.ERROR:
        return console.error.bind(console);
      case Level.WARN:
        return console.warn.bind(console);
      default:
        return console.log.bind(console);
    }
  }

  private logInternal(logOptions?: LogOptions, ...args: any[]) {
    const timestamp = this.getTimestamp();
    const prefix = timestamp + this.prefix;
    const normalizedArgs = this.normalizeLogArgs(logOptions?.level, args);
    const logMethod = this.getConsoleMethod(logOptions?.level);

    if (!this.options.color) {
      logMethod(prefix, ...normalizedArgs);
      return;
    }

    if (isBrowser) {
      const style = logOptions ? this.getColor(logOptions.level) : '';
      const formatters = normalizedArgs.map((arg) => this.getFormatSpecifier(arg));
      logMethod(`%c${prefix} ${formatters.join(' ')}`, style, ...normalizedArgs);
      return;
    }

    const color = logOptions ? this.getColor(logOptions.level) : '';
    const reset = '\x1b[0m';
    logMethod(`${color}${prefix}`, ...normalizedArgs, reset);
  }

  /**
   * Checks if debug mode is currently enabled.
   * @returns {boolean} - True if debug mode is enabled, false otherwise.
   */
  isDebugEnabled(): boolean {
    return !!this.options.debug;
  }

  /**
   * Starts a timer with a label only if debug mode is enabled.
   * @param label The label for the timer.
   */
  debugTime(label: string) {
    if (this.isDebugEnabled()) {
      this.time(label, Level.DEBUG);
    }
  }

  /**
   * Ends a timer with a label only if debug mode is enabled.
   * @param label The label for the timer.
   */
  debugTimeEnd(label: string) {
    if (this.isDebugEnabled()) {
      this.timeEnd(label, Level.DEBUG);
    }
  }
}
