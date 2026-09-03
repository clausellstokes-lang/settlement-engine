/**
 * faithTuningSurface.test.js — W-FAITH F6c: the faith tuning signature surface.
 *
 * What is pinned here, and why each pin exists:
 *
 *   1. THE SIGNATURE RECORD is exactly `{ signed: false, live: true }` today. When
 *      the owner signs, THIS ARM MOVES WITH THE SIGNING DIFF — that is by design:
 *      the pen's one-file edit rides a collection, and the collection updates the
 *      pin beside it. An unsigned surface that drifted to `signed: true` without
 *      that ceremony is exactly what this arm refuses.
 *   2. THE LAW IS EXECUTABLE, NOT MERELY STRUCTURAL: `faithTuningArmed` and
 *      `faithTuningState` take the record as a defaulted argument, so every
 *      counterfactual corner is driven here without mutating the frozen record.
 *
 * ⭐⭐ ROW O-17 (2026-09-03) REPLACED THE LAW THESE ARMS DRIVE, AND THE ARMS MOVED
 * WITH IT AS A DECLARED INSTRUMENT EDIT — NOT A RE-RECORD. The superseded law is
 * quoted here so nobody reads the change as drift:
 *
 *     "THE SIGN-THEN-LIGHT LAW is executable, not just structural: `faithTuningArmed`
 *      takes the record as a defaulted argument, so the counterfactual corners are
 *      driven here without mutating the frozen record. `live` alone arms NOTHING."
 *
 * `live` alone now arms the DOOR — that is the whole of what the owner re-opened.
 * What is still unconstructible, and is now pinned in its place, is a LIT surface
 * calling itself SIGNED: `faithTuningState` reports DRAFT for exactly the corner
 * the old `&&` used to refuse outright. The candidate VALUES are untouched and
 * `signed` is still false; §763's carve-out on values is intact.
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
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  FAITH_TUNING_SIGNATURE,
  FAITH_SIGNATURE_STATES,
  faithTuningArmed,
  faithTuningState,
  FAITH_FIELD_DOOR,
  FAITH_TUNING_PROVENANCE,
  FAITH_TUNING_COVERAGE,
  FAITH_FIELD_TUNING,
  DEITY_FLAW_TUNING,
  FAITH_WITNESS_TUNING,
} from '../../src/domain/worldPulse/faithTuningSurface.js';
import * as faithField from '../../src/domain/worldPulse/faithField.js';
import * as deityFlaws from '../../src/domain/worldPulse/deityFlaws.js';
import * as faithChannelBindings from '../../src/domain/worldPulse/faithChannelBindings.js';
import * as faithWitnessSource from '../../src/domain/worldPulse/faithWitnessSource.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('the signature record — two words, unsigned and DRAFT-LIT today', () => {
  test('the record is EXACTLY { signed: false, live: true }, and it is frozen', () => {
    // ⚠ When the owner signs, this arm is updated IN THE SIGNING DIFF — see the
    // header. Until that diff exists, any other state of the record is a defect.
    // `live` moved to true at row O-17; `signed` is the pen's and stays false.
    expect(FAITH_TUNING_SIGNATURE).toEqual({ signed: false, live: true });
    expect(Object.isFrozen(FAITH_TUNING_SIGNATURE)).toBe(true);
  });

  test('the provenance says CANDIDATE and carries the empty signedBy slot', () => {
    expect(FAITH_TUNING_PROVENANCE.signedBy).toBeNull();
    expect(FAITH_TUNING_PROVENANCE.status).toContain('OWNER-UNSIGNED');
    expect(FAITH_TUNING_PROVENANCE.status).toContain('CANDIDATE');
    expect(Object.isFrozen(FAITH_TUNING_PROVENANCE)).toBe(true);
  });

  test('the provenance says DRAFT-LIT and QUOTES the ritual it superseded', () => {
    // The record of what a later reader is looking at, and the record of what it
    // replaced, both in the artifact rather than only in a commit message.
    expect(FAITH_TUNING_PROVENANCE.status).toContain('DRAFT-LIT');
    expect(FAITH_TUNING_PROVENANCE.ritual).toContain('SUPERSEDED 2026-09-03');
    expect(FAITH_TUNING_PROVENANCE.ritual).toContain('lighting an unsigned surface cannot be expressed');
  });
});

describe('the candidate-lit law — executable at every corner (row O-17)', () => {
  test('today the surface IS armed, and it reads DRAFT', () => {
    // The pair is the point: armed says the door is open, the state says the
    // numbers behind it are the lane's claim and not the owner's word.
    expect(faithTuningArmed()).toBe(true);
    expect(faithTuningState()).toBe(FAITH_SIGNATURE_STATES.DRAFT);
  });

  test('live alone arms the DOOR — this is the clause row O-17 re-opened', () => {
    // ⚠ THIS ARM IS THE INVERSE OF THE ONE IT REPLACED, WHICH READ: "⛔ live alone
    // arms NOTHING — lighting an unsigned surface is not expressible". That was
    // §763's carve-out made structural. The owner re-opened it on 2026-09-03, so
    // the conjunction is gone and the arm inverts with it, in this same diff.
    expect(faithTuningArmed({ signed: false, live: true })).toBe(true);
  });

  test('⛔ …but a LIT UNSIGNED surface can never call itself SIGNED', () => {
    // The guarantee that REPLACES the conjunction. This is the corner the old law
    // refused outright; it is now expressible, and it must announce itself.
    expect(faithTuningState({ signed: false, live: true })).toBe(FAITH_SIGNATURE_STATES.DRAFT);
    // Only the owner's literal boolean reaches SIGNED. A truthy imposter cannot.
    for (const imposter of ['true', 1, {}, [], 'signed']) {
      expect(
        faithTuningState({ signed: imposter, live: true }),
        `${JSON.stringify(imposter)} must not read as the owner's signature`,
      ).toBe(FAITH_SIGNATURE_STATES.DRAFT);
    }
  });

  test('unlit stays DARK whether or not it is signed — sign, soak, then light survives', () => {
    expect(faithTuningArmed({ signed: true, live: false })).toBe(false);
    expect(faithTuningState({ signed: true, live: false })).toBe(FAITH_SIGNATURE_STATES.DARK);
    expect(faithTuningState({ signed: false, live: false })).toBe(FAITH_SIGNATURE_STATES.DARK);
    expect(faithTuningState({})).toBe(FAITH_SIGNATURE_STATES.DARK);
  });

  test('signed AND lit reads SIGNED — the corner the pen will one day reach', () => {
    expect(faithTuningArmed({ signed: true, live: true })).toBe(true);
    expect(faithTuningState({ signed: true, live: true })).toBe(FAITH_SIGNATURE_STATES.SIGNED);
  });

  test('only the literal boolean true lights — a truthy imposter does not', () => {
    expect(faithTuningArmed({ signed: true, live: 1 })).toBe(false);
    expect(faithTuningArmed({ signed: true, live: 'true' })).toBe(false);
    expect(faithTuningArmed({})).toBe(false);
  });

  test('the state vocabulary is the closed three, and every corner lands in it', () => {
    const vocabulary = Object.values(FAITH_SIGNATURE_STATES);
    expect(vocabulary).toEqual(['dark', 'draft', 'signed']);
    expect(Object.isFrozen(FAITH_SIGNATURE_STATES)).toBe(true);
    for (const signed of [true, false]) {
      for (const live of [true, false]) {
        expect(vocabulary).toContain(faithTuningState({ signed, live }));
      }
    }
  });
});

/**
 * ⭐⭐ THE SUPERSEDED §763 RULING IS KEPT, NOT OVERWRITTEN — AND THE COUNT IS THE ARM.
 *
 * Row O-17 re-opens a SPECIFIC earlier owner ruling, so the obligation is not merely to
 * act on it: the record of WHAT WAS REPLACED has to survive in the artifact, dated and
 * attributed, rather than being quietly rewritten into the new truth. Prose alone cannot
 * hold that — prose is what rots — so it is asserted here.
 *
 * ⛔ WHY `toContain` WOULD BE A VACUOUS ARM, MEASURED RATHER THAN SUSPECTED. Row O-12
 * planted exactly this arm one car ago, drafted it as a bare `toContain` on the superseded
 * sentence, and the planted mutant PASSED: deleting the ORIGINAL ruling leaves the
 * supersession record quoting the same words back, so a "contains" arm still sees them.
 * The cure there and here is the same — demand the phrase appear TWICE. One occurrence is
 * the original ruling left standing; the other is this row's record of having replaced it.
 * Either alone is the silent overwrite this arm exists to refuse.
 */
describe('the superseded §763 ruling survives beside its supersession (row O-17)', () => {
  const SURFACE_REL = 'src/domain/worldPulse/faithTuningSurface.js';

  /**
   * The file's comment prose with its ` * ` gutters removed and its wraps collapsed, so a
   * sentence spanning two comment lines is ONE searchable string. Without this the arm
   * would silently depend on where a re-wrap happened to break the line.
   * @param {string} src
   */
  const flatten = (src) => src
    .split('\n')
    .map((line) => line.replace(/^\s*\/\*+/, '').replace(/^\s*\*\/?/, ''))
    .join(' ')
    .replace(/\s+/g, ' ');

  /** The §763 wording this row re-opened, VERBATIM as it stood at 30c1667bc. */
  const SUPERSEDED_763 = 'lighting an unsigned surface is structurally impossible,'
    + ' not procedurally discouraged';

  test('the §763 wording appears TWICE — the surviving original AND the record of it', () => {
    const flat = flatten(readFileSync(join(ROOT, SURFACE_REL), 'utf8'));
    expect(flat.length, `${SURFACE_REL}: read nothing — the scan is broken, not clean`)
      .toBeGreaterThan(0);
    // anchored: the read-length assertion above proves `flat` is real file text
    const hits = flat.split(SUPERSEDED_763).length - 1;
    expect(
      hits,
      `${SURFACE_REL}: the §763 ruling must stand ONCE as the surviving original and ONCE`
      + " inside row O-17's supersession record — a count of 1 means one of the two was"
      + ' silently overwritten, which is the act this row is forbidden to commit',
    ).toBe(2);
  });

  test('the supersession is DATED and ATTRIBUTED, never an anonymous edit', () => {
    const flat = flatten(readFileSync(join(ROOT, SURFACE_REL), 'utf8'));
    expect(flat.length).toBeGreaterThan(0);
    // anchored on the read-length assertion above
    expect(flat).toContain('SUPERSEDED 2026-09-03 — ROW O-17');
    expect(flat).toContain('Seat: Opus 5, lane REGISTRY');
    // ⛔ AND THE VALUES ARE STILL THE PEN'S. This row lit a door; it signed nothing.
    expect(FAITH_TUNING_SIGNATURE.signed).toBe(false);
    expect(FAITH_TUNING_PROVENANCE.signedBy).toBe(null);
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
      'src/domain/worldPulse/faithChannelBindings.js': faithChannelBindings,
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

/**
 * ⭐⭐ THE HOME CENSUS — ONE NAME, ONE HOME, AND THE ROSTER POINTING AT IT.
 *
 * WHY IT EXISTS, AND IT IS A MEASUREMENT RATHER THAN A PRECAUTION. The ratchet above
 * asks whether a FEEDER re-minted a whole tuning TABLE. It cannot see the failure this
 * family actually has: a RELOCATION car and a CONSOLIDATION car colliding on a single
 * value's HOME. Each tree is green alone — every arm above is internally consistent —
 * and the union either strands a `home:` pointer on a file that stopped exporting the
 * name, or grows a SECOND definition of the same constant while nothing reds at all.
 * Both were measured on this surface against the substrate's channel-bindings split:
 * the stranded pointer convicts through the vocabulary arm, and the second definition
 * convicted NOWHERE. That silence is the estate's most-bitten class (a quantity with
 * more than one home, every consumer internally consistent), and these two arms are
 * what ends it here.
 *
 * The scope is the FAITH LAYER as the coupling walker already spells it, so this
 * census mints no new vocabulary of its own.
 */
describe('the home census — one name, one home, and the roster points at it', () => {
  const FAITH_LAYER_FILE = /^(?:faith|sacred|religion|pantheon|conversion|piety|deity|temple)[A-Za-z0-9]*\.js$/;
  const LAYER_DIR = 'src/domain/worldPulse';

  /** Read the faith layer as [repo-relative path, source] pairs.
   *  @returns {[string, string][]} */
  const readLayer = () => readdirSync(join(ROOT, LAYER_DIR))
    .filter((f) => FAITH_LAYER_FILE.test(f))
    .sort()
    .map((f) => /** @type {[string, string]} */ ([`${LAYER_DIR}/${f}`, readFileSync(join(ROOT, LAYER_DIR, f), 'utf8')]));

  /** Files that DEFINE `name` at top level. The `^` anchor is what keeps a comment
   *  mentioning the name out of the count — every comment line in this estate is
   *  indented behind ` *` or `//`.
   *  @param {string} name @param {readonly [string, string][]} layer @returns {string[]} */
  const definersIn = (name, layer) => layer
    .filter(([, src]) => new RegExp(`^export const ${name}\\b`, 'm').test(src))
    .map(([rel]) => rel);

  /** True when the surface's own table carries a VALUE for `key` rather than a
   *  shorthand reference to an imported binding — `KEY: 20` versus `KEY,`.
   *  @param {string} key @param {string} surfaceSrc @returns {boolean} */
  const tableCarriesValue = (key, surfaceSrc) => new RegExp(`^ {2}${key}: `, 'm').test(surfaceSrc);

  test('every vocabulary register has exactly one faith-layer definition, and it is the row home', () => {
    const layer = readLayer();
    expect(layer.length, 'the faith layer scan read nothing — it is broken, not clean').toBeGreaterThan(0);
    // anchored: the non-empty scan above proves the loop below runs over real sources
    for (const row of FAITH_TUNING_COVERAGE.filter((r) => r.kind === 'vocabulary')) {
      const homes = definersIn(row.exportName, layer);
      expect(homes, `${row.exportName}: expected exactly one faith-layer definition`).toHaveLength(1);
      expect(homes[0], `${row.exportName} is defined at ${homes[0]} but the roster homes it at ${row.home}`).toBe(row.home);
    }
  });

  test('every tunable key has exactly ONE definition — a table value or a bare export, never both', () => {
    const layer = readLayer();
    const surface = layer.find(([rel]) => rel.endsWith('/faithTuningSurface.js'));
    expect(surface, 'the surface itself was not in the layer scan — the scan is broken').toBeTruthy();
    // anchored: the assertion above proves `surface` is the real surface source pair
    const surfaceSrc = /** @type {[string, string]} */ (surface)[1];
    for (const row of FAITH_TUNING_COVERAGE.filter((r) => r.kind === 'tunable')) {
      const key = /** @type {string} */ (row.key);
      const bare = definersIn(key, layer);
      const homes = tableCarriesValue(key, surfaceSrc) ? [`${LAYER_DIR}/faithTuningSurface.js (${row.table})`, ...bare] : bare;
      expect(homes, `${key}: one home or the value forks — found ${homes.length}`).toHaveLength(1);
    }
  });

  test('guard the guards: both detectors convict a planted second home and a moved home', () => {
    const planted = /** @type {[string, string][]} */ ([
      ['src/domain/worldPulse/faithField.js', 'export const FAITH_CHANNELS = 1;\n'],
      ['src/domain/worldPulse/faithElsewhere.js', 'export const FAITH_CHANNELS = 2;\n// a comment naming export const CAUSAL_SWING = 20 must NOT count\n'],
    ]);
    // the moved-home shape: two definers where the roster can only name one
    expect(definersIn('FAITH_CHANNELS', planted)).toEqual([
      'src/domain/worldPulse/faithField.js',
      'src/domain/worldPulse/faithElsewhere.js',
    ]);
    // the comment immunity the `^` anchor buys, stated rather than assumed
    expect(definersIn('CAUSAL_SWING', planted)).toEqual([]);
    // the table-value detector separates a carried VALUE from a carried REFERENCE
    expect(tableCarriesValue('CAUSAL_SWING', 'export const T = Object.freeze({\n  CAUSAL_SWING: 20,\n});\n')).toBe(true);
    expect(tableCarriesValue('CAUSAL_SWING', 'export const T = Object.freeze({\n  CAUSAL_SWING,\n});\n')).toBe(false);
  });
});
