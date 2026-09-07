/**
 * domain/tableEvents.js — V-17 THE CAMPAIGN IMPORT: the table-event schema wall
 * + the deterministic bucketing clerk.
 *
 * THE FINITE-SEMANTICS LAW (owner doctrine, binding here): players have unlimited
 * freedom; the world's memory of that freedom is FINITE. Every effect that touches
 * the engine is a TYPED record drawn from a CLOSED vocabulary with a BOUNDED
 * magnitude. Free text is FLAVOR ONLY — stored verbatim on the record (the DM's own
 * words) and shown as display prose, NEVER parsed into a mechanical field. The
 * machine's role at an input surface is BUCKETING CLERK, never writer: it PROPOSES
 * {kind, band} from the closed vocabulary; the HUMAN confirms; only the confirmed
 * typed record writes. Table-authored records carry provenance source:'table' (the
 * soak excludes 'table'; receipts distinguish world-authored from table-authored).
 *
 * ── PARITY / FOLD SEAM ──────────────────────────────────────────────────────────
 * A sibling lane (V-F) built the canonical wall at src/domain/tableLedger.js (the
 * live session-ledger's typed events + the 'table-event' pendingEdits kind). This
 * leaf MIRRORS its shapes — the closed vocabulary (TABLE_EVENT_KINDS), the named
 * magnitude bands (MAGNITUDE_BANDS / BAND_MAGNITUDE), and the source:'table'
 * provenance — so the import flow builds against the SAME contract.
 *
 * FOLD DECISION (pass 3, vetoable): the mirror is KEPT, NOT replaced with imports.
 * This module is EAGER (campaignSlice imports tableEventToNewsEntry), while
 * tableLedger is otherwise lazy — importing it here dragged tableLedger's whole
 * module into the first-paint closure (+1,863 B, measured), unaffordable against the
 * tight fold budget. Instead, a value-identity parity test (tests/domain/
 * tableEvents.test.js, dev-only, zero eager) guards the mirror against drift — the
 * more important half of the seam. The WRITE PATHS stay separate by design
 * (manager decision): importTableEvents backfills wizardNews history; V-F's session
 * ledger is the live pendingEdits path. Recorded cycle-2 follow-on: a shared-
 * constants leaf both modules import would single-source without the eager pull.
 *
 * Pure + deterministic + store-agnostic: no wall-clock, no Math.random, no host
 * locale (domain-layer purity). The clock/tick is threaded by the caller.
 */

import { compareCodepoint } from './deterministicSort.js';

// ── The closed vocabulary (MIRROR of V-F's tableLedger.js — keep value-identical) ──

/**
 * The four typed kinds, each mapped to an existing engine effect family. A table
 * event may only ever be one of these — the schema wall rejects anything else.
 * @satisfies {readonly string[]}
 */
export const TABLE_EVENT_KINDS = Object.freeze([
  'incident',            // something befell the place (famine, fire, raid, plague) — a stressor
  'stressor-relief',     // a burden was lifted (the granary saved, the sick healed) — relief
  'obligation',          // a debt/oath/promise was incurred — a generosity-ledger obligation
  'exposure',            // a hidden truth surfaced (corruption revealed, a lie caught) — stigma
  'structure-harm',      // an institution was weakened (a granary burned, a hall ransacked)
  'structure-restored',  // a wounded institution was rebuilt or set right
  'supply-loss',         // a worked resource is gone (a caravan looted, a mine flooded)
  'supply-restored',     // a lost resource flows again
]);

/** The named magnitude bands (no raw numbers cross the wall — the DM picks a band). */
export const MAGNITUDE_BANDS = Object.freeze(['minor', 'moderate', 'major']);

/** Provenance stamp for every table-authored record. */
export const TABLE_EVENT_SOURCE = 'table';

const _kindSet = new Set(TABLE_EVENT_KINDS);
const _bandSet = new Set(MAGNITUDE_BANDS);

/**
 * Per-kind display metadata + the engine-effect family each kind routes to. `effect`
 * names the existing writer V-F's apply path targets (recorded for the fold — this
 * leaf does not itself apply mechanics; it produces typed history records).
 *
 * TOTAL over TABLE_EVENT_KINDS by contract: the review UI lets a human override a
 * proposed kind to ANY kind in the vocabulary, so a missing row here would ship a
 * headline reading "undefined at the table".
 *
 * BAND ASYMMETRY (deliberate, mirrored in tableLedger's header): the IMPORT lane
 * keeps a uniform band on every record because band drives news SIGNIFICANCE here,
 * not mechanics — no record built by this leaf reaches an engine payload. The live
 * session-ledger lane is the opposite: there the band IS a mechanical severity, so
 * it is offered per-kind and withheld from the three dial-free kinds.
 */
export const TABLE_EVENT_META = /** @type {Record<string, { label: string, effect: string, verb: string }>} */ (Object.freeze({
  incident:             Object.freeze({ label: 'Incident',           effect: 'stressor',    verb: 'befell' }),
  'stressor-relief':    Object.freeze({ label: 'Relief',             effect: 'stressor',    verb: 'eased' }),
  obligation:           Object.freeze({ label: 'Obligation',         effect: 'obligation',  verb: 'bound' }),
  exposure:             Object.freeze({ label: 'Exposure',           effect: 'stigma',      verb: 'exposed' }),
  'structure-harm':     Object.freeze({ label: 'Structure harmed',   effect: 'institution', verb: 'struck' }),
  'structure-restored': Object.freeze({ label: 'Structure mended',   effect: 'institution', verb: 'mended' }),
  'supply-loss':        Object.freeze({ label: 'Supply lost',        effect: 'resource',    verb: 'despoiled' }),
  'supply-restored':    Object.freeze({ label: 'Supply regained',    effect: 'resource',    verb: 'renewed' }),
}));

/**
 * Named band → BOUNDED numeric magnitude in [0,1]. This is the only place a band
 * becomes a number; the value is clamped into severity range so a table record can
 * never push the engine past its own bounds. Single table (not per-kind) — the bound
 * is a property of the band, and a simpler shape is the byte-minimal one.
 */
const BAND_MAGNITUDE = /** @type {Record<string, number>} */ (Object.freeze({ minor: 0.25, moderate: 0.5, major: 0.8 }));

/** @param {unknown} k */
export function isTableEventKind(k) {
  return typeof k === 'string' && _kindSet.has(k);
}

/** @param {unknown} b */
export function isMagnitudeBand(b) {
  return typeof b === 'string' && _bandSet.has(b);
}

/**
 * The bounded numeric magnitude for a (valid) band. Defaults to the 'moderate'
 * value for an unknown band — but validateTableEvent rejects unknown bands before
 * a record is ever built, so this default is belt-and-suspenders only.
 * @param {string} band
 */
export function bandMagnitude(band) {
  return BAND_MAGNITUDE[band] ?? BAND_MAGNITUDE.moderate;
}

/**
 * A table event's significance tier maps from its band (majors are 'major' news).
 * @param {string} band
 */
export function significanceForBand(band) {
  return band === 'major' ? 'major' : 'notable';
}

// ── The schema wall ─────────────────────────────────────────────────────────────

/**
 * @typedef {Object} TableEventTargets
 * @property {string[]} [settlementIds]  - ids from the campaign's own settlements
 * @property {string[]} [npcNames]       - free-text names are display-only; ids are the mechanical handle
 */

/**
 * @typedef {Object} TableEventRecord
 * @property {string} id
 * @property {string} kind        - one of TABLE_EVENT_KINDS
 * @property {string} band        - one of MAGNITUDE_BANDS
 * @property {number} magnitude   - bounded [0,1], derived from the band ONLY
 * @property {TableEventTargets} targets
 * @property {string} flavor      - the DM's verbatim words; FLAVOR ONLY, never mechanical
 * @property {number} tick        - the historical tick the DM placed it at
 * @property {'table'} source
 */

/**
 * The schema wall. A candidate typed event is admissible iff its kind and band are
 * in the closed vocabulary, its targets are typed arrays, its tick is a finite
 * non-negative integer, and its flavor is a string (any content — it is FLAVOR).
 * Returns { ok, errors } — never throws (the UI renders the errors per row).
 * @param {Partial<TableEventRecord>} evt
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateTableEvent(evt) {
  /** @type {string[]} */
  const errors = [];
  if (!evt || typeof evt !== 'object') return { ok: false, errors: ['No event.'] };
  if (!isTableEventKind(evt.kind)) errors.push('Pick a kind from the list.');
  if (!isMagnitudeBand(evt.band)) errors.push('Pick a magnitude band.');
  if (!(typeof evt.tick === 'number' && Number.isFinite(evt.tick) && evt.tick >= 0 && Number.isInteger(evt.tick))) {
    errors.push('Set a whole-number tick (0 or later).');
  }
  const t = evt.targets;
  if (t != null) {
    if (typeof t !== 'object') {
      errors.push('Targets must be a set of ids/names.');
    } else {
      if (t.settlementIds != null && !Array.isArray(t.settlementIds)) errors.push('Settlement targets must be a list.');
      if (t.npcNames != null && !Array.isArray(t.npcNames)) errors.push('NPC targets must be a list.');
    }
  }
  if (evt.flavor != null && typeof evt.flavor !== 'string') errors.push('Flavor must be text.');
  return { ok: errors.length === 0, errors };
}

// ── Deterministic short discriminator (FNV-1a) — stable id for the same input ──

/** @param {string} str */
function shortHash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36).padStart(7, '0').slice(0, 6);
}

/**
 * Assemble a typed table-event record. Pure; deterministic given its inputs. The
 * MECHANICAL fields (kind, band, magnitude, targets) come exclusively from the
 * confirmed vocabulary selection; `flavor` is copied VERBATIM and is never read to
 * derive any mechanical field — the no-free-text-reaches-mechanics guarantee lives
 * here and in the store action that consumes this record.
 * @param {{ kind: string, band: string, targets?: TableEventTargets, flavor?: string, tick: number, index?: number }} spec
 * @returns {TableEventRecord}
 */
export function buildTableEvent(spec) {
  const kind = spec.kind;
  const band = spec.band;
  const tick = Math.max(0, Math.floor(Number(spec.tick) || 0));
  const settlementIds = Array.isArray(spec.targets?.settlementIds) ? spec.targets.settlementIds.map(String) : [];
  const npcNames = Array.isArray(spec.targets?.npcNames) ? spec.targets.npcNames.map(String) : [];
  const flavor = typeof spec.flavor === 'string' ? spec.flavor : '';
  const disc = shortHash(`${kind}:${band}:${tick}:${settlementIds.join(',')}:${spec.index ?? 0}`);
  return Object.freeze({
    id: `table.${tick}.${kind}.${disc}`,
    kind,
    band,
    magnitude: bandMagnitude(band),
    targets: Object.freeze({ settlementIds, npcNames }),
    flavor,
    tick,
    source: TABLE_EVENT_SOURCE,
  });
}

// ── The bucketing clerk (deterministic, key-free, always available) ──────────────

/**
 * Keyword tables, iterated in INSERTION order (fixed) so scoring is
 * deterministic and a tie resolves to the earlier kind. These are lowercased
 * substrings matched against the segment text. They tune the PROPOSAL only — the
 * human confirms every row, so a wrong guess costs one click, never a bad write.
 *
 * DELIBERATELY PARTIAL over TABLE_EVENT_KINDS (documented, not a gap to re-find):
 * the four economy kinds (structure-harm / structure-restored / supply-loss /
 * supply-restored) carry NO keyword rows. Their strings would be eager first-paint
 * bytes on a budget with barely a kilobyte of headroom, and the cost of omitting
 * them is only that the deterministic clerk never PROPOSES them — the human can
 * still pick any kind in the review UI, and the live session-ledger picker (the
 * desk these verbs were built for) is unaffected. classifySegment therefore
 * iterates THIS table, not the vocabulary: adding a kind must never make the
 * clerk throw on a missing row.
 */
const KIND_KEYWORDS = /** @type {Record<string, string[]>} */ (Object.freeze({
  incident: ['famine', 'starv', 'fire', 'burn', 'plague', 'sick', 'disease', 'raid', 'attack',
    'siege', 'war', 'storm', 'flood', 'drought', 'quake', 'disaster', 'calamit', 'bandit',
    'monster', 'beast', 'razed', 'sack', 'ambush', 'invad', 'blight'],
  'stressor-relief': ['saved', 'rescue', 'relief', 'relieve', 'aid', 'harvest', 'recover',
    'heal', 'cured', 'cure', 'peace', 'restored', 'rebuil', 'granary', 'fed', 'shelter',
    'refuge', 'mercy', 'spared', 'delivered', 'bounty', 'flourish'],
  obligation: ['owe', 'owed', 'debt', 'promis', 'oath', 'pledge', 'sworn', 'swear', 'contract',
    'deal', 'bargain', 'tribute', 'favor', 'favour', 'vow', 'bound', 'indebt', 'obligat'],
  exposure: ['reveal', 'expose', 'caught', 'lie', 'lied', 'corrupt', 'betray', 'traitor',
    'secret', 'uncover', 'scandal', 'fraud', 'cheat', 'embezzl', 'conspir', 'blackmail'],
}));

/** Magnitude keyword hints. Absence ⇒ 'moderate' (the safe middle the DM can adjust). */
const MAJOR_HINTS = Object.freeze(['entire', 'whole', 'all ', 'everyone', 'catastroph', 'massacre',
  'destroyed', 'devastat', 'kingdom', 'realm', 'thousand', 'utterly', 'complete']);
const MINOR_HINTS = Object.freeze(['minor', 'small', 'slight', 'few', 'rumor', 'rumour', 'some ',
  'a little', 'briefly', 'nearly', 'almost']);

/**
 * Split raw pasted notes into candidate segments — one per non-empty line, further
 * split on sentence terminators so a paragraph of several events becomes several
 * rows. Deterministic; order-preserving; whitespace-collapsed.
 * @param {string} raw
 * @returns {string[]}
 */
export function segmentNotes(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return [];
  /** @type {string[]} */
  const out = [];
  for (const line of raw.split(/\r?\n/)) {
    // Split a line on sentence terminators, keeping bullet/dash prefixes out.
    for (const piece of line.split(/(?<=[.!?])\s+/)) {
      const cleaned = piece.replace(/^[\s>*\-•\d.)]+/, '').replace(/\s+/g, ' ').trim();
      if (cleaned) out.push(cleaned);
    }
  }
  return out;
}

/**
 * @typedef {Object} ProposedTableEvent
 * @property {number} index
 * @property {string} flavor      - the segment text, verbatim
 * @property {string} kind        - the clerk's proposed kind (confirm/override in review)
 * @property {string} band        - the clerk's proposed band
 * @property {boolean} confident  - true iff a vocabulary keyword actually matched
 * @property {TableEventTargets} targets  - always empty; the human assigns targets in review
 */

/**
 * Classify one segment into a proposed {kind, band}. Deterministic: scores each kind
 * by keyword-hit count (fixed kind order breaks ties), and reads magnitude hints.
 * When nothing matches, proposes incident/moderate with confident=false so the row
 * is flagged for the DM's attention. NEVER extracts targets from the text.
 * @param {string} text
 * @param {number} index
 * @returns {ProposedTableEvent}
 */
export function classifySegment(text, index) {
  const hay = String(text || '').toLowerCase();
  let bestKind = 'incident';
  let bestScore = 0;
  for (const [kind, words] of Object.entries(KIND_KEYWORDS)) {
    let score = 0;
    for (const kw of words) if (hay.includes(kw)) score += 1;
    if (score > bestScore) { bestScore = score; bestKind = kind; }
  }
  let band = 'moderate';
  if (MAJOR_HINTS.some(h => hay.includes(h))) band = 'major';
  else if (MINOR_HINTS.some(h => hay.includes(h))) band = 'minor';
  return {
    index,
    flavor: String(text || ''),
    kind: bestKind,
    band,
    confident: bestScore > 0,
    targets: { settlementIds: [], npcNames: [] },
  };
}

/**
 * The bucketing clerk: parse raw notes into a batch of PROPOSED typed events for the
 * DM to review. Pure + deterministic — the same notes always yield the same
 * proposals. Nothing here writes; the proposals are staged for per-event human
 * confirmation. The optional AI-polish seam (dressing the flavor prose) rides the
 * existing metered AI surfaces and is inert without keys — it never changes a
 * mechanical field.
 * @param {string} raw
 * @returns {ProposedTableEvent[]}
 */
export function proposeBuckets(raw) {
  return segmentNotes(raw).map((text, i) => classifySegment(text, i));
}

/**
 * Convert a confirmed typed record into the raw wizard-news entry the campaign feed
 * accepts (source:'table' history at the record's tick). The flavor is placed as the
 * SUMMARY (display prose); the headline is composed from the typed fields ONLY. The
 * `impactKind` carries the table kind so story-typing and the soak can recognise —
 * and exclude — table-authored history. Pure; deterministic given the record.
 * @param {TableEventRecord} rec
 * @returns {Object} a RawWizardNewsEntry (see domain/region/wizardNews.js)
 */
export function tableEventToNewsEntry(rec) {
  const meta = TABLE_EVENT_META[rec.kind] || { label: rec.kind };
  const settlementIds = Array.isArray(rec.targets?.settlementIds) ? rec.targets.settlementIds : [];
  return {
    id: rec.id,
    tick: rec.tick,
    scope: 'table',
    significance: significanceForBand(rec.band),
    severity: rec.magnitude,
    headline: `${meta.label} at the table (${rec.band})`,
    summary: rec.flavor || `${meta.label} recorded from the table.`,
    kind: 'applied',
    impactKind: `table_${rec.kind.replace(/-/g, '_')}`,
    settlementIds,
    tags: ['table', rec.kind, rec.band],
    source: TABLE_EVENT_SOURCE,
  };
}

/**
 * Stable-sort a batch of records newest-tick-first for review display. Pure.
 * @param {TableEventRecord[]} records
 */
export function sortRecordsForReview(records) {
  return (Array.isArray(records) ? records.slice() : []).sort((a, b) => {
    if (b.tick !== a.tick) return b.tick - a.tick;
    return compareCodepoint(a.id, b.id);
  });
}
