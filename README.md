# @ecopages/logger

A lightweight, flexible logging library. This logger supports multiple log levels and allows for easy extension and integration into any project.

## Features

- **Multiple Log Levels**: Supports `INFO`, `ERROR`, `WARN`, and `DEBUG` log levels for granular control over logging output.
- **Prefixed Messages**: Allows for prefixing log messages for better identification and filtering.
- **Easy to Extend**: Designed with simplicity in mind, making it easy to extend or modify to fit specific requirements.

## Usage

First, import the `Logger` class from the `logger.ts` file:

```ts
import { Logger } from "./path/to/logger";
```

Create an instance of the Logger class, optionally specifying a prefix for all log messages:

```ts
const logger = new Logger("[my-app]");
```

Use the logger instance to log messages at different levels:

```ts
logger.info("This is an informational message");
logger.warn("This is a warning message");
logger.error("This is an error message");
logger.debug("This is a debug message");
```

```bash
[my-app] This is an informational message
[my-app] This is a warning message
[my-app] This is an error message
[my-app] This is a debug message
```

## API

### Constructor

- `Logger(prefix: string)`: Creates a new logger instance with the specified prefix.

### Methods

- `info(...args: any[])`: Logs an informational message.
- `warn(...args: any[])`: Logs a warning message.
- `error(...args: any[])`: Logs an error message.
- `debug(...args: any[])`: Logs a debug message.

### Extending the Logger

To extend the logger with additional functionality, you can subclass the Logger class. For example, to add a method for logging fatal errors:

```ts
class ExtendedLogger extends Logger {
  fatal(...args: any[]) {
    // Custom implementation for fatal errors
  }
}
```
