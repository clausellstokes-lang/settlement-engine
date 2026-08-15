/**
 * conquestMarketWC2.test.js — Phase 5 W-C2 (conquest feeds + the compensating market).
 *
 * Each mechanic is pinned with the LAW it must obey:
 *   1. CONQUEST FEEDS — captives (conscience FORECLOSES the slave-trade revenue where the
 *      victor's plane abhors it; a good plane simply does not profit) + loot (a temporary,
 *      decaying prosperity pulse scaled by the taken town + the outcome kind). NEUTRALITY:
 *      no captures ⇒ null ledger ⇒ byte-identical.
 *   2. MERCENARY MARKET — shortfall demand (war exposure minus native capability) MEETS
 *      local mercenary supply ⇒ a rented-force market with three bounded legs (supplement,
 *      upkeep cost, fidelity penalty). NEUTRALITY: no wars OR no shortfall OR no supply ⇒
 *      null ⇒ byte-identical. The supplement is CONSUMED at the deploy seam.
 */

import { describe, it, expect } from 'vitest';

import {
  CONQUEST_FEED_TUNING,
  slaveMarketInstitutionOf,
  captiveGate,
  captiveConscienceRead,
  captiveYieldRaw,
  lootYieldRaw,
  lootKindFactor,
  stepPulse,
  prosperityPulseOf,
  conquestProsperityFor,
  advanceConquestFeeds,
} from '../../src/domain/worldPulse/conquestFeeds.js';
import {
  MERCENARY_MARKET_TUNING,
  mercPresenceOf,
  warExposure01,
  nativeCapability01,
  mercSupplementOf,
  mercProsperityCostOf,
  mercFidelityPenaltyOf,
  advanceMercenaryMarket,
} from '../../src/domain/worldPulse/mercenaryMarket.js';
import { evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';
import { createPRNG } from '../../src/kernel/prng.js';

const inst = (name, patch = {}) => ({ name, status: 'active', ...patch });
const deity = (alignmentAxis, lawAxis = 'neutral') => ({ alignmentAxis, lawAxis, name: `${alignmentAxis} ${lawAxis}` });
const settlement = (patch = {}) => ({ tier: patch.tier || 'town', population: patch.population || 1800, institutions: patch.institutions || [], config: patch.config || {} });
// A snapshot whose byId resolves a fixed {id -> {settlement}} table.
const snapWith = (table) => ({ byId: { get: (id) => table[String(id)] } });

// ═══════════════════════════════════════════════════════════════════════════════
// Item 1 — CONQUEST FEEDS
// ═══════════════════════════════════════════════════════════════════════════════
describe('W-C2 item 1 — conquest feeds', () => {
  it('slaveMarketInstitutionOf selects the slave-market class (cruelty >= floor), not gambling/pits', () => {
    expect(slaveMarketInstitutionOf(settlement({ institutions: [inst('Slave market')] }))?.name).toBe('Slave market');
    expect(slaveMarketInstitutionOf(settlement({ institutions: [inst('Slave market district')] }))?.name).toBe('Slave market district');
    // A gambling house (cruelty 0.1) and a fighting pit (cruelty 0.55) are NOT slave-market class.
    expect(slaveMarketInstitutionOf(settlement({ institutions: [inst('Gambling den'), inst('Fighting pits')] }))).toBeNull();
    // A closed/removed slave market is not standing.
    expect(slaveMarketInstitutionOf(settlement({ institutions: [inst('Slave market', { status: 'removed' })] }))).toBeNull();
    expect(slaveMarketInstitutionOf(settlement({ institutions: [inst('Slave market', { _worldPulseInactive: true })] }))).toBeNull();
  });

  it('conscience gradient: an evil/neutral plane PERMITS the captive trade, a good plane FORECLOSES it', () => {
    const market = settlement({ institutions: [inst('Slave market')] });
    const withPatron = (p) => ({ ...market, config: { primaryDeitySnapshot: p } });
    expect(captiveGate(withPatron(deity('evil'))).permitted).toBe(true);
    expect(captiveGate(withPatron(deity('neutral'))).permitted).toBe(true);
    expect(captiveGate(withPatron(deity('good'))).permitted).toBe(false);   // conscience forecloses
    // A deity-free warlord has no conscience objection ⇒ permitted where the market exists.
    expect(captiveGate(market).permitted).toBe(true);
    // No slave market ⇒ never permitted (the channel needs the institution).
    expect(captiveGate(settlement({ config: { primaryDeitySnapshot: deity('evil') } })).hasMarket).toBe(false);
    // The read crosses the ABOLITION_FLOOR only for a good plane.
    expect(captiveConscienceRead(deity('good'), { cruelty: 0.9 })).toBeGreaterThanOrEqual(CONQUEST_FEED_TUNING.ABOLITION_FLOOR);
    expect(captiveConscienceRead(deity('evil'), { cruelty: 0.9 })).toBe(0);
    expect(captiveConscienceRead(null, { cruelty: 0.9 })).toBe(0);
  });

  it('yields scale with the taken town + outcome: captives by tier×severity, loot by econ×kind (sack > capture > occupation-establish)', () => {
    const metro = settlement({ tier: 'metropolis' });
    const thorp = settlement({ tier: 'thorp' });
    expect(captiveYieldRaw(metro, 1)).toBeGreaterThan(captiveYieldRaw(thorp, 1));   // pop tier
    expect(captiveYieldRaw(metro, 1)).toBeGreaterThan(captiveYieldRaw(metro, 0));   // severity
    expect(lootKindFactor('sack')).toBeGreaterThan(lootKindFactor('capture'));
    expect(lootKindFactor('capture')).toBeGreaterThan(lootKindFactor('occupation_establish'));
    expect(lootYieldRaw(metro, 'sack')).toBeGreaterThan(lootYieldRaw(metro, 'capture'));
    expect(lootYieldRaw(metro, 'capture')).toBeGreaterThan(lootYieldRaw(thorp, 'capture')); // econ scale
  });

  it('stepPulse decays then adds, capped; prosperityPulseOf is bounded and 0 when absent', () => {
    expect(stepPulse(0, 0, 0.1, 1)).toBe(0);
    expect(stepPulse(0.5, 0, 0.1, 1)).toBeCloseTo(0.45, 6);   // pure decay
    expect(stepPulse(1, 1, 0.1, 0.6)).toBe(0.6);              // capped
    expect(prosperityPulseOf(null)).toBe(0);
    expect(prosperityPulseOf({ loot: 0.6, captive: 0.6 })).toBeCloseTo(CONQUEST_FEED_TUNING.PROSPERITY_W, 6); // clamp01(1.2)=1
    expect(conquestProsperityFor(null, 'v')).toBe(0);
  });

  // THE NEUTRALITY THEOREM.
  it('NEUTRALITY: no conquests + no prior ledger ⇒ null (byte-identical, no key materialized)', () => {
    expect(advanceConquestFeeds({ snapshot: snapWith({}), priorLedger: null, conquests: [] }).conquestFeedsByCid).toBeNull();
    expect(advanceConquestFeeds({}).conquestFeedsByCid).toBeNull();
  });

  it('a conquest pays the victor LOOT always; CAPTIVES only where a permitted slave market exists', () => {
    const evilMarket = { settlement: settlement({ institutions: [inst('Slave market')], config: { primaryDeitySnapshot: deity('evil') } }) };
    const goodMarket = { settlement: settlement({ institutions: [inst('Slave market')], config: { primaryDeitySnapshot: deity('good') } }) };
    const noMarket = { settlement: settlement({ config: { primaryDeitySnapshot: deity('evil') } }) };
    const taken = { settlement: settlement({ tier: 'city' }) };
    const table = { V_evil: evilMarket, V_good: goodMarket, V_bare: noMarket, T: taken };
    const snapshot = snapWith(table);

    // Evil slave-market victor: loot + captive both accrue, both cause-chained.
    const evil = advanceConquestFeeds({ snapshot, priorLedger: null, conquests: [{ victorId: 'V_evil', takenId: 'T', kind: 'sack', severity: 0.8 }] });
    const evilRec = evil.conquestFeedsByCid.V_evil;
    expect(evilRec.loot).toBeGreaterThan(0);
    expect(evilRec.captive).toBeGreaterThan(0);
    expect(evilRec.causes.some((c) => c.source === 'conquest_loot')).toBe(true);
    expect(evilRec.causes.some((c) => c.source === 'captive_trade')).toBe(true);

    // Good slave-market victor: loot accrues, captive is FORECLOSED (lost, receipt emitted).
    const good = advanceConquestFeeds({ snapshot, priorLedger: null, conquests: [{ victorId: 'V_good', takenId: 'T', kind: 'sack', severity: 0.8 }] });
    const goodRec = good.conquestFeedsByCid.V_good;
    expect(goodRec.loot).toBeGreaterThan(0);
    expect(goodRec.captive).toBe(0);
    expect(goodRec.causes.some((c) => c.source === 'captive_trade_foreclosed')).toBe(true);
    expect(goodRec.causes.some((c) => c.source === 'captive_trade')).toBe(false);
    // The conscience gradient: evil profits from captives, good does not.
    expect(evilRec.captive).toBeGreaterThan(goodRec.captive);

    // No slave market: loot only, no captive cause at all.
    const bare = advanceConquestFeeds({ snapshot, priorLedger: null, conquests: [{ victorId: 'V_bare', takenId: 'T', kind: 'sack', severity: 0.8 }] });
    expect(bare.conquestFeedsByCid.V_bare.captive).toBe(0);
    expect(bare.conquestFeedsByCid.V_bare.causes.every((c) => !c.source.startsWith('captive_trade'))).toBe(true);
  });

  it('the loot pulse DECAYS over weeks back to nothing (a pulse, not a rebase) and drops to null', () => {
    const table = { V: { settlement: settlement() }, T: { settlement: settlement({ tier: 'city' }) } };
    const snapshot = snapWith(table);
    let ledger = advanceConquestFeeds({ snapshot, priorLedger: null, conquests: [{ victorId: 'V', takenId: 'T', kind: 'sack', severity: 0.7 }] }).conquestFeedsByCid;
    const peak = ledger.V.loot;
    expect(peak).toBeGreaterThan(0);
    // Advance many ticks with NO fresh conquest — the pulse decays monotonically.
    let prev = peak;
    let dropped = false;
    for (let i = 0; i < 200; i += 1) {
      const next = advanceConquestFeeds({ snapshot, priorLedger: ledger, conquests: [] }).conquestFeedsByCid;
      if (next === null) { dropped = true; break; }
      expect(next.V.loot).toBeLessThan(prev);
      prev = next.V.loot;
      ledger = next;
    }
    expect(dropped).toBe(true);   // returns to byte-neutral absent
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Item 2 — MERCENARY / ADVENTURER-GUILD COMPENSATING MARKET
// ═══════════════════════════════════════════════════════════════════════════════
describe('W-C2 item 2 — mercenary market', () => {
  it('mercPresenceOf detects hireable-force institutions, not ordinary trades; bounded', () => {
    expect(mercPresenceOf(settlement({ institutions: [inst('Mercenary quarter')] }))).toBeGreaterThan(0);
    expect(mercPresenceOf(settlement({ institutions: [inst("Multiple adventurers' guilds")] }))).toBeGreaterThan(0);
    expect(mercPresenceOf(settlement({ institutions: [inst('Free company hall')] }))).toBeGreaterThan(0);
    expect(mercPresenceOf(settlement({ institutions: [inst("Adventurers' charter hall")] }))).toBeGreaterThan(0);
    expect(mercPresenceOf(settlement({ institutions: [inst('Blacksmith'), inst('Town granary')] }))).toBe(0);
    // Bounded at the cap regardless of stacking.
    const many = settlement({ institutions: [inst('Mercenary quarter'), inst('Free company hall'), inst('Hired blades')] });
    expect(mercPresenceOf(many)).toBe(MERCENARY_MARKET_TUNING.PRESENCE_CAP);
  });

  it('does not derive mercenary supply from a current custom presentation name', () => {
    const namesake = inst('Mercenary quarter', {
      source: 'custom',
      isCustom: true,
      customDefinitionCategory: 'institutions',
      customDefinitionId: 'definition:institutions:mercenary-namesake',
    });

    expect(mercPresenceOf(settlement({
      institutions: [namesake],
    }))).toBe(0);
  });

  it('exposure and capability are monotone; shortfall = exposure − capability', () => {
    expect(warExposure01(0, false)).toBe(0);
    expect(warExposure01(1, false)).toBeGreaterThan(0);
    expect(warExposure01(1, true)).toBeGreaterThan(warExposure01(1, false));   // engagement raises exposure
    expect(nativeCapability01(1, 1)).toBeGreaterThan(nativeCapability01(0, 1)); // readiness
    expect(nativeCapability01(0, 1)).toBeGreaterThan(nativeCapability01(0, 0.55)); // supply (0.55 = floor)
    expect(nativeCapability01(0, 0.55)).toBe(0);   // floor supply + no readiness ⇒ 0 capability
  });

  // THE NEUTRALITY THEOREM.
  it('NEUTRALITY: no exposure, OR no local mercenary supply, OR demand met ⇒ null (byte-identical)', () => {
    const merc = settlement({ institutions: [inst('Mercenary quarter')] });
    // Exposure but no supply.
    const noSupply = advanceMercenaryMarket({
      snapshot: { settlements: [{ id: 'a', settlement: settlement() }], byId: { get: () => ({ settlement: settlement() }) } },
      worldState: { occupations: { a: { occupierId: 'x' } } }, threatByCid: new Map([['a', 1]]), martialByCid: null,
    });
    expect(noSupply.mercenaryMarketByCid).toBeNull();
    // Supply but no exposure (deep peace).
    const noExposure = advanceMercenaryMarket({
      snapshot: { settlements: [{ id: 'a', settlement: merc }], byId: { get: () => ({ settlement: merc }) } },
      worldState: {}, threatByCid: new Map(), martialByCid: null,
    });
    expect(noExposure.mercenaryMarketByCid).toBeNull();
    // No settlements at all.
    expect(advanceMercenaryMarket({ snapshot: null }).mercenaryMarketByCid).toBeNull();
  });

  it('shortfall MEETING local supply activates the market with three bounded, cause-chained legs', () => {
    const merc = settlement({ institutions: [inst('Mercenary quarter')], tier: 'town' });
    const table = { a: { settlement: merc } };
    const snapshot = { settlements: [{ id: 'a', settlement: merc }], byId: { get: (id) => table[String(id)] } };
    // High threat, an engagement, no readiness record ⇒ high shortfall; local merc supply present.
    const out = advanceMercenaryMarket({
      snapshot,
      worldState: { occupations: { a: { occupierId: 'x' } } },   // a is occupied ⇒ engaged
      threatByCid: new Map([['a', 1]]),
      martialByCid: null,
    });
    const rec = out.mercenaryMarketByCid.a;
    expect(rec.shortfall).toBeGreaterThan(0);
    expect(rec.presence).toBeGreaterThan(0);
    expect(rec.activity).toBeGreaterThan(0);
    // Three bounded legs.
    expect(rec.supplement).toBeGreaterThan(0);
    expect(rec.supplement).toBeLessThanOrEqual(MERCENARY_MARKET_TUNING.SUPPLEMENT_MAX);
    expect(rec.prosperityCost).toBeGreaterThan(0);
    expect(rec.prosperityCost).toBeLessThanOrEqual(MERCENARY_MARKET_TUNING.COST_MAX);
    expect(rec.fidelityPenalty).toBeGreaterThan(0);
    expect(rec.fidelityPenalty).toBeLessThanOrEqual(MERCENARY_MARKET_TUNING.FIDELITY_MAX);
    // All three legs emit their cause.
    for (const src of ['supply_shortfall', 'mercenary_supply', 'rented_readiness', 'mercenary_upkeep', 'hired_steel_noise']) {
      expect(rec.causes.some((c) => c.source === src)).toBe(true);
    }
    // Readers surface the legs; absent ledger ⇒ 0.
    expect(mercSupplementOf(out.mercenaryMarketByCid, 'a')).toBe(rec.supplement);
    expect(mercProsperityCostOf(out.mercenaryMarketByCid, 'a')).toBe(rec.prosperityCost);
    expect(mercFidelityPenaltyOf(out.mercenaryMarketByCid, 'a')).toBe(rec.fidelityPenalty);
    expect(mercSupplementOf(null, 'a')).toBe(0);
    expect(mercFidelityPenaltyOf(out.mercenaryMarketByCid, 'missing')).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Wiring — the rented-force supplement is CONSUMED at the deploy seam
// ═══════════════════════════════════════════════════════════════════════════════
describe('W-C2 wiring — the market is consumed', () => {
  const NOW = '2026-01-01T00:00:00.000Z';
  const mk = (id, name, patch = {}) => ({
    id, name, phase: 'canon',
    settlement: {
      name, tier: patch.tier || 'city', population: patch.population || 45000,
      config: { tradeRouteAccess: 'road', priorityMilitary: 35 },
      institutions: [], economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
      powerStructure: {
        publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
        factions: patch.factions || [{ faction: 'Military Council', category: 'military', power: 78, isGoverning: true }],
        conflicts: [],
      },
      npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
      activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  });
  const victim = (id, name) => mk(id, name, {
    tier: 'village', population: 280, legitimacy: 24,
    factions: [{ faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true }, { faction: 'Hedge Wardens', category: 'military', power: 22 }],
  });

  it('a mercenary supplement in worldState LIFTS the committed force (readiness it did not train)', () => {
    const saves = [mk('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const edges = { settlementIds: ['strong', 'weak'], edges: [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }], relationshipStates: { 'edge.strong.weak': { relationshipType: 'hostile' } } };
    const baseState = { rngSeed: 'wc2-seed', tick: 4, relationshipStates: edges.relationshipStates, simulationRules: { warLayerEnabled: true }, warPosture: { strong: { state: 'mobilized', progress: 1, sinceTick: 0 } } };
    const campaign = { id: 'wc2', name: 'WC2', settlementIds: edges.settlementIds, regionalGraph: ensureRegionalGraph({ edges: edges.edges }), wizardNews: { currentTick: 4, entries: [] } };
    const run = (mercLedger) => {
      const worldState = { ...baseState, ...(mercLedger ? { mercenaryMarket: mercLedger } : {}) };
      const snap = buildWorldSnapshot({ campaign: { ...campaign, worldState }, saves, worldState });
      return evaluateWarLayer({ snapshot: snap, worldState, rng: createPRNG('m'), tick: 5, now: NOW, rules: { warLayerEnabled: true } });
    };
    const without = run(null);
    const withMerc = run({ strong: { supplement: 0.3, prosperityCost: 0.2, fidelityPenalty: 0.2, shortfall: 0.8, presence: 1, activity: 0.8, causes: [] } });
    // The supplement lifts effective readiness ⇒ a larger committed force. Absent ledger ⇒ byte-identical strength.
    expect(withMerc.deployments.strong).toBeDefined();
    expect(without.deployments.strong).toBeDefined();
    expect(withMerc.deployments.strong.maxStartStrength).toBeGreaterThan(without.deployments.strong.maxStartStrength);
    expect(withMerc.deployments.strong.readiness).toBeGreaterThan(0);   // the bought readiness is stamped
  });

  it('worldState conditional materialization: the ledgers are ABSENT when empty, deep-cloned when present', () => {
    // Dormant: no key ⇒ ensureWorldState carries none (byte-neutral).
    const dormant = ensureWorldState({ tick: 1 }, {});
    expect('conquestFeeds' in dormant).toBe(false);
    expect('mercenaryMarket' in dormant).toBe(false);
    // Empty ledgers are stripped (never materialized as {}).
    const empty = ensureWorldState({ tick: 1, conquestFeeds: {}, mercenaryMarket: {} }, {});
    expect('conquestFeeds' in empty).toBe(false);
    expect('mercenaryMarket' in empty).toBe(false);
    // Present ledgers survive as a DEEP clone (no aliasing).
    const src = { conquestFeeds: { v: { loot: 0.3, captive: 0 } }, mercenaryMarket: { a: { supplement: 0.2 } } };
    const live = ensureWorldState({ tick: 1, ...src }, {});
    expect(live.conquestFeeds.v.loot).toBe(0.3);
    expect(live.mercenaryMarket.a.supplement).toBe(0.2);
    expect(live.conquestFeeds).not.toBe(src.conquestFeeds);   // deep-cloned, not aliased
  });
});
