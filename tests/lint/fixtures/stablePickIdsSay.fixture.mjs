/**
 * A FIXTURE of the id guard's self-test (RULING 121-6; `tests/lint/stablePickIds.walker.test.js`): one `say` frame that
 * names an IMPORTED binding and whose block body relies on no semicolon, the two things the test loader rewrites in a
 * function's source. Read by the door's print mode under plain node; never a pool of the program.
 */
import { basename } from 'node:path';

export const FRAMES = Object.freeze([
  Object.freeze({ id: 'named', say: (/** @type {string} */ s) => {
    const base = basename(s)
    return `${base} is named`
  } }),
]);
