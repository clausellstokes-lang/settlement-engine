// late-siege.mjs: over random-stress births, a house whose stored description is the ORIGINAL of a draw-time sibling set that
// holds a siege twin, in a town whose record is under siege (and the reverse: a siege twin stored in a town with no siege).
import { makeCfgFor } from '/home/user/chair/docs/chair/2026-11-16/probes/PAGE-COPY/seedcfg.mjs';
const R = process.env.TREE + '/src';
const { generateSettlementPipeline } = await import(R + '/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + '/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R + '/store/configSlice.js');
const { DESC_VARIANT_SIBLINGS, DESC_LATE_SIBLINGS } = await import(R + '/data/institutionDescVariants.js');
const { factsOf } = await import(R + '/domain/facts/factsOf.js');
await loadGenerationLawPayloads();
const cfgFor = makeCfgFor(birthConfig, DEFAULT_CONFIG);
const siegeTwinOf = new Map(); const siegeTwinTexts = new Map();
for (const [key, set] of Object.entries(DESC_VARIANT_SIBLINGS)) {
  const tw = set.find((l) => l && typeof l.twinOf === 'string' && (l.crisis || []).includes('under_siege'));
  if (tw) { siegeTwinOf.set(key, tw.text); siegeTwinTexts.set(tw.text, key); }
}
const lateKeys = new Set(Object.keys(DESC_LATE_SIBLINGS));
console.log('draw-time sibling sets with a siege twin:', siegeTwinOf.size, '· of them also late keys:', [...siegeTwinOf.keys()].filter((k) => lateKeys.has(k)).length);
const sizes = (process.env.SIZES || 'town,city,metropolis,village').split(','); const from = Number(process.env.FROM || 2000); const n = Number(process.env.N || 150);
const strip = (t) => String(t || '').replace(/\b(the )?(thorp|hamlet|village|town|city|metropolis)\b/g, '$1TIER');
const keyBySpoken = new Map([...siegeTwinOf.keys()].map((k) => [strip(k), k])); const twinBySpoken = new Map([...siegeTwinTexts.keys()].map((k) => [strip(k), k]));
let births = 0, sieged = 0, townsWithStale = 0, staleHouses = 0, twinNoSiege = 0, twinsUnderSiege = 0; const ex = []; const ex2 = [];
for (const size of sizes) for (let i = from; i < from + n; i += 1) {
  const seed = `r2r-${size}-${i}`; let s; try { s = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }); } catch (e) { console.error(seed, e.message); continue; }
  births += 1;
  const types = (factsOf(s).crisis?.kinds ?? []);
  const siege = types.includes('under_siege');
  if (seed === 'r2r-town-2069') console.log(seed, 'stress types:', JSON.stringify(types), '· crisis fact:', JSON.stringify(factsOf(s).crisis?.kinds ?? null));
  if (siege) sieged += 1;
  let stale = 0;
  for (const inst of s.institutions || []) {
    const d = strip(inst.desc);
    if (siege && keyBySpoken.has(d)) { stale += 1; if (ex.length < 8) ex.push(`${seed} · ${inst.name}: ${String(inst.desc).slice(0, 90)}`); }
    if (siege && twinBySpoken.has(d)) twinsUnderSiege += 1;
    if (!siege && twinBySpoken.has(d)) { twinNoSiege += 1; if (ex2.length < 6) ex2.push(`${seed} · ${inst.name}: ${String(inst.desc).slice(0, 90)} · stress ${JSON.stringify(types)}`); }
  }
  if (stale) { townsWithStale += 1; staleHouses += stale; }
}
console.log(`births ${births} · under siege ${sieged} · besieged towns holding a non-siege original whose set has a siege twin: ${townsWithStale} (${staleHouses} houses) · siege twins standing under a siege: ${twinsUnderSiege} · siege twins standing with NO siege: ${twinNoSiege}`);
for (const e of ex) console.log('  STALE ', e);
for (const e of ex2) console.log('  TWIN-NO-SIEGE ', e);
