/**
 * domain/dossier/powerSupport.js — the Power tab's institution-support web.
 *
 * Owner order (2026-07-22): "in the power tab, there should show when you click a
 * power all of the institutions that support that power for the DM to understand
 * the web."
 *
 * Derives, READ-ONLY in the display layer, which of a settlement's institutions
 * stand behind each power (faction). No generation change; no store write; pure
 * and deterministic over the settlement it is handed.
 *
 * THE DATA REALITY (probed from the FULL pipeline, 2026-07-22): the generator
 * emits NO per-institution controlling-faction field and NO per-faction
 * institution list. The only join between an institution and a faction is the
 * faction DISPLAY-NAME STRING. Two honest signals exist:
 *   - factionSource  — a sparse (~1 institution/settlement) EXACT marker naming
 *     the faction that raised a landmark (Great cathedral -> Religious Authorities,
 *     Citadel -> Military/Guard). Strong but rare.
 *   - category alignment — an institution's `priorityCategory` maps to a faction
 *     `category`; the leading faction of that category is its backer. This is the
 *     SAME relation the InstitutionCard "Backed by" row shows: we reuse its exact
 *     helper (institutionBackingFactionName) so the two never diverge. Coarse by
 *     nature (category-level, disambiguated to the dominant faction of the
 *     category) because that is the strongest BROAD signal the data carries.
 *
 * The basis vocabulary is a FROZEN, FINITE enum (the finite-semantics law): every
 * "why this institution backs this power" line is one of a fixed set of typed
 * phrases keyed by the signal + the backing faction's canonical archetype — never
 * a free-composed reason. No dashes / no apostrophes (F24 copy law).
 */

import { institutionBackingFactionName } from '../display/institutionProfile.js';
import { factionArchetype, FACTION_ARCHETYPES as A } from '../factionArchetypes.js';
import { nameOf } from '../rulingPower.js';

/** @typedef {'founded'|'aligned'} SupportBasisKind */

/**
 * The loose settlement fields this derivation reads (structurally typed, no
 * `any`, so the domain any-cast ratchet stays flat).
 * @typedef {{ faction?: string, name?: string, category?: string, power?: number }} SupportFaction
 * @typedef {{ name?: string, priorityCategory?: string, category?: string, factionSource?: string }} SupportInstitution
 * @typedef {{ powerStructure?: { factions?: SupportFaction[] }, institutions?: SupportInstitution[] }} SupportSettlement
 */

/**
 * @typedef {Object} SupportEdge
 * @property {SupportInstitution} institution  The raw settlement institution object.
 * @property {string} name          The institution display name.
 * @property {SupportBasisKind} basis
 * @property {string} why           The typed one-line basis phrase (finite set).
 */

// The `aligned` basis phrase, keyed by the backing faction's canonical archetype
// so the line names the shared domain. Frozen: a typo key reads `undefined` and
// falls to OTHER, never a silent miss.
/** @type {Readonly<Record<string, string>>} */
const ALIGNED_BASIS = Object.freeze({
  [A.MERCHANT]:   'A commercial house of this power',
  [A.MILITARY]:   'An armed body under this command',
  [A.RELIGIOUS]:  'A house of this faith',
  [A.ARCANE]:     'An order under this arcane power',
  [A.CRIMINAL]:   'A front under this influence',
  [A.NOBLE]:      'A retainer house of this line',
  [A.GOVERNMENT]: 'A civic office of this authority',
  [A.CIVIC]:      'A civic office of this authority',
  [A.CRAFT]:      'A guild under this craft power',
  [A.LABOR]:      'A workshop of this commons',
  [A.OUTSIDER]:   'Aligned with this outside power',
  [A.OCCUPATION]: 'Held under this occupying power',
  [A.OTHER]:      'Aligned with this power',
});

// The `founded` basis phrase (the exact factionSource signal).
const FOUNDED_BASIS = 'Raised by this power';

/** The finite basis vocabulary, exported so the drift pin can enumerate it. */
export const SUPPORT_BASIS = Object.freeze({
  founded: FOUNDED_BASIS,
  aligned: ALIGNED_BASIS,
});

/** Tolerant compare of a factionSource name to a faction display name.
 *  @param {unknown} a @param {unknown} b @returns {boolean} */
function sameName(a, b) {
  return String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
}

/**
 * Map each power faction (by display name) to the institutions that stand behind
 * it. Returns a Map keyed by the faction display name; each value is an ordered
 * list of SupportEdge — founded edges first (the exact signal), then aligned (the
 * category signal), each in the settlement's own institution order (deterministic).
 * An institution appears under AT MOST ONE faction — its founder when named, else
 * its backing faction — so the web never double-counts and stays byte-consistent
 * with the InstitutionCard "Backed by" line.
 *
 * @param {SupportSettlement} settlement
 * @returns {Map<string, SupportEdge[]>}
 */
export function deriveFactionSupport(settlement) {
  /** @type {Map<string, SupportEdge[]>} */
  const byFaction = new Map();
  const factions = settlement?.powerStructure?.factions;
  const institutions = settlement?.institutions;
  if (!Array.isArray(factions) || !Array.isArray(institutions)) return byFaction;

  // Seed a bucket for every faction (by display name) and note its archetype.
  /** @type {Map<string, string>} */
  const archOf = new Map();
  for (const f of factions) {
    const key = nameOf(f);
    if (!key) continue;
    if (!byFaction.has(key)) byFaction.set(key, []);
    if (!archOf.has(key)) archOf.set(key, factionArchetype(f));
  }

  // 1) EXACT: factionSource names the faction that raised the institution.
  const placed = new Set();
  for (const inst of institutions) {
    const src = inst?.factionSource;
    if (!src) continue;
    const target = factions.find((f) => sameName(nameOf(f), src));
    if (!target) continue;
    const key = nameOf(target);
    const bucket = byFaction.get(key);
    if (!bucket) continue;
    bucket.push({ institution: inst, name: String(inst.name || ''), basis: 'founded', why: FOUNDED_BASIS });
    placed.add(inst);
  }

  // 2) BROAD: category alignment via the shared backing-faction helper (the same
  //    relation InstitutionCard shows). An institution already placed by its
  //    founder is not re-listed.
  for (const inst of institutions) {
    if (placed.has(inst)) continue;
    const backerName = institutionBackingFactionName(inst, settlement);
    if (!backerName) continue;
    const bucket = byFaction.get(backerName);
    if (!bucket) continue;
    const arch = archOf.get(backerName) || A.OTHER;
    bucket.push({
      institution: inst,
      name: String(inst.name || ''),
      basis: 'aligned',
      why: ALIGNED_BASIS[arch] || ALIGNED_BASIS[A.OTHER],
    });
  }

  return byFaction;
}
