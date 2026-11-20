#!/usr/bin/env node
/**
 * docs/chair/2026-11-20/content/seat/u4cure2/measure-u4cure2.mjs — U4-CURE2's Step 0 (builder B4d, 2026-11-20): can R1's
 * taker be read from the transfer edge's STRUCTURED keys alone (`pair`, `type`, `direction`), never its sentence? Measures;
 * changes nothing under src/. The pools are `../measure-holder.mjs`'s own (the same seeds, the same configs, through
 * `birthConfig`: today's births).
 *
 * ONE COMMAND, BOTH POOLS. Per pool it reports:
 *   (a) at birth, the towns where some edge's `pair` holds the current form (the governing row's name) and another
 *       power's row, with `type === 'symbiotic' && direction === 'stable'`: the false R1 a structured read would answer,
 *       by size, with the other power's kind (`seatTable.js :: contestKindOf`); beside it the shipped sentence read
 *       (`holderOfSeat.js :: transferTakerOf`, restated here verbatim) at birth;
 *   (b) after one, two and three transfers through the real `rulingPower.js :: transferRulingPower` (the winner is
 *       `coupContenders(s).challengers[0]`, else the heaviest non-governing power, power then name in codepoint order),
 *       for cause `coup` and for cause `election` (a chain per cause): whether the structured-only read answers exactly
 *       the taker the sentence read answers, every difference counted by its shape; and whether the sentence read
 *       answers the real winner;
 *   (d) the other STRUCTURED fields a transfer writes, read as R1 would read them: the `previousGovernments` rows (they
 *       name the outgoing form, never the taker), and the winner's `ascendant` modifier (the unique non-governing row
 *       carrying it, and the row whose `ascendant` count is highest): at birth and after each transfer, how many towns
 *       each answers, and how many answer the sentence read's taker. (The `transfer` descriptor is returned, not stored.)
 *   (e) U4-CURE2 Addendum 3 (builder B4e; the chair 15:17Z, condition 2): the towns where the built leaf's new rule
 *       fires, a transfer R1 cannot attribute answering NOBODY (`holderOf` for the owner: `rule` 'R1' with no holder,
 *       which no other path of the leaf returns to the owner): at birth (it must be 0 on both pools; any other count
 *       stops the merge, with one town's record beside it) and, for information, after each real transfer.
 *
 *   node docs/chair/2026-11-20/content/seat/u4cure2/measure-u4cure2.mjs [--root <checkout>] [--n N] [--presets-n N]
 * `--root` defaults to the checkout this file sits in; run a scratch copy with `--root` so the outputs land beside the
 * copy. Writes u4cure2-step0.json / u4cure2-step0.md beside this file.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const argOf = (flag, fallback) => { const i = args.indexOf(flag); return i >= 0 && args[i + 1] != null ? args[i + 1] : fallback; };
const ROOT = resolve(argOf('--root', join(HERE, '../../../../../..')));
const imp = (p) => import(join(ROOT, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { coupContenders } = await imp('src/domain/rulingPowerCoup.js');
const { governingFactionOf, nameOf, transferRulingPower } = await imp('src/domain/rulingPower.js');
const { contestKindOf } = await imp('src/domain/seat/seatTable.js');
const { holderOf } = await imp('src/domain/seat/holderOfSeat.js');
const { ARCHETYPES, archetypePatch } = await imp('src/components/generate/characterPresets.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');

const N_DEFAULT = Number(argOf('--n', 150));
const N_PRESETS = Number(argOf('--presets-n', 10));
await loadGenerationLawPayloads();
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const PRESETS = ARCHETYPES.map((a) => a.key).filter((k) => k !== 'balanced');
const POOLS = {
  default: TIERS.flatMap((tier) => Array.from({ length: N_DEFAULT }, (_, i) => ({ tier, seed: `seat-measure-${tier}-${i}`, config: { settType: tier } }))),
  presets: TIERS.flatMap((tier) => PRESETS.flatMap((preset) => Array.from({ length: N_PRESETS }, (_, i) => ({ tier, seed: `seat-measure-${tier}-${preset}-${i}`, config: { settType: tier, ...archetypePatch(preset) } })))),
};
const CAUSES = ['coup', 'election'];
const STEPS = 3;
const num = (v) => (Number.isFinite(v) ? v : 0);
const bump = (m, k, by = 1) => { m[k] = (m[k] || 0) + by; };
const sorted = (m) => Object.fromEntries(Object.entries(m).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)));

// ── The shipped sentence read, restated verbatim from holderOfSeat.js (takerLine, transferSays, transferTakerOf) ──
const takerLine = (taker, form) => `${taker} is the power behind the ${form.toLowerCase()}. The seat answers to them now.`;
function transferSays(line, taker, form) {
  if (typeof line !== 'string') return false;
  const f = form.toLowerCase();
  return (line.startsWith(`${taker} overthrew the `) && line.endsWith(` and reshaped the government as a ${f}.`))
    || (line.startsWith(`Power passed to ${taker} by `) && line.includes(`; the government now sits as a ${f}`));
}
/** @param {(rel: any, taker: string, form: string) => boolean} match */
const readerWith = (match) => (settlement, form) => {
  const edges = settlement.powerStructure?.factionRelationships;
  const takers = [];
  for (const rel of Array.isArray(edges) ? edges : []) {
    if (!rel || !Array.isArray(rel.pair) || !rel.pair.includes(form)) continue;
    const taker = rel.pair.find((n) => n !== form);
    if (typeof taker !== 'string' || !taker || !match(rel, taker, form)) continue;
    if (!takers.includes(taker)) takers.push(taker);
  }
  if (takers.length < 2) return { taker: takers[0] ?? null, takers };
  const said = takers.filter((t) => transferSays(settlement.powerStructure?.recentConflict, t, form));
  return { taker: said.length === 1 ? said[0] : takers[takers.length - 1], takers };
};
/** today's R1 read (the sentence) */
const sentenceRead = readerWith((rel, taker, form) => rel.narrative === takerLine(taker, form));
/** the proposed R1 read (the structured keys only) */
const structuredRead = readerWith((rel) => rel.type === 'symbiotic' && rel.direction === 'stable');

/** the other structured fields, read as R1 would read them */
function ascendantReads(s) {
  const gov = governingFactionOf(s);
  const rows = (s.powerStructure?.factions || []).filter((f) => f && f !== gov);
  const counted = rows.map((f) => ({ name: nameOf(f), n: (Array.isArray(f.modifiers) ? f.modifiers : []).filter((m) => String(m) === 'ascendant').length })).filter((r) => r.n > 0);
  const unique = counted.length === 1 ? counted[0].name : null;
  const top = counted.length ? Math.max(...counted.map((r) => r.n)) : 0;
  const tops = counted.filter((r) => r.n === top);
  return { carriers: counted.length, unique, highest: tops.length === 1 ? tops[0].name : null };
}

/** the winner: coupContenders' first, else the heaviest non-governing power (power, then name in codepoint order) */
function winnerOf(s) {
  const first = coupContenders(s)?.challengers?.[0]?.name;
  if (first) return { name: first, by: 'contender' };
  const gov = governingFactionOf(s);
  const rows = (s.powerStructure?.factions || []).filter((f) => f && f !== gov && nameOf(f))
    .sort((a, b) => (num(b.power) - num(a.power)) || (nameOf(a) < nameOf(b) ? -1 : nameOf(a) > nameOf(b) ? 1 : 0));
  return rows[0] ? { name: nameOf(rows[0]), by: 'heaviest' } : null;
}

const results = {};
const t0 = Date.now();
for (const [pool, jobs] of Object.entries(POOLS)) {
  const R = {
    towns: 0, errors: 0,
    birth: { unattributed: 0, unattributedRecord: null, falseR1: 0, falseR1ByTier: {}, falseR1Kinds: {}, falseR1Pairs: {}, sentenceR1: 0, structuredMulti: 0, holderR1: 0, previousGovernments: 0, ascendantCarriers: 0, examples: [] },
    transfers: {},
  };
  for (const cause of CAUSES) for (let k = 1; k <= STEPS; k += 1) {
    R.transfers[`${cause}#${k}`] = { towns: 0, noWinner: 0, transferErrors: {}, winnerBy: {}, sentenceAnswersWinner: 0, sentenceNull: 0,
      same: 0, differ: 0, differShapes: {}, structuredMulti: 0, holderR1EqualsSentence: 0, ascendantUniqueEqualsSentence: 0,
      ascendantUniqueAnswers: 0, ascendantHighestEqualsSentence: 0, ascendantHighestAnswers: 0, unattributed: 0, examples: [] };
  }
  for (const job of jobs) {
    let s;
    try { s = generateSettlementPipeline(birthConfig(job.config), null, { seed: job.seed, customContent: {} }); } catch { R.errors += 1; continue; }
    R.towns += 1;
    // (a) at birth
    const gov = governingFactionOf(s);
    const form = nameOf(gov);
    const rowNames = new Set((s.powerStructure?.factions || []).filter((f) => f && f !== gov).map(nameOf));
    const falseEdges = (s.powerStructure?.factionRelationships || []).filter((rel) => rel && Array.isArray(rel.pair) && rel.pair.includes(form)
      && rel.pair.some((n) => n !== form && rowNames.has(n)) && rel.type === 'symbiotic' && rel.direction === 'stable');
    if (falseEdges.length) {
      R.birth.falseR1 += 1; bump(R.birth.falseR1ByTier, job.tier);
      for (const rel of falseEdges) {
        const other = rel.pair.find((n) => n !== form);
        const row = (s.powerStructure.factions || []).find((f) => f !== gov && nameOf(f) === other);
        bump(R.birth.falseR1Kinds, contestKindOf(row));
      }
      if (R.birth.examples.length < 12) R.birth.examples.push({ seed: job.seed, form, edges: falseEdges.map((r) => ({ pair: r.pair, type: r.type, direction: r.direction, narrative: r.narrative })) });
    }
    const bornSentence = sentenceRead(s, form);
    const bornStructured = structuredRead(s, form);
    if (bornSentence.taker) R.birth.sentenceR1 += 1;
    if (bornStructured.takers.length > 1) R.birth.structuredMulti += 1;
    const bornHolder = holderOf(s, { audience: 'owner' });
    if (bornHolder.rule === 'R1') R.birth.holderR1 += 1;
    // (e) the unattributed-transfer rule at birth: owner R1 with no holder
    if (bornHolder.rule === 'R1' && bornHolder.holder === null) {
      R.birth.unattributed += 1;
      if (!R.birth.unattributedRecord) R.birth.unattributedRecord = { seed: job.seed, tier: job.tier, form, powerStructure: s.powerStructure };
    }
    if ((s.powerStructure?.previousGovernments || []).length) R.birth.previousGovernments += 1;
    if (ascendantReads(s).carriers) R.birth.ascendantCarriers += 1;
    // (b) and (d): a chain of transfers per cause
    for (const cause of CAUSES) {
      let cur = s;
      for (let k = 1; k <= STEPS; k += 1) {
        const T = R.transfers[`${cause}#${k}`];
        const w = winnerOf(cur);
        if (!w) { T.noWinner += 1; break; }
        const out = transferRulingPower(cur, w.name, { cause });
        if (out.error) { bump(T.transferErrors, out.error); break; }
        cur = out.settlement;
        T.towns += 1; bump(T.winnerBy, w.by);
        const f = nameOf(governingFactionOf(cur));
        const a = sentenceRead(cur, f);
        const b = structuredRead(cur, f);
        if (a.taker === w.name) T.sentenceAnswersWinner += 1;
        if (a.taker === null) T.sentenceNull += 1;
        if (b.takers.length > 1) T.structuredMulti += 1;
        if (a.taker === b.taker) T.same += 1;
        else {
          T.differ += 1;
          const shape = `${b.taker === null ? 'structured null' : b.taker === w.name ? 'structured=winner' : 'structured=other'} / ${a.taker === null ? 'sentence null' : a.taker === w.name ? 'sentence=winner' : 'sentence=other'} (${b.takers.length} structured takers)`;
          bump(T.differShapes, shape);
          if (T.examples.length < 8) {
            const extra = (cur.powerStructure.factionRelationships || []).filter((rel) => rel && Array.isArray(rel.pair) && rel.pair.includes(f) && rel.type === 'symbiotic' && rel.direction === 'stable')
              .map((rel) => ({ pair: rel.pair, narrative: rel.narrative }));
            T.examples.push({ seed: job.seed, form: f, winner: w.name, sentence: a.taker, structured: b.taker, structuredTakers: b.takers, edges: extra });
          }
        }
        const h = holderOf(cur, { audience: 'owner' });
        if (h.rule === 'R1' && h.holder === null) T.unattributed += 1;
        if ((h.rule === 'R1' ? h.holderName : null) === a.taker) T.holderR1EqualsSentence += 1;
        const asc = ascendantReads(cur);
        if (asc.unique) T.ascendantUniqueAnswers += 1;
        if (asc.unique === a.taker) T.ascendantUniqueEqualsSentence += 1;
        if (asc.highest) T.ascendantHighestAnswers += 1;
        if (asc.highest === a.taker) T.ascendantHighestEqualsSentence += 1;
      }
    }
  }
  R.birth.falseR1Kinds = sorted(R.birth.falseR1Kinds);
  results[pool] = R;
  process.stderr.write(`pool ${pool}: ${R.towns} towns, ${R.errors} errors, ${Math.round((Date.now() - t0) / 1000)}s\n`);
}

const out = { meta: { script: 'docs/chair/2026-11-20/content/seat/u4cure2/measure-u4cure2.mjs', root: ROOT, n: N_DEFAULT, presetsN: N_PRESETS, seconds: Math.round((Date.now() - t0) / 1000) }, results };
writeFileSync(join(HERE, 'u4cure2-step0.json'), `${JSON.stringify(out, null, 1)}\n`);
const L = ['# U4-CURE2 Step 0: can R1 read the structured keys alone?', '',
  `Executed: \`node ${out.meta.script} --n ${N_DEFAULT} --presets-n ${N_PRESETS}\` (${out.meta.seconds}s). Raw: \`u4cure2-step0.json\`.`, ''];
for (const [pool, R] of Object.entries(results)) {
  L.push(`## Pool ${pool} (${R.towns} born towns, ${R.errors} errors)`, '',
    `**(a) false R1 at birth (a symbiotic/stable edge between the form and another power's row): ${R.birth.falseR1} towns.** By size: ${TIERS.map((t) => `${t} ${R.birth.falseR1ByTier[t] || 0}`).join(' · ')}. The other power's kind (per edge): ${Object.entries(R.birth.falseR1Kinds).map(([k, v]) => `${k} ${v}`).join(' · ') || 'none'}.`,
    `**(e) Addendum 3's rule (a transfer R1 cannot attribute answers nobody) fires at birth in ${R.birth.unattributed} towns${R.birth.unattributedRecord ? ` (first: ${R.birth.unattributedRecord.seed}; its record is in the JSON)` : ''}.** After each transfer: ${Object.entries(R.transfers).map(([k, T]) => `${k} ${T.unattributed}`).join(' · ')}.`,
    `Beside it at birth: the sentence read answers ${R.birth.sentenceR1}; the built leaf answers R1 in ${R.birth.holderR1}; the structured read finds two or more takers in ${R.birth.structuredMulti}; towns with a previousGovernments row ${R.birth.previousGovernments}; with an ascendant row ${R.birth.ascendantCarriers}.`, '',
    '**(b) after each transfer: the structured read against the sentence read**', '',
    '| chain | towns | sentence = winner | same | differ | structured 2+ takers | built R1 = sentence | ascendant unique answers / = sentence | ascendant highest answers / = sentence | difference shapes |',
    '|---|---|---|---|---|---|---|---|---|---|');
  for (const [key, T] of Object.entries(R.transfers)) {
    L.push(`| ${key} | ${T.towns} | ${T.sentenceAnswersWinner} | ${T.same} | ${T.differ} | ${T.structuredMulti} | ${T.holderR1EqualsSentence} | ${T.ascendantUniqueAnswers} / ${T.ascendantUniqueEqualsSentence} | ${T.ascendantHighestAnswers} / ${T.ascendantHighestEqualsSentence} | ${Object.entries(sorted(T.differShapes)).map(([k, v]) => `${k}: ${v}`).join('; ') || '-'} |`);
  }
  L.push('', `Winners: ${Object.entries(R.transfers).map(([k, T]) => `${k} ${Object.entries(T.winnerBy).map(([b, v]) => `${b} ${v}`).join('/')}${T.noWinner ? ` (no winner ${T.noWinner})` : ''}${Object.keys(T.transferErrors).length ? ` (errors ${JSON.stringify(T.transferErrors)})` : ''}`).join(' · ')}`, '');
  L.push('Examples, birth:');
  for (const e of R.birth.examples.slice(0, 6)) L.push(`- ${e.seed} (${e.form}): ${e.edges.map((r) => `[${r.pair.join(' / ')}] "${r.narrative}"`).join(' ; ')}`);
  L.push('', 'Examples, after a transfer:');
  for (const [key, T] of Object.entries(R.transfers)) for (const e of T.examples.slice(0, 2)) L.push(`- ${key} ${e.seed} (${e.form}, winner ${e.winner}): sentence ${e.sentence ?? '-'} · structured ${e.structured ?? '-'} of [${e.structuredTakers.join(', ')}]`);
  L.push('');
}
writeFileSync(join(HERE, 'u4cure2-step0.md'), `${L.join('\n')}\n`);
process.stderr.write(`wrote u4cure2-step0 (${out.meta.seconds}s)\n`);
