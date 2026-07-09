/**
 * institutionProfile.js — the institution identity shell (Wave E, batch E2).
 *
 * Derive a small, HONEST profile for an institution from the settlement's REAL
 * generated data — the same facts other tabs already compute, gathered into one
 * "what does this place actually do" summary the InstitutionCard popover renders.
 *
 * Every contribution is grounded in a concrete signal:
 *   - services  → the institution's INSTITUTION_SERVICES catalog entry (count)
 *   - economy   → the supply chains it processes (F32 processingTags matcher) and
 *                 the trade goods it GATES (a good's requiredInstitution === name)
 *   - power     → the backing faction in the settlement's power structure
 *   - defense   → the defence role it fills (defenseProfile.institutions buckets)
 *
 * `oneLiner` is intentionally null: a hand-authored short description is Phase 5
 * work. We derive nothing fake to fill it — the card simply omits that row until
 * real copy exists.
 */

import { institutionHasAnyTag } from '../../lib/entities.js';
import { RESOURCE_CHAINS } from '../../data/resourceData.js';
import { INSTITUTION_SERVICES } from '../../data/institutionServices.js';
import { LOCALE_SERVICE_OVERRIDES } from '../../data/servicesData.js';
import { GOODS_MODIFIERS_BY_TIER } from '../../data/tradeGoodsData.js';

/**
 * @typedef {Object} InstitutionContribution
 * @property {'economy'|'defense'|'power'|'services'} domain
 * @property {string} label   Short heading for the contribution row.
 * @property {string} detail  The concrete, derived specifics.
 */

/**
 * @typedef {Object} InstitutionProfile
 * @property {string} name
 * @property {(string|null)} oneLiner
 * @property {InstitutionContribution[]} contributions
 */

/**
 * @typedef {Object} InstitutionLike
 * @property {string} [name]
 * @property {string} [catalogId]
 * @property {string} [priorityCategory]
 * @property {string} [category]
 * @property {string[]} [tags]
 */

// Reverse index: institution NAME → the trade goods it gates (goods whose
// requiredInstitution points at it). Built once from the static goods tables.
const GATED_GOODS_BY_INSTITUTION = (() => {
  /** @type {Map<string, string[]>} */
  const map = new Map();
  const tiers = /** @type {Record<string, Record<string, unknown>>} */ (GOODS_MODIFIERS_BY_TIER || {});
  for (const goods of Object.values(tiers)) {
    for (const [goodName, def] of Object.entries(goods || {})) {
      const req = def && typeof def === 'object'
        ? /** @type {{ requiredInstitution?: unknown }} */ (def).requiredInstitution
        : null;
      if (typeof req === 'string' && req) {
        const list = map.get(req) || [];
        if (!list.includes(goodName)) list.push(goodName);
        map.set(req, list);
      }
    }
  }
  return map;
})();

// Institution priorityCategory → the faction category that would back it.
const INST_CATEGORY_TO_FACTION = /** @type {Record<string, string>} */ (Object.freeze({
  economy: 'economy',
  crafts: 'economy',
  trade: 'economy',
  military: 'military',
  government: 'government',
  noble: 'noble',
  religion: 'religious',
  religious: 'religious',
  magic: 'magic',
  criminal: 'criminal',
}));

// defenseProfile.institutions bucket key → the defence role label.
const DEFENSE_BUCKET_LABEL = /** @type {Record<string, string>} */ (Object.freeze({
  walls: 'Fortification',
  garrison: 'Garrison',
  militia: 'Militia',
  watch: 'Town watch',
  mercenary: 'Mercenary muster',
  charter: 'Defensive charter',
  magicDef: 'Magical defence',
}));

/** Significant (>2 char) lowercase tokens of a name, for fuzzy key resolution.
 *  @param {unknown} name @returns {string[]} */
function tokenize(name) {
  return String(name || '').toLowerCase().split(/[\s'(),/-]+/).filter((t) => t.length > 2);
}

/**
 * Resolve an institution name to an INSTITUTION_SERVICES catalog KEY, mirroring
 * the generator resolver's DETERMINISTIC precedence (exact case-insensitive →
 * LOCALE_SERVICE_OVERRIDES → token-overlap fuzzy match) minus the RNG service
 * rolls — a display count needs the catalog entry, not a rolled instance.
 * @param {(string|null|undefined)} name @returns {(string|null)}
 */
function resolveServiceKey(name) {
  if (!name) return null;
  const catalog = /** @type {Record<string, Record<string, { on?: unknown }>>} */ (INSTITUTION_SERVICES || {});
  const keys = Object.keys(catalog);
  const lower = name.toLowerCase();
  const exact = keys.find((k) => k.toLowerCase() === lower);
  if (exact) return exact;
  const locale = /** @type {Record<string, string>} */ (LOCALE_SERVICE_OVERRIDES || {})[lower];
  if (locale && catalog[locale]) return locale;
  // Token-overlap fallback: the key whose significant tokens best overlap the name.
  const queryTokens = tokenize(name);
  if (!queryTokens.length) return null;
  let bestKey = /** @type {string|null} */ (null);
  let bestScore = 0;
  let bestCoverage = 0;
  for (const key of keys) {
    const keyTokens = tokenize(key);
    let score = 0;
    for (const kt of keyTokens) {
      for (const qt of queryTokens) {
        if (kt === qt) score += 2;
        else if ((kt.length > 3 && qt.startsWith(kt)) || (qt.length > 4 && kt.startsWith(qt))) score += 1;
      }
    }
    // Coverage tiebreak mirrors the generator resolver: on equal score, prefer the
    // key whose own tokens are more fully matched (a tighter, less accidental fit).
    const coverage = score / (keyTokens.length * 2 || 1);
    if (score > bestScore || (score === bestScore && score > 0 && coverage > bestCoverage)) {
      bestScore = score; bestKey = key; bestCoverage = coverage;
    }
  }
  return bestScore > 0 ? bestKey : null;
}

/** How many services the institution's catalog entry offers by default (on:true).
 *  @param {(string|null|undefined)} name @returns {number} */
function serviceCountFor(name) {
  const key = resolveServiceKey(name);
  if (!key) return 0;
  const catalog = /** @type {Record<string, Record<string, { on?: unknown }>>} */ (INSTITUTION_SERVICES || {});
  const entry = catalog[key];
  if (!entry || typeof entry !== 'object') return 0;
  return Object.values(entry).filter((def) => def && def.on === true).length;
}

/** The supply chains this institution can process (tag-first F32 matcher, with
 *  the exact-name fallback), rendered as short "raw → product" strings.
 *  @param {InstitutionLike} inst @returns {string[]} */
function chainsProcessedBy(inst) {
  /** @type {string[]} */ const out = [];
  const chains = /** @type {Record<string, any>} */ (RESOURCE_CHAINS || {});
  for (const chain of Object.values(chains)) {
    const supports =
      institutionHasAnyTag(inst, chain.processingTags || []) ||
      (Array.isArray(chain.processingInstitutions) && chain.processingInstitutions.includes(inst.name));
    if (!supports) continue;
    const product = chain.finalProducts?.[0] || chain.intermediateGoods?.[0] || null;
    out.push(product ? `${chain.rawResource} → ${product}` : String(chain.rawResource || ''));
  }
  return out;
}

/** The backing faction (highest-power faction whose category matches the
 *  institution's), or null.
 *  @param {InstitutionLike} inst @param {any} settlement @returns {(string|null)} */
function backingFaction(inst, settlement) {
  const wanted = INST_CATEGORY_TO_FACTION[inst.priorityCategory || ''];
  if (!wanted) return null;
  const factions = settlement?.powerStructure?.factions;
  if (!Array.isArray(factions)) return null;
  /** @type {any} */ let best = null;
  for (const f of factions) {
    if (f && f.category === wanted && (!best || (f.power || 0) > (best.power || 0))) best = f;
  }
  return best ? (best.faction || best.name || null) : null;
}

/** The defence role this institution fills, or null. Matches by name/catalogId
 *  against the defenseProfile.institutions buckets.
 *  @param {InstitutionLike} inst @param {any} settlement
 *  @returns {({ label: string, bucket: string }|null)} */
function defenseRole(inst, settlement) {
  const buckets = settlement?.defenseProfile?.institutions;
  if (!buckets || typeof buckets !== 'object') return null;
  for (const [bucket, members] of Object.entries(buckets)) {
    if (!Array.isArray(members)) continue;
    const inIt = members.some((m) => m && (m.name === inst.name || (inst.catalogId && m.catalogId === inst.catalogId)));
    if (inIt) return { label: DEFENSE_BUCKET_LABEL[bucket] || bucket, bucket };
  }
  return null;
}

/** Normalize an institution/faction name for tolerant matching: lowercase, drop
 *  parenthetical counts, reduce to alphanumeric words.
 *  @param {unknown} name @returns {string} */
function normInstName(name) {
  return String(name || '').toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
}

/**
 * Find the institution object in a settlement whose name matches `name`,
 * tolerating the "(3-10)" count suffixes and the casing drift between faction
 * and institution labels (so a "Merchant Guilds" faction resolves to the
 * "Merchant guilds (15-40)" institution). Exact case-insensitive match wins; a
 * normalized match is the fallback. Returns null when nothing matches.
 * @param {(string|null|undefined)} name
 * @param {any} settlement
 * @returns {(InstitutionLike|null)}
 */
export function resolveInstitutionByName(name, settlement) {
  if (!name) return null;
  const insts = settlement?.institutions;
  if (!Array.isArray(insts)) return null;
  const lower = String(name).toLowerCase();
  for (const inst of insts) if (inst && String(inst.name || '').toLowerCase() === lower) return inst;
  const norm = normInstName(name);
  if (!norm) return null;
  for (const inst of insts) if (inst && normInstName(inst.name) === norm) return inst;
  return null;
}

/**
 * Derive an institution's identity profile from real settlement data.
 *
 * @param {InstitutionLike|null|undefined} institution
 * @param {any} [settlement]  The settlement the institution belongs to.
 * @returns {InstitutionProfile}
 */
export function deriveInstitutionProfile(institution, settlement = {}) {
  const inst = institution || {};
  const name = inst.name || 'Institution';
  /** @type {InstitutionContribution[]} */
  const contributions = [];

  // ── economy: chains processed ──────────────────────────────────────────────
  const chains = chainsProcessedBy(inst);
  if (chains.length) {
    contributions.push({
      domain: 'economy',
      label: 'Processes',
      detail: chains.slice(0, 3).join(', ') + (chains.length > 3 ? `, +${chains.length - 3} more` : ''),
    });
  }

  // ── economy: goods it gates ────────────────────────────────────────────────
  const gated = GATED_GOODS_BY_INSTITUTION.get(name) || [];
  if (gated.length) {
    contributions.push({
      domain: 'economy',
      label: 'Gates production of',
      detail: gated.slice(0, 4).join(', ') + (gated.length > 4 ? `, +${gated.length - 4} more` : ''),
    });
  }

  // ── defense: the role it fills ─────────────────────────────────────────────
  const defense = defenseRole(inst, settlement);
  if (defense) {
    contributions.push({ domain: 'defense', label: defense.label, detail: 'Contributes to settlement defence.' });
  }

  // ── power: backing faction ─────────────────────────────────────────────────
  const backer = backingFaction(inst, settlement);
  if (backer) {
    contributions.push({ domain: 'power', label: 'Backed by', detail: backer });
  }

  // ── services: catalog count ────────────────────────────────────────────────
  const serviceCount = serviceCountFor(name);
  if (serviceCount > 0) {
    contributions.push({
      domain: 'services',
      label: 'Services offered',
      detail: `${serviceCount} service${serviceCount > 1 ? 's' : ''} in its catalog`,
    });
  }

  return { name, oneLiner: null, contributions };
}
