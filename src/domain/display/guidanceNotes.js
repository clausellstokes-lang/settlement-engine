/**
 * domain/display/guidanceNotes.js — THE SURVEYOR'S-NOTES VOICE SIDECAR (W-GUIDE-2 §4).
 *
 * The in-world register of the guidance layer: scripted marginalia the realm's
 * keeper reads at rest-points (an empty library, a fresh map, a first dossier).
 * Cut from the F3a sidecar cloth (domain/display/newsVoice.js — the crier's
 * voice): a frozen NOTE_LINES[topic][moment] content map, a per-topic totality
 * FLOOR, PURE FNV-1a variant selection over a stable id, and a deterministic
 * precedence categorization. Same signal ⇒ same note, always.
 *
 * THE ONE DELIBERATE DIVERGENCE FROM newsVoice.js: newsVoice stores its prose
 * INLINE; this module stores COPY KEYS (dotted paths into en.guidance.notes.*)
 * and the prose lives in src/copy/en.js, resolved by the consumer via t() (the
 * copy harness, W-GUIDE-2 law). So a cell is a frozen array of KEYS, not lines;
 * tests/domain/guidanceNotes.test.js binds both directions (every key resolves
 * to prose; every note-prose leaf is referenced by a key) so they cannot drift.
 *
 * FIRST-PAINT LAW (the registryProse idiom, mirrored from guidanceRegistry.js):
 * this module is a ZERO-IMPORT LAZY LEAF. It imports NOTHING (no copy, no store,
 * no theme) so it can never drag anything into the eager first-paint closure,
 * and it is imported ONLY from lazy guidance surfaces (SurveyorNote.jsx and its
 * consumers) and tests. It must NEVER be imported by generation or the
 * world-pulse kernel (SAME-SEED / GOLDEN laws).
 *
 * SENTINEL NON-VACUITY: like GUIDANCE_REGISTRY, the dist sentinel rides a LIVE
 * property of the retained GUIDANCE_NOTES object a lazy consumer reads at
 * runtime (noteKeyFor reads GUIDANCE_NOTES.lines), so it survives tree-shaking
 * into the lazy chunk — the build guard asserts BOTH absence from the entry
 * closure AND presence in some chunk.
 *
 * @enforced-by tests/domain/guidanceNotes.test.js (the register-guard walker +
 *   determinism/reachability/frozen/totality pins)
 * @enforced-by tests/build/vendorPdfLazy.test.js (lazy-leaf closure sentinel)
 */

export const GUIDANCE_NOTES_LAZY_SENTINEL = 'GUIDANCE_NOTES_LAZY_SENTINEL';

/** FNV-1a 32-bit — the pure variant-selection hash (no rng, no Date). A LOCAL
 *  copy of the 8-line helper (the sidecar modules are deliberately NOT imported
 *  from one another: each carries its own so no content table crosses chunks).
 *  @param {string} str */
function fnv1a32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** @typedef {'library'|'realm'|'dossier'|'simulation'} NoteTopic */
/** @typedef {'empty'|'first'|'onward'} NoteMoment */

/** The scored teaching subjects the Surveyor comments on (§4). */
export const NOTE_TOPICS = Object.freeze(['library', 'realm', 'dossier', 'simulation']);

/** The lifecycle beats of a topic: nothing-yet ⇒ just-did-it ⇒ return/deepen. */
export const NOTE_MOMENTS = Object.freeze(['empty', 'first', 'onward']);

/** Build a dotted copy key for a note cell variant. */
const K = (topic, moment, variant) => `guidance.notes.${topic}.${moment}.${variant}`;
/** Build a dotted copy key for a floor variant. */
const F = (topic, variant) => `guidance.notes.floor.${topic}.${variant}`;

/**
 * THE CONTENT MAP — NOTE_LINES[topic][moment] is a frozen array of >=2 distinct
 * copy KEYS (resolved to serif, second-person, UI-verb-free prose by the
 * consumer). Every (topic × moment) cell is authored; NOTE_FLOOR guarantees
 * totality for any future moment.
 * @type {Readonly<Record<NoteTopic, Readonly<Record<NoteMoment, ReadonlyArray<string>>>>>}
 */
export const NOTE_LINES = Object.freeze({
  library: Object.freeze({
    empty:  Object.freeze([K('library', 'empty', 'a'), K('library', 'empty', 'b')]),
    first:  Object.freeze([K('library', 'first', 'a'), K('library', 'first', 'b')]),
    onward: Object.freeze([K('library', 'onward', 'a'), K('library', 'onward', 'b')]),
  }),
  realm: Object.freeze({
    empty:  Object.freeze([K('realm', 'empty', 'a'), K('realm', 'empty', 'b')]),
    first:  Object.freeze([K('realm', 'first', 'a'), K('realm', 'first', 'b')]),
    onward: Object.freeze([K('realm', 'onward', 'a'), K('realm', 'onward', 'b')]),
  }),
  dossier: Object.freeze({
    empty:  Object.freeze([K('dossier', 'empty', 'a'), K('dossier', 'empty', 'b')]),
    first:  Object.freeze([K('dossier', 'first', 'a'), K('dossier', 'first', 'b')]),
    onward: Object.freeze([K('dossier', 'onward', 'a'), K('dossier', 'onward', 'b')]),
  }),
  simulation: Object.freeze({
    empty:  Object.freeze([K('simulation', 'empty', 'a'), K('simulation', 'empty', 'b')]),
    first:  Object.freeze([K('simulation', 'first', 'a'), K('simulation', 'first', 'b')]),
    onward: Object.freeze([K('simulation', 'onward', 'a'), K('simulation', 'onward', 'b')]),
  }),
});

/**
 * PER-TOPIC FLOOR — copy keys used only if a (topic × moment) cell is ever
 * missing OR empty (guarantees totality for a future moment). >=2 per topic.
 * @type {Readonly<Record<NoteTopic, ReadonlyArray<string>>>}
 */
export const NOTE_FLOOR = Object.freeze({
  library:    Object.freeze([F('library', 'a'), F('library', 'b')]),
  realm:      Object.freeze([F('realm', 'a'), F('realm', 'b')]),
  dossier:    Object.freeze([F('dossier', 'a'), F('dossier', 'b')]),
  simulation: Object.freeze([F('simulation', 'a'), F('simulation', 'b')]),
});

// ── Precedence categorization (the F3a categorizer) ──────────────────────────
// A guidance SURFACE names its topic directly; this maps the surface id (or a
// firsts signal) to a topic with a fixed precedence, exactly as newsVoiceCategory
// maps an impactKind. Deterministic and total: an out-of-scope surface ⇒ null,
// and the consumer renders no note.

/** @type {ReadonlyMap<string, NoteTopic>} */
const SURFACE_TO_TOPIC = new Map([
  ['library', 'library'],
  ['home', 'library'],
  ['realm', 'realm'],
  ['map', 'realm'],
  ['world-map', 'realm'],
  ['dossier', 'dossier'],
  ['wizard-postgen', 'dossier'],
  ['simulation', 'simulation'],
  ['living-world', 'simulation'],
]);

/**
 * Map a guidance surface id to its note topic, or null when out of scope.
 * @param {string|null|undefined} surface
 * @returns {NoteTopic|null}
 */
export function noteTopicForSurface(surface) {
  if (!surface) return null;
  return SURFACE_TO_TOPIC.get(surface) ?? null;
}

/**
 * Map a raw lifecycle signal to the note moment. Total: an unknown/missing
 * signal falls back to 'onward' (the safest read-more beat — never treats a
 * returning keeper as newborn).
 * @param {{ hasAny?: boolean, isFirst?: boolean }|null|undefined} signal
 * @returns {NoteMoment}
 */
export function noteMomentFor(signal) {
  if (!signal || signal.hasAny === false) return 'empty';
  if (signal.isFirst) return 'first';
  return 'onward';
}

/**
 * THE READ-MODEL — resolve a (topic, moment, stableId) to a single copy KEY, or
 * null when the topic is out of scope. Deterministic: same inputs ⇒ same key.
 * Distinct ids in the same cell generally reach distinct variants (the FNV
 * anti-repetition seed). The consumer resolves the returned key via t().
 * @param {NoteTopic|string|null|undefined} topic
 * @param {NoteMoment|string|null|undefined} moment
 * @param {string|number|null|undefined} stableId
 * @returns {string|null}
 */
export function noteKeyFor(topic, moment, stableId) {
  if (!topic || !NOTE_TOPICS.includes(/** @type {NoteTopic} */ (topic))) return null;
  const m = NOTE_MOMENTS.includes(/** @type {NoteMoment} */ (moment)) ? moment : 'onward';
  // Read through the retained GUIDANCE_NOTES object so its sentinel survives DCE
  // into the lazy chunk (the non-vacuity fix, mirrored from guidanceRegistry).
  const cell = GUIDANCE_NOTES.lines[topic][m];
  // Fall through to the topic floor on a missing OR empty cell — an empty array
  // is truthy and would yield variants[NaN] === undefined.
  const variants = (cell && cell.length) ? cell : GUIDANCE_NOTES.floor[topic];
  const seed = String(stableId ?? '');
  const h = fnv1a32(`${seed}::${topic}:${m}`);
  return variants[h % variants.length];
}

/**
 * Convenience: resolve straight from a surface + signal (the mount-site path).
 * @param {string} surface
 * @param {{ hasAny?: boolean, isFirst?: boolean }} signal
 * @param {string|number} stableId
 * @returns {string|null}
 */
export function noteKeyForSurface(surface, signal, stableId) {
  const topic = noteTopicForSurface(surface);
  if (topic === null) return null;
  return noteKeyFor(topic, noteMomentFor(signal), stableId);
}

/**
 * The retained notes object. The sentinel rides HERE (a live property of a
 * runtime-read frozen object) so it survives tree-shaking into the lazy chunk.
 * noteKeyFor reads `.lines`/`.floor`, retaining the whole object (and `.sentinel`).
 */
export const GUIDANCE_NOTES = Object.freeze({
  sentinel: GUIDANCE_NOTES_LAZY_SENTINEL,
  lines: NOTE_LINES,
  floor: NOTE_FLOOR,
});

/** Every note copy key across NOTE_LINES + NOTE_FLOOR (the walker census helper). */
export function allNoteKeys() {
  const keys = [];
  for (const topic of NOTE_TOPICS) {
    for (const moment of NOTE_MOMENTS) keys.push(...NOTE_LINES[topic][moment]);
    keys.push(...NOTE_FLOOR[topic]);
  }
  return keys;
}
