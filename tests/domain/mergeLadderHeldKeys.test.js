/**
 * tests/domain/mergeLadderHeldKeys.test.js — EM-R8's eight acceptance arms.
 *
 * THE LAW: the merge's deterministic escalation ladder repairs a violated invariant by taking
 * keys from `R1`, and a key whose `RECORD_CLASSES` class is HELD is never among them (design §22
 * ruling 9: with an edit, no UNEDITED held fact moves). A reading that disagrees with a held fact
 * is brought up to date by RESTATING THE READING, never by overwriting the fact — so the coherence
 * receipt's two PROSE-COUNT evidence rows are a MIRROR of the merged record, recomputed after the
 * merge exactly as `factions[].members[]` already is.
 *
 * ⛔ WHAT THIS FILE EXISTS TO PREVENT, MEASURED AT `a545899ff` BEFORE THE CURE: adjusting one
 * faction's power share DELETED a named person from a saved village — `The High Priestess` left
 * `village|germanic|hills|road|civilized|golden-master-v3` — while the delta card reported
 * `cured: true`. Over the eight-edit census the tip moved a HELD key in 66 of 498 trials and a
 * named person in 26 of them. A1 is that red, standing.
 *
 * ⛔ THREE CONSTRUCTION RULES (packet §6), each with its own instrument:
 *   1. `it`, `test` and `describe` are bound EXACTLY ONCE each, never re-bound, not even as an
 *      arrow parameter: the sovereignty-lighting census parks a whole file for that alone.
 *   2. Every loop COLLECTS and the arm asserts ONCE after it — `seedLoopTotality.walker.test.js`
 *      convicts a `for (` line carrying `seed` whose body holds a bare `expect(`, and
 *      `tests/domain` sits in its SHRINK-ONLY frozen habitat, so a conviction cannot be absorbed.
 *   3. Every set an arm iterates is IMPORTED from the register or DERIVED by running the real
 *      generator; no local literal copy of a declaration table.
 *
 * THE STRIDE IS DERIVED FROM `goldenCorpus()` and NO FIXTURE IS COMMITTED — the same 63-row
 * structured sample `tests/domain/recordMerge.test.js` and `tests/lint/recordRegisterTotality
 * .walker.test.js` derive, so three instruments cannot come to disagree about which world they
 * measured. THE CENSUS IS BUILT ONCE and shared by A1, A2, A3, A5 and A6.
 *
 * CANNOT-CATCH:
 * 1.  The CONFIG CHANNEL's own repair. E7 and E8 drive a world-fact change with a DORMANT layer
 *     (`worldFacts` is read by nobody until EM-B2b), so `R1` there is a plain generation of a
 *     DIFFERENT town. A2 records what the cure leaves live on that channel — `V-DEFENSE-INST` 31
 *     and `V-EVIDENCE-CONFLICT` 22 — and EM-B2b owns the seam. This file does not close it.
 * 2.  ⛔ THE LADDER'S RUNG WRITES AT THE TOP-LEVEL KEY, so a declared HISTORY or AUTHORED
 *     SUB-PATH under a READING key is not protected by `CLASS_EXCEPTIONS` the way the tree merge
 *     protects it. Measured at `a545899ff`: `generationCoherenceReceipt.repairs` moves in 12 of
 *     the 120 config-channel trials, BEFORE this member and after it alike, in every case because
 *     a rung took `generationCoherenceReceipt` whole from `R1`. A5 asserts exactly that shape and
 *     no figure of it; the cure is not this member's.
 * 3.  `V-EVIDENCE-EVENTS` has NO POPULATION in this corpus: the generated narrative evidence
 *     agrees with `history.historicalEvents` in 498 of 498 trials. A8 is therefore a CONSTRUCTED
 *     positive control with its own counterforce, and the corpus proves nothing about it.
 *     The five `powerStructure`-keyed checks and `V-FLAGVEC`'s power arm likewise have a measured
 *     population of ZERO, so nothing here says what the filter does to their ladders in anger.
 * 4.  The 1,890-pair ordered census and the 498/498 ratchet headline. A7 runs a NAMED five-row
 *     subset that carries every disagreement the tip produces for its eight pairs; the whole
 *     census is `tests/property/editCorpusRatchet.test.js`'s (EM-R7), which lands after this.
 * 5.  The byte price. Nothing in `src/` imports `mergeConsequence.js`, so no emitted chunk holds
 *     it; the apply point prices it when it first imports the leaf.
 */
import { describe, it, expect } from 'vitest';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { getStepMeta } from '../../src/generators/pipeline.js';
import { rederive } from '../../src/domain/edit/dmLayer.js';
import { declarationsFor } from '../../src/domain/edit/fieldDeclarations.js';
import { mergeConsequence, recomputeMirrors, recomputeReceipts } from '../../src/domain/edit/mergeConsequence.js';
import { mergeTree } from '../../src/domain/edit/recordMergeTree.js';
import { recordInvariants } from '../../src/domain/edit/recordInvariants.js';
import { ATOMIC_COLLECTIONS, CLASS_EXCEPTIONS, RECORD_CLASSES } from '../../src/domain/edit/recordRegister.js';
import { renormalizeFactionPower } from '../../src/generators/power/rulingStructure.js';

const ENGINE = Object.freeze({ run: generateSettlementPipeline, getStepMeta });
const DECLARATIONS = Object.freeze({ declarationsFor });
const EMPTY = Object.freeze({ roots: {}, worldFacts: {}, minted: {}, phantoms: {} });
const SLOW = 300_000;
const EVIDENCE_PATH = 'generationCoherenceReceipt.judgments[].evidence';
const ROSTER_RE = /(\d+)\s+NPCs?\s*\/\s*(\d+)\s+relationships?/;
const EVENTS_RE = /(\d+)\s+historical events?/;

const h = (value) => JSON.stringify(value);
const cl = (value) => structuredClone(value);
const layerOf = (pairs) => ({ roots: Object.fromEntries(pairs), worldFacts: {}, minted: {}, phantoms: {} });

/** The HELD denominator, DERIVED from the register and never re-typed. */
const HELD_KEYS = Object.entries(RECORD_CLASSES).filter(([, cls]) => cls === 'HELD').map(([key]) => key);

/** The 63-row structured sample, from `goldenCorpus()` alone. */
function sample63() {
  const all = goldenCorpus();
  const seen = new Set();
  const oneEach = [];
  for (const row of all.slice(0, 504)) {
    const pair = `${row.settType}|${row.terrainOverride}`;
    if (seen.has(pair)) continue;
    seen.add(pair);
    oneEach.push(row);
  }
  return [...oneEach, ...all.slice(504)];
}

/** The record's HELD keys with the two DECLARED exceptions blanked, so a real held-fact move is
 *  told apart from `factions[].members[]` (MIRROR) and `powerStructure.economyInputFingerprint`
 *  (RECEIPT), both of which §22.2 item 7 declares RECOMPUTED after every merge. */
function heldMinusDeclared(card) {
  const out = {};
  for (const key of HELD_KEYS) {
    if (card[key] === undefined) continue;
    const value = cl(card[key]);
    if (key === 'factions' && Array.isArray(value)) {
      for (const faction of value) if (faction && typeof faction === 'object') delete faction.members;
    }
    if (key === 'powerStructure' && value && typeof value === 'object') delete value.economyInputFingerprint;
    out[key] = value;
  }
  return out;
}
const movedHeld = (before, after) => HELD_KEYS.filter((key) => h(before[key]) !== h(after[key]));
const namesOf = (roster) => (Array.isArray(roster) ? roster.map((person) => String(person && (person.name ?? person.id))) : []);

/** Every judgment-evidence row of a record, flattened in judgment order. */
const evidenceRows = (card) => (card?.generationCoherenceReceipt?.judgments || [])
  .flatMap((judgment) => (judgment && Array.isArray(judgment.evidence) ? judgment.evidence : []))
  .filter((row) => row && typeof row === 'object');
const rowAt = (card, path) => evidenceRows(card).find((row) => row.path === path);
/** The evidence text with EVERY digit run masked — the "no other character moved" reading. */
const masked = (card) => evidenceRows(card)
  .map((row) => `${row.path} :: ${String(row.evidence).replace(/\d+/g, '#')}`).join(' | ');

/** THE EIGHT EDITS, in EM-R7's own behaviour: four layer ops, two power-card ops, two world facts. */
const LAYER_EDITS = ['E1 npc name', 'E2 npc role', 'E3 remove institution', 'E4 add institution', 'E5 faction share', 'E6 seat'];
const EDITS = [
  ['E1 npc name', (card) => {
    const person = card.npcs?.[1];
    if (!person) return null;
    const record = cl(card);
    record.npcs[1].name = 'Aldhelm Prufstein';
    return { record, layer: layerOf([[`npc:${person.id}:name`, 'Aldhelm Prufstein']]), config: null };
  }],
  ['E2 npc role', (card) => {
    const person = card.npcs?.[1];
    if (!person) return null;
    const record = cl(card);
    record.npcs[1].role = 'Harbourmaster';
    return { record, layer: layerOf([[`npc:${person.id}:role`, 'Harbourmaster']]), config: null };
  }],
  ['E3 remove institution', (card) => {
    if ((card.institutions || []).length < 2) return null;
    const record = cl(card);
    record.institutions.splice(1, 1);
    return { record, layer: EMPTY, config: null };
  }],
  ['E4 add institution', (card) => {
    const source = card.institutions?.[0];
    if (!source) return null;
    const record = cl(card);
    record.institutions.push({ ...cl(source), name: `${source.name} Annex`, source: 'dm', catalogId: 'dm_annex' });
    return { record, layer: EMPTY, config: null };
  }],
  ['E5 faction share', (card) => {
    const factions = card.powerStructure?.factions || [];
    if (factions.length < 2) return null;
    const record = cl(card);
    const target = record.powerStructure.factions[1];
    target.power = Math.max(1, Math.round((target.power || 20) * 0.5));
    renormalizeFactionPower(record.powerStructure.factions);
    return { record, layer: layerOf([[`faction:${factions[1].faction}:power`, record.powerStructure.factions[1].power]]), config: null };
  }],
  ['E6 seat', (card) => {
    const factions = card.powerStructure?.factions || [];
    if (factions.length < 2) return null;
    const seated = factions.findIndex((faction) => faction.isGoverning);
    const next = factions.findIndex((faction, at) => at !== seated);
    if (next < 0) return null;
    const record = cl(card);
    record.powerStructure.factions.forEach((faction, at) => { faction.isGoverning = at === next; });
    record.powerStructure.governingName = factions[next].faction;
    return { record, layer: layerOf([[`powerSeat:${factions[next].faction}:holder`, factions[next].faction]]), config: null };
  }],
  ['E7 terrain to desert', (card, config) => (config.terrainOverride === 'desert' ? null
    : { record: cl(card), layer: EMPTY, config: { ...config, terrainOverride: 'desert' } })],
  ['E8 culture to norse', (card, config) => (config.culture === 'norse' ? null
    : { record: cl(card), layer: EMPTY, config: { ...config, culture: 'norse' } })],
];

const vkey = (violation) => `${violation.id}@${violation.path}`;

/** THE CENSUS, built ONCE: the eight edits over the 63-row stride, through the REAL re-derivation
 *  and the REAL merge, with every fact the arms below read collected per trial. */
let census = null;
function trials() {
  if (census !== null) return census;
  const rows = [];
  for (const row of sample63()) {
    const { _seed: seed, ...config } = row;
    const key = keyOf(row);
    const base = generateSettlementPipeline(config, null, { seed, customContent: {} });
    const R0 = rederive(base, config, EMPTY, ENGINE, DECLARATIONS).record;
    for (const [label, plan] of EDITS) {
      const built = plan(base, config);
      if (built === null) continue;
      const R1 = rederive(built.record, built.config || config, built.layer, ENGINE, DECLARATIONS).record;
      const out = mergeConsequence(built.record, cl(R0), cl(R1), { edit: { id: label, opType: label } });
      const merged = out.record;
      const pure = mergeTree(cl(built.record), cl(R0), cl(R1)).value;
      const pipeline = cl(pure);
      recomputeMirrors(pipeline);
      recomputeReceipts(pipeline);
      const exempt = new Set([...recordInvariants(base).map(vkey), ...recordInvariants(built.record).map(vkey),
        ...recordInvariants(R1).map(vkey)]);
      const live = recordInvariants(merged).filter((violation) => !exempt.has(vkey(violation)));
      const wasNames = namesOf(built.record.npcs);
      const nowNames = namesOf(merged.npcs);
      const graph = rowAt(merged, 'finalGraph');
      const narrative = rowAt(merged, 'narrative');
      const statedGraph = graph ? String(graph.evidence).match(ROSTER_RE) : null;
      const statedEvents = narrative ? String(narrative.evidence).match(EVENTS_RE) : null;
      rows.push({
        key,
        label,
        layerChannel: LAYER_EDITS.includes(label),
        escalations: out.delta.escalations,
        live: live.map((violation) => violation.id),
        heldMoved: movedHeld(heldMinusDeclared(built.record), heldMinusDeclared(merged)),
        gone: wasNames.filter((name) => !nowNames.includes(name)),
        arrived: nowNames.filter((name) => !wasNames.includes(name)),
        statedGraph: statedGraph ? [Number(statedGraph[1]), Number(statedGraph[2])] : null,
        statedEvents: statedEvents ? Number(statedEvents[1]) : null,
        rosters: [merged.npcs.length, merged.relationships.length, merged.history.historicalEvents.length],
        maskedMerged: masked(merged),
        maskedPure: masked(pure),
        repairsSame: h(built.record.generationCoherenceReceipt?.repairs) === h(merged.generationCoherenceReceipt?.repairs),
        rungTookReceipt: out.delta.escalations.some((step) => String(step.scope).split(',').includes('generationCoherenceReceipt')),
        mergedIsPipeline: h(merged) === h(pipeline),
      });
    }
  }
  census = rows;
  return census;
}

/** The 126 POWER-CARD trials — probe 13's shape: the 63 rows crossed with E5 and E6. */
const powerCard = () => trials().filter((trial) => trial.label === 'E5 faction share' || trial.label === 'E6 seat');

describe('EM-R8 — the escalation ladder never overwrites a HELD key, and the receipt mirrors the merged record', () => {
  it('A1 · the named-person law: no rung moves a HELD key and nobody leaves or joins the roster', () => {
    const all = trials();
    const power = powerCard();
    expect(all.length, 'the eight-edit census over the 63-row derived stride').toBe(498);
    expect(power.length, 'the 126 power-card trials the defect was first measured on').toBe(126);
    expect(HELD_KEYS.length, 'the HELD denominator is imported from the register, never re-typed').toBe(10);

    const movedOnPowerCard = power.filter((trial) => trial.heldMoved.length > 0).map((trial) => `${trial.label} ${trial.key} -> ${h(trial.heldMoved)}`);
    const movedAnywhere = all.filter((trial) => trial.heldMoved.length > 0).map((trial) => `${trial.label} ${trial.key} -> ${h(trial.heldMoved)}`);
    const lost = all.filter((trial) => trial.gone.length > 0).map((trial) => `${trial.label} ${trial.key} LOST ${h(trial.gone)}`);
    const invented = all.filter((trial) => trial.arrived.length > 0).map((trial) => `${trial.label} ${trial.key} INVENTED ${h(trial.arrived)}`);

    // anchored: the three expectations above prove the census, the power-card slice and the HELD
    // denominator are all non-empty, so an empty list here is a law held rather than a walk that ran dry.
    expect(movedOnPowerCard, `a HELD key moved on the power card (design §22 ruling 9):\n${movedOnPowerCard.join('\n')}`).toEqual([]);
    // anchored: same three, and `movedAnywhere` is a superset of the line above.
    expect(movedAnywhere, `a HELD key moved somewhere in the census:\n${movedAnywhere.join('\n')}`).toEqual([]);
    // anchored: `namesOf` is read from the same merged rosters the two lists above compare, and A2
    // proves the ladder really fires 48 times, so the roster machinery is live in this very census.
    expect(lost, `an edit DELETED a named person from a saved town:\n${lost.join('\n')}`).toEqual([]);
    // anchored: as the line above.
    expect(invented, `an edit INVENTED a person the DM never wrote:\n${invented.join('\n')}`).toEqual([]);
  }, SLOW);

  it('A2 · the escalation census by channel: the layer channel is silent and the config channel EXHAUSTS', () => {
    const all = trials();
    const layer = all.filter((trial) => trial.layerChannel);
    const config = all.filter((trial) => !trial.layerChannel);
    expect(layer.length, 'the layer-driven channel the tip actually has').toBe(378);
    expect(config.length, 'the world-fact channel, whose layer is DORMANT until EM-B2b').toBe(120);

    const noisyLayer = layer.filter((trial) => trial.escalations.length > 0).map((trial) => `${trial.label} ${trial.key}`);
    const liveLayer = layer.filter((trial) => trial.live.length > 0).map((trial) => `${trial.label} ${trial.key} -> ${h(trial.live)}`);
    // anchored: the two length expectations above are the denominator, and the config figures below
    // prove the same census really produces escalations, so silence here is measured, not vacuous.
    expect(noisyLayer, `an escalation on the layer channel:\n${noisyLayer.join('\n')}`).toEqual([]);
    // anchored: as the line above.
    expect(liveLayer, `a live non-exempt violation on the layer channel:\n${liveLayer.join('\n')}`).toEqual([]);

    const escalating = config.filter((trial) => trial.escalations.length > 0);
    const byEdit = {};
    for (const trial of escalating) byEdit[trial.label] = (byEdit[trial.label] || 0) + 1;
    expect(Object.entries(byEdit).sort(), 'the config channel escalates on both world-fact edits, at the figures measured at this landing')
      .toEqual([['E7 terrain to desert', 31], ['E8 culture to norse', 17]]);
    const unexhausted = escalating.filter((trial) => !trial.escalations.some((step) => step.step === 'EXHAUSTED')).map((trial) => `${trial.label} ${trial.key}`);
    // anchored: `escalating` is 48 rows by the equality above, so this list is drawn from a live set.
    expect(unexhausted, `a config-channel escalation that did NOT exhaust:\n${unexhausted.join('\n')}`).toEqual([]);

    const liveById = {};
    for (const trial of config) for (const id of trial.live) liveById[id] = (liveById[id] || 0) + 1;
    expect(Object.entries(liveById).sort(), 'what the cure LEAVES on the world-fact channel: the two '
      + 'REFERENTIAL cross-key checks, and no prose-count check at all. EM-B2b owns this seam '
      + '(EM-R7 §6 declares it dark)')
      .toEqual([['V-DEFENSE-INST', 31], ['V-EVIDENCE-CONFLICT', 22]]);
  }, SLOW);

  it('A3 · the mirror: the two counted rows equal the merged record, and no other character moves', () => {
    const all = trials();
    const graphSeen = all.filter((trial) => trial.statedGraph !== null);
    const eventsSeen = all.filter((trial) => trial.statedEvents !== null);
    expect(graphSeen.length, 'every trial carries a finalGraph evidence row').toBe(498);
    expect(eventsSeen.length, 'every trial carries a narrative evidence row').toBe(498);

    const wrongGraph = graphSeen.filter((trial) => trial.statedGraph[0] !== trial.rosters[0] || trial.statedGraph[1] !== trial.rosters[1])
      .map((trial) => `${trial.label} ${trial.key} stated ${h(trial.statedGraph)} rosters ${trial.rosters[0]}/${trial.rosters[1]}`);
    const wrongEvents = eventsSeen.filter((trial) => trial.statedEvents !== trial.rosters[2])
      .map((trial) => `${trial.label} ${trial.key} stated ${trial.statedEvents} events ${trial.rosters[2]}`);
    const otherMoved = all.filter((trial) => trial.maskedMerged !== trial.maskedPure).map((trial) => `${trial.label} ${trial.key}`);
    // anchored: the two 498 expectations above prove both evidence rows are present in every trial.
    expect(wrongGraph, `the receipt names a roster size the merged record does not carry:\n${wrongGraph.join('\n')}`).toEqual([]);
    // anchored: as the line above.
    expect(wrongEvents, `the receipt names an event count the merged history does not carry:\n${wrongEvents.join('\n')}`).toEqual([]);
    // anchored: A4 proves the restatement really rewrites a digit on a real trial, so an empty list
    // here means only the digits moved, not that the comparison never saw a restatement.
    expect(otherMoved, `a character OUTSIDE the two counted digits moved in the evidence:\n${otherMoved.join('\n')}`).toEqual([]);

    const row = sample63()[0];
    const { _seed: seed, ...config } = row;
    const town = cl(generateSettlementPipeline(config, null, { seed, customContent: {} }));
    const graph = rowAt(town, 'finalGraph');
    graph.evidence = String(graph.evidence).replace(ROSTER_RE, `${town.npcs.length + 5} NPCs / ${town.relationships.length + 5} relationships`);
    const cured = mergeConsequence(cl(town), cl(town), cl(town), { edit: null }).record;
    const restated = String(rowAt(cured, 'finalGraph').evidence).match(ROSTER_RE);
    expect([Number(restated[1]), Number(restated[2])], 'THE PLANTED POSITIVE CONTROL: a record whose graph '
      + 'evidence is off by five is restated to the merged rosters, so the arm above is a cure and not a coincidence')
      .toEqual([cured.npcs.length, cured.relationships.length]);
  }, SLOW);

  it('A4 · one trial, two declarations: the merge takes the evidence WHOLE and the post-pass restates two digits', () => {
    expect(ATOMIC_COLLECTIONS.includes(EVIDENCE_PATH), 'ATOMIC_COLLECTIONS governs THE MERGE for this path').toBe(true);
    expect(CLASS_EXCEPTIONS[EVIDENCE_PATH], 'and the CLASS_EXCEPTIONS row governs THE POST-PASS').toBe('MIRROR');

    const row = sample63().find((candidate) => keyOf(candidate) === 'village|germanic|hills|road|civilized|golden-master-v3');
    const { _seed: seed, ...config } = row;
    const base = generateSettlementPipeline(config, null, { seed, customContent: {} });
    const R0 = rederive(base, config, EMPTY, ENGINE, DECLARATIONS).record;
    const factions = base.powerStructure.factions;
    const record = cl(base);
    record.powerStructure.factions[1].power = Math.max(1, Math.round((factions[1].power || 20) * 0.5));
    renormalizeFactionPower(record.powerStructure.factions);
    const layer = layerOf([[`faction:${factions[1].faction}:power`, record.powerStructure.factions[1].power]]);
    const R1 = rederive(record, config, layer, ENGINE, DECLARATIONS).record;

    const { value, receipts } = mergeTree(cl(record), cl(R0), cl(R1));
    expect(receipts.atomicTaken, 'ACT ONE: the evidence array has no sound key, so the tree merge takes it from R1 as ONE value')
      .toContain(EVIDENCE_PATH);
    expect(String(rowAt(value, 'finalGraph').evidence), 'and what it holds is R1\'s row verbatim, digits included')
      .toBe(String(rowAt(R1, 'finalGraph').evidence));
    expect(String(rowAt(record, 'finalGraph').evidence), 'which is NOT the record\'s own row, or the pair would be untestable here')
      .not.toBe(String(rowAt(R1, 'finalGraph').evidence)); // anchored: both sides are read from live records built above
    recomputeReceipts(value);
    const restated = String(rowAt(value, 'finalGraph').evidence).match(ROSTER_RE);
    expect([Number(restated[1]), Number(restated[2])], 'ACT TWO: the post-pass restates the two counted digits from the MERGED rosters')
      .toEqual([value.npcs.length, value.relationships.length]);
    expect(masked(value), 'and nothing else of the evidence moved: with every digit masked it is still R1\'s text')
      .toBe(masked(R1));
  }, SLOW);

  it('A5 · THE PROMISE: the repairs sub-path is never read and never written by the restatement', () => {
    const withRepairs = sample63().map((row) => {
      const { _seed: seed, ...config } = row;
      return { key: keyOf(row), card: generateSettlementPipeline(config, null, { seed, customContent: {} }) };
    }).find((candidate) => (candidate.card.generationCoherenceReceipt?.repairs || []).length > 0);
    expect(withRepairs, 'the corpus really carries a generation repair, so this arm has a subject').toBeDefined();

    const card = cl(withRepairs.card);
    const narrative = rowAt(card, 'narrative');
    narrative.evidence = String(narrative.evidence).replace(EVENTS_RE, `${card.history.historicalEvents.length + 4} historical events`);
    const before = h(card.generationCoherenceReceipt.repairs);
    const moved = recomputeReceipts(card);
    const after = String(rowAt(card, 'narrative').evidence).match(EVENTS_RE);
    expect(Number(after[1]), 'the post-pass restated the counted digit').toBe(card.history.historicalEvents.length);
    expect(h(card.generationCoherenceReceipt.repairs), 'and THE PROMISE\'s immutable lived history is byte-identical across the same call').toBe(before);
    expect(moved, 'the function\'s RETURN is still the economy fingerprint\'s own boolean').toBe(false);

    const all = trials();
    const quiet = all.filter((trial) => trial.escalations.length === 0);
    const noisyRepairs = quiet.filter((trial) => !trial.repairsSame).map((trial) => `${trial.label} ${trial.key}`);
    const unexplained = all.filter((trial) => !trial.repairsSame && !trial.rungTookReceipt).map((trial) => `${trial.label} ${trial.key}`);
    expect(quiet.length, 'the trials in which no rung fires at all').toBe(450);
    // anchored: 450 of 498 trials are quiet by the expectation above, so this list is drawn from a live set.
    expect(noisyRepairs, `repairs moved with no rung firing at all:\n${noisyRepairs.join('\n')}`).toEqual([]);
    // anchored: the same census carries 48 noisy trials (A2), so the explanation below is exercised.
    expect(unexplained, 'repairs moved for a reason other than a rung taking generationCoherenceReceipt '
      + `whole from R1 — the ladder's own top-level write, which no CLASS_EXCEPTIONS row reaches:\n${unexplained.join('\n')}`).toEqual([]);
  }, SLOW);

  it('A6 · where no rung fires the merged record IS the post-pass pipeline, byte for byte', () => {
    const all = trials();
    const quiet = all.filter((trial) => trial.escalations.length === 0);
    expect(quiet.length, 'the quiet trials, which are 450 of 498 once the ladder stops repairing held facts').toBe(450);
    const drifted = quiet.filter((trial) => !trial.mergedIsPipeline).map((trial) => `${trial.label} ${trial.key}`);
    // anchored: `quiet` is 450 rows by the expectation above.
    expect(drifted, 'a quiet trial whose merged record is not mergeTree + recomputeMirrors + '
      + `recomputeReceipts of its own inputs — the guard changed something while doing nothing:\n${drifted.join('\n')}`).toEqual([]);
    const noisy = all.filter((trial) => trial.escalations.length > 0);
    expect(noisy.length, 'and the blast radius of the ladder is exactly the config channel A2 measures').toBe(48);
  }, SLOW);

  it('A7 · the chain: determinism and undo hold, and the power card stops making history it did not make', () => {
    const rows = sample63();
    const PAIR_ROWS = new Set([
      'village|germanic|hills|road|civilized|golden-master-v3',
      'village|germanic|mountain|road|civilized|golden-master-v3',
      'metropolis|germanic|forest|isolated|civilized|golden-master-v3',
      'town|germanic|auto|random_trade|civilized|gm-seed-a',
      'city|germanic|plains|road|civilized|golden-master-v3',
    ]);
    const CHAIN_EDITS = {
      E1: (record) => { const person = record.npcs?.[1]; if (!person) return null; person.name = 'Aldhelm Prufstein'; return { [`npc:${person.id}:name`]: 'Aldhelm Prufstein' }; },
      E2: (record) => { const person = record.npcs?.[1]; if (!person) return null; person.role = 'Harbourmaster'; return { [`npc:${person.id}:role`]: 'Harbourmaster' }; },
      E5: (record) => {
        const factions = record.powerStructure?.factions || [];
        if (factions.length < 2) return null;
        factions[1].power = Math.max(1, Math.round((factions[1].power || 20) * 0.5));
        renormalizeFactionPower(factions);
        return { [`faction:${factions[1].faction}:power`]: factions[1].power };
      },
      E6: (record) => {
        const factions = record.powerStructure?.factions || [];
        if (factions.length < 2) return null;
        const seated = factions.findIndex((faction) => faction.isGoverning);
        const next = factions.findIndex((faction, at) => at !== seated);
        if (next < 0) return null;
        factions.forEach((faction, at) => { faction.isGoverning = at === next; });
        record.powerStructure.governingName = factions[next].faction;
        return { [`powerSeat:${factions[next].faction}:holder`]: factions[next].faction };
      },
    };
    const chain = (base, config, sequence) => {
      let record = cl(base);
      let R0 = rederive(base, config, EMPTY, ENGINE, DECLARATIONS).record;
      let roots = {};
      for (const id of sequence) {
        const written = cl(record);
        const added = CHAIN_EDITS[id](written, base);
        if (added === null) return null;
        roots = { ...roots, ...added };
        const R1 = rederive(written, config, { roots, worldFacts: {}, minted: {}, phantoms: {} }, ENGINE, DECLARATIONS).record;
        const out = mergeConsequence(written, cl(R0), cl(R1), { edit: { id, opType: id } });
        record = out.record;
        R0 = out.delta.nextBase;
      }
      return record;
    };

    const nonDeterministic = [];
    const undoDrifted = [];
    const powerPairs = [];
    const seatPairs = [];
    let deterministicTrials = 0;
    let undoTrials = 0;
    for (const row of rows) {
      const { _seed: pin, ...config } = row;
      const key = keyOf(row);
      const base = generateSettlementPipeline(config, null, { seed: pin, customContent: {} });
      for (const sequence of [['E1', 'E5'], ['E5', 'E6'], ['E2', 'E6'], ['E1', 'E6']]) {
        const first = chain(base, config, sequence);
        const second = chain(base, config, sequence);
        if (first === null || second === null) continue;
        deterministicTrials += 1;
        if (h(first) !== h(second)) nonDeterministic.push(`${key} ${sequence.join('->')}`);
      }
      for (const id of ['E2', 'E5']) {
        const first = chain(base, config, [id]);
        const again = chain(base, config, [id]);
        if (first === null || again === null) continue;
        undoTrials += 1;
        if (h(first) !== h(again)) undoDrifted.push(`${key} ${id}`);
      }
      if (!PAIR_ROWS.has(key)) continue;
      for (const [left, right] of [['E1', 'E5'], ['E5', 'E1'], ['E2', 'E5'], ['E5', 'E2'], ['E1', 'E6'], ['E6', 'E1'], ['E2', 'E6'], ['E6', 'E2']]) {
        const forward = chain(base, config, [left, right]);
        const backward = chain(base, config, [right, left]);
        if (forward === null || backward === null) continue;
        const disagrees = h(forward) !== h(backward);
        if (left === 'E5' || right === 'E5') { if (disagrees) powerPairs.push(`${key} ${left}|${right}`); }
        else if (disagrees) seatPairs.push(`${key} ${left}|${right}`);
      }
    }
    expect(deterministicTrials, 'the determinism denominator over the whole stride').toBe(252);
    expect(undoTrials, 'the undo-then-re-edit denominator').toBe(126);
    // anchored: the two denominators above are asserted exactly, so neither list is a walk over nothing.
    expect(nonDeterministic, `the same record and the same sequence produced two different towns:\n${nonDeterministic.join('\n')}`).toEqual([]);
    // anchored: as the line above.
    expect(undoDrifted, `a snapshot restore and the same edit again produced a different town:\n${undoDrifted.join('\n')}`).toEqual([]);
    // anchored: `seatPairs` below is non-empty on the same five rows, so the pair machinery is live.
    expect(powerPairs, 'THE SHARE EDIT COMMUTES AGAIN: at the tip these pairs disagreed because the '
      + `ladder rewrote a roster between them, which §22.2 item 6 never meant by history:\n${powerPairs.join('\n')}`).toEqual([]);
    expect(seatPairs.length, 'and the SEAT edit still does not commute with a roster edit, which IS §22.2 '
      + 'item 6\'s history and is the positive control that these pairs are really being compared')
      .toBeGreaterThan(0);
  }, SLOW);

  it('A8 · the constructed events control: a narrative count the history does not carry is restated', () => {
    const row = sample63()[0];
    const { _seed: seed, ...config } = row;
    const town = generateSettlementPipeline(config, null, { seed, customContent: {} });
    const events = town.history.historicalEvents.length;
    expect(events, 'the constructed control needs a history to disagree with').toBeGreaterThan(0);

    // the generated receipt's evidence rows are FROZEN, so the control is planted on a CLONE,
    // exactly as the merge itself only ever writes the private value `mergeTree` cloned for it.
    const planted = cl(town);
    const narrative = rowAt(planted, 'narrative');
    narrative.evidence = String(narrative.evidence).replace(EVENTS_RE, `${events + 3} historical events`);
    const before = recordInvariants(planted).filter((violation) => violation.id === 'V-EVIDENCE-EVENTS');
    expect(before.length, 'THE CONTROL IS LIVE: the town\'s own invariants convict the planted count').toBe(1);

    const cured = mergeConsequence(cl(planted), cl(planted), cl(planted), { edit: null }).record;
    const restated = String(rowAt(cured, 'narrative').evidence).match(EVENTS_RE);
    expect(Number(restated[1]), 'the merge restated the narrative count from the merged history').toBe(cured.history.historicalEvents.length);
    const after = recordInvariants(cured).filter((violation) => violation.id === 'V-EVIDENCE-EVENTS');
    // anchored: the same check convicted the planted record one line above, so zero here is a cure.
    expect(after, `the merged record still carries the planted violation:\n${after.map((violation) => violation.message).join('\n')}`).toEqual([]);
    expect(masked(cured), 'and no character outside the counted digits moved').toBe(masked(planted));
    expect(h({ ...cured, generationCoherenceReceipt: null }), 'and nothing outside the receipt moved at all').toBe(h({ ...planted, generationCoherenceReceipt: null }));
  }, SLOW);
});
