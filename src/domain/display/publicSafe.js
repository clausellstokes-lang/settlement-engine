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
// FIX-PUBLIC-VEIL (migration 206 twin): the veil bit's reader (people/cardPowers.js, a leaf whose
// closure is membership.js and deterministicSort.js): read, never re-derived.
import { cardInstitutionVeilOf, publicMembershipsOf } from '../people/cardPowers.js';

// ── Public top-level allowlist ──────────────────────────────────────────────
// Character-identical (order-independent) to the NET-CURRENT public_toplevel
// array inside _gallery_sanitize_public_json (the fused 123 list, our 050
// fail-closed allowlist reconciled against their post-088 public surface,
// recreated through 189; migration 205 drops 'factions').
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
//   • 'factions' — the people car's retired NPC grouping (ODQ §934.105, PEOPLE-RULINGS
//     M-1b/M-2; migration 205): no generator writes it and no public reader reads it;
//     the POWERS are `powerStructure.factions`, public under `powerStructure`.
//   • aiData, aiSettlement, aiDailyLife, aiOverlays, userCanon, dmNotes,
//     dmCompass, dossierNotes, notes, narrativeNotes, tabNotes, plotHooks,
//     pinnedNpc, identityMarkers, frictionPoints, connectionsMap,
//     simulationTrace, pendingEdits, campaign, version_history.
export const PUBLIC_TOPLEVEL_KEYS = Object.freeze([
  'activeConditions', 'arrivalScene', 'availableServices', 'coherenceNotes', 'config',
  'conflicts', 'crossSettlementConflicts', 'dailyLife', 'defenseProfile', 'economicState',
  'economicViability', 'generatorVersion', 'history', 'id',
  'institutions', 'interSettlementRelationships', 'name', 'neighborRelationship', 'neighbourNetwork',
  'npcs', 'population', 'populationHistory', 'powerStructure', 'pressureSentence',
  'prominentRelationship', 'relationships', 'resourceAnalysis', 'schemaVersion', 'settlementReason',
  'simulationVersion', 'spatialLayout', 'stress', 'stressors', 'structuralSuggestions',
  'structuralViolations', 'thesis', 'tier',
  // 210 (STYLE-RULINGS-2 B10(a), SW-B7b): the owner's composed blocks as TEXT — drawn owner-side
  // (the player audience, the record's own seed) at every save by display/publicProse.js; the
  // seed never travels, only the drawn sentences do.
  'publicProse',
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
// THE SETTLEMENT EDITOR (EM-B3a, design §12.4): `decrees` joins as ONE token, and
// `dmLayer` gains NOTHING because it is ALREADY denied by the `\bdm` alternation
// above (measured, not assumed — a second token for it would be the redundant guard
// the preamble refuses). The token is unanchored and contains-semantic like every
// private neighbour here, so `appliedDecrees` and `decreesApplied` are denied too.
// COUPLED SQL TWIN, and it LANDED FIRST (EM-B3b, migration 202): the regex is pinned
// token-⊆-SQL by snapshotDenylistDrift.test.js, so a client token added ahead of its
// server alternative reds that suite — which is why 202's `_gallery_world_snapshot_is_safe`
// amendment shipped before this line, never after it.
export const PRIVATE_KEY_RE = /(secret|private|\bdm|\bgm|guidance|dossierNotes|tabNotes|\bnotes?\b|plotHook|plot_hooks|hook|compass|chronicle|pinnedNpc|aiData|aiSettlement|aiDailyLife|narrativeNotes|identityMarkers|frictionPoints|connectionsMap|latentPantheon|decrees|seed|_config)/i;

// ── Public NPC field allowlist ──────────────────────────────────────────────
// Character-identical (order-independent) to the SQL npc_allowed array in
// _gallery_sanitize_public_json (033, recreated net-current through 206) and to
// the publicNpc() object literal below. KEEP publicNpc a plain object literal —
// tests/security/gallerySanitizer.pglite.test.js parses that literal by regex
// and pins it to the SQL npc_allowed; this constant is behaviourally pinned to
// both by tests/security/factionMemberPublicParity.pglite.test.js (same input
// record must project to the same key set as npcs[] members, client == server).
// Used by sanitizePublicValue to reduce ROSTER member records — see the member
// gate there (migration 189 twin). Migration 205 drops 'factionAffiliation' and
// 'secondaryAffiliation', the people car's retired per-NPC faction fields (a card's
// standing in the powers is its `memberships`). The card's `institution` and
// `memberships` are NOT on this list: they are public PER ROW, by the veil bit
// (NPC_HOUSE_KEYS below, migration 206).
export const NPC_PUBLIC_KEYS = Object.freeze([
  'id', 'name', 'role', 'title', 'category', 'personality', 'physical',
  'presentation', 'influence',
]);

// ── THE VEIL BIT (FIX-PUBLIC-VEIL, migration 206 twin) ─────────────────────
// The chair's ruling of 2026-11-07, shape (a): every writer of a card's
// `institution` stamps `institution.veiled: true | false` at birth from ONE
// predicate (src/domain/people/cardVeil.js — the gallery veil's hideable house,
// a hidden or criminal power for a minted face). This projection READS the bit
// and never re-derives it:
//   • `veiled === false` — the house is public: NPC_HOUSE_KEYS (`institution`,
//     `memberships`) join the card, and `title`/`role` stay; each membership rides
//     only where its OWN `veiled` is false (the same law per entry);
//   • the card carries an `institution` RECORD with the bit true or ABSENT (a
//     card born before the fix) — fail-closed: NPC_HOUSE_KEYS stay off and
//     NPC_HOUSE_NAMED_KEYS (`title`, `role` — the face's title, "the bloc's
//     speaker" for the hidden infiltrator's mint) are stripped too: the bare name;
//   • no `institution` record — no object of kind 'house' | 'power' naming a key, as
//     people/cardPowers.js :: cardInstitutionOf reads it (a pre-car card, a DM's person,
//     `institution: null`, a legacy string, a malformed object) — untouched: today's
//     NPC_PUBLIC_KEYS, nothing of a house to name.
// Character-identical to the SQL npc_house_keys / npc_house_named arrays in
// _gallery_sanitize_public_json (206); pinned by gallerySanitizer.pglite.test.js.
export const NPC_HOUSE_KEYS = Object.freeze(['institution', 'memberships']);
export const NPC_HOUSE_NAMED_KEYS = Object.freeze(['title', 'role']);

// The bit's reader is the people leaf src/domain/people/cardPowers.js: read, never re-derived.
/**
 * Is `key` public on this NPC object? NPC_PUBLIC_KEYS, less NPC_HOUSE_NAMED_KEYS on a
 * veiled card, plus NPC_HOUSE_KEYS on a public one. The roster-member gate and
 * publicCard below share it, as the SQL's one is_npc_obj arm does.
 * @param {Record<string, unknown>} npc @param {string} key @returns {boolean}
 */
function isNpcKeyPublic(npc, key) {
  const veil = cardInstitutionVeilOf(npc);
  if (NPC_HOUSE_KEYS.includes(key)) return veil === 'public';
  if (NPC_HOUSE_NAMED_KEYS.includes(key) && veil === 'veiled') return false;
  return NPC_PUBLIC_KEYS.includes(key);
}

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

  // ROSTER-MEMBER ALLOWLIST (migration 189 twin, kept at 205): a member's path never
  // contains an 'npcs' segment, so the npcs-path strip below would miss an NPC record
  // embedded in a roster — `goal` (the NPC's DM motivation) and every non-allowlisted
  // NPC field (gender, power, …) would ride through to public / anon / preview
  // projections. Reduce member objects to the public NPC allowlist, exactly as the
  // server's is_npc_obj gate does for paths ending in 'members' under a 'factions'
  // ancestor. 205: the retired grouping `factions[].members[]` (the people car) is no
  // longer reached — its top-level key left PUBLIC_TOPLEVEL_KEYS — so the rule now
  // guards a deeper roster under a 'factions' ancestor (powerStructure.factions[].members:
  // no generator writes one, a DM edit or a legacy record may) — fail-closed, hiding more.
  const isFactionMember = path.length > 0
    && path[path.length - 1] === 'members'
    && path.includes('factions');

  /** @type {Record<string, unknown>} */
  const out = {};
  for (const [key, child] of Object.entries(value)) {
    const childPath = [...path, key];
    if (PRIVATE_KEY_RE.test(key)) continue;
    if (childPath.includes('npcs') && ['goal', 'secret', 'plotHooks', 'relationships'].includes(key)) continue;
    if (isFactionMember && !isNpcKeyPublic(/** @type {Record<string, unknown>} */ (value), key)) continue;
    if (childPath.includes('history') && key === 'currentTensions') {
      out[key] = sanitizePublicValue(child, childPath);
      continue;
    }
    let sanitized = sanitizePublicValue(child, childPath);
    // 206 twin: a roster member's memberships, entry by entry, as the npcs[] projection's
    if (isFactionMember && key === 'memberships') sanitized = publicMembershipsOf(sanitized);
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
    presentation: npc.presentation,
    influence: npc.influence,
  };
}

/**
 * THE PUBLIC CARD (206 twin): publicNpc's allowlist, then the veil bit's per-row rule —
 * a public house adds `institution` and `memberships` (where the card carries them);
 * a veiled card loses `title` and `role`. A card with no `institution` record is
 * publicNpc's projection exactly.
 * @param {Record<string, unknown>} npc
 */
function publicCard(npc) {
  /** @type {Record<string, unknown>} */
  const out = publicNpc(npc);
  for (const key of NPC_HOUSE_NAMED_KEYS) if (!isNpcKeyPublic(npc, key)) delete out[key];
  for (const key of NPC_HOUSE_KEYS) {
    if (!isNpcKeyPublic(npc, key) || !Object.prototype.hasOwnProperty.call(npc, key)) continue;
    const value = key === 'memberships' ? publicMembershipsOf(npc[key]) : npc[key];
    if (value !== undefined) out[key] = value;
  }
  return out;
}

// ── THE ROOT PASS (206 twin, the chair's second-seat ruling of 2026-11-08) ──────
// A hidden power's own row (`powerStructure.factions[]` stamped `hidden: true` — the stress
// infiltrator) is not public, and nor is its NAME anywhere else in the public JSON; and a
// veiled face's title does not ride its ties (`relationships[].npc1Role` for the `from`
// end, `npc2Role` for the `to` end). One pass over the projected output, with two sets read
// from the ORIGINAL record: each power row's own stamped `hidden`, each card's own bit.
// The stress TYPE stays ("Military status: infiltrated", W2 §F7). Character for character
// the SQL's root branch in _gallery_sanitize_public_json (206); the mask phrase is pinned.
export const HIDDEN_POWER_MASK = 'an unseen interest';

/** @param {unknown} v @returns {unknown[]} */
const arrayOf = (v) => (Array.isArray(v) ? v : []);

/** A character outside the blank class (JavaScript's \s set, spelled out as the SQL spells it). */
const NON_BLANK_NAME = /[^ \t\n\r\f\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/;

/**
 * The names of the record's hidden powers (each row's `faction`), from its own stamp.
 * @param {Record<string, unknown>} settlement @returns {string[]}
 */
function hiddenPowerNamesOf(settlement) {
  const ps = settlement.powerStructure;
  const rows = ps && typeof ps === 'object' ? arrayOf(/** @type {Record<string, unknown>} */ (ps).factions) : [];
  const names = new Set();
  for (const row of rows) {
    if (!row || typeof row !== 'object' || Array.isArray(row)) continue;
    const power = /** @type {Record<string, unknown>} */ (row);
    if (power.hidden !== true) continue;
    // R5/R11 (2026-11-10): a blank name masks nothing. Blank is ONE explicit class, character for
    // character the SQL's (a no-break space is blank on both sides).
    if (typeof power.faction === 'string' && NON_BLANK_NAME.test(power.faction)) names.add(power.faction);
  }
  return [...names];
}

/**
 * The ids of the record's veiled faces: a house record stamped true or not stamped.
 * @param {Record<string, unknown>} settlement @returns {string[]}
 */
function veiledCardIdsOf(settlement) {
  return arrayOf(settlement.npcs)
    .filter((card) => cardInstitutionVeilOf(card) === 'veiled')
    .map((card) => /** @type {Record<string, unknown>} */ (card).id)
    .filter((id) => typeof id === 'string' && id !== '')
    .map(String);
}

/** @param {string} text @param {string[]} names @returns {string} */
const maskText = (text, names) => names.reduce((t, name) => t.split(name).join(HIDDEN_POWER_MASK), text);

/**
 * Every string VALUE, at any depth, with each hidden name masked — never a key, and never the
 * settlement's own top-level `name` (R5, the pre-deploy review of 2026-11-10, finding 4: the SQL's
 * mask was a replace over the JSON text, which raised on a name matching text outside a string and
 * rewrote a key equal to a name; the SQL in 210 now walks the string leaves, and this is its twin).
 * @param {unknown} value @param {string[]} names @param {boolean} [isRoot] @returns {unknown}
 */
function maskHiddenNames(value, names, isRoot = false) {
  if (typeof value === 'string') return maskText(value, names);
  if (Array.isArray(value)) return value.map((v) => maskHiddenNames(v, names));
  if (value && typeof value === 'object') {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      // R11 (2026-11-10): an `id` at any depth and the prose format tag are never text to mask.
      const kept = (isRoot && k === 'name') || (k === 'id' && typeof v === 'string');
      out[k] = kept ? v : (isRoot && k === 'publicProse' ? maskProse(v, names) : maskHiddenNames(v, names));
    }
    return out;
  }
  return value;
}

/**
 * The projection's prose masked, its format tag (`v`) kept.
 * @param {unknown} prose @param {string[]} names @returns {unknown}
 */
function maskProse(prose, names) {
  if (!prose || typeof prose !== 'object' || Array.isArray(prose)) return maskHiddenNames(prose, names);
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const [k, v] of Object.entries(prose)) out[k] = k === 'v' && typeof v === 'string' ? v : maskHiddenNames(v, names);
  return out;
}

/**
 * The root pass over a projected settlement (206 twin).
 * @param {Record<string, unknown>} pub @param {string[]} hiddenNames @param {string[]} veiledIds
 * @returns {Record<string, unknown>}
 */
function publicVeilPass(pub, hiddenNames, veiledIds) {
  const veiled = new Set(veiledIds);
  if (veiled.size && Array.isArray(pub.relationships)) {
    pub.relationships = pub.relationships.map((tie) => {
      if (!tie || typeof tie !== 'object' || Array.isArray(tie)) return tie;
      const out = { ...tie };
      if (veiled.has(String(out.from))) delete out.npc1Role;
      if (veiled.has(String(out.to))) delete out.npc2Role;
      return out;
    });
  }
  /** @param {unknown} v @returns {v is Record<string, unknown>} */
  const isRow = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
  const ps = pub.powerStructure;
  // 207 twin (ALLEGIANCE-CAR2, J-20, the chair's ruling of 2026-11-08 ~23:47 UTC): THE HALL'S HOLD IS DM-ONLY. The
  // capture state is derived from the ruling three's HIDDEN allegiances (domain/people/hallCapture.js), so on a public
  // page it would name what the veil hides: the state leaves the power structure, the governing row's seed leaves every
  // power row, and every relation row that carries a capture rung (its type, narrative and DM note are the rung's: "X is
  // a front …") or is typed `corrupted` is DROPPED whole — never re-typed. The DM layer keeps them. Character for character
  // the SQL's root branch in _gallery_sanitize_public_json (207).
  if (isRow(ps)) {
    delete ps.criminalCaptureState;
    if (Array.isArray(ps.factions)) ps.factions = ps.factions.map((/** @type {Record<string, unknown>} */ f) => { if (!isRow(f) || !Object.hasOwn(f, 'captureState')) return f; const { captureState: _drop, ...rest } = f; return rest; });
    if (Array.isArray(ps.factionRelationships)) ps.factionRelationships = ps.factionRelationships.filter((/** @type {Record<string, unknown>} */ r) => !(isRow(r) && (Object.hasOwn(r, 'captureState') || r.type === 'corrupted')));
  }
  /** @type {Set<unknown>} */
  const hidden = new Set(hiddenNames);
  // R5 (2026-11-10): a row stamped hidden leaves whatever its `faction` (missing or empty included),
  // so the removal sits OUTSIDE the name check, as in 210.
  if (isRow(ps) && Array.isArray(ps.factions)) {
    ps.factions = ps.factions.filter((f) => !(isRow(f) && (f.hidden === true || hidden.has(f.faction))));
  }
  if (!hiddenNames.length) return pub;
  /** @param {unknown[]} list a conflicts array of the public JSON (the caller checked Array.isArray) */
  const dropConflicts = (list) => list.filter((c) => !(isRow(c) && Array.isArray(c.parties) && c.parties.some((p) => hidden.has(p))));
  if (Array.isArray(pub.conflicts)) pub.conflicts = dropConflicts(pub.conflicts);
  if (isRow(ps) && Array.isArray(ps.conflicts)) ps.conflicts = dropConflicts(ps.conflicts);
  /** @param {unknown} entry a stress entry of the public JSON (`isRow` below refuses any other shape) */
  const dropStakes = (entry) => {
    if (!(isRow(entry) && isRow(entry.cast) && Array.isArray(entry.cast.stakes))) return entry;
    return { ...entry, cast: { ...entry.cast, stakes: entry.cast.stakes.filter((st) => !(isRow(st) && hidden.has(st.factionId))) } };
  };
  for (const key of ['stress', 'stressors']) {
    if (Array.isArray(pub[key])) pub[key] = pub[key].map(dropStakes);
    else if (isRow(pub[key])) pub[key] = dropStakes(pub[key]);
  }
  return /** @type {Record<string, unknown>} */ (maskHiddenNames(pub, hiddenNames, true));
}

/**
 * THE OWNER'S RECORD AFTER THE ROOT PASS (VEIL-FIX R2, the chair's ruling of 2026-11-10 on the
 * pre-deploy review's finding 2): a clone of the WHOLE record (seed and all, so a reader draws
 * exactly as on the owner's record) with `publicVeilPass`'s strip applied — the hall-capture
 * state, its seeds and every capture or corrupted tie gone, the hidden powers' rows gone and
 * their names masked, a veiled face's title off its ties — and, the review's second path, a
 * veiled face's own `title` and `role` off its card (NPC_HOUSE_NAMED_KEYS, as the projection's
 * card strip). An AUDIENCE-gated reader (the governance account, the defense desk's capture lens)
 * draws from this in the player view and on a public dossier, so the sentences it says carry
 * nothing the sanitizer strips; the DM's own view reads the record itself.
 * @param {unknown} settlement @returns {Record<string, unknown>|null}
 */
export function publicVeiledRecordOf(settlement) {
  if (!settlement || typeof settlement !== 'object' || Array.isArray(settlement)) return null;
  const src = /** @type {Record<string, unknown>} */ (settlement);
  const veiledIds = veiledCardIdsOf(src);
  const out = publicVeilPass(/** @type {Record<string, unknown>} */ (deepClone(src)), hiddenPowerNamesOf(src), veiledIds);
  if (veiledIds.length && Array.isArray(out.npcs)) {
    const veiled = new Set(veiledIds);
    out.npcs = out.npcs.map((card) => {
      if (!card || typeof card !== 'object' || Array.isArray(card) || !veiled.has(String(/** @type {Record<string, unknown>} */ (card).id))) return card;
      const bare = { .../** @type {Record<string, unknown>} */ (card) };
      for (const key of NPC_HOUSE_NAMED_KEYS) delete bare[key];
      return bare;
    });
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
    // THE SETTLEMENT EDITOR'S WORKING STATE (EM-B3a, design §11: "edits do not
    // travel"). `dmLayer` records which fields on this record are the DM's own and
    // `decrees` is the ordered registry of what they have staged — the author's
    // in-progress editing session, not a property of the town. Default mode already
    // drops both through the fail-closed top-level allowlist; full mode skips that
    // gate, so strip them explicitly here, exactly as dossierNotes above is.
    //
    // ⛔ AND THE OPT-IN DOES NOT COVER THEM, for the reason the customContentRoster
    // block below records at length. `gallery_share_dm` is scoped, in the owner's
    // own words at the toggle, to "Secrets, plot hooks, NPC goals and relationships,
    // your DM notes, and the DM Compass" becoming publicly visible. That is a
    // PUBLICATION SWITCH over authored DM CONTENT; it is not a transfer of the
    // owner's working edit state, and no reader of a full share is entitled to the
    // half-finished decrees sitting in their editor. Mirrored server-side by
    // migration 202 (the world-snapshot scanner) — landed ahead of this client
    // token, which is the lawful direction.
    delete clone.dmLayer;
    delete clone.decrees;
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
    // THE TWO CUSTOM-CONTENT EXACTNESS RECORDS (§912, R-G — defense in depth, no
    // migration). `customContentRoster` records EVERY reviewed living-content
    // definition that was in scope for a run — adopted or NOT — so it is the
    // author's unadopted homebrew library rather than a property of the town, and
    // `customContentProvenance` names which of them materialized. Every row carries
    // the five stable, account-scoped `CUSTOM_DEFINITION_IDENTITY_KEYS`, which is
    // exactly what lets an observer correlate one private definition across two
    // published worlds.
    //
    // ⛔ AND THE OPT-IN DOES NOT COVER THEM. `gallery_share_dm` is scoped, in the
    // owner's own words at the toggle, to "Secrets, plot hooks, NPC goals and
    // relationships, your DM notes, and the DM Compass" becoming "publicly visible
    // to anyone who opens this gallery page". It is a publication switch, not a
    // transfer to the owner's other device: no reader of a full share is entitled
    // to the author's private library, and no surface reads these keys off a
    // shared dossier. Default mode already drops both through the fail-closed
    // top-level allowlist; full mode skips that gate, so strip them explicitly —
    // exactly as `dmNotes`, the seed carriers and `latentPantheon` are stripped
    // above, and for the same reason each of those is.
    //
    // THE SERVER TWIN (COHERENCE-VEIL-6; the fifth review's V5-3, ruled by the chair on
    // 2026-11-13): migration 212 strips both from the Reveal-DM projection of the gallery
    // read and the import, beside `decrees` and `dmLayer` (`_gallery_dm_full_json` itself,
    // 121/129, is unchanged; the link and the map never carried them: the sanitiser's
    // allowlist). Pinned by tests/security/galleryVeilCures.pglite.test.js, "V5-3".
    delete clone.customContentRoster;
    delete clone.customContentProvenance;
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
    clean.npcs = clean.npcs.map(publicCard).filter(npc => npc.name || npc.role);
  }
  result = publicVeilPass(clean, hiddenPowerNamesOf(src), veiledCardIdsOf(src));
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
    /** @type {Set<string>} ids of the people this projection does not reveal and whose card carries no role */
    const roleless = new Set();
    result.npcs = result.npcs
      .map(npc => {
        const key = galleryMemberKey(npc);
        const ov = overrides[key];
        const effReveal = ov && typeof ov.revealDm === 'boolean' ? ov.revealDm : full;
        const out = effReveal ? (fullByKey.get(key) || npc) : publicCard(npc);
        if (!effReveal && typeof out.id === 'string' && !('role' in out)) roleless.add(out.id);
        return out;
      })
      .filter(npc => npc.name || npc.role);
    // COHERENCE-VEIL-8 (N3): on a DM-full projection a tie's copy of an end's role follows that person's own card,
    // as publicVeilPass does on the default one (the `from` end's npc1Role, the `to` end's npc2Role; master's ties
    // name the ends npc1Id, npc2Id). SQL twin: migration 212 :: _gallery_veil_tie_roles.
    if (full && roleless.size && Array.isArray(result.relationships)) {
      result.relationships = result.relationships.map((tie) => {
        if (!tie || typeof tie !== 'object' || Array.isArray(tie)) return tie;
        const t = /** @type {Record<string, unknown>} */ ({ ...tie });
        if (roleless.has(String(t.from ?? t.npc1Id))) delete t.npc1Role;
        if (roleless.has(String(t.to ?? t.npc2Id))) delete t.npc2Role;
        return t;
      });
    }
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
