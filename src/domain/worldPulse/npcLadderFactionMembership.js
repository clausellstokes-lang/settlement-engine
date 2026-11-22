/**
 * domain/worldPulse/npcLadderFactionMembership.js — the faction ladder's key and membership
 * match, moved verbatim out of npcLadderState.js (which re-exports both) so that a reader
 * needing only these two (domain/dossier/seatHolder.js, and through it the generation
 * receipt's coherence battery) does not import the world-pulse engine npcLadderState.js
 * pulls in (lane SELF-VOUCH, 2026-11-04: +~130 KB in the generation worker otherwise).
 *
 * A LEAF: it imports only the kernel slug and the faction-reference readers.
 * Pure: no rng, no clock.
 */
import { slugify } from '../../kernel/slugify.js';
import {
  entityLinksFaction,
  factionDisplayNameOf,
} from '../factionRefs.js';

/** npcLadderState.js's `asObject`, repeated here so the leaf imports nothing of it.
 *  @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

// ── Faction key + membership (the §8 read-side consumer computes the SAME key) ──
/** The faction entry's display NAME across record shapes. REAL powerStructure.factions
 *  records carry the name in `.faction` (rulingStructure.js keys governingName off it, and
 *  the domain accessor rulingPower.nameOf reads `.faction || .name`); the test-fixture /
 *  legacy shape uses `.name`/`.label`. Without the `.faction` arm every real faction
 *  slugified to `fac.unknown` and the ladder merged them into one — THE FACTION-KEY BUG.
 *  Single chokepoint for both the key and the membership match. @param {Record<string, unknown>} f @returns {string} */
export function factionName(f) {
  const canonical = factionDisplayNameOf(f);
  if (canonical) return canonical;
  if (typeof f.label === 'string' && f.label) return f.label;
  return '';
}
/** The stable ladder key for a faction entry — its own id, else the normalized name
 *  (the generator's `.faction`, else `.name`/`.label`; see factionName).
 *  The read-side power/legitimacy consumer keys its mirror lookup identically.
 *  @param {{ id?: unknown, name?: unknown, faction?: unknown }} faction @returns {string} */
export function ladderFactionKey(faction) {
  const f = asObject(faction);
  const id = f.id;
  if (typeof id === 'string' && id) return id;
  return `fac.${normalizeToken(factionName(f))}`;
}
/** @param {string} value @returns {string} */
function normalizeToken(value) {
  return slugify(value, { sep: '_', max: 80, fallback: 'unknown', empty: 'unknown' });
}

/** The NPC's faction handle (the generator's canonical affiliation fields, first present).
 *  @param {Record<string, unknown>} npc @returns {string} */
function npcFactionHandle(npc) {
  // LEGACY (PULSE-SITES 2026-11-10): read for ANY card whose memberships do not name the faction asked about; it finds a value only
  // on a card carrying a retired handle (today the pulse-written cards, which GREEN-TIP's writer cure ends): a later seat may remove it.
  for (const key of ['factionAffiliation', 'factionId', 'factionLink', 'faction', 'organizationId']) {
    const v = npc[key];
    if (typeof v === 'string' && v) return v;
  }
  return '';
}
/** Does this NPC belong to the given faction? Matches the generator affiliation handle
 *  (normalized) against the faction name/key, or linkedFactionIds against the faction's
 *  id-first compatibility aliases.
 *  The faction name is read via factionName (`.faction` on real records, else `.name`).
 *  @param {Record<string, unknown>} npc @param {{ id?: unknown, name?: unknown, faction?: unknown }} faction @param {string} fkey
 *  @param {Array<{ id?: unknown, name?: unknown, faction?: unknown }>} [factions] full roster for ambiguity-safe linked-ref resolution */
export function npcInFaction(npc, faction, fkey, factions) {
  const f = asObject(faction);
  const name = factionName(f);
  // PEOPLE-2 CAST-DERIVED (2026-11-07): the INPUT the people car gives — a card holding a membership in the power is its member.
  if (Array.isArray(npc.memberships) && npc.memberships.some((m) => !!m && typeof m === 'object' && m.power === name)) return true;
  const handle = npcFactionHandle(npc);
  if (handle && (normalizeToken(handle) === normalizeToken(name) || handle === f.id || `fac.${normalizeToken(handle)}` === fkey)) return true;
  return entityLinksFaction(npc, f, factions);
}
