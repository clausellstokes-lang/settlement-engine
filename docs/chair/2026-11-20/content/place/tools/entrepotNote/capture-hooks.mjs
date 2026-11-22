// PLACE-1 · entrepotNote MEASURE (2026-11-20): a measuring instrument, NOT a change to src/.
// Adapted from ../situationDesc/capture-hooks.mjs. A Node module-load hook that wraps
// `computeActiveChains.js :: computeActiveChains` IN MEMORY so measure.mjs can copy what is in scope at the
// note's writer (the route and tier it was handed, and each noted chain's outputs as it returned them).
// The file on disk is untouched. measure.mjs proves the wrap moves nothing (plain vs capture, every note).
export async function load(url, context, nextLoad) {
  const r = await nextLoad(url, context);
  if (!url.endsWith('/src/generators/computeActiveChains.js')) return r;
  const before = String(r.source);
  const marker = 'export function computeActiveChains(';
  if (before.split(marker).length !== 2) throw new Error('capture-hooks: the writer\'s export line is not where it was');
  const source = before.replace(marker, 'function __computeActiveChains(')
    + '\nexport function computeActiveChains(...a) { const r = __computeActiveChains(...a); globalThis.__chainCapture?.(r, a); return r; }\n';
  return { ...r, source, shortCircuit: true };
}
