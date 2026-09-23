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
 * ⛔ WHAT THIS SUITE DOES NOT CLAIM, STATED SO NOBODY READS IT AS COVERAGE. HBF-86's LAST
 * HOP IS NOT WIRED. `resolveSiegeVerdict`'s own consult is landed and executed here, but the
 * only production caller that could hand it a bag is `evaluateWarLayer` in
 * `src/domain/worldPulse/warDeployment.js` — a file this member does not own at this wave —
 * which neither destructures the bag nor forwards it into the sixteen arguments it spells by
 * name. Case E4b-8 asserts that gap positively so it cannot be mistaken for coverage, and
 * reds the day the two tokens land, which is when its positive twin should replace it.
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

  it('E4b-8 DECLARED, NOT CLAIMED: HBF-86\'s last hop belongs to warDeployment.js, so nothing here asserts a pinned siege at the tick', () => {
    // ⛔ A DECLARED GAP IS ASSERTED, NEVER DESCRIBED — a narrowing that only lives in prose
    // is how a narrowing becomes a quiet retreat. The siege's consult is landed and E4b-2
    // executes it; what is missing is the ONE production caller handing it the bag, and that
    // caller is owned by nobody at this wave. When the two tokens land, THIS arm reds and its
    // author replaces it with the positive twin — which is the point of spelling it this way.
    const warHead = readFileSync(join(ROOT, WAR_HEAD_REL), 'utf8');
    expect(warHead, 'the war head gained the bag — replace this arm with a pinned-siege tick').not.toContain('forkPins'); // anchored: the same file is asserted below to still hold the call this arm is about
    expect(warHead).toContain('const verdict = resolveSiegeVerdict({ targetId, besiegers,');
    // The kernel does NOT hand the bag to the war layer either, because an argument no
    // callee reads is a line that lies; the cure is two tokens in the war head, not one here.
    const warCall = KERNEL.indexOf('evaluateWarLayer({');
    expect(warCall).toBeGreaterThan(0);
    expect(KERNEL.slice(warCall, warCall + 240).includes('forkPins')).toBe(false);
    // …and the half that IS wired is asserted in the same breath, so this arm can never be
    // read as "the consult does not work".
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
