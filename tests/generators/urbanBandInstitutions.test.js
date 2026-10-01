/**
 * THE URBAN BAND AT GENERATION (owner-approved 2026-09-30) — what the registry rebuild
 * changed about the settlements the engine actually produces, pinned over fixed seeds.
 *
 *   G1  THE WEIGHTED EXCLUSIVE GROUP: a group's seat goes to a member in proportion to its
 *       chance, not to whichever member the catalog lists first. Before: 'City
 *       administration' (0.92) governed 1 city in 100, and 'Royal seat', 'Democratic
 *       assembly' and 'City-state government' governed none of 200.
 *   G2  THE ROW GUARDS: a stated population floor and a named prerequisite hold at
 *       generation. Before: 'Cathedral (10,000+ only)' stood in 14 of 58 cathedral cities
 *       under 10,000; 'Gates (if walled)' stood without walls in 46 of 123 towns.
 *   G3  THE CUMULATIVE LAWS AT GENERATION: a town function exists in cities and
 *       metropolises; a metropolis carries its own scale rows and never a city's beside them.
 *       Before: Beast trainers appeared in no metropolis; 191 of 200 metropolises listed
 *       'Parish churches (10-30)' beside '(50-100+)'; 'Massive walls and fortifications' could
 *       never generate (0 of 200).
 *   G4  NO ROLLED ROW IS DELETED AS UNSUPPORTED: the dependency table agrees with the tiers
 *       the registry rolls at. Before: town Citadel and town Printing house were deleted by
 *       the coherence pass every time they were rolled.
 *   G5  A MAGIC-FREE WORLD CERTIFIES ITS OWN LAW: once the gates read the declared licence
 *       (MF-CH2B), the faith rows licensed `none` (Druid Circle, Elder Grove Council, Warden's
 *       Lodge) enter magic-free worlds, and the world law's own receipt must not convict them.
 *       Measured on the combined tip before J20/J21: 25 of 40 magic-free cities failed
 *       `world_law_magic` on those rows' descriptions, and 19 of 40 villages on the name
 *       'Druid Circle' alone (0 of 40 at base, where the Magic shelf struck them).
 *
 * Seeds are fixed, so every arm is deterministic: it passes or fails the same way on
 * every run.
 */
import { describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const ROUTES = ['road', 'port', 'river', 'crossroads', 'isolated'];
const cache = new Map();
function settlements(tier, count) {
  const key = `${tier}:${count}`;
  if (!cache.has(key)) {
    const out = [];
    for (let i = 0; i < count; i++) {
      out.push(generateSettlementPipeline(
        { settType: tier, tradeRouteAccess: ROUTES[i % ROUTES.length] },
        null,
        { seed: `urban-band-${tier}-${i}`, customContent: {} },
      ));
    }
    cache.set(key, out);
  }
  return cache.get(key);
}
const names = (s) => new Set((s.institutions || []).map(i => i.name));

describe('G1 — the weighted exclusive group', () => {
  it('every city government form governs some city, and none governs most of them', () => {
    const forms = ['Mayor and council', 'Guild consortium', 'Noble governor', 'Merchant oligarchy',
      'City-state government', 'Democratic assembly', 'Royal seat', 'City administration'];
    const tally = Object.fromEntries(forms.map(f => [f, 0]));
    const cities = settlements('city', 120);
    for (const s of cities) for (const f of forms) if (names(s).has(f)) tally[f]++;
    for (const f of forms) expect(tally[f], `${f} governs at least one of 120 cities`).toBeGreaterThan(0);
    const top = Math.max(...Object.values(tally));
    expect(top, `no single form governs half of 120 cities (${JSON.stringify(tally)})`).toBeLessThan(60);
  });

  it('a group still seats at most one member', () => {
    for (const s of settlements('city', 120)) {
      const govs = (s.institutions || []).filter(i => i.exclusiveGroup === 'government');
      expect(govs.length, `${s.name}: government seats`).toBeLessThanOrEqual(1);
    }
  });
});

describe('G2 — the row guards hold at generation', () => {
  it('no cathedral stands in a city under 10,000, and cathedral cities exist', () => {
    const cities = settlements('city', 120);
    const withCathedral = cities.filter(s => names(s).has('Cathedral (10,000+ only)'));
    expect(withCathedral.length, 'anti-vacuity').toBeGreaterThan(0);
    for (const s of withCathedral) expect(s.population, s.name).toBeGreaterThanOrEqual(10000);
  });

  it('no town has gates without walls, and gated towns exist', () => {
    const towns = settlements('town', 80);
    const gated = towns.filter(s => names(s).has('Gates (if walled)'));
    expect(gated.length, 'anti-vacuity').toBeGreaterThan(0);
    for (const s of gated) expect(names(s).has('Town walls'), s.name).toBe(true);
  });

  it('no post relay station stands without a coaching inn, and relay stations exist', () => {
    const all = [...settlements('town', 80), ...settlements('city', 120)];
    const relays = all.filter(s => names(s).has('Post relay station'));
    expect(relays.length, 'anti-vacuity').toBeGreaterThan(0);
    for (const s of relays) expect(names(s).has('Coaching inn'), s.name).toBe(true);
  });
});

describe('G3 — the cumulative laws at generation', () => {
  it('Beast trainers is rolled natively in towns, cities and metropolises', () => {
    for (const [tier, count] of [['town', 80], ['city', 120], ['metropolis', 60]]) {
      const native = settlements(tier, count)
        .filter(s => (s.institutions || []).some(i => i.name === 'Beast trainers' && i.source === 'generated'));
      expect(native.length, `${tier}: native Beast trainers`).toBeGreaterThan(0);
    }
  });

  it('a metropolis carries its own scale rows and never a city\'s beside them', () => {
    const metros = settlements('metropolis', 60);
    for (const s of metros) {
      const n = names(s);
      expect(n.has('Parish churches (10-30)') && n.has('Parish churches (50-100+)'), `${s.name}: both parish scales`).toBe(false);
      expect(n.has('Housing (1000-5000 structures)'), `${s.name}: city housing`).toBe(false);
      expect(n.has('Housing (5000+ structures)'), `${s.name}: metropolis housing`).toBe(true);
      expect(n.has('Massive walls and fortifications'), `${s.name}: metropolis walls`).toBe(true);
    }
  });

  it('a city is larger than a town, and a metropolis larger than a city, in institutions', () => {
    const mean = (xs) => xs.reduce((a, s) => a + (s.institutions || []).length, 0) / xs.length;
    const town = mean(settlements('town', 80));
    const city = mean(settlements('city', 120));
    const metro = mean(settlements('metropolis', 60));
    expect(city, `city ${city} > town ${town}`).toBeGreaterThan(town);
    expect(metro, `metropolis ${metro} > city ${city}`).toBeGreaterThan(city);
  });
});

describe('G4 — no rolled row is deleted as unsupported', () => {
  it('the coherence pass removes no catalog row for a missing dependency at any urban tier', () => {
    const removed = [];
    for (const [tier, count] of [['town', 80], ['city', 120], ['metropolis', 60]]) {
      for (const s of settlements(tier, count)) {
        for (const t of s.simulationTrace || []) {
          if (t.step === 'coherenceRepairPass' && t.result === 'removed'
            && (t.causes || []).some(c => c.source === 'coherence.unsupported_institution')) {
            removed.push(`${tier}/${s.name}: ${t.targetId}`);
          }
        }
      }
    }
    expect(removed).toEqual([]);
  });
});

describe('G5 — a magic-free world certifies its own world-law magic check', () => {
  it('no magic-free settlement fails world_law_magic, at any tier, and the druid rows do appear', () => {
    const failed = [];
    let druidRows = 0;
    for (const tier of ['hamlet', 'village', 'town', 'city', 'metropolis']) {
      for (let i = 0; i < 12; i++) {
        const s = generateSettlementPipeline(
          { settType: tier, culture: 'celtic', terrainOverride: 'forest', tradeRouteAccess: 'isolated',
            magicExists: false, priorityMagic: 100, priorityReligion: 90 },
          null,
          { seed: `urban-band-nomagic-${tier}-${i}`, customContent: {} },
        );
        const check = (s.generationCoherenceReceipt?.checks || []).find(k => k.id === 'world_law_magic');
        if (!check) failed.push(`${tier}-${i}: no world_law_magic check ran`);
        else if (check.status !== 'pass') failed.push(`${tier}-${i}: ${check.status} ${JSON.stringify((check.findings || [])[0] || {}).slice(0, 140)}`);
        druidRows += (s.institutions || []).filter(r => /^(Druid Circle|Elder Grove Council|Warden's Lodge)$/.test(r.name)).length;
      }
    }
    expect(druidRows, 'no faith row entered a magic-free world, so the certification proves nothing about them').toBeGreaterThan(5);
    expect(failed).toEqual([]);
  });
});
