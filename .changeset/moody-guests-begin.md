---
"@ecopages/logger": minor
---

Enhanced Cross-Environment Logger Implementation:

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
