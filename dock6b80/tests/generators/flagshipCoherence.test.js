/**
 * tests/generators/flagshipCoherence.test.js — the FLAGSHIP WORKED EXAMPLE probe
 * (C3-experience finding 2, bar-90 "mouth vs hands").
 *
 * The Keeper's Handbook conceptIntro (src/components/HowToUse.jsx) makes the
 * product's central coherence claim: "A struggling frontier town with high
 * criminal priority will have a corrupt guard, underfunded walls, a black
 * market, and NPCs whose secrets reflect exactly that pressure." Until this
 * probe, no test ever FORGED that town and checked the bundle — the flagship
 * example rested on manual authoring.
 *
 * This probe drives the REAL pipeline (generateSettlementPipeline, never the
 * bare sub-generators — generator-probe-corpus hazard) across a fixed seed
 * corpus with the flagship constraint set (town, frontier threat, criminal 90,
 * military 20, economy 25) and asserts each promised element appears at a
 * healthy prevalence, plus a floor on the full bundle appearing together.
 *
 * Thresholds are set ~15-20 points BELOW the rates measured at authoring time
 * (recorded inline) so seeded-RNG drift doesn't flake, while a real coherence
 * regression — a struggling criminal town that stops producing crime-pressure
 * outputs — reds loudly.
 *
 * CANNOT-CATCH: prose drift in HowToUse itself (handbookClaimsParity.test.jsx
 * covers the wording side); single-seed cherry-picking (this is prevalence,
 * not per-seed guarantee — the conceptIntro's "will have" is illustrative).
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const FLAGSHIP = {
  settType: 'town',
  culture: 'germanic',
  terrain: 'grassland',
  tradeRouteAccess: 'road',
  monsterThreat: 'frontier',
  priorityCriminal: 90,
  priorityMilitary: 20,
  priorityEconomy: 25,
};

const SEEDS = Array.from({ length: 24 }, (_, i) => `flagship-town-${i}`);

const forge = (seed) => generateSettlementPipeline({ ...FLAGSHIP }, null, { seed, customContent: {} });

// ── Element detectors ────────────────────────────────────────────────────────
// The safety profile lives where the DOSSIER reads it (dailyLifeLogic.js /
// SummaryTab): settlement.economicState.safetyProfile.
const textOf = (v) => JSON.stringify(v || '').toLowerCase();
const safetyOf = (s) => s.economicState?.safetyProfile || {};

// (a) corrupt guard / corrupted power: any NPC marked corrupt by corruptionPass,
// or corruption surfacing in the safety-profile prose.
const hasCorruptPresence = (s) =>
  (s.npcs || []).some((n) => n.corrupt) ||
  /corrupt/.test(textOf(safetyOf(s)));

// (b) underfunded / weak defenses: the economics→defense coupling gate below
// full funding, or a visibly weak defensive posture (readiness ≤ 40 — the
// "Lightly Defended" band and below).
const hasUnderfundedDefense = (s) => {
  const dp = s.defenseProfile || {};
  const gates = dp.economicGates || {};
  return Object.values(gates).some((g) => typeof g === 'number' && g < 1) ||
    (typeof dp.readiness?.score === 'number' && dp.readiness.score <= 40) ||
    /underfunded|poorly maintained|crumbling|disrepair/.test(textOf(dp));
};

// (c) black market: the safety profile's crime elements / shadow-economy read.
const hasBlackMarket = (s) => /black market|shadow econom|smuggl/.test(textOf(safetyOf(s)));

// (d) NPC secrets reflecting the crime pressure.
const hasCrimePressureSecret = (s) =>
  (s.npcs || []).some((n) => /crime|criminal|smuggl|corrupt|bribe|black market|theft|stolen|extort|gang|underworld|illicit/.test(textOf(n.secret)));

describe('flagship coherence — the struggling criminal frontier town produces its promised bundle', () => {
  const corpus = SEEDS.map((seed) => forge(seed));

  it('generates a real corpus (pipeline sanity)', () => {
    expect(corpus.length).toBe(SEEDS.length);
    for (const s of corpus) expect(s?.npcs?.length ?? 0).toBeGreaterThan(0);
  });

  // Measured at authoring (2026-07-21, this exact fixed corpus — deterministic):
  //   corrupt 0.708 · underfunded 1.0 · blackMarket 1.0 · secrets 0.542 · bundle 0.417
  // Thresholds sit well below those rates so legitimate future tuning has room,
  // while a real coherence regression (the constraint set stops producing its
  // crime-pressure outputs) reds loudly.
  it('each promised element appears at healthy prevalence across the corpus', () => {
    const rate = (fn) => corpus.filter(fn).length / corpus.length;
    expect(rate(hasCorruptPresence), 'corrupt guard/NPC presence collapsed').toBeGreaterThanOrEqual(0.5);
    expect(rate(hasUnderfundedDefense), 'weak/underfunded defenses collapsed').toBeGreaterThanOrEqual(0.75);
    expect(rate(hasBlackMarket), 'black market / shadow economy collapsed').toBeGreaterThanOrEqual(0.75);
    expect(rate(hasCrimePressureSecret), 'crime-pressure NPC secrets collapsed').toBeGreaterThanOrEqual(0.35);
  });

  it('the full bundle co-occurs on a meaningful share of seeds (coherence, not coincidence)', () => {
    const bundleRate = corpus.filter((s) =>
      hasCorruptPresence(s) && hasUnderfundedDefense(s) && hasBlackMarket(s) && hasCrimePressureSecret(s),
    ).length / corpus.length;
    expect(bundleRate, 'the flagship bundle no longer co-occurs').toBeGreaterThanOrEqual(0.25);
  });
});
