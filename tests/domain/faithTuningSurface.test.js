/**
 * faithTuningSurface.test.js — W-FAITH F6c: the faith tuning signature surface.
 *
 * What is pinned here, and why each pin exists:
 *
 *   1. THE SIGNATURE RECORD is exactly `{ signed: false, live: false }` today. When
 *      the owner signs, THIS ARM MOVES WITH THE SIGNING DIFF — that is by design:
 *      the pen's one-file edit rides a collection, and the collection updates the
 *      pin beside it. An unsigned surface that drifted to `signed: true` without
 *      that ceremony is exactly what this arm refuses.
 *   2. THE SIGN-THEN-LIGHT LAW is executable, not just structural: `faithTuningArmed`
 *      takes the record as a defaulted argument, so the counterfactual corners are
 *      driven here without mutating the frozen record. `live` alone arms NOTHING.
 *   3. THE PEN-FREEZE PINS state every candidate value literally. A value that moves
 *      without this file moving in the same diff is a tuning change smuggled past
 *      the signature surface — the exact defect the surface exists to end.
 *   4. THE IDENTITY PINS prove the re-exports are the SAME OBJECTS, so a fork
 *      between the surface's numbers and a consumer's numbers is unconstructible.
 *   5. THE COVERAGE PARTITION holds `FAITH_TUNING_COVERAGE` to the tables both
 *      ways, and the ONE-HOME RATCHET refuses a tuning table re-minted beside a
 *      consumer (the D4 car's ratchet, applied to this family).
 */
import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  FAITH_TUNING_SIGNATURE,
  faithTuningArmed,
  FAITH_FIELD_DOOR,
  FAITH_TUNING_PROVENANCE,
  FAITH_TUNING_COVERAGE,
  FAITH_FIELD_TUNING,
  DEITY_FLAW_TUNING,
  FAITH_WITNESS_TUNING,
} from '../../src/domain/worldPulse/faithTuningSurface.js';
import * as faithField from '../../src/domain/worldPulse/faithField.js';
import * as deityFlaws from '../../src/domain/worldPulse/deityFlaws.js';
import * as faithWitnessSource from '../../src/domain/worldPulse/faithWitnessSource.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('the signature record — two words, unsigned and dark today', () => {
  test('the record is EXACTLY { signed: false, live: false }, and it is frozen', () => {
    // ⚠ When the owner signs, this arm is updated IN THE SIGNING DIFF — see the
    // header. Until that diff exists, any other state of the record is a defect.
    expect(FAITH_TUNING_SIGNATURE).toEqual({ signed: false, live: false });
    expect(Object.isFrozen(FAITH_TUNING_SIGNATURE)).toBe(true);
  });

  test('the provenance says CANDIDATE and carries the empty signedBy slot', () => {
    expect(FAITH_TUNING_PROVENANCE.signedBy).toBeNull();
    expect(FAITH_TUNING_PROVENANCE.status).toContain('OWNER-UNSIGNED');
    expect(FAITH_TUNING_PROVENANCE.status).toContain('CANDIDATE');
    expect(Object.isFrozen(FAITH_TUNING_PROVENANCE)).toBe(true);
  });
});

describe('the sign-then-light law — executable at every corner', () => {
  test('today the surface is NOT armed', () => {
    expect(faithTuningArmed()).toBe(false);
  });

  test('⛔ live alone arms NOTHING — lighting an unsigned surface is not expressible', () => {
    // THE LAW THIS SURFACE EXISTS FOR (the §810 R5 shape, made structural the way
    // the D4 density signature made it): a door opened over unsigned numbers is the
    // "mint under unsigned numbers" defect, and the && derivation refuses it.
    expect(faithTuningArmed({ signed: false, live: true })).toBe(false);
  });

  test('signed but unlit stays dark — the owner can sign, soak, then light', () => {
    expect(faithTuningArmed({ signed: true, live: false })).toBe(false);
  });

  test('signed AND lit arms', () => {
    expect(faithTuningArmed({ signed: true, live: true })).toBe(true);
  });

  test('only the literal boolean true signs — a truthy imposter does not', () => {
    expect(faithTuningArmed({ signed: 'true', live: true })).toBe(false);
    expect(faithTuningArmed({ signed: true, live: 1 })).toBe(false);
    expect(faithTuningArmed({})).toBe(false);
  });
});

describe('the pen-freeze pins — every candidate value, literally', () => {
  test('FAITH_FIELD_TUNING is at its exact F3c/F4c candidate state', () => {
    expect(FAITH_FIELD_TUNING).toEqual({
      PATRON_AMP: 1.6,
      STRENGTH: { faint: 0.05, firm: 0.12, heavy: 0.25 },
      DAMP_MAX: 0.6,
      CAUSAL_SWING: 20,
    });
    expect(Object.isFrozen(FAITH_FIELD_TUNING)).toBe(true);
    expect(Object.isFrozen(FAITH_FIELD_TUNING.STRENGTH)).toBe(true);
  });

  test('DEITY_FLAW_TUNING is at its exact F5c candidate state', () => {
    expect(DEITY_FLAW_TUNING).toEqual({
      JEALOUS_BOON_FADE: 1,
      LEVEL_SCALE: { a_touch: 0.35, marked: 0.7, defining: 1 },
      WRATH_SHARPEN_RUNGS: 1,
    });
    expect(Object.isFrozen(DEITY_FLAW_TUNING)).toBe(true);
    expect(Object.isFrozen(DEITY_FLAW_TUNING.LEVEL_SCALE)).toBe(true);
  });

  test('FAITH_WITNESS_TUNING is at its exact F3c candidate state', () => {
    expect(FAITH_WITNESS_TUNING).toEqual({ FULL_EXPOSURE: 0.6, PART_EXPOSURE: 0.25 });
    expect(Object.isFrozen(FAITH_WITNESS_TUNING)).toBe(true);
  });
});

describe('the identity pins — the re-exports ARE the surface objects, a fork is unconstructible', () => {
  test('faithField re-exports the surface tuning table by identity', () => {
    expect(faithField.FAITH_FIELD_TUNING).toBe(FAITH_FIELD_TUNING);
  });

  test('deityFlaws re-exports the surface tuning table by identity', () => {
    expect(deityFlaws.DEITY_FLAW_TUNING).toBe(DEITY_FLAW_TUNING);
  });

  test('faithWitnessSource re-exports the surface tuning table by identity', () => {
    expect(faithWitnessSource.FAITH_WITNESS_TUNING).toBe(FAITH_WITNESS_TUNING);
  });

  test('the door key rides the surface and keeps its spelling at the old path', () => {
    expect(FAITH_FIELD_DOOR).toBe('faithFieldEnabled');
    expect(faithField.FAITH_FIELD_DOOR).toBe(FAITH_FIELD_DOOR);
  });
});

describe('the coverage roster — what signing signs, held to the tables both ways', () => {
  const tunableRows = FAITH_TUNING_COVERAGE.filter((r) => r.kind === 'tunable');
  const vocabularyRows = FAITH_TUNING_COVERAGE.filter((r) => r.kind === 'vocabulary');
  const TABLES = { FAITH_FIELD_TUNING, DEITY_FLAW_TUNING, FAITH_WITNESS_TUNING };

  test('every coverage row is exactly one of the two kinds', () => {
    expect(tunableRows.length + vocabularyRows.length).toBe(FAITH_TUNING_COVERAGE.length);
    expect(FAITH_TUNING_COVERAGE.length).toBeGreaterThan(0);
  });

  test('the tunable rows are EXACTLY the keys of the three tables — both ways', () => {
    // A tunable added to a table without a coverage row reds here; so does a
    // coverage row naming a dead key; so does a fourth table smuggled in.
    const byTable = {};
    for (const row of tunableRows) {
      byTable[row.table] = byTable[row.table] ?? [];
      byTable[row.table].push(row.key);
    }
    expect(Object.keys(byTable).sort()).toEqual(Object.keys(TABLES).sort());
    for (const [name, table] of Object.entries(TABLES)) {
      // anchored: the table roster equality above proves byTable[name] exists for every name
      expect(byTable[name].sort(), `coverage rows for ${name}`).toEqual(Object.keys(table).sort());
    }
  });

  test('every vocabulary row names a real frozen export at its named home', () => {
    const HOMES = {
      'src/domain/worldPulse/faithField.js': faithField,
      'src/domain/worldPulse/deityFlaws.js': deityFlaws,
    };
    expect(vocabularyRows.length).toBe(6);
    for (const row of vocabularyRows) {
      const mod = HOMES[row.home];
      // anchored: the length pin above proves this loop runs six times over real rows
      expect(mod, `${row.exportName}: unknown home ${row.home}`).toBeTruthy();
      const value = mod[row.exportName];
      expect(value, `${row.exportName} is not exported by ${row.home}`).toBeTruthy();
      expect(Object.isFrozen(value), `${row.exportName} must be frozen`).toBe(true);
    }
  });

  test('the six vocabulary rows are the six candidate registers, by name', () => {
    expect(vocabularyRows.map((r) => r.exportName).sort()).toEqual([
      'DEITY_FLAWS',
      'FAITH_CHANNELS',
      'FAITH_CHANNEL_BINDINGS',
      'FAITH_STRENGTHS',
      'FAITH_UNBOUND_CHANNELS',
      'FLAW_EFFECTS',
    ]);
  });
});

describe('the one-home ratchet — a tuning table cannot be re-minted beside a consumer', () => {
  // THE D4 CAR'S RATCHET, APPLIED TO THIS FAMILY. The three feeder modules may
  // IMPORT and RE-EXPORT their tables; the moment one DEFINES a `*_TUNING =` again
  // — the stray-value class the D4 census caught living beside `resizeSeats` — this
  // reds, and the cure is to move the value home rather than to widen this scan.
  const FEEDERS = [
    'src/domain/worldPulse/faithField.js',
    'src/domain/worldPulse/deityFlaws.js',
    'src/domain/worldPulse/faithWitnessSource.js',
  ];

  test('no feeder module defines a tuning table of its own any more', () => {
    for (const rel of FEEDERS) {
      const src = readFileSync(join(ROOT, rel), 'utf8');
      expect(src.length, `${rel}: read nothing — the scan is broken, not clean`).toBeGreaterThan(0);
      // anchored: the read-length assertion immediately above proves `src` is real file text
      expect(src, `${rel} re-minted a tuning table — its home is faithTuningSurface.js`).not.toMatch(/export const [A-Z_]*TUNING\s*=/);
    }
  });

  test('guard the guard: the detector DOES find a definition where one exists', () => {
    const surface = readFileSync(join(ROOT, 'src/domain/worldPulse/faithTuningSurface.js'), 'utf8');
    const hits = surface.match(/export const [A-Z_]*TUNING\s*=/g) ?? [];
    // The surface itself defines exactly the three tables (the provenance record is
    // not a table and does not match the pattern's shape).
    expect(hits).toEqual([
      'export const FAITH_FIELD_TUNING =',
      'export const DEITY_FLAW_TUNING =',
      'export const FAITH_WITNESS_TUNING =',
    ]);
  });
});
