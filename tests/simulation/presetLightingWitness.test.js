/**
 * presetLightingWitness.test.js — THE PER-PRESET NEW-CAMPAIGN WITNESS (LGT-P14-WITNESS).
 *
 * ⛔ THE GAP THIS EXISTS TO CLOSE. Every pulse golden in the estate drives LITERAL
 * simulation rules — it hands the kernel a rules object it wrote itself. So a change to
 * WHICH preset a brand-new campaign is born with is invisible to all of them, and to
 * every dormancy golden besides. Nothing in the tree would catch the shipped default
 * being lit, and nothing would catch it being silently re-darkened afterwards. This
 * suite is the estate's only bit-level answer to that question.
 *
 * WHAT IT PINS. One row per simulation preset, plus `__birth_default__` — the row born
 * with NO preset id, which therefore resolves `NEW_CAMPAIGN_SIMULATION_PRESET_ID`
 * through the real birth door. Each row records the rules a birth actually resolves and
 * the hashes of one year (52 interior one-week ticks) of world pulse over a fixed
 * two-settlement realm. The recorded values live in
 * tests/fixtures/preset-lighting-witness-golden.json.
 *
 * THE MEASUREMENT LIVES IN ONE PLACE. tests/simulation/presetLightingWitnessRun.js is
 * imported both by this suite and by the instrument that mints the manifest, so the
 * recorded world and the asserted world can never be two different worlds. Read that
 * file's header for the birth path, the 52-tick derivation and every determinism door.
 *
 * ⛔ HOW A ROW LAWFULLY MOVES: BY HAND, with a stated legitimate cause recorded under the
 * estate's golden-shift discipline (docs/GOLDEN_SHIFT_LEDGER.md), in the same commit as
 * the change that moved it. THIS SURFACE HAS NO CAPTURE ARM AND NO ENV SPELLING, AND
 * THAT IS DELIBERATE: tests/helpers/goldenRecordDoor.js writes recorded values onto the
 * golden-freeze register row, and every such value must stay null until the freeze act
 * signs for it, so routing this surface through the door today would poison the
 * register. It is enrolled in tests/fixtures/.golden-freeze-register.json under the
 * surface identity `preset-lighting-witness`, the same disposition the interior golden
 * carries. When the freeze act arms the register, this surface's re-record path becomes
 * the door like every other.
 *
 * ⚠ THIS IS A BYTE GOLDEN OVER THE WHOLE PULSE. It moves when the pulse moves, not only
 * when a preset moves — that breadth is the point of a bit witness, and the row diff
 * names which fields moved. A move with no stated cause is the finding.
 *
 * ── ⛔⛔ CHAIR RULING, 2026-09-05: THIS INSTRUMENT AND THE LANE PROBE `lprobe/pulse-hashes.mjs`
 *    ARE NOT COMPARABLE, AND THAT IS BY DESIGN ─────────────────────────────────────────────
 * The two look like the same measurement and are not. Both hash 52 interior one-week ticks,
 * both cut one row per simulation preset, both take their rules from the real birth path.
 * The temptation to "unify" them, or to treat a disagreement between their digests as a
 * finding, is therefore obvious and WRONG — so the refusal is written into both headers
 * rather than left to be rediscovered by whoever notices the resemblance next.
 *
 *   THIS SUITE MEASURES A PRESET IN ISOLATION. Its realm is HAND-BUILT — two settlements
 *   written out as plain data in presetLightingWitnessRun.js, with no generator anywhere in
 *   the path, and that file's own header says why: "A fixture composed through
 *   `generateSettlementPipeline` would couple this witness to the generator", so a moved row
 *   would leave a reader unable to say whether the PRESET moved or the world it was measured
 *   on did. One cause per move is the whole value of this surface.
 *
 *   THE LANE PROBE MEASURES A PRESET IN A CORPUS-SHAPED WORLD. It composes its fixture
 *   through the real pipeline — generateSettlementPipeline, saves, the grid pack, the spatial
 *   digest, the regional graph — because its question is what a preset does to a world the
 *   estate would actually generate. That is a DIFFERENT question, and its answer must be
 *   allowed to move when the generator moves.
 *
 * ⭐ SO: the two digests are expected to differ, always, on every preset. Neither is the
 * other's control, neither is the other's baseline, and no arm anywhere may join them.
 * A row here that moves is read against THIS file's discipline (a stated legitimate cause in
 * the golden-shift ledger) and never against the probe's output.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  NEW_CAMPAIGN_SIMULATION_PRESET_ID,
  SIMULATION_RULE_PRESETS,
} from '../../src/domain/worldPulse/simulationRules.js';
import {
  BIRTH_DEFAULT_ROW,
  WITNESS_TICKS,
  measureWitness,
  witnessRoster,
  yearGrainWeeks,
} from './presetLightingWitnessRun.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MANIFEST_REL = 'tests/fixtures/preset-lighting-witness-golden.json';
const MANIFEST = JSON.parse(readFileSync(join(ROOT, MANIFEST_REL), 'utf8'));

/** Measured ONCE for the whole suite: one birth and one simulated year per row. */
const LIVE = await measureWitness();
const RECORDED = new Map(MANIFEST.rows.map((row) => [row.row, row]));

describe('preset lighting witness — the per-preset new-campaign bit witness', () => {
  it("the estate's year grain is still 52 weeks, so this window is still a year", () => {
    // Asserted, never assumed: if `one_year` stopped meaning 52 weeks, every hash below
    // would still compare fine while measuring a different span. The name would be a lie.
    expect(yearGrainWeeks()).toBe(WITNESS_TICKS);
    expect(MANIFEST.ticksPerRow).toBe(WITNESS_TICKS);
  });

  it('the recorded roster is exactly the live preset roster plus the birth-default row', () => {
    // Coverage cannot lapse silently: a preset added to the registry, or retired from it,
    // reds here rather than quietly falling outside the witness.
    expect(witnessRoster()).toEqual([BIRTH_DEFAULT_ROW, ...Object.keys(SIMULATION_RULE_PRESETS)]);
    expect(MANIFEST.rows.map((row) => row.row)).toEqual(witnessRoster());
    expect(MANIFEST.presetRosterWhenRecorded).toEqual(Object.keys(SIMULATION_RULE_PRESETS));
  });

  it('the birth successor constant is the one this witness was recorded against', () => {
    // The sharpest arm, and the cheapest. `__birth_default__`'s hashes move when this
    // constant moves; this names the cause in one line instead of leaving a reader to
    // infer it from eight moved digests.
    expect(
      NEW_CAMPAIGN_SIMULATION_PRESET_ID,
      'NEW_CAMPAIGN_SIMULATION_PRESET_ID has moved since this witness was recorded. That is'
      + ' the lighting (or the re-darkening) of the shipped default, and it is a DECLARED'
      + ' same-seed shift: record the cause under the golden-shift discipline and re-record'
      + ' this manifest in the same commit.',
    ).toBe(MANIFEST.birthSuccessorPresetIdWhenRecorded);
  });

  it('every row completed, and each measured exactly 52 interior ticks', () => {
    // A collapsed window is a distinct failure from a moved world, and it must read as one.
    expect(LIVE.map((row) => `${row.row}:${row.status}:${row.observedTicks}`))
      .toEqual(LIVE.map((row) => `${row.row}:complete:${WITNESS_TICKS}`));
  });

  it('every witnessed row matches the recorded witness, and the diff names which moved', () => {
    // ⛔ A PARAMETERLESS TEST LOOPING IN ITS BODY, DELIBERATELY, AND NOT `it.each`. The
    // estate's each-family park ceiling refuses a new `each` call outright
    // (sovereigntyLightingContract.walker.test.js: "the cure is a plain parameterless test
    // looping over the rows in its body, never a new `each` call"). Compared as ONE array
    // rather than row by row so the assertion reports EVERY moved row at once — a per-row
    // loop that threw would report a lower bound, which is the defect this estate sweeps.
    const recorded = witnessRoster().map((rowId) => RECORDED.get(rowId) ?? null);
    const live = witnessRoster().map((rowId) => LIVE.find((row) => row.row === rowId) ?? null);
    expect(
      live,
      'the witnessed world has moved. If a preset, the birth seam or the world pulse changed'
      + ' on purpose, record the cause under the golden-shift discipline and re-record this'
      + ' manifest in the same commit; if nothing was meant to change, this is the finding.',
    ).toEqual(recorded);
  });

  it('every witnessed world is distinct — the pulse still reads the rules it was born with', () => {
    // THE DISCRIMINATION ARM. If the pulse stopped reading `simulationRules`, or the birth
    // door stopped resolving presets, every row would still hash — identically — and the
    // equality arms above would go on passing against a re-recorded flat manifest. A
    // collapse here is the only symptom that failure has.
    const worlds = new Set(LIVE.map((row) => row.worldStateSha256));
    const rules = new Set(LIVE.map((row) => row.rulesSha256));
    expect(worlds.size, 'distinct simulated-year worlds across the roster').toBe(LIVE.length);
    expect(rules.size, 'distinct resolved birth rules across the roster').toBe(LIVE.length);
    expect(MANIFEST.distinctWorldStateHashes).toBe(LIVE.length);
  });

  it('PLANT: the row comparator is live — a doctored digest does not compare equal', () => {
    // Guard the guard. A comparator that blessed a moved hash would make every arm above
    // a decoration, and that failure looks exactly like success.
    const honest = RECORDED.get(BIRTH_DEFAULT_ROW);
    const last = honest.worldStateSha256.slice(-1);
    const doctored = {
      ...honest,
      worldStateSha256: `${honest.worldStateSha256.slice(0, -1)}${last === '0' ? '1' : '0'}`,
    };
    expect(doctored.worldStateSha256 === honest.worldStateSha256,
      'the plant did not actually move the digit it claims to move').toBe(false);
    expect(doctored, 'the comparator blessed a moved digest — it compares nothing')
      .not.toEqual(honest);
  });
});
