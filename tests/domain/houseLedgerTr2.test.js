/**
 * houseLedgerTr2.test.js — TR-2 THE HOUSE: the wave's acceptance file (the FP kit's
 * BUILD-FP-D brief, unit 1; the compiled block #24; docs/DESIGN_FP_ARCH_TR.md §4 TR-2).
 *
 * THE FOUR-FENCE DORMANCY SET for `merchantHousesEnabled`, plus the lit-mutant control that
 * proves the fences can see (§3's flag law; the casus fence file is the precedent):
 *   FENCE 1 — OWN FOOTPRINT: dark, the writer hands back its input world BY REFERENCE, over a
 *     fixture that forms two houses the moment the key is lit — zero bytes in spatialLedgers.
 *   FENCE 2 — ABSENT vs EXPLICIT FALSE over a whole multi-tick drive. Blind by design when
 *     the layer runs in both configurations, which is why it never ships alone.
 *   FENCE 3 — CALL PATH: pass-through spies on the chooser and on the eligibility door, both
 *     reached CROSS-MODULE from the writer, count zero dark and more than zero lit.
 *   FENCE 4 — GATE POLARITY over the real tree: every code read of the key is the strict
 *     `=== true` form, through the shared comment-and-string blanker.
 * Then the acceptance rows: formation determinism, the rename round trip through the one
 * eligibility door, ruin from the top band, the no-undead cooldown, the normalizer round trip,
 * the direction row through EM-C1's resolver, the predicate with its subjects, the chooser's
 * empty import list, and the factor cast through the one chokepoint.
 *
 * The chair's amendment of 2026-09-23 WITHDREW the "an applied direction at the tick takes
 * the DM's verb" arm: no transport carries a settlement-scale direction to a pulse layer
 * today, so the consumer lands when U123 composes it (TR-2-c).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test, vi } from 'vitest';

import { codeOnly } from '../helpers/codeOnlySource.js';

/** FENCE 3's recorder. Hoisted, because vi.mock factories hoist above the imports. */
const calls = vi.hoisted(() => ({ chooser: 0, archetype: 0 }));

vi.mock('../../src/domain/worldPulse/houseActs.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // STRICT pass-through: the original's answer, counted.
    chooseHouseAct: (...args) => {
      calls.chooser += 1;
      return actual.chooseHouseAct(...args);
    },
  };
});

vi.mock('../../src/domain/factionArchetypes.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    factionArchetype: (...args) => {
      calls.archetype += 1;
      return actual.factionArchetype(...args);
    },
  };
});

const {
  HOUSES_LEDGER_KEY, HOUSE_LEDGER_TUNING, HOUSE_STANDING_CONDITION, HOUSE_STANDING_ROW,
  advanceHouses, castHouseFactor, houseFactionId, normalizeHouses,
} = await import('../../src/domain/worldPulse/houseLedger.js');
const {
  HOUSE_ACT_VERBS, HOUSE_DIRECTION_OP_TYPES, HOUSE_DIRECTION_TYPE, chooseHouseAct,
} = await import('../../src/domain/worldPulse/houseActs.js');
const { resolveDecree, stage } = await import('../../src/domain/edit/registry.js');
const { OP_TYPES } = await import('../../src/domain/edit/operations.js');
const { FACTION_STATE_PRUNE_GRACE_TICKS, factionCompetitionId } = await import('../../src/domain/worldPulse/factionCompetition.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FLAG = 'merchantHousesEnabled';
const LIT = Object.freeze({ [FLAG]: true });
/** Every dark spelling: absent, empty, false, and two truthy non-true values. */
const DARK_RULES = [undefined, null, {}, { [FLAG]: false }, { [FLAG]: 'true' }, { [FLAG]: 1 }];

const clone = (value) => JSON.parse(JSON.stringify(value));
const faction = (name, extra = {}) => ({ name, power: 'strong', ...extra });

/**
 * THE ADVERSARIAL TOWN: two merchant factions, a watch, a live quay — a town that forms two
 * houses the moment the flag is lit. Every dark claim is made against it.
 */
function town({ id = 's1', prosperity = 'Wealthy', factions, institutions, npcs } = {}) {
  return {
    id,
    settlement: {
      powerStructure: {
        factions: factions ?? [
          faction('Verren Merchant Guild'), faction('Aldous Trade Consortium'), faction('The Harbour Watch'),
        ],
      },
      institutions: institutions ?? [
        { name: 'The Long Quay', category: 'Economy' }, { name: 'Watch House', category: 'Government' },
      ],
      economicState: { prosperity: { tier: prosperity } },
      npcs: npcs ?? [
        { id: 'n2', name: 'Maren', factionAffiliation: 'Verren Merchant Guild' },
        { id: 'n1', name: 'Otto', factionAffiliation: 'Verren Merchant Guild', status: 'jailed' },
      ],
    },
  };
}

/**
 * Drive the writer tick by tick, RELOADING the world through JSON between ticks (the save
 * path), and collect every receipt stamped with its tick.
 */
function drive(args) {
  const { ticks, from = 0, townsAt = () => [town()], start = {} } = args;
  // `rules` is read by PRESENCE, never defaulted: an explicit `undefined` is a dark spelling.
  const rules = 'rules' in args ? args.rules : LIT;
  let worldState = clone(start);
  const log = [];
  for (let tick = from; tick < from + ticks; tick += 1) {
    const out = advanceHouses({ snapshot: { settlements: townsAt(tick) }, worldState, tick, rules });
    worldState = clone(out.worldState);
    for (const receipt of out.receipts) log.push({ tick, ...receipt });
  }
  return { worldState, log };
}

const housesOf = (worldState) => worldState.spatialLedgers?.[HOUSES_LEDGER_KEY];

/** @param {string} dir @param {string[]} out */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(p);
  }
  return out;
}

describe('TR-2 — the four dormancy fences and the lit-mutant control', () => {
  test('fence 1 — dark, the world comes out as its own input and spatialLedgers gains zero bytes', () => {
    const input = { tick: 3, spatialLedgers: { entrepots: { s1: { centrality: 0.5 } } } };
    const bytes = JSON.stringify(input);
    for (const rules of DARK_RULES) {
      const out = advanceHouses({ snapshot: { settlements: [town()] }, worldState: input, tick: 3, rules });
      expect(out.worldState, `rules=${JSON.stringify(rules)}`).toBe(input);
      expect(out.ledger).toBeNull();
      expect(out.receipts).toEqual([]);
      expect(JSON.stringify(out.worldState)).toBe(bytes);
    }
  });

  test('THE LIT-MUTANT CONTROL — the same fixture lit really does write, so the fences can see', () => {
    const input = { tick: 3, spatialLedgers: { entrepots: { s1: { centrality: 0.5 } } } };
    const out = advanceHouses({ snapshot: { settlements: [town()] }, worldState: input, tick: 3, rules: LIT });
    expect(Object.keys(out.ledger)).toEqual(['s1:aldous_trade_consortium', 's1:verren_merchant_guild']);
    expect(housesOf(out.worldState)).toEqual(out.ledger);
    expect(out.receipts.map((r) => r.event)).toEqual(['formed', 'formed']);
    expect(out.worldState.spatialLedgers.entrepots).toEqual(input.spatialLedgers.entrepots);
  });

  test('fence 2 — absent and explicit false are the same world over a forty-tick drive', () => {
    const absent = drive({ ticks: 40, rules: {} });
    const off = drive({ ticks: 40, rules: { [FLAG]: false } });
    expect(off).toEqual(absent);
    expect(absent.worldState).toEqual({});
    expect(absent.log).toEqual([]);
  });

  test('fence 3 — the call path: dark, neither the chooser nor the eligibility door is reached', () => {
    calls.chooser = 0;
    calls.archetype = 0;
    for (const rules of DARK_RULES) drive({ ticks: 5, rules });
    expect(calls).toEqual({ chooser: 0, archetype: 0 });
    drive({ ticks: 5, rules: LIT });
    expect(calls.chooser).toBeGreaterThan(0);
    expect(calls.archetype).toBeGreaterThan(0);
  });

  test('fence 4 — the gate polarity census: every code read of the key is the strict === true form', () => {
    /** @type {string[]} */
    const reads = [];
    /** @type {string[]} */
    const loose = [];
    for (const abs of walk(join(ROOT, 'src'))) {
      const rel = relative(ROOT, abs).replace(/\\/g, '/');
      const code = codeOnly(readFileSync(abs, 'utf8'));
      for (const match of code.matchAll(/\bmerchantHousesEnabled\b/g)) {
        const tail = code.slice(match.index + match[0].length, match.index + match[0].length + 12);
        (/^\s*===\s*true/.test(tail) ? reads : loose).push(rel);
      }
    }
    expect(loose, 'a read of the key that is not the strict === true form').toEqual([]);
    expect(reads).toEqual(['src/domain/worldPulse/houseLedger.js']);
  });
});

describe('TR-2 — formation, eligibility, ruin and the latches', () => {
  test('formation is deterministic: the same world forms the same houses, and the codepoint decides a tie under the cap', () => {
    const three = [faction('Zephyr Merchant Guild'), faction('Aldous Trade Consortium'), faction('Mere Market Brokers')];
    const run = () => drive({ ticks: 1, townsAt: () => [town({ factions: three })] });
    const first = run();
    expect(JSON.stringify(run().worldState)).toBe(JSON.stringify(first.worldState));
    expect(HOUSE_LEDGER_TUNING.maxHousesPerSettlement).toBe(2);
    expect(Object.keys(housesOf(first.worldState))).toEqual(['s1:aldous_trade_consortium', 's1:mere_market_brokers']);
    // Institution seniority ranks BEFORE the codepoint: the quay's own guild takes a slot.
    const linked = drive({
      ticks: 1,
      townsAt: () => [town({
        factions: three,
        institutions: [{ name: 'The Long Quay', category: 'Economy', factionSource: 'Zephyr Merchant Guild' }],
      })],
    });
    expect(Object.keys(housesOf(linked.worldState))).toEqual(['s1:aldous_trade_consortium', 's1:zephyr_merchant_guild']);
    // No live commerce, no house: a ruined quay is not a market.
    const ruinedQuay = drive({
      ticks: 1,
      townsAt: () => [town({ institutions: [{ name: 'The Long Quay', category: 'Economy', status: 'ruined' }] })],
    });
    expect(ruinedQuay.worldState).toEqual({});
  });

  test('eligibility reads ONLY factionArchetype: rename the faction, reload, the house survives dormant with its books, and renaming back wakes the SAME entry', () => {
    const key = 's1:verren_merchant_guild';
    const merchant = drive({ ticks: 30, townsAt: () => [town({ factions: [faction('Verren Merchant Guild')] })] });
    const books = housesOf(merchant.worldState)[key].books;
    expect(books.interests.length).toBeGreaterThan(0);
    // SAME KEY, NEW ARCHETYPE: a category the canonical map reads FIRST sends the house to sleep
    // with its books although its name still says merchant — the door is factionArchetype's.
    const recategorized = drive({
      ticks: 1, from: 30, start: merchant.worldState,
      townsAt: () => [town({ factions: [faction('Verren Merchant Guild', { category: 'noble' })] })],
    });
    expect(recategorized.log).toEqual([{ tick: 30, event: 'dormant', settlementId: 's1', factionId: key, reason: 'archetype' }]);
    expect(housesOf(recategorized.worldState)[key].books).toEqual(books);
    // The rename breaks the name-regex fallback (`house <name>` reads noble) AND moves the key.
    const renamed = drive({
      ticks: 2, from: 30, start: merchant.worldState, townsAt: () => [town({ factions: [faction('House Verren')] })],
    });
    const dormant = housesOf(renamed.worldState)[key];
    expect(dormant.dormantSince).toBe(30);
    expect(dormant.books).toEqual(books);
    expect(renamed.log).toEqual([{ tick: 30, event: 'dormant', settlementId: 's1', factionId: key, reason: 'absent' }]);
    const restored = drive({
      ticks: 1, from: 32, start: renamed.worldState, townsAt: () => [town({ factions: [faction('Verren Merchant Guild')] })],
    });
    const woken = housesOf(restored.worldState)[key];
    expect(restored.log[0]).toEqual({ tick: 32, event: 'woke', settlementId: 's1', factionId: key });
    expect(woken.books.holdings).toBe(books.holdings);
    expect('dormantSince' in woken).toBe(false);
    // THE DOOR IS factionArchetype AND NOTHING ELSE: a category the canonical map reads as
    // merchant outranks the same noble-reading name, and the name alone forms nothing.
    const byCategory = drive({ ticks: 1, townsAt: () => [town({ factions: [faction('House Verren', { category: 'trade' })] })] });
    expect(Object.keys(housesOf(byCategory.worldState))).toEqual(['s1:house_verren']);
    expect(drive({ ticks: 1, townsAt: () => [town({ factions: [faction('House Verren')] })] }).worldState).toEqual({});
    const source = codeOnly(readFileSync(join(ROOT, 'src/domain/worldPulse/houseLedger.js'), 'utf8'));
    // anchored: the drives above prove the eligibility door is live and decisive in this file, so the absence of a second archetype reader is a fact about the door rather than an empty source.
    expect(source).not.toMatch(/inferFactionArchetype|matchFactionArchetype|ARCHETYPE_RULES/);
  });

  test('the house key EQUALS the faction plane identity for every generated faction, and the one recorded divergence is pinned', () => {
    const generated = [
      { name: 'Verren Merchant Guild' }, { faction: 'Aldous Trade Consortium', name: 'legacy alias' },
      { name: '  The Harbour Watch ' }, {},
    ];
    generated.forEach((shape, index) => {
      expect(houseFactionId('s1', shape, index)).toBe(factionCompetitionId('s1', shape, index));
    });
    // RECORDED DIVERGENCE (houseLedger.js header): a DM-added faction's durable id keys the
    // faction plane, while the house keys by name, the one arm both walkers admit here.
    const added = { id: 'faction.verren', name: 'Verren Merchant Guild' };
    expect(houseFactionId('s1', added, 0)).toBe('s1:verren_merchant_guild');
    expect(factionCompetitionId('s1', added, 0)).toBe('s1:faction_verren');
    expect(HOUSE_LEDGER_TUNING.absenceGraceTicks).toBe(FACTION_STATE_PRUNE_GRACE_TICKS);
  });

  test('a renamed faction that never returns is never orphaned: its house sleeps with its books and closes with a receipt on the faction plane grace', () => {
    const before = drive({ ticks: 15, townsAt: () => [town({ factions: [faction('Verren Merchant Guild')] })] });
    const key = 's1:verren_merchant_guild';
    expect(housesOf(before.worldState)[key]).toBeTruthy();
    const after = drive({
      ticks: 5, from: 15, start: before.worldState,
      townsAt: () => [town({ factions: [faction('Verren Salt Company')] })],
    });
    const gone = after.log.filter((r) => r.factionId === key);
    expect(gone).toEqual([
      { tick: 15, event: 'dormant', settlementId: 's1', factionId: key, reason: 'absent' },
      { tick: 15 + HOUSE_LEDGER_TUNING.absenceGraceTicks, event: 'closed', settlementId: 's1', factionId: key, reason: 'dissolved' },
    ]);
    expect(after.worldState).toEqual({});
  });

  test('ruin is reachable from the top band: a dominant house whose town falls to its bottom band closes with a ruin receipt', () => {
    const fall = 40;
    const { log } = drive({
      ticks: 200, townsAt: (tick) => [town({ prosperity: tick < fall ? 'Wealthy' : 'Struggling' })],
    });
    const key = 's1:verren_merchant_guild';
    const ruin = log.find((r) => r.factionId === key && r.event === 'ruined');
    expect(ruin).toBeTruthy();
    expect(ruin.tick).toBeGreaterThan(fall);
    const path = log.filter((r) => r.factionId === key && r.event === 'holdings' && r.tick <= ruin.tick)
      .map((r) => `${r.from}>${r.to}`);
    expect(path.slice(0, 2)).toEqual(['steady>prosperous', 'prosperous>dominant']);
    expect(path).toContain('dominant>prosperous');
    expect(path.at(-1)).toBe('thin>broken');
    // The latch, read back off the saved world one tick after the fall: books gone, tombstone kept.
    const after = drive({
      ticks: ruin.tick + 1, townsAt: (tick) => [town({ prosperity: tick < fall ? 'Wealthy' : 'Struggling' })],
    });
    expect(housesOf(after.worldState)[key]).toEqual({ factionId: key, settlementId: 's1', ruinedAtTick: ruin.tick });
  });

  test('the no-undead-house cooldown: a still-eligible faction does not re-open inside the cooldown, and returns after it with its lineage', () => {
    const fall = 40;
    const key = 's1:verren_merchant_guild';
    const first = drive({ ticks: 200, townsAt: (tick) => [town({ prosperity: tick < fall ? 'Wealthy' : 'Struggling' })] });
    const ruin = first.log.find((r) => r.factionId === key && r.event === 'ruined');
    const cooldown = HOUSE_LEDGER_TUNING.ruinCooldownTicks;
    const inside = first.log.filter((r) => r.factionId === key && r.tick > ruin.tick && r.tick < ruin.tick + cooldown);
    expect(inside).toEqual([]);
    const back = first.log.find((r) => r.factionId === key && r.tick >= ruin.tick + cooldown);
    expect(back).toEqual({ tick: ruin.tick + cooldown, event: 'returned', settlementId: 's1', factionId: key, lineage: 1 });
  });

  test('the dormant-with-books normalizer round-trips a hand-built old-shape save', () => {
    const oldShape = {
      's1:verren': {
        books: {
          holdings: 'prosperous', credit: 'flush',
          interests: [{ kind: 'route', sinceTick: 5 }, { kind: 'bogus', sinceTick: 1 }, { kind: 'route', sinceTick: 2 }],
        },
        appetite: 'bold', credibility: 'trusted', updatedTick: 7, dormantSince: 9, stray: 'x',
      },
      's2:gone': { ruinedAtTick: 4, lineage: 2 },
      's3:odd': { books: { holdings: 'fabulous' }, appetite: 'reckless' },
      junk: 5,
    };
    const healed = normalizeHouses(oldShape);
    expect(healed).toEqual({
      's1:verren': {
        factionId: 's1:verren', settlementId: 's1',
        books: { holdings: 'prosperous', credit: 'flush', interests: [{ kind: 'route', sinceTick: 5 }] },
        appetite: 'bold', credibility: 'trusted', updatedTick: 7, dormantSince: 9,
      },
      's2:gone': { factionId: 's2:gone', settlementId: 's2', ruinedAtTick: 4, lineage: 2 },
      's3:odd': {
        factionId: 's3:odd', settlementId: 's3',
        books: { holdings: 'steady', credit: 'sound', interests: [] },
        appetite: 'measured', credibility: 'untested', updatedTick: 0,
      },
    });
    expect(normalizeHouses(clone(healed))).toEqual(healed);
    // The writer keeps the dormant house dormant WITH its books while its faction is ineligible.
    const out = advanceHouses({
      snapshot: { settlements: [town({ factions: [faction('Verren')] })] },
      worldState: { spatialLedgers: { [HOUSES_LEDGER_KEY]: oldShape } },
      tick: 10,
      rules: LIT,
    });
    expect(out.ledger['s1:verren']).toEqual(healed['s1:verren']);
    expect(out.receipts).toEqual([]);
  });
});

describe('TR-2 — the editor line (R-32): the direction row, the predicate, the chooser, the factor', () => {
  test('direct-house resolves through resolveDecree for every verb of the closed set and refuses a verb outside it', () => {
    const catalogues = { opTypes: HOUSE_DIRECTION_OP_TYPES, pools: {} };
    const op = (act) => ({
      type: HOUSE_DIRECTION_TYPE, target: { kind: 'faction', id: 's1:verren' }, payload: { houseId: 's1:verren', act },
    });
    let registry = [];
    HOUSE_ACT_VERBS.forEach((act, index) => {
      registry = stage(registry, op(act), { id: `d${index}`, orderedAt: 't0' });
    });
    expect(registry.length).toBe(HOUSE_ACT_VERBS.length);
    for (const entry of registry) expect(resolveDecree(entry, catalogues)).toEqual({ ok: true });
    const outside = stage([], op('corner_attempt'), { id: 'x', orderedAt: 't0' })[0];
    expect(resolveDecree(outside, catalogues)).toEqual({ ok: false, missing: 'pool-value', was: 'corner_attempt' });
    const row = HOUSE_DIRECTION_OP_TYPES[HOUSE_DIRECTION_TYPE];
    expect(Object.keys(row).sort()).toEqual(Object.keys(OP_TYPES['add-faction']).sort());
    expect(row.target).toBe('faction');
    expect(row.requires).toEqual({ world: [HOUSE_STANDING_CONDITION], registry: [] });
    expect(row.payload.act.values).toBe(HOUSE_ACT_VERBS);
    expect(HOUSE_DIRECTION_TYPE).toBe('direct-house');
  });

  test('houseStanding holds TRUE with its subjects in a lit world and FALSE with none dark', () => {
    const { worldState } = drive({ ticks: 1 });
    const lit = { worldState: { ...worldState, simulationRules: { [FLAG]: true } } };
    const houses = ['s1:aldous_trade_consortium', 's1:verren_merchant_guild'];
    expect(HOUSE_STANDING_ROW.subjects({ id: 's1' }, lit)).toEqual(houses);
    expect(HOUSE_STANDING_ROW.predicate({ id: 's1' }, lit)).toBe(true);
    expect(HOUSE_STANDING_ROW.subjects({ id: 's2' }, lit)).toEqual([]);
    for (const campaign of [
      { worldState: { ...worldState } },
      { worldState: { ...worldState, simulationRules: { [FLAG]: false } } },
      { worldState: { simulationRules: { [FLAG]: true } } },
      null,
    ]) {
      expect(HOUSE_STANDING_ROW.subjects({ id: 's1' }, campaign)).toEqual([]);
      expect(HOUSE_STANDING_ROW.predicate({ id: 's1' }, campaign)).toBe(false);
    }
    // A sleeping house is no subject: it takes no act a seal could direct.
    const asleep = clone(lit);
    asleep.worldState.spatialLedgers.houses['s1:verren_merchant_guild'].dormantSince = 1;
    expect(HOUSE_STANDING_ROW.subjects({ id: 's1' }, asleep)).toEqual(['s1:aldous_trade_consortium']);
    expect(HOUSE_STANDING_ROW.source).toBe('live');
  });

  test('the chooser is import-pinned to nothing and answers a verb of the closed set or nothing (guard the guard at a truth reader)', () => {
    const importsOf = (rel) => [...readFileSync(join(ROOT, rel), 'utf8').matchAll(/^\s*import\s[\s\S]*?from\s+'([^']+)';/gm)]
      .map((m) => m[1]);
    expect(importsOf('src/domain/worldPulse/houseActs.js')).toEqual([]);
    // POSITIVE CONTROL: the same scan reads a legitimate truth reader's imports.
    expect(importsOf('src/domain/roads/state.js').length).toBeGreaterThan(0);
    const answers = new Set();
    for (const holdings of ['broken', 'thin', 'steady', 'prosperous', 'dominant']) {
      for (const appetite of ['wary', 'measured', 'bold']) {
        for (const townBand of [0, 1, 2, 3, 4]) {
          answers.add(chooseHouseAct({ books: { holdings, credit: 'sound' }, appetite, townBand, liveInterests: [] }));
        }
      }
    }
    expect([...answers].filter((a) => a !== null).sort()).toEqual([...HOUSE_ACT_VERBS]);
    expect(chooseHouseAct(null)).toBeNull();
  });

  test('the factor is cast per act through the one chokepoint: a jailed member is never cast, none castable is none, and the ledger stores no person', () => {
    const guild = faction('Verren Merchant Guild');
    const settlement = town().settlement;
    expect(castHouseFactor(settlement, guild)).toBe('n2');
    expect(castHouseFactor({ ...settlement, npcs: [settlement.npcs[1], { id: 'n0', factionAffiliation: 'Verren Merchant Guild', status: 'dead' }] }, guild)).toBe('');
    const { worldState, log } = drive({ ticks: 3 });
    const acts = log.filter((r) => r.event === 'act' && r.factionId === 's1:verren_merchant_guild');
    expect(acts.length).toBeGreaterThan(0);
    expect(acts.every((r) => r.factorId === 'n2')).toBe(true);
    // anchored: the acts above prove a factor WAS cast on this very drive, so a person absent from the saved ledger is the never-stored law and not an empty run.
    expect(JSON.stringify(housesOf(worldState))).not.toMatch(/\bn2\b/);
  });
});
