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
 * ── THE ARGUMENT FORM (§3's four tags, dispatched) ──────────────────────────
 * Every connective declares what its slot takes — `N` a noun phrase, `F` a
 * finite clause, `V` a bare verb phrase, `A` nothing at all. The walk hands this
 * composer one FINITE CLAUSE per hop, so an `N` line fed the raw clause prints
 * "against the refusal of the eastern road was cut". §1's JOIN MOLDS are the
 * supply those tags were written to receive: `heraldJoinMolds.js` renders the
 * hop's own clause in the form the slot demands, per pool, asserting nothing the
 * edge does not carry. THE RULE HERE: a connective line is DRAWABLE only when
 * its argument is molded for its pool — an unmolded line (and every `A` line,
 * which carries its own parent and would point at nothing this page showed) is
 * never drawn, and a pool with no drawable line in the held direction DROPS the
 * link rather than re-labelling it into a pool whose edge would fit the prose.
 *
 * ── THE CLAUSE FLOOR (lane HR) ──────────────────────────────────────────────
 * Not everything the walk hands over is a clause. A hop the provenance ledger
 * names but no pulseHistory record resolves arrives as `UNRECEIPTED_HOP` — "an
 * earlier cause", a NOUN PHRASE with `redacted:false` — and a durable record with
 * no headline arrives as one of chronicleGraph's two pulse fallbacks. Fed to a
 * slot they compose "— in the wake of the day an earlier cause": a connective
 * asserting a relation to a receipt nobody found.
 *
 * Such a hop is TERMINAL, treated exactly as a REDACTED one: the causal clause is
 * DROPPED, the edge is never re-labelled to make the prose fit, and §3.2's
 * terminal carries the honesty instead — `chain_end`, whose whole family says the
 * record does not reach further back. The guard binds to
 * `receiptClauseFloor.isPlaceholderClause`, never to a literal, because a private
 * copy would keep composing over the placeholder the day a wording moved.
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
  audiencePoolFor,
  pickCausal,
  terminalLine,
  timeBandOf,
  timeBandWord,
} from './heraldCausalGrammar.js';
import { argIsMolded, moldFormFor } from './heraldJoinMolds.js';
import { isPlaceholderClause } from './receiptClauseFloor.js';

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
 * THE PLANT MARKER — the prefix the plant writers stamp on the SYNTHETIC lineage
 * id they mint (`disinfo:{liarId}:{audienceId}:{seededTick}`).
 *
 * WHY A PREFIX AND NOT PRESENCE. `lineageIds` is the ORDINARY telling lineage:
 * `rumorNetwork.js` writes `[eventRef, originTelling]` on EVERY arrival and
 * appends a relay id on every hop, so "carries a lineage" describes every
 * receipt that ever travelled and marks nothing. Warranting on presence made the
 * paper call an ordinary carried report PLANTED while the integrity register,
 * reading the same hop, called it clean — one popup, two answers, and the
 * grander one was the false one. The marker is the spelling, and only the
 * spelling.
 *
 * THE FENCE HOLDS: this is STRING DISCIPLINE over an id the walk already
 * resolved onto the hop. The composer does not read the disinfo ledger, cannot
 * reach it, and learns nothing about who planted what — that stays the audit
 * register's, on the other side of the fence, where it belongs. The one
 * occurrence of the token here is a REVIEWED exemption in
 * tests/lint/heraldContaminationFence.test.js, pinned verbatim so it cannot grow.
 */
export const PLANTED_LINEAGE_PREFIX = 'disinfo:';

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
  // The DM arm: the hop's lineage carries a SYNTHETIC id, marked by the plant
  // writers' own prefix. Presence of a lineage marks nothing — every carried
  // telling has one — so the warrant is the SPELLING (see
  // PLANTED_LINEAGE_PREFIX). The pool degrades to `believed` for a player
  // audience; this module never learns the planter's name either way.
  {
    pool: 'planted',
    warrant: (l) => Array.isArray(l.lineageIds)
      && l.lineageIds.some((id) => String(id).startsWith(PLANTED_LINEAGE_PREFIX)),
  },
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
 * DIRECTION SAFETY (lane HR) — the type-warranted pools whose FORWARD corpus
 * lines presuppose that the CHILD is the warranted thing, and so compose a false
 * claim when pointed at it.
 *
 * A type warrant is read off the PARENT's own `type`: `plant_exposed` says the
 * PARENT was the surfacing, `peace_refused` that the PARENT was the refusal,
 * `treaty_default_detected` that the PARENT was the breach. In `back` the
 * connective sits after the child and points at that parent, so every line is
 * true. In `fwd` it sits after the parent and points at the child, and the same
 * lines say "and what came out was the truth that <child>", "and the refusal
 * entered against it is what stood at issue when <child>", "and what was broken
 * was the promise that stood until <child>" — three assertions the ledger does
 * not carry, about the wrong end of the edge.
 *
 * So in `fwd` these three fall back to the DIRECTION-NEUTRAL families: `caused`
 * when the origination warrant is independently present on the link, `followed`
 * otherwise. That is a demotion, never a promotion — `followed` asserts
 * succession and nothing more, which is exactly what a forward hop is known to
 * be.
 *
 * NOT LISTED, AND DELIBERATELY: `dissolved`, whose only `fwd` line is an `A` and
 * therefore already undrawable, and `planted`, whose only `fwd` line spends the
 * declared `planted::N` hole. Both are permanent forward drops today, and
 * redirecting them here would silently convert a recorded drop into prose.
 *
 * THIS RE-OPENS PER POOL. The restriction is a property of the CORPUS, not of the
 * edge: the day §3 authors a forward line for one of these that predicates on the
 * parent rather than the child, that pool comes off this list and keeps its full
 * warrant in both directions.
 * @type {ReadonlyArray<string>}
 */
const FWD_CHILD_PRESUPPOSING_POOLS = Object.freeze(['exposed', 'refused', 'breached']);

/**
 * The connective pool one link draws from, in the direction it will be read. The
 * default is `followed`, and the default is load-bearing: it asserts succession
 * and refuses causation.
 * @param {Record<string, unknown>} link
 * @param {'back'|'fwd'} [direction]
 * @returns {string}
 */
export function poolForLink(link, direction = 'back') {
  const row = link && typeof link === 'object' ? link : {};
  for (const { pool, warrant } of EDGE_WARRANTS) {
    if (!warrant(/** @type {Record<string, unknown>} */ (row))) continue;
    if (direction === 'fwd' && FWD_CHILD_PRESUPPOSING_POOLS.includes(pool)) {
      return row.causedByParent === true ? 'caused' : 'followed';
    }
    return pool;
  }
  return 'followed';
}

/** A connective whose text still holds an unfilled slot may never print. */
function fillable(text) {
  return !/\{[a-z_]+\}/.test(String(text));
}

/**
 * THE DRAWABLE SUBSET of a pool in one direction: lines whose slots this
 * composer can fill AND whose argument type it can mold. Filtering BEFORE the
 * draw rather than repairing after it is what makes the law structural — an
 * ungrammatical line is not rejected downstream, it is never selected.
 * @param {string} pool
 * @param {'back'|'fwd'} direction
 * @returns {ReadonlyArray<{ text: string, dir: string, arg: string }>}
 */
function drawableLines(pool, direction) {
  const lines = CONNECTIVE_POOLS[pool] || [];
  return lines.filter((l) => l.dir === direction && fillable(l.text) && argIsMolded(pool, l.arg));
}

/**
 * Draw a printable connective for one link: the pool the edge licenses, in one
 * held direction, over the drawable subset only. Null ⇒ the link is DROPPED
 * (never re-labelled — the EDGE never changes to suit the prose).
 * @param {Object} args
 * @param {Record<string, unknown>} args.link
 * @param {string} args.seed
 * @param {'back'|'fwd'} args.direction
 * @param {boolean} args.seesSecrets
 * @returns {{ text: string, pool: string, edge: string, arg: string }|null}
 */
function connectiveForLink({ link, seed, direction, seesSecrets }) {
  // The audience swap happens FIRST and once: on a player surface the DM-only
  // `planted` arm degrades to `believed` by connective swap (R-W5-F), and the
  // drawable subset is then measured against the pool actually being read.
  // …and the DIRECTION is consulted before the audience swap, because a pool that
  // presupposes the child in `fwd` is unsafe for every audience.
  const pool = audiencePoolFor(poolForLink(link, direction), !!seesSecrets);
  const drawn = pickCausal(drawableLines(pool, direction), `${seed}::conn::${pool}::${direction}`);
  if (!drawn) return null;
  return { text: drawn.text, pool, edge: POOL_PARENT[pool], arg: drawn.arg };
}

/**
 * One link's connective AND its argument, composed. Null ⇒ the link is dropped:
 * either no line in the pool is drawable, or the hop carried no clause to put in
 * the slot. Never a connective without its argument, and never an argument in a
 * form the pool did not license.
 * @param {Object} args
 * @param {Record<string, unknown>} args.link
 * @param {string} args.clause  the hop's own byte-verbatim recorded headline
 * @param {string} args.seed
 * @param {'back'|'fwd'} args.direction
 * @param {boolean} args.seesSecrets
 * @returns {{ text: string, pool: string, edge: string, arg: string, argText: string }|null}
 */
function joinForLink({ link, clause, seed, direction, seesSecrets }) {
  const connective = connectiveForLink({ link, seed, direction, seesSecrets });
  if (!connective) return null;
  const argText = moldFormFor({ pool: connective.pool, arg: connective.arg, clause, seed });
  if (!argText) return null;
  return { ...connective, argText };
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
 * @returns {{ text: string, gestures: number, pool: string, edge: string, arg: string, argText: string }|null}
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
  // …and neither does it gesture at a PLACEHOLDER. An unreceipted hop and a
  // headline-less pulse record both arrive as noun phrases, not as the parent's
  // own words; a gesture drawn over one would assert a relation to a receipt the
  // walk never found. The item stands alone instead (lane HR).
  if (isPlaceholderClause(parentClause)) return null;

  // The gesture is the connective AND the argument its slot demands, molded from
  // this hop's own clause. `A` lines are not drawable at all (they carry their
  // own parent and would leave the gesture pointing at nothing the reader can
  // see), so the register cannot compose one by construction.
  const join = joinForLink({
    link: nearest, clause: parentClause, seed: `${seed}::headline`, direction: 'back', seesSecrets,
  });
  if (!join) return null;

  const text = `${event} — ${join.text} ${join.argText}`;
  if (text.length > HEADLINE_MAX_CHARS) return null;
  return {
    text, gestures: HEADLINE_MAX_GESTURES, pool: join.pool, edge: join.edge, arg: join.arg, argText: join.argText,
  };
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
 * One composed link of a telling. `argText` is the molded argument — the OTHER
 * end of this link, in the form the connective's slot declares — and `arg` is the
 * §3 tag that chose the mold, so a pin can parse the shape rather than the words.
 * `childId` / `childClause` name the link's child in the printed sequence, and
 * `childKept` is false when that hop was dropped.
 * @typedef {Object} TellingLink
 * @property {string} id
 * @property {string} clause
 * @property {string|null} connective
 * @property {string|null} arg
 * @property {string|null} argText
 * @property {string|null} pool
 * @property {string|null} edge
 * @property {boolean} redacted
 * @property {boolean} clauseless  true when the hop carried a PLACEHOLDER rather
 *   than a clause of its own (an unreceipted parent, or a record with no headline)
 * @property {string} childId
 * @property {string} childClause
 * @property {boolean} childKept
 */

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
 * would assert a relation to something the viewer cannot see. CLAUSELESS hops —
 * an unreceipted parent, a record that carried no headline — are treated exactly
 * the same way and for the neighbouring reason: there is nothing to relate to,
 * rather than nothing you may see (lane HR).
 *
 * THE ARGUMENT IS THE OTHER END OF THE LINK. `back` puts the connective after the
 * CHILD pointing at the PARENT, so the argument is the hop's own clause; `fwd`
 * puts it after the PARENT pointing at the CHILD, so the argument is the child's
 * clause and the whole telling runs deepest-first. Either way the argument is
 * MOLDED into the form the connective's slot declares. A `fwd` link whose child
 * was dropped keeps its clause and loses its connective: a connective reaching
 * across a dropped hop would assert an edge the walk does not hold.
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
 * @returns {{ links: Array<TellingLink>, text: string, terminal: string }|null}
 */
export function heraldTellingRegister({
  worldState, walk, seed, seesSecrets = false, direction = 'back', terminal = 'chain_end',
}) {
  if (!heraldCausalVoiceActive(worldState)) return null;
  const chain = Array.isArray(walk?.chain) ? walk.chain : [];
  const rootClause = String(walk?.root?.headline || '').trim();
  if (!rootClause) return null;

  const held = direction === 'fwd' ? 'fwd' : 'back';
  /** @type {Array<TellingLink>} */
  const links = [];
  /** @type {string[]} */
  const visibleIds = [];
  // The CHILD of chain[i] in the printed sequence: the root for the nearest hop,
  // otherwise the hop before it. `childKept` is false when that hop was dropped,
  // which forbids a `fwd` connective from reaching across the gap.
  let childId = '';
  let childClause = rootClause;
  let childKept = true;
  for (const hop of chain) {
    const clause = String(hop?.headline || '').trim();
    const hopId = String(hop?.id ?? '');
    if (!clause) { childId = hopId; childClause = clause; childKept = false; continue; }
    const redacted = hop?.redacted === true;
    // A hop that carries no clause OF ITS OWN — an unreceipted parent, or a
    // durable record that recorded no headline. Terminal in the same sense a
    // redacted hop is: it keeps its place in the SHAPE and contributes no
    // connective, in either direction.
    const clauseless = !redacted && isPlaceholderClause(clause);
    if (redacted || clauseless) {
      // A covert hop's id may never seed the terminal (it would leak the seam
      // through variant selection); a clauseless one is not a secret, and its
      // placeholder does print, so it counts as visible.
      if (clauseless) visibleIds.push(hopId);
      links.push({ id: hopId, clause, connective: null, arg: null, argText: null, pool: null, edge: null, redacted, clauseless, childId, childClause, childKept });
      // `childKept:false` is the OTHER half of the guard, and it is what stops the
      // defect one link deeper: in `fwd` the connective's argument is the CHILD's
      // clause, so a placeholder left "kept" would be molded into the next link's
      // slot instead of this one's.
      childId = hopId; childClause = clause; childKept = false;
      continue;
    }
    visibleIds.push(hopId);
    // In `fwd` the connective points at the CHILD, so the child's clause is what
    // the slot receives — and a missing child means no connective at all.
    const argSource = held === 'back' ? clause : (childKept ? childClause : '');
    const drawn = argSource
      ? joinForLink({
        link: /** @type {Record<string, unknown>} */ (hop),
        clause: argSource,
        seed: `${seed}::telling::${hopId}`,
        direction: held,
        seesSecrets,
      })
      : null;
    // A link with no printable connective is DROPPED, never re-labelled. In `fwd`
    // the hop stays in the sequence so its own clause is not lost with it.
    if (!drawn && held === 'back') { childId = hopId; childClause = clause; childKept = false; continue; }
    links.push({
      id: hopId,
      clause,
      connective: drawn ? drawn.text : null,
      arg: drawn ? drawn.arg : null,
      argText: drawn ? drawn.argText : null,
      pool: drawn ? drawn.pool : null,
      edge: drawn ? drawn.edge : null,
      redacted: false,
      clauseless: false,
      childId,
      childClause,
      childKept,
    });
    childId = hopId; childClause = clause; childKept = true;
  }

  const terminalText = terminalLine({
    terminal,
    // VISIBLE CHAIN ONLY.
    seed: `${seed}::visible::${visibleIds.join('|')}`,
    // BOTH truncations forbid `horizon`. A covert seam because naming retention
    // there would be a tell; a clauseless hop because the walk cannot tell a root
    // `sourceEventId` from a receipt aged past MAX_HISTORY, so "the trail runs
    // past living memory" would be a coin-flip claim. `chain_end` is true of both.
    truncated: links.some((l) => l.redacted || l.clauseless),
  });

  const text = `${composeSentences({ links, rootClause, held }).join('; ')} — ${terminalText}.`;
  return { links, text, terminal: terminalText };
}

/**
 * The telling's sentences, in the held direction's own order.
 *
 * `back` reads newest-first: the root, then each connective with the parent it
 * points at, molded into the slot's form. `fwd` reads oldest-first: the deepest
 * clause, then each connective with the CHILD it points at — so the sequence is
 * reversed and every clause is emitted exactly once, either as the head or as
 * some connective's argument. A link that lost its connective emits its child's
 * clause plainly, asserting no relation at all.
 * @param {Object} args
 * @param {ReadonlyArray<TellingLink>} args.links
 * @param {string} args.rootClause
 * @param {'back'|'fwd'} args.held
 * @returns {string[]}
 */
function composeSentences({ links, rootClause, held }) {
  if (held === 'back') {
    const sentences = [rootClause];
    for (const link of links) {
      if (link.redacted || !link.connective || !link.argText) { sentences.push(link.clause); continue; }
      sentences.push(`${link.connective} ${link.argText}`);
    }
    return sentences;
  }
  /** @type {string[]} */
  const sentences = [];
  /** @type {string|null} */
  let printedId = null;
  for (const link of [...links].reverse()) {
    if (link.id !== printedId) { sentences.push(link.clause); printedId = link.id; }
    if (link.redacted || !link.connective || !link.argText) {
      if (link.childClause) { sentences.push(link.childClause); printedId = link.childId; }
      continue;
    }
    sentences.push(`${link.connective} ${link.argText}`);
    printedId = link.childId;
  }
  return sentences.length ? sentences : [rootClause];
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
