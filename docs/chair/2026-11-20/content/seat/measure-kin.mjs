#!/usr/bin/env node
/**
 * docs/chair/2026-11-20/content/seat/measure-kin.mjs — SEAT-MEASURE's second count (the chair's addendum of
 * 2026-11-20 04:32Z, on the owner's question: "a guild council that competes with the merchant guilds or crafts
 * guilds … seems redundant"). Measures; changes nothing.
 *
 * Per born town: the ruling body (the governing row) and its KIND, read three ways:
 *   ruler kind  = rulerKin.js :: rulingKindOf (RULER_KINDS or null: what drawCouncilOfAKind and the fold read)
 *   backing     = powerSupport.js :: backingArchetypeOf (reads craft off the name; civic -> government)
 *   coup        = factionArchetypes.js :: factionArchetype (category first: what coupContenders reads)
 * then (a) the same-kind powers beside the seat (non-governing rows whose backing kind equals the seat's), whether
 * each is one of the three contenders, and whether the seat-holder (powerStrata.js :: liveSeatCandidatesOf, first)
 * is that power's own first member (memberships rank 1); (b) the pairs: body name x same-kind power name;
 * (c) the form x the kind behind it: body name x the kind of the power the seat-holder heads (any other rank-1
 * membership), and body name x its own backing kind.
 *
 *   node docs/chair/2026-11-20/content/seat/measure-kin.mjs --arm default|presets [--n N]
 * Same seeds and configs as measure-seat.mjs (default: seat-measure-<tier>-<i>, n=150; presets: the 16
 * non-neutral Character presets x n=10 per tier). Writes kin-<arm>.json and kin-<arm>.md beside this file.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '../../../../..');
const imp = (p) => import(join(ROOT, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { coupContenders } = await imp('src/domain/rulingPowerCoup.js');
const { factionArchetype } = await imp('src/domain/factionArchetypes.js');
const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
const { backingArchetypeOf } = await imp('src/domain/dossier/powerSupport.js');
const { rulingKindOf } = await imp('src/generators/power/rulerKin.js');
const { liveSeatCandidatesOf } = await imp('src/domain/dossier/powerStrata.js');
const { ARCHETYPES, archetypePatch } = await imp('src/components/generate/characterPresets.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');

const args = process.argv.slice(2);
const argOf = (flag, fallback) => { const i = args.indexOf(flag); return i >= 0 && args[i + 1] != null ? args[i + 1] : fallback; };
const ARM = argOf('--arm', 'default');
const N = Number(argOf('--n', ARM === 'presets' ? 10 : 150));
// --law birth (default) | v1: as measure-seat.mjs (birthConfig, or the bare config with a -v1 suffix).
const LAW = argOf('--law', 'birth');
const SUFFIX = `${ARM}${LAW === 'v1' ? '-v1' : ''}`;
if (LAW !== 'v1') await loadGenerationLawPayloads();
const lawConfig = (c) => (LAW === 'v1' ? c : birthConfig(c));
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const PRESETS = ARCHETYPES.map((a) => a.key).filter((k) => k !== 'balanced');
const JOBS = ARM === 'presets'
  ? TIERS.flatMap((tier) => PRESETS.flatMap((preset) => Array.from({ length: N }, (_, i) => ({ tier, seed: `seat-measure-${tier}-${preset}-${i}`, config: { settType: tier, ...archetypePatch(preset) } }))))
  : TIERS.flatMap((tier) => Array.from({ length: N }, (_, i) => ({ tier, seed: `seat-measure-${tier}-${i}`, config: { settType: tier } })));

const bump = (m, k, by = 1) => { m[k] = (m[k] || 0) + by; };
const sorted = (m) => Object.fromEntries(Object.entries(m).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)));
const rankOne = (npc, power) => Array.isArray(npc?.memberships) && npc.memberships.some((m) => m && m.power === power && m.rank === 1);

const byKind = {}; // backing kind of the seat -> tallies
const pairs = {}; const formBehind = {}; const formOwn = {}; const formRulerKind = {};
let towns = 0; let errors = 0; let holderless = 0;
const t0 = Date.now();
for (const job of JOBS) {
  let s;
  try { s = generateSettlementPipeline(lawConfig(job.config), null, { seed: job.seed, customContent: {} }); } catch { errors += 1; continue; }
  towns += 1;
  const gov = governingFactionOf(s);
  if (!gov) continue;
  const form = nameOf(gov);
  const own = backingArchetypeOf(gov);
  const rk = rulingKindOf(form) || '(none: civic/other)';
  const challengers = new Set(coupContenders(s).challengers.map((c) => c.name));
  const holder = liveSeatCandidatesOf(s)[0] || null;
  if (!holder) holderless += 1;
  const factions = s.powerStructure.factions || [];
  const same = factions.filter((f) => f !== gov && backingArchetypeOf(f) === own);
  const k = (byKind[own] ||= { seats: 0, withSameKind: 0, sameKindContends: 0, holderHeadsSameKind: 0, holderHeadsContendingSameKind: 0, rulerKindNull: 0 });
  k.seats += 1;
  if (!rulingKindOf(form)) k.rulerKindNull += 1;
  if (same.length) k.withSameKind += 1;
  if (same.some((f) => challengers.has(nameOf(f)))) k.sameKindContends += 1;
  if (holder && same.some((f) => rankOne(holder, nameOf(f)))) k.holderHeadsSameKind += 1;
  if (holder && same.some((f) => challengers.has(nameOf(f)) && rankOne(holder, nameOf(f)))) k.holderHeadsContendingSameKind += 1;
  for (const f of same) bump(pairs, `${form} | ${nameOf(f)}${challengers.has(nameOf(f)) ? ' (contends)' : ''}`);
  bump(formOwn, `${form} -> backing:${own} coup:${factionArchetype(gov)}`);
  bump(formRulerKind, `${form} -> rulingKindOf:${rk}`);
  const behind = holder ? factions.filter((f) => f !== gov && rankOne(holder, nameOf(f))) : [];
  if (!behind.length) bump(formBehind, `${form} x ${holder ? '(holder heads no other power)' : '(no seat-holder)'}`);
  for (const f of behind) bump(formBehind, `${form} x ${backingArchetypeOf(f)} (${nameOf(f)})`);
}

const out = {
  meta: { script: 'docs/chair/2026-11-20/content/seat/measure-kin.mjs', arm: ARM, law: LAW, n: N, towns, errors, holderless, seconds: Math.round((Date.now() - t0) / 1000) },
  byKind: sorted(Object.fromEntries(Object.entries(byKind).map(([k, v]) => [k, v.seats]))) && byKind,
  pairs: sorted(pairs), formBehind: sorted(formBehind), formOwn: sorted(formOwn), formRulerKind: sorted(formRulerKind),
};
writeFileSync(join(HERE, `kin-${SUFFIX}.json`), `${JSON.stringify(out, null, 1)}\n`);
const L = [`# The seat's own kind, arm ${ARM}, law ${LAW} (${towns} born towns, ${errors} errors, ${holderless} with no seat-holder)`, '',
  `Executed: \`node ${out.meta.script} --arm ${ARM} --law ${LAW} --n ${N}\`. Kind of the seat = \`backingArchetypeOf\` (craft read off the name). Raw: \`kin-${SUFFIX}.json\`.`, '',
  '## (a) Per kind of seat', '',
  '| seat kind | seats | rulingKindOf null (no house test, no fold) | a same-kind power stands beside it | that power is one of the 3 contenders | the seat-holder is that power\'s first member | …and it contends |', '|---|---|---|---|---|---|---|'];
for (const [k, v] of Object.entries(byKind).sort((a, b) => b[1].seats - a[1].seats)) L.push(`| ${k} | ${v.seats} | ${v.rulerKindNull} | ${v.withSameKind} | ${v.sameKindContends} | ${v.holderHeadsSameKind} | ${v.holderHeadsContendingSameKind} |`);
L.push('', '## (b) Body × same-kind power beside it', '', ...Object.entries(out.pairs).map(([p, c]) => `- ${p}: ${c}`));
L.push('', '## (c) Form × the kind of the power the seat-holder heads', '', ...Object.entries(out.formBehind).map(([p, c]) => `- ${p}: ${c}`));
L.push('', '## Form × its own kind (backing / coup reading)', '', ...Object.entries(out.formOwn).map(([p, c]) => `- ${p}: ${c}`));
L.push('', '## Form × rulingKindOf', '', ...Object.entries(out.formRulerKind).map(([p, c]) => `- ${p}: ${c}`));
writeFileSync(join(HERE, `kin-${SUFFIX}.md`), `${L.join('\n')}\n`);
process.stderr.write(`wrote kin-${SUFFIX} (${towns} towns, ${errors} errors, ${out.meta.seconds}s)\n`);
