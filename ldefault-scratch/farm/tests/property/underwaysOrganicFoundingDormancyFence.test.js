/**
 * underwaysOrganicFoundingDormancyFence.test.js — the D6 UNDERWAYS organic-founding
 * dormancy fence (LGT-P13-FENCES, the lighting wave's L-HOMES car 3).
 *
 * ⭐⭐ WHY THIS KEY EARNED A FILE WHEN ITS NEIGHBOURS DID NOT, said plainly, because the
 * derivation is the whole justification for a new census file. Every other member of
 * `ENGINE_GATED_VIRTUAL_RULE_KEYS` already carries a dark half built EXPLICITLY (a literal
 * `false`, an absent key, or a named DARK constant) beside a lit control on the same
 * fixture, so lighting its default cannot destroy the state in which its darkness was
 * exercised. `underwaysOrganicFoundingEnabled` did not. Its only lit/dark pair —
 * `tests/domain/worldPulseLitBurndown.test.js` — RE-IMPLEMENTS the gate in the test:
 *
 *     const litFlag = rules.underwaysOrganicFoundingEnabled === true;
 *     detectInstitutionGaps(viceTown(), null, { underwaysFoundingLit: litFlag });
 *
 * That drives the OPTION, never the engine's own read. The real gate lives one level up,
 * at `institutionLifecycle.js`'s `evaluateInstitutionLifecycle`, and until this file
 * nothing in the estate executed it in both flag states. A gate no test ever runs is a
 * gate that can be deleted green.
 *
 * ⛔ THE SHAPE: A DARK HALF AND A LIT-MUTANT CONTROL, IN EVERY FENCE. "The dark world
 * produced nothing" is trivially true of a world that would have produced nothing anyway —
 * the vacuity shape this estate has shipped before — so every dark assertion below sits
 * beside the SAME fixture read with the flag lit, producing a real clandestine candidate.
 * And a DORMANCY CLAIM IS A BIT CLAIM: the fences compare sha256 over the composed
 * (worldState + candidates) pair, never a sentence about it.
 *
 * ⛔ NO 64-HEX LITERAL IS AUTHORED HERE, DELIBERATELY. Both sides of every comparison are
 * computed in-file from two live runs. `tests/lint/goldenFreeze.walker.test.js` treats a
 * pinned 64-hex string literal under `tests/property/` as a recorded corpus constant that
 * owes a `.golden-freeze-register.json` row, and the register is UNFROZEN — every measured
 * field must stay null until the freeze act signs it. A fence that recorded a hash would
 * therefore have to be enrolled AND would carry a value nobody signed. Computing both sides
 * keeps the bit claim and owes the register nothing.
 *
 * ⛔ THE FIXTURE IS GAP-FREE EXCEPT FOR THE ONE THE FLAG OPENS, and that is what makes the
 * fence sharp rather than statistical: a town with no unmet supply chain and no local
 * resource emits ZERO build candidates however long it prospers, so the single candidate
 * the lit arm produces can only have come through the clandestine door.
 */
import { createHash } from 'node:crypto';
import { describe, expect, test } from 'vitest';

import {
  INSTITUTION_LIFECYCLE_TUNING,
  detectInstitutionGaps,
  evaluateInstitutionLifecycle,
} from '../../src/domain/worldPulse/institutionLifecycle.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

/** @param {unknown} value */
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/** Health 0.705 — a sustained prosperous streak, the build gate's only fuel. */
const GOOD_SCORES = Object.freeze({
  trade_connectivity: 72, labor_capacity: 70, infrastructure_condition: 68, food_security: 72,
});

/**
 * A vice-bearing town with NOTHING else to build. No `nearbyResources` and one commerce
 * institution means the extraction, downstream and tier gaps are all empty; the gambling
 * den carries the `institutionNature: 'vice'` FACET the hook reads (never a name string),
 * and no institution carries either governed clandestine spelling.
 */
function viceTown() {
  return {
    name: 'Forgeham',
    tier: 'town',
    population: 2600,
    config: { nearbyResources: [], tradeRouteAccess: 'road' },
    institutions: [
      { name: 'Market square', category: 'Commerce' },
      { name: 'Gambling den', category: 'Entertainment', facets: { institutionNature: 'vice' } },
    ],
    economicState: { primaryExports: [], primaryImports: [] },
  };
}

const snapshot = () => ({
  settlements: [{ id: 's1', name: 'Forgeham', settlement: viceTown(), causal: { scores: { ...GOOD_SCORES } } }],
});

/**
 * THE FOUR DARK SPELLINGS, one rules object each. `absent` is the shape every campaign that
 * never lights this key actually holds; `1` and `'true'` are the truthy-non-true probes the
 * strict `=== true` read exists to refuse, and they are the spellings a hand-edited save or a
 * loosened gate would produce.
 */
const DARK_RULES = Object.freeze({
  absent: {},
  false: { underwaysOrganicFoundingEnabled: false },
  truthy_one: { underwaysOrganicFoundingEnabled: /** @type {unknown} */ (1) },
  truthy_string: { underwaysOrganicFoundingEnabled: /** @type {unknown} */ ('true') },
});

/**
 * ⚠ THE LIT KEY IS SPELLED AS A LITERAL, never through a computed member: a computed access
 * attributes to no key, which is the same class the CQ5 gate census warns about one layer in.
 */
const LIT_RULES = Object.freeze({ underwaysOrganicFoundingEnabled: true });

/**
 * Drive the REAL evaluator past the build gate, feeding each tick's own output world into the
 * next. `where` selects which of the two raw-rules receivers the engine reads at its gate —
 * `context.simulationRules || worldState?.simulationRules` — so both spellings are exercised
 * rather than assumed equivalent.
 * @param {Record<string, unknown>} rules
 * @param {'context'|'worldState'} [where]
 */
function drive(rules, where = 'context') {
  const ticks = INSTITUTION_LIFECYCLE_TUNING.build.requiredStreak + 1;
  let worldState = /** @type {Record<string, unknown>} */ ({
    tick: 0,
    settlementTickStates: {},
    ...(where === 'worldState' ? { simulationRules: rules } : {}),
  });
  /** @type {Array<Record<string, unknown>>} */
  const candidates = [];
  for (let tick = 1; tick <= ticks; tick += 1) {
    const result = evaluateInstitutionLifecycle(worldState, snapshot(), null, {
      tick,
      ...(where === 'context' ? { simulationRules: rules } : {}),
    });
    worldState = result.worldState;
    candidates.push(...result.candidates);
  }
  return { worldState, candidates };
}

/** The composed footprint a dormancy claim is actually about: what the phase wrote AND emitted. */
const footprint = (/** @type {ReturnType<typeof drive>} */ run) => hash({
  worldState: run.worldState, candidates: run.candidates,
});

describe('D6 UNDERWAYS FENCE 1 — the gate-polarity census, with the lit mutant as its control', () => {
  test('every dark spelling emits nothing, and the same fixture lit founds the tunnels', () => {
    // THE LIT MUTANT FIRST, so no dark assertion below can pass because the fixture is quiet.
    const lit = drive({ ...LIT_RULES });
    expect(lit.candidates.length, 'the lit fixture must really found something').toBe(1);
    expect(lit.candidates[0].candidateType).toBe('institution_build');
    expect(/** @type {Record<string, unknown>} */ (lit.candidates[0].institutionPatch).name)
      .toBe('Underground network');
    const litPrint = footprint(lit);

    for (const [label, rules] of Object.entries(DARK_RULES)) {
      const dark = drive({ ...rules });
      expect(dark.candidates, `${label}: a dark world founded something`).toEqual([]);
      expect(footprint(dark) === litPrint,
        `${label}: the dark footprint equals the lit one — the comparator sees nothing`).toBe(false);
    }
  });

  test('the same census holds when the rules ride on the WORLD STATE rather than the context', () => {
    // The engine's gate reads `context.simulationRules || worldState?.simulationRules`. A fence
    // that only ever drove the first receiver would leave the second free to rot.
    const lit = drive({ ...LIT_RULES }, 'worldState');
    expect(lit.candidates.length).toBe(1);
    for (const [label, rules] of Object.entries(DARK_RULES)) {
      expect(drive({ ...rules }, 'worldState').candidates, `${label} via worldState`).toEqual([]);
    }
  });
});

describe('D6 UNDERWAYS FENCE 2 — absent and false are the SAME world to this layer', () => {
  test('the four dark spellings are byte-identical to each other, and the lit run is not', () => {
    const prints = Object.fromEntries(
      Object.entries(DARK_RULES).map(([label, rules]) => [label, footprint(drive({ ...rules }))]),
    );
    const baseline = prints.absent;
    for (const [label, print] of Object.entries(prints)) {
      expect(print, `${label} diverged from the absent-key world`).toBe(baseline);
    }
    // ANTI-VACUITY: the identical comparator, over the identical harness, SEES the lit run.
    // Without this the equality above would hold just as well over four crashed runs.
    expect(footprint(drive({ ...LIT_RULES })) === baseline,
      'the lit run hashed the same as the dark one — this comparator compares nothing').toBe(false);
  });
});

describe('D6 UNDERWAYS FENCE 3 — the option is the ONLY door into the clandestine gap', () => {
  test('the gap list gains exactly the clandestine row, and only under the lit option', () => {
    const dark = detectInstitutionGaps(viceTown(), null, {}).map((gap) => gap.kind);
    const lit = detectInstitutionGaps(viceTown(), null, { underwaysFoundingLit: true }).map((gap) => gap.kind);
    // PRESENT-THEN-ABSENT rather than a bare absence: the lit reading is asserted to carry the
    // row first, so an emptied gap derivation reds there instead of passing here.
    expectPresentThenAbsent(lit, dark, 'clandestine', 'D6 fence 3');
    expect(dark).toEqual([]);
  });

  test('a truthy-non-true option is refused exactly as a truthy-non-true flag is', () => {
    for (const value of [1, 'true', {}, [], 'yes']) {
      expect(
        detectInstitutionGaps(viceTown(), null, { underwaysFoundingLit: /** @type {never} */ (value) }).length,
        `the option accepted ${JSON.stringify(value)} as lit`,
      ).toBe(0);
    }
  });
});

describe('D6 UNDERWAYS FENCE 4 — the dark claim survives the day the default lights', () => {
  test('no arm in this file reads a default: every rules object is built here, explicitly', () => {
    // THE POINT OF THE WHOLE CAR. When L-DEFAULT writes this key into a preset, a fence that
    // had relied on "the default is dark" would silently start measuring a lit world and go on
    // passing. Every rules object above is a literal built in this file, so the dark arms keep
    // exercising darkness for as long as the gate exists — and this arm is the pin that says so
    // in a form a later edit cannot quietly break.
    expect(Object.keys(DARK_RULES).sort()).toEqual(['absent', 'false', 'truthy_one', 'truthy_string']);
    expect(DARK_RULES.absent).toEqual({});
    expect(LIT_RULES.underwaysOrganicFoundingEnabled).toBe(true);
    // And the dark half is reachable from an EXPLICIT false as well as from an absent key, so
    // neither spelling is the only one carrying the claim.
    expect(DARK_RULES.false.underwaysOrganicFoundingEnabled).toBe(false);
  });
});
