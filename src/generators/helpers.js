/**
 * helpers.js — Core shared utilities for all generators.
 *
 * Single source of truth for:
 *  - Re-exported constants/primitives from data/constants.js
 *  - Institution classification  (getInstitutionNames)
 *  - Core influence scoring      (getInstFlags, getStressFlags)
 *  - Trade/water dependency      (evaluateWaterDependency)
 *  - Shared utility functions    (pickRandom, replaceTokens, …)
 *
 * NOT for clamp. src/kernel/math.js is the ONE clamp primitive, and its ADOPTION
 * rule binds here: new generator code imports clamp/clamp01 from ../kernel/math.js.
 * The `clamp` exported below is a frozen legacy copy carrying the PASSTHROUGH
 * non-finite policy (NaN rides through) where the kernel clamps a non-finite input
 * to `lo`. It survives only because scripts/.clamp-primitive-baseline.json freezes
 * divergent copies rather than silently changing their semantics — a baseline row,
 * not a recommendation.
 */

import {
  TIER_ORDER, POPULATION_RANGES, SEVERITY,
  popToTier, getMagicLevel, tierAtLeast,
} from '../data/constants.js';
// chance/pick/randInt come from rngContext directly (not from constants.js)
// since 2026-04 — eliminates the data→engine→data circular chunk warning.
import { chance, pick, randInt } from '../kernel/rngContext.js';


// ─── Re-export primitives ────────────────────────────────────────────────────
export {
  TIER_ORDER, POPULATION_RANGES, SEVERITY,
  chance, pick, randInt, popToTier, getMagicLevel, tierAtLeast,
};

// ─── Tier helpers ────────────────────────────────────────────────────────────

const TOWN_PLUS_TIERS = ['town', 'city', 'metropolis'];
const SMALL_TIERS     = ['thorp', 'hamlet', 'village'];

/** True for town, city, metropolis. */
export const getTradeRouteFeatures = (tier) => TOWN_PLUS_TIERS.includes(tier);
/** True for thorp, hamlet, village. */
const _isSmallTier = (tier) => SMALL_TIERS.includes(tier);

// ─── Math utilities ──────────────────────────────────────────────────────────

/** Clamp a value between lo and hi (defaults: 0–100). PASSTHROUGH on a non-finite
 *  input — NaN survives. Frozen: new code takes clamp from ../kernel/math.js. */
export const clamp = (val, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, val));

/** Convert a 0–100 priority slider to a multiplier centred at 1.0 when priority = 50. */
export const priorityToMultiplier = (priority = 50) => Math.max(0, (priority ?? 50) / 50);

// ─── Random utilities ────────────────────────────────────────────────────────

import { random as _rng, chance as _chance, pick as _pick } from '../kernel/rngContext.js';

/** Random boolean: true with probability p. */
export const random01 = (p) => _chance(p);

/** Pick a random element from an array. */
export const pickRandom  = (arr) => _pick(arr);
/** Alias for pickRandom — kept for call-site compatibility. */
export const pickRandom2 = (arr) => _pick(arr);

/** Replace {key} tokens in a template string using values from data. */
export const replaceTokens = (str, data) =>
  str.replace(/\{(\w+)\}/g, (_, key) => data[key] ?? `{${key}}`);

// ─── Priority extraction ─────────────────────────────────────────────────────

/**
 * Extract the five priority slider values from a config object.
 * All values default to 50 when absent.
 */

// ─── Priority/flag helpers (moved to priorityHelpers.js) ─────────────────────
export {
  getPriorities, hasTeleportationInfra, evaluateWaterDependency,
  getInstFlags, getStressFlags,
} from './priorityHelpers.js';
