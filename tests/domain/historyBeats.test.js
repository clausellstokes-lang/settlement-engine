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
} from '../../src/domain/historyBeats.js';
import { deriveSimulationSpine } from '../../src/domain/simulationSpine.js';
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

// ── The lockstep the docstring promises ────────────────────────────────

/**
 * `deriveLikelyFuture` in historyBeats.js says, in its own comment, that it
 * "Mirrors the simulationSpine logic so the two derivations stay consistent."
 * That sentence was false for as long as it has existed: the mirror read a
 * tension by `.label`/`.name`, and a GENERATED tension carries neither — it
 * carries `.type` (a snake_case token) and `.description` (a sentence).
 *
 * Measured over six real settlements carrying eleven tensions between them,
 * the mirror's tension arm fired ZERO times. All six printed the identical
 * fallback, "Continuity, with the usual slow erosion of any settlement.",
 * while the spine beside them named the actual tension. A docstring is not an
 * invariant; this block is the one that stops the two from drifting again, and
 * it names the side that moved.
 */
describe('the likely-future mirror moves in lockstep with the spine', () => {
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
      `THE MIRROR DRIFTED — historyBeats answered from "${beatArm}" while`
      + ` simulationSpine answered from "${spineArm}". historyBeats.js`
      + ` deriveLikelyFuture is the side that must follow the spine.`,
    ).toBe(spineArm);
  });

  it('agrees on WHICH TENSION, not merely that there was one', () => {
    // The arm check alone would pass if both read a tension and disagreed
    // about which. The spine names up to two; the beat names the first, and
    // the spine's line must contain it.
    for (const [label, settlement] of FIXTURES) {
      const beat = deriveHistoryBeats(settlement).likelyFuture;
      if (beat?.source !== 'history.currentTensions') continue;
      const named = beat.text.replace(/^Tensions point toward /, '').replace(/\.$/, '');
      expect(
        deriveSimulationSpine(settlement).likelyFuture.toLowerCase(),
        `THE MIRROR DRIFTED on "${label}" — historyBeats bound the future to`
        + ` "${named}", which the spine's line does not name.`,
      ).toContain(named.toLowerCase());
    }
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
