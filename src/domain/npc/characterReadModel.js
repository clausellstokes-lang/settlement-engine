/**
 * domain/npc/characterReadModel.js — THE READ MODEL AND THE PROSE (W-LIVES car L7;
 * DESIGN_W_LIVES.md §5, §7, §14 GAP D, and §15's panel fold, which OUTRANKS them).
 *
 * WHAT THIS HOLDS. Nothing. Every export is a QUERY over things that already exist —
 * a chart, a set of receipts, an injected word projection — and every one of them
 * recomputes from its arguments. GAP D is the law of this file, not a quotation of
 * it: "Biography is a query, not a store... No per-NPC memory store exists or may be
 * minted." A file that remembered anything would be the store the design forbids.
 *
 * ── WHAT WAS ALREADY BUILT, AND IS THEREFORE NOT REBUILT HERE ────────────────
 *
 * §5's PINNED TOTAL ORDER IS CAR L3's, and it stays there. `chartOrderOf` /
 * `topPositionsOf` / `TOP_POSITIONS` / `displacementsBetween` all live in
 * `livedExperienceFunnel.js`, and this file IMPORTS them. Re-deriving "|effective
 * position| desc, then band rank, then codepoint axis id" here would mint the second
 * home that F1 spent a whole car killing, and the two copies would agree until the
 * day they did not. What this car adds is the half §5 asks for and L3 could not
 * supply: the order rendered as WORDS a reader can read.
 *
 * ── ⭐ THE WORD PROJECTION IS INJECTED, AND WITHOUT IT THERE IS NO PROSE ──────
 *
 * Axis position → word is car L1's `wordForAxisPosition`, and L1 is on a DIFFERENT
 * unlanded line from this stack (its `paradigmAxisCatalog.js` is not an ancestor of
 * this tree at all). The estate's answer to that is car L5's, and it is followed
 * exactly: the projection is INJECTED, never mirrored — a 17-axis, two-pole word
 * table copied into a second file is the parallel-tables hazard F1 ruled out.
 * The seam is named in `characterConsumers.js` as PARADIGM_WORD_PROJECTION_SEAM
 * (`paradigmAxisCatalog.js#wordForAxisPosition`) and this file CITES it rather than
 * importing it, so the drift family's enumerated production door does not grow a
 * fourth walker for a documentation constant.
 *
 * ⛔ AND THE REFUSAL IS THE POINT: with no projection there is NO ARTICLE, refused
 * as `no_projection`. The alternative — falling back to the axis id — would put an
 * engine token in reader prose, which is the one thing the presentation boundary
 * exists to stop. A reader that cannot name a thing says nothing about it.
 *
 * ── ⚠ THE SPEC'S OWN EXAMPLE SENTENCE IS NOT CONSTRUCTIBLE, AND THAT IS RULED ──
 *
 * §5 illustrates a displacement as *"bitterness has overtaken his patience"* — two
 * NOUNS. Car L1's catalog carries only ADJECTIVES (`brave`/`cowardly`,
 * `patient`/`wrathful`), and English nominalization is irregular across exactly this
 * vocabulary (brave→bravery, wrathful→wrath, cowardly→cowardice), so no rule derives
 * the nouns and a 34-row noun table would be a second vocabulary for one sentence
 * shape. The frames below are therefore ADJECTIVAL and say the same fact:
 * "X runs more wrathful now than patient." The example was illustrative; the
 * vocabulary is the contract.
 *
 * ── PRONOUNS ARE NEVER WRITTEN ───────────────────────────────────────────────
 *
 * Every frame repeats the NAME. The roster carries no gender field this file may
 * read, and the product is SETTING-AGNOSTIC; guessing a pronoun would be an
 * invention in the one place the news address law demands a name anyway.
 *
 * PURE. No world state written, no clock, no PRNG, no I/O, no mutation, no store.
 * Every returned list is codepoint-stable and frozen.
 *
 * @see docs/DESIGN_W_LIVES.md §5 (the read model), §7 (surfaces/prose), §12 R2, §14 GAP D, §15
 * @see docs/OWNER_DECISION_QUEUE.md §800.4, §802, §806
 * @enforced-by tests/domain/npc/characterReadModel.test.js
 */

import { compareCodepoint } from '../deterministicSort.js';
import { AXIS_LEVELS, positionValue } from './characterDrift.js';
import {
  LIVED_EXPERIENCE_KINDS,
  SILENT_EXPERIENCE_KIND,
} from './livedExperienceCatalog.js';
import {
  HOMEWARD_DECAY_CAUSE,
  NEUTRAL_BAND,
  TOP_POSITIONS,
  bandWordOf,
  chartOrderOf,
  effectiveChartOf,
} from './livedExperienceFunnel.js';
import { DISCLOSURE_KINDS, characterAsSeenBy } from './knownCharacter.js';

/**
 * THE TYPED ACTIONS a character article can carry — the funnel's OWN receipt kinds,
 * imported in spirit and asserted against `DISCLOSURE_KINDS` by the test rather than
 * re-spelled. The news address law wants a typed action; the funnel already mints
 * exactly three, and a fourth spelling of "a band was crossed" is how two vocabularies
 * start.
 * @type {readonly string[]}
 */
export const ARTICLE_ACTIONS = Object.freeze(['band_crossing', 'displacement', 'reversal']);

/**
 * THE CLOSED REFUSAL VOCABULARY, the funnel's discipline applied to a reader: a
 * composer that declines to speak says WHY, because "this person had a quiet year"
 * and "this composer could not name what happened" are different facts and a surface
 * debugging an empty dossier needs the second.
 * @type {readonly string[]}
 */
export const ARTICLE_REFUSALS = Object.freeze([
  'no_axis',          // the receipt names no axis, so there is nothing to say a word about
  'no_name',          // the news address law requires a name and none was supplied
  'no_projection',    // no word projection was injected — see the header
  'no_tick',          // the receipt carries no readable tick, so the article has no when
  'no_word',          // the projection declined this position (an axis it does not home)
  'unknown_action',   // a receipt kind outside ARTICLE_ACTIONS
]);

/**
 * THE LEVEL PHRASES — a CANDIDATE REGISTER, owner-unsigned. Three rows, one per
 * `AXIS_LEVELS` rung, and the totality is asserted rather than assumed: a fourth rung
 * would red the test rather than silently render as nothing.
 *
 * These are the only adverbs this file owns. They exist because §7 says "band words
 * and pole words only" and a band word (`virtue_marked`) is an engine token: the
 * reader gets the LEVEL as English and the POLE as L1's word.
 * @type {Readonly<Record<string, string>>}
 */
export const LEVEL_PHRASES = Object.freeze({
  a_touch: 'a little',
  marked: 'notably',
  defining: 'above all',
});

/**
 * THE REASON CLAUSES — a CANDIDATE REGISTER, owner-unsigned, one row per TEACHING
 * experience kind. This is GAP D's own sentence made buildable: "the dossier renders
 * 'hardened by the sack, the failed mission, a year in a cruel city' from receipts
 * alone" — the receipts carry `sourceKinds`, and these are what those kinds are
 * called in reader prose.
 *
 * ⛔ THE SILENT KIND HAS NO ROW, DELIBERATELY. `ordinary_day` teaches nothing and
 * mints no receipt, so a clause for it would be a phrase describing an event that
 * cannot appear in any article — a vocabulary entry guarding nothing. The test
 * asserts the totality BOTH ways: every teaching kind has a clause, and the silent
 * kind has none.
 *
 * Every clause is a NOUN PHRASE with no article-initial capital and no full stop, so
 * one register serves both frames ("Reason: a friend's betrayal." and "…hardened by
 * a friend's betrayal").
 * @type {Readonly<Record<string, string>>}
 */
export const EXPERIENCE_CLAUSES = Object.freeze({
  abandoned_unransomed: 'a captivity nobody paid to end',
  bereavement_close: 'a death close to home',
  betrayed_by_friend: "a friend's betrayal",
  captured_held: 'a season held captive',
  caught_lying_exposed: 'a lie brought into the open',
  converted_faith: 'a change of faith',
  corruption_exposed: 'corruption brought into the open',
  coup_at_home: 'a seizure of power at home',
  dwell_milieu: 'the long habit of the place',
  faction_captured: 'a house taken from within',
  faction_cleansed: 'a house cleaned out',
  faith_milieu: 'the long habit of the gods of the place',
  festival_kept: 'a festival kept',
  goal_culminated: 'an ambition carried through',
  god_fortunes_fell: 'the falling fortunes of a god',
  god_fortunes_rose: 'the rising fortunes of a god',
  home_liberated: 'a home delivered',
  home_occupied: 'a home under occupation',
  house_power_fell: 'a house losing its standing',
  house_power_rose: 'a house rising in standing',
  // ⭐ ENC-3's kind, and the clause is worded for BOTH parties rather than for the
  // traveller. A chance meeting teaches the visitor and the host alike, so a phrase
  // naming a journey ("a stranger met far from home") would be false of the notable who
  // never left his own hall, and a phrase naming a duration would contradict the kind's
  // own span — the catalog files it non-ambient precisely because a meeting is a week,
  // not a season. What is true of both souls is that the other one came from somewhere
  // else, which is the only fact the clause states.
  met_a_foreigner: 'the company of a stranger from far off',
  news_believed_atrocity: 'word of an atrocity, believed',
  news_believed_triumph: 'word of a triumph, believed',
  pardoned_released: 'a pardon',
  plague_season_survived: 'a season of plague survived',
  promotion_won: 'a promotion won',
  ransomed_home: 'a ransom paid',
  refused_by_patron: "a patron's refusal",
  rung_lost: 'a fall down the ladder',
  survived_battle: 'a battle survived',
  took_holy_orders: 'the taking of holy orders',
  turned_by_crime: 'a turn to crime',
});

/**
 * What the homeward walk is called in prose. The funnel's decay cause is not an
 * experience — nothing happened — so it cannot live in the table above, and saying
 * nothing would leave the most common crossing of all with no reason at all.
 */
export const DECAY_CLAUSE = 'the slow work of years';

/**
 * ⭐ WHAT WIRING THIS INTO THE HERALD WOULD COST, DECLARED RATHER THAN DISCOVERED.
 *
 * These articles are NOT news entries and this file mints none. The estate's news
 * census (`tests/lint/newsAuthoringCensus.shared.mjs`) treats any object literal
 * under `src/domain` carrying both `kind` and `headline` as an authoring site owing
 * `id`, `settlementIds`, `severity` and an EXPLICITLY ROUTED token — and its debt
 * ledger's policy line is "never add or raise the 19-row ceiling".
 *
 * Registration was measured and deliberately NOT taken, because nothing in this tree
 * can produce a character receipt: no generator writes `npc.character` and no
 * production caller runs `foldLivedExperience`. Routing a herald section for a token
 * the engine never mints would put a guarded vocabulary around an event that cannot
 * happen. The wiring car takes it, and this constant is the bill.
 * @type {Readonly<{ census: string, routing: string, owed: readonly string[] }>}
 */
export const CHARACTER_NEWS_REGISTRATION_SEAM = Object.freeze({
  census: 'tests/lint/newsAuthoringCensus.shared.mjs',
  routing: 'src/domain/realm/heraldRouting.js#EXACT_SECTION',
  owed: Object.freeze([
    'an EXACT_SECTION row per ARTICLE_ACTIONS member (the events catch-all is explicit, never a fall-through)',
    'the envelope fields the census requires on the minted entry: id, settlementIds, severity',
    'a producer that actually mints them. Today no caller runs foldLivedExperience, so the vocabulary would guard nothing',
  ]),
});

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {unknown[]} */
function asArray(v) {
  return Array.isArray(v) ? v : [];
}

/** @param {unknown} v @returns {string} */
function str(v) {
  return v == null ? '' : String(v);
}

/**
 * A tick as a non-negative integer, or ABSENT.
 *
 * ⚠ TYPE-TESTED, NEVER VALUE-TESTED, and the reason is a measured hazard rather than
 * a style: `Number(null)` is 0 and 0 is finite, so a numeric guard reads a MISSING
 * tick as tick zero and files a life's whole record at the beginning of the world.
 * This is the third sighting of that class in this program (§865's clock, car L5's
 * risk centre), and the cure is the same one both times: ask the TYPE.
 * @param {unknown} v @returns {number|null}
 */
function tickOrNull(v) {
  if (typeof v !== 'number' || !Number.isFinite(v) || !Number.isInteger(v) || v < 0) return null;
  return v;
}

/**
 * The injected word projection, made total. A caller that passes nothing, or whose
 * projection throws or returns a non-string, yields NO WORD — never a guess.
 * @param {unknown} project
 * @returns {(position: {axisId: string, pole?: string, level?: string}) => string}
 */
function projector(project) {
  if (typeof project !== 'function') return () => '';
  return (position) => {
    const word = /** @type {(p: unknown) => unknown} */ (project)(position);
    return typeof word === 'string' ? word.trim() : '';
  };
}

/**
 * A band word (`virtue_marked`) split back into its parts. TOTAL: `neutral` and
 * anything unreadable yield no pole, which every caller reads as "this says nothing
 * about a side".
 * @param {unknown} band @returns {{pole: string, level: string}}
 */
export function bandParts(band) {
  const text = str(band);
  const split = text.indexOf('_');
  if (split <= 0) return { pole: '', level: '' };
  const pole = text.slice(0, split);
  const level = text.slice(split + 1);
  if ((pole !== 'virtue' && pole !== 'vice') || !AXIS_LEVELS.includes(level)) return { pole: '', level: '' };
  return { pole, level };
}

/**
 * A BANDED chart (`effectiveCharacter`'s shape, which is also what
 * `characterAsSeenBy` returns) as the continuous signed values the order reads.
 *
 * ⚠ NOT a second home for `effectiveChartOf`: that one takes (npc, drift) and adds a
 * stored offset, and this one takes an ALREADY-COMPOSED chart whose offsets are
 * spent — the shape a KNOWN reading arrives in, where no drift map exists to add.
 * The test drives both into the same order for the same soul so the two entries into
 * the read model cannot disagree.
 * @param {unknown} character @returns {Record<string, number>}
 */
export function chartValuesOf(character) {
  const axes = asObject(asObject(character).axes);
  /** @type {Record<string, number>} */
  const chart = {};
  for (const axisId of Object.keys(axes).sort(compareCodepoint)) {
    chart[axisId] = positionValue(/** @type {{pole?: 'virtue'|'vice', level?: string}} */ (axes[axisId]));
  }
  return chart;
}

/**
 * @typedef {Object} ReadPosition
 * @property {string} axisId
 * @property {string} band     a SPECTRUM_BAND_LADDER member
 * @property {string} pole     'virtue' | 'vice'
 * @property {string} level    an AXIS_LEVELS member
 * @property {string} word     L1's word for this position, or '' if none was injected
 * @property {string} phrase   the reader phrase (`notably brave`), or '' without a word
 */

/**
 * ⭐ THE READ MODEL (§5): the strongest TOP_POSITIONS positions, in car L3's PINNED
 * TOTAL ORDER, rendered as words.
 *
 * The ORDER is not computed here — `chartOrderOf` is called, and the slice is taken
 * at `TOP_POSITIONS`, both of them L3's. What is added is the projection and the
 * phrase, which is the whole of this car's half of §5.
 *
 * AN ALL-NEUTRAL SOUL READS EMPTY, not as three neutral rows: `chartOrderOf` excludes
 * neutral axes because "the top 3 strongest positions" cannot include a position
 * nobody holds. A person with no marked character has an honestly empty read model.
 *
 * @param {Object} args
 * @param {Record<string, number>} args.chart  continuous signed values per axis
 * @param {(position: {axisId: string, pole?: string, level?: string}) => unknown} [args.project]
 *   L1's `wordForAxisPosition` (see the header) — omitted, every `word`/`phrase` is ''
 * @returns {readonly ReadPosition[]}
 */
export function readPositions({ chart, project }) {
  const word = projector(project);
  const values = asObject(chart);
  return Object.freeze(chartOrderOf(/** @type {Record<string, number>} */ (values))
    .slice(0, TOP_POSITIONS)
    .map((axisId) => {
      const band = bandWordOf(Number(values[axisId]) || 0);
      const { pole, level } = bandParts(band);
      const projected = pole ? word({ axisId, pole, level }) : '';
      const adverb = LEVEL_PHRASES[level] || '';
      return Object.freeze({
        axisId,
        band,
        pole,
        level,
        word: projected,
        phrase: projected && adverb ? `${adverb} ${projected}` : '',
      });
    }));
}

/**
 * The read model for one soul straight from the roster record — the ordinary entry,
 * and the one that goes through L2's stored offsets.
 * @param {Object} args
 * @param {{character?: unknown}|null|undefined} args.npc
 * @param {Record<string, {offset: number, updatedTick: number}>|null|undefined} [args.drift]
 * @param {(position: {axisId: string, pole?: string, level?: string}) => unknown} [args.project]
 * @returns {readonly ReadPosition[]}
 */
export function readingOf({ npc, drift, project }) {
  return readPositions({ chart: effectiveChartOf(npc, drift), project });
}

/**
 * THE LEAD — the dossier's one-line character, §5's "read surfaces show the top 3".
 *
 * Returns '' when nothing can be said, and that is a real answer rather than a
 * degenerate one: a soul at all-neutral, or a reader with no projection, HAS no lead,
 * and inventing "unremarkable" would be a claim the chart does not make.
 *
 * @param {readonly ReadPosition[]} positions
 * @returns {string}
 */
export function leadLine(positions) {
  const phrases = asArray(positions)
    .map((row) => str(asObject(row).phrase))
    .filter(Boolean);
  if (phrases.length === 0) return '';
  return `${phrases.join(', ')}.`;
}

/**
 * ⭐⭐ GAP D, THE QUERY NOBODY HAD WRITTEN.
 *
 * `knownCharacterOf` takes its disclosures as an ARGUMENT and says why in its own
 * header: "a biography is a QUERY over the receipts that name a person, so the caller
 * runs the query and hands the answer in. A version of this function that went
 * looking would need somewhere to look, and somewhere to look is the store the design
 * forbids." Car L4 wrote the reader; the query it needs has been missing since.
 *
 * This is it. It filters a receipt set to the disclosure kinds, keeps only the rows
 * naming THIS soul, and returns them in a total order (tick, then kind, then axis) so
 * a reading is a property of the record SET and never of its arrival order — the same
 * guarantee `knownCharacterOf`'s own latest-wins fold makes one layer up.
 *
 * ⚠ A ROW WITH NO READABLE TICK IS DROPPED, NOT FILED AT ZERO. See `tickOrNull`.
 *
 * @param {Object} args
 * @param {ReadonlyArray<Record<string, unknown>>} [args.receipts]
 * @param {string} args.wnpcId  the durable identity the funnel stamps on every receipt
 * @returns {ReadonlyArray<Record<string, unknown>>} ready to hand to `knownCharacterOf`
 */
export function disclosuresFor({ receipts, wnpcId }) {
  const subject = str(wnpcId);
  if (!subject) return Object.freeze([]);
  const rows = asArray(receipts)
    .map((raw) => asObject(raw))
    .filter((row) => str(row.wnpcId) === subject
      && DISCLOSURE_KINDS.includes(str(row.kind))
      && tickOrNull(row.tick) !== null);
  return Object.freeze(rows.sort((a, b) => (
    (/** @type {number} */ (tickOrNull(a.tick)) - /** @type {number} */ (tickOrNull(b.tick)))
    || compareCodepoint(str(a.kind), str(b.kind))
    || compareCodepoint(str(a.axisId), str(b.axisId))
    || compareCodepoint(str(asArray(a.sourceEventIds)[0]), str(asArray(b.sourceEventIds)[0]))
  )));
}

/**
 * The reason clauses one receipt carries, from its bound evidence. Codepoint-stable
 * and deduplicated: two lessons of the same kind in one tick are one reason.
 * @param {Record<string, unknown>} row @returns {readonly string[]}
 */
export function reasonsOf(row) {
  const record = asObject(row);
  const clauses = asArray(record.sourceKinds)
    .map((kind) => EXPERIENCE_CLAUSES[str(kind)])
    .filter(Boolean);
  if (clauses.length === 0) {
    // An axis no lesson touched was moved by the homeward walk, and the crossing
    // receipt says so in its own cause field. Reading the CAUSE rather than assuming
    // decay is what keeps this honest when a future cause token arrives.
    const cause = str(asObject(record.crossing).cause);
    return cause === HOMEWARD_DECAY_CAUSE ? Object.freeze([DECAY_CLAUSE]) : Object.freeze([]);
  }
  return Object.freeze([...new Set(clauses)].sort(compareCodepoint));
}

/**
 * @typedef {Object} CharacterArticle
 * @property {string} action     an ARTICLE_ACTIONS member — the news address law's typed action
 * @property {readonly string[]} address  the address chain, outermost first, as given
 * @property {string} subject    the NAME (the law's "names"; never a pronoun, never an id)
 * @property {string} wnpcId
 * @property {string} axisId
 * @property {number} tick
 * @property {string} line       the sentence
 * @property {readonly string[]} reasons  the law's "reason" — clause per bound source kind
 * @property {readonly string[]} sourceEventIds  the evidence, carried through unchanged
 */

/**
 * @typedef {Object} ArticleRefusal
 * @property {string} reason  an ARTICLE_REFUSALS member
 * @property {string} action
 * @property {string} wnpcId
 * @property {string} axisId
 */

/**
 * ⭐ THE ARTICLES (§5, §7) — displacement, reversal and crossing, composed under the
 * news address law: ADDRESS CHAIN · TYPED ACTION · NAMES · REASON, all four present
 * on every article or the article is refused.
 *
 * The frames, and why each is shaped the way it is:
 *
 *   BAND CROSSING — "Aldric is now notably brave." A crossing INTO neutral has no
 *   pole to name, so it inverts to "Aldric is no longer brave", which is the same
 *   fact told the only way the vocabulary can tell it.
 *
 *   REVERSAL — "Where Aldric was brave, Aldric is now cowardly." §5's paradigm shift:
 *   a virtue curdling into ITS OWN vice, which is why both ends are named. Minted
 *   BESIDE its crossing by the funnel, so the pair is deliberate, not a duplicate.
 *
 *   DISPLACEMENT — "Aldric runs more wrathful now than brave." §5's own event, told
 *   with the vocabulary that exists (see the header's ruling on the noun forms).
 *
 * ⚠ THE CHART IS AN ARGUMENT, AND A DISPLACEMENT CANNOT BE TOLD WITHOUT IT. A
 * displacement receipt names two axes and NO bands — it says the composition moved,
 * which is a fact about the ordering rather than about either side. So the sides come
 * from the soul's chart, supplied the way GAP D supplies everything else: by the
 * caller, who holds it. Absent chart ⇒ the displacement is REFUSED as `no_word`,
 * never guessed. Guessing `virtue` would name half the town the opposite of what it is.
 *
 * @param {Object} args
 * @param {ReadonlyArray<Record<string, unknown>>} [args.receipts]
 * @param {string} args.wnpcId
 * @param {string} args.name                    the subject's name — REQUIRED by the address law
 * @param {readonly string[]} [args.address]    the address chain, outermost first
 * @param {Record<string, number>} [args.chart] the soul's chart, for the displacement frame
 * @param {(position: {axisId: string, pole?: string, level?: string}) => unknown} [args.project]
 * @returns {Readonly<{articles: readonly CharacterArticle[], refusals: readonly ArticleRefusal[]}>}
 */
export function characterArticles({ receipts, wnpcId, name, address, chart, project }) {
  const word = projector(project);
  const subject = str(wnpcId);
  const who = str(name).trim();
  const chain = Object.freeze(asArray(address).map(str).filter(Boolean));
  /** @type {CharacterArticle[]} */
  const articles = [];
  /** @type {ArticleRefusal[]} */
  const refusals = [];
  /** @param {string} reason @param {Record<string, unknown>} row */
  const refuse = (reason, row) => {
    refusals.push(Object.freeze({
      reason, action: str(row.kind), wnpcId: str(row.wnpcId), axisId: str(row.axisId),
    }));
  };

  for (const raw of asArray(receipts)) {
    const row = asObject(raw);
    if (str(row.wnpcId) !== subject) continue;
    const action = str(row.kind);
    if (!ARTICLE_ACTIONS.includes(action)) { refuse('unknown_action', row); continue; }
    const axisId = str(row.axisId);
    if (!axisId) { refuse('no_axis', row); continue; }
    if (!who) { refuse('no_name', row); continue; }
    if (typeof project !== 'function') { refuse('no_projection', row); continue; }
    const tick = tickOrNull(row.tick);
    if (tick === null) { refuse('no_tick', row); continue; }

    const line = compose({ action, row, axisId, who, word, chart: asObject(chart) });
    if (!line) { refuse('no_word', row); continue; }
    articles.push(Object.freeze({
      action,
      address: chain,
      subject: who,
      wnpcId: subject,
      axisId,
      tick,
      line,
      reasons: reasonsOf(row),
      sourceEventIds: Object.freeze(asArray(row.sourceEventIds).map(str).filter(Boolean)),
    }));
  }
  articles.sort((a, b) => a.tick - b.tick
    || compareCodepoint(a.action, b.action)
    || compareCodepoint(a.axisId, b.axisId));
  return Object.freeze({ articles: Object.freeze(articles), refusals: Object.freeze(refusals) });
}

/**
 * One sentence, or '' when the vocabulary cannot supply one.
 * @param {Object} args
 * @param {string} args.action @param {Record<string, unknown>} args.row
 * @param {string} args.axisId @param {string} args.who
 * @param {(position: {axisId: string, pole?: string, level?: string}) => string} args.word
 * @param {Record<string, unknown>} args.chart
 * @returns {string}
 */
function compose({ action, row, axisId, who, word, chart }) {
  if (action === 'displacement') {
    const passed = str(row.overtook);
    if (!passed) return '';
    // BOTH ends are named, so both must be nameable — a half-named displacement
    // ("runs more wrathful now") loses the entire comparison the event IS.
    const rising = wordOnChart(word, axisId, chart);
    const fallen = wordOnChart(word, passed, chart);
    if (!rising || !fallen) return '';
    return `${who} runs more ${rising} now than ${fallen}.`;
  }
  const crossing = asObject(row.crossing);
  const from = bandParts(crossing.from);
  const to = bandParts(crossing.to);
  if (action === 'reversal') {
    const was = from.pole ? word({ axisId, pole: from.pole, level: from.level }) : '';
    const now = to.pole ? word({ axisId, pole: to.pole, level: to.level }) : '';
    if (!was || !now) return '';
    return `Where ${who} was ${was}, ${who} is now ${now}.`;
  }
  // band_crossing
  if (!to.pole) {
    const was = from.pole ? word({ axisId, pole: from.pole, level: from.level }) : '';
    return was ? `${who} is no longer ${was}.` : '';
  }
  const now = word({ axisId, pole: to.pole, level: to.level });
  const adverb = LEVEL_PHRASES[to.level] || '';
  if (!now || !adverb) return '';
  return `${who} is now ${adverb} ${now}.`;
}

/**
 * A word for one axis AS THE CHART HOLDS IT — the displacement case, where the
 * receipt names two axes and no bands at all.
 *
 * ⚠ TYPE-TESTED, NOT VALUE-TESTED, and a mutation plant MEASURED what that is worth —
 * which is not what this comment first claimed. For an axis the chart simply does not
 * carry, both forms refuse alike (`Number(undefined) || 0` is neutral, and a neutral
 * band has no pole), so the type test buys nothing there and saying otherwise was an
 * overclaim. What it actually buys is the case a numeric guard reads and this one
 * refuses: a chart whose axis value is NOT A NUMBER — a serialized `'-3'`, a
 * `{ pole, level }` object handed to the wrong door. `Number('-3')` is a perfectly
 * good −3, so a numeric guard would name the man wrathful on the strength of a string
 * nobody promised was a chart value. That is §711.6's family — a field whose TYPE is
 * assumed at one consumer — and it is pinned below rather than asserted here.
 * @param {(position: {axisId: string, pole?: string, level?: string}) => string} word
 * @param {string} axisId @param {Record<string, unknown>} chart
 * @returns {string}
 */
function wordOnChart(word, axisId, chart) {
  const value = chart[axisId];
  if (typeof value !== 'number' || !Number.isFinite(value)) return '';
  const { pole, level } = bandParts(bandWordOf(value));
  if (!pole) return '';
  return word({ axisId, pole, level });
}

/**
 * @typedef {Object} BiographyEntry
 * @property {number} tick
 * @property {string} axisId
 * @property {string} action
 * @property {readonly string[]} reasons
 * @property {string} band
 */

/**
 * ⭐⭐ GAP D — "Biography is a query, not a store."
 *
 * The life story as a DERIVED READ over the receipts that name a person, in the
 * order they happened. Nothing is stored, nothing is fetched, and the receipt set is
 * an argument for exactly the reason `knownCharacterOf`'s is.
 *
 * `marks` is the sentence GAP D writes out — "hardened by the sack, the failed
 * mission, a year in a cruel city" — built from the reason clauses alone, deduplicated
 * across the whole life and kept in the order they first arrive, because a biography
 * is chronological and a set is not.
 *
 * @param {Object} args
 * @param {ReadonlyArray<Record<string, unknown>>} [args.receipts]
 * @param {string} args.wnpcId
 * @returns {Readonly<{entries: readonly BiographyEntry[], marks: readonly string[], lived: boolean}>}
 */
export function biographyOf({ receipts, wnpcId }) {
  const rows = disclosuresFor({ receipts, wnpcId });
  /** @type {BiographyEntry[]} */
  const entries = [];
  /** @type {string[]} */
  const marks = [];
  const seen = new Set();
  for (const raw of rows) {
    const row = asObject(raw);
    const reasons = reasonsOf(row);
    entries.push(Object.freeze({
      tick: /** @type {number} */ (tickOrNull(row.tick)),
      axisId: str(row.axisId),
      action: str(row.kind),
      reasons,
      band: str(asObject(row.crossing).to),
    }));
    for (const clause of reasons) {
      if (seen.has(clause)) continue;
      seen.add(clause);
      marks.push(clause);
    }
  }
  return Object.freeze({
    entries: Object.freeze(entries),
    marks: Object.freeze(marks),
    // Whether the world marked this person AT ALL — the same distinction the F6
    // legacy record draws, asked of the record instead of the store.
    lived: entries.length > 0,
  });
}

/**
 * ⭐ THE DOSSIER SURFACE (§7). One block, and the sight ruling is ROUTED rather than
 * re-decided: the chart comes from `characterAsSeenBy`, car L4's one seam, so this
 * file learns no second vocabulary for who may see what.
 *
 * ⚠ THE VIEWER DEFAULTS TO MORTAL — the fail-closed direction. `knownCharacter.js`
 * states the rule for its own seam ("sight is a privilege, so the failure direction
 * is toward less of it, never more") and a dossier that defaulted to true sight
 * would hand a caller who forgot the argument the one thing the whole feature exists
 * to withhold.
 *
 * @param {Object} args
 * @param {string} [args.viewer]  a SIGHT_VIEWERS member; anything else reads as mortal
 * @param {{character?: unknown}} args.npc
 * @param {Record<string, {offset: number, updatedTick: number}>|null} [args.drift]
 * @param {ReadonlyArray<Record<string, unknown>>} [args.receipts]
 * @param {string} args.wnpcId
 * @param {string} [args.name]
 * @param {Record<string, unknown>} [args.worldState]
 * @param {string} [args.subjectNpcKey]
 * @param {{character?: unknown}|null} [args.observer]
 * @param {Record<string, {offset: number, updatedTick: number}>|null} [args.observerDrift]
 * @param {number} [args.tick]
 * @param {Readonly<Record<string, boolean>>} [args.flags]
 * @param {(position: {axisId: string, pole?: string, level?: string}) => unknown} [args.project]
 * @returns {Readonly<{viewer: string, positions: readonly ReadPosition[], lead: string,
 *   biography: ReturnType<typeof biographyOf>, subject: string}>}
 */
export function characterDossier({
  viewer, npc, drift, receipts, wnpcId, name, worldState, subjectNpcKey,
  observer, observerDrift, tick, flags, project,
}) {
  const disclosures = disclosuresFor({ receipts, wnpcId });
  const character = characterAsSeenBy({
    viewer: str(viewer),
    npc,
    drift,
    disclosures,
    worldState,
    subjectNpcKey,
    observer,
    observerDrift,
    tick,
    flags,
  });
  const positions = readPositions({ chart: chartValuesOf(character), project });
  return Object.freeze({
    viewer: str(viewer),
    positions,
    lead: leadLine(positions),
    biography: biographyOf({ receipts, wnpcId }),
    // Carried so a surface can say WHOSE reading it is showing without a second call.
    subject: str(name),
  });
}

/**
 * Provenance, in the module, car L1's idiom. Everything authored in this file is a
 * CANDIDATE register: two vocabularies (the three level phrases, the thirty reason
 * clauses) and four sentence frames, none of them signed.
 * @type {Readonly<{status: string, signedBy: string|null, ownerRows: readonly string[], consumers: string}>}
 */
export const CHARACTER_READ_PROVENANCE = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (two vocabularies and four frames; nothing here is taste the pen has ruled)',
  signedBy: null,
  ownerRows: Object.freeze([
    'THE THIRTY REASON CLAUSES: one per teaching kind. They are the reader-facing name of every experience the funnel can bind, and they are this car\'s largest authored surface',
    'THE THREE LEVEL PHRASES (a little / notably / above all): the only adverbs the read model owns',
    '⚠ THE FOUR FRAMES, and the ruling behind them: §5 illustrates a displacement with NOUNS ("bitterness has overtaken his patience") and car L1\'s catalog carries only ADJECTIVES, whose nominalization is irregular. The frames are adjectival. Signing the noun forms would mean a 34-row second vocabulary for one sentence shape',
    'whether a crossing INTO neutral is news at all. Today it is told as "no longer X", which is a real event and the only one the vocabulary can name from a band with no pole',
    'whether the dossier\'s default viewer stays MORTAL (fail-closed) on a surface whose reader is the DM',
  ]),
  consumers: 'NONE in production by design. No caller runs the funnel, so no receipt exists to read; the herald registration is priced in CHARACTER_NEWS_REGISTRATION_SEAM and deliberately not taken',
});

/**
 * The kinds this file owes a clause for — the catalog's own roster minus the silent
 * kind, computed rather than transcribed so a new kind cannot be added to the catalog
 * without the totality test noticing.
 * @type {readonly string[]}
 */
export const CLAUSED_KINDS = Object.freeze(
  LIVED_EXPERIENCE_KINDS.filter((kind) => kind !== SILENT_EXPERIENCE_KIND),
);

/** Re-exported so a reader of this file can see the neutral rung's name without
 *  learning where the ladder lives. */
export { NEUTRAL_BAND };
