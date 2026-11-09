/**
 * domain/display/newsBody.js — THE WIZARD-NEWS CARD-BODY SIDECAR (content-immersion-5).
 *
 * A pure DISPLAY read-model, cut from the same cloth as newsVoice.js. Current
 * wizardNews emissions are authored in world voice, while older persisted
 * summaries and scoring reasons may still carry the engine-log register that
 * preceded that authoring law.
 *
 * This module RE-COMPOSES the card body from the entry's persisted STRUCTURED
 * fields — the lifecycle transition (entry.kind), scope, and severity — into one
 * short in-world sentence, and recasts any legacy terse reasons into the fiction
 * register. The headline already names the subject, so the body speaks the beat
 * ("It is being felt across the region now.") without restating it. Prose reasons
 * (world-pulse sentences) pass through unchanged.
 *
 * VIEW-TIME VARIETY (CONTENT-VT-2): a busy simulated year surfaces many cards of
 * one lifecycle transition, and a single fixed sentence per transition visibly
 * cycles in the feed. Each transition is now a small POOL of interchangeable
 * in-world lines, and the body is selected by a PURE FNV-1a hash of the entry's
 * stable id — same entry ⇒ same line, always; two cards of the same transition
 * with distinct ids generally read differently. CANONICAL-AT-ZERO: the original
 * sentence is index 0 of every pool, and an entry WITHOUT an id (every legacy /
 * id-less caller, including persisted records that predate ids) selects index 0 —
 * so those renders are byte-IDENTICAL to before. Only id-bearing feed entries draw
 * variety, and this is the exact mechanism newsVoice.js uses.
 *
 * BYTE-INERT to the engine: imported ONLY by the lazy WizardNewsPanel, never by
 * generation or the world-pulse kernel; never mutates an entry; no rng, no Date.
 * The selection writes NOTHING and no wizardNews entry, save, or golden holds a
 * body line (it is recomposed every render), so pool growth moves no persisted or
 * first-paint byte — only which (equally valid) line a given card shows.
 */

import { humanizeToken } from './humanizeEngineTokens.js';

/** FNV-1a 32-bit — the pure variant-selection hash (no rng, no Date). A LOCAL copy
 *  of the 8-line helper (the newsVoice.js precedent — a display sidecar keeps its
 *  own copy rather than dragging a sibling's content tables into this chunk).
 *  @param {string} str */
function fnv1a32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * View-time variant pick: index 0 (the canonical line) when the entry has no id
 * (byte-identical to the pre-CONTENT-VT-2 single line); otherwise a deterministic
 * FNV pick keyed on the entry id + a per-cell salt so a card's queued/applied/…
 * lines are chosen independently.
 * @param {ReadonlyArray<string>} pool
 * @param {string} seed  the entry id (empty ⇒ canonical)
 * @param {string} cell  a per-transition salt
 * @returns {string}
 */
function pickBody(pool, seed, cell) {
  if (!seed) return pool[0];
  return pool[fnv1a32(`${seed}::${cell}`) % pool.length];
}

/**
 * Split prose into its sentences (a terminal mark followed by a space or the end).
 * @param {string} text
 * @returns {string[]}
 */
function splitSentences(text) {
  const t = String(text || '').trim();
  if (!t) return [];
  return (t.match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g) || [t]).map(x => x.trim()).filter(Boolean);
}

/**
 * The lead of `text` the card body prints: its first two sentences, joined; '' for
 * empty prose.
 * @param {string} text
 */
function leadSentences(text) {
  return splitSentences(text).slice(0, 2).join(' ');
}

/**
 * THE DATELINE (STYLE-RULINGS-2 C1): a card body names WHERE. When the filed sentence
 * names none of the entry's own places (an older writer that speaks of "the settlement"),
 * the body leads with the place the entry is about, as a dispatch does: "Kleinwalde:
 * …". The place is the last of a travelling effect's path (its destination) and the
 * first of any other entry's. Without a name map, or when the sentence already names a
 * place, the sentence prints as filed.
 * @param {string} told
 * @param {{ settlementIds?: unknown[]|null, impactIds?: unknown[]|null }} entry
 * @param {Map<string, string> | null | undefined} nameById
 * @returns {string}
 */
function withDateline(told, entry, nameById) {
  if (!nameById || typeof nameById.get !== 'function') return told;
  const names = (Array.isArray(entry.settlementIds) ? entry.settlementIds : [])
    .map(id => nameById.get(String(id)))
    .filter(n => typeof n === 'string' && n.trim().length > 1);
  if (!names.length || names.some(n => told.includes(n))) return told;
  const travelling = Array.isArray(entry.impactIds) && entry.impactIds.length > 0;
  return `${travelling ? names[names.length - 1] : names[0]}: ${told}`;
}

/** @param {unknown} v @returns {number} */
function clamp01(v) {
  const n = typeof v === 'number' && Number.isFinite(v) ? v : 0;
  return Math.max(0, Math.min(1, n));
}

/** @type {Readonly<Record<string, string>>} */
const SCOPE_PHRASE = Object.freeze({
  settlement: 'in the town',
  regional: 'across the region',
  realm: 'across the realm',
});

/** @param {string | null | undefined} scope */
function scopePhrase(scope) {
  return SCOPE_PHRASE[String(scope || '')] || 'across the region';
}

/**
 * THE BODY POOLS — index 0 of every array is the ORIGINAL single line (the
 * canonical-at-zero guarantee); the rest are interchangeable in-world phrasings
 * of the SAME lifecycle beat. Each line is self-contained, carries no engine
 * lifecycle word (queued/ready/applied/resolved/expired) nor the "via <channel>"
 * seam nor an underscore, and ends in terminal punctuation. The `applied` and
 * `default` pools carry a `${scope}` token filled at render (the subject stays in
 * the headline). Pinned exhaustively in newsBody.test.js.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const BODY_POOLS = Object.freeze({
  queued: Object.freeze([
    'Word of it is only now reaching the roads.',
    'The first whispers of it are only now on the roads.',
    'Rumor of it has only just begun to travel.',
    'Word of it is barely abroad, and only on the nearest roads.',
  ]),
  ready: Object.freeze([
    'It hangs on the brink and may break at any hour.',
    'It stands poised on the edge and may break at any hour.',
    'It hangs by a thread and could break at any moment.',
    "It sits on a knife's edge, apt to break before long.",
  ]),
  appliedHeavy: Object.freeze([
    'It is being felt hard {scope} now.',
    'It is striking hard {scope} as we speak.',
    'The weight of it falls hard {scope} now.',
    'It bites hard {scope}, and none can miss it.',
  ]),
  appliedLight: Object.freeze([
    'It is being felt {scope} now.',
    'Its effects are being felt {scope} now.',
    'It makes itself felt {scope} now.',
    'The effects of it show {scope} now.',
  ]),
  resolved: Object.freeze([
    'It has, for the present, run its course.',
    'It has, for now, spent itself.',
    'For the present, it has settled and gone quiet.',
    'It has run its course, at least for the season.',
  ]),
  ignored: Object.freeze([
    'In the end it came to nothing.',
    'In the end, nothing came of it.',
    'It amounted to nothing in the end.',
    'Nothing came of it, when all was said.',
  ]),
  expired: Object.freeze([
    'It passed before it could take hold.',
    'It faded before it could take hold.',
    'It came to nothing before it could take root.',
    'It slipped away before it ever took hold.',
  ]),
  default: Object.freeze([
    'Word of it moves {scope}.',
    'Word of it travels {scope}.',
    'Talk of it passes {scope}.',
    'Word of it is carried {scope}.',
  ]),
});

/**
 * The in-world card body for a wizardNews entry — the lifecycle beat spoken in
 * the house voice. The subject rides in the headline; this sentence carries the
 * transition (and, for an impact, its reach and weight). Total: any
 * unknown/missing transition falls back to a neutral in-world line. VIEW-TIME
 * variety: id-bearing entries draw a per-id line from the pool; id-less entries
 * get the canonical index-0 line (byte-identical to before).
 * Governed SP-6 entries already carry an authored reader sentence plus its
 * structural family. Show that sentence directly; the generic lifecycle body is
 * for legacy/unregistered entries. This also keeps the repetition instrument and
 * the words a reader actually sees on the same projection.
 * @param {{ id?: string|number|null, kind?: string|null, scope?: string|null,
 *   severity?: number|null,summary?:string|null,familyId?:string|null,
 *   settlementIds?: unknown[]|null, impactIds?: unknown[]|null }|null|undefined} entry
 * @param {{ nameById?: Map<string, string> | null }} [options]  the panel's save-name map;
 *   with it, a body that names none of the entry's places is datelined with the one it is about
 * @returns {string}
 */
export function newsBodyText(entry, options = {}) {
  if (!entry) return '';
  // THE CARD BODY STATES THE EVENT (STYLE-RULINGS-2 C1, SW-11 PULSE-CARD): every
  // composer files a reader sentence — the event, the people, the consequence —
  // and that sentence IS the body, read through the one reader of the summary
  // (`newsReaderSummary`, which also closes the legacy climb-down wording). At
  // most two sentences print; the rest stays in the tooltip (`newsCardTooltip`).
  // The lifecycle pools below are the fallback for a legacy entry that filed no
  // summary at all.
  const told = leadSentences(readerSummary(entry, options.nameById));
  if (told) return withDateline(told, entry, options.nameById);
  const kind = entry.kind || '';
  const scope = scopePhrase(entry.scope);
  const heavy = clamp01(entry.severity) >= 0.75;
  const seed = String(entry.id ?? '');
  switch (kind) {
    case 'queued':
      return pickBody(BODY_POOLS.queued, seed, 'queued');
    case 'ready':
      return pickBody(BODY_POOLS.ready, seed, 'ready');
    case 'applied': {
      const pool = heavy ? BODY_POOLS.appliedHeavy : BODY_POOLS.appliedLight;
      return pickBody(pool, seed, heavy ? 'applied:heavy' : 'applied:light').replace('{scope}', scope);
    }
    case 'resolved':
      return pickBody(BODY_POOLS.resolved, seed, 'resolved');
    case 'ignored':
      return pickBody(BODY_POOLS.ignored, seed, 'ignored');
    case 'expired':
      return pickBody(BODY_POOLS.expired, seed, 'expired');
    default:
      return pickBody(BODY_POOLS.default, seed, 'default').replace('{scope}', scope);
  }
}

/**
 * The terse scoring-receipt reasons recast into the fiction register (the
 * treatment simulationProfile.js uses for receipt headlines). Keyed
 * case-insensitively; a reason already written as prose (world-pulse sentences)
 * passes through unchanged; duplicates collapse; order is preserved.
 * @type {Readonly<Record<string, string>>}
 */
const REASON_PHRASES = Object.freeze({
  'high severity': 'a heavy blow',
  'meaningful severity': 'a real blow',
  'critical impact type': 'a matter that cuts deep',
  'critical regional channel': 'carried by a tie the town depends on',
  'chain propagation': 'spreading from town to town',
  'multi-settlement scope': 'reaching across the country',
  'critical goods involved': 'touching goods the country cannot do without',
  'important goods involved': 'touching goods that matter',
  'effect took hold': 'the effect has taken hold',
  'delayed effect matured': 'close at hand',
  'major pressure resolved': 'a great weight lifted',
  'threat window closed': 'it never arrived',
  'routine regional update': 'a quiet matter',
  border_raid: 'a raid across the border',
  food_pressure: 'food stores under strain',
  population_pressure: 'people leaving under pressure',
});

// momentum.js is intentionally protected as the machine-evidence producer.
// Its climb-down record retains exact commitment and price scalars, while the
// display sidecar gives that one legacy kind a closed, authored projection.
const MOMENTUM_CLIMB_DOWN_REASONS = Object.freeze([
  'the court held to the war beyond an easy retreat',
  'the reversal exacted a real political price',
]);

/**
 * Durable reader-summary projection, with closed wording for legacy producers
 * whose stored sentence contains analytic notation. Shared by every surface
 * that can expose a wizard-news summary.
 * @param {{ kind?: string|null, summary?: string|null }|null|undefined} entry
 */
export function newsReaderSummary(entry) {
  if (!entry) return '';
  if (entry.kind === 'momentum_climb_down') {
    return 'The court held to the war too long, and backing out of it now has cost its rulers dearly.';
  }
  return String(entry.summary || '');
}

/**
 * Fiction-register reason phrases for a wizardNews entry's scoring reasons.
 * @param {{ kind?: string|null, reasons?: Array<string|null|undefined> }|null|undefined} entry
 * @returns {string[]}
 */
export function newsReasonPhrases(entry) {
  if (entry?.kind === 'momentum_climb_down') return [...MOMENTUM_CLIMB_DOWN_REASONS];
  const reasons = Array.isArray(entry?.reasons) ? entry.reasons : [];
  /** @type {string[]} */
  const out = [];
  const seen = new Set();
  for (const raw of reasons) {
    const key = String(raw || '').trim();
    if (!key) continue;
    const normalizedKey = humanizeToken(key);
    // A bare engine token with no reader phrase prints NO pill (A1·13): a
    // de-underscored slug ("Border raid") is the engine's word, not the world's.
    const phrase = REASON_PHRASES[key.toLowerCase()]
      || REASON_PHRASES[normalizedKey]
      || (/^[a-z][a-z0-9_-]*$/.test(key) ? '' : key);
    if (!phrase || seen.has(phrase)) continue;
    seen.add(phrase);
    out.push(phrase);
  }
  return out;
}

/** @param {string} v */
function foldText(v) {
  return String(v || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * The card's hover title (STYLE-RULINGS-2 C1): ONE reader for one fact. When the
 * body prints the whole reader summary the title is empty — the same sentence is
 * never on the card twice (rule g); when the body printed only its lead sentences,
 * the title keeps the full summary with the rest of the detail.
 * @param {{ kind?: string|null, summary?: string|null }|null|undefined} entry
 * @returns {string}
 */
export function newsCardTooltip(entry) {
  if (!entry) return '';
  const told = newsReaderSummary(entry).trim();
  if (!told) return '';
  return leadSentences(told) === splitSentences(told).join(' ') ? '' : told;
}

/**
 * The scoring reasons that restate what the card already says once its body is the
 * event: how far it spread and where in its lifecycle it stands (the body names the
 * source and the road; the status pill carries the lifecycle). Keyed by the legacy
 * receipt token so the reader wording can change without this set drifting.
 */
const FACE_RESTATED_REASON_KEYS = Object.freeze([
  'chain propagation', 'multi-settlement scope',
  'effect took hold', 'delayed effect matured', 'major pressure resolved', 'threat window closed',
]);

/**
 * The reason pills the card face prints: the reader phrases, less any that repeat
 * the body (a rule-note reason filed as the summary prints once, as the body) and,
 * when the body is the filed event, less the reach and lifecycle receipts it
 * already states. At most three, as the panel has always shown.
 * @param {NewsCardEntry|null|undefined} entry
 * @param {{ nameById?: Map<string, string> | null }} [options]
 * @returns {string[]}
 */
export function newsCardReasons(entry, options = {}) {
  const phrases = newsReasonPhrases(entry);
  const body = foldText(newsBodyText(entry, options));
  const filed = Boolean(newsReaderSummary(entry).trim());
  const restated = new Set(FACE_RESTATED_REASON_KEYS.map(k => REASON_PHRASES[k]));
  return phrases
    .filter((p) => {
      const f = foldText(p);
      if (!f) return false;
      if (body && (body.includes(f) || f.includes(body))) return false;
      return !(filed && restated.has(p));
    })
    .slice(0, 3);
}

/**
 * The fields of a wizard-news entry the card face reads.
 * @typedef {{ id?: string|number|null, kind?: string|null, scope?: string|null, severity?: number|null,
 *   summary?: string|null, familyId?: string|null, headline?: string|null,
 *   reasons?: Array<string|null|undefined>|null, settlementIds?: unknown[]|null, impactIds?: unknown[]|null }} NewsCardEntry
 */

/** The lifecycle in a plain word, for the card's status pill. */
const STATUS_WORDS = Object.freeze({
  queued: 'coming',
  ready: 'coming',
  applied: 'in effect',
  resolved: 'past',
  ignored: 'past',
  expired: 'past',
});

/**
 * The status pill's word (STYLE-RULINGS-2 C1): never the pipeline's state token.
 * A regional effect still travelling between towns prints where it stands in a
 * plain word ("coming · in effect · past"); every other entry prints nothing, because
 * its body already says what happened in its own tense.
 * @param {{ kind?: string|null, impactIds?: unknown[]|null }|null|undefined} entry
 * @returns {string}
 */
export function newsStatusWord(entry) {
  if (!entry) return '';
  const travelling = Array.isArray(entry.impactIds) && entry.impactIds.length > 0;
  if (!travelling) return '';
  return STATUS_WORDS[/** @type {keyof typeof STATUS_WORDS} */ (String(entry.kind || ''))] || '';
}

/**
 * Everything the news card prints about one entry, from the one set of readers:
 * the body, its title, the status word and the reason pills.
 * @param {NewsCardEntry|null|undefined} entry
 * @param {{ nameById?: Map<string, string> | null }} [options]  the panel's save-name map
 * @returns {{ headline: string, body: string, tooltip: string, status: string, reasons: string[] }}
 */
export function newsCardFace(entry, options = {}) {
  return {
    headline: readerHeadline(entry, options.nameById ?? null),
    body: newsBodyText(entry, options),
    tooltip: newsCardTooltip(entry),
    status: newsStatusWord(entry),
    reasons: newsCardReasons(entry, options),
  };
}

/**
 * THE SUCCESSION QUESTION AT ITS PRINT SITES (STYLE-RULINGS-2 C1; the audit's C2·26, added to SW-11 by
 * the chair). The outcome treatySuccessionDecision.js :: outcomeFor files is persisted and deep-validated
 * with its two strings pinned to the question's ids ("Succession oath decision for {settlementId}", "Apply
 * to disavow the oath to {otherId}; …"), and the question carries no names. So the stored strings keep
 * their ids and every page that prints them reads them through these two readers, which put the towns'
 * names in. A string is recast only when its id is one of the item's own settlements; anything else
 * passes through unchanged.
 */
/**
 * An outcome, a docket proposal or a news entry, as a page prints it.
 * @typedef {{ headline?: string|null, summary?: string|null, kind?: string|null, targetSaveId?: unknown,
 *   affectedSettlementIds?: unknown[]|null, settlementIds?: unknown[]|null,
 *   outcome?: { affectedSettlementIds?: unknown[]|null } | null }} PrintItem
 */
const SUCCESSION_HEADLINE = /^Succession oath decision for (\S+)$/;
const SUCCESSION_SUMMARY = /^Apply to disavow the oath to (\S+); dismissing or leaving it unanswered honors the oath\.$/;

/**
 * @param {PrintItem} item
 * @returns {string[]}
 */
function itemSettlementIds(item) {
  const ids = item.affectedSettlementIds || item.settlementIds || item.outcome?.affectedSettlementIds || [];
  return [...(Array.isArray(ids) ? ids : []), item.targetSaveId].filter(x => x != null && x !== '').map(String);
}

/**
 * @param {Map<string, string>|null|undefined} nameById @param {string} id @param {string} standIn
 * @returns {string}
 */
function placeName(nameById, id, standIn) {
  const name = nameById && typeof nameById.get === 'function' ? nameById.get(id) : '';
  return typeof name === 'string' && name.trim() ? name : standIn;
}

/**
 * The headline a page prints for an outcome, proposal or news entry: the stored headline, with the
 * succession question's id put into words.
 * @param {PrintItem|null|undefined} item
 * @param {Map<string, string>|null} [nameById]
 * @returns {string}
 */
export function readerHeadline(item, nameById = null) {
  const headline = String(item?.headline || '');
  const m = SUCCESSION_HEADLINE.exec(headline);
  if (!m) return headline;
  const ids = itemSettlementIds(item || {});
  if (!ids.includes(m[1])) return headline;
  const otherId = ids.find(id => id !== m[1]);
  const town = placeName(nameById, m[1], 'A town');
  return otherId
    ? `${town}'s new ruler must decide whether to keep the oath to ${placeName(nameById, otherId, 'its partner')}`
    : `${town}'s new ruler must decide whether to keep the old oath`;
}

/**
 * The summary a page prints for an outcome, proposal or news entry: the reader summary, with the
 * succession question's id put into words.
 * @param {PrintItem|null|undefined} item
 * @param {Map<string, string>|null} [nameById]
 * @returns {string}
 */
export function readerSummary(item, nameById = null) {
  const summary = newsReaderSummary(item);
  const m = SUCCESSION_SUMMARY.exec(summary);
  if (!m) return summary;
  const ids = itemSettlementIds(item || {});
  if (!ids.includes(m[1])) return summary;
  const townId = ids.find(id => id !== m[1]);
  const town = townId ? placeName(nameById, townId, 'the town') : 'the town';
  return `Apply to break ${town}'s oath to ${placeName(nameById, m[1], 'its partner')}; dismiss it, or leave it unanswered, and the oath holds.`;
}
