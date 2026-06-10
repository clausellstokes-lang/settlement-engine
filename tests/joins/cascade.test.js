/**
 * Join harness — supply-chain cascade pass.
 *
 * The cascade pass joins three tables:
 *   SUPPLY_CHAIN_NEEDS chain processors  →  adjacency map (16-char lowercase
 *   prefix keys)  →  institutionalCatalog entries, whose probability field is
 *   `baseChance` (the catalog defines no `p` field — reading any other field
 *   silently yields 0 and kills the whole pass).
 *
 * These tests pin that join end to end:
 *   1. schema: the catalog really is a baseChance schema (no legacy p/on),
 *   2. data join: chain-adjacent catalog entries resolve a nonzero chance
 *      through the cascade math,
 *   3. matcher join: applyCascadeInstitutions (the real matcher) produces
 *      additions for most chains and respects the 0.45 dampening cap,
 *   4. behavior: a seeded full generation produces cascade additions, and an
 *      airship settlement gets its maritime override independent of whether
 *      the cascade added anything.
 */

import { describe, test, expect, afterEach } from 'vitest';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { SUPPLY_CHAIN_NEEDS } from '../../src/data/supplyChainData.js';
import { applyCascadeInstitutions } from '../../src/generators/cascadeGenerator.js';
import { setActiveRng, clearActiveRng } from '../../src/generators/rngContext.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

// Same match key the cascade uses (cascadeGenerator.js `mk`): institutions and
// catalog entries join on the first 16 lowercased characters of the name.
const mk = (n) => n.toLowerCase().slice(0, 16);

/** Every catalog leaf def, flattened: { tier, category, name, def }. */
function allCatalogDefs() {
  const out = [];
  for (const [tier, tierCat] of Object.entries(institutionalCatalog)) {
    for (const [category, insts] of Object.entries(tierCat)) {
      for (const [name, def] of Object.entries(insts)) {
        out.push({ tier, category, name, def });
      }
    }
  }
  return out;
}

/** All multi-processor chains (the only ones that produce adjacency). */
function multiProcessorChains() {
  const out = [];
  for (const need of Object.values(SUPPLY_CHAIN_NEEDS)) {
    for (const chain of need.chains) {
      const procs = chain.processingInstitutions || [];
      if (procs.length >= 2) out.push(chain);
    }
  }
  return out;
}

afterEach(() => clearActiveRng());

// ── 1. Catalog probability schema ───────────────────────────────────────────

describe('join: institutionalCatalog probability schema', () => {
  test('catalog uses baseChance — no def carries the legacy p/on fields', () => {
    const defs = allCatalogDefs();
    expect(defs.length).toBeGreaterThan(0);
    const legacy = defs.filter(({ def }) => 'p' in def || 'on' in def);
    expect(legacy.map((d) => d.name)).toEqual([]);
  });

  test('every def with baseChance has a numeric probability in [0, 1]', () => {
    // 0 is legal (entry appears only when required/forced/toggled);
    // anything non-numeric or out of range would silently break every
    // probability consumer, the cascade included.
    for (const { name, def } of allCatalogDefs()) {
      if (!('baseChance' in def)) continue;
      expect(typeof def.baseChance, `${name} baseChance type`).toBe('number');
      expect(def.baseChance, `${name} baseChance >= 0`).toBeGreaterThanOrEqual(0);
      expect(def.baseChance, `${name} baseChance <= 1`).toBeLessThanOrEqual(1);
    }
  });
});

// ── 2. Data-level join: chain adjacency → catalog baseChance ────────────────

describe('join: chain processors resolve to cascade-eligible catalog entries', () => {
  test('>=1 adjacency target is a catalog entry with nonzero baseChance', () => {
    // Adjacency targets: every processor of a multi-processor chain other
    // than itself is reachable as an up/down neighbour of some processor.
    const targetKeys = new Set();
    for (const chain of multiProcessorChains()) {
      for (const proc of chain.processingInstitutions) targetKeys.add(mk(proc));
    }
    const eligible = allCatalogDefs().filter(
      ({ name, def }) =>
        targetKeys.has(mk(name)) && typeof def.baseChance === 'number' && def.baseChance > 0,
    );
    // Through the cascade math: min(baseChance * boost, 0.45) > 0 whenever
    // baseChance > 0 and boost > 1, so each of these is genuinely rollable.
    expect(eligible.length).toBeGreaterThanOrEqual(1);
    // The join is broad, not a single lucky hit — dozens of catalog entries
    // sit on chain adjacency. Floor kept loose so vocabulary fixes in other
    // tables don't thrash this test.
    expect(eligible.length).toBeGreaterThanOrEqual(20);
  });
});

// ── 3. Matcher-level join: applyCascadeInstitutions ─────────────────────────

describe('join: applyCascadeInstitutions resolves the adjacency', () => {
  const TIERS = ['village', 'town', 'city', 'metropolis'];

  test('most multi-processor chains yield >=1 addition when the rng is forced low', () => {
    // rng forced to 0: every eligible target with cascadeChance > 0 is added,
    // so this measures pure join resolvability, not luck.
    setActiveRng({ random: () => 0 });
    const chains = multiProcessorChains();
    let resolvable = 0;
    for (const chain of chains) {
      const seedInst = [{ name: chain.processingInstitutions[0] }];
      if (TIERS.some((tier) => applyCascadeInstitutions(seedInst, tier).length > 0)) {
        resolvable++;
      }
    }
    expect(chains.length).toBeGreaterThan(0);
    // Measured 57/59 at time of writing; loose floor tolerates chain-table
    // edits without letting the pass die silently again.
    expect(resolvable).toBeGreaterThanOrEqual(Math.max(10, Math.floor(chains.length / 2)));
  });

  test('smelter pulls its chain neighbour, carrying catalog metadata', () => {
    // The owner's canonical cascade example: the metal chain is
    // ['Smelter', 'Specialized metalworkers'], so a city with a smelter
    // creates demand for the metalworkers.
    setActiveRng({ random: () => 0 });
    const adds = applyCascadeInstitutions([{ name: 'Smelter' }], 'city');
    const names = adds.map((a) => a.name);
    expect(names).toContain('Specialized metalworkers');
    for (const add of adds) {
      // Cascade additions must look like assemble-path institutions:
      // downstream passes classify by tags, and the subsistence strip
      // deletes untagged institutions as presumed trade.
      expect(Array.isArray(add.tags), `${add.name} tags`).toBe(true);
      expect(typeof add.desc, `${add.name} desc`).toBe('string');
      expect(add.source).toBe('cascade');
      expect(add.cascadeAdded).toBe(true);
      expect(add.cascadeBoost).toBeGreaterThan(1);
    }
  });

  test('the 0.45 dampening cap holds: no addition can beat a 0.45 roll', () => {
    // cascadeChance = min(baseChance * boost, 0.45), so a roll of 0.5 must
    // never pass — cascades supplement generation, they cannot dominate it.
    setActiveRng({ random: () => 0.5 });
    for (const chain of multiProcessorChains()) {
      const adds = applyCascadeInstitutions(
        [{ name: chain.processingInstitutions[0] }], 'city',
      );
      expect(adds).toEqual([]);
    }
  });

  test('geography gates hold: trade-gated institutions cannot cascade into an isolated town', () => {
    // The cascade re-rolls catalog entries, so it must honour the same
    // tradeRouteRequired gate as assembleInstitutions — a boost is not a
    // licence to put a customs house in a settlement with no routes.
    setActiveRng({ random: () => 0 });
    for (const chain of multiProcessorChains()) {
      const adds = applyCascadeInstitutions(
        [{ name: chain.processingInstitutions[0] }], 'town', { tradeRoute: 'isolated' },
      );
      for (const add of adds) {
        const gated = Array.isArray(add.tradeRouteRequired)
          && add.tradeRouteRequired.length > 0
          && !add.tradeRouteRequired.includes('isolated');
        expect(gated, `${add.name} requires a trade route but cascaded into an isolated town`)
          .toBe(false);
      }
    }
  });

  test('already-present targets are never re-added', () => {
    setActiveRng({ random: () => 0 });
    const roster = [{ name: 'Smelter' }, { name: 'Specialized metalworkers' }];
    const adds = applyCascadeInstitutions(roster, 'city');
    expect(adds.map((a) => a.name)).not.toContain('Specialized metalworkers');
  });
});

// ── 4. Seeded end-to-end behavior ───────────────────────────────────────────

describe('behavior: seeded generation produces cascade output', () => {
  const TOWN_CFG = {
    settType: 'town', culture: 'germanic', terrain: 'mountains', tradeRouteAccess: 'road',
  };
  const gen = (config, seed) =>
    generateSettlementPipeline(config, null, { seed, customContent: {} });

  test('pinned seed: a town generation includes cascade additions with receipts', () => {
    const s = gen(TOWN_CFG, 'cascade-join-3');
    const adds = (s.institutions || []).filter((i) => i.cascadeAdded);
    expect(adds.length).toBeGreaterThan(0);
    for (const add of adds) {
      expect(Array.isArray(add.tags)).toBe(true);
      expect(add.source).toBe('cascade');
    }
    // The DM-visible receipt: each addition gets a 'cascaded' trace.
    const cascadeTraces = (s.simulationTrace || []).filter(
      (t) => t.step === 'cascadePass' && t.result === 'cascaded',
    );
    expect(cascadeTraces.length).toBeGreaterThan(0);
  });

  test('cascade fires for most seeds, not just a lucky one', () => {
    const seeds = Array.from({ length: 8 }, (_, i) => `cascade-join-${i}`);
    const hits = seeds.filter(
      (seed) => gen(TOWN_CFG, seed).institutions.some((i) => i.cascadeAdded),
    );
    // Measured 8/8 at time of writing; >=4 keeps slack for roster-shifting
    // fixes elsewhere while still proving the pass is alive.
    expect(hits.length).toBeGreaterThanOrEqual(4);
  });

  test('airship settlements get maritime infrastructure regardless of cascade outcome', () => {
    // Airship docking is rolled in main generation (metropolis, high magic);
    // the maritime override must fire independently of cascade additions.
    const METRO_CFG = {
      settType: 'metropolis', culture: 'germanic', terrain: 'grassland',
      tradeRouteAccess: 'road', priorityMagic: 100,
    };
    const MARITIME = new Set(['Docks/port facilities', "Harbour master's office"]);
    let airshipSeen = 0;
    let maritimeHit = null;
    // Deterministic scan with early exit — seed 'airship-join-0' hits on the
    // first iteration at time of writing; the window absorbs roster drift.
    for (let i = 0; i < 20 && !maritimeHit; i++) {
      const s = gen(METRO_CFG, `airship-join-${i}`);
      const names = (s.institutions || []).map((x) => x.name);
      if (!names.some((n) => /airship/i.test(n))) continue;
      airshipSeen++;
      if (names.some((n) => MARITIME.has(n))) maritimeHit = `airship-join-${i}`;
    }
    expect(airshipSeen).toBeGreaterThan(0);
    expect(maritimeHit).toBeTruthy();
  });
});
