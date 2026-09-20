/**
 * shim-prng.mjs — the EXACT shape the vitest census test's `vi.mock` factory returns.
 *
 * In vitest this is written as:
 *
 *   vi.mock('../../src/kernel/prng.js', async (importOriginal) => {
 *     const actual = await importOriginal();
 *     return { ...actual, createPRNG: (seed) => mint(actual, seed, 'direct') };
 *   });
 *
 * Here the same replacement is installed by a `resolve` hook so a plain `node` run can prove
 * the logic. The re-export list below is enumerated because ESM cannot spread a namespace;
 * `p1-controls.mjs` asserts the shim's export names EQUAL the original's, so nothing is lost.
 *
 * ⛔ THE FORK RE-IMPLEMENTATION IS THE LOAD-BEARING PART.
 * `src/kernel/prng.js:84` reads `fork: (label) => createPRNG(\`${seed}::${label}\`)` — an
 * INTRA-MODULE call. Under vi.mock that call keeps the original binding, so a fork-minted
 * stream is invisible to the census. The wrapper therefore re-implements `fork` as
 * `mint(\`${seed}::${label}\`, 'fork')`, which is the SAME derivation, byte for byte, and so
 * the same stream — but counted. The census test pins that source line so the equivalence
 * cannot rot (the pin already exists at tests/generators/pipelinePinnedMode.test.js A7).
 *
 * EMP2_REIMPL_FORK=0 disables the re-implementation — the NEGATIVE CONTROL that shows what a
 * naive vi.mock wrapper would have measured.
 */
import { pathToFileURL } from 'node:url';

const TREE = process.env.EMP2_TREE;
const REIMPL_FORK = process.env.EMP2_REIMPL_FORK !== '0';

/** vi.mock's `importOriginal()`. */
const actual = await import(`${pathToFileURL(`${TREE}/src/kernel/prng.js`).href}?__actual=1`);

/**
 * Wrap one minted stream, recording it in the census and tagging HOW it was minted.
 * @param {string} seed
 * @param {'direct'|'fork'} via — 'direct' = an importer called `createPRNG(seed)`;
 *   'fork' = the stream descends from another stream's `fork(label)`.
 */
function mint(seed, via) {
  const inner = actual.createPRNG(seed);
  const census = globalThis.__EMP2_MINTS__;
  const rec = { seed: String(seed), via, calls: 0, methods: {}, forkLabels: [] };
  if (census) census.push(rec);
  const out = {};
  for (const key of Object.keys(inner)) {
    const value = inner[key];
    if (typeof value !== 'function') { out[key] = value; continue; }
    if (key === 'fork') {
      out[key] = REIMPL_FORK
        ? (label) => { rec.forkLabels.push(String(label)); return mint(`${seed}::${label}`, 'fork'); }
        : (label) => { rec.forkLabels.push(String(label)); return inner.fork(label); };
      continue;
    }
    out[key] = (...args) => {
      rec.calls += 1;
      rec.methods[key] = (rec.methods[key] || 0) + 1;
      return value(...args);
    };
  }
  return out;
}

export const createPRNG = (seed) => mint(seed, 'direct');
export const {
  epochSuffix, generateSeed, SEED_ENTROPY_LEN, SEED_SEQUENCE_LEN, SEED_SUFFIX_LEN,
} = actual;
export const __ACTUAL_KEYS__ = Object.keys(actual).sort();
