/**
 * urbanFabricKernel.test.js — THE URBAN FABRIC LAYER pins (owner commission #39).
 *
 * Pins (the fabric constitution):
 *   1. VOCABULARY: every district class the kernel can mint is a member of the
 *      town map's canonical 12-enum (DISTRICT_CATEGORIES) — the stock keys ARE
 *      the layout engine's district classes (pinned, never imported in-engine).
 *   2. DORMANCY (unit): flag absent ⇒ exact same references, zero news.
 *   3. DETERMINISM: the same drive twice ⇒ byte-identical serialized ledgers.
 *   4. THE TWO-REGIME LINGERING FIXTURE (the owner's acceptance example): the
 *      merchant guild rules — the merchant quarter's stock rises; power passes
 *      to a noble house — the old stock visibly LINGERS (still dominant years
 *      later) while decaying monotonically, the noble stock grows, and the
 *      chronicle eventually calls ONE dominance turn. Never a flip.
 *   5. SCAR DECAY: a calamity mints a typed scar; unrefreshed it decays on its
 *      masonry half-life and is pruned once spent.
 *   6. CATASTROPHE REBIRTH (the one fast path): a fresh high-toll stamp resets
 *      the struck classes' stocks, mints a rebirth marker + a chronicle beat.
 *   7. SIZE GOVERNOR: rebirth markers cap at REBIRTH_CAP; the per-settlement
 *      record stays bounded (measured size model quoted via assertion bounds).
 *   8. DRIFT DERIVATION: a criminal-ruled, illegitimate town drifts chaotic;
 *      a lawful council town drifts lawful (drift = 1 − lawfulness01 attractor).
 *   9. READ API: absent/dark ⇒ empty ({} / null / []); a lit mirror round-trips
 *      through townMap/fabricRead.js.
 */
import { describe, it, expect } from 'vitest';

import {
  advanceUrbanFabric, advanceNpcGrowthWithFabric, urbanFabricActive,
  ARCHETYPE_TO_DISTRICT, districtClassOf, fabricRecordOf,
  FABRIC_TUNING, FABRIC_DEPOSIT_RATES, SCAR_HALF_LIFE_WEEKS,
} from '../../src/domain/worldPulse/urbanFabricKernel.js';
import { DISTRICT_CATEGORIES } from '../../src/domain/districtProfile.js';
import {
  fabricStocksFor, fabricDriftOf, fabricScarsOf, fabricRebirthsOf, hasFabric,
} from '../../src/domain/townMap/fabricRead.js';

const NOW = '2026-01-01T00:00:00.000Z';

// ── Fixtures ──────────────────────────────────────────────────────────────────
/** A town ruled by the named governing faction. */
function ruledTown(name, factionName, extra = {}) {
  return {
    name, tier: 'town', population: 1500,
    config: { economicBase: 'agrarian' },
    institutions: [],
    economicState: { prosperity: 'Comfortable' },
    powerStructure: {
      publicLegitimacy: { score: 60 },
      factions: [{ name: factionName, isGoverning: true, power: 60 }],
      conflicts: [],
    },
    activeConditions: [], npcs: [],
    ...extra,
  };
}

function makeWorld({ lit = true, weeks = 260, tick = 65 } = {}) {
  return {
    tick,
    simulationRules: lit ? { urbanFabricEnabled: true } : {},
    calendar: { elapsedWeeks: weeks, year: Math.floor(weeks / 52) + 1 },
    stressors: [],
  };
}

/** Drive the fabric mover n advances of dw weeks each, threading state. */
function drive({ worldState, settlements, advances, dw = 4, mutate = null }) {
  let ws = worldState;
  let updates = settlements.map((s, i) => ({ saveId: String(s.id), settlement: s.settlement }));
  /** @type {Array<Record<string, unknown>>} */
  const allNews = [];
  for (let i = 0; i < advances; i++) {
    ws = {
      ...ws,
      tick: ws.tick + 1,
      calendar: { ...ws.calendar, elapsedWeeks: ws.calendar.elapsedWeeks + dw },
    };
    if (mutate) mutate({ worldState: ws, updates, advance: i });
    const snapshot = { settlements: settlements.map((s, j) => ({ id: s.id, name: s.name, settlement: updates[j].settlement })) };
    const r = advanceUrbanFabric({ snapshot, worldState: ws, settlementUpdates: updates, tick: ws.tick, now: NOW });
    ws = r.worldState;
    updates = r.settlementUpdates;
    allNews.push(...r.newsEntries);
  }
  return { worldState: ws, updates, news: allNews };
}

// ── 1. The vocabulary pin (the layout-engine contract) ────────────────────────
describe('urban fabric — vocabulary pin (stocks key the town map 12-enum)', () => {
  it('every mintable district class is a DISTRICT_CATEGORIES member', () => {
    const mintable = new Set(Object.values(ARCHETYPE_TO_DISTRICT));
    // The fabric-noun fallback + income rules can only mint these too (spot-check
    // the classifier over representative nouns).
    for (const probe of ['Tannery', 'The Grand Market', 'Old Granary', 'Manor of Vell', 'Tenement Rows']) {
      const cls = districtClassOf(probe);
      if (cls) mintable.add(cls);
    }
    const outside = [...mintable].filter((c) => !DISTRICT_CATEGORIES.includes(c));
    expect(outside).toEqual([]);
  });

  it('the canonical classifier routes the load-bearing archetypes', () => {
    expect(districtClassOf({ name: "Merchants' Guild" })).toBe('merchant');
    expect(districtClassOf({ name: 'House Valeric' })).toBe('noble');
    expect(districtClassOf({ name: 'Council of Elders' })).toBe('civic');
    expect(districtClassOf({ name: 'The Crimson Syndicate' })).toBe('criminal');
    expect(districtClassOf('Tannery')).toBe('industrial'); // the calamity-target noun fallback
    expect(districtClassOf({ name: 'Town hall', category: 'civic' })).toBe('civic');
  });
});

// ── 2. Dormancy (unit) ────────────────────────────────────────────────────────
describe('urban fabric — dormancy gate (unit)', () => {
  it('flag absent ⇒ exact same references, changed:false, zero news', () => {
    const worldState = makeWorld({ lit: false });
    const town = ruledTown('Dark Town', "Merchants' Guild");
    const updates = [{ saveId: 'a', settlement: town }];
    const snapshot = { settlements: [{ id: 'a', name: 'Dark Town', settlement: town }] };
    const r = advanceUrbanFabric({ snapshot, worldState, settlementUpdates: updates, tick: 66, now: NOW });
    expect(r.worldState).toBe(worldState);
    expect(r.settlementUpdates).toBe(updates);
    expect(r.changed).toBe(false);
    expect(r.newsEntries).toEqual([]);
    expect(urbanFabricActive(worldState)).toBe(false);
  });

  it('the composed growth+fabric mover is a no-op with both layers dark', () => {
    const worldState = makeWorld({ lit: false });
    const town = ruledTown('Dark Town', "Merchants' Guild");
    const updates = [{ saveId: 'a', settlement: town }];
    const snapshot = { settlements: [{ id: 'a', name: 'Dark Town', settlement: town }] };
    const r = advanceNpcGrowthWithFabric({ snapshot, worldState, settlementUpdates: updates, graph: null, tick: 66, now: NOW });
    expect(r.worldState).toBe(worldState);
    expect(r.changed).toBe(false);
    expect(r.newsEntries).toEqual([]);
  });
});

// ── 3. Determinism ────────────────────────────────────────────────────────────
describe('urban fabric — determinism', () => {
  it('the same drive twice yields byte-identical ledgers and news', () => {
    const run = () => drive({
      worldState: makeWorld(),
      settlements: [{ id: 'a', name: 'Trade Town', settlement: ruledTown('Trade Town', "Merchants' Guild") }],
      advances: 12,
    });
    const r1 = run();
    const r2 = run();
    expect(JSON.stringify(r1.worldState.spatialLedgers)).toBe(JSON.stringify(r2.worldState.spatialLedgers));
    expect(JSON.stringify(r1.news)).toBe(JSON.stringify(r2.news));
  });
});

// ── 4. THE TWO-REGIME LINGERING FIXTURE (the owner's acceptance example) ──────
describe('urban fabric — regime transition is decay + deposit, never flip', () => {
  it('the merchant quarter lingers after the guild falls, is gradually replaced, and ONE turn is called', () => {
    const town = ruledTown('Guildfall', "Merchants' Guild");
    const settlements = [{ id: 'a', name: 'Guildfall', settlement: town }];

    // ERA 1 — the guild rules for 26 months: the merchant stock rises to dominance.
    const era1 = drive({ worldState: makeWorld(), settlements, advances: 26 });
    const rec1 = fabricRecordOf(era1.worldState, 'a');
    expect(rec1).not.toBeNull();
    const merchantPeak = rec1.stocks.merchant?.v ?? 0;
    expect(merchantPeak, 'the ruling guild built merchant fabric').toBeGreaterThan(FABRIC_TUNING.LEAD_FLOOR);
    expect(rec1.led, 'merchant called dominant').toBe('merchant');
    expect(era1.news.some((n) => n.impactKind === 'urban_fabric' && n.tags.includes('rise')), 'the rise beat fired').toBe(true);

    // ERA 2 — power passes to House Valeric (noble). The merchant stock LINGERS
    // (still ahead for years) while decaying monotonically; the noble grows.
    const nobleTown = {
      ...era1.updates[0].settlement,
      powerStructure: {
        publicLegitimacy: { score: 60 },
        factions: [
          { name: "Merchants' Guild", isGoverning: false, power: 20 },
          { name: 'House Valeric', isGoverning: true, power: 60 },
        ],
        conflicts: [],
      },
    };
    let ws = era1.worldState;
    let updates = [{ saveId: 'a', settlement: nobleTown }];
    const merchantTrail = [];
    const nobleTrail = [];
    const turnBeats = [];
    for (let i = 0; i < 40; i++) {
      ws = { ...ws, tick: ws.tick + 1, calendar: { ...ws.calendar, elapsedWeeks: ws.calendar.elapsedWeeks + 4 } };
      const snapshot = { settlements: [{ id: 'a', name: 'Guildfall', settlement: updates[0].settlement }] };
      const r = advanceUrbanFabric({ snapshot, worldState: ws, settlementUpdates: updates, tick: ws.tick, now: NOW });
      ws = r.worldState;
      updates = r.settlementUpdates;
      const rec = fabricRecordOf(ws, 'a');
      merchantTrail.push(rec.stocks.merchant?.v ?? 0);
      nobleTrail.push(rec.stocks.noble?.v ?? 0);
      turnBeats.push(...r.newsEntries.filter((n) => n.impactKind === 'urban_fabric' && n.tags.includes('turn')));
    }

    // LINGERING: 6 months after the fall the old quarter still overshadows the new.
    expect(merchantTrail[5], 'the merchant stock visibly lingers').toBeGreaterThan(nobleTrail[5]);
    expect(merchantTrail[5]).toBeGreaterThan(FABRIC_TUNING.LEAD_FLOOR / 2);
    // DECAY, never flip: monotone non-increasing merchant stock (no deposits).
    for (let i = 1; i < merchantTrail.length; i++) {
      expect(merchantTrail[i]).toBeLessThanOrEqual(merchantTrail[i - 1] + 1e-9);
    }
    // REPLACEMENT: by the era's end the noble quarter has overtaken.
    expect(nobleTrail[nobleTrail.length - 1]).toBeGreaterThan(merchantTrail[merchantTrail.length - 1]);
    // The chronicle called EXACTLY ONE dominance turn, merchant → noble.
    expect(turnBeats.length).toBe(1);
    expect(turnBeats[0].summary).toContain('noble');
    expect(turnBeats[0].summary).toContain('merchant');
    const recEnd = fabricRecordOf(ws, 'a');
    expect(recEnd.led).toBe('noble');
    // The old stock is STILL PRESENT (lingering memory), just no longer dominant.
    expect(recEnd.stocks.merchant?.v ?? 0).toBeGreaterThan(0);
  }, 30_000);
});

// ── 5. Scar decay ─────────────────────────────────────────────────────────────
describe('urban fabric — stressor scars decay on masonry clocks', () => {
  it('a fire mints burn_lots; unrefreshed it halves per half-life and prunes when spent', () => {
    const town = ruledTown('Ashford', 'Council of Elders');
    const settlements = [{ id: 'a', name: 'Ashford', settlement: town }];
    // Advance 1 stamps a fresh fire (tick === the advance's tick).
    const r1 = drive({
      worldState: makeWorld({ tick: 65, weeks: 260 }),
      settlements, advances: 1, dw: 4,
      mutate: ({ worldState, updates }) => {
        updates[0] = {
          ...updates[0],
          settlement: {
            ...updates[0].settlement,
            calamityHistory: [{ type: 'fire', name: 'The Great Fire', year: 6, tick: worldState.tick, deaths: 40, exodus: 20, k: 1, targets: [] }],
          },
        };
      },
    });
    const rec1 = fabricRecordOf(r1.worldState, 'a');
    expect(rec1.scars.burn_lots, 'the fire scarred the town').toBeTruthy();
    const sev0 = rec1.scars.burn_lots.sev;
    expect(sev0).toBeGreaterThan(0.3);

    // One half-life (104 weeks) later with no new fire: the scar has halved.
    const r2 = drive({ worldState: r1.worldState, settlements: [{ id: 'a', name: 'Ashford', settlement: r1.updates[0].settlement }], advances: 26, dw: 4 });
    const rec2 = fabricRecordOf(r2.worldState, 'a');
    expect(rec2.scars.burn_lots.sev).toBeLessThan(sev0 * 0.55);
    expect(rec2.scars.burn_lots.sev).toBeGreaterThan(sev0 * 0.45);

    // Far past the lookback the scar is spent and PRUNED (drop-when-empty).
    const r3 = drive({ worldState: r2.worldState, settlements: [{ id: 'a', name: 'Ashford', settlement: r2.updates[0].settlement }], advances: 12, dw: 52 });
    const rec3 = fabricRecordOf(r3.worldState, 'a');
    expect(rec3.scars.burn_lots).toBeUndefined();
  });

  it('siege_lifted mints siege_repairs; famine mints lean_years', () => {
    const town = {
      ...ruledTown('Warfront', 'Council of Elders'),
      activeConditions: [{ archetype: 'siege_lifted' }],
    };
    const r = drive({
      worldState: { ...makeWorld(), stressors: [{ id: 'st1', type: 'famine', severity: 0.7, status: 'active', affectedSettlementIds: ['a'] }] },
      settlements: [{ id: 'a', name: 'Warfront', settlement: town }],
      advances: 1,
    });
    const rec = fabricRecordOf(r.worldState, 'a');
    expect(rec.scars.siege_repairs?.sev).toBe(FABRIC_TUNING.SCAR_SIEGE_SEV);
    expect(rec.scars.lean_years?.sev).toBe(FABRIC_TUNING.SCAR_FAMINE_SEV);
  });
});

// ── 6. Catastrophe rebirth (the one fast path) ────────────────────────────────
describe('urban fabric — catastrophe is the one fast path', () => {
  it('a fresh high-toll stamp resets the struck class, mints the marker + the beat', () => {
    // A labor-ruled town builds INDUSTRIAL fabric for 30 months…
    const town = ruledTown('Forgeholm', "Miners' Brotherhood");
    const settlements = [{ id: 'a', name: 'Forgeholm', settlement: town }];
    const before = drive({ worldState: makeWorld(), settlements, advances: 30 });
    const recBefore = fabricRecordOf(before.worldState, 'a');
    expect(recBefore.stocks.industrial?.v, 'the industrial stock built up').toBeGreaterThan(1);

    // …then the Great Fire takes the Tannery (toll 290 ≥ the rebirth floor).
    const after = drive({
      worldState: before.worldState,
      settlements: [{ id: 'a', name: 'Forgeholm', settlement: before.updates[0].settlement }],
      advances: 1,
      mutate: ({ worldState, updates }) => {
        updates[0] = {
          ...updates[0],
          settlement: {
            ...updates[0].settlement,
            calamityHistory: [{ type: 'fire', name: 'The Great Fire', year: 8, tick: worldState.tick, deaths: 90, exodus: 200, k: 1, targets: ['Tannery'] }],
          },
        };
      },
    });
    const rec = fabricRecordOf(after.worldState, 'a');
    // The struck class's stock RESET (the one sanctioned rapid change).
    expect(rec.stocks.industrial).toBeUndefined();
    // The rebirth marker landed, typed and classed.
    expect(rec.rebirths.length).toBe(1);
    expect(rec.rebirths[0].classes).toEqual(['industrial']);
    expect(rec.rebirths[0].type).toBe('fire');
    // The chronicle narrated the rebirth.
    const beats = after.news.filter((n) => n.impactKind === 'urban_fabric' && n.tags.includes('rebirth'));
    expect(beats.length).toBe(1);
    // And the fire also scarred the town (scar + rebirth co-exist).
    expect(rec.scars.burn_lots).toBeTruthy();
    // A LOW-toll stamp must NOT rebirth (resistant to rapid change).
    expect(fabricRecordOf(before.worldState, 'a').rebirths).toEqual([]);
  }, 30_000);

  it('a stale stamp (before the high-water mark) never re-triggers', () => {
    const town = {
      ...ruledTown('Oldburn', 'Council of Elders'),
      calamityHistory: [{ type: 'fire', name: 'An old fire', year: 2, tick: 10, deaths: 500, exodus: 100, k: 2, targets: ['Tannery'] }],
    };
    // First lit advance: the stamp (tick 10) predates first sight (seenTick init
    // = tick−1 = 65) ⇒ not fresh ⇒ no scar, no rebirth.
    const r = drive({ worldState: makeWorld({ tick: 65 }), settlements: [{ id: 'a', name: 'Oldburn', settlement: town }], advances: 3 });
    const rec = fabricRecordOf(r.worldState, 'a');
    expect(rec.rebirths).toEqual([]);
    expect(rec.scars.burn_lots).toBeUndefined();
  });
});

// ── 7. Size governor ──────────────────────────────────────────────────────────
describe('urban fabric — size governor (bounded by construction + caps)', () => {
  it('rebirth markers cap at REBIRTH_CAP (latest kept)', () => {
    const town = ruledTown('Doomtown', "Merchants' Guild");
    let ws = makeWorld();
    let updates = [{ saveId: 'a', settlement: town }];
    for (let i = 0; i < FABRIC_TUNING.REBIRTH_CAP + 3; i++) {
      ws = { ...ws, tick: ws.tick + 1, calendar: { ...ws.calendar, elapsedWeeks: ws.calendar.elapsedWeeks + 4 } };
      updates = [{
        saveId: 'a',
        settlement: {
          ...updates[0].settlement,
          calamityHistory: [{ type: 'fire', name: `Fire ${i}`, year: 6 + i, tick: ws.tick, deaths: 90, exodus: 200, k: 1, targets: ['Tannery'] }],
        },
      }];
      const snapshot = { settlements: [{ id: 'a', name: 'Doomtown', settlement: updates[0].settlement }] };
      const r = advanceUrbanFabric({ snapshot, worldState: ws, settlementUpdates: updates, tick: ws.tick, now: NOW });
      ws = r.worldState;
      updates = r.settlementUpdates;
    }
    const rec = fabricRecordOf(ws, 'a');
    expect(rec.rebirths.length).toBe(FABRIC_TUNING.REBIRTH_CAP);
  });

  it('the record stays bounded: stocks ⊆ the 12-enum, scars ⊆ the kind vocabulary, size < 2 KB', () => {
    // A maximal fixture: rich institutions, entrepôt, famine, high tier.
    const town = {
      ...ruledTown('Everyport', "Merchants' Guild"),
      tier: 'metropolis', population: 40000,
      institutions: [
        { name: 'Great cathedral', category: 'religious' }, { name: 'Citadel', category: 'defense' },
        { name: "Mages' guild", category: 'magic' }, { name: "Thieves' den", category: 'criminal' },
        { name: 'Grand bazaar', category: 'trade' }, { name: 'Artisan hall', category: 'crafts' },
        { name: 'Town hall', category: 'government' }, { name: 'Foreign embassy', category: 'outsider' },
      ],
      economicState: {
        prosperity: 'Prosperous', isEntrepot: true,
        incomeSources: ['Iron mining', 'Weaving', 'Trade tariffs'],
        foodSecurity: { deficitPct: 40 },
      },
      activeConditions: [{ archetype: 'siege_lifted' }, { archetype: 'occupation_lifted' }],
    };
    const r = drive({ worldState: makeWorld(), settlements: [{ id: 'a', name: 'Everyport', settlement: town }], advances: 30 });
    const rec = fabricRecordOf(r.worldState, 'a');
    for (const cls of Object.keys(rec.stocks)) expect(DISTRICT_CATEGORIES).toContain(cls);
    for (const kind of Object.keys(rec.scars)) expect(Object.keys(SCAR_HALF_LIFE_WEEKS)).toContain(kind);
    const bytes = JSON.stringify(r.worldState.spatialLedgers.urbanFabric.a).length;
    expect(bytes, `measured maximal per-settlement record = ${bytes} B`).toBeLessThan(2048);
  }, 30_000);
});

// ── 8. Alignment drift derivation ─────────────────────────────────────────────
describe('urban fabric — alignment is the drift-rate of new fabric', () => {
  it('a criminal-ruled, illegitimate town drifts chaotic; a lawful council town drifts lawful', () => {
    const lawful = {
      ...ruledTown('Lawgard', 'Council of Elders'),
      powerStructure: {
        publicLegitimacy: { score: 92 },
        factions: [{ name: 'Council of Elders', isGoverning: true, power: 60 }],
        conflicts: [],
      },
    };
    const chaotic = {
      ...ruledTown('Shadowmoor', 'The Crimson Syndicate'),
      powerStructure: {
        publicLegitimacy: { score: 15 },
        factions: [{ name: 'The Crimson Syndicate', isGoverning: true, power: 60 }],
        conflicts: [],
      },
    };
    const r = drive({
      worldState: makeWorld(),
      settlements: [
        { id: 'a', name: 'Lawgard', settlement: lawful },
        { id: 'b', name: 'Shadowmoor', settlement: chaotic },
      ],
      advances: 6,
    });
    const dLaw = fabricRecordOf(r.worldState, 'a').drift;
    const dChaos = fabricRecordOf(r.worldState, 'b').drift;
    expect(dLaw).toBeGreaterThanOrEqual(0);
    expect(dChaos).toBeLessThanOrEqual(1);
    expect(dChaos, `chaotic-ruled drift ${dChaos} > lawful-ruled drift ${dLaw}`).toBeGreaterThan(dLaw);
    expect(dLaw, 'a lawful town sits below the neutral 0.5 grain').toBeLessThan(0.5);
    expect(dChaos, 'a criminal town sits above the neutral 0.5 grain').toBeGreaterThan(0.5);
  });
});

// ── 9. The read API (absent/dark ⇒ empty; lit ⇒ round-trip) ──────────────────
describe('urban fabric — the #38 read API (townMap/fabricRead)', () => {
  it('absent/dark ⇒ empty values (the layout engine falls back to current state)', () => {
    for (const s of [null, undefined, {}, { name: 'Plain' }, { urbanFabric: 'garbage' }]) {
      expect(fabricStocksFor(s)).toEqual({});
      expect(fabricDriftOf(s)).toBeNull();
      expect(fabricScarsOf(s)).toEqual([]);
      expect(fabricRebirthsOf(s)).toEqual([]);
      expect(hasFabric(s)).toBe(false);
    }
  });

  it('a lit advance projects the mirror; the read API round-trips it', () => {
    const town = ruledTown('Mirrortown', "Merchants' Guild");
    const r = drive({ worldState: makeWorld(), settlements: [{ id: 'a', name: 'Mirrortown', settlement: town }], advances: 26 });
    const mirrored = r.updates[0].settlement;
    expect(hasFabric(mirrored)).toBe(true);
    const stocks = fabricStocksFor(mirrored);
    expect(Object.keys(stocks).length).toBeGreaterThan(0);
    expect(stocks.merchant).toBeGreaterThan(0);
    for (const v of Object.values(stocks)) { expect(v).toBeGreaterThan(0); expect(v).toBeLessThanOrEqual(1); }
    // The mirror's prominence tracks the ledger (v / STOCK_MAX).
    const rec = fabricRecordOf(r.worldState, 'a');
    expect(stocks.merchant).toBeCloseTo(rec.stocks.merchant.v / FABRIC_TUNING.STOCK_MAX, 3);
    const drift = fabricDriftOf(mirrored);
    expect(drift).not.toBeNull();
    expect(drift).toBeCloseTo(rec.drift, 3);
  }, 30_000);

  it('the deposit map + tuning are the signed shapes (retune consciously)', () => {
    // Freeze the JUDGMENT constants: a silent retune must touch this pin.
    expect(FABRIC_TUNING.STOCK_HALF_LIFE_WEEKS).toBe(260);
    expect(FABRIC_TUNING.DRIFT_HALF_LIFE_WEEKS).toBe(104);
    expect(FABRIC_DEPOSIT_RATES.RULING).toBe(0.020);
    expect(SCAR_HALF_LIFE_WEEKS.siege_repairs).toBe(260);
  });
});
