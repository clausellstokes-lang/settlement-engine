/**
 * semanticFixtures.test.js — Wave D, Track I: the simulation eval-fixture corpus.
 *
 * For each canonical scenario a DM would recognise, we pin a (config, seed) pair
 * that RELIABLY produces it, then assert the SEMANTICS — not exact values, but
 * the qualitative invariants and the cross-surface COHERENCE that make the
 * generation trustworthy at the table:
 *
 *   "the same fact appears in economy AND stress AND hooks AND the causal
 *    substrate — the pieces explain each other."
 *
 * These catch the failure mode the golden-master hashes miss: a generation that
 * stays byte-valid while quietly lying to the DM (a famine with a food surplus,
 * a corrupt town with no criminal faction, a blockaded port with open trade).
 *
 * Seeds are PINNED constants. The emergent scenarios (famine rolled, corruption
 * spawned) were found by a one-off programmatic seed search over `fixture-*-${i}`
 * and then frozen here so the fixture is deterministic forever — a changed
 * constant would move a specific settlement, never a probability. Where a seed is
 * arbitrary (the scenario is config-forced and robust to any seed) that is noted.
 *
 * All assertions bind to REAL fields verified against the live pipeline output
 * (economicState.foodSecurity, economicState.safetyProfile, activeConditions,
 * defenseProfile, powerStructure.factions, npc.corruptTies, simulationTrace).
 */

import { describe, test, expect, beforeAll } from 'vitest';
import {
  gen,
  stressEntries,
  stressTypes,
  prosperityRank,
  factionsOf,
  hasFactionCategory,
  factionCategoryRank,
  institutionNames,
  conditionArchetypes,
  hasReceipt,
  npcRoles,
} from './simHelpers.js';

// ─────────────────────────────────────────────────────────────────────────────
// 1. FAMINE VILLAGE — isolated village, famine EMERGENTLY rolled (not forced).
//    Found by searching isolated low-economy villages for a seed the sim decides
//    to starve on its own. That is the stronger test: it proves the sim
//    coherently propagates a famine it chose itself.
// ─────────────────────────────────────────────────────────────────────────────
describe('FAMINE VILLAGE (isolated, famine emergently rolled)', () => {
  const CONFIG = { settType: 'village', terrainOverride: 'plains', tradeRouteAccess: 'isolated', priorityEconomy: 20, magicExists: true };
  const SEED = 'fixture-famine-11'; // pinned: emergent famine (searched over fixture-famine-${i})
  let s;
  beforeAll(() => { s = gen(CONFIG, SEED); });

  test('famine stress entry is present', () => {
    expect(stressTypes(s)).toContain('famine');
  });

  test('famine is promoted into an active condition (the causal substrate)', () => {
    expect(conditionArchetypes(s)).toContain('famine');
  });

  test('COHERENCE: food balance is genuinely negative (economy agrees with the label)', () => {
    const food = s.economicState?.foodSecurity;
    expect(food?.hasFamine).toBe(true);
    expect(food?.isDeficit).toBe(true);
    // A real deficit: production below need. foodRatio < 1 and a positive deficit%.
    expect(food?.foodRatio).toBeLessThan(1);
    expect(food?.deficitPct).toBeGreaterThan(0);
  });

  test('COHERENCE: prosperity is capped to the crisis floor (≤ Poor)', () => {
    const label = s.economicState?.prosperity;
    expect(prosperityRank(label)).toBeLessThanOrEqual(prosperityRank('Poor'));
    // and the food model records WHY it capped — a receipt, not a silent clamp.
    expect(s.economicState?.foodSecurity?.prosperityMod?.reason || '').toMatch(/famine/i);
  });

  test('COHERENCE: the Active Crisis surfaces the famine with a DM-facing hook', () => {
    const famineEntry = stressEntries(s).find((e) => e.type === 'famine');
    expect(famineEntry).toBeTruthy();
    expect(famineEntry.label).toMatch(/famine/i);
    expect(typeof famineEntry.crisisHook).toBe('string');
    expect(famineEntry.crisisHook.length).toBeGreaterThan(20); // a usable hook, not a stub
  });

  test('RECEIPT: a trace names famine as the cause', () => {
    expect(hasReceipt(s, /stressor\.famine/i)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. CORRUPT TRADE TOWN — trade crossroads, high criminal priority; corruption
//    SPAWNS at generation (probabilistic, gated on a criminal institution).
//    Seed searched over fixture-corrupt-${i} and pinned.
// ─────────────────────────────────────────────────────────────────────────────
describe('CORRUPT TRADE TOWN (trade route + corruption)', () => {
  const CONFIG = { settType: 'town', tradeRouteAccess: 'crossroads', terrainOverride: 'plains', priorityCriminal: 90, priorityMilitary: 20, magicExists: true };
  const SEED = 'fixture-corrupt-0'; // pinned: ≥1 corrupt NPC + criminal faction (searched)
  let s;
  beforeAll(() => { s = gen(CONFIG, SEED); });

  test('at least one NPC is flagged corrupt', () => {
    const corrupt = (s.npcs || []).filter((n) => n.corrupt === true);
    expect(corrupt.length).toBeGreaterThanOrEqual(1);
  });

  test('RECEIPT: corrupt NPCs name the mechanism (criminal institution + thieves-guild tie)', () => {
    const corrupt = (s.npcs || []).filter((n) => n.corrupt === true);
    for (const n of corrupt) {
      expect(typeof n.corruptionVector).toBe('string');
      expect(n.corruptTies).toBeTruthy();
      expect(typeof n.corruptTies.criminalInstitution).toBe('string');
      expect(typeof n.corruptTies.thievesGuild).toBe('string');
    }
  });

  test('COHERENCE: the economy shows the capture (shadow economy / black-market signal)', () => {
    const sp = s.economicState?.safetyProfile;
    expect(sp).toBeTruthy();
    // A measurable shadow economy AND named criminal institutions on the table.
    expect(sp.blackMarketCapture).toBeGreaterThan(0);
    expect((sp.criminalInstitutions || []).length).toBeGreaterThanOrEqual(1);
    expect((sp.crimeTypes || []).length).toBeGreaterThanOrEqual(1);
  });

  test('COHERENCE: the power structure reflects it (a criminal faction holds power)', () => {
    expect(hasFactionCategory(s, 'criminal')).toBe(true);
    const crimFaction = factionsOf(s).find((f) => f.category === 'criminal');
    expect(crimFaction.power).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAGICAL METROPOLIS — metropolis, high magic priority. Config-forced (any
//    seed reproduces the identity); seed is arbitrary but pinned.
// ─────────────────────────────────────────────────────────────────────────────
describe('MAGICAL METROPOLIS (metropolis, high magic)', () => {
  const CONFIG = { settType: 'metropolis', priorityMagic: 95, priorityEconomy: 70, magicExists: true, terrainOverride: 'plains', tradeRouteAccess: 'crossroads' };
  const SEED = 'fixture-magic-metropolis'; // config-forced; seed arbitrary
  let s;
  beforeAll(() => { s = gen(CONFIG, SEED); });

  const MAGIC_INST = /wizard|mage|arcane|magic|enchant|alchem|conjur|academy|scroll|scrying/i;
  const ARCANE_ROLE = /archmage|wizard|witch|mage|enchant|arcan|sorcer|magus|conjur|warlock|diviner|alchemist/i;

  test('magic institutions are present', () => {
    const magicInst = institutionNames(s).filter((n) => MAGIC_INST.test(n));
    expect(magicInst.length).toBeGreaterThanOrEqual(1);
  });

  test('magic-dependent services are on offer', () => {
    const magicServices = s.availableServices?.magic || [];
    expect(magicServices.length).toBeGreaterThanOrEqual(1);
  });

  test('COHERENCE: magic is load-bearing in defense (arcane traditions + high magical score)', () => {
    const dp = s.defenseProfile;
    expect(dp?.traditions?.hasArcane).toBe(true);
    // magic carries real defensive weight, not a token bar
    expect(dp?.scores?.magical).toBeGreaterThan(50);
  });

  test('COHERENCE: magic is load-bearing in the economy (food supplemented by magic)', () => {
    // magicSupplement is the % of food the magical channel contributes — a real
    // economic magic-dependency signal on a high-magic settlement.
    expect(s.economicState?.foodSecurity?.magicSupplement).toBeGreaterThan(0);
  });

  test('COHERENCE: an arcane faction holds top-tier power', () => {
    expect(hasFactionCategory(s, 'magic')).toBe(true);
    const rank = factionCategoryRank(s, 'magic');
    expect(rank).toBeGreaterThanOrEqual(0);
    expect(rank).toBeLessThanOrEqual(1); // arcane faction is #1 or #2
  });

  test('arcane NPCs staff the settlement', () => {
    const arcane = npcRoles(s).filter((r) => ARCANE_ROLE.test(r));
    expect(arcane.length).toBeGreaterThanOrEqual(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. RAIDED HAMLET — hamlet, high monster threat, monster_pressure stress.
//    Config-forced; seed arbitrary but pinned.
// ─────────────────────────────────────────────────────────────────────────────
describe('RAIDED HAMLET (hamlet, high threat / monster pressure)', () => {
  const CONFIG = { settType: 'hamlet', monsterThreat: 'high', stressType: 'monster_pressure', terrainOverride: 'forest', tradeRouteAccess: 'road' };
  const SEED = 'fixture-raided-hamlet'; // config-forced; seed arbitrary
  let s;
  beforeAll(() => { s = gen(CONFIG, SEED); });

  test('the threat profile is non-empty (elevated monster threat resolved)', () => {
    // 'high' normalizes to 'plagued' — the top threat band.
    expect(s.config?.monsterThreat).toBe('plagued');
    expect(s.defenseProfile?.scores).toBeTruthy();
    expect(Number.isFinite(s.defenseProfile?.scores?.monster)).toBe(true);
  });

  test('COHERENCE: the monster-pressure stress promotes into an active condition', () => {
    expect(stressTypes(s)).toContain('monster_pressure');
    // monster/raider stressors map to the war_pressure condition archetype.
    expect(conditionArchetypes(s)).toContain('war_pressure');
  });

  test('COHERENCE: defense posture reflects a hamlet that cannot repel raids', () => {
    const readiness = s.defenseProfile?.readiness;
    expect(readiness?.label).toBeTruthy();
    // an unwalled hamlet at top threat is materially under-defended
    expect(readiness.score).toBeLessThan(50);
  });

  test('HOOK: the crisis hook references the raiding threat', () => {
    const entry = stressEntries(s).find((e) => e.type === 'monster_pressure');
    expect(entry).toBeTruthy();
    expect(entry.crisisHook).toMatch(/attack|raid|beast|monster|coordinat|creature|ambush/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. BLOCKADED PORT — coastal port under siege (blockade-class stress).
//    Config-forced; seed arbitrary but pinned.
// ─────────────────────────────────────────────────────────────────────────────
describe('BLOCKADED PORT (coastal + siege-class stress)', () => {
  const CONFIG = { settType: 'town', terrainOverride: 'coastal', tradeRouteAccess: 'port', stressType: 'under_siege' };
  const SEED = 'fixture-blockaded-port'; // config-forced; seed arbitrary
  let s;
  beforeAll(() => { s = gen(CONFIG, SEED); });

  test('the siege stress entry is present and coherent with an active condition', () => {
    expect(stressTypes(s)).toContain('under_siege');
    // siege/blockade maps to the war_pressure archetype.
    expect(conditionArchetypes(s)).toContain('war_pressure');
  });

  test('COHERENCE: trade disruption is visible in the economy narrative', () => {
    const desc = s.economicState?.situationDesc || '';
    expect(desc).toMatch(/suspended|closed|caravan|blockad|siege|supply|survival/i);
  });

  test('COHERENCE: supply-chain gaps surface in the viability report', () => {
    expect(s.economicViability?.viable).toBe(false);
    const titles = (s.economicViability?.issues || []).map((i) => i.title || '').join(' | ');
    expect(titles).toMatch(/siege|supply chain|food/i);
  });

  test('COHERENCE: the food model registers the siege, and a trade dependency is severed', () => {
    expect(s.economicState?.foodSecurity?.hasSiege).toBe(true);
    const deps = s.economicState?.tradeDependencies || [];
    expect(deps.some((d) => (d.severity === 'critical') || /sever|cut|shut/i.test(d.impact || ''))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. RELIGIOUS CAPITAL — city, dominant religious priority. Seed searched over
//    fixture-religious-${i} for a run where religion holds the top power seat.
// ─────────────────────────────────────────────────────────────────────────────
describe('RELIGIOUS CAPITAL (city+, religious priority)', () => {
  const CONFIG = { settType: 'city', priorityReligion: 95, priorityEconomy: 25, priorityCriminal: 10, priorityMagic: 10, magicExists: true, terrainOverride: 'plains', tradeRouteAccess: 'road' };
  const SEED = 'fixture-religious-0'; // pinned: religion holds a top-2 power seat (searched)
  let s;
  beforeAll(() => { s = gen(CONFIG, SEED); });

  const REL_INST = /church|temple|cathedral|monaster|shrine|priest|chapel|abbey|sanctuar|convent|clergy|basilica|seminary|pilgrim/i;
  const REL_ROLE = /priest|cleric|bishop|abbot|monk|acolyte|chaplain|prelate|deacon|cardinal|templar|inquisitor|hierophant|prior|friar|nun|temple|oracle/i;

  test('religious institutions are prominent', () => {
    const relInst = institutionNames(s).filter((n) => REL_INST.test(n));
    expect(relInst.length).toBeGreaterThanOrEqual(1);
  });

  test('COHERENCE: a religious faction holds top-tier power in the structure', () => {
    expect(hasFactionCategory(s, 'religious')).toBe(true);
    const rank = factionCategoryRank(s, 'religious');
    expect(rank).toBeLessThanOrEqual(1); // religion is #1 or #2 — a genuine capital
  });

  test('religious NPCs/roles are present', () => {
    const rel = npcRoles(s).filter((r) => REL_ROLE.test(r));
    expect(rel.length).toBeGreaterThanOrEqual(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. RESOURCE-COLLAPSE MINE — isolated no-magic mining village whose metal/coal
//    seams are worked out (manual depletion — deterministic, no seed search).
//    Only the stone quarry survives, so the productive base visibly collapses.
// ─────────────────────────────────────────────────────────────────────────────
describe('RESOURCE-COLLAPSE MINE (mining resources depleted + isolation)', () => {
  const CONFIG = {
    settType: 'village',
    terrainOverride: 'mountain',
    tradeRouteAccess: 'isolated',
    magicExists: false, // no arcane trade channel to paper over the isolation
    nearbyResourcesRandom: false,
    nearbyResourcesState: {
      iron_deposits: 'depleted',
      coal_deposits: 'depleted',
      precious_metals: 'depleted',
      gemstone_deposits: 'depleted',
      stone_quarry: 'abundant', // one surviving seam
    },
  };
  const SEED = 'fixture-mine-collapse'; // depletion is config-forced; seed arbitrary
  let s;
  beforeAll(() => { s = gen(CONFIG, SEED); });

  test('the worked-out mining seams are flagged depleted', () => {
    const depleted = s.config?.nearbyResourcesDepleted || [];
    for (const key of ['iron_deposits', 'coal_deposits', 'precious_metals', 'gemstone_deposits']) {
      expect(depleted).toContain(key);
    }
  });

  test('RECEIPT: a trace names each seam as present-but-depleted', () => {
    for (const key of ['iron_deposits', 'coal_deposits', 'precious_metals']) {
      const receipt = (s.simulationTrace || []).find((t) => t.targetId === `resource.${key}` && t.result === 'present_but_depleted');
      expect(receipt, `expected a present_but_depleted receipt for ${key}`).toBeTruthy();
    }
  });

  test('COHERENCE: the depleted seams drop out of the productive base', () => {
    const available = s.resourceAnalysis?.availableResources || [];
    // depleted metal/coal seams no longer feed the economy...
    expect(available).not.toContain('iron_deposits');
    expect(available).not.toContain('coal_deposits');
    expect(available).not.toContain('precious_metals');
    // ...only the surviving stone seam does.
    expect(available).toContain('stone_quarry');
    const chains = (s.resourceAnalysis?.resourceChains || []).map((c) => c.rawResource);
    expect(chains).not.toContain('iron');
    expect(chains).toContain('stone');
  });

  test('COHERENCE: economic distress is consistent with the resource story', () => {
    // an isolated, no-magic mining village with its seams worked out is a
    // subsistence economy — not a thriving one. Bind to the deterministic
    // derived fields for this pinned seed: prosperity floored to Poor, a
    // subsistence complexity classification, and an isolation-constrained
    // situation narrative.
    expect(prosperityRank(s.economicState?.prosperity)).toBeLessThanOrEqual(prosperityRank('Poor'));
    expect(s.economicState?.economicComplexity || '').toMatch(/subsistence|survival|limited/i);
    expect(s.economicState?.situationDesc || '').toMatch(/external trade|outside trade|isolation|ration|subsistence|specialist goods|self-suffic/i);
  });
});
