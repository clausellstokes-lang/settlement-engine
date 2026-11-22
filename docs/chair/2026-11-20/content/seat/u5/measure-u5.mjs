#!/usr/bin/env node
/**
 * docs/chair/2026-11-20/content/seat/u5/measure-u5.mjs — U5's acceptance run (builder B5, 2026-11-20): the BUILT transfer
 * (`src/domain/rulingPower.js :: transferRulingPower` under the seat law, CS7) over the proposal's two pools. Measures;
 * changes nothing under src/. The pools are `../measure-holder.mjs`'s own (the same seeds, the same configs, through
 * `birthConfig`: today's births).
 *
 * ONE COMMAND, BOTH POOLS. Per town, under the OLD law (the town as born) and under the LAW (the same record with
 * `_seatLawVersion: 2` on its config), the heaviest contender (`rulingPowerCoup.js :: coupContenders(s).challengers[0]`
 * on that law's record: the coup winner a soak would pick) takes the seat through `transferRulingPower` with
 * `cause: 'coup'`, the other contenders as `losers`, and the licence's circumstance HANDED IN as the coup path would hand
 * it (`seatCircumstances.js :: seatCircumstancesOf`, a thunk). Reported by size band (`seatTable.js :: seatBandOf`):
 *   - forms KEPT / RENAMED to the winner's own;
 *   - the pair class (`seatTable.js :: pairLicense` of the winner's contest kind and the form): own, civic, licensed held,
 *     licensed not held, fallback, none;
 *   - towns where R1 answers MORE THAN ONE taker (the edges on the current form in the transfer's edge wording, read by
 *     `holderOfSeat.js :: transferSentenceSays`): must be 0 under the law; then the same after a SECOND and a THIRD coup
 *     in a row (each by that town's heaviest contender of the moment; arm (4)'s shape on born towns);
 *   - every retired edge a coup writes: in `TRANSFER_WORDINGS`' ONE 'retiredEdge' wording, and never read as an 'edge' wording;
 *   - `holderOfSeat.js`'s unattributed-transfer read (Addendum 3) firing: `holderOf` answering R1 with nobody where
 *     `transferTakerOf` finds no taker, and, as a second witness, the leaf's own predicate re-spelled over the exported
 *     matcher (an edge on the seat's pair in an edge wording for SOME form): must be 0 under the law, every step;
 *   - the R1 answer after the transfer (`holderOf`, owner audience) and whether it names the winner;
 *   - the chair's condition 1 (CS22): on a KEPT form that `holderOf.js :: isCrownedForm` reads crowned, the person
 *     `holderOf` names, its `personRule`, and the houses it KEEPS (rank 1) other than the seat's own; and the guard's read
 *     (CS22 (d)): towns where a card carries a crown word (`cultureOfficeTitles.js :: officeWordInfo(word).crown`, by its
 *     title, else its role) together with a house it keeps other than the seat's own;
 *   - FORCED BIRTHS, once per command when `--force-law <configKey>=<value>` is given (repeatable; U4's idiom: the keys set
 *     on the config `birthConfig` returns, then born, and read as born, no re-stamp): with `--force-law
 *     _seatLawVersion=2` the forced birth's first transfer must equal LAW's, and the run counts the towns where it does not.
 *
 * Every rate is UNDER TODAY'S STANDING (RULINGS Addendum 6 (4): FORTUNE-1's standing law, dark, will move who contends).
 * The figures read a faction's `power` (the contest's weight); another unit raises stored weights in NEW towns.
 *
 *   node docs/chair/2026-11-20/content/seat/u5/measure-u5.mjs [--force-law _seatLawVersion=2]... [--n N] [--presets-n N]
 * Writes u5-transfer.json / u5-transfer.md beside this file.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '../../../../../..');
const imp = (p) => import(join(ROOT, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { coupContenders } = await imp('src/domain/rulingPowerCoup.js');
const { governingFactionOf, nameOf, transferRulingPower } = await imp('src/domain/rulingPower.js');
const { contestKindOf, pairLicense, seatBandOf } = await imp('src/domain/seat/seatTable.js');
const { holderOf, isCrownedForm, transferSentenceSays, transferTakerOf } = await imp('src/domain/seat/holderOfSeat.js');
const { seatCircumstancesOf } = await imp('src/domain/seat/seatCircumstances.js');
const { officeWordInfo } = await imp('src/data/cultureOfficeTitles.js');
const { ARCHETYPES, archetypePatch } = await imp('src/components/generate/characterPresets.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');

const args = process.argv.slice(2);
const argOf = (flag, fallback) => { const i = args.indexOf(flag); return i >= 0 && args[i + 1] != null ? args[i + 1] : fallback; };
/** `--force-law k=v`, repeatable (U4's reader). @returns {Record<string, unknown>} */
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
const STEPS = 3;
await loadGenerationLawPayloads();

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const PRESETS = ARCHETYPES.map((a) => a.key).filter((k) => k !== 'balanced');
const POOLS = {
  default: TIERS.flatMap((tier) => Array.from({ length: N_DEFAULT }, (_, i) => ({ tier, preset: null, seed: `seat-measure-${tier}-${i}`, config: { settType: tier } }))),
  presets: TIERS.flatMap((tier) => PRESETS.flatMap((preset) => Array.from({ length: N_PRESETS }, (_, i) => ({ tier, preset, seed: `seat-measure-${tier}-${preset}-${i}`, config: { settType: tier, ...archetypePatch(preset) } })))),
};
const BANDS = ['small', 'town', 'large'];
const CLASSES = ['own', 'civic', 'licensed held', 'licensed not held', 'fallback', 'none'];
const bump = (m, k, by = 1) => { m[k] = (m[k] || 0) + by; };
const lawOf = (s) => ({ ...s, config: { ...(s.config || {}), _seatLawVersion: 2 } });

/** The distinct takers R1's matcher reads on the current form. */
function r1Takers(s) {
  const form = nameOf(governingFactionOf(s));
  const takers = new Set();
  for (const rel of s.powerStructure?.factionRelationships || []) {
    if (!Array.isArray(rel?.pair) || !rel.pair.includes(form)) continue;
    const taker = rel.pair.find((n) => n !== form);
    if (taker && transferSentenceSays(rel.narrative, 'edge', taker, form)) takers.add(taker);
  }
  return [...takers];
}

/** Addendum 3's read, two witnesses: holderOf's answer, and the leaf's predicate over the exported matcher. */
function unattributed(s) {
  const form = nameOf(governingFactionOf(s));
  if (transferTakerOf(s, form) !== null) return { byAnswer: false, byPredicate: false };
  const h = holderOf(s, { audience: 'owner' });
  const byAnswer = h.rule === 'R1' && h.holderName === null && h.refused === false;
  const byPredicate = (s.powerStructure?.factionRelationships || []).some((rel) => rel && Array.isArray(rel.pair) && rel.pair.includes(form)
    && rel.pair.some((n) => typeof n === 'string' && n && n !== form && transferSentenceSays(rel.narrative, 'edge', n, null)));
  return { byAnswer, byPredicate };
}

/** The cards carrying a crown word that keep (rank 1) a house other than the seat's own (CS22 (d)). */
function crownedKeepers(s, bare = false) {
  const seat = nameOf(governingFactionOf(s));
  // the leading article dropped (unless `bare`): birth titles the monarch "the monarch", which officeWordInfo alone does
  // not read; `bare` is the guard's read as CS22 (d) spells it, officeWordInfo on the word as the card carries it
  return (s.npcs || []).filter((npc) => [npc?.title, npc?.role].some((w) => officeWordInfo(bare ? w : String(w ?? '').replace(/^the\s+/i, ''))?.crown === true)
    && (npc?.memberships || []).some((m) => m?.rank === 1 && m.power !== seat));
}

/** One coup by the heaviest contender of `s` (on `s`'s own law). @returns {{ next: object, winner: string, cls: string } | null} */
function coup(s) {
  const field = coupContenders(s).challengers;
  if (!field.length) return null;
  const winner = field[0].name;
  const form = nameOf(governingFactionOf(s));
  const row = (s.powerStructure.factions || []).find((f) => nameOf(f) === winner);
  const { pair, circumstance } = pairLicense(contestKindOf(row), form);
  const held = pair === 'licensed' ? seatCircumstancesOf(s).includes(circumstance) : null;
  const cls = pair === 'licensed' ? `licensed ${held ? 'held' : 'not held'}` : pair;
  const r = transferRulingPower(s, winner, { cause: 'coup', tick: 1, losers: field.slice(1).map((c) => c.name), seatCircumstances: () => seatCircumstancesOf(s) });
  if (r.error) return { next: s, winner, cls, error: r.error, form, toForm: form };
  return { next: r.settlement, winner, cls, form, toForm: nameOf(governingFactionOf(r.settlement)) };
}

const fresh = () => ({ towns: 0, noContender: 0, errors: 0, kept: 0, renamed: 0, cls: {}, r1Winner: 0, r1Other: {}, twoTakers: Array(STEPS).fill(0),
  unattributedByAnswer: Array(STEPS).fill(0), unattributedByPredicate: Array(STEPS).fill(0), twoTakerTowns: [],
  retiredEdges: 0, retiredInList: 0, retiredReadAsEdge: 0 });

const t0 = Date.now();
const out = { meta: { script: 'docs/chair/2026-11-20/content/seat/u5/measure-u5.mjs', standing: "under today's standing", forced: FORCED, steps: STEPS, n: { default: N_DEFAULT, presets: N_PRESETS } }, pools: {} };
for (const [pool, jobs] of Object.entries(POOLS)) {
  const r = { towns: 0, birthErrors: 0, old: {}, law: {}, crown: { keptCrowned: 0, personRule: {}, personKeepsOther: 0, personMemberOther: 0, personCrownWord: 0, noPerson: 0, towns: [], guardTowns: [], guardBareTowns: [], guardBornTowns: [], guardIsPerson: 0 },
    winnerDiffers: 0, forced: FORCING ? { errors: 0, differs: [] } : null };
  for (const b of BANDS) { r.old[b] = fresh(); r.law[b] = fresh(); }
  for (const job of jobs) {
    let born;
    try { born = generateSettlementPipeline(birthConfig(job.config), null, { seed: job.seed, customContent: {} }); } catch { r.birthErrors += 1; continue; }
    r.towns += 1;
    const band = seatBandOf(job.tier);
    let lawFirst = null;
    for (const [label, start] of [['old', born], ['law', lawOf(born)]]) {
      const t = r[label][band];
      t.towns += 1;
      let s = start;
      for (let step = 0; step < STEPS; step += 1) {
        const c = coup(s);
        if (!c) { if (step === 0) t.noContender += 1; break; }
        if (c.error) { if (step === 0) t.errors += 1; break; }
        s = c.next;
        if (step === 0) {
          if (label === 'law') lawFirst = { winner: c.winner, json: JSON.stringify(s.powerStructure) };
          if (c.toForm === c.form) t.kept += 1; else t.renamed += 1;
          bump(t.cls, c.cls);
          const h = holderOf(s, { audience: 'owner' });
          if (h.rule === 'R1' && h.holderName === c.winner) t.r1Winner += 1; else bump(t.r1Other, `${h.rule}:${h.holderName ?? '-'}`);
          // the chair's condition 1: a kept crowned form
          if (label === 'law' && c.toForm === c.form && isCrownedForm(c.form, s.tier)) {
            r.crown.keptCrowned += 1;
            bump(r.crown.personRule, h.personRule);
            const p = h.person;
            if (!p) r.crown.noPerson += 1;
            const keeps = (p?.memberships || []).filter((m) => m?.rank === 1 && m.power !== c.form).map((m) => m.power);
            const member = (p?.memberships || []).filter((m) => m?.power !== c.form).map((m) => `${m.power}#${m.rank}`);
            if (keeps.length) r.crown.personKeepsOther += 1;
            if (member.length) r.crown.personMemberOther += 1;
            r.crown.towns.push({ seed: job.seed, form: c.form, winner: c.winner, person: p?.name ?? null, title: p?.title ?? p?.role ?? null, personRule: h.personRule, keeps, member });
            const guard = crownedKeepers(s);
            if ([p?.title, p?.role].some((w) => officeWordInfo(String(w ?? '').replace(/^the\s+/i, ''))?.crown === true)) r.crown.personCrownWord += 1;
            if (guard.length) r.crown.guardTowns.push({ seed: job.seed, cards: guard.map((n) => `${n.name} (${n.title || n.role})`) });
            if (crownedKeepers(s, true).length) r.crown.guardBareTowns.push(job.seed);
            // the same read on the town BEFORE the transfer (no card is touched by it): what was there at birth
            if (crownedKeepers(start).length) r.crown.guardBornTowns.push(job.seed);
            // the cards the guard reads that are the person holderOf names
            if (p && guard.includes(p)) r.crown.guardIsPerson += 1;
          }
        }
        const takers = r1Takers(s);
        if (takers.length > 1) { t.twoTakers[step] += 1; if (t.twoTakerTowns.length < 12) t.twoTakerTowns.push({ seed: job.seed, step: step + 1, takers }); }
        // the retired edges this coup wrote (competitive, naming the winner): each in the list's ONE 'retiredEdge' wording, none an 'edge'
        for (const rel of s.powerStructure?.factionRelationships || []) {
          if (rel?.type !== 'competitive' || !String(rel.narrative).endsWith(` until ${c.winner} took it.`)) continue;
          t.retiredEdges += 1;
          if (transferSentenceSays(rel.narrative, 'retiredEdge', c.winner, c.form)) t.retiredInList += 1;
          if ((rel.pair || []).some((n) => transferSentenceSays(rel.narrative, 'edge', n, null))) t.retiredReadAsEdge += 1;
        }
        const u = unattributed(s);
        if (u.byAnswer) t.unattributedByAnswer[step] += 1;
        if (u.byPredicate) t.unattributedByPredicate[step] += 1;
      }
    }
    if (FORCING) {
      let f;
      try { f = generateSettlementPipeline({ ...birthConfig(job.config), ...FORCED }, null, { seed: job.seed, customContent: {} }); } catch { r.forced.errors += 1; continue; }
      const c = coup(f);
      const got = c && !c.error ? { winner: c.winner, json: JSON.stringify(c.next.powerStructure) } : null;
      if (JSON.stringify(got) !== JSON.stringify(lawFirst)) r.forced.differs.push(job.seed);
    }
  }
  out.pools[pool] = r;
}
out.meta.seconds = Math.round((Date.now() - t0) / 1000);
writeFileSync(join(HERE, 'u5-transfer.json'), `${JSON.stringify(out, null, 1)}\n`);

// ── the page ──────────────────────────────────────────────────────────────────────────────────────────────────────
const pct = (a, b) => (b ? `${Math.round((1000 * a) / b) / 10}%` : '-');
const forcedLabel = FORCING ? Object.entries(FORCED).map(([k, v]) => ` --force-law ${k}=${v}`).join('') : '';
const L = [
  '# U5 acceptance: the built transfer on the proposal\'s two pools (every rate under today\'s standing)',
  '',
  `One command: \`node ${out.meta.script}${forcedLabel}\` (${out.meta.seconds} s). Per town the heaviest contender (\`coupContenders(s).challengers[0]\` on that law's record) `
    + 'takes the seat by coup through `transferRulingPower`, the circumstances handed in as the coup path would hand them; OLD = the town as born; '
    + `LAW = the same record with \`_seatLawVersion: 2\`. Then a second and a third coup in a row, each by the heaviest contender of the moment.${FORCING ? ' FORCED = the town born with the forced keys, its first transfer compared with LAW\'s.' : ''}`,
  '',
];
for (const [pool, r] of Object.entries(out.pools)) {
  L.push(`## ${pool} (${r.towns} towns, ${r.birthErrors} birth errors), under today's standing`, '');
  L.push('| band | law | towns | no contender | KEPT | RENAMED | own | civic | licensed held | licensed not held | fallback | none | R1 names the winner | R1 > 1 taker after coup 1 · 2 · 3 | unattributed (answer / predicate) after 1 · 2 · 3 |');
  L.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const b of BANDS) for (const law of ['old', 'law']) {
    const t = r[law][b];
    const moved = t.kept + t.renamed;
    L.push(`| ${b} | ${law.toUpperCase()} | ${t.towns} | ${t.noContender} | ${t.kept} (${pct(t.kept, moved)}) | ${t.renamed} (${pct(t.renamed, moved)}) | ${CLASSES.map((k) => t.cls[k] || 0).join(' | ')} | ${t.r1Winner} of ${moved} | ${t.twoTakers.join(' · ')} | ${t.unattributedByAnswer.join(' · ')} / ${t.unattributedByPredicate.join(' · ')} |`);
  }
  const sum = (law, key) => BANDS.reduce((a, b) => a + (Array.isArray(r[law][b][key]) ? r[law][b][key].reduce((x, y) => x + y, 0) : r[law][b][key]), 0);
  L.push('', `Totals: OLD kept ${sum('old', 'kept')}, renamed ${sum('old', 'renamed')}; LAW kept ${sum('law', 'kept')} (${pct(sum('law', 'kept'), sum('law', 'kept') + sum('law', 'renamed'))}, under today's standing), renamed ${sum('law', 'renamed')}. `
    + `**R1 answers more than one taker: LAW ${sum('law', 'twoTakers')} (all three coups), OLD ${sum('old', 'twoTakers')}.** `
    + `Retired edges written (LAW): ${sum('law', 'retiredEdges')}, in the 'retiredEdge' wording ${sum('law', 'retiredInList')}, read as an 'edge' wording ${sum('law', 'retiredReadAsEdge')}. `
    + `**The unattributed read (the fail-closed rule, \`unattributedTransferOn\`) fires: LAW ${sum('law', 'unattributedByAnswer')} by the answer, ${sum('law', 'unattributedByPredicate')} by the predicate**; OLD ${sum('old', 'unattributedByAnswer')} / ${sum('old', 'unattributedByPredicate')}.`);
  const other = Object.assign({}, ...BANDS.map((b) => r.law[b].r1Other));
  if (Object.keys(other).length) L.push('', `LAW, R1 not naming the winner after the first coup: ${JSON.stringify(other)}.`);
  const oldTwo = BANDS.flatMap((b) => r.old[b].twoTakerTowns);
  if (oldTwo.length) L.push('', `OLD, the two-taker towns (first ${oldTwo.length}): ${oldTwo.map((x) => `${x.seed} after coup ${x.step} (${x.takers.join(' + ')})`).join('; ')}.`);
  const lawTwo = BANDS.flatMap((b) => r.law[b].twoTakerTowns);
  if (lawTwo.length) L.push('', `LAW, the two-taker towns: ${lawTwo.map((x) => `${x.seed} after coup ${x.step} (${x.takers.join(' + ')})`).join('; ')}.`);
  const c = r.crown;
  L.push('', `### The chair's condition 1 (CS22): ${c.keptCrowned} towns keep a crowned form under the law`, '',
    `personRule: ${JSON.stringify(c.personRule)}; no person: ${c.noPerson}; **the person KEEPS (rank 1) a house other than the seat's own: ${c.personKeepsOther}**; `
    + `the person is a member (any rank) of another house: ${c.personMemberOther}; the person's title reads a crown word: ${c.personCrownWord}. **The guard's read (a card with a crown word keeping another house), the article dropped: ${c.guardTowns.length} towns; `
    + `the same read on the town BEFORE the transfer: ${c.guardBornTowns.length}; the guard's card is the person holderOf names: ${c.guardIsPerson}; `
    + `the bare read (officeWordInfo on the word as carried): ${c.guardBareTowns.length} towns.**`);
  if (c.towns.length) {
    L.push('', '| seed | form | winner | person (title) | personRule | keeps | member of |', '|---|---|---|---|---|---|---|');
    for (const x of c.towns) L.push(`| ${x.seed} | ${x.form} | ${x.winner} | ${x.person ?? '-'} (${x.title ?? '-'}) | ${x.personRule} | ${x.keeps.join(', ') || '-'} | ${x.member.join(', ') || '-'} |`);
  }
  if (c.guardTowns.length) L.push('', `Guard towns: ${c.guardTowns.map((g) => `${g.seed}: ${g.cards.join(', ')}`).join('; ')}.`);
  if (FORCING) L.push('', `FORCED births: ${r.forced.errors} errors; towns whose forced first transfer differs from LAW's: ${r.forced.differs.length}${r.forced.differs.length ? ` (${r.forced.differs.slice(0, 8).join(', ')})` : ''}.`);
  L.push('');
}
writeFileSync(join(HERE, 'u5-transfer.md'), `${L.join('\n')}\n`);
console.log(`[measure-u5] ${Object.entries(out.pools).map(([p, r]) => `${p}: ${r.towns} towns`).join('; ')} (${out.meta.seconds} s)`);
