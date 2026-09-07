/**
 * upswingRecoverySoak.test.js — W-UPSWING §4 THE ACCEPTANCE TEST (kept verbatim):
 * "an 8-settlement realm ... shows a RECEIPTED RECOVERY ARC without owner intervention —
 * the upswing counterpart of the war-ends-endogenously certification."
 *
 * An 8-settlement realm, two of them freshly devastated (a recent calamity stamp), is
 * driven through the REAL pulse with the upswing arcs lit and NO owner intervention. The
 * certification: the reconstruction arc arms, advances on the realm's own prosperity +
 * builders + peace + its allies' investment, and COMPLETES with a permanent chronicle
 * beat + a legitimacy dividend — an emergent recovery the movers produced themselves.
 * Conservation holds throughout (population + legitimacy stay bounded, no NaN, no crash).
 */
import { describe, it, expect } from 'vitest';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['ashford', 'briar', 'crown', 'dunmoor', 'elderford', 'fenwick', 'greenhollow', 'hearth'];

/** A town; `struck` ones carry a recent calamity stamp so reconstruction arms. */
function town(name, { struck = false, rich = false } = {}) {
  return {
    name, tier: rich ? 'city' : 'town', population: rich ? 5200 : 1600,
    config: { tradeRouteAccess: 'road', economicBase: 'agrarian' },
    institutions: [
      { name: 'Town hall', required: true, category: 'civic' },
      { name: 'Carpenter', category: 'crafts' },
      { name: 'Mason', category: 'crafts' },
      { name: 'Market', category: 'trade' },
      ...(rich ? [{ name: "Wizard's tower", category: 'magic' }] : []),
    ],
    economicState: { prosperity: rich ? 'Prosperous' : 'Comfortable', primaryExports: ['Grain'], primaryImports: [] },
    powerStructure: { publicLegitimacy: { score: 55, label: 'Contested' }, factions: [{ faction: 'Council', category: 'civic', power: 55 }], conflicts: [] },
    ...(struck ? { calamityHistory: [{ type: 'fire', name: `The Great Calamity of ${name}, year 9`, year: 9, tick: 468, deaths: 120, exodus: 260, k: 2, targets: ['Tannery', 'Granary'] }] } : { calamityHistory: [] }),
    npcs: [{ id: `steward_${name}`, name: `Steward ${name}`, importance: 'key' }],
    activeConditions: [],
  };
}

function makeRealm(seed) {
  const saves = IDS.map((id, i) => ({
    id, name: id.charAt(0).toUpperCase() + id.slice(1), phase: 'canon',
    settlement: town(id, { struck: i < 2, rich: i === 2 }),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  }));
  const campaign = {
    id: 'upswing-soak', name: 'Upswing Recovery Soak', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 520, calendar: { elapsedWeeks: 520, year: 10 },
      // Upswing arcs lit; generosity lit so ally credit can accelerate the rebuild.
      simulationRules: { warLayerEnabled: false, upswingArcsEnabled: true, constructiveFlowsEnabled: true },
      stressors: [],
    },
    // The two struck towns are ALLIED to the rich one (an ally that can invest in the rebuild).
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'e.a.c', from: 'ashford', to: 'crown', relationshipType: 'allied' },
        { id: 'e.b.c', from: 'briar', to: 'crown', relationshipType: 'allied' },
        { id: 'e.c.d', from: 'crown', to: 'dunmoor', relationshipType: 'trade_partner' },
        { id: 'e.d.e', from: 'dunmoor', to: 'elderford', relationshipType: 'trade_partner' },
        { id: 'e.e.f', from: 'elderford', to: 'fenwick', relationshipType: 'trade_partner' },
        { id: 'e.f.g', from: 'fenwick', to: 'greenhollow', relationshipType: 'trade_partner' },
        { id: 'e.g.h', from: 'greenhollow', to: 'hearth', relationshipType: 'trade_partner' },
      ],
    }),
    wizardNews: { currentTick: 520, entries: [] },
  };
  return { campaign, saves };
}

/** Drive the realm N monthly ticks with NO intervention; collect the chronicle. */
function driveRealm(seed, ticks) {
  let { campaign, saves } = makeRealm(seed);
  /** @type {Record<string, number>} */
  const newsKinds = {};
  let sawReconRecord = false;
  for (let t = 0; t < ticks; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
    for (const e of (r.wizardNews?.entries || [])) {
      const k = String(e?.impactKind || e?.kind || 'unknown');
      newsKinds[k] = (newsKinds[k] || 0) + 1;
    }
    if (r.worldState?.spatialLedgers?.upswing?.reconstruction) sawReconRecord = true;
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
  }
  return { campaign, saves, newsKinds, sawReconRecord };
}

describe('W-UPSWING — the 8-settlement RECEIPTED RECOVERY soak (no owner intervention)', () => {
  it('the devastated realm rebuilds itself: a reconstruction arc runs AND completes, receipted', () => {
    const { saves, newsKinds, sawReconRecord } = driveRealm('upswing-soak-1', 30);

    // THE ARC RAN — the reconstruction ledger record was carried at some point.
    expect(sawReconRecord, 'a reconstruction arc was in flight during the soak').toBe(true);
    // THE ARC COMPLETED — a permanent recovery beat reached the chronicle (no intervention).
    expect(newsKinds.reconstruction || 0, 'a receipted recovery arc completed endogenously').toBeGreaterThan(0);
    // The permanent history beat landed on a struck town (the "rebuilt in the year …" record).
    const rebuilt = saves.filter((s) => (s.settlement?.history?.historicalEvents || []).some((e) => /reconstruction/i.test(String(e.campaignEventId || ''))));
    expect(rebuilt.length, 'at least one struck town carries a permanent reconstruction beat').toBeGreaterThan(0);
  }, 60_000);

  it('CONSERVATION holds across the soak — populations + legitimacy stay bounded, no NaN', () => {
    const { saves } = driveRealm('upswing-soak-2', 24);
    for (const s of saves) {
      const pop = Number(s.settlement?.population);
      expect(Number.isFinite(pop) && pop >= 0, `population sane for ${s.id}`).toBe(true);
      const leg = Number(s.settlement?.powerStructure?.publicLegitimacy?.score);
      if (Number.isFinite(leg)) {
        expect(leg, `legitimacy in [0,100] for ${s.id}`).toBeGreaterThanOrEqual(0);
        expect(leg, `legitimacy in [0,100] for ${s.id}`).toBeLessThanOrEqual(100);
      }
    }
  }, 60_000);

  it('determinism: the same-seed soak reproduces byte-identically (no rng leak)', () => {
    const a = driveRealm('upswing-soak-3', 12);
    const b = driveRealm('upswing-soak-3', 12);
    expect(JSON.stringify(a.campaign.worldState?.spatialLedgers?.upswing || null))
      .toBe(JSON.stringify(b.campaign.worldState?.spatialLedgers?.upswing || null));
    expect(a.newsKinds).toEqual(b.newsKinds);
  }, 60_000);
});
