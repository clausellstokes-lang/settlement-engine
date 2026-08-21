/**
 * domain/display/chronicleReadModel.js — THE CHRONICLE zoom pyramid + delta-first
 * + deputy's diary (design docs/DESIGN_CHRONICLE_LEGIBILITY.md §1, §3, §4).
 *
 * A PURE view-time projection over the durable substrate (worldState.pulseHistory
 * — NOT the capped wizardNews feed). Consumes the shared graph primitive in
 * chronicleGraph.js so threads (§2) and the decree cone (§5, decreeTracker.js) are
 * one graph read. RNG-free, clock-free, non-persisting; a fresh world yields an
 * empty chronicle (byte-identical off-state).
 *
 * ── HONEST DEGRADATION (surveyed limits, reported not papered over) ───────────
 * The interval collapses each advance to ONE pulseHistory record, so the interior
 * per-week placement of an event is LOST (it survives only in the capped wizardNews
 * feed the §6 rule forbids reading). Consequences, all labelled honestly:
 *  · CHAPTERS (seasons) render as the temporal FRAME the span crossed (from the
 *    durable calendar), NOT per-event season buckets — events cannot be placed
 *    into an interior season from the collapsed record.
 *  · A THREAD'S arc within a single advance is a STRUCTURAL summary (began/turned/
 *    stands by severity), not an interior timeline — the collapse removed interior
 *    time. Across advances the scrollback restores real temporal order.
 *  · DELTAS are read from the outcomes' OWN carried deltas (populationDeltas /
 *    tierChange / relationship payloads) — the outcomes ARE the deltas — so no
 *    non-durable "before" snapshot is needed.
 *  · REVERSIBILITY of an auto-verdict is INFERRED (structural change ⇒ consumed;
 *    else amendable) and labelled `inferred` — the durable record carries no
 *    standing field (a reported seam).
 *
 * @enforced-by tests/domain/chronicleReadModel.test.js (determinism, span-scaling,
 *   empty off-state, season-frame pin, delta aggregation)
 */

import {
  advanceEntries, altitudesForSpan, connectedComponents, dominantClass, classRank,
  nodesFromRecord, buildRecordedEdges,
} from './chronicleGraph.js';

/** @typedef {import('./chronicleGraph.js').ChronicleNode} ChronicleNode */
/** @typedef {import('./chronicleGraph.js').AdvanceEntry} AdvanceEntry */
/** @typedef {import('./chronicleGraph.js').ChronicleWorldState} ChronicleWorldState */
/** @typedef {import('./chronicleGraph.js').PulseOutcome} PulseOutcome */
/** @typedef {'week'|'month'|'season'|'year'} SpanLabel */

/**
 * @typedef {Object} Delta  the delta-first summary (§3)
 * @property {{ rose: string[], fell: string[], net: number }} population
 * @property {Array<{ id: string, from: unknown, to: unknown }>} tiers
 * @property {Array<{ key: string, kind: string }>} relationships
 * @property {boolean} hasContent
 */

/**
 * @typedef {Object} Thread  one extracted, typed story (§2)
 * @property {string} id
 * @property {string|null} dramaClass
 * @property {string} title
 * @property {{ began: string, turned: string, stands: string }} arc
 * @property {Array<{ nodeId: string, headline: string, summary: string, kind: string, decree: boolean }>} beats
 * @property {string} state
 * @property {string[]} keys
 * @property {ReadonlyArray<PulseOutcome>} receipts
 * @property {string[]} settlementIds
 * @property {boolean} looseWeave  C2 (bar 2): true ⇒ the component is united ONLY by
 *   shared ground (settlement-scale keys) across ≥2 distinct drama classes — beats
 *   that shared a stage, not a demonstrated chain; the surface must not narrate an arc
 * @property {Array<{ id: string, dramaClass: string|null, sharedKeys: string[], inferred: boolean }>} [crossLinks]
 */

/**
 * @typedef {Object} Verdict  one deputy ruling (§4)
 * @property {string} threadId
 * @property {string|null} dramaClass
 * @property {string} headline
 * @property {string} summary
 * @property {ReadonlyArray<unknown>} reasons
 * @property {'consumed'|'still-amendable'} reversibility
 * @property {boolean} reversibilityInferred
 * @property {PulseOutcome} receipt
 */

/**
 * @typedef {Object} Chronicle  the zoom pyramid for one advance (§1)
 * @property {number} tick
 * @property {number} prevTick
 * @property {number} spanWeeks
 * @property {string} spanLabel
 * @property {ReadonlyArray<'headline'|'chapters'|'threads'|'events'>} altitudes
 * @property {string} headline
 * @property {Delta} delta
 * @property {Array<{ season: string, year: number, label: string }>} chapters
 * @property {Thread[]} threads
 * @property {{ verdicts: Verdict[], count: number }} deputyDiary
 * @property {Array<{ nodeId: string, kind: string, dramaClass: string|null, headline: string, summary: string, severity: number|null, decree: boolean, receipt: PulseOutcome }>} events
 * @property {number} threadCount
 * @property {number} eventCount
 */

// The season constitution — replicated from worldState.js (WEEKS_PER_YEAR=52,
// WEEKS_PER_SEASON=13, SEASONS order) so the display chunk never imports the
// worldPulse engine chunk. Pinned against seasonForTick in the test.
const WEEKS_PER_YEAR = 52;
const WEEKS_PER_SEASON = 13;
const SEASONS = Object.freeze(['spring', 'summer', 'autumn', 'winter']);

/** The {season, year} a canonical elapsed-week count falls in (matches seasonForTick).
 *  @param {number} weeks */
function seasonOf(weeks) {
  const w = Math.max(0, Math.floor(Number(weeks) || 0));
  const weekOfYear = w % WEEKS_PER_YEAR;
  return { season: SEASONS[Math.floor(weekOfYear / WEEKS_PER_SEASON)] || 'spring', year: Math.floor(w / WEEKS_PER_YEAR) + 1 };
}

const byStr = (/** @type {string} */ a, /** @type {string} */ b) => (a < b ? -1 : a > b ? 1 : 0);

/** FNV-1a 32-bit — the pure quiet-headline variant hash (no rng, no clock). A LOCAL
 *  copy of the 8-line helper (the newsVoice.js precedent — a display sidecar keeps
 *  its own copy rather than importing a sibling's tables). @param {string} str */
function fnv1a32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * THE QUIET-ADVANCE FALLBACK pool (content-vt-2). When an advance carries no
 * dominant thread the headline was a single fixed sentence ("The year passed
 * quietly.") that repeated VERBATIM down the 80-advance scrollback. Each span now
 * has a small pool of interchangeable quiet framings — the SPAN is the only fact,
 * and it rides every line (mirror-not-rederive). Selection is a pure FNV of the
 * advance tick, so a given advance always reads the same and adjacent quiet
 * advances generally differ. CANONICAL-AT-ZERO: index 0 is the original sentence.
 * This is the ONLY authored copy here that grows — the populated headline
 * ("The year: <title>") deliberately reuses the persisted crier-voiced thread
 * title (register-safe), so its variety is already owned by the event/crier slice.
 * @type {Readonly<Record<'week'|'month'|'season'|'year', ReadonlyArray<string>>>}
 */
export const QUIET_FALLBACK = Object.freeze({
  week: Object.freeze([
    'The week passed quietly.',
    'The week passed without event.',
    'A quiet week, with little to note.',
    'The week slipped by, calm and uneventful.',
  ]),
  month: Object.freeze([
    'The month passed quietly.',
    'The month passed without event.',
    'A quiet month, with little to note.',
    'The month slipped by, calm and uneventful.',
  ]),
  season: Object.freeze([
    'The season passed quietly.',
    'The season passed without event.',
    'A quiet season, with little to note.',
    'The season slipped by, calm and uneventful.',
  ]),
  year: Object.freeze([
    'The year passed quietly.',
    'The year passed without event.',
    'A quiet year, with little to note.',
    'The year slipped by, calm and uneventful.',
  ]),
});

/**
 * The distinct (season, year) chapters the span [prevWeek+1 .. week] crossed, in
 * chronological order. A within-season span yields ONE chapter. The temporal
 * FRAME of the advance — not per-event buckets (see the collapse note above).
 * @param {number} prevWeek
 * @param {number} week
 * @returns {Array<{ season: string, year: number, label: string }>}
 */
export function chapterSeasons(prevWeek, week) {
  const start = Math.max(0, Math.floor(Number(prevWeek) || 0));
  const end = Math.max(start, Math.floor(Number(week) || 0));
  /** @type {Array<{ season: string, year: number, label: string }>} */
  const out = [];
  const seen = new Set();
  // Sample the weeks LIVED THROUGH — elapsed-weeks [start .. end-1] — so a 52-week
  // advance from week 0 shows the four seasons of the year it lived, not a 1-week
  // sliver of the next year's spring at the boundary. Bounded (one advance is <= 52
  // named or <= 26 catch-up weeks).
  for (let w = start; w < end; w++) {
    const s = seasonOf(w);
    const key = `${s.year}:${s.season}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ season: s.season, year: s.year, label: `${s.season} · year ${s.year}` });
  }
  if (out.length === 0) { const s = seasonOf(end); out.push({ season: s.season, year: s.year, label: `${s.season} · year ${s.year}` }); }
  return out;
}

/**
 * DELTA-FIRST (§3): what is DIFFERENT after the advance, aggregated from the
 * outcomes' own carried deltas. population net per settlement + totals, tier
 * changes, and relationship changes (wars/peaces/alliances started/ended). Pure,
 * deterministic (sorted).
 * @param {ChronicleNode[]} nodes  nodesFromRecord output
 * @returns {Delta}
 */
export function deltaFirst(nodes) {
  /** @type {Map<string, number>} */
  const pop = new Map();
  /** @type {Array<{ id: string, from: unknown, to: unknown }>} */
  const tiers = [];
  /** @type {Array<{ key: string, kind: string }>} */
  const rels = [];
  for (const n of nodes) {
    const o = n.raw || {};
    const pd = o.populationDeltas;
    if (pd && typeof pd === 'object') {
      for (const [id, d] of Object.entries(pd)) {
        const v = Number(d) || 0;
        pop.set(String(id), (pop.get(String(id)) || 0) + v);
      }
    }
    if (o.tierChange && (o.tierChange.from != null || o.tierChange.to != null)) {
      tiers.push({ id: String(o.targetSaveId ?? o.tierChange.settlementId ?? n.nodeId), from: o.tierChange.from ?? null, to: o.tierChange.to ?? null });
    }
    const pay = o.proposalPayload;
    if (pay && pay.kind === 'relationship_label_change' && (pay.relationshipKey || o.relationshipKey)) {
      const to = String(pay.toType || '');
      const kind = to === 'hostile' ? 'war-declared'
        : /ally|alliance|vassal/i.test(to) ? 'alliance-formed'
        : to ? 'peace-or-shift'
        : 'relationship-change';
      rels.push({ key: String(pay.relationshipKey || o.relationshipKey), kind });
    } else if (o.relationshipPatch && o.relationshipKey) {
      rels.push({ key: String(o.relationshipKey), kind: 'relationship-change' });
    }
  }
  let net = 0;
  const rose = [];
  const fell = [];
  for (const [id, v] of pop) { net += v; if (v > 0) rose.push(id); else if (v < 0) fell.push(id); }
  rose.sort(byStr); fell.sort(byStr);
  tiers.sort((a, b) => byStr(a.id, b.id));
  rels.sort((a, b) => byStr(a.key, b.key) || byStr(a.kind, b.kind));
  const hasContent = rose.length > 0 || fell.length > 0 || tiers.length > 0 || rels.length > 0;
  return { population: { rose, fell, net }, tiers, relationships: rels, hasContent };
}

/**
 * C2 (bar 2, "threads conflate co-occurrence with causation"): the STRONG keys of a
 * node — the identifiers that name an actor or a standing bond (npc, faction,
 * relationship, stressor), never mere shared ground. A component whose members are
 * united ONLY by settlement co-location across differing drama classes is a weave of
 * proximity, and the surface must say so rather than narrate an arc.
 * @param {ChronicleNode} n
 * @returns {string[]}
 */
function strongKeysOf(n) {
  const o = n.raw || {};
  /** @type {string[]} */
  const out = [];
  const add = (/** @type {unknown} */ v) => { if (v != null && v !== '') out.push(String(v)); };
  add(o.npcId); add(o.factionId); add(o.stressor?.id);
  if (o.relationshipKey) { add(o.relationshipKey); for (const part of String(o.relationshipKey).split(/[:|>-]+/)) add(part); }
  return out;
}

/** Whether a component is a LOOSE WEAVE: ≥2 beats, ≥2 distinct non-null drama
 *  classes, and no strong key shared between any two members. @param {ChronicleNode[]} component */
function isLooseWeave(component) {
  if (component.length < 2) return false;
  const classes = new Set(component.map(n => n.dramaClass).filter(Boolean));
  if (classes.size < 2) return false;
  /** @type {Map<string, number>} */
  const owners = new Map();
  for (let i = 0; i < component.length; i++) {
    for (const k of strongKeysOf(component[i])) {
      const first = owners.get(k);
      if (first != null && first !== i) return false; // a strong key spans two beats ⇒ a real chain
      if (first == null) owners.set(k, i);
    }
  }
  return true;
}

/**
 * Build one THREAD (§2) from a connected component: title (register-safe persisted
 * headline of the most-severe beat), typed drama class, a structural arc
 * (began/turned/stands), key beats, and the receipts beneath. Deterministic.
 * @param {ChronicleNode[]} component
 * @returns {Thread}
 */
function buildThread(component) {
  const cls = dominantClass(component);
  // Beats most-severe first; ties by node id (deterministic).
  const beats = [...component].sort((a, b) => (Number(b.severity) || 0) - (Number(a.severity) || 0) || byStr(a.nodeId, b.nodeId));
  const climax = beats[0];
  const opener = component.reduce((/** @type {ChronicleNode|null} */ m, n) => (m == null || byStr(n.nodeId, m.nodeId) < 0 ? n : m), /** @type {ChronicleNode|null} */(null));
  const id = `thread_${cls || 'quiet'}_${opener ? opener.nodeId : 'x'}`;
  // The union of every entity key the thread touches — used for cross-links.
  const keys = new Set();
  for (const n of component) for (const k of n.keys) keys.add(k);
  return {
    id,
    dramaClass: cls,
    title: (climax && climax.headline) || 'A quiet thread',
    arc: {
      began: (opener && opener.headline) || '',
      turned: (climax && climax.headline) || '',
      stands: (beats[beats.length - 1] && beats[beats.length - 1].headline) || '',
    },
    beats: beats.map(n => ({ nodeId: n.nodeId, headline: n.headline, summary: n.summary, kind: n.kind, decree: n.decree })),
    state: component.some(n => n.decree) ? 'includes-your-decree' : 'ran-its-course',
    keys: [...keys].sort(byStr),
    receipts: beats.map(n => n.raw),
    settlementIds: [...keys].filter(k => !String(k).includes(':')).sort(byStr),
    looseWeave: isLooseWeave(component),
  };
}

/**
/**
 * Do any two nodes across threads a and b carry a DIRECT recorded edge? (Recorded
 * edges normally unify a chain into ONE thread, so a recorded cross-link is rare —
 * but the label is computed honestly rather than hardcoded.)
 * @param {Thread} a
 * @param {Thread} b
 * @param {import('./chronicleGraph.js').RecordedEdges|undefined} edges
 * @returns {boolean}
 */
function threadsShareRecordedEdge(a, b, edges) {
  if (!edges || !edges.size) return false;
  const bIds = new Set((b.beats || []).map((x) => x.nodeId));
  for (const beat of (a.beats || [])) {
    for (const p of (edges.parentsOf.get(beat.nodeId) || [])) if (bIds.has(p)) return true;
    for (const c of (edges.childrenOf.get(beat.nodeId) || [])) if (bIds.has(c)) return true;
  }
  return false;
}

/**
 * Cross-links (§2): for each thread, the other threads it shares an entity key
 * with (the war thread references the famine thread it touched). Deterministic;
 * a link is `inferred` (shared-entity) UNLESS the provenance ledger records a direct
 * causal edge between the two threads' receipts, in which case it is RECORDED. An
 * empty/absent ledger ⇒ every link inferred (byte-identical to the pre-ledger read).
 * @param {Thread[]} threads
 * @param {import('./chronicleGraph.js').RecordedEdges} [edges]
 * @returns {Map<string, Array<{ id: string, dramaClass: string|null, sharedKeys: string[], inferred: boolean }>>}
 */
function crossLinksFor(threads, edges) {
  /** @type {Map<string, Array<{ id: string, dramaClass: string|null, sharedKeys: string[], inferred: boolean }>>} */
  const links = new Map();
  for (let i = 0; i < threads.length; i++) {
    for (let j = i + 1; j < threads.length; j++) {
      const a = threads[i], b = threads[j];
      const setB = new Set(b.keys);
      const shared = a.keys.filter((/** @type {string} */ k) => setB.has(k)).sort(byStr);
      if (shared.length === 0) continue;
      const inferred = !threadsShareRecordedEdge(a, b, edges);
      if (!links.has(a.id)) links.set(a.id, []);
      if (!links.has(b.id)) links.set(b.id, []);
      (links.get(a.id) || []).push({ id: b.id, dramaClass: b.dramaClass, sharedKeys: shared, inferred });
      (links.get(b.id) || []).push({ id: a.id, dramaClass: a.dramaClass, sharedKeys: shared, inferred });
    }
  }
  return links;
}

/**
 * THE DEPUTY'S DIARY (§4): the majors the autoresolver ruled in the DM's absence,
 * grouped by thread, each with its typed reason(s), receipts, and an INFERRED
 * reversibility (structural change ⇒ consumed; else still-amendable). A verdict is
 * an auto-resolved outcome — one that carries an applyMode other than the DM's own
 * 'proposal'/'manual' and reads as a material ruling.
 * @param {Thread[]} threads
 * @returns {{ verdicts: Verdict[], count: number }}
 */
export function deputysDiary(threads) {
  /** @type {Verdict[]} */
  const verdicts = [];
  for (const t of threads) {
    for (const raw of t.receipts) {
      const mode = String(raw?.applyMode || '');
      const ruled = mode === 'auto' || (mode === '' && (Number(raw?.severity) || 0) >= 0.72);
      if (!ruled) continue;
      // Structural change (power transfer / tier change / population move) ⇒
      // consumed; a soft drift ⇒ still-amendable. INFERRED — the record carries
      // no durable standing (reported seam).
      const structural = !!(raw?.powerTransfer || raw?.tierChange || raw?.populationDeltas);
      verdicts.push({
        threadId: t.id,
        dramaClass: t.dramaClass,
        headline: raw?.headline || 'A ruling in your absence',
        summary: raw?.summary || '',
        reasons: Array.isArray(raw?.reasons) ? raw.reasons : [],
        reversibility: structural ? 'consumed' : 'still-amendable',
        reversibilityInferred: true,
        receipt: raw,
      });
    }
  }
  verdicts.sort((a, b) => byStr(a.threadId, b.threadId) || byStr(a.headline, b.headline));
  return { verdicts, count: verdicts.length };
}

/**
 * One fiction-register headline for the whole advance — a single line naming the
 * span and the dominant thread. Register-safe: the POPULATED headline reuses the
 * persisted (already crier-voiced) top-thread headline rather than authoring new
 * prose; the QUIET fallback draws a per-advance framing from the pool (content-vt-2,
 * seeded on the tick so it is deterministic per advance).
 * @param {string} spanLabel
 * @param {Thread[]} threads
 * @param {number} [tick]  the advance tick — the quiet-fallback frame seed
 * @returns {string}
 */
function headlineFor(spanLabel, threads, tick = 0) {
  const top = threads.find(t => t.dramaClass) || threads[0];
  const frame = spanLabel === 'week' ? 'The week' : spanLabel === 'month' ? 'The month' : spanLabel === 'season' ? 'The season' : 'The year';
  if (top) return `${frame}: ${top.title}`;
  const span = /** @type {'week'|'month'|'season'|'year'} */ (
    spanLabel === 'week' || spanLabel === 'month' || spanLabel === 'season' ? spanLabel : 'year');
  const pool = QUIET_FALLBACK[span];
  return pool[fnv1a32(`${tick}::${span}`) % pool.length];
}

/**
 * Whether a world has any chronicle content — the surface's populated gate. A
 * fresh campaign (no pulseHistory) yields false ⇒ empty state ⇒ byte-identical.
 * @param {ChronicleWorldState} worldState
 * @returns {boolean}
 */
export function hasChronicle(worldState) {
  return Array.isArray(worldState?.pulseHistory) && worldState.pulseHistory.length > 0;
}

/**
 * C2 (misc, "outcome+impact node pairs render as doubled rows"): the interval's
 * collapsed record can carry the SAME event twice — once in selectedOutcomes and
 * once in impactDigest, with identical persisted headline+summary — and the reader
 * then meets every such beat as two rows. Collapse the twins for the READER:
 * the outcome (it carries decree/severity/receipt standing) absorbs the impact
 * twin's entity keys, so graph linkage only tightens, never loosens. Records
 * without twins pass through structurally byte-identical. Deterministic.
 * @param {ChronicleNode[]} nodes  nodesFromRecord output (sorted by node id, so a
 *   twin may arrive in either kind-order — both orders collapse to the outcome)
 * @returns {ChronicleNode[]}
 */
function coalesceTwinNodes(nodes) {
  /** @type {Map<string, number>} */
  const byProse = new Map();
  /** @type {ChronicleNode[]} */
  const out = [];
  for (const n of nodes) {
    const key = `${n.headline}\u241F${n.summary}`;
    const at = byProse.get(key);
    const kept = at == null ? null : out[at];
    if (kept && kept.kind !== n.kind) {
      // A twin pair — keep the OUTCOME (whichever side it arrived on) and union
      // the absorbed twin's keys into it (sorted, deduped).
      const outcome = kept.kind === 'outcome' ? kept : n;
      const absorbed = kept.kind === 'outcome' ? n : kept;
      outcome.keys = [...new Set([...outcome.keys, ...absorbed.keys])].sort(byStr);
      out[/** @type {number} */(at)] = outcome;
      continue;
    }
    byProse.set(key, out.length);
    out.push(n);
  }
  return out;
}

/**
 * THE ZOOM PYRAMID (§1) for ONE advance entry. Threads are extracted (§2), the
 * delta-first summary (§3) and deputy's diary (§4) derived, chapters framed by
 * the seasons crossed, events surfaced as the receipts. `altitudes` is the
 * DEFAULT altitude set for the span; full descent is always available (the UI can
 * render every layer regardless).
 * @param {AdvanceEntry} entry
 * @param {Record<string, { parents?: ReadonlyArray<string> }>} [provenance]  the
 *   worldState.spatialLedgers.provenance ledger — threads/links read RECORDED edges
 *   where present, entity-key inference elsewhere. Absent ⇒ byte-identical.
 * @returns {Chronicle|null}
 */
export function chronicleForAdvance(entry, provenance) {
  if (!entry || !entry.record) return null;
  const edges = buildRecordedEdges(provenance);
  const rawNodes = nodesFromRecord(entry.record);
  const nodes = coalesceTwinNodes(rawNodes);
  const components = connectedComponents(nodes, edges);
  const threads = components
    .map(buildThread)
    // Deterministic thread order: by drama-class priority, then id.
    .sort((a, b) => classRank(a.dramaClass) - classRank(b.dramaClass) || byStr(a.id, b.id));
  const links = crossLinksFor(threads, edges);
  for (const t of threads) t.crossLinks = links.get(t.id) || [];
  // Deltas aggregate over the RAW nodes — coalescing is a READER-facing collapse
  // (twin rows), never a change to what the advance did.
  const delta = deltaFirst(rawNodes);
  const diary = deputysDiary(threads);
  const chapters = chapterSeasons(entry.prevTick, entry.tick);
  return {
    tick: entry.tick,
    prevTick: entry.prevTick,
    spanWeeks: entry.spanWeeks,
    spanLabel: entry.spanLabel,
    altitudes: altitudesForSpan(/** @type {SpanLabel} */ (entry.spanLabel)),
    headline: headlineFor(entry.spanLabel, threads, entry.tick),
    delta,
    chapters,
    threads,
    deputyDiary: diary,
    events: nodes.map(n => ({ nodeId: n.nodeId, kind: n.kind, dramaClass: n.dramaClass, headline: n.headline, summary: n.summary, severity: n.severity, decree: n.decree, receipt: n.raw })),
    threadCount: threads.length,
    eventCount: nodes.length,
  };
}

/**
 * The chronicle for the LATEST advance (the "after every advance" surface), or
 * null when the world has no history yet.
 * @param {ChronicleWorldState} worldState
 * @returns {Chronicle|null}
 */
export function latestChronicle(worldState) {
  const entries = advanceEntries(worldState);
  return entries.length ? chronicleForAdvance(entries[0], provenanceOf(worldState)) : null;
}

/**
 * The provenance ledger off a worldState (the recorded cause-edges), or undefined.
 * A plain read of the Phase-5.5 conditional ledger family — no engine import.
 * @param {ChronicleWorldState} worldState
 * @returns {Record<string, { parents?: ReadonlyArray<string> }>|undefined}
 */
function provenanceOf(worldState) {
  const ledgers = /** @type {{ spatialLedgers?: Record<string, unknown> }} */ (worldState)?.spatialLedgers;
  const prov = ledgers && typeof ledgers === 'object' ? ledgers.provenance : undefined;
  return prov && typeof prov === 'object' && !Array.isArray(prov)
    ? /** @type {Record<string, { parents?: ReadonlyArray<string> }>} */ (prov)
    : undefined;
}

/**
 * Every advance's chronicle, newest-first (the scrubbable scrollback). Bounded by
 * pulseHistory's own cap (MAX_HISTORY=80 advances — a §6 finding).
 * @param {ChronicleWorldState} worldState
 * @returns {Array<Chronicle|null>}
 */
export function chronicleHistory(worldState) {
  const provenance = provenanceOf(worldState);
  return advanceEntries(worldState).map(e => chronicleForAdvance(e, provenance));
}
