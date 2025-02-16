import { beforeEach, describe, expect, it, spyOn } from 'bun:test';
import { sleep } from 'bun';
import { type LevelType, Logger, type LoggerOptions } from './logger';

const isBrowser = typeof window !== 'undefined';

const getExpectedFormat = (
  logger: Logger,
  prefix: string,
  args: any[],
  timestamp?: string,
  level: LevelType = 'INFO',
) => {
  const fullPrefix = timestamp ? `[${timestamp}] ${prefix}` : prefix;
  if (isBrowser) {
    const formatters = args.map((arg) => {
      if (arg === null || arg === undefined) return '%s';
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
    });
    return [`%c${fullPrefix} ${formatters.join(' ')}`, logger['colors'][level], ...args];
  }
  return [`${logger['colors'][level]}${fullPrefix}`, ...args, '\x1b[0m'];
};

const mockTimestamp = (expected: string, options: Intl.DateTimeFormatOptions) => {
  return spyOn(Date.prototype, 'toLocaleString').mockImplementation(function (
    this: Date,
    locale?: string | string[],
    opts?: Intl.DateTimeFormatOptions,
  ): string {
    if (!locale && !opts) return expected;
    expect(locale).toBe('en-US');
    expect(opts).toEqual(options);
    return expected;
  });
};

let logger: Logger;

const LOG_PREFIX = 'Test';
const LOG_MESSAGE = 'Hello, world!';

describe('Logger', () => {
  it('should log info message', () => {
    logger = new Logger(LOG_PREFIX);
    const consoleSpy = spyOn(console, 'log');
    logger.info(LOG_MESSAGE);
    expect(consoleSpy).toHaveBeenCalledWith(...getExpectedFormat(logger, LOG_PREFIX, [LOG_MESSAGE]));
    consoleSpy.mockRestore();
  });

  it('should log warning message', () => {
    logger = new Logger(LOG_PREFIX);
    const consoleSpy = spyOn(console, 'log');
    logger.warn(LOG_MESSAGE);
    expect(consoleSpy).toHaveBeenCalledWith(...getExpectedFormat(logger, LOG_PREFIX, [LOG_MESSAGE], undefined, 'WARN'));
    consoleSpy.mockRestore();
  });

  it('should log error message', () => {
    logger = new Logger(LOG_PREFIX);
    const consoleSpy = spyOn(console, 'log');
    logger.error(LOG_MESSAGE);
    expect(consoleSpy).toHaveBeenCalledWith(
      ...getExpectedFormat(logger, LOG_PREFIX, [LOG_MESSAGE], undefined, 'ERROR'),
    );
    consoleSpy.mockRestore();
  });

  it('should log debug message when debug option is true', () => {
    logger = new Logger(LOG_PREFIX, { debug: true });
    const consoleSpy = spyOn(console, 'log');
    import.meta.env.ECOPAGES_LOGGER_DEBUG = 'true';
    logger.debug(LOG_MESSAGE);
    expect(consoleSpy).toHaveBeenCalledWith(
      ...getExpectedFormat(logger, LOG_PREFIX, [LOG_MESSAGE], undefined, 'DEBUG'),
    );
    consoleSpy.mockRestore();
  });

  it('should not log debug message when debug option is false', () => {
    logger = new Logger(LOG_PREFIX);
    const consoleSpy = spyOn(console, 'log');
    import.meta.env.ECOPAGES_LOGGER_DEBUG = 'false';
    logger.debug(LOG_MESSAGE);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should log info message without colors when color is false', () => {
    logger = new Logger(LOG_PREFIX, { color: false });
    const consoleSpy = spyOn(console, 'log');
    logger.info(LOG_MESSAGE);
    expect(consoleSpy).toHaveBeenCalledWith(LOG_PREFIX, LOG_MESSAGE);
    consoleSpy.mockRestore();
  });

  it('should log warning message without colors when color is false', () => {
    logger = new Logger(LOG_PREFIX, { color: false });
    const consoleSpy = spyOn(console, 'log');
    logger.warn(LOG_MESSAGE);
    expect(consoleSpy).toHaveBeenCalledWith(LOG_PREFIX, LOG_MESSAGE);
    consoleSpy.mockRestore();
  });

  it('should log error message without colors when color is false', () => {
    logger = new Logger(LOG_PREFIX, { color: false });
    const consoleSpy = spyOn(console, 'log');
    logger.error(LOG_MESSAGE);
    expect(consoleSpy).toHaveBeenCalledWith(LOG_PREFIX, LOG_MESSAGE);
    consoleSpy.mockRestore();
  });

  it('should log debug message without colors when color is false and debug is enabled', () => {
    logger = new Logger(LOG_PREFIX, { color: false, debug: true });
    const consoleSpy = spyOn(console, 'log');
    import.meta.env.ECOPAGES_LOGGER_DEBUG = 'true';
    logger.debug(LOG_MESSAGE);
    expect(consoleSpy).toHaveBeenCalledWith(LOG_PREFIX, LOG_MESSAGE);
    consoleSpy.mockRestore();
  });

  it('should use custom prefix in log messages', () => {
    const customPrefix = '[CustomPrefix]';
    logger = new Logger(customPrefix);
    const consoleSpy = spyOn(console, 'log');
    logger.info(LOG_MESSAGE);
    expect(consoleSpy).toHaveBeenCalledWith(...getExpectedFormat(logger, customPrefix, [LOG_MESSAGE]));
    consoleSpy.mockRestore();
  });

  it('should format timestamps correctly for each format option', () => {
    const formats: Record<string, { expected: string; options: Intl.DateTimeFormatOptions }> = {
      full: {
        expected: '2024-01-01 15:30:45',
        options: {
          year: 'numeric' as const,
          month: '2-digit' as const,
          day: '2-digit' as const,
          hour: '2-digit' as const,
          minute: '2-digit' as const,
          second: '2-digit' as const,
          hour12: false,
        },
      },
      time: {
        expected: '15:30:45',
        options: {
          hour: '2-digit' as const,
          minute: '2-digit' as const,
          second: '2-digit' as const,
          hour12: false,
        },
      },
      short: {
        expected: '01-01 15:30:45',
        options: {
          month: '2-digit' as const,
          day: '2-digit' as const,
          hour: '2-digit' as const,
          minute: '2-digit' as const,
          second: '2-digit' as const,
          hour12: false,
        },
      },
    };

    for (const [format, { expected, options }] of Object.entries(formats)) {
      const dateNowSpy = mockTimestamp(expected, options);
      logger = new Logger(LOG_PREFIX, {
        timestamp: true,
        timestampFormat: format as LoggerOptions['timestampFormat'],
      });
      const consoleSpy = spyOn(console, 'log');

      logger.info(LOG_MESSAGE);
      expect(consoleSpy).toHaveBeenCalledWith(...getExpectedFormat(logger, LOG_PREFIX, [LOG_MESSAGE], expected));

      dateNowSpy.mockRestore();
      consoleSpy.mockRestore();
    }
  });

  it('should use time format by default when timestamp is enabled', () => {
    const expected = '15:30:45';
    const dateNowSpy = spyOn(Date.prototype, 'toLocaleString').mockImplementation(() => expected);

    logger = new Logger(LOG_PREFIX, { timestamp: true });
    const consoleSpy = spyOn(console, 'log');

    logger.info(LOG_MESSAGE);
    expect(consoleSpy).toHaveBeenCalledWith(...getExpectedFormat(logger, LOG_PREFIX, [LOG_MESSAGE], expected));

    dateNowSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('should not include timestamp when timestamp option is false', () => {
    logger = new Logger(LOG_PREFIX, { timestamp: false });
    const consoleSpy = spyOn(console, 'log');
    const dateNowSpy = spyOn(Date.prototype, 'toLocaleString');

    logger.info(LOG_MESSAGE);
    expect(consoleSpy).toHaveBeenCalledWith(...getExpectedFormat(logger, LOG_PREFIX, [LOG_MESSAGE]));
    expect(dateNowSpy).not.toHaveBeenCalled();

    dateNowSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('should format timestamp according to specified format', () => {
    const formats = {
      full: '2024-01-01 00:00:00',
      time: '00:00:00',
      short: '01-01 00:00:00',
    };

    for (const [format, expected] of Object.entries(formats)) {
      const dateNowSpy = spyOn(Date.prototype, 'toLocaleString').mockReturnValue(expected);
      logger = new Logger(LOG_PREFIX, {
        timestamp: true,
        timestampFormat: format as LoggerOptions['timestampFormat'],
      });
      const consoleSpy = spyOn(console, 'log');

      logger.info(LOG_MESSAGE);
      expect(consoleSpy).toHaveBeenCalledWith(...getExpectedFormat(logger, LOG_PREFIX, [LOG_MESSAGE], expected));

      dateNowSpy.mockRestore();
      consoleSpy.mockRestore();
    }
  });

  it('should include timestamp when timestamp option is true', () => {
    const expected = '15:30:45';
    const dateNowSpy = spyOn(Date.prototype, 'toLocaleString').mockImplementation(() => expected);

    logger = new Logger(LOG_PREFIX, { timestamp: true });
    const consoleSpy = spyOn(console, 'log');

    logger.info(LOG_MESSAGE);
    expect(consoleSpy).toHaveBeenCalledWith(...getExpectedFormat(logger, LOG_PREFIX, [LOG_MESSAGE], expected));

    dateNowSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('should include timestamp with custom prefix when both are specified', () => {
    const expected = '15:30:45';
    const customPrefix = '[CustomPrefix]';
    const dateNowSpy = spyOn(Date.prototype, 'toLocaleString').mockImplementation(() => expected);

    logger = new Logger(customPrefix, { timestamp: true });
    const consoleSpy = spyOn(console, 'log');

    logger.info(LOG_MESSAGE);
    expect(consoleSpy).toHaveBeenCalledWith(...getExpectedFormat(logger, customPrefix, [LOG_MESSAGE], expected));

    dateNowSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('should include timestamp without colors when color option is false', () => {
    const expected = '15:30:45';
    const dateNowSpy = spyOn(Date.prototype, 'toLocaleString').mockImplementation(() => expected);

    logger = new Logger(LOG_PREFIX, { timestamp: true, color: false });
    const consoleSpy = spyOn(console, 'log');

    logger.info(LOG_MESSAGE);
    expect(consoleSpy).toHaveBeenCalledWith(`[${expected}] ${LOG_PREFIX}`, LOG_MESSAGE);

    dateNowSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  describe('Custom Colors', () => {
    it('should use custom colors in browser environment', () => {
      const customColors = {
        INFO: 'color: purple',
        ERROR: 'color: darkred',
        WARN: 'color: orange',
      };

      logger = new Logger(LOG_PREFIX, { colors: customColors });
      const consoleSpy = spyOn(console, 'log');

      logger.info(LOG_MESSAGE);
      expect(consoleSpy).toHaveBeenCalledWith(
        ...getExpectedFormat(logger, LOG_PREFIX, [LOG_MESSAGE], undefined, 'INFO'),
      );

      logger.error(LOG_MESSAGE);
      expect(consoleSpy).toHaveBeenCalledWith(
        ...getExpectedFormat(logger, LOG_PREFIX, [LOG_MESSAGE], undefined, 'ERROR'),
      );

      logger.warn(LOG_MESSAGE);
      expect(consoleSpy).toHaveBeenCalledWith(
        ...getExpectedFormat(logger, LOG_PREFIX, [LOG_MESSAGE], undefined, 'WARN'),
      );

      consoleSpy.mockRestore();
    });

    it('should use custom colors in Node.js environment', () => {
      const customColors = {
        INFO: '\x1b[42m', // Green background
        ERROR: '\x1b[41m', // Red background
        WARN: '\x1b[43m', // Yellow background
      };

      logger = new Logger(LOG_PREFIX, { colors: customColors });
      const consoleSpy = spyOn(console, 'log');

      logger.info(LOG_MESSAGE);
      expect(consoleSpy).toHaveBeenCalledWith(
        ...getExpectedFormat(logger, LOG_PREFIX, [LOG_MESSAGE], undefined, 'INFO'),
      );

      logger.error(LOG_MESSAGE);
      expect(consoleSpy).toHaveBeenCalledWith(
        ...getExpectedFormat(logger, LOG_PREFIX, [LOG_MESSAGE], undefined, 'ERROR'),
      );

      logger.warn(LOG_MESSAGE);
      expect(consoleSpy).toHaveBeenCalledWith(
        ...getExpectedFormat(logger, LOG_PREFIX, [LOG_MESSAGE], undefined, 'WARN'),
      );

      consoleSpy.mockRestore();
    });

    it('should merge custom colors with defaults', () => {
      const customColors = {
        INFO: 'color: purple',
        // ERROR and WARN not specified, should use defaults
      };

      logger = new Logger(LOG_PREFIX, { colors: customColors });
      const consoleSpy = spyOn(console, 'log');

      logger.info(LOG_MESSAGE);
      expect(consoleSpy).toHaveBeenCalledWith(
        ...getExpectedFormat(logger, LOG_PREFIX, [LOG_MESSAGE], undefined, 'INFO'),
      );

      // These should use default colors
      logger.error(LOG_MESSAGE);
      logger.warn(LOG_MESSAGE);

      expect(logger['colors'].ERROR).toBe(isBrowser ? 'color: #ff0000' : '\x1b[31m');
      expect(logger['colors'].WARN).toBe(isBrowser ? 'color: #ffff00' : '\x1b[33m');

      consoleSpy.mockRestore();
    });
  });

  describe('Mixed Arguments', () => {
    it('should correctly format different argument types in browser', () => {
      logger = new Logger(LOG_PREFIX);
      const consoleSpy = spyOn(console, 'log');

      const testArgs = ['string message', 42, true, { key: 'value' }, null, undefined];

      logger.info(...testArgs);

      if (isBrowser) {
        expect(consoleSpy).toHaveBeenCalledWith(
          `%c${LOG_PREFIX} %s %d %s %o %s %s`,
          logger['colors'].INFO,
          ...testArgs,
        );
      } else {
        expect(consoleSpy).toHaveBeenCalledWith(`${logger['colors'].INFO}${LOG_PREFIX}`, ...testArgs, '\x1b[0m');
      }

      consoleSpy.mockRestore();
    });

    it('should handle complex objects', () => {
      logger = new Logger(LOG_PREFIX);
      const consoleSpy = spyOn(console, 'log');

      const complexObj = {
        nested: { value: 42 },
        array: [1, 2, 3],
        date: new Date(),
      };

      logger.info('Status:', complexObj, 'Processing');

      if (isBrowser) {
        expect(consoleSpy).toHaveBeenCalledWith(
          `%c${LOG_PREFIX} %s %o %s`,
          logger['colors'].INFO,
          'Status:',
          complexObj,
          'Processing',
        );
      } else {
        expect(consoleSpy).toHaveBeenCalledWith(
          `${logger['colors'].INFO}${LOG_PREFIX}`,
          'Status:',
          complexObj,
          'Processing',
          '\x1b[0m',
        );
      }

      consoleSpy.mockRestore();
    });

    it('should format debug messages with mixed types', () => {
      logger = new Logger(LOG_PREFIX, { debug: true });
      const consoleSpy = spyOn(console, 'log');

      logger.debug('Debug:', { id: 123 }, true, 42, ['a', 'b', 'c']);

      if (isBrowser) {
        expect(consoleSpy).toHaveBeenCalledWith(
          `%c${LOG_PREFIX} %s %o %s %d %o`,
          logger['colors'].DEBUG,
          'Debug:',
          { id: 123 },
          true,
          42,
          ['a', 'b', 'c'],
        );
      } else {
        expect(consoleSpy).toHaveBeenCalledWith(
          `${logger['colors'].DEBUG}${LOG_PREFIX}`,
          'Debug:',
          { id: 123 },
          true,
          42,
          ['a', 'b', 'c'],
          '\x1b[0m',
        );
      }

      consoleSpy.mockRestore();
    });
  });

  // Update existing timestamp tests to use new format
  it('should format timestamps correctly with mixed types', () => {
    const expected = '15:30:45';
    const dateNowSpy = spyOn(Date.prototype, 'toLocaleString').mockImplementation(() => expected);

    logger = new Logger(LOG_PREFIX, { timestamp: true });
    const consoleSpy = spyOn(console, 'log');

    const args = ['Status:', { count: 42 }, true];
    logger.info(...args);

    if (isBrowser) {
      expect(consoleSpy).toHaveBeenCalledWith(`%c[${expected}] ${LOG_PREFIX} %s %o %s`, logger['colors'].INFO, ...args);
    } else {
      expect(consoleSpy).toHaveBeenCalledWith(
        `${logger['colors'].INFO}[${expected}] ${LOG_PREFIX}`,
        ...args,
        '\x1b[0m',
      );
    }

    dateNowSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  describe('Timer', () => {
    beforeEach(() => {
      let time = 0;
      spyOn(performance, 'now').mockImplementation(() => {
        time += 100;
        // Each call to performance.now() increments by 100ms
        return time;
      });
    });

    it('should start and stop a timer', () => {
      logger = new Logger(LOG_PREFIX, { verboseTimer: false });
      const consoleSpy = spyOn(console, 'log');
      const warnSpy = spyOn(console, 'warn');

      const timerLabel = 'Timer';
      logger.time(timerLabel);

      logger.timeEnd(timerLabel);

      if (isBrowser) {
        expect(consoleSpy).toHaveBeenCalledWith(`%c${LOG_PREFIX} ${timerLabel}: 100.00ms`, logger['colors'].TIMER);
      } else {
        expect(consoleSpy).toHaveBeenCalledWith(
          `${logger['colors'].TIMER}${LOG_PREFIX} ${timerLabel}: 100.00ms\x1b[0m`,
        );
      }

      expect(warnSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
      warnSpy.mockRestore();
    });

    it('should start and stop a timer with verboseTimer', () => {
      logger = new Logger(LOG_PREFIX, { verboseTimer: true });
      const consoleSpy = spyOn(console, 'log');
      const warnSpy = spyOn(console, 'warn');

      const timerLabel = 'Timer';
      logger.time(timerLabel);

      if (isBrowser) {
        expect(consoleSpy).toHaveBeenCalledWith(`%c${LOG_PREFIX} ${timerLabel}: start`, logger['colors'].TIMER);
      } else {
        expect(consoleSpy).toHaveBeenCalledWith(`${logger['colors'].TIMER}${LOG_PREFIX} ${timerLabel}: start\x1b[0m`);
      }

      logger.timeEnd(timerLabel);

      if (isBrowser) {
        expect(consoleSpy).toHaveBeenCalledWith(`%c${LOG_PREFIX} ${timerLabel}: 100.00ms`, logger['colors'].TIMER);
      } else {
        expect(consoleSpy).toHaveBeenCalledWith(
          `${logger['colors'].TIMER}${LOG_PREFIX} ${timerLabel}: 100.00ms\x1b[0m`,
        );
      }

      expect(warnSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
      warnSpy.mockRestore();
    });

    it('should use custom colors for timer', () => {
      const customColors = {
        TIMER: isBrowser ? 'color: purple' : '\x1b[45m',
      };
      logger = new Logger(LOG_PREFIX, { colors: customColors, verboseTimer: true });
      const consoleSpy = spyOn(console, 'log');

      const timerLabel = 'Custom Timer';
      logger.time(timerLabel);

      if (isBrowser) {
        expect(consoleSpy).toHaveBeenCalledWith(`%c${LOG_PREFIX} ${timerLabel}: start`, customColors.TIMER);
      } else {
        expect(consoleSpy).toHaveBeenCalledWith(`${customColors.TIMER}${LOG_PREFIX} ${timerLabel}: start\x1b[0m`);
      }

      logger.timeEnd(timerLabel);

      if (isBrowser) {
        expect(consoleSpy).toHaveBeenCalledWith(`%c${LOG_PREFIX} ${timerLabel}: 100.00ms`, customColors.TIMER);
      } else {
        expect(consoleSpy).toHaveBeenCalledWith(`${customColors.TIMER}${LOG_PREFIX} ${timerLabel}: 100.00ms\x1b[0m`);
      }

      consoleSpy.mockRestore();
    });

    it('should warn when stopping non-existent timer', () => {
      logger = new Logger(LOG_PREFIX);
      const warnSpy = spyOn(console, 'warn');

      logger.timeEnd('non-existent');
      expect(warnSpy).toHaveBeenCalledWith(`Timer '${LOG_PREFIX} non-existent' does not exist`);

      warnSpy.mockRestore();
    });

    it('should use console.time when colors are disabled', () => {
      logger = new Logger(LOG_PREFIX, { color: false });
      const timeStartSpy = spyOn(console, 'time');
      const timeEndSpy = spyOn(console, 'timeEnd');
      const consoleSpy = spyOn(console, 'log');

      const timerLabel = 'No Color Timer';
      logger.time(timerLabel);
      expect(timeStartSpy).toHaveBeenCalledWith(`${LOG_PREFIX} ${timerLabel}`);
      expect(consoleSpy).not.toHaveBeenCalled();

      logger.timeEnd(timerLabel);
      expect(timeEndSpy).toHaveBeenCalledWith(`${LOG_PREFIX} ${timerLabel}`);
      expect(consoleSpy).not.toHaveBeenCalled();

      timeStartSpy.mockRestore();
      timeEndSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    it('should handle multiple concurrent timers', () => {
      let time = 0;

      spyOn(performance, 'now').mockImplementation(() => {
        time += 100;
        return time;
      });

      logger = new Logger(LOG_PREFIX, { verboseTimer: true });
      const consoleSpy = spyOn(console, 'log');

      const timers = ['timer1', 'timer2', 'timer3'];
      for (const label of timers) {
        logger.time(label);
      }

      const startCalls = consoleSpy.mock.calls.slice(0, 3);
      startCalls.forEach((call, index) => {
        const label = timers[index];
        if (isBrowser) {
          expect(call[0]).toBe(`%c${LOG_PREFIX} ${label}: start`);
          expect(call[1]).toBe(logger['colors'].TIMER);
        } else {
          expect(call[0]).toBe(`${logger['colors'].TIMER}${LOG_PREFIX} ${label}: start\x1b[0m`);
        }
      });

      timers.reverse().forEach((label, index) => {
        logger.timeEnd(label);
      });

      const endCalls = consoleSpy.mock.calls.slice(3);
      const expectedDurations = [100, 300, 500]; // timer3: 100ms, timer2: 300ms, timer1: 500ms

      endCalls.forEach((call, index) => {
        const label = timers[index];
        const duration = expectedDurations[index];

        if (isBrowser) {
          expect(call[0]).toBe(`%c${LOG_PREFIX} ${label}: ${duration.toFixed(2)}ms`);
          expect(call[1]).toBe(logger['colors'].TIMER);
        } else {
          expect(call[0]).toBe(`${logger['colors'].TIMER}${LOG_PREFIX} ${label}: ${duration.toFixed(2)}ms\x1b[0m`);
        }
      });

      consoleSpy.mockRestore();
    });
  });
});
