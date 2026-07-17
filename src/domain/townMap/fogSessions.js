/**
 * domain/townMap/fogSessions.js — THE TABLE LAYER (DOOR 2) fog-of-war reveal sidecar.
 *
 * The exact SM-3 mapEdits idiom (domain/townMap/mapEdits.js), scoped PER SESSION — a
 * sibling of interiorEdits.js (DOOR 3):
 *
 *   settlement.fogSessions = {
 *     [sessionId]: { name, districts: string[], streets: string[], buildings: string[] }
 *   }
 *
 * where a session's REVEAL SET is three lists of the model's OWN stable semantic ids:
 *   • districts — district `id` (deriveAllDistricts / synthetic hamlet id)
 *   • buildings — building `anchorKey` (catalogId → localUid → name-slug)
 *   • streets   — a SYNTHESIZED stable street id (fogGeometry.streetId): the model
 *     gives streets no id, so we derive one from the districts a street links
 *     (`spoke:<districtId>` / `desire:<a>|<b>`), version-independent + reroll-stable.
 *
 * WHY IDS, NOT COORDINATES (the edits-delta law, interiorEdits verbatim): a reveal is
 * keyed on the model's OWN anchor identity, so a reroll (`layoutVariant`) or a v1↔v2
 * redraw MOVES the geometry while the ids stay stable — the fog re-derives its mask
 * over the CURRENT geometry and a reveal is never lost to a redraw. A pixel-brush fog
 * stored in coordinates would drift; this is the semantic-snap differentiator.
 *
 * THE LAWS this file holds (mirrors mapEdits/interiorEdits verbatim):
 *   • DORMANCY — absent ⇒ byte-identical: read never writes; normalize collapses an
 *     empty/edited-away container to `null` so the store DROPS the key and the blob is
 *     byte-identical to no-fog. Nothing here creates a container — only a real edit does.
 *   • KEY-NAMING TRAP — every SCHEMA key is denylist-safe (∉ PRIVATE_KEY_RE), pinned by
 *     tests/domain/townMapFog.test.js, so a future gallery allowlisting can never
 *     SILENTLY STRIP a cosmetic key. `fogSessions` is NOT on PUBLIC_TOPLEVEL_KEYS, so
 *     (like mapEdits/interiorEdits) the whole container drops from public/gallery/anon
 *     projections by the fail-closed allowlist — fog reveal state NEVER reaches a public
 *     viewer (the FAIL-CLOSED law; pinned by tests/security/townMapFogPublicDrop.test.js).
 *   • VALUES-AS-KEYS — the per-session KEYS are session ids (slug of the name), never
 *     schema keys; the container never reaches a public projection regardless (the
 *     interiorEdits stance). Session ids are slug-derived (NO Math.random in persisted
 *     state — the pendingEdits lesson).
 *
 * PURE: no Date / Math.random / localeCompare (the townMap domain source-scan).
 */

import { slugify } from './anchors.js';

/** @typedef {{ name?: string, districts?: string[], streets?: string[], buildings?: string[] }} FogSession */
/** @typedef {Record<string, FogSession>} FogSessionsContainer */

/** The reveal-set kinds, in canonical order (used by the mutators + the mask builder). */
export const FOG_REVEAL_KINDS = Object.freeze(['districts', 'streets', 'buildings']);

/** The full set of SCHEMA keys the sidecar may carry — pinned ∉ PRIVATE_KEY_RE (the
 *  naming-guard). Note: the per-session KEYS are session ids (values-as-keys), never
 *  schema keys, and the container never reaches a public projection regardless.
 *  @type {ReadonlyArray<string>} */
export const FOG_SESSIONS_SCHEMA_KEYS = Object.freeze([
  'fogSessions',                        // the settlement-level container key
  'name', 'districts', 'streets', 'buildings', // per-session entry
]);

/** Bounds — a session note, not prose; a small bounded list of sessions; reveal lists
 *  bounded so a malformed blob cannot grow unbounded (the model naturally bounds them). */
const SESSION_NAME_MAX = 60;
const MAX_SESSIONS = 12;
const MAX_REVEAL_IDS = 400;

/** Coerce + bound a session id (a slug of the name). Empty ⇒ 'session'. Pure. */
export function fogSessionId(name) {
  const slug = slugify(name).slice(0, SESSION_NAME_MAX);
  return slug || 'session';
}

/** Coerce a session display name (bounded, trimmed). @param {unknown} v */
function coerceName(v) {
  return typeof v === 'string' ? v.trim().slice(0, SESSION_NAME_MAX) : '';
}

/** A validated, de-duplicated, codepoint-sorted list of string ids (byte-stable stringify).
 *  Non-string / empty entries dropped; capped. Pure. @param {unknown} raw @returns {string[]} */
function coerceIdList(raw) {
  if (!Array.isArray(raw)) return [];
  /** @type {Set<string>} */
  const seen = new Set();
  for (const v of raw) {
    if (typeof v !== 'string') continue;
    const s = v.trim();
    if (s) seen.add(s);
  }
  // Codepoint order (no localeCompare — the purity scan) for a deterministic stringify.
  return [...seen].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)).slice(0, MAX_REVEAL_IDS);
}

/** The whole `settlement.fogSessions` container, or null when absent/invalid. PURE —
 *  never writes it back (an unedited settlement stays byte-identical).
 *  @param {{ fogSessions?: unknown } | null | undefined} settlement @returns {FogSessionsContainer | null} */
export function readFogSessions(settlement) {
  const raw = settlement && typeof settlement === 'object' ? settlement.fogSessions : null;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  return /** @type {FogSessionsContainer} */ (raw);
}

/** The per-session entry, or null. @param {FogSessionsContainer | null | undefined} container
 *  @param {string} sessionId @returns {FogSession | null} */
export function readFogSession(container, sessionId) {
  if (!container || typeof container !== 'object') return null;
  const e = container[sessionId];
  return e && typeof e === 'object' && !Array.isArray(e) ? e : null;
}

/** The reveal set for one session as three concrete id lists. Pure.
 *  @param {FogSession | null | undefined} entry
 *  @returns {{ districts: string[], streets: string[], buildings: string[] }} */
export function readReveal(entry) {
  return {
    districts: coerceIdList(entry && entry.districts),
    streets: coerceIdList(entry && entry.streets),
    buildings: coerceIdList(entry && entry.buildings),
  };
}

/** Whether a session reveals ANYTHING (any of the three lists non-empty). Pure. */
export function sessionHasReveal(entry) {
  const r = readReveal(entry);
  return r.districts.length > 0 || r.streets.length > 0 || r.buildings.length > 0;
}

/** The session ids in codepoint order (a stable, bounded list for a picker). Pure.
 *  @param {FogSessionsContainer | null | undefined} container @returns {string[]} */
export function listFogSessionIds(container) {
  if (!container || typeof container !== 'object') return [];
  return Object.keys(container).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

/** Canonicalize ONE session to its minimal byte-stable form, or null when empty. A
 *  named-but-unrevealed session is KEPT (the name is intentional content); an entry with
 *  neither a name nor any reveal drops. Reveal lists are kept only when non-empty. Pure.
 *  @param {FogSession | null | undefined} entry @returns {FogSession | null} */
export function normalizeFogSession(entry) {
  if (!entry || typeof entry !== 'object') return null;
  /** @type {FogSession} */
  const out = {};
  const name = coerceName(entry.name);
  if (name) out.name = name;
  for (const kind of FOG_REVEAL_KINDS) {
    const list = coerceIdList(entry[kind]);
    if (list.length > 0) out[kind] = list;
  }
  // A session with neither a name nor a reveal is nothing to persist (dormancy).
  return (out.name || out.districts || out.streets || out.buildings) ? out : null;
}

/** Canonicalize the WHOLE container: drop empty sessions (dormancy), cap the count, keys
 *  codepoint-sorted for a stable stringify. Returns null when nothing remains ⇒ the store
 *  drops the key ⇒ byte-identical to no-fog.
 *  @param {FogSessionsContainer | null | undefined} container @returns {FogSessionsContainer | null} */
export function normalizeFogSessions(container) {
  if (!container || typeof container !== 'object') return null;
  /** @type {FogSessionsContainer} */
  const out = {};
  let kept = 0;
  for (const id of Object.keys(container).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))) {
    if (kept >= MAX_SESSIONS) break;
    const e = normalizeFogSession(container[id]);
    if (e) { out[id] = e; kept += 1; }
  }
  return kept > 0 ? out : null;
}

/** CREATE (or ensure) a named session. Returns a NEW normalized container. Idempotent:
 *  a name whose slug already exists keeps its reveals (only the display name refreshes).
 *  Pure. @param {FogSessionsContainer | null | undefined} container @param {string} name
 *  @returns {FogSessionsContainer | null} */
export function withSession(container, name) {
  const id = fogSessionId(name);
  const base = normalizeFogSessions(container) || {};
  const entry = base[id] || {};
  return normalizeFogSessions({ ...base, [id]: { ...entry, name: coerceName(name) || entry.name || id } });
}

/** DELETE a session (its whole reveal set). Returns a NEW normalized container (or null
 *  when the last one goes ⇒ dormancy). Pure.
 *  @param {FogSessionsContainer | null | undefined} container @param {string} sessionId
 *  @returns {FogSessionsContainer | null} */
export function withoutSession(container, sessionId) {
  const base = normalizeFogSessions(container) || {};
  if (!(sessionId in base)) return normalizeFogSessions(base);
  const next = { ...base };
  delete next[sessionId];
  return normalizeFogSessions(next);
}

/** RENAME a session — re-keys the entry to the new name's slug, preserving its reveal set.
 *  A no-op when the id is unknown. If the new slug collides with another session, the two
 *  reveal sets MERGE (union) under the new id. Pure.
 *  @param {FogSessionsContainer | null | undefined} container @param {string} sessionId
 *  @param {string} name @returns {FogSessionsContainer | null} */
export function withRenamedSession(container, sessionId, name) {
  const base = normalizeFogSessions(container) || {};
  const entry = base[sessionId];
  if (!entry) return normalizeFogSessions(base);
  const nextId = fogSessionId(name);
  const next = { ...base };
  delete next[sessionId];
  const existing = next[nextId] || {};
  next[nextId] = {
    name: coerceName(name) || nextId,
    districts: [...(existing.districts || []), ...(entry.districts || [])],
    streets: [...(existing.streets || []), ...(entry.streets || [])],
    buildings: [...(existing.buildings || []), ...(entry.buildings || [])],
  };
  return normalizeFogSessions(next);
}

/** Add / remove one semantic id from a session's reveal set (the single reveal writer the
 *  brush drives). `kind` ∈ FOG_REVEAL_KINDS; `on` reveals (adds), else hides (removes).
 *  Creates the session (name = id) when absent. Returns a NEW normalized container. Pure.
 *  @param {FogSessionsContainer | null | undefined} container @param {string} sessionId
 *  @param {'districts'|'streets'|'buildings'} kind @param {string} id @param {boolean} on
 *  @returns {FogSessionsContainer | null} */
export function withRevealed(container, sessionId, kind, id, on) {
  if (!FOG_REVEAL_KINDS.includes(kind)) return normalizeFogSessions(container);
  const key = typeof id === 'string' ? id.trim() : '';
  const sid = typeof sessionId === 'string' && sessionId ? sessionId : '';
  if (!key || !sid) return normalizeFogSessions(container);
  const base = normalizeFogSessions(container) || {};
  const entry = base[sid] || { name: sid };
  const current = coerceIdList(entry[kind]);
  const set = new Set(current);
  if (on) set.add(key); else set.delete(key);
  return normalizeFogSessions({ ...base, [sid]: { ...entry, [kind]: [...set] } });
}

/** REPLACE a session's whole reveal set for one kind (a bulk reveal-all / hide-all). Pure.
 *  @param {FogSessionsContainer | null | undefined} container @param {string} sessionId
 *  @param {'districts'|'streets'|'buildings'} kind @param {string[]} ids
 *  @returns {FogSessionsContainer | null} */
export function withRevealSet(container, sessionId, kind, ids) {
  if (!FOG_REVEAL_KINDS.includes(kind)) return normalizeFogSessions(container);
  const sid = typeof sessionId === 'string' && sessionId ? sessionId : '';
  if (!sid) return normalizeFogSessions(container);
  const base = normalizeFogSessions(container) || {};
  const entry = base[sid] || { name: sid };
  return normalizeFogSessions({ ...base, [sid]: { ...entry, [kind]: coerceIdList(ids) } });
}

/** CLEAR a session's entire reveal set (hide everything) but keep the named session. Pure.
 *  @param {FogSessionsContainer | null | undefined} container @param {string} sessionId
 *  @returns {FogSessionsContainer | null} */
export function withClearedReveal(container, sessionId) {
  const sid = typeof sessionId === 'string' && sessionId ? sessionId : '';
  if (!sid) return normalizeFogSessions(container);
  const base = normalizeFogSessions(container) || {};
  const entry = base[sid];
  if (!entry) return normalizeFogSessions(base);
  return normalizeFogSessions({ ...base, [sid]: { name: entry.name || sid } });
}
