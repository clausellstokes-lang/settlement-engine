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

  for (const npc of (settlement?.npcs || [])) {
    push(npc?.name || npc?.label, npcIdFor(npc));
  }
  const factions = settlement?.powerStructure?.factions || settlement?.factions || [];
  for (const f of factions) {
    const name = f?.faction || f?.name || f?.label;
    push(name, factionIdFromName(name));
  }
  for (const n of (settlement?.neighbourNetwork || [])) {
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
const EXISTING_TOKEN = /⟦entity:[^|]+\|[^⟧]+⟧/g;

/**
 * Wrap known entity names inside a single prose string.
 *
 * @param prose The refined prose (may already contain tokens — never double-wrapped).
 * @param refs  Pre-sorted (longest-name-first) name→id table for this settlement.
 * @returns The prose with matched names wrapped in entity tokens.
 */
export function wrapProse(prose: unknown, refs: NameRef[]): unknown {
  if (typeof prose !== 'string' || !prose || !refs.length) return prose;

  // Carve the prose into spans that are either an EXISTING token (frozen) or
  // free text (eligible). We only wrap inside free text, so a name already inside
  // a token — or a name that happens to spell another entity's display text —
  // is never re-wrapped.
  type Span = { text: string; frozen: boolean };
  let spans: Span[] = [{ text: prose, frozen: false }];

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

const wrapIfString = (obj: any, key: string, refs: NameRef[]) => {
  if (obj && typeof obj === 'object' && typeof obj[key] === 'string') {
    obj[key] = wrapProse(obj[key], refs);
  }
};

/**
 * Wrap entity refs across every free-form prose slice the dossier renders
 * through ProseParagraph / ProseText: the thesis, per-tab narrative notes, and
 * each NPC's goal.short. (secret.what is intentionally excluded: the web dossier
 * renders it through an inline-editable field whose textarea must hold raw,
 * token-free prose — wrapping it would leak ⟦…⟧ tokens into the editor.) Mutates
 * `settlement` in place and returns
 * it. Pure post-processing — structured mentions and non-prose fields are
 * untouched, and re-running OVERWRITES (the existing-token guard means a second
 * pass never accumulates).
 */
export function wrapEntityRefsInProse(settlement: any): any {
  if (!settlement || typeof settlement !== 'object') return settlement;
  const refs = collectEntityNameRefs(settlement)
    // Longest name first so "John Smith" pre-empts "John".
    .sort((a, b) => b.name.length - a.name.length);
  if (!refs.length) return settlement;

  // Thesis.
  wrapIfString(settlement, 'thesis', refs);

  // Per-tab narrative notes (flat string map).
  if (settlement.narrativeNotes && typeof settlement.narrativeNotes === 'object') {
    for (const k of Object.keys(settlement.narrativeNotes)) {
      wrapIfString(settlement.narrativeNotes, k, refs);
    }
  }

  // NPC goal.short (pure read-only prose). secret.what is excluded — see the
  // doc note above; it routes through an editable field that must stay raw.
  if (Array.isArray(settlement.npcs)) {
    for (const npc of settlement.npcs) {
      if (npc?.goal && typeof npc.goal === 'object') wrapIfString(npc.goal, 'short', refs);
    }
  }

  return settlement;
}

export default wrapEntityRefsInProse;
