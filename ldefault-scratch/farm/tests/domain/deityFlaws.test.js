/**
 * deityFlaws.test.js — W-FAITH F5c: the vice-pole flaw register.
 *
 * Four claims, in the order the module states them: the register is a CANDIDATE the
 * owner has not signed; its eight rows PARTITION exactly (both ways) into the two
 * charter-anchored modulations, one declared-dormant row, four homed vocabulary rows
 * and one honestly unhomed row; its mirrors cannot rot away from either source; and
 * the two modulation readers answer the identity whenever they are inert.
 *
 * ⚠ EVERY EXPECTED NUMBER IS COMPUTED BY HAND IN THE COMMENT ABOVE IT (the
 * faithFieldEquation discipline): a test that re-runs the implementation's own
 * arithmetic asserts only that multiplication is deterministic.
 */
import { describe, test, expect } from 'vitest';
import {
  DEITY_CHART_AXIS_IDS,
  DEITY_AXIS_LEVELS,
} from '../../src/domain/customContentSchema.js';
import { PARADIGM_AXES, AXIS_LEVELS } from '../../src/domain/npc/paradigmAxisCatalog.js';
import {
  DEITY_FLAW_PROVENANCE,
  DEITY_FLAW_LEVELS,
  DEITY_FLAWS,
  FLAW_EFFECTS,
  DEITY_FLAW_TUNING,
  viceLevelOf,
  jealousBoonScale01,
  fortunesFalling,
  wrathSharpenedDemotion,
} from '../../src/domain/worldPulse/deityFlaws.js';

const MECHANICS = ['modulates', 'declared_dormant', 'vocabulary_only', 'unhomed'];

describe('PROVENANCE — an owner-taste candidate register, unfrozen until the pen', () => {
  test('the register is explicitly OWNER-UNSIGNED', () => {
    expect(DEITY_FLAW_PROVENANCE.signedBy).toBeNull();
    expect(DEITY_FLAW_PROVENANCE.status).toContain('CANDIDATE');
    expect(DEITY_FLAW_PROVENANCE.status).toContain('OWNER-UNSIGNED');
    expect(DEITY_FLAW_PROVENANCE.status).toContain('frozen only by the owner pen');
  });

  test('the provenance names the supersession it is built under', () => {
    expect(DEITY_FLAW_PROVENANCE.ruling).toContain('800.3 J2');
    expect(DEITY_FLAW_PROVENANCE.source).toContain('DESIGN_W_LIVES 6');
  });
});

describe('THE PARTITION — every row is exactly one thing, both ways', () => {
  test('eight rows, unique words, every mechanics value from the closed set', () => {
    expect(DEITY_FLAWS.length).toBe(8);
    const words = DEITY_FLAWS.map((r) => r.word);
    expect(new Set(words).size).toBe(8);
    for (const row of DEITY_FLAWS) {
      expect(MECHANICS, `${row.word}: unknown mechanics '${row.mechanics}'`).toContain(row.mechanics);
      expect(typeof row.note === 'string' && row.note.length > 0,
        `${row.word}: a row with no written reason is a decision nobody can veto`).toBe(true);
    }
  });

  test('the two packet-anchored modulations exist EXACTLY, and nothing else modulates', () => {
    const modulating = DEITY_FLAWS.filter((r) => r.mechanics === 'modulates');
    expect(modulating.map((r) => r.word).sort()).toEqual(['jealous', 'wrathful']);
    // jealous reads share (the packet row's first example), on the boon term.
    expect(FLAW_EFFECTS.CONTENT).toEqual({ flaw: 'jealous', modulates: 'boon_term', reads: 'share' });
    // wrathful reads fortunes (the packet row's second example), on the witness pull.
    expect(FLAW_EFFECTS.TEMPER).toEqual({ flaw: 'wrathful', modulates: 'witness_pull', reads: 'fortunes' });
  });

  test('the partition closes both ways: register rows ↔ effect-table keys', () => {
    const effectAxes = Object.keys(FLAW_EFFECTS).sort();
    const modulatingAxes = DEITY_FLAWS
      .filter((r) => r.mechanics === 'modulates')
      .map((r) => r.axisId)
      .sort();
    // Every effect key is claimed by exactly one modulating row, and vice versa — a
    // quietly deleted binding, or an effect nobody claims, reds here.
    expect(modulatingAxes).toEqual(effectAxes);
    for (const [axisId, effect] of Object.entries(FLAW_EFFECTS)) {
      const row = DEITY_FLAWS.find((r) => r.axisId === axisId && r.mechanics === 'modulates');
      expect(row?.word, `${axisId}: the effect table and the register disagree about the flaw word`).toBe(effect.flaw);
    }
  });

  test('unhomed means unhomed: null axis, null mapping — and only meddling is', () => {
    for (const row of DEITY_FLAWS) {
      const unhomed = row.mechanics === 'unhomed';
      expect(row.axisId === null, `${row.word}: axisId must be null exactly when unhomed`).toBe(unhomed);
      expect(row.mappedTo === null, `${row.word}: mappedTo must be null exactly when unhomed`).toBe(unhomed);
    }
    expect(DEITY_FLAWS.filter((r) => r.mechanics === 'unhomed').map((r) => r.word)).toEqual(['meddling']);
  });

  test('⛔ no flaw invents a new engine quantity: the reads are a closed two-word set', () => {
    // The whole layer reads the religion state's shares and the pantheon ledger's
    // wins/losses — quantities that exist. A third `reads` value is a new coupling
    // that owes its own measurement, and it reds here until it gets one.
    for (const effect of Object.values(FLAW_EFFECTS)) {
      expect(['share', 'fortunes']).toContain(effect.reads);
      expect(['boon_term', 'witness_pull']).toContain(effect.modulates);
    }
  });

  test('capricious is DECLARED dormant, with the variance reason written down', () => {
    const row = DEITY_FLAWS.find((r) => r.word === 'capricious');
    expect(row?.mechanics).toBe('declared_dormant');
    expect(row?.note).toContain('variance');
    // Declared dormant, so it must NOT appear in the effect table.
    const axes = Object.values(FLAW_EFFECTS).map((e) => e.flaw);
    // anchored: the effect table's exact contents are pinned two arms above
    expect(axes).not.toContain('capricious');
  });
});

describe('DRIFT GUARDS — the mirrors are pinned to BOTH sources', () => {
  test('the level ladder mirrors the catalog and the schema, in order', () => {
    expect([...DEITY_FLAW_LEVELS]).toEqual([...AXIS_LEVELS]);
    expect([...DEITY_FLAW_LEVELS]).toEqual([...DEITY_AXIS_LEVELS]);
  });

  test('every homed axis id exists in the schema roster AND the catalog', () => {
    const catalogIds = new Set(PARADIGM_AXES.map((a) => a.id));
    for (const row of DEITY_FLAWS) {
      if (row.axisId === null) continue;
      expect(DEITY_CHART_AXIS_IDS, `${row.word}: ${row.axisId} is not an authorable deity axis`).toContain(row.axisId);
      expect(catalogIds.has(row.axisId), `${row.word}: ${row.axisId} is not in the paradigm catalog`).toBe(true);
    }
  });

  test('every homed mapping sits on that axis\'s VICE side in the catalog — the vice-pole law', () => {
    for (const row of DEITY_FLAWS) {
      if (row.axisId === null) continue;
      const axis = PARADIGM_AXES.find((a) => a.id === row.axisId);
      const viceWords = [axis?.vice.word, ...(axis?.vice.expressions ?? [])];
      expect(viceWords, `${row.word}: '${row.mappedTo}' is not on ${row.axisId}'s vice side`).toContain(row.mappedTo);
    }
  });

  test('the effect table keys are authorable deity axes', () => {
    for (const axisId of Object.keys(FLAW_EFFECTS)) {
      expect(DEITY_CHART_AXIS_IDS).toContain(axisId);
    }
  });
});

describe('viceLevelOf — set membership on every part, both admitted shapes', () => {
  test('absence in every spelling reads as null', () => {
    expect(viceLevelOf(null, 'CONTENT')).toBeNull();
    expect(viceLevelOf({}, 'CONTENT')).toBeNull();
    expect(viceLevelOf({ characterAxes: '' }, 'CONTENT')).toBeNull();
    expect(viceLevelOf({ characterAxes: [] }, 'CONTENT')).toBeNull();
  });

  test('a virtue position is NOT a flaw', () => {
    expect(viceLevelOf({ characterAxes: 'CONTENT:virtue:defining' }, 'CONTENT')).toBeNull();
  });

  test('a malformed token or an off-ladder level reads as absent, never coerced', () => {
    expect(viceLevelOf({ characterAxes: 'CONTENT:vice' }, 'CONTENT')).toBeNull();
    expect(viceLevelOf({ characterAxes: 'CONTENT:vice:sublime' }, 'CONTENT')).toBeNull();
    expect(viceLevelOf({ characterAxes: 42 }, 'CONTENT')).toBeNull();
  });

  test('both admitted shapes read: one token as a string, several as a list', () => {
    expect(viceLevelOf({ characterAxes: 'CONTENT:vice:marked' }, 'CONTENT')).toBe('marked');
    expect(viceLevelOf(
      { characterAxes: ['MERCY:virtue:defining', 'CONTENT:vice:a_touch'] }, 'CONTENT',
    )).toBe('a_touch');
  });
});

describe('jealousBoonScale01 — identity when inert, the hand-computed fade when not', () => {
  const JEALOUS = Object.freeze({ characterAxes: ['CONTENT:vice:defining'] });

  test('every inert case answers the literal 1', () => {
    expect(jealousBoonScale01(null, 0.45)).toBe(1);
    expect(jealousBoonScale01({}, 0.45)).toBe(1);
    expect(jealousBoonScale01({ characterAxes: 'CONTENT:virtue:defining' }, 0.45)).toBe(1);
    expect(jealousBoonScale01({ characterAxes: 'MERCY:vice:defining' }, 0.45)).toBe(1);
    expect(jealousBoonScale01(JEALOUS, 0)).toBe(1);
  });

  test('defining at 0.45 contested: 1 − 1 × 1 × 0.45 = 0.55', () => {
    expect(jealousBoonScale01(JEALOUS, 0.45)).toBeCloseTo(0.55, 12);
  });

  test('marked at 0.45 contested: 1 − 1 × 0.7 × 0.45 = 0.685', () => {
    expect(jealousBoonScale01({ characterAxes: 'CONTENT:vice:marked' }, 0.45)).toBeCloseTo(0.685, 12);
  });

  test('a_touch at full contest: 1 − 1 × 0.35 × 1 = 0.65', () => {
    expect(jealousBoonScale01({ characterAxes: 'CONTENT:vice:a_touch' }, 1)).toBeCloseTo(0.65, 12);
  });

  test('defining at full contest bottoms out at exactly 0 — clamped, never negative', () => {
    // 1 − 1 × 1 × 1 = 0; and an out-of-range contested value clamps to the same floor.
    expect(jealousBoonScale01(JEALOUS, 1)).toBe(0);
    expect(jealousBoonScale01(JEALOUS, 7)).toBe(0);
  });

  test('a nonsense contested value reads as nothing contested', () => {
    expect(jealousBoonScale01(JEALOUS, Number.NaN)).toBe(1);
  });
});

describe('fortunesFalling — the estate\'s own loss-history shape', () => {
  test('absent, empty, level and winning books are all NOT falling', () => {
    expect(fortunesFalling(null)).toBe(false);
    expect(fortunesFalling(undefined)).toBe(false);
    expect(fortunesFalling({})).toBe(false);
    expect(fortunesFalling({ wins: 2, losses: 2 })).toBe(false);
    expect(fortunesFalling({ wins: 3, losses: 1 })).toBe(false);
  });

  test('more losses than wins is falling; junk counts read as zero', () => {
    expect(fortunesFalling({ wins: 1, losses: 3 })).toBe(true);
    expect(fortunesFalling({ losses: 1 })).toBe(true);
    expect(fortunesFalling({ wins: 'many', losses: 1 })).toBe(true);
    expect(fortunesFalling({ wins: 1, losses: 'many' })).toBe(false);
  });
});

describe('wrathSharpenedDemotion — one rung back, on the one position, never past the ceiling', () => {
  const FALLING = Object.freeze({ wins: 1, losses: 3 });

  test('the TEMPER vice pull recovers one rung while fortunes fall', () => {
    expect(wrathSharpenedDemotion('TEMPER:vice:marked', 1, FALLING)).toBe(0);
    expect(wrathSharpenedDemotion('TEMPER:vice:defining', 2, FALLING)).toBe(1);
  });

  test('⭐ the floor is 0 — the authored level stays a hard ceiling by arithmetic', () => {
    // Demotion 0 means the pull already lands AT the authored level; sharpening from
    // there must not push the band above it (§856: the ladder only steps down).
    expect(wrathSharpenedDemotion('TEMPER:vice:defining', 0, FALLING)).toBe(0);
  });

  test('nothing else sharpens: other axes, the virtue pole, malformed tokens', () => {
    expect(wrathSharpenedDemotion('MERCY:vice:marked', 1, FALLING)).toBe(1);
    expect(wrathSharpenedDemotion('TEMPER:virtue:marked', 1, FALLING)).toBe(1);
    expect(wrathSharpenedDemotion('TEMPER:vice', 1, FALLING)).toBe(1);
    expect(wrathSharpenedDemotion('', 1, FALLING)).toBe(1);
  });

  test('level or absent fortunes sharpen nothing', () => {
    expect(wrathSharpenedDemotion('TEMPER:vice:marked', 1, { wins: 3, losses: 1 })).toBe(1);
    expect(wrathSharpenedDemotion('TEMPER:vice:marked', 1, undefined)).toBe(1);
    expect(wrathSharpenedDemotion('TEMPER:vice:marked', 1, null)).toBe(1);
  });

  test('the tuning surface is the declared owner-unsigned candidate shape', () => {
    expect(DEITY_FLAW_TUNING.WRATH_SHARPEN_RUNGS).toBe(1);
    expect(DEITY_FLAW_TUNING.JEALOUS_BOON_FADE).toBe(1);
    expect(DEITY_FLAW_TUNING.LEVEL_SCALE).toEqual({ a_touch: 0.35, marked: 0.7, defining: 1 });
  });
});
