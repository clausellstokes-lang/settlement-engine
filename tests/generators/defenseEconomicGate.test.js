/**
 * tests/generators/defenseEconomicGate.test.js — defense scores respect the
 * actual economy.
 *
 * The user-reported bug: "even in struggling economies, the economic survival
 * for defense was still high." The economic dimension was an additive stack of
 * wealth-independent bonuses (storage months + market/hospital/route flats)
 * with econOutput weighted at only ×0.2 — a destitute crossroads town with a
 * granary+mill+market scored ~70 ("Strong economic base"). Pins:
 *   • a struggling economy gates economic survival DOWN (multiplicative);
 *   • a healthy economy (econOutput >= 50) is left alone by the gate;
 *   • famine now also degrades MONSTER defense (starving militias patrol less);
 *   • magical defense respects the crime/economy-degraded magic influence
 *     (the previously dead magInfluence parameter).
 *
 * ⭐ RE-KEYED BY IDENTITY TO THE LABEL (COHERENCE-UPKEEP-4, the chair's ruling P1 of 2026-11-12).
 * The upkeep gates read the prosperity LABEL now, through the one home (`keepOf`,
 * `fundedGate`: COHERENCE-UPKEEP 07ebe8bdc, ruling 3, B), no longer the economy's output, and
 * the pipeline hands the profile `keepOf(economicState.prosperity)`
 * (`assembleSettlement.js`). So each fixture that drove a gate through `priorityEconomy` now
 * carries the label its economy stands for, over the SAME buildings: Struggling where it was
 * struggling or destitute, Prosperous where it was healthy, the ladder Struggling, Poor,
 * Moderate, Comfortable where it climbed 10, 30, 50, 80. Each is profiled the way the pipeline
 * profiles it (`profile`). Each pin keeps its claim; the output still feeds the economic
 * score's capacity term, so each slider stays as it was.
 */

import { describe, expect, test } from 'vitest';
import { generateDefenseProfile, defencePartsOf } from '../../src/generators/defenseGenerator.js';
import { computeEffectiveMagicPresence } from '../../src/generators/priorityHelpers.js';
import { buildThreatAssessment } from '../../src/domain/display/threatAssessment.js';
import { deriveDefenseReadiness } from '../../src/domain/display/defenseDisplay.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { keepOf } from '../../src/domain/facts/keep.js';

/** The profile as the pipeline makes it: what the place can keep up, from its label (`assembleSettlement.js`). @param {any} s */
const profile = (s) => generateDefenseProfile(s, keepOf(s.economicState?.prosperity));
// Re-keyed by identity at COHERENCE-UPKEEP-6 (the chair's ruling 2: the parts are NOT stored): the two pins that
// read the parts read them from the one function that computes them from the record, at the same keep.
const partsOf = (s) => defencePartsOf(s, keepOf(s.economicState?.prosperity));

function town({
  priorityEconomy = 50,
  priorityCriminal = 20,
  priorityMagic = 0,
  priorityReligion = 30,
  stressTypes = [],
  magicExists = false,
  institutions,
  tradeRouteAccess = 'crossroads',
  terrainType = 'plains',
  prosperity,
} = {}) {
  return {
    name: 'Gatewatch',
    tier: 'town',
    population: 2400,
    config: {
      tradeRouteAccess,
      terrainType,
      monsterThreat: 'frontier',
      magicExists,
      priorityEconomy,
      priorityMilitary: 40,
      priorityCriminal,
      priorityReligion,
      priorityMagic,
      stressTypes,
    },
    institutions: institutions || [
      { name: 'Granary' },
      { name: 'Grist Mill' },
      { name: 'Market Square' },
      { name: 'Town Watch' },
    ],
    economicState: {
      ...(prosperity ? { prosperity } : {}),
      foodSecurity: { storageMonths: 6.25, deficitPct: 0, surplusPct: 5, importDependency: 0.2, resilienceScore: 70 },
    },
  };
}

// A funded defense apparatus — walls, garrison, charter hall, court — so the
// upkeep gates have a paid stack to bite into.
const FUNDED_DEFENSES = [
  { name: 'Town walls' },
  { name: 'Garrison' },
  { name: "Adventurers' charter hall" },
  { name: 'Courthouse' },
  { name: 'Town Watch' },
  { name: 'Granary' },
  { name: 'Market Square' },
];

/** The economy's climb, each step with the label it stands for. @type {Array<[number, string]>} */
const LADDER = [[10, 'Struggling'], [30, 'Poor'], [50, 'Moderate'], [80, 'Comfortable']];

describe('economic survival respects the actual economy', () => {
  test('a struggling economy no longer earns the strong economic verdict off its buildings', () => {
    const poor = profile(town({ priorityEconomy: 15, prosperity: 'Struggling' }));
    expect(poor.scores.economic).toBeLessThanOrEqual(55);
    const assessment = buildThreatAssessment(poor);
    const economicLine = JSON.stringify(assessment);
    // 'Economic Survival' is the anchor: it is the label of the very dimension
    // whose verdict is under test, so an assessment that stopped emitting that
    // dimension reds here instead of passing the exclusion vacuously.
    expectAbsentWithAnchor(
      // Re-keyed by identity (W2 DEF fourth seat, 2026-11-07): the strong verdict now reads "Money enough to ride
      // out a long crisis" (the owner's style law); the negative follows the words.
      economicLine, 'Money enough to ride out a long crisis', 'Economic Survival',
      'a struggling economy never earns the strong-base verdict',
    );
  });

  // ⭐ RE-KEYED BY IDENTITY (COHERENCE-UPKEEP-5, V3, one cause: limit 1, "what sustains a force counts for no
  // more than the force"). This town's one force is a watch, so after the limit its supply score reads the
  // watch, rich or poor alike (57 against 44). The claim is about what the economy PAYS for, so it is read
  // where pay acts: the supply score of the SUSTAINS parts before the limit (their listed points × the
  // number of scores), with the same margins (76 against 60).
  test('a healthy economy with identical buildings scores meaningfully higher', () => {
    /** @param {any} d */
    const supplyBeforeTheLimit = (d) => Math.round(d.filter((x) => x.group === 'SUSTAINS').reduce((a, x) => a + x.points, 0) * 4);
    // Re-keyed by identity (UPKEEP-CAPACITY C1, a house counts by its rung): the market this test was written for
    // counts at today's points, so the town keeps a one-rung market house (the catalogue's Fish market) in the
    // Market Square's stead; a market square is the least rung of its ladder and counts 0.8 of the market's weights.
    // ⭐ RE-KEYED BY IDENTITY (UPKEEP-15, the chair's ruling (b) of 2026-11-14): the fixture's identity is "a market
    // house that counts at today's points". The cause: the off-ladder rule (UPKEEP-13's P3, bb0aaa3fe: a house on no
    // ladder of a laddered job counts at the least rung the catalogue offers at its size) places the Fish market at the
    // market's least rung (factor 0.8), so it no longer counts at today's points. The catalogue reads "Merchant guilds
    // (15-40)" at factor 1 (rung 2 of 3); it stands on the city's shelf, and no market house of the town's shelf reads
    // at factor 1 (each reads 0.8 or 0.93), so it is taken: of the scaled parts it opens the market alone. The
    // threshold is unchanged. The Fish market's own case is stated by the arm below.
    const SAME_BUILDINGS = [{ name: 'Granary' }, { name: 'Grist Mill' }, { name: 'Merchant guilds (15-40)' }, { name: 'Town Watch' }];
    const poor = partsOf(town({ priorityEconomy: 15, prosperity: 'Struggling', institutions: SAME_BUILDINGS }));
    const rich = partsOf(town({ priorityEconomy: 80, prosperity: 'Prosperous', institutions: SAME_BUILDINGS }));
    expect(poor.some((x) => x.id === 'sustainsHeld'), 'anchored: the limit binds this town').toBe(true);
    expect(rich.find((x) => x.id === 'market')?.full, 'anchored: the market house counts at today\'s points').toBe(2.5);
    expect(supplyBeforeTheLimit(rich)).toBeGreaterThan(supplyBeforeTheLimit(poor) + 15);
    expect(supplyBeforeTheLimit(rich)).toBeGreaterThanOrEqual(60);
  });

  test('the Fish market, placed at the least rung, still lets the healthy economy score higher, by the measured margin (UPKEEP-15)', () => {
    // The case that moved, not hidden (the chair's ruling (b)): the off-ladder rule places the Fish market at the
    // market's least rung (factor 0.8: 2 points full, against the market's 2.5 at today's points), and the healthy
    // economy still scores higher than the poor one, by the margin measured at UPKEEP-15: 74 against 59, the
    // market's points 2 and 1.2.
    /** @param {any} d */
    const supplyBeforeTheLimit = (d) => Math.round(d.filter((x) => x.group === 'SUSTAINS').reduce((a, x) => a + x.points, 0) * 4);
    const FISH = [{ name: 'Granary' }, { name: 'Grist Mill' }, { name: 'Fish market' }, { name: 'Town Watch' }];
    const poor = partsOf(town({ priorityEconomy: 15, prosperity: 'Struggling', institutions: FISH }));
    const rich = partsOf(town({ priorityEconomy: 80, prosperity: 'Prosperous', institutions: FISH }));
    expect(rich.find((x) => x.id === 'market')?.full).toBe(2);
    expect(rich.find((x) => x.id === 'market')?.points).toBe(2);
    expect(poor.find((x) => x.id === 'market')?.points).toBe(1.2);
    expect(supplyBeforeTheLimit(rich)).toBe(74);
    expect(supplyBeforeTheLimit(poor)).toBe(59);
    expect(supplyBeforeTheLimit(rich)).toBeGreaterThan(supplyBeforeTheLimit(poor));
  });

  test('the gate scales monotonically with economy priority', () => {
    const scores = LADDER.map(([priorityEconomy, prosperity]) =>
      profile(town({ priorityEconomy, prosperity })).scores.economic);
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i - 1]);
    }
  });

  test('only a maritime port receives the sea-supply resilience bonus', () => {
    const institutions = [{ name: 'Granary' }];
    const riverPort = generateDefenseProfile(town({
      institutions,
      tradeRouteAccess: 'port',
      terrainType: 'riverside',
    }));
    const coastalPort = generateDefenseProfile(town({
      institutions,
      tradeRouteAccess: 'port',
      terrainType: 'coastal',
    }));

    expect(coastalPort.scores.economic).toBeGreaterThan(
      riverPort.scores.economic,
    );
  });
});

describe('famine degrades monster defense', () => {
  // ⭐ RE-KEYED BY IDENTITY (COHERENCE-UPKEEP-5, V3, one cause: a crisis takes from the parts it touches). The
  // default town's one force is a watch, which patrols no bandit road (no monster points), so a famine has
  // no patrol to cut; the claim is about a town that patrols, so it is read on the funded apparatus.
  test('a starving town patrols its bandit roads less', () => {
    const fed = generateDefenseProfile(town({ institutions: FUNDED_DEFENSES }));
    const starving = generateDefenseProfile(town({ stressTypes: ['famine'], institutions: FUNDED_DEFENSES }));
    expect(starving.scores.monster).toBeLessThan(fed.scores.monster);
  });
});

describe('garrison wages, watch pay, and patrol provisioning respect the economy', () => {
  test('a struggling economy fields weaker military / internal / monster coverage than a healthy one', () => {
    const poor = profile(town({ priorityEconomy: 10, prosperity: 'Struggling', institutions: FUNDED_DEFENSES }));
    const rich = profile(town({ priorityEconomy: 80, prosperity: 'Prosperous', institutions: FUNDED_DEFENSES }));
    expect(poor.scores.military).toBeLessThan(rich.scores.military);
    expect(poor.scores.internal).toBeLessThan(rich.scores.internal);
    expect(poor.scores.monster).toBeLessThan(rich.scores.monster);
  });

  test('every dimension scales monotonically with economy priority', () => {
    const profiles = LADDER.map(([priorityEconomy, prosperity]) =>
      profile(town({ priorityEconomy, prosperity, institutions: FUNDED_DEFENSES })));
    for (const dim of ['military', 'internal', 'monster']) {
      for (let i = 1; i < profiles.length; i++) {
        expect(profiles[i].scores[dim]).toBeGreaterThanOrEqual(profiles[i - 1].scores[dim]);
      }
    }
  });

  test('the upkeep gates report their multipliers for attribution', () => {
    const poor = profile(town({ priorityEconomy: 10, prosperity: 'Struggling', institutions: FUNDED_DEFENSES }));
    const rich = profile(town({ priorityEconomy: 80, prosperity: 'Prosperous', institutions: FUNDED_DEFENSES }));
    expect(poor.economicGates.military).toBeLessThan(1);
    expect(poor.economicGates.internal).toBeLessThan(1);
    expect(poor.economicGates.monster).toBeLessThan(1);
    expect(rich.economicGates.military).toBe(1);
    expect(rich.economicGates.internal).toBe(1);
    expect(rich.economicGates.monster).toBe(1);
  });

  test('gates floor, never zero: a destitute walled town keeps most of its defenses', () => {
    const destitute = profile(town({ priorityEconomy: 0, prosperity: 'Struggling', institutions: FUNDED_DEFENSES }));
    const funded = profile(town({ priorityEconomy: 80, prosperity: 'Prosperous', institutions: FUNDED_DEFENSES }));
    // Floors are 0.6 (military) / 0.65 (internal) / 0.7 (monster); built walls
    // keep standing — scores degrade, they do not collapse.
    expect(destitute.scores.military).toBeGreaterThan(funded.scores.military * 0.4);
    expect(destitute.scores.monster).toBeGreaterThan(funded.scores.monster * 0.5);
  });

  test("a destitute thorp's unpaid community defense is not gated away", () => {
    const thorp = profile({
      name: 'Mudfoot', tier: 'thorp', population: 40,
      config: {
        tradeRouteAccess: 'isolated', monsterThreat: 'frontier', magicExists: false,
        priorityEconomy: 5, priorityMilitary: 20, priorityCriminal: 5,
        priorityReligion: 20, priorityMagic: 0, stressTypes: [],
      },
      institutions: [{ name: 'Wayside shrine' }],
      economicState: { prosperity: 'Struggling', foodSecurity: { storageMonths: 1.5, deficitPct: 0, surplusPct: 0, importDependency: 0 } },
    });
    // Community self-policing and armed households are unpaid: the economy
    // gate must not strip a subsistence thorp of its baseline order.
    expect(thorp.scores.internal).toBeGreaterThanOrEqual(15);
  });

  test('gates are recorded only when they actually apply: no paid stack, no gate', () => {
    // A destitute hamlet with no paid defenses and no law infrastructure must
    // not report economicGates.military/internal — those gates never bit, so
    // attributing "garrison pay at 60%" to it would be a lie.
    const hamlet = profile({
      name: 'Dripwell', tier: 'hamlet', population: 180,
      config: {
        tradeRouteAccess: 'isolated', monsterThreat: 'frontier', magicExists: false,
        priorityEconomy: 5, priorityMilitary: 20, priorityCriminal: 5,
        priorityReligion: 20, priorityMagic: 0, stressTypes: [],
      },
      institutions: [{ name: 'Wayside shrine' }],
      economicState: { prosperity: 'Struggling', foodSecurity: { storageMonths: 1.5, deficitPct: 0, surplusPct: 0, importDependency: 0 } },
    });
    expect(hamlet.economicGates.military).toBeUndefined();
    expect(hamlet.economicGates.internal).toBeUndefined();
    // monster/economic apply to every settlement and stay recorded.
    expect(hamlet.economicGates.monster).toBeLessThan(1);
    expect(hamlet.economicGates.economic).toBeLessThan(1);
  });

  test('the monster gate exempts the unpaid communal baseline and volunteer traditions', () => {
    const mk = (priorityEconomy, institutions) => profile({
      name: 'Thornhollow', tier: 'village', population: 600,
      config: {
        tradeRouteAccess: 'road', monsterThreat: 'frontier', magicExists: true,
        priorityEconomy, priorityMilitary: 20, priorityCriminal: 5,
        priorityReligion: 20, priorityMagic: 30, stressTypes: [],
      },
      institutions,
      economicState: { prosperity: priorityEconomy < 50 ? 'Struggling' : 'Prosperous', foodSecurity: { storageMonths: 2, deficitPct: 0, surplusPct: 0, importDependency: 0 } },
    });
    // Frontier baseline (+4) and druidic wardens (+12) are unpaid — a poor
    // village with no paid monster coverage keeps exactly what a rich one
    // has, the same exemption rule the military/internal gates apply.
    expect(mk(5, [{ name: 'Druid circle' }]).scores.monster)
      .toBe(mk(80, [{ name: 'Druid circle' }]).scores.monster);
    // With a paid charter hall on retainer, the gate bites the paid share.
    expect(mk(5, [{ name: 'Druid circle' }, { name: "Adventurers' charter hall" }]).scores.monster)
      .toBeLessThan(mk(80, [{ name: 'Druid circle' }, { name: "Adventurers' charter hall" }]).scores.monster);
  });
});

describe('the gates have a consumer: readiness rows carry funding notes', () => {
  const withProfile = (opts) => {
    const settlement = town(opts);
    return { ...settlement, defenseProfile: profile(settlement) };
  };

  test('an underfunded gate annotates its row; fully funded rows stay silent', () => {
    const poorRows = deriveDefenseReadiness(withProfile({ priorityEconomy: 10, prosperity: 'Struggling', institutions: FUNDED_DEFENSES }));
    expect(poorRows.find(r => r.label === 'Invasion & War').fundingNote).toMatch(/defence upkeep for .+ at \d+%/);
    expect(poorRows.find(r => r.label === 'Internal Security').fundingNote).toMatch(/watch and court funding at \d+%/);
    const richRows = deriveDefenseReadiness(withProfile({ priorityEconomy: 80, prosperity: 'Prosperous', institutions: FUNDED_DEFENSES }));
    expect(richRows.every(r => r.fundingNote === null)).toBe(true);
  });
});

describe('disaster & famine readiness is gated by economic capacity', () => {
  test('relief costs money: a poor town absorbs disasters worse than a rich one with the same granary', () => {
    const poor = profile(town({ priorityEconomy: 10, prosperity: 'Struggling' }));
    const rich = profile(town({ priorityEconomy: 80, prosperity: 'Prosperous' }));
    expect(poor.scores.disaster).toBeLessThan(rich.scores.disaster);
    // Identity at healthy economies: the rich town's disaster score IS its
    // food-resilience score, untouched.
    expect(rich.scores.disaster).toBe(70);
    expect(poor.economicGates.disaster).toBeLessThan(1);
  });

  test('disaster score is absent when no food security exists (legacy saves)', () => {
    const noFood = generateDefenseProfile({ ...town({}), economicState: {} });
    expect(noFood.scores.disaster).toBeUndefined();
  });
});

describe('magical defense respects degraded magic influence', () => {
  const arcaneInstitutions = [
    { name: 'Granary' },
    { name: 'Market Square' },
    { name: "Mages' Guild" },
    { name: 'Arcane Academy' },
  ];

  // ⭐ RE-KEYED BY IDENTITY (COHERENCE-UPKEEP-5, R5 and count once): magic keeps 0.45 + 0.55 × funded from the
  // ONE label, and crime counts once, in Crime. The destitute city is the one whose label is Struggling.
  test('a crime-ridden destitute city fields weaker arcane defenses than a healthy one', () => {
    const healthy = profile(town({
      magicExists: true, priorityMagic: 70, priorityEconomy: 70, priorityCriminal: 10,
      institutions: arcaneInstitutions, prosperity: 'Prosperous',
    }));
    const rotten = profile(town({
      magicExists: true, priorityMagic: 70, priorityEconomy: 10, priorityCriminal: 85,
      institutions: arcaneInstitutions, prosperity: 'Struggling',
    }));
    expect(healthy.scores.magical).toBeGreaterThan(0);
    expect(rotten.scores.magical).toBeLessThan(healthy.scores.magical);
  });

  test('a healthy settlement is not taxed by the health gate (identity, not slider-ratio)', () => {
    // The gate divides degraded influence by the UNGATED presence score, so a
    // prosperous low-crime town multiplies by ~1.0. The old slider divisor
    // (presence score is well below the raw slider) shaved ~30% off healthy
    // settlements and double-counted weak presence.
    const cfg = { magicExists: true, priorityMagic: 70, priorityEconomy: 70, priorityCriminal: 10 };
    const healthyTown = town({ ...cfg, institutions: arcaneInstitutions });
    // ⭐ RE-KEYED BY IDENTITY, BACK (COHERENCE-UPKEEP-7, the chair's ruling W1: reading A withdrawn): the presence
    // reads the WHOLE roster again, the Mages' Guild included; the magic presence is the whole of the Magical
    // Capability score, and the guild feeds that score through no second part.
    const presence = computeEffectiveMagicPresence(arcaneInstitutions, {
      magicExists: true, priorityMagic: 70, nearbyResources: [],
    });
    // ⭐ RE-KEYED BY IDENTITY (COHERENCE-UPKEEP-5, V3): the magic PART keeps all of itself at full funding (the
    // identity), and it is the presence alone: the guild stands as its own part, never added again (count
    // once, so no +8). The score is then held by limit 1 (this town fields no force), a separate rule.
    const magic = defencePartsOf(healthyTown, keepOf(undefined)).find((x) => x.id === 'magic');
    expect(magic.full).toBe(Math.round((presence.score / 5) * 10) / 10);
    expect(magic.points).toBe(magic.full);
  });
});

describe('stacking famine mitigation never worsens the penalty', () => {
  // Druid wardens alone reduce the famine penalties to -8 econ / -5 mil.
  // Divine (Create Food and Water) CAPS at -12 / -6 — layering it on top of
  // druids must keep the druid numbers, not raise them back up.
  const FAITHFUL_GROVE = [
    { name: 'Granary' },
    { name: 'Market Square' },
    { name: 'Town Watch' },
    { name: 'Druid Circle' },
    { name: 'Parish Church' },
  ];
  const faminePenalties = ({ priorityReligion }) => {
    const mk = (stressTypes) => generateDefenseProfile(town({
      magicExists: true, priorityMagic: 40, priorityReligion,
      institutions: FAITHFUL_GROVE, stressTypes,
    })).scores;
    const fed = mk([]);
    const starving = mk(['famine']);
    return { econ: fed.economic - starving.economic, mil: fed.military - starving.military };
  };
  /** The famine's own toll on the parts, in whole tenths: the sum of every part's famine crisis line. */
  const famineToll = ({ priorityReligion }) => defencePartsOf(town({
    magicExists: true, priorityMagic: 40, priorityReligion,
    institutions: FAITHFUL_GROVE, stressTypes: ['famine'],
  }), keepOf(undefined)).reduce((a, x) => a + Math.round((x.crisis?.famine || 0) * 10), 0);

  test('divine + druid famine mitigation is at least as good as druid alone', () => {
    const druidOnly = faminePenalties({ priorityReligion: 30 }); // parish present, relPri too low for divine
    const druidAndDivine = faminePenalties({ priorityReligion: 70 });
    expect(druidAndDivine.econ).toBeLessThanOrEqual(druidOnly.econ);
    expect(druidAndDivine.mil).toBeLessThanOrEqual(druidOnly.mil);
    // Divine caps at -12/-6, above the druid -8/-5 floor: layering it changes
    // nothing, so the two profiles lose exactly the same amount to famine.
    // ⭐ RE-KEYED BY IDENTITY (UPKEEP-15, the chair's ruling (a) of 2026-11-14): the economic claim is read on
    // the famine's own toll, the parts' crisis lines, EXACTLY equal (no tolerance). The cause: the build reads
    // each score at hundredths before the whole point (UPKEEP-MEASURE-2 X9), over limit 1 held score by score
    // (P2), so a score is a fraction before it prints: the famine takes the same 27.33 economic points from
    // both places, and the difference of two printed scores (60 - 32 against 76 - 49) rounds that one toll to
    // 28 and to 27. The difference of two printed figures no longer carries the claim; the toll does.
    expect(famineToll({ priorityReligion: 70 })).toBe(famineToll({ priorityReligion: 30 }));
    expect(famineToll({ priorityReligion: 30 }), 'anchored: the famine takes something').toBeLessThan(0);
    expect(druidAndDivine.mil).toBe(druidOnly.mil);
  });

  test('every printed score with the divine added is at least the printed score without it, fed and starving (UPKEEP-15)', () => {
    // The owner's rule is about the figures the page PRINTS (the chair's ruling (a)): the divine added to the
    // druid never lowers a whole-point score or readiness, in either fixture.
    const read = (priorityReligion, stressTypes) => {
      const p = generateDefenseProfile(town({
        magicExists: true, priorityMagic: 40, priorityReligion, institutions: FAITHFUL_GROVE, stressTypes,
      }));
      return { ...Object.fromEntries(['military', 'monster', 'internal', 'economic', 'magical'].map((k) => [k, p.scores[k]])), readiness: p.readiness.score };
    };
    const fell = [[], ['famine']].flatMap((stressTypes) => {
      const without = read(30, stressTypes);
      const withDivine = read(70, stressTypes);
      return Object.keys(without).filter((k) => withDivine[k] < without[k]).map((k) => `${stressTypes.join() || 'fed'} ${k}: ${without[k]} -> ${withDivine[k]}`);
    });
    expect(fell).toEqual([]);
  });
});

describe('garrison chain import credit (chainHealthy respects provisioning)', () => {
  // A connected town's garrison chain that is vulnerable ONLY because its
  // upstream provisioning chain is missing still earns the +5 military credit —
  // the garrison is supplied by imports. An isolated settlement, or a chain
  // with a genuine LOCAL impairment (trade dependency / active substitute),
  // keeps the -5 penalty.
  const withChains = (s, activeChains, tradeRouteAccess) => {
    const out = { ...s, economicState: { ...s.economicState, activeChains } };
    if (tradeRouteAccess) out.config = { ...s.config, tradeRouteAccess };
    return out;
  };
  const GARRISON_INSTITUTIONS = [
    { name: 'Granary' }, { name: 'Market Square' }, { name: 'Town Watch' }, { name: 'Garrison' },
  ];
  const base = () => town({ institutions: GARRISON_INSTITUTIONS });

  test('upstream-missing-but-importable garrison chain earns the credit instead of the penalty', () => {
    const importable = generateDefenseProfile(withChains(base(), [
      { chainId: 'garrison', status: 'vulnerable', upstreamMissing: ['food_processing'] },
    ]));
    const noChain = generateDefenseProfile(withChains(base(), []));
    // Credit (+5), not penalty (-5): strictly above the chainless baseline.
    expect(importable.scores.military).toBe(noChain.scores.military + 5);
  });

  test('an ISOLATED settlement with the same missing upstream keeps the penalty', () => {
    const isolatedVulnerable = generateDefenseProfile(withChains(base(), [
      { chainId: 'garrison', status: 'vulnerable', upstreamMissing: ['food_processing'] },
    ], 'isolated'));
    const isolatedNoChain = generateDefenseProfile(withChains(base(), [], 'isolated'));
    expect(isolatedVulnerable.scores.military).toBe(isolatedNoChain.scores.military - 5);
  });

  test('a genuine local impairment (trade dependency) is never credited', () => {
    const locallyImpaired = generateDefenseProfile(withChains(base(), [
      { chainId: 'garrison', status: 'vulnerable', upstreamMissing: ['food_processing'], dependency: { institution: 'Grain factor' } },
    ]));
    const noChain = generateDefenseProfile(withChains(base(), []));
    expect(locallyImpaired.scores.military).toBe(noChain.scores.military - 5);
  });
});
