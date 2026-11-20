// FORTUNE-1 instrument: born towns of a tree (a checkout or a `tree.mjs` copy) as one JSON line each.
//   node measure.mjs <tree> <out.jsonl> [perSize=100] [prefix=hxd]
// The chair's recipe (batch2.mjs): untouched settings `{ ...DEFAULT_CONFIG, settType }`, seeds `<prefix>-<size>-<i>`,
// `birthConfig` then `generateSettlementPipeline`. A trace tree also records the fortune sum's terms.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , treeArg, outArg, nArg = '100', prefix = 'hxd', extra = ''] = process.argv;
const L = resolve(treeArg);
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { coupContenders } = await import(`${L}/src/domain/rulingPowerCoup.js`);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const extraCfg = extra ? JSON.parse(extra) : {};
await loadGenerationLawPayloads();
const lines = [];
const typesOf = (s) => (!s ? [] : (Array.isArray(s) ? s : [s]).map((x) => x?.type ?? x?.id ?? String(x)));
for (const size of SIZES) for (let i = 0; i < +nArg; i++) {
  const seed = `${prefix}-${size}-${i}`;
  globalThis.__FT = [];
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size, ...extraCfg }), null, { seed, customContent: {} });
  const ft = globalThis.__FT; globalThis.__FT = undefined;
  const ps = t.powerStructure || {}; const pl = ps.publicLegitimacy || {};
  let gated = null; try { gated = coupContenders(t).incumbent.gated; } catch { gated = 'err'; }
  lines.push(JSON.stringify({
    seed, size, tier: t.tier, name: t.name, population: t.population,
    stress: typesOf(t.stress), calm: !t.stress,
    route: t.economicState?.tradeAccess, threat: t.config?.monsterThreat ?? t._config?.monsterThreat,
    prosperity: t.economicState?.prosperity, prosperityStanding: t.economicState?.prosperityStanding,
    food: t.economicState?.foodSecurity?.label, safety: t.economicState?.safetyProfile?.safetyLabel,
    legit: { score: pl.score, label: pl.label, breakdown: pl.breakdown, gov: pl.govMultiplier, crim: pl.crimMultiplier },
    defense: { label: t.defenseProfile?.readiness?.label, score: t.defenseProfile?.readiness?.score },
    stability: String(ps.stability ?? ''), government: ps.government, capture: ps.criminalCaptureState ?? null, gated,
    situation: t.economicState?.situationDesc,
    econOut: t.economicState?.compound?.economyOutput ?? null, crime: t.economicState?.compound?.criminalEffective ?? null,
    dials: { economy: t.config?.priorityEconomy ?? t._config?.priorityEconomy, military: t.config?.priorityMilitary ?? t._config?.priorityMilitary, magic: t.config?.priorityMagic ?? t._config?.priorityMagic, criminal: t.config?.priorityCriminal ?? t._config?.priorityCriminal },
    printed: ft.filter((x) => !x.standing).at(-1) ?? null, standingTrace: ft.filter((x) => x.standing).at(-1) ?? null, traceCount: ft.length,
  }));
}
writeFileSync(outArg, lines.join('\n') + '\n');
console.log(`${lines.length} towns -> ${outArg}`);
