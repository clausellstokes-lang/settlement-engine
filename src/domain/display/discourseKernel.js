/**
 * domain/display/discourseKernel.js — TRANCHE 3c: THE DISCOURSE KERNEL.
 *
 * Classical discourse realization over the recorded cause DAG. It turns a resolved
 * cause-walk (a typed chain of recorded receipts, now multi-hop via E-J-v2's
 * causedBy edges) into ONE connected passage instead of N disconnected lines.
 * This is the owner-authorized answer to "a rudimentary LLM inside the system":
 * a deterministic, finite-lexicon prose-connection kernel, NOT a neural writer.
 * On a truth surface the AI is never the writer (THE FINITE-SEMANTICS LAW), so
 * the ONLY authored text is the connective tissue drawn from a finite lexicon;
 * every recorded headline is carried BYTE-VERBATIM and never rewritten, retensed,
 * or re-cased (a headline may open with a proper noun, so case-folding would
 * corrupt it). The anti-embellishment guarantee is made executable by the clause
 * shape: clause.text is exactly connective + ' ' + recorded, so a totality walker
 * and a claims-parity pin can prove the passage adds no content the ledger lacks.
 *
 * Four classical moves:
 *   1. CONNECTIVE SELECTION — a finite RELATION -> CONNECTIVE lexicon. The relation
 *      is typed from the hop's recorded `type` (dramaClass || kind, causeWalk.js)
 *      plus tick/depth deltas: a LITERAL enumeration (RELATION_FOR_TYPE), never
 *      invented (the impactKind walker law).
 *   2. ENTITY TRACKING — first mention names via the injected canonical resolver
 *      (nameOf, the faction-key law upstream); repeat mentions inform the
 *      continuity register. Entity pronominalization is never applied INSIDE a
 *      verbatim headline (that would rewrite the truth surface).
 *   3. AGGREGATION — adjacent identical recorded shapes coalesce (the C2 dedup
 *      idiom); one clause per sentence keeps the per-sentence clause count capped.
 *   4. TENSE / PACING — tick-distance banding (deep / near / pivot connective
 *      register) with tickCalendarLabel for the spoken opening time.
 *
 * PURITY (the determinism bans): a PURE LEAF. No store access, no Date, no random,
 * no localeCompare. Ordering is (tick asc, depth desc, id codepoint asc). Variant
 * choice is the conjunction ladder's PURE-HASH idiom (fnv1a32 of seedId + key), no
 * rng stream. Imported ONLY by the lazy CauseWalkPanel (which rides RealmInspector's
 * already-lazy chunk), so it adds ZERO first-paint bytes — it must NEVER be imported
 * by generation or the world-pulse kernel.
 *
 * PRIOR ART (read, extended, never forked): the conjunction content ladder
 * (causeConjunctionContent.js + causeLifecycleVocabulary.js) is NPC-lifecycle
 * single-line selection, not cross-hop discourse, so this kernel is genuinely new;
 * it adopts that ladder's pure-hash + tiered + lazy-only laws verbatim (fnv1a32 is
 * the same 8-line helper, kept local as newsVoice.js keeps it) and duplicates zero
 * content. tickCalendarLabel is reused from humanizeEngineTokens.js.
 *
 * DORMANCY: consumed by CauseWalkPanel only when the virtual `discourseProseEnabled`
 * flag is lit (absent from every preset, read defensively — the provenanceLedgerEnabled
 * idiom). Flag OFF ⇒ the panel renders the exact current path, byte-identical.
 *
 * @enforced-by tests/domain/discourseKernel.test.js (realizer + clause-provenance +
 *   determinism), tests/lint/discourseLexiconCoverage.test.js (lexicon totality),
 *   tests/simulation/discourseParity.test.js (the lit narrative-parity variant),
 *   tests/components/causeWalkPanel.test.jsx (dormancy byte-identity), and the
 *   voiceMechanics src/domain string-literal scan (the connective lexicon lives here).
 */

import { tickCalendarLabel } from './humanizeEngineTokens.js';

/**
 * FNV-1a 32-bit — the pure variant-selection hash (no rng, no Date). A LOCAL copy
 * of the conjunction ladder's 8-line helper (that module is deliberately NOT
 * imported: it drags large content tables in; newsVoice.js keeps its own copy for
 * the same reason). Same (seedId, key) ⇒ same variant, always.
 * @param {string} str
 * @returns {number}
 */
function fnv1a32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * THE KNOWN RELATION-TYPE VOCABULARY — every `type` a cause-walk node can carry.
 * A node's `type` is `dramaClass || kind` (causeWalk.js buildReceiptIndex): the 8
 * recorded drama classes (chronicleGraph.DRAMA_CLASSES), the two node KINDS that
 * surface when a node has no drama class ('outcome' / 'impact'), plus the two
 * structural fallbacks resolveReceipt can mint ('hidden' for a redacted covert
 * hop, 'event' for a ledger-only parent not in pulseHistory). LITERAL: enumerate
 * from the real vocabulary, never invent. The lexicon-totality walker pins this
 * set equal to the live vocabulary, and RELATION_FOR_TYPE total over it.
 * @type {ReadonlyArray<string>}
 */
export const KNOWN_RELATION_TYPES = Object.freeze([
  // the 8 drama classes (chronicleGraph.DRAMA_CLASSES)
  'war', 'succession_coup', 'plague', 'calamity', 'schism_contest', 'economic_shock', 'boom_flourishing', 'reframe',
  // the node kinds (chronicleGraph.ChronicleNode.kind) when dramaClass is null
  'outcome', 'impact',
  // resolveReceipt's structural fallbacks (causeWalk.js)
  'hidden', 'event',
]);

/**
 * RELATION FAMILY per known type. Most causes relate to their effect CAUSALLY;
 * the abundance/reinterpretation classes read ADVERSATIVELY (an outcome running
 * against the grain of the causes above it — boom after hardship, a reframed
 * meaning). Total over KNOWN_RELATION_TYPES (pinned by the totality walker); an
 * unknown type falls to the causal default at runtime.
 * @type {Readonly<Record<string, 'causal'|'adversative'>>}
 */
export const RELATION_FOR_TYPE = Object.freeze({
  war: 'causal',
  succession_coup: 'causal',
  plague: 'causal',
  calamity: 'causal',
  schism_contest: 'causal',
  economic_shock: 'causal',
  boom_flourishing: 'adversative',
  reframe: 'adversative',
  outcome: 'causal',
  impact: 'causal',
  hidden: 'causal',
  event: 'causal',
});

/**
 * THE CONNECTIVE LEXICON (DRAFT — pending the Fable-tier authoring pass).
 *
 * Every phrase is a colon-bridge: a short connective that ends in a colon so the
 * VERBATIM (and possibly capitalized, possibly proper-noun-initial) recorded
 * headline follows as its own grammatical unit without any case change. House
 * register: the calm campaign archivist (docs/VOICE_AND_TONE.md) — no em dash, no
 * exclamation, concrete and plain. The causal family is tick/depth banded (deep =
 * a far-back cause, near = a mid-chain cause, pivot = the effect the reader
 * clicked). parallel and adversative are single pools. Each cell holds >= 2
 * distinct variants; DEFAULT_CONNECTIVE guarantees totality for any future band.
 * @type {Readonly<Record<string, Readonly<Record<string, ReadonlyArray<string>>> | ReadonlyArray<string>>>}
 */
export const CONNECTIVE_LEXICON = Object.freeze({
  causal: Object.freeze({
    deep: Object.freeze([
      'From there:',
      'In its wake:',
    ]),
    near: Object.freeze([
      'And so:',
      'From that:',
      'In turn:',
    ]),
    pivot: Object.freeze([
      'So it came to this:',
      'And at the last:',
      'And in the end:',
    ]),
  }),
  parallel: Object.freeze([
    'In the same season:',
    'At the same time:',
    'Meanwhile:',
  ]),
  adversative: Object.freeze([
    'And yet:',
    'Even so:',
  ]),
  // The ANTICIPATORY register (owner amendment: PREDICTION ELISION rule 2). A
  // response taken because of a forecast whose own clause is elided carries this
  // "done because of what was foretold" register. Licensed ONLY on a clause whose
  // recorded parent is a typed prediction (the anticipatory-license pin).
  anticipatory: Object.freeze([
    'Forewarned:',
    'Against what was coming:',
    'In its shadow:',
  ]),
});

/** The explicit default connective (the totality floor: a relation/band with no
 *  authored pool falls here rather than rendering empty). */
export const DEFAULT_CONNECTIVE = 'And then:';

/** The causal tense/pacing bands, in register order (deep past to the pivot). */
const CAUSAL_BANDS = Object.freeze(['deep', 'near', 'pivot']);

/**
 * The full set of authored connective strings (every lexicon cell + the default),
 * for the clause-provenance pin: a clause's connective must belong to this finite
 * set (or be a temporal opener, or empty). Computed once, frozen.
 * @type {ReadonlySet<string>}
 */
export const ALL_CONNECTIVES = Object.freeze(new Set([
  ...CAUSAL_BANDS.flatMap((b) => /** @type {ReadonlyArray<string>} */ (
    /** @type {Record<string, ReadonlyArray<string>>} */ (CONNECTIVE_LEXICON.causal)[b])),
  .../** @type {ReadonlyArray<string>} */ (CONNECTIVE_LEXICON.parallel),
  .../** @type {ReadonlyArray<string>} */ (CONNECTIVE_LEXICON.adversative),
  .../** @type {ReadonlyArray<string>} */ (CONNECTIVE_LEXICON.anticipatory),
  DEFAULT_CONNECTIVE,
]));

/**
 * The candidate (prediction) receipt id embedded in a realization receipt key, or
 * null. A realized candidate event is recorded under a key of the shape
 * `wizard_news.<tick>.<domain>.applied.<candidateId>` (the TYPED transition segment,
 * candidateEvents.js -> pulseKernel apply), so the prediction<->realization pairing
 * reads from the structural id, NEVER from a headline string-match (the owner's
 * hard precondition for prediction elision). Total on garbage.
 * @param {unknown} receiptId
 * @returns {string|null}
 */
export function realizationCandidateId(receiptId) {
  const m = /\.applied\.(candidate\..+)$/.exec(String(receiptId ?? ''));
  return m ? m[1] : null;
}

/** Adversative node types (an outcome against the grain of its causes). */
const ADVERSATIVE_TYPES = new Set(
  Object.keys(RELATION_FOR_TYPE).filter((t) => RELATION_FOR_TYPE[t] === 'adversative'),
);

/** Codepoint-stable compare (never locale-sensitive). */
const byStr = (/** @type {string} */ a, /** @type {string} */ b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * A node awaiting realization: the root (depth 0) or a chain hop.
 * @typedef {Object} WalkNode
 * @property {string} id
 * @property {number} depth
 * @property {string} headline
 * @property {number|null} tick
 * @property {string} type
 * @property {boolean} redacted
 * @property {string[]} settlementIds
 */

/**
 * One realized clause. `recorded` is the byte-verbatim recorded headline (or an
 * exported honest fallback constant); `connective` is the authored bridge (in
 * ALL_CONNECTIVES, or a temporal opener, or ''); `text` is exactly their join.
 * @typedef {Object} DiscourseClause
 * @property {string} text
 * @property {string} receiptKey    the recorded receipt id this clause realizes
 * @property {string} connective    the authored connective ('' for the opener when timeless)
 * @property {string} recorded      the byte-verbatim recorded headline
 * @property {'causal'|'parallel'|'adversative'|'anticipatory'|'open'} relation
 * @property {boolean} redacted
 * @property {string|null} anticipatedBy  the elided prediction id licensing an anticipatory clause
 */

/**
 * @typedef {Object} DiscoursePassage
 * @property {string} text                    the one connected passage ('' when empty)
 * @property {DiscourseClause[]} clauses      one per realized receipt, in reading order
 */

/** Chronological reading order: tick ascending, then DEEPER cause first (depth
 *  descending — the deepest cause is earliest, the root/effect is the pivot last),
 *  then id codepoint. Never insertion order, never localeCompare.
 *  @param {WalkNode} a @param {WalkNode} b */
function byChrono(a, b) {
  const ta = a.tick == null ? Number.POSITIVE_INFINITY : a.tick;
  const tb = b.tick == null ? Number.POSITIVE_INFINITY : b.tick;
  if (ta !== tb) return ta - tb;
  if (a.depth !== b.depth) return b.depth - a.depth;
  return byStr(a.id, b.id);
}

/** The tense/pacing band for a non-opening node: the pivot (root, depth 0), a
 *  far-back cause (deep), or a mid-chain cause (near).
 *  @param {WalkNode} node */
function bandOf(node) {
  if (node.depth === 0) return 'pivot';
  return node.depth >= 3 ? 'deep' : 'near';
}

/** The relation of `node` to the `prev` node already placed before it.
 *  @param {WalkNode|null} prev @param {WalkNode} node */
function relationOf(prev, node) {
  if (!prev) return 'open';
  if (ADVERSATIVE_TYPES.has(node.type)) return 'adversative';
  if (node.tick != null && prev.tick != null && node.tick === prev.tick && node.depth === prev.depth) return 'parallel';
  return 'causal';
}

/** Deterministic variant pick from a pool by pure hash of (seedId, key).
 *  @param {ReadonlyArray<string>} pool @param {string|number} seedId @param {string} key */
function pick(pool, seedId, key) {
  if (!pool || pool.length === 0) return DEFAULT_CONNECTIVE;
  return pool[fnv1a32(`${String(seedId ?? '')}::${key}`) % pool.length];
}

/** The connective for a node given its relation to the prior node.
 *  @param {'causal'|'parallel'|'adversative'} relation @param {WalkNode} node
 *  @param {string|number} seedId */
function connectiveFor(relation, node, seedId) {
  if (relation === 'causal') {
    const band = bandOf(node);
    const pool = /** @type {Record<string, ReadonlyArray<string>>} */ (CONNECTIVE_LEXICON.causal)[band];
    return pick(pool, seedId, `causal:${band}:${node.id}`);
  }
  if (relation === 'parallel') return pick(/** @type {ReadonlyArray<string>} */ (CONNECTIVE_LEXICON.parallel), seedId, `parallel:${node.id}`);
  if (relation === 'adversative') return pick(/** @type {ReadonlyArray<string>} */ (CONNECTIVE_LEXICON.adversative), seedId, `adversative:${node.id}`);
  return DEFAULT_CONNECTIVE;
}

/** The scene-setting opener for the first (deepest) clause: a spoken calendar time
 *  when the node carries a tick, else no connective. Never re-cases the headline.
 *  @param {WalkNode} node */
function openingConnective(node) {
  if (node.tick == null) return '';
  return `In ${tickCalendarLabel(node.tick)}:`;
}

/** Ensure a passage sentence ends in terminal punctuation (a period; the register
 *  bans the exclamation, and a question mark is preserved if a headline carries one).
 *  @param {string} s */
function ensureTerminal(s) {
  return /[.?]$/.test(s) ? s : `${s}.`;
}

/**
 * Whether the discourse-prose realizer is active for a world — the virtual
 * `discourseProseEnabled` flag, read defensively (mirrors provenanceLedgerActive).
 * Absent from every preset, so an ordinary campaign returns false and the panel
 * renders its exact current path.
 * @param {unknown} worldState
 * @returns {boolean}
 */
export function discourseProseActive(worldState) {
  const rules = worldState && typeof worldState === 'object'
    ? /** @type {Record<string, unknown>} */ (worldState).simulationRules : null;
  return !!(rules && typeof rules === 'object'
    && /** @type {Record<string, unknown>} */ (rules).discourseProseEnabled === true);
}

/**
 * Realize a resolved cause-walk into ONE connected passage. Pure and deterministic.
 * Every clause carries its receiptKey and its byte-verbatim recorded headline; the
 * only authored text is the finite connective. Redaction lines (REDACTED_HOP) and
 * the grace lines are never paraphrased — grace lines are the panel's own verbatim
 * render and are NOT clauses here (they carry no receipt).
 * PREDICTION ELISION (owner amendment): a forecast and its fulfillment read
 * redundant ("X may take hold ... X takes hold"). When a realization node names its
 * candidate (via realizationCandidateId) and that candidate is a recorded parent in
 * this walk, the candidate's clause is ELIDED (the realization carries the fact);
 * any OTHER in-walk child of the candidate is a response taken because of the
 * forecast and takes the anticipatory register. A candidate whose realization is NOT
 * in this walk is KEPT verbatim (an unfulfilled forecast is real information). This
 * needs the recorded parent edges, so `provenance` is read defensively; without it,
 * no elision fires (byte-neutral). Omission is selection, never invention.
 * @param {import('./causeWalk.js').CauseWalk} walk
 * @param {{ seedId?: string|number, nameOf?: (id: string) => string, provenance?: Record<string, { parents?: ReadonlyArray<string> }>|null }} [opts]
 * @returns {DiscoursePassage}
 */
export function realizeCauseWalk(walk, opts = {}) {
  const seedId = opts.seedId ?? (walk && walk.rootId) ?? '';
  const provenance = opts.provenance && typeof opts.provenance === 'object' ? opts.provenance : null;
  // nameOf is accepted (the canonical resolver, injected) for entity tracking; the
  // kernel never injects a name INTO a verbatim headline (the truth surface), so in
  // Phase 1 it informs continuity only. Kept in the signature for the recorded
  // Phase-2 follow-ons and to keep the kernel store-free.
  /** @type {WalkNode[]} */
  const nodes = [];
  if (walk && walk.root) {
    nodes.push({
      id: String(walk.rootId), depth: 0, headline: walk.root.headline,
      tick: walk.root.tick, type: walk.root.type || 'event', redacted: false,
      settlementIds: walk.root.settlementIds || [],
    });
  }
  for (const hop of (walk && walk.chain) || []) {
    nodes.push({
      id: String(hop.id), depth: hop.depth, headline: hop.headline, tick: hop.tick,
      type: hop.type || 'event', redacted: !!hop.redacted, settlementIds: hop.settlementIds || [],
    });
  }
  nodes.sort(byChrono);

  // ── PREDICTION ELISION (typed, DAG-deterministic) ──────────────────────────
  const walkIds = new Set(nodes.map((n) => n.id));
  /** recorded parents of `id` that are also in this walk, sorted (determinism). */
  const parentsInWalk = (/** @type {string} */ id) => {
    const entry = provenance ? provenance[id] : null;
    const ps = entry && Array.isArray(entry.parents) ? entry.parents.map(String) : [];
    return ps.filter((p) => walkIds.has(p)).sort(byStr);
  };
  /** @type {Set<string>} elided prediction ids (their realization is in the walk). */
  const elided = new Set();
  for (const node of nodes) {
    const candId = realizationCandidateId(node.id);
    if (candId && walkIds.has(candId) && parentsInWalk(node.id).includes(candId)) elided.add(candId);
  }
  /** @type {Map<string, string>} response node id -> its elided prediction (the license). */
  const anticipatedBy = new Map();
  for (const node of nodes) {
    if (elided.has(node.id)) continue;                       // the prediction itself is gone
    if (realizationCandidateId(node.id)) continue;           // the realization is not a "response"
    for (const p of parentsInWalk(node.id)) {
      if (elided.has(p) && !anticipatedBy.has(node.id)) anticipatedBy.set(node.id, p);
    }
  }

  /** @type {DiscourseClause[]} */
  const clauses = [];
  /** @type {WalkNode|null} */
  let prev = null;
  for (const node of nodes) {
    if (elided.has(node.id)) continue;                       // rule 1/2: drop the forecast clause
    // AGGREGATION (C2 dedup): coalesce an adjacent identical recorded shape.
    if (prev && node.headline === prev.headline) { prev = node; continue; }
    const opening = prev === null;
    const anticip = anticipatedBy.get(node.id) || null;
    /** @type {DiscourseClause['relation']} */
    let relation;
    let connective;
    if (anticip) {
      relation = 'anticipatory';
      const reg = pick(/** @type {ReadonlyArray<string>} */ (CONNECTIVE_LEXICON.anticipatory), seedId, `anticipatory:${node.id}`);
      // opener + register: keep the calendar time first, comma-joined, register second.
      connective = (opening && node.tick != null) ? `In ${tickCalendarLabel(node.tick)}, ${reg}` : reg;
    } else {
      relation = opening ? 'open' : relationOf(prev, node);
      connective = relation === 'open' ? openingConnective(node) : connectiveFor(relation, node, seedId);
    }
    const recorded = node.headline;
    const text = connective ? `${connective} ${recorded}` : recorded;
    clauses.push({ text, receiptKey: node.id, connective, recorded, relation, redacted: node.redacted, anticipatedBy: anticip });
    prev = node;
  }

  const text = clauses.map((c) => ensureTerminal(c.text)).join(' ');
  return { text, clauses };
}
