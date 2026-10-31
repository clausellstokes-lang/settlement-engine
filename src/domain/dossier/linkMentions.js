/**
 * linkMentions.js — THE ONE MENTION LINKER (RULINGS-CROSS X-20, "every mention is a door").
 *
 * The owner, in sense: wherever a name appears in the dossier, the reader clicks the name and
 * only the name and lands on the owning page with that object's card at the top. This module
 * is the pure half: it splits a rendered string into text and link segments on EXACT,
 * WHOLE-WORD matches of the canonical names `entityLinks.js :: buildDossierEntityIndex` holds.
 * The view renders each link segment through the existing EntityLink primitive.
 *
 *   mentionScopeFor(settlement, viewer)                  -> the viewer's scope (once per page)
 *   linkMentions(text, index, scope, { selfId, structural }) -> segments
 *   isMentionAllowed(scope, entry)                       -> may this viewer open this entry?
 *
 * THE RULES (X-20 (a), (b), (d)):
 *   - EXACT: case-sensitive, the index's live current name. "mara voss" is not "Mara Voss",
 *     and a surname alone ("Voss") is not a name the index holds, so it never links.
 *   - WHOLE WORD: a match must not touch a letter or digit on either side. Punctuation and
 *     the possessive ("Mara Voss's") end a word.
 *   - LONGEST FIRST: at any position the longest canonical name wins, so a faction named
 *     inside another's name ("Guild" inside "Iron Guild") links the longer one.
 *   - AMBIGUOUS NAMES DO NOT LINK: two distinct entries sharing one name, or an entry the
 *     index marks non-interactive (a legacy identity collision), stay text. A link never
 *     guesses.
 *   - PROSE vs STRUCTURED (X-20 (b)): people, factions, institutions, events, neighbours and
 *     the patron deity link anywhere. Resources (and services, when a site hands them over)
 *     are common words, so they link only where a site declares the string a structured
 *     name (`structural: true`, a chip or a row). The settlement's own name never links.
 *   - SELF: a mention of the card's own entity (`selfId`) is text, never a door to itself.
 *   - AUDIENCE (X-20 (d)): a mention links only when the viewer may open its object: the
 *     owning tab is one the viewer has, and, in a player or public view, the object survives
 *     the public projection (`toPublicSafe`, the gallery's own projection mirrored client
 *     side, which the dossier search reads too).
 *
 * Pure: no React, no store. The compiled matcher is cached per (index, scope) pair, so a page
 * of prose compiles its pattern once.
 */
import { buildDossierEntityIndex } from './entityLinks.js';
import { toPublicSafe } from '../display/publicSafe.js';

/**
 * @typedef {{ id: string, type: string, tab?: string, currentName?: string, identity?: { interactive?: boolean } }} MentionEntry
 * @typedef {{ npcs?: MentionEntry[], factions?: MentionEntry[], institutions?: MentionEntry[],
 *   resources?: MentionEntry[], neighbours?: MentionEntry[], events?: MentionEntry[], deities?: MentionEntry[] }} MentionIndex
 * @typedef {{ tabs: Set<string> | null, allow: Set<string> | null }} MentionScope
 * @typedef {{ type: 'text', value: string } | { type: 'link', value: string, id: string, entityType: string }} MentionSegment
 * @typedef {{ name: string, id: string, type: string }} MentionTarget
 */

/** The families a mention may open from prose (X-20 (b)). */
const PROSE_TYPES = Object.freeze(['npc', 'faction', 'institution', 'event', 'neighbour', 'deity']);
/** The families that link only from a structured name (a chip, a row): common-word names. */
const STRUCTURED_ONLY_TYPES = Object.freeze(['resource', 'service']);
/** Every indexed family the linker reads, in index order. The settlement entry is never read. */
const INDEX_FAMILIES = Object.freeze(['npcs', 'factions', 'institutions', 'resources', 'neighbours', 'events', 'deities']);

/** @param {string} type @param {string} id @returns {string} */
const scopeKey = (type, id) => `${type}:${id}`;

/**
 * Every entry of an index's linkable families (any object carrying the index's family arrays).
 * @param {object | null | undefined} index
 * @returns {MentionEntry[]}
 */
function indexEntries(index) {
  if (!index || typeof index !== 'object') return [];
  /** @type {MentionEntry[]} */
  const out = [];
  for (const family of INDEX_FAMILIES) {
    const list = /** @type {Record<string, unknown>} */ (index)[family];
    if (Array.isArray(list)) for (const entry of list) if (entry && typeof entry === 'object') out.push(entry);
  }
  return out;
}

/**
 * The viewer's mention scope, computed once per page: which tabs the viewer has and, in a
 * player or public view, which objects survive the public projection.
 *
 * @param {object | null | undefined} settlement
 * @param {{ playerView?: boolean, publicDossier?: boolean, tabs?: ReadonlyArray<string> | null }} [viewer]
 * @returns {MentionScope}
 */
export function mentionScopeFor(settlement, viewer = {}) {
  const tabs = Array.isArray(viewer.tabs) ? new Set(viewer.tabs.map(String)) : null;
  /** @type {Set<string> | null} */
  let allow = null;
  if (viewer.playerView || viewer.publicDossier) {
    const projected = buildDossierEntityIndex(toPublicSafe(settlement || {}));
    allow = new Set(indexEntries(projected).map((entry) => scopeKey(entry.type, String(entry.id))));
  }
  return { tabs, allow };
}

/**
 * Whether the viewer may open this entry through a link (X-20 (d)). A missing scope (a
 * surface outside a dossier) allows every interactive entry.
 *
 * @param {MentionScope | null | undefined} scope
 * @param {MentionEntry | null | undefined} entry
 * @returns {boolean}
 */
export function isMentionAllowed(scope, entry) {
  if (!entry || entry.identity?.interactive === false) return false;
  if (!scope) return true;
  if (scope.tabs && !scope.tabs.has(String(entry.tab || ''))) return false;
  if (scope.allow && !scope.allow.has(scopeKey(entry.type, String(entry.id)))) return false;
  return true;
}

/** @param {string} value @returns {string} */
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** A match may not touch a letter or a digit on its left, or on its right. */
const WORD_START = /(?<![\p{L}\p{N}])/u;
const WORD_END = /(?![\p{L}\p{N}])/u;

/**
 * The linkable names, longest first, with ambiguous names dropped.
 * @param {MentionIndex} index @param {MentionScope | null} scope @param {boolean} structural
 * @returns {MentionTarget[]}
 */
function collectTargets(index, scope, structural) {
  /** @type {Map<string, MentionTarget | null>} */
  const byName = new Map();
  for (const entry of indexEntries(index)) {
    const type = String(entry.type || '');
    const linkable = PROSE_TYPES.includes(type) || (structural && STRUCTURED_ONLY_TYPES.includes(type));
    if (!linkable || !isMentionAllowed(scope, entry)) continue;
    const name = String(entry.currentName || '').trim();
    // A one- or two-letter name is too likely to be a word; it never links.
    if (name.length < 3) continue;
    const prior = byName.get(name);
    if (prior === undefined) byName.set(name, { name, id: String(entry.id), type });
    // Two distinct objects answer to one name: the name links to neither.
    else if (prior && (prior.id !== String(entry.id) || prior.type !== type)) byName.set(name, null);
  }
  return /** @type {MentionTarget[]} */ ([...byName.values()].filter(Boolean))
    .sort((a, b) => b.name.length - a.name.length || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

/** @typedef {{ pattern: RegExp | null, byName: Map<string, MentionTarget> }} CompiledMatcher */

/** The cache key a scope-less call files under. */
const NO_SCOPE = Object.freeze({});
/** @type {WeakMap<object, WeakMap<object, Map<string, CompiledMatcher>>>} */
const MATCHER_CACHE = new WeakMap();

/**
 * The compiled matcher for an (index, scope, structural) triple, cached per index and scope so
 * a page of prose compiles its pattern once and a new settlement can never reuse an old roster.
 * @param {MentionIndex} index @param {MentionScope | null} scope @param {boolean} structural
 * @returns {CompiledMatcher}
 */
function matcherFor(index, scope, structural) {
  let perIndex = MATCHER_CACHE.get(index);
  if (!perIndex) { perIndex = new WeakMap(); MATCHER_CACHE.set(index, perIndex); }
  const scopeHolder = scope || NO_SCOPE;
  let perScope = perIndex.get(scopeHolder);
  if (!perScope) { perScope = new Map(); perIndex.set(scopeHolder, perScope); }
  const key = structural ? 'structural' : 'prose';
  const cached = perScope.get(key);
  if (cached) return cached;
  const targets = collectTargets(index, scope, structural);
  /** @type {CompiledMatcher} */
  const compiled = {
    pattern: targets.length
      ? new RegExp(`${WORD_START.source}(?:${targets.map((t) => escapeRegExp(t.name)).join('|')})${WORD_END.source}`, 'gu')
      : null,
    byName: new Map(targets.map((t) => [t.name, t])),
  };
  perScope.set(key, compiled);
  return compiled;
}

/**
 * Split one rendered string into text and link segments (X-20 (a)).
 *
 * @param {unknown} text the string a card or paragraph renders
 * @param {MentionIndex | null | undefined} index the dossier's entity index
 * @param {MentionScope | null | undefined} [scope] the viewer's scope (`mentionScopeFor`)
 * @param {{ selfId?: string | null, structural?: boolean }} [options]
 *   `selfId`: the card's own entity id, never linked to itself; `structural`: the string is a
 *   structured name (a chip, a row), so common-word families may link too.
 * @returns {MentionSegment[]}
 */
export function linkMentions(text, index, scope = null, options = {}) {
  if (typeof text !== 'string' || text.length === 0) return [];
  if (!index || typeof index !== 'object') return [{ type: 'text', value: text }];
  const { pattern, byName } = matcherFor(index, scope || null, !!options.structural);
  if (!pattern) return [{ type: 'text', value: text }];
  const selfId = options.selfId == null ? null : String(options.selfId);
  /** @type {MentionSegment[]} */
  const segments = [];
  let plain = '';
  let last = 0;
  pattern.lastIndex = 0;
  for (const match of text.matchAll(pattern)) {
    const at = match.index ?? 0;
    const target = byName.get(match[0]);
    plain += text.slice(last, at);
    last = at + match[0].length;
    if (!target || target.id === selfId) { plain += match[0]; continue; }
    if (plain) segments.push({ type: 'text', value: plain });
    plain = '';
    segments.push({ type: 'link', value: match[0], id: target.id, entityType: target.type });
  }
  plain += text.slice(last);
  if (plain) segments.push({ type: 'text', value: plain });
  return segments;
}

export default linkMentions;
