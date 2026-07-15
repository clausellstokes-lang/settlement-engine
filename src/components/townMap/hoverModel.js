/**
 * components/townMap/hoverModel.js — the SM-2 building-hover resolution helper.
 *
 * PURE, view-time, store-free. Resolves a town-map building back to its real
 * institution and derives the SAME profile the dossier's InstitutionCard shows,
 * so the map's building popover is at PARITY with the dossier by construction —
 * it re-uses deriveInstitutionProfile (which reads no store / config /
 * latentPantheon), inheriting its deity/honesty safety.
 *
 * Resolution precedence mirrors the model's own anchor identity: match the
 * building's stable anchorKey against the settlement's institutions first
 * (exact identity — survives two institutions sharing a name-slug fallback),
 * then fall back to the tolerant name resolver the dossier link uses.
 *
 * HONESTY GATE (replicates InstitutionLink): a building resolves to a card ONLY
 * when its institution yields ≥1 derived contribution. Otherwise `show` is false
 * and the caller shows NOTHING — never an empty card.
 */

import {
  resolveInstitutionByName, deriveInstitutionProfile,
} from '../../domain/display/institutionProfile.js';
import { anchorForInstitution } from '../../domain/townMap/anchors.js';

/**
 * Resolve a town-map building to its backing institution object, or null.
 * @param {{ anchorKey?: string, name?: string } | null | undefined} building
 * @param {any} settlement
 * @returns {any}
 */
export function resolveBuildingInstitution(building, settlement) {
  const byAnchor = Array.isArray(settlement?.institutions)
    ? settlement.institutions.find((i) => anchorForInstitution(i) === building?.anchorKey)
    : null;
  return byAnchor || resolveInstitutionByName(building?.name, settlement) || null;
}

/**
 * @typedef {Object} BuildingHoverModel
 * @property {any} institution
 * @property {import('../../domain/display/institutionProfile.js').InstitutionProfile|null} profile
 * @property {boolean} show
 */

/**
 * Build the hover model for a building: its institution, the derived profile,
 * and whether the honesty gate lets a card show.
 * @param {{ anchorKey?: string, name?: string } | null | undefined} building
 * @param {any} settlement
 * @returns {BuildingHoverModel}
 */
export function buildingHoverModel(building, settlement) {
  const institution = resolveBuildingInstitution(building, settlement);
  if (!institution) return { institution: null, profile: null, show: false };
  const profile = deriveInstitutionProfile(institution, settlement);
  const show = !!profile && Array.isArray(profile.contributions) && profile.contributions.length > 0;
  return { institution, profile, show };
}
