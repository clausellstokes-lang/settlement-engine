/**
 * composeInstantWorld pins (W-R2 INSTANT WORLD).
 *
 * Proves the composer's four commissioned invariants without a browser or the
 * store: DETERMINISM (same-seed fingerprint + byte-identity under injected
 * ids/clock), COMPOSITION-EQUIVALENCE (state-shape of a manual realm at t=0
 * pre-canonize), COHERENCE (dossier trust gate + sound membership), TIER-BLIND
 * (the composer never reads auth/tier), and the appropriate-N mapping.
 */
import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { composeInstantWorld, instantWorldFingerprint } from '../../../src/lib/instantWorld/composeInstantWorld.js';
import { REALM_SIZES, MAP_KINDS, TONES, deriveWorldPlan } from '../../../src/domain/instantWorld/worldPlan.js';
import { isCanonSave } from '../../../src/domain/campaign/canon.js';
import { validateDossier } from '../../../src/domain/validation/consistency.js';

// Deterministic id + clock injectors for byte-identity checks.
function fixedFactories() {
  let n = 0;
  return {
    idFactory: () => `id-${n++}`,
    clock: () => '2026-07-16T00:00:00.000Z',
  };
}

describe('composeInstantWorld — determinism', () => {
  test('same seed + knobs → identical structural fingerprint', () => {
    const args = { seed: 'realm-alpha', basicConfig: { realmSize: 'small', tone: 'realistic_regional', mapKind: 'highIsland' } };
    const a = composeInstantWorld(args);
    const b = composeInstantWorld(args);
    expect(a.fingerprint).toEqual(b.fingerprint);
    expect(a.fingerprint).toEqual(instantWorldFingerprint(a));
  });

  test('with injected id + clock, the whole bundle is byte-identical', () => {
    const args = { seed: 'realm-beta', basicConfig: { realmSize: 'small' } };
    const a = composeInstantWorld({ ...args, ...fixedFactories() });
    const b = composeInstantWorld({ ...args, ...fixedFactories() });
    expect(JSON.stringify(a.campaign)).toEqual(JSON.stringify(b.campaign));
    expect(JSON.stringify(a.settlements)).toEqual(JSON.stringify(b.settlements));
  });

  test('a different seed changes the fingerprint', () => {
    const base = { basicConfig: { realmSize: 'small' } };
    const a = composeInstantWorld({ seed: 'seed-1', ...base });
    const b = composeInstantWorld({ seed: 'seed-2', ...base });
    expect(a.fingerprint).not.toEqual(b.fingerprint);
  });

  test('"Random island" resolves to a concrete, stable template from the seed', () => {
    const p1 = deriveWorldPlan({ seed: 'map-seed', basicConfig: { mapKind: '' } });
    const p2 = deriveWorldPlan({ seed: 'map-seed', basicConfig: { mapKind: '' } });
    expect(p1.mapKind).toBe(p2.mapKind);
    expect(p1.mapKind).not.toBe('');
    expect(MAP_KINDS.some(k => k.id === p1.mapKind)).toBe(true);
  });
});

describe('composeInstantWorld — appropriate-N mapping (tier-mixed)', () => {
  test.each([['small', 5], ['medium', 9], ['large', 14]])('%s realm → %i settlements', (realmSize, n) => {
    const { settlements, campaign } = composeInstantWorld({ seed: `n-${realmSize}`, basicConfig: { realmSize } });
    expect(settlements).toHaveLength(n);
    expect(campaign.settlementIds).toHaveLength(n);
    // The tier list is genuinely tier-MIXED (spans >1 distinct tier) and matches
    // the authored realm mix.
    const tiers = settlements.map(s => s._slot).sort((a, b) => a - b).map(slot => REALM_SIZES[realmSize].tiers[slot]);
    expect(new Set(tiers).size).toBeGreaterThan(1);
  });
});

describe('composeInstantWorld — composition-equivalence (manual pre-canonize shape)', () => {
  const { campaign, settlements } = composeInstantWorld({ seed: 'shape', basicConfig: { realmSize: 'small', tone: 'dramatic_campaign' } });

  test('lands the user IN an active campaign holding its members', () => {
    expect(campaign.id).toBeTruthy();
    expect(campaign.accessState).toBe('active');
    expect(campaign.settlementIds).toEqual(settlements.map(s => s.id));
  });

  test('members are CANON saves (the manual placement + membership prerequisite)', () => {
    for (const s of settlements) expect(isCanonSave(s)).toBe(true);
  });

  test('the realm is a v2 map with placements + a map plan, no fmg snapshot', () => {
    const ms = campaign.mapState;
    expect(ms.schemaVersion).toBe(2);
    expect(ms.fmgSnapshot).toBeNull();
    expect(ms.seed).toBeTruthy();
    expect(ms.mapKind).toBeTruthy();
    expect(ms.pendingMapGen).toBe(true);
    expect(Object.keys(ms.placements)).toHaveLength(settlements.length);
    for (const [, p] of Object.entries(ms.placements)) {
      expect(settlements.some(s => s.id === p.settlementId)).toBe(true);
    }
  });

  test('the realm carries a discovered regionalGraph', () => {
    expect(campaign.regionalGraph).toBeTruthy();
    expect(Array.isArray(campaign.regionalGraph.channels)).toBe(true);
  });

  test('the worldState is NOT spatially canonized — canonization stays the user\'s act', () => {
    expect(campaign.worldState.spatialCanonVersion || 0).toBe(0);
    expect(campaign.worldState.spatialDigest == null).toBe(true);
    expect(campaign.worldState.canonizedAt == null).toBe(true);
  });

  test('the tone knob applied the existing simulation preset', () => {
    expect(TONES.some(t => t.id === 'dramatic_campaign')).toBe(true);
    expect(campaign.worldState.simulationRules.presetId).toBe('dramatic_campaign');
  });
});

describe('composeInstantWorld — coherence (dossier trust gate + sound membership)', () => {
  const { settlements, campaign } = composeInstantWorld({ seed: 'coherence', basicConfig: { realmSize: 'medium' } });

  test('every minted member passes the dossier trust gate (no blocking contradictions)', () => {
    for (const s of settlements) {
      const { blocking } = validateDossier(s.settlement);
      expect(blocking).toHaveLength(0);
    }
  });

  test('membership is sound — every settlementId resolves to exactly one member save', () => {
    for (const id of campaign.settlementIds) {
      const matches = settlements.filter(s => s.id === id);
      expect(matches).toHaveLength(1);
    }
    // no orphan placements
    for (const [, p] of Object.entries(campaign.mapState.placements)) {
      expect(campaign.settlementIds).toContain(p.settlementId);
    }
  });
});

describe('composeInstantWorld — tier-blind', () => {
  test('composes with no auth/tier context whatsoever', () => {
    // The signature has no auth/tier param; a bundle is produced regardless.
    const { settlements } = composeInstantWorld({ seed: 'blind', basicConfig: { realmSize: 'small' } });
    expect(settlements.length).toBe(5);
  });

  test('the composer + plan source NEVER reach the auth/entitlement API', () => {
    // Targets the store's entitlement surface — NOT the settlement `.tier` domain
    // vocabulary (a settlement tier is legitimate; auth tier is what must never
    // reach the composer).
    const forbidden = /\bisPremium\b|\bisElevated\b|\bcanManageCampaigns\b|\bentitle(d|ment)?\b|\bpremium\b|auth\??\.(tier|role)|s\.auth\b|state\.auth\b/;
    for (const rel of ['../../../src/lib/instantWorld/composeInstantWorld.js', '../../../src/domain/instantWorld/worldPlan.js']) {
      const src = readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');
      // Strip comments so prose ("tier-blind", "premium gate") doesn't trip the scan.
      const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
      expect(code).not.toMatch(forbidden);
    }
  });
});
