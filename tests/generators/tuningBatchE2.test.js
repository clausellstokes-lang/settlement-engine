/**
 * tuningBatchE2.test.js — the generation-tuning batch (dossier E2) behaves.
 *
 *  5. Provisioning at scale: a metropolis/city NEVER reports zero economic
 *     dependencies (72.5% of metropolises used to), and hasImportProcessor
 *     broadens its needles at city+ ('City granaries', 'Specialized
 *     metalworkers' now count as processors).
 *  6. legitimacyDefScale: assembleSettlement's real-readiness legitimacy patch
 *     applies the SAME tier scale computePublicLegitimacy used — small tiers
 *     are no longer stamped with spurious legitimacy crises by an unscaled
 *     defense delta.
 *  7. factionRoles influence: structural NPCs carry BAND STRINGS
 *     ('high'/'moderate'/'low'), the vocabulary every consumer compares against
 *     (numeric 75/50/25 silently failed all of them).
 *  1. FACTION_DESCRIPTORS carries crafts/noble pools so those categories stop
 *     falling through to 'The Independent Bloc'.
 *  2. Stress types carry NO icon slot at all — the dead-slot class, closed by
 *     Lane IC's icon sweep (d9a1ea5a), must never return. See E2.2 below for
 *     why this is the post-sweep invariant and why it is stronger than the
 *     "icon is exactly empty" assertion it replaced.
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { hasImportProcessor, appendProvisioningAtScaleDeps } from '../../src/generators/economy/foodBalance.js';
import { legitimacyDefScale, DEFENSE_CONTRIB } from '../../src/generators/factionDynamics.js';
import { ensureFactionStructuralNpcs } from '../../src/generators/factionRoles.js';
import { FACTION_DESCRIPTORS } from '../../src/data/powerData.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';

const gen = (cfg, seed) => generateSettlementPipeline(cfg, null, { seed, customContent: {} });

describe('E2.5 — provisioning at scale', () => {
  it('a metropolis always reports at least one economic dependency (never a false zero)', () => {
    for (let i = 0; i < 6; i++) {
      const s = gen({ settType: 'metropolis', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road' }, `prov-${i}`);
      // DEPENDENCY-severity warnings are re-bucketed into .dependencies.
      const deps = s.economicViability?.dependencies || [];
      expect(deps.length, `metropolis seed ${i} reported ZERO dependencies`).toBeGreaterThan(0);
    }
  });

  it('hasImportProcessor broadens needles at city+ only', () => {
    const granaries = [{ name: 'City granaries' }];
    expect(hasImportProcessor(granaries, 'grain', { tier: 'city' })).toBe(true);
    expect(hasImportProcessor(granaries, 'grain', { tier: 'town' })).toBe(false);
    const metalworkers = [{ name: 'Specialized metalworkers' }];
    expect(hasImportProcessor(metalworkers, 'metals', { tier: 'metropolis' })).toBe(true);
    expect(hasImportProcessor(metalworkers, 'metals', { tier: 'village' })).toBe(false);
    // Sawmill exclusion holds at every tier.
    expect(hasImportProcessor([{ name: 'Sawmill' }], 'grain', { tier: 'city' })).toBe(false);
  });

  it('appendProvisioningAtScaleDeps is city+ only and never double-counts a grain dep', () => {
    const small = [];
    appendProvisioningAtScaleDeps(small, { tier: 'village' });
    expect(small).toHaveLength(0);

    const city = [];
    appendProvisioningAtScaleDeps(city, { tier: 'city' }, { deficitPercent: 0 });
    expect(city.some((w) => /staple food/i.test(w.title))).toBe(true);
    expect(city.some((w) => /bulk materials/i.test(w.title))).toBe(true);

    // A deficit already owns the grain import — the staple baseline must not stack.
    const stressed = [];
    appendProvisioningAtScaleDeps(stressed, { tier: 'city' }, { deficitPercent: 20 });
    expect(stressed.some((w) => /staple food/i.test(w.title))).toBe(false);
    expect(stressed.some((w) => /bulk materials/i.test(w.title))).toBe(true);

    // Metropolis adds the finished-goods line above the city set.
    const metro = [];
    appendProvisioningAtScaleDeps(metro, { tier: 'metropolis' }, { deficitPercent: 0 });
    expect(metro.length).toBeGreaterThan(city.length);
  });
});

describe('E2.6 — legitimacy defense patch is tier-scaled', () => {
  it('legitimacyDefScale matches the computePublicLegitimacy ladder', () => {
    expect(legitimacyDefScale('thorp')).toBe(0.3);
    expect(legitimacyDefScale('hamlet')).toBe(0.4);
    expect(legitimacyDefScale('village')).toBe(0.6);
    expect(legitimacyDefScale('town')).toBe(0.85);
    expect(legitimacyDefScale('city')).toBe(1.0);
    expect(legitimacyDefScale('metropolis')).toBe(1.0);
  });

  it('a generated thorp/hamlet legitimacy defense contribution is the SCALED value', () => {
    // The patch writes breakdown.defense = round(DEFENSE_CONTRIB[label] * scale);
    // the unscaled patch wrote the full band value (e.g. -5 on a Vulnerable thorp,
    // where the scaled truth is round(-5 * 0.3) = -2).
    for (const tier of ['thorp', 'hamlet']) {
      for (let i = 0; i < 5; i++) {
        const s = gen({ settType: tier, culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road' }, `legit-${tier}-${i}`);
        const leg = s.powerStructure?.publicLegitimacy;
        const label = s.defenseProfile?.readiness?.label;
        if (!leg?.breakdown || !label || !(label in DEFENSE_CONTRIB)) continue;
        const expected = Math.round((DEFENSE_CONTRIB[label] ?? 0) * legitimacyDefScale(tier));
        expect(leg.breakdown.defense, `${tier} seed ${i} (${label})`).toBe(expected);
      }
    }
  });
});

describe('E2.7 — structural NPC influence is a band string', () => {
  it('ensureFactionStructuralNPCs emits high/moderate/low, never numbers', () => {
    const settlement = {
      tier: 'town',
      institutions: [],
      npcs: [],
      powerStructure: {
        factions: [
          { faction: 'Merchant League', category: 'economy', power: 40, isGoverning: true },
        ],
      },
    };
    const out = ensureFactionStructuralNpcs(settlement);
    const structural = (out.npcs || []).filter((n) => n.generatedAs === 'faction_structural');
    expect(structural.length).toBeGreaterThan(0);
    for (const n of structural) {
      expect(['high', 'moderate', 'low']).toContain(n.influence);
    }
  });
});

describe('E2.1 — faction descriptor pools cover crafts and noble', () => {
  it('crafts and noble categories no longer fall through to the "other" pool', () => {
    expect(FACTION_DESCRIPTORS.crafts?.length).toBeGreaterThan(0);
    expect(FACTION_DESCRIPTORS.noble?.length).toBeGreaterThan(0);
  });
});

describe('E2.2 — stress-type icon contract: the dead slot must never return', () => {
  // THE POST-SWEEP INVARIANT, and it is STRICTLY STRONGER than what stood here.
  //
  // This block used to assert `st.icon === ''` — that every stress type still
  // carried an icon slot, holding the empty string. That assertion was itself the
  // residue of an earlier mechanical emoji strip: the glyphs were removed and the
  // KEYS were left behind, so every stress row in the dossier went on laying out
  // an invisible span beside it, eating a flex gap, for as long as the slots
  // existed. The old test froze that defect in place as if it were the contract.
  //
  // Lane IC's icon sweep (d9a1ea5a, 2026-08-03) deleted the slots themselves —
  // 15 of them in src/data/stressTypes.js, part of 94 dead slots found across
  // src/data, src/domain and src/generators — under the owner's icon directive of
  // 2026-08-03 (clarified): remove ALL icons of any kind that are not logos,
  // EXCEPT the icon on the AI Surveyor prompt. Stress types are not logos and are
  // not the Surveyor prompt, so the slot is gone for good. `st.icon` is therefore
  // `undefined` rather than `''`, and the old assertion went red for the RIGHT
  // reason — it was reporting the fix, not a regression.
  //
  // Relaxing it to `toBeUndefined()` would have been the weak repair: an
  // explicitly reintroduced `icon: undefined` field would satisfy it while
  // restoring exactly the phantom column the sweep removed. We assert ABSENCE OF
  // THE KEY instead, which is the property the sweep actually established and the
  // one the row layout depends on.
  //
  // Spelled over /icon/i rather than the literal 'icon' alone because this
  // dead-slot class has a camelCase sibling that has already bitten once —
  // `resourceIcon`/`needIcon` in supplyChainData.js were part of the same 94 — and
  // a guard that names only one spelling invites the other spelling back.
  const ICON_KEY = /icon/i;
  const entries = Object.entries(STRESS_TYPE_MAP);

  it('the map is non-empty and every entry is an object (anti-vacuity)', () => {
    // An absence assertion over an empty collection proves nothing. This row is
    // the independent denominator: a zero-entry map can no longer green E2.2.
    expect(entries.length).toBeGreaterThan(0);
    for (const [key, st] of entries) {
      expect(Boolean(st) && typeof st === 'object', `stress ${key} is not an object`).toBe(true);
    }
  });

  it('no stress type carries an icon key of ANY spelling', () => {
    const offenders = [];
    for (const [key, st] of entries) {
      for (const field of Object.keys(st)) {
        if (ICON_KEY.test(field)) offenders.push(`${key}.${field}`);
      }
    }
    expect(offenders, `dead icon slot(s) reintroduced: ${offenders.join(', ')}`).toEqual([]);
  });

  it("the literal 'icon' key is absent — not merely empty — on every stress type", () => {
    for (const [key, st] of entries) {
      expect(
        Object.prototype.hasOwnProperty.call(st, 'icon'),
        `stress ${key} carries an 'icon' slot again — the phantom column is back`,
      ).toBe(false);
    }
  });

  it('NEGATIVE CONTROL: both detectors fire on a slot-bearing entry', () => {
    // Without this, a refactor that broke the key walk would leave the two rows
    // above green while guarding nothing at all.
    const planted = { label: 'Planted', colour: '#000', icon: '', resourceIcon: '' };
    expect(Object.keys(planted).filter((f) => ICON_KEY.test(f))).toEqual(['icon', 'resourceIcon']);
    expect(Object.prototype.hasOwnProperty.call(planted, 'icon')).toBe(true);
  });
});
