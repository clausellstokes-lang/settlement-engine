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

import { deepClone } from '../clone.js';
// The civility guard's VEIL mode. civility.js is a pure leaf (its only import is
// the authored word lists), so this domain→lib edge stays headless — no React,
// no store, nothing that could taint the engine spine through the back door.
import { veilDeep } from '../../lib/civility.js';

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
// LATENT PANTHEON (Phase 4 W-F6, THE PREMIUM GATE): `config.latentPantheon` is the
// starting pantheon baked into EVERY seed but UNREVEALED until premium activation
// (latentPantheon.js). It is DM-only secret content — the gods the dossier has not
// yet named — so it is dropped here (config is allowlisted at top level, so a nested
// config.latentPantheon would otherwise ride through). The ACTIVATED live embeds
// (primaryDeitySnapshot / cultDeitySnapshots / primaryDeityRef / faithProfile) match
// none of these tokens and stay visible — a shared premium pantheon displays
// read-only to all viewers, the latent seed never does. Mirrored server-side by
// migration 128 (both _gallery_sanitize_public_json + _gallery_world_snapshot_is_safe).
//
// NOTE NARROWING (domain-readmodels-2, RESOLVED — migration 130): the bare `note`
// token used to over-match public economics-attribution keys (magicFoodNote,
// magicNote, upstreamNote, storageNote), stripping the food-deficit/supply-chain
// explanation from every public/gallery/anon dossier. It is now narrowed to the
// genuinely PRIVATE note keys: `dossierNotes|tabNotes|\bnotes?\b` (the DM scratch
// spaces + a bare `note`/`notes` field). dmNotes/narrativeNotes remain covered by
// their own tokens (\bdm and the explicit narrativeNotes alternation). The camelCase
// analytical notes carry no word boundary before "Note" (magicFood‸Note), so
// `\bnotes?\b` leaves them intact while a standalone `notes` field still strips.
// COUPLED SQL TWIN — this narrowing CANNOT ship client-only: the regex is pinned
// token-⊆-SQL by snapshotDenylistDrift.test.js and toPublicSafe is pinned
// field-for-field EQUAL to the server sanitizer by gallerySanitize.pglite. Migration
// 130 lands the IDENTICAL narrowing (Postgres \y boundaries) in BOTH
// _gallery_sanitize_public_json (the dossier sanitizer) and
// _gallery_world_snapshot_is_safe (the world-snapshot scanner the drift test pins).
// The denylist still only GROWS in the private-key direction — this narrows a token
// that was over-broad, tightening it TO the genuinely-private keys, never removing a
// private key from coverage.
export const PRIVATE_KEY_RE = /(secret|private|\bdm|\bgm|guidance|dossierNotes|tabNotes|\bnotes?\b|plotHook|plot_hooks|hook|compass|chronicle|pinnedNpc|aiData|aiSettlement|aiDailyLife|narrativeNotes|identityMarkers|frictionPoints|connectionsMap|latentPantheon|seed|_config)/i;

// ── Public NPC field allowlist ──────────────────────────────────────────────
// Character-identical (order-independent) to the SQL npc_allowed array in
// _gallery_sanitize_public_json (033, recreated net-current through 189) and to
// the publicNpc() object literal below. KEEP publicNpc a plain object literal —
// tests/security/gallerySanitizer.pglite.test.js parses that literal by regex
// and pins it to the SQL npc_allowed; this constant is behaviourally pinned to
// both by tests/security/factionMemberPublicParity.pglite.test.js (same input
// record must project to the same key set as npcs[] members, client == server).
// Used by sanitizePublicValue to reduce FACTION-ROSTER member records — see the
// faction-member gate there (migration 189 twin).
export const NPC_PUBLIC_KEYS = Object.freeze([
  'id', 'name', 'role', 'title', 'category', 'personality', 'physical',
  'factionAffiliation', 'secondaryAffiliation', 'presentation', 'influence',
]);

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

  // COVERT DROP (W-DOCTRINE-3 §6): an object explicitly flagged `covert:true` is hidden
  // DM state — e.g. a covert 'corruption' impairment on institutions[].impairments whose
  // `description` NAMES the corrupted NPC ("<NPC>'s capture quietly compromised <inst>",
  // stamped by imposeCorruption scope:'individual_institution'). Drop the WHOLE object
  // from every public / anon / preview projection: stripping only the `covert` KEY (as
  // COVERT_KEY_RE does for world snapshots) would leave the naming description exposed.
  // This is a VALUE-level rule (no PRIVATE_KEY_RE token), so the token-⊆-SQL drift pin is
  // untouched. Mirrored server-side by _gallery_sanitize_public_json (migration 142). The
  // settlement ROOT never reaches here (toPublicSafe gates it via the top-level allowlist),
  // so only NESTED objects are covert-checked — matching the SQL `not is_toplevel` guard.
  // FAIL-CLOSED, like the rest of this projection. (Only default mode; the owner's
  // gallery_share_dm full mode keeps its own DM content — see toPublicSafe.)
  if (/** @type {Record<string, unknown>} */ (value).covert === true) return undefined;

  // FACTION-MEMBER ALLOWLIST (migration 189 twin): factions[].members[] embed the
  // SAME full NPC records as npcs[] (factionGrouping pushes roster references;
  // relinkFactionMembers re-points them at the enriched roster), but a member's
  // path never contains an 'npcs' segment, so the npcs-path strip below missed
  // them — `goal` (the NPC's DM motivation) and every non-allowlisted NPC field
  // (gender, power, …) rode through to public / anon / preview projections
  // (secret/plotHooks were already caught at depth by PRIVATE_KEY_RE). Reduce
  // member objects to the public NPC allowlist, exactly as the server's
  // is_npc_obj gate does for paths ending in 'members' under a 'factions'
  // ancestor. The ancestor rule deliberately also covers deeper rosters (e.g. a
  // powerStructure.factions[].members) — fail-closed, hiding more.
  const isFactionMember = path.length > 0
    && path[path.length - 1] === 'members'
    && path.includes('factions');

  /** @type {Record<string, unknown>} */
  const out = {};
  for (const [key, child] of Object.entries(value)) {
    const childPath = [...path, key];
    if (PRIVATE_KEY_RE.test(key)) continue;
    if (childPath.includes('npcs') && ['goal', 'secret', 'plotHooks', 'relationships'].includes(key)) continue;
    if (isFactionMember && !NPC_PUBLIC_KEYS.includes(key)) continue;
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
    // SEED POSTURE (099/121 → mirrored here, W-F8): a generation seed is CONFIDENTIAL in
    // every gallery view — even a DM-full share. The owner's opt-in reveals authored
    // DM-private content (secrets, hooks, compass); a seed replays the procedural output
    // and is never that. Default mode already drops these via the fail-closed top-level
    // allowlist (+ the recursive `seed`/`_config` denylist); full mode skips that gate, so
    // strip BOTH top-level generation-seed carriers (_seed / _regenSeed) + _config here,
    // exactly as dmNotes above is. Mirrors server migration 121/129 (`- '_seed' -
    // '_regenSeed' - '_config'` on _gallery_dm_full_json); pinned against the SQL by the
    // full-mode seed test. (regenNPCsPipeline stamps _regenSeed at the settlement top level.)
    delete clone._seed;
    delete clone._regenSeed;
    delete clone._config;
    // LATENT PANTHEON (Phase 4 W-F7, THE PREMIUM GATE): the unrevealed starting
    // pantheon (config.latentPantheon) NEVER leaves the account — not even on a
    // DM-full share. The owner's gallery_share_dm opt-in reveals THEIR authored
    // DM-private content (secrets, hooks, compass, NPC goals); the latent seed is
    // content the dossier has not yet NAMED — unrevealed by definition — so it is
    // stripped even here. (Default mode already drops it via the recursive
    // `latentPantheon` denylist token; full mode skips that recursion, so strip it
    // explicitly, exactly as dmNotes above is.) Mirrored server-side by migration
    // 129 (_gallery_dm_full_json). The ACTIVATED live embeds (primaryDeitySnapshot /
    // cultDeitySnapshots / primaryDeityRef / faithProfile) carry no such key and
    // stay — a shared premium pantheon displays read-only to all viewers.
    if (clone.config && typeof clone.config === 'object' && !Array.isArray(clone.config)) {
      delete clone.config.latentPantheon;
      // …and the seed carried INSIDE config (migration 121/129 keeps config but removes
      // config._seed): the nested twin of the top-level strip above.
      delete clone.config._seed;
    }
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
    const fullSource = deepClone(srcNpcs);
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

  // ── THE CIVILITY VEIL (DESIGN_PROFILE_IMAGE.md §9, the VEIL mode) ───────────
  // The LAST thing that happens to a public projection, and the right place for
  // it for three reasons that together make this the only correct seam:
  //
  //   1. ORIGIN. Everything reaching this line is PRIVATE-ORIGIN text — an NPC
  //      secret, a plot hook, a goal, the DM Compass — written in a private world
  //      and carried into public by the owner's shareDm opt-in. §9's ruling is
  //      that such text is VEILED, never BLOCKED: "those are originally
  //      private... people may forget". The author did nothing public-facing
  //      wrong, so nothing is refused and no friction is applied. Text the author
  //      wrote FOR the public (a display name, a comment, a gallery description)
  //      is a different mode entirely and is gated at ITS entry, not here.
  //
  //   2. ONE TRANSFORM, EVERY FORM. §9 requires the mask to apply "in the public
  //      VIEW and in the SHARED/IMPORT PAYLOAD identically". ⚠️ CORRECTED (VH-1):
  //      this comment used to claim the gallery dossier read and the world export
  //      "both already flow through this one function", and that was WRONG — only
  //      the settlement SUB-OBJECT flows through here. Each of those payloads
  //      HOISTS a raw display name beside the projection (gallery.js's `row.name`,
  //      worldExport's member name and realm name), and those hoists rode out
  //      unveiled, so the veiled copy was only ever a fallback. The seam is
  //      therefore not "inside toPublicSafe" but "the boundary of every public
  //      payload builder", and it is spelled ONCE as `veilPublicPayload` below.
  //
  //   3. THE STORAGE LAW. This is a projection that never writes. The author's
  //      stored note is untouched and survives every share, unshare and reimport
  //      byte-intact; only what LEAVES privacy wears the veil.
  //
  // Applied to BOTH modes, not just `full`. Default mode already strips DM
  // blocks, but user-authored strings still ride it (names, renames), and a veil
  // is harmless on clean text — veilDeep returns the SAME references when nothing
  // is flagged, so this costs no allocation on the overwhelmingly common path.
  //
  // ⚠️ CLIENT MIRROR ONLY, and the honesty matters: the SERVER's
  // _gallery_sanitize_public_json is the authoritative boundary for stored public
  // reads, and it does NOT yet veil (migration 195 ships the block-mode server
  // mirror; masking inside JSON prose in SQL is recorded as deferred). Until then
  // the veil is defense-in-depth on every path that renders through this module,
  // which is every path this client serves.
  return veilPublicPayload(result);
}

/**
 * THE PUBLIC-PAYLOAD VEIL SEAM — the ONE call every public payload ends in
 * (DESIGN_PROFILE_IMAGE.md §9, VEIL mode; the one-resolver law).
 *
 * WHY THIS EXISTS AS A NAMED EXPORT rather than a bare `veilDeep` at four call
 * sites. The veil hole this closes was not a missing transform — `veilDeep` was
 * already applied inside `toPublicSafe`. It was a MISPLACED SEAM: the veil sat
 * inside one sub-object while each payload builder hoisted a raw display name
 * beside it, and the raw sibling is the one the page actually rendered
 * (`{dossier.name || dossier.settlement?.name}` — the veiled copy was the
 * FALLBACK). A per-field cure would have to be remembered again by the next
 * field; moving the seam to the payload BOUNDARY cures the class, because a
 * payload cannot be assembled without passing its own boundary.
 *
 * THE LAW, in one line: a value that leaves privacy leaves through this call.
 * Every builder of a public/anonymous/shared/exported payload — `toPublicSafe`
 * itself, gallery.js's tile / dossier / import projections, and worldExport's
 * realm payload — RETURNS the result of this function. The invariant is pinned
 * by tests/security/publicPayloadVeilTotality.test.js, which stamps a vector
 * term into every input field of every builder and asserts the serialized
 * payload carries ZERO plain occurrences — so a NEW hoisted raw field reds the
 * pin instead of shipping.
 *
 * IDENTIFIERS ARE NOT EXEMPT, and that is deliberate rather than an oversight.
 * Masking is applied to ids and keys too, so a join between two veiled sides
 * still matches: `veilText` is deterministic, so the same raw id veils to the
 * same string wherever it appears in the payload. This is only safe because the
 * two identifiers that must round-trip to the SERVER verbatim cannot carry a
 * flaggable token by construction — `public_slug` is 12 hex characters from
 * `_make_public_slug()` (migration 008) and the row `id` is a uuid, neither of
 * which contains a word. Should a NAME-DERIVED slug ever become a server-facing
 * identifier, this rule needs an explicit round-trip exemption; recorded here so
 * the next reader does not have to rediscover why it is currently unnecessary.
 *
 * NOT APPLIED to the admin report projection (gallery.js `sanitizeReport`): a
 * moderator reviewing a report must see the reported text VERBATIM, and masking
 * it would defeat the backstop lane the guard's own header names as layer two.
 * That surface is admin-gated, never public. Deliberate exemption, not a gap.
 *
 * Delegates to the one validator (lib/civility.js `veilDeep`) — no masking logic
 * is invented here, and the structural-sharing property means a clean payload
 * comes back by identity, so this costs no allocation on the common path.
 *
 * @template T
 * @param {T} payload
 * @returns {T}
 */
export function veilPublicPayload(payload) {
  return veilDeep(payload);
}
