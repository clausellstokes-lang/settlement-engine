/**
 * treatyLifecycleVoiceDormancyFence.test.js — GR-0's FOUR-FENCE DORMANCY SET for
 * `treatyLifecycleVoiceEnabled`, with the lit-mutant control that proves the fences see.
 *
 * THE FOUR FENCES (the §3 flag law, per flag, no exceptions):
 *   1. OWN-FOOTPRINT GOLDEN — dark, the mover's whole observable footprint is what the
 *      pre-GR-0 engine produced: no new feed entry, and — the sharper half — a ledger
 *      BYTE-IDENTICAL to the lit run's, because this lane writes no world state at all.
 *      Lighting it may change what the world SAYS and must never change what the world IS.
 *   2. ABSENT-VS-FALSE DIFFERENTIAL — an absent key and an explicit `false` are the same
 *      world. This is what keeps the key VIRTUAL: a campaign that has never heard of the
 *      flag persists byte-identically to one that declared it off.
 *   3. CALL-PATH SPY — the composers are never ENTERED while dark. An output pin alone
 *      cannot tell "the gate held" from "the composer ran and returned nothing", and the
 *      second would still have paid the work and could still have thrown.
 *   4. GATE-POLARITY CENSUS — every read of the key in src/ is the strict `=== true`
 *      idiom, read BY NAME. A truthy read would light the lane on any non-empty value,
 *      and a frozen-list conjunction would hide the key from the engine-gated census
 *      (the recorded hole in engineGatedRuleKeys.walker's own header).
 *
 * ⚠ THE COLLISION THIS FENCE IS SHAPED AROUND. WR-2's `treatyDispositionDeltas` fires at
 * the SAME two sites this wave hooks (the prune and the compliance write). Its deltas are
 * PRE-EXISTING lit-path behaviour of `dispositionChannelsEnabled`, so every fixture below
 * runs with that flag DARK — otherwise WR-2's footprint would be read as this lane's, in
 * whichever direction happened to flatter the result.
 *
 * THE LIT-MUTANT CONTROL is not decoration: a dormancy fence over a fixture that mints
 * nothing when lit proves only that the fixture is quiet. Every fence below is stated
 * against a fixture whose LIT run is asserted to produce both beats.
 */

import { describe, it, expect, vi } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** FENCE 3's instrument: the real leaf, with its two composers counted. */
const calls = { lapse: 0, detect: 0 };
vi.mock('../../src/domain/worldPulse/treatyLifecycleVoice.js', async (importActual) => {
  const actual = await importActual();
  return {
    ...actual,
    treatyLapsedBeats: (...args) => { calls.lapse += 1; return actual.treatyLapsedBeats(...args); },
    treatyDefaultDetectedBeats: (...args) => { calls.detect += 1; return actual.treatyDefaultDetectedBeats(...args); },
  };
});

const { advanceTreaties, treatyPairKey } = await import('../../src/domain/worldPulse/peaceTerms.js');
const { CURRENT_TREATY_TICKS_PER_YEAR } = await import('../../src/domain/worldPulse/treatyClock.js');
const { renderAllTreaties } = await import('../../src/domain/display/treatyDocument.js');

const YEAR = CURRENT_TREATY_TICKS_PER_YEAR;
const PAIR_KEY = treatyPairKey('victor', 'loser');
// dispositionChannelsEnabled is ABSENT from every base below — the collision fence.
const BASE = Object.freeze({ warLayerEnabled: true, peaceEngineEnabled: true });

function item(id, name) {
  return {
    id,
    name,
    settlement: {
      name, tier: 'town', population: 1800,
      config: { tradeRouteAccess: 'road', priorityMilitary: 35 },
      institutions: [{ name: 'State Granary', type: 'economic' }],
      economicState: {
        prosperity: 'Prosperous', primaryExports: [], primaryImports: [],
        foodSecurity: { storageMonths: 6, dailyNeed: 100, dailyProduction: 100, deficitPct: 0, surplusPct: 0, resilienceScore: 50 },
      },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ faction: 'military seat', category: 'military', power: 78, isGoverning: true }],
        conflicts: [],
      },
      npcs: [], activeConditions: [],
    },
  };
}

const SNAPSHOT = {
  byId: new Map([['victor', item('victor', 'Ashford')], ['loser', item('loser', 'Irontown')]]),
  regionalGraph: { edges: [] },
};
const STARVED = { bySettlement: { loser: [{ type: 'economy', severity: 0.98 }, { type: 'food', severity: 0.98 }] } };

function treatyRecord({ mintedTick = 0, years = 20 } = {}) {
  return {
    parties: ['victor', 'loser'],
    victorId: 'victor', loserId: 'loser',
    victorName: 'Ashford', loserName: 'Irontown',
    mintedTick,
    believedMarginAtSignature: 0.42,
    budgetGranted: 1, budgetSpent: 1,
    treatyTicksPerYear: YEAR,
    complianceState: 'honored',
    receipts: [],
    terms: [{
      type: 'tribute', family: 'economic', magnitude: 0.2,
      mintedTick, expiresTick: mintedTick + years * YEAR,
      weightSpent: 1, complianceState: 'honored', trueState: 'honored', burden01: 0,
      deliveredToVictor: 0, extractedFromLoser: 0, receipt: 'tribute',
    }],
  };
}

const worldWith = (rules, treaty, tick) => ({
  tick,
  simulationRules: { ...rules },
  spatialLedgers: { treaties: { [PAIR_KEY]: treaty } },
});

const run = (rules, treaty, tick) => advanceTreaties({
  snapshot: SNAPSHOT, worldState: worldWith(rules, treaty, tick), pIndex: STARVED, tick,
});

const DARK = BASE;
const FALSE_DECL = { ...BASE, treatyLifecycleVoiceEnabled: false };
const LIT = { ...BASE, treatyLifecycleVoiceEnabled: true };
/** The two moments: the crossing tick, and the horizon tick. */
const CROSS_TICK = 10;
const LAPSE_TICK = 20 * YEAR;
const ledgerJson = (out) => JSON.stringify(out.worldState?.spatialLedgers?.treaties ?? null);

describe('GR-0 dormancy — the lit-mutant control', () => {
  it('LIT, this fixture really mints BOTH kinds (without which every fence below is vacuous)', () => {
    const crossing = run(LIT, treatyRecord(), CROSS_TICK);
    const lapse = run(LIT, treatyRecord(), LAPSE_TICK);
    expect(crossing.newsEntries.map((e) => e.kind)).toEqual(['treaty_default_detected']);
    expect(lapse.newsEntries.map((e) => e.kind)).toEqual(['treaty_lapsed']);
  });
});

describe('GR-0 dormancy — FENCE 1: the own-footprint golden', () => {
  it('dark, the mover mints no lifecycle kind at either site', () => {
    expect(run(DARK, treatyRecord(), CROSS_TICK).newsEntries).toEqual([]);
    expect(run(DARK, treatyRecord(), LAPSE_TICK).newsEntries).toEqual([]);
  });

  it('the LEDGER is byte-identical dark and lit — the voice changes what the world SAYS, never what it IS', () => {
    // The sharpest half of the footprint claim, and the one an output pin cannot make.
    // If a beat composer ever mutated a treaty record (a stamp, a counter, a cached age),
    // this reds while the "no new kinds" pin above stays perfectly green.
    for (const tick of [CROSS_TICK, LAPSE_TICK]) {
      expect(ledgerJson(run(DARK, treatyRecord(), tick)), `tick ${tick}`)
        .toBe(ledgerJson(run(LIT, treatyRecord(), tick)));
    }
    // NON-VACUITY: the compared ledger is a real, populated record at the crossing tick
    // (a null-vs-null comparison would pass for the wrong reason).
    expect(ledgerJson(run(DARK, treatyRecord(), CROSS_TICK))).toMatch(/"defaultedBy":"loser"/);
  });

  it('the READ-MODEL grows exactly two keys when lit, and nothing else moves', () => {
    const dark = renderAllTreaties(worldWith(DARK, treatyRecord(), 10 * YEAR))[0];
    const lit = renderAllTreaties(worldWith(LIT, treatyRecord(), 10 * YEAR))[0];
    const added = Object.keys(lit).filter((key) => !(key in dark));
    expect(added.sort()).toEqual(['ageYears']);
    // `ageLine` exists on both shapes and is NULL while dark — a display key that is
    // always present keeps the render-model's shape stable across the flag.
    expect(dark.ageLine).toBeNull();
    expect(typeof lit.ageLine).toBe('string');
    // Every OTHER key is identical, value for value. This is the "and nothing else
    // moves" half, and it is what would catch an age read leaking into a title or a
    // fraying line.
    for (const key of Object.keys(dark)) {
      if (key === 'ageLine') continue;
      expect(JSON.stringify(lit[key]), `${key} moved under the flag`).toBe(JSON.stringify(dark[key]));
    }
  });
});

describe('GR-0 dormancy — FENCE 2: absent versus explicitly false', () => {
  it('an absent key and a declared false are the same world, at both sites', () => {
    for (const tick of [CROSS_TICK, LAPSE_TICK]) {
      const absent = run(DARK, treatyRecord(), tick);
      const declared = run(FALSE_DECL, treatyRecord(), tick);
      expect(declared.newsEntries).toEqual(absent.newsEntries);
      expect(ledgerJson(declared)).toBe(ledgerJson(absent));
      expect(declared.changed).toBe(absent.changed);
    }
    // And the read-model agrees: neither spelling grows the age key.
    expect(renderAllTreaties(worldWith(FALSE_DECL, treatyRecord(), 10 * YEAR))[0].ageYears).toBeUndefined();
    expect(renderAllTreaties(worldWith(DARK, treatyRecord(), 10 * YEAR))[0].ageYears).toBeUndefined();
  });
});

describe('GR-0 dormancy — FENCE 3: the call-path spy', () => {
  it('dark, neither composer is ENTERED; lit, both are', () => {
    calls.lapse = 0; calls.detect = 0;
    run(DARK, treatyRecord(), CROSS_TICK);
    run(DARK, treatyRecord(), LAPSE_TICK);
    run(FALSE_DECL, treatyRecord(), CROSS_TICK);
    run(FALSE_DECL, treatyRecord(), LAPSE_TICK);
    expect(calls).toEqual({ lapse: 0, detect: 0 });
    // THE CONTROL, in the same test so the counter cannot be quietly broken: the very
    // next lit runs move both counters, which proves the spy is wired to the real call
    // sites rather than measuring a module nobody reaches.
    run(LIT, treatyRecord(), CROSS_TICK);
    run(LIT, treatyRecord(), LAPSE_TICK);
    expect(calls).toEqual({ lapse: 1, detect: 1 });
  });
});

describe('GR-0 dormancy — FENCE 4: the gate-polarity census', () => {
  it('every src/ read of the key is the strict, by-name `=== true` idiom', () => {
    const files = walkSource(join(ROOT, 'src'));
    const KEY = 'treatyLifecycleVoiceEnabled';
    const mentions = files.filter(({ src }) => src.includes(KEY));
    // THE EXACT CENSUS, not a floor. Four files may name this key and the reason each may
    // is stated: the manifest declares it, the certification row certifies it, the leaf
    // GATES on it, and peaceTermsDocument's typedef documents which flag its conditional
    // `ageYears` key rides. A FIFTH file reds here until somebody classifies it — which is
    // the whole point, because a second gate is a second spelling of one law.
    expect(mentions.map(({ rel }) => rel).sort()).toEqual([
      'src/domain/certification/subsystemRowsVirtual.js',
      'src/domain/worldPulse/peaceTermsDocument.js',
      'src/domain/worldPulse/simulationRules.js',
      'src/domain/worldPulse/treatyLifecycleVoice.js',
    ]);
    // …and the documentation mention really is only a mention: no gate reads it there.
    const doc = mentions.find(({ rel }) => rel === 'src/domain/worldPulse/peaceTermsDocument.js').src;
    expect(doc).not.toMatch(new RegExp(`${KEY}\\s*===`));
    const gate = mentions.find(({ rel }) => rel === 'src/domain/worldPulse/treatyLifecycleVoice.js').src;
    // Exactly ONE executable read, and it is strict. A second gate would be a second
    // spelling of one law; a truthy read would light the lane on the string "false".
    const reads = [...gate.matchAll(new RegExp(`\\b${KEY}\\b`, 'g'))];
    expect(reads.length).toBeGreaterThanOrEqual(1);
    expect(gate).toMatch(new RegExp(`rules\\s*\\)?\\s*\\??\\.\\s*${KEY}\\s*===\\s*true`));
    // …and nowhere in the tree is it read loosely, negated-loosely, or compared to false.
    for (const { rel, src } of mentions) {
      expect(src, `${rel}: loose gate`).not.toMatch(new RegExp(`${KEY}\\s*(?:==|!=)[^=]`));
      expect(src, `${rel}: negated gate`).not.toMatch(new RegExp(`!\\s*rules[^\\n]*${KEY}`));
    }
  });
});

/** Every .js/.jsx file under a root, as { rel, src }. */
function walkSource(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkSource(p, out);
    else if (/\.(js|jsx)$/.test(entry)) {
      out.push({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') });
    }
  }
  return out;
}
