/**
 * discourseKernel.test.js — TRANCHE 3c THE DISCOURSE KERNEL.
 *
 * The realizer turns a resolved cause-walk into ONE connected passage. This file
 * pins the machinery and TWO of the six enforcers at the unit level:
 *   (a) CLAUSE-PROVENANCE PIN — every emitted clause carries its receiptKey and its
 *       byte-verbatim recorded headline; text is exactly connective + ' ' + recorded,
 *       and the connective is drawn only from the finite lexicon (or a temporal
 *       opener, or empty). The anti-embellishment guarantee, made executable.
 *   (c) DETERMINISM PIN — same walk + same seed twice ⇒ deep-equal clauses and a
 *       byte-equal passage.
 * The lit-decade variant (b), the lexicon totality walker (d), the dormancy
 * byte-identity (e) and the voice scan (f) live in their own enforcer files.
 */
import { describe, it, expect } from 'vitest';
import { buildCauseWalk, REDACTED_HOP, NO_DEEPER_MEMORY, LEDGER_DARK_LINE } from '../../src/domain/display/causeWalk.js';
import { nodesFromRecord } from '../../src/domain/display/chronicleGraph.js';
import {
  realizeCauseWalk, discourseProseActive, ALL_CONNECTIVES, KNOWN_RELATION_TYPES, RELATION_FOR_TYPE,
  CONNECTIVE_LEXICON, realizationCandidateId,
} from '../../src/domain/display/discourseKernel.js';

// The lit DAG mirrors causeWalk.test.js: A (a decree) -> B -> C, disjoint entity
// keys, so ONLY recorded edges link them.
const baseOutcomes = [
  { id: 'A', applyMode: 'proposal', proposalPayload: { kind: 'realm_verb_order' }, targetSaveId: 'sA', headline: 'Your decree', severity: 0.6 },
  { id: 'B', type: 'condition', targetSaveId: 'sB', headline: 'B happened', severity: 0.5 },
  { id: 'C', type: 'condition', targetSaveId: 'sC', headline: 'C happened', severity: 0.4 },
];
const provenance = { B: { parents: ['A'], type: 'condition', tick: 300 }, C: { parents: ['B'], type: 'condition', tick: 300 } };
const worldOf = (outcomes = baseOutcomes) => ({
  rngSeed: 'discourse-seed',
  pulseHistory: [{ tick: 300, selectedOutcomes: outcomes, impactDigest: [] }],
  spatialLedgers: { provenance },
});

/** The recorded-headline truth set for a world (the parity substrate). */
function recordedHeadlines(worldState) {
  const set = new Set([REDACTED_HOP, 'an earlier cause', 'World pulse outcome', 'World pulse impact']);
  for (const record of worldState.pulseHistory || []) {
    for (const node of nodesFromRecord(record)) set.add(node.headline);
  }
  return set;
}
/** A connective is either a finite lexicon entry, a temporal opener, or empty. */
const OPENER = /^In the (spring|summer|autumn|winter) of year \d+:$/;
const legalConnective = (c) => c === '' || ALL_CONNECTIVES.has(c) || OPENER.test(c);

describe('3c discourse kernel — the realizer produces ONE connected passage', () => {
  it('orders chronologically (deepest cause first, the clicked effect last) and connects the receipts', () => {
    const walk = buildCauseWalk({ worldState: worldOf(), rootId: 'C', seesSecrets: true });
    const out = realizeCauseWalk(walk, { seedId: 'discourse-seed' });
    // A(deepest) -> B -> C(pivot): three receipts, the effect last.
    expect(out.clauses.map((c) => c.receiptKey)).toEqual(['A', 'B', 'C']);
    expect(out.clauses.map((c) => c.recorded)).toEqual(['Your decree', 'B happened', 'C happened']);
    // ONE passage string, all three recorded beats present verbatim.
    expect(out.text).toContain('Your decree');
    expect(out.text).toContain('B happened');
    expect(out.text).toContain('C happened');
    // The opener speaks a calendar time (tickCalendarLabel), never a raw tick.
    expect(out.clauses[0].connective).toMatch(OPENER);
    expect(out.text).not.toMatch(/tick \d/);
  });

  it('an at-root walk realizes the single effect with no invented causes', () => {
    const walk = buildCauseWalk({ worldState: worldOf(), rootId: 'A', seesSecrets: true });
    const out = realizeCauseWalk(walk, { seedId: 'discourse-seed' });
    expect(out.clauses.map((c) => c.receiptKey)).toEqual(['A']);
    expect(out.clauses[0].recorded).toBe('Your decree');
    // The grace line is the panel's own verbatim render, not a clause here.
    expect(walk.graceLine).toBe(NO_DEEPER_MEMORY);
    expect(out.clauses.some((c) => c.recorded === NO_DEEPER_MEMORY)).toBe(false);
  });

  it('a dark ledger yields no clauses (the panel renders the dark grace line verbatim)', () => {
    const dark = { rngSeed: 's', pulseHistory: [{ tick: 300, selectedOutcomes: baseOutcomes, impactDigest: [] }] };
    const walk = buildCauseWalk({ worldState: dark, rootId: 'C', seesSecrets: true });
    const out = realizeCauseWalk(walk, { seedId: 's' });
    expect(walk.ledgerDark).toBe(true);
    // root resolves ('C happened'); no chain ⇒ one clause, no dark line inside it.
    expect(out.clauses.every((c) => c.recorded !== LEDGER_DARK_LINE)).toBe(true);
  });
});

describe('3c discourse kernel — (a) CLAUSE-PROVENANCE PIN (no embellishment)', () => {
  it('every clause traces to a recorded receipt and text is exactly connective + recorded', () => {
    const worldState = worldOf();
    const truth = recordedHeadlines(worldState);
    const walk = buildCauseWalk({ worldState, rootId: 'C', seesSecrets: true });
    const out = realizeCauseWalk(walk, { seedId: 'discourse-seed' });
    for (const c of out.clauses) {
      // the recorded content is byte-verbatim from the ledger (or an honest fallback)
      expect(truth.has(c.recorded), `unbacked clause: "${c.recorded}"`).toBe(true);
      // the ONLY authored text is the finite connective
      expect(legalConnective(c.connective), `illegal connective: "${c.connective}"`).toBe(true);
      // text adds nothing beyond connective + recorded
      const expected = c.connective ? `${c.connective} ${c.recorded}` : c.recorded;
      expect(c.text).toBe(expected);
    }
  });

  it('a covert hop stays REDACTED verbatim for a non-DM viewer (the E-G secrets pin)', () => {
    const covert = [baseOutcomes[0], { ...baseOutcomes[1], metadata: { covert: true } }, baseOutcomes[2]];
    const walk = buildCauseWalk({ worldState: worldOf(covert), rootId: 'C', seesSecrets: false });
    const out = realizeCauseWalk(walk, { seedId: 'discourse-seed' });
    const bClause = out.clauses.find((c) => c.receiptKey === 'B');
    expect(bClause.recorded).toBe(REDACTED_HOP); // never paraphrased
    expect(bClause.redacted).toBe(true);
    // the covert content never appears anywhere in the passage
    expect(out.text).not.toContain('B happened');
    expect(out.text).toContain(REDACTED_HOP);
  });
});

describe('3c discourse kernel — (c) DETERMINISM PIN', () => {
  it('the same walk and seed realize byte-identical text and deep-equal clauses', () => {
    const walk = buildCauseWalk({ worldState: worldOf(), rootId: 'C', seesSecrets: true });
    const a = realizeCauseWalk(walk, { seedId: 'discourse-seed' });
    const b = realizeCauseWalk(walk, { seedId: 'discourse-seed' });
    expect(a.text).toBe(b.text);
    expect(a.clauses).toEqual(b.clauses);
  });

  it('distinct seeds are still legal and deterministic per seed', () => {
    const walk = buildCauseWalk({ worldState: worldOf(), rootId: 'C', seesSecrets: true });
    const one = realizeCauseWalk(walk, { seedId: 'seed-one' });
    const oneAgain = realizeCauseWalk(walk, { seedId: 'seed-one' });
    expect(one.text).toBe(oneAgain.text);
    for (const c of one.clauses) expect(legalConnective(c.connective)).toBe(true);
  });
});

describe('3c discourse kernel — the dormancy flag (read defensively)', () => {
  it('discourseProseActive is false without the virtual flag, true only when lit', () => {
    expect(discourseProseActive(undefined)).toBe(false);
    expect(discourseProseActive({})).toBe(false);
    expect(discourseProseActive({ simulationRules: {} })).toBe(false);
    expect(discourseProseActive({ simulationRules: { discourseProseEnabled: false } })).toBe(false);
    expect(discourseProseActive({ simulationRules: { discourseProseEnabled: true } })).toBe(true);
  });
});

describe('3c discourse kernel — the adversative and parallel relations realize', () => {
  it('an abundance/reframe effect after grim causes takes an adversative connective', () => {
    // root is a boom (adversative type); its cause is a war a tick earlier.
    const walk = {
      rootId: 'boom', root: { headline: 'The town flourishes', tick: 10, type: 'boom_flourishing', settlementIds: [] },
      chain: [{ id: 'war1', depth: 1, headline: 'The siege is lifted', tick: 8, type: 'war', redacted: false, settlementIds: [] }],
      ledgerDark: false, atRoot: false, gated: false, graceLine: '',
    };
    const out = realizeCauseWalk(walk, { seedId: 's' });
    // chronological: war (tick 8, opener) then the boom (tick 10, adversative)
    expect(out.clauses.map((c) => c.receiptKey)).toEqual(['war1', 'boom']);
    expect(out.clauses[1].relation).toBe('adversative');
    expect(ALL_CONNECTIVES.has(out.clauses[1].connective)).toBe(true);
  });

  it('two co-causes at the same tick and depth take a parallel connective', () => {
    const walk = {
      rootId: 'eff', root: { headline: 'The council falls', tick: 10, type: 'succession_coup', settlementIds: [] },
      chain: [
        { id: 'a1', depth: 1, headline: 'The grain fails', tick: 8, type: 'economic_shock', redacted: false, settlementIds: [] },
        { id: 'a2', depth: 1, headline: 'The garrison thins', tick: 8, type: 'war', redacted: false, settlementIds: [] },
      ],
      ledgerDark: false, atRoot: false, gated: false, graceLine: '',
    };
    const out = realizeCauseWalk(walk, { seedId: 's' });
    // a1, a2 (same tick+depth) then the effect; a2 relates to a1 in parallel
    expect(out.clauses.map((c) => c.receiptKey)).toEqual(['a1', 'a2', 'eff']);
    expect(out.clauses[1].relation).toBe('parallel');
    expect(ALL_CONNECTIVES.has(out.clauses[1].connective)).toBe(true);
  });

  it('coalesces an adjacent identical recorded shape (the C2 dedup)', () => {
    const walk = {
      rootId: 'x', root: { headline: 'Fever spreads', tick: 6, type: 'plague', settlementIds: [] },
      chain: [
        { id: 'p1', depth: 1, headline: 'Fever spreads', tick: 6, type: 'plague', redacted: false, settlementIds: [] },
        { id: 'p2', depth: 2, headline: 'The wells run foul', tick: 4, type: 'plague', redacted: false, settlementIds: [] },
      ],
      ledgerDark: false, atRoot: false, gated: false, graceLine: '',
    };
    const out = realizeCauseWalk(walk, { seedId: 's' });
    // p2 (tick4) then the deduped 'Fever spreads' once (not twice)
    const fevers = out.clauses.filter((c) => c.recorded === 'Fever spreads');
    expect(fevers.length).toBe(1);
    expect((out.text.match(/Fever spreads/g) || []).length).toBe(1);
  });
});

describe('3c discourse kernel — PREDICTION ELISION (owner amendment; typed, DAG-deterministic)', () => {
  const C_ID = 'candidate.condition.crime.c.10';
  const R_ID = 'wizard_news.10.world_pulse.applied.candidate.condition.crime.c.10';
  const X_ID = 'muster.b_city_guard.10';
  const hasAnticipatory = (c) => CONNECTIVE_LEXICON.anticipatory.some((a) => c.connective.includes(a));

  it('realizationCandidateId reads the candidate id from the TYPED key, never a headline', () => {
    expect(realizationCandidateId(R_ID)).toBe(C_ID);
    expect(realizationCandidateId(C_ID)).toBe(null);            // a bare candidate is not a realization
    expect(realizationCandidateId('wizard_news.10.world_pulse.applied.some.impact')).toBe(null); // applied, but not a candidate
    expect(realizationCandidateId(null)).toBe(null);
  });

  // RULE 1 — the forecast's only in-walk child is its realization ⇒ elide the forecast.
  const rule1Walk = {
    rootId: R_ID,
    root: { headline: 'Criminal pressure takes hold', tick: 10, type: 'outcome', settlementIds: [] },
    chain: [{ id: C_ID, depth: 1, headline: 'Criminal pressure may take hold', tick: 8, type: 'outcome', redacted: false, settlementIds: [] }],
    ledgerDark: false, atRoot: false, gated: false, graceLine: '',
  };
  const prov1 = { [R_ID]: { parents: [C_ID] } };

  it('(a) ELISION PIN rule 1: the prediction clause is dropped; the realization carries the fact', () => {
    const out = realizeCauseWalk(rule1Walk, { seedId: 's', provenance: prov1 });
    expect(out.clauses.map((c) => c.receiptKey)).toEqual([R_ID]); // C elided
    expect(out.clauses[0].recorded).toBe('Criminal pressure takes hold');
    expect(out.text).not.toContain('may take hold');
    expect(out.clauses.every((c) => c.anticipatedBy === null)).toBe(true);
  });

  it('(a) elision is byte-deterministic from the DAG (same walk+provenance twice)', () => {
    const a = realizeCauseWalk(rule1Walk, { seedId: 's', provenance: prov1 });
    const b = realizeCauseWalk(rule1Walk, { seedId: 's', provenance: prov1 });
    expect(a.text).toBe(b.text);
    expect(a.clauses).toEqual(b.clauses);
  });

  it('no provenance ⇒ no elision (byte-neutral): both clauses survive', () => {
    const out = realizeCauseWalk(rule1Walk, { seedId: 's' });
    expect(out.clauses.map((c) => c.receiptKey)).toEqual([C_ID, R_ID]);
  });

  it('RULE 3: a forecast whose realization is NOT in the walk is KEPT (real information)', () => {
    const walkC = {
      rootId: C_ID, root: { headline: 'Criminal pressure may take hold', tick: 8, type: 'outcome', settlementIds: [] },
      chain: [], ledgerDark: false, atRoot: true, gated: false, graceLine: NO_DEEPER_MEMORY,
    };
    const out = realizeCauseWalk(walkC, { seedId: 's', provenance: prov1 });
    expect(out.clauses.map((c) => c.receiptKey)).toEqual([C_ID]); // kept
    expect(out.text).toContain('may take hold');
  });

  // RULE 2 — the forecast has a RESPONSE child (an action taken because of it) in the
  // walk: elide the forecast, and the response takes the anticipatory register.
  const rule2Walk = {
    rootId: R_ID,
    root: { headline: 'Criminal pressure takes hold', tick: 10, type: 'outcome', settlementIds: [] },
    chain: [
      { id: X_ID, depth: 1, headline: 'The city guard musters', tick: 9, type: 'outcome', redacted: false, settlementIds: [] },
      { id: C_ID, depth: 2, headline: 'Criminal pressure may take hold', tick: 8, type: 'outcome', redacted: false, settlementIds: [] },
    ],
    ledgerDark: false, atRoot: false, gated: false, graceLine: '',
  };
  const prov2 = { [R_ID]: { parents: [C_ID, X_ID] }, [X_ID]: { parents: [C_ID] } };

  it('RULE 2: the forecast is elided and its response takes the anticipatory register', () => {
    const out = realizeCauseWalk(rule2Walk, { seedId: 's', provenance: prov2 });
    expect(out.clauses.map((c) => c.receiptKey)).toEqual([X_ID, R_ID]); // C elided, X + R remain
    const x = out.clauses.find((c) => c.receiptKey === X_ID);
    expect(x.relation).toBe('anticipatory');
    expect(x.anticipatedBy).toBe(C_ID);
    expect(hasAnticipatory(x)).toBe(true);
    // opener + register (the owner's joining rule): calendar time first, register second.
    expect(x.connective).toMatch(/^In the (spring|summer|autumn|winter) of year \d+, (Forewarned:|Against what was coming:|In its shadow:)$/);
    expect(out.text).not.toContain('may take hold'); // the forecast is gone
    expect(out.text).toContain('The city guard musters');
    expect(out.text).toContain('Criminal pressure takes hold');
  });

  it('(b) ANTICIPATORY-LICENSE PIN: an anticipatory connective appears ONLY on a clause whose recorded parent is a typed prediction', () => {
    for (const walk of [rule1Walk, rule2Walk]) {
      const out = realizeCauseWalk(walk, { seedId: 's', provenance: walk === rule1Walk ? prov1 : prov2 });
      for (const c of out.clauses) {
        if (hasAnticipatory(c)) {
          expect(c.relation).toBe('anticipatory');
          expect(typeof c.anticipatedBy).toBe('string');
          expect(String(c.anticipatedBy).startsWith('candidate.')).toBe(true); // the license is a typed prediction
        }
        if (c.relation === 'anticipatory') expect(hasAnticipatory(c)).toBe(true); // and vice-versa
      }
    }
  });
});

describe('3c discourse kernel — the relation vocabulary is literal and total', () => {
  it('RELATION_FOR_TYPE is total over KNOWN_RELATION_TYPES', () => {
    for (const t of KNOWN_RELATION_TYPES) {
      expect(RELATION_FOR_TYPE[t], `no relation for known type "${t}"`).toBeTruthy();
      expect(['causal', 'adversative']).toContain(RELATION_FOR_TYPE[t]);
    }
  });
});
