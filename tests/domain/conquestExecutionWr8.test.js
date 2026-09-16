/**
 * conquestExecutionWr8.test.js — WR-8 amendment N, CONQUEST EXECUTION.
 *
 * THE VOLUME'S HARDEST PIN IS THE NEGATIVE ONE, and it is the reason this file
 * exists: "a CLEARLY WINNING side that is not overwhelming must still have to
 * negotiate. Conquest is the rare ending, not the default one." A gate that only
 * ever proved the positive case — overwhelming victor takes everything — would
 * be exactly the loose gate the amendment names as the failure mode, and would
 * make the whole negotiation system built in C through L decoration.
 *
 * So the shape of this file is deliberate. Every gate assertion is written as a
 * PAIR on one fixture: the same occupier, the same held town, the same ticks,
 * differing only in the margin — and the clearly-winning half must be barred
 * from the rungs the overwhelming half reaches. A single-sided pin here would
 * certify nothing.
 *
 * THE OTHER TWO CLAIMS:
 *   OCCUPATION IS NOT ANNEXATION. The ladder's top rung is the client state, and
 *   under this doctrine it is reachable only through the gate. The rungs below
 *   are still earned the ordinary way — this closes the top, it does not hand
 *   anybody a rung.
 *
 *   THE INHERITANCE COUNTERFORCE. "A realm that conquers a dying neighbour has
 *   annexed a famine." Proved on two empires identical in every way except the
 *   granaries of what they hold: the one holding starving towns draws LESS
 *   tribute and pays MORE garrison, and the receipt says so in words.
 *
 * And the dormancy fence, non-vacuously: the same fixture run dark and lit, with
 * the dark side asserted byte-identical to a run of the module with the wiring
 * unreachable, and the lit side asserted to genuinely differ.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';

import {
  CONQUEST_EXECUTION_TUNING,
  CONQUEST_LADDER,
  CONQUEST_MARGIN_BANDS,
  conquestCeilingRank,
  conquestMarginVerdict,
  inheritanceBenefitFactor,
  inheritanceBurdenAddend,
  inheritedHunger,
} from '../../src/domain/worldPulse/conquestExecution.js';
import {
  OCCUPATION_TUNING,
  evaluateOccupations,
} from '../../src/domain/worldPulse/occupation.js';
import { deriveMilitaryCapacity } from '../../src/domain/worldPulse/militaryStrength.js';
import { CONQUEST_REQUIRED_RULES } from '../../src/domain/worldPulse/conquestDoctrineStage.js';

const LIT_RULES = Object.freeze(Object.fromEntries(
  CONQUEST_REQUIRED_RULES.map((key) => [key, true]),
));
// The dormancy control is ONE flag: the war layer still runs, the occupation
// layer still runs, and only WR-8's own gate is dark.
const DARK_RULES = Object.freeze(Object.fromEntries(
  CONQUEST_REQUIRED_RULES.filter((k) => k !== 'conquestDoctrineEnabled').map((key) => [key, true]),
));

// ─────────────────────────────────────────────────────────────────────────────
// THE LEAF.
// ─────────────────────────────────────────────────────────────────────────────

describe('WR-8 N — the overwhelming gate, as a closed banded read', () => {
  test('THE VOCABULARY IS CLOSED and the two ladders have not drifted apart', () => {
    // The leaf re-declares the occupation ladder rather than importing it (it
    // must not acquire a reach it does not need). That is only safe if a pin
    // owns the agreement, so this is that pin.
    expect(CONQUEST_LADDER).toEqual(OCCUPATION_TUNING.STATE_LADDER);
    expect(CONQUEST_MARGIN_BANDS).toEqual(['unknown', 'contested', 'clearly_winning', 'overwhelming']);
    // The ceilings the tuning names must be real rungs, or the cap is a no-op.
    expect(CONQUEST_LADDER).toContain(CONQUEST_EXECUTION_TUNING.CAPPED_CEILING);
    expect(CONQUEST_LADDER).toContain(CONQUEST_EXECUTION_TUNING.OPEN_CEILING);
    // …and the gate must actually be a gate: the capped ceiling strictly below
    // the open one. Equal ceilings would pass every other pin in this file.
    expect(CONQUEST_LADDER.indexOf(CONQUEST_EXECUTION_TUNING.CAPPED_CEILING))
      .toBeLessThan(CONQUEST_LADDER.indexOf(CONQUEST_EXECUTION_TUNING.OPEN_CEILING));
  });

  test('⭐⭐ THE GATE IS REACHABLE — the pin the first draft of this gate failed', () => {
    // THIS IS THE PIN THIS FILE EXISTS FOR AS MUCH AS THE NEGATIVE CASE. The gate
    // was first written as a capacity RATIO of 3, which reads like exactly the
    // steepness the amendment demands and is STRUCTURALLY UNREACHABLE: the
    // capacity model is compressed with a high floor, and the largest ratio
    // expressible anywhere in it is 1.50 (a metropolis of a million over a hamlet
    // of one). A gate nothing can enter is as dead as a leg that is a constant,
    // and it would have shipped looking strict.
    //
    // So the reachability of BOTH open bands is asserted from REAL settlements
    // run through the REAL capacity model, not from hand-picked numbers.
    const capacityOf = (population, tier) => deriveMilitaryCapacity(
      town('probe', { population, tier }), { economicCapacityScore: 60 },
    ).theoreticalCapacity;
    const bandFor = (a, b) => conquestMarginVerdict({
      occupierCapacity: capacityOf(...a), occupiedCapacity: capacityOf(...b),
    }).band;
    // A great city over a hamlet: genuinely overwhelming, and REACHED.
    expect(bandFor([30000, 'city'], [40, 'hamlet'])).toBe('overwhelming');
    // A great city over a small town: clearly winning, and REACHED.
    expect(bandFor([30000, 'city'], [40, 'town'])).toBe('clearly_winning');
    // A great city over a large town: neither. Winning wars are not conquests.
    expect(bandFor([30000, 'city'], [12000, 'town'])).toBe('contested');
    // Two peers: nothing at all.
    expect(bandFor([12000, 'town'], [9000, 'town'])).toBe('contested');

    // …and the structural fact itself, so a future hand that reaches for a ratio
    // again is stopped by an executed measurement rather than by a comment.
    const widest = capacityOf(1000000, 'metropolis') / capacityOf(1, 'hamlet');
    expect(widest).toBeLessThan(2);
  });

  test('⭐ THE NEGATIVE CASE: clearly winning is NOT overwhelming', () => {
    const T = CONQUEST_EXECUTION_TUNING;
    // A victor a clear stretch above the defender. By any ordinary reading this
    // war is won. The amendment says it still ends at a table.
    const clearly = conquestMarginVerdict({
      occupierCapacity: 60, occupiedCapacity: 52,
      occupierName: 'Ironhold', occupiedName: 'Thornwall',
    });
    expect(clearly.band).toBe('clearly_winning');
    expect(clearly.overwhelming).toBe(false);
    expect(clearly.ceiling).toBe(T.CAPPED_CEILING);
    expect(clearly.receipt).toContain('plainly winning is not overwhelming');
    expect(clearly.receipt).toContain('ends at a table');

    // The SAME victor, the defender ground down past the gate. Now, and only now.
    const overwhelming = conquestMarginVerdict({
      occupierCapacity: 60, occupiedCapacity: 44,
      occupierName: 'Ironhold', occupiedName: 'Thornwall',
    });
    expect(overwhelming.band).toBe('overwhelming');
    expect(overwhelming.overwhelming).toBe(true);
    expect(overwhelming.ceiling).toBe(T.OPEN_CEILING);
  });

  test('the band boundary is exactly where the tuning says, on both sides', () => {
    const T = CONQUEST_EXECUTION_TUNING;
    const at = (gap) => conquestMarginVerdict({ occupierCapacity: 50 + gap, occupiedCapacity: 50 }).band;
    // AT the gap is inside the band; a hair below is not. A gate whose boundary
    // is off by an epsilon is a gate nobody has actually measured.
    expect(at(T.OVERWHELMING_GAP)).toBe('overwhelming');
    expect(at(T.OVERWHELMING_GAP - 0.01)).toBe('clearly_winning');
    expect(at(T.CLEARLY_WINNING_GAP)).toBe('clearly_winning');
    expect(at(T.CLEARLY_WINNING_GAP - 0.01)).toBe('contested');
    expect(at(0)).toBe('contested');
    // A DEFENDER STRONGER THAN ITS OCCUPIER is not winning anything: a negative
    // gap must stay contested rather than wrapping into a band.
    expect(at(-20)).toBe('contested');
  });

  test('SILENCE CAPS THE LADDER: an unmeasured margin is not an overwhelming one', () => {
    for (const input of [
      {},
      { occupierCapacity: 0, occupiedCapacity: 10 },
      { occupierCapacity: NaN, occupiedCapacity: 10 },
      { occupierCapacity: 60, occupiedCapacity: null },
      { occupierCapacity: 60, occupiedCapacity: -3 },
    ]) {
      const verdict = conquestMarginVerdict(input);
      expect(verdict.band, JSON.stringify(input)).toBe('unknown');
      expect(verdict.overwhelming, JSON.stringify(input)).toBe(false);
      expect(verdict.ceiling, JSON.stringify(input)).toBe(CONQUEST_EXECUTION_TUNING.CAPPED_CEILING);
      expect(verdict.gap, JSON.stringify(input)).toBeNull();
    }
    // …and the strict direction is a live selection, not a function that always
    // says unknown: the control immediately below opens the ladder.
    expect(conquestMarginVerdict({ occupierCapacity: 60, occupiedCapacity: 10 }).overwhelming).toBe(true);
  });

  test('a ruin is overwhelmed, and every gap serializes as a finite number', () => {
    const verdict = conquestMarginVerdict({
      occupierCapacity: 40, occupiedCapacity: 0, occupiedName: 'Ash',
    });
    expect(verdict.overwhelming).toBe(true);
    expect(verdict.gap).toBe(40);
    // The gap instrument has no divide, so no reading can ever produce an
    // Infinity for a downstream writer to serialize. Asserted, not assumed.
    expect(Number.isFinite(Number(verdict.gap))).toBe(true);
    expect(JSON.stringify(verdict)).not.toContain('null');
  });

  test('the ceiling rank is a real rung index, and garbage caps rather than opens', () => {
    const capped = CONQUEST_LADDER.indexOf(CONQUEST_EXECUTION_TUNING.CAPPED_CEILING);
    expect(conquestCeilingRank(conquestMarginVerdict({ occupierCapacity: 60, occupiedCapacity: 10 })))
      .toBe(CONQUEST_LADDER.indexOf(CONQUEST_EXECUTION_TUNING.OPEN_CEILING));
    expect(conquestCeilingRank({ ceiling: 'not_a_rung' })).toBe(capped);
    expect(conquestCeilingRank(null)).toBe(capped);
    expect(conquestCeilingRank(undefined)).toBe(capped);
  });
});

describe('WR-8 N — the inheritance counterforce', () => {
  test('the deficit is summed over what is held, and unmeasurable holds cost nothing', () => {
    const full = inheritedHunger([{ storageMonths: 12, capacityMonths: 12 }]);
    expect(full.hunger).toBe(0);
    expect(full.measured).toBe(1);

    const starving = inheritedHunger([
      { storageMonths: 0, capacityMonths: 12 },
      { storageMonths: 6, capacityMonths: 12 },
    ]);
    expect(starving.hunger).toBeCloseTo(1.5, 4);
    expect(starving.receipt).toContain('feeds 2 settlements it did not feed before');

    // A famine you cannot measure is not one the victor may be charged for.
    const unknown = inheritedHunger([
      { storageMonths: 0, capacityMonths: 0 },
      { storageMonths: undefined, capacityMonths: 12 },
      { storageMonths: 0, capacityMonths: 12 },
    ]);
    expect(unknown.unmeasured).toBe(2);
    expect(unknown.hunger).toBe(1);
    expect(inheritedHunger([]).receipt).toContain('nothing the victor holds');
    expect(inheritedHunger(null).hunger).toBe(0);
  });

  test('IT IS UNCAPPED BY COUNT — the tenth dying town is not free', () => {
    // The whole point of the brake: it must be able to outgrow the prize. A
    // count-capped counterforce would make a large enough conquest costless.
    const three = inheritedHunger(Array.from({ length: 3 }, () => ({ storageMonths: 0, capacityMonths: 10 })));
    const ten = inheritedHunger(Array.from({ length: 10 }, () => ({ storageMonths: 0, capacityMonths: 10 })));
    expect(three.hunger).toBe(3);
    expect(ten.hunger).toBe(10);
    expect(inheritanceBurdenAddend(ten.hunger)).toBeGreaterThan(inheritanceBurdenAddend(three.hunger));
    expect(inheritanceBenefitFactor(ten.hunger)).toBeLessThan(inheritanceBenefitFactor(three.hunger));
  });

  test('a well-fed empire is EXACTLY unchanged — factor 1, addend 0', () => {
    // The dormancy shape of the counterforce itself: at zero hunger both terms
    // are their identities exactly, so no float drifts anywhere.
    expect(inheritanceBenefitFactor(0)).toBe(1);
    expect(inheritanceBenefitFactor(-1)).toBe(1);
    expect(inheritanceBenefitFactor(NaN)).toBe(1);
    expect(inheritanceBurdenAddend(0)).toBe(0);
    expect(inheritanceBurdenAddend(NaN)).toBe(0);
    // …and it genuinely bites above zero, so the identities are not the whole
    // function.
    expect(inheritanceBenefitFactor(1)).toBe(0.5);
    expect(inheritanceBenefitFactor(1)).toBeLessThan(1);
    expect(inheritanceBurdenAddend(1)).toBeGreaterThan(0);
  });

  test('the benefit factor is monotone and never reaches zero', () => {
    let previous = inheritanceBenefitFactor(0);
    for (const hunger of [0.25, 0.5, 1, 2, 4, 8, 40]) {
      const factor = inheritanceBenefitFactor(hunger);
      expect(factor, `hunger ${hunger}`).toBeLessThan(previous);
      // A starving province still pays SOMETHING. Zero would make holding it
      // free, which is the opposite of a counterforce.
      expect(factor, `hunger ${hunger}`).toBeGreaterThan(0);
      previous = factor;
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// THE MOUTH — the same laws observed through `evaluateOccupations`, which is
// where they actually change a world.
// ─────────────────────────────────────────────────────────────────────────────

/** A settlement item whose military capacity and granary are both dialled. */
function town(id, { population, storageMonths = 12, tier = 'town' } = {}) {
  return {
    id,
    name: id,
    settlement: {
      name: id,
      tier,
      population,
      economicState: { foodSecurity: { storageMonths, resilienceScore: 60 } },
      powerStructure: { factions: [], publicLegitimacy: { score: 40 } },
      activeConditions: [],
      config: {},
    },
    causal: { scores: { economic_capacity: 60 } },
    activeConditions: [],
  };
}

/**
 * One tick of the occupation layer over a ledger the caller supplies, with the
 * occupier's and occupied's sizes chosen to land the margin where the test wants
 * it. `held` maps occupiedId → its granary fill.
 */
function runOccupations({ rules, occupierPopulation, occupied, priorState = 'stabilized', tick = 40 }) {
  const items = [town('ironhold', { population: occupierPopulation, tier: 'city' })];
  /** @type {Record<string, any>} */
  const occupations = {};
  for (const [id, spec] of Object.entries(occupied)) {
    items.push(town(id, { population: spec.population, storageMonths: spec.storageMonths, tier: spec.tier }));
    occupations[id] = {
      occupierId: 'ironhold',
      state: priorState,
      sinceTick: 1,
      // A matured dwell so the ladder ARGUES upward this tick — the cap has to
      // stop a real advance, not an advance that was never going to happen.
      stateHeld: OCCUPATION_TUNING.STATE_HOLD_TICKS,
      resistance: 0,
      benefitYield: 0,
      lastTick: tick - 1,
    };
  }
  const snapshot = {
    settlements: items,
    byId: new Map(items.map((row) => [row.id, row])),
    // The occupier<->occupied edges are REQUIRED: the vassalization outcome
    // relabels a real edge and is skipped where none exists, so a fixture
    // without them would show "no client state" for the wrong reason entirely.
    regionalGraph: {
      edges: Object.keys(occupied).map((id) => ({
        id: `ironhold|${id}`, from: 'ironhold', to: id, relationshipType: 'hostile',
      })),
      channels: [],
    },
    worldState: {},
  };
  const worldState = { simulationRules: rules, occupations, tick };
  snapshot.worldState = worldState;
  return evaluateOccupations({
    snapshot,
    worldState,
    graph: snapshot.regionalGraph,
    deployments: { ironhold: { targetId: Object.keys(occupied)[0] } },
    warOutcomes: [],
    returnOutcomes: [],
    tick,
    rules,
  });
}

describe('WR-8 N — THE GATE AT THE MOUTH: occupation is not annexation', () => {
  // Two empires identical but for the size of what they hold. `thornwall` is a
  // real town (the clearly-winning case); `ash` is a hamlet (overwhelming).
  // Calibrated against the REAL capacity model, not guessed: a great city over a
  // small town is a gap of ~8 (clearly winning); over a hamlet it is ~15
  // (overwhelming). Both sides of the gate are therefore real settlements a
  // generated world can actually contain.
  const CLEARLY = { thornwall: { population: 40, tier: 'town' } };
  const OVERWHELMING = { ash: { population: 40, tier: 'hamlet' } };

  test('⭐⭐ THE NEGATIVE CASE THROUGH THE LIVE LAYER: winning is not annexing', () => {
    const capped = runOccupations({ rules: LIT_RULES, occupierPopulation: 30000, occupied: CLEARLY });
    const open = runOccupations({ rules: LIT_RULES, occupierPopulation: 30000, occupied: OVERWHELMING });
    // Same occupier, same prior rung, same matured dwell, same tick. The ONLY
    // difference is the margin, and the ladder answers differently.
    expect(capped.occupations.thornwall.state).toBe(CONQUEST_EXECUTION_TUNING.CAPPED_CEILING);
    expect(open.occupations.ash.state).toBe('vassalized');
    // The client-state outcome fires for one and not the other, which is the
    // world-visible consequence rather than a ledger field nobody reads.
    const vassalizations = (result) => result.outcomes.filter((o) => o?.candidateType === 'occupation_vassalized');
    expect(vassalizations(capped)).toHaveLength(0);
    expect(vassalizations(open).length).toBeGreaterThan(0);
  });

  test('the capped hold banks NO dwell it can never spend', () => {
    const capped = runOccupations({ rules: LIT_RULES, occupierPopulation: 30000, occupied: CLEARLY });
    // Left un-reset, a capped occupation would grind an ever-growing advance
    // pressure against a ceiling it cannot pass, and the day the margin moved it
    // would leap two rungs at once.
    expect(capped.occupations.thornwall.stateHeld).toBe(0);
  });

  test('the cap CLOSES THE TOP and hands nobody a rung it has not earned', () => {
    // An overwhelming margin does not promote a `contested` occupation to a
    // client state — it only stops capping. The dwell/hysteresis still rules.
    const fresh = runOccupations({
      rules: LIT_RULES, occupierPopulation: 30000, occupied: OVERWHELMING, priorState: 'contested',
    });
    expect(fresh.occupations.ash.state).not.toBe('vassalized');
    expect(OCCUPATION_TUNING.STATE_LADDER.indexOf(fresh.occupations.ash.state))
      .toBeLessThanOrEqual(OCCUPATION_TUNING.STATE_LADDER.indexOf('unstable'));
  });

  test('DARK: the very same clearly-winning hold annexes, exactly as before WR-8', () => {
    // THE DORMANCY FENCE, AND ITS ANTI-VACUITY IN ONE ASSERTION. The fixture that
    // is capped above is NOT capped here, on the same numbers with one flag
    // removed — so the cap is WR-8's doing and nothing else's, and the dark path
    // is the pre-wire path.
    const dark = runOccupations({ rules: DARK_RULES, occupierPopulation: 30000, occupied: CLEARLY });
    expect(dark.occupations.thornwall.state).toBe('vassalized');
    expect(dark.outcomes.some((o) => o?.candidateType === 'occupation_vassalized')).toBe(true);
  });
});

describe('WR-8 N — THE COUNTERFORCE AT THE MOUTH: annexing a famine', () => {
  // Two empires holding the SAME settlements at the SAME rung. The only
  // difference in the entire fixture is how full the granaries are.
  const FED = {
    ash: { population: 40, tier: 'hamlet', storageMonths: 12 },
    briar: { population: 40, tier: 'hamlet', storageMonths: 12 },
  };
  const STARVING = {
    ash: { population: 40, tier: 'hamlet', storageMonths: 0 },
    briar: { population: 40, tier: 'hamlet', storageMonths: 0 },
  };

  const spoilsOf = (result) => result.outcomes.find((o) => o?.candidateType === 'war_spoils');
  const burdenOf = (result) => result.outcomes.find((o) => o?.candidateType === 'occupation_burden');

  test('⭐ the victor that took dying towns draws LESS and pays MORE', () => {
    const fed = runOccupations({ rules: LIT_RULES, occupierPopulation: 30000, occupied: FED });
    const famine = runOccupations({ rules: LIT_RULES, occupierPopulation: 30000, occupied: STARVING });

    // The prize shrinks…
    expect(spoilsOf(fed)).toBeTruthy();
    expect(spoilsOf(famine).severity).toBeLessThan(spoilsOf(fed).severity);
    // …and the bill grows. Both directions, or the counterforce is half a rule.
    expect(burdenOf(famine).severity).toBeGreaterThan(burdenOf(fed).severity);

    // ⚠️ THE TWO ASSERTIONS ABOVE ARE NOT ENOUGH, AND MUTATION IS HOW THAT WAS
    // LEARNED: deleting the benefit net-down entirely left the "draws LESS" half
    // GREEN, because the pre-existing usefulness coupling already makes a
    // starving hold worth less to extract from. Comparing famine to FED measures
    // that old coupling, not this amendment. The isolating comparison is famine
    // against ITSELF with the one flag removed — the only pair in which nothing
    // but WR-8's term can differ.
    const darkFamine = runOccupations({ rules: DARK_RULES, occupierPopulation: 30000, occupied: STARVING });
    expect(spoilsOf(famine).severity).toBeLessThan(spoilsOf(darkFamine).severity);
    expect(burdenOf(famine).severity).toBeGreaterThan(burdenOf(darkFamine).severity);
  });

  test('THE RECEIPT SAYS IT IN WORDS, on both surfaces', () => {
    const famine = runOccupations({ rules: LIT_RULES, occupierPopulation: 30000, occupied: STARVING });
    expect(burdenOf(famine).reasons.join(' ')).toContain('Inherited hunger');
    expect(JSON.stringify(burdenOf(famine).condition.causes)).toContain('annexed a famine');
    expect(spoilsOf(famine).reasons.join(' ')).toContain('Netted down by inherited hunger');
    // A well-fed empire is not told it has annexed a famine.
    const fed = runOccupations({ rules: LIT_RULES, occupierPopulation: 30000, occupied: FED });
    expect(burdenOf(fed).reasons.join(' ')).not.toContain('Inherited hunger');
    expect(spoilsOf(fed).reasons.join(' ')).not.toContain('Netted down');
  });

  test('DARK: the counterforce is absent, and what remains is the PRE-EXISTING coupling', () => {
    // ⚠️ A MEASURED CORRECTION TO THIS PIN'S FIRST DRAFT, kept because the
    // correction is the interesting part. It first asserted that dark, a starving
    // empire and a fed one draw IDENTICALLY — i.e. that the granaries are
    // invisible to this layer without WR-8. THAT IS FALSE, and the fixture said
    // so: `occupiedUsefulness` runs `deriveMilitaryCapacity`, which already folds
    // food into the capacity it scores, so a starving hold was ALREADY worth less
    // to extract from before this amendment (0.3462 against 0.3890 here). The
    // counterforce is therefore an EXPLICIT, RECEIPTED term ON TOP of a quiet
    // pre-existing coupling, not the first time food ever reached this layer, and
    // a pin claiming otherwise would have been asserting a false mechanism.
    const darkFed = runOccupations({ rules: DARK_RULES, occupierPopulation: 30000, occupied: FED });
    const darkFamine = runOccupations({ rules: DARK_RULES, occupierPopulation: 30000, occupied: STARVING });
    expect(spoilsOf(darkFamine).severity).toBeLessThan(spoilsOf(darkFed).severity);
    // What IS absent dark is WR-8's own term, on both surfaces.
    expect(burdenOf(darkFamine).reasons.join(' ')).not.toContain('Inherited hunger');
    expect(spoilsOf(darkFamine).reasons.join(' ')).not.toContain('Netted down');
    expect(burdenOf(darkFamine).severity).toBe(burdenOf(darkFed).severity);

    // AND THE FENCE IS NON-VACUOUS IN THE DIRECTION THAT MATTERS: lighting the
    // one flag on the SAME starving fixture nets the tribute down further and
    // raises the bill, so the amendment adds real force rather than re-describing
    // the coupling that was already there.
    const litFamine = runOccupations({ rules: LIT_RULES, occupierPopulation: 30000, occupied: STARVING });
    expect(spoilsOf(litFamine).severity).toBeLessThan(spoilsOf(darkFamine).severity);
    expect(burdenOf(litFamine).severity).toBeGreaterThan(burdenOf(darkFamine).severity);
    // …and a FED empire's bill is untouched by lighting the flag, which is what
    // "exactly 1 and exactly 0 at zero hunger" has to mean at the mouth.
    const litFed = runOccupations({ rules: LIT_RULES, occupierPopulation: 30000, occupied: FED });
    expect(burdenOf(litFed).severity).toBe(burdenOf(darkFed).severity);
    expect(spoilsOf(litFed).severity).toBe(spoilsOf(darkFed).severity);
  });
});
