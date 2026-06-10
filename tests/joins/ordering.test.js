/**
 * tests/joins/ordering.test.js — Wave 4b ordering-sensitive trio.
 *
 * The three pass-ordering fixes this file guards:
 *
 *   1. FACTION-INSTITUTION BOOST — applyFactionInstitutionBoosts reads the
 *      real catalog `baseChance` (not the nonexistent `p`), honours the
 *      dual-format institution toggles, and economyReconcilePass re-derives
 *      the economy/services/spatial from the FINAL roster, so faction-pulled
 *      institutions actually join chains / income / services.
 *
 *   2. VALIDATOR ORDER — structuralValidationPass runs after the LAST roster
 *      mutation (factionCorrelationPass), so the coherence receipt
 *      (structuralViolations) describes the final roster — no violation can
 *      reference an institution that subsumption / cascade / isolation /
 *      faction-pull removed or resolved.
 *
 *   3. STRESS CONFIRM PASS — stressConfirmPass re-weights emergent stressors
 *      against the real roster: a walled town suppresses sieges measurably
 *      vs an unwalled one across fixed seeds, and user-forced stress is
 *      NEVER dropped.
 *
 * All seeds are fixed — every number asserted here is deterministic.
 */

import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveInstitutionalServices } from '../../src/generators/computeActiveChains.js';
import { checkStructuralValidity } from '../../src/generators/structuralValidator.js';

function gen(config, seed) {
  return generateSettlementPipeline(config, null, { seed, customContent: {} });
}

// ── 1. Faction-pulled institutions join the economy ─────────────────────────

describe('faction-pulled institutions join services / chains / income', () => {
  // Seeds empirically verified to produce a faction_boost addition with the
  // current generation tables. Deterministic per seed; if the institution
  // catalog or faction thresholds are retuned these seeds may need refreshing
  // — the scan test below guards that at least some seeds still fire.
  const FB_CASES = [
    { seed: 'ord-1',  config: { settType: 'town',       culture: 'germanic', tradeRouteAccess: 'road' } },
    { seed: 'ord-7',  config: { settType: 'city',       culture: 'germanic', tradeRouteAccess: 'road' } },
    { seed: 'ord-13', config: { settType: 'metropolis', culture: 'germanic', tradeRouteAccess: 'road' } },
  ];

  it('known seeds still produce faction_boost institutions (full catalog defs, traced)', () => {
    let sawAny = false;
    for (const { seed, config } of FB_CASES) {
      const s = gen(config, seed);
      const pulled = s.institutions.filter(i => i.source === 'faction_boost');
      if (pulled.length === 0) continue;
      sawAny = true;
      for (const inst of pulled) {
        // Full catalog def carried — not a metadata stub (the old code
        // pushed {name, category, p, desc} only, invisible to tag-keyed
        // consumers and the dead `p` field collapsed all rarity to 0.5).
        expect(inst.baseChance, `${inst.name} missing baseChance`).toBeGreaterThan(0);
        expect(inst.p).toBeUndefined();
        expect(typeof inst.category).toBe('string');
        expect(inst.factionSource).toBeTruthy();
        // The pull is receipted.
        const trace = (s.simulationTrace || []).find(t =>
          t.result === 'faction_pulled' &&
          t.targetId.includes(inst.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, ''))
        );
        expect(trace, `${inst.name} has no faction_pulled trace`).toBeTruthy();
      }
    }
    expect(sawAny, 'none of the pinned seeds produced a faction_boost — refresh FB_CASES').toBe(true);
  });

  it('the dossier economy is derived from the FINAL roster (pull included)', () => {
    for (const { seed, config } of FB_CASES) {
      const s = gen(config, seed);
      if (!s.institutions.some(i => i.source === 'faction_boost')) continue;
      // economicState.institutionalServices is a pure derivation of the
      // roster the economy was computed from. If the economy had been left
      // on the pre-pull roster (the old ordering bug), this equality fails
      // for any pulled institution that provides services.
      expect(s.economicState.institutionalServices)
        .toEqual(deriveInstitutionalServices(s.institutions));
      // Services + spatial exist and were derived post-pull (the reconcile
      // step is the only producer of these keys now).
      expect(s.availableServices && typeof s.availableServices).toBe('object');
      expect(s.spatialLayout).toBeTruthy();
    }
  });

  it('a force-excluded institution is never resurrected by a faction pull', () => {
    // Exclude every Religious institution a religious faction could pull at
    // town tier via dual-format toggles; across the seeds that previously
    // pulled religious institutions, none may reappear.
    const excluded = ['Monastery or friary', 'Small hospital', 'Almshouse'];
    const toggles = {};
    for (const n of excluded) {
      toggles[`town::Religious::${n}`] = { allow: false, forceExclude: true };
      toggles[`town::Essential::${n}`] = { allow: false, forceExclude: true };
    }
    for (const seed of ['ord-1', 'ord-2', 'ord-6', 'ord-8', 'ord-9', 'ord-14']) {
      const s = gen({
        settType: 'town', culture: 'germanic', tradeRouteAccess: 'road',
        _institutionToggles: toggles,
      }, seed);
      const resurrections = s.institutions.filter(i =>
        i.source === 'faction_boost' && excluded.includes(i.name));
      expect(resurrections, `${seed} resurrected ${resurrections.map(r => r.name).join(', ')}`)
        .toEqual([]);
    }
  });
});

// ── 2. The structural receipt describes the FINAL roster ────────────────────

describe('structural receipt describes the final roster', () => {
  const CONFIGS = [
    { settType: 'town', culture: 'germanic', tradeRouteAccess: 'road' },
    { settType: 'city', culture: 'germanic', tradeRouteAccess: 'road' },
  ];

  it('matches a fresh validation of the final institutions (receipt is not stale)', () => {
    for (const config of CONFIGS) {
      for (let i = 0; i < 8; i++) {
        const s = gen(config, `receipt-${config.settType}-${i}`);
        const fresh = checkStructuralValidity(s.institutions, {
          tier: s.tier,
          tradeRouteAccess: s.config.tradeRouteAccess,
          magicLevel: s.config.magicLevel,
          monsterThreat: s.config.monsterThreat,
          priorityMilitary: s.config.priorityMilitary,
          priorityMagic: s.config.priorityMagic,
          nearbyResources: s.config.nearbyResources,
          _magicTradeOnly: s.config._magicTradeOnly,
        });
        // subsistence_struggle is the one rng-dependent violation (isolated
        // thorp/hamlet only — not these configs, but filtered for safety).
        const key = v => `${v.type}::${v.institution}`;
        const receipt = (s.structuralViolations || []).filter(v => v.type !== 'subsistence_struggle').map(key).sort();
        const expected = (fresh.violations || []).filter(v => v.type !== 'subsistence_struggle').map(key).sort();
        expect(receipt).toEqual(expected);
      }
    }
  });

  it('no presence-implying violation references an institution missing from the roster', () => {
    // These violation types assert facts ABOUT a listed institution — under
    // the old ordering they could reference institutions that subsumption /
    // cascade / isolation later removed.
    const PRESENCE_TYPES = new Set([
      'tier_violation', 'dependency_violation', 'exclusion_violation',
      'context_warning', 'out_of_tier',
    ]);
    for (const config of CONFIGS) {
      for (let i = 0; i < 10; i++) {
        const s = gen(config, `receipt-presence-${config.settType}-${i}`);
        const names = new Set(s.institutions.map(inst => inst.name));
        for (const v of s.structuralViolations || []) {
          if (!PRESENCE_TYPES.has(v.type)) continue;
          // exclusion_violation joins names with ' / ' for exclusivity groups
          const referenced = v.type === 'exclusivity_violation'
            ? v.conflicting || []
            : [v.institution];
          for (const name of referenced) {
            expect(names.has(name),
              `${v.type} references "${name}" which is not on the final roster (seed receipt-presence-${config.settType}-${i})`,
            ).toBe(true);
          }
        }
      }
    }
  });
});

// ── 3. Stress confirm — institutions modulate emergent stress ───────────────

describe('stressConfirmPass — walls suppress sieges, forced stress survives', () => {
  const SIEGEY = t => t === 'under_siege' || t === 'monster_pressure' || t === 'occupied';

  it('a walled town suppresses sieges measurably vs an unwalled one (120 paired seeds)', () => {
    const N = 120;
    const base = {
      settType: 'town', culture: 'germanic', tradeRouteAccess: 'road',
      monsterThreat: 'plagued', priorityMilitary: 20,
    };
    const walledToggles = {
      'town::Defense::Town walls': { allow: true, require: true },
      'town::Defense::Garrison':   { allow: true, require: true },
    };
    const unwalledToggles = {};
    for (const n of [
      'Town walls', 'Palisade or earthworks', 'City walls and gates',
      'Garrison', 'Barracks', 'Town watch', 'Citizen militia', 'Professional city watch',
    ]) {
      unwalledToggles[`town::Defense::${n}`] = { allow: false, forceExclude: true };
    }

    let walledSieges = 0;
    let unwalledSieges = 0;
    let subsetViolations = 0;
    for (let i = 0; i < N; i++) {
      const seed = `siege-${i}`;
      // Same seed → resolveStress (own fork, pre-institutions) rolls the
      // IDENTICAL initial stress set for both variants. Only the confirm
      // pass differs: the walled roster damps siege-family stressors
      // (keep p = clamp(0.6×0.7, 0.4, 1) = 0.42); the unwalled roster has
      // no suppressors → ratio ≥ 1 → no rng draw, everything kept. So the
      // walled survivors must be a per-seed SUBSET of the unwalled ones.
      const walled   = gen({ ...base, _institutionToggles: walledToggles }, seed);
      const unwalled = gen({ ...base, _institutionToggles: unwalledToggles }, seed);
      const wt = (walled.config.stressTypes || []).filter(SIEGEY);
      const ut = (unwalled.config.stressTypes || []).filter(SIEGEY);
      walledSieges   += wt.length;
      unwalledSieges += ut.length;
      if (wt.some(t => !ut.includes(t))) subsetViolations += 1;
    }

    // The unwalled baseline must produce enough sieges for the comparison
    // to mean anything (empirically 18 with these seeds).
    expect(unwalledSieges).toBeGreaterThanOrEqual(10);
    // Per-seed subset property: walls only ever REMOVE sieges.
    expect(subsetViolations).toBe(0);
    // Measurable suppression (empirically 6 vs 18 — ~67% suppressed,
    // consistent with the 0.42 keep probability).
    expect(walledSieges).toBeLessThanOrEqual(Math.floor(unwalledSieges * 0.7));
  });

  it('user-forced stress (Mode 0 stressTypes) always survives, even fully suppressed', () => {
    for (let i = 0; i < 10; i++) {
      const s = gen({
        settType: 'town', culture: 'germanic', tradeRouteAccess: 'road',
        monsterThreat: 'heartland',                  // ×0.3 — maximally hostile to siege
        stressTypes: ['under_siege'],
        _institutionToggles: {
          'town::Defense::Town walls': { allow: true, require: true },
          'town::Defense::Garrison':   { allow: true, require: true },
        },
      }, `forced-siege-${i}`);
      expect(s.config.stressTypes).toContain('under_siege');
      const stressors = Array.isArray(s.stressors) ? s.stressors : s.stressors ? [s.stressors] : [];
      expect(stressors.some(st => st?.type === 'under_siege')).toBe(true);
    }
  });

  it('user-selected pool stress (Mode 2 selectedStresses) always survives', () => {
    for (let i = 0; i < 10; i++) {
      const s = gen({
        settType: 'village', culture: 'germanic', tradeRouteAccess: 'road',
        selectedStressesRandom: false,
        selectedStresses: ['famine'],
        _institutionToggles: {
          'village::Essential::Town granary': { allow: true, require: true },
        },
      }, `forced-famine-${i}`);
      expect(s.config.stressTypes).toContain('famine');
      const stressors = Array.isArray(s.stressors) ? s.stressors : s.stressors ? [s.stressors] : [];
      expect(stressors.some(st => st?.type === 'famine')).toBe(true);
    }
  });

  it('confirmation is deterministic per seed', () => {
    const config = {
      settType: 'town', culture: 'germanic', tradeRouteAccess: 'road',
      monsterThreat: 'plagued',
    };
    const a = gen(config, 'stress-det');
    const b = gen(config, 'stress-det');
    expect(a.config.stressTypes).toEqual(b.config.stressTypes);
    expect(a.institutions.map(i => i.name)).toEqual(b.institutions.map(i => i.name));
  });
});
