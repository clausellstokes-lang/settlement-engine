// node --import ./tap-register.mjs measure.mjs <repo> : installs tap-hooks.mjs (read-only instrumentation, in memory).
import { register } from 'node:module';
register('./tap-hooks.mjs', import.meta.url);
