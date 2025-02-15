# @ecopages/logger

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
