/**
 * npcLadderCoherence.js — THE LADDER §4b faith coherence (a lazy sibling leaf of
 * npcLadderKernel.js; DESIGN_THE_LADDER.md §4b PATRON DEITY).
 *
 * "Faith coherence with the institution's dominant faith is a standing input; a RELIGIOUS
 * institution headed AGAINST its faith is a PERMANENT window (the high priest of a god he
 * does not follow cannot rest)." This leaf computes the coherence between a rung-holder's
 * authored trait plane and the institution's PATRON deity — reusing the existing deity/
 * pantheon read models (the safe engine leaves: clergyTraitPlane's npcTraitPlane, deityAxes'
 * evil01/chaos01). The patron deity snapshot rides worldState.religionStates (populated
 * before the ladder mover, the LAST per-settlement mover). Religion dark / no patron ⇒ no
 * faith input (dark-safe). Pure, deterministic, rng-free.
 */
import { npcTraitPlane } from './clergyTraitPlane.js';
import { evil01, chaos01 } from './deityAxes.js';
import { factionArchetype, FACTION_ARCHETYPES } from '../factionArchetypes.js';
import { clamp01 } from '../../kernel/math.js';
import { asObject } from './npcLadderState.js';

// Below this coherence a religious-faction head reads as AGAINST its faith (the permanent
// window). JUDGMENT — say "veto".
export const COHERENCE_RUPTURE_THRESHOLD = 0.45;

/** The patron deity's embedded snapshot (carries alignmentAxis/lawAxis) for a settlement,
 *  or null when religion is dark / no patron is held.
 *  @param {Record<string, unknown>} worldState @param {string} sid @returns {Record<string, unknown>|null} */
function patronDeitySnapshot(worldState, sid) {
  const rel = asObject(asObject(asObject(worldState).religionStates)[sid]);
  const patronRef = typeof rel.patronRef === 'string' ? rel.patronRef : '';
  if (!patronRef) return null;
  const entry = asObject(asObject(rel.deities)[patronRef]);
  const snap = entry.snapshot;
  return snap && typeof snap === 'object' && !Array.isArray(snap) ? /** @type {Record<string, unknown>} */ (snap) : null;
}

/**
 * The faith coherence between a rung-holder and the institution's patron deity: 1 fully
 * aligned … 0 fully opposed, on the shared (evil, chaos) plane the deity axes + the clergy
 * trait plane both use. NULL when there is no patron to cohere with (religion dark).
 * @param {Record<string, unknown>} npc @param {Record<string, unknown>} worldState @param {string} sid
 * @returns {number|null}
 */
export function faithCoherence(npc, worldState, sid) {
  const deity = patronDeitySnapshot(worldState, sid);
  if (!deity) return null;
  const plane = npcTraitPlane(/** @type {Parameters<typeof npcTraitPlane>[0]} */ (npc)); // { e, c } ∈ [-1,1]
  const de = evil01(deity) * 2 - 1;   // 0..1 (evil) → -1..1
  const dc = chaos01(deity) * 2 - 1;  // 0..1 (chaos) → -1..1
  const dist = Math.sqrt((plane.e - de) * (plane.e - de) + (plane.c - dc) * (plane.c - dc));
  const maxDist = Math.sqrt(8); // the diagonal of [-1,1]²
  return clamp01(1 - dist / maxDist);
}

/**
 * Is this rung-holder a RELIGIOUS-institution head standing AGAINST its faith — the §4b
 * PERMANENT window (he cannot rest)? Only religious factions rupture; a coherent devotee,
 * or any non-religious faction, never opens this window. Religion dark ⇒ false (dark-safe).
 * @param {Record<string, unknown>} npc @param {unknown} faction @param {Record<string, unknown>} worldState @param {string} sid
 * @returns {boolean}
 */
export function faithRuptured(npc, faction, worldState, sid) {
  if (factionArchetype(/** @type {Parameters<typeof factionArchetype>[0]} */ (faction)) !== FACTION_ARCHETYPES.RELIGIOUS) return false;
  const coh = faithCoherence(npc, worldState, sid);
  return coh != null && coh < COHERENCE_RUPTURE_THRESHOLD;
}
