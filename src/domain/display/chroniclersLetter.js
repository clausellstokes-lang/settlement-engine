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
import { tickCalendarLabel } from './humanizeEngineTokens.js';

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
  // sundry has NO cats of its own — an entry whose category maps to no section (a
  // classified-null or unknown category) falls here via the `|| 'sundry'` route.
  { id: 'sundry', heading: 'Of sundry other matters', cats: [] },
]);
/** category → section id. */
const SECTION_OF = (() => {
  /** @type {Record<string, string>} */
  const m = {};
  for (const s of LETTER_SECTIONS) for (const c of s.cats) m[String(c)] = s.id;
  return m;
})();

/**
 * C2 (bar 18, "the sundry monoculture"): the LETTER-LOCAL kind → section fallback.
 * newsVoiceCategory deliberately classifies only the semantic impact-nature tokens
 * (the candidateType walker LOCKS every promoted candidateType to NO crier voice,
 * and the npc-agency-voice deferral is a recorded owner decision — this map must
 * NEVER be folded into newsVoiceCategory). But the letter's SECTIONS are a
 * different chokepoint: routing here dresses a beat under the right heading
 * without giving it a crier line, so an ordinary realm's letter stops filing
 * ninety percent of its record under "Of sundry other matters". Fires ONLY when
 * newsVoiceCategory returned null; classified kinds keep their existing route
 * (both pinned letter fixtures carry only classified kinds ⇒ byte-identical).
 * Kinds deliberately left to sundry: the refusal receipts (queue_refused,
 * realm_verb_refused), the generic stressor lifecycle (stressor_residual /
 * _aftermath / _graduated / _wind_down, party_stressor_residual), and
 * spatial_consequence — none carries a section-worthy nature on its face.
 * Exported for the drift walker only (every key must be a genuinely minted kind).
 * @type {Readonly<Record<string, string>>}
 */
export const KIND_SECTION = Object.freeze({
  // Of war and calamity.
  war_mobilization: 'wars', war_conscription: 'wars', war_levy: 'wars', war_spoils: 'wars',
  army_homecoming: 'wars', hostile_raid: 'wars', conquest: 'wars', siege_lifted: 'wars',
  blockade_declared: 'wars', blockade_lifted: 'wars', field_battle: 'wars', sea_battle: 'wars',
  intercept_ordered: 'wars', convoy_ordered: 'wars', reinforcement_ordered: 'wars',
  intervention_ordered: 'wars', intervention: 'wars', intervention_clash: 'wars',
  strategy_deploy: 'wars', occupation_lifted: 'wars', occupation_vassalized: 'wars',
  vassal_rebellion: 'wars', cold_war_supply_sanctions: 'wars', ally_burden: 'wars',
  settlement_terminal_death: 'wars',
  // Of courts and crowns (power, judgment, and persons of note).
  coup_succeeded: 'courts', coup_suppressed: 'courts', faction_government_challenge: 'courts',
  faction_rival_power_contest: 'courts', faction_capture: 'courts', faction_exhaustion: 'courts',
  hierarchy_cascade: 'courts', assize_verdict: 'courts', diplomacy: 'courts',
  vassal_tribute_extraction: 'courts', reconsideration_forced: 'courts',
  commons_gathering: 'courts', commons_petition: 'courts', commons_riot: 'courts',
  npc_goal_culmination: 'courts', npc_goal_rebranch: 'courts', npc_growth: 'courts',
  npc_ladder: 'courts', npc_contest: 'courts', npc_support: 'courts',
  // Of trade and fortune (goods, roads, harvests, and the moving of peoples).
  flow_trade_scarcity: 'trade', trade_embargo_collapse: 'trade', resource_discovery: 'trade',
  resource_depletion: 'trade', resource_recovery: 'trade', resource_removal: 'trade',
  harvest: 'trade', hungry_gap: 'trade', spring_thaw: 'trade', roads: 'trade',
  urban_fabric: 'trade', institution_build: 'trade', institution_closure: 'trade',
  institution_founding: 'trade', settlement_resettled: 'trade', flow_migration: 'trade',
  population_emigration: 'trade', migration_flight: 'trade',
  generosity_credit_default: 'trade', generosity_purchase: 'trade', generosity_trade_overture: 'trade',
  // Of faith and custom.
  faith_foothold_recruited: 'traditions', faith_pact_formed: 'traditions',
  pantheon_ascendancy: 'traditions', pantheon_twilight: 'traditions',
  tradition: 'traditions', tradition_change: 'traditions', moral_reckoning: 'traditions',
  belief_misjudgment: 'traditions', cause_lifecycle: 'traditions',
  stressor_birth_religious_conversion_fracture: 'traditions',
  stressor_birth_religious_pact_betrayal: 'traditions',
  // Of mercy given (relief granted and relief refused — the succor floor's own pair).
  generosity_refusal: 'mercy', generosity_refuge: 'mercy',
});

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

/** C2 (bar 97, "claims completeness it cannot keep"): the honest line the letter
 *  carries when the capped feed has provably shed beats older than the read floor.
 *  Rendered only when `truncated` is true (both pinned fixtures: never). */
const TRUNCATION_NOTE = 'Some older matters outran my pages before this letter was writ; the record here begins where my keeping does.';

/** The feed's entry cap — mirrors wizardNews.js MAX_ENTRIES (the display sidecar
 *  idiom: no engine import; the test pins the two constants against drift). */
const FEED_CAP = 240;

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
 * @property {number} [repeats]   C2: >1 ⇒ this line stood verbatim N times in the span
 * @property {{ headline: string, when: string }|null} [recalls]  C2: the older record this beat echoes
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
 * @property {boolean} [truncated]   C2: present (true) only when the capped feed provably shed pre-floor beats
 * @property {string|null} [truncationNote]  C2: present only beside truncated
 * @property {{ major: number, notable: number, total: number }} counts
 */

/**
 * The news-entry fields the composer reads (a subset of WizardNewsEntry; newsVoice
 * categorizes off impactKind/channelType). No `any` — the strict-domain rule.
 * @typedef {Object} LetterNewsEntry
 * @property {string|number} [id]
 * @property {number} [tick]
 * @property {string} [significance]
 * @property {string} [headline]
 * @property {string} [summary]
 * @property {string} [impactKind]
 * @property {string} [channelType]
 * @property {ReadonlyArray<string>} [settlementIds]
 */

/** The section a raw feed entry routes to: the crier category first (unchanged
 *  precedence), the letter-local kind map only where the crier stayed silent.
 *  @param {LetterNewsEntry|undefined} raw @returns {string} */
function sectionOfEntry(raw) {
  const cat = newsVoiceCategory(raw || {});
  return SECTION_OF[String(cat)] || KIND_SECTION[String(raw?.impactKind || '')] || 'sundry';
}

/**
 * C2 (misc, "identical sentences repeat up to 4x"): collapse verbatim duplicate
 * lines WITHIN a section — same headline and same summary — keeping the first
 * (highest-sorted) and counting the rest on it as `repeats`. A person keeping a
 * record notes a matter once and says it recurred; a machine log prints it four
 * times. Deterministic (input already sorted); lines that differ at all survive.
 * @param {LetterLine[]} lines  sorted section lines
 * @returns {LetterLine[]}
 */
function coalesceLines(lines) {
  /** @type {Map<string, LetterLine>} */
  const seen = new Map();
  /** @type {LetterLine[]} */
  const out = [];
  for (const l of lines) {
    const key = `${l.headline}\u241F${l.summary}`;
    const kept = seen.get(key);
    if (kept) { kept.repeats = (kept.repeats || 1) + 1; continue; }
    seen.set(key, l);
    out.push(l);
  }
  return out;
}

/**
 * C2 (bar 20): the older record a section lead echoes — the newest pre-floor
 * beat still in the feed that shares a settlement with the lead and routes to
 * the same section. Deterministic: majors first, then newest tick, then id.
 * @param {LetterNewsEntry|undefined} lead  the lead line's raw feed entry
 * @param {string} sectionId
 * @param {ReadonlyArray<LetterNewsEntry>} entries  the whole feed
 * @param {number} since  the read floor
 * @returns {{ headline: string, when: string }|null}
 */
function recallFor(lead, sectionId, entries, since) {
  if (!lead || typeof lead !== 'object') return null;
  const leadPlaces = new Set((Array.isArray(lead.settlementIds) ? lead.settlementIds : []).map(String));
  if (leadPlaces.size === 0) return null;
  /** @type {LetterNewsEntry|null} */
  let best = null;
  for (const e of entries) {
    if (!e || typeof e !== 'object') continue;
    const tick = Number.isFinite(e.tick) ? Math.floor(Number(e.tick)) : null;
    if (tick == null || tick > since) continue;               // only the already-read past
    if (!e.headline || String(e.id ?? '') === String(lead.id ?? '')) continue;
    if (sectionOfEntry(e) !== sectionId) continue;
    const places = Array.isArray(e.settlementIds) ? e.settlementIds : [];
    if (!places.some((p) => leadPlaces.has(String(p)))) continue;
    if (best == null) { best = e; continue; }
    const sw = (/** @type {LetterNewsEntry} */ x) => (x.significance === 'major' ? 0 : 1);
    const bt = Math.floor(Number(best.tick) || 0);
    if (sw(e) < sw(best) || (sw(e) === sw(best) && (tick > bt
      || (tick === bt && byStr(String(e.id ?? ''), String(best.id ?? '')) < 0)))) best = e;
  }
  if (!best) return null;
  return { headline: String(best.headline), when: tickCalendarLabel(Math.floor(Number(best.tick) || 0)) };
}

/**
 * Compose the chronicler's letter for a campaign, deterministically.
 * @param {Object} args
 * @param {{ currentTick?: number, entries?: ReadonlyArray<LetterNewsEntry> }|null|undefined} args.wizardNews
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
    const sectionId = sectionOfEntry(rawById.get(l.id));
    if (!bySection.has(sectionId)) bySection.set(sectionId, []);
    (bySection.get(sectionId) || []).push(l);
  }
  const sections = LETTER_SECTIONS
    .map((s) => ({
      id: s.id,
      heading: s.heading,
      lines: coalesceLines((bySection.get(s.id) || []).sort((a, b) =>
        (SIG_WEIGHT[a.significance] - SIG_WEIGHT[b.significance])
        || (b.tick - a.tick)
        || byStr(a.id, b.id))),
    }))
    .filter((s) => s.lines.length > 0);

  // C2 (bar 20, "logs rather than narrates"): the cross-time join. For each
  // section's LEAD line, look for the older record it echoes — a beat at or
  // before the read floor, still held in the feed, sharing a settlement and the
  // same section — and let the letter recall it. One recall per section keeps
  // the device an inkwell, not a mechanism. Fixtures carry no pre-floor beats
  // that qualify ⇒ byte-identical there.
  // (Fields land on the model ONLY when lit — an inert letter stays byte-identical
  // to the pre-C2 shape, which is what keeps the GREEN golden green.)
  for (const s of sections) {
    const lead = s.lines[0];
    const recall = lead ? recallFor(rawById.get(lead.id), s.id, entries, since) : null;
    if (lead && recall) lead.recalls = recall;
  }

  const major = diff.filter((l) => l.significance === 'major').length;
  const counts = { major, notable: diff.length - major, total: diff.length };
  const empty = diff.length === 0;

  // C2 (bar 97): the feed can only hold FEED_CAP beats; when it is full AND its
  // oldest survivor post-dates the read floor by more than one tick, beats in the
  // span were provably shed — the letter must not then claim completeness.
  const oldestTick = entries.reduce((m, e) => {
    const t = e && typeof e === 'object' && Number.isFinite(e.tick) ? Math.floor(Number(e.tick)) : null;
    return t == null ? m : (m == null ? t : Math.min(m, t));
  }, /** @type {number|null} */(null));
  const truncated = entries.length >= FEED_CAP && oldestTick != null && oldestTick > since + 1;

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
  // reads the same every render, and two different weeks differ. A TRUNCATED span
  // must not draw the completeness closing ("This is the whole of it, honestly
  // kept") — the honest pool excludes it; the un-truncated pick is unchanged.
  const fp = fnv1a32(`${since}:${through}:${diff.map((l) => l.id).join(',')}`);
  const greeting = empty ? QUIET[fp % QUIET.length] : GREETINGS[fp % GREETINGS.length];
  const closingPool = truncated ? CLOSINGS.filter((c) => !c.includes('the whole of it')) : CLOSINGS;
  const closing = closingPool[fp % closingPool.length];

  return {
    sinceTick: since, throughTick: through, empty, greeting, sections, deepened, closing,
    ...(truncated ? { truncated: true, truncationNote: TRUNCATION_NOTE } : {}),
    counts,
  };
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
      const tally = (l.repeats || 1) > 1 ? ` (so noted ${l.repeats} times)` : '';
      lines.push(`  • ${l.headline}${l.significance === 'major' ? ' (of great moment)' : ''}${tally}`);
      if (l.summary) lines.push(`    ${l.summary}`);
      if (l.recalls) lines.push(`    In this my earlier record returns, from ${l.recalls.when}: ${l.recalls.headline}.`);
    }
  }
  if (letter.truncationNote) {
    lines.push('');
    lines.push(letter.truncationNote);
  }
  lines.push('');
  lines.push(letter.closing);
  return lines.join('\n');
}
