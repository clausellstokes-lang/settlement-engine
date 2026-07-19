/**
 * domain/traditions/politics.js — THE TRADITIONS wave (Engine Lift #4), slice T-3: POLITICS.
 *
 * A POWER owns each tradition, and ownership mutates with settlement state (owner spec
 * §0; DESIGN_TRADITIONS §6 OWNERSHIP + §7 MUTATION are this leaf's law). This pure leaf
 * holds the ownership machinery the T-2 mover calls once per lit tick:
 *   • ASSIGNMENT AT MINT (§6): each founding record is handed to a POWER by motif-fit —
 *     the founding core + civic feasts to the ruling SEAT (governingFactionOf); devotional
 *     motifs to a religious faction/institution; fair/market to merchant/craft; contests to
 *     the military. Seeded tie-breaks; a settlement with no matching power leaves the record
 *     on the seat, or unowned (the interim, full-weight routing) when there is no seat.
 *   • REASSIGNMENT CHECKPOINTS (§6, T3-b): a power transfer re-anchors seat-owned records to
 *     the new seat (and the ascendant regime may claim others); a vanished institution orphans
 *     its records; a new patron re-dedicates devotional ones; the urban-fabric leader turning
 *     re-anchors the district-bound ones.
 *   • MUTATION (§7, T3-b): tier crossings scale a record up; a generation reshapes its keeping
 *     (~30-year seeded drift). Core motif is IMMUTABLE forever; only the EXPRESSION, scale, and
 *     ownership move — every change appends a mutationLog {year, kind, cause} row (the tradition's
 *     own readable history, provenance-grade for the dossier register).
 *
 * KEY DISCIPLINE (§6/§17 recon hazard): the REAL powerStructure.factions[] carry the name in
 * `.faction` (NOT `.name`/`.id`); the ladder's own key fn would collapse them. The owner key is
 * therefore `fac.${slug(nameOf(f))}` — nameOf (rulingPower) prefers `.faction`, falling back to
 * `.name`, so it agrees with every real generated faction while never collapsing a `.name`-only
 * entry to `fac.unknown`. Institutions have no instance id, so they key by `inst.${slug(name)}`
 * and REASSIGN when the institution leaves the roster (the orphan check).
 *
 * PURITY: a true domain leaf — no store/React import, no Date/Math.random/localeCompare. All
 * entropy is a SEEDED PRNG (the settlement seed for tie-breaks; tick-invariant world-seed forks
 * for the claim roll), so the same campaign yields the same ownership history on any device. The
 * canonical faction helpers (governingFactionOf/nameOf/factionArchetype) are imported back from
 * the eager rulingPower layer — the blessed lazy → eager direction (rulingPower.js §extraction).
 */

import { createPRNG } from '../../kernel/prng.js';
import { slugify } from '../../kernel/slugify.js';
import { governingFactionOf, nameOf } from '../rulingPower.js';
import { factionArchetype, FACTION_ARCHETYPES } from '../factionArchetypes.js';

/** @typedef {import('./genesis.js').TraditionRec} TraditionRec */
/** @typedef {Parameters<typeof nameOf>[0]} RulingFactionLike */

const A = FACTION_ARCHETYPES;

// ── narrowing helpers (self-contained; the kernel's asObject idiom, 0-hole) ──
/** @param {unknown} x @returns {Record<string, unknown>} */
function asObject(x) {
  return x && typeof x === 'object' && !Array.isArray(x) ? /** @type {Record<string, unknown>} */ (x) : {};
}
/** Codepoint-stable compare (byte-stable ordering). @param {string} a @param {string} b @returns {number} */
function cmp(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
/** The owner-key token — slug of a name, byte-stable, never empty. @param {unknown} name @returns {string} */
function tokenOf(name) {
  return slugify(String(name ?? ''), { sep: '_', max: 80, fallback: 'unknown', empty: 'unknown' });
}

// ── OWNER KEYS (§6 — the REAL `.faction` shape via nameOf; institutions by name) ──
/** The stable owner key for a faction entry (`fac.<slug>`; nameOf prefers `.faction`).
 *  @param {unknown} faction @returns {string} */
export function factionOwnerKey(faction) {
  return `fac.${tokenOf(nameOf(/** @type {RulingFactionLike} */ (faction)))}`;
}
/** The stable owner key for an institution (`inst.<slug>`; institutions have no id).
 *  @param {unknown} name @returns {string} */
export function institutionOwnerKey(name) {
  return `inst.${tokenOf(name)}`;
}

// ── the settlement seed (the genesis idiom, so owner tie-breaks are device-stable) ──
/** @param {Record<string, unknown>} settlement @returns {string} */
function settlementSeedOf(settlement) {
  const identity = asObject(settlement.identity);
  return String(settlement._seed ?? settlement.id ?? identity.seed ?? 'tradition-seedless');
}

// ── MOTIF → desired owner archetype (§6 assignment table) ──────────────────────
// The origin + civic observances belong to the SEAT; devotional to the temple; the
// fair/market to commerce; the contest to the garrison. Founding elements are the
// singular origin and always seat-held (guarantees ≥1 seat record — the seat-change sensor).
const FOUNDING_ELEMENTS = new Set(['founding', 'first-landing', 'charter']);
const DEVOTIONAL_ACTS = new Set(['offering', 'vigil']);
const DEVOTIONAL_ELEMENTS = new Set(['the-dead', 'stars']);
const SEAT = 'seat';
const MERCHANTRY = 'merchantry';

/** @param {TraditionRec} rec @param {number} index @returns {string} a FACTION_ARCHETYPES value, SEAT, or MERCHANTRY */
function desiredArchetype(rec, index) {
  const motif = asObject(/** @type {Record<string, unknown>} */ (rec).coreMotif);
  const element = String(motif.element || '');
  const act = String(motif.act || '');
  if (index === 0 || FOUNDING_ELEMENTS.has(element)) return SEAT;
  const deityRef = /** @type {Record<string, unknown>} */ (rec).deityRef;
  if ((typeof deityRef === 'string' && deityRef) || DEVOTIONAL_ACTS.has(act) || DEVOTIONAL_ELEMENTS.has(element)) return A.RELIGIOUS;
  if (act === 'fair' || element === 'market') return MERCHANTRY;
  if (act === 'contest') return A.MILITARY;
  return SEAT;
}

/** Does a candidate archetype satisfy the desired archetype? @param {string} want @param {string} got @returns {boolean} */
function archetypeMatches(want, got) {
  if (want === MERCHANTRY) return got === A.MERCHANT || got === A.CRAFT;
  return got === want;
}

/**
 * @typedef {Object} OwnerCandidate
 * @property {string} key
 * @property {('faction'|'institution')} kind
 * @property {string} label
 */

/** The seat owner (governingFactionOf), or nulls when there is no ruling seat.
 *  @param {Record<string, unknown>} settlement
 *  @returns {{ key: string|null, label: string|null }} */
function seatOwnerOf(settlement) {
  const seat = governingFactionOf(/** @type {Parameters<typeof governingFactionOf>[0]} */ (settlement));
  if (!seat) return { key: null, label: null };
  return { key: factionOwnerKey(seat), label: nameOf(seat) || null };
}

/** All owner candidates (factions + institutions), each with its canonical archetype.
 *  @param {Record<string, unknown>} settlement
 *  @returns {Array<OwnerCandidate & { archetype: string }>} */
function ownerCandidatesOf(settlement) {
  /** @type {Array<OwnerCandidate & { archetype: string }>} */
  const out = [];
  const ps = asObject(settlement.powerStructure);
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  for (const f of factions) {
    const label = nameOf(/** @type {RulingFactionLike} */ (f));
    if (!label) continue;
    out.push({ key: factionOwnerKey(f), kind: 'faction', label, archetype: factionArchetype(/** @type {Parameters<typeof factionArchetype>[0]} */ (f)) });
  }
  const institutions = Array.isArray(settlement.institutions) ? settlement.institutions : [];
  for (const raw of institutions) {
    const inst = asObject(raw);
    const label = typeof inst.name === 'string' ? inst.name : '';
    if (!label) continue;
    out.push({ key: institutionOwnerKey(label), kind: 'institution', label, archetype: factionArchetype(/** @type {Parameters<typeof factionArchetype>[0]} */ (inst)) });
  }
  return out;
}

/** Pick the owner for a desired archetype among candidates — seeded tie-break, byte-stable
 *  ordering. Prefers a faction over an institution of equal fit (a named power carries a
 *  tradition better than a building). Returns null when nothing matches.
 *  @param {string} want @param {Array<OwnerCandidate & { archetype: string }>} candidates
 *  @param {ReturnType<typeof createPRNG>} rng @returns {OwnerCandidate|null} */
function pickOwner(want, candidates, rng) {
  const matches = candidates
    .filter((c) => archetypeMatches(want, c.archetype))
    .sort((x, y) => (x.kind === y.kind ? cmp(x.key, y.key) : x.kind === 'faction' ? -1 : 1));
  if (!matches.length) return null;
  // Keep only the preferred kind, then seeded-pick among the equals.
  const topKind = matches[0].kind;
  const pool = matches.filter((c) => c.kind === topKind);
  const chosen = pool[rng.randInt(0, pool.length - 1)];
  return { key: chosen.key, kind: chosen.kind, label: chosen.label };
}

/** Stamp an owner onto a record (a new object; never mutate the input).
 *  @param {TraditionRec} rec @param {string|null} key @param {('faction'|'institution'|'seat'|null)} kind @param {string|null} label @returns {TraditionRec} */
function withOwner(rec, key, kind, label) {
  return /** @type {TraditionRec} */ ({ ...rec, ownerKey: key, ownerKind: kind, ownerLabel: label });
}

/**
 * §6 ASSIGNMENT — hand each founding record to a POWER by motif-fit. Pure, seeded,
 * deterministic from the settlement seed alone (so two lit runs assign identically).
 * @param {TraditionRec[]} recs @param {Record<string, unknown>} settlement @returns {TraditionRec[]}
 */
export function assignOwnership(recs, settlement) {
  const seat = seatOwnerOf(settlement);
  const candidates = ownerCandidatesOf(settlement);
  const root = createPRNG(`${settlementSeedOf(settlement)}::tradition:owner`);
  return recs.map((rec, i) => {
    const want = desiredArchetype(rec, i);
    if (want === SEAT) return withOwner(rec, seat.key, seat.key ? 'seat' : null, seat.label);
    const chosen = pickOwner(want, candidates, root.fork(`pick:${/** @type {Record<string, unknown>} */ (rec).id}`));
    if (chosen) return withOwner(rec, chosen.key, chosen.kind, chosen.label);
    // no matching power ⇒ fall to the seat, else leave unowned (interim, full-weight routing).
    return withOwner(rec, seat.key, seat.key ? 'seat' : null, seat.label);
  });
}

/**
 * Advance a settlement's ownership one lit tick. T3-a scope: assign ownership at the
 * FIRST-LIT mint; carry ownership unchanged otherwise (the reassignment checkpoints +
 * §7 mutations land in T3-b). Returns the possibly-new records + whether anything changed.
 * @param {Object} a
 * @param {TraditionRec[]} a.recs
 * @param {Record<string, unknown>} a.settlement
 * @param {Record<string, unknown>} a.worldState
 * @param {string} a.sid
 * @param {number} a.year
 * @param {boolean} a.minted
 * @returns {{ recs: TraditionRec[], changed: boolean }}
 */
export function advancePolitics({ recs, settlement, minted }) {
  if (minted) return { recs: assignOwnership(recs, settlement), changed: true };
  return { recs, changed: false };
}

// ── EFFECT ROUTING (§6 stakes) ─────────────────────────────────────────────────
/** Half a legitimacy hit, rounded away from zero so a ±1 hit never vanishes (a
 *  faction/institution-owned festival reflects on the town at HALF weight until the
 *  faction.power write seam opens — §16). JUDGMENT — say "veto".
 *  @param {number} hit @returns {number} */
export function halfWeightHit(hit) {
  return Math.sign(hit) * Math.round(Math.abs(hit) / 2);
}

/** The legitimacy delta an outcome lands on the SETTLEMENT's publicLegitimacy, routed by
 *  owner (§6): the seat (or the interim unowned record) bears the full hit; a faction/
 *  institution owner bears half (display-side accountability — the news names them).
 *  @param {number} hit @param {unknown} ownerKind @returns {number} */
export function routedLegitimacyHit(hit, ownerKind) {
  if (ownerKind === 'faction' || ownerKind === 'institution') return halfWeightHit(hit);
  return hit;
}
