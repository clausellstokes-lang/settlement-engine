#!/usr/bin/env node
/**
 * docs/chair/2026-11-20/content/seat/u4/measure-u4.mjs — U4's acceptance run (builder B4, 2026-11-20): the BUILT contest
 * (`src/domain/rulingPowerCoup.js :: coupContenders` under the seat law, the dial DARK) over the proposal's two pools,
 * beside the proposal's section (2) CS3 column. Measures; changes nothing under src/. The pools are
 * `../measure-holder.mjs`'s own (the same seeds, the same configs, through `birthConfig`: today's births).
 *
 * ONE COMMAND, BOTH POOLS. Per pool it reports, every column read by the CS4 reader (`seatTable.js :: contestKindOf`, so a
 * craft guild counts as craft throughout, as the proposal measured):
 *   - DARK BIRTHS (today's births, no key forced): BEFORE (`coupContenders` on the town as born: the old law) and LAW
 *     (the same record read under the seat law: its config carrying `_seatLawVersion: 2`, the dial dark); the towns with
 *     no contender and the coup-risk ladder under each; the built holder's rule;
 *   - the built LAW field against SEAT-1's draft CS3 (`../seat-draft.mjs :: holderOf`'s holder left out of today's
 *     contest), town by town, every difference listed with its town;
 *   - the circumstance reads (`seat/seatCircumstances.js :: seatCircumstancesOf`): per circumstance, the towns that
 *     hold it, beside the proposal's section (5);
 *   - FORCED BIRTHS, once per command when `--force-law <configKey>=<value>` is given (repeatable; the value is read as
 *     a number, true or false where it spells one, else a string): every born config carries the keys BEFORE birth (set
 *     on the config `birthConfig` returns, which the pipeline then births from: `birthConfig` itself clamps an incoming
 *     law marker, by design, so a key handed to it would be dropped and the arm would measure nothing), and
 *     the contest is read on the town as born (no re-stamp). With `--force-law _seatLawVersion=2` that is this unit's
 *     own law, and the table must equal LAW's: the run counts the towns whose forced birth differs from the dark birth
 *     beyond the forced keys, and the towns whose forced field differs from LAW's.
 *
 * Every rate is UNDER TODAY'S STANDING (RULINGS Addendum 6 (4): FORTUNE-1's standing law, dark, will move the
 * incumbent's protection when lit; the chair re-measures both lit together at the close).
 *
 *   node docs/chair/2026-11-20/content/seat/u4/measure-u4.mjs [--force-law _seatLawVersion=2]... [--n N] [--presets-n N]
 * Writes u4-contest.json / u4-contest.md beside this file.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '../../../../../..');
const imp = (p) => import(join(ROOT, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { coupContenders, coupRiskLabel } = await imp('src/domain/rulingPowerCoup.js');
const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
const { contestKindOf } = await imp('src/domain/seat/seatTable.js');
const { holderOf } = await imp('src/domain/seat/holderOfSeat.js');
const { seatCircumstancesOf, SEAT_CONTEST_LIT } = await imp('src/domain/seat/seatCircumstances.js');
const { ARCHETYPES, archetypePatch } = await imp('src/components/generate/characterPresets.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const D = await import(join(HERE, '../seat-draft.mjs'));

const args = process.argv.slice(2);
const argOf = (flag, fallback) => { const i = args.indexOf(flag); return i >= 0 && args[i + 1] != null ? args[i + 1] : fallback; };
/** `--force-law k=v`, repeatable. @returns {Record<string, unknown>} */
function forcedKeys() {
  const out = {};
  args.forEach((a, i) => {
    if (a !== '--force-law') return;
    const spec = String(args[i + 1] ?? '');
    const at = spec.indexOf('=');
    if (at <= 0) throw new Error(`--force-law wants <configKey>=<value>, got '${spec}'`);
    const raw = spec.slice(at + 1);
    out[spec.slice(0, at)] = /^-?\d+(\.\d+)?$/.test(raw) ? Number(raw) : raw === 'true' ? true : raw === 'false' ? false : raw;
  });
  return out;
}
const FORCED = forcedKeys();
const FORCING = Object.keys(FORCED).length > 0;
const N_DEFAULT = Number(argOf('--n', 150));
const N_PRESETS = Number(argOf('--presets-n', 10));
await loadGenerationLawPayloads();

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const PRESETS = ARCHETYPES.map((a) => a.key).filter((k) => k !== 'balanced');
const POOLS = {
  default: TIERS.flatMap((tier) => Array.from({ length: N_DEFAULT }, (_, i) => ({ tier, preset: null, seed: `seat-measure-${tier}-${i}`, config: { settType: tier } }))),
  presets: TIERS.flatMap((tier) => PRESETS.flatMap((preset) => Array.from({ length: N_PRESETS }, (_, i) => ({ tier, preset, seed: `seat-measure-${tier}-${preset}-${i}`, config: { settType: tier, ...archetypePatch(preset) } })))),
};
/** SEAT-1-PROPOSAL.md section (2) (present, BEFORE, CS3 alone) and the ladder; section (5) the circumstances. */
const PROPOSAL = {
  default: {
    kinds: { noble: [252, 98, 115], craft: [161, 2, 37], merchant: [473, 450, 145], military: [452, 446, 444], religious: [545, 472, 525], arcane: [207, 29, 71], labor: [0, 0, 0], outsider: [0, 0, 0], criminal: [26, 0, 0] },
    none: [240, 269],
    ladder: { before: { Holding: 407, Stable: 240, Contested: 220, Critical: 33 }, cs3: { Holding: 402, Stable: 269, Contested: 205, Critical: 24 } },
    circumstances: { craft_led: 9, trade_wealth: 228, strong_faith: 23, martial_pressure: 103, hunger: 23, mandate: 329, outside_debt: 30, occupation: 10, '(none)': 295 },
  },
  presets: {
    kinds: { noble: [257, 220, 158], craft: [247, 147, 191], merchant: [419, 345, 209], military: [411, 356, 339], religious: [383, 290, 277], arcane: [203, 74, 103] },
    none: [293, 313],
    ladder: { before: { Holding: 507, Stable: 293, Contested: 150, Critical: 10 }, cs3: { Holding: 517, Stable: 313, Contested: 124, Critical: 6 } },
    circumstances: { craft_led: 29, trade_wealth: 212, strong_faith: 247, martial_pressure: 460, hunger: 31, mandate: 302, outside_debt: 41, occupation: 6, '(none)': 164 },
  },
};
const KINDS = ['noble', 'craft', 'merchant', 'military', 'religious', 'arcane', 'labor', 'outsider', 'criminal', 'occupation', 'government', 'other'];
const LADDER = ['Holding', 'Stable', 'Contested', 'Critical'];
const ladderKey = (label) => (label.startsWith('Critical') ? 'Critical' : label);
const bump = (m, k, by = 1) => { m[k] = (m[k] || 0) + by; };
const field = (contest) => contest.challengers.map((c) => c.name).join(' · ');

/** The marker-free bytes of a born town (the forced keys and their two echoes removed), to compare two births. */
function bytesWithout(s, keys) {
  const strip = (bag) => {
    if (!bag || typeof bag !== 'object') return bag;
    const copy = { ...bag };
    for (const k of keys) delete copy[k];
    return copy;
  };
  return JSON.stringify({ ...s, config: strip(s.config), _config: strip(s._config) });
}

/** A fresh tally for one arm. */
const tally = () => ({ present: {}, contends: {}, none: 0, ladder: {} });
function count(t, s, contest) {
  const gov = governingFactionOf(s);
  const rows = (s.powerStructure?.factions || []).filter((f) => f && f !== gov);
  for (const kind of new Set(rows.map((f) => contestKindOf(f)))) bump(t.present, kind);
  const kindByName = new Map(rows.map((f) => [nameOf(f), contestKindOf(f)]));
  for (const kind of new Set(contest.challengers.map((c) => kindByName.get(c.name)))) bump(t.contends, kind);
  if (!contest.challengers.length) t.none += 1;
  bump(t.ladder, ladderKey(coupRiskLabel(contest)));
}

const t0 = Date.now();
const out = { meta: { script: 'docs/chair/2026-11-20/content/seat/u4/measure-u4.mjs', standing: "under today's standing", dialLit: SEAT_CONTEST_LIT, forced: FORCED, n: { default: N_DEFAULT, presets: N_PRESETS } }, pools: {} };
for (const [pool, jobs] of Object.entries(POOLS)) {
  const r = {
    towns: 0, errors: 0, before: tally(), law: tally(), forced: FORCING ? tally() : null,
    holderRules: {}, circumstances: {}, draftDiff: [], forcedBirthDiffers: [], forcedFieldDiffers: [], forcedErrors: 0,
  };
  for (const job of jobs) {
    let s;
    try { s = generateSettlementPipeline(birthConfig(job.config), null, { seed: job.seed, customContent: {} }); } catch { r.errors += 1; continue; }
    r.towns += 1;
    const lawful = { ...s, config: { ...(s.config || {}), _seatLawVersion: 2 } };
    const before = coupContenders(s);
    const law = coupContenders(lawful);
    count(r.before, s, before);
    count(r.law, s, law);
    const h = holderOf(lawful, { audience: 'owner' });
    bump(r.holderRules, h.rule);
    const held = seatCircumstancesOf(s);
    for (const c of held) bump(r.circumstances, c);
    if (!held.length) bump(r.circumstances, '(none)');
    // SEAT-1's draft CS3: the draft's holder left out of today's contest (the old law, so no holder read inside)
    const d = D.holderOf(s);
    const draftCs3 = d.holder
      ? coupContenders({ ...s, powerStructure: { ...s.powerStructure, factions: s.powerStructure.factions.filter((f) => f !== d.holder) } })
      : before;
    if (field(draftCs3) !== field(law)) {
      r.draftDiff.push({ seed: job.seed, tier: job.tier, preset: job.preset, form: nameOf(governingFactionOf(s)),
        builtHolder: `${h.rule} ${h.holderName ?? '-'}`, draftHolder: `${d.rule} ${d.holder ? nameOf(d.holder) : '-'}`,
        built: field(law), draft: field(draftCs3) });
    }
    if (FORCING) {
      let f;
      try { f = generateSettlementPipeline({ ...birthConfig(job.config), ...FORCED }, null, { seed: job.seed, customContent: {} }); } catch { r.forcedErrors += 1; continue; }
      const forced = coupContenders(f);
      count(r.forced, f, forced);
      if (bytesWithout(f, Object.keys(FORCED)) !== bytesWithout(s, Object.keys(FORCED))) r.forcedBirthDiffers.push(job.seed);
      if (field(forced) !== field(law) || coupRiskLabel(forced) !== coupRiskLabel(law)) r.forcedFieldDiffers.push({ seed: job.seed, law: field(law), forced: field(forced) });
    }
  }
  out.pools[pool] = r;
}
out.meta.seconds = Math.round((Date.now() - t0) / 1000);
writeFileSync(join(HERE, 'u4-contest.json'), `${JSON.stringify(out, null, 1)}\n`);

// ── the page ──────────────────────────────────────────────────────────────────────────────────────────────────────
const forcedLabel = FORCING ? Object.entries(FORCED).map(([k, v]) => `${k}=${v}`).join(', ') : null;
const L = [
  '# U4 acceptance: the built contest on the proposal\'s two pools (every rate under today\'s standing)',
  '',
  `One command: \`node ${out.meta.script}${FORCING ? Object.entries(FORCED).map(([k, v]) => ` --force-law ${k}=${v}`).join('') : ''}\` (${out.meta.seconds} s). `
    + `The dial (\`SEAT_CONTEST_LIT\`) reads ${SEAT_CONTEST_LIT ? 'LIT' : 'DARK'}. BEFORE = \`coupContenders\` on the town as born (the old law); `
    + 'LAW = the same record read with `_seatLawVersion: 2` (the holder leaves; dial dark)'
    + (FORCING ? `; FORCED = the town born with ${forcedLabel} set on its config before birth, read as born` : '')
    + '. Every column is read by the CS4 reader (`contestKindOf`). Proposal = SEAT-1-PROPOSAL.md section (2): present, BEFORE, CS3 alone.',
  '',
];
for (const [pool, r] of Object.entries(out.pools)) {
  const P = PROPOSAL[pool];
  L.push(`## ${pool} (${r.towns} towns, ${r.errors} errors${FORCING ? `; forced births ${r.forcedErrors} errors` : ''}), under today's standing`, '');
  L.push(`| kind | present | BEFORE | LAW (dial dark) |${FORCING ? ' FORCED |' : ''} proposal present · BEFORE · CS3 |`);
  L.push(`|---|---|---|---|${FORCING ? '---|' : ''}---|`);
  for (const kind of KINDS) {
    const p = P.kinds[kind];
    const row = [r.before.present[kind] || 0, r.before.contends[kind] || 0, r.law.contends[kind] || 0];
    if (!p && row.every((x) => x === 0) && !(FORCING && r.forced.contends[kind])) continue;
    L.push(`| ${kind} | ${row[0]} | ${row[1]} | ${row[2]} |${FORCING ? ` ${r.forced.contends[kind] || 0} |` : ''} ${p ? p.join(' · ') : '(not tabled)'} |`);
  }
  L.push(`| **no contender** | | ${r.before.none} | ${r.law.none} |${FORCING ? ` ${r.forced.none} |` : ''} BEFORE ${P.none[0]} · CS3 ${P.none[1]} |`);
  L.push('');
  L.push(`Ladder (${LADDER.join(' · ')}): BEFORE ${LADDER.map((k) => r.before.ladder[k] || 0).join(' · ')}; LAW ${LADDER.map((k) => r.law.ladder[k] || 0).join(' · ')}`
    + (FORCING ? `; FORCED ${LADDER.map((k) => r.forced.ladder[k] || 0).join(' · ')}` : '')
    + `. Proposal: BEFORE ${LADDER.map((k) => P.ladder.before[k]).join(' · ')}; CS3 ${LADDER.map((k) => P.ladder.cs3[k]).join(' · ')}.`);
  L.push('', `The built holder's rule under the law: ${Object.entries(r.holderRules).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ')}.`);
  L.push('', `Circumstances held (towns): ${[...Object.keys(P.circumstances)].map((c) => `${c} ${r.circumstances[c] || 0} (proposal ${P.circumstances[c]})`).join(' · ')}.`);
  if (FORCING) {
    L.push('', `Forced births whose record differs from the dark birth beyond the forced keys: ${r.forcedBirthDiffers.length}${r.forcedBirthDiffers.length ? ` (first: ${r.forcedBirthDiffers.slice(0, 5).join(', ')})` : ''}. `
      + `Towns whose FORCED field or ladder differs from LAW's: ${r.forcedFieldDiffers.length}.`);
  }
  L.push('', `### The built LAW field against SEAT-1's draft CS3: ${r.draftDiff.length} towns differ`, '');
  if (r.draftDiff.length) {
    L.push('| seed | form | built holder | draft holder | built field | draft field |', '|---|---|---|---|---|---|');
    for (const x of r.draftDiff) L.push(`| ${x.seed} | ${x.form} | ${x.builtHolder} | ${x.draftHolder} | ${x.built || '(none)'} | ${x.draft || '(none)'} |`);
  }
  L.push('');
}
writeFileSync(join(HERE, 'u4-contest.md'), `${L.join('\n')}\n`);
console.log(`[measure-u4] ${Object.entries(out.pools).map(([p, r]) => `${p}: ${r.towns} towns, ${r.errors} errors, draft diffs ${r.draftDiff.length}${FORCING ? `, forced birth diffs ${r.forcedBirthDiffers.length}, forced field diffs ${r.forcedFieldDiffers.length}` : ''}`).join('; ')} (${out.meta.seconds} s)`);
