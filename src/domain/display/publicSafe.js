/**
 * domain/display/publicSafe.js — the public-safe projection (doc §1k).
 *
 * The third explicit state of the display spine: raw → display → PUBLIC-SAFE.
 * A pure projection that strips every DM-only field so public / gallery /
 * player-safe / anonymous surfaces can render a settlement without leaking
 * secrets, plot hooks, DM guidance/notes, AI overlays, the chronicle, or
 * private relationship data.
 *
 * This mirrors the server's authoritative `_gallery_sanitize_public_json`
 * (the `get_gallery_dossier` RPC). The SERVER remains the security boundary
 * for stored public reads; this client projection is defense-in-depth and
 * powers pre-publish previews + the anonymous result view.
 *
 * SECURITY: the denylist must only ever GROW. Removing a key here can leak
 * DM-private data into a public surface. (Consolidated here from gallery.js
 * so there is a single, named, tested projection — not logic buried in a
 * data-access module.)
 *
 * Pure; never mutates its input.
 */

import { deepClone } from '../clone.js';

// Recursive key denylist. Any object key matching this is dropped entirely.
// The `dm`/`gm` alternations use a word boundary (\bdm/\bgm) so they match the
// real DM-private keys (dmNotes, dmCompass, dmNote, and any future dm*/gm* key)
// WITHOUT the bare-substring over-match that previously stripped legitimate keys
// like `landmarks`, `admin`, `administrative`, and `isAdmin` from public output.
// NOTE: the server's authoritative _gallery_sanitize_public_json carries the same
// over-match and needs a matching SQL migration (Postgres uses \y for boundaries).
export const PRIVATE_KEY_RE = /(secret|private|\bdm|\bgm|guidance|note|plotHook|plot_hooks|hook|compass|chronicle|pinnedNpc|aiData|aiSettlement|aiDailyLife|narrativeNotes|identityMarkers|frictionPoints|connectionsMap)/i;

/**
 * Recursively strip denied keys; preserves history.currentTensions.
 * @param {any} value
 * @param {string[]} [path]
 * @returns {any}
 */
export function sanitizePublicValue(value, path = []) {
  if (Array.isArray(value)) {
    return value
      .map(item => sanitizePublicValue(item, path))
      .filter(item => item !== undefined);
  }
  if (!value || typeof value !== 'object') return value;

  /** @type {Record<string, any>} */
  const out = {};
  for (const [key, child] of Object.entries(value)) {
    const childPath = [...path, key];
    if (PRIVATE_KEY_RE.test(key)) continue;
    if (childPath.includes('npcs') && ['goal', 'secret', 'plotHooks', 'relationships'].includes(key)) continue;
    if (childPath.includes('history') && key === 'currentTensions') {
      out[key] = sanitizePublicValue(child, childPath);
      continue;
    }
    const sanitized = sanitizePublicValue(child, childPath);
    if (sanitized !== undefined) out[key] = sanitized;
  }
  return out;
}

/**
 * The public allowlist projection of a single NPC (id + non-private fields). The
 * one place that allowlist lives client-side; reused by the default-mode strip AND
 * the per-member override strip so they can never diverge.
 * @param {any} npc
 */
function publicNpc(npc) {
  return {
    id: npc.id,
    name: npc.name,
    role: npc.role,
    title: npc.title,
    category: npc.category,
    personality: npc.personality,
    physical: npc.physical,
    factionAffiliation: npc.factionAffiliation,
    secondaryAffiliation: npc.secondaryAffiliation,
    presentation: npc.presentation,
    influence: npc.influence,
  };
}

/**
 * snakeCase — MUST match the server _gallery_npc_key fallback byte-for-byte.
 * @param {any} s
 */
function snakeCase(s) {
  return String(s).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

/**
 * The stable per-NPC key the gallery member-override map is keyed by. Prefers the
 * NPC's stored id (created NPCs carry `npc.<slug>_<hash>`); falls back to a name
 * slug. Mirrors the SQL public._gallery_npc_key exactly so a toggle written here
 * targets the same NPC the server strips/reveals.
 * @param {any} npc
 */
export function galleryMemberKey(npc) {
  const id = npc && npc.id != null ? String(npc.id) : '';
  return id || `npc.${snakeCase(npc?.name || '')}`;
}

/**
 * Project a settlement to its public-safe form. Strips the recursive denylist,
 * drops top-level DM blocks explicitly, and reduces NPCs to a public allowlist
 * (no goal / secret / plotHooks / relationships).
 *
 * `options.full` is the owner opt-in (gallery_share_dm): publish the ENTIRE DM
 * view UNSTRIPPED — secrets, plot hooks, NPC goals/relationships, DM notes +
 * compass all become public. The owner explicitly chose to expose their own
 * DM-private content; default (`full=false`) keeps the §1k strip, so every
 * other surface (anonymous result, pre-publish preview, dossiers that didn't
 * opt in) is unchanged. The AI-narrative prose stays governed by the separate
 * `gallery_share_narrated` toggle, so even in full mode we still drop the AI
 * base blobs defensively. SECURITY: full mode is reachable ONLY when the
 * gallery row's `gallery_share_dm` is true (set by the owner).
 * `options.memberOverrides` is the per-NPC override map (keyed by galleryMemberKey,
 * value { revealDm?, allowImport? }). Each member DEFAULTS to the settlement `full`
 * flag; an explicit revealDm wins. The base goes DM-full when `full` OR ANY member
 * reveals, then every NOT-effectively-revealed member is reduced to the public
 * allowlist — mirroring the server's _gallery_apply_member_overrides so this
 * defense-in-depth / preview projection matches the authoritative read.
 * @param {any} settlement
 * @param {{ full?: boolean, memberOverrides?: Record<string, any>|null }} [options]
 */
export function toPublicSafe(settlement, { full = false, memberOverrides = null } = {}) {
  const overrides = (memberOverrides && typeof memberOverrides === 'object') ? memberOverrides : {};
  const anyReveals = Object.values(overrides).some(o => o && o.revealDm === true);
  const dmFull = full || anyReveals;

  let result;
  if (dmFull) {
    const clone = deepClone(settlement || {});
    // AI prose blobs are the narrated toggle's domain, not this one.
    delete clone.aiData;
    delete clone.aiDailyLife;
    // DM notes are a private DM scratch space — TRULY confidential, never shared
    // even when the owner reveals the rest of their DM-private content (secrets,
    // hooks, compass). dossierNotes also lives under aiData (dropped above); these
    // cover any top-level copy. (Default mode already strips them via the recursive
    // `note` denylist; full mode skips that, so strip explicitly here.)
    delete clone.dossierNotes;
    delete clone.dmNotes;
    delete clone.notes;
    delete clone.narrativeNotes;
    // aiSettlement is a full refined-settlement clone — its PROSE is governed by
    // gallery_share_narrated, NOT this toggle. But the DM Compass (which the owner
    // explicitly opted to reveal) lives on it. Preserve ONLY the four DM-Compass
    // fields and drop the refined prose, so full mode surfaces the Guidance tab
    // without leaking narration. (Consumed read-only for the tab; the main render
    // never reads this partial object — see OutputContainer showNarrative.)
    if (clone.aiSettlement && typeof clone.aiSettlement === 'object') {
      const ai = clone.aiSettlement;
      /** @type {Record<string, any>} */
      const compass = {};
      for (const k of ['identityMarkers', 'frictionPoints', 'connectionsMap', 'dmCompass']) {
        if (ai[k] != null) compass[k] = ai[k];
      }
      if (Object.keys(compass).length) clone.aiSettlement = compass;
      else delete clone.aiSettlement;
    }
    result = clone;
  } else {
    const clean = sanitizePublicValue(settlement || {});
    delete clean.aiData;
    delete clean.plotHooks;
    delete clean.dmCompass;
    delete clean.dossierNotes;
    delete clean.notes;
    if (Array.isArray(clean.npcs)) {
      clean.npcs = clean.npcs
        .map((/** @type {any} */ npc) => publicNpc(npc))
        .filter((/** @type {any} */ npc) => npc.name || npc.role);
    }
    result = clean;
  }

  // Per-member overrides: a member with no override follows the settlement `full`
  // flag; an explicit revealDm wins. A not-revealed member is reduced to the public
  // allowlist even inside a DM-full base (so a settlement-hidden dossier with one
  // revealed NPC exposes ONLY that NPC's DM fields).
  if (Array.isArray(result.npcs)) {
    result.npcs = result.npcs
      .map((/** @type {any} */ npc) => {
        const ov = overrides[galleryMemberKey(npc)];
        const effReveal = ov && typeof ov.revealDm === 'boolean' ? ov.revealDm : full;
        return effReveal ? npc : publicNpc(npc);
      })
      .filter((/** @type {any} */ npc) => npc.name || npc.role);
  }
  return result;
}
