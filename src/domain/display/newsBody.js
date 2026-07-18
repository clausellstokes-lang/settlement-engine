/**
 * domain/display/newsBody.js — THE WIZARD-NEWS CARD-BODY SIDECAR (content-immersion-5).
 *
 * A pure DISPLAY read-model, cut from the same cloth as newsVoice.js. The stored
 * wizardNews `summary` is composed engine-side as a system-log line:
 *   "Applied via trade dependency around Grain after guild collapse: …"
 * and the scoring `reasons` are analytic receipt pills ("critical regional
 * channel", "chain propagation"). Rendered beneath a diegetic headline and an
 * in-world crier quote, the card carries three registers at war.
 *
 * This module RE-COMPOSES the card body from the entry's persisted STRUCTURED
 * fields — the lifecycle transition (entry.kind), scope, and severity — into one
 * short in-world sentence, and recasts the terse scoring reasons into the fiction
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
    'The mark of it is on things {scope} now.',
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
 * @param {{ id?: string|number|null, kind?: string|null, scope?: string|null, severity?: number|null }|null|undefined} entry
 * @returns {string}
 */
export function newsBodyText(entry) {
  if (!entry) return '';
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
  'critical regional channel': 'carried along a vital road',
  'chain propagation': 'spreading from town to town',
  'multi-settlement scope': 'reaching across the country',
  'critical goods involved': 'touching goods the country cannot do without',
  'important goods involved': 'touching goods that matter',
  'effect took hold': 'the effect has taken hold',
  'delayed effect matured': 'the long wait is over',
  'major pressure resolved': 'a great pressure lifted',
  'threat window closed': 'the danger has passed',
  'routine regional update': 'a quiet matter',
});

/**
 * Fiction-register reason phrases for a wizardNews entry's scoring reasons.
 * @param {{ reasons?: Array<string|null|undefined> }|null|undefined} entry
 * @returns {string[]}
 */
export function newsReasonPhrases(entry) {
  const reasons = Array.isArray(entry?.reasons) ? entry.reasons : [];
  /** @type {string[]} */
  const out = [];
  const seen = new Set();
  for (const raw of reasons) {
    const key = String(raw || '').trim();
    if (!key) continue;
    const phrase = REASON_PHRASES[key.toLowerCase()] || key;
    if (seen.has(phrase)) continue;
    seen.add(phrase);
    out.push(phrase);
  }
  return out;
}
