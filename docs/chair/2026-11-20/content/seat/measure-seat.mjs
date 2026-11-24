#!/usr/bin/env node
/**
 * docs/chair/2026-11-20/content/seat/measure-seat.mjs — SEAT-MEASURE's count (the seventh chair, 2026-11-20).
 *
 * The owner, 2026-11-20: "power groups like nobles, craftsmen, etc are never able to compete for leadership?"
 * This script MEASURES; it changes nothing. For born towns of every tier it reads, per KIND of power:
 *   present · rules at birth · one of the three coup contenders (rulingPowerCoup.js :: coupContenders);
 *   for a present, non-ruling, non-criminal power that is NOT a contender: its power and weight against the
 *   third contender's weight in the same town, the power floor, and whether the coercion factor ALONE decides
 *   it (it would be in the three if every factor were 1.0);
 *   the ruler's source (an institution's governance label, rulingStructure.js :: governanceLabelMap, read over
 *   the born town's own institutions, against the priority / size path); which ruling bodies are born and which
 *   names in the tables are never reached; split by tier and by culture.
 *
 * KIND is the coup's own reading: domain/factionArchetypes.js :: factionArchetype (category first). The backing
 * catalogue's reading (dossier/powerSupport.js :: backingArchetypeOf, which reads "craft" off the name) is
 * counted beside it where the two differ.
 *
 *   node docs/chair/2026-11-20/content/seat/measure-seat.mjs [--arm default|presets] [--n 150] [--out <dir>]
 * ARM default: seeds `seat-measure-<tier>-<i>`, i = 0..n-1; config `{ settType: <tier> }`, `customContent: {}` (every
 *   other input is the generator's own default draw; the five priority sliders read 50, the store's own default,
 *   store/configSlice.js). Writes count-default.json / count-default.md.
 * ARM presets: the 16 non-neutral Character presets (components/generate/characterPresets.js :: archetypePatch, every
 *   key but 'balanced') x n seeds per tier, seeds `seat-measure-<tier>-<preset>-<i>`, config
 *   `{ settType: <tier>, ...archetypePatch(<preset>) }`. Writes count-presets.json / count-presets.md.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../../../..');
const imp = (p) => import(join(ROOT, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { coupContenders, COUP_COERCION } = await imp('src/domain/rulingPowerCoup.js');
const { factionArchetype } = await imp('src/domain/factionArchetypes.js');
const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
const { backingArchetypeOf } = await imp('src/domain/dossier/powerSupport.js');
const { nativeSemanticNames, isMaterializedCustomContent } = await imp('src/domain/content/customContentSemanticAuthority.js');
const { getPriorities } = await imp('src/generators/priorityHelpers.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');

const args = process.argv.slice(2);
const argOf = (flag, fallback) => { const i = args.indexOf(flag); return i >= 0 && args[i + 1] != null ? args[i + 1] : fallback; };
const ARM = argOf('--arm', 'default');
// --law birth (default): the config goes through densityCreateBoundary.js :: birthConfig, as every app birth does
// (today: _densityLawVersion 2, _livingContentLawVersion 2). --law v1: the bare config, the law of towns born before
// Register VII was lit (daed2bf56); outputs carry a -v1 suffix.
const LAW = argOf('--law', 'birth');
const SUFFIX = `${ARM}${LAW === 'v1' ? '-v1' : ''}`;
if (LAW !== 'v1') await loadGenerationLawPayloads();
const lawConfig = (c) => (LAW === 'v1' ? c : birthConfig(c));
const N = Number(argOf('--n', ARM === 'presets' ? 10 : 150));
const { ARCHETYPES, archetypePatch } = await imp('src/components/generate/characterPresets.js');
const PRESETS = ARCHETYPES.map((a) => a.key).filter((k) => k !== 'balanced');
const OUT = argOf('--out', dirname(fileURLToPath(import.meta.url)));

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const KINDS = ['government', 'noble', 'military', 'merchant', 'religious', 'criminal', 'arcane', 'craft', 'labor', 'outsider', 'occupation', 'civic', 'other'];

// rulingStructure.js :: governanceLabelMap's KEYS, in its order (first key a name includes wins).
const GOV_LABEL_KEYS = ['head-of-household consensus', 'informal elder consensus', 'village reeve', "lord's steward", "lord's appointee",
  'mayor and council', 'guild governance', 'guild consortium', 'noble governor', 'merchant oligarchy', 'democratic assembly',
  'city-state government', 'royal seat', 'town council', "lord's reeve", 'village headman'];

// Every ruling-body name the tables in rulingStructure.js :: generatePowerStructure can push as the governing row
// (governanceLabelMap's values at every tier, chooseGoverning's council forms and small/town/city/metropolis
// fallbacks), and the names the description / power tables carry that no chooser emits.
const TABLE_NAMES = ['Elder Consensus', 'Household Council', 'Free Elder Council', 'Elder Council', 'Elected Reeve', 'Feudal Stewardship',
  'Feudal Appointee', 'Grand Council', 'City Council', 'Town Council', 'Grand Guild Council', 'Guild Authority', 'Guild Council',
  'Grand Guild Consortium', 'Merchant Guild Council', 'Ducal Governorship', 'Noble Governorship', 'Grand Merchant Oligarchy',
  'Merchant oligarchy', 'Democratic assembly', 'City-State Council', 'Royal Authority', "Headman's Authority",
  'Grand Military Council', 'Military City Council', 'Military Council', 'High Theocratic Council', 'Ecclesiastical Council',
  'Church Council', 'Grand Merchant Senate', 'Merchant City Council', 'Merchant Council', 'Shadow Senate', 'Corrupt City Council',
  'Corrupt Council', 'Arcane Senate', 'Arcane Council', 'Priestly Guidance', 'Town Mayor'];
const TABLE_ONLY_NAMES = ['Theocratic Council', 'Corrupt Oligarchy', 'Shadowed Council', 'Mixed Council'];

const q = (xs, p) => { if (!xs.length) return null; const s = [...xs].sort((a, b) => a - b); const i = (s.length - 1) * p; const lo = Math.floor(i), hi = Math.ceil(i); return +(s[lo] + (s[hi] - s[lo]) * (i - lo)).toFixed(2); };
const r2 = (x) => Math.round(x * 100) / 100;

/** The coup's ranking with every factor set to 1.0 (the same filter, sort keys and cut). */
function neutralTop3(s) {
  const gov = governingFactionOf(s);
  return (s.powerStructure?.factions || []).filter((f) => f && f !== gov)
    .map((f) => ({ name: nameOf(f), archetype: factionArchetype(f), power: Number(f.power) || 0 }))
    .filter((c) => c.archetype !== 'criminal' && c.power >= 5 && c.name)
    .sort((a, b) => (b.power - a.power) || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    .slice(0, 3).map((c) => c.name);
}

const rows = [];
const t0 = Date.now();
const JOBS = ARM === 'presets'
  ? TIERS.flatMap((tier) => PRESETS.flatMap((preset) => Array.from({ length: N }, (_, i) => ({ tier, preset, seed: `seat-measure-${tier}-${preset}-${i}`, config: { settType: tier, ...archetypePatch(preset) } }))))
  : TIERS.flatMap((tier) => Array.from({ length: N }, (_, i) => ({ tier, preset: null, seed: `seat-measure-${tier}-${i}`, config: { settType: tier } })));
let lastTier = null;
for (const job of JOBS) {
  const { tier, preset, seed } = job;
  if (lastTier && lastTier !== tier) process.stderr.write(`${lastTier} done (${((Date.now() - t0) / 1000).toFixed(0)}s)\n`);
  lastTier = tier;
  {
    let s;
    try { s = generateSettlementPipeline(lawConfig(job.config), null, { seed, customContent: {} }); }
    catch (e) { rows.push({ tier, preset, seed, error: String(e?.message || e) }); continue; }
    const factions = s.powerStructure?.factions || [];
    const gov = governingFactionOf(s);
    const { challengers, incumbent } = coupContenders(s);
    const third = challengers.length === 3 ? challengers[2] : null;
    const challengerNames = new Set(challengers.map((c) => c.name));
    const neutral = new Set(neutralTop3(s));
    const instNames = nativeSemanticNames((s.institutions || []).filter((x) => !isMaterializedCustomContent(x))).map((n) => n.toLowerCase());
    const labelKey = GOV_LABEL_KEYS.find((k) => instNames.some((n) => n.includes(k))) || null;
    const pr = getPriorities(s.config || {});
    const prio = { military: pr.military, religion: pr.religion, economy: pr.economy, criminal: pr.criminal, magic: pr.magic };
    const top = Object.entries(prio).reduce((b, e) => (b[1] > e[1] ? b : e));
    rows.push({
      tier, preset, seed, culture: s.config?.culture || null,
      government: s.powerStructure?.government || null,
      ruler: gov ? { name: nameOf(gov), kind: factionArchetype(gov), backing: backingArchetypeOf(gov), power: Number(gov.power) || 0 } : null,
      labelKey, topCategory: top[0], topPriority: top[1],
      incumbent: { gated: incumbent.gated, amplifiedWeight: incumbent.amplifiedWeight, govMultiplier: incumbent.govMultiplier },
      thirdWeight: third ? third.weight : null,
      factions: factions.map((f) => {
        const kind = factionArchetype(f);
        const name = nameOf(f);
        const power = Number(f.power) || 0;
        return {
          name, kind, backing: backingArchetypeOf(f), category: f.category || null, power,
          weight: r2(power * (COUP_COERCION[kind] ?? COUP_COERCION.other)),
          governing: f === gov, contender: challengerNames.has(name), neutralContender: neutral.has(name),
        };
      }),
    });
  }
}
process.stderr.write(`${lastTier} done (${((Date.now() - t0) / 1000).toFixed(0)}s)\n`);

const ok = rows.filter((r) => !r.error);
const errors = rows.filter((r) => r.error);

/** The per-kind table for a set of rows. */
function kindTable(rs, kindOf = (f) => f.kind) {
  const out = {};
  for (const k of KINDS) {
    const present = rs.filter((r) => r.factions.some((f) => kindOf(f) === k));
    const rules = rs.filter((r) => r.factions.some((f) => f.governing && kindOf(f) === k));
    const contends = rs.filter((r) => r.factions.some((f) => f.contender && kindOf(f) === k));
    // A present, non-ruling, non-criminal power of this kind that is NOT a contender, in a town with a full field.
    const outs = [];
    for (const r of rs) for (const f of r.factions) {
      if (kindOf(f) !== k || f.governing || f.contender || f.kind === 'criminal') continue;
      outs.push({ power: f.power, weight: f.weight, third: r.thirdWeight, belowFloor: f.power < 5, factorDecides: f.neutralContender && !f.contender });
    }
    // A contender that holds its place only by its factor (it would NOT be in the three at 1.0).
    const inByFactor = rs.reduce((a, r) => a + r.factions.filter((f) => kindOf(f) === k && f.contender && !f.neutralContender).length, 0);
    const full = outs.filter((o) => o.third != null && !o.belowFloor);
    const powersAll = rs.flatMap((r) => r.factions.filter((f) => kindOf(f) === k && !f.governing).map((f) => f.power));
    out[k] = {
      present: present.length, rules: rules.length, contender: contends.length,
      nonRulingPowers: powersAll.length,
      power: { p10: q(powersAll, 0.1), p50: q(powersAll, 0.5), p90: q(powersAll, 0.9) },
      left: outs.length, leftBelowFloor: outs.filter((o) => o.belowFloor).length,
      leftGapToThird: { p10: q(full.map((o) => o.third - o.weight), 0.1), p50: q(full.map((o) => o.third - o.weight), 0.5), p90: q(full.map((o) => o.third - o.weight), 0.9) },
      thirdWeight: { p50: q(full.map((o) => o.third), 0.5) },
      leftByFactorAlone: outs.filter((o) => o.factorDecides).length,
      inByFactorAlone: inByFactor,
    };
  }
  return out;
}

const count = (xs) => xs.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map());
const sortedObj = (m) => Object.fromEntries([...m.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)));

const byTier = Object.fromEntries(TIERS.map((t) => [t, ok.filter((r) => r.tier === t)]));
const result = {
  meta: {
    script: 'docs/chair/2026-11-20/content/seat/measure-seat.mjs', arm: ARM, n: N,
    seeds: ARM === 'presets' ? 'seat-measure-<tier>-<preset>-<i>, i=0..n-1, 16 presets' : 'seat-measure-<tier>-<i>, i=0..n-1',
    config: ARM === 'presets' ? '{ settType: <tier>, ...archetypePatch(<preset>) } ; customContent {}' : '{ settType: <tier> } ; customContent {} ; everything else the generator default draws (priorities 50)',
    towns: ok.length, errors: errors.map((e) => `${e.seed}: ${e.error}`), seconds: Math.round((Date.now() - t0) / 1000),
  },
  kinds: { all: kindTable(ok), ...Object.fromEntries(TIERS.map((t) => [t, kindTable(byTier[t])])) },
  kindsByBacking: { all: kindTable(ok, (f) => f.backing) },
  rulerSource: Object.fromEntries(['all', ...TIERS].map((t) => {
    const rs = t === 'all' ? ok : byTier[t];
    return [t, { label: rs.filter((r) => r.labelKey).length, priorityOrSize: rs.filter((r) => !r.labelKey).length, labelKeys: sortedObj(count(rs.map((r) => r.labelKey || '(none)'))) }];
  })),
  governments: Object.fromEntries(['all', ...TIERS].map((t) => [t, sortedObj(count((t === 'all' ? ok : byTier[t]).map((r) => r.government)))])),
  rulerKinds: Object.fromEntries(['all', ...TIERS].map((t) => [t, sortedObj(count((t === 'all' ? ok : byTier[t]).map((r) => r.ruler?.kind || '(none)')))])),
  namesByKind: Object.fromEntries(KINDS.map((k) => [k, sortedObj(count(ok.flatMap((r) => r.factions.filter((f) => f.kind === k).map((f) => f.name))))])),
  craftNamedReadAs: sortedObj(count(ok.flatMap((r) => r.factions.filter((f) => /craft|artisan/i.test(f.name)).map((f) => `${f.name} -> coup:${f.kind} backing:${f.backing} category:${f.category}`)))),
  neverReached: TABLE_NAMES.filter((n) => !ok.some((r) => r.government === n)),
  tableOnlyNames: TABLE_ONLY_NAMES,
  bornNotInTables: [...new Set(ok.map((r) => r.government))].filter((g) => g && !TABLE_NAMES.includes(g)),
  incumbentGated: Object.fromEntries(['all', ...TIERS].map((t) => { const rs = t === 'all' ? ok : byTier[t]; return [t, `${rs.filter((r) => r.incumbent.gated).length}/${rs.length}`]; })),
  fieldSize: Object.fromEntries(['all', ...TIERS].map((t) => [t, sortedObj(count((t === 'all' ? ok : byTier[t]).map((r) => String(r.factions.filter((f) => f.contender).length))))])),
  cultures: {},
  priorityPath: Object.fromEntries(['all', ...TIERS].map((t) => {
    const rs = (t === 'all' ? ok : byTier[t]).filter((r) => !r.labelKey);
    return [t, { towns: rs.length, topOver55: rs.filter((r) => r.topPriority > 55).length, topOver65: rs.filter((r) => r.topPriority > 65).length,
      governmentsWhenTopOver55: sortedObj(count(rs.filter((r) => r.topPriority > 55).map((r) => `${r.topCategory}>${r.government}`))) }];
  })),
  byPreset: ARM === 'presets' ? Object.fromEntries(PRESETS.map((p) => [p, sortedObj(count(ok.filter((r) => r.preset === p).map((r) => r.government)))])) : null,
};
for (const c of [...new Set(ok.map((r) => r.culture))].sort()) {
  const rs = ok.filter((r) => r.culture === c);
  const kt = kindTable(rs);
  result.cultures[c] = { towns: rs.length, ...Object.fromEntries(KINDS.filter((k) => kt[k].present).map((k) => [k, `${kt[k].present}/${kt[k].rules}/${kt[k].contender}`])) };
}

writeFileSync(join(OUT, `count-${SUFFIX}.json`), `${JSON.stringify(result, null, 1)}\n`);

// ── The one table the owner reads, and the detail tables ──────────────────────
const pct = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : '–');
const L = [];
L.push(`# The seat count, arm ${ARM}, law ${LAW} — who is present, who rules, who contends (${ok.length} born towns)`, '');
L.push(`Executed: \`node ${result.meta.script} --arm ${ARM} --law ${LAW} --n ${N}\` at the base named in the commit; seeds \`${result.meta.seeds}\`; config \`${result.meta.config}\`. ${errors.length} generation errors. Kind = the coup's reading (\`factionArchetypes.js :: factionArchetype\`). Raw: \`count-${SUFFIX}.json\`.`, '');
L.push('## THE TABLE (all tiers)', '');
L.push('| kind | present in | rules at birth | a contender | median power (not ruling) | left out though present | of those: under the floor of 5 | of those: the factor alone keeps it out | contenders that are in only by their factor |');
L.push('|---|---|---|---|---|---|---|---|---|');
const A = result.kinds.all;
for (const k of KINDS) {
  const x = A[k];
  if (!x.present) { L.push(`| ${k} | 0 | 0 | 0 | – | – | – | – | – |`); continue; }
  L.push(`| ${k} | ${x.present} (${pct(x.present, ok.length)}) | ${x.rules} | ${x.contender} (${pct(x.contender, x.present)} of present) | ${x.power.p50 ?? '–'} | ${x.left} | ${x.leftBelowFloor} | ${x.leftByFactorAlone} | ${x.inByFactorAlone} |`);
}
L.push('', '## By tier: present / rules / contender', '');
L.push(`| kind | ${TIERS.join(' | ')} |`, `|---|${TIERS.map(() => '---').join('|')}|`);
for (const k of KINDS) {
  if (!A[k].present) continue;
  L.push(`| ${k} | ${TIERS.map((t) => { const x = result.kinds[t][k]; return `${x.present}/${x.rules}/${x.contender}`; }).join(' | ')} |`);
}
L.push('', '## The cut: a left-out power against the third contender (towns with a full field, power ≥ 5)', '');
L.push('| kind | power p10 / p50 / p90 (not ruling) | third contender\'s weight, median | gap to the third (weight), p10 / p50 / p90 |', '|---|---|---|---|');
for (const k of KINDS) {
  const x = A[k];
  if (!x.present) continue;
  L.push(`| ${k} | ${x.power.p10 ?? '–'} / ${x.power.p50 ?? '–'} / ${x.power.p90 ?? '–'} | ${x.thirdWeight.p50 ?? '–'} | ${x.leftGapToThird.p10 ?? '–'} / ${x.leftGapToThird.p50 ?? '–'} / ${x.leftGapToThird.p90 ?? '–'} |`);
}
L.push('', '## The backing catalogue\'s reading (reads craft off the name)', '');
L.push('| kind | present | rules | contender |', '|---|---|---|---|');
for (const k of KINDS) { const x = result.kindsByBacking.all[k]; if (x.present) L.push(`| ${k} | ${x.present} | ${x.rules} | ${x.contender} |`); }
L.push('', '## Where the ruler comes from', '');
L.push('| tier | an institution\'s governance label | the priority / size path |', '|---|---|---|');
for (const t of ['all', ...TIERS]) { const x = result.rulerSource[t]; L.push(`| ${t} | ${x.label} | ${x.priorityOrSize} |`); }
L.push('', `Label keys (all tiers): ${Object.entries(result.rulerSource.all.labelKeys).map(([k, v]) => `${k} ${v}`).join(' · ')}`, '');
L.push('## Ruling bodies born (all tiers)', '');
L.push(Object.entries(result.governments.all).map(([k, v]) => `${k} ${v}`).join(' · '), '');
for (const t of TIERS) L.push(`- ${t}: ${Object.entries(result.governments[t]).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
L.push('', `Ruler kinds (all): ${Object.entries(result.rulerKinds.all).map(([k, v]) => `${k} ${v}`).join(' · ')}`, '');
L.push(`**Never reached** (names the choosers can push, none born in ${ok.length}): ${result.neverReached.join(' · ') || '(none)'}`, '');
L.push(`Named only in the description / power tables, emitted by no chooser: ${result.tableOnlyNames.join(' · ')}`, '');
L.push(`Born but in no table: ${result.bornNotInTables.join(' · ') || '(none)'}`, '');
L.push('## Names under each kind (all tiers)', '');
for (const k of KINDS) { const m = result.namesByKind[k]; if (Object.keys(m).length) L.push(`- ${k}: ${Object.entries(m).slice(0, 12).map(([n, v]) => `${n} ${v}`).join(' · ')}`); }
L.push('', `Craft-named powers as each reader reads them: ${Object.entries(result.craftNamedReadAs).map(([n, v]) => `${n} (${v})`).join(' · ')}`, '');
L.push('## The field', '');
for (const t of ['all', ...TIERS]) L.push(`- ${t}: contenders per town ${Object.entries(result.fieldSize[t]).map(([k, v]) => `${k}:${v}`).join(' ')}; incumbent gated ${result.incumbentGated[t]}`);
L.push('', '## The priority path (no governance label in the roster)', '');
for (const t of ['all', ...TIERS]) { const x = result.priorityPath[t]; L.push(`- ${t}: ${x.towns} towns; top priority > 55 in ${x.topOver55}, > 65 in ${x.topOver65}; top>government where > 55: ${Object.entries(x.governmentsWhenTopOver55).map(([k, v]) => `${k} ${v}`).join(' · ') || '(none)'}`); }
if (result.byPreset) { L.push('', '## Ruling bodies by preset (all tiers)', ''); for (const [p, m] of Object.entries(result.byPreset)) L.push(`- ${p}: ${Object.entries(m).map(([k, v]) => `${k} ${v}`).join(' · ')}`); }
L.push('', '## By culture: present / rules / contender', '');
for (const [c, x] of Object.entries(result.cultures)) L.push(`- ${c} (${x.towns}): ${Object.entries(x).filter(([k]) => k !== 'towns').map(([k, v]) => `${k} ${v}`).join(' · ')}`);
writeFileSync(join(OUT, `count-${SUFFIX}.md`), `${L.join('\n')}\n`);
process.stderr.write(`wrote count-${SUFFIX}.json, count-${SUFFIX}.md (${ok.length} towns, ${errors.length} errors, ${result.meta.seconds}s)\n`);
