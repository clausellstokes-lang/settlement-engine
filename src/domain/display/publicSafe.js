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

// Recursive key denylist. Any object key matching this is dropped entirely.
export const PRIVATE_KEY_RE = /(secret|private|dm|gm|guidance|note|plotHook|plot_hooks|hook|compass|chronicle|pinnedNpc|aiData|aiSettlement|aiDailyLife|narrativeNotes|identityMarkers|frictionPoints|connectionsMap)/i;

/** Recursively strip denied keys; preserves history.currentTensions. */
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
 */
export function toPublicSafe(settlement) {
  const clean = sanitizePublicValue(settlement || {});
  delete clean.aiData;
  delete clean.plotHooks;
  delete clean.dmCompass;
  delete clean.dossierNotes;
  delete clean.notes;
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
