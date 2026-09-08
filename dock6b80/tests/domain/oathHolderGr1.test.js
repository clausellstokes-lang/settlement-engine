/**
 * oathHolderGr1.test.js — GR-1 THE OATH-HOLDER IDENTITY, the behavioural battery.
 *
 * Charter: docs/DESIGN_FP_ARCHITECTURE.md §5 wave #9. Fine grain:
 * docs/DESIGN_FP_ARCH_GR.md §5 GR-1. Design law: docs/DESIGN_FP_GRAMMAR.md §GR-1
 * ("Pins (negative hardest)").
 *
 * WHAT THIS FILE HAS TO MAKE GOOD, and why each pin is shaped the way it is:
 *
 *   THE READ IS REACHABLE. The composition (governing faction → seated members →
 *   codepoint pick → durable id) is only worth anything if ordinary worlds satisfy it.
 *   A build-time probe over five really-generated settlements found a governing faction
 *   and one or two seated npcs in every one; the fixtures below are shaped to match
 *   what that probe measured rather than to whatever would make a pin pass.
 *
 *   ALL THREE DOORS STAMP. The treaty writer family has three mint roads, and a
 *   signature line that depended on which road a peace came home by would be the exact
 *   defect the charter's "stamp totality across all three doors" exists to forbid. Each
 *   road is DRIVEN here, lit, end to end — never asserted from a source scan.
 *
 *   THE NEGATIVES ARE THE HARD PART. Legacy treaties are never backfilled; a dark world
 *   grows no key at all; a death rewrites nothing. Each of those is an absence, so each
 *   is paired with the positive that proves the machinery was live and would have
 *   written had it been entitled to (the anchored-negative discipline).
 *
 *   THE PROMISE. Same seed, same world, same person on the parchment — pinned by
 *   re-deriving the world and re-minting, not by re-reading one object twice.
 */
import { describe, expect, it } from 'vitest';

import { advanceTreaties } from '../../src/domain/worldPulse/peaceTerms.js';
import { mintSovereigntySaleTreaties } from '../../src/domain/worldPulse/peaceTermsSale.js';
import {
  oathHolderActive, oathHolderOf, stampSworn, swornPartiesOf,
} from '../../src/domain/worldPulse/oathHolder.js';
import { CURRENT_TREATY_TICKS_PER_YEAR } from '../../src/domain/worldPulse/treatyClock.js';
import { DURABLE_NPC_ID_PREFIX } from '../../src/domain/worldPulse/npcLedger.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const WAR = { warLayerEnabled: true, peaceEngineEnabled: true };
const LIT = { ...WAR, oathHolderEnabled: true };
const TICK = 40;

/**
 * A roster entry. `factionAffiliation` is the generator's canonical affiliation handle,
 * which is what `npcInFaction` matches on — the sanctioned helper, never a hand-rolled
 * name comparison (this estate's faction-key defect class).
 */
const npc = (id, name, affiliation, extra = {}) => ({
  id, name, factionAffiliation: affiliation, role: 'official', ...extra,
});

/**
 * A snapshot item with a governing faction and a roster. `seat` names the governing
 * faction exactly as the generator spells it (`.faction`), and every roster entry whose
 * affiliation matches it is a seat-holder.
 */
function item(id, { seat = 'military seat', roster = [], rival = null, tier = 'town', population = 1800 } = {}) {
  const factions = [{ faction: seat, category: 'military', power: 78, isGoverning: true }];
  if (rival) factions.push({ faction: rival, category: 'civic', power: 40 });
  return {
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    settlement: {
      name: id, tier, population,
      config: { tradeRouteAccess: 'road', priorityMilitary: 35 },
      institutions: [{ name: 'State Granary', type: 'economic' }],
      economicState: {
        prosperity: 'Prosperous', primaryExports: [{ name: 'Grain' }], primaryImports: [],
        foodSecurity: { storageMonths: 8, dailyNeed: 100, dailyProduction: 100, deficitPct: 0, surplusPct: 0, resilienceScore: 50 },
      },
      powerStructure: { publicLegitimacy: { score: 60, label: 'Stable' }, factions, conflicts: [] },
      npcs: roster,
      activeConditions: [],
    },
  };
}

const IRON_ROSTER = [
  npc('npc_3', 'Merek Vance', 'military seat'),
  npc('npc_1', 'Aldric Thorne', 'military seat'),
  npc('npc_9', 'Sela Crane', 'civic assembly'),
];
const WEAK_ROSTER = [npc('npc_2', 'Bregan Holt', 'military seat')];

// A REAL believed margin, so PASS 1 mints a dictated peace rather than a white one:
// the mint is what carries the stamp, and a fixture that never mints would make every
// stamp pin below vacuous.
const ironItem = () => item('iron', {
  roster: IRON_ROSTER.map((n) => ({ ...n })), rival: 'civic assembly',
  tier: 'city', population: 60000,
});
const weakItem = () => item('weak', { roster: WEAK_ROSTER.map((n) => ({ ...n })), tier: 'village', population: 280 });

const edge = (from, to, type = 'hostile') => ({ id: `edge.${from}.${to}`, from, to, relationshipType: type });
const snapshotFor = (items, edges = []) => ({
  settlements: items,
  byId: new Map(items.map((i) => [String(i.id), i])),
  regionalGraph: { edges },
});

/** A world whose iron↔weak war has JUST ended by a negotiated peace this tick. */
function suingWorld(rules, carried = null) {
  const key = 'edge.iron.weak';
  return {
    tick: TICK,
    rngSeed: 'seed-gr1',
    simulationRules: { ...rules },
    calendar: { elapsedWeeks: 30 },
    deployments: {},
    warExhaustion: { iron: 0.7, weak: 0.8 },
    relationshipStates: {
      [key]: {
        relationshipType: 'cold_war', resentment: 0.6, trust: 0.1, lastTransitionTick: TICK,
        recentIncidents: [{
          tick: TICK,
          type: 'strategy_sue_for_peace',
          outcomeId: `candidate.strategy.sue_for_peace.iron.${TICK}`,
          ...(carried ? { carriedTermSheet: carried } : {}),
        }],
      },
    },
  };
}

/** The strictly-canonical WR-7b artifact an envoy carries home (the SECOND mint road). */
function carriedTermSheet() {
  const clause = {
    type: 'non_aggression', family: 'security', magnitude: 1,
    durationTicks: 8 * CURRENT_TREATY_TICKS_PER_YEAR, weightSpent: 0.4, burden01: 0,
  };
  return {
    schemaVersion: 1,
    id: 'sheet.errand.1', errandId: 'errand.1', encounterId: 'encounter.1',
    episodeKey: 'episode.1', relationshipKey: 'edge.iron.weak',
    parties: ['iron', 'weak'], proposerId: 'iron', responderId: 'weak',
    victorId: 'iron', loserId: 'weak', agreedTick: TICK - 2,
    pictureIds: { proposer: 'picture.iron', responder: 'picture.weak' },
    clauses: [clause],
    budgetSpent: clause.weightSpent,
    valuations: [
      { partyId: 'iron', pictureId: 'picture.iron', role: 'proposer', decision: 'accept' },
      { partyId: 'weak', pictureId: 'picture.weak', role: 'responder', decision: 'accept' },
    ],
  };
}

/** Drive PASS 1 of the mover and return the treaties ledger it wrote. */
function mintThroughMover(rules, { carried = null } = {}) {
  const items = [ironItem(), weakItem()];
  const edges = [edge('iron', 'weak')];
  const out = advanceTreaties({
    snapshot: snapshotFor(items, edges),
    worldState: suingWorld(rules, carried),
    settlementUpdates: [],
    graph: { edges },
    pIndex: null,
    tick: TICK,
    now: '2026-01-01T00:00:00.000Z',
  });
  return getSpatialLedger(out.worldState, 'treaties') || {};
}

/** Drive the THIRD mint road — the victor-free sale. */
function mintThroughSale(rules) {
  const items = [ironItem(), weakItem()];
  const byId = new Map(items.map((i) => [String(i.id), i]));
  return mintSovereigntySaleTreaties({
    sales: [{ assetId: 'holding', sellerId: 'weak', buyerId: 'iron', components: [{ family: 'economic', magnitude01: 0.5 }] }],
    worldState: { simulationRules: { ...rules } },
    tick: TICK,
    settlementOf: (id) => byId.get(id)?.settlement || null,
  });
}

const onlyTreaty = (ledger) => Object.values(ledger)[0];

// ── A) THE READ — the four-step composition and its null contract ─────────────

describe('GR-1 the oath-holder read', () => {
  it('composes the governing faction, its seated members, and a codepoint-stable pick', () => {
    const holder = oathHolderOf({}, 'iron', ironItem().settlement);
    // npc_1 < npc_3 by codepoint among the SEAT's members; npc_9 sits in the rival
    // faction and is not a candidate at all.
    expect(holder).toEqual({ npcId: 'npc_1', name: 'Aldric Thorne' });
  });

  it('the pick is blind to roster ORDER, which is what makes it stable', () => {
    const forward = ironItem().settlement;
    const reversed = { ...forward, npcs: [...forward.npcs].reverse() };
    // Same cast, different array. A pick that read position would disagree here, and a
    // regenerated world is exactly a world whose arrays were rebuilt.
    expect(oathHolderOf({}, 'iron', reversed)).toEqual(oathHolderOf({}, 'iron', forward));
    expect(oathHolderOf({}, 'iron', reversed).npcId).toBe('npc_1');
  });

  it('the seat is read through the governing faction, never through the loudest one', () => {
    const s = ironItem().settlement;
    // ANCHOR: the rival faction's member IS on the roster and IS matched by the sanctioned
    // affiliation helper — it is excluded because it does not hold the seat, not because
    // the roster is empty or the matcher stopped working.
    const rosterIds = s.npcs.map((n) => n.id);
    expectAbsentWithAnchor(
      [oathHolderOf({}, 'iron', s).npcId], 'npc_9', 'npc_1',
      'the civic member is on the roster but does not hold the seat',
    );
    expect(rosterIds).toContain('npc_9');
  });

  it('NULL is the contract at every step that can fail — never an invented name', () => {
    const noFaction = { ...ironItem().settlement, powerStructure: { factions: [] } };
    const noGoverning = {
      ...ironItem().settlement,
      powerStructure: { factions: [{ faction: 'civic assembly', category: 'civic', power: 40 }] },
    };
    const emptyRoster = { ...ironItem().settlement, npcs: [] };
    const idlessRoster = { ...ironItem().settlement, npcs: [{ name: 'Nameless', factionAffiliation: 'military seat' }] };
    expect(oathHolderOf({}, 'iron', noFaction)).toBeNull();
    expect(oathHolderOf({}, 'iron', noGoverning)).toBeNull();
    expect(oathHolderOf({}, 'iron', emptyRoster)).toBeNull();
    expect(oathHolderOf({}, 'iron', idlessRoster)).toBeNull();
    expect(oathHolderOf({}, '', ironItem().settlement)).toBeNull();
    expect(oathHolderOf({}, 'iron', null)).toBeNull();
    expect(oathHolderOf({}, 'iron', undefined)).toBeNull();
    // GUARD THE GUARD: the same read on the same shape WITH a seated member resolves, so
    // the six nulls above are refusals rather than a read that stopped working.
    expect(oathHolderOf({}, 'iron', ironItem().settlement)).toBeTruthy();
  });

  it('takes the H1 DURABLE id when the person has graduated, and the roster id otherwise', () => {
    const ungraduated = oathHolderOf({}, 'iron', ironItem().settlement);
    expect(ungraduated.npcId).toBe('npc_1');
    // A ledger carrying a graduated record for the SAME (settlementId, rosterId, name).
    const graduated = {
      spatialLedgers: {
        npcLedger: {
          placed: {},
          roamers: {
            [`${DURABLE_NPC_ID_PREFIX}deadbeef`]: {
              originRef: { settlementId: 'iron', rosterId: 'npc_1', name: 'Aldric Thorne' },
            },
          },
        },
      },
    };
    const durable = oathHolderOf(graduated, 'iron', ironItem().settlement);
    expect(durable.npcId).toBe(`${DURABLE_NPC_ID_PREFIX}deadbeef`);
    expect(durable.name).toBe('Aldric Thorne');
    // The durable id is a PREFERENCE, not a gate: the ungraduated read above still named
    // a person. Reading it as a gate would have made the whole stamp unreachable, since
    // graduation is itself behind another dark flag.
    expect(ungraduated.name).toBe(durable.name);
  });
});

// ── B) THE THREE MINT DOORS ──────────────────────────────────────────────────

describe('GR-1 stamp totality — all three mint doors', () => {
  it('DOOR 1, the live-appraisal war mint: both parties swear', () => {
    const treaty = onlyTreaty(mintThroughMover(LIT));
    expect(treaty).toBeTruthy();
    expect(treaty.sworn).toEqual({
      iron: { npcId: 'npc_1', name: 'Aldric Thorne', swornTick: TICK },
      weak: { npcId: 'npc_2', name: 'Bregan Holt', swornTick: TICK },
    });
  });

  it('DOOR 2, the carried-sheet mint: the same law, not a second spelling of it', () => {
    const treaty = onlyTreaty(mintThroughMover(LIT, { carried: carriedTermSheet() }));
    expect(treaty).toBeTruthy();
    // The carried road re-appraises nothing, so this proves the stamp reaches it from the
    // shared mint loop rather than from a per-road copy that could drift.
    expect(treaty.sourceTermSheetId).toBe('sheet.errand.1');
    expect(treaty.sworn).toEqual({
      iron: { npcId: 'npc_1', name: 'Aldric Thorne', swornTick: TICK },
      weak: { npcId: 'npc_2', name: 'Bregan Holt', swornTick: TICK },
    });
  });

  it('DOOR 3, the victor-free sale: buyer and seller both swear', () => {
    const mint = mintThroughSale(LIT);
    expect(mint.minted).toBe(true);
    const treaty = mint.treaties[0];
    expect(treaty.sworn).toEqual({
      iron: { npcId: 'npc_1', name: 'Aldric Thorne', swornTick: TICK },
      weak: { npcId: 'npc_2', name: 'Bregan Holt', swornTick: TICK },
    });
  });

  it('the stamp key order is a function of the PARTIES, never of the road that named them', () => {
    // Both roads name the victor/buyer first; the persisted key order is codepoint, so a
    // ledger walk cannot tell which road wrote a document from its signature block.
    const war = Object.keys(onlyTreaty(mintThroughMover(LIT)).sworn);
    const sale = Object.keys(mintThroughSale(LIT).treaties[0].sworn);
    expect(war).toEqual(['iron', 'weak']);
    expect(sale).toEqual(war);
  });
});

// ── C) DORMANCY AND THE NEGATIVES ────────────────────────────────────────────

describe('GR-1 the negatives', () => {
  it('DARK: no door writes a `sworn` key — absent, never null and never empty', () => {
    const war = onlyTreaty(mintThroughMover(WAR));
    const carried = onlyTreaty(mintThroughMover(WAR, { carried: carriedTermSheet() }));
    const sale = mintThroughSale(WAR).treaties[0];
    for (const [road, treaty] of [['war', war], ['carried', carried], ['sale', sale]]) {
      expect(treaty, `${road} minted no treaty at all`).toBeTruthy();
      expect(treaty.terms.length, `${road} minted an empty document`).toBeGreaterThan(0);
      // anchored: the two assertions immediately above prove this road really minted a non-empty document, and the lit run at the end of this test proves the same fixture DOES grow the key, so the absence cannot be a drive that produced nothing.
      expect(treaty, `${road} grew a sworn key while dark`).not.toHaveProperty('sworn');
      expect(Object.prototype.hasOwnProperty.call(treaty, 'sworn')).toBe(false);
      expect(swornPartiesOf(treaty)).toEqual([]);
    }
    // The lit run on the SAME fixtures does stamp, so the three absences above measure
    // the flag rather than a fixture nobody could stamp.
    expect(onlyTreaty(mintThroughMover(LIT)).sworn).toBeTruthy();
  });

  it('LEGACY: an unstamped treaty reads as seat-voice, and no advance ever backfills it', () => {
    const legacy = {
      parties: ['iron', 'weak'], victorId: 'iron', loserId: 'weak',
      mintedTick: 1, budgetGranted: 1, budgetSpent: 1,
      treatyTicksPerYear: CURRENT_TREATY_TICKS_PER_YEAR,
      terms: [{
        type: 'non_aggression', family: 'security', magnitude: 1, mintedTick: 1,
        expiresTick: 1 + 8 * CURRENT_TREATY_TICKS_PER_YEAR, weightSpent: 0.4,
        complianceState: 'honored', trueState: 'honored', burden01: 0, receipt: 'legacy',
      }],
      complianceState: 'honored', receipts: [],
    };
    expect(swornPartiesOf(legacy)).toEqual([]);
    const items = [ironItem(), weakItem()];
    const edges = [edge('iron', 'weak', 'neutral')];
    const out = advanceTreaties({
      snapshot: snapshotFor(items, edges),
      worldState: {
        tick: TICK, rngSeed: 'seed-gr1', simulationRules: { ...LIT },
        calendar: { elapsedWeeks: 30 }, deployments: {}, warExhaustion: {},
        relationshipStates: {},
        spatialLedgers: { treaties: { 'iron|weak': legacy } },
      },
      settlementUpdates: [], graph: { edges }, pIndex: null, tick: TICK, now: null,
    });
    const advanced = (getSpatialLedger(out.worldState, 'treaties') || {})['iron|weak'];
    expect(advanced, 'the legacy treaty vanished from the ledger').toBeTruthy();
    expect(advanced.terms.length).toBe(1);
    // anchored: the record is asserted present with its term intact immediately above, and the lit mint at the end of this test proves the same configuration DOES write the key, so this is a migration refusal rather than a dropped ledger.
    expect(advanced, 'a lit advance backfilled a stamp onto a legacy treaty').not.toHaveProperty('sworn');
    // And the same lit configuration DOES stamp what it mints, so the absence above is a
    // migration refusal rather than the flag being off in this fixture.
    expect(onlyTreaty(mintThroughMover(LIT)).sworn).toBeTruthy();
  });

  it('DEATH CHANGES NOTHING: the parchment is history, not a live lookup', () => {
    const treaty = onlyTreaty(mintThroughMover(LIT));
    const before = JSON.stringify(treaty.sworn);
    // The signatory dies and is struck from every roster the world still holds.
    const bereft = { ...ironItem().settlement, npcs: [] };
    expect(oathHolderOf({}, 'iron', bereft)).toBeNull();
    // The record does not consult that world, so the treaty is byte-unchanged and still
    // names the man who signed it.
    expect(JSON.stringify(treaty.sworn)).toBe(before);
    expect(swornPartiesOf(treaty).map((row) => row.name)).toEqual(['Aldric Thorne', 'Bregan Holt']);
  });

  it('the gate is strict: absent and explicit false are the same answer', () => {
    expect(oathHolderActive({ simulationRules: { ...WAR } })).toBe(false);
    expect(oathHolderActive({ simulationRules: { ...WAR, oathHolderEnabled: false } })).toBe(false);
    expect(oathHolderActive({ simulationRules: { ...WAR, oathHolderEnabled: 'true' } })).toBe(false);
    expect(oathHolderActive({ simulationRules: { ...WAR, oathHolderEnabled: 1 } })).toBe(false);
    expect(oathHolderActive({ simulationRules: { ...LIT } })).toBe(true);
    // The bare-rules receiver, which is how a caller that already unwrapped asks.
    expect(oathHolderActive({ oathHolderEnabled: true })).toBe(true);
    expect(oathHolderActive(null)).toBe(false);
  });
});

// ── D) THE PROMISE, THE ALIAS TRAP, AND THE READER'S TOLERANCE ───────────────

describe('GR-1 lifecycle', () => {
  it('THE SAME SEAT SWEARS AGAIN: re-deriving the world and re-minting names one person', () => {
    // Not the same object read twice — the whole world is rebuilt from the same inputs,
    // which is what a regeneration under THE PROMISE actually is.
    const first = onlyTreaty(mintThroughMover(LIT));
    const second = onlyTreaty(mintThroughMover(LIT));
    expect(JSON.stringify(second.sworn)).toBe(JSON.stringify(first.sworn));
    expect(second.sworn.iron.npcId).toBe('npc_1');
  });

  it('JSON ALIAS TRAP: the stamp survives real serialization and still addresses the roster', () => {
    // factions[].members[] ARE npcs[] objects in this estate's saves, so a fixture that
    // never round-trips can pass on an alias the save would have collapsed.
    const settlement = ironItem().settlement;
    const aliased = {
      ...settlement,
      powerStructure: {
        ...settlement.powerStructure,
        factions: settlement.powerStructure.factions.map((f, index) => (
          index === 0 ? { ...f, members: settlement.npcs } : f
        )),
      },
    };
    const treaty = {};
    stampSworn(treaty, {
      worldState: { simulationRules: { ...LIT } }, tick: TICK, ids: ['iron'],
      settlementOf: () => aliased,
    });
    const revived = JSON.parse(JSON.stringify({ treaty, settlement: aliased }));
    expect(revived.treaty.sworn.iron).toEqual({ npcId: 'npc_1', name: 'Aldric Thorne', swornTick: TICK });
    // The id still addresses a real roster entry on the OTHER side of the alias, which is
    // the half a non-round-tripping fixture cannot see.
    const members = revived.settlement.powerStructure.factions[0].members;
    expect(members.map((m) => m.id)).toContain(revived.treaty.sworn.iron.npcId);
    expect(revived.settlement.npcs.map((m) => m.id)).toContain(revived.treaty.sworn.iron.npcId);
  });

  it('the reader is TOTAL: absent, malformed and half-written stamps all read as seat-voice', () => {
    expect(swornPartiesOf(null)).toEqual([]);
    expect(swornPartiesOf({})).toEqual([]);
    expect(swornPartiesOf({ sworn: 'not an object' })).toEqual([]);
    expect(swornPartiesOf({ sworn: { iron: { name: 'Aldric Thorne' } } })).toEqual([]);
    expect(swornPartiesOf({ sworn: { iron: { npcId: 'npc_1' } } })).toEqual([]);
    // GUARD THE GUARD: a well-formed stamp on the same reader is read, so the five empty
    // answers above are refusals rather than a reader that returns [] for everything.
    expect(swornPartiesOf({ sworn: { weak: { npcId: 'npc_2', name: 'Bregan Holt', swornTick: 7 } } }))
      .toEqual([{ settlementId: 'weak', npcId: 'npc_2', name: 'Bregan Holt', swornTick: 7 }]);
  });

  it('the writer refuses a pair that resolves nobody, rather than writing an empty key', () => {
    const treaty = {};
    const stamped = stampSworn(treaty, {
      worldState: { simulationRules: { ...LIT } }, tick: TICK, ids: ['ghost'],
      settlementOf: () => ({ powerStructure: { factions: [] }, npcs: [] }),
    });
    expect(stamped).toBe(false);
    // anchored: the same writer with a resolvable settlement returns true and writes the key on the two lines below, so this absence measures the refusal rather than a dead writer.
    expect(treaty, 'an unresolvable pair still grew a key').not.toHaveProperty('sworn');
    const live = {};
    expect(stampSworn(live, {
      worldState: { simulationRules: { ...LIT } }, tick: TICK, ids: ['iron'],
      settlementOf: () => ironItem().settlement,
    })).toBe(true);
    expect(live.sworn.iron.npcId).toBe('npc_1');
  });

  it('a non-finite tick cannot mint a stamp with a broken clock in it', () => {
    const treaty = {};
    expect(stampSworn(treaty, {
      worldState: { simulationRules: { ...LIT } }, tick: undefined, ids: ['iron'],
      settlementOf: () => ironItem().settlement,
    })).toBe(false);
    // anchored: the identical call with a real tick returns true on the line below, so the refusal is the clock guard and not a dead path.
    expect(treaty, 'a broken clock still stamped').not.toHaveProperty('sworn');
    expect(stampSworn({}, {
      worldState: { simulationRules: { ...LIT } }, tick: TICK, ids: ['iron'],
      settlementOf: () => ironItem().settlement,
    })).toBe(true);
  });
});
