/**
 * Join harness — the conflicts address seam (Wave 6 #1).
 *
 * generatePopulation provides `conflicts`, and assembleSettlement wrote them
 * ONLY top-level — but four readers expect powerStructure.conflicts (aiLayer,
 * dailyLifeLogic, and the generate-narrative edge function the owner deploys
 * separately). Every prompt was conflict-blind.
 *
 * The repair is two-sided: assembleSettlement dual-writes conflicts onto
 * powerStructure, AND the in-repo readers prefer the top-level write (so
 * pre-fix saves ground correctly too). This harness pins both sides against
 * a real pipeline run.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { extractFullContext } from '../../src/generators/aiLayer.js';
import { extractSettlementContext } from '../../src/components/new/dailyLifeLogic.js';
import { generateConflicts } from '../../src/generators/powerGenerator.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';

const gen = (config, seed) =>
  generateSettlementPipeline(config, null, { seed, customContent: {} });

const BASE_CFG = {
  settType: 'town',
  culture: 'germanic',
  tradeRouteAccess: 'road',
  monsterThreat: 'frontier',
};

// Scan a fixed seed list for a settlement whose roster actually surfaced
// conflicts — otherwise "dual-written" would be indistinguishable from
// "both empty". Deterministic: fixed list, first hit wins.
const findConflictFixture = () => {
  for (const seed of ['conflicts-1', 'conflicts-2', 'conflicts-3', 'conflicts-4', 'conflicts-5']) {
    const s = gen(BASE_CFG, seed);
    if ((s.conflicts || []).length > 0) return s;
  }
  return null;
};

describe('join: conflicts live at BOTH addresses after assembly', () => {
  test('powerStructure.conflicts mirrors the top-level write', () => {
    const s = findConflictFixture();
    expect(s, 'no settlement with conflicts found in seed list').toBeTruthy();
    expect(Array.isArray(s.powerStructure?.conflicts)).toBe(true);
    expect(s.powerStructure.conflicts).toEqual(s.conflicts);
  });

  test('a conflict-free settlement still carries the (empty) dual-write', () => {
    const s = gen(BASE_CFG, 'conflicts-1');
    expect(Array.isArray(s.powerStructure?.conflicts)).toBe(true);
  });
});

describe('behavior: the prompt extractors actually see the conflicts', () => {
  test('aiLayer and dailyLifeLogic ground the same non-empty conflict list', () => {
    const s = findConflictFixture();
    expect(s).toBeTruthy();

    // The REAL conflict shape is { parties, issue, stakes, desc, … } —
    // mapping only description/type was a second layer of the same blindness.
    const expected = s.conflicts
      .slice(0, 3)
      .map(c => c.desc || c.description || c.issue || c.type)
      .filter(Boolean);
    expect(expected.length).toBeGreaterThan(0);

    expect(extractFullContext(s).conflicts).toEqual(expected);
    expect(extractSettlementContext(s).conflicts).toEqual(expected);
  });

  test('legacy saves (top-level only, no dual-write) still ground', () => {
    const s = findConflictFixture();
    expect(s).toBeTruthy();
    // Strip the dual-write to simulate a pre-fix save.
    const { conflicts: _dropped, ...psWithout } = s.powerStructure;
    const legacy = { ...s, powerStructure: psWithout };
    expect(extractFullContext(legacy).conflicts.length).toBeGreaterThan(0);
  });
});

/**
 * GS-2 ONE FACTION SET (chair ruling on G-SEAMS S2, ODQ §934.101). The power factions are the
 * factions: `factions[]` groups the roster by each NPC's POWER affiliation and mints no second
 * name, and a conflict is two POWER factions grounded in a rival or enemy tie that crosses them.
 * A town with no such tie has no conflict row.
 */
const GS2_SEEDS = ['gs2-a', 'gs2-b', 'gs2-c', 'gs2-d', 'gs2-e', 'gs2-f'];
const GS2_CFGS = [
  { settType: 'city', culture: 'germanic', tradeRouteAccess: 'road', monsterThreat: 'frontier' },
  BASE_CFG,
];

describe('GS-2: one faction set, the power factions', () => {
  test('every factions[] name and every conflict party is a power-faction name', () => {
    let conflicts = 0;
    const strays = [];
    for (const cfg of GS2_CFGS) for (const seed of GS2_SEEDS) {
      const s = gen(cfg, seed);
      const power = new Set((s.powerStructure?.factions || []).map((f) => f.faction));
      for (const f of s.factions || []) if (!power.has(f.name)) strays.push(`${seed} group ${f.name}`);
      for (const c of s.conflicts || []) {
        conflicts += 1;
        for (const p of c.parties || []) if (!power.has(p)) strays.push(`${seed} party ${p}`);
      }
    }
    expect(conflicts, 'the sweep surfaced no conflict at all').toBeGreaterThan(0);
    expect(strays).toEqual([]);
  });

  test('factions[] groups the roster by each NPC\'s own power affiliation', () => {
    // Collected, not asserted inline (seedLoopTotality, cure lane T13): every seed runs and
    // the two rosters carry the true count.
    const misfiled = [];
    const miscounted = [];
    for (const seed of GS2_SEEDS) {
      const s = gen(GS2_CFGS[0], seed);
      for (const f of s.factions || []) {
        for (const m of f.members || []) if (m.factionAffiliation !== f.name) misfiled.push(`${seed} ${m.name}`);
      }
      const grouped = (s.factions || []).reduce((n, f) => n + (f.members || []).length, 0);
      const affiliated = (s.npcs || []).filter((n) => n.factionAffiliation).length;
      if (grouped !== affiliated) miscounted.push(`${seed}: ${grouped} grouped vs ${affiliated} affiliated`);
    }
    expect(misfiled).toEqual([]);
    expect(miscounted, 'every affiliated NPC sits in exactly one group').toEqual([]);
  });

  test('each conflict is grounded in a rival or enemy tie that crosses its two power factions', () => {
    let seen = 0;
    const ungrounded = [];
    for (const seed of GS2_SEEDS) {
      const s = gen(GS2_CFGS[0], seed);
      const home = new Map((s.npcs || []).map((n) => [n.id, n.factionAffiliation]));
      for (const c of s.conflicts || []) {
        seen += 1;
        const [a, b] = c.parties;
        const tie = (s.relationships || []).some((r) => ['rival', 'enemy'].includes(r.type)
          && ((home.get(r.npc1Id) === a && home.get(r.npc2Id) === b)
            || (home.get(r.npc1Id) === b && home.get(r.npc2Id) === a)));
        if (a === b || !tie) ungrounded.push(`${seed} ${a} / ${b}`);
      }
    }
    expect(seen).toBeGreaterThan(0);
    expect(ungrounded).toEqual([]);
  });
});

describe('GS-2: generateConflicts pairs power factions across a rival or enemy tie', () => {
  // Three power-faction groups, as factionGrouping projects them. Ida and Jon share a faction.
  const groups = () => [
    { name: 'Town Council', dominantCategory: 'government', members: [{ id: 'a', name: 'Ada' }] },
    { name: 'Merchant Guilds', dominantCategory: 'economy', members: [{ id: 'i', name: 'Ida' }, { id: 'j', name: 'Jon' }] },
    { name: 'Military/Guard', dominantCategory: 'military', members: [{ id: 'm', name: 'Mara' }] },
  ];
  const seeded = (seed, body) => {
    const previous = setActiveRng(createPRNG(seed));
    try { return body(); } finally { clearActiveRng(previous); }
  };

  test('a town whose rivalries never cross two factions has no conflict row', () => {
    const rels = [
      { npc1Id: 'i', npc2Id: 'j', type: 'rival' },
      { npc1Id: 'a', npc2Id: 'm', type: 'ally' },
    ];
    expect(seeded('gs2-none', () => generateConflicts(groups(), rels, {}, []))).toEqual([]);
  });

  test('the crossing pairs become the conflicts, strongest first, intensity from the tie count', () => {
    const rels = [
      { npc1Id: 'i', npc2Id: 'm', type: 'rival' },
      { npc1Id: 'j', npc2Id: 'm', type: 'enemy' },
      { npc1Id: 'a', npc2Id: 'i', type: 'rival' },
    ];
    const conflicts = seeded('gs2-pairs', () => generateConflicts(groups(), rels, {}, []));
    expect(conflicts.length).toBeGreaterThan(0);
    expect(conflicts[0].parties).toEqual(['Merchant Guilds', 'Military/Guard']);
    expect(conflicts[0].intensity).toBe('high');
    const seen = conflicts.map((c) => c.parties.join(' / '));
    expect(seen.every((p) => ['Merchant Guilds / Military/Guard', 'Town Council / Merchant Guilds'].includes(p))).toBe(true);
    expect(conflicts.find((c) => c.parties[0] === 'Town Council')?.intensity ?? 'moderate').toBe('moderate');
  });
});
