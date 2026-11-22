/**
 * magicSubstitution.test.js — W-K slice K4, the channel half
 * (docs/DESIGN_MAGIC_ECONOMY.md §6; §12's substitution test list: "conservation pin,
 * cap enforcement, dependency-metric emission").
 *
 * The claims, each with the anchor that makes it non-trivial:
 *
 *   THE CHANNEL IS A TERM IN THE EXISTING FOOD ARCHITECTURE, not a bypass. Pinned by
 *       running the REAL advanceFoodStockpile and composing its own effective deficit
 *       through substitutedDeficitPct: the anchor is that the food model produced a
 *       non-zero deficit first, so the composition is acting on live arithmetic
 *       rather than on a literal this test invented.
 *   THE CAP BAND HOLDS across the whole cross product of regime, practitioner
 *       capacity and reagent supply. The anchor is that the same sweep proves the
 *       share REACHES the cap at full capacity, so a cap that held only because
 *       nothing ever approached it would fail.
 *   THE CONSERVATION PIN (§6's anti-exemption proof): remove the magic source and the
 *       deficit reappears, to the digit. The anchor is that the fed world's deficit
 *       is strictly lower first, so the restored number is a restoration and not a
 *       coincidence.
 *   THE DEPENDENCY METRIC emits, bands, and is ENEMY-TARGETABLE: the targets it names
 *       are the very institutions whose removal collapses the share to nothing, which
 *       is executed here rather than asserted.
 *   DORMANCY: flag absent means null, by every path.
 */
import { describe, it, expect } from 'vitest';
import {
  MAGIC_DEPENDENCY_BANDS,
  MAGIC_REGIME_LADDER,
  MAGIC_REGIME_LEDGER,
  MAGIC_SUBSTITUTION_TUNING,
  deriveMagicSubstitution,
  magicDependencyBand,
  magicDependencySentence,
  magicSubstitutionActive,
  practitionerCapacity,
  practitionerRungWeight,
  readMagicRegime,
  substitutedDeficitPct,
  substitutedImportDependency,
  substitutionCapFor,
} from '../../src/domain/worldPulse/magicSubstitution.js';
import {
  BASE_MAGIC_REGIME,
  MAGIC_REGIMES,
  MAGIC_REGIME_LEDGER as K2_MAGIC_REGIME_LEDGER,
} from '../../src/domain/worldPulse/magicRegimeModel.js';
import { advanceFoodStockpile } from '../../src/domain/worldPulse/foodStockpile.js';
import {
  deriveInstitutionStatus,
  institutionStatusRef,
} from '../../src/domain/worldPulse/institutionStatusModel.js';

const LIT = { magicEconomyEnabled: true };

/** A guild that can carry a city. Category 'Magic' is the estate's own spelling. */
const guild = (extra = {}) => ({
  id: 'institution.mages_guild', name: "Mages' guild", category: 'Magic', status: 'active', ...extra,
});
const tower = (extra = {}) => ({
  id: 'institution.wizards_tower', name: "Wizard's tower", category: 'Magic', status: 'active', ...extra,
});
/** A mundane house, to prove the roster read is not counting everything. */
const granary = () => ({ id: 'institution.granary', name: 'Town granary', category: 'Economy', status: 'active' });

/**
 * A settlement with a REAL food ledger in the shape foodGenerator persists, so
 * advanceFoodStockpile runs its true arithmetic over it.
 */
const hungryCity = (institutions = [guild(), granary()]) => ({
  id: 's1',
  name: 'Vashad',
  tier: 'city',
  institutions,
  economicState: {
    primaryImports: ['Arcane reagents'],
    primaryExports: ['Magical item market'],
    foodSecurity: {
      dailyNeed: 20000,
      dailyProduction: 8000,
      // A deficit deep enough that the substitution ceiling (30 points of need)
      // cannot swallow it whole: the composition pin has to be able to see the
      // subtraction, not just the floor.
      deficitPct: 60,
      surplusPct: 0,
      storageMonths: 0.4,
      importDependency: 0.3,
      resilienceScore: 40,
    },
  },
});

const worldWith = (regime, rules = LIT) => ({
  simulationRules: rules,
  spatialLedgers: { [MAGIC_REGIME_LEDGER]: { s1: { regime, band: 'mid', sinceTick: 3 } } },
});

describe('K4 the substitution channel: the closed vocabularies', () => {
  it('the regime ladder and the dependency bands are the closed §3a/§6 lists', () => {
    expect(MAGIC_REGIME_LADDER).toEqual(['subsistence', 'funded', 'patronized', 'industrial']);
    expect(MAGIC_DEPENDENCY_BANDS).toEqual(['none', 'slight', 'marked', 'severe']);
    expect(Object.isFrozen(MAGIC_REGIME_LADDER)).toBe(true);
  });

  it('the cap band is exactly zero below the top regimes, and total over the ladder', () => {
    expect(substitutionCapFor('subsistence')).toBe(0);
    expect(substitutionCapFor('funded')).toBe(0);
    expect(substitutionCapFor('patronized')).toBeGreaterThan(0);
    expect(substitutionCapFor('industrial')).toBeGreaterThan(substitutionCapFor('patronized'));
    // An unknown regime is NON-substituting rather than silently mid-band.
    expect(substitutionCapFor('archmagical')).toBe(0);
    expect(substitutionCapFor(null)).toBe(0);
    for (const regime of MAGIC_REGIME_LADDER) {
      expect(Number.isFinite(substitutionCapFor(regime))).toBe(true);
    }
  });

  it('the industrial ceiling is anchored to the estate\'s own verdict on magical carriage', () => {
    // FOOD_IMPORT_RATES.teleport is 0.30: what a circle can move is what magic can
    // carry. A foundry that beat the circle would be the first quiet exemption.
    expect(MAGIC_SUBSTITUTION_TUNING.CAP_BY_REGIME.industrial).toBe(0.3);
  });

  it('the regime reader is K2\'s accessor, and an absent record is K2\'s BASE rung', () => {
    expect(readMagicRegime(worldWith('industrial'), 's1')).toBe('industrial');
    // K2 stores NOTHING for a subsistence settlement, so absent means base rather
    // than missing. The two readings are behaviourally identical here only because
    // the base rung's cap is zero, which the cap pin above states independently.
    expect(readMagicRegime({}, 's1')).toBe(BASE_MAGIC_REGIME);
    expect(readMagicRegime({ spatialLedgers: { [MAGIC_REGIME_LEDGER]: {} } }, 's1'))
      .toBe(BASE_MAGIC_REGIME);
    // A word outside the closed ladder is non-substituting, never silently mid-band.
    expect(readMagicRegime({
      spatialLedgers: { [MAGIC_REGIME_LEDGER]: { s1: { regime: 'archmagical' } } },
    }, 's1')).toBe(BASE_MAGIC_REGIME);
    // A NON-RECORD is K2's rule, not K4's: readMagicRegimeRecord answers null for
    // anything that is not an object, so a bare string never reaches the ladder test.
    expect(readMagicRegime({
      spatialLedgers: { [MAGIC_REGIME_LEDGER]: { s1: 'patronized' } },
    }, 's1')).toBe(BASE_MAGIC_REGIME);
  });

  it('the ladder and the ledger key are K2\'s, by identity, so neither can fork', () => {
    expect(MAGIC_REGIME_LADDER).toBe(MAGIC_REGIMES);
    expect(MAGIC_REGIME_LEDGER).toBe(K2_MAGIC_REGIME_LEDGER);
  });
});

describe('K4 practitioner capacity: the roster half', () => {
  it('counts only magic institutions, through the estate\'s own magic predicate', () => {
    expect(practitionerRungWeight(guild())).toBeGreaterThan(0);
    expect(practitionerRungWeight(granary())).toBe(0);
    // An 'arcane' tag is the second half of historyGenerator's spelling.
    expect(practitionerRungWeight({ name: 'The Whispering Arch', tags: ['arcane'] })).toBeGreaterThan(0);
  });

  it('a ruined house feeds nobody: the roster read goes through the ruin filter', () => {
    const standing = practitionerCapacity(hungryCity([guild()]), worldWith('industrial'), 's1');
    const ruined = practitionerCapacity(
      hungryCity([guild({ status: 'ruined', _worldPulseInactive: true })]), worldWith('industrial'), 's1');
    // ANCHOR: the standing case is non-zero, so the ruined zero is a filter firing
    // rather than a fixture that never had a practitioner in it.
    expect(standing.capacity01).toBeGreaterThan(0);
    expect(ruined.capacity01).toBe(0);
  });

  it('an IMPAIRED house counts at its impaired capacity: the fast layer reaches the table', () => {
    const world = {
      ...worldWith('industrial'),
      spatialLedgers: {
        ...worldWith('industrial').spatialLedgers,
        institutionStatus: {
          s1: {
            // The ledger is keyed by the K1 REF (a stablePart slug), never by the raw
            // roster id. Spelling the raw id here is exactly the mistake that would
            // make this pin vacuous: the record would never be found and the
            // "impaired" case would silently be the healthy case.
            [institutionStatusRef(guild())]: {
              impairments: {
                supply_shortage: { cause: 'supply_shortage', causeRef: 'reagent:s1', sinceTick: 2 },
              },
            },
          },
        },
      },
    };
    const healthy = practitionerCapacity(hungryCity([guild()]), worldWith('industrial'), 's1');
    const impaired = practitionerCapacity(hungryCity([guild()]), world, 's1');
    expect(healthy.capacity01).toBeGreaterThan(impaired.capacity01);
    expect(impaired.capacity01).toBeGreaterThan(0);
    // And the K1 verdict this is reading really does say `impaired`, so the coupling
    // is to the status system rather than to a number that happens to be smaller.
    const verdict = deriveInstitutionStatus({
      institution: guild(),
      record: {
        impairments: {
          supply_shortage: { cause: 'supply_shortage', causeRef: 'reagent:s1', sinceTick: 2 },
        },
      },
    });
    expect(verdict.status).toBe('impaired');
  });

  it('a SHELL counts exactly zero: an unfunded guild is dark', () => {
    const shelled = guild({ status: 'remnant', _worldPulseEconomyClosed: true });
    // liveInstitutions excludes a remnant outright, which is the stronger statement:
    // the shell never even reaches the capacity sum.
    expect(practitionerCapacity(hungryCity([shelled]), worldWith('industrial'), 's1').capacity01).toBe(0);
  });
});

describe('K4 THE CAP BAND HOLDS (§6: share CAP-BANDED)', () => {
  it('no composition of regime, capacity and supply carries more than the band', () => {
    const rosters = [[tower()], [guild()], [guild(), tower()], [guild(), tower(), granary()]];
    const supplies = [0.1, 0.25, 0.5, 0.85, 1];
    let reachedCap = 0;
    let sawSubstitution = 0;
    for (const regime of MAGIC_REGIME_LADDER) {
      const cap = substitutionCapFor(regime);
      for (const institutions of rosters) {
        for (const reagentSupply01 of supplies) {
          const result = deriveMagicSubstitution({
            settlement: hungryCity(institutions),
            worldState: worldWith(regime),
            cid: 's1',
            reagentSupply01,
          });
          if (cap <= 0) {
            expect(result).toBe(null);
            continue;
          }
          if (!result) continue;
          sawSubstitution += 1;
          expect(result.share).toBeLessThanOrEqual(cap);
          expect(result.capShare).toBe(cap);
          if (result.share === cap) reachedCap += 1;
        }
      }
    }
    // ANCHOR: the sweep both EXERCISED the channel and REACHED the ceiling, so the
    // cap did not hold merely because nothing ever approached it.
    expect(sawSubstitution).toBeGreaterThan(0);
    expect(reachedCap).toBeGreaterThan(0);
  });

  it('the two factors are multiplicative, so neither can lift the share past the cap', () => {
    const full = deriveMagicSubstitution({
      settlement: hungryCity([guild(), tower()]),
      worldState: worldWith('industrial'),
      cid: 's1',
      reagentSupply01: 1,
    });
    const halfSupplied = deriveMagicSubstitution({
      settlement: hungryCity([guild(), tower()]),
      worldState: worldWith('industrial'),
      cid: 's1',
      reagentSupply01: 0.5,
    });
    expect(full.share).toBe(full.capShare);
    expect(halfSupplied.share).toBeCloseTo(full.capShare * 0.5, 6);
  });
});

describe('K4 THE CHANNEL IS A TERM IN THE EXISTING FOOD ARCHITECTURE (§6)', () => {
  it('composes onto advanceFoodStockpile\'s OWN effective deficit, in its own units and band', () => {
    const stocked = advanceFoodStockpile(hungryCity(), { interval: 'one_month', tick: 5 });
    const base = stocked.summary.effectiveDeficitPct;
    // ANCHOR: the real food model produced a live, non-zero deficit, so what follows
    // is a composition onto working arithmetic rather than onto a literal.
    expect(base).toBeGreaterThan(0);

    const substitution = deriveMagicSubstitution({
      settlement: hungryCity(),
      worldState: worldWith('industrial'),
      cid: 's1',
      reagentSupply01: 1,
    });
    const fed = substitutedDeficitPct(base, substitution);
    expect(fed).toBeLessThan(base);
    expect(fed).toBeCloseTo(base - substitution.pctOfNeed, 5);
    // The channel stays inside the band the food model itself clamps to, so it can
    // never produce a number that architecture would not have produced.
    expect(fed).toBeGreaterThanOrEqual(MAGIC_SUBSTITUTION_TUNING.DEFICIT_FLOOR_PCT);
    expect(fed).toBeLessThanOrEqual(MAGIC_SUBSTITUTION_TUNING.DEFICIT_CEILING_PCT);
  });

  it('a channel bigger than the deficit floors at zero rather than minting surplus', () => {
    const substitution = deriveMagicSubstitution({
      settlement: hungryCity([guild(), tower()]),
      worldState: worldWith('industrial'),
      cid: 's1',
      reagentSupply01: 1,
    });
    expect(substitutedDeficitPct(2, substitution)).toBe(0);
  });

  it('THE SUPPLY HALF: the same one share relieves the import dependency (§6 food AND supply)', () => {
    const settlement = hungryCity();
    const bare = substitutedImportDependency(settlement, null);
    const substitution = deriveMagicSubstitution({
      settlement, worldState: worldWith('industrial'), cid: 's1', reagentSupply01: 1,
    });
    const relieved = substitutedImportDependency(settlement, substitution);
    expect(bare).toBeCloseTo(0.3, 6);
    expect(relieved).toBeLessThan(bare);
    expect(relieved).toBeCloseTo(bare * (1 - substitution.share), 5);
  });
});

describe('K4 THE CONSERVATION PIN (§6: the anti-exemption proof)', () => {
  it('remove the magic source and the deficit honestly reappears, to the digit', () => {
    const stocked = advanceFoodStockpile(hungryCity(), { interval: 'one_month', tick: 5 });
    const base = stocked.summary.effectiveDeficitPct;

    const fedSubstitution = deriveMagicSubstitution({
      settlement: hungryCity([guild(), tower(), granary()]),
      worldState: worldWith('industrial'),
      cid: 's1',
      reagentSupply01: 1,
    });
    const fed = substitutedDeficitPct(base, fedSubstitution);
    // ANCHOR: the fed world really was better off, so the restoration below is a
    // restoration rather than two equal numbers that never differed.
    expect(fed).toBeLessThan(base);

    // THE SOURCE IS REMOVED. Not the flag, not the regime: the practitioners.
    const starvedOfCasters = deriveMagicSubstitution({
      settlement: hungryCity([granary()]),
      worldState: worldWith('industrial'),
      cid: 's1',
      reagentSupply01: 1,
    });
    expect(starvedOfCasters).toBe(null);
    expect(substitutedDeficitPct(base, starvedOfCasters)).toBe(base);

    // And the same holds when the MATERIAL is removed instead of the people, which
    // is the shape a reagent interdiction takes.
    const starvedOfReagents = deriveMagicSubstitution({
      settlement: hungryCity([guild(), tower(), granary()]),
      worldState: worldWith('industrial'),
      cid: 's1',
      reagentSupply01: 0,
    });
    expect(starvedOfReagents).toBe(null);
    expect(substitutedDeficitPct(base, starvedOfReagents)).toBe(base);
  });

  it('substitution shifts WHAT moves, never whether things move: the base is never mutated', () => {
    const settlement = hungryCity();
    const before = JSON.stringify(settlement);
    const substitution = deriveMagicSubstitution({
      settlement, worldState: worldWith('industrial'), cid: 's1', reagentSupply01: 1,
    });
    substitutedDeficitPct(41.5, substitution);
    substitutedImportDependency(settlement, substitution);
    expect(JSON.stringify(settlement)).toBe(before);
    // The identity that makes the conservation pin possible at all, over a spread of
    // bases rather than one lucky number.
    for (const base of [0, 0.4, 7, 19.5, 44, 95]) {
      expect(substitutedDeficitPct(base, null)).toBe(Math.round(base * 10) / 10);
    }
  });
});

describe('K4 THE DEPENDENCY METRIC (§6: a named, enemy-targetable fragility)', () => {
  it('bands the share, and `none` is never narrated', () => {
    expect(magicDependencyBand(0)).toBe('none');
    expect(magicDependencyBand(0.001)).toBe('none');
    expect(magicDependencyBand(0.05)).toBe('slight');
    expect(magicDependencyBand(0.15)).toBe('marked');
    expect(magicDependencyBand(0.3)).toBe('severe');
    for (const share of [0, 0.001, 0.05, 0.15, 0.3, 1]) {
      expect(MAGIC_DEPENDENCY_BANDS).toContain(magicDependencyBand(share));
    }
  });

  it('emits the sources carrying it and the targets that end it', () => {
    const substitution = deriveMagicSubstitution({
      settlement: hungryCity([guild(), tower(), granary()]),
      worldState: worldWith('industrial'),
      cid: 's1',
      reagentSupply01: 1,
    });
    expect(substitution.dependency.band).toBe('severe');
    // The sources speak the K1 REF vocabulary, which is what makes them resolvable
    // by the status system, the cartography and a siege planner alike.
    expect(substitution.dependency.sources)
      .toEqual([institutionStatusRef(guild()), institutionStatusRef(tower())].sort());
    expect(substitution.dependency.targets).toEqual(substitution.dependency.sources);
    // The metric costs material: the draw is a whole number, because the flow ledger
    // accrues integers by law.
    expect(Number.isInteger(substitution.reagentDraw)).toBe(true);
    expect(substitution.reagentDraw).toBeGreaterThan(0);
  });

  it('THE TARGETS ARE REALLY THE TARGETS: removing exactly them collapses the share', () => {
    const roster = [guild(), tower(), granary()];
    const substitution = deriveMagicSubstitution({
      settlement: hungryCity(roster), worldState: worldWith('industrial'), cid: 's1', reagentSupply01: 1,
    });
    const targeted = new Set(substitution.dependency.targets);
    // An enemy takes exactly what the metric named, and nothing else. Resolution goes
    // through institutionStatusRef because that is the vocabulary the targets are
    // published in; matching on the raw roster id finds nothing, which is precisely
    // how this pin caught itself being vacuous the first time it ran.
    const afterSiege = roster.map((inst) => (
      targeted.has(institutionStatusRef(inst))
        ? { ...inst, status: 'ruined', _worldPulseInactive: true }
        : inst
    ));
    const after = deriveMagicSubstitution({
      settlement: hungryCity(afterSiege), worldState: worldWith('industrial'), cid: 's1', reagentSupply01: 1,
    });
    expect(substitution.share).toBeGreaterThan(0);
    expect(after).toBe(null);
  });

  it('the Herald sentence names the share and the cure, and stays silent at band none', () => {
    const substitution = deriveMagicSubstitution({
      settlement: hungryCity([guild(), tower()]), worldState: worldWith('industrial'), cid: 's1', reagentSupply01: 1,
    });
    const line = magicDependencySentence(hungryCity(), substitution);
    expect(line).toContain('Vashad');
    expect(line).toContain('percent');
    expect(line).toContain('reagents keep arriving');
    expect(magicDependencySentence(hungryCity(), null)).toBe(null);
  });
});

describe('K4 DORMANCY (law 8, §10)', () => {
  it('the flag absent means no channel by every path, and the gate is K1\'s one gate', () => {
    expect(magicSubstitutionActive({})).toBe(false);
    expect(magicSubstitutionActive({ simulationRules: {} })).toBe(false);
    expect(magicSubstitutionActive({ simulationRules: { magicEconomyEnabled: 'true' } })).toBe(false);
    expect(magicSubstitutionActive({ simulationRules: LIT })).toBe(true);

    const dark = deriveMagicSubstitution({
      settlement: hungryCity([guild(), tower()]),
      worldState: worldWith('industrial', {}),
      cid: 's1',
      reagentSupply01: 1,
    });
    expect(dark).toBe(null);
    // ANCHOR: the identical world with the flag lit DOES substitute, so the dark null
    // is the gate firing rather than a fixture that could never have substituted.
    const lit = deriveMagicSubstitution({
      settlement: hungryCity([guild(), tower()]),
      worldState: worldWith('industrial'),
      cid: 's1',
      reagentSupply01: 1,
    });
    expect(lit.share).toBeGreaterThan(0);
    // And a dark world's food number is untouched, digit for digit.
    expect(substitutedDeficitPct(37.4, dark)).toBe(37.4);
  });
});
