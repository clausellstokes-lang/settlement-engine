/**
 * vimock-loader.mjs — a Node ESM `resolve` hook that reproduces **vitest's `vi.mock` semantics
 * EXACTLY**, so the in-vitest instrument's logic can be proven without running vitest.
 *
 * ⛔ THE DIFFERENCE THIS EXISTS TO MEASURE. The RECON lane's `prng-loader.mjs` used a `load`
 * hook that APPENDED a reassignment of the module-scope `createPRNG` binding. That patches the
 * module's own INTERNAL binding, so `prng.js:84` — `fork: (label) => createPRNG(...)` — is
 * itself instrumented. `vi.mock` cannot do that: it replaces the module's EXPORTS for
 * IMPORTERS and leaves every intra-module call on the original binding. The estate has the
 * lesson written down already, at tests/property/advanceEpochDormancyFence.test.js:77-82
 * ("wrapping a function in its OWN module's namespace counts ZERO when the caller invokes it
 * intra-module").
 *
 * This hook therefore REDIRECTS importers to a shim module (exactly what vi.mock does) and
 * leaves the real module's internals untouched. The shim reaches the real module through a
 * `?__actual=1` query, which is this prototype's stand-in for vi.mock's `importOriginal()`.
 *
 * ⛔ THE TREE ON DISK IS NEVER TOUCHED. No file under read-tip-a41a0e109 is written.
 */
import { pathToFileURL } from 'node:url';

const TREE = process.env.EMP2_TREE;
const PROTO = process.env.EMP2_PROTO;
if (!TREE || !PROTO) throw new Error('EMP2_TREE and EMP2_PROTO must be set');

const MAP = new Map([
  [`${TREE}/src/kernel/prng.js`, `${PROTO}/shim-prng.mjs`],
  [`${TREE}/src/kernel/proseHash.js`, `${PROTO}/shim-proseHash.mjs`],
]);

export async function resolve(specifier, context, nextResolve) {
  const result = await nextResolve(specifier, context);
  if (!result.url.startsWith('file:')) return result;
  const url = new URL(result.url);
  // The shim's own reach for the original — vi.mock's `importOriginal()`.
  if (url.searchParams.has('__actual')) return result;
  const shim = MAP.get(decodeURIComponent(url.pathname));
  if (!shim) return result;
  return { ...result, url: pathToFileURL(shim).href, shortCircuit: true };
}
