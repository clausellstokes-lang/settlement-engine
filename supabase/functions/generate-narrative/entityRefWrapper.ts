/**
 * entityRefWrapper — deterministic server-side entity-link post-processor.
 *
 * After the refinement passes finish, the narrative settlement carries refined
 * free-form prose (thesis, per-tab notes, NPC goal/secret bios). This module
 * scans that prose for the NAMES of entities that exist in the settlement
 * (NPCs, factions, neighbours) and wraps each whole-word, case-insensitive match
 * with an id-bearing token the client tokenizer parses:
 *
 *     ⟦entity:<id>|<displayName>⟧
 *
 * ⛔ ID PARITY is the whole game. The id written here MUST be byte-identical to
 * the id the client index assigns the same entity, or the link silently degrades
 * to plain text. The helpers below are ported VERBATIM from the client:
 *   - slugifyEntity  ← src/domain/dossier/entityLinks.js
 *   - snakeCase / factionIdFromName ← src/lib/entities.js
 *   - npc id   = npc.id ?? npc.refId ?? slugifyEntity(name)   (entityIdFor 'npc')
 *   - faction  = factionIdFromName(name) = `faction.<snake>`
 *   - neighbour= entry.id ?? `neighbour.<slugifyEntity(name)>` (neighbourIdFor)
 * A parity test (tests/lib/entityRefWrapper.parity.test.js) asserts these match
 * the client helpers for a sample npc + faction so drift fails CI, not prod.
 *
 * The model is NEVER trusted to emit tokens — this is pure post-processing over
 * a fixed name set the server controls. Wrapping rules:
 *   - whole-word (word-boundary) match, case-insensitive;
 *   - LONGEST names first so "John Smith" wins over "John";
 *   - never wrap inside an already-emitted token (no double-wrap);
 *   - only names of entities present in THIS settlement.
 */

// ── Ported id helpers (keep byte-identical to the client) ───────────────────

/** Verbatim port of src/domain/dossier/entityLinks.js#slugifyEntity. */
export function slugifyEntity(value: unknown): string {
  return String(value || 'unknown')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'unknown';
}

/** Verbatim port of src/lib/entities.js#snakeCase. */
function snakeCase(s: unknown): string {
  return String(s)
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

/** Verbatim port of src/lib/entities.js#factionIdFromName. */
export function factionIdFromName(name: unknown): string | null {
  if (!name) return null;
  return `faction.${snakeCase(name)}`;
}

/** Mirrors entityIdFor('npc', npc) — npc.id ?? npc.refId ?? slugifyEntity(name). */
function npcIdFor(npc: any): string | null {
  if (!npc || typeof npc !== 'object') return null;
  if (typeof npc.id === 'string' && npc.id) return npc.id;
  if (typeof npc.refId === 'string' && npc.refId) return npc.refId;
  const name = npc.name || npc.label;
  return name ? slugifyEntity(name) : null;
}

/** Verbatim port of src/domain/dossier/entityLinks.js#neighbourIdFor. */
function neighbourIdFor(entry: any): string | null {
  if (!entry || typeof entry !== 'object') return null;
  if (typeof entry.id === 'string' && entry.id) return entry.id;
  const name = entry.neighbourName || entry.name || entry.label;
  return name ? `neighbour.${slugifyEntity(name)}` : null;
}

// ── Name → id table ─────────────────────────────────────────────────────────

type NameRef = { name: string; id: string };

/**
 * Collect every wrappable (name, id) pair from the settlement. Names with no id,
 * or too short to word-match safely (< 2 chars), are dropped. The id parity with
 * the client index is what makes the wrapped token resolve at render.
 */
export function collectEntityNameRefs(settlement: any): NameRef[] {
  const refs: NameRef[] = [];
  const seenNames = new Set<string>();

  const push = (rawName: unknown, id: string | null) => {
    if (!id) return;
    const name = typeof rawName === 'string' ? rawName.trim() : '';
    if (name.length < 2) return;
    const key = name.toLowerCase();
    if (seenNames.has(key)) return; // first id wins on a duplicate name
    seenNames.add(key);
    refs.push({ name, id });
  };

  // Client-supplied settlements can carry truthy NON-array shapes here (e.g.
  // npcs: {}). `|| []` only guards falsy values, and `for…of` over a plain
  // object throws — post-generation, inside the caller's refund catch-all — so
  // every collection is Array.isArray-gated instead.
  const asArray = (value: unknown): any[] => (Array.isArray(value) ? value : []);

  for (const npc of asArray(settlement?.npcs)) {
    push(npc?.name || npc?.label, npcIdFor(npc));
  }
  const factions = Array.isArray(settlement?.powerStructure?.factions)
    ? settlement.powerStructure.factions
    : asArray(settlement?.factions);
  for (const f of factions) {
    const name = f?.faction || f?.name || f?.label;
    push(name, factionIdFromName(name));
  }
  for (const n of asArray(settlement?.neighbourNetwork)) {
    push(n?.neighbourName || n?.name, neighbourIdFor(n));
  }
  const live = settlement?.neighborRelationship;
  if (live?.name) push(live.name, neighbourIdFor({ id: `live_${live.name}`, neighbourName: live.name }));

  return refs;
}

// ── Regex helpers ───────────────────────────────────────────────────────────

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Token fences (must match src/lib/entityRefTokenizer.js ENTITY_REF_PATTERN). */
const TOKEN_OPEN = '⟦'; // ⟦
const TOKEN_CLOSE = '⟧'; // ⟧
// Already-emitted tokens, so a second pass / overlapping name never double-wraps.
// Matches BOTH the name link (⟦entity:…⟧, server-authored) and the pronoun link
// (⟦pronoun:…⟧, model-authored and normalized below) so name-wrapping freezes
// either kind and never reaches inside one.
const EXISTING_TOKEN = /⟦(?:entity|pronoun):[^|]+\|[^⟧]+⟧/g;

// A model-emitted pronoun link, before normalization. The clerk anchors it by the
// entity's NAME (or, on a re-run, its already-resolved id); normalizePronounTokens
// rewrites the anchor to the stable id (or unwraps it when the anchor is unknown).
const PRONOUN_TOKEN = /⟦pronoun:([^|]+)\|([^⟧]+)⟧/g;
// Any entity/pronoun token, capturing its display text — for stripping tokens out
// of a field that must stay raw (the editable secret.what textarea).
const ANY_TOKEN_DISPLAY = /⟦(?:entity|pronoun):[^|]+\|([^⟧]+)⟧/g;

// ── Pronoun links (the contract extension) ──────────────────────────────────
//
// Names are the SERVER's job (wrapProse wraps them from a fixed set). Pronouns
// are the CLERK's job: only the model knows which "he/she/they/it" refers to
// which entity, so — under the deploy-gated prompt contract — it emits a pronoun
// link ⟦pronoun:<entityName>|<pronoun>⟧ anchored by the entity's NAME. The
// server never invents a link target (THE FINITE-SEMANTICS LAW): it VALIDATES
// each emitted anchor against the same id set the client index resolves, and
// keeps the token ONLY when the anchor is a real entity. Everything else — an
// unwrapped pronoun, or one the clerk tagged with an unknown anchor — stays
// plain text (fail-open). The server never scans prose for pronouns itself.

/** The stable id + name tables a pronoun anchor is validated against. */
type PronounResolver = { nameToId: Map<string, string>; linkableIds: Set<string> };

/** The settlement's own stable id (mirrors the client index's `settlement` entry:
 *  entityLink('settlement', settlement) → id = settlement.id ?? refId ?? slug(name)). */
function settlementIdOf(settlement: any): string | null {
  if (!settlement || typeof settlement !== 'object') return null;
  if (typeof settlement.id === 'string' && settlement.id) return settlement.id;
  if (typeof settlement.refId === 'string' && settlement.refId) return settlement.refId;
  const name = typeof settlement.name === 'string' ? settlement.name.trim() : '';
  return name ? slugifyEntity(name) : null;
}

/**
 * Build the (name → id) + (id set) a pronoun anchor is validated against. Mirrors
 * what buildDossierEntityIndex registers for the pronoun-eligible antecedents:
 * every NPC / faction / neighbour (via collectEntityNameRefs, same id helpers),
 * each faction's rename-decoupled stable `faction.id` alias, and the settlement
 * itself (so "it/its" can link to the settlement, per the owner order). Total on
 * garbage — never throws. Pure.
 */
export function collectPronounResolver(settlement: any): PronounResolver {
  const nameToId = new Map<string, string>();
  const linkableIds = new Set<string>();
  const addName = (rawName: unknown, id: string) => {
    linkableIds.add(id);
    const name = typeof rawName === 'string' ? rawName.trim().toLowerCase() : '';
    if (name.length >= 2 && !nameToId.has(name)) nameToId.set(name, id);
  };

  for (const { name, id } of collectEntityNameRefs(settlement)) addName(name, id);

  // Faction stable-id aliases (buildDossierEntityIndex also registers these).
  const factions = Array.isArray(settlement?.powerStructure?.factions)
    ? settlement.powerStructure.factions
    : (Array.isArray(settlement?.factions) ? settlement.factions : []);
  for (const f of factions) {
    if (f && typeof f.id === 'string' && f.id) linkableIds.add(f.id);
  }

  // The settlement itself.
  const sid = settlementIdOf(settlement);
  if (sid) addName(typeof settlement?.name === 'string' ? settlement.name : '', sid);

  return { nameToId, linkableIds };
}

/**
 * Normalize the clerk's pronoun tokens in one prose string:
 *   - anchor already a known id (a re-run) ⇒ keep it (idempotent);
 *   - anchor a known entity NAME ⇒ rewrite to that entity's stable id;
 *   - anchor unknown ⇒ UNWRAP to the bare pronoun (fail-open plain text).
 * Never throws; a string with no pronoun token is returned untouched.
 */
export function normalizePronounTokens(prose: unknown, resolver: PronounResolver): unknown {
  if (typeof prose !== 'string' || prose.indexOf('⟦pronoun:') === -1) return prose;
  return prose.replace(new RegExp(PRONOUN_TOKEN.source, 'g'), (_full, rawAnchor: string, display: string) => {
    const anchor = String(rawAnchor);
    let id: string | null = null;
    if (resolver.linkableIds.has(anchor)) id = anchor;
    else {
      const byName = resolver.nameToId.get(anchor.trim().toLowerCase());
      if (byName) id = byName;
    }
    return id ? `${TOKEN_OPEN}pronoun:${id}|${display}${TOKEN_CLOSE}` : display;
  });
}

/** De-tokenize prose to plain text (every entity/pronoun token → its display),
 *  for a field that must stay raw. Mirrors the client proseToPlainText. */
export function stripTokens(prose: unknown): unknown {
  if (typeof prose !== 'string' || !prose) return prose;
  return prose.replace(new RegExp(ANY_TOKEN_DISPLAY.source, 'g'), '$1');
}

/**
 * Wrap known entity names inside a single prose string, and normalize any
 * model-emitted pronoun links first (so name-wrapping treats a kept pronoun token
 * as a frozen span and never reaches inside it).
 *
 * @param prose    The refined prose (may already contain tokens — never double-wrapped).
 * @param refs     Pre-sorted (longest-name-first) name→id table for this settlement.
 * @param resolver Optional pronoun anchor validator; when omitted, pronoun tokens pass through.
 * @returns The prose with matched names wrapped, pronoun anchors resolved/unwrapped.
 */
export function wrapProse(prose: unknown, refs: NameRef[], resolver?: PronounResolver): unknown {
  if (typeof prose !== 'string' || !prose) return prose;

  // 1) Resolve/validate the clerk's pronoun tokens up front. This can run with no
  //    name refs at all (a settlement whose only link is its own "it/its").
  const normalized = resolver ? String(normalizePronounTokens(prose, resolver)) : prose;
  if (!refs.length) return normalized;

  // Carve the prose into spans that are either an EXISTING token (frozen) or
  // free text (eligible). We only wrap inside free text, so a name already inside
  // a token — or a name that happens to spell another entity's display text —
  // is never re-wrapped.
  type Span = { text: string; frozen: boolean };
  let spans: Span[] = [{ text: normalized, frozen: false }];

  const splitOutTokens = (text: string): Span[] => {
    const out: Span[] = [];
    let last = 0;
    let m;
    const re = new RegExp(EXISTING_TOKEN.source, 'g');
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) out.push({ text: text.slice(last, m.index), frozen: false });
      out.push({ text: m[0], frozen: true });
      last = m.index + m[0].length;
    }
    if (last < text.length) out.push({ text: text.slice(last), frozen: false });
    return out.length ? out : [{ text, frozen: false }];
  };
  spans = spans.flatMap(s => (s.frozen ? [s] : splitOutTokens(s.text)));

  // Apply each ref (already longest-first) across the free spans. Each wrap turns
  // a free span into [free, frozen-token, free] so later refs can't reach inside.
  for (const { name, id } of refs) {
    const wordRe = new RegExp(`(?<![\\p{L}\\p{N}_])(${escapeRegExp(name)})(?![\\p{L}\\p{N}_])`, 'iu');
    const next: Span[] = [];
    for (const span of spans) {
      if (span.frozen) { next.push(span); continue; }
      let rest = span.text;
      let guard = 0;
      while (guard++ < 1000) {
        const match = wordRe.exec(rest);
        if (!match) break;
        const before = rest.slice(0, match.index);
        const hit = match[0];
        if (before) next.push({ text: before, frozen: false });
        next.push({ text: `${TOKEN_OPEN}entity:${id}|${hit}${TOKEN_CLOSE}`, frozen: true });
        rest = rest.slice(match.index + hit.length);
      }
      if (rest) next.push({ text: rest, frozen: false });
    }
    spans = next;
  }

  return spans.map(s => s.text).join('');
}

// ── Settlement-wide application ─────────────────────────────────────────────

const wrapIfString = (obj: any, key: string, refs: NameRef[], resolver?: PronounResolver) => {
  if (obj && typeof obj === 'object' && typeof obj[key] === 'string') {
    obj[key] = wrapProse(obj[key], refs, resolver);
  }
};

/**
 * Wrap entity refs across every free-form prose slice the dossier renders
 * through ProseParagraph / ProseText: the thesis, per-tab narrative notes, and
 * each NPC's goal.short. This does two things per field: wraps known entity NAMES
 * (server-authored) and resolves/validates the clerk's pronoun links (see
 * normalizePronounTokens — an unknown or unwrapped pronoun stays plain text).
 *
 * secret.what is intentionally excluded from wrapping — the web dossier renders it
 * through an inline-editable field whose textarea must hold raw, token-free prose.
 * Under the pronoun contract the clerk could still emit a token there, so instead
 * of leaving it untouched we STRIP any tokens out of it (defence-in-depth), keeping
 * the editor raw. Mutates `settlement` in place and returns it. Pure post-processing;
 * re-running OVERWRITES (the existing-token guard + idempotent pronoun normalize
 * mean a second pass never accumulates).
 */
export function wrapEntityRefsInProse(settlement: any): any {
  if (!settlement || typeof settlement !== 'object') return settlement;
  const refs = collectEntityNameRefs(settlement)
    // Longest name first so "John Smith" pre-empts "John".
    .sort((a, b) => b.name.length - a.name.length);
  const resolver = collectPronounResolver(settlement);
  // Even with no wrappable NAMES, the clerk's pronoun links (incl. the settlement's
  // own "it/its") still need resolving — so proceed whenever there is any link work.
  if (!refs.length && resolver.linkableIds.size === 0) return settlement;

  // Thesis.
  wrapIfString(settlement, 'thesis', refs, resolver);

  // Per-tab narrative notes (flat string map).
  if (settlement.narrativeNotes && typeof settlement.narrativeNotes === 'object') {
    for (const k of Object.keys(settlement.narrativeNotes)) {
      wrapIfString(settlement.narrativeNotes, k, refs, resolver);
    }
  }

  // NPC goal.short (pure read-only prose). secret.what is NOT wrapped; it is
  // sanitized (any clerk-emitted token stripped) so the editable field stays raw.
  if (Array.isArray(settlement.npcs)) {
    for (const npc of settlement.npcs) {
      if (npc?.goal && typeof npc.goal === 'object') wrapIfString(npc.goal, 'short', refs, resolver);
      if (npc?.secret && typeof npc.secret === 'object' && typeof npc.secret.what === 'string') {
        npc.secret.what = stripTokens(npc.secret.what);
      }
    }
  }

  return settlement;
}

export default wrapEntityRefsInProse;
