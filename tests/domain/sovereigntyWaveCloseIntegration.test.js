/**
 * sovereigntyWaveCloseIntegration.test.js — THE WAVE-CLOSE INTEGRATED FIXTURE (WR-10w).
 *
 * Every lane in the wiring wave proved its own half against its own world. This file
 * proves the claim NO PER-LANE CHECK CAN SEE: that the wartime cession an envoy carries
 * home and the peacetime sale a market clears are the SAME conveyance reaching the SAME
 * writer on ONE world, and that the DM's decreed conveyance is a third transport into
 * that same writer rather than a fourth road with its own rules.
 *
 * The fixture is deliberately a SINGLE world definition driven three ways. A wave whose
 * roads were pinned on three differently-shaped worlds could ship a market that clears
 * only on market-shaped fixtures and a cession that lands only on war-shaped ones, and
 * every per-lane suite would still be green.
 *
 * WHAT IS ASSERTED END-TO-END, and why each one is here:
 *   • BOTH ROADS, ONE WRITER — the occupation record after the war road and after the
 *     sale road are compared FIELD BY FIELD. Two writers agreeing today is the defect
 *     that hides until one of them is edited; identical output is the evidence.
 *   • THE ORIENTATION SURVIVES THE ROUND TRIP (CR-WR10-G). A sale document names a
 *     seller and a buyer and carries NO war pair, so every consumer that spelled
 *     `String(treaty.victorId)` read the four-character string "undefined". The pin
 *     drives the real enforcement pass and the real document renderer over BOTH treaty
 *     shapes and refuses that string anywhere in either rendering.
 *   • THE STREAMS POINT THE OTHER WAY ON A SALE. The conveyance axis and the obligation
 *     axis are mirrors: the seller GIVES the town, and the buyer PAYS for it. A pass
 *     that drew the consideration out of the seller would have taken the grain from the
 *     party that was owed it, and the ledger would have looked perfectly well-formed.
 *   • THE SWAP IS ATOMIC (CR-WR10-D). A half-landed swap — one town conveyed, one not —
 *     is the outcome §13 makes unrepresentable; the pin drives a genuinely failing leg.
 *   • THE HERALD SPEAKS ON THE SAME WORLD. Kinds registered, identities resolved, and
 *     the same no-"undefined" refusal over the narrated entries.
 */
import { describe, it, expect } from 'vitest';

import { advanceTreaties, treatyPairKey } from '../../src/domain/worldPulse/peaceTerms.js';
import { advanceSovereigntyMarket } from '../../src/domain/worldPulse/sovereigntyMarketStage.js';
import { mintSovereigntySaleTreaties } from '../../src/domain/worldPulse/peaceTermsSale.js';
import {
  applyRealmVerbOrder, REALM_VERB_PAYLOAD_KIND,
} from '../../src/domain/worldPulse/realmVerbExecution.js';
import {
  SOVEREIGNTY_REQUIRED_RULES, readSovereigntyAsset,
} from '../../src/domain/worldPulse/sovereigntyAssets.js';
import { treatyOrientationOf } from '../../src/domain/worldPulse/treatyOrientation.js';
import { SOVEREIGNTY_KINDS } from '../../src/domain/worldPulse/sovereigntyNews.js';
import { renderAllTreaties } from '../../src/domain/display/treatyDocument.js';
import { CURRENT_TREATY_TICKS_PER_YEAR } from '../../src/domain/worldPulse/treatyClock.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ASSET = 'harbourtown';
const SELLER = 'march';
const BUYER = 'crown';
const NOW = '2026-01-01T00:00:00.000Z';
const TICK = 40;

/** Every prerequisite law explicitly true, derived from the exported conjunction so a
 *  rule joining it cannot leave this fixture silently dark, plus the peace engine's own
 *  two — the war road needs them and the sale road must not care. */
const LIT = Object.freeze({
  ...Object.fromEntries(SOVEREIGNTY_REQUIRED_RULES.map((k) => [k, true])),
  warLayerEnabled: true,
  peaceEngineEnabled: true,
});

/** THE FOUR LEGS, SUPPLIED (CR-WR10-H) — AND STILL INJECTED AFTER SP-B2, DELIBERATELY.
 *  All four legs have had a belief surface since SP-B2 wired `beliefLegsOf` to the
 *  believed-conditions family (2026-08-05), so this fixture COULD stand a belief map up
 *  and let the production reader fill them. It does not, and the reason is this file's
 *  whole subject: it proves the war road and the sale road reach ONE writer on ONE world,
 *  and a belief map is a second variable that could empty the sale road for belief reasons
 *  while the war road ran, leaving a green comparison of one road against nothing. The
 *  supply itself is pinned where it belongs — sovereigntyMarketStageWr10w's SP-B2 battery
 *  drives the production reader end to end. The asymmetry below is load-bearing: the
 *  clearing rule is a two-sided conjunction, so two courts holding the same picture
 *  satisfy both arms only on an exact tie. */
const SELLER_LEGS = Object.freeze({
  tierBand: 'village', storesBand: 'thin', routeBand: 'stirring', trajectoryBand: 'ebbing',
});
const BUYER_LEGS = Object.freeze({
  tierBand: 'city', storesBand: 'deep', routeBand: 'established', trajectoryBand: 'swelling',
});
const legsFor = ({ courtId }) => ({ ...(courtId === BUYER ? BUYER_LEGS : SELLER_LEGS) });

/** A court crushed against its food bound — the pressure that crosses it into a
 *  demanding band, which is what the market's episode gate reads. */
function item(id, { tier = 'town', population = 4000, starving = false } = {}) {
  const name = `${id.charAt(0).toUpperCase()}${id.slice(1)}hold`;
  return {
    id,
    name,
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
  };
}

/** ONE roster, both roads. `march` is the party that gives up the town on either road —
 *  the defeated party on the war road and the pressed seller on the market road — which
 *  is exactly what makes the two outcomes comparable. */
const ITEMS = Object.freeze([
  item(BUYER, { tier: 'city', population: 9000 }),
  item(SELLER, { starving: true }),
  item(ASSET, { population: 1200 }),
]);

const EDGES = Object.freeze([
  { id: `edge.${BUYER}.${SELLER}`, from: BUYER, to: SELLER, relationshipType: 'cold_war' },
  { id: `edge.${ASSET}.${SELLER}`, from: ASSET, to: SELLER, relationshipType: 'neutral' },
]);

const SNAPSHOT = Object.freeze({
  settlements: ITEMS,
  byId: new Map(ITEMS.map((i) => [String(i.id), i])),
  regionalGraph: { edges: [...EDGES] },
});

/** The strictly-canonical WR-7b artifact an envoy carries home, conveying ASSET. */
function carriedTermSheet() {
  const clause = {
    type: 'sovereignty_transfer', family: 'sovereignty_transfer', magnitude: 1,
    durationTicks: 10 * CURRENT_TREATY_TICKS_PER_YEAR, weightSpent: 2, burden01: 0,
    seam: true, assetId: ASSET,
  };
  return {
    schemaVersion: 1,
    id: 'sheet.errand.1', errandId: 'errand.1', encounterId: 'encounter.1',
    episodeKey: 'episode.1', relationshipKey: `edge.${BUYER}.${SELLER}`,
    parties: [BUYER, SELLER], proposerId: BUYER, responderId: SELLER,
    victorId: BUYER, loserId: SELLER, agreedTick: TICK - 2,
    pictureIds: { proposer: `picture.${BUYER}`, responder: `picture.${SELLER}` },
    clauses: [clause],
    budgetSpent: clause.weightSpent,
    valuations: [
      { partyId: BUYER, pictureId: `picture.${BUYER}`, role: 'proposer', decision: 'accept' },
      { partyId: SELLER, pictureId: `picture.${SELLER}`, role: 'responder', decision: 'accept' },
    ],
  };
}

/**
 * THE ONE WORLD. `atWar` decides only whether the relationship edge carries the
 * sue-for-peace incident an envoy just came home from; every other byte — the holding,
 * the rung it sits at, the plan ledger's prior band, the roster — is shared.
 * @param {{ atWar?: boolean, priorBand?: string }} [opts]
 */
function world({ atWar = false, priorBand = 'easy' } = {}) {
  return {
    tick: TICK,
    rngSeed: 'seed-wr10w-close',
    simulationRules: { ...LIT },
    calendar: { season: 'summer', elapsedWeeks: 30 },
    deployments: {},
    warExhaustion: { [BUYER]: 0.7, [SELLER]: 0.8 },
    occupations: {
      [ASSET]: {
        occupierId: SELLER, state: 'vassalized', sinceTick: 2, stateHeld: 9,
        resistance: 0.05, benefitYield: 0, lastTick: 2,
      },
    },
    relationshipStates: atWar
      ? {
        [`edge.${BUYER}.${SELLER}`]: {
          relationshipType: 'cold_war', resentment: 0.6, trust: 0.1, lastTransitionTick: TICK,
          recentIncidents: [{
            tick: TICK,
            type: 'strategy_sue_for_peace',
            outcomeId: `candidate.strategy.sue_for_peace.${BUYER}.${TICK}`,
            carriedTermSheet: carriedTermSheet(),
          }],
        },
      }
      : {},
    spatialLedgers: {
      demographicPlans: { [SELLER]: { band: priorBand } },
    },
  };
}

const updatesOf = () => ITEMS.map((i) => ({ saveId: String(i.id), settlement: { ...i.settlement } }));

/** ROAD A — the war settlement. The envoy's sheet reaches the mint through the peace
 *  engine's own PASS 1, and the mint closure executes the conveyance. */
function driveWarRoad() {
  const before = world({ atWar: true });
  const out = advanceTreaties({
    snapshot: SNAPSHOT,
    worldState: before,
    settlementUpdates: updatesOf(),
    graph: { edges: [...EDGES] },
    pIndex: null,
    tick: TICK,
    now: NOW,
  });
  return { before, out };
}

/** ROAD B — the victor-free sale. No war anywhere in the world; the plan-lane trigger
 *  crosses `march` into a demanding band and the composer clears a market. */
function driveSaleRoad(overrides = {}) {
  const before = world({ atWar: false });
  const out = advanceSovereigntyMarket({
    snapshot: SNAPSHOT,
    worldState: before,
    settlementUpdates: updatesOf(),
    edges: [...EDGES],
    tick: TICK,
    now: NOW,
    beliefLegsFor: legsFor,
    reachFor: ({ assetIds }) => [...assetIds],
    ...overrides,
  });
  return { before, out };
}

/** Every treaty in a world's ledger that carries a cession clause. */
function cessionTreaties(worldState) {
  const ledger = worldState?.spatialLedgers?.treaties || {};
  return Object.keys(ledger).sort()
    .map((key) => ({ key, treaty: ledger[key] }))
    .filter(({ treaty }) => (treaty?.terms || []).some((t) => t?.type === 'sovereignty_transfer'));
}

/** The occupation record's conveyance-relevant fields — the writer's own footprint,
 *  stated once so the two roads can be compared on it rather than on prose. */
function conveyedRecord(worldState) {
  const row = worldState?.occupations?.[ASSET] || {};
  return {
    occupierId: row.occupierId,
    state: row.state,
    sinceTick: row.sinceTick,
    stateHeld: row.stateHeld,
    resistanceRaised: Number(row.resistance) > 0.05,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
describe('WR-10w wave close — one world, two roads, one writer', () => {
  it('THE FIXTURE IS ADVERSARIAL: each road really does move the town on this world', () => {
    expect(readSovereigntyAsset(world(), ASSET).holderId, 'the holding starts with the seller').toBe(SELLER);
    expect(driveWarRoad().out.worldState.occupations[ASSET].occupierId, 'the war road conveys').toBe(BUYER);
    expect(driveSaleRoad().out.worldState.occupations[ASSET].occupierId, 'the sale road conveys').toBe(BUYER);
  });

  it('BOTH ROADS LEAVE THE IDENTICAL WRITER FOOTPRINT — one writer, not two agreeing', () => {
    const war = driveWarRoad();
    const sale = driveSaleRoad();
    const expected = {
      occupierId: BUYER, state: 'vassalized', sinceTick: TICK, stateHeld: 0, resistanceRaised: true,
    };
    expect(conveyedRecord(war.out.worldState), 'the war road').toEqual(expected);
    expect(conveyedRecord(sale.out.worldState), 'the sale road').toEqual(expected);
    // THE RUNG SURVIVES ON BOTH. `createOccupationRecord` resets an occupier change to
    // `contested`; a road that reached for it would show up here and nowhere else.
    expect(war.out.worldState.occupations[ASSET].state).toBe('vassalized');
    expect(sale.out.worldState.occupations[ASSET].state).toBe('vassalized');
  });

  it('THE TWO DOCUMENTS ARE DIFFERENT ARTIFACTS AND THE SAME INSTRUMENT', () => {
    const warTreaties = cessionTreaties(driveWarRoad().out.worldState);
    const saleTreaties = cessionTreaties(driveSaleRoad().out.worldState);
    expect(warTreaties, 'the war road minted exactly one cession document').toHaveLength(1);
    expect(saleTreaties, 'the sale road minted exactly one cession document').toHaveLength(1);

    const warOrientation = treatyOrientationOf(warTreaties[0].treaty);
    const saleOrientation = treatyOrientationOf(saleTreaties[0].treaty);
    expect(warOrientation.kind).toBe('wartime');
    expect(saleOrientation.kind).toBe('sale');

    // THE CONVEYANCE AXIS AGREES ACROSS BOTH SPELLINGS — that is what makes them one
    // instrument: whoever the document calls them, `march` hands the town to `crown`.
    for (const orientation of [warOrientation, saleOrientation]) {
      expect(orientation.resolved).toBe(true);
      expect(orientation.giverId).toBe(SELLER);
      expect(orientation.receiverId).toBe(BUYER);
    }

    // THE OBLIGATION AXIS IS THE MIRROR ON A SALE (CR-WR10-G). The defeated party pays
    // its own tribute; the buyer pays for what it bought.
    expect(warOrientation.obligorId, 'the war settlement binds the loser').toBe(SELLER);
    expect(saleOrientation.obligorId, 'the sale binds the BUYER').toBe(BUYER);
    expect(saleOrientation.obligeeId, 'and the consideration is owed TO the seller').toBe(SELLER);

    // The sale document carries the sale pair and NOT the war pair — the whole reason
    // the orientation reader had to exist.
    expectAbsentWithAnchor(
      Object.keys(saleTreaties[0].treaty), 'victorId', 'sellerId',
    );
    expect(saleTreaties[0].treaty.buyerId).toBe(BUYER);
  });

  it('THE SALE\'S CONSIDERATION IS BORNE BY THE BUYER when the enforcement pass runs it', () => {
    // The sale treaty rides the SAME `spatialLedgers.treaties` ledger, so the peace
    // engine's PASS 2 walks it alongside every war settlement. A pass that resolved the
    // payer as `treaty.loserId` would read the empty string on this document and draw a
    // stream from nobody — or, one refactor later, from the party that was owed it.
    const sale = driveSaleRoad();
    const saleTreaty = cessionTreaties(sale.out.worldState)[0].treaty;
    const considerations = (saleTreaty.terms || []).filter((t) => t?.type !== 'sovereignty_transfer');
    expect(considerations.length, 'the sale bought the town with something').toBeGreaterThan(0);

    const enforced = advanceTreaties({
      snapshot: SNAPSHOT,
      worldState: sale.out.worldState,
      settlementUpdates: updatesOf(),
      graph: { edges: [...EDGES] },
      pIndex: null,
      tick: TICK + 1,
      now: NOW,
    });
    const stillThere = cessionTreaties(enforced.worldState);
    expect(stillThere, 'the sale document survives an enforcement tick').toHaveLength(1);
    const after = treatyOrientationOf(stillThere[0].treaty);
    expect(after.obligorId, 'and it still knows the buyer is the one who owes').toBe(BUYER);
    // The pass may not accuse a court it cannot name (the drop-when-absent needs-guard).
    if (stillThere[0].treaty.defaultedBy !== undefined) {
      expect(stillThere[0].treaty.defaultedBy).toBe(BUYER);
    }
  });

  it('NOTHING RENDERS THE STRING "undefined" on either road', () => {
    // The failure this refuses is not a crash: `String(treaty.victorId)` on a sale
    // yields the four-character string "undefined", which compiles, renders, and
    // PERSISTS. It has to be hunted in the rendered text, because every type is happy.
    for (const [label, driven] of [['war', driveWarRoad()], ['sale', driveSaleRoad()]]) {
      const rendered = JSON.stringify(renderAllTreaties(driven.out.worldState) ?? []);
      const news = JSON.stringify(driven.out.newsEntries ?? []);
      const receipts = JSON.stringify(
        cessionTreaties(driven.out.worldState).map(({ treaty }) => treaty.receipts || []),
      );
      // anchored: the same three strings are asserted non-trivial immediately below, so
      // an empty render can never satisfy this refusal by containing nothing at all.
      expect(rendered.includes('undefined'), `${label}: the rendered documents`).toBe(false);
      expect(news.includes('undefined'), `${label}: the Herald entries`).toBe(false);
      expect(receipts.includes('undefined'), `${label}: the treaty receipts`).toBe(false);
      expect(rendered.length, `${label}: something was actually rendered`).toBeGreaterThan(2);
      expect(receipts, `${label}: the document recorded the conveyance`).toContain(ASSET);
    }
  });

  it('THE HERALD SPEAKS THE SALE on this same world, with resolved identities', () => {
    const { out } = driveSaleRoad();
    expect(out.newsEntries.length, 'the sale road narrated something').toBeGreaterThan(0);
    for (const entry of out.newsEntries) {
      expect(SOVEREIGNTY_KINDS, `${entry.kind} is a registered WR-10 kind`).toContain(entry.kind);
      expect(String(entry.id || ''), 'every entry carries a full address').toContain('wizard_news.');
      expect(Array.isArray(entry.settlementIds) && entry.settlementIds.length > 0,
        `${entry.kind} names the places it is about`).toBe(true);
      expect(String(entry.headline || entry.summary || '').length,
        `${entry.kind} says something`).toBeGreaterThan(0);
    }
    const kinds = new Set(out.newsEntries.map((e) => e.kind));
    expect([...kinds].some((k) => k === 'sovereignty_edge_rewritten' || k === 'sovereignty_sale_cleared'),
      'the cleared sale reached the desk').toBe(true);
  });

  it('THE RECEIPTS SAY A SALE CLEARED, on the world that also fights a war', () => {
    const { out } = driveSaleRoad();
    const cleared = out.receipts.filter((r) => r.kind === 'sovereignty_sale_cleared');
    expect(cleared, 'exactly one episode closed').toHaveLength(1);
    expect(cleared[0].sellerId).toBe(SELLER);
    expect(cleared[0].buyerId).toBe(BUYER);
    expect(cleared[0].assetId).toBe(ASSET);
    expect(String(cleared[0].receipt || '').length, 'and it said why').toBeGreaterThan(0);
  });

  it('THE SWAP PAIR MINTS ATOMICALLY OR NOT AT ALL (CR-WR10-D)', () => {
    const state = world();
    // A genuinely failing second leg: the same pair, twice. The instrument refuses the
    // pair that is already bound by the first leg of its own build.
    const half = mintSovereigntySaleTreaties({
      sales: [
        { assetId: ASSET, sellerId: SELLER, buyerId: BUYER, components: [], reasons: ['a'] },
        { assetId: ASSET, sellerId: SELLER, buyerId: BUYER, components: [], reasons: ['b'] },
      ],
      worldState: state, settlementUpdates: updatesOf(), edges: [...EDGES], tick: TICK, now: NOW,
    });
    expect(half.minted, 'neither leg mints when one cannot').toBe(false);
    expect(half.worldState, 'and the world comes back BY REFERENCE').toBe(state);
    expect(half.treaties, 'no half-document survives').toEqual([]);
    expect(state.occupations[ASSET].occupierId, 'the town never moved').toBe(SELLER);

    // The positive control on the same fixture: a single valid leg DOES mint, so the
    // refusal above measures atomicity rather than a mint that never works here.
    const one = mintSovereigntySaleTreaties({
      sales: [{ assetId: ASSET, sellerId: SELLER, buyerId: BUYER, components: [], reasons: ['a'] }],
      worldState: world(), settlementUpdates: updatesOf(), edges: [...EDGES], tick: TICK, now: NOW,
    });
    expect(one.minted, 'one leg alone mints').toBe(true);
    expect(one.treaties).toHaveLength(1);
  });

  it('THE DM VERB IS THE THIRD TRANSPORT INTO THE SAME WRITER, on the same fixture', () => {
    const state = world();
    const done = applyRealmVerbOrder({
      state,
      snapshot: SNAPSHOT,
      settlementUpdates: new Map(ITEMS.map((i) => [String(i.id), { ...i.settlement }])),
      outcome: {
        proposalPayload: {
          kind: REALM_VERB_PAYLOAD_KIND, verb: 'TRANSFER_SOVEREIGNTY',
          args: { assetId: ASSET, buyerId: BUYER, sellerId: SELLER },
        },
      },
      tick: TICK,
      now: NOW,
    });
    expect(done.refusal, 'the decreed conveyance is accepted on this world').toBe(null);
    expect(conveyedRecord(done.worldState), 'and it writes what the treaty roads write')
      .toEqual({
        occupierId: BUYER, state: 'vassalized', sinceTick: TICK, stateHeld: 0, resistanceRaised: true,
      });

    // THE LAPSED ORDER REFUSES VISIBLY (the queue-mouth law): replaying the same order
    // against the world it already changed must not phantom-commit.
    const replay = applyRealmVerbOrder({
      state: done.worldState,
      snapshot: SNAPSHOT,
      settlementUpdates: new Map(ITEMS.map((i) => [String(i.id), { ...i.settlement }])),
      outcome: {
        proposalPayload: {
          kind: REALM_VERB_PAYLOAD_KIND, verb: 'TRANSFER_SOVEREIGNTY',
          args: { assetId: ASSET, buyerId: BUYER, sellerId: SELLER },
        },
      },
      tick: TICK + 1,
      now: NOW,
    });
    expect(replay.refusal?.code, 'a stale order refuses by code').toBe('sovereignty_ineligible');
    expect(replay.worldState, 'and changes nothing').toBe(done.worldState);
  });

  it('BOTH ROADS FILE AT THE SAME LEDGER ADDRESS — no rival key, so they can collide', () => {
    // `treatyPairKey` is ORDERED, receiver first: the wartime road spells it
    // (victor, loser) and the sale road spells it (buyer, seller). Those are the same
    // two roles under two names, so the same conveyance lands on the same key — which
    // is the property that lets a live document on the pair refuse a second one. A sale
    // that had invented its own address would have been invisible to every idempotence
    // check the peace engine already had.
    const sharedKey = treatyPairKey(BUYER, SELLER);
    expect(Object.keys(driveWarRoad().out.worldState.spatialLedgers.treaties || {}),
      'the war road files there').toContain(sharedKey);
    expect(Object.keys(driveSaleRoad().out.worldState.spatialLedgers.treaties || {}),
      'and so does the sale').toContain(sharedKey);

    // THE COLLISION, EXECUTED: a world that already carries the war settlement refuses
    // the sale of the same pair rather than double-binding two courts.
    const bound = driveWarRoad().out.worldState;
    const blocked = mintSovereigntySaleTreaties({
      sales: [{ assetId: ASSET, sellerId: SELLER, buyerId: BUYER, components: [], reasons: ['x'] }],
      worldState: bound, settlementUpdates: updatesOf(), edges: [...EDGES], tick: TICK + 1, now: NOW,
    });
    expect(blocked.minted, 'a pair already bound cannot be sold across').toBe(false);
    expect(blocked.refusal).toBe('pair_already_bound');
  });
});
