---
"@ecopages/logger": patch
---

Added the following methods to the logger:

- `isDebugEnabled()`: Returns boolean indicating if debug mode is active
- `debugTime(label)`: Start a timer with given label if debug mode is active
- `debugTimeEnd(label)`: End timer with given label and log elapsed time if debug mode is active
