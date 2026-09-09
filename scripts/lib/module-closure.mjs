/**
 * module-closure.mjs — THE TRANSITIVE IMPORT CLOSURE OF A MODULE, IN FILES AND BYTES.
 *
 * WHY IT EXISTS AS A LIB. ARCH-COMPOSED-PROSE-v2 §5.3 makes the weight a desk pulls a MEASURED
 * question with a REFUSAL above a named precedent (293,079 B — what `viewModelPrimitives.js`
 * would have cost `defenseScoreBands.js`, refused, and the reason that module exists at all),
 * and `defenseStateProse.js:1690` refuses a second import at 546,887 B by the same method. Both
 * of those figures were measured by hand. A figure measured by hand is a figure that goes stale
 * the first time somebody adds an import, so the method is written down once, here, and the
 * walker re-measures it on every run instead of quoting it.
 *
 * ⛔ THE METHOD, STATED, because a closure figure means nothing without it: walk the RELATIVE
 * import and re-export specifiers of the entry file transitively, resolving a bare specifier to
 * `<path>.js` where the extensionless path does not exist, and sum `statSync().size` over the
 * files reached. Bare package specifiers are NOT followed — they are the bundler's problem and
 * not the estate's — and a dynamic `import('...')` with a literal relative specifier IS
 * followed, because a lazy import still lands in some chunk.
 *
 * PURE except for the file reads it is asked for.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/** Relative specifiers in `import`/`export … from '…'` and in a literal dynamic import. */
const STATIC_RE = /(?:^|\n)\s*(?:import|export)[^;\n]*?from\s+['"]([^'"]+)['"]/g;
const DYNAMIC_RE = /import\(\s*['"]([^'"]+)['"]\s*\)/g;

/**
 * @param {string} entry an absolute path
 * @param {ReadonlyArray<string>} [except] absolute paths whose EDGE is not followed — the
 *   file is neither counted nor walked. It exists so `closureCost` can ask "what would this
 *   host's closure be WITHOUT this import?", which is the only form of the question that has
 *   an answer once the import has already been made.
 * @returns {Set<string>} every file reachable from it, including itself
 */
export function moduleClosure(entry, except = []) {
  const blocked = new Set(except.map((f) => resolve(f)));
  /** @type {Set<string>} */
  const seen = new Set();
  const stack = [resolve(entry)];
  while (stack.length > 0) {
    const file = stack.pop();
    if (!file || seen.has(file) || blocked.has(file) || !existsSync(file)) continue;
    seen.add(file);
    const src = readFileSync(file, 'utf8');
    for (const re of [STATIC_RE, DYNAMIC_RE]) {
      for (const m of src.matchAll(re)) {
        if (!m[1].startsWith('.')) continue;
        const at = resolve(dirname(file), m[1]);
        stack.push(existsSync(at) ? at : `${at}.js`);
      }
    }
  }
  return seen;
}

/**
 * What one import ADDS to a host's closure: the files the imported module reaches that the
 * host does not already, and their bytes.
 * @param {string} host an absolute path
 * @param {string} imported an absolute path
 * @returns {{files: string[], bytes: number, hostFiles: number, hostBytes: number,
 *   withFiles: number, withBytes: number}} `hostFiles`/`hostBytes` are the host WITHOUT the
 *   edge; `withFiles`/`withBytes` are with it
 */
export function closureCost(host, imported) {
  // ⛔ THE HOST'S CLOSURE IS TAKEN WITHOUT THE EDGE UNDER TEST, and that is the whole
  // subtlety. Once the import HAS been made, the imported module is already inside the host's
  // closure and the naive difference answers ZERO on every run — an instrument reporting that
  // the import it was written to price costs nothing. Blocking the edge asks the question the
  // precedent is about: what would this host carry if it did not read that module?
  const hostClosure = moduleClosure(host, [imported]);
  const added = [...moduleClosure(imported)].filter((f) => !hostClosure.has(f)).sort();
  return {
    files: added,
    bytes: added.reduce((n, f) => n + statSync(f).size, 0),
    hostFiles: hostClosure.size,
    hostBytes: [...hostClosure].reduce((n, f) => n + statSync(f).size, 0),
    withFiles: hostClosure.size + added.length,
    withBytes: [...hostClosure].reduce((n, f) => n + statSync(f).size, 0)
      + added.reduce((n, f) => n + statSync(f).size, 0),
  };
}
