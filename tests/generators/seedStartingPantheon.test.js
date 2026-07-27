/**
 * seedStartingPantheon.test.js — the LATENT starting pantheon through the REAL
 * pipeline (Phase 4 W-F5 stage 2; PREMIUM GATE addendum).
 *
 * The implementation law under test: TIER NEVER TOUCHES GENERATION. The
 * pipeline bakes `config.latentPantheon` for every seed on the default path,
 * writes ZERO live embeds (the engine stays inert by the neutrality theorem —
 * the free tier is the certified ground state), never names a latent deity in
 * any prose/hook surface, and the whole draw is seed-deterministic. The
 * activation seam itself is pinned in tests/domain/latentPantheon.test.js.
 */

import { describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { DEITY_POOL, DEITY_CORE_REF_PREFIX } from '../../src/generators/data/deityPool.js';
import { capacityForTier, nicheOf } from '../../src/domain/worldPulse/cultImpositionApply.js';
import { isSubsystemActive } from '../../src/domain/worldPulse/subsystemActivation.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const gen = (config, seed) => generateSettlementPipeline(config, null, { seed, customContent: {} });

const CONFIGS = [
  { settType: 'thorp', culture: 'celtic', terrainOverride: 'forest', tradeRouteAccess: 'isolated', monsterThreat: 'frontier' },
  { settType: 'village', culture: 'norse', terrainOverride: 'coastal', tradeRouteAccess: 'port', monsterThreat: 'civilized' },
  { settType: 'town', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat: 'civilized' },
  { settType: 'metropolis', culture: 'mediterranean', terrainOverride: 'riverside', tradeRouteAccess: 'river', monsterThreat: 'safe' },
];
const SEEDS = ['latent-a', 'latent-b', 'latent-c'];
/** Every (config, seed) pair the sweeps below exercise, config-major as before. */
const CONFIG_SEED_CASES = CONFIGS.flatMap(
  (config) => SEEDS.map((seed) => ({ config, seed })),
);

describe('seedStartingPantheon — latent bake through the live pipeline', () => {
  it('bakes a latent pantheon for EVERY default-path generation — and ZERO live embeds', () => {
    const failures = collectSeedFailures(CONFIG_SEED_CASES, ({ config, seed }) => {
      const s = gen(config, seed);
      const latent = s.config?.latentPantheon;
      // Latent data present for every generation (the ratified default).
      expect(latent?.patron, `${config.settType}|${seed}`).toBeTruthy();
      expect(String(latent.patron._deityRef)).toMatch(new RegExp(`^${DEITY_CORE_REF_PREFIX}`));
      expect(s.config.faith).toBe('pantheon');
      // ZERO embeds without activation — the neutrality-theorem ground state.
      expect(s.config.primaryDeitySnapshot).toBeUndefined();
      expect(s.config.primaryDeityRef).toBeUndefined();
      expect(s.config.cultDeitySnapshots).toBeUndefined();
      // The religion subsystem gate stays CLOSED on the latent record.
      expect(isSubsystemActive({ settlements: [{ id: 's0', name: s.name, settlement: s }] }, 'religion')).toBe(false);
    });
    expectNoSeedFailures(failures, 'every default-path generation bakes a latent pantheon with zero live embeds');
  }, 60_000);

  it('the latent draw is bounded and niche-disciplined (capacity ceiling, distinct niches, pool refs only)', () => {
    for (const config of CONFIGS) {
      const s = gen(config, 'latent-bounds');
      const latent = s.config.latentPantheon;
      const all = [latent.patron, ...(latent.cults || [])];
      // 1 patron + cults ≤ tier capacity (and never more than the design cap).
      expect(all.length).toBeLessThanOrEqual(capacityForTier(s.tier));
      // One deity per (derived) niche — no day-one patron contest.
      const niches = all.map(nicheOf);
      expect(new Set(niches).size).toBe(niches.length);
      // Every ref resolves to a real pool entry; cults are never 'major' rank.
      for (const d of all) {
        const slug = String(d._deityRef).slice(DEITY_CORE_REF_PREFIX.length);
        const pool = DEITY_POOL.find((p) => p.slug === slug);
        expect(pool, d._deityRef).toBeTruthy();
        expect(d.name).toBe(pool.name);
      }
      for (const c of latent.cults || []) expect(c.rankAxis).not.toBe('major');
    }
  }, 30_000);

  it('is seed-deterministic: same config + seed ⇒ byte-identical latent record', () => {
    const [config] = CONFIGS;
    const a = gen(config, 'latent-det');
    const b = gen(config, 'latent-det');
    expect(JSON.stringify(a.config.latentPantheon)).toBe(JSON.stringify(b.config.latentPantheon));
    // And the whole settlement stays deterministic with the step in the chain.
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  }, 30_000);

  it("faith:'none' opts out — no latent record, and the ONLY output difference is the faith/latent class", () => {
    const config = CONFIGS[2];
    const withFaith = gen(config, 'latent-optout');
    const none = gen({ ...config, faith: 'none' }, 'latent-optout');
    expect(none.config.latentPantheon).toBeUndefined();
    expect(none.config.faith).toBe('none');             // the explicit input echoes through the resolved snapshot
    expect(none._config.faith).toBe('none');            // and the raw input record (provenance)
    // Byte-identity of everything OUTSIDE the faith/latent class: strip the
    // class fields from both outputs and compare wholesale — proving the step
    // touches nothing else (prose, hooks, npcs, economy all identical).
    const strip = (s) => {
      const clone = JSON.parse(JSON.stringify(s));
      delete clone.config.latentPantheon;
      delete clone.config.faith;
      delete clone._config.faith;
      return clone;
    };
    expect(JSON.stringify(strip(none))).toBe(JSON.stringify(strip(withFaith)));
  }, 30_000);

  it('LATENCY DISCIPLINE: no generation surface outside the latent record names a latent deity', () => {
    const failures = collectSeedFailures(CONFIG_SEED_CASES, ({ config, seed }) => {
      const s = gen(config, seed);
      const latent = s.config.latentPantheon;
      const latentNames = [latent.patron, ...(latent.cults || [])].map((d) => d.name);
      const clone = JSON.parse(JSON.stringify(s));
      delete clone.config.latentPantheon;             // the sole sanctioned address
      const everythingElse = JSON.stringify(clone);
      for (const name of latentNames) {
        expect(everythingElse.includes(name), `${name} leaked outside latentPantheon (${config.settType}|${seed})`).toBe(false);
      }
    });
    expectNoSeedFailures(failures, 'no generation surface outside the latent record names a latent deity');
  }, 60_000);

  it('an explicit live deity in the input config is respected — no latent record baked beneath it', () => {
    const explicit = {
      _deityRef: 'custom:lu_ownergod', name: 'Ownergod', alignmentAxis: 'good',
      temperamentAxis: 'peacelike', rankAxis: 'major', lawAxis: 'lawful',
    };
    const s = gen({ ...CONFIGS[2], primaryDeityRef: explicit._deityRef, primaryDeitySnapshot: explicit }, 'latent-explicit');
    expect(s.config.latentPantheon).toBeUndefined();
    expect(s.config.primaryDeitySnapshot?.name).toBe('Ownergod');
  }, 30_000);
});
