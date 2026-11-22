/**
 * errandSpineDormancyFence.test.js — SP-D's FOUR-FENCE dormancy set, with the lit-mutant
 * control and every guard door dropped individually.
 *
 * `errandSpineEnabled` is built DARK. The claim is not "nothing happened in a world where
 * nothing was going to happen" — that is the vacuous green every dormancy pin drifts
 * toward. It is the harder one: across a TEN-TICK run that really mints, really advances,
 * really patches a rumour and really closes an errand — the exact run that DOES carry a
 * purpose class when the flag is lit — the dark ledger is byte-identical and the
 * classifier never executes.
 *
 *   FENCE 1 — OWN-FOOTPRINT INVARIANT, CARRYING NO STORED HASH. The pre-SP-D engine is
 *     not a golden file here; it is a CALL. Every live call site of `mintEnvoyErrand`
 *     passes no spine cargo at all, so invoking that exact signature IS the pre-SP-D
 *     engine, measured rather than remembered. Nothing to re-record, nothing to rot.
 *
 *   FENCE 2 — DIFFERENTIAL, ABSENT vs EXPLICIT FALSE (and vs every truthy-but-not-true
 *     spelling), hashed over the whole ledger. No fixture, so it cannot rot. Its designed
 *     blind spot is that it stays GREEN if the feature runs in BOTH configurations, which
 *     is why it never ships alone.
 *
 *   FENCE 3 — CALL-PATH DORMANCY. A state pin cannot see a feature that ran and happened
 *     to write nothing; a strict pass-through spy can. THE SPY SITS ON
 *     `envoyErrandVocabulary.js` AND THE DIRECTION IS LOAD-BEARING: the recorded WR-10
 *     lesson is that wrapping a function in ITS OWN module's namespace counts ZERO,
 *     because the internal binding is the original. `errandMint.js` IMPORTS
 *     `purposeClassOf` from the vocabulary, so mocking that module really does intercept.
 *     ⚠ THE SUBJECT IS THE MINT HEAD, NOT THE PULSE, AND THAT IS DELIBERATE. The row
 *     reader legitimately runs on EVERY normalize in BOTH flag states — that is the
 *     derivation, and it is supposed to run, since it is what lets a legacy row answer
 *     `diplomatic` with no migration. Counting it across a pulse would measure the
 *     derivation and call it the feature. Scoped to `mintErrandSpine`, the count is
 *     attributable: dark it is ZERO, lit it is not.
 *
 *   FENCE 4 — GATE-POLARITY CENSUS over the real source tree, and it has TWO members
 *     rather than one. `errandMint.js` spells the gate `=== true`. `espionage/
 *     espionageGate.js` spells `errandSpineEnabled !== true` — a FOREIGN subsystem's
 *     lighting-order precondition (ES-0 §2: espionage cannot host missions without the
 *     spine), deliberately negative and documented as such in that file's header. Both
 *     forms are STRICT, so ABSENT and FALSE are identical at both sites; what the census
 *     forbids is a THIRD site or a loose spelling. The pair is pinned with its exact
 *     polarity so a drift in either direction reds.
 *
 *   AND THE DOWNSTREAM SEAM, EXECUTED. Landing the manifest row makes ES-0's door 2 read
 *     a REAL key for the first time. The last block runs `espionageActive` in both flag
 *     states and proves the espionage family stays parked while the spine is dark.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test, vi } from 'vitest';

import { codeOnly } from '../lint/engineGatedRuleKeys.walker.test.js';

/** FENCE 3's recorder. Hoisted, because vi.mock factories hoist above the imports. */
const calls = { classify: 0 };

vi.mock('../../src/domain/worldPulse/envoyErrandVocabulary.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    // STRICT pass-through: rest-args in, the original's result out. Instrumenting the
    // module cannot perturb a byte of the runs the other fences measure.
    purposeClassOf: (/** @type {any[]} */ ...args) => {
      calls.classify += 1;
      return actual.purposeClassOf(...args);
    },
  };
});

const {
  advanceEnvoyErrands,
  applyEnvoyRumorPatch,
  closeEnvoyErrandsForNpcDeath,
  envoyErrandsOf,
} = await import('../../src/domain/worldPulse/envoyErrand.js');
const { mintErrandSpine } = await import('../../src/domain/worldPulse/errandMint.js');
const { espionageActive } = await import('../../src/domain/worldPulse/espionage/espionageGate.js');
const {
  mintOne, peaceOffer, routePlan, spineWorld,
} = await import('../helpers/errandSpineFixture.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FLAG = 'errandSpineEnabled';

const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/**
 * THE ADVERSARIAL RUN. Ten ticks with the war layer BUSY: two errands from two origins,
 * a rumour patch that really steps a picture, the scheduled advance every tick, and a DM
 * KILL that closes one row terminal. A dormancy claim that survives here is a claim about
 * the spine and not about a quiet fixture.
 *
 * @param {{spine?: unknown, cargo?: boolean}} [args] `cargo:false` omits the spine
 *   arguments entirely — that is the PRE-SP-D call signature, i.e. what every live call
 *   site passes today.
 */
function tenTicks({ spine, cargo = true } = {}) {
  const seed = spineWorld({ spine });
  const spineCargo = cargo
    ? { purposeClass: 'covert', declaredPurpose: 'diplomatic' }
    : {};
  let worldState = mintOne(seed, spineCargo).worldState;
  worldState = mintOne(worldState, {
    ...spineCargo,
    outcome: peaceOffer({ id: 'peace.offer.2', from: 'brackwater', to: 'irontown' }),
    npcId: 'npc.envoy.2',
    routePlan: routePlan({ from: 'brackwater', to: 'irontown' }),
  }).worldState;
  const ledgerHashes = [];
  for (let tick = 11; tick <= 20; tick += 1) {
    worldState = advanceEnvoyErrands({ worldState, tick }).worldState;
    if (tick === 13) {
      worldState = applyEnvoyRumorPatch({
        worldState,
        errandId: String(envoyErrandsOf(worldState)[0].id),
        patch: { sourceEventId: 'rumor.1', field: 'strengthBand', direction: 'fall' },
      }).worldState;
    }
    if (tick === 17) {
      worldState = closeEnvoyErrandsForNpcDeath({
        worldState, npcId: 'npc.envoy.2', tick, cause: 'dm_removed',
      }).worldState;
    }
    ledgerHashes.push(hash(envoyErrandsOf(worldState)));
  }
  return { worldState, ledgerHashes, ledger: envoyErrandsOf(worldState) };
}

/** Run `fn` with a zeroed FENCE-3 counter and hand back what it saw. */
function counted(fn) {
  calls.classify = 0;
  const value = fn();
  return { value, classify: calls.classify };
}

describe('SP-D dormancy — FENCE 1: the own footprint is empty', () => {
  test('a dark ten-tick run is byte-identical to the PRE-SP-D call signature', () => {
    const preSpD = tenTicks({ cargo: false });
    const darkWithCargo = tenTicks({ spine: undefined, cargo: true });
    expect(darkWithCargo.ledgerHashes).toEqual(preSpD.ledgerHashes);
    expect(hash(darkWithCargo.ledger)).toBe(hash(preSpD.ledger));
    // anchored: the LIT control below writes the class into this same ten-tick run, which
    // is what makes this an absence rather than an empty subject.
    expect(JSON.stringify(preSpD.ledger)).not.toContain('purposeClass'); // anchored: the LIT control in the next test writes it into this same run
  });

  test('and the LIT run on the SAME fixture really does carry the spine (the control)', () => {
    const lit = tenTicks({ spine: true });
    const dark = tenTicks({ cargo: false });
    expect(JSON.stringify(lit.ledger)).toContain('purposeClass');
    expect(JSON.stringify(lit.ledger)).toContain('truePurpose');
    expect(hash(lit.ledger)).not.toBe(hash(dark.ledger));
    // Every tick of the run diverges, not merely the last — the mint's cargo rides the
    // whole lifecycle including the terminal close.
    expect(lit.ledgerHashes).not.toEqual(dark.ledgerHashes);
    // The run really exercised the lifecycle: one row closed terminal by the DM KILL.
    expect(lit.ledger.some((row) => row.state === 'lost')).toBe(true);
    expect(lit.ledger.every((row) => row.purposeClass === 'covert')).toBe(true);
  });
});

describe('SP-D dormancy — FENCE 2: absent and explicitly false are indistinguishable', () => {
  test('over the whole ledger, with the war layer busy and the stream running', () => {
    const absent = hash(tenTicks({ spine: undefined }).ledger);
    expect(hash(tenTicks({ spine: false }).ledger)).toBe(absent);
    // Dark-never-permissive: no truthy-but-not-true value opens the door.
    for (const value of [1, 'true', {}, [], 'yes']) {
      expect(hash(tenTicks({ spine: value }).ledger), `${String(value)} opened the gate`)
        .toBe(absent);
    }
    // ...and the one spelling that DOES differ, so the equalities above discriminate.
    expect(hash(tenTicks({ spine: true }).ledger)).not.toBe(absent);
  });
});

describe('SP-D dormancy — FENCE 3: the classifier never runs at all', () => {
  test('a dark mint head makes ZERO classification calls; a lit one makes several', () => {
    const args = {
      purpose: 'sue',
      purposeClass: 'covert',
      declaredPurpose: 'diplomatic',
      routePlan: routePlan(),
      fromId: 'ashford',
      toId: 'irontown',
      journey: 'outbound',
      notBeforeTick: 10,
    };
    const dark = counted(() => mintErrandSpine({ worldState: spineWorld(), ...args }));
    const darkFalse = counted(() => mintErrandSpine({ worldState: spineWorld({ spine: false }), ...args }));
    const lit = counted(() => mintErrandSpine({ worldState: spineWorld({ spine: true }), ...args }));
    expect(dark.classify).toBe(0);
    expect(darkFalse.classify).toBe(0);
    // The lit count is what makes the two zeroes evidence rather than an artifact of a spy
    // that never wired up.
    expect(lit.classify).toBeGreaterThan(0);
    expect(dark.value.fields).toEqual({});
    expect(lit.value.fields).toEqual({
      purposeClass: 'covert', declaredPurpose: 'diplomatic', truePurpose: 'covert',
    });
  });

  test('an unpriceable journey refuses BEFORE the gate is even consulted', () => {
    const broken = counted(() => mintErrandSpine({
      worldState: spineWorld({ spine: true }),
      purpose: 'sue',
      purposeClass: 'covert',
      routePlan: { legs: [], expectedReturnTick: 20 },
      fromId: 'ashford',
      toId: 'irontown',
      journey: 'outbound',
      notBeforeTick: 10,
    }));
    expect(broken.value.reason).toBe('invalid_route_plan');
    expect(broken.classify).toBe(0);
  });
});

describe('SP-D dormancy — FENCE 4: every gate read in src/ is strict, and there are exactly two', () => {
  const files = [];
  (function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(js|jsx)$/.test(p)) files.push(p);
    }
  }(join(ROOT, 'src')));

  test('the flag is read by name, only in strict form, at exactly the two known doors', () => {
    /** @type {Array<{rel: string, line: string}>} */
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
    // blanks string contents, so it never reaches this census.
    expect(reads.length, 'no gate read found — the census is measuring nothing')
      .toBeGreaterThanOrEqual(2);
    for (const read of reads) {
      expect(read.line, `${read.rel} reads ${FLAG} without a strict form`)
        .toMatch(new RegExp(`${FLAG}\\s*(?:===|!==)\\s*true`));
    }
    // TWO doors, and each is a different subsystem's. SP-D's own gate is the positive
    // form; ES-0's is the negative lighting-order precondition its header documents. A
    // THIRD site, or either of these flipping polarity, reds here.
    const byFile = new Map();
    for (const read of reads) {
      byFile.set(read.rel, [...(byFile.get(read.rel) || []), read.line]);
    }
    expect([...byFile.keys()].sort()).toEqual([
      'src/domain/worldPulse/errandMint.js',
      'src/domain/worldPulse/espionage/espionageGate.js',
    ]);
    expect(byFile.get('src/domain/worldPulse/errandMint.js').join('\n'))
      .toMatch(new RegExp(`${FLAG}\\s*===\\s*true`));
    expect(byFile.get('src/domain/worldPulse/espionage/espionageGate.js').join('\n'))
      .toMatch(new RegExp(`${FLAG}\\s*!==\\s*true`));
  });
});

describe('SP-D dormancy — the conjunction: each door dropped ALONE', () => {
  test('door 1 dark (the six war flags) with door 2 lit mints nothing at all', () => {
    const noWar = {
      tick: 10,
      simulationRules: { errandSpineEnabled: true },
      relationshipStates: {},
    };
    const out = mintOne(noWar, { purposeClass: 'covert', declaredPurpose: 'diplomatic' });
    expect(out.reason).toBe('dark');
    expect(envoyErrandsOf(out.worldState)).toEqual([]);
  });

  test('door 2 dark (the spine flag) with door 1 lit mints an errand WITHOUT the spine', () => {
    const out = mintOne(spineWorld(), { purposeClass: 'covert', declaredPurpose: 'diplomatic' });
    // anchored: the errand really was minted, so this is door 2 refusing the fields and
    // not the whole mint failing.
    expect(out.reason).toBe('minted');
    expect(JSON.stringify(envoyErrandsOf(out.worldState))).not.toContain('purposeClass'); // anchored: the mint is asserted to have SUCCEEDED above
  });

  test('both doors lit writes it — so neither refusal above is an accident', () => {
    const out = mintOne(spineWorld({ spine: true }), {
      purposeClass: 'covert', declaredPurpose: 'diplomatic',
    });
    expect(JSON.stringify(envoyErrandsOf(out.worldState))).toContain('purposeClass');
  });
});

describe('SP-D downstream seam — ES-0 door 2 now reads a REAL key', () => {
  test('the espionage family stays PARKED while the spine is dark, in every spelling', () => {
    // Beliefs live (`spatialCanonVersion` + a non-omniscient infoMode) and the espionage
    // flag lit, so door 2 is the only thing left that can refuse.
    const espionageWorld = (spine) => ({
      tick: 10,
      spatialCanonVersion: 1,
      simulationRules: {
        infoMode: 'unreliable',
        espionageEnabled: true,
        ...(spine === undefined ? {} : { errandSpineEnabled: spine }),
      },
    });
    for (const spine of [undefined, false, 1, 'true', {}]) {
      expect(espionageActive(espionageWorld(spine)), `spine=${String(spine)} lit espionage`)
        .toBe(false);
    }
    // ...and the ordered config really does light it, so the refusals above are door 2
    // doing its job rather than some other door refusing everything.
    expect(espionageActive(espionageWorld(true))).toBe(true);
  });

  test('and lighting the spine ALONE lights nothing new — espionage still needs its own flag', () => {
    expect(espionageActive({
      tick: 10,
      spatialCanonVersion: 1,
      simulationRules: { infoMode: 'unreliable', errandSpineEnabled: true },
    })).toBe(false);
  });
});
