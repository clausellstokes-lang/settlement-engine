/**
 * forkSitesConsult.test.js — EM-E4b acceptance cases E4b-1 to E4b-8 (wave 3; design
 * §16 and §19 rulings 1, 3 and 4; the chair's judgments 265 and 270).
 *
 * THE CLAIM. EM-E4 landed the pin bag and the consult verb; the registered fork SITES did
 * not yet read them. This member is the wiring: the pulse's head composes ONE bag from the
 * tick's DUE decrees, judged against each registered fork's OWN words, and threads it to
 * the sites. A fork whose id is in the bag takes the pinned outcome AND DOES NOT DRAW — the
 * year root the festival would have composed is never composed, the siege's fork is never
 * taken — so the run is the run of a world that never reached that fork. A fork that is not
 * pinned draws exactly as today, which is why a world with no directive is byte-identical.
 *
 * ⭐ THE VOCABULARIES ARE MEASURED FROM THE FORKS THEMSELVES, NEVER TRANSCRIBED (EM-E4's
 * case E4-3's discipline, carried forward). Case E4b-6 runs the real `outcomeForDraw` and
 * the real `resolveSiegeVerdict`, COLLECTS the words each one produces, and holds the two
 * exported vocabularies equal to them. A suite that spelled the words would pass on a fork
 * whose draw had moved underneath it — the exact failure design §19 ruling 1 prevents.
 *
 * ⭐ HBF-86's LAST HOP IS WIRED, AND E4b-8 IS NOW ITS POSITIVE TWIN (U35). The arm used to
 * assert the gap: `evaluateWarLayer` in `src/domain/worldPulse/warDeployment.js` neither
 * destructured the bag nor forwarded it into the sixteen arguments it spells by name, so
 * `resolveSiegeVerdict`'s landed consult could never be reached from a production caller.
 * U35 landed those two tokens and this arm now DRIVES the war layer: a pin handed to
 * `evaluateWarLayer` decides the siege, and every one of the fork's four bands answers with
 * the direction `SIEGE_VERDICT_BANDS` types for it.
 *
 * ⭐ AND THE PULSE'S OWN TOKEN LANDED TOO (U71, the verifier's FIX-2). `pulseKernel.js`
 * folded the bag and handed it to the growth chain while its own `evaluateWarLayer({ … })`
 * call omitted it, so a DECREE could not pin a siege at a REAL TICK — the layer's door was
 * open and the kernel had not walked through it. The kernel's war call now passes `forkPins`,
 * and E4b-8's second half is the pinned siege driven through `simulateCampaignWorldPulse`
 * that the old half asked its author for: the bag is folded by the pulse from the save's own
 * due decrees and the fall is read from OUTSIDE as the occupation a taken town seeds.
 *
 * ⚠ TWO SYNTHETIC LITERALS ARE DECLARED, AND BOTH ARE MEASURED RATHER THAN INVENTED. The
 * four siege rolls are EM-E4's own fixture rolls, re-derived into the whole band set on
 * every run by case E4b-6; and the festival's open window (`startWeekOfYear` 35) was found
 * by EXECUTING the calendar advance this fixture performs — case E4b-3 asserts the festival
 * actually occurred, so a drift in the calendar reds here rather than passing vacuously on a
 * tick where nothing happened.
 *
 * ⚠ THE PRNG MODULE IS MOCKED AS A STRICT PASS-THROUGH SPY (`advanceEpochForkParity`'s own
 * idiom, and its header states the limit this suite depends on): mocking the export records
 * every ROOT composed through the imported binding — which is how the festival draws — and
 * cannot see a sub-fork, which is why the siege's no-draw half is proved with a counting rng
 * stub instead. Nothing is perturbed: the original's result is returned unchanged.
 *
 * Proof shape copied from `tests/simulation/pinFork.test.js` (EM-E4): straight-line literal
 * `it`s under ONE literal `describe`, its own `vitest` import, and the kernel's own source
 * read for the structural arms.
 *
 * @enforced-by this test
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';

/** The recorder. Hoisted, because `vi.mock` factories hoist above the imports. */
const trace = { roots: /** @type {string[]} */ ([]) };
const resetTrace = () => { trace.roots = []; };

vi.mock('../../src/kernel/prng.js', async (importOriginal) => {
  const actual = /** @type {Record<string, unknown>} */ (await importOriginal());
  return {
    ...actual,
    createPRNG: (/** @type {unknown[]} */ ...args) => {
      trace.roots.push(String(args[0]));
      return /** @type {(...a: unknown[]) => unknown} */ (actual.createPRNG)(...args);
    },
  };
});

const { simulateCampaignWorldPulse } = await import('../../src/domain/worldPulse/pulseKernel.js');
const { stage } = await import('../../src/domain/edit/registry.js');
const { forkPinsFor } = await import('../../src/domain/edit/directives.js');
const { dueEntriesAtTick } = await import('../../src/domain/worldPulse/decreeHook.js');
const { TRADITION_FORK, TRADITION_OUTCOME, outcomeForDraw } = await import('../../src/domain/worldPulse/traditionsKernel.js');
const { SIEGE_FORK, SIEGE_FALL_ODDS_WORDS, SIEGE_VERDICT_BANDS, resolveSiegeVerdict } = await import('../../src/domain/worldPulse/warSiegeVerdict.js');
const { advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssizeAndDensity } = await import('../../src/domain/worldPulse/factionDensityKernel.js');
const { evaluateWarLayer } = await import('../../src/domain/worldPulse/warDeployment.js');
const { buildWorldSnapshot } = await import('../../src/domain/worldPulse/worldSnapshot.js');
const { ensureRegionalGraph } = await import('../../src/domain/region/index.js');
const { createPRNG } = await import('../../src/kernel/prng.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const KERNEL_REL = 'src/domain/worldPulse/pulseKernel.js';
const WAR_HEAD_REL = 'src/domain/worldPulse/warDeployment.js';
const KERNEL = readFileSync(join(ROOT, KERNEL_REL), 'utf8');
const BASELINE = JSON.parse(readFileSync(join(ROOT, 'scripts/.size-baseline.json'), 'utf8'));

const NOW = '2026-04-04T00:00:00.000Z';
const SID = 'a';
/** The festival's year root, by the substring only this fork composes. */
const YEAR_ROOT_MARK = '::tradition:';
/** The window this fixture's calendar advance lands in — executed, see the header. */
const OPEN_WEEK = 35;

/** A held observance whose window opens on the tick this fixture advances into. */
const REC = Object.freeze({
  id: 'tradition.ashford.0',
  coreMotif: { element: 'harvest', act: 'feast' },
  name: 'The Harvest Feast',
  foundedYear: 1,
  window: { startWeekOfYear: OPEN_WEEK, weeks: 1 },
  scaleBand: 4,
  ownerKey: null, ownerKind: null, deityRef: null,
  expression: { trappings: ['bonfires'], epithet: 'kept since the first furrow' },
  mutationLog: [], lastHeldYear: null, lastOutcome: null, suppressedBy: null, adoptedFrom: null,
});

/** @param {unknown[]|null} decrees @returns {Record<string, unknown>} */
const settlementOf = (decrees) => ({
  name: 'Ashford', tier: 'city', population: 9000,
  economicState: { prosperity: 'Comfortable' },
  powerStructure: { publicLegitimacy: { score: 55 }, factions: [] },
  activeConditions: [], traditions: [REC],
  ...(decrees ? { decrees } : {}),
});

/** @param {string} forkId @param {string} outcome */
const pinOp = (forkId, outcome) => ({ type: 'pin-fork', payload: { forkId, outcome } });

/** One staged registry holding a single `pin-fork`, optionally scheduled. */
const stagedPin = (/** @type {string} */ id, /** @type {Record<string, unknown>} */ op, /** @type {Record<string, unknown>} */ when) => stage(
  [], op, { id, orderedAt: NOW, ...(when ? { when } : {}) },
);

/** ONE real tick over a one-settlement realm with traditions lit. */
function tick(/** @type {unknown[]|null} */ decrees) {
  resetTrace();
  const saves = [{
    id: SID, name: 'Ashford', phase: 'canon',
    settlement: settlementOf(decrees),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  }];
  const campaign = {
    id: 'em-e4b-campaign', name: 'Fork Sites', settlementIds: [SID],
    worldState: {
      rngSeed: 'em-e4b::fork-sites', tick: 1,
      calendar: { elapsedWeeks: 30 },
      simulationRules: { traditionsEnabled: true },
      spatialLedgers: { traditions: { [SID]: [REC] } },
    },
    regionalGraph: { edges: [] },
    wizardNews: { currentTick: 1, entries: [] },
  };
  const result = /** @type {Record<string, any>} */ (simulateCampaignWorldPulse({
    campaign, saves, interval: 'one_month', now: NOW,
  }));
  const held = result?.worldState?.spatialLedgers?.traditions?.[SID]?.[0];
  return {
    outcome: held?.lastOutcome ?? null,
    heldYear: held?.lastHeldYear ?? null,
    causes: (result?.pulseRecord?.decreeCauses || []).length,
    pulseRecord: result?.pulseRecord,
    yearRoots: trace.roots.filter((root) => root.includes(YEAR_ROOT_MARK)),
  };
}

// ── THE SIEGE FIXTURE, EM-E4's own: a plausible matchup, so the deterministic feasibility
//    gate admits it and the stochastic roll is reached. The rng is a COUNTING stub, so
//    "the roll was not taken" is a measured number rather than an inference.
const siegeCapacityFor = (/** @type {string} */ id) => (id === 'target'
  ? { offensive: 30, homeDefense: 50, facets: {} }
  : { offensive: 62, homeDefense: 40, facets: {} });
function countingRng(/** @type {number} */ roll) {
  const taken = { forks: 0 };
  return { taken, rng: { fork: () => { taken.forks += 1; return { random: () => roll }; } } };
}
function siegeVerdictAt(/** @type {number} */ roll, /** @type {unknown} */ forkPins) {
  const { taken, rng } = countingRng(roll);
  const verdict = /** @type {Record<string, any>} */ (resolveSiegeVerdict({
    targetId: 'target',
    besiegers: ['besieger'],
    capacityFor: siegeCapacityFor,
    effectiveStrengthFor: () => null,
    defenderItem: { name: 'Harrowfen', settlement: {} },
    rng, tick: 4, forkPins,
  }));
  return { verdict, forks: taken.forks };
}
const SIEGE_ROLLS = Object.freeze([0.001, 0.2, 0.3, 0.45]);
/** The festival's outcomes AS THE DRAW PRODUCES THEM, over the unit interval. */
function festivalWordsDrawn() {
  const drawn = new Set();
  for (let step = 0; step <= 200; step += 1) drawn.add(outcomeForDraw(0.55, step / 200));
  return [...drawn].sort();
}

// ── U35's SIEGE AT THE LAYER RATHER THAN AT THE LEAF. A besieging city and a village
//    already under its walls, driven through `evaluateWarLayer` exactly as the pulse drives
//    it — the same fixture shape `tests/domain/warDeployment.test.js` uses for its own
//    light-record siege. The verdict is the layer's private business, so the pin's effect is
//    read from OUTSIDE as the `conquest` outcome a fallen town produces.
const WAR_NOW = '2026-01-01T00:00:00.000Z';
/** @param {string} name @param {Record<string, unknown>} patch */
const warTown = (name, patch) => ({
  name, tier: patch.tier, population: patch.population,
  config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
  institutions: [],
  economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
  powerStructure: {
    publicLegitimacy: { score: patch.legitimacy, label: 'Stable' },
    factions: patch.factions, conflicts: [],
  },
  npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
  activeConditions: [],
});
/** @param {string} id @param {string} name @param {Record<string, unknown>} patch @param {unknown[]|null} [decrees] */
const warSave = (id, name, patch, decrees = null) => ({
  id, name, phase: 'canon',
  settlement: { ...warTown(name, patch), ...(decrees ? { decrees } : {}) },
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});
/** ONE tick of the war layer over a standing siege, with the bag handed in at its door. */
function siegeAtTheLayer(/** @type {unknown} */ forkPins) {
  const saves = [
    warSave('strong', 'Ironhold', { tier: 'city', population: 45000, legitimacy: 60,
      factions: [{ faction: 'Military Council', category: 'military', power: 78, isGoverning: true }] }),
    warSave('weak', 'Thornmere', { tier: 'village', population: 280, legitimacy: 24,
      factions: [{ faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true }] }),
  ];
  const campaign = {
    id: 'em-e4b-war', name: 'Fork Sites at War', settlementIds: ['strong', 'weak'],
    worldState: {
      rngSeed: 'em-e4b::the-walls', tick: 4,
      relationshipStates: { 'edge.strong.weak': { relationshipType: 'hostile' } },
      simulationRules: { warLayerEnabled: true },
      deployments: { strong: { targetId: 'weak', sinceTick: 1, role: 'siege' } },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }],
      channels: [],
    }),
    wizardNews: { currentTick: 4, entries: [] },
  };
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
  return /** @type {Record<string, any>} */ (evaluateWarLayer({
    snapshot, worldState: snapshot.worldState, rng: createPRNG('em-e4b::the-walls'),
    tick: 5, now: WAR_NOW, rules: { warLayerEnabled: true }, forkPins,
  }));
}
/** Did the town FALL, read from outside the layer. @param {Record<string, any>} war */
const townFell = (war) => war.outcomes.some((/** @type {Record<string, unknown>} */ o) => o.candidateType === 'conquest');

// ── U71's SIEGE AT A REAL TICK. The SAME two towns and the SAME standing siege, driven
//    through `simulateCampaignWorldPulse` with the DM's pin staged on the besieger's own
//    registry — so the pin bag is the PULSE's, folded from the save's due decrees at the
//    head, and nothing here hands the war layer anything. The fall is read from outside as
//    the occupation a conquest seeds (`worldState.occupations`), which is the kernel's own
//    downstream record of a taken town and not the verdict the layer keeps to itself.
/** ONE real tick over the standing siege. @param {unknown[]|null} decrees */
function siegeAtTheTick(decrees) {
  const saves = [
    warSave('strong', 'Ironhold', { tier: 'city', population: 45000, legitimacy: 60,
      factions: [{ faction: 'Military Council', category: 'military', power: 78, isGoverning: true }] }, decrees),
    warSave('weak', 'Thornmere', { tier: 'village', population: 280, legitimacy: 24,
      factions: [{ faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true }] }),
  ];
  const campaign = {
    id: 'em-e4b-war-tick', name: 'Fork Sites at War', settlementIds: ['strong', 'weak'],
    worldState: {
      rngSeed: 'em-e4b::the-walls', tick: 4,
      relationshipStates: { 'edge.strong.weak': { relationshipType: 'hostile' } },
      simulationRules: { warLayerEnabled: true },
      deployments: { strong: { targetId: 'weak', sinceTick: 1, role: 'siege' } },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }],
      channels: [],
    }),
    wizardNews: { currentTick: 4, entries: [] },
  };
  const result = /** @type {Record<string, any>} */ (simulateCampaignWorldPulse({
    campaign, saves, interval: 'one_week', now: WAR_NOW,
  }));
  return {
    occupied: Object.keys(result?.worldState?.occupations || {}),
    causes: (result?.pulseRecord?.decreeCauses || []).length,
    tick: result?.tick,
  };
}

describe('EM-E4b — the registered fork sites consult the director\'s pins', () => {
  it('E4b-1 A STAGED PIN ON HBF-85 YIELDS THE PINNED OUTCOME AT THE TICK, AND THE YEAR ROOT IS NEVER COMPOSED', () => {
    const control = tick(null);
    expect(control.heldYear, 'the fixture stopped holding its festival — the window drifted').toBe(1);
    expect(TRADITION_FORK.outcomes.includes(String(control.outcome))).toBe(true);
    expect(control.yearRoots.length, 'the unpinned festival took no draw').toBe(1);

    const pinned = tick(stagedPin('d-festival', pinOp(TRADITION_FORK.id, TRADITION_OUTCOME.TRIUMPH)));
    expect(pinned.outcome).toBe(TRADITION_OUTCOME.TRIUMPH);
    expect(pinned.outcome, 'the pin agreed with the draw, so this arm proves nothing').not.toBe(control.outcome);
    expect(pinned.heldYear, 'the pinned festival still occurred — a pin is an outcome, not a cancellation').toBe(1);
    // ⛔ THE STREAM IS WHERE IT WAS. The draw is a thunk, so a pinned fork never reaches
    // `createPRNG` at all: the year root the festival would have composed is absent from the
    // whole tick, which is the strongest available form of "it did not advance the stream".
    expect(pinned.yearRoots).toEqual([]);
    // The decree still LANDED as a cause — the pin is applied at the head like every decree.
    expect(pinned.causes).toBe(1);
    // A SECOND word, so the arm cannot pass on a site that always answers `triumph`.
    expect(tick(stagedPin('d-festival', pinOp(TRADITION_FORK.id, TRADITION_OUTCOME.FAILURE))).outcome)
      .toBe(TRADITION_OUTCOME.FAILURE);
  });

  it('E4b-2 THE SIEGE VERDICT CONSULTS ITS PIN: the band is the pin\'s, `falls` is the band\'s, and the roll is not taken', () => {
    for (const band of SIEGE_FORK.outcomes) {
      const pinned = siegeVerdictAt(SIEGE_ROLLS[0], { [SIEGE_FORK.id]: band });
      expect(pinned.verdict.band).toBe(band);
      // ⭐ DESIGN §19 RULING 4: the pin carries the BAND and the band carries the DIRECTION,
      // so no receipt is left explaining a draw that never happened.
      expect(pinned.verdict.falls).toBe(SIEGE_VERDICT_BANDS[band]);
      expect(pinned.verdict.roll, 'a pinned verdict reported a roll').toBe(0);
      expect(pinned.forks, 'the pinned siege forked its stream').toBe(0);
      // The deterministic reads survive the pin: the gate still ran and still says so.
      expect(pinned.verdict.verdict).toBe('plausible');
      expect(pinned.verdict.pFall).toBeGreaterThan(0);
    }
    // ⛔ THE NEGATIVE CONTROL: unpinned, the same call takes its fork and answers the roll's
    // own band — this member changed nothing about the draw it stands in for.
    for (const roll of SIEGE_ROLLS) {
      const drawn = siegeVerdictAt(roll, null);
      expect(drawn.forks).toBe(1);
      expect(drawn.verdict.roll).toBe(roll);
      expect(SIEGE_FORK.outcomes.includes(drawn.verdict.band)).toBe(true);
      expect(drawn.verdict).toEqual(siegeVerdictAt(roll, undefined).verdict);
    }
    // A bag holding some OTHER fork, and a rotted non-string word, are both misses.
    expect(siegeVerdictAt(SIEGE_ROLLS[1], { [TRADITION_FORK.id]: TRADITION_OUTCOME.GOOD }).forks).toBe(1);
    expect(siegeVerdictAt(SIEGE_ROLLS[1], { [SIEGE_FORK.id]: 7 }).verdict)
      .toEqual(siegeVerdictAt(SIEGE_ROLLS[1], null).verdict);
  });

  it('E4b-3 ZERO PINS: the pulse record is byte-identical to a world with no decrees at all, and the bag is ONE shared frozen reference', () => {
    const bare = tick(null);
    // A decree scheduled for a LATER tick is due at no fork this tick, so the consult folds
    // nothing and the whole record must be the record of a world that holds no decree.
    const waiting = tick(stagedPin('d-later', pinOp(TRADITION_FORK.id, TRADITION_OUTCOME.TRIUMPH), { tick: 400 }));
    expect(waiting.causes).toBe(0);
    expect(waiting.outcome).toBe(bare.outcome);
    expect(JSON.stringify(waiting.pulseRecord)).toBe(JSON.stringify(bare.pulseRecord));
    expect(waiting.yearRoots).toEqual(bare.yearRoots);
    // ⛔ THE BY-REFERENCE LAW A BYTE GOLDEN DEPENDS ON (design §12.11): two dormant ticks
    // compose ONE frozen bag, so a world with no directive allocates nothing to compare.
    const vocabularies = { [TRADITION_FORK.id]: TRADITION_FORK.outcomes, [SIEGE_FORK.id]: SIEGE_FORK.outcomes };
    const empty = forkPinsFor(dueEntriesAtTick({ tick: 7 }, []), vocabularies);
    expect(forkPinsFor(dueEntriesAtTick({ tick: 9 }, stagedPin('d-far', pinOp(SIEGE_FORK.id, SIEGE_FORK.outcomes[0]), { tick: 400 })), vocabularies))
      .toBe(empty);
    expect(Object.isFrozen(empty)).toBe(true);
  });

  it('E4b-4 A PIN THE FORK CANNOT MEAN NEVER REACHES THE SITE: refused at the fold, and the festival draws at the tick', () => {
    const control = tick(null);
    const vocabularies = { [TRADITION_FORK.id]: TRADITION_FORK.outcomes, [SIEGE_FORK.id]: SIEGE_FORK.outcomes };
    // ⭐ A POSITIVE EQUALITY, not an absence: the site answers the DRAWN word, which is the
    // only evidence that the refused pin did not quietly become the outcome.
    const stranger = tick(stagedPin('d-stranger', pinOp(TRADITION_FORK.id, 'jubilant')));
    expect(stranger.outcome).toBe(control.outcome);
    expect(stranger.yearRoots.length, 'a refused pin suppressed the draw').toBe(1);
    expect(stranger.causes, 'the entry still landed as a cause; only the PIN was refused').toBe(1);
    // `cancelled` is the deterministic skip arm's word and is not this fork's, so a pin
    // naming it is refused for exactly the reason design §19 ruling 4 gives.
    expect(tick(stagedPin('d-cancel', pinOp(TRADITION_FORK.id, TRADITION_OUTCOME.CANCELLED))).outcome)
      .toBe(control.outcome);
    // The siege's READING words are not its pin words — EM-E4's sharpest confusion, re-run
    // here against the live catalogue this member composes.
    for (const word of SIEGE_FALL_ODDS_WORDS) {
      expect(forkPinsFor(stagedPin('d-odds', pinOp(SIEGE_FORK.id, word)), vocabularies)).toEqual({});
    }
    // And the fold admits what the fork CAN mean, so the refusals above are not vacuous.
    expect(forkPinsFor(stagedPin('d-good', pinOp(SIEGE_FORK.id, SIEGE_FORK.outcomes[0])), vocabularies))
      .toEqual({ [SIEGE_FORK.id]: SIEGE_FORK.outcomes[0] });
  });

  it('E4b-5 THE COMPOSING LINE IS ONE LINE AT THE HEAD, BEFORE THE APPLY, AND THE KERNEL\'S BANKED CEILING IS UNMOVED', () => {
    // ⛔ THE POSITION IS THE CLAIM. `isDue` is pending-only and the apply marks every entry
    // it applies, so a bag folded AFTER `applyDecreesToSaves` is empty for ever — EM-E4's
    // case E4-10 executes that half; this one holds the kernel's own source to the order.
    const fold = KERNEL.indexOf('forkPinsFor(');
    const apply = KERNEL.indexOf('applyDecreesToSaves(worldState');
    expect(fold, 'the kernel stopped folding the pin bag').toBeGreaterThan(0);
    expect(apply, 'the kernel stopped applying its decrees').toBeGreaterThan(0);
    expect(fold).toBeLessThan(apply);
    // ONE composing line: the fold, the apply and the growth chain's hand-off all live on
    // lines this file already had, which is what "zero effective lines" means here.
    const foldLine = KERNEL.slice(0, fold).split('\n').length;
    const applyLine = KERNEL.slice(0, apply).split('\n').length;
    expect(foldLine).toBe(applyLine);
    // ⛔ THE CEILING, READ FROM THE BASELINE RATHER THAN SPELLED. A second reading of the
    // number eslint and tests/lint/sizeBaseline.test.js already enforce, so this member's
    // own arm reds too if the banked file grew.
    expect(effectiveLines(KERNEL)).toBe(BASELINE[KERNEL_REL]);
  });

  it('E4b-6 EACH FORK\'S PIN WORDS ARE ITS OWN DRAW\'S, measured from the live draw rather than transcribed', () => {
    // HBF-85: the five the outcome map can answer — and `cancelled`, the deterministic skip
    // arm's word, is the one the field types and the draw never produces.
    expect([...TRADITION_FORK.outcomes].sort()).toEqual(festivalWordsDrawn());
    expect(TRADITION_FORK.outcomes.includes(TRADITION_OUTCOME.CANCELLED)).toBe(false);
    expect(Object.values(TRADITION_OUTCOME).length - TRADITION_FORK.outcomes.length).toBe(1);
    // HBF-86: the four the real roll writes, each agreeing with the verdict's own direction.
    const rolled = [...new Set(SIEGE_ROLLS.map((roll) => siegeVerdictAt(roll, null).verdict.band))].sort();
    expect([...SIEGE_FORK.outcomes].sort()).toEqual(rolled);
    for (const band of SIEGE_FORK.outcomes) expect(typeof SIEGE_VERDICT_BANDS[band]).toBe('boolean');
    // The ids are the registry's own, spelled in the file that owns each draw.
    expect([TRADITION_FORK.id, SIEGE_FORK.id]).toEqual(['HBF-85', 'HBF-86']);
    expect(Object.isFrozen(TRADITION_FORK) && Object.isFrozen(SIEGE_FORK)).toBe(true);
  });

  it('E4b-7 THE BAG RIDES THE GROWTH CHAIN\'S OWN ARGUMENT BAG, THROUGH THREE LEAVES THIS MEMBER DOES NOT OWN', () => {
    // ⭐ THE STRUCTURAL CLAIM THE KERNEL EDIT RESTS ON: density → assize → roads → traditions
    // each forward `args` BY REFERENCE, so a field added at the kernel's call arrives at the
    // traditions seam untouched. Executed through the DENSITY head the kernel actually calls.
    const settlement = settlementOf(null);
    const snapshot = {
      settlements: [{ id: SID, name: 'Ashford', settlement }],
      byId: new Map([[SID, { id: SID, name: 'Ashford', settlement }]]),
    };
    const worldState = {
      rngSeed: 'em-e4b::chain', tick: 10,
      calendar: { elapsedWeeks: 9 },
      simulationRules: { traditionsEnabled: true },
      stressors: [],
      spatialLedgers: { traditions: { [SID]: [{ ...REC, window: { startWeekOfYear: 10, weeks: 1 } }] } },
    };
    const through = (/** @type {unknown} */ forkPins) => {
      const out = /** @type {Record<string, any>} */ (
        advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssizeAndDensity({
          snapshot, worldState, settlementUpdates: [{ saveId: SID, settlement }], saves: [],
          graph: { edges: [] }, tick: 10, now: NOW, forkPins,
        }));
      return out.worldState?.spatialLedgers?.traditions?.[SID]?.[0]?.lastOutcome ?? null;
    };
    const drawn = through(undefined);
    expect(TRADITION_FORK.outcomes.includes(String(drawn))).toBe(true);
    const pinnedWord = TRADITION_FORK.outcomes.find((word) => word !== drawn);
    expect(through({ [TRADITION_FORK.id]: pinnedWord })).toBe(pinnedWord);
    expect(through({})).toBe(drawn);
  });

  it('E4b-8 HBF-86\'S LAST HOP IS WIRED END TO END (U35 + U71): a bag handed to evaluateWarLayer decides the siege band by band, AND a DECREE pins that siege at a real tick', () => {
    // ⭐ THE POSITIVE TWIN THE OLD ARM ASKED FOR. This drives the WAR LAYER, not the leaf:
    // the pin goes in at `evaluateWarLayer`'s door and the answer is read from OUTSIDE as
    // the `conquest` outcome a fallen town produces, so nothing here inspects the verdict
    // the layer keeps to itself. Every band is executed, and each one's direction is read
    // off `SIEGE_VERDICT_BANDS` rather than transcribed — the same discipline as E4b-6.
    const control = siegeAtTheLayer(null);
    expect(control.deployments.strong, 'the fixture stopped besieging — the siege drifted')
      .toMatchObject({ targetId: 'weak', role: 'siege', deploymentAge: 5 });
    expect(townFell(control), 'the unpinned siege HOLDS, so a pinned fall below is a real flip')
      .toBe(false);
    const fellByBand = {};
    for (const band of SIEGE_FORK.outcomes) {
      fellByBand[band] = townFell(siegeAtTheLayer({ [SIEGE_FORK.id]: band }));
    }
    expect(fellByBand, 'every band reached the verdict THROUGH the war head, and each answered'
      + ' with the direction its own vocabulary types for it').toEqual(SIEGE_VERDICT_BANDS);
    // ⛔ DORMANCY AT THE LAYER'S DOOR: absent, null and a bag naming ANOTHER fork are the
    // same tick, so a world with no siege directive is the world it always was.
    const bare = JSON.stringify(control);
    expect(JSON.stringify(siegeAtTheLayer(undefined))).toBe(bare);
    expect(JSON.stringify(siegeAtTheLayer({}))).toBe(bare);
    expect(JSON.stringify(siegeAtTheLayer({ [TRADITION_FORK.id]: TRADITION_OUTCOME.TRIUMPH }))).toBe(bare);
    // The two tokens, read in the source that owns them, so a refactor that keeps the
    // behaviour but drops the forward is still convicted by name.
    const warHead = readFileSync(join(ROOT, WAR_HEAD_REL), 'utf8');
    expect(warHead).toContain('const verdict = resolveSiegeVerdict({ targetId, besiegers,');
    expect(warHead).toContain('spatialSiege, forkPins });');
    expect(warHead).toContain('rules = {}, forkPins = null }');
    // ⭐ U71 — THE HALF THE OLD ARM ASKED FOR, EXECUTED. The token landed at the kernel's own
    // war call, so this is no longer a declared gap but a DECREE pinning a siege at a REAL
    // TICK: the DM stages one `pin-fork` on the besieger's registry, the pulse folds its own
    // bag at the head and threads it to the war layer, and the town falls or holds by the
    // band the DM chose. Read from OUTSIDE the layer as the occupation a conquest seeds.
    const bareTick = siegeAtTheTick(null);
    expect(bareTick.tick, 'the fixture stopped advancing — the calendar drifted').toBe(5);
    expect(bareTick.occupied, 'the unpinned siege HOLDS at a real tick, so a pinned fall is a real flip').toEqual([]);
    expect(bareTick.causes, 'the control staged no decree').toBe(0);
    /** @type {Record<string, boolean>} */
    const fellAtTheTick = {};
    for (const band of SIEGE_FORK.outcomes) {
      const pinned = siegeAtTheTick(stagedPin(`d-siege-${band}`, pinOp(SIEGE_FORK.id, band)));
      expect(pinned.causes, 'the pin landed as a cause of the tick like every decree').toBe(1);
      fellAtTheTick[band] = pinned.occupied.includes('weak');
    }
    expect(fellAtTheTick, 'a DECREE reached the siege THROUGH the pulse, and each band answered'
      + ' with the direction its own vocabulary types for it').toEqual(SIEGE_VERDICT_BANDS);
    // The kernel's own token, read in the source that owns it, so a refactor that keeps the
    // behaviour but drops the forward is still convicted by name.
    const warCall = KERNEL.indexOf('evaluateWarLayer({');
    expect(warCall).toBeGreaterThan(0);
    expect(KERNEL.slice(warCall, warCall + 240).includes('forkPins'), 'the kernel lost its'
      + ' token — a DECREE can no longer pin a siege at a real tick').toBe(true);
    expect(KERNEL).toContain('forkPins,');
  });
});

/**
 * EFFECTIVE LINES, eslint's `max-lines` reading ({ skipBlankLines: true, skipComments: true }).
 * Spelled here rather than imported because eslint offers no such export; it is a SECOND
 * reading of a number the gate already enforces twice, not the gate itself.
 * @param {string} source @returns {number}
 */
function effectiveLines(source) {
  let inBlock = false;
  let count = 0;
  for (const raw of source.split('\n')) {
    let text = raw.trim();
    if (inBlock) {
      const end = text.indexOf('*/');
      if (end === -1) continue;
      text = text.slice(end + 2).trim();
      inBlock = false;
    }
    for (;;) {
      const open = text.indexOf('/*');
      if (open === -1) break;
      const close = text.indexOf('*/', open + 2);
      if (close === -1) { text = text.slice(0, open).trim(); inBlock = true; break; }
      text = `${text.slice(0, open)} ${text.slice(close + 2)}`.trim();
    }
    if (text.startsWith('//')) text = '';
    if (text !== '') count += 1;
  }
  return count;
}
