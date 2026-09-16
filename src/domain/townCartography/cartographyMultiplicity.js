/**
 * townCartography/cartographyMultiplicity.js — A-8's RESOLVER (design §11b).
 *
 * The catalog says "Craft guilds (5-15)". THE CANONICAL COUNT is not the range: it
 * is the one number this settlement's own population-within-tier and prosperity put
 * inside that range, and this leaf is the single place that number is derived.
 *
 * ── WHY THIS IS ITS OWN MODULE ───────────────────────────────────────────────
 * Later surfaces (dossier prose, exports, Herald items) must be able to consume the
 * SAME count without importing the footprint-packing machinery. A count derived a
 * second time in a second file is the fork the ONE LAW forbids, one layer up: the
 * map would draw seven taverns while the dossier said five.
 *
 * ── THE COUNT IS PER-ANCHOR, WHICH IS WHAT MAKES IT APPEND-STABLE ────────────
 * The jitter stamp is a digest of the ANCHOR alone (plus the town's own digest), so
 * a count is independent of roster order and of every other institution. Adding an
 * institution can never change another's count — the TC-3b binding lesson applied to
 * multiplicity, and the reason A-8's NPC positional-id failure cannot repeat here.
 *
 * ── NO DRAW LIVES HERE ───────────────────────────────────────────────────────
 * Every choice is a `sceneDigest` of named inputs, so this leaf roots no stream and
 * forks no label. Its digest DOMAIN is single-colon-separated and never spells the
 * reserved `::`, which would alias a fork CHAIN (kernel/prng.js's delimiter
 * contract). Division and multiplication only; no transcendental reaches a decision.
 *
 * v1 IS PRESENTATION-CANONICAL AND ENGINE-INERT: a resolved count is drawn and
 * reported, and never feeds economy, services, or any other engine math.
 *
 * Pure, total and headless: no store, no clock, no randomness, no I/O, no
 * module-scope mutable state.
 *
 * @enforced-by tests/domain/townCartographyBuildings.test.js
 * @enforced-by tests/domain/townCartographyDeterminism.test.js
 */

import { sceneDigest } from '../townScene/stableScene.js';
import { premise, record } from './cartographyPlan.js';
import {
  CARTOGRAPHY_TIERS,
  TOWN_CARTOGRAPHY_TUNING,
  cartographyTierIndex,
} from './cartographyTuning.js';

const M = TOWN_CARTOGRAPHY_TUNING.MULTIPLICITY;

/** The ONE derivation domain. A digest domain, never a PRNG fork label. */
const MULTIPLICITY_DOMAIN = 'carto:multiplicity';

/** The catalog's own count spelling, e.g. `Craft guilds (5-15)`. */
const COUNT_RANGE = /\((\d+)-(\d+)\)/;

/** The unexported townScene ladder, mirrored in tuning and pinned by C2.
 *  @type {Readonly<Record<string, number>>} */
const PROSPERITY_RANK = M.PROSPERITY_RANK;

/**
 * @typedef {{ min: number, max: number }} CatalogRange
 * @typedef {{ min: number, max: number, resolved: number }} InstitutionMultiplicity
 */

/** @param {number} value @returns {number} */
function clamp01(value) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/**
 * The tier's authored population span. Shaped like `cartographyBand`, because the
 * span is a PAIR rather than a scalar and a band reader typed for numbers would have
 * to be widened to carry it.
 * @param {Readonly<Record<string, ReadonlyArray<number>>>} table
 * @param {unknown} tier
 * @returns {ReadonlyArray<number>}
 */
function tierSpan(table, tier) {
  return table[CARTOGRAPHY_TIERS[cartographyTierIndex(tier)]];
}

/**
 * The settlement's prosperity as a ladder rank, read in the SAME spelling
 * buildingProfiles.js uses (a bare label, or a record carrying `tier`/`label`). An
 * unknown or absent label reads the ladder's modest midpoint rather than zero: no
 * opinion is not the same claim as destitution.
 * @param {unknown} value
 * @returns {number}
 */
function prosperityRank(value) {
  const label = typeof value === 'string'
    ? value
    : String(record(value).tier || record(value).label || '');
  return PROSPERITY_RANK[label.toLowerCase()] ?? 3;
}

/**
 * READ THE AUTHORED RANGE out of a canonical display label.
 *
 * A label with no range is not an error: custom content and single-instance
 * institutions legitimately carry none, and A-2's grammar resolves them to exactly
 * one. A label whose range is MALFORMED is a different claim — canonical data that
 * cannot mean what it says — so it is named rather than repaired.
 *
 * @param {unknown} label
 * @returns {CatalogRange}
 */
export function parseCatalogRange(label) {
  if (typeof label !== 'string' || label === '') return { min: 1, max: 1 };
  const match = COUNT_RANGE.exec(label);
  if (!match) return { min: 1, max: 1 };
  const min = Number.parseInt(match[1], 10);
  const max = Number.parseInt(match[2], 10);
  if (min > max || min < 1) {
    throw premise(`institution label ${label} carries a malformed count range`);
  }
  return { min, max };
}

/**
 * RESOLVE THE CANONICAL COUNT for one institution.
 *
 * Monotone non-decreasing in population and in prosperity rank at a fixed identity
 * (the jitter depends on neither), always inside the authored range, and exactly one
 * for a rangeless label.
 *
 * @param {object} input
 * @param {unknown} input.label the canonical display label carrying the range
 * @param {unknown} input.population the settlement's population
 * @param {unknown} input.tier the canonical tier
 * @param {unknown} input.prosperity the settlement's economicState prosperity
 * @param {unknown} input.digest the manifest's mapModelDigest
 * @param {unknown} input.anchorKey the institution's stable identity anchor
 * @returns {InstitutionMultiplicity}
 */
export function resolveInstitutionMultiplicity(input) {
  const { min, max } = parseCatalogRange(input.label);
  const span = tierSpan(M.POPULATION_SPAN, input.tier);
  const population = typeof input.population === 'number' && Number.isFinite(input.population)
    ? input.population
    : span[0];
  const popWithin01 = clamp01((population - span[0]) / (span[1] - span[0]));
  const prosperity01 = prosperityRank(input.prosperity) / M.PROSPERITY_RANK_SPAN;
  const mix = clamp01(M.POPULATION_WEIGHT * popWithin01 + M.PROSPERITY_WEIGHT * prosperity01);
  const base = min + Math.round((max - min) * mix);
  const stamp = Number.parseInt(sceneDigest({
    domain: MULTIPLICITY_DOMAIN,
    digest: input.digest,
    anchorKey: input.anchorKey,
  }).slice(-8), 16);
  const jitter = (Number.isFinite(stamp) ? stamp : 0) % M.JITTER_STEPS - 1;
  return { min, max, resolved: Math.min(max, Math.max(min, base + jitter)) };
}
