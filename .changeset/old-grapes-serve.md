---
"@ecopages/logger": patch
---

Enhanced Timer Functionality:
- Added custom timer implementation using `performance.now()`
- Added new `verboseTimer` option to control start message visibility
- Added prefix to timer messages for better context
- Added support for concurrent timers with accurate duration tracking
- Improved timer format consistency with other log messages
- Added colored output for timer messages matching logger's color scheme
