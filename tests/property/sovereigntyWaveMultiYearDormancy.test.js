/**
 * sovereigntyWaveMultiYearDormancy.test.js — THE WHOLE WAVE, DARK, FOR YEARS.
 *
 * The WR-10 lanes each proved their own leaf dormant on their own fixture, and the
 * four-fence set proved the conveyance dormant across ONE tick of the treaty mover. This
 * file proves the claim that only the whole wave can make: that a world carrying the
 * ENTIRE sovereignty substrate — a vassal at the conveyable rung, a steading in the
 * satellites ledger, a court crushed into a demanding pressure band, and a relationship
 * edge holding an envoy's carried cession sheet — is BYTE-IDENTICAL through more than two
 * simulated years of the real pulse whether `sovereigntyTradeEnabled` is ABSENT or
 * explicitly FALSE, and that the same run LIT is measurably different.
 *
 * WHY THE MULTI-YEAR RUN IS NOT THE SINGLE-TICK PIN AGAIN. A single tick cannot see the
 * failure modes that matter most here: a cooldown read that flaps a tick later, a
 * `sinceTick` clock that only diverges once it has been carried, an episode gate that
 * fires the second time a band is crossed, a term that expires and lifts an effect. Those
 * are the shapes a dark subsystem leaks through, and they all need a calendar.
 *
 * THERE IS NO COMMITTED GOLDEN FILE, deliberately. The dormancy claim here is a
 * SELF-COMPARISON — the WR-10 surface after 110 ticks against the same surface before the
 * first one — plus the absent-vs-false differential over the whole projection. A recorded
 * hash would add a way to go stale and no catching power: this shape cannot pass by
 * matching a baseline that drifted with it, and `tests/fixtures/` stays untouched.
 *
 * THE LIT CONTROL IS THE POINT OF THE FILE. A dormancy proof whose lit run is also
 * unchanged proves the fixture inert, not the flag honest — the differential's designed
 * blind spot, and the reason the four-fence set never ships fence 2 alone.
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { SOVEREIGNTY_REQUIRED_RULES } from '../../src/domain/worldPulse/sovereigntyAssets.js';
import { CURRENT_TREATY_TICKS_PER_YEAR } from '../../src/domain/worldPulse/treatyClock.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';

const NOW = '2026-01-01T00:00:00.000Z';
const FLAG = 'sovereigntyTradeEnabled';
const ASSET = 'harbourtown';
const SELLER = 'march';
const BUYER = 'crown';
const IDS = [BUYER, SELLER, ASSET];

/** MORE THAN TWO SIMULATED YEARS at one week a tick. Long enough that a treaty minted in
 *  the first season reaches its own horizon and lapses — the lifecycle path a one-tick
 *  pin structurally cannot reach. */
const TICKS = 110;

const hashOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/** The envoy's artifact, carrying a REAL cession of ASSET. Lit, this is what makes the
 *  wartime road fire inside the pulse; dark, it must mint a document and move nothing. */
function carriedTermSheet() {
  return {
    schemaVersion: 1,
    id: 'sheet.errand.1', errandId: 'errand.1', encounterId: 'encounter.1',
    episodeKey: 'episode.1', relationshipKey: `edge.${BUYER}.${SELLER}`,
    parties: [BUYER, SELLER], proposerId: BUYER, responderId: SELLER,
    victorId: BUYER, loserId: SELLER, agreedTick: 1,
    pictureIds: { proposer: `picture.${BUYER}`, responder: `picture.${SELLER}` },
    clauses: [{
      type: 'sovereignty_transfer', family: 'sovereignty_transfer', magnitude: 1,
      durationTicks: 10 * CURRENT_TREATY_TICKS_PER_YEAR, weightSpent: 2, burden01: 0,
      seam: true, assetId: ASSET,
    }],
    budgetSpent: 2,
    valuations: [
      { partyId: BUYER, pictureId: `picture.${BUYER}`, role: 'proposer', decision: 'accept' },
      { partyId: SELLER, pictureId: `picture.${SELLER}`, role: 'responder', decision: 'accept' },
    ],
  };
}

function save(id, { tier = 'town', population = 2400, starving = false } = {}) {
  const name = `${id.charAt(0).toUpperCase()}${id.slice(1)}hold`;
  return {
    id, name, phase: 'canon',
    settlement: {
      name, tier, population,
      config: { tradeRouteAccess: 'road' },
      institutions: [{ name: 'Market' }],
      economicState: {
        prosperity: starving ? 'Struggling' : 'Prosperous',
        primaryExports: [], primaryImports: [], activeChains: [],
        foodSecurity: starving
          ? { storageMonths: 1, dailyNeed: 4000, dailyProduction: 200, deficitPct: 95, surplusPct: 0, resilienceScore: 5 }
          : { storageMonths: 6, dailyNeed: 900, dailyProduction: 1800, deficitPct: 0, surplusPct: 40, resilienceScore: 65 },
      },
      powerStructure: {
        publicLegitimacy: { score: 55, label: 'Stable' },
        factions: [{ faction: `${id} council`, category: 'civic', power: 60, isGoverning: true }],
        conflicts: [],
      },
      npcs: [], activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

const channel = (from, to, type = 'trade_route') => ({ id: `ch.${from}.${to}`, type, from, to, status: 'confirmed' });

/**
 * THE SUBSTRATE, ENTIRE. Every surface the wave can write is standing here: the vassal at
 * the conveyable rung, a steading row, the plan ledger's prior band (the crossing read),
 * and the carried sheet on a de-escalating hostile edge.
 * `barren` strips that substrate entirely — no vassalage, no steading, no carried
 * sheet — which is the configuration the stream-identity pin needs: a world where the
 * wave is switched on and has nothing whatever to do.
 * @param {'lit'|'absent'|'false'} mode @param {{ barren?: boolean }} [opts]
 */
function campaignFor(mode, { barren = false } = {}) {
  const lit = Object.fromEntries(SOVEREIGNTY_REQUIRED_RULES.map((k) => [k, true]));
  const base = { propagationMode: 'first_order', warLayerEnabled: true, peaceEngineEnabled: true };
  const simulationRules = (() => {
    if (mode === 'lit') return { ...base, ...lit };
    const off = { ...base, ...lit };
    delete off[FLAG];
    return mode === 'false' ? { ...off, [FLAG]: false } : off;
  })();

  return {
    id: 'wr10w-close-dormancy', name: 'wr10w-close-dormancy', settlementIds: [...IDS],
    worldState: {
      rngSeed: 'wr10w-close-multi-year', tick: 1,
      simulationRules,
      calendar: { season: 'summer', elapsedWeeks: 1 },
      deployments: {},
      warExhaustion: { [BUYER]: 0.7, [SELLER]: 0.8 },
      occupations: barren ? {} : {
        [ASSET]: {
          occupierId: SELLER, state: 'vassalized', sinceTick: 1, stateHeld: 9,
          resistance: 0.05, benefitYield: 0, lastTick: 1,
        },
      },
      relationshipStates: barren ? {} : {
        [`edge.${BUYER}.${SELLER}`]: {
          relationshipType: 'cold_war', resentment: 0.6, trust: 0.1, lastTransitionTick: 1,
          recentIncidents: [{
            tick: 1,
            type: 'strategy_sue_for_peace',
            outcomeId: `candidate.strategy.sue_for_peace.${BUYER}.1`,
            carriedTermSheet: carriedTermSheet(),
          }],
        },
      },
      spatialLedgers: barren ? {} : {
        demographicPlans: { [SELLER]: { band: 'easy' } },
        satellites: {
          [SELLER]: {
            steadings: {
              'steading.march.1': {
                id: 'steading.march.1', name: 'Stead March', parentId: SELLER, tier: 'thorp',
                population: 44, foundedTick: 1, provenance: 'growth', orbit: 0, inflow: 44,
                backing01: 0.5, history: ['Founded (tick 1).'],
              },
            },
          },
        },
      },
    },
    regionalGraph: ensureRegionalGraph({
      channels: [channel(BUYER, SELLER), channel(SELLER, ASSET), channel(BUYER, ASSET)],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
}

/**
 * EXACTLY WHAT A CONVEYANCE WRITES, AND ONLY WHAT ONLY IT WRITES.
 *
 * THE SCOPE WAS MEASURED, NOT ASSUMED, and the first draft of this projection was wrong
 * in the direction that matters. Hashing the whole occupation record over a real
 * multi-year pulse fails on a perfectly dark world: `resistance`, `stateHeld`,
 * `benefitYield` and `lastTick` are the OCCUPATION KERNEL's own per-tick advance, and it
 * runs every tick with or without WR-10. A projection that reads them cannot tell an
 * occupation ticking normally from a conveyance leaking — the dormancy-golden SCOPE
 * class, which has bitten this estate before. What only a conveyance moves is WHO HOLDS
 * THE THING: the occupier of a vassalage and the parent of a steading.
 *
 * The cession TERM is outside it for the sibling reason: the peace engine mints that
 * document under its OWN flag, so a dark world legitimately holds a treaty saying a town
 * was ceded while the town has not moved. That half is pinned by its receipts elsewhere.
 */
function footprint(worldState) {
  const ws = worldState || {};
  /** @type {Record<string, unknown>} */
  const holders = {};
  for (const id of Object.keys(ws.occupations || {}).sort()) {
    holders[id] = String((ws.occupations[id] || {}).occupierId ?? '');
  }
  /** @type {Record<string, unknown>} */
  const steadings = {};
  const satellites = ws.spatialLedgers?.satellites || {};
  for (const parentId of Object.keys(satellites).sort()) {
    for (const sid of Object.keys(satellites[parentId]?.steadings || {}).sort()) {
      const row = satellites[parentId].steadings[sid] || {};
      steadings[sid] = { parentCell: parentId, parentId: row.parentId, orbit: row.orbit, conveyed: row.conveyed ?? null };
    }
  }
  return { holders, steadings };
}

/** Wall-clock is not world state. `ensureRegionalGraph` stamps `discoveredAt` /
 *  `updatedAt` with `new Date()`, so ANY two runs of ANY configuration differ on those
 *  bytes — measured with a negative control using an engine-unknown flag name, which
 *  reproduced the difference exactly. Stripping them is what lets the differential cover
 *  the graph's SUBSTANCE instead of dropping the graph. Every other byte is compared. */
function stripWallClock(value) {
  if (Array.isArray(value)) return value.map(stripWallClock);
  if (value && typeof value === 'object') {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const key of Object.keys(value).sort()) {
      if (/(?:^|[a-z])(?:At|Timestamp)$/.test(key) && typeof value[key] === 'string') continue;
      out[key] = stripWallClock(value[key]);
    }
    return out;
  }
  return value;
}

/** THE WHOLE PROJECTION, minus only the spelling of the flag itself and the clock. */
function projectionOf(result) {
  const worldState = result.worldState || {};
  const rules = { ...(worldState.simulationRules || {}) };
  delete rules[FLAG];
  return normalizeForDormancy(stripWallClock({
    worldState: { ...worldState, simulationRules: rules },
    settlementUpdates: result.settlementUpdates || [],
    wizardNews: result.wizardNews || {},
    regionalGraph: result.regionalGraph || {},
  }));
}

/** Drive TICKS one-week pulses and return the last result plus the world we started from. */
function run(mode, opts = {}) {
  let campaign = campaignFor(mode, opts);
  const before = campaign.worldState;
  let saves = [
    save(BUYER, { tier: 'city', population: 9000 }),
    save(SELLER, { starving: true }),
    save(ASSET, { population: 1200 }),
  ];
  /** @type {Record<string, unknown>} */
  let last = { worldState: campaign.worldState, settlementUpdates: [], wizardNews: campaign.wizardNews };
  for (let t = 0; t < TICKS; t += 1) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph, wizardNews: r.wizardNews };
    last = r;
  }
  return { before, last };
}

// ═══════════════════════════════════════════════════════════════════════════════
describe('WR-10w wave close — the whole wave stays dark for two years', () => {
  const absent = run('absent');
  const explicitFalse = run('false');
  const lit = run('lit');

  it('THE RUN IS REAL: the world genuinely advances 110 ticks in every configuration', () => {
    for (const [label, driven] of [['absent', absent], ['false', explicitFalse], ['lit', lit]]) {
      expect(Number(driven.last.worldState.tick), `${label}: the calendar moved`).toBeGreaterThan(100);
    }
  });

  it('OWN FOOTPRINT — dark, nothing WR-10 can write has moved after two years', () => {
    for (const [label, driven] of [['absent', absent], ['false', explicitFalse]]) {
      expect(hashOf(footprint(driven.last.worldState)), `${label}: the WR-10 surface is where it started`)
        .toBe(hashOf(footprint(driven.before)));
      expect(driven.last.worldState.occupations[ASSET].occupierId, `${label}: the holder never changed`)
        .toBe(SELLER);
    }
  });

  it('DIFFERENTIAL — absent and explicitly false are byte-identical across the whole run', () => {
    expect(hashOf(projectionOf(explicitFalse.last)), 'the flag spelled false buys nothing')
      .toBe(hashOf(projectionOf(absent.last)));
  });

  it('THE LIT CONTROL — the same world, lit, is measurably different (the fences SEE)', () => {
    // Without this the two assertions above could both be green on a world where the
    // wave has nothing to do — a dormancy proof over an inert fixture, which is the
    // classic vacuity in this class.
    expect(hashOf(footprint(lit.last.worldState)), 'lit, the WR-10 surface moved')
      .not.toBe(hashOf(footprint(lit.before)));
    expect(lit.last.worldState.occupations[ASSET].occupierId, 'lit, the town changed hands')
      .toBe(BUYER);
    expect(hashOf(projectionOf(lit.last)), 'and the whole projection differs from dark')
      .not.toBe(hashOf(projectionOf(absent.last)));
  });

  it('ZERO PRNG DRAWS — lighting the flag over a barren world changes NOTHING', () => {
    // THE STREAM-IDENTITY CLAIM, made observable. The wave declares that it consumes no
    // PRNG stream in either configuration (every stochastic choice is a keyed `hash01`,
    // which holds no stream state), so the kernel's fork order never moves. There is no
    // rng cursor on worldState to read — measured, not assumed — so the claim is tested
    // where it bites instead: a world with NOTHING for the wave to do is driven for two
    // years with the flag lit and with it absent, and every byte of both runs must
    // agree. One stolen draw anywhere in 110 ticks would shift every downstream
    // consumer of that stream and this hash with it.
    const barrenLit = run('lit', { barren: true });
    const barrenDark = run('absent', { barren: true });
    expect(hashOf(projectionOf(barrenLit.last)), 'a lit world with no holdings is the dark world')
      .toBe(hashOf(projectionOf(barrenDark.last)));
    // NON-VACUITY: the identical comparison DIVERGES on the substrate world above, so a
    // green here is the wave taking no draws rather than a projection reading nothing.
    expect(hashOf(projectionOf(lit.last))).not.toBe(hashOf(projectionOf(absent.last)));
  });
});
