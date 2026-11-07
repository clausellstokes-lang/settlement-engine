/**
 * The load hook behind scripts/audit/institution-budget-force-d.mjs (a measurement device;
 * see that file). It fails loudly when the function it rewrites is no longer where it expects,
 * so a refactor can never turn a forced calibration into a silent unforced one.
 */
const NEEDLE = 'export function densityFactor(tier, population, exempt = 0) {';

export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (!url.endsWith('/src/data/institutionBudget.js')) return result;
  const source = String(result.source);
  if (!source.includes(NEEDLE)) throw new Error('institution-budget-force-d: densityFactor signature not found');
  return {
    ...result,
    source: source.replace(NEEDLE, `${NEEDLE}\n  if (process.env.X46_FORCE_D) return Number(process.env.X46_FORCE_D);`),
    shortCircuit: true,
  };
}
