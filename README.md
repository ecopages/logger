# @ecopages/logger

A lightweight, flexible logging library with color support, timestamps, and timer functionality. This logger supports multiple log levels and allows for easy extension and integration into any project.

## Features

- **Multiple Log Levels**: Supports `INFO`, `ERROR`, `WARN`, and `DEBUG` log levels
- **Colored Output**: Configurable colors for different log levels in both browser and Node.js environments
- **Timestamps**: Optional timestamps with configurable formats
- **Timer Support**: Built-in timer functionality for performance measurements
- **Debug Utilities**: Helper methods for conditional debug operations
- **Prefixed Messages**: Customizable prefix for all log messages
- **Environment Detection**: Automatically adapts output format for browser or Node.js environments
- **Extensible**: Easy to extend with custom functionality

## Installation

```bash
npm install @ecopages/logger
# or
yarn add @ecopages/logger
# or
bun add @ecopages/logger
```

## Basic Usage

```ts
import { Logger } from "@ecopages/logger";

// Create a basic logger
const logger = new Logger("[my-app]");

// Log messages at different levels
logger.info("This is an informational message");
logger.warn("This is a warning message");
logger.error("This is an error message");
logger.debug("This is a debug message"); // Only shown if debug is enabled
```

## Advanced Configuration

The logger supports various configuration options:

```ts
const logger = new Logger("[my-app]", {
	debug: true, // Enable debug messages
	color: true, // Enable colored output
	timestamp: true, // Add timestamps to messages
	timestampFormat: "full", // Configure timestamp format
	verboseTimer: true, // Show timer start messages
	colors: {
		// Custom colors
		INFO: "color: purple",
		ERROR: "color: darkred",
	},
});
```

### Configuration Options

| Option            | Type                        | Default | Description                  |
| ----------------- | --------------------------- | ------- | ---------------------------- |
| `debug`           | boolean                     | `false` | Enable debug level messages  |
| `color`           | boolean                     | `true`  | Enable colored output        |
| `timestamp`       | boolean                     | `false` | Add timestamps to messages   |
| `timestampFormat` | "full" \| "time" \| "short" | "time"  | Timestamp format             |
| `verboseTimer`    | boolean                     | `false` | Show timer start messages    |
| `colors`          | Partial<ColorConfig>        | -       | Custom colors for log levels |

### Timestamp Formats

- `full`: date + time (en-US locale formatting)
- `time`: time only
- `short`: short date + time (en-US locale formatting)

## Error Stack Traces

To keep stack traces, pass the actual `Error` object to `logger.error`:

```ts
try {
	throw new Error("Something failed");
} catch (error: unknown) {
	if (error instanceof Error) {
		logger.error(error); // preserves stack output
	} else {
		logger.error(new Error(String(error)));
	}
}
```

If you pass `error.message` (string) instead, the stack trace is not available.

## Timer Functionality

Timer behavior is consistent whether colors are enabled or disabled:

- `color: true` → colorized timer output
- `color: false` → plain timer output
- `verboseTimer: true` → logs `start` message before duration output

```ts
// Start a timer
logger.time("operation");

// ... some operations ...

// End the timer and log duration
logger.timeEnd("operation");
```

## Debug Utilities

The logger provides several debug-specific methods:

```ts
// Check if debug mode is enabled
if (logger.isDebugEnabled()) {
	// Perform debug-only operations
}

// Start a timer only when debug is enabled
logger.debugTime("debug-operation");

// ... some operations ...

// End the debug timer (only logs when debug is enabled)
logger.debugTimeEnd("debug-operation");
```

## Custom Colors

Colors can be customized differently for browser and Node.js environments:

```ts
// Browser colors (CSS syntax)
const logger = new Logger("[my-app]", {
	colors: {
		INFO: "color: purple",
		ERROR: "color: darkred",
		WARN: "color: orange",
		DEBUG: "color: cyan",
		TIMER: "color: magenta",
	},
});

// Node.js colors (ANSI codes)
const logger = new Logger("[my-app]", {
	colors: {
		INFO: "\x1b[35m", // Purple
		ERROR: "\x1b[31m", // Red
		WARN: "\x1b[33m", // Yellow
		DEBUG: "\x1b[36m", // Cyan
		TIMER: "\x1b[35m", // Magenta
	},
});
```

## Examples

### With Timestamps and Colors

```ts
const logger = new Logger("[my-app]", {
	timestamp: true,
	timestampFormat: "full",
});

logger.info("Application started");
// Output: [2024-02-16 15:30:45] [my-app] Application started
```

### With Debug Messages

```ts
const logger = new Logger("[my-app]", { debug: true });

logger.debug("Configuration loaded:", { port: 3000 });
// Output: [my-app] Configuration loaded: { port: 3000 }
```

### With Timer

```ts
const logger = new Logger("[my-app]", { verboseTimer: true });

logger.time("db-query");
// ... database operation ...
logger.timeEnd("db-query");
// Output: [my-app] db-query: 123.45ms
```

### With Conditional Debug Timers

```ts
const logger = new Logger("[my-app]", { debug: true });

// Only starts timer if debug is enabled
logger.debugTime("expensive-calculation");

// Some expensive operation
const result = performExpensiveCalculation();

// Only logs time if debug is enabled
logger.debugTimeEnd("expensive-calculation");
```
