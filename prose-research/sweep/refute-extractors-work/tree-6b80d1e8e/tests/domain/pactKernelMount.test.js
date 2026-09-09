/**
 * pactKernelMount.test.js — GR-2 REPAIR ROUND. THE MOUNT ITSELF, WHICH NOTHING DROVE.
 *
 * GR-2 built four sound stage modules and wired them into `advanceSettlementLifecycle`,
 * and then no test in the estate ever called that function with `pactFormationEnabled`
 * lit. Two defects lived in exactly that gap, and its adversarial verifier found both:
 *
 *   1. THE FATAL ONE. The kernel's `changed` vote omitted `pacts.changed` on BOTH return
 *      paths (and `market.changed` on the dark one). `applyPulseMover` opens with
 *      `if (!result || !result.changed) return { worldState, … }` — a falsy vote THROWS
 *      AWAY the returned worldState. With the pact flag lit and `settlementLifecycleEnabled`
 *      ABSENT — the ordinary configuration, since these are independent virtual keys — the
 *      kernel handed back a fully-written `spatialLedgers.pactProposals` under `changed:
 *      false` and the mount dropped it on the floor. GR-2 persisted only by accident, when
 *      some unrelated flag happened to also be lit.
 *
 *   2. THE OVERSTATEMENT. Two source headers said the market-first/pacts-second stage order
 *      was "PINNED". A mutant that swapped the two stages wholesale left 191 tests green.
 *
 * WHAT THIS FILE IS THEREFORE BUILT TO DO — and the shape is the recorded DEFENSE-IN-DEPTH
 * COROLLARY, not decoration. A single test asserting "the ledger survives" would pass on
 * ANY ONE of the three votes being folded, so deleting two of the three clauses would stay
 * green. Every stage's vote is pinned through its OWN door, on BOTH return paths, with the
 * other two stages held silent — so a deleted clause reds by name.
 *
 * THE RECORDERS ARE STRICT PASS-THROUGHS (the dormancy fence's FENCE-3 idiom): rest-args
 * in, the original's result out. Instrumenting the three stages cannot perturb a byte of
 * the runs measured here. `force` is the one deliberate exception — it overrides ONLY the
 * boolean `changed` a stage reports, which is precisely the seam under test, and it is
 * `null` (inert) in every test that measures real behaviour.
 *
 * @enforced-by this file
 */
import { describe, expect, test, beforeEach, vi } from 'vitest';

/** The stage recorder + the vote override. Declared before the mocks that read them:
 *  `vi.mock` hoists, but its factory is lazy and runs at the first dynamic import below. */
/** @type {Array<{stage: string, inWorld: unknown, inUpdates: unknown, outWorld: unknown, outUpdates: unknown, outChanged: unknown}>} */
const seen = [];
/** @type {{market: boolean|null, pacts: boolean|null, demo: boolean|null}} */
const force = { market: null, pacts: null, demo: null };

/** Wrap one stage: record what went in and what came out, then optionally override the
 *  ONE boolean this file exists to pin. Everything else is the original's own result. */
const recorder = (stage, fn, key) => (/** @type {any} */ args) => {
  const result = fn(args);
  const out = force[key] === null ? result : { ...result, changed: force[key] };
  seen.push({
    stage,
    inWorld: args.worldState,
    inUpdates: args.settlementUpdates,
    outWorld: out.worldState,
    outUpdates: out.settlementUpdates,
    outChanged: out.changed,
  });
  return out;
};

vi.mock('../../src/domain/worldPulse/sovereigntyMarketStage.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return { ...actual, advanceSovereigntyMarket: recorder('market', actual.advanceSovereigntyMarket, 'market') };
});
vi.mock('../../src/domain/worldPulse/pactFormation.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return { ...actual, advancePeacetimePacts: recorder('pacts', actual.advancePeacetimePacts, 'pacts') };
});
vi.mock('../../src/domain/worldPulse/demographicsKernel.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return { ...actual, advanceDemographics: recorder('demo', actual.advanceDemographics, 'demo') };
});

const { advanceSettlementLifecycle, settlementLifecycleActive } = await import('../../src/domain/worldPulse/settlementLifecycleKernel.js');
const { pactProposalsOf } = await import('../../src/domain/worldPulse/pactProposals.js');
const { applyPulseMover, ensureWizardNewsFeed } = await import('../../src/domain/region/wizardNews.js');
const { OPEN_TICK, pactSnapshot, pactWorld } = await import('../helpers/pactFixture.js');

const NOW = '2026-01-01T00:00:00.000Z';

/**
 * Drive the REAL mount. `lifecycle` left undefined means the host flag is ABSENT, which is
 * the configuration the fatal defect lived in and the one this file leans on hardest.
 * @param {{flag?: unknown, lifecycle?: unknown}} [args]
 */
function runMount({ flag, lifecycle } = {}) {
  /** @type {Record<string, unknown>} */
  const rules = {};
  if (lifecycle !== undefined) rules.settlementLifecycleEnabled = lifecycle;
  const worldState = pactWorld({ flag, rules });
  /** @type {any[]} */
  const settlementUpdates = [];
  const result = advanceSettlementLifecycle({
    snapshot: pactSnapshot(), worldState, settlementUpdates,
    pIndex: null, rng: null, tick: OPEN_TICK, now: NOW,
  });
  return { worldState, settlementUpdates, result };
}

beforeEach(() => {
  seen.length = 0;
  force.market = null;
  force.pacts = null;
  force.demo = null;
});

describe('THE MOUNT — a lit lane\'s write reaches the world, on both return paths', () => {
  test('DARK HOST (the flag\'s ordinary state): the pact ledger survives applyPulseMover', () => {
    const { worldState, result } = runMount({ flag: true });
    // The configuration is the point, so it is asserted rather than assumed: the pact flag
    // is lit and the HOST flag is genuinely absent, which is the pair that was inert.
    expect(worldState.simulationRules.pactFormationEnabled).toBe(true);
    expect(worldState.simulationRules.settlementLifecycleEnabled).toBeUndefined();
    expect(settlementLifecycleActive(result.worldState)).toBe(false);
    // The stage really wrote — without this the survival claim below could pass on nothing.
    expect(pactProposalsOf(result.worldState).length).toBeGreaterThan(0);
    expect(result.changed).toBe(true);
    const after = applyPulseMover(result, worldState, [], ensureWizardNewsFeed({}), NOW);
    expect(pactProposalsOf(after.worldState).length).toBeGreaterThan(0);
    expect(pactProposalsOf(after.worldState)).toEqual(pactProposalsOf(result.worldState));
  });

  test('LIT HOST: the same write survives the other return path', () => {
    const { worldState, result } = runMount({ flag: true, lifecycle: true });
    expect(settlementLifecycleActive(result.worldState)).toBe(true);
    expect(pactProposalsOf(result.worldState).length).toBeGreaterThan(0);
    expect(result.changed).toBe(true);
    const after = applyPulseMover(result, worldState, [], ensureWizardNewsFeed({}), NOW);
    expect(pactProposalsOf(after.worldState).length).toBeGreaterThan(0);
  });

  test('NEGATIVE CONTROL: everything dark ⇒ a false vote and the SAME references', () => {
    // Without this, "fold every vote" could be satisfied by returning `true` always, and
    // the dormancy law — dark ⇒ not one byte perturbed — would die silently.
    const { worldState, settlementUpdates, result } = runMount({});
    expect(result.changed).toBe(false);
    expect(result.worldState).toBe(worldState);
    expect(result.settlementUpdates).toBe(settlementUpdates);
    const after = applyPulseMover(result, worldState, settlementUpdates, ensureWizardNewsFeed({}), NOW);
    expect(after.worldState).toBe(worldState);
  });
});

describe('THE VOTE — every stage, through its OWN door, on BOTH paths', () => {
  /**
   * Drive ONE stage's vote to `true` with the other two left at their real (dark, `false`)
   * vote, then hand back what the mount reported. The isolation is the whole point: a pin
   * that lights two stages at once is green when one of the two clauses is deleted.
   *
   * ⚠ THE SIX TESTS BELOW ARE SPELLED OUT ONE BY ONE RATHER THAN GENERATED FROM A TABLE.
   * That is SP-D's recorded idiom and it is not a style preference: a `for…of` that calls
   * `test()` makes every title in the file dynamic, and the lighting instrument's door-3
   * reader then PARKS the whole file — measured, this exact file went parked 358 → 359 in
   * its first draft. Loop INSIDE a named test; never generate tests from a loop.
   * @param {'market'|'pacts'|'demo'} key @param {{lifecycle?: unknown}} [args]
   */
  const voteAlone = (key, { lifecycle } = {}) => {
    force[key] = true;
    const { result } = runMount({ lifecycle });
    return {
      changed: result.changed,
      order: seen.map((row) => row.stage),
      voters: seen.filter((row) => row.outChanged === true).map((row) => row.stage),
    };
  };

  test('DARK HOST: the MARKET stage\'s vote alone reaches the caller', () => {
    const run = voteAlone('market');
    expect(run.order).toEqual(['market', 'pacts', 'demo']);
    expect(run.voters).toEqual(['market']);
    expect(run.changed, 'the market stage\'s vote is dropped on the dark return').toBe(true);
  });

  test('DARK HOST: the PACT stage\'s vote alone reaches the caller', () => {
    const run = voteAlone('pacts');
    expect(run.order).toEqual(['market', 'pacts', 'demo']);
    expect(run.voters).toEqual(['pacts']);
    expect(run.changed, 'the pact stage\'s vote is dropped on the dark return').toBe(true);
  });

  test('DARK HOST: the DEMOGRAPHIC stage\'s vote alone reaches the caller', () => {
    const run = voteAlone('demo');
    expect(run.order).toEqual(['market', 'pacts', 'demo']);
    expect(run.voters).toEqual(['demo']);
    expect(run.changed, 'the demographic stage\'s vote is dropped on the dark return').toBe(true);
  });

  test('LIT HOST: the MARKET stage\'s vote alone reaches the caller', () => {
    const run = voteAlone('market', { lifecycle: true });
    expect(run.voters).toEqual(['market']);
    expect(run.changed, 'the market stage\'s vote is dropped on the lit return').toBe(true);
  });

  test('LIT HOST: the PACT stage\'s vote alone reaches the caller', () => {
    const run = voteAlone('pacts', { lifecycle: true });
    expect(run.voters).toEqual(['pacts']);
    expect(run.changed, 'the pact stage\'s vote is dropped on the lit return').toBe(true);
  });

  test('LIT HOST: the DEMOGRAPHIC stage\'s vote alone reaches the caller', () => {
    const run = voteAlone('demo', { lifecycle: true });
    expect(run.voters).toEqual(['demo']);
    expect(run.changed, 'the demographic stage\'s vote is dropped on the lit return').toBe(true);
  });
});

describe('STAGE ORDER — market first, pacts second, demographics third', () => {
  test('the call order and the IDENTITY CHAIN both hold', () => {
    // The claim two source headers make. It was carried by prose alone until a verifier
    // swapped the stages wholesale and 191 tests stayed green.
    const { worldState, result } = runMount({ flag: true, lifecycle: true });
    expect(seen.map((row) => row.stage)).toEqual(['market', 'pacts', 'demo']);
    const [market, pacts, demo] = seen;

    // ANTI-VACUITY FIRST. With the market and demographic flags dark those two stages hand
    // back their own inputs, so every object below would be the SAME object and an identity
    // chain would hold under any order at all. The pact stage is lit and really writes, so
    // there are two distinct worldStates in play and the chain measures threading.
    expect(pacts.outWorld).not.toBe(pacts.inWorld);
    expect(pactProposalsOf(result.worldState).length).toBeGreaterThan(0);

    expect(market.inWorld, 'the market stage must read the HOST world').toBe(worldState);
    expect(pacts.inWorld, 'the pact stage must read the MARKET\'s returned world').toBe(market.outWorld);
    expect(pacts.inUpdates, 'the pact stage must read the MARKET\'s returned updates').toBe(market.outUpdates);
    expect(demo.inWorld, 'demographics must read the PACT stage\'s returned world').toBe(pacts.outWorld);
    expect(demo.inUpdates, 'demographics must read the PACT stage\'s returned updates').toBe(pacts.outUpdates);
    // …and the rebase is measurably NOT onto the host, which is what a demographics-first
    // or demographics-on-market spelling would leave behind.
    expect(demo.inWorld).not.toBe(worldState);
  });
});
