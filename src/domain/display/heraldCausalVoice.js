/**
 * domain/display/heraldCausalVoice.js — THE HERALD'S THREE PROSE REGISTERS
 * (SP-6's THE TWO REGISTERS + SCOPE AND THE SURFACE CONTRACT amendments,
 * 2026-08-03).
 *
 * The Herald entry is FOUR TIERS; this module composes the three that are prose:
 *
 *   1. HEADLINE   the hook. The recorded event plus AT MOST ONE causal gesture —
 *                 one join, one connective clause, hard length cap. Chain shapes
 *                 of two-plus links are FORBIDDEN in this register, by pin.
 *   2. SUBHEADER  one plain, unembellished sentence of what happened. Clarity
 *                 only, no voice, no figure, no connective. THE VISIBLE HONESTY
 *                 ANCHOR: the headline may sing because the subheader states.
 *   3. TELLING    behind the click, the full composed chain — multi-link,
 *                 coherent, entailed per link, freed from headline compression.
 *                 PULL, NEVER PUSH: the pacing governor reads headlines only, so
 *                 nothing here contributes to a section cap or a significance floor.
 *
 *   (4. the cause-walk TABLE is not prose and stays CauseWalkPanel's.)
 *
 * ── THE CONTAMINATION FENCE (structural, K3 INVERTED) ───────────────────────
 * THE HERALD IS THE DM'S PAPER AND IT ALWAYS TELLS THE TRUTH. No manipulation at
 * the rumor or local level ever permeates it: this composer may never read a
 * rumor ledger, a belief map, or a disinfo record AS A CONTENT SOURCE. Its
 * inputs are truth-side events and receipts only — the cause walk over the
 * recorded provenance ledger, and the receipts' own byte-verbatim headlines.
 * The import list below is CLOSED and pinned by
 * tests/lint/heraldContaminationFence.test.js, with a guard-the-guard positive
 * control proving the scan bites. Where a cause WAS a belief or a lie, the
 * Herald reports the BELIEVING or the PLANTING as the true event it is — that is
 * the `believed` / `planted` connective pool's charter, and the pool lives in the
 * grammar module, not in a belief source.
 *
 * ── PER-LINK ENTAILMENT ─────────────────────────────────────────────────────
 * Every clause asserts only its OWN receipt's facts, byte-verbatim, and every
 * connective is licensed by the ACTUAL provenance edge between the two receipts.
 * The recorded ledger stores a PARENT LINK and the child's structural type — it
 * does not store a relation — so an edge stronger than plain succession must be
 * POSITIVELY WARRANTED by a field the receipt carries (EDGE_WARRANTS below).
 * Unwarranted links draw from `followed`, which asserts temporal succession and
 * nothing more; they NEVER fall back to `caused`. A composer that reached for
 * `caused` when `followed` did not fit would manufacture exactly the causality
 * the corpus promises never to manufacture.
 *
 * ── DORMANCY ────────────────────────────────────────────────────────────────
 * Dark unless `simulationRules.heraldCausalVoiceEnabled === true`. Every entry
 * point returns null when dark, so the feed is byte-identical to a world that
 * never lit the flag.
 *
 * PURE: no store, no React, no Date, no Math.random, no I/O, no mutation.
 *
 * @enforced-by tests/domain/heraldCausalVoice.test.js
 * @enforced-by tests/lint/heraldContaminationFence.test.js
 */

import {
  CONNECTIVE_POOLS,
  POOL_PARENT,
  connectiveFor,
  pickCausal,
  terminalLine,
  timeBandOf,
  timeBandWord,
} from './heraldCausalGrammar.js';

/** The virtual dormancy flag (the discourseProseActive idiom). */
export function heraldCausalVoiceActive(worldState) {
  const rules = worldState && typeof worldState === 'object'
    ? /** @type {Record<string, unknown>} */ (worldState).simulationRules : null;
  return !!(rules && typeof rules === 'object'
    && /** @type {Record<string, unknown>} */ (rules).heraldCausalVoiceEnabled === true);
}

/**
 * THE HEADLINE REGISTER'S HARD CAPS. One gesture, one sentence, one length. The
 * ceiling the amendment names verbatim is "X declares vengeance on its weakened
 * neighbour — a generation's grudge will be met"; the cap is set above it with
 * room for longer settlement names and nothing else.
 */
export const HEADLINE_MAX_GESTURES = 1;
export const HEADLINE_MAX_CHARS = 160;

/**
 * EDGE WARRANTS — the receipt fields that license an edge stronger than plain
 * succession. Each row names the field the engine actually records; a link with
 * none of them is `followed`.
 *
 * Order matters: the FIRST warrant that matches wins, most-specific first, so a
 * refusal that also carries `causes[]` reads as the refusal it is.
 * @type {ReadonlyArray<{ pool: string, warrant: (link: Record<string, unknown>) => boolean }>}
 */
const EDGE_WARRANTS = Object.freeze([
  // The DM arm: the child telling carries a synthetic disinfo lineage. The pool
  // itself degrades to `believed` for a player audience inside connectiveFor —
  // this module never learns the planter's name.
  { pool: 'planted', warrant: (l) => Array.isArray(l.lineageIds) && l.lineageIds.length > 0 },
  // A covert prior surfaced: the receipt for the SURFACING is what is new.
  { pool: 'exposed', warrant: (l) => /_exposed$|_unmasked$/.test(String(l.type || '')) },
  // The non-act edge — a named refusal is the cause. The counterforce's home.
  { pool: 'refused', warrant: (l) => /_refused$|_refusal$|^declined_/.test(String(l.type || '')) },
  // An obligation defaulted or a term broken.
  { pool: 'breached', warrant: (l) => /_default$|_default_detected$|_breached$|_unpaid$/.test(String(l.type || '')) },
  // The parent condition ceased to hold and the effect ended with it.
  { pool: 'dissolved', warrant: (l) => /_dissolved$|_lapsed$|_resolved$/.test(String(l.type || '')) },
  // The strict causal parent: a `causes[]` entry naming the prior, or a
  // `sourceEventId` pointing at the producing event. THE ONLY edge licensed to
  // render as causation without qualification.
  { pool: 'caused', warrant: (l) => l.causedByParent === true },
]);

/**
 * The connective pool one link draws from. The default is `followed`, and the
 * default is load-bearing: it asserts succession and refuses causation.
 * @param {Record<string, unknown>} link
 * @returns {string}
 */
export function poolForLink(link) {
  const row = link && typeof link === 'object' ? link : {};
  for (const { pool, warrant } of EDGE_WARRANTS) {
    if (warrant(/** @type {Record<string, unknown>} */ (row))) return pool;
  }
  return 'followed';
}

/** A connective whose text still holds an unfilled slot may never print. */
function fillable(text) {
  return !/\{[a-z_]+\}/.test(String(text));
}

/**
 * Draw a printable connective for one link: the pool the edge licenses, in one
 * held direction, filtered to lines this composer can fill. Null ⇒ the link is
 * DROPPED (never re-labelled).
 * @param {Object} args
 * @param {Record<string, unknown>} args.link
 * @param {string} args.seed
 * @param {'back'|'fwd'} args.direction
 * @param {boolean} args.seesSecrets
 * @returns {{ text: string, pool: string, edge: string, arg: string }|null}
 */
function connectiveForLink({ link, seed, direction, seesSecrets }) {
  const pool = poolForLink(link);
  const drawn = connectiveFor({ pool, seed, direction, seesSecrets });
  if (!drawn) return null;
  if (fillable(drawn.text)) return { text: drawn.text, pool: drawn.pool, edge: drawn.edge, arg: drawn.arg };
  // The drawn line needs a slot this composer cannot fill; retry within the same
  // pool over the fillable subset only, so the EDGE never changes to suit the
  // prose. Still nothing ⇒ drop the link.
  const lines = (CONNECTIVE_POOLS[drawn.pool] || []).filter((l) => l.dir === direction && fillable(l.text));
  const retry = pickCausal(lines, `${seed}::conn-fill::${drawn.pool}::${direction}`);
  return retry
    ? { text: retry.text, pool: drawn.pool, edge: POOL_PARENT[drawn.pool], arg: retry.arg }
    : null;
}

/**
 * A time-band gesture for a link, when the record dates it. `position` is the
 * mold's print position; the predicate-only sixth band returns null in the other
 * three, and the caller falls back to the bare connective rather than printing a
 * broken phrase.
 * @param {Object} args
 * @param {number|null} args.sinceTicks
 * @param {'attributive'|'span'|'since'|'predicate'} args.position
 * @param {number} [args.intervalWeeks]
 * @returns {string|null}
 */
export function timeGesture({ sinceTicks, position, intervalWeeks = 1 }) {
  if (sinceTicks == null || !Number.isFinite(sinceTicks)) return null;
  return timeBandWord(timeBandOf(sinceTicks, intervalWeeks), position);
}

/**
 * THE HEADLINE REGISTER. The recorded event, byte-verbatim, plus at most ONE
 * causal gesture drawn off the NEAREST recorded parent. Two-plus-link chain
 * shapes are structurally impossible here: exactly one link is ever consumed.
 *
 * Returns null when the voice is dark, when the item carries no recorded
 * headline, or when there is no parent to gesture at — in which case the surface
 * renders the recorded headline exactly as it does today.
 *
 * @param {Object} args
 * @param {unknown} args.worldState
 * @param {{ headline?: string, id?: string }} args.item
 * @param {{ chain?: ReadonlyArray<Record<string, unknown>> }} args.walk
 * @param {string} args.seed
 * @param {boolean} [args.seesSecrets]
 * @returns {{ text: string, gestures: number, pool: string, edge: string }|null}
 */
export function heraldHeadlineRegister({ worldState, item, walk, seed, seesSecrets = false }) {
  if (!heraldCausalVoiceActive(worldState)) return null;
  const event = String(item?.headline || '').trim();
  if (!event) return null;
  const chain = Array.isArray(walk?.chain) ? walk.chain : [];
  // THE NEAREST parent only. `depth === 1` is a direct parent of the root; a
  // deeper hop would be a second link and this register forbids chains.
  const nearest = chain.find((hop) => Number(hop?.depth) === 1) || null;
  if (!nearest) return null;
  // A redacted hop carries a placeholder, not a fact; a headline never gestures
  // at a hole. The item stands alone instead.
  if (nearest.redacted === true) return null;
  const parentClause = String(nearest.headline || '').trim();
  if (!parentClause) return null;

  const connective = connectiveForLink({ link: nearest, seed: `${seed}::headline`, direction: 'back', seesSecrets });
  if (!connective) return null;
  // `A` connectives carry their own parent and take no argument; in the headline
  // register that would leave the gesture pointing at nothing the reader can see.
  if (connective.arg === 'A') return null;

  const text = `${event} — ${connective.text} ${parentClause}`;
  if (text.length > HEADLINE_MAX_CHARS) return null;
  return { text, gestures: HEADLINE_MAX_GESTURES, pool: connective.pool, edge: connective.edge };
}

/**
 * THE SUBHEADER REGISTER. One plain, unembellished statement of what happened.
 * NO connective, NO figure, NO forward-looking clause — this register composes
 * NOTHING: it hands back the recorded summary the engine already wrote, trimmed
 * to one sentence. That is the whole point of the honesty anchor: a headline
 * whose gesture the subheader cannot restate plainly is a headline that overran
 * its receipt, and the only way the subheader can prove it is by being the
 * record rather than a rendering of it.
 *
 * @param {Object} args
 * @param {unknown} args.worldState
 * @param {{ summary?: string, headline?: string }} args.item
 * @returns {{ text: string }|null}
 */
export function heraldSubheaderRegister({ worldState, item }) {
  if (!heraldCausalVoiceActive(worldState)) return null;
  const recorded = String(item?.summary || '').trim();
  if (!recorded) return null;
  // One sentence. A recorded summary that runs on is cut at its first full stop
  // rather than re-written — the register never authors.
  const firstStop = recorded.search(/[.!?](\s|$)/);
  const one = firstStop >= 0 ? recorded.slice(0, firstStop + 1) : recorded;
  return { text: one.trim() };
}

/**
 * THE TELLING REGISTER. The full composed chain, behind the click.
 *
 * ONE DIRECTION, HELD: a telling picks `back` or `fwd` once and keeps it for the
 * whole chain; mixing them mid-sentence is how a reader loses which end is the
 * cause. Per-link entailment holds link by link — every clause is its own
 * receipt's byte-verbatim headline, every connective is its own edge's.
 *
 * Redacted hops keep their place in the SHAPE but contribute no connective: the
 * walk already replaced their content, and a connective drawn over a placeholder
 * would assert a relation to something the viewer cannot see.
 *
 * THE TERMINAL is seeded on the VISIBLE chain only — `chain_end` serves both the
 * genuine origin and a covert truncation, so a seed that included the hidden link
 * would leak the seam through variant selection.
 *
 * @param {Object} args
 * @param {unknown} args.worldState
 * @param {{ root?: { headline?: string }|null, chain?: ReadonlyArray<Record<string, unknown>>, atRoot?: boolean, ledgerDark?: boolean }} args.walk
 * @param {string} args.seed
 * @param {boolean} [args.seesSecrets]
 * @param {'back'|'fwd'} [args.direction]
 * @param {'chain_end'|'horizon'} [args.terminal]
 * @returns {{ links: Array<{ id: string, clause: string, connective: string|null, pool: string|null, edge: string|null, redacted: boolean }>, text: string, terminal: string }|null}
 */
export function heraldTellingRegister({
  worldState, walk, seed, seesSecrets = false, direction = 'back', terminal = 'chain_end',
}) {
  if (!heraldCausalVoiceActive(worldState)) return null;
  const chain = Array.isArray(walk?.chain) ? walk.chain : [];
  const rootClause = String(walk?.root?.headline || '').trim();
  if (!rootClause) return null;

  const held = direction === 'fwd' ? 'fwd' : 'back';
  /** @type {Array<{ id: string, clause: string, connective: string|null, pool: string|null, edge: string|null, redacted: boolean }>} */
  const links = [];
  /** @type {string[]} */
  const visibleIds = [];
  for (const hop of chain) {
    const clause = String(hop?.headline || '').trim();
    if (!clause) continue;
    const redacted = hop?.redacted === true;
    if (redacted) {
      links.push({ id: String(hop.id ?? ''), clause, connective: null, pool: null, edge: null, redacted: true });
      continue;
    }
    visibleIds.push(String(hop.id ?? ''));
    const drawn = connectiveForLink({
      link: /** @type {Record<string, unknown>} */ (hop),
      seed: `${seed}::telling::${hop.id ?? ''}`,
      direction: held,
      seesSecrets,
    });
    // A link with no printable connective is DROPPED, never re-labelled.
    if (!drawn) continue;
    links.push({ id: String(hop.id ?? ''), clause, connective: drawn.text, pool: drawn.pool, edge: drawn.edge, redacted: false });
  }

  const terminalText = terminalLine({
    terminal,
    // VISIBLE CHAIN ONLY.
    seed: `${seed}::visible::${visibleIds.join('|')}`,
    covertTruncation: links.some((l) => l.redacted),
  });

  const sentences = [rootClause];
  for (const link of links) {
    if (link.redacted || !link.connective) { sentences.push(link.clause); continue; }
    sentences.push(held === 'back' ? `${link.connective} ${link.clause}` : `${link.clause}, ${link.connective}`);
  }
  const text = `${sentences.join('; ')} — ${terminalText}.`;
  return { links, text, terminal: terminalText };
}

/**
 * The whole entry's prose, composed once. Any register may be null (dark, or
 * nothing recorded to say); the surface renders what it gets and nothing else.
 * @param {Object} args
 * @param {unknown} args.worldState
 * @param {{ headline?: string, summary?: string, id?: string }} args.item
 * @param {{ root?: unknown, chain?: ReadonlyArray<Record<string, unknown>> }} args.walk
 * @param {string} args.seed
 * @param {boolean} [args.seesSecrets]
 * @returns {{ headline: ReturnType<typeof heraldHeadlineRegister>, subheader: ReturnType<typeof heraldSubheaderRegister>, telling: ReturnType<typeof heraldTellingRegister> }}
 */
export function heraldEntryProse({ worldState, item, walk, seed, seesSecrets = false }) {
  return {
    headline: heraldHeadlineRegister({ worldState, item, walk, seed, seesSecrets }),
    subheader: heraldSubheaderRegister({ worldState, item }),
    telling: heraldTellingRegister({ worldState, walk, seed, seesSecrets }),
  };
}
