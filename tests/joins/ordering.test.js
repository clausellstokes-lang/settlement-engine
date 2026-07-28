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

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveInstitutionalServices } from '../../src/generators/computeActiveChains.js';
import { checkStructuralValidity } from '../../src/generators/structuralValidator.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { readEnvelope } from '../helpers/distributionEnvelope.js';

function gen(config, seed) {
  return generateSettlementPipeline(config, null, { seed, customContent: {} });
}

/** The one canonical home for this file's derived distribution bounds. */
const ENVELOPES = JSON.parse(readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../fixtures/distribution-envelopes.manifest.json'),
  'utf8',
));

/**
 * Read a registered envelope and prove it was measured against THIS corpus size. An
 * entry whose `n` drifted from the sweep it governs is a bound about a different
 * experiment; the derivation would still re-check, but against the wrong n.
 * @param {string} id @param {number} n the corpus this sweep actually runs
 */
function envelope(id, n) {
  const entry = readEnvelope(ENVELOPES, id);
  expect(entry.n, `${id}: registered for n=${entry.n} but this sweep runs N=${n}`).toBe(n);
  return entry;
}

// ── 1. Faction-pulled institutions join the economy ─────────────────────────

describe('faction-pulled institutions join services / chains / income', () => {
  // Seeds re-probed after culture profiles and named generation substreams
  // deliberately changed draw placement. Each currently produces a surviving
  // faction_boost addition; the assertions below still test semantic joins,
  // never hashes or an exact institution roster.
  const FB_CASES = [
    { seed: 'ord-new-town-0',       config: { settType: 'town',       culture: 'germanic', tradeRouteAccess: 'road' } },
    { seed: 'ord-new-city-2',       config: { settType: 'city',       culture: 'germanic', tradeRouteAccess: 'road' } },
    { seed: 'ord-new-metropolis-71', config: { settType: 'metropolis', culture: 'germanic', tradeRouteAccess: 'road' } },
  ];

  it('known seeds still produce faction_boost institutions (full catalog defs, traced)', () => {
    let sawAny = false;
    // Every pinned case runs: `sawAny` below only says SOME case pulled, so a per-case
    // regression must report its own true count rather than stopping at the first.
    const failures = collectSeedFailures(FB_CASES, ({ seed, config }) => {
      const s = gen(config, seed);
      const pulled = s.institutions.filter(i => i.source === 'faction_boost');
      if (pulled.length === 0) return;
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
    });
    expectNoSeedFailures(failures, 'pinned seeds produce fully-formed faction_boost institutions');
    expect(sawAny, 'none of the pinned seeds produced a faction_boost — refresh FB_CASES').toBe(true);
  });

  it('the dossier economy is derived from the FINAL roster (pull included)', () => {
    const failures = collectSeedFailures(FB_CASES, ({ seed, config }) => {
      const s = gen(config, seed);
      if (!s.institutions.some(i => i.source === 'faction_boost')) return;
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
    });
    expectNoSeedFailures(failures, 'the dossier economy is derived from the FINAL roster');
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
    // Run all six: "across the seeds that previously pulled religious institutions"
    // is a claim about the whole set, so a partial breakage must report its true size.
    const failures = collectSeedFailures(
      ['ord-1', 'ord-2', 'ord-6', 'ord-8', 'ord-9', 'ord-14'],
      (seed) => {
        const s = gen({
          settType: 'town', culture: 'germanic', tradeRouteAccess: 'road',
          _institutionToggles: toggles,
        }, seed);
        const resurrections = s.institutions.filter(i =>
          i.source === 'faction_boost' && excluded.includes(i.name));
        expect(resurrections, `${seed} resurrected ${resurrections.map(r => r.name).join(', ')}`)
          .toEqual([]);
      },
    );
    expectNoSeedFailures(failures, 'a force-excluded institution is never resurrected by a faction pull');
  });
});

// ── 2. The structural receipt describes the FINAL roster ────────────────────

describe('structural receipt describes the final roster', () => {
  const CONFIGS = [
    { settType: 'town', culture: 'germanic', tradeRouteAccess: 'road' },
    { settType: 'city', culture: 'germanic', tradeRouteAccess: 'road' },
  ];

  it('matches a fresh validation of the final institutions (receipt is not stale)', () => {
    // All 16 (config, index) pairs run. A receipt that goes stale on one tier must
    // report its OWN true count: under the bare loop a 9-of-16 staleness and a
    // 1-of-16 staleness both reported "1 failure", and the seeds after the first
    // casualty never ran at all.
    const CASES = CONFIGS.flatMap(config => Array.from(
      { length: 8 },
      (_, i) => ({ config, seed: `receipt-${config.settType}-${i}` }),
    ));
    const failures = collectSeedFailures(CASES, ({ config, seed }) => {
      const s = gen(config, seed);
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
      expect(receipt, `${seed}: receipt disagrees with a fresh validation of the final roster`).toEqual(expected);
    });
    expectNoSeedFailures(failures, 'the structural receipt matches a fresh validation of the final roster');
  });

  it('no presence-implying violation references an institution missing from the roster', () => {
    // These violation types assert facts ABOUT a listed institution — under
    // the old ordering they could reference institutions that subsumption /
    // cascade / isolation later removed.
    const PRESENCE_TYPES = new Set([
      'tier_violation', 'dependency_violation', 'exclusion_violation',
      'context_warning', 'out_of_tier',
    ]);
    // All 20 (config, index) pairs run, so the report says how many of the corpus
    // carry a dangling reference rather than naming only the first.
    const CASES = CONFIGS.flatMap(config => Array.from(
      { length: 10 },
      (_, i) => ({ config, seed: `receipt-presence-${config.settType}-${i}` }),
    ));
    const failures = collectSeedFailures(CASES, ({ config, seed }) => {
      const s = gen(config, seed);
      const names = new Set(s.institutions.map(inst => inst.name));
      for (const v of s.structuralViolations || []) {
        if (!PRESENCE_TYPES.has(v.type)) continue;
        // exclusion_violation joins names with ' / ' for exclusivity groups
        const referenced = v.type === 'exclusivity_violation'
          ? v.conflicting || []
          : [v.institution];
        for (const name of referenced) {
          expect(names.has(name),
            `${v.type} references "${name}" which is not on the final roster (seed ${seed})`,
          ).toBe(true);
        }
      }
    });
    expectNoSeedFailures(failures, 'no presence-implying violation references an off-roster institution');
  });
});

// ── 3. Stress confirm — institutions modulate emergent stress ───────────────

describe('stressConfirmPass — walls suppress sieges, forced stress survives', () => {
  const SIEGEY = t => t === 'under_siege' || t === 'monster_pressure' || t === 'occupied';

  it('a walled town suppresses sieges measurably vs an unwalled one (120 paired seeds)', () => {
    const N = 120;
    const unwalledFloor = envelope('ordering.siegeSuppression.unwalledFloor', N);
    const walledCeiling = envelope('ordering.siegeSuppression.walledCeiling', N);
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
    // seed-loop: collected — this loop ASSERTS NOTHING. It only accumulates counts,
    // and every assertion happens once below over the whole 120-seed corpus, so it
    // cannot early-exit and its numbers are already totals rather than lower bounds.
    // (subsetViolations is itself the truthful-totality idiom, hand-rolled.)
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

    // The unwalled baseline must produce enough sieges for the comparison to mean
    // anything. DERIVED, not hand-picked: 62/400 of these seeds carry a siege-family
    // stress type, so 120 of them centre on 18.6 with sigma 3.96, and the floor sits
    // 2.17 sigma below that. (The live 10 is kept over the alpha-1e-3 derivation of 6,
    // which is looser — program law; the loosening is filed for the owner.)
    expect(unwalledSieges, `unwalled baseline below the derived floor (measured 21 here)`)
      .toBeGreaterThanOrEqual(unwalledFloor.bound);
    // Per-seed subset property: walls only ever REMOVE sieges.
    expect(subsetViolations).toBe(0);
    // Measurable suppression, RELATIVE (empirically 6 vs 21 — ~71% suppressed,
    // consistent with the 0.42 keep probability).
    expect(walledSieges).toBeLessThanOrEqual(Math.floor(unwalledSieges * 0.7));
    // ...and ABSOLUTE. The ratio above is blind to BOTH arms inflating together; this
    // envelope is blind to a suppression collapse that scales both. They red on
    // different worlds, so the file keeps both.
    expect(walledSieges, `walled arm above the derived ceiling (measured 6 here)`)
      .toBeLessThanOrEqual(walledCeiling.bound);
    // 240 full pipeline generations. Clean cost is ~8 s, but that is only 2.5x under
    // vitest's 20 s default, and this tree routinely carries concurrent suites — a
    // measured run at load average 90 took 33 s and timed out on a green assertion.
    // Explicit timeout per the EP-2D corpus-test precedent (house 60_000); this changes
    // no assertion, it only removes a false-red source.
  }, 60_000);

  it('user-forced stress (Mode 0 stressTypes) always survives, even fully suppressed', () => {
    // "ALWAYS survives" is a claim about every seed, so a partial breakage must
    // report its true size instead of dying on the first one.
    const failures = collectSeedFailures(
      Array.from({ length: 10 }, (_, i) => `forced-siege-${i}`),
      (seed) => {
        const s = gen({
          settType: 'town', culture: 'germanic', tradeRouteAccess: 'road',
          monsterThreat: 'heartland',                  // ×0.3 — maximally hostile to siege
          stressTypes: ['under_siege'],
          _institutionToggles: {
            'town::Defense::Town walls': { allow: true, require: true },
            'town::Defense::Garrison':   { allow: true, require: true },
          },
        }, seed);
        expect(s.config.stressTypes).toContain('under_siege');
        const stressors = Array.isArray(s.stressors) ? s.stressors : s.stressors ? [s.stressors] : [];
        expect(stressors.some(st => st?.type === 'under_siege')).toBe(true);
      },
    );
    expectNoSeedFailures(failures, 'user-forced stress survives the confirm pass on every seed');
  });

  it('user-selected pool stress (Mode 2 selectedStresses) always survives', () => {
    const failures = collectSeedFailures(
      Array.from({ length: 10 }, (_, i) => `forced-famine-${i}`),
      (seed) => {
        const s = gen({
          settType: 'village', culture: 'germanic', tradeRouteAccess: 'road',
          selectedStressesRandom: false,
          selectedStresses: ['famine'],
          _institutionToggles: {
            'village::Essential::Town granary': { allow: true, require: true },
          },
        }, seed);
        expect(s.config.stressTypes).toContain('famine');
        const stressors = Array.isArray(s.stressors) ? s.stressors : s.stressors ? [s.stressors] : [];
        expect(stressors.some(st => st?.type === 'famine')).toBe(true);
      },
    );
    expectNoSeedFailures(failures, 'user-selected pool stress survives the confirm pass on every seed');
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
