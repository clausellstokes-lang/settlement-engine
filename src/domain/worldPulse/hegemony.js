/**
 * domain/worldPulse/hegemony.js — THE UNNAMED EMPIRE, the DOMAIN leaf (ruling 3,
 * DESIGN_SIM_DEPTH_R2 D4(a) / the frozen DESIGN_COHESION_WEAVE §F.3b). The hegemony
 * COMPUTATION lives here so the reason half (warReasons: fear_of_dominance) reads the
 * DOMAIN leaf directly and the display (display/hegemonyRead.js) is a THIN WRAPPER over
 * it — display reads domain, NEVER the reverse. The public API (hegemonyRead / hasHegemony
 * / HEGEMONY_TUNING / SUBORDINATING_TERM_TYPES) is unchanged; the display wrapper's tests
 * pass verbatim.
 *
 * Hegemony is A PATTERN, NEVER AN ENTITY: the engine mints no empire object, no imperial
 * ledger, no name. This read DERIVES the pattern each call from the existing treaty
 * topology — a center C holding ≥K subordinate ties (tribute / compelled-alliance /
 * puppet-seat / occupation) forms a sphere. When the edges dissolve the "empire" simply
 * stops matching — no lifecycle, no death event, no persistence, no undo burden (per
 * §F.3b's own pins: ZERO persisted state).
 *
 *   • Legibility (design §F.3b): a RealmDashboard cluster line + the brief's COUNT
 *     ("seven towns pay tribute to Thornwall"). Descriptive ALWAYS; christened only by
 *     the DM (the injected `canonLabelFor` resolver).
 *   • The reason half (`fear_of_dominance`, D4(b)) CONSUMES the sphere read via a
 *     BELIEF-SIDE `strengthOf` (a fogged observer fears the empire it BELIEVES in) — the
 *     aggregate strength INCLUDES naval capability (a maritime hegemon frightens the ports
 *     it can blockade). navalStrength enters through the CALLER's injected strengthOf, so
 *     this leaf stays pure (no naval/martial imports).
 *
 * PURE; no store, no rng, no wall clock; INERT-NOT-CRASH on absent/garbage ledgers; every
 * list codepoint-sorted (same input ⇒ identical output; zero writes). Lazy-only (rides the
 * sim / dashboard chunk) so budget-free — byte-inert to the engine and its goldens.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { getSpatialLedger } from '../spatial/distanceRead.js';
import { treatyOrientationOf } from './treatyOrientation.js';

/** Tuning — exported so the D4 reason half reads the SAME threshold. */
export const HEGEMONY_TUNING = Object.freeze({
  /** ≥K distinct subordinate ties on one center ⇒ a sphere (§F.3b K). */
  MIN_TIES: 3,
  /** aggregate-strength-share bands (share of realm strength held by the sphere). */
  SHARE_BANDS: Object.freeze([
    { floor: 0.5, band: 'dominant', phrase: 'commands the lion’s share of the realm’s strength' },
    { floor: 0.33, band: 'major', phrase: 'holds a great part of the realm’s strength' },
    { floor: 0.2, band: 'regional', phrase: 'holds a regional preponderance' },
    { floor: 0, band: 'minor', phrase: 'holds a modest bloc' },
  ]),
});

/**
 * The §11-product term types that constitute a SUBORDINATE tie (one polity bent
 * under another). resource_share is deliberately EXCLUDED — it is extraction, not
 * subordination of the polity (matches the design's named list: vassal / tribute /
 * compelled-ally / puppet-seat / garrison-protectorate). Satellites/steadings are
 * PROPERTY, not vassals — they never appear as treaty parties, so they are excluded
 * from subordinate-tie counting by construction. JUDGMENT — vetoable.
 */
export const SUBORDINATING_TERM_TYPES = Object.freeze([
  'tribute', 'compelled_alliance', 'puppet_seat', 'occupation_continuation',
]);
const SUBORDINATING = new Set(SUBORDINATING_TERM_TYPES);

/** The count-phrase verb per dominant tie type (§F.3b brief: "pay tribute to"). */
const TIE_VERB = Object.freeze({
  tribute: 'pay tribute to',
  compelled_alliance: 'march under',
  puppet_seat: 'are seated by',
  occupation_continuation: 'are garrisoned by',
});

/** @param {unknown} v @param {number} [d] @returns {number} */
function num(v, d = 0) { return Number.isFinite(Number(v)) ? Number(v) : d; }

/** worst compliance over a term set: honored < strained < defaulted. @param {string} s */
function rankCompliance(s) { return s === 'defaulted' ? 2 : s === 'strained' ? 1 : 0; }
const COMPLIANCE_WORD = Object.freeze(['honored', 'strained', 'defaulted']);

/** A ledger row carries EITHER the war pair or the sale pair (drop-when-absent, T4) —
 *  `treatyOrientationOf` is what resolves either into the two roles this leaf needs.
 *  @typedef {{ victorId?: unknown, loserId?: unknown, sellerId?: unknown, buyerId?: unknown,
 *    parties?: unknown, terms?: unknown }} TreatyShape */
/** @typedef {{ id?: unknown, name?: unknown, settlement?: { name?: unknown } | null }} NameItem */

/** @param {unknown} worldState @returns {Record<string, TreatyShape> | null} */
function treatyLedger(worldState) {
  const led = getSpatialLedger(/** @type {Record<string, unknown>} */ (worldState), 'treaties');
  return led && typeof led === 'object' && !Array.isArray(led) ? /** @type {Record<string, TreatyShape>} */ (led) : null;
}

/**
 * A settlementId → display-name lookup from a settlement list (snapshot `{id,name}`
 * or save `{id, settlement:{name}}` shape). Mirrors realmArcSummary.buildNameById.
 * @param {NameItem[]} settlements @returns {Map<string,string>}
 */
function buildNameById(settlements) {
  /** @type {Map<string,string>} */
  const map = new Map();
  for (const item of Array.isArray(settlements) ? settlements : []) {
    const id = item?.id != null ? String(item.id) : null;
    const name = item?.name || item?.settlement?.name;
    if (id && name) map.set(id, String(name));
  }
  return map;
}

/** @param {number} share @returns {{ band: string, phrase: string }} */
function shareBand(share) {
  const s = Math.max(0, Math.min(1, num(share)));
  const b = HEGEMONY_TUNING.SHARE_BANDS.find((x) => s >= x.floor) || HEGEMONY_TUNING.SHARE_BANDS[HEGEMONY_TUNING.SHARE_BANDS.length - 1];
  return { band: b.band, phrase: b.phrase };
}

const STRAIN_BANDS = Object.freeze([
  { floor: 0.5, band: 'crumbling', phrase: 'its bonds are fraying badly — the crumbling has begun' },
  { floor: 0.0001, band: 'fraying', phrase: 'a few of its bonds are strained' },
  { floor: 0, band: 'firm', phrase: 'its bonds hold firm' },
]);

/** @param {number} frac fraction of subordinate ties strained-or-worse */
function strainBand(frac) {
  const f = Math.max(0, Math.min(1, num(frac)));
  const b = STRAIN_BANDS.find((x) => f >= x.floor) || STRAIN_BANDS[STRAIN_BANDS.length - 1];
  return { band: b.band, phrase: b.phrase };
}

/**
 * THE HEGEMONY READ — every sphere the current treaty topology exhibits. Pure;
 * derives from the `treaties` spatial ledger with ZERO persisted state. Dormant
 * (no ledger / no qualifying center) ⇒ `{ spheres: [], hasHegemony: false }`.
 *
 * @param {Object} args
 * @param {{ tick?: number, spatialLedgers?: unknown } | null | undefined} args.worldState
 * @param {NameItem[]} [args.settlements]  name + realm-strength source (snapshot or save shape).
 * @param {number} [args.minTies]          override the §F.3b K threshold.
 * @param {(id: string) => number} [args.strengthOf]  id → land+naval strength (default 1 ⇒ headcount share).
 * @param {(id: string) => string} [args.nameFor]     id → display name (default: settlements list, then id).
 * @param {(centerId: string) => (string|null)} [args.canonLabelFor]  DM-authored christened label, if any.
 * @param {boolean} [args.includeGroundTruth]  DM surfaces ⇒ adds a raw `truth` block.
 * @returns {{ spheres: Array<Record<string, unknown>>, hasHegemony: boolean }}
 */
export function hegemonyRead({
  worldState,
  settlements = [],
  minTies = HEGEMONY_TUNING.MIN_TIES,
  strengthOf,
  nameFor,
  canonLabelFor,
  includeGroundTruth = false,
} = /** @type {never} */ ({})) {
  const ledger = treatyLedger(worldState);
  if (!ledger) return { spheres: [], hasHegemony: false };

  const nameById = buildNameById(settlements);
  const resolveName = typeof nameFor === 'function' ? nameFor : (/** @type {string} */ id) => nameById.get(String(id)) || String(id);
  const resolveStrength = typeof strengthOf === 'function' ? (/** @type {string} */ id) => Math.max(0, num(strengthOf(String(id)))) : () => 1;
  const resolveCanon = typeof canonLabelFor === 'function' ? canonLabelFor : () => null;
  const K = Math.max(1, Math.floor(num(minTies, HEGEMONY_TUNING.MIN_TIES)));

  // center → sub → { worst compliance rank, dominant tie type }.
  /** @type {Map<string, Map<string, { rank: number, type: string }>>} */
  const byCenter = new Map();
  /** @type {Set<string>} */
  const knownIds = new Set();

  for (const key of Object.keys(ledger).sort(compareCodepoint)) {
    const treaty = ledger[key];
    if (!treaty || typeof treaty !== 'object') continue;
    // WHO HOLDS THE TIE — THROUGH THE ONE ORIENTATION READER (CR-WR10-G). A sphere is a
    // pattern in the OBLIGATION axis: the center is the party the subordinating terms are
    // owed to, the sub is the party they bind. On a war settlement that is the victor over
    // the loser, exactly as the two raw fields spelled it here for years. On a WR-10 sale
    // it is the SELLER over the buyer that is still paying for the town — and the raw
    // spelling read that document as the string "undefined" on both sides, so a bought
    // court's real subordination never entered a sphere at all.
    const orientation = treatyOrientationOf(treaty);
    const centerId = orientation.obligeeId;
    const subId = orientation.obligorId;
    for (const p of Array.isArray(treaty.parties) ? treaty.parties : []) knownIds.add(String(p));
    if (centerId) knownIds.add(centerId);
    if (subId) knownIds.add(subId);
    if (!centerId || !subId || centerId === subId) continue;
    const terms = Array.isArray(treaty.terms) ? treaty.terms : [];
    // worst subordinating term on this treaty sets the tie strain; first-listed
    // subordinating type (codepoint-stable via SUBORDINATING_TERM_TYPES order) names it.
    let worst = -1;
    let tieType = '';
    for (const t of terms) {
      const type = String(t?.type ?? '');
      if (!SUBORDINATING.has(type)) continue;
      const rank = rankCompliance(String(t?.complianceState ?? 'honored'));
      if (rank > worst) { worst = rank; tieType = type; }
      else if (rank === worst && SUBORDINATING_TERM_TYPES.indexOf(type) < SUBORDINATING_TERM_TYPES.indexOf(tieType)) { tieType = type; }
    }
    if (worst < 0) continue; // no subordinating term ⇒ not a subordinate tie
    let subs = byCenter.get(centerId);
    if (!subs) { subs = new Map(); byCenter.set(centerId, subs); }
    const prior = subs.get(subId);
    if (!prior || worst > prior.rank) subs.set(subId, { rank: worst, type: tieType || SUBORDINATING_TERM_TYPES[0] });
  }

  // realm-total strength for the share denominator (known ids only; a display band).
  let realmStrength = 0;
  for (const id of knownIds) realmStrength += resolveStrength(id);
  if (!(realmStrength > 0)) realmStrength = knownIds.size || 1;

  /** @type {Array<Record<string, unknown>>} */
  const spheres = [];
  for (const centerId of [...byCenter.keys()].sort(compareCodepoint)) {
    const subs = byCenter.get(centerId);
    if (!subs || subs.size < K) continue;
    const memberIds = [...subs.keys()].sort(compareCodepoint);
    const members = memberIds.map((id) => {
      const info = /** @type {{ rank: number, type: string }} */ (subs.get(id));
      return {
        id, name: resolveName(id), tieType: info.type,
        strain: COMPLIANCE_WORD[Math.max(0, Math.min(2, info.rank))],
      };
    });
    // aggregate strength share (center + members) / realm.
    let sphereStrength = resolveStrength(centerId);
    for (const id of memberIds) sphereStrength += resolveStrength(id);
    const share = Math.max(0, Math.min(1, sphereStrength / realmStrength));
    const sb = shareBand(share);
    // strain summary over the subordinate ties.
    const strainedCount = members.filter((m) => m.strain !== 'honored').length;
    const strain = strainBand(members.length ? strainedCount / members.length : 0);
    // dominant tie verb for the count-phrase (most common type; codepoint tie-break).
    /** @type {Record<string, number>} */
    const typeCounts = {};
    for (const m of members) typeCounts[m.tieType] = (typeCounts[m.tieType] || 0) + 1;
    const dominantType = Object.keys(typeCounts).sort((a, b) => (typeCounts[b] - typeCounts[a]) || compareCodepoint(a, b))[0] || 'tribute';
    const centerName = resolveName(centerId);
    const canon = resolveCanon(centerId);
    const verb = /** @type {Record<string, string>} */ (TIE_VERB)[dominantType] || 'answer to';
    const brief = `${members.length} ${members.length === 1 ? 'settlement' : 'settlements'} ${verb} ${centerName}.`;
    /** @type {Record<string, unknown>} */
    const sphere = {
      centerId, centerName,
      canonLabel: canon ? String(canon) : null,
      // Descriptive ALWAYS; christened only by the DM (§F.3b reason 3).
      label: canon ? String(canon) : `${centerName} and its tributaries`,
      memberCount: members.length,
      tieCount: members.length,
      members,
      strengthShare: Math.round(share * 1000) / 1000,
      strengthBand: sb.band,
      strengthPhrase: sb.phrase,
      strain: { band: strain.band, phrase: strain.phrase, strainedCount },
      brief,
    };
    if (includeGroundTruth) {
      sphere.truth = {
        realmStrength: Math.round(realmStrength * 1000) / 1000,
        sphereStrength: Math.round(sphereStrength * 1000) / 1000,
        dominantTieType: dominantType,
        tieStrains: members.map((m) => ({ id: m.id, tieType: m.tieType, strain: m.strain })),
      };
    }
    spheres.push(sphere);
  }

  // Strongest sphere first (share desc), codepoint tie-break on center id.
  spheres.sort((a, b) => (Number(b.strengthShare) - Number(a.strengthShare)) || compareCodepoint(String(a.centerId), String(b.centerId)));
  return { spheres, hasHegemony: spheres.length > 0 };
}

/**
 * Panel-presence gate: does the current topology exhibit ANY hegemony sphere?
 * Boolean-only, cheap enough for a per-render store selector; dormant ⇒ false ⇒
 * no surface renders ⇒ byte-identical UI.
 * @param {Parameters<typeof hegemonyRead>[0]} [args] same shape as hegemonyRead.
 * @returns {boolean}
 */
export function hasHegemony(args = /** @type {never} */ ({})) {
  return hegemonyRead(args).hasHegemony;
}
