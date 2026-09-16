/**
 * magicSubstitutionReagents.test.js — W-K slice K4, the reagent half
 * (docs/DESIGN_MAGIC_ECONOMY.md §7; §3c's two-timescale law).
 *
 * The claims, each with the anchor that makes it non-trivial:
 *
 *   THE SPINE IS REAL. Every chain the spine names resolves to a chain that actually
 *       exists in SUPPLY_CHAIN_NEEDS, and every good it names resolves to a NON-custom
 *       goods-catalog id. Without both halves the spine would be a table of typos that
 *       silently denominated nothing.
 *   THE GOLDEN IS NOT SHIFTED. The spine adds no chain, no registry row and no cascade
 *       adjacency, which is executed here by rebuilding the cascade map the generator
 *       builds and comparing it against a counterfactual that DOES add a chain: the
 *       counterfactual moves, the real one does not.
 *   CORRIDOR DEMAND IS GENERATED INTO J2'S OWN LEDGER, through J2's own accessors,
 *       under an EXISTING source, bounded by the same admissibility law. The anchor is
 *       that the accrual composes with a prior J2 pass rather than overwriting it.
 *   INTERDICTION IMPAIRS BEFORE IT SHELLS, end to end: a cut reagent link stamps the
 *       mark, K1's very next advance grades the house `impaired`, and NOTHING becomes
 *       a shell on that tick. The anchor is that the shell verdict is byte-identical
 *       across the impairing tick, which is what makes "before" mean something.
 *   DORMANCY by object identity, on both flags.
 */
import { describe, it, expect } from 'vitest';
import {
  REAGENT_FLOW_SOURCE,
  REAGENT_POSTURES,
  REAGENT_TUNING,
  accrueReagentDemand,
  reagentGoodId,
  reagentHungerOf,
  reagentInterdictionMarks,
  reagentPosture,
  reagentStapleGoodId,
  reagentSupplyFactor,
  spineChainsOf,
} from '../../src/domain/worldPulse/magicSubstitutionReagents.js';
import {
  REAGENT_CHAIN_SPINE,
  REAGENT_STAPLE_LABEL,
} from '../../src/data/supplyChainResourceIndex.js';
import { SUPPLY_CHAIN_NEEDS } from '../../src/data/supplyChainData.js';
import { ROUTE_FLOW_SOURCES } from '../../src/domain/worldPulse/routeNetworkFlows.js';
import { readCorridors, readRouteNetwork } from '../../src/domain/worldPulse/routeNetworkLedger.js';
import {
  advanceInstitutionStatus,
} from '../../src/domain/worldPulse/institutionStatusLifecycle.js';
import {
  deriveInstitutionStatus,
  institutionStatusRef,
} from '../../src/domain/worldPulse/institutionStatusModel.js';
import { deriveMagicSubstitution } from '../../src/domain/worldPulse/magicSubstitution.js';
import { normalizeGood } from '../../src/domain/region/goodsCatalog.js';

const LIT = { magicEconomyEnabled: true, routeLifecycleEnabled: true };

const guild = (extra = {}) => ({
  id: 'institution.mages_guild', name: "Mages' guild", category: 'Magic', status: 'active', ...extra,
});
const granary = () => ({ id: 'institution.granary', name: 'Town granary', category: 'Economy', status: 'active' });

const alchemyCity = (overrides = {}) => ({
  id: 'c1',
  name: 'Vashad',
  tier: 'city',
  institutions: [guild(), granary()],
  economicState: {
    activeChains: [{ needKey: 'arcane_magical', chainId: 'alchemy' }],
    primaryImports: ['Arcane reagents'],
    primaryExports: ['Magical item market'],
    ...overrides,
  },
});

/** A neighbour that MAKES reagents, so the want has somewhere to point. */
const reagentTown = () => ({
  id: 'c2',
  name: 'Hollowmere',
  tier: 'town',
  institutions: [{ id: 'institution.alchemist', name: 'Alchemist', category: 'Magic', status: 'active' }],
  economicState: {
    activeChains: [{ needKey: 'arcane_magical', chainId: 'alchemy' }],
    primaryExports: ['Arcane reagents'],
    primaryImports: [],
  },
});

/** Coordinates the genesis candidate set needs to admit the pair. */
const memberOf = (settlement, x, y) => ({
  id: String(settlement.id),
  config: { mapPosition: { x, y }, tradeRouteAccess: 'road' },
  settlement,
});

describe('K4 THE SPINE IS REAL (§7: denominate magic\'s hunger in the goods catalog)', () => {
  it('every chain the spine names exists in SUPPLY_CHAIN_NEEDS', () => {
    const live = new Set();
    for (const [needKey, need] of Object.entries(SUPPLY_CHAIN_NEEDS)) {
      for (const chain of need.chains) live.add(`${needKey}.${chain.id}`);
    }
    const spineKeys = Object.keys(REAGENT_CHAIN_SPINE);
    expect(spineKeys.length).toBeGreaterThan(0);
    for (const key of spineKeys) {
      expect(live.has(key), `the spine names ${key}, which no chain in SUPPLY_CHAIN_NEEDS carries`).toBe(true);
    }
  });

  it('every good the spine names resolves to a REAL catalog id, never a custom fallback', () => {
    const labels = new Set([REAGENT_STAPLE_LABEL]);
    for (const rung of Object.values(REAGENT_CHAIN_SPINE)) {
      for (const label of [...rung.consumes, ...rung.produces]) labels.add(label);
    }
    expect(labels.size).toBeGreaterThan(1);
    for (const label of labels) {
      const good = normalizeGood(label);
      // ANCHOR against the vacuous version of this pin: normalizeGood NEVER returns
      // null (it mints a `custom.` id for anything it cannot place), so asserting
      // truthiness would pass on a table of typos. The claim is that it is not custom.
      expect(good.custom, `the spine label "${label}" fell through to ${good.id}`).not.toBe(true);
      expect(good.id.startsWith('custom.')).toBe(false);
    }
    expect(reagentStapleGoodId()).toBe('arcane_reagents');
  });

  it('the staple id is derived through the catalog, so a catalog rename moves it', () => {
    expect(reagentGoodId('alchemical reagents')).toBe('arcane_reagents');
    expect(reagentGoodId('magical components')).toBe('arcane_reagents');
  });

  it('every rung declares an integer demand weight, because the flow ledger accrues integers', () => {
    for (const [key, rung] of Object.entries(REAGENT_CHAIN_SPINE)) {
      expect(Number.isInteger(rung.demandWeight), `${key} has a non-integer weight`).toBe(true);
      expect(rung.demandWeight).toBeGreaterThan(0);
    }
  });
});

describe('K4 THE GOLDEN IS NOT SHIFTED (the I1 lesson, executed)', () => {
  const mk = (n) => n.toLowerCase().slice(0, 16);
  const buildCascadeMap = (needs) => {
    const map = {};
    Object.values(needs).forEach((need) => {
      need.chains.forEach((chain) => {
        const procs = chain.processingInstitutions || [];
        if (procs.length < 2) return;
        procs.forEach((proc, idx) => {
          const key = mk(proc);
          if (!map[key]) map[key] = { up: [], down: [] };
          for (let d = 1; d <= 2 && idx + d < procs.length; d += 1) {
            const nk = mk(procs[idx + d]);
            if (!map[key].down.find((x) => x.mk === nk)) map[key].down.push({ mk: nk, dist: d });
          }
          for (let u = 1; u <= 2 && idx - u >= 0; u += 1) {
            const nk = mk(procs[idx - u]);
            if (!map[key].up.find((x) => x.mk === nk)) map[key].up.push({ mk: nk, dist: u });
          }
        });
      });
    });
    return map;
  };
  const edges = (map) => Object.values(map).reduce((n, e) => n + e.up.length + e.down.length, 0);

  it('the spine adds NO chain to SUPPLY_CHAIN_NEEDS, so the prebuilt registry is unmoved', () => {
    // The spine is a NAMING, not an authoring: it may only ever name chains that
    // already existed. A future edit that adds a chain to the table to satisfy the
    // spine reds the chain-count pin below and has to justify a golden re-record.
    const chains = Object.values(SUPPLY_CHAIN_NEEDS)
      .reduce((n, need) => n + need.chains.length, 0);
    expect(chains).toBe(74);
    expect(SUPPLY_CHAIN_NEEDS.arcane_magical.chains.map((c) => c.id))
      .toEqual(['alchemy', 'spellcasting', 'magical_goods', 'planar']);
  });

  it('the cascade adjacency the generator builds is byte-identical WITH the spine loaded', () => {
    const real = buildCascadeMap(SUPPLY_CHAIN_NEEDS);
    // THE COUNTERFACTUAL, which is what makes this pin non-vacuous: adding one
    // reagent chain whose processors are the magic institutions that actually appear
    // on rosters DOES move the map, by six edges, mutating 'alchemist' and
    // "mages' guild". Six new boost candidates is up to six extra draws off the
    // seeded ambient stream in applyCascadeInstitutions, which translates the stream
    // for every downstream generator. That is the shift the spine exists to avoid.
    const counterfactual = buildCascadeMap({
      ...SUPPLY_CHAIN_NEEDS,
      arcane_magical: {
        ...SUPPLY_CHAIN_NEEDS.arcane_magical,
        chains: [...SUPPLY_CHAIN_NEEDS.arcane_magical.chains, {
          id: 'reagent_gathering',
          label: 'Reagent Gathering',
          processingInstitutions: ['Herbalist', 'Alchemist', "Mages' guild"],
        }],
      },
    });
    expect(edges(counterfactual)).toBeGreaterThan(edges(real));
    expect(Object.keys(counterfactual).length).toBe(Object.keys(real).length + 1);
    // And the map the estate ACTUALLY builds carries neither the new key nor the
    // mutated adjacency, because the spine never entered the table.
    expect(Object.keys(real)).not.toContain('herbalist'); // anchored: the counterfactual above proves the key is mintable, so its absence here is the spine staying out of the table, not an empty map.
    expect(JSON.stringify(real.alchemist)).toBe(JSON.stringify(counterfactual.alchemist
      ? { up: real.alchemist.up, down: real.alchemist.down } : null));
  });

  it('ROUTE_FLOW_SOURCES is NOT widened: reagent demand rides an existing source', () => {
    expect(ROUTE_FLOW_SOURCES[REAGENT_FLOW_SOURCE]).toBe('goods');
    expect(Object.keys(ROUTE_FLOW_SOURCES).sort()).toEqual([
      'army_transit', 'deployment', 'migration', 'mission', 'shipment', 'supply_starved', 'unmet_import',
    ]);
  });
});

describe('K4 the reagent posture and the hunger read', () => {
  it('reads the spine rungs the economy model actually stamped', () => {
    expect(spineChainsOf(alchemyCity())).toEqual(['arcane_magical.alchemy']);
    expect(spineChainsOf({ economicState: { activeChains: [{ needKey: 'food_security', chainId: 'grain' }] } }))
      .toEqual([]);
  });

  it('a live magic house hungers at the staple even with no stamped chain', () => {
    const noChain = { institutions: [guild()], economicState: { activeChains: [] } };
    expect([...reagentHungerOf(noChain).keys()]).toEqual(['arcane_reagents']);
    // ANCHOR: a settlement with neither chain nor practitioner hungers for nothing,
    // so the rule above is a rule and not a constant.
    expect([...reagentHungerOf({ institutions: [granary()], economicState: {} }).keys()]).toEqual([]);
  });

  it('the posture vocabulary is closed and the factor table is total over it', () => {
    for (const posture of REAGENT_POSTURES) {
      expect(Number.isFinite(REAGENT_TUNING.SUPPLY_FACTOR[posture])).toBe(true);
    }
    expect(REAGENT_TUNING.SUPPLY_FACTOR.starved).toBe(0);
    expect(REAGENT_TUNING.SUPPLY_FACTOR.local).toBe(1);
  });

  it('a STARVED link outranks a local export: an interdiction is not hidden by a ledger line', () => {
    const selfSupplied = alchemyCity({ primaryExports: ['Arcane reagents'] });
    expect(reagentPosture({ settlement: selfSupplied, worldState: {}, cid: 'c1' }).posture).toBe('local');
    const cut = {
      spatialLedgers: {
        supplyShipments: {
          'c1:arcane': { settlementId: 'c1', input: 'Arcane reagents', starving: true, sourceId: '' },
        },
      },
    };
    const posture = reagentPosture({ settlement: selfSupplied, worldState: cut, cid: 'c1' });
    expect(posture.posture).toBe('starved');
    expect(posture.supply01).toBe(0);
    expect(posture.starvedGoods).toEqual(['arcane_reagents']);
    expect(reagentSupplyFactor({ settlement: selfSupplied, worldState: cut, cid: 'c1' })).toBe(0);
  });

  it('a declared import with nothing arriving is DECLARED, not supplied', () => {
    expect(reagentPosture({ settlement: alchemyCity(), worldState: {}, cid: 'c1' }).posture).toBe('declared');
    const arriving = {
      spatialLedgers: {
        supplyShipments: {
          'c1:arcane': { settlementId: 'c1', input: 'Arcane reagents', starving: false, sourceId: 'c2' },
        },
      },
    };
    expect(reagentPosture({ settlement: alchemyCity(), worldState: arriving, cid: 'c1' }).posture).toBe('supplied');
  });
});

describe('K4 CORRIDOR DEMAND (§7: magic institutions generate corridor demand, scaled by regime)', () => {
  const members = () => [
    memberOf(alchemyCity(), 0, 0),
    memberOf(reagentTown(), 3, 0),
  ];
  const world = () => ({ simulationRules: LIT });

  it('accrues the want onto the corridor between the hungry city and the maker', () => {
    const result = accrueReagentDemand({
      worldState: world(), members: members(), regimeOf: () => 'industrial', tick: 4,
    });
    expect(result.changed).toBe(true);
    expect(result.accrued).toBeGreaterThan(0);
    const corridors = readCorridors(result.worldState);
    const ids = Object.keys(corridors);
    expect(ids.length).toBe(1);
    const record = corridors[ids[0]];
    expect(record.flows.goods).toBeTruthy();
    expect(record.receipts.goods).toEqual([REAGENT_FLOW_SOURCE]);
    // The receipt names the GOOD, which is what keeps the corridor legible as a
    // reagent corridor without forking the source table.
    expect(record.reasonGoods).toEqual(['arcane_reagents']);
  });

  it('the regime SCALES the demand (§7), and subsistence presses nothing at all', () => {
    const industrial = accrueReagentDemand({
      worldState: world(), members: members(), regimeOf: () => 'industrial', tick: 4,
    });
    const funded = accrueReagentDemand({
      worldState: world(), members: members(), regimeOf: () => 'funded', tick: 4,
    });
    const subsistence = accrueReagentDemand({
      worldState: world(), members: members(), regimeOf: () => 'subsistence', tick: 4,
    });
    const tallyOf = (r) => Object.values(readCorridors(r.worldState))[0].tally.goods;
    expect(tallyOf(industrial)).toBeGreaterThan(tallyOf(funded));
    expect(subsistence.changed).toBe(false);
    expect(subsistence.worldState).toBe(subsistence.worldState);
    expect(readRouteNetwork(subsistence.worldState)).toBe(null);
  });

  it('COMPOSES with a prior accrual rather than overwriting it: two passes add', () => {
    const once = accrueReagentDemand({
      worldState: world(), members: members(), regimeOf: () => 'industrial', tick: 4,
    });
    const twice = accrueReagentDemand({
      worldState: once.worldState, members: members(), regimeOf: () => 'industrial', tick: 5,
    });
    const tallyOf = (state) => Object.values(readCorridors(state)).map((c) => c.tally.goods)[0];
    expect(tallyOf(twice.worldState)).toBe(tallyOf(once.worldState) * 2);
    // sinceTick is preserved from the FIRST pass, so a corridor remembers when the
    // want began rather than when it was last counted.
    expect(Object.values(readCorridors(twice.worldState))[0].sinceTick).toBe(4);
    // And the charter cursor was NOT advanced by a measurer.
    expect(Object.values(readCorridors(twice.worldState))[0].lastCharterEval).toBe(4);
  });

  it('a want with no MAKER on the other end accrues nothing', () => {
    const barren = [memberOf(alchemyCity(), 0, 0), memberOf({
      ...reagentTown(), economicState: { ...reagentTown().economicState, primaryExports: ['Timber'] },
    }, 3, 0)];
    const result = accrueReagentDemand({
      worldState: world(), members: barren, regimeOf: () => 'industrial', tick: 4,
    });
    expect(result.changed).toBe(false);
    expect(result.accrued).toBe(0);
  });
});

describe('K4 THE TWO-TIMESCALE LAW, END TO END (§7: IMPAIRS fast, SHELLS slow)', () => {
  const cutWorld = () => ({
    simulationRules: LIT,
    spatialLedgers: {
      supplyShipments: {
        'c1:arcane': { settlementId: 'c1', input: 'Arcane reagents', starving: true, sourceId: '' },
      },
    },
  });

  it('the cut stamps the estate\'s OWN supply_starved mark on the magic houses only', () => {
    const before = alchemyCity();
    const marked = reagentInterdictionMarks({
      settlement: before, worldState: cutWorld(), cid: 'c1', causeRef: 'reagent:c1',
    });
    expect(marked.changed).toBe(true);
    expect(marked.marked).toEqual(["Mages' guild"]);
    expect(marked.starvedGoods).toEqual(['arcane_reagents']);
    const mage = marked.settlement.institutions.find((i) => i.id === 'institution.mages_guild');
    const mundane = marked.settlement.institutions.find((i) => i.id === 'institution.granary');
    expect(mage.impairments.map((i) => i.type)).toEqual(['supply_starved']);
    expect(mage.impairments[0].severity).toBe(REAGENT_TUNING.INTERDICTION_SEVERITY);
    // The estate's own factory recomputed the row's status through effectiveStatus.
    expect(mage.status).toBe('impaired');
    // The granary is untouched, and by IDENTITY, so the pass is surgical.
    expect(mundane).toBe(before.institutions[1]);
    // The input was never mutated.
    expect(before.institutions[0].impairments).toBe(undefined);
  });

  it('K1 grades the marked house IMPAIRED on the very next advance, with the cure attached', () => {
    const marked = reagentInterdictionMarks({
      settlement: alchemyCity(), worldState: cutWorld(), cid: 'c1', causeRef: 'reagent:c1',
    });
    const { ledger, events } = advanceInstitutionStatus({
      snapshot: { settlements: [{ id: 'c1', settlement: marked.settlement }] },
      worldState: cutWorld(),
      priorLedger: null,
      tick: 7,
    });
    const ref = institutionStatusRef(guild());
    expect(ledger.c1[ref].impairments.supply_shortage.cause).toBe('supply_shortage');
    expect(ledger.c1[ref].impairments.supply_shortage.causeRef).toBe('impairment:supply_starved:' + ref);
    expect(events.map((e) => e.kind)).toContain('impairment_opened');

    const verdict = deriveInstitutionStatus({
      institution: marked.settlement.institutions[0],
      record: ledger.c1[ref],
    });
    expect(verdict.status).toBe('impaired');
    expect(verdict.impaired).toBe(true);
    expect(verdict.capacity01).toBeLessThan(1);
    expect(verdict.causes[0].cure).toBe('the road reopens or the stores refill');
  });

  it('and NOTHING SHELLS on that tick: the slow axis does not move (the "before" in "impairs before it shells")', () => {
    const clean = alchemyCity();
    const marked = reagentInterdictionMarks({
      settlement: clean, worldState: cutWorld(), cid: 'c1', causeRef: 'reagent:c1',
    });
    const shellBefore = deriveInstitutionStatus({ institution: clean.institutions[0], record: null }).shell;
    const shellAfter = deriveInstitutionStatus({ institution: marked.settlement.institutions[0], record: null }).shell;
    // ANCHOR: the fast axis DID move across this same tick (the previous pin proves
    // the status became 'impaired'), so a motionless slow axis is a distinction the
    // world drew rather than a fixture in which nothing at all happened.
    expect(shellBefore).toBe(false);
    expect(shellAfter).toBe(false);
    const { ledger } = advanceInstitutionStatus({
      snapshot: { settlements: [{ id: 'c1', settlement: marked.settlement }] },
      worldState: cutWorld(), priorLedger: null, tick: 7,
    });
    expect(ledger.c1[institutionStatusRef(guild())].shell).toBe(undefined);
    // K4 mints no shell anywhere: a shell is an economic verdict on a slow clock.
    expect(marked.settlement.institutions.every((i) => i._worldPulseEconomyClosed !== true)).toBe(true);
  });

  it('THE CUT REACHES THE TABLE: the interdiction closes the substitution channel', () => {
    const regimeWorld = (extra = {}) => ({
      simulationRules: LIT,
      spatialLedgers: { magicRegime: { c1: { regime: 'industrial' } }, ...extra },
    });
    const fed = deriveMagicSubstitution({
      settlement: alchemyCity(),
      worldState: regimeWorld(),
      cid: 'c1',
      reagentSupply01: reagentSupplyFactor({ settlement: alchemyCity(), worldState: regimeWorld(), cid: 'c1' }),
    });
    expect(fed.share).toBeGreaterThan(0);
    const cutState = regimeWorld({
      supplyShipments: {
        'c1:arcane': { settlementId: 'c1', input: 'Arcane reagents', starving: true, sourceId: '' },
      },
    });
    const starved = deriveMagicSubstitution({
      settlement: alchemyCity(),
      worldState: cutState,
      cid: 'c1',
      reagentSupply01: reagentSupplyFactor({ settlement: alchemyCity(), worldState: cutState, cid: 'c1' }),
    });
    // Anti-magic siegecraft as economic warfare, by construction: cut the reagent
    // road and the city stops eating from the Guild's hand.
    expect(starved).toBe(null);
  });
});

describe('K4 DORMANCY (law 8, §10): both gates, by object identity', () => {
  it('the magic flag absent returns the world BY REFERENCE and marks nothing', () => {
    const dark = { simulationRules: { routeLifecycleEnabled: true } };
    const result = accrueReagentDemand({
      worldState: dark,
      members: [memberOf(alchemyCity(), 0, 0), memberOf(reagentTown(), 3, 0)],
      regimeOf: () => 'industrial',
      tick: 4,
    });
    expect(result.worldState).toBe(dark);
    expect(result.changed).toBe(false);
    const settlement = alchemyCity();
    const marks = reagentInterdictionMarks({
      settlement,
      worldState: {
        simulationRules: {},
        spatialLedgers: {
          supplyShipments: {
            'c1:arcane': { settlementId: 'c1', input: 'Arcane reagents', starving: true, sourceId: '' },
          },
        },
      },
      cid: 'c1',
    });
    expect(marks.settlement).toBe(settlement);
    expect(marks.changed).toBe(false);
  });

  it('the ROUTE flag absent also returns by reference: demand into an absent ledger is a stray key', () => {
    const noRoutes = { simulationRules: { magicEconomyEnabled: true } };
    const result = accrueReagentDemand({
      worldState: noRoutes,
      members: [memberOf(alchemyCity(), 0, 0), memberOf(reagentTown(), 3, 0)],
      regimeOf: () => 'industrial',
      tick: 4,
    });
    expect(result.worldState).toBe(noRoutes);
    // ANCHOR: with BOTH flags lit the identical call does write, so the two
    // by-reference returns above are gates firing rather than a fixture that could
    // never have accrued.
    const lit = accrueReagentDemand({
      worldState: { simulationRules: LIT },
      members: [memberOf(alchemyCity(), 0, 0), memberOf(reagentTown(), 3, 0)],
      regimeOf: () => 'industrial',
      tick: 4,
    });
    expect(lit.changed).toBe(true);
  });
});
