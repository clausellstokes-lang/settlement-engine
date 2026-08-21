/**
 * domain/worldPulse/seasons.js — SEASONS-A: the aspatial food year.
 *
 * The 4-4-5 calendar's 13-week quarters become the four seasons (worldState.js
 * owns the clock law — seasonForTick there is the ONE derivation; this module
 * is everything the clock DRIVES). Design §4i (round 19, owner verbatim):
 *
 *   RENEWABLES CYCLE — animals/fisheries/farming run ABUNDANT through the
 *   growing year → TEMPORARILY DEPLETED in winter → REPLENISH in spring.
 *   Implemented as ONE signed seasonal swing on the food-production read at
 *   its consumption point (advanceFoodStockpile), expressed in % of need —
 *   never by mutating generation state.
 *
 *   THE GRANARY IS THE BUFFER — the existing foodStockpile refills through
 *   summer/fall (harvest surplus flows in), draws down through winter. The
 *   LATE-WINTER HUNGRY GAP emerges from the arithmetic: a settlement whose
 *   stores run dry before spring shows its unrelieved deficit through the
 *   EXISTING deficit/famine machinery (causal food_security → pressures →
 *   population/candidates). No new famine system.
 *
 *   BIOME AMPLITUDE — severity scales by the canon terrain (mountain/desert
 *   harsh, temperate standard, coastal/riverside milder). resolveTerrain
 *   vocabulary; unknown terrain reads temperate.
 *
 *   INTER-ANNUAL VARIANCE — one SEEDED draw per (year, settlement), forked
 *   `season:<year>:<settlementId>` off the WORLD seed (the per-tick pulse rng
 *   re-seeds every tick, so a year-stable stream must fork the tick-invariant
 *   world seed — same replay determinism, no draw on the off path). Bands are
 *   BOUNDED so one bad year is absorbable and two are a crisis (see
 *   SEASONS_TUNING notes).
 *
 * THE CONSTITUTIONAL LAW: everything here is reached ONLY under
 * simulationRules.seasonsEnabled === true. Flag off ⇒ no reads, no draws, no
 * fields ⇒ byte-identical prior world (the dormancy-oracle discipline).
 *
 * Pure + deterministic; no Date, no wall clock.
 */

import { createPRNG } from '../../kernel/prng.js';
import { resolveSettlementTerrain } from '../resolveTerrain.js';
import { seasonForTick } from './worldState.js';

/**
 * THE CONSTANTS TABLE (documented per the brief).
 *
 * Units: `swing` is a signed fraction of the biome amplitude; amplitude is in
 * PERCENTAGE POINTS OF DAILY NEED. A settlement's seasonal production term is
 * swing(weekOfYear) × amplitude(terrain) × variance multiplier, entering the
 * granary ledger beside the blockade/famine cuts.
 *
 * THE ANNUAL SHAPE (unit swing, piecewise-linear per 13-week quarter):
 *   spring w1-13   −0.60 → +0.20   (the hungry-gap tail, then replenishment)
 *   summer w1-13   +0.30 → +0.90   (the growing year)
 *   autumn w1-5    +1.00 flat      (the harvest peak)
 *   autumn w6-13   +1.00 → +0.30   (harvest tapers)
 *   winter w1-13   −0.50 → −1.00   (deepening depletion; late winter deepest)
 *
 * TUNED SHAPE (temperate, amplitude 30, no variance): the growing year banks
 * ≈ +0.75 months of granary (fillRate applied); winter + early spring draw
 * ≈ −0.63 — a structurally balanced town accrues ≈ +0.12 months/year of
 * buffer, so ONE hard winter (×1.4 depletion ⇒ ≈ −0.9 draw) or ONE drought
 * (×0.55 replenishment ⇒ ≈ +0.41 bank) sags the granary but does not starve a
 * town holding ≥ ~1 month of stores; TWO bad years in a row (p ≈ 0.058 per
 * settlement) run the stores dry before spring — the crisis the owner asked
 * for. Harsh biomes (amplitude 36-40) NEED their granary infrastructure.
 *
 * VARIANCE BANDS (one uniform draw r per year × settlement):
 *   r < 0.12          drought      summer/autumn replenishment × 0.55
 *   0.12 ≤ r < 0.24   hard_winter  winter depletion × 1.40
 *   r ≥ 0.88          bountiful    summer/autumn replenishment × 1.30
 *   otherwise         null         a normal year
 * Bounded: max winter cut = amplitude × 1.4 (56 pts, mountain hard winter);
 * max harvest boost = amplitude × 1.3. No open-ended tails.
 */
export const SEASONS_TUNING = Object.freeze({
  // Biome amplitude, % of need at unit swing (resolveTerrain vocabulary).
  amplitudeByTerrain: Object.freeze({
    coastal: 20,     // fisheries run year-round
    riverside: 24,   // the river softens the winter
    plains: 30,      // the temperate standard
    forest: 30,      // game + forage track the fields
    hills: 33,
    desert: 36,      // a thin margin in every season
    mountain: 40,    // harsh: deep snow, short growing year
  }),
  defaultAmplitude: 30,
  // Variance bands + multipliers (see the table above).
  droughtP: 0.12,
  hardWinterP: 0.12,       // occupies [droughtP, droughtP + hardWinterP)
  bountifulP: 0.12,        // occupies [1 − bountifulP, 1)
  droughtReplenishMult: 0.55,
  hardWinterDepletionMult: 1.4,
  bountifulReplenishMult: 1.3,
  // Seasonal texture terms (display/news + one bounded pressure term).
  leanWinterCrimePressure: 0.06,   // added to crime pressure in winter (0..1 scale)
  // W-C3 founding lane: a multiplier on the emission probability, never a gate.
  foundingSeasonWeight: Object.freeze({ spring: 1.25, summer: 1.15, autumn: 0.85, winter: 0.6 }),
  // The hungry-gap boundary: month 12 of the 4-4-5 grid (winter weeks 9-13).
  lateWinterWeekOfSeason: 9,
  // "Dire" for the hungry-gap marker's major escalation: stores below half a
  // month while the effective deficit still bites.
  direStorageMonths: 0.5,
  direDeficitPct: 10,
});

/**
 * The unit swing s ∈ [−1, +1] for a 1-based (season, weekOfSeason).
 * @param {string} season @param {number} weekOfSeason 1..13
 */
export function seasonalUnitSwing(season, weekOfSeason) {
  const w = Math.max(1, Math.min(13, Math.floor(weekOfSeason) || 1));
  const t = (w - 1) / 12; // 0..1 across the quarter
  if (season === 'spring') return -0.6 + t * 0.8;
  if (season === 'summer') return 0.3 + t * 0.6;
  if (season === 'autumn') return w <= 5 ? 1.0 : 1.0 - ((w - 5) / 8) * 0.7;
  if (season === 'winter') return -0.5 - t * 0.5;
  return 0;
}

/**
 * The seeded inter-annual severity for one (year, settlement) — the "no two
 * winters alike" knob. ONE uniform draw off a tick-invariant fork of the WORLD
 * seed, so every week of the same year reads the same verdict and replay is
 * exact. Returns 'drought' | 'hard_winter' | 'bountiful' | null.
 * @param {string} rngSeed  worldState.rngSeed (the world seed, not the tick rng)
 * @param {number} year @param {string|number} settlementId
 */
export function seasonalSeverityFor(rngSeed, year, settlementId) {
  const r = createPRNG(`${rngSeed}::season:${year}:${String(settlementId)}`).random();
  const T = SEASONS_TUNING;
  if (r < T.droughtP) return 'drought';
  if (r < T.droughtP + T.hardWinterP) return 'hard_winter';
  if (r >= 1 - T.bountifulP) return 'bountiful';
  return null;
}

/**
 * The signed seasonal production term for one settlement-week, % of need.
 * variance applies where its story says: drought/bountiful reshape the
 * REPLENISHMENT (positive swing, summer/autumn); a hard winter deepens the
 * DEPLETION (negative swing, winter only).
 * @param {{season: string, weekOfSeason: number}} clock
 * @param {string|null} terrain  resolveTerrain vocabulary (null ⇒ temperate)
 * @param {'drought'|'hard_winter'|'bountiful'|null} variance
 */
export function seasonalSwingPts(clock, terrain, variance) {
  const T = SEASONS_TUNING;
  const amplitude = /** @type {Record<string, number>} */ (T.amplitudeByTerrain)[String(terrain || '')]
    ?? T.defaultAmplitude;
  let swing = seasonalUnitSwing(clock.season, clock.weekOfSeason);
  if (variance === 'drought' && swing > 0 && (clock.season === 'summer' || clock.season === 'autumn')) {
    swing *= T.droughtReplenishMult;
  } else if (variance === 'bountiful' && swing > 0 && (clock.season === 'summer' || clock.season === 'autumn')) {
    swing *= T.bountifulReplenishMult;
  } else if (variance === 'hard_winter' && swing < 0 && clock.season === 'winter') {
    swing *= T.hardWinterDepletionMult;
  }
  return swing * amplitude;
}

/**
 * The per-settlement seasonal context the kernel threads into
 * advanceFoodStockpile — clock + variance + swing, resolved once per
 * settlement-tick. Null-safe on terrain (unknown ⇒ temperate amplitude).
 * @param {{ rngSeed: string, clock: ReturnType<typeof seasonForTick>, settlement: object|null, settlementId: string|number }} args
 */
export function seasonalContextFor({ rngSeed, clock, settlement, settlementId }) {
  const variance = seasonalSeverityFor(rngSeed, clock.year, settlementId);
  const terrain = resolveSettlementTerrain(settlement);
  return {
    season: clock.season,
    weekOfYear: clock.weekOfYear,
    weekOfSeason: clock.weekOfSeason,
    year: clock.year,
    variance,
    swingPts: seasonalSwingPts(clock, terrain, variance),
  };
}

/** True when the (winter) clock sits in the hungry-gap window (month 12).
 *  @param {{ season: string, weekOfSeason: number }} clock */
export function isLateWinter(clock) {
  return clock.season === 'winter' && clock.weekOfSeason >= SEASONS_TUNING.lateWinterWeekOfSeason;
}

/**
 * SEASON BOUNDARY MARKERS — the ONE new wizard-news kind ('season_marker',
 * impactKind 'harvest' | 'hungry_gap'). Deterministic (no rng), realm-scope,
 * minted by the kernel when the advanced week window crosses a boundary:
 *   harvest    — entering autumn (week-of-year 27), the granaries take in the year
 *   hungry_gap — entering month 12 (winter week 9), the last weeks before spring
 * significance: notable; hungry_gap escalates to MAJOR only when the granary
 * math is actually dire somewhere (storage < direStorageMonths while the
 * effective deficit still bites) — the owner's "major only when dire".
 *
 * @typedef {{ id: string, tick: number, createdAt: string, scope: string,
 *            kind: string, impactKind: string, significance: string,
 *            severity: number, headline: string, summary: string,
 *            settlementIds: string[], reasons: string[], score?: number }} SeasonMarkerEntry
 * @param {{ prevWeeks: number, weeks: number, tick: number, now: string,
 *           foodStates: Array<{ id: string, name: string, present?: boolean, storageMonths: number, deficitPct: number }> }} args
 * @returns {SeasonMarkerEntry[]} wizard-news entries (possibly empty)
 */
export function seasonalBoundaryEntries({ prevWeeks, weeks, tick, now, foodStates = [] }) {
  const entries = [];
  const from = Math.max(0, Math.floor(prevWeeks));
  const to = Math.max(from, Math.floor(weeks));
  const allIds = foodStates.map((s) => String(s.id));
  const T = SEASONS_TUNING;
  for (let w = from + 1; w <= to; w += 1) {
    const clock = seasonForTick(w);
    // Entering autumn: the harvest marker (fires once, at the quarter boundary).
    if (clock.season === 'autumn' && clock.weekOfSeason === 1) {
      // present !== false: a settlement with NO food ledger (present:false) carries a
      // sentinel storageMonths 0 that must NOT read as "thin stores". Legacy callers that
      // omit `present` are unaffected (undefined !== false ⇒ counted as before).
      const thin = foodStates.filter((s) => s.present !== false && s.storageMonths < 1);
      entries.push({
        id: `wizard_news.season.harvest.${clock.year}.${tick}`,
        tick,
        createdAt: now,
        scope: 'realm',
        kind: 'season_marker',
        impactKind: 'harvest',
        significance: 'notable',
        severity: 0.35,
        headline: 'The harvest comes in',
        summary: thin.length
          ? `The granaries take in the year's harvest, but ${thin.length === 1 ? 'one settlement enters' : `${thin.length} settlements enter`} the season with thin stores.`
          : 'The granaries of the realm take in the year\'s harvest; stores rise against the coming winter.',
        settlementIds: allIds,
        reasons: thin.map((s) => `${s.name} holds under a month of stores at the harvest.`),
      });
    }
    // Entering month 12: the hungry gap (the historical late-winter crisis window).
    if (clock.season === 'winter' && clock.weekOfSeason === T.lateWinterWeekOfSeason) {
      const dire = foodStates.filter((s) => s.present !== false && s.storageMonths < T.direStorageMonths && s.deficitPct > T.direDeficitPct);
      entries.push({
        id: `wizard_news.season.hungry_gap.${clock.year}.${tick}`,
        tick,
        createdAt: now,
        scope: 'realm',
        kind: 'season_marker',
        impactKind: 'hungry_gap',
        significance: dire.length ? 'major' : 'notable',
        severity: dire.length ? 0.7 : 0.4,
        headline: dire.length ? 'The hungry gap bites' : 'The hungry gap',
        summary: dire.length
          ? `Stores run dry before spring: ${dire.map((s) => s.name).join(', ')} ${dire.length === 1 ? 'faces' : 'face'} the last weeks of winter with empty granaries.`
          : 'The last weeks of winter thin the granaries; the realm waits on the spring.',
        settlementIds: dire.length ? dire.map((s) => String(s.id)) : allIds,
        reasons: dire.map((s) => `${s.name}: stores below half a month with a ${Math.round(s.deficitPct)}% deficit.`),
      });
    }
  }
  return entries;
}

/**
 * SEASONS-B (M3): the SPRING-THAW news burst — the ONE new spatial season marker
 * ('season_marker', impactKind 'spring_thaw'). Deterministic (no rng), realm-
 * scope, minted when the advanced-week window crosses INTO spring (week-of-year 1):
 * the passes open, caravans move again, and the winter's held news travels the
 * roads at last. Emitted BY THE CALLER only when the SEASONAL-ROAD OVERLAY is
 * active (a world whose roads actually freeze); scored above the rumor notable
 * floor so it SEEDS the rumor ledger (the visible burst). Parallels
 * seasonalBoundaryEntries but is spatial-gated, not food-year-gated.
 *
 * @param {{ prevWeeks: number, weeks: number, tick: number, now: string,
 *           settlementIds?: Array<string|number> }} args
 * @returns {SeasonMarkerEntry[]}
 */
export function seasonalThawEntries({ prevWeeks, weeks, tick, now, settlementIds = [] }) {
  const entries = [];
  const from = Math.max(0, Math.floor(prevWeeks));
  const to = Math.max(from, Math.floor(weeks));
  const ids = [...new Set((settlementIds || []).map((v) => String(v)).filter((v) => v !== ''))].sort();
  for (let w = from + 1; w <= to; w += 1) {
    const clock = seasonForTick(w);
    if (clock.season === 'spring' && clock.weekOfSeason === 1) {
      entries.push({
        id: `wizard_news.season.spring_thaw.${clock.year}.${tick}`,
        tick,
        createdAt: now,
        scope: 'realm',
        kind: 'season_marker',
        impactKind: 'spring_thaw',
        significance: 'notable',
        // Above RUMOR_NOTABLE_SCORE_FLOOR (60) so the thaw seeds the rumor ledger.
        score: 70,
        severity: 0.4,
        headline: 'The roads thaw',
        summary: 'The spring thaw opens the passes; caravans move again and the winter\'s held news travels the roads at last.',
        settlementIds: ids,
        reasons: [],
      });
    }
  }
  return entries;
}
