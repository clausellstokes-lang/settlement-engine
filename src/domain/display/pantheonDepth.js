/**
 * domain/display/pantheonDepth.js — read-side projection of the LIVE pantheon
 * ledger for the Realm Pantheon section's "depth" view.
 *
 * Three pure projections over `worldState.pantheon` (+ the regional graph's
 * religious_authority channels), with NO rng, NO worldState mutation, NO contest
 * re-run. The conversion contest itself is a pulse evaluator (religiousContest.js)
 * and is NEVER touched here — this module derives a PREVIEW of who is positioned to
 * contest whom from the already-computed live ledgers and graph channels.
 *
 *   - seatsFromMajor(entry)   — how many seats a deity is from promotion to MAJOR,
 *     using the SAME PANTHEON_TUNING.MAJOR_PROMOTE threshold the engine ratchets on
 *     (re-exported, never re-typed — a re-tune flows here automatically).
 *   - contestPreview({ ... })  — the pairs of deities projecting religious_authority
 *     into the SAME convert settlement (the front line of the conversion contest),
 *     codepoint-sorted, deduped. Empty when no two faiths overlap.
 *   - pantheonDepthModel({ ... }) — the consolidated model the panel renders.
 *
 * INERT WHEN DORMANT. A deity-free campaign carries no `pantheon` key ⇒ every
 * projection returns []/an empty model ⇒ the section renders nothing extra
 * (byte-identical off-state — the dormancy guarantee).
 */

import { PANTHEON_TUNING } from '../worldPulse/pantheon.js';

// Re-export the engine threshold verbatim — this module is presentation-only and
// must read the SAME promote boundary the engine ratchets on, never a copy.
export const MAJOR_PROMOTE_SEATS = PANTHEON_TUNING.MAJOR_PROMOTE;

// The same deity rank → 0..1 base strength the religion contest reads (major 0.95 /
// minor 0.6 / cult 0.35), sourced from the tuning leaf so the pantheon strength
// meter reads the engine's own number, never a re-typed copy.
const DEITY_RANK_STRENGTH = PANTHEON_TUNING.DEITY_RANK_STRENGTH;

/**
 * The 0..1 base strength of a deity tier (cult/minor/major), from the engine's own
 * DEITY_RANK_STRENGTH. Unknown tiers resolve to the minor mid-point (the engine's
 * own fallback). Pure lookup; the panel's strength meter reads this by tier.
 * @param {string} tier
 * @returns {number} 0..1
 */
export function deityTierStrength(tier) {
  return /** @type {Record<string, number>} */ (DEITY_RANK_STRENGTH)[String(tier)] ?? DEITY_RANK_STRENGTH.minor;
}

/** @param {any} a @param {any} b @returns {number} */
const codepoint = (a, b) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);

/**
 * A human-friendly deity display name from its ledger id. The id is a stable ref
 * (`deity:Vael` / `custom:...`); the tail after the last `:`/`_` is the name.
 * @param {any} deityId
 * @returns {string}
 */
export function deityDisplayName(deityId) {
  const tail = String(deityId == null ? '' : deityId).split(/[:_]/).filter(Boolean).pop() || String(deityId);
  return tail.charAt(0).toUpperCase() + tail.slice(1);
}

/**
 * How many seats this deity is from MAJOR. 0 when it already holds (or exceeds)
 * the major-promote threshold. Pure function of seats — uses the engine's
 * MAJOR_PROMOTE, so a threshold re-tune is reflected without a copy.
 * @param {{ seats?: number, tier?: string }} entry
 * @returns {number} seats remaining to reach MAJOR (0 when already there).
 */
export function seatsFromMajor(entry) {
  const seats = Number.isFinite(entry?.seats) ? Number(entry.seats) : 0;
  if (entry?.tier === 'major') return 0;
  return Math.max(0, MAJOR_PROMOTE_SEATS - seats);
}

/**
 * A deity's faith STATUS word, derived from the real ledger fields (tier + the
 * cumulative win/loss conversion record). A cult is named for its tier; a faith
 * with a net positive conversion record is Ascendant, a net negative one is Waning,
 * and an even/empty record falls back to the tier-neutral "Established". This reads
 * only fields that exist on the ledger entry — it never invents a per-tick trend the
 * data cannot support (the record is cumulative, which is the honest signal here).
 * @param {{ tier?: string, wins?: number, losses?: number }} entry
 * @returns {'Cult'|'Ascendant'|'Waning'|'Established'}
 */
export function deityStatusWord(entry) {
  if (String(entry?.tier) === 'cult') return 'Cult';
  const wins = Number.isFinite(entry?.wins) ? Number(entry.wins) : 0;
  const losses = Number.isFinite(entry?.losses) ? Number(entry.losses) : 0;
  if (wins > losses) return 'Ascendant';
  if (losses > wins) return 'Waning';
  return 'Established';
}

/**
 * The pantheon ledger as a sorted, normalized array of deity entries (descending
 * seats, then codepoint id). [] when dormant/absent.
 * @param {any} worldState
 * @returns {Array<{ id: string, seats: number, wins: number, losses: number, tier: string, fromMajor: number }>}
 */
export function pantheonStandings(worldState) {
  const pantheon = worldState?.pantheon && typeof worldState.pantheon === 'object'
    ? worldState.pantheon
    : null;
  if (!pantheon) return [];
  /** @type {Array<{ id: string, seats: number, wins: number, losses: number, tier: string, fromMajor: number }>} */
  const out = [];
  for (const id of Object.keys(pantheon)) {
    const entry = pantheon[id] || {};
    const norm = {
      id: String(id),
      seats: Number.isFinite(entry.seats) ? Number(entry.seats) : 0,
      wins: Number.isFinite(entry.wins) ? Number(entry.wins) : 0,
      losses: Number.isFinite(entry.losses) ? Number(entry.losses) : 0,
      tier: entry.tier || 'cult',
      fromMajor: 0,
    };
    norm.fromMajor = seatsFromMajor(norm);
    out.push(norm);
  }
  out.sort((a, b) => (b.seats - a.seats) || codepoint(a.id, b.id));
  return out;
}

/**
 * Resolve the deity id projecting authority along a religious_authority channel.
 * The channel may name the deity explicitly (`deityId`/`deityRef`) or fall back to
 * the carrier settlement's embedded primary-deity ref. Null when unresolvable.
 * @param {any} channel
 * @param {Map<string, string>} carrierDeity  settlementId → deity ref
 * @returns {string | null}
 */
function channelDeity(channel, carrierDeity) {
  const explicit = channel?.deityId || channel?.deityRef;
  if (explicit != null) return String(explicit);
  const fromDeity = carrierDeity.get(String(channel?.from));
  return fromDeity != null ? String(fromDeity) : null;
}

/**
 * The CONVERSION-CONTEST PREVIEW: pairs of deities whose religious_authority
 * channels project into the SAME convert settlement — the front line where a
 * conversion contest can occur. This does NOT re-run the contest (that is a pulse
 * evaluator); it reads the live graph + ledger and reports who is positioned
 * against whom, with each side's current seat count.
 *
 * `carrierDeity` lets a channel that omits an explicit deity fall back to its
 * carrier settlement's embedded deity. Pairs are unordered (codepoint-sorted) and
 * deduped; [] when no two distinct faiths share a convert.
 *
 * @param {Object} args
 * @param {any} args.worldState
 * @param {any} [args.regionalGraph]
 * @param {Map<string, string>} [args.carrierDeity] settlementId → deity ref
 * @returns {Array<{ contestedId: string, aId: string, bId: string, aSeats: number, bSeats: number }>}
 */
export function contestPreview({ worldState, regionalGraph, carrierDeity } = /** @type {any} */ ({})) {
  const pantheon = worldState?.pantheon && typeof worldState.pantheon === 'object'
    ? worldState.pantheon
    : null;
  if (!pantheon) return [];
  const channels = Array.isArray(regionalGraph?.channels) ? regionalGraph.channels : [];
  const carrier = carrierDeity instanceof Map ? carrierDeity : new Map();

  // convert settlement -> set of deity ids projecting authority into it.
  /** @type {Map<string, Set<string>>} */
  const faithsByConvert = new Map();
  for (const channel of channels) {
    if (channel?.type !== 'religious_authority') continue;
    if (channel.status !== 'confirmed') continue;
    if (channel.to == null) continue;
    const deity = channelDeity(channel, carrier);
    if (deity == null) continue;
    const convert = String(channel.to);
    const set = faithsByConvert.get(convert) || new Set();
    set.add(deity);
    faithsByConvert.set(convert, set);
  }

  const seatsOf = (/** @type {string} */ id) => {
    const entry = pantheon[id] || {};
    return Number.isFinite(entry.seats) ? Number(entry.seats) : 0;
  };

  /** @type {Array<{ contestedId: string, aId: string, bId: string, aSeats: number, bSeats: number }>} */
  const out = [];
  const seen = new Set();
  for (const convert of [...faithsByConvert.keys()].sort(codepoint)) {
    const faiths = [...(faithsByConvert.get(convert) || new Set())].sort(codepoint);
    for (let i = 0; i < faiths.length; i += 1) {
      for (let j = i + 1; j < faiths.length; j += 1) {
        const aId = faiths[i];
        const bId = faiths[j];
        const key = `${convert}|${aId}|${bId}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ contestedId: convert, aId, bId, aSeats: seatsOf(aId), bSeats: seatsOf(bId) });
      }
    }
  }
  return out;
}

/**
 * The consolidated pantheon-depth model the Realm Pantheon section renders:
 * standings (each with seats-from-major) + the contest preview. Empty (both
 * arrays []) when religion is dormant — the section then renders nothing extra.
 *
 * @param {Object} args
 * @param {any} args.worldState
 * @param {any} [args.regionalGraph]
 * @param {Map<string, string>} [args.carrierDeity] settlementId → deity ref
 * @returns {{ standings: ReturnType<typeof pantheonStandings>, contests: ReturnType<typeof contestPreview>, majorPromoteSeats: number }}
 */
export function pantheonDepthModel({ worldState, regionalGraph, carrierDeity } = /** @type {any} */ ({})) {
  return {
    standings: pantheonStandings(worldState),
    contests: contestPreview({ worldState, regionalGraph, carrierDeity }),
    majorPromoteSeats: MAJOR_PROMOTE_SEATS,
  };
}
