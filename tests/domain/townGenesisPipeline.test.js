/**
 * townGenesisPipeline.test.js — THE STAGED GENERATIVE PIPELINE (owner directives, #38).
 *
 * Site genesis (stage 0) → economic field (stage 1) → genesis core nucleated ON the
 * field (stage 2) → … → composition. Plus the latent-advantage map and the
 * alignment-driven reconciliation. These pins hold the owner's laws: SUBSTANCE from the
 * dossier / EXPRESSION from the seed; REALM-COHERENCE (no water invented in a dry
 * biome); the response mode ("or not" clause); and lawful↔chaotic reconciliation.
 */
import { describe, expect, it } from 'vitest';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

const V2 = { layoutLawVersion: 2 };
const stable = (v) => JSON.stringify(v);
const town = (over) => ({ ...makeTownFixture({ tier: over.tier || 'town', terrain: over.terrain || 'plains', walls: !!over.walls, water: !!over.water, seed: over.seed }), config: over.config, economicState: over.economicState });
const provEffects = (m) => { const s = new Set(); for (const k of Object.keys(m.provenance)) for (const e of m.provenance[k]) s.add(e.effect); return s; };
const latentRefs = (m) => m.latentAdvantages.map((l) => l.attractorRef).sort();

describe('pipeline — the staged artifacts exist and the core nucleates on the field', () => {
  it('every v2 model carries a generated siteKind + a response mode', () => {
    const m = buildTownMapModel(makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'stage' }), V2);
    expect(typeof m.meta.siteKind).toBe('string');
    expect(['exploit', 'endure', 'fortify']).toContain(m.meta.responseMode);
  });

  it('a strong economic field pulls the genesis core OFF the abstract center', () => {
    const rich = town({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'nucleate',
      config: { terrainType: 'coastal', tradeRouteAccess: 'port', biome: 'coast' },
      economicState: { prosperity: { label: 'wealthy' }, exports: ['cured leather', 'stone'] } });
    expect(buildTownMapModel(rich, V2).meta.coreNucleated).toBe(true);
  });
});

describe('site — SUBSTANCE from the dossier, never invented (realm-coherence)', () => {
  it('a fishery/river economy puts WATER on the map even inland', () => {
    const fish = town({ terrain: 'plains', seed: 'fish', config: { terrainType: 'plains', tradeRouteAccess: 'road', biome: 'plains' }, economicState: { prosperity: { label: 'modest' }, exports: ['smoked fish'] } });
    const m = buildTownMapModel(fish, V2);
    expect(m.frame.water).toBeTruthy();
  });

  it('a DRY biome with no water economy invents NO river (realm-coherence)', () => {
    const dry = town({ terrain: 'desert', seed: 'dry', config: { terrainType: 'desert', tradeRouteAccess: 'road', biome: 'desert' }, economicState: { prosperity: { label: 'modest' }, exports: ['salt', 'copper ore'] } });
    const m = buildTownMapModel(dry, V2);
    expect(m.frame.water).toBeNull();
    expect(['dunes', 'mountain-flank', 'plain']).toContain(m.meta.siteKind);
  });

  it('the SAME dry biome WITH a water economy is justified an oasis/river (coherence, not suppression)', () => {
    const oasis = town({ terrain: 'desert', seed: 'oasis', config: { terrainType: 'desert', tradeRouteAccess: 'road', biome: 'desert' }, economicState: { prosperity: { label: 'modest' }, exports: ['river fish', 'pearls'] } });
    expect(buildTownMapModel(oasis, V2).frame.water).toBeTruthy();
  });
});

describe('site — EXPRESSION from the seed (same substance, different geometry)', () => {
  const dossier = (seed) => town({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed,
    config: { terrainType: 'coastal', tradeRouteAccess: 'port', biome: 'coast' },
    economicState: { prosperity: { label: 'wealthy' }, exports: ['cured leather', 'stone'] } });

  it('two seeds of one dossier ⇒ the SAME site + attractor SET, DIFFERENT geometry', () => {
    const a = buildTownMapModel(dossier('exprA'), V2);
    const b = buildTownMapModel(dossier('exprB2'), V2);
    // SUBSTANCE is seed-invariant:
    expect(a.meta.siteKind).toBe(b.meta.siteKind);
    expect(latentRefs(a)).toEqual(latentRefs(b));
    // EXPRESSION varies (the water meander / the placement):
    expect(stable(a.frame.water) !== stable(b.frame.water) || stable(a.districts) !== stable(b.districts)).toBe(true);
  });
});

describe('the "or not" clause — response mode from character, recorded as provenance', () => {
  it('a walled, threatened town FORTIFIES', () => {
    const m = buildTownMapModel(town({ walls: true, seed: 'ft', config: { terrainType: 'plains', tradeRouteAccess: 'road', monsterThreat: 'frontier', biome: 'plains' } }), V2);
    expect(m.meta.responseMode).toBe('fortify');
    expect(provEffects(m).has('response-fortify')).toBe(true);
  });

  it('an unwalled harsh-site town ENDURES', () => {
    const m = buildTownMapModel(town({ tier: 'village', seed: 'ms', config: { terrainType: 'plains', tradeRouteAccess: 'road', biome: 'marsh' }, economicState: { prosperity: { label: 'poor' }, exports: ['peat', 'reeds'] } }), V2);
    expect(m.meta.responseMode).toBe('endure');
    expect(m.meta.siteKind).toBe('marsh');
  });
});

describe('the latent advantage map — declined attractors, retained at generation', () => {
  const fortDossier = town({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'latent',
    config: { terrainType: 'coastal', tradeRouteAccess: 'port', monsterThreat: 'frontier', biome: 'coast' },
    economicState: { prosperity: { label: 'wealthy' }, exports: ['cured leather', 'stone'] } });

  it('a FORTIFY town retains the trade advantages it declined', () => {
    const m = buildTownMapModel(fortDossier, V2);
    expect(m.meta.responseMode).toBe('fortify');
    expect(m.latentAdvantages.length).toBeGreaterThan(0);
    for (const l of m.latentAdvantages) {
      expect(l.declinedBy).toBe('fortify');
      expect(l.latentValue01).toBeGreaterThanOrEqual(0);
      expect(l.latentValue01).toBeLessThanOrEqual(1);
    }
  });

  it('the latent map is FABRIC-INDEPENDENT — present with fabric dark (generation-time)', () => {
    // fortDossier carries no urbanFabric mirror ⇒ fabric dark ⇒ founding form, yet the
    // latent map is still computed.
    const m = buildTownMapModel(fortDossier, V2);
    expect(m.meta.hasFabric).toBe(false);
    expect(m.latentAdvantages.length).toBeGreaterThan(0);
  });
});

describe('reconciliation — lawful vs chaotic, and the fortify-lawful doctrine hold', () => {
  const base = () => makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'recon' });
  const withFabric = (drift) => ({ ...base(), config: { terrainType: 'coastal', tradeRouteAccess: 'port', monsterThreat: 'frontier', biome: 'coast' }, urbanFabric: { drift, stocks: { merchant: 0.8, industrial: 0.6, residential: 0.5 }, scars: [], rebirths: [] } });

  it('dark fabric ⇒ the founding form persists (NO reconciliation applied)', () => {
    const dark = buildTownMapModel({ ...base(), config: { terrainType: 'coastal', tradeRouteAccess: 'port', monsterThreat: 'frontier', biome: 'coast' } }, V2);
    const effects = provEffects(dark);
    expect([...effects].some((e) => e.startsWith('reconcile'))).toBe(false);
  });

  it('lawful vs chaotic fabric ⇒ DISTINCT reconciliation families', () => {
    const lawful = buildTownMapModel(withFabric(0.15), V2);
    const chaotic = buildTownMapModel(withFabric(0.85), V2);
    expect(stable(lawful.districts)).not.toBe(stable(chaotic.districts));
    // chaotic GRABS (encroaches); lawful is planned/held
    expect([...provEffects(chaotic)].some((e) => e === 'reconcile-encroach')).toBe(true);
    expect([...provEffects(lawful)].some((e) => e === 'reconcile-planned' || e === 'reconcile-hold')).toBe(true);
  });

  it('a LAWFUL FORTIFY town does NOT drift toward the trade advantage it declined (doctrine held)', () => {
    const lawfulFortify = buildTownMapModel(withFabric(0.15), V2);
    expect(lawfulFortify.meta.responseMode).toBe('fortify');
    const effects = provEffects(lawfulFortify);
    // it HOLDS its doctrine rather than encroaching toward the declined harbor/market
    expect(effects.has('reconcile-hold')).toBe(true);
    expect(effects.has('reconcile-encroach')).toBe(false);
  });
});
