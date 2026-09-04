/**
 * defenseStateProseDesk.test.js — DESK CAR 12: the defense desk.
 *
 * ⭐ THIS SUITE GUARDS THE FIRST PRODUCTION USE OF THE DM'S-PEN PROJECTION.
 * `projectBesideDmField` had ZERO runtime callers before this car — unit-tested, never
 * exercised. So the law it exists to hold is re-proved HERE, against the desk that now
 * depends on it, rather than cited from its own suite: the DM's string comes back BY
 * IDENTITY, and the bytes of a wired field equal the bytes of a dark one.
 *
 * ⛔ No `it.each`: the lighting walker parks a whole file that registers tests from a
 * non-literal table, and its each-family debt is a SHRINK-ONLY ratchet.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  SLOT_FILL_SHAPES, SLOT_FILL_TABLES, defenseStateProse, firstSurveyPoolKey,
  isCompoundSafetyLabel, publicOrderPoolKey,
} from '../../src/domain/display/stateProse/defenseStateProse.js';
import { DM_FIELD_FRAMED_BY_BLOCK, isDmEditableProsePath } from '../../src/domain/display/stateProse/dmFieldProjection.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_MOUNTS, UNMOUNTED_BLOCKS, sentenceMountForBlock } from '../../src/domain/display/stateProse/dossierMounts.js';
import { parseSlotShapes, mergeSlotShapes } from '../../scripts/lib/dossier-slot-shapes.mjs';

const DEF3 = 'DS-DEF-3';
const DEF3_POOLS = DOSSIER_STATE_PROSE_DEFENSE[DEF3].pools;
const SRC = resolve(import.meta.dirname, '../../src');

const DOCS = resolve(import.meta.dirname, '../../docs/content');
const SHAPES = mergeSlotShapes([
  parseSlotShapes(readFileSync(resolve(DOCS, 'RECEIPT_POOLS_DOSSIER_STATE.md'), 'utf8'), 'STATE'),
  parseSlotShapes(readFileSync(resolve(DOCS, 'RECEIPT_POOLS_CAUSAL_DOSSIER.md'), 'utf8'), 'CAUSAL'),
]);

/** The five clean labels `safetyProfile.js` writes. */
const CLEAN_LABELS = ['Very Safe', 'Safe', 'Moderate', 'Unsafe', 'Dangerous'];
/** Real compound forms the generator builds under a crisis. */
const COMPOUND_LABELS = [
  'Controlled — Occupation Curfew', 'Tense — Active Siege', 'Desperate — Famine Conditions',
  'Strained — Plague Conditions', 'Tense — Wartime',
];
const DM_LINE = 'The watch is thorough by day and thin after dark.';
const town = (safetyLabel, safetyDesc = DM_LINE) => ({
  name: 'Thornwall', _seed: 'seed-def',
  economicState: { safetyProfile: { safetyLabel, safetyDesc } },
});

describe('the defense desk — the label vocabulary is the producer\'s', () => {
  it('the five clean labels are an EXACT 1:1 with the five label pools', () => {
    for (const label of CLEAN_LABELS) {
      expect(DEF3_POOLS[label], `corpus has no pool ${label}`).toBeTruthy();
      expect(publicOrderPoolKey(label)).toBe(label);
    }
    // Both directions: the corpus carries no label pool the generator cannot write.
    const labelPools = Object.keys(DEF3_POOLS)
      .filter((k) => !k.startsWith('COMPOUND') && !k.startsWith('First-Survey'));
    expect([...labelPools].sort()).toEqual([...CLEAN_LABELS].sort());
    // An unrecognised label renders nothing — a safety band is a claim about whether the
    // streets are safe, and the neighbouring band is the wrong one to guess.
    expect(publicOrderPoolKey('Placid')).toBeNull();
    expect(publicOrderPoolKey('')).toBeNull();
    expect(publicOrderPoolKey(undefined)).toBeNull();
  });

  it('a crisis-rewritten label goes to COMPOUND, detected by the dash and not a name list', () => {
    for (const label of COMPOUND_LABELS) {
      expect(isCompoundSafetyLabel(label), label).toBe(true);
      expect(publicOrderPoolKey(label)).toBe('COMPOUND override (a crisis stress has rewritten the label)');
    }
    for (const label of CLEAN_LABELS) expect(isCompoundSafetyLabel(label), label).toBe(false);
    // Detecting the DASH rather than listing crisis names is deliberate: a new crisis would
    // otherwise read as an ordinary label, which is the quiet-degradation shape. A crisis
    // this suite has never heard of still routes correctly.
    expect(publicOrderPoolKey('Tense — Some Future Crisis'))
      .toBe('COMPOUND override (a crisis stress has rewritten the label)');
  });

  it('the declared slot shapes equal the annex register, and the desk owns no fill table', () => {
    for (const [slot, shape] of Object.entries(SLOT_FILL_SHAPES)) {
      expect(SHAPES.shapeOf(slot), `slot {${slot}}`).toBe(shape);
    }
    expect(SLOT_FILL_TABLES).toEqual({});
    // Every DS-DEF-3 variant names {settlement} and nothing else.
    const slots = new Set(Object.values(DEF3_POOLS).flat().flatMap((v) => v.slots || []));
    expect([...slots]).toEqual(['settlement']);
  });
});

describe('the defense desk — the FIRST-SURVEY framing rests on a measurement', () => {
  it('⭐ safetyLabel has NO world-pulse writer, which is why the qualification always holds', () => {
    // The pool is a FRAMING line rather than a state-keyed one, and the basis is that the
    // reading is never re-judged after generation. That is measured here, not assumed: if a
    // world-pulse module ever starts writing safetyLabel, this arm reds and the framing has
    // to be revisited rather than quietly becoming false.
    const pulseDir = resolve(SRC, 'domain/worldPulse');
    const writers = readdirSync(pulseDir)
      .filter((f) => f.endsWith('.js'))
      .filter((f) => /safetyLabel/.test(readFileSync(resolve(pulseDir, f), 'utf8')));
    expect(writers, `worldPulse now touches safetyLabel: ${writers}`).toEqual([]);
    // And it applies whenever there is a reading to qualify, and never without one.
    expect(firstSurveyPoolKey('Safe')).toBe('First-Survey qualification (the reading is a first look)');
    expect(firstSurveyPoolKey('Tense — Active Siege')).toBeTruthy();
    expect(firstSurveyPoolKey('')).toBeNull();
    expect(firstSurveyPoolKey(undefined)).toBeNull();
  });

  it('ALIVENESS: all SEVEN pools speak over labels the generator really writes', () => {
    const reached = new Set();
    for (const label of [...CLEAN_LABELS, ...COMPOUND_LABELS]) {
      const drawn = defenseStateProse(town(label), { seed: `d-${label}` });
      for (const key of ['publicOrder', 'firstSurvey']) {
        const rung = drawn[key]?.rung;
        if (rung?.sentence) {
          reached.add(rung.provenance.poolKey);
          expect(rung.provenance.blockId).toBe(DEF3);
          expect(rung.sentence).not.toMatch(/[{}]/);
          expect(rung.sentence).not.toMatch(/[0-9]/);
        }
      }
    }
    expect(reached.size, `reached: ${[...reached]}`).toBe(7);
    expect(Object.keys(DEF3_POOLS)).toHaveLength(7);
  });
});

describe('the defense desk — ⭐ THE DM\'S PEN, first production use', () => {
  it('the block frames a DECLARED DM-editable field', () => {
    const path = DM_FIELD_FRAMED_BY_BLOCK[DEF3];
    expect(path).toBe('economicState.safetyProfile.safetyDesc');
    expect(isDmEditableProsePath(path), 'the framed path is not declared editable').toBe(true);
  });

  it('⛔ THE PIN — the DM\'s field comes back BY IDENTITY, and wired bytes === dark bytes', () => {
    const wired = defenseStateProse(town('Unsafe'), { seed: 'pin' });
    // BY IDENTITY, not merely equal: the projection may not trim, re-case or compose it.
    expect(wired.publicOrder.field).toBe(DM_LINE);
    expect(wired.publicOrder.hasField).toBe(true);
    expect(wired.publicOrder.beside).toBeTruthy();
    // THE LAW: a DM-edited field renders the same bytes with the corpus fully wired as it
    // does with the corpus absent. The corpus is made absent by giving no readable label.
    const dark = defenseStateProse(town('', DM_LINE), { seed: 'pin' });
    expect(dark.publicOrder, 'no readable label ⇒ no rung at all').toBeNull();
    // …and the field the caller would render is untouched in both worlds.
    expect(wired.publicOrder.field).toBe(DM_LINE);
  });

  it('the machine line is OFFERED, never substituted — and is null when the corpus is silent', () => {
    // No DM field at all: the corpus line is still offered beside an empty position.
    const noDm = defenseStateProse({ name: 'Thornwall', economicState: { safetyProfile: { safetyLabel: 'Safe' } } }, { seed: 'n' });
    expect(noDm.publicOrder.hasField).toBe(false);
    expect(noDm.publicOrder.beside).toBeTruthy();
    // A settlement with no safety profile says nothing at all, and does not crash.
    expect(defenseStateProse({ name: 'Thornwall' }).publicOrder).toBeNull();
    expect(defenseStateProse(undefined).firstSurvey).toBeNull();
  });

  it('⭐ the desk returns PROJECTIONS, not bare rungs — a composer has nowhere to put a write', () => {
    // The structural half of the law. If this desk returned a bare rung, a caller could
    // render the machine sentence into the position the DM's field occupies and nothing
    // would stop it. The returned shape carries `field`/`beside`/`hasField`, so the only
    // thing a caller can do with the machine line is put it BESIDE.
    const drawn = defenseStateProse(town('Dangerous'), { seed: 'shape' });
    for (const key of ['publicOrder', 'firstSurvey']) {
      expect(Object.keys(drawn[key]).sort()).toEqual(['beside', 'field', 'hasField', 'rung']);
    }
    // And the caller cannot mutate what it was handed.
    expect(Object.isFrozen(drawn.publicOrder)).toBe(true);
  });

  it('the registry mounts DS-DEF-3 once, as a sentence, on the defense tab', () => {
    const rows = DOSSIER_MOUNTS.filter((row) => row.blockId === DEF3);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ mount: 'defense.publicOrder', tab: 'defense', desk: 'defense', rung: 'sentence' });
    expect(sentenceMountForBlock(DEF3)?.mount).toBe('defense.publicOrder');
    // Derived, never a hardcoded dark-block literal — an assertion naming a block as DARK
    // goes stale the moment it is lit, which cost this lane an arm one wave ago.
    for (const row of DOSSIER_MOUNTS.filter((r) => r.desk === 'defense')) {
      expect(UNMOUNTED_BLOCKS).not.toContain(row.blockId);
    }
  });
});
