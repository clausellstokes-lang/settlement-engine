/**
 * domain/display/chroniclersLetter.js — THE CHRONICLER'S LETTER (VISION WAVE V-2).
 * "Session prep in five minutes." The retention surface.
 *
 * A DETERMINISTIC composition (NO AI required): from a per-campaign lastReadTick,
 * diff the wizardNews feed since that tick, GROUP the beats (wars / courts / trade /
 * traditions / mercy / sundry), PRIORITIZE by the existing significance tiers, and
 * render in the HOUSE VOICE as a chronicler's letter. Optional AI dressing rides the
 * existing metered surfaces (not here). Pure: FNV of stable ids (no RNG, no clock) ⇒
 * same feed + same lastReadTick ⇒ byte-identical letter every render (the newsVoice
 * pickLine idiom). Reads only display inputs; imports no engine, no store, no React.
 *
 * R-16 THE 'WORLD DEEPENED' LETTER (rider): when a flag-set delta is detected vs the
 * campaign's recorded `flagsSeen`, the letter carries a `deepened` section announcing
 * the newly-lit layers in the chronicler's voice. DARK until the regen: flagsSeen
 * absent (null) ⇒ no baseline to diff ⇒ deepened === null (byte-identical).
 *
 * R-17 SHAREABLE LETTER (rider): letterToPlainText renders the same model to a
 * portable, house-voiced text the panel exports via the existing downloadBlob idiom
 * (never react-pdf bytes — the IT-4 hazard).
 *
 * @enforced-by tests/domain/chroniclersLetter.test.js + tests/property/chroniclersLetterGolden.test.js
 */

import { newsVoiceCategory } from './newsVoice.js';

/** Local FNV-1a (the newsVoice idiom — each module keeps its own copy rather than
 *  import a sibling's table). @param {string} str @returns {number} */
function fnv1a32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}

/** Codepoint-stable compare. */
const byStr = (/** @type {string} */ a, /** @type {string} */ b) => (a < b ? -1 : a > b ? 1 : 0);

/** The letter's sections, in reading order. Each covers a set of newsVoice
 *  categories; an entry's category (newsVoiceCategory) routes it to its section.
 *  A classified-null entry with a headline falls to 'sundry' (never dropped). */
const LETTER_SECTIONS = Object.freeze([
  { id: 'wars', heading: 'Of war and calamity', cats: ['war', 'calamity', 'pestilence'] },
  { id: 'courts', heading: 'Of courts and crowns', cats: ['authority'] },
  { id: 'trade', heading: 'Of trade and fortune', cats: ['trade', 'prosperity', 'migration'] },
  { id: 'traditions', heading: 'Of faith and custom', cats: ['faith', 'reframe'] },
  { id: 'mercy', heading: 'Of mercy given', cats: ['succor'] },
  { id: 'sundry', heading: 'Of sundry other matters', cats: [/** @type {any} */ (null)] },
]);
/** category → section id. */
const SECTION_OF = (() => {
  /** @type {Record<string, string>} */
  const m = {};
  for (const s of LETTER_SECTIONS) for (const c of s.cats) m[String(c)] = s.id;
  return m;
})();

/** Greeting variants (FNV-picked by the diff's own fingerprint — deterministic). */
const GREETINGS = Object.freeze([
  'To the keeper of this realm, greetings. Since last I wrote, the following came to pass.',
  'My lord, my lady — the season has turned, and with it these tidings.',
  'Word from the realm, set down faithfully as it reached me.',
  'Herewith the record of what has stirred since you last read my hand.',
]);
const CLOSINGS = Object.freeze([
  'And so the ledger stands. Your faithful chronicler.',
  'Thus the account, until the next turning. Ever your chronicler.',
  'This is the whole of it, honestly kept. Your chronicler.',
  'Here I lay down the pen until more comes to pass. Your chronicler.',
]);
const QUIET = Object.freeze([
  'Little of note passed since last you read. The realm kept its own quiet counsel.',
  'A still season: no war, no crowning, no calamity worth the ink. All held.',
  'The days ran on without event worth the setting-down. Peace, of a kind.',
]);
const DEEPENED_LEAD = 'The world itself has deepened since last we spoke — new currents now run beneath it:';

/** WIZARD_NEWS significance ⇒ order weight (MAJOR before NOTABLE). */
const SIG_WEIGHT = { major: 0, notable: 1 };

/** The enabled boolean flags of a simulationRules object (the R-16 flag set). Pure.
 *  @param {unknown} simulationRules @returns {string[]} sorted enabled boolean keys */
export function enabledFlagsOf(simulationRules) {
  if (!simulationRules || typeof simulationRules !== 'object') return [];
  const r = /** @type {Record<string, unknown>} */ (simulationRules);
  return Object.keys(r).filter((k) => r[k] === true).sort();
}

/**
 * @typedef {Object} LetterLine
 * @property {string} id
 * @property {number} tick
 * @property {string} headline
 * @property {string} summary
 * @property {'major'|'notable'} significance
 */

/**
 * @typedef {Object} ChroniclersLetter
 * @property {number} sinceTick
 * @property {number} throughTick
 * @property {boolean} empty
 * @property {string} greeting
 * @property {Array<{ id: string, heading: string, lines: LetterLine[] }>} sections
 * @property {{ flags: string[], lead: string }|null} deepened   R-16 (null ⇒ dark)
 * @property {string} closing
 * @property {{ major: number, notable: number, total: number }} counts
 */

/**
 * Compose the chronicler's letter for a campaign, deterministically.
 * @param {Object} args
 * @param {{ currentTick?: number, entries?: ReadonlyArray<any> }|null|undefined} args.wizardNews
 * @param {number} [args.lastReadTick]      the diff floor (default 0)
 * @param {unknown} [args.simulationRules]  the campaign's live flags (for R-16)
 * @param {ReadonlyArray<string>|null} [args.flagsSeen]  recorded flags at last read (null ⇒ R-16 dark)
 * @returns {ChroniclersLetter}
 */
export function composeChroniclersLetter({ wizardNews, lastReadTick = 0, simulationRules = null, flagsSeen = null }) {
  const feed = wizardNews && typeof wizardNews === 'object' ? wizardNews : {};
  const through = Number.isFinite(feed.currentTick) ? Number(feed.currentTick) : 0;
  const since = Number.isFinite(lastReadTick) ? Number(lastReadTick) : 0;
  const entries = Array.isArray(feed.entries) ? feed.entries : [];

  // The diff: beats strictly newer than the read floor. Deterministic normalize.
  /** @type {LetterLine[]} */
  const diff = [];
  for (const e of entries) {
    if (!e || typeof e !== 'object') continue;
    const tick = Number.isFinite(e.tick) ? Math.floor(Number(e.tick)) : 0;
    if (tick <= since) continue;
    const significance = e.significance === 'major' ? 'major' : 'notable';
    diff.push({
      id: String(e.id ?? `beat_${tick}`),
      tick,
      headline: String(e.headline || 'A matter of the realm'),
      summary: String(e.summary || ''),
      significance,
    });
  }

  // Group into sections by category; order within a section MAJOR-first, then score-
  // less (headline-stable): significance, then tick desc, then id (codepoint).
  /** @type {Map<string, LetterLine[]>} */
  const bySection = new Map();
  const rawById = new Map(entries.filter((e) => e && typeof e === 'object').map((e) => [String(e.id ?? ''), e]));
  for (const l of diff) {
    const cat = newsVoiceCategory(rawById.get(l.id) || {});
    const sectionId = SECTION_OF[String(cat)] || 'sundry';
    if (!bySection.has(sectionId)) bySection.set(sectionId, []);
    (bySection.get(sectionId) || []).push(l);
  }
  const sections = LETTER_SECTIONS
    .map((s) => ({
      id: s.id,
      heading: s.heading,
      lines: (bySection.get(s.id) || []).sort((a, b) =>
        (SIG_WEIGHT[a.significance] - SIG_WEIGHT[b.significance])
        || (b.tick - a.tick)
        || byStr(a.id, b.id)),
    }))
    .filter((s) => s.lines.length > 0);

  const major = diff.filter((l) => l.significance === 'major').length;
  const counts = { major, notable: diff.length - major, total: diff.length };
  const empty = diff.length === 0;

  // R-16: the flag-set delta vs the recorded baseline. flagsSeen null ⇒ DARK (no
  // baseline ⇒ no deepened section; byte-identical to the pre-R-16 letter).
  /** @type {{ flags: string[], lead: string }|null} */
  let deepened = null;
  if (Array.isArray(flagsSeen)) {
    const seen = new Set(flagsSeen.map(String));
    const now = enabledFlagsOf(simulationRules);
    const lit = now.filter((f) => !seen.has(f));
    if (lit.length > 0) deepened = { flags: lit, lead: DEEPENED_LEAD };
  }

  // House-voice frame, FNV-picked by the diff's own fingerprint so the same letter
  // reads the same every render, and two different weeks differ.
  const fp = fnv1a32(`${since}:${through}:${diff.map((l) => l.id).join(',')}`);
  const greeting = empty ? QUIET[fp % QUIET.length] : GREETINGS[fp % GREETINGS.length];
  const closing = CLOSINGS[fp % CLOSINGS.length];

  return { sinceTick: since, throughTick: through, empty, greeting, sections, deepened, closing, counts };
}

/**
 * Render the letter to portable, house-voiced plain text (R-17 shareable export).
 * Deterministic; the panel writes it via the existing downloadBlob idiom.
 * @param {ChroniclersLetter} letter @returns {string}
 */
export function letterToPlainText(letter) {
  const lines = [];
  lines.push('THE CHRONICLER’S LETTER');
  lines.push(`(the record from tick ${letter.sinceTick} through ${letter.throughTick})`);
  lines.push('');
  lines.push(letter.greeting);
  if (letter.deepened) {
    lines.push('');
    lines.push(letter.deepened.lead);
    for (const f of letter.deepened.flags) lines.push(`  — ${f}`);
  }
  for (const s of letter.sections) {
    lines.push('');
    lines.push(s.heading.toUpperCase());
    for (const l of s.lines) {
      lines.push(`  • ${l.headline}${l.significance === 'major' ? ' (of great moment)' : ''}`);
      if (l.summary) lines.push(`    ${l.summary}`);
    }
  }
  lines.push('');
  lines.push(letter.closing);
  return lines.join('\n');
}
