import { beforeEach, describe, expect, it, spyOn } from 'bun:test';
import { Logger } from './logger';

let logger: Logger;

const LOG_PREFIX = 'Test';
const LOG_MESSAGE = 'Hello, world!';

describe('Logger', () => {
  it('should log info message', () => {
    logger = new Logger(LOG_PREFIX);
    const consoleSpy = spyOn(console, 'log');
    logger.info(LOG_MESSAGE);
    expect(consoleSpy).toHaveBeenCalledWith(`\x1b[32m${LOG_PREFIX}`, LOG_MESSAGE, '\x1b[0m');
    consoleSpy.mockRestore();
  });

  it('should log warning message', () => {
    logger = new Logger(LOG_PREFIX);
    const consoleSpy = spyOn(console, 'log');
    logger.warn(LOG_MESSAGE);
    expect(consoleSpy).toHaveBeenCalledWith(`\x1b[33m${LOG_PREFIX}`, LOG_MESSAGE, '\x1b[0m');
    consoleSpy.mockRestore();
  });

  it('should log error message', () => {
    logger = new Logger(LOG_PREFIX);
    const consoleSpy = spyOn(console, 'log');
    logger.error(LOG_MESSAGE);
    expect(consoleSpy).toHaveBeenCalledWith(`\x1b[31m${LOG_PREFIX}`, LOG_MESSAGE, '\x1b[0m');
    consoleSpy.mockRestore();
  });

  it('should log debug message when debug option is true', () => {
    logger = new Logger(LOG_PREFIX, { debug: true });
    const consoleSpy = spyOn(console, 'log');
    import.meta.env.ECOPAGES_LOGGER_DEBUG = 'true';
    logger.debug(LOG_MESSAGE);
    expect(consoleSpy).toHaveBeenCalledWith(`\x1b[36m${LOG_PREFIX}`, LOG_MESSAGE, '\x1b[0m');
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
});
