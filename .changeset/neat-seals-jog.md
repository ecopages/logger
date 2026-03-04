---
"@ecopages/logger": patch
---

Improve logging behavior and timer consistency:

- Route `warn` and `error` logs to `console.warn` and `console.error` respectively
- Preserve stack traces when passing `Error` objects to `logger.error(...)`
- Unify timer behavior across color modes (`color: true/false`)
- Clarify README and JSDoc around timer output and error stack handling
