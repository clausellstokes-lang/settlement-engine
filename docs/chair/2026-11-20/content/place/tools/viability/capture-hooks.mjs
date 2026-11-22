// PLACE-1 · viability MEASURE (2026-11-20): a measuring instrument, NOT a change to src/. Copied in shape from
// tools/situationDesc/capture-hooks.mjs. A Node module-load hook that wraps `economy/viability.js :: generateEconomicViability`
// IN MEMORY so the measuring script can copy what is in scope at the viability card's writer (the settlement handed in: its
// import list, its config's `_seed`, its terrain) at the moment it is called. The file on disk is untouched. measure.mjs
// proves the wrap moves nothing (the "INSTRUMENT" count in report.out.txt).
export async function load(url, context, nextLoad) {
  const r = await nextLoad(url, context);
  if (!url.endsWith('/src/generators/economy/viability.js')) return r;
  const before = String(r.source);
  const marker = 'export const generateEconomicViability = (';
  if (before.split(marker).length !== 2) throw new Error('capture-hooks: the writer\'s export line is not where it was');
  const source = before.replace(marker, 'const __genEconomicViability = (')
    + '\nexport const generateEconomicViability = (...a) => { globalThis.__viaCaptureIn?.(a); const r = __genEconomicViability(...a); globalThis.__viaCapture?.(r, a); return r; };\n';
  return { ...r, source, shortCircuit: true };
}
