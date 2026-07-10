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
// Character-identical (order-independent) to the FUSED migration 123's
// public_toplevel array inside _gallery_sanitize_public_json (our 050
// fail-closed allowlist reconciled against their post-088 public surface).
// Derived from what the public dossier / gallery renders (gallery RPCs 020–033,
// publicChronicle, OutputContainer playerView) plus the two narrated-public
// fields (thesis, dailyLife) that the shareNarrated base (ai_data.aiSettlement)
// surfaces, plus the four relationship/history keys their post-088 dossier
// serves AND renders (crossSettlementConflicts, interSettlementRelationships,
// neighbourNetwork, populationHistory).
// EXCLUDED on purpose (private / leak-prone / not publicly rendered):
//   • SEED POSTURE (099/121): '_seed' + '_config' are SECRET on every shared /
//     gallery surface — dropped from the allowlist AND folded into the deeper
//     denylist below (so nested config._seed cannot leak). Visible to the
//     settlement's owner as provenance, never on a public projection.
//   • aiData, aiSettlement, aiDailyLife, aiOverlays, userCanon, dmNotes,
//     dmCompass, dossierNotes, notes, narrativeNotes, tabNotes, plotHooks,
//     pinnedNpc, identityMarkers, frictionPoints, connectionsMap,
//     simulationTrace, pendingEdits, campaign, version_history.
export const PUBLIC_TOPLEVEL_KEYS = Object.freeze([
  'activeConditions', 'arrivalScene', 'availableServices', 'coherenceNotes', 'config',
  'conflicts', 'crossSettlementConflicts', 'dailyLife', 'defenseProfile', 'economicState',
  'economicViability', 'factions', 'generatorVersion', 'history', 'id',
  'institutions', 'interSettlementRelationships', 'name', 'neighborRelationship', 'neighbourNetwork',
  'npcs', 'population', 'populationHistory', 'powerStructure', 'pressureSentence',
  'prominentRelationship', 'relationships', 'resourceAnalysis', 'schemaVersion', 'settlementReason',
  'simulationVersion', 'spatialLayout', 'stress', 'stressors', 'structuralSuggestions',
  'structuralViolations', 'thesis', 'tier',
]);

// Recursive DEEPER-level key denylist. Any nested object key matching this is
// dropped entirely. The `dm`/`gm` alternations use a word boundary (\bdm/\bgm)
// so they match the real DM-private keys (dmNotes, dmCompass, dmNote, and any
// future dm*/gm* key) WITHOUT the bare-substring over-match that previously
// stripped legitimate keys like `landmarks`, `admin`, and `isAdmin`.
// SEED POSTURE (099): `seed`/`_config` are folded in here (mirroring the fused
// migration 123 SQL denylist) so that even though `config` is allowlisted at the
// top level, a nested `config._seed` / `config._config` can never leak on a
// public projection. The settlement's own top-level `_seed`/`_config` are already
// dropped by the fail-closed allowlist above; this is the defense-in-depth twin.
export const PRIVATE_KEY_RE = /(secret|private|\bdm|\bgm|guidance|note|plotHook|plot_hooks|hook|compass|chronicle|pinnedNpc|aiData|aiSettlement|aiDailyLife|narrativeNotes|identityMarkers|frictionPoints|connectionsMap|seed|_config)/i;

/**
 * Recursively strip denied keys from a subtree; preserves history.currentTensions.
 * This is the DEEP denylist (defense-in-depth). The top-level ALLOWLIST gate lives
 * in toPublicSafe, which seeds this with a non-empty path so an allowed top-level
 * key is not re-denylisted (e.g. `coherenceNotes` is public despite matching
 * /note/i) while its descendants still are.
 * @param {unknown} value
 * @param {string[]} [path]
 * @returns {unknown}
 */
export function sanitizePublicValue(value, path = []) {
  if (Array.isArray(value)) {
    return value
      .map(item => sanitizePublicValue(item, path))
      .filter(item => item !== undefined);
  }
  if (!value || typeof value !== 'object') return value;

  /** @type {Record<string, unknown>} */
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
 * The stable per-NPC key the gallery member-override map (migration 092) is keyed
 * by. Prefers the NPC's stored id (created NPCs carry `npc.<slug>_<hash>`); falls
 * back to a name slug. The slug rule (snake_case, non-alnum → underscore,
 * lower-cased) MUST match the server public._gallery_npc_key fallback byte-for-byte
 * so a toggle written client-side targets the same NPC the server strips/reveals.
 * @param {Record<string, unknown>} npc
 * @returns {string}
 */
export function galleryMemberKey(npc) {
  const id = npc && npc.id != null ? String(npc.id) : '';
  if (id) return id;
  const slug = String(npc?.name || '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
  return `npc.${slug}`;
}

/**
 * The public NPC allowlist projection: keep ONLY the fields safe for an anon read
 * (no goal / secret / plotHooks / relationships). Used both for the default
 * (stripped) member projection and for a per-member NON-reveal under overrides.
 * @param {Record<string, unknown>} npc
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
 *
 * `options.memberOverrides` is the per-NPC override map (keyed by galleryMemberKey,
 * value { revealDm?, allowImport? }). Each member DEFAULTS to the settlement `full`
 * flag; an explicit revealDm wins. A per-member reveal restores DM fields on THAT
 * member alone and never widens settlement-level content. Mirrors the server's
 * _gallery_apply_member_overrides (migration 093).
 * @param {unknown} settlement
 * @param {{ full?: boolean, memberOverrides?: Record<string, {revealDm?: boolean, allowImport?: boolean}>|null }} [options]
 * @returns {Record<string, any>}
 */
export function toPublicSafe(settlement, { full = false, memberOverrides = null } = {}) {
  // Per-NPC override map keyed by galleryMemberKey, value { revealDm?, allowImport? }.
  // Each member DEFAULTS to the settlement `full` flag; an explicit revealDm wins.
  // The settlement-level projection follows `full` ONLY — a per-member reveal restores
  // DM fields on THAT member alone and never widens settlement-level content. Mirrors
  // the server's _gallery_apply_member_overrides (migration 093).
  const overrides = (memberOverrides && typeof memberOverrides === 'object' && !Array.isArray(memberOverrides))
    ? memberOverrides : {};
  /** @type {Record<string, unknown>} */
  let result;
  if (full) {
    /** @type {Record<string, any>} */
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
      /** @type {Record<string, unknown>} */
      const compass = {};
      for (const k of ['identityMarkers', 'frictionPoints', 'connectionsMap', 'dmCompass']) {
        if (ai[k] != null) compass[k] = ai[k];
      }
      if (Object.keys(compass).length) clone.aiSettlement = compass;
      else delete clone.aiSettlement;
    }
    result = clone;
  } else {
  // Default projection — FAIL CLOSED. Gate the settlement ROOT to the top-level
  // allowlist first: any key not on PUBLIC_TOPLEVEL_KEYS is dropped, so a future
  // DM-private top-level field can't leak just because it misses the denylist
  // (the aiData/plotHooks/dmCompass/dossierNotes/notes explicit deletes are now
  // subsumed by this gate). Each allowed subtree is then run through the recursive
  // denylist seeded at path=[key] — the allowed key itself is not re-denylisted
  // (so `coherenceNotes` survives despite /note/i) while its descendants are.
  const src = /** @type {Record<string, unknown>} */ (
    (settlement && typeof settlement === 'object' && !Array.isArray(settlement)) ? settlement : {}
  );
  /** @type {Record<string, any>} */
  const clean = {};
  for (const key of PUBLIC_TOPLEVEL_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(src, key)) continue;
    const sanitized = sanitizePublicValue(src[key], [key]);
    if (sanitized !== undefined) clean[key] = sanitized;
  }
  if (Array.isArray(clean.npcs)) {
    clean.npcs = clean.npcs.map(publicNpc).filter(npc => npc.name || npc.role);
  }
  result = clean;
  }

  // Per-member overrides: a member with no override follows the settlement `full`
  // flag; an explicit revealDm wins. A REVEALED member is restored to its full DM
  // record (spliced from a clone of the source); a non-revealed member is reduced to
  // the public allowlist. Settlement-level content is untouched, so a hidden
  // settlement with one revealed NPC exposes ONLY that NPC's DM fields. Mirrors the
  // server's _gallery_apply_member_overrides (migration 093). With no overrides this
  // is behaviour-preserving: default mode re-derives the same public allowlist, full
  // mode restores each member to its (equivalent) full source record.
  if (Array.isArray(result.npcs)) {
    // Narrow the source (typed `unknown`) to an object without an any-cast, then
    // read its member NPCs — Array.isArray narrows the branch to the element type.
    const srcObj = /** @type {Record<string, unknown>} */ (
      (settlement && typeof settlement === 'object' && !Array.isArray(settlement)) ? settlement : {}
    );
    const srcNpcs = Array.isArray(srcObj.npcs) ? srcObj.npcs : [];
    /** @type {Record<string, unknown>[]} */
    let fullSource;
    try { fullSource = structuredClone(srcNpcs); }
    catch { fullSource = JSON.parse(JSON.stringify(srcNpcs)); }
    /** @type {Map<string, Record<string, unknown>>} */
    const fullByKey = new Map();
    for (const npc of fullSource) fullByKey.set(galleryMemberKey(npc), npc);
    result.npcs = result.npcs
      .map(npc => {
        const key = galleryMemberKey(npc);
        const ov = overrides[key];
        const effReveal = ov && typeof ov.revealDm === 'boolean' ? ov.revealDm : full;
        return effReveal ? (fullByKey.get(key) || npc) : publicNpc(npc);
      })
      .filter(npc => npc.name || npc.role);
  }
  return result;
}
