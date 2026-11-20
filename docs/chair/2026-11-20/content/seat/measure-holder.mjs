#!/usr/bin/env node
/**
 * docs/chair/2026-11-20/content/seat/measure-holder.mjs — SEAT-1's proposal measure (the seventh chair, 2026-11-20).
 * Measures; changes nothing under src/. Reads every born town through `seat-draft.mjs` (the draft of CS2, CS4, CS5,
 * CS6 that the proposal's figures are executed against) and reports, per pool:
 *   (1) the holder leaf: the count of towns each rule answers, in the chair's order; every town where two rules
 *       answer differently; the seat-holder heading more than one power; the public audience's losses (a veiled holder);
 *   (2) the contender table per kind (the CS4 reader labels every column, so a craft guild counts as craft throughout):
 *       BEFORE (today's coupContenders, asserted equal to the shipped function town by town); CS3 alone (the holder
 *       leaves the challengers, the next heaviest takes its place); CS3+CS4 (the contest reads one kind); CS3+CS4+CS5
 *       (the proposed circumstance figures); the towns with no contender under each; the coup-risk ladder under each;
 *       and the incumbent's weight with the holder's own power counted on its side (measured only, not proposed);
 *   (3) the form x holder-kind pairs, read against the one table (CS6): own, civic, licensed, unlicensed;
 *   (4) the circumstances: per circumstance, the towns that hold it.
 *
 *   node docs/chair/2026-11-20/content/seat/measure-holder.mjs --arm default|presets [--n N]
 * Seeds and configs are measure-seat.mjs's own (birthConfig: today's births). Writes holder-<arm>.json / .md.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '../../../../..');
const imp = (p) => import(join(ROOT, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { coupContenders, coupRiskLabel, COUP_COERCION } = await imp('src/domain/rulingPowerCoup.js');
const { factionArchetype } = await imp('src/domain/factionArchetypes.js');
const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
const { ladderEffectivePowerFactor } = await imp('src/domain/townMap/ladderRead.js');
const { ARCHETYPES, archetypePatch } = await imp('src/components/generate/characterPresets.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const D = await import(join(HERE, 'seat-draft.mjs'));

const args = process.argv.slice(2);
const argOf = (flag, fallback) => { const i = args.indexOf(flag); return i >= 0 && args[i + 1] != null ? args[i + 1] : fallback; };
const ARM = argOf('--arm', 'default');
const N = Number(argOf('--n', ARM === 'presets' ? 10 : 150));
await loadGenerationLawPayloads();
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const PRESETS = ARCHETYPES.map((a) => a.key).filter((k) => k !== 'balanced');
const JOBS = ARM === 'presets'
  ? TIERS.flatMap((tier) => PRESETS.flatMap((preset) => Array.from({ length: N }, (_, i) => ({ tier, preset, seed: `seat-measure-${tier}-${preset}-${i}`, config: { settType: tier, ...archetypePatch(preset) } }))))
  : TIERS.flatMap((tier) => Array.from({ length: N }, (_, i) => ({ tier, preset: null, seed: `seat-measure-${tier}-${i}`, config: { settType: tier } })));
const KINDS = ['noble', 'craft', 'labor', 'outsider', 'merchant', 'military', 'religious', 'arcane', 'criminal', 'occupation', 'government', 'other'];
const r2 = (x) => Math.round(x * 100) / 100;
const num = (v) => (Number.isFinite(v) ? v : 0);
const bump = (m, k, by = 1) => { m[k] = (m[k] || 0) + by; };
const sorted = (m) => Object.fromEntries(Object.entries(m).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)));

/** coupContenders, re-spelled with three knobs: names to exclude, the kind reader, a factor per kind. */
function contest(s, { exclude = new Set(), kindOf = factionArchetype, factorOf = () => 1, incumbentExtra = 0 } = {}) {
  const ps = s.powerStructure || {};
  const gov = governingFactionOf(s);
  const govMultiplier = Number.isFinite(ps.publicLegitimacy?.govMultiplier) ? ps.publicLegitimacy.govMultiplier : 1;
  const challengers = (ps.factions || []).filter((f) => f && f !== gov && !exclude.has(nameOf(f))).map((f) => {
    const archetype = kindOf(f);
    const factor = ladderEffectivePowerFactor(s, f);
    const power = factor === 1 ? num(f.power) : r2(num(f.power) * factor);
    return { name: nameOf(f), archetype, power, weight: r2(power * (COUP_COERCION[archetype] ?? COUP_COERCION.other) * factorOf(archetype)) };
  }).filter((c) => c.archetype !== 'criminal' && c.power >= 5 && c.name)
    .sort((a, b) => (b.weight - a.weight) || (b.power - a.power) || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)).slice(0, 3);
  const incF = ladderEffectivePowerFactor(s, gov);
  const incPower = (incF === 1 ? num(gov?.power) : r2(num(gov?.power) * incF)) + incumbentExtra;
  const amplifiedWeight = r2(incPower * govMultiplier);
  const gated = challengers.length < 3 || amplifiedWeight >= challengers[challengers.length - 1].weight;
  return { challengers, incumbent: { amplifiedWeight, gated } };
}

const SCEN = ['before', 'cs3', 'cs3cs4', 'cs3cs4cs5'];
const tally = Object.fromEntries(SCEN.map((k) => [k, { present: {}, contends: {}, none: 0, risk: {}, field: {} }]));
const holderRules = {}; const holderRulesPublic = {}; const holderKind = {}; const disagreements = []; const multiHead = []; const pairs = {}; const pairClass = {};
const circ = {}; const circByTier = {}; let towns = 0; let errors = 0; let mismatch = 0; let publicLost = 0;
const lift = {};
const holderSide = { gatedBefore: 0, gatedWithHolder: 0, riskBefore: {}, riskWithHolder: {} };
const examples = [];
const t0 = Date.now();
for (const job of JOBS) {
  let s;
  try { s = generateSettlementPipeline(birthConfig(job.config), null, { seed: job.seed, customContent: {} }); } catch { errors += 1; continue; }
  towns += 1;
  const gov = governingFactionOf(s);
  const form = nameOf(gov);
  const h = D.holderOf(s);
  const hp = D.holderOf(s, { audience: 'public' });
  bump(holderRules, h.rule); bump(holderRulesPublic, hp.rule);
  if (h.holder && h.veiled) publicLost += 1;
  bump(holderKind, `${h.rule}:${h.kind}`);
  const ans = D.holderAnswers(s);
  const named = Object.entries(ans).filter(([, v]) => v);
  if (new Set(named.map(([, v]) => v)).size > 1) disagreements.push({ seed: job.seed, tier: job.tier, form, ...ans, chosen: h.rule });
  if (h.seatHolder) {
    const heads = (s.powerStructure.factions || []).filter((f) => f !== gov && (h.seatHolder.memberships || []).some((m) => m?.power === nameOf(f) && m.rank === 1));
    if (heads.length > 1) multiHead.push({ seed: job.seed, form, heads: heads.map(nameOf) });
  }
  // CS6: the pair (form x holder kind) against the one table
  const band = D.bandOf(job.tier);
  const hk = h.holder ? h.kind : null;
  if (hk) {
    const pl = D.pairLicense(hk, form, band);
    const fk = D.formKindOf(form);
    const cls = fk === hk ? 'own' : pl.ok ? (pl.license ? `licensed:${pl.license}` : 'civic') : 'UNLICENSED';
    bump(pairClass, cls);
    bump(pairs, `${form} x ${hk} (${cls})`);
  } else bump(pairClass, `office:${h.rule}`);
  // CS5: circumstances
  const held = D.circumstancesOf(s);
  for (const c of held) { bump(circ, c); bump((circByTier[c] ||= {}), job.tier); }
  if (!held.length) bump(circ, '(none)');

  const exclude = new Set(h.holder ? [nameOf(h.holder)] : []);
  const runs = {
    before: contest(s),
    cs3: contest(s, { exclude }),
    cs3cs4: contest(s, { exclude, kindOf: D.contestKindOf }),
    cs3cs4cs5: contest(s, { exclude, kindOf: D.contestKindOf, factorOf: (k) => D.circumstanceFactor(k, held) }),
  };
  // per circumstance held: does each lifted kind (standing, not the holder) contend without the factor and with it?
  for (const c of held) for (const [kind, fct] of Object.entries(D.CIRCUMSTANCE_FACTORS[c] || {})) {
    if (fct === 1) continue;
    const stands = (s.powerStructure.factions || []).some((f) => f !== gov && !exclude.has(nameOf(f)) && D.contestKindOf(f) === kind && Number(f.power) >= 5);
    if (!stands) continue;
    const key = `${c} -> ${kind}`;
    const e = (lift[key] ||= { stands: 0, contendsWithout: 0, contendsWith: 0 });
    e.stands += 1;
    if (runs.cs3cs4.challengers.some((x) => x.archetype === kind)) e.contendsWithout += 1;
    if (runs.cs3cs4cs5.challengers.some((x) => x.archetype === kind)) e.contendsWith += 1;
  }
  const shipped = coupContenders(s);
  if (JSON.stringify(shipped.challengers) !== JSON.stringify(runs.before.challengers) || shipped.incumbent.gated !== runs.before.incumbent.gated) mismatch += 1;
  const kindByName = new Map((s.powerStructure.factions || []).map((f) => [nameOf(f), D.contestKindOf(f)]));
  for (const k of SCEN) {
    const t = tally[k];
    const present = new Set((s.powerStructure.factions || []).filter((f) => f !== gov).map((f) => D.contestKindOf(f)));
    for (const kind of present) bump(t.present, kind);
    const cont = new Set(runs[k].challengers.map((c) => kindByName.get(c.name)));
    for (const kind of cont) bump(t.contends, kind);
    if (!runs[k].challengers.length) t.none += 1;
    bump(t.risk, coupRiskLabel(runs[k]));
    bump(t.field, String(runs[k].challengers.length));
  }
  // measured only: the holder's own power on the incumbent's side (CS3 field)
  const extra = h.holder ? num(h.holder.power) : 0;
  const withHolder = contest(s, { exclude, incumbentExtra: extra });
  if (runs.cs3.incumbent.gated) holderSide.gatedBefore += 1;
  if (withHolder.incumbent.gated) holderSide.gatedWithHolder += 1;
  bump(holderSide.riskBefore, coupRiskLabel(runs.cs3)); bump(holderSide.riskWithHolder, coupRiskLabel(withHolder));
  if (examples.length < 400) examples.push({ seed: job.seed, tier: job.tier, form, holder: h.holder ? nameOf(h.holder) : null, rule: h.rule, publicRule: hp.rule, person: h.seatHolder?.name || null,
    circumstances: held, before: runs.before.challengers.map((c) => c.name), after: runs.cs3cs4cs5.challengers.map((c) => c.name) });
}

const out = {
  meta: { script: 'docs/chair/2026-11-20/content/seat/measure-holder.mjs', draft: 'docs/chair/2026-11-20/content/seat/seat-draft.mjs', arm: ARM, n: N, towns, errors,
    beforeMismatchWithShippedCoupContenders: mismatch, seconds: Math.round((Date.now() - t0) / 1000) },
  holderRules: sorted(holderRules), holderRulesPublic: sorted(holderRulesPublic), publicLost, holderKind: sorted(holderKind),
  disagreements, multiHead, pairClass: sorted(pairClass), pairs: sorted(pairs),
  circumstances: sorted(circ), circumstancesByTier: circByTier, lift, holderSide, tally, examples,
};
writeFileSync(join(HERE, `holder-${ARM}.json`), `${JSON.stringify(out, null, 1)}\n`);
const L = [`# The holder, the contest and the circumstances, arm ${ARM} (${towns} born towns through birthConfig, ${errors} errors)`, '',
  `Executed: \`node ${out.meta.script} --arm ${ARM} --n ${N}\` against \`${out.meta.draft}\`. BEFORE re-spelled and checked against the shipped \`coupContenders\`: **${mismatch} mismatches**. Raw: \`holder-${ARM}.json\`.`, '',
  '## (1) The holder leaf, rule by rule (owner audience; public audience beside it)', '',
  '| rule | towns (owner) | towns (public) |', '|---|---|---|'];
for (const r of ['R1', 'R2', 'R3', 'R4', 'R5']) L.push(`| ${r} | ${holderRules[r] || 0} | ${holderRulesPublic[r] || 0} |`);
L.push('', `Veiled holders (the owner sees a hidden or criminal power; a public reader is told the office and the person only): ${publicLost}.`, '',
  `Rule x holder kind: ${Object.entries(out.holderKind).map(([k, v]) => `${k} ${v}`).join(' · ')}`, '',
  `**Towns where two rules answer differently: ${disagreements.length}.**`, '');
for (const d of disagreements.slice(0, 60)) L.push(`- ${d.seed} (${d.form}): R2 ${d.R2 ?? '–'} · R3 ${d.R3 ?? '–'} → chosen ${d.chosen}`);
if (disagreements.length > 60) L.push(`- … ${disagreements.length - 60} more in the json`);
L.push('', `The seat-holder heads more than one other power: ${multiHead.length} towns${multiHead.length ? ` (${multiHead.slice(0, 8).map((m) => `${m.seed}: ${m.heads.join(' + ')}`).join('; ')})` : ''}.`, '');
L.push('## (2) The contender table per kind (CS4 labels; present = a non-governing power of that kind stands)', '');
L.push('| kind | present | contends BEFORE | CS3 alone | CS3+CS4 | CS3+CS4+CS5 |', '|---|---|---|---|---|---|');
for (const k of KINDS) {
  const p = tally.before.present[k] || 0;
  if (!p && !SCEN.some((s) => tally[s].contends[k])) { L.push(`| ${k} | 0 | 0 | 0 | 0 | 0 |`); continue; }
  L.push(`| ${k} | ${p} | ${SCEN.map((s) => tally[s].contends[k] || 0).join(' | ')} |`);
}
L.push(`| **towns with no contender** | | ${SCEN.map((s) => tally[s].none).join(' | ')} |`, '');
L.push('Field size (contenders per town): ' + SCEN.map((s) => `${s} ${Object.entries(tally[s].field).sort().map(([k, v]) => `${k}:${v}`).join(' ')}`).join(' · '), '');
L.push('Coup-risk ladder: ' + SCEN.map((s) => `${s}: ${Object.entries(sorted(tally[s].risk)).map(([k, v]) => `${k} ${v}`).join(', ')}`).join(' · '), '');
L.push(`Measured only (not proposed): with the holder's own power counted on the incumbent's side, under CS3 the incumbent is gated in ${holderSide.gatedWithHolder} towns against ${holderSide.gatedBefore}; risk ${Object.entries(sorted(holderSide.riskWithHolder)).map(([k, v]) => `${k} ${v}`).join(', ')} against ${Object.entries(sorted(holderSide.riskBefore)).map(([k, v]) => `${k} ${v}`).join(', ')}.`, '');
L.push('## (3) Form x holder kind, against the one table (CS6)', '', `Classes: ${Object.entries(out.pairClass).map(([k, v]) => `${k} ${v}`).join(' · ')}`, '');
for (const [p, c] of Object.entries(out.pairs)) L.push(`- ${p}: ${c}`);
L.push('', '## (4) The circumstances', '', '| circumstance | reads | towns | by tier |', '|---|---|---|---|');
for (const [k, c] of Object.entries(D.CIRCUMSTANCES)) L.push(`| ${k} | ${c.reads} | ${circ[k] || 0} | ${Object.entries(circByTier[k] || {}).map(([t, v]) => `${t} ${v}`).join(', ')} |`);
L.push(`| (none held) | | ${circ['(none)'] || 0} | |`, '');
L.push('### What each proposed factor does where its circumstance is held (CS3+CS4, then with CS5)', '', '| circumstance -> kind (factor) | towns where it holds and that kind stands (power >= 5, not the holder) | contends without the factor | contends with it |', '|---|---|---|---|');
for (const [k, e] of Object.entries(lift).sort()) { const [c, kind] = k.split(' -> '); L.push(`| ${k} (x${D.CIRCUMSTANCE_FACTORS[c][kind]}) | ${e.stands} | ${e.contendsWithout} | ${e.contendsWith} |`); }
L.push('');
writeFileSync(join(HERE, `holder-${ARM}.md`), `${L.join('\n')}\n`);
process.stderr.write(`wrote holder-${ARM} (${towns} towns, ${errors} errors, ${mismatch} mismatches, ${out.meta.seconds}s)\n`);
