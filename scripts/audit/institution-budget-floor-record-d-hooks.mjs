/**
 * The load hook behind scripts/audit/institution-budget-floor-record-d.mjs (a MEASUREMENT device,
 * RUNG1B-F6 unit 4): it wraps `densityFactor` in the loaded copy of src/data/institutionBudget.js so
 * every call's (tier, population, X, d) is pushed onto `globalThis.__F6_DENSITY_CALLS` when that array
 * exists. The source on disk is never touched; without the array the hook changes nothing. It fails
 * loudly when the function is no longer where it expects.
 */
const NEEDLE = /export function densityFactor\(tier, population(, exempt = 0)?\) \{/;

export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (!url.endsWith('/src/data/institutionBudget.js')) return result;
  const source = String(result.source);
  const match = source.match(NEEDLE);
  if (!match) throw new Error('institution-budget-floor-record-d: densityFactor signature not found');
  const params = match[1] ? 'tier, population, exempt = 0' : 'tier, population';
  const args = match[1] ? 'tier, population, exempt' : 'tier, population';
  const renamed = source.replace(NEEDLE, `function densityFactorInner(${params}) {`);
  const wrapper = `\nexport function densityFactor(${params}) {\n  const d = densityFactorInner(${args});\n  if (Array.isArray(globalThis.__F6_DENSITY_CALLS)) globalThis.__F6_DENSITY_CALLS.push([tier, population, ${match[1] ? 'exempt' : '0'}, d]);\n  return d;\n}\n`;
  return { ...result, source: renamed + wrapper, shortCircuit: true };
}
