// The joint reading of the two dark birth laws (fortune, seat). A measure only.
//   node joint-measure.mjs <tree> <arm: off|fortune|seat|both> <perSize> <out.jsonl> [--full <full.jsonl>]
// Recipe = the chair's census.mjs / FORTUNE's measure.mjs: `{ ...DEFAULT_CONFIG, settType }`, seeds `hxd-<size>-<i>`,
// `birthConfig` then `generateSettlementPipeline`. The laws are forced on the lanes' own way: the key set on the config
// AFTER `birthConfig` (which clamps an incoming marker): `_fortuneLawVersion: 2` (FORTUNE-2 hand-back section 4,
// "measure.mjs must set _fortuneLawVersion: 2 AFTER birthConfig") and `_seatLawVersion: 2` (SEAT's u4/measure-u4.mjs
// `--force-law`, which spreads the keys over `birthConfig(...)`'s result before birth).
// Readings: calm = !t.stress (FORTUNE's measure.mjs); standing = powerStructure.publicLegitimacy {label, score};
// contest = rulingPowerCoup.js :: coupContenders (read as born, as measure-u4's FORCED arm does) and coupRiskLabel;
// protected = coupContenders(t).incumbent.gated; holder = seat/holderOfSeat.js :: holderOf(t, {audience:'owner'});
// transfer at birth = powerStructure.previousGovernments non-empty, or holderOfSeat.js :: transferTakerOf non-null.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , treeArg, arm, nArg = '100', outArg, fullFlag, fullOut] = process.argv;
const L = resolve(treeArg);
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { coupContenders, coupRiskLabel } = await import(`${L}/src/domain/rulingPowerCoup.js`);
const { governingFactionOf, nameOf } = await import(`${L}/src/domain/rulingPower.js`);
const { holderOf, transferTakerOf } = await import(`${L}/src/domain/seat/holderOfSeat.js`);
const { contestKindOf } = await import(`${L}/src/domain/seat/seatTable.js`);
const FORCE = { off: {}, fortune: { _fortuneLawVersion: 2 }, seat: { _seatLawVersion: 2 }, both: { _fortuneLawVersion: 2, _seatLawVersion: 2 } }[arm];
if (!FORCE) throw new Error(`unknown arm ${arm}`);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
await loadGenerationLawPayloads();
const lines = []; const full = [];
for (const size of SIZES) for (let i = 0; i < +nArg; i++) {
  const seed = `hxd-${size}-${i}`;
  let t;
  try {
    t = generateSettlementPipeline({ ...birthConfig({ ...DEFAULT_CONFIG, settType: size }), ...FORCE }, null, { seed, customContent: {} });
  } catch (e) {
    lines.push(JSON.stringify({ seed, size, arm, error: String(e?.stack || e).split('\n').slice(0, 4).join(' | ') }));
    continue;
  }
  if (fullFlag === '--full') full.push(JSON.stringify({ seed, t }));
  const ps = t.powerStructure || {}; const pl = ps.publicLegitimacy || {};
  const rec = { seed, size, arm, calm: !t.stress, stress: (Array.isArray(t.stress) ? t.stress : t.stress ? [t.stress] : []).map((x) => x?.type ?? String(x)) };
  rec.cfg = { fortune: t.config?._fortuneLawVersion ?? null, seat: t.config?._seatLawVersion ?? null };
  rec.band = pl.label ?? null; rec.score = pl.score ?? null; rec.govMult = pl.govMultiplier ?? null;
  const gov = governingFactionOf(t);
  rec.government = ps.government ?? null; rec.govName = gov ? nameOf(gov) : null;
  try { rec.govCategory = gov?.category ?? null; rec.govKind = gov ? contestKindOf(gov) : null; } catch (e) { rec.govKindErr = String(e); }
  try {
    const c = coupContenders(t);
    rec.challengers = c.challengers.map((x) => `${x.name} [${x.archetype}] ${x.weight}`);
    rec.nChallengers = c.challengers.length;
    rec.protected = !!c.incumbent.gated;
    rec.incWeight = c.incumbent.amplifiedWeight;
    rec.risk = coupRiskLabel(c);
  } catch (e) { rec.contestErr = String(e?.stack || e).split('\n').slice(0, 3).join(' | '); }
  try { const h = holderOf(t, { audience: 'owner' }); rec.holderRule = h.rule; rec.holder = h.holderName ?? null; } catch (e) { rec.holderErr = String(e); }
  rec.capture = ps.criminalCaptureState ?? null;
  rec.previousGovernments = Array.isArray(ps.previousGovernments) ? ps.previousGovernments.length : 0;
  try { rec.transferTaker = rec.govName ? transferTakerOf(t, rec.govName) : null; } catch (e) { rec.transferErr = String(e); }
  rec.transfer = rec.previousGovernments > 0 || !!rec.transferTaker;
  rec.recentConflict = ps.recentConflict ?? null;
  rec.stability = String(ps.stability ?? '');
  rec.tensions = (t.history?.currentTensions || []).map((x) => x?.type ?? null);
  rec.tensionText = (t.history?.currentTensions || []).map((x) => `${x?.type}: ${String(x?.description ?? x?.summary ?? '').slice(0, 140)}`);
  lines.push(JSON.stringify(rec));
}
writeFileSync(outArg, lines.join('\n') + '\n');
if (fullFlag === '--full') writeFileSync(fullOut, full.join('\n') + '\n');
console.log(`${arm}: ${lines.length} places -> ${outArg}`);
