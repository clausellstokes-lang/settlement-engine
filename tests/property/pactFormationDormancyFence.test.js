/**
 * pactFormationDormancyFence.test.js — GR-2's FOUR-FENCE dormancy set, with the lit-mutant
 * control and each guard door pinned individually.
 *
 * `pactFormationEnabled` is built DARK. The claim is not "nothing happened in a world where
 * nothing was going to happen" — the vacuous green every dormancy pin drifts toward. It is
 * the harder one: across the exact run that DOES open a proposal, DOES answer it and DOES
 * mint an instrument when lit, the dark world is byte-identical and the lane's own machinery
 * never executes.
 *
 *   FENCE 1 — OWN-FOOTPRINT INVARIANT, CARRYING NO STORED HASH. The pre-GR-2 engine is not
 *     a golden file here; it is a CALL. The stage returns its inputs by REFERENCE when dark,
 *     so identity — not deep equality — is the assertion, and there is nothing to re-record
 *     and nothing to rot.
 *
 *   FENCE 2 — DIFFERENTIAL, ABSENT vs EXPLICIT FALSE vs every truthy-but-not-`true`
 *     spelling, hashed over THE LANE'S OWN FOOTPRINT (see `footprint` below for why that
 *     is the right scope and not a weakening). Its designed blind spot is that it stays
 *     GREEN if the feature runs in BOTH configurations, which is why it never ships alone.
 *
 *   FENCE 3 — CALL-PATH DORMANCY. A state pin cannot see a feature that ran and happened to
 *     write nothing; a strict pass-through spy can. THE SPY SITS ON `pactTriggers.js` AND
 *     THE DIRECTION IS LOAD-BEARING: the recorded WR-10 lesson is that wrapping a function
 *     in ITS OWN module's namespace counts ZERO, because the internal binding is the
 *     original. `pactFormation.js` IMPORTS the scorers from the trigger leaf, so mocking
 *     that module really does intercept. Dark the count is ZERO; lit it is not.
 *
 *   FENCE 4 — GATE-POLARITY CENSUS over the real source tree. `pactFormationEnabled` has
 *     exactly ONE `=== true` site and no other spelling anywhere — a second door is how a
 *     deleted guard hides behind a surviving one, and a loose spelling is how ABSENT stops
 *     being identical to FALSE.
 *
 *   THE LIT-MUTANT CONTROL. Every fence above is an ABSENCE. A fence set that could not
 *     SEE the feature would pass all four while proving nothing, so the same run is executed
 *     lit and each fence is shown to fail there — the fences are proved to have eyes.
 *
 *   AND EACH GUARD DOOR INDIVIDUALLY (the defense-in-depth corollary). The stage refuses on
 *     THREE separate conditions — the flag, a world with fewer than two settlements, and no
 *     crossing. A double-guarded conjunction has survived an entire fence set in this
 *     estate, so each door is driven to the inert result on its own.
 *
 * @enforced-by this file
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, test, vi } from 'vitest';

/** FENCE 3's recorder. Hoisted, because vi.mock factories hoist above the imports. */
const calls = { score: 0 };

vi.mock('../../src/domain/worldPulse/pactTriggers.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    // STRICT pass-through: rest-args in, the original's result out. Instrumenting the
    // module cannot perturb a byte of the runs the other fences measure.
    scoreTradeDemand: (/** @type {any[]} */ ...args) => {
      calls.score += 1;
      return actual.scoreTradeDemand(...args);
    },
  };
});

const { advancePeacetimePacts } = await import('../../src/domain/worldPulse/pactFormation.js');
const { pactProposalsOf } = await import('../../src/domain/worldPulse/pactProposals.js');
const { treatyLedgerOf } = await import('../../src/domain/worldPulse/treatyEnforcement.js');
const {
  DUE_TICK, OPEN_TICK, pactSnapshot, pactWorld,
} = await import('../helpers/pactFixture.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FLAG = 'pactFormationEnabled';
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/**
 * THE LANE'S OWN FOOTPRINT — everything `advancePeacetimePacts` can write, and nothing else.
 *
 * ⚠ `simulationRules` IS DELIBERATELY EXCLUDED, and the exclusion is the opposite of hiding
 * the difference. FENCE 2's question is "does the FEATURE run in both configurations", and
 * the configurations differ by construction in exactly one byte: the flag key itself, which
 * `pactWorld` writes for `false` and omits for absent. Hashing the whole world would make
 * this fence red on that byte forever — a red that says nothing about dormancy — and the
 * temptation would then be to weaken the fence rather than to scope it. So the hash covers
 * the two containers this lane writes (`spatialLedgers`, which holds both the proposal
 * ledger and the treaties, and `relationshipStates`, which holds the refusal memory and the
 * trust delta), and FENCE 1 separately asserts the world REFERENCE itself is unchanged —
 * which is the stronger claim, and the one that would catch a write anywhere else.
 * @param {Record<string, unknown>} worldState
 */
const footprint = (worldState) => hash({
  spatialLedgers: worldState.spatialLedgers ?? null,
  relationshipStates: worldState.relationshipStates ?? null,
});

/**
 * THE ADVERSARIAL RUN. The full open → answer → mint arc, over the same fixture the
 * behaviour battery uses, with the errand spine LIT so the transport arm runs too. A
 * dormancy claim that survives here is a claim about the lane and not about a quiet world.
 * @param {{flag?: unknown}} args
 */
function fullArc({ flag }) {
  const snapshot = pactSnapshot();
  let worldState = pactWorld({ flag, rules: { errandSpineEnabled: true } });
  /** @type {string[]} */
  const hashes = [];
  let settlementUpdates = [];
  let receipts = 0;
  for (const tick of [OPEN_TICK, OPEN_TICK + 2, DUE_TICK, DUE_TICK + 3]) {
    const pass = advancePeacetimePacts({ snapshot, worldState, settlementUpdates, tick });
    worldState = pass.worldState;
    settlementUpdates = pass.settlementUpdates;
    receipts += pass.receipts.length;
    hashes.push(footprint(worldState));
  }
  return {
    worldState,
    trace: hash(hashes),
    receipts,
    proposals: pactProposalsOf(worldState).length,
    treaties: Object.keys(treatyLedgerOf(worldState) || {}).length,
  };
}

describe('FENCE 1 — the own-footprint invariant, measured rather than remembered', () => {
  test('dark, the stage hands BOTH its inputs straight back by reference', () => {
    const worldState = pactWorld({});
    const settlementUpdates = [{ saveId: 'A', settlement: {} }];
    const pass = advancePeacetimePacts({
      snapshot: pactSnapshot(), worldState, settlementUpdates, tick: OPEN_TICK,
    });
    // IDENTITY, not deep equality (the J1 precedent): a fork that produced an equal object
    // would still have perturbed the reference every downstream memo keys on.
    expect(pass.worldState).toBe(worldState);
    expect(pass.settlementUpdates).toBe(settlementUpdates);
    expect(pass.changed).toBe(false);
    expect(pass.receipts).toEqual([]);
    expect(pass.newsEntries).toEqual([]);
  });

  test('dark, the whole arc writes no key, no proposal and no instrument', () => {
    const dark = fullArc({ flag: undefined });
    expect(dark.receipts).toBe(0);
    expect(dark.proposals).toBe(0);
    expect(dark.treaties).toBe(0);
    // ABSENT, never `[]` and never `{}` — a key is a byte.
    expect(dark.worldState.spatialLedgers?.pactProposals).toBeUndefined();
    expect(dark.worldState.spatialLedgers?.treaties).toBeUndefined();
  });
});

describe('FENCE 2 — the differential: absent, false, and every truthy imposter', () => {
  test('the whole-world trace is IDENTICAL across every dark spelling', () => {
    const absent = fullArc({ flag: undefined }).trace;
    for (const spelling of [false, 0, 1, 'true', 'yes', {}, [], null]) {
      expect(fullArc({ flag: spelling }).trace, `spelling ${JSON.stringify(spelling)}`).toBe(absent);
    }
  });
});

describe('FENCE 3 — call-path dormancy, on a spy the composer really goes through', () => {
  test('dark, the trigger scorer is not called ONCE; lit, it is', () => {
    calls.score = 0;
    fullArc({ flag: undefined });
    expect(calls.score).toBe(0);
    calls.score = 0;
    fullArc({ flag: true });
    // ATTRIBUTABLE, not merely non-zero: the scorer runs once per ordered pair per tick
    // that reaches step 3, so a count of zero here would mean the mock stopped
    // intercepting and every absence above would be proving nothing.
    expect(calls.score).toBeGreaterThan(0);
  });
});

describe('FENCE 4 — the gate-polarity census over the real source tree', () => {
  const walk = (dir, out = []) => {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) walk(p, out);
      else if (/\.(js|jsx)$/.test(p)) out.push(p);
    }
    return out;
  };
  const SRC = walk(join(ROOT, 'src')).map((p) => relative(ROOT, p).replace(/\\/g, '/')).sort();
  const codeOf = (rel) => readFileSync(join(ROOT, rel), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');

  test('the scanned set is real, so every absence below is real', () => {
    expect(SRC.length).toBeGreaterThan(500);
    expect(SRC).toContain('src/domain/worldPulse/pactProposals.js');
  });

  test('EXACTLY ONE module names the key in code, and it spells the gate `=== true`', () => {
    const namers = SRC.filter((rel) => new RegExp(`\\b${FLAG}\\b`).test(codeOf(rel)));
    // FOUR MODULES NAME IT AS DATA and exactly ONE gates on it. The four are string members
    // of frozen tables — the CQ5 manifest, this lane's certification row, TRADE's foreign
    // precondition row, and the GRAMMAR coupling rows' `flags` column — and they are LISTED
    // rather than excluded by a `certification/` pattern, because a pattern would also
    // swallow a real gate that someone later put in a certification module.
    expect(namers.sort()).toEqual([
      'src/domain/certification/couplingRegistryGrammar.js',
      'src/domain/certification/subsystemRowsVirtual.js',
      'src/domain/certification/tradeConvergenceContract.js',
      'src/domain/worldPulse/pactProposals.js',
      'src/domain/worldPulse/simulationRules.js',
    ]);
    const gate = codeOf('src/domain/worldPulse/pactProposals.js');
    expect(gate).toContain(`${FLAG} === true`);
    // NO LOOSE SPELLING ANYWHERE: a truthy read would make ABSENT and FALSE differ.
    for (const rel of namers) {
      expect(codeOf(rel), `${rel} loose read`).not.toMatch(new RegExp(`${FLAG}\\s*\\)`));
      expect(codeOf(rel), `${rel} negated read`).not.toContain(`!${FLAG}`);
      expect(codeOf(rel), `${rel} inequality read`).not.toContain(`${FLAG} !== true`);
    }
  });

  test('the ONE gate is read by NAME — no frozen-list `.every()` hides it from the census', () => {
    const gate = codeOf('src/domain/worldPulse/pactProposals.js');
    expect((gate.match(new RegExp(`\\b${FLAG}\\b`, 'g')) || []).length).toBe(1);
  });
});

describe('THE LIT-MUTANT CONTROL — the fences are proved to have eyes', () => {
  test('the SAME arc, lit, breaks every fence that passed dark', () => {
    const dark = fullArc({ flag: undefined });
    const lit = fullArc({ flag: true });
    // FENCE 1 would fail: the world really moved.
    expect(lit.receipts).toBeGreaterThan(0);
    expect(lit.treaties).toBe(1);
    // FENCE 2 would fail: the trace really differs.
    expect(lit.trace).not.toBe(dark.trace);
    // …and the ledger the flag governs really exists.
    expect(lit.worldState.spatialLedgers.treaties).toBeTruthy();
    // A QUEUE, NOT AN ARCHIVE — no SETTLED row survives the arc. Open rows may, and one
    // does: a pair whose demand still crosses asks again the tick after it signs, and the
    // instrument answers by running out of stacking room a round later. That is the lane
    // self-limiting in public rather than a leak, so the pin asserts the property that
    // actually matters instead of a count that would drift with the fixture.
    expect(pactProposalsOf(lit.worldState).every((row) => row.state === 'open')).toBe(true);
  });
});

describe('EACH GUARD DOOR, DRIVEN INDIVIDUALLY (the defense-in-depth corollary)', () => {
  const inert = (pass, worldState, settlementUpdates) => {
    expect(pass.worldState).toBe(worldState);
    expect(pass.settlementUpdates).toBe(settlementUpdates);
    expect(pass.changed).toBe(false);
    expect(pass.receipts).toEqual([]);
  };

  test('DOOR 1 — the flag, with a world that would otherwise act', () => {
    const worldState = pactWorld({});
    const updates = [];
    inert(advancePeacetimePacts({
      snapshot: pactSnapshot(), worldState, settlementUpdates: updates, tick: OPEN_TICK,
    }), worldState, updates);
  });

  test('DOOR 2 — fewer than two settlements, with the flag LIT', () => {
    const worldState = pactWorld({ flag: true });
    const updates = [];
    const lonely = { settlements: [pactSnapshot().settlements[0]], regionalGraph: { edges: [] } };
    inert(advancePeacetimePacts({
      snapshot: lonely, worldState, settlementUpdates: updates, tick: OPEN_TICK,
    }), worldState, updates);
    // …and an EMPTY world, which is the same door reached by a different road.
    inert(advancePeacetimePacts({
      snapshot: { settlements: [] }, worldState, settlementUpdates: updates, tick: OPEN_TICK,
    }), worldState, updates);
  });

  test('DOOR 3 — no crossing, with the flag LIT and two real settlements', () => {
    // Both courts believe the other holds nothing they lack, so every scorer refuses. The
    // stage runs its whole body and still writes nothing, which is the arm a state-only
    // fence could never distinguish from the flag being dark.
    const worldState = pactWorld({ flag: true, beliefs: {} });
    const updates = [];
    const pass = advancePeacetimePacts({
      snapshot: pactSnapshot(), worldState, settlementUpdates: updates, tick: OPEN_TICK,
    });
    expect(pass.worldState).toBe(worldState);
    expect(pass.changed).toBe(false);
    expect(pactProposalsOf(pass.worldState)).toHaveLength(0);
  });
});
