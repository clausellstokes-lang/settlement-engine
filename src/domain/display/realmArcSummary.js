/**
 * domain/display/realmArcSummary.js — the PUBLIC-SAFE realm-arc digest (SUBSYSTEM
 * INTEGRATION PLAN §S4, gallery coherence).
 *
 * The raw campaign chronicle is DM-private and is stripped by both the client and
 * server gallery sanitizers (publicSafe's /chronicle/i denylist; the server's
 * _gallery_sanitize_public_json). To still let a shared dossier/map carry the
 * epic — "The Ascendancy of X", "The War of Y" — without un-stripping the raw
 * chronicle, we derive a SHORT, scalar, public-safe SUMMARY STRING from the
 * already-public ledgers (pantheon tiers + war/trade state). The string carries
 * NO settlement-private data: only deity display names (authored, public),
 * settlement display names, and coarse counts.
 *
 * This string is the value whitelisted through the gallery sanitizer (mirroring
 * how the event chronicle is a separately-whitelisted column) and shown in
 * GalleryDetail. Because it is DERIVED here (not the raw chronicle), the sanitizer
 * never has to expose anything private.
 *
 * Pure: no store, no React, no wall clock, no rng. Codepoint-stable.
 */

import { liveSieges, liveTradeWars } from './warStatus.js';

/** @param {any} a @param {any} b @returns {number} */
const codepoint = (a, b) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);

const MAX_ARCS = 6;

/**
 * A human display name for a deity ref, resolved from the embedded primary-deity
 * snapshots on the settlements (the SAME public source realmEvents uses). Falls
 * back to a readable tail of the ref.
 * @param {Array<any>} settlements
 * @param {string} deityId
 * @returns {string}
 */
function deityName(settlements, deityId) {
  for (const item of settlements) {
    const deity = item?.settlement?.config?.primaryDeitySnapshot || item?.config?.primaryDeitySnapshot;
    if (!deity) continue;
    const ref = deity._deityRef || deity.primaryDeityRef || (deity.name ? `deity:${deity.name}` : null);
    if (String(ref) === String(deityId) && deity.name) return String(deity.name);
  }
  const tail = String(deityId).split(/[:_]/).filter(Boolean).pop() || String(deityId);
  return tail.charAt(0).toUpperCase() + tail.slice(1);
}

/**
 * A settlement display name from an id, given a name lookup. Falls back to the id.
 * @param {Map<string, string>} nameById
 * @param {string} id
 * @returns {string}
 */
function nameFor(nameById, id) {
  return nameById.get(String(id)) || String(id);
}

/**
 * Build a settlementId → name lookup from a list of settlement items (snapshot
 * shape `{ id, name }` or save shape `{ id, settlement: { name } }`).
 * @param {Array<any>} settlements
 * @returns {Map<string, string>}
 */
function buildNameById(settlements) {
  /** @type {Map<string, string>} */
  const map = new Map();
  for (const item of settlements) {
    const id = item?.id != null ? String(item.id) : null;
    const name = item?.name || item?.settlement?.name;
    if (id && name) map.set(id, String(name));
  }
  return map;
}

/**
 * The realm arcs implied by the live world: pantheon ascendancies/twilights + the
 * named wars + trade wars. Returns an ARRAY of short arc lines, codepoint-stable.
 * Each line is plain text, public-safe. Empty when the realm is quiet (dormant).
 *
 * @param {Object} args
 * @param {any} args.worldState           the live worldState (pantheon + war ledgers).
 * @param {any} [args.regionalGraph]      the live regional graph (siege coalitions).
 * @param {Array<any>} [args.settlements] settlement items for name resolution
 *                                        (snapshot or saves shape). Optional.
 * @returns {string[]}
 */
export function realmArcLines({ worldState, regionalGraph, settlements = [] } = /** @type {any} */ ({})) {
  const items = Array.isArray(settlements) ? settlements : [];
  const nameById = buildNameById(items);
  /** @type {string[]} */
  const lines = [];

  // ── Pantheon arcs: ascendant majors, twilight cults. ──────────────────────
  const pantheon = worldState?.pantheon && typeof worldState.pantheon === 'object'
    ? worldState.pantheon
    : {};
  const majors = [];
  const cults = [];
  for (const deityId of Object.keys(pantheon).sort(codepoint)) {
    const entry = pantheon[deityId] || {};
    const seats = Number(entry.seats) || 0;
    if (entry.tier === 'major' && seats > 0) majors.push({ deityId, seats });
    else if (entry.tier === 'cult' && seats === 0) cults.push({ deityId });
  }
  // Sort the ascendant majors by seats (most-followed first), codepoint tie-break.
  majors.sort((a, b) => (b.seats - a.seats) || codepoint(a.deityId, b.deityId));
  for (const major of majors) {
    lines.push(`The Ascendancy of ${deityName(items, major.deityId)} (${major.seats} settlement${major.seats === 1 ? ' holds' : 's hold'} the faith).`);
  }
  for (const cult of cults) {
    lines.push(`The Twilight of ${deityName(items, cult.deityId)} (its altars stand abandoned).`);
  }

  // ── War arcs: a named war for each live siege coalition. ───────────────────
  const sieges = liveSieges({ worldState, regionalGraph });
  for (const siege of sieges) {
    const targetName = nameFor(nameById, siege.targetId);
    if (siege.coalition.length >= 2) {
      const attackers = siege.coalition.map(id => nameFor(nameById, id));
      const named = attackers.length > 2 ? `${attackers.slice(0, 2).join(', ')} +${attackers.length - 2}` : attackers.join(' and ');
      lines.push(`The War of ${targetName}, where a coalition of ${named} besiege the walls.`);
    } else {
      const attacker = nameFor(nameById, siege.coalition[0] || '');
      lines.push(`The War of ${targetName}, where ${attacker} lays siege.`);
    }
  }

  // ── Trade-war arcs: a named contest for each flipped commodity prize. ──────
  const tradeWars = liveTradeWars({ worldState, regionalGraph });
  for (const war of tradeWars) {
    const buyerName = nameFor(nameById, war.buyerId);
    const winnerName = nameFor(nameById, war.winnerId);
    lines.push(`The ${war.commodityLabel} Trade War, where ${winnerName} seizes ${buyerName}'s market.`);
  }

  return lines.slice(0, MAX_ARCS);
}

/**
 * The single public-safe realm-arc SUMMARY string for the gallery — the arc lines
 * joined into one short paragraph. Empty string when the realm is dormant (so a
 * no-war/no-deity dossier carries no extra field). Capped so a busy campaign can
 * never smuggle an unbounded blob through the gallery.
 *
 * @param {Object} args  same as realmArcLines.
 * @param {any} args.worldState
 * @param {any} [args.regionalGraph]
 * @param {Array<any>} [args.settlements]
 * @returns {string}
 */
export function buildRealmArcSummary(args = /** @type {any} */ ({})) {
  const lines = realmArcLines(args);
  if (!lines.length) return '';
  return lines.join(' ').slice(0, 600);
}
