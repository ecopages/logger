# @ecopages/logger

## 0.2.3

### Patch Changes

- [#11](https://github.com/ecopages/logger/pull/11) [`d10b342`](https://github.com/ecopages/logger/commit/d10b342ac3e9dc3f25f41ec48c8950e2879f6ed6) Thanks [@andeeplus](https://github.com/andeeplus)! - Improve logging behavior and timer consistency:

  - Route `warn` and `error` logs to `console.warn` and `console.error` respectively
  - Preserve stack traces when passing `Error` objects to `logger.error(...)`
  - Unify timer behavior across color modes (`color: true/false`)
  - Add `locale` option for configurable timestamp locale formatting
  - Clarify README and JSDoc around timer output and error stack handling

## 0.2.3

### Patch Changes

- Improve logging behavior and timer consistency:
  - Route `warn` and `error` logs to `console.warn` and `console.error`
  - Preserve stack traces when passing `Error` objects to `logger.error(...)`
  - Unify timer behavior across `color: true` and `color: false`
  - Add `locale` option for configurable timestamp locale formatting
  - Clarify README and JSDoc around timer output and error stack handling

## 0.2.2

### Patch Changes

- [#9](https://github.com/ecopages/logger/pull/9) [`0aeb304`](https://github.com/ecopages/logger/commit/0aeb304c66ed7dad82368e7db6140203f48a613c) Thanks [@andeeplus](https://github.com/andeeplus)! - Added the following methods to the logger:

  - `isDebugEnabled()`: Returns boolean indicating if debug mode is active
  - `debugTime(label)`: Start a timer with given label if debug mode is active
  - `debugTimeEnd(label)`: End timer with given label and log elapsed time if debug mode is active

## 0.2.1

### Patch Changes

- [#6](https://github.com/ecopages/logger/pull/6) [`7fbec23`](https://github.com/ecopages/logger/commit/7fbec23db37dbe74dc78ea91fbbd31e50fc64a7a) Thanks [@andeeplus](https://github.com/andeeplus)! - Enhanced Timer Functionality:
  - Added custom timer implementation using `performance.now()`
  - Added new `verboseTimer` option to control start message visibility
  - Added prefix to timer messages for better context
  - Added support for concurrent timers with accurate duration tracking
  - Improved timer format consistency with other log messages
  - Added colored output for timer messages matching logger's color scheme

## 0.2.0

### Minor Changes

- [#3](https://github.com/ecopages/logger/pull/3) [`2912a0c`](https://github.com/ecopages/logger/commit/2912a0cf7db00ad66b641fbac270afeb7fb926bf) Thanks [@andeeplus](https://github.com/andeeplus)! - Enhanced Cross-Environment Logger Implementation:

  - Added intelligent type-based formatting for browser console

    - Objects: %o
    - Numbers: %d
    - Booleans, strings, null, undefined: %s

  - Improved color system:

    - Added ColorConfig interface for type safety
    - Implemented default colors for both browser and Node.js
    - Added support for custom color overrides
    - Better color management through getColor helper

  - Enhanced timestamp support:

    - Added multiple timestamp formats (full, time, short)
    - Configurable through timestampFormat option
    - Consistent formatting across environments

  - Timer improvements:

    - Added custom color support for timers
    - Consistent styling between environments
    - Added proper reset codes for Node.js environment

  - Environment detection:

    - Automatic detection of browser vs Node.js
    - Environment-specific formatting
    - Consistent output across platforms

  - Debug mode enhancements:

    - Added both constructor and environment variable control
    - Better debug message handling

  - Testing improvements:
    - Added comprehensive test suite
    - Coverage for mixed argument types
    - Environment-specific test cases
    - Timer functionality tests
    - Custom color tests

## 0.1.3

### Patch Changes

- [`95c9265`](https://github.com/ecopages/logger/commit/95c9265590c2a977fd87c8a355037d974867aa59) - Updated documentation

- [`f712604`](https://github.com/ecopages/logger/commit/f712604cefed881dd0d7e1f20dddaa7620bb60de) - Included options in the logger instantiation. The currently available option is debug: boolean.

## 0.1.2

### Patch Changes

- Updated env variable to enable debug logging

## 0.1.0

### Minor Changes

- Published package version
