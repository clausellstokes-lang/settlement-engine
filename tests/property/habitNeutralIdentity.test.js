/**
 * habitNeutralIdentity.test.js — HB-2's §2.4 cold-start fence, its four-fence dormancy set,
 * and the lit-mutant control that keeps the whole set from being an elaborate way of saying
 * the fixture was quiet.
 *
 * ⛔ THE CLAIM UNDER TEST: with `habitConditioningEnabled` absent or false, a campaign's
 * serialized bytes are IDENTICAL to a pre-HB-2 build. It rests on two mechanisms and claims
 * no others — NO KEY (the gate returns the input reference before any allocation, so the
 * namespace is never created) and NO STRING (nothing here composes a receipt, beat, dossier
 * row or prose token, so no golden can move). ⚠ The factor, draw and spread fences belong to
 * HB-4, HB-5 and HB-6; a wave that claimed a fence it does not build would have proven nothing.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import { HABIT_TUNING } from '../../src/domain/worldPulse/habit/habitCurve.js';
import { HABIT_LEDGER_KEY, writeHabits } from '../../src/domain/worldPulse/habit/habitLedger.js';
import { habitsActive } from '../../src/domain/worldPulse/habit/habitGate.js';
import { CIRCUMSTANCE_CLASSES } from '../../src/domain/worldPulse/habit/habitVocabulary.js';
import {
  WORLD_SNAPSHOT_HARD_DENY,
  WORLD_SNAPSHOT_PUBLIC_LEDGER_ALLOWLIST,
} from '../../src/domain/display/worldSnapshotPublic.js';
import { STRATEGY_MOVES } from '../../src/domain/worldPulse/strategyMoves.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEDGER_HOME = 'src/domain/worldPulse/habit/habitLedger.js';
const CLASS_A = CIRCUMSTANCE_CLASSES[0];
const MOVE_A = STRATEGY_MOVES[0];
const CREDITS = Object.freeze([
  { actorId: 'seat-a', circumstanceClass: CLASS_A, action: MOVE_A, stock: 7200 },
]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(js|jsx)$/.test(path)) out.push(path);
  }
  return out;
}

const SRC_FILES = walk(join(ROOT, 'src'))
  .map((path) => ({ rel: relative(ROOT, path).replace(/\\/g, '/'), src: readFileSync(path, 'utf8') }))
  .sort((a, b) => (a.rel < b.rel ? -1 : 1));

const digest = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const worldWith = (rules) => {
  const world = { calendar: { elapsedWeeks: 12 }, factions: [{ id: 'seat-a' }] };
  if (rules !== null) world.simulationRules = rules;
  return world;
};

describe('HB-2 — the cold-start fence, the four-fence dormancy set, and the lit mutant', () => {
  test('THE COLD-START FENCE: one assertion proving three laws at once', () => {
    // (i) flag absent, ledger absent · (ii) flag LIT, ledger absent · (iii) flag LIT, ledger
    // present with every stock exactly NEUTRAL_I before the drop pass.
    const i = writeHabits(worldWith(null), {});
    const ii = writeHabits(worldWith({ habitConditioningEnabled: true }), {});
    const iii = writeHabits({
      ...worldWith({ habitConditioningEnabled: true }),
      spatialLedgers: {
        [HABIT_LEDGER_KEY]: {
          rows: { 'seat-a': { [CLASS_A]: { [MOVE_A]: [HABIT_TUNING.NEUTRAL_I, 3] } } },
          open: {},
        },
      },
    }, {});
    // DARK IS BYTE-IDENTICAL, and COLD-START IS HABIT-FREE BY CONSTRUCTION: a lit world that
    // has learned nothing carries no key, so lighting the flag alone changes no byte.
    expect(digest({ ...i, simulationRules: undefined })).toBe(digest({ ...ii, simulationRules: undefined }));
    // NEUTRAL IS ABSENT: an empty ledger is not a ledger of zeros, so (iii) collapses onto (ii).
    expect(digest(iii)).toBe(digest(ii));
    expect('spatialLedgers' in iii).toBe(false);
  });

  test('THE OWN-FOOTPRINT GOLDEN: a dark write moves not one byte of the world it was handed', () => {
    const world = worldWith({ habitConditioningEnabled: false });
    const before = digest(world);
    const next = writeHabits(world, { credits: CREDITS, opens: [], closes: [] });
    expect(digest(next)).toBe(before);
    expect(Object.is(next, world), 'the INPUT REFERENCE, not a copy and not an equal object').toBe(true);
  });

  test('ABSENT AND FALSE ARE THE SAME DARKNESS — the differential a truthy check would fail', () => {
    const absent = writeHabits(worldWith(null), { credits: CREDITS });
    const empty = writeHabits(worldWith({}), { credits: CREDITS });
    const explicit = writeHabits(worldWith({ habitConditioningEnabled: false }), { credits: CREDITS });
    const bytes = [absent, empty, explicit].map((world) => digest({ ...world, simulationRules: undefined }));
    expect(new Set(bytes).size, 'an absent flag and a false flag must be indistinguishable').toBe(1);
  });

  test('THE CALL PATH IS NEVER ENTERED: nothing under src calls the writer at all', () => {
    // ⛔ The strongest form of the dormancy evidence. This wave wires NO caller, so no engine
    // advance can reach the ledger — which is why this battery calls the writer directly rather
    // than staging a "full advance" that would prove only that nobody calls nobody.
    const callers = SRC_FILES
      .filter(({ rel }) => rel !== LEDGER_HOME)
      .filter(({ src }) => /\bwriteHabits\s*\(/.test(src))
      .map(({ rel }) => rel);
    expect(
      callers,
      'a caller for writeHabits appeared in src. HB-2 is DARK BY CONSTRUCTION and HB-3 is the'
      + ' wave that wires one; the wave that does owes this case its re-aim in the same commit',
    ).toEqual([]);
    // GUARD THE GUARD: the same detector finds the writer where it genuinely lives.
    expect(SRC_FILES.filter(({ src }) => /\bwriteHabits\s*\(/.test(src)).map(({ rel }) => rel))
      .toEqual([LEDGER_HOME]);
  });

  test('THE GATE-POLARITY CENSUS drops each conjunct one at a time, with the LIT MUTANT control', () => {
    // ⚠ A conjunction whose arms cannot be dropped one at a time is a conjunction nobody has
    // proven. Door one has exactly ONE conjunct at this wave, so the census is complete rather
    // than partial — and it is written as a census so HB-4's added conjuncts join it here.
    const CONJUNCTS = ['habitConditioningEnabled'];
    const lit = Object.fromEntries(CONJUNCTS.map((key) => [key, true]));
    // THE LIT MUTANT CONTROL FIRST: with every conjunct present the lane genuinely writes.
    // Without it "the fence proves only that the fixture is quiet" (the SP-B lesson).
    expect(habitsActive(worldWith(lit))).toBe(true);
    const written = writeHabits(worldWith(lit), { credits: CREDITS });
    expect(written.spatialLedgers?.[HABIT_LEDGER_KEY]).toBeDefined();
    for (const dropped of CONJUNCTS) {
      const rules = { ...lit };
      delete rules[dropped];
      expect(habitsActive(worldWith(rules)), `dropping ${dropped} must darken the lane`).toBe(false);
      expect(writeHabits(worldWith(rules), { credits: CREDITS }).spatialLedgers).toBeUndefined();
    }
    // and the polarity is STRICT: a truthy value that is not exactly true stays dark
    for (const value of [1, 'true', {}, []]) {
      expect(habitsActive(worldWith({ habitConditioningEnabled: value }))).toBe(false);
    }
  });

  test('THE ANCHORED PUBLIC-PAYLOAD NEGATIVE: the truth ledger never reaches a viewer', () => {
    // ⚠⚠ LOAD-BEARING RATHER THAN A FORMALITY. The habit ledger is a record of what every court
    // has learned to do; leaking it to a public payload would hand every viewer perfect
    // counter-intelligence for free, and it would leak through the PARENT key rather than
    // through one of this wave's own names.
    expect(WORLD_SNAPSHOT_HARD_DENY).toContain('spatialLedgers');
    // ⚠ THE MARKER MUST SIT ON THE LAST COMMENT LINE. A multi-line `// anchored:` block counts
    // only if its FINAL line carries the marker, which is why this reads the way it does.
    // anchored: the hard-deny membership asserted above proves this allowlist is the live, populated object the public reader consults, so the absence below is measured against a real allowlist rather than passing vacuously over an empty one.
    expect(WORLD_SNAPSHOT_PUBLIC_LEDGER_ALLOWLIST).not.toContain(HABIT_LEDGER_KEY);
    expect([...WORLD_SNAPSHOT_PUBLIC_LEDGER_ALLOWLIST]).toEqual(['pantheon']);
  });

  test('AN IMPORTED CAMPAIGN\'S ACTORS HAVE LEARNED NOTHING, and the ledger returns ABSENCE', () => {
    // (c) THE IMPORT RECEIPT: world simulation state is not imported, so an imported campaign
    // arrives with no habit ledger at all — its courts have shown no hand yet.
    const admission = readFileSync(join(ROOT, 'src/lib/importReconciliationAdmission.js'), 'utf8');
    expect(admission).toContain("['worldState', 'world_state_not_imported', 'World simulation state']");
    // ⛔ AND THE OBLIGATION THIS RECORDS FOR HB-8: the doctrine sheet must render that absence
    // as "this court has not yet shown its hand", NEVER as a sheet of neutrals. HB-2 does not
    // build the sheet; it asserts the ledger hands back ABSENCE rather than a zero-filled shape.
    const fresh = writeHabits(worldWith({ habitConditioningEnabled: true }), {});
    expect(fresh.spatialLedgers).toBeUndefined();
    expect(fresh[HABIT_LEDGER_KEY]).toBeUndefined();
  });
});
