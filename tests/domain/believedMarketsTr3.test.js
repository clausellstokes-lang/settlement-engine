/**
 * believedMarketsTr3.test.js — TR-3 BELIEVED MARKETS: the wave's acceptance file (the FP kit's
 * BUILD-FP-D2 brief, TR-3 version 2; the compiled block #25; docs/DESIGN_FP_ARCH_TR.md §4 TR-3;
 * docs/DESIGN_FP_TRADE.md §3 Seam Three and §TR-3; R-5, R-33).
 *
 * THE FOUR-FENCE DORMANCY SET for `believedMarketsEnabled`, plus the lit-mutant control that
 * proves the fences can see (§3's flag law; TR-2's acceptance file is the precedent):
 *   FENCE 1 — OWN FOOTPRINT: dark, the orchestrator's whole output is the pre-TR-3 output, byte
 *     for byte, pinned as a sha256 MEASURED AT THE BASE (1266810ef) over a fixture that sends its
 *     caravan to the OTHER market and tells a wrong-market arrival the moment the key is lit.
 *   FENCE 2 — ABSENT vs EXPLICIT FALSE over a multi-tick drive, blind by design and never alone.
 *   FENCE 3 — CALL PATH: pass-through spies on the WHERE composer and the tellable, reached
 *     CROSS-MODULE from commodityFlow.js, count zero dark and more than zero lit, at the orchestrator
 *     and through the real pulse.
 *   FENCE 4 — GATE POLARITY over the real tree: every code read of the key is the strict `=== true`.
 *   THE HASH ARM — dark, the REAL PULSE RECORD over six ticks is the pre-TR-3 record byte for byte:
 *     one sha256, measured at the base under this runner, for every dark spelling.
 * Then the acceptance rows: the WHERE order (belief first, truth breaks a belief tie, the key
 * last), the destination-consumer seam's permutation law, the no-merge token scan and its seeded
 * deliberate-average control, the co-import whitelist census and its widen plant, the belief
 * leaf's import pin with its guard-the-guard control at the truth-side derivation, staleness
 * reachable through the REAL belief fold, the T-1 tellable produced and voiced through its
 * registered kind, `direct-trade` through EM-C1's resolver with the phantom refusal, and the one
 * pin that a DM stock edit never writes a belief.
 *
 * THE CHAIR'S AMENDMENT (2026-09-23) holds for this wave as for TR-2: no transport carries a
 * settlement-scale direction to a pulse layer, so `direct-trade` is DEFINED and proven headless.
 * TR-3-c: the consumer lands when U123 composes the direction transport.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, test, vi } from 'vitest';

import { codeOnly } from '../helpers/codeOnlySource.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

/** FENCE 3's recorder. Hoisted, because vi.mock factories hoist above the imports. */
const calls = vi.hoisted(() => ({ order: 0, arrival: 0 }));

vi.mock('../../src/domain/spatial/dispatchDestination.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // STRICT pass-throughs: the original's answer, counted.
    composeDispatchOrder: (...args) => {
      calls.order += 1;
      return actual.composeDispatchOrder(...args);
    },
    wrongMarketArrival: (...args) => {
      calls.arrival += 1;
      return actual.wrongMarketArrival(...args);
    },
  };
});

const { advanceCommodityFlow, COMMODITY_BANDS } = await import('../../src/domain/spatial/commodityFlow.js');
const {
  DIRECT_TRADE_REFUSAL, TRADE_DIRECTION_OP_TYPES, TRADE_DIRECTION_TYPE, believedMarketsActive,
  composeDispatchOrder, directTradeDestinations, directTradeRefusal, wrongMarketArrival,
} = await import('../../src/domain/spatial/dispatchDestination.js');
const { dispatchDestinationOrder } = await import('../../src/domain/spatial/dispatchEV.js');
const {
  BELIEVED_DEAR_BANDS, believedDearnessRank, believedScarcityOf, goodClassOf,
} = await import('../../src/domain/worldPulse/beliefScarcity.js');
const { SCARCITY_BANDS, scarcityGroundTruth } = await import('../../src/domain/worldPulse/beliefAxisSubjects.js');
const { advanceBeliefMaps } = await import('../../src/domain/worldPulse/beliefMap.js');
const { MARKET_KINDS, MARKET_KIND_REGISTRY, WRONG_MARKET_ARRIVAL_KIND, wrongMarketArrivalNewsEntry } = await import('../../src/domain/worldPulse/marketNews.js');
const { resolveDecree, stage } = await import('../../src/domain/edit/registry.js');
const { OP_TYPES } = await import('../../src/domain/edit/operations.js');
const { OFF_STAGE_OP_TYPES } = await import('../../src/domain/edit/operationsOffStage.js');
const { WORLD_CONDITIONS } = await import('../../src/domain/edit/worldConditions.js');
const { PHANTOM_KIND, isPhantomRecord } = await import('../../src/domain/edit/phantoms.js');
const { REGIONAL_GOOD_CATEGORIES } = await import('../../src/domain/region/goodsCatalog.js');
const { ensureRegionalGraph } = await import('../../src/domain/region/index.js');
const { buildSpatialDigest } = await import('../../src/domain/spatial/index.js');
const { simulateCampaignWorldPulse } = await import('../../src/domain/worldPulse/index.js');
const { COUPLING_REGISTRY } = await import('../../src/domain/certification/couplingRegistry.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FLAG = 'believedMarketsEnabled';
/** The lit rules, spelled LITERALLY: the estate's lit-coverage walker credits a flag by the literal `<flag>: true`. */
const LIT = Object.freeze({ believedMarketsEnabled: true });
/** Every dark spelling: absent, false, and two truthy non-true values. */
const DARK_RULES = [{}, { [FLAG]: false }, { [FLAG]: 'true' }, { [FLAG]: 1 }];

/**
 * THE BASE MEASUREMENTS. Each is the sha256 of JSON.stringify of the named output, taken at the
 * lane's base 1266810ef with the pre-TR-3 engine before a line of this wave existed: the two
 * orchestrator figures under this runner (vitest, --pool=threads), the pulse figure over an
 * archive of the base tree (node) and reproduced by this file on the TR-3 tree, dark. The pulse
 * fixture threads `now` into the regional graph it builds, because an unthreaded ensure stamps
 * its edges from the wall clock and no figure over a clock is a measurement. Dark must reproduce
 * all three exactly.
 */
const BASE_SHA = Object.freeze({
  // advanceCommodityFlow over the contested-origin fixture below.
  contested: 'd0184eeaa5a8e88e41e680e9acabab89af854fa231cfafd88fa90f90da6ee4bd',
  // advanceCommodityFlow over the glutted-arrival fixture below.
  glutted: '9cdc1dee37cd4cb8000853e01f3837bb155fe72f06d32557717e927e318e5a6a',
  // the six pulse records of the three-town campaign below.
  pulse: 'c0f7940a1cdfe9e2c2c5058bfd554ef3072a6301bd437883ed368ae26bb56245',
});

const sha = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
/**
 * The pulse record's hash with the flag's own key dropped wherever it rides. A pulse record
 * carries the campaign's rules verbatim, so an explicit `false` is a key the base world never
 * had; dropping the KEY (never a value) is what lets every dark spelling be held to the one base
 * figure, and for the absent spelling the replacer changes nothing.
 */
const pulseSha = (records) => createHash('sha256')
  .update(JSON.stringify(records, (key, value) => (key === FLAG ? undefined : value))).digest('hex');
const clone = (value) => JSON.parse(JSON.stringify(value));

// ── The orchestrator fixtures ─────────────────────────────────────────────────
const IRON = 'iron';
const DEAR = SCARCITY_BANDS[0];
const TIGHT = SCARCITY_BANDS[1];

/** One supplier, two markets, a road each. */
function starDigest() {
  return {
    spatialCanonVersion: 1,
    settlementIds: ['amber_ford', 'brook_end', 'iron_vale'],
    gates: [{ between: ['iron_vale', 'amber_ford'], cost: 150 }, { between: ['iron_vale', 'brook_end'], cost: 150 }],
    distanceMatrix: {
      iron_vale: { amber_ford: 150, brook_end: 150 },
      amber_ford: { iron_vale: 150, brook_end: 300 },
      brook_end: { iron_vale: 150, amber_ford: 300 },
    },
    tiers: { iron_vale: { amber_ford: 1, brook_end: 1 }, amber_ford: { iron_vale: 1, brook_end: 2 }, brook_end: { iron_vale: 1, amber_ford: 2 } },
  };
}

const link = (settlementId) => ({
  institutionId: 'The Smithy', institutionName: 'The Smithy', settlementId, input: IRON,
  rankedSources: [{ sourceId: 'iron_vale', cost: 150 }], target: 8, critical: true,
});

/** A belief record as the fold writes it, carrying one believed band for the iron's class. */
const record = (band) => ({
  readiness: 0, strengthBand: 2, allianceLabel: 'trade_partner', faithLabel: null, confidence01: 1,
  lastUpdateTick: 0, populationTrendBand: 0, observanceLabel: null, scarcityBands: { raw_material: band },
});

/** A believing world: SP-B's scarcity family lit, beliefs live, iron_vale's court holding a picture. */
function believingWorld(rules, beliefMaps = { iron_vale: { seat: { amber_ford: record(TIGHT), brook_end: record(DEAR) } } }) {
  return {
    spatialCanonVersion: 1,
    simulationRules: { commodityFlowEnabled: true, infoMode: 'perfect_delayed', beliefAxesEnabled: true, believedScarcityEnabled: true, ...rules },
    spatialLedgers: {
      commodityStocks: { amber_ford: { iron: 3 }, brook_end: { iron: 3 }, iron_vale: { iron: 4 } },
      beliefMaps,
    },
  };
}

/**
 * THE CONTESTED ORIGIN: iron_vale can fill ONE market this tick. Dark, the codepoint walk sends
 * the caravan to amber_ford; lit, the court believes brook_end dear and amber_ford only tight.
 */
function contested(rules) {
  return advanceCommodityFlow({
    producers: [{ settlementId: 'iron_vale', good: IRON, rate: 3, cap: 18 }],
    links: [link('amber_ford'), link('brook_end')],
    worldState: believingWorld(rules), digest: starDigest(), tick: 5,
  });
}

/**
 * THE GLUTTED ARRIVAL: a caravan iron_vale sent to brook_end lands this tick, and brook_end has
 * begun making its own iron, so the market it finds is in surplus while iron_vale still holds
 * brook_end dear. `short` is the honest twin: the same caravan landing in a market still short
 * of what it came for, brook_end making nothing.
 */
function glutted(rules, beliefMaps, short = false) {
  const worldState = believingWorld(rules, beliefMaps);
  worldState.spatialLedgers.commodityStocks = { amber_ford: { iron: 8 }, brook_end: { iron: short ? 1 : 6 }, iron_vale: { iron: 10 } };
  worldState.spatialLedgers.supplyShipments = {
    'brook_end:The Smithy:iron': {
      institutionId: 'The Smithy', settlementId: 'brook_end', input: IRON, sourceId: 'iron_vale', arrivalTick: 5, carried: 6, starving: false,
    },
  };
  const producers = [{ settlementId: 'iron_vale', good: IRON, rate: 3, cap: 18 }];
  if (!short) producers.push({ settlementId: 'brook_end', good: IRON, rate: 6, cap: 36 });
  return advanceCommodityFlow({
    producers, links: [link('amber_ford'), link('brook_end')], worldState, digest: starDigest(), tick: 5,
  });
}

/** Drive the orchestrator tick by tick, feeding its ledgers back through JSON (the save path). */
function drive(rules, ticks = 12) {
  let worldState = believingWorld(rules);
  const trail = [];
  for (let tick = 5; tick < 5 + ticks; tick += 1) {
    const out = advanceCommodityFlow({
      producers: [{ settlementId: 'iron_vale', good: IRON, rate: 3, cap: 18 }],
      links: [link('amber_ford'), link('brook_end')], worldState: clone(worldState), digest: starDigest(), tick,
    });
    trail.push(clone(out));
    const ledgers = { ...worldState.spatialLedgers };
    if (out.nextStocks) ledgers.commodityStocks = out.nextStocks; else delete ledgers.commodityStocks;
    if (out.nextShipments) ledgers.supplyShipments = out.nextShipments; else delete ledgers.supplyShipments;
    worldState = { ...worldState, spatialLedgers: ledgers };
  }
  return trail;
}

// ── The pulse fixture (the dispatchEV kernel test's campaign, with two markets) ──
const NOW = '2026-01-01T00:00:00.000Z';
const TOWNS = ['amber_ford', 'brook_end', 'iron_vale'];
const WROUGHT = 'Wrought iron';

function pulseDigest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placed = placeSettlements(pack, TOWNS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: TOWNS[i], cellId: p.cellId })) });
}

function town(name, { exports = [], imports = [], necessity = [], factions = [] } = {}) {
  return {
    name, tier: 'town', population: 1600,
    config: { tradeRouteAccess: 'road' },
    institutions: [{ name: 'The Smithy' }],
    economicState: {
      primaryExports: exports, primaryImports: imports, necessityImports: necessity,
      activeChains: (imports.length || necessity.length)
        ? [{ needKey: 'manufacturing', chainId: 'smithing', resource: (imports[0] || necessity[0]), processingInstitutions: ['The Smithy'], outputs: ['Tools'] }]
        : (exports.length ? [{ needKey: 'extraction', chainId: 'mining', resource: exports[0], exportable: true, outputs: [exports[0]] }] : []),
    },
    powerStructure: { publicLegitimacy: { score: 40 }, factions, conflicts: [] },
    factions, npcs: [], activeConditions: [],
  };
}

const save = (id, name, opts) => ({ id, name, phase: 'canon', settlement: town(name, opts), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

/** Six real pulses over a believing three-town campaign; every record returned. */
function drivePulse(extraRules, ticks = 6) {
  let saves = [
    save('amber_ford', 'Amber Ford', { imports: [WROUGHT] }),
    save('brook_end', 'Brook End', { imports: [WROUGHT], necessity: [WROUGHT] }),
    save('iron_vale', 'Iron Vale', { exports: [WROUGHT], factions: [{ name: "Merchants' Guild", category: 'merchant', power: 80 }] }),
  ];
  let campaign = {
    id: 'tr3-believed-markets', name: 'Believed markets', settlementIds: [...TOWNS],
    worldState: {
      rngSeed: 'tr3-believed-markets', tick: 1,
      simulationRules: { warLayerEnabled: true, commodityFlowEnabled: true, infoMode: 'perfect_delayed', beliefAxesEnabled: true, believedScarcityEnabled: true, ...extraRules },
      stressors: [], spatialCanonVersion: 1, spatialDigest: pulseDigest(),
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'e.a.i', from: 'amber_ford', to: 'iron_vale', relationshipType: 'trade_partner' },
        { id: 'e.b.i', from: 'brook_end', to: 'iron_vale', relationshipType: 'trade_partner' },
      ],
      channels: [],
    }, { now: NOW }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  const records = [];
  for (let tick = 0; tick < ticks; tick += 1) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.worldState?.regionalGraph || campaign.regionalGraph };
    records.push(r);
  }
  return records;
}

/** @param {string} dir @param {string[]} out */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(p);
  }
  return out;
}

/** The static relative imports of one source, resolved to repo paths. */
function importsOf(rel, source = readFileSync(join(ROOT, rel), 'utf8')) {
  return [...source.matchAll(/(?:^|\n)\s*(?:import|export)\b[^;'"]*?from\s*['"]([^'"]+)['"]/g)]
    .map((m) => m[1])
    .filter((spec) => spec.startsWith('.'))
    .map((spec) => relative(ROOT, resolve(dirname(join(ROOT, rel)), spec)).replace(/\\/g, '/'));
}

describe('TR-3 — the four dormancy fences, the hash arm and the lit-mutant control', () => {
  test('fence 1 — dark, the orchestrator output is the base output byte for byte, over fixtures that move the moment the key is lit', () => {
    for (const rules of DARK_RULES) {
      const out = contested(rules);
      expect(sha(out), `rules=${JSON.stringify(rules)}`).toBe(BASE_SHA.contested);
      expect(sha(glutted(rules)), `rules=${JSON.stringify(rules)}`).toBe(BASE_SHA.glutted);
      // anchored: the two hash equalities above pin the whole output to the base, so a key that is absent here is absent from an output that is otherwise exactly the pre-wave one.
      expect('wrongMarketArrivals' in out).toBe(false);
    }
  });

  test('THE LIT-MUTANT CONTROL — the same fixtures lit send the caravan to the believed-dear market and tell the wrong-market arrival', () => {
    const dark = contested({});
    expect(Object.keys(dark.nextShipments)).toEqual(['amber_ford:The Smithy:iron']);
    const lit = contested(LIT);
    expect(Object.keys(lit.nextShipments)).toEqual(['brook_end:The Smithy:iron']);
    expect(lit.nextShipments['brook_end:The Smithy:iron'].carried).toBe(dark.nextShipments['amber_ford:The Smithy:iron'].carried);
    // anchored: the glutted fixture two lines below tells exactly one arrival under the same key, so an empty list here is a fixture with no landing rather than a tellable that never speaks.
    expect(lit.wrongMarketArrivals).toEqual([]);
    const told = glutted(LIT);
    expect(told.wrongMarketArrivals).toEqual([{
      originId: 'iron_vale', destinationId: 'brook_end', good: IRON, goodClass: 'raw_material',
      believedBand: DEAR, foundBand: COMMODITY_BANDS.SURPLUS,
    }]);
    // The physics is untouched by the WHERE: the goods balance still closes, lit.
    const { before, produced, after, consumed, lost } = lit.accounting;
    expect(before + produced).toBe(after + consumed + lost);
  });

  test('fence 2 — absent and explicit false are the same trail over a twelve-tick drive', () => {
    const absent = drive({});
    const off = drive({ [FLAG]: false });
    expect(off).toEqual(absent);
    expect(absent.some((out) => out.nextShipments)).toBe(true);
  });

  test('fence 3 — the call path: dark, the destination loop never consults the WHERE composer or the tellable; lit, it does', () => {
    calls.order = 0;
    calls.arrival = 0;
    for (const rules of DARK_RULES) {
      contested(rules);
      glutted(rules);
    }
    // anchored: the same two fixtures lit, three lines below, drive both counters above zero, so zero here is the dark path and not a spy that stopped counting.
    expect(calls).toEqual({ order: 0, arrival: 0 });
    contested(LIT);
    glutted(LIT);
    expect(calls.order).toBeGreaterThan(0);
    expect(calls.arrival).toBeGreaterThan(0);
  });

  test('THE HASH ARM — dark, six real pulse records are the base records byte for byte, and lit the pulse reaches the composer', () => {
    calls.order = 0;
    for (const rules of DARK_RULES) {
      expect(pulseSha(drivePulse(rules)), `rules=${JSON.stringify(rules)}`).toBe(BASE_SHA.pulse);
    }
    // anchored: the lit pulse on the next lines reaches the composer through the same spy, so zero here is a dark pulse and not a dead counter.
    expect(calls.order).toBe(0);
    drivePulse(LIT);
    expect(calls.order).toBeGreaterThan(0);
  }, 120_000);

  test('fence 4 — the gate polarity census: every code read of the key is the strict === true form', () => {
    /** @type {string[]} */
    const reads = [];
    /** @type {string[]} */
    const loose = [];
    for (const abs of walk(join(ROOT, 'src'))) {
      const rel = relative(ROOT, abs).replace(/\\/g, '/');
      const code = codeOnly(readFileSync(abs, 'utf8'));
      for (const match of code.matchAll(/\bbelievedMarketsEnabled\b/g)) {
        const tail = code.slice(match.index + match[0].length, match.index + match[0].length + 12);
        (/^\s*===\s*true/.test(tail) ? reads : loose).push(rel);
      }
    }
    // anchored: the reads list on the next line holds the one strict read the scan found, so an empty loose list is a fact about a scan that sees.
    expect(loose, 'a read of the key that is not the strict === true form').toEqual([]);
    expect(reads).toEqual(['src/domain/spatial/dispatchDestination.js']);
    expect(believedMarketsActive({ simulationRules: LIT })).toBe(true);
    for (const rules of [...DARK_RULES, null]) expect(believedMarketsActive({ simulationRules: rules })).toBe(false);
  });
});

describe('TR-3 — the WHERE composer and the seam it rides', () => {
  test('the WHERE order: believed dearness first, the truth-side need only on a belief tie, the loop key last', () => {
    const worldState = believingWorld(LIT, {
      iron_vale: { seat: { amber_ford: record(TIGHT), brook_end: record(DEAR), cold_rill: record(SCARCITY_BANDS[3]) } },
    });
    const candidate = (key, destinationId, stock) => ({ key, destinationId, good: IRON, observerId: 'iron_vale', stock, target: 8 });
    // brook_end is believed dear, amber_ford tight, cold_rill plentiful; dusk_hollow is unheard.
    expect(composeDispatchOrder([
      candidate('a', 'amber_ford', 7), candidate('b', 'brook_end', 7),
      candidate('c', 'cold_rill', 0), candidate('d', 'dusk_hollow', 7),
    ], worldState)).toEqual(['b', 'a', 'd', 'c']);
    // Two markets believed alike: the deeper TRUE need goes first, and the key breaks a full tie.
    const twin = believingWorld(LIT, { iron_vale: { seat: { amber_ford: record(DEAR), brook_end: record(DEAR) } } });
    expect(composeDispatchOrder([candidate('a', 'amber_ford', 6), candidate('b', 'brook_end', 1)], twin)).toEqual(['b', 'a']);
    expect(composeDispatchOrder([candidate('b', 'brook_end', 4), candidate('a', 'amber_ford', 4)], twin)).toEqual(['a', 'b']);
    // Nothing heard at all: every market ranks alike, so the order is need, then the key.
    expect(composeDispatchOrder([candidate('b', 'brook_end', 4), candidate('a', 'amber_ford', 4)], believingWorld(LIT, {}))).toEqual(['a', 'b']);
    expect(composeDispatchOrder(null, worldState)).toEqual([]);
    // The rank ladder is SP-B's own, by position: the two dear rungs first, silence beside the first rung that is not dear.
    expect(SCARCITY_BANDS.map(believedDearnessRank)).toEqual([0, 1, 2, 3]);
    expect(BELIEVED_DEAR_BANDS).toEqual(SCARCITY_BANDS.slice(0, 2));
    expect(believedDearnessRank(null)).toBe(believedDearnessRank(SCARCITY_BANDS[2]));
  });

  test('the destination-consumer seam admits a permutation of the loop\'s own keys and nothing else', () => {
    const keys = new Set(['c', 'a', 'b']);
    expect(dispatchDestinationOrder(keys)).toEqual(['a', 'b', 'c']);
    expect(dispatchDestinationOrder(keys, null)).toEqual(['a', 'b', 'c']);
    expect(dispatchDestinationOrder(keys, (sorted) => [...sorted].reverse())).toEqual(['c', 'b', 'a']);
    // A WHERE can never create, drop or duplicate a caravan: each refused order leaves the codepoint walk.
    for (const bad of [['c', 'b'], ['c', 'b', 'b'], ['c', 'b', 'z'], null, 'abc']) {
      expect(dispatchDestinationOrder(keys, () => bad), JSON.stringify(bad)).toEqual(['a', 'b', 'c']);
    }
    // The composer is handed a COPY, so a composer that sorts in place cannot corrupt the walk it is refused against.
    expect(dispatchDestinationOrder(keys, (sorted) => sorted.reverse() && ['x'])).toEqual(['a', 'b', 'c']);
  });

  test('the loop\'s three need-premium sites still read the truth-side need verbatim, and the EV decision is untouched', () => {
    const source = codeOnly(readFileSync(join(ROOT, 'src/domain/spatial/commodityFlow.js'), 'utf8'));
    expect(source.match(/needPremium\(cur, target\)/g)).toHaveLength(3);
    expect(source.match(/\bdispatchDecision\(/g)).toHaveLength(1);
    // The composer enters the loop through the seam alone: one consult of each export, both behind the one gate read.
    expect(source.match(/\bcomposeDispatchOrder\(/g)).toHaveLength(1);
    expect(source.match(/\bwrongMarketArrival\(/g)).toHaveLength(1);
    expect(source.match(/\bbelievedMarketsActive\(/g)).toHaveLength(1);
  });
});

describe('TR-3 — Seam Three: the two scarcities are read side by side and never merged', () => {
  /** The belief side's values in the composer carry the `believed` stem; the truth side's are the need premium and the found band. */
  const BELIEF_TOKEN = /\bbelieved[A-Z]\w*|\bBELIEVED_\w+/;
  const TRUTH_TOKEN = /\bneedPremium\b|\bfoundBand\b|\btruth[A-Z]\w*/;
  /** A binary arithmetic operator between two operands (never `=>`, `++`, `--`, a sign or a comparison). */
  const ARITHMETIC = /[\w)\]]\s*(?:[-+*/%])\s*[\w(.[]/;
  /**
   * THE NO-MERGE SCAN: every statement of a composer's code, split at `;`, `{` and `}`, that
   * holds a belief-side token AND a truth-side token AND a binary arithmetic operator.
   * @param {string} source @returns {string[]}
   */
  const mergedStatements = (source) => codeOnly(source)
    .split(/[;{}]/)
    .map((statement) => statement.replace(/\s+/g, ' ').trim())
    .filter((statement) => BELIEF_TOKEN.test(statement) && TRUTH_TOKEN.test(statement) && ARITHMETIC.test(statement));
  const COMPOSER = 'src/domain/spatial/dispatchDestination.js';

  test('the no-merge token scan finds no expression mixing the two sides, and a SEEDED deliberate band-average reds it', () => {
    const source = readFileSync(join(ROOT, COMPOSER), 'utf8');
    // anchored: the seeded average below is caught by this same scan on this same source, so an empty result here is the absence of a merge rather than a scan that stopped seeing.
    expect(mergedStatements(source)).toEqual([]);
    // Both sides really are READ in this file, so the empty answer above is a statement about how they meet.
    expect(BELIEF_TOKEN.test(codeOnly(source))).toBe(true);
    expect(TRUTH_TOKEN.test(codeOnly(source))).toBe(true);
    // GUARD THE GUARD: the deliberate average the seam forbids, planted into the real composer.
    const seeded = `${source}\nexport function blendedWhere(entry) { return (entry.believedRank + entry.needPremium) / 2; }\n`;
    expect(mergedStatements(seeded)).toEqual(['return (entry.believedRank + entry.needPremium) / 2']);
    // …and a sum spelled the other way round, through a belief export and a found band.
    const summed = `${source}\nconst bent = foundBand.length * BELIEVED_DEAR_BANDS.length;\n`;
    expect(mergedStatements(summed)).toHaveLength(1);
  });

  test('THE WHITELIST: the dispatch composer is the ONLY module that imports a belief-side and a truth-side scarcity read, and a third co-importer reds', () => {
    const BELIEF_SIDE = new Set(['src/domain/worldPulse/beliefScarcity.js']);
    const TRUTH_SIDE = new Set(['src/domain/spatial/dispatchEV.js', 'src/domain/spatial/commodityFlow.js']);
    const coImporters = (sources) => Object.entries(sources)
      .filter(([rel, source]) => {
        const deps = importsOf(rel, source);
        return deps.some((dep) => BELIEF_SIDE.has(dep)) && deps.some((dep) => TRUTH_SIDE.has(dep));
      })
      .map(([rel]) => rel)
      .sort();
    /** @type {Record<string, string>} */
    const tree = {};
    for (const abs of walk(join(ROOT, 'src'))) tree[relative(ROOT, abs).replace(/\\/g, '/')] = readFileSync(abs, 'utf8');
    // Seam Three's two whitelisted thin composers; TR-6's corner composer joins this list in its own wave.
    expect(coImporters(tree)).toEqual([COMPOSER]);
    // THE WIDEN PLANT: a third module reading both sides, in memory, is named at once.
    const planted = {
      ...tree,
      'src/domain/spatial/marketPeek.js': "import { believedScarcityOf } from '../worldPulse/beliefScarcity.js';\nimport { needPremium } from './dispatchEV.js';\n",
    };
    expect(coImporters(planted)).toEqual([COMPOSER, 'src/domain/spatial/marketPeek.js']);
    // The one INFO→TRADE pair the composer mints is LICENSED by its coupling row, landed with it:
    // the read and its counterforce are this module's, and the receipt is state-rooted.
    const row = COUPLING_REGISTRY.find((entry) => entry.couplingId === 'CPL-9.INFO_TO_TRADE.TR-3.believed_dearness');
    expect(row).toMatchObject({ direction: 'INFO→TRADE', owningVolume: 'TRADE', owningWave: 'TR-3', intendedDesk: 'trade' });
    expect(row.read.split('#')[0]).toBe(COMPOSER);
    expect(row.counterforce.split('#')[0]).toBe(COMPOSER);
    expect(row.receiptField.startsWith('spatialLedgers.beliefMaps')).toBe(true);
  });

  test('the belief leaf is import-pinned to the belief family and speaks no truth token (guard the guard at the truth-side derivation)', () => {
    const LEAF = 'src/domain/worldPulse/beliefScarcity.js';
    expect(importsOf(LEAF).sort()).toEqual([
      'src/domain/region/goodsCatalog.js',
      'src/domain/worldPulse/beliefAxes.js',
      'src/domain/worldPulse/beliefAxisSubjects.js',
      'src/domain/worldPulse/beliefMap.js',
    ]);
    const TRUTH_READS = /\b(?:needPremium|commodityBand|stockOf|commodityStocks|supplyShipments|COMMODITY_BANDS)\b/;
    // anchored: the same pattern finds the truth-side derivation's own tokens one line below, so its silence over the belief leaf is a fact about the leaf.
    expect(codeOnly(readFileSync(join(ROOT, LEAF), 'utf8'))).not.toMatch(TRUTH_READS);
    // POSITIVE CONTROL: the truth-side scarcity derivation really does speak them.
    expect(codeOnly(readFileSync(join(ROOT, 'src/domain/spatial/commodityFlow.js'), 'utf8'))).toMatch(TRUTH_READS);
    // The good class is the goods catalog's own closed list, placed by the catalog itself.
    expect(goodClassOf(IRON)).toBe('raw_material');
    expect(goodClassOf('Wrought iron')).toBe('raw_material');
    expect(REGIONAL_GOOD_CATEGORIES).toContain(goodClassOf('grain'));
    expect(goodClassOf('')).toBeNull();
    expect(goodClassOf(null)).toBeNull();
  });
});

describe('TR-3 — staleness, the T-1 tellable, and what a DM edit may and may not move', () => {
  /** brook_end as generation made it (it must buy iron and makes none), and as it became (it mines its own). */
  const settle = (economicState) => ({ name: 'Brook End', tier: 'town', economicState });
  const BEFORE = { primaryImports: [WROUGHT], necessityImports: [WROUGHT] };
  const AFTER = { localProduction: [WROUGHT], primaryExports: [WROUGHT] };
  const snapshot = (brook) => ({
    settlements: [
      { id: 'amber_ford', settlement: settle({ primaryImports: [WROUGHT] }) },
      { id: 'brook_end', settlement: settle(brook) },
      { id: 'iron_vale', settlement: settle({ primaryExports: [WROUGHT] }) },
    ],
    regionalGraph: {
      edges: [
        { id: 'e.a.i', from: 'amber_ford', to: 'iron_vale', relationshipType: 'trade_partner' },
        { id: 'e.b.i', from: 'brook_end', to: 'iron_vale', relationshipType: 'trade_partner' },
      ],
    },
  });
  /** The REAL belief fold: seeded at the old truth, then six silent ticks after the truth moved. */
  function staleWorld() {
    let worldState = { spatialCanonVersion: 1, simulationRules: { infoMode: 'perfect_delayed', beliefAxesEnabled: true, believedScarcityEnabled: true } };
    let step = advanceBeliefMaps({ snapshot: snapshot(BEFORE), pressureIdx: null, worldState, tick: 0 });
    worldState = { ...worldState, spatialLedgers: { beliefMaps: step.next } };
    for (let tick = 1; tick <= 6; tick += 1) {
      step = advanceBeliefMaps({ snapshot: snapshot(AFTER), pressureIdx: null, worldState, tick });
      worldState = { ...worldState, spatialLedgers: { beliefMaps: step.next } };
    }
    return worldState;
  }

  test('staleness is REACHABLE through the real fold: a court holds a band two or more rungs from the truth, and the arrival receipt names both', () => {
    const worldState = staleWorld();
    const truth = scarcityGroundTruth(settle(AFTER)).raw_material;
    const believed = believedScarcityOf('iron_vale', 'brook_end', 'raw_material', worldState);
    expect(scarcityGroundTruth(settle(BEFORE)).raw_material).toBe(DEAR);
    expect(believed).toEqual({ known: true, band: DEAR });
    expect(SCARCITY_BANDS.indexOf(truth) - SCARCITY_BANDS.indexOf(believed.band)).toBeGreaterThanOrEqual(2);
    // RECEIPTED: the stale picture the fold kept is the one the arrival names beside the glut it found.
    const out = glutted(LIT, worldState.spatialLedgers.beliefMaps);
    expect(out.wrongMarketArrivals).toHaveLength(1);
    expect(out.wrongMarketArrivals[0]).toMatchObject({ believedBand: DEAR, foundBand: COMMODITY_BANDS.SURPLUS });
    // A court that has heard the truth tells nothing: the same arrival over a current picture is silent.
    const current = glutted(LIT, { iron_vale: { seat: { brook_end: record(truth) } } });
    // anchored: the same arrival over the stale picture told one arrival three assertions above, so silence here is the current picture, not a dead tellable.
    expect(current.wrongMarketArrivals).toEqual([]);
    // …and a caravan that lands in a market still short of what it came for tells nothing either,
    // however dear it was believed: the tellable needs BOTH halves, the belief and the glut.
    const honest = glutted(LIT, worldState.spatialLedgers.beliefMaps, true);
    expect(honest.outcomes['brook_end:The Smithy:iron'].arrived).toBe(true);
    expect(honest.outcomes['brook_end:The Smithy:iron'].band).not.toBe(COMMODITY_BANDS.SURPLUS);
    // anchored: the caravan is proven to have LANDED two lines above, so an empty list is the missing glut and not a missing arrival.
    expect(honest.wrongMarketArrivals).toEqual([]);
  });

  test('the T-1 tellable is produced on a fixture and VOICED through its registered kind', () => {
    const [arrival] = glutted(LIT).wrongMarketArrivals;
    const entry = wrongMarketArrivalNewsEntry({
      arrival, originName: 'Iron Vale', destinationName: 'Brook End', goodLabel: 'iron', tick: 5, now: NOW,
    });
    expect(MARKET_KINDS).toContain(entry.kind);
    expect(entry.kind).toBe(WRONG_MARKET_ARRIVAL_KIND);
    expect(entry.impactKind).toBe(WRONG_MARKET_ARRIVAL_KIND);
    const row = MARKET_KIND_REGISTRY.find((candidate) => candidate.kind === entry.kind);
    const lines = row.pool.map((variant) => (typeof variant === 'function'
      ? variant({ settlement: 'Iron Vale', counterpart: 'Brook End', good: 'iron', house: 'House Rowan', band: 'surplus' })
      : variant));
    expect(lines).toContain(entry.summary);
    // THE ADDRESS CHAIN: both towns by id and by name, the typed action, the audience, the desk.
    expect(entry.settlementIds).toEqual(['iron_vale', 'brook_end']);
    expect(entry.settlementNames).toEqual(['Iron Vale', 'Brook End']);
    expect(entry).toMatchObject({ audience: 'public', section: 'trade', significance: 'notable', tick: 5 });
    // THE RECORDED REASON names both bands, one each, and no number reaches the reader.
    expect(entry.reasons).toHaveLength(1);
    expect(entry.reasons[0]).toContain(DEAR);
    expect(entry.reasons[0]).toContain(COMMODITY_BANDS.SURPLUS);
    // anchored: the reason and the headline were asserted present and populated just above, so a digit-free match is a fact about real prose.
    expect(`${entry.headline} ${entry.summary} ${entry.reasons[0]}`).not.toMatch(/\d/);
    // Missing identity is silence, never a slug.
    // anchored: the same arrival with both names supplied projected a full entry at the top of this test, so null here is the missing name.
    expect(wrongMarketArrivalNewsEntry({ arrival, originName: '', destinationName: 'Brook End' })).toBeNull();
    expect(wrongMarketArrivalNewsEntry({ arrival: { ...arrival, believedBand: '' }, originName: 'Iron Vale', destinationName: 'Brook End' })).toBeNull();
    expect(wrongMarketArrival({ originId: 'iron_vale', destinationId: 'iron_vale', good: IRON, foundBand: COMMODITY_BANDS.SURPLUS, worldState: believingWorld(LIT) })).toBeNull();
  });

  test('a DM stock edit never writes a belief: the market glutted by hand leaves every court\'s picture exactly where it was', () => {
    const worldState = believingWorld(LIT);
    // The DM's hand on the TRUTH: brook_end's iron set to a glut, straight on the stock ledger.
    worldState.spatialLedgers.commodityStocks.brook_end.iron = 30;
    const pictures = clone(worldState.spatialLedgers.beliefMaps);
    const frozen = JSON.stringify(worldState);
    advanceCommodityFlow({
      producers: [{ settlementId: 'iron_vale', good: IRON, rate: 3, cap: 18 }],
      links: [link('amber_ford'), link('brook_end')], worldState, digest: starDigest(), tick: 5,
    });
    expect(JSON.stringify(worldState)).toBe(frozen);
    expect(worldState.spatialLedgers.beliefMaps).toEqual(pictures);
    expect(believedScarcityOf('iron_vale', 'brook_end', 'raw_material', worldState)).toEqual({ known: true, band: DEAR });
    // THE FOLD NEVER READS THE STOCK LEDGER: the belief machinery folded over the same courts at the
    // same tick, once beside the DM's glut and once beside the stock the market really held, keeps
    // the same pictures, so the hand on the truth reaches no court until a caravan or a rumour does.
    const foldBeside = (commodityStocks) => advanceBeliefMaps({
      snapshot: snapshot(BEFORE), pressureIdx: null, tick: 7,
      worldState: { ...worldState, spatialLedgers: { beliefMaps: clone(pictures), commodityStocks } },
    }).next;
    const beside = foldBeside(clone(worldState.spatialLedgers.commodityStocks));
    expect(beside.iron_vale.seat.brook_end.scarcityBands).toEqual({ raw_material: DEAR });
    expect(foldBeside(believingWorld(LIT).spatialLedgers.commodityStocks)).toEqual(beside);
    // …and the hand on the OTHER truth, the town's own economy (what a set-field edit writes and what
    // SP-B's ground truth reads), moves no picture on a silent tick either: brook_end mines its own
    // iron now, and the court still holds it dear until word arrives.
    const edited = advanceBeliefMaps({
      snapshot: snapshot(AFTER), pressureIdx: null, tick: 7,
      worldState: { ...worldState, spatialLedgers: { beliefMaps: clone(pictures) } },
    }).next;
    expect(scarcityGroundTruth(settle(AFTER)).raw_material).toBe(SCARCITY_BANDS[3]);
    expect(edited.iron_vale.seat.brook_end.scarcityBands).toEqual({ raw_material: DEAR });
    // And no TR-3 module holds a belief writer at all, the two hosts it edits included: the only
    // road from truth to belief stays arrivals, rumour and plants.
    for (const rel of [
      'src/domain/spatial/commodityFlow.js', 'src/domain/spatial/dispatchDestination.js', 'src/domain/spatial/dispatchEV.js',
      'src/domain/worldPulse/beliefScarcity.js', 'src/domain/worldPulse/marketNews.js',
    ]) {
      // anchored: the belief leaf is proven to READ the belief map in the staleness test above, so a write-free source is a fact about a live reader.
      expect(codeOnly(readFileSync(join(ROOT, rel), 'utf8')), rel).not.toMatch(/\b(?:setSpatialLedger|reconcileBelief|advanceBeliefMaps|mutateBelief)\b/);
    }
  });
});

describe('TR-3 — the editor line (R-33, R-5): the direct-trade row, the option reader, the phantom', () => {
  const campaign = {
    worldState: {},
    regionalGraph: {
      channels: [
        { id: 'ch.i.b', type: 'trade_route', from: 'iron_vale', to: 'brook_end', status: 'confirmed' },
        { id: 'ch.i.a', type: 'trade_route', from: 'iron_vale', to: 'amber_ford', status: 'suggested' },
        { id: 'ch.i.c', type: 'export_market', from: 'iron_vale', to: 'cold_rill', status: 'confirmed' },
      ],
    },
  };
  const phantom = { id: 'phantom.saltmarsh', kind: PHANTOM_KIND, name: 'Saltmarsh', seed: 'saltmarsh', traits: {} };

  test('direct-trade resolves through resolveDecree for every good class and refuses a class outside the catalog', () => {
    const catalogues = { opTypes: TRADE_DIRECTION_OP_TYPES, pools: {} };
    const op = (goodClass, destination = 'brook_end') => ({
      type: TRADE_DIRECTION_TYPE, target: { kind: 'settlement', id: 'iron_vale' }, payload: { destination, goodClass },
    });
    let registry = [];
    REGIONAL_GOOD_CATEGORIES.forEach((goodClass, index) => {
      registry = stage(registry, op(goodClass), { id: `t${index}`, orderedAt: 't0' });
    });
    expect(registry).toHaveLength(REGIONAL_GOOD_CATEGORIES.length);
    for (const entry of registry) expect(resolveDecree(entry, catalogues)).toEqual({ ok: true });
    const outside = stage([], op('spices'), { id: 'x', orderedAt: 't0' })[0];
    expect(resolveDecree(outside, catalogues)).toEqual({ ok: false, missing: 'pool-value', was: 'spices' });
    const row = TRADE_DIRECTION_OP_TYPES[TRADE_DIRECTION_TYPE];
    expect(Object.keys(row).sort()).toEqual(Object.keys(OP_TYPES['add-faction']).sort());
    expect(TRADE_DIRECTION_TYPE).toBe('direct-trade');
    expect(row.target).toBe('settlement');
    expect(row.payload.goodClass.values).toBe(REGIONAL_GOOD_CATEGORIES);
    expect(row.payload.destination).toEqual({ kind: 'ref', required: true });
    // The world half of `requires` is the EXISTING live predicate, and no new condition row is minted.
    expect(row.requires).toEqual({ world: ['openRoute'], registry: [] });
    expect(WORLD_CONDITIONS.openRoute.source).toBe('live');
  });

  test('the option reader offers only the real markets an open trade road reaches, and a phantom destination is refused toward open-trade', () => {
    const card = { id: 'iron_vale' };
    expect(directTradeDestinations(card, campaign)).toEqual(['brook_end']);
    expect(directTradeRefusal('brook_end', card, campaign)).toBeNull();
    // A suggested road, another channel type and an unrouted id are not markets this act can name.
    expect(directTradeRefusal('amber_ford', card, campaign)).toBe(DIRECT_TRADE_REFUSAL);
    expect(directTradeRefusal('cold_rill', card, campaign)).toBe(DIRECT_TRADE_REFUSAL);
    // THE PHANTOM (L10 (c): real-only), by its id and by its minimal record, refused without a throw.
    expect(isPhantomRecord(phantom)).toBe(true);
    expect(directTradeRefusal(phantom.id, card, campaign)).toBe(DIRECT_TRADE_REFUSAL);
    expect(directTradeRefusal(phantom, card, campaign)).toBe(DIRECT_TRADE_REFUSAL);
    // …and the reason names the off-stage act, which really is the one an off-map partner takes.
    expect(DIRECT_TRADE_REFUSAL).toContain('open-trade');
    expect(OFF_STAGE_OP_TYPES['open-trade'].target).toBe('phantom');
    // A phantom CARD, a missing graph and garbage all answer no market, and none of them throws.
    // anchored: the real card over the same campaign answered brook_end at the top of this test, so these empties are the phantom, the missing graph and the garbage.
    expect(directTradeDestinations(phantom, campaign)).toEqual([]);
    expect(directTradeDestinations(card, null)).toEqual([]);
    expect(directTradeDestinations(null, campaign)).toEqual([]);
    expect(directTradeRefusal(undefined, null, null)).toBe(DIRECT_TRADE_REFUSAL);
  });
});
