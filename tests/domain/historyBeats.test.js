/**
 * tests/domain/historyBeats.test.js — Structured history beat contract.
 *
 * Pins the Tier 4.7 derivation surface: seven beat slots, each either
 * non-null with structured fields or null when source data is missing.
 * Severity ranking is total over the canonical set. Recent-disruption
 * threshold honors the 30-year window. Fallback paths to
 * legacyAnnotations work when historicalEvents are too quiet.
 */

import { describe, it, expect } from 'vitest';
import {
  deriveHistoryBeats,
  historyBeatRows,
  historyBeatPresence,
  LIKELY_FUTURE_BEAT_TEXT,
} from '../../src/domain/historyBeats.js';
import {
  deriveSimulationSpine,
  likelyFutureFacts,
  LIKELY_FUTURE_ARCS,
} from '../../src/domain/simulationSpine.js';
import { gen } from '../simulation/simHelpers.js';

// ── Sample settlements ──────────────────────────────────────────────────

function richHistorySettlement() {
  return {
    name: 'Greycairn',
    economicState: { topExport: 'Smoked river fish' },
    history: {
      age: 261,
      founding: {
        age: 261,
        reason: 'began as a toll collection point that became a permanent post',
        foundedBy: 'military veterans given land grants',
        initialChallenge: 'rival claimants to the land',
        overcoming: 'through determination and cooperation',
      },
      historicalEvents: [
        {
          name: 'The Siege', yearsAgo: 93, severity: 'catastrophic', type: 'disaster',
          description: 'A siege lasting two seasons broke the old council.',
          lastingEffects: ['institutional reform of the watch'],
        },
        {
          name: 'The Arcane Incident', yearsAgo: 18, severity: 'major', type: 'magical',
          description: 'A magical accident in the lower district.',
          lastingEffects: [],
        },
        {
          name: 'The Plague Year', yearsAgo: 280, severity: 'major', type: 'disease',
          description: 'A plague swept through during the founding decades.',
          lastingEffects: [],
        },
      ],
      currentTensions: ['merchant guild dispute over docks', 'temple feud over relief funds'],
      historicalCharacter: 'A quiet trade town suspicious of strangers.',
      legacyAnnotations: [
        {
          annotation: 'The Siege (93 years ago) was a disruption that reshaped civic structure.',
          eventName: 'The Siege', yearsAgo: 93, severity: 'catastrophic',
        },
      ],
    },
    powerStructure: { stability: 'Unstable' },
  };
}

function sparseHistorySettlement() {
  return {
    name: 'Quiet Hamlet',
    history: {
      age: 12,
      founding: { reason: 'a few families settled by the river', foundedBy: 'farmers' },
      historicalEvents: [],
      currentTensions: [],
      legacyAnnotations: [],
    },
  };
}

// ── deriveHistoryBeats ─────────────────────────────────────────────────

describe('deriveHistoryBeats()', () => {
  it('produces all seven beats on a rich settlement', () => {
    const b = deriveHistoryBeats(richHistorySettlement());
    expect(b.foundingCause).toBeTruthy();
    expect(b.firstProsperitySource).toBeTruthy();
    expect(b.definingCrisis).toBeTruthy();
    expect(b.institutionalLegacy).toBeTruthy();
    expect(b.recentDisruption).toBeTruthy();
    expect(b.unresolvedWound).toBeTruthy();
    expect(b.likelyFuture).toBeTruthy();
  });

  it('every beat carries key + label + text + source', () => {
    const b = deriveHistoryBeats(richHistorySettlement());
    for (const v of Object.values(b)) {
      if (v == null) continue;
      expect(typeof v.key).toBe('string');
      expect(typeof v.label).toBe('string');
      expect(typeof v.text).toBe('string');
      expect(v.text.length).toBeGreaterThan(0);
      expect(typeof v.source).toBe('string');
    }
  });

  it('foundingCause composes reason + foundedBy + challenge', () => {
    const b = deriveHistoryBeats(richHistorySettlement());
    expect(b.foundingCause.text).toContain('toll collection point');
    expect(b.foundingCause.text).toContain('military veterans');
    expect(b.foundingCause.text).toContain('rival claimants');
  });

  it('firstProsperitySource prefers topExport when present', () => {
    const b = deriveHistoryBeats(richHistorySettlement());
    expect(b.firstProsperitySource.text).toContain('smoked river fish');
    expect(b.firstProsperitySource.source).toBe('economy.topExport');
  });

  it('firstProsperitySource falls back to the founding overcoming arc', () => {
    const b = deriveHistoryBeats({
      history: { founding: { overcoming: 'Through generations of frost-and-grain cycles' } },
    });
    expect(b.firstProsperitySource).toBeTruthy();
    expect(b.firstProsperitySource.source).toBe('history.founding.overcoming');
  });

  it('definingCrisis picks the most severe event (catastrophic > major)', () => {
    const b = deriveHistoryBeats(richHistorySettlement());
    expect(b.definingCrisis.references.eventName).toBe('The Siege');
    expect(b.definingCrisis.references.severity).toBe('catastrophic');
  });

  it('definingCrisis prefers the older event when severity ties', () => {
    const b = deriveHistoryBeats({
      history: {
        historicalEvents: [
          { name: 'Recent Major', yearsAgo: 5, severity: 'major', description: 'recent.' },
          { name: 'Old Major',    yearsAgo: 200, severity: 'major', description: 'old.' },
        ],
      },
    });
    expect(b.definingCrisis.references.eventName).toBe('Old Major');
  });

  it('definingCrisis is null when no event meets the major threshold', () => {
    const b = deriveHistoryBeats({
      history: {
        historicalEvents: [{ name: 'Minor stuff', yearsAgo: 5, severity: 'minor' }],
      },
    });
    expect(b.definingCrisis).toBeNull();
  });

  it('institutionalLegacy reads from lastingEffects when institutions are mentioned', () => {
    const b = deriveHistoryBeats(richHistorySettlement());
    expect(b.institutionalLegacy.text).toContain('The Siege');
  });

  it('institutionalLegacy falls back to legacyAnnotations when no institutional effects exist', () => {
    const b = deriveHistoryBeats({
      history: {
        historicalEvents: [{ name: 'Quiet event', severity: 'major', yearsAgo: 100, lastingEffects: [] }],
        legacyAnnotations: [{
          annotation: 'A late frost altered the planting calendar permanently.',
          eventName: 'The Long Winter', yearsAgo: 80,
        }],
      },
    });
    expect(b.institutionalLegacy.source).toBe('history.legacyAnnotations');
  });

  it('recentDisruption only picks events within 30 years AND ≥major severity', () => {
    const b = deriveHistoryBeats(richHistorySettlement());
    expect(b.recentDisruption.references.eventName).toBe('The Arcane Incident');
    expect(b.recentDisruption.references.yearsAgo).toBe(18);
  });

  it('recentDisruption falls back to a legacyAnnotation ≤50 years old', () => {
    const b = deriveHistoryBeats({
      history: {
        historicalEvents: [{ name: 'Old', yearsAgo: 200, severity: 'catastrophic' }],
        legacyAnnotations: [{ annotation: 'Frost ten years back.', eventName: 'Late Frost', yearsAgo: 10 }],
      },
    });
    expect(b.recentDisruption.source).toBe('history.legacyAnnotations');
  });

  it('recentDisruption is null when nothing recent and no fallback annotation', () => {
    const b = deriveHistoryBeats({
      history: { historicalEvents: [{ name: 'Ancient', yearsAgo: 500, severity: 'catastrophic' }] },
    });
    expect(b.recentDisruption).toBeNull();
  });

  it('unresolvedWound pulls from currentTensions[0]', () => {
    const b = deriveHistoryBeats(richHistorySettlement());
    expect(b.unresolvedWound.text).toBe('merchant guild dispute over docks');
    expect(b.unresolvedWound.references.othersCount).toBe(1);
  });

  it('unresolvedWound handles object-shaped tension entries', () => {
    const b = deriveHistoryBeats({
      history: { currentTensions: [{ label: 'plague suspicion' }] },
    });
    expect(b.unresolvedWound.text).toBe('plague suspicion');
  });

  it('likelyFuture uses currentTensions when available', () => {
    const b = deriveHistoryBeats(richHistorySettlement());
    expect(b.likelyFuture.text).toContain('merchant guild dispute');
  });

  it('likelyFuture falls back to power stability', () => {
    const stable = deriveHistoryBeats({
      powerStructure: { stability: 'Stable' },
    });
    expect(stable.likelyFuture.text).toContain('Continuity');

    const critical = deriveHistoryBeats({
      powerStructure: { stability: 'Critical' },
    });
    expect(critical.likelyFuture.text).toContain('crisis');

    const volatile = deriveHistoryBeats({
      powerStructure: { stability: 'Volatile' },
    });
    expect(volatile.likelyFuture.text).toContain('test');
  });
});

// ── Sparse settlement behavior ─────────────────────────────────────────

describe('deriveHistoryBeats() on a sparse settlement', () => {
  it('still produces foundingCause + firstProsperitySource', () => {
    const b = deriveHistoryBeats(sparseHistorySettlement());
    expect(b.foundingCause).toBeTruthy();
    // No topExport, no overcoming → null
    expect(b.firstProsperitySource).toBeNull();
  });

  it('returns null for beats that have no source data', () => {
    const b = deriveHistoryBeats(sparseHistorySettlement());
    expect(b.definingCrisis).toBeNull();
    expect(b.recentDisruption).toBeNull();
    expect(b.unresolvedWound).toBeNull();
  });

  it('does not crash on nullish input', () => {
    expect(() => deriveHistoryBeats(null)).not.toThrow();
    const empty = deriveHistoryBeats(null);
    for (const v of Object.values(empty)) expect(v).toBeNull();
  });

  it('returns an object with all seven keys even when sparse', () => {
    const empty = deriveHistoryBeats(null);
    const expectedKeys = ['foundingCause', 'firstProsperitySource', 'definingCrisis',
                          'institutionalLegacy', 'recentDisruption', 'unresolvedWound', 'likelyFuture'];
    for (const k of expectedKeys) {
      expect(empty).toHaveProperty(k);
    }
  });
});

// ── historyBeatRows ─────────────────────────────────────────────────────

describe('historyBeatRows()', () => {
  it('returns [label, text, key] tuples in canonical order', () => {
    const rows = historyBeatRows(richHistorySettlement());
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0][2]).toBe('foundingCause');
    expect(rows[0][0]).toBe('Founding cause');
    for (const [label, text] of rows) {
      expect(typeof label).toBe('string');
      expect(typeof text).toBe('string');
    }
  });

  it('drops null beats from the output', () => {
    const rows = historyBeatRows(sparseHistorySettlement());
    // Sparse settlement should produce a strict subset.
    expect(rows.length).toBeLessThan(7);
    expect(rows.length).toBeGreaterThan(0);
  });

  it('returns [] for a fully-empty settlement', () => {
    expect(historyBeatRows(null)).toEqual([]);
  });
});

// ── historyBeatPresence ────────────────────────────────────────────────

describe('historyBeatPresence()', () => {
  it('reports a boolean per beat', () => {
    const p = historyBeatPresence(richHistorySettlement());
    for (const v of Object.values(p)) expect(typeof v).toBe('boolean');
  });

  it('non-null beats report true', () => {
    const p = historyBeatPresence(richHistorySettlement());
    expect(p.foundingCause).toBe(true);
    expect(p.definingCrisis).toBe(true);
  });

  it('null beats report false', () => {
    const p = historyBeatPresence(sparseHistorySettlement());
    expect(p.definingCrisis).toBe(false);
    expect(p.unresolvedWound).toBe(false);
  });
});

// ── The identity, now that the mirror is dead ──────────────────────────

/**
 * THE MIRROR IS DEAD; THIS IS AN IDENTITY CHECK.
 *
 * `deriveLikelyFuture` in historyBeats.js used to RE-DERIVE where a settlement
 * was going, under a docstring promising it "mirrors the simulationSpine logic
 * so the two derivations stay consistent". A promise is not an invariant, and
 * the two spellings drifted FOUR separate times:
 *
 *   1. DEAD KEY      the mirror read `.label`/`.name` only; a GENERATED tension
 *                    carries neither (it carries `.type` + `.description`), so
 *                    over six real settlements holding eleven tensions the
 *                    mirror's tension arm fired ZERO times and all six printed
 *                    "Continuity, with the usual slow erosion of any
 *                    settlement." beside a spine naming the real tension.
 *   2. LABEL REFUSAL the mirror read `.label` bare while the spine drew it
 *                    through `nounPhrase`; a refused label made the two name
 *                    DIFFERENT tensions while both still answered "tensions",
 *                    so the ARM pin agreed and the splice shipped anyway.
 *   3. CASING        the mirror flattened with `toLowerCase()` where the spine
 *                    used `lowerLabel`, so "grain owed to House Merrow" reached
 *                    the beat as "grain owed to house merrow".
 *   4. FIRST-NULL    the mirror read `tensions[0]` and gave up when that entry
 *                    named nothing; the spine drops unnameable entries and
 *                    answers from the first it CAN name. A settlement whose
 *                    first tension carried only a `.description` had the spine
 *                    bound to its wharf dispute while the beat reported placid
 *                    continuity — or reported nothing at all.
 *
 * (1) and (2) were repaired by sharing one STEP of the ladder, and (3) and (4)
 * are what a shared step buys you: both sides still owned the rest. So the
 * shared unit is now the WHOLE derivation — `likelyFutureFacts` — and this
 * block no longer asks whether two derivations AGREE. It asks whether there is
 * still only one, byte for byte, with no case folding anywhere to launder a
 * disagreement into a pass.
 */
describe('the likely-future beat CONSUMES the spine derivation (one writer)', () => {
  /**
   * THE SECOND, QUIETER WAY BACK TO THE SPLICE. The mirror read `.label` bare
   * while the spine put every candidate through `nounPhrase`, whose TWO
   * independent refusals (over-long; sentence break inside) both fall through
   * to the type token. So a tension carrying a refused label AND a type made
   * the two name DIFFERENT tensions — the ARM pin above still agreed, because
   * both answered "tensions", and the beat printed the narrative body the
   * guard exists to keep out of a one-line slot.
   *
   * Both fixtures carry a `.type`, which is what makes them discriminating:
   * the shared rule must land on the TYPE, not on the label and not on the
   * stability fallback. Each trips EXACTLY ONE refusal, so deleting either
   * guard is caught alone.
   *
   * These arms are reachable through AUTHORED/IMPORTED content only — a
   * generated tension carries `.type` + `.description` and no label at all.
   */
  /** Long, deliberately terminator-free: only the length cap can refuse it. */
  const OVERLONG_LABEL =
    'a caravan levy dispute between the salt factors and the river wardens'
    + ' that has run for three seasons';

  /** Short, deliberately multi-sentence: only the terminator check refuses it. */
  const MID_SENTENCE_LABEL = 'The mill burned down. No one rebuilt it';

  /** The two arms, read off each derivation's OBSERVABLE output. */
  const spineArmOf = (spine) =>
    spine.likelyFuture.includes('bound to the unresolved') ? 'tensions'
      : spine.likelyFuture === 'Its likely future is whatever the table decides to make it.' ? 'none'
        : 'stability';
  const beatArmOf = (beat) =>
    beat === null ? 'none'
      : beat.source === 'history.currentTensions' ? 'tensions'
        : 'stability';

  const FIXTURES = [
    ['the live generated shape (.type + .description)', {
      history: { currentTensions: [
        { type: 'magical_controversy', description: 'Debate over the role of magic. It has run for years.' },
        { type: 'trade_dispute', description: 'A dispute over terms.' },
      ] },
    }],
    ['an authored .label shape', {
      history: { currentTensions: [{ label: 'Guild Rivalry', description: 'Two guilds. One wharf.' }] },
    }],
    ['an authored .name shape', {
      history: { currentTensions: [{ name: 'Succession Doubt' }] },
    }],
    ['bare strings', {
      history: { currentTensions: ['water rights'] },
    }],
    ['an authored label REFUSED for length, with a type behind it', {
      history: { currentTensions: [{ label: OVERLONG_LABEL, type: 'wharf_precedence' }] },
    }],
    ['an authored label REFUSED for a sentence break, with a type behind it', {
      history: { currentTensions: [{ label: MID_SENTENCE_LABEL, type: 'granary_arrears' }] },
    }],
    // ── The two forks a shared STEP could not stop (3) and (4) ──────────────
    ['a label carrying a PROPER NAME — the CASING fork', {
      history: { currentTensions: [{ label: 'grain owed to House Merrow', type: 'granary_arrears' }] },
    }],
    ['a first tension naming NOTHING, a nameable one behind it — the FIRST-NULL fork', {
      history: { currentTensions: [
        { description: 'A dispute over terms that names nothing.' },
        { type: 'wharf_precedence', description: 'Two guilds, one wharf.' },
      ] },
      // Stability is present ON PURPOSE: the old beat fell through to it here
      // and reported continuity while the spine named the wharf dispute.
      powerStructure: { stability: 'Stable' },
    }],
    ['a first tension naming nothing and NO stability behind it', {
      history: { currentTensions: [
        { description: 'Names nothing at all.' },
        { type: 'harbour_dues' },
      ] },
    }],
    ['an ARRAY-shaped label — the edge the old docstring called non-mirrored', {
      // The spine read its label through `firstText`, which flattens an array;
      // the mirror read a string only, so the two named different tensions. The
      // old docstring recorded this as "out of the mirrored set". It is not out
      // of anything now — there is one reader.
      history: { currentTensions: [{ label: ['harbour dues dispute'], type: 'wharf_precedence' }] },
    }],
    ['tensions that ALL name nothing — both must fall to stability', {
      history: { currentTensions: [{ description: 'Names nothing.' }] },
      powerStructure: { stability: 'Critical' },
    }],
    ['no tensions, critical stability', {
      history: { currentTensions: [] }, powerStructure: { stability: 'Critical (active siege)' },
    }],
    ['no tensions, unstable stability', {
      powerStructure: { stability: 'unstable' },
    }],
    ['no tensions, stable stability', {
      powerStructure: { stability: 'Stable' },
    }],
    ['nothing at all', {}],
  ];

  it.each(FIXTURES)('agrees on which ARM answered: %s', (_label, settlement) => {
    const spineArm = spineArmOf(deriveSimulationSpine(settlement));
    const beatArm = beatArmOf(deriveHistoryBeats(settlement).likelyFuture);
    expect(
      beatArm,
      `THE ONE WRITER SPLIT — historyBeats answered from "${beatArm}" while`
      + ` simulationSpine answered from "${spineArm}". Both compose from`
      + ' likelyFutureFacts(); if they disagree about the ARM, one of them has'
      + ' grown a derivation of its own again.',
    ).toBe(spineArm);
  });

  it('THE CASING FORK, named: a proper name keeps its capitals in the beat', () => {
    // Divergence (3), pinned on its own so its repair cannot be quietly undone
    // by a `toLowerCase()` that looks like tidy sentence-casing. `lowerLabel`
    // lowers a title-cased DISPLAY label whole and leaves a PROPER NAME exactly
    // as authored; "House Merrow" is a house, not a common noun.
    const settlement = {
      history: { currentTensions: [{ label: 'grain owed to House Merrow', type: 'granary_arrears' }] },
    };
    expect(deriveHistoryBeats(settlement).likelyFuture.text)
      .toBe('Tensions point toward grain owed to House Merrow.');
    expect(deriveSimulationSpine(settlement).likelyFuture)
      .toBe('Its likely future is bound to the unresolved grain owed to House Merrow.');
    // SPECIFICITY: the rule is not "never change case". A title-cased display
    // label still lowers whole, which is what keeps "Guild Rivalry" from
    // shouting mid-sentence.
    const titled = { history: { currentTensions: [{ label: 'Guild Rivalry' }] } };
    expect(deriveHistoryBeats(titled).likelyFuture.text).toBe('Tensions point toward guild rivalry.');
  });

  it('THE FIRST-NULL FORK, named: an unnameable first tension is skipped, not surrendered to', () => {
    // Divergence (4). The old beat read `tensions[0]`, got null from an entry
    // carrying only a `.description`, and fell through to the stability
    // fallback — reporting placid continuity for a settlement the spine had
    // bound to its wharf dispute.
    const settlement = {
      history: { currentTensions: [
        { description: 'A dispute over terms that names nothing.' },
        { type: 'wharf_precedence', description: 'Two guilds, one wharf.' },
      ] },
      powerStructure: { stability: 'Stable' },
    };
    const beat = deriveHistoryBeats(settlement).likelyFuture;
    expect(beat.source, 'the beat surrendered to the stability fallback again').toBe('history.currentTensions');
    expect(beat.text).toBe('Tensions point toward wharf precedence.');
    expect(deriveSimulationSpine(settlement).likelyFuture)
      .toBe('Its likely future is bound to the unresolved wharf precedence.');
    // SPECIFICITY: when NO tension names anything, falling to stability is
    // correct — the skip must not become "always claim a tension".
    const allUnnameable = {
      history: { currentTensions: [{ description: 'Names nothing.' }] },
      powerStructure: { stability: 'Stable' },
    };
    expect(deriveHistoryBeats(allUnnameable).likelyFuture.source).toBe('powerStructure.stability');
  });

  it('names the SAME TENSION, BYTE FOR BYTE — no case folding', () => {
    // The arm check alone would pass if both read a tension and disagreed
    // about which. The spine names up to two; the beat names the first, and
    // the spine's line must contain it EXACTLY.
    //
    // ⚠️ THIS COMPARISON USED TO LAUNDER. It read
    //     spine.likelyFuture.toLowerCase() ... toContain(named.toLowerCase())
    // and that `toLowerCase()` on both sides is precisely what let divergence
    // (3) live: the beat flattened "grain owed to House Merrow" to "…house
    // merrow", the spine preserved the proper name, and folding both to
    // lowercase made the two strings match. A comparison that normalises away
    // the difference it is looking for is not a comparison. Both sides are
    // compared RAW now, and the CASING fixture above is what makes that bite.
    //
    // THE MINIMUM-HIT COUNTER. This loop `continue`s past every fixture that
    // did not answer from tensions, so a regression that silently stopped the
    // tension arm from firing AT ALL would leave it asserting nothing and
    // passing in perfect silence — the exact vacuity shape this suite exists
    // to refuse. The floor is the number of tension-answering fixtures above:
    // the generated shape, .label, .name, bare strings, the two refused-label
    // rows (which fall through to their type token), the casing row, the two
    // first-null rows, and the array-label row — ten. It TIGHTENS toward
    // reality and is never lowered to admit a regression.
    const TENSION_FIXTURES = 10;
    let checked = 0;
    for (const [label, settlement] of FIXTURES) {
      const beat = deriveHistoryBeats(settlement).likelyFuture;
      if (beat?.source !== 'history.currentTensions') continue;
      checked++;
      const named = beat.text.replace(/^Tensions point toward /, '').replace(/\.$/, '');
      expect(
        deriveSimulationSpine(settlement).likelyFuture,
        `THE ONE WRITER SPLIT on "${label}" — historyBeats bound the future to`
        + ` "${named}", which the spine's line does not name (or names with`
        + ' different capitals).',
      ).toContain(named);
      // …and it is the SHARED derivation's answer, not a second one that
      // happens to agree on these fixtures. This is the pin that would red if
      // historyBeats ever grew its own tension read back.
      expect(
        named,
        `"${label}": the beat named a tension the shared derivation did not choose`,
      ).toBe(likelyFutureFacts(settlement).tensions[0]);
    }
    expect(
      checked,
      `the WHICH-TENSION comparison ran on ${checked} fixture(s), not`
      + ` ${TENSION_FIXTURES} — the tension arm stopped firing and this pin was`
      + ' asserting nothing.',
    ).toBe(TENSION_FIXTURES);
  });

  it('the STABILITY arm is total: every trajectory the ladder can return renders', () => {
    // The two surfaces differ in VOICE by contract (the spine returns a
    // complement its frame completes; the beat returns a standalone sentence),
    // and that is the only thing either side still owns. A trajectory added to
    // the shared ladder with no row in the beat's table would render `undefined`
    // as a beat's text — a blank line in the rail, and the exact latent hole
    // this file's own docstring records for the legacyAnnotations fallback.
    expect(Object.keys(LIKELY_FUTURE_BEAT_TEXT).sort()).toEqual([...LIKELY_FUTURE_ARCS].sort());
    for (const arc of LIKELY_FUTURE_ARCS) {
      expect(typeof LIKELY_FUTURE_BEAT_TEXT[arc], `${arc} has no beat sentence`).toBe('string');
      expect(LIKELY_FUTURE_BEAT_TEXT[arc].length).toBeGreaterThan(0);
    }
    // Guard-the-guard: the ladder must not be empty, or the totality above is
    // a comparison of two empty sets.
    expect(LIKELY_FUTURE_ARCS.length).toBe(3);
  });

  it('the ORDER of the stability ladder survives: "unstable" is not "stable"', () => {
    // 'unstable'.includes('stable') is TRUE. Both files used to spell this
    // ladder themselves and both happened to order it correctly; one shared,
    // ordered ladder is why that is no longer luck. Read through BOTH surfaces
    // so a reordering cannot hide on either side.
    const at = (stability) => ({ powerStructure: { stability } });
    expect(likelyFutureFacts(at('Unstable')).arc).toBe('test');
    expect(likelyFutureFacts(at('Stable')).arc).toBe('continuity');
    expect(deriveHistoryBeats(at('Unstable')).likelyFuture.text).toBe(LIKELY_FUTURE_BEAT_TEXT.test);
    expect(deriveSimulationSpine(at('Unstable')).likelyFuture)
      .toBe('Its likely future is a test of whoever holds the chair.');
  });

  it('the refusal fixtures really do isolate one guard each', () => {
    // The control on the controls, mirroring simulationSpine.test.js's. If a
    // fixture drifts across the other guard's threshold, its arm stops
    // proving what it claims and this says so before the silence does.
    expect(OVERLONG_LABEL.length, 'the overlong fixture must exceed the 80-char cap')
      .toBeGreaterThan(80);
    expect(OVERLONG_LABEL, 'the overlong fixture must carry NO sentence break')
      .not.toMatch(/[.!?]\s/);
    expect(MID_SENTENCE_LABEL.length, 'the mid-sentence fixture must sit UNDER the cap')
      .toBeLessThanOrEqual(80);
    expect(MID_SENTENCE_LABEL, 'the mid-sentence fixture must carry a sentence break')
      .toMatch(/[.!?]\s/);
  });

  it('a REFUSED label falls through to the type token on BOTH sides', () => {
    // The pin on the divergence itself. Before the mirror imported the
    // spine's guard, the beat named the refused label while the spine named
    // the type — the ARM pin agreed ("tensions" both) and the beat printed
    // the splice defect anyway. One row per refusal, so each guard's deletion
    // is caught alone rather than by their conjunction.
    const arms = [
      ['LENGTH', OVERLONG_LABEL, 'wharf_precedence', 'wharf precedence', 'caravan levy dispute'],
      ['SENTENCE BREAK', MID_SENTENCE_LABEL, 'granary_arrears', 'granary arrears', 'burned down'],
    ];
    for (const [guard, label, type, humanized, labelFragment] of arms) {
      const settlement = { history: { currentTensions: [{ label, type }] } };
      const beat = deriveHistoryBeats(settlement).likelyFuture;
      const spine = deriveSimulationSpine(settlement);
      expect(beat?.source, `${guard}: the beat abandoned the tension arm entirely`)
        .toBe('history.currentTensions');
      expect(beat.text, `${guard} guard: the beat named the REFUSED label, not the type`)
        .toBe(`Tensions point toward ${humanized}.`);
      expect(beat.text, `${guard} guard: the refused label reached the beat`)
        .not.toContain(labelFragment);
      expect(spine.likelyFuture, `${guard} guard: the spine named the REFUSED label`)
        .toBe(`Its likely future is bound to the unresolved ${humanized}.`);
    }
  });

  it('the guard is SPECIFIC: a label clean on both counts still names the LABEL', () => {
    // The negative control for both arms above. Without it, refusing every
    // label and always falling to the type would satisfy them perfectly.
    const settlement = {
      history: { currentTensions: [{ label: 'Guild Rivalry', type: 'wharf_precedence' }] },
    };
    const beat = deriveHistoryBeats(settlement).likelyFuture;
    expect(beat.text).toBe('Tensions point toward guild rivalry.');
    expect(deriveSimulationSpine(settlement).likelyFuture)
      .toBe('Its likely future is bound to the unresolved guild rivalry.');
  });

  it('over REAL generated settlements, the tension arm is REACHABLE on both sides', () => {
    // The anti-vacuity control, and the pin on the defect itself: if the
    // mirror regresses to a dead key it falls to `stability` on every real
    // settlement, the arms disagree, and the per-arm pin above cannot see it
    // because these fixtures are hand-written.
    const family = [
      ['mirror-a', { settType: 'town', tradeRouteAccess: 'crossroads' }],
      ['mirror-b', { settType: 'village', tradeRouteAccess: 'river' }],
      ['mirror-c', { settType: 'city', tradeRouteAccess: 'port' }],
      ['mirror-d', { settType: 'hamlet' }],
    ];
    let tensionArmHits = 0;
    for (const [seed, config] of family) {
      const settlement = gen(config, seed);
      // Positive control: these settlements really do carry tensions, so a
      // zero census below is a defect and not an empty corpus.
      expect(settlement.history.currentTensions.length,
        `seed ${seed} generated no tensions — the census would be vacuous`)
        .toBeGreaterThan(0);
      const beat = deriveHistoryBeats(settlement).likelyFuture;
      const spine = deriveSimulationSpine(settlement);
      expect(beatArmOf(beat), `seed ${seed}: the arms disagree`).toBe(spineArmOf(spine));
      if (beat?.source === 'history.currentTensions') tensionArmHits++;
    }
    expect(tensionArmHits,
      'the mirror never reached the tension arm on a real settlement — the'
      + ' dead-key defect is back')
      .toBe(family.length);
  });
});
