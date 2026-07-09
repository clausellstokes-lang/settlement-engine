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
 * SECURITY — the projection FAILS CLOSED. The settlement ROOT is gated by an
 * explicit ALLOWLIST of known-public top-level fields (PUBLIC_TOPLEVEL_KEYS):
 * anything not on it is dropped, so a future DM-private top-level field can't
 * leak just because its key misses the denylist. DEEPER levels keep the
 * recursive private-key denylist (which must only ever GROW) + the NPC
 * allowlist as defense-in-depth. Both halves are mirrored server-side; the
 * top-level allowlist is pinned identical to the SQL by
 * tests/security/gallerySanitizeAllowlist.contract.test.js.
 *
 * Pure; never mutates its input.
 */

// ── Public top-level allowlist ──────────────────────────────────────────────
// Character-identical (order-independent) to migration 050's public_toplevel
// array inside _gallery_sanitize_public_json. Derived from what the public
// dossier / gallery renders (gallery RPCs 020–033, publicChronicle,
// OutputContainer playerView) plus the two narrated-public fields (thesis,
// dailyLife) that the shareNarrated base (ai_data.aiSettlement) surfaces.
// EXCLUDED on purpose (private / leak-prone / not publicly rendered): aiData,
// aiSettlement, aiDailyLife, aiOverlays, userCanon, dmNotes, dmCompass,
// dossierNotes, notes, narrativeNotes, tabNotes, plotHooks, pinnedNpc,
// identityMarkers, frictionPoints, connectionsMap, simulationTrace, pendingEdits,
// campaign, version_history.
export const PUBLIC_TOPLEVEL_KEYS = Object.freeze([
  '_config', '_seed', 'activeConditions', 'arrivalScene', 'availableServices',
  'coherenceNotes', 'config', 'conflicts', 'dailyLife', 'defenseProfile',
  'economicState', 'economicViability', 'factions', 'generatorVersion', 'history',
  'id', 'institutions', 'name', 'neighborRelationship', 'npcs',
  'population', 'powerStructure', 'pressureSentence', 'prominentRelationship', 'relationships',
  'resourceAnalysis', 'schemaVersion', 'settlementReason', 'simulationVersion', 'spatialLayout',
  'stress', 'stressors', 'structuralSuggestions', 'structuralViolations', 'thesis',
  'tier',
]);

// Recursive DEEPER-level key denylist. Any nested object key matching this is
// dropped entirely. The `dm`/`gm` alternations use a word boundary (\bdm/\bgm)
// so they match the real DM-private keys (dmNotes, dmCompass, dmNote, and any
// future dm*/gm* key) WITHOUT the bare-substring over-match that previously
// stripped legitimate keys like `landmarks`, `admin`, and `isAdmin`.
export const PRIVATE_KEY_RE = /(secret|private|\bdm|\bgm|guidance|note|plotHook|plot_hooks|hook|compass|chronicle|pinnedNpc|aiData|aiSettlement|aiDailyLife|narrativeNotes|identityMarkers|frictionPoints|connectionsMap)/i;

/**
 * Recursively strip denied keys from a subtree; preserves history.currentTensions.
 * This is the DEEP denylist (defense-in-depth). The top-level ALLOWLIST gate lives
 * in toPublicSafe, which seeds this with a non-empty path so an allowed top-level
 * key is not re-denylisted (e.g. `coherenceNotes` is public despite matching
 * /note/i) while its descendants still are.
 */
export function sanitizePublicValue(value, path = []) {
  if (Array.isArray(value)) {
    return value
      .map(item => sanitizePublicValue(item, path))
      .filter(item => item !== undefined);
  }
  if (!value || typeof value !== 'object') return value;

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
 */
export function toPublicSafe(settlement, { full = false } = {}) {
  if (full) {
    let clone;
    try { clone = structuredClone(settlement || {}); }
    catch { clone = JSON.parse(JSON.stringify(settlement || {})); }
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
      const compass = {};
      for (const k of ['identityMarkers', 'frictionPoints', 'connectionsMap', 'dmCompass']) {
        if (ai[k] != null) compass[k] = ai[k];
      }
      if (Object.keys(compass).length) clone.aiSettlement = compass;
      else delete clone.aiSettlement;
    }
    return clone;
  }
  // Default projection — FAIL CLOSED. Gate the settlement ROOT to the top-level
  // allowlist first: any key not on PUBLIC_TOPLEVEL_KEYS is dropped, so a future
  // DM-private top-level field can't leak just because it misses the denylist
  // (the aiData/plotHooks/dmCompass/dossierNotes/notes explicit deletes are now
  // subsumed by this gate). Each allowed subtree is then run through the recursive
  // denylist seeded at path=[key] — the allowed key itself is not re-denylisted
  // (so `coherenceNotes` survives despite /note/i) while its descendants are.
  const src = (settlement && typeof settlement === 'object' && !Array.isArray(settlement)) ? settlement : {};
  const clean = {};
  for (const key of PUBLIC_TOPLEVEL_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(src, key)) continue;
    const sanitized = sanitizePublicValue(src[key], [key]);
    if (sanitized !== undefined) clean[key] = sanitized;
  }
  if (Array.isArray(clean.npcs)) {
    clean.npcs = clean.npcs.map(npc => ({
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
    })).filter(npc => npc.name || npc.role);
  }
  return clean;
}
