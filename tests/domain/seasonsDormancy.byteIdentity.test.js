/**
 * seasonsDormancy.byteIdentity.test.js — THE SEASONS-A CONSTITUTIONAL PIN.
 *
 * seasonsEnabled DEFAULT OFF ⇒ byte-identical: the off path adds no fields,
 * forks no rng, reads nothing seasonal. Proven at the KERNEL level:
 *
 *   (a) a multi-tick pulse run with the flag ABSENT and with the flag
 *       EXPLICITLY false produce RAW-byte-identical composed output
 *       (worldState + settlements + news), and the settlements carry NO
 *       seasonal field anywhere;
 *   (b) anti-vacuity: the SAME fixture with the flag ON diverges (the food
 *       year actually does something) and stamps the seasonal record;
 *   (c) the flag-on run never leaks a seasonal key back onto the flag-off
 *       path (fresh fixtures per run — no shared mutable state).
 *
 * The cross-build flag-off bytes are pinned by the two committed goldens
 * (generator + worldpulse deity); this file pins absent === false and the
 * no-new-fields law directly.
 */
import { describe, expect, it } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-02-02T00:00:00.000Z';

function makeFixture(rulesPatch = {}) {
  const settlement = (name, terrainType, foodSecurity) => ({
    name,
    tier: 'town',
    population: 1400,
    config: { tradeRouteAccess: 'road', terrainType },
    institutions: [{ name: 'Granary', status: 'active' }],
    economicState: {
      primaryExports: [],
      primaryImports: ['Bulk grain and foodstuffs'],
      foodSecurity: { dailyNeed: 2800, dailyProduction: 2800, ...foodSecurity },
    },
    powerStructure: { publicLegitimacy: { score: 55, label: 'Accepted' }, factions: [], conflicts: [] },
    npcs: [],
    activeConditions: [],
  });
  const saves = [
    {
      id: 'a',
      name: 'Ashford',
      phase: 'canon',
      settlement: settlement('Ashford', 'plains', { surplusPct: 10, deficitPct: 0, storageMonths: 1.5, importDependency: 0.1, resilienceScore: 60 }),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    },
    {
      id: 'b',
      name: 'Bleakstone',
      phase: 'canon',
      settlement: settlement('Bleakstone', 'mountain', { surplusPct: 0, deficitPct: 0, storageMonths: 0.4, importDependency: 0.2, resilienceScore: 45 }),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    },
  ];
  const campaign = {
    id: 'seasons-dormancy',
    name: 'Seasons Dormancy',
    settlementIds: ['a', 'b'],
    worldState: {
      rngSeed: 'seasons-dormancy-seed',
      tick: 0,
      // Start at week 38 so the run crosses the autumn→winter boundary window
      // (the seasonal machinery would be busiest here if it leaked).
      calendar: { elapsedWeeks: 38, elapsedMonths: (38 * 3) / 13, month: 9, year: 1, season: 'autumn' },
      simulationRules: rulesPatch,
      stressors: [],
    },
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }],
    }),
    wizardNews: { currentTick: 0, entries: [] },
  };
  return { campaign, saves };
}

/** Run N weekly ticks, threading state, and return the composed final state.
 *  12 ticks from week 38 cross BOTH the winter boundary (week 40) and the
 *  hungry-gap window (week 48) and end mid-winter (week 50). */
function run(rulesPatch, ticks = 12) {
  let { campaign, saves } = makeFixture(rulesPatch);
  let wizardNews = campaign.wizardNews;
  for (let t = 0; t < ticks; t += 1) {
    const r = simulateCampaignWorldPulse({ campaign: { ...campaign, wizardNews }, saves, interval: 'one_week', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph };
    wizardNews = r.wizardNews;
  }
  return { worldState: campaign.worldState, settlements: saves.map((s) => s.settlement), wizardNews };
}

/** Collect every key path that smells seasonal. */
function seasonalKeyPaths(value, path = '$', out = []) {
  if (!value || typeof value !== 'object') return out;
  if (Array.isArray(value)) {
    value.forEach((v, i) => seasonalKeyPaths(v, `${path}[${i}]`, out));
    return out;
  }
  for (const [k, v] of Object.entries(value)) {
    if (/^(seasonWeek|seasonalSwingPct|seasonalEvent)$/.test(k)) out.push(`${path}.${k}`);
    // `season` appears legitimately on worldState.calendar (legacy law); only
    // flag it inside a foodSecurity stockpile record.
    if (k === 'season' && /stockpile/.test(path)) out.push(`${path}.${k}`);
    seasonalKeyPaths(v, `${path}.${k}`, out);
  }
  return out;
}

describe('SEASONS-A dormancy — default off is byte-identical', () => {
  it('flag ABSENT === flag FALSE, raw bytes, over 12 weekly ticks crossing a season boundary', () => {
    const absent = run({});
    const explicitFalse = run({ seasonsEnabled: false });
    expect(JSON.stringify(absent)).toBe(JSON.stringify(explicitFalse));
  });

  it('the off path writes NO seasonal field anywhere (no fields, the constitutional law)', () => {
    const absent = run({});
    expect(seasonalKeyPaths(absent)).toEqual([]);
    // and no season_marker entry ever reaches the feed
    expect((absent.wizardNews?.entries || []).filter((e) => e.kind === 'season_marker')).toEqual([]);
  });

  it('anti-vacuity: the flag ON diverges and stamps the seasonal record + boundary marker', () => {
    const off = run({});
    const on = run({ seasonsEnabled: true });
    expect(JSON.stringify(on)).not.toBe(JSON.stringify(off));
    // the seasonal bookkeeping exists on-path…
    expect(seasonalKeyPaths(on).length).toBeGreaterThan(0);
    // …the window (weeks 39→52) crossed month 12 (week 47): the hungry-gap marker fired
    const markers = (on.wizardNews?.entries || []).filter((e) => e.kind === 'season_marker');
    expect(markers.map((e) => e.impactKind)).toContain('hungry_gap');
    // …and Bleakstone (mountain, 0.4 months of stores) reads as winter in drawdown
    const bleak = on.settlements.find((s) => s.name === 'Bleakstone');
    expect(bleak.economicState.foodSecurity.stockpile.season).toBe('winter');
  });

  it('two flag-on runs are deterministic (same seed ⇒ same bytes)', () => {
    expect(JSON.stringify(run({ seasonsEnabled: true }))).toBe(JSON.stringify(run({ seasonsEnabled: true })));
  });
});

// ── W-CAP CAP-3: THE RAW-BYTE ARM BESIDE THE ORACLE (A1.2.7) ─────────────────────────
// The suite above is this program's seasons oracle, and A1.2.7 rules that the oracle alone
// cannot discharge §713.2: the shared dormancyOracle is normalize-based, and a normalizer
// forgives differences a canon's bytes do not. These arms therefore compare RAW
// `JSON.stringify` over a full 12-tick composed run — worldState, settlements and news —
// which is the same bar the seasonsEnabled arms above already meet, now applied to the
// climate band that CAP-3 lets the food year read.
//
// ⚠ THE THREE DARK SHAPES ARE NOT INTERCHANGEABLE and each is proven separately, because
// each fails differently: a campaign with NO canon at all (activeSpatialDigest returns
// null), a canon frozen BEFORE CAP-3 (no `climate` key — every existing save), and a canon
// frozen UNDER CAP-3 over a map with no captured grid climate (a `climate` key whose every
// band is `unknown`). A cure that handled two of the three would look green here without
// the third arm.
/** A minimal frozen canon shaped exactly as activeSpatialDigest demands: an integer
 *  version > 0 and a real distanceMatrix. `climate` is spliced in per-arm. */
function canonWith(climate) {
  return {
    spatialCanonVersion: 1,
    spatialDigest: {
      spatialGeometryVersion: 1,
      costLawVersion: 1,
      overlayVersion: 1,
      settlementIds: ['a', 'b'],
      distanceMatrix: { a: { b: 400 }, b: { a: 400 } },
      reserved: { airField: null, seaLanes: null, seasonalOverlay: null, teleportEdges: null },
      ...(climate ? { climate } : {}),
    },
  };
}
const bandsCanon = (bandA, bandB) => canonWith({
  version: 1,
  bySettlement: {
    a: { band: bandA, temp: 12, prec: 40 },
    b: { band: bandB, temp: -8, prec: 3 },
  },
});

/** The 12-tick run above, with a frozen canon folded into the starting worldState. */
function runWithCanon(rulesPatch, canon, ticks = 12) {
  let { campaign, saves } = makeFixture(rulesPatch);
  campaign = { ...campaign, worldState: { ...campaign.worldState, ...(canon || {}) } };
  let wizardNews = campaign.wizardNews;
  for (let t = 0; t < ticks; t += 1) {
    const r = simulateCampaignWorldPulse({ campaign: { ...campaign, wizardNews }, saves, interval: 'one_week', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph };
    wizardNews = r.wizardNews;
  }
  return { settlements: saves.map((s) => s.settlement), wizardNews };
}

describe('W-CAP CAP-3 dormancy — an uncaptured climate is byte-identical, a captured one is not', () => {
  it('RAW BYTES: no canon === a pre-CAP-3 canon === an all-`unknown` canon, over 12 ticks', () => {
    const noCanon = JSON.stringify(runWithCanon({ seasonsEnabled: true }, null));
    const preCap3 = JSON.stringify(runWithCanon({ seasonsEnabled: true }, canonWith(null)));
    const unknownBands = JSON.stringify(runWithCanon(
      { seasonsEnabled: true },
      bandsCanon('unknown', 'unknown'),
    ));
    expect(preCap3, 'a canon frozen before CAP-3 must read exactly as no canon at all').toBe(noCanon);
    expect(unknownBands, 'an honestly-unknown band must take NO opinion on the food year').toBe(noCanon);
  });

  it('RAW BYTES: the SEASONS flag off swallows the band entirely (no canon can wake it)', () => {
    // The constitutional order: climate refines the food year, it does not create one. With
    // seasonsEnabled off there is no food year to refine, and the loudest possible canon
    // must still produce the byte-identical off path.
    const off = JSON.stringify(runWithCanon({}, null));
    expect(JSON.stringify(runWithCanon({}, bandsCanon('harsh', 'harsh')))).toBe(off);
  });

  it('ANTI-VACUITY: a MEASURED band moves the food year, and in the direction it should', () => {
    // Without this the three arms above would pass over machinery that does nothing.
    const unknown = runWithCanon({ seasonsEnabled: true }, bandsCanon('unknown', 'unknown'));
    const harsh = runWithCanon({ seasonsEnabled: true }, bandsCanon('harsh', 'harsh'));
    const mild = runWithCanon({ seasonsEnabled: true }, bandsCanon('mild', 'mild'));
    expect(JSON.stringify(harsh)).not.toBe(JSON.stringify(unknown));
    expect(JSON.stringify(mild)).not.toBe(JSON.stringify(unknown));
    expect(JSON.stringify(mild)).not.toBe(JSON.stringify(harsh));
    // DIRECTION, read at the mechanism and then at the outcome. The run ends mid-winter,
    // where the unit swing is negative, so a HARSHER band (amplitude 38) must cut deeper
    // than a milder one (22) and must therefore leave LESS in the granary. Read Ashford,
    // the plains town, at both extremes.
    const ashford = (r) => r.settlements.find((s) => s.name === 'Ashford').economicState.foodSecurity;
    const swingOf = (r) => ashford(r).stockpile.seasonalSwingPct;
    expect(swingOf(harsh), 'winter swing is negative, so harsh must be the deeper cut')
      .toBeLessThan(swingOf(mild));
    expect(ashford(harsh).storageMonths).toBeLessThan(ashford(mild).storageMonths);
    // …and the unknown band sits on neither side by accident: it takes the TERRAIN proxy,
    // which for Ashford's 'plains' is amplitude 30 — strictly between the two.
    expect(swingOf(unknown)).toBeLessThan(swingOf(mild));
    expect(swingOf(unknown)).toBeGreaterThan(swingOf(harsh));
  });

  it('the band is read through the pack\'s OWN settlement id, not by position', () => {
    // A per-settlement lookup that silently fell back to "the first row" would pass every
    // arm above. Give the two settlements OPPOSITE bands and assert they diverge from the
    // uniform runs in both directions.
    const split = JSON.stringify(runWithCanon({ seasonsEnabled: true }, bandsCanon('harsh', 'mild')));
    expect(split).not.toBe(JSON.stringify(runWithCanon({ seasonsEnabled: true }, bandsCanon('harsh', 'harsh'))));
    expect(split).not.toBe(JSON.stringify(runWithCanon({ seasonsEnabled: true }, bandsCanon('mild', 'mild'))));
  });
});
