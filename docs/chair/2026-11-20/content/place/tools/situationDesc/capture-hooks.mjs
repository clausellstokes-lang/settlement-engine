// PLACE-1 · situationDesc MEASURE (2026-11-20): a measuring instrument, NOT a change to src/.
// A Node module-load hook that wraps `economicState.js :: generateEconomicState` IN MEMORY so the
// measuring script can copy the trade lists exactly as they stand in scope at the trade line's writer
// (the object the generator returns, copied at the moment it returns). The file on disk is untouched.
// measure.mjs proves the wrap moves nothing: it compares every birth's stored line and lists between a
// plain run and a captured run (the "instrument moves nothing" count in its output).
export async function load(url, context, nextLoad) {
  const r = await nextLoad(url, context);
  if (!url.endsWith('/src/generators/economy/economicState.js')) return r;
  const before = String(r.source);
  const marker = 'export const generateEconomicState = (';
  if (before.split(marker).length !== 2) throw new Error('capture-hooks: the generator\'s export line is not where it was');
  const source = before.replace(marker, 'const __genEconomicState = (')
    + '\nexport const generateEconomicState = (...a) => { const r = __genEconomicState(...a); globalThis.__econCapture?.(r, a); return r; };\n';
  return { ...r, source, shortCircuit: true };
}
