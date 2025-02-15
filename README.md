# @ecopages/logger

A lightweight, flexible logging library with support for both browser and Node.js environments. Features customizable colors, timestamps, and multiple log levels.

## Features

- **Multiple Log Levels**: `INFO`, `ERROR`, `WARN`, and `DEBUG`
- **Environment Detection**: Automatically adapts to browser or Node.js environments
- **Timestamp Support**: Configurable timestamp formats
- **Customizable Colors**: Override default colors for each log level
- **Timer Support**: Built-in timer functionality with colored output

## Installation

```bash
npm install @ecopages/logger
```

## Basic Usage

```ts
import { Logger } from "@ecopages/logger";

const logger = new Logger("[MyApp]");

logger.info("Server started");
logger.warn("Resource usage high");
logger.error("Connection failed");
logger.debug("Request details:", { method: "GET", path: "/" });
```

## Configuration Options

The logger accepts various options for customization:

```ts
interface LoggerOptions {
  debug?: boolean;      // Enable debug messages
  color?: boolean;      // Enable colored output
  timestamp?: boolean;  // Enable timestamps
  timestampFormat?: 'full' | 'time' | 'short';  // Timestamp format
  colors?: {           // Custom colors for each level
    INFO?: string;
    ERROR?: string;
    WARN?: string;
    DEBUG?: string;
    TIMER?: string;
  };
}

// Example with options
const logger = new Logger("[MyApp]", {
  debug: true,
  timestamp: true,
  timestampFormat: 'time',
  colors: {
    INFO: 'color: green',     // Browser
    ERROR: '\x1b[41m',        // Node.js
    WARN: 'color: orange',    // Browser
    DEBUG: '\x1b[36m',        // Node.js
    TIMER: 'color: purple'    // Browser
  }
});
```

### Timestamp Formats

- `full`: `YYYY-MM-DD HH:mm:ss`
- `time`: `HH:mm:ss` (default)
- `short`: `MM-DD HH:mm:ss`

```ts
// With full timestamp
const logger = new Logger("[MyApp]", {
  timestamp: true,
  timestampFormat: 'full'
});
// Output: [2024-01-01 15:30:45] [MyApp] Message

// With time only
const logger = new Logger("[MyApp]", {
  timestamp: true,
  timestampFormat: 'time'
});
// Output: [15:30:45] [MyApp] Message
```

### Color Customization

Colors can be customized differently for browser and Node.js environments:

```ts
// Browser colors (CSS syntax)
const browserLogger = new Logger("[Browser]", {
  colors: {
    INFO: 'color: #00ff00',
    ERROR: 'color: red',
    WARN: 'color: orange',
    DEBUG: 'color: cyan'
  }
});

// Node.js colors (ANSI escape codes)
const nodeLogger = new Logger("[Node]", {
  colors: {
    INFO: '\x1b[32m',
    ERROR: '\x1b[41m', // Red background
    WARN: '\x1b[33m',
    DEBUG: '\x1b[36m'
  }
});
```

### Timer Usage

```ts
const logger = new Logger("[MyApp]");

logger.time("operation");
// ... some operations
logger.timeEnd("operation");
// Output: operation: 100ms (in colors)

// Custom timer color
logger.time("custom-timer", "INFO");  // Use INFO color
logger.timeEnd("custom-timer", "INFO");
```

## Debug Mode

Debug messages are controlled via constructor options:

```ts
const logger = new Logger("[MyApp]", { debug: true });
```

It is suggested to use an environment variable to control debug mode:

```ts
const logger = new Logger("[MyApp]", { debug: process.env.DEBUG === "true" });
```

Debug messages will only be logged when both the constructor option is true and the environment variable is set to "true".

## Extending the Logger

The Logger class can be extended to add custom functionality:

```typescript
class CustomLogger extends Logger {
  // Add custom log levels
  success(...args: any[]) {
    return this.logInternal({ level: 'SUCCESS' }, ...args);
  }

  // Add custom formatting
  logWithDate(...args: any[]) {
    const timestamp = new Date().toISOString();
    return this.info(`[${timestamp}]`, ...args);
  }

  // Override existing methods
  error(...args: any[]) {
    // Add error tracking
    trackError(args);
    return super.error(...args);
  }

  // Add custom timer functionality
  timePromise<T>(label: string, promise: Promise<T>): Promise<T> {
    this.time(label);
    return promise.finally(() => this.timeEnd(label));
  }
}

// Usage
const logger = new CustomLogger("[MyApp]", {
  colors: {
    SUCCESS: 'color: lightgreen', // Browser
    // or '\x1b[92m' for Node.js
  }
});

logger.success("Operation completed");
logger.logWithDate("Custom timestamp");
await logger.timePromise("async-op", someAsyncOperation());
```

## API Reference

### Constructor
```ts
new Logger(prefix: string, options?: LoggerOptions)
```

### Methods
- `info(...args: any[]): Logger`
- `warn(...args: any[]): Logger`
- `error(...args: any[]): Logger`
- `debug(...args: any[]): Logger`
- `time(label: string, level?: LevelType): void`
- `timeEnd(label: string, level?: LevelType): void`

### Default Colors

Browser:
- INFO: `#00ff00` (Green)
- ERROR: `#ff0000` (Red)
- WARN: `#ffff00` (Yellow)
- DEBUG: `#00ffff` (Cyan)
- TIMER: `#ff00ff` (Magenta)

Node.js:
- INFO: `\x1b[32m` (Green)
- ERROR: `\x1b[31m` (Red)
- WARN: `\x1b[33m` (Yellow)
- DEBUG: `\x1b[36m` (Cyan)
- TIMER: `\x1b[35m` (Magenta)
