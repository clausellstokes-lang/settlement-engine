/**
 * strategicPostureDormancyFence.test.js — SP-C's FOUR-FENCE dormancy set, with the
 * lit-mutant control and every guard door dropped individually.
 *
 * `strategicPostureEnabled` is built DARK. The claim this file has to make good is not
 * "nothing happened in a world where nothing was going to happen anyway" — that is the
 * vacuous green every dormancy pin drifts toward. It is the harder one: on the exact
 * ten-tick run that DOES write an appetite facet when the flag is lit, and against a
 * LIT disposition ledger busily rewriting its own channels every tick, the dark run
 * produces a byte-identical ledger and never enters the code at all.
 *
 *   FENCE 1 — OWN-FOOTPRINT INVARIANT, and it carries NO STORED HASH. The pre-SP-C
 *     engine is not a golden file here; it is a CALL. `pulseKernel` invokes the writer
 *     as `advanceDispositionChannels(ledger, deltas, { enabled, tick })` — no appetite
 *     option at all — so running that exact signature IS the pre-SP-C engine, measured
 *     rather than remembered. Nothing to re-record when the engine evolves for unrelated
 *     reasons, and nothing to rot.
 *
 *   FENCE 2 — DIFFERENTIAL, ABSENT vs EXPLICIT FALSE, over the whole ledger. No fixture,
 *     so it cannot rot. Its designed blind spot is that it stays GREEN if the feature
 *     runs in BOTH configurations, which is why it is never shipped alone and why the
 *     lit-mutant expects it to pass while fences 1 and 3 red.
 *
 *   FENCE 3 — CALL-PATH DORMANCY. State pins cannot see a feature that ran and happened
 *     to write nothing; a strict pass-through spy on `bandedStock.decayTowardNeutral`
 *     can. THE SPY SITS ON bandedStock.js AND THAT IS LOAD-BEARING: the recorded WR-10
 *     lesson is that wrapping a function in ITS OWN module's namespace counts ZERO,
 *     because the internal binding is the original. Here the caller
 *     (dispositionLedger.js) IMPORTS the decay from bandedStock.js, so mocking that
 *     module really does intercept — the same lesson, applied the correct way round.
 *     The appetite is the engine's ONLY consumer of that leaf today, which is what makes
 *     the count attributable.
 *
 *   FENCE 4 — GATE-POLARITY CENSUS over the real source tree: every production read of
 *     the flag is the strict `=== true` form, so ABSENT and FALSE are identical BY
 *     CONSTRUCTION at decision sites no state pin reaches. It reuses the
 *     engine-gated-key walker's own comment/string blanker rather than a second regex,
 *     so a gate written in prose cannot be miscounted as a gate.
 *
 *   AND THE TWO-DOOR CONJUNCTION, which is SP-C's own: the appetite writer sits inside
 *     the WR-2 channel writer's lit arm, so there are two doors and a test that only
 *     drops the second has proven nothing about the first. Each is dropped ALONE, with
 *     the other lit — the defense-in-depth corollary, which this estate has been bitten
 *     by twice.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test, vi } from 'vitest';

import { codeOnly } from '../lint/engineGatedRuleKeys.walker.test.js';

/** FENCE 3's recorder. Hoisted, because vi.mock factories hoist above the imports. */
const calls = { decay: 0 };

vi.mock('../../src/domain/worldPulse/bandedStock.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    // STRICT pass-through: rest-args in, the original's result out. Instrumenting the
    // module cannot perturb a byte of the runs the other fences measure.
    decayTowardNeutral: (/** @type {any[]} */ ...args) => {
      calls.decay += 1;
      return actual.decayTowardNeutral(...args);
    },
  };
});

const { advanceDispositionChannels } = await import('../../src/domain/worldPulse/dispositionLedger.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FLAG = 'strategicPostureEnabled';

/**
 * THE ADVERSARIAL RUN. Two courts, ten ticks, a mixed stream of resolved outcomes that
 * really does teach an appetite when the flag is lit — three lesson families and the
 * silent kind, wins and losses, so no arm of the writer is left unvisited. Every dark
 * claim below is made against THIS, never against an empty world.
 *
 * The ledger starts already extended and already carrying channel history, because a
 * LIT ledger is the adversarial case: the container is busy every single tick, so a
 * dormancy claim that survives here is a claim about the facet and not about a quiet
 * fixture.
 */
const SOURCE_CYCLE = Object.freeze([
  'war_resolution', 'trade_contest', 'treaty_held', 'resolved_outcome', 'occupation_outcome',
  'coalition_settlement_profit', 'treaty_repudiated', 'mediation_landed', 'war_resolution', 'trade_contest',
]);

function seedLedger() {
  return {
    aldenmoor: { wins: 3, losses: 1, score: 2, updatedTick: 0 },
    thornwall: { wins: 0, losses: 4, score: -4, updatedTick: 0 },
  };
}

/** @param {number} tick */
function deltasAt(tick) {
  const sourceKind = SOURCE_CYCLE[tick % SOURCE_CYCLE.length];
  return [
    { id: 'aldenmoor', channel: 'martial', outcome: tick % 3 === 2 ? 'loss' : 'win', sourceKind },
    { id: 'thornwall', channel: 'mercantile', outcome: tick % 2 === 0 ? 'loss' : 'win', sourceKind },
  ];
}

/**
 * Ten ticks through the REAL writer.
 * @param {Record<string, unknown>|null} appetiteOption the third option, or null to omit
 *   it entirely — omission is the live pulse's own call, i.e. the pre-SP-C engine.
 */
function tenTicks(appetiteOption) {
  let ledger = /** @type {Record<string, any>} */ (seedLedger());
  for (let tick = 1; tick <= 10; tick += 1) {
    ledger = advanceDispositionChannels(
      ledger,
      /** @type {any[]} */ (deltasAt(tick)),
      { enabled: true, tick, ...(appetiteOption || {}) },
    ).ledger;
  }
  return ledger;
}

const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/** Run `fn` with a zeroed FENCE-3 counter and hand back what it saw. */
function counted(fn) {
  calls.decay = 0;
  const value = fn();
  return { value, decay: calls.decay };
}

describe('SP-C dormancy — FENCE 1: the own footprint is empty', () => {
  test('a dark ten-tick run is byte-identical to the PRE-SP-C call signature', () => {
    // The pre-SP-C engine is measured, not remembered: `{ enabled, tick }` is exactly
    // what pulseKernel passes today.
    const preSpC = tenTicks(null);
    const explicitlyDark = tenTicks({ appetiteEnabled: false });
    expect(hash(explicitlyDark)).toBe(hash(preSpC));
    // The LIT control in the next test writes the facet into this same ten-tick run.
    // anchored: that control proves the subject is a ledger that CAN carry the key.
    expect(JSON.stringify(preSpC)).not.toContain('appetite');
  });

  test('and the LIT run on the SAME fixture really does write the facet (the control)', () => {
    const lit = tenTicks({ appetiteEnabled: true });
    expect(JSON.stringify(lit)).toContain('appetite');
    expect(hash(lit)).not.toBe(hash(tenTicks(null)));
    // Both courts learned, and they learned DIFFERENT things — so the fixture exercises
    // the writer rather than tripping one arm of it.
    expect(lit.aldenmoor.appetite.stock01).not.toBe(lit.thornwall.appetite.stock01);
    for (const id of ['aldenmoor', 'thornwall']) {
      expect(typeof lit[id].appetite.band).toBe('string');
      expect(lit[id].appetite.updatedTick).toBe(10);
    }
  });
});

describe('SP-C dormancy — FENCE 2: absent and explicitly false are indistinguishable', () => {
  test('over the whole ledger, with the host lit and the stream running', () => {
    expect(hash(tenTicks({ appetiteEnabled: false }))).toBe(hash(tenTicks({})));
    expect(hash(tenTicks({ appetiteEnabled: undefined }))).toBe(hash(tenTicks(null)));
    // Dark-never-permissive: no truthy-but-not-true value opens the door.
    for (const value of [1, 'true', {}, []]) {
      expect(hash(tenTicks({ appetiteEnabled: value }))).toBe(hash(tenTicks(null)));
    }
  });
});

describe('SP-C dormancy — FENCE 3: the code never runs at all', () => {
  test('a dark run makes ZERO calls into the shared decay shape; a lit run makes many', () => {
    const dark = counted(() => tenTicks(null));
    const darkFalse = counted(() => tenTicks({ appetiteEnabled: false }));
    const lit = counted(() => tenTicks({ appetiteEnabled: true }));
    expect(dark.decay).toBe(0);
    expect(darkFalse.decay).toBe(0);
    // The lit count is what makes the two zeroes above evidence rather than an artifact
    // of a spy that never wired up.
    expect(lit.decay).toBeGreaterThan(0);
    expect(hash(lit.value)).not.toBe(hash(dark.value));
  });
});

describe('SP-C dormancy — FENCE 4: every gate read in src/ is strict', () => {
  const files = [];
  (function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(js|jsx)$/.test(p)) files.push(p);
    }
  }(join(ROOT, 'src')));

  test('the flag is read by name, exactly once, and only as `=== true`', () => {
    const reads = [];
    for (const p of files) {
      const src = codeOnly(readFileSync(p, 'utf8'));
      if (!src.includes(FLAG)) continue;
      const rel = relative(ROOT, p).replace(/\\/g, '/');
      for (const line of src.split('\n')) {
        if (line.includes(FLAG)) reads.push({ rel, line: line.trim() });
      }
    }
    // The manifest row in simulationRules.js is a LIST MEMBER, not a read; the blanker
    // blanks its string contents, so it never reaches this census. What is left is the
    // engine's real gate reads.
    expect(reads.length, 'no gate read found — the census is measuring nothing').toBeGreaterThanOrEqual(1);
    for (const read of reads) {
      expect(read.line, `${read.rel} reads ${FLAG} without the strict form`)
        .toMatch(new RegExp(`${FLAG}\\s*===\\s*true`));
    }
    // ONE DOOR, and it is the one the header names. A second by-name read is not
    // forbidden by law, but it is forbidden by this design: two doors on one flag is how
    // a deleted guard hides behind a surviving one.
    expect([...new Set(reads.map((read) => read.rel))])
      .toEqual(['src/domain/worldPulse/strategicPosture.js']);
  });
});

describe('SP-C dormancy — the conjunction: each door dropped ALONE', () => {
  test('door 1 dark (the WR-2 host) with door 2 lit writes nothing', () => {
    let ledger = /** @type {Record<string, any>} */ (seedLedger());
    for (let tick = 1; tick <= 10; tick += 1) {
      ledger = advanceDispositionChannels(
        ledger,
        /** @type {any[]} */ (deltasAt(tick)),
        { enabled: false, appetiteEnabled: true, tick },
      ).ledger;
    }
    // Ten ticks of outcomes really landed in this ledger.
    // anchored: the win-count assertion below proves it, so this is door 1 refusing.
    expect(JSON.stringify(ledger)).not.toContain('appetite');
    expect(ledger.aldenmoor.wins).toBeGreaterThan(3);
  });

  test('door 2 dark (the flag) with door 1 lit writes nothing', () => {
    const ledger = tenTicks({ appetiteEnabled: false });
    // anchored: the channel assertion below proves the writer really moved this ledger.
    expect(JSON.stringify(ledger)).not.toContain('appetite');
    expect(ledger.aldenmoor.channels.martial.stock01).not.toBe(0.5);
  });

  test('both doors lit writes it — so neither zero above is an accident', () => {
    expect(JSON.stringify(tenTicks({ appetiteEnabled: true }))).toContain('appetite');
  });
});
