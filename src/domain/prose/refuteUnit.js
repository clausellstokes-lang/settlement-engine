/**
 * domain/prose/refuteUnit.js — THE TIER-0 REFUTER AS A LIBRARY (W1 deliverable 1;
 * DESIGN_SCRIBE_GENERATION_TIME_PROSE §4, §5b).
 *
 * WHAT THIS IS. The programme already owns most of its refuter as pure code — `moveGrammar.js`,
 * `composedWalker.js`, `entryWalker.js`, `holderTable.js`, the voice suites. What it does NOT
 * own is ONE CALL that runs all of them over ONE unit with ONE ground and returns ONE verdict.
 * At the gate that gap is filled by a test file. At generation time there is no test file: a
 * model returns a unit and something has to say FAIL, WITHHELD or PASS in milliseconds, on a
 * server, with no census on disk. This is that something.
 *
 * ── ⭐⭐ THE GROUND IS THE TOWN CARD, AND THAT IS THE WHOLE POINT (design §4) ────────
 * The corpus walkers judge a variant against the ESTATE — what is true of every town that could
 * draw the line — because the author did not know which town would draw it. The Scribe writes
 * for ONE town whose card is in hand, so floor 1 stops being an inference over a preimage and
 * becomes a LOOKUP AGAINST A FINITE LIST: the roles this town seats, the institutions it holds,
 * the records those institutions keep, the fields its pools read and the VALUES those fields
 * carry. `groundOfCard` is that collapse, and every card-grounded arm below reads it.
 *
 * ── ⛔ NOT-EXECUTABLE IS A CHANNEL, NEVER A PASS (the §908 law) ─────────────────────
 * An arm whose INPUT is absent says so and names the input. It never answers `[]` and reads as
 * a pass, and it never manufactures a FAIL to look thorough. Three grounds are named on every
 * arm in `REFUTE_ARMS` so a reader can tell at a glance what a partial verdict is partial ON:
 *   `text`   the arm needs the unit's own string and nothing else;
 *   `card`   the arm needs the town card, and declares NOT-EXECUTABLE without the section it reads;
 *   `input`  the arm needs something neither carries (the corpus unit, the epoch delta, the
 *            settlement's own impairments) and declares NOT-EXECUTABLE until a caller brings it.
 *
 * ── ⛔⛔ WHAT NO TIER-0 ARM CAN CATCH, SAID PLAINLY RATHER THAN FAKED ────────────────
 * The power leaf's claim-freeze audit (`rewrite/clarity-audit-POW.md`) classed its 32 moved
 * claims as CERTAINTY 11 · scope 5 · added fact 5 · dropped fact 5 · quantity 4 · tense 2. Of
 * those six classes, tier 0 reaches the ones with a lexical or a structural signature and CANNOT
 * reach three of them:
 *   CERTAINTY  a hedge made absolute ("thinks well of" for "thinks well enough of"). Both
 *              sentences are grammatical, both name the same field, both classify to the same
 *              move. The difference is a proposition, and settling it needs the card read AS
 *              MEANING, which is tier 1.
 *   QUANTIFIER a bound narrowed or widened ("the names below" for "the names immediately
 *              below"). `armC4` catches a TOTALITY over an OPEN column, which is a different
 *              fault; a bound that is merely WRONG is not a totality and has no shape.
 *   SCOPE      the same claim moved onto a wider or narrower subject (the town for the room,
 *              everything for the rhythm). The referent scan catches a subject the card does
 *              not SEAT; it cannot catch a subject the card seats and the claim does not fit.
 * No arm below pretends to these. They are the reason tier 1 exists, and the pilot measures what
 * share of the residual they are.
 *
 * ── THE REUSE RULE: LIFTED, NEVER RE-SPELLED ───────────────────────────────────────
 * Every arm that already exists is CALLED, not re-implemented: `walkComposed` runs A1, A2, A3,
 * A13, Thread, Tail, Aspect, Restatement and Ambiguity plus the whole entry walk (C1..C6, D, Q,
 * X, F25, W) in one call, so the brief's equality pin against the walker is true BY
 * CONSTRUCTION rather than by a second implementation agreeing with the first. A5 and A6 are
 * called beside it because the walk does not run them. The two lists this module does own —
 * the mechanical bars and the setting-agnostic tells — are LIFTED from their suites and pinned
 * source-for-source by `tests/domain/refuteUnit.test.js`, because those suites are test files
 * and a domain leaf may not import one.
 *
 * PURE and HEADLESS: no clock, no RNG, no store, no file system, no DOM, no settlement import.
 *
 * @enforced-by tests/domain/refuteUnit.test.js
 */
import {
  armA5, armA6, armC7, composedVerdictOf, emptyResult, mergeResults, provenanceCount,
  walkComposed,
} from './composedWalker.js';
import { classifyMoves, LEVEL1_ORDERS, NON_MOVES, orderIdOf } from './moveGrammar.js';
import { sentencesOf, walkPair, closeKindOf } from './entryWalker.js';
import { CONTRAST_SHAPES, OFFICE_NOUN_CANDIDATES } from './entryLexicons.js';
import { fieldSynonymsFor } from './fieldSynonyms.js';
import {
  HOLDER_RECORDS, INTERESTED, sourceOfForTown, sourceOfRow,
} from './holderTable.js';
import { openerOf } from './grammarWalker.js';
import { presenceOf } from './presenceMeasure.js';
import { compareCodepoint } from '../deterministicSort.js';

/**
 * ⭐ THE MECHANICAL BARS, one named arm each.
 *
 * PROVENANCE OF EACH ROW, because a bar asserted from memory is a bar the estate cannot argue
 * with. The first three are the E2 ratchet's own and red the build today
 * (`tests/copy/voiceMechanics.test.js`, quoted by the v3 gate prompt verbatim: "an em dash, a
 * bang or a digit in a face"). The last four are THE VOICE's own mechanical rules, quoted from
 * `rewrite/rewrite-block-v3.workflow.js`'s `VOICE` constant: "no contractions, no slang, no
 * barroom idiom"; "the clerks never speak in the first person"; the future indicative, which
 * `NON_MOVES.FORECAST` also hunts and which is named here so a bare `will` on a unit with no
 * other fault still reports under its own name; and the semicolon, which the VOICE bars in the
 * same breath as the em dash.
 *
 * ⛔ THE CONTRACTION BAR READS AN APOSTROPHE FOLLOWED BY A CONTRACTED TAIL AND NOT A BARE
 * APOSTROPHE. A possessive is the corpus's most common shape ("the town's own") and a bar that
 * convicted it would refuse nearly every unit the corpus ships, which is a bar that gets turned
 * off rather than a bar that holds.
 * @type {ReadonlyArray<{arm: string, re: RegExp, why: string}>}
 */
export const VOICE_BARS = Object.freeze([
  Object.freeze({ arm: 'BAR-emdash', re: /—/, why: 'an em dash: the E2 ratchet holds every face at hard zero' }),
  Object.freeze({ arm: 'BAR-bang', re: /!/, why: 'an exclamation mark: the E2 ratchet holds every face at hard zero' }),
  Object.freeze({ arm: 'BAR-digit', re: /\d/, why: 'a digit: a face states a band in words, never a figure' }),
  Object.freeze({ arm: 'BAR-semicolon', re: /;/, why: 'a semicolon: the VOICE bars it with the em dash' }),
  Object.freeze({
    arm: 'BAR-contraction',
    re: /\b(?:[a-z]+n|[a-z]+)['’](?:t|s|re|ve|ll|d|m)\b(?<!\b[a-z]+['’]s)|\b(?:do|does|did|is|are|was|were|has|have|had|would|could|should|will|can|ai|wo)n['’]t\b/i,
    why: 'a contraction: the VOICE asks for the exact common word in a professional hand',
  }),
  Object.freeze({
    arm: 'BAR-first-person',
    re: /\b(?:I|we|us|our|ours|my|mine|me)\b/,
    why: 'the first person: the archiver reports and the clerks are reported, so no face speaks as itself',
  }),
  Object.freeze({
    arm: 'BAR-future',
    re: /\b(?:will|shall)\b(?!\s+(?:not\s+)?(?:have\s+)?been\b)/i,
    why: 'a bare future indicative: no field says what comes next, and a forecast is a FATE breach anywhere',
  }),
]);

/**
 * ⭐ THE SETTING-AGNOSTIC TELL BAN, LIFTED VERBATIM from `tests/copy/voiceMechanics.test.js`'s
 * `AGNOSTIC_TELLS` (TE-AGNOSTIC-1 / ODQ §857).
 *
 * ⛔ LIFTED, AND PINNED SOURCE-FOR-SOURCE. A domain leaf may not import a test file, so the five
 * rows are copied here and `tests/domain/refuteUnit.test.js` reads the suite's own source text
 * and asserts every regex below is byte-identical to the one it was taken from. A copy that can
 * drift silently is worse than no copy; a copy a test re-derives from the original is a second
 * READER of one list.
 *
 * ⛔ THE QUARANTINE DOES NOT TRAVEL. `AGNOSTIC_TELLS_DEFERRED` exempts seven SOURCE FILES whose
 * institution keys are pinned by name elsewhere. A model's generated prose is not one of those
 * files and inherits no exemption, so the ban here is absolute.
 * @type {ReadonlyArray<{name: string, re: RegExp}>}
 */
export const AGNOSTIC_TELLS = Object.freeze([
  Object.freeze({ name: 'currency GP', re: /\b\d[\d,]*\s*GP\b|\bGP\/|\bGP\b(?=\s*(?:per|a session|\)))/ }),
  Object.freeze({ name: 'spell-level scale', re: /\b\d+(?:st|nd|rd|th)[- ]level\b/i }),
  Object.freeze({ name: 'item plus', re: /\+\d+\s+(?:weapons?|armou?rs?|swords?|shields?)\b/i }),
  Object.freeze({ name: 'named spell', re: /\b(?:Cure Wounds|Cure light wounds|Plant Growth|Speak with Animals|Detect Poison|Detect Thoughts|Purify Food|Create Food and Water|Pass Without Trace|Magic Mouth|Continual Flame)\b/ }),
  Object.freeze({ name: 'named spell (no ordinary reading)', re: /\b(?:zone of truth|sending stones?|lesser restoration|greater restoration|goodberry|prestidigitation|transmute rock|conjure animals|glyph of warding|mage hand)\b/i }),
]);

/**
 * ⭐ THE PROSE-LEAK CLASSES, LIFTED from `tests/copy/proseLeak.test.js`'s `DETECTORS` and pinned
 * the same way.
 *
 * ⛔ `flagKey` IS A SET AND NOT A REGEX, and the set is built LIVE from `DEFAULT_SIMULATION_RULES`
 * plus every preset so a new flag joins the ban without an edit. That import is the ONE reach
 * this module makes outside `domain/prose`, and it is the same reach the suite makes: the flag
 * names are the engine's own and transcribing them would create a list that goes stale the next
 * time a rule lands. `emDash` is deliberately ABSENT: it is `BAR-emdash` above, and one
 * violation asserted twice under two names is two budgets nobody can reconcile.
 * @type {ReadonlyArray<{name: string, re: RegExp}>}
 */
export const LEAK_CLASSES = Object.freeze([
  Object.freeze({ name: 'tick', re: /\btick\s+\d+/gi }),
  Object.freeze({ name: 'week', re: /\bweek\s+\d+\b(?!\s+of\s+\d)/gi }),
  Object.freeze({ name: 'schema', re: /\b(?:shortGoal|longGoal|goalProgress|roleArchetype|candidateType|ruleId|sourceEventId|impactKind|channelType|dramaClass|targetSaveId|settlementIds|pulseHistory|wizardNews|proposalPayload|applyMode)\b/g }),
  Object.freeze({ name: 'rawId', re: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b|\bnpc_\d+\b|\bgenerated_[A-Za-z0-9_]+\b|\b(?:candidate|npc_ladder|realm_verb)\.[A-Za-z0-9_.]+/gi }),
]);

/**
 * ⭐ THE ELAPSED-COURSE SHAPES (design §5b's floor 2, "the notebook may say 'since the last
 * survey' only over a field the delta names"). Each is a clause that asserts TIME HAS PASSED
 * and something MOVED, which on epoch 0 is a claim about a history the card does not hold.
 * @type {RegExp}
 */
export const ELAPSED_COURSE = /\b(?:since the last (?:survey|reckoning|count|visit)|since then|in the (?:years|seasons|months) since|no longer|has (?:grown|fallen|risen|shrunk|worsened|improved|slipped|recovered)|have (?:grown|fallen|risen|shrunk|worsened|improved|slipped|recovered)|used to|once (?:did|was|were|held|kept)|these days|of late|lately|nowadays|where it (?:once|used to))\b/i;

/**
 * ⭐ THE PROVENANCE CLAUSE, TAKEN FROM `moveGrammar.js`'s OWN DETECTOR. The classifier's
 * `CLAUSE_DETECTORS` row for PROVENANCE is not exported as a value, so the alternation is
 * spelled here once and `tests/domain/refuteUnit.test.js` pins it source-for-source against
 * that row exactly as it pins the tell ban. The vocabulary is the holder table's TWELVE KINDS
 * and nothing wider, which is the narrowing SITTING §R c-16 made and the reason a bare `the
 * records say` is not read as a citation.
 * @type {RegExp}
 */
export const PROVENANCE_CLAUSE = /\b(the (?:treasury|watch|parish|market|court|census|office)(?:'s)? (?:books|roll|rolls|register|registers|count|ledger|ledgers)|the (?:muster|toll) (?:roll|rolls|books|register)|the elders (?:say|hold|remember|keep)|the tradition (?:says|holds|remembers|keeps)|from the road)\b/gi;

/**
 * ⭐ THE ROLE SLOTS, RE-SPELLED FROM `stateProseKernel.js`'s `ROLE_SLOTS` (`FACE_SOURCES` minus
 * `ARCHIVER_SOURCE`) and pinned equal by the suite, the same discipline as the tell ban.
 *
 * ⛔ WHY THIS LIST EXISTS AT ALL, AND THE GAP IT RECORDS. Arm A6 rules that a face's slot set is
 * a SUBSET of its parent's, because the fills are the spine's and a face naming a slot the bag
 * does not fill would silence the rung. That is true of FILL slots and FALSE of ROLE slots: a
 * `{elders}`-shaped slot is filled by `drawRole` off the face's own SOURCE tag, not out of the
 * spine's bag, so a face may lawfully name one its spine never does. MEASURED: with role slots
 * in the comparison, 30 of 264 landed DS-DEF-2 units convict, every one of them lawful. The gate
 * never met this because `tests/lint/proseComposed.walker.test.js` exercises A6 on four
 * synthetic strings and over no shipped face at all. REPORTED to the chair as a gap in A6's
 * documented rule; this module works around it rather than editing the arm, which would move a
 * gate the whole corpus is judged by.
 * @type {ReadonlyArray<string>}
 */
export const ROLE_SLOT_WORDS = Object.freeze([
  'stranger', 'elders', 'hall', 'tavern', 'guild', 'register',
  'muster', 'watch', 'garrison', 'gate', 'market', 'court', 'public',
]);

/** A text with its ROLE and VERB slot markers removed, so A6 compares fill slots only. */
const withoutRoleSlots = (text) => String(text || '')
  .replace(new RegExp(`\\{(?:${ROLE_SLOT_WORDS.join('|')}|v:[a-z]+)\\}`, 'g'), '');

/** The named seasons the calendar can hold, for the epoch scan's calendar limb. */
const SEASONS = Object.freeze(['spring', 'summer', 'autumn', 'winter', 'harvest']);

/** The three grounds an arm can stand on. See the header. */
const GROUND_TEXT = 'text';
const GROUND_CARD = 'card';
const GROUND_INPUT = 'input';

/**
 * ⭐⭐ THE ARM ROSTER — every limb this module runs, with the ground it stands on, so a caller
 * can tell a partial verdict from a whole one without reading the code.
 * @type {ReadonlyArray<{arm: string, ground: string, note: string}>}
 */
export const REFUTE_ARMS = Object.freeze([
  Object.freeze({ arm: 'BAR-emdash', ground: GROUND_TEXT, note: 'the E2 hard zero' }),
  Object.freeze({ arm: 'BAR-bang', ground: GROUND_TEXT, note: 'the E2 hard zero' }),
  Object.freeze({ arm: 'BAR-digit', ground: GROUND_TEXT, note: 'the E2 hard zero' }),
  Object.freeze({ arm: 'BAR-semicolon', ground: GROUND_TEXT, note: 'the VOICE' }),
  Object.freeze({ arm: 'BAR-contraction', ground: GROUND_TEXT, note: 'the VOICE' }),
  Object.freeze({ arm: 'BAR-first-person', ground: GROUND_TEXT, note: 'the VOICE' }),
  Object.freeze({ arm: 'BAR-future', ground: GROUND_TEXT, note: 'the VOICE, and NON_MOVES.FORECAST beside it' }),
  Object.freeze({ arm: 'TELL', ground: GROUND_TEXT, note: 'five detectors, lifted from the E2 tell ban' }),
  Object.freeze({ arm: 'LEAK', ground: GROUND_TEXT, note: 'five classes, lifted from E1; flagKey is a live set' }),
  Object.freeze({ arm: 'NON-MOVE', ground: GROUND_TEXT, note: 'six detectors: FORECAST MEANING VERDICT FEELING FIGURE SAYING' }),
  Object.freeze({ arm: 'ORDER', ground: GROUND_TEXT, note: 'a SPINE must realise a LEVEL1 order' }),
  Object.freeze({ arm: 'WALL-5', ground: GROUND_CARD, note: 'CONTRAST needs a sibling pool key or band naming the rejected alternative' }),
  Object.freeze({ arm: 'WALL-6', ground: GROUND_TEXT, note: 'QUALIFY never as a which-tail, never a third sentence' }),
  Object.freeze({ arm: 'WALL-10', ground: GROUND_CARD, note: 'the settlement token opens at most one face per pool, never two adjacent' }),
  Object.freeze({ arm: 'A1', ground: GROUND_TEXT, note: 'a fact said twice across pieces; via walkComposed' }),
  Object.freeze({ arm: 'A2', ground: GROUND_INPUT, note: 'the relation table; NOT-EXECUTABLE without it' }),
  Object.freeze({ arm: 'A3', ground: GROUND_INPUT, note: 'the primary/field readers; NOT-EXECUTABLE without them' }),
  Object.freeze({ arm: 'A5', ground: GROUND_TEXT, note: 'four synonym swaps across the faces' }),
  Object.freeze({ arm: 'A6', ground: GROUND_TEXT, note: 'a face names a slot or a mark its parent does not' }),
  Object.freeze({ arm: 'A13', ground: GROUND_CARD, note: 'the cited holder, resolved through the card institutions; the INTERESTED limb reads card.town.holders, or the settlement when one is given' }),
  Object.freeze({ arm: 'Tail', ground: GROUND_TEXT, note: 'R-DA-03; via walkComposed' }),
  Object.freeze({ arm: 'Aspect', ground: GROUND_TEXT, note: 'a forecast or perfect on a standing fact; via walkComposed' }),
  Object.freeze({ arm: 'Restatement', ground: GROUND_TEXT, note: 'via walkComposed' }),
  Object.freeze({ arm: 'Ambiguity', ground: GROUND_TEXT, note: 'the one arm that moves a verdict to WITHHELD; via walkComposed' }),
  Object.freeze({ arm: 'Thread', ground: GROUND_TEXT, note: 'REPORT only; via walkComposed' }),
  Object.freeze({ arm: 'C1', ground: GROUND_CARD, note: 'via walkEntry on the card ground' }),
  Object.freeze({ arm: 'C2', ground: GROUND_CARD, note: 'via walkEntry on the card ground' }),
  Object.freeze({ arm: 'C3', ground: GROUND_CARD, note: 'a historical claim on a state-only field; eventProvenance derived from the pool reads' }),
  Object.freeze({ arm: 'C4', ground: GROUND_CARD, note: 'a totality over an open column; persons are never closed' }),
  Object.freeze({ arm: 'C5', ground: GROUND_CARD, note: 'sibling contradiction inside the pool, from the card faces' }),
  Object.freeze({ arm: 'C6', ground: GROUND_INPUT, note: 'the join edges; the card carries none, so NOT-EXECUTABLE' }),
  Object.freeze({ arm: 'D', ground: GROUND_CARD, note: 'the slot census from the card fills' }),
  Object.freeze({ arm: 'Q', ground: GROUND_CARD, note: 'a qualifier licensed by a SECOND typed field, from the card reads' }),
  Object.freeze({ arm: 'X', ground: GROUND_CARD, note: 'exhaustivity over the card office and institution columns' }),
  Object.freeze({ arm: 'F25', ground: GROUND_CARD, note: 'via walkEntry on the card ground' }),
  Object.freeze({ arm: 'W', ground: GROUND_INPUT, note: 'the wiring row; the static card carries status only, so the predicate limb is NOT-EXECUTABLE' }),
  Object.freeze({ arm: 'REFERENT-role', ground: GROUND_CARD, note: 'every office noun in the text must be a role the card seats, an institution it holds or a body it names; floor 1' }),
  Object.freeze({ arm: 'REFERENT-body', ground: GROUND_CARD, note: 'every record cited must have a holder in the card roster or a named body that keeps it; floor 1' }),
  Object.freeze({ arm: 'CORPUS-DIFF', ground: GROUND_INPUT, note: 'a move ADDED, or a LEVEL1 order lost on a spine; needs the corpus unit' }),
  Object.freeze({ arm: 'EPOCH', ground: GROUND_CARD, note: 'elapsed-course language over an epoch the card does not hold' }),
  Object.freeze({ arm: 'CLARITY', ground: GROUND_TEXT, note: 'REPORT only: the three clarity-sweep proxy limbs' }),
  Object.freeze({ arm: 'MEASURE', ground: GROUND_TEXT, note: 'REPORT only: opener, segments, close kind, presence, sibling overlap' }),
]);

// ── the finding shape, shared by every arm ──────────────────────────────────────────

/**
 * One finding. The composed walker's row shape, so a caller sorting a mixed list never has to
 * ask which walker produced a row.
 * @typedef {object} RefuteFinding
 * @property {string} id
 * @property {string} arm
 * @property {'FAIL'|'WITHHELD'|'REPORT'|'NOT-EXECUTABLE'} channel
 * @property {string} subject
 * @property {string} value
 * @property {string} description
 */

/** @param {string} id @param {string} arm @param {string} channel @param {string} subject
 * @param {string} value @param {string} description @returns {RefuteFinding} */
function finding(id, arm, channel, subject, value, description) {
  return {
    id, arm, channel, subject, value, description,
  };
}

/**
 * ⛔ THE ENTRY ROW'S OWN `value` COLUMN IS CARRIED INTO THE DESCRIPTION, and losing it was a real
 * loss rather than a tidiness. The entry walker's finding has SEVEN fields and this module's has
 * six, and the field that had no home was `value` — which on arm Q is exactly the audit trail the
 * arm exists to leave: `reads [<the field paths>]; none claimed`. Without it a reader of a Q
 * WITHHELD cannot tell whether the arm was short of a column or the line was short of a fact,
 * which is the distinction `armQualify`'s own comment says the row is there to preserve.
 * @param {{description: string, value?: unknown}} f @returns {string}
 */
const entryWhy = (f) => (str(f.value) ? `${str(f.description)} (${str(f.value)})` : str(f.description));

/** @param {object} out @param {RefuteFinding} rowValue */
function emit(out, rowValue) {
  if (rowValue.channel === 'FAIL') out.fails.push(rowValue);
  else if (rowValue.channel === 'WITHHELD') out.withheld.push(rowValue);
  else if (rowValue.channel === 'REPORT') out.reports.push(rowValue);
  else out.notExecutable.push(rowValue);
}

// ── the unit, and the card ground ───────────────────────────────────────────────────

/** @param {unknown} value @returns {string} */
const str = (value) => (typeof value === 'string' ? value : String(value ?? ''));

/**
 * The card's row for one pool, by block and key. The card's `pools` is in PAGE ORDER and not
 * keyed, because page order is a fact; this is the lookup that costs.
 * @param {object} card @param {string} blockId @param {string} poolKey @returns {object|null}
 */
export function poolOfCard(card, blockId, poolKey) {
  const pools = Array.isArray(card?.pools) ? card.pools : [];
  return pools.find((p) => str(p.blockId) === blockId && str(p.poolKey) === poolKey) || null;
}

/**
 * ⭐ THE UNIT AS THE WALKERS READ IT. The Scribe returns `{stance, source, pair, text}` per the
 * design's §3.2 schema; the composed walkers read a `ComposedUnitRow` with `pieces`. A unit that
 * brings its own pieces keeps them; a bare one is seated as its own spine, which is the shape
 * every shipped pool has today (one spine, no modifier).
 * @param {{text: string, stance?: string, source?: string, pair?: string,
 *   blockId?: string, poolKey?: string, marks?: ReadonlyArray<string>,
 *   slots?: ReadonlyArray<string>, faces?: ReadonlyArray<string>,
 *   pieces?: ReadonlyArray<object>}} unit
 * @param {object} [card]
 * @returns {object} a ComposedUnitRow
 */
export function unitRowOf(unit, card) {
  const u = unit && typeof unit === 'object' ? unit : {};
  const blockId = str(u.blockId);
  const poolKey = str(u.poolKey);
  const text = str(u.text);
  const pieces = Array.isArray(u.pieces) && u.pieces.length
    ? u.pieces.map((p) => ({
      role: str(p?.role) || 'spine',
      key: str(p?.key) || poolKey,
      text: str(p?.text),
      marks: Array.isArray(p?.marks) ? [...p.marks] : [],
      slots: Array.isArray(p?.slots) ? [...p.slots] : [],
    }))
    : [{
      role: 'spine',
      key: poolKey,
      text,
      marks: Array.isArray(u.marks) ? [...u.marks] : [],
      slots: Array.isArray(u.slots) ? [...u.slots] : [],
    }];
  const known = card ? poolOfCard(card, blockId, poolKey) : null;
  return {
    id: `${blockId} :: ${poolKey}`,
    blockId,
    poolKey,
    text,
    pieces,
    mount: known ? str(known.mount) : '',
  };
}

/** Every role the card seats, anywhere, lower-cased and sorted. @param {object} card @returns {string[]} */
export function seatedRolesOf(card) {
  /** @type {Set<string>} */
  const held = new Set();
  for (const seat of (Array.isArray(card?.town?.roles) ? card.town.roles : [])) {
    for (const line of (Array.isArray(seat?.roster) ? seat.roster : [])) {
      if (str(line?.role)) held.add(str(line.role).toLowerCase());
    }
  }
  for (const pool of (Array.isArray(card?.pools) ? card.pools : [])) {
    for (const seat of (Array.isArray(pool?.faceRoles) ? pool.faceRoles : [])) {
      for (const line of (Array.isArray(seat?.roster) ? seat.roster : [])) {
        if (str(line?.role)) held.add(str(line.role).toLowerCase());
      }
    }
    // The drawn role a `{hall}`-shaped slot became, which is the one the page PRINTED.
    for (const fill of (Array.isArray(pool?.slots?.fills) ? pool.slots.fills : [])) {
      if (str(fill?.value)) held.add(str(fill.value).toLowerCase());
    }
  }
  return [...held].sort(compareCodepoint);
}

/** Every institution the card's town holds, by name. @param {object} card @returns {string[]} */
export function institutionsOfCard(card) {
  return (Array.isArray(card?.town?.institutions) ? card.town.institutions : [])
    .map((inst) => str(inst?.name)).filter(Boolean).sort(compareCodepoint);
}

/**
 * ⭐⭐ EVERY NAMED BODY THE CARD'S TOWN HOLDS (card schema /5, W3d car 2).
 *
 * ⛔ THE THIRD LIST FLOOR 1 ALWAYS NEEDED. A town seats ROLES (an office a source may speak
 * through) and holds INSTITUTIONS (a building or a service), and neither is the set of NAMED BODIES
 * the engine decided for this settlement: its factions, its power blocs, the two parties of its
 * conflicts, the two of its prominent relationship. RUN 3 measured the gap as 8 roster
 * contradictions, most of them bodies the engine named and the card did not list — "The Governing
 * Council and The Order of the Watch" on the pinned town, handed to the writer as that pool's own
 * `{faction}` fills.
 *
 * ⛔ A CARD OLDER THAN SCHEMA /5 ANSWERS THE EMPTY LIST, which leaves both arms exactly where they
 * were before this car rather than licensing anything new.
 * @param {object} card @returns {string[]}
 */
export function bodiesOfCard(card) {
  return (Array.isArray(card?.town?.bodies) ? card.town.bodies : [])
    .map((body) => str(body?.name)).filter(Boolean).sort(compareCodepoint);
}

/**
 * ⭐ THE HOLDERS OF ONE RECORD KIND, FROM THE CARD ALONE.
 *
 * This is `holderTable.js`'s `holdersOf` reading the card instead of the settlement, and it is
 * EXACT rather than an approximation: `holdersOf` intersects the kind's declared services with
 * the town's LIVE instantiated services, and `card.town.institutions[].services` IS that list
 * (W0 builds it from `liveInstitutions` with the services actually on). The one thing the card
 * cannot answer from its institution rows alone is whether a holder is INTERESTED, which needs
 * impairments and capture state; the card's own `town.holders` rows (schema /2) carry that
 * answer, resolved once where the settlement was in hand, and the arm below reads them.
 * @param {string} kind @param {object} card @returns {string[]}
 */
export function holdersFromCard(kind, card) {
  const record = HOLDER_RECORDS.find((r) => r.kind === kind);
  if (!record || record.services.length === 0) return [];
  const wanted = new Set(record.services);
  /** @type {Set<string>} */
  const held = new Set();
  for (const inst of (Array.isArray(card?.town?.institutions) ? card.town.institutions : [])) {
    const services = Array.isArray(inst?.services) ? inst.services : [];
    if (services.some((s) => wanted.has(str(s))) && str(inst?.name)) held.add(str(inst.name));
  }
  return [...held].sort(compareCodepoint);
}

/**
 * The fields one pool of the card declares it reads. Typed at its own boundary so both A13
 * branches can share it, which is also what keeps the two from drifting.
 * @param {{static?: {reads?: unknown}}|null|undefined} pool @returns {string[]}
 */
function readsOfPool(pool) {
  return Array.isArray(pool?.static?.reads) ? pool.static.reads.map(str) : [];
}

/**
 * ⭐⭐ THE FIELD PATHS ONE POOL READS — arm Q's OWN COLUMN, and the one it never had here
 * (chair ruling 28, W3a car 3).
 *
 * ⛔ THE ARM WAS ASKING THE CORPUS'S QUESTION WITH NONE OF THE CORPUS'S INPUTS. R-DA-03 licenses
 * a second sentence by a SECOND TYPED FIELD, and `armQualify` settles that through `claimsField`
 * over `entry.reads` with the census's ratified synonyms as `entry.vocabulary`. Both columns are
 * OPTIONAL by construction — "a caller that brings no census reader gets the arm it had before
 * this car" — and this module brought neither, so `reads` was `[]` on every unit and EVERY second
 * sentence was withheld as "naming no second field". The simulation measured the consequence: six
 * of fifteen units on one page, nearly half the page, withheld by a blanket the tier-1 checklist
 * then inherits and cannot tell from a real second-field problem.
 *
 * ⛔ THE FIELD PATHS, NOT THE WIRING STRINGS. `pool.static.reads` is the census's WIRING column
 * and on many pools it is a sentence about code — `scoreBand(readinessScore) (via
 * READINESS_ROW_POOL in defenseStateProse.js)` — which `claimsField` can never match to a word of
 * prose. `pool.fields[].field` is the engine's own dotted path with its value beside it, which is
 * exactly what the corpus's own Q cure reads (`proseEntryContradiction.walker.test.js`'s cure arm
 * and `scripts/prose-wave-gate.mjs` both pass `reads: row.reads` with `vocabulary:
 * fieldSynonymsFor(row)`). The wiring strings are NOT removed from anywhere: A13 still reads them
 * through `readsOfPool` and C3's `eventProvenance` still derives from them in `groundOfCard`.
 *
 * @param {object|null|undefined} pool @returns {string[]}
 */
export function fieldPathsOfPool(pool) {
  return (Array.isArray(pool?.fields) ? pool.fields : [])
    .map((row) => str(row?.field)).filter((field) => field !== '');
}

/**
 * The ratified synonym vocabulary for one pool's field paths, in `claimsField`'s own shape.
 * The holder KIND comes from the pool's wiring reads through `sourceOfRow`, which is where the
 * census gets it too, so a `roll` or a `books` licenses the record noun of the kind that actually
 * keeps this row and of no other.
 * @param {object|null|undefined} pool @returns {Record<string, string[]>}
 */
export function vocabularyOfPool(pool) {
  const fields = fieldPathsOfPool(pool);
  if (!fields.length) return {};
  const wiring = readsOfPool(pool);
  const kind = wiring.length ? str(sourceOfRow({ reads: wiring }).kind) : '';
  // ⛔ BOTH SPELLINGS OF THE FIELD ARE ASKED, AND THE REASON IS A MEASURED MISS. The census spells
  // a field with its `settlement.` root and the static card strips it (`townCard.js`'s `valueAt`
  // walks the stripped path off the settlement object), while `FIELD_SYNONYM_ROWS` is keyed on the
  // CENSUS spelling. So a lookup on the card's spelling matches no ratified row at all: MEASURED
  // on the pinned town, the one ratified row in the estate — the military economic gate, whose
  // nouns are wages, wage, pay and purse — sits on the `WALLED-THREATENED` pool's fields and
  // resolved to an empty vocabulary. Both spellings go in and the answer is keyed on the CARD's,
  // which is the spelling arm Q is handed. The holder-kind nouns are per ROW and unaffected.
  const table = fieldSynonymsFor({
    reads: fields.flatMap((field) => [field, `settlement.${field}`]),
    source: { kind },
  });
  /** @type {Record<string, string[]>} */
  const out = {};
  for (const field of fields) {
    const nouns = [...new Set([
      ...(table[field] || []), ...(table[`settlement.${field}`] || []),
    ])].sort(compareCodepoint);
    if (nouns.length) out[field] = nouns;
  }
  return out;
}

/**
 * The card's holder rows (card schema /2), or null on a card that predates them. Null is the
 * shape a caller must be able to tell apart from "no holder for this kind", which is why an
 * empty array is NOT used for the absent case.
 * @param {{town?: {holders?: unknown}}|null|undefined} card
 * @returns {Map<string, {holders: string[], standing: string, interested: boolean}>|null}
 */
export function holderRowsOfCard(card) {
  const rows = card?.town?.holders;
  if (!Array.isArray(rows)) return null;
  /** @type {Map<string, {holders: string[], standing: string, interested: boolean}>} */
  const out = new Map();
  for (const row of rows) {
    out.set(str(row?.kind), {
      holders: Array.isArray(row?.holders) ? row.holders.map(str) : [],
      standing: str(row?.standing),
      interested: row?.interested === true,
    });
  }
  return out;
}

/**
 * The same resolution for one explicit read set. Split out so `refuteUnit` can hand it the
 * ONE pool's reads rather than the tab's, and so the two callers cannot drift.
 * @param {ReadonlyArray<string>} reads
 * @param {Map<string, {holders: string[], standing: string, interested: boolean}>} holderRows
 * @returns {{kind: string, holder: string|null, standing: string}}
 */
export function sourceOfCardForReads(reads, holderRows) {
  const base = sourceOfRow({ reads: reads.map(str) });
  if (base.standing !== 'LICENSED') {
    return { kind: base.kind, holder: null, standing: base.standing };
  }
  /** @type {string[]} */
  const named = [];
  let interested = false;
  for (const kind of base.kinds) {
    const row = holderRows.get(kind);
    if (!row) continue;
    if (row.interested) interested = true;
    for (const holder of row.holders) if (!named.includes(holder)) named.push(holder);
  }
  named.sort(compareCodepoint);
  return {
    kind: base.kind,
    holder: named.length ? named[0] : null,
    standing: interested ? INTERESTED : 'LICENSED',
  };
}

/**
 * ⭐⭐ THE TYPED GROUND, COLLAPSED FROM THE CARD (design §4: "what would be false of THIS town
 * is the finite list the card carries").
 *
 * ⛔ `office` IS `closed: false` ON PURPOSE, AND THE CARD COULD HAVE SAID OTHERWISE. The town's
 * seated roles ARE a finite list, so a closed column would have been defensible and would have
 * LICENSED A TOTALITY over the town's officers. But `rolesOf` seats the roles a SOURCE may speak
 * through, which is not the same set as every office the town holds, so a totality licensed by
 * this column would be licensed by the wrong list. Narrower and honest: the values convict a
 * foreign office (the arm that matters) without licensing a claim over all of them.
 *
 * ⛔ `whoIsCounted` AND `whoIsExempt` KEEP THE ESTATE GROUND'S FLAGS EXACTLY. Persons are never
 * a closed column on any settlement the product can generate, and no exemption writer exists;
 * both are laws rather than measurements and a per-town card cannot repeal either.
 * @param {object} card
 * @param {{blockId?: string, poolKey?: string}} [at] the pool the ground is being built for, so
 *   the sibling, fill and event-provenance limbs read THIS pool's row rather than the tab's
 * @returns {import('./entryWalker.js').EntryGround}
 */
export function groundOfCard(card, at = {}) {
  const roles = seatedRolesOf(card);
  const institutions = institutionsOfCard(card);
  const pool = card && at.blockId !== undefined
    ? poolOfCard(card, str(at.blockId), str(at.poolKey)) : null;
  const reads = Array.isArray(pool?.static?.reads) ? pool.static.reads.map(str) : null;
  const declared = Array.isArray(pool?.slots?.declared) ? pool.slots.declared.map(str) : [];
  const filled = (Array.isArray(pool?.slots?.fills) ? pool.slots.fills : [])
    .map((f) => str(f?.slot)).filter(Boolean);
  /** @type {Array<import('./entryWalker.js').ProseEntry>} */
  const siblings = (Array.isArray(pool?.unit?.faces) ? pool.unit.faces : [])
    .map((face, i) => ({ id: `${str(pool?.blockId)} :: ${str(pool?.poolKey)}#face${i}`, text: str(face) }));
  const ground = {
    scope: /** @type {'settlement'} */ ('settlement'),
    columns: {
      institution: { closed: true, values: institutions },
      office: { closed: false, values: roles },
      holderRole: { closed: false, values: roles },
      whatItCounts: { closed: true, values: null },
      whoIsCounted: { closed: false, values: null },
      whoIsExempt: { closed: false, values: [], nullEverywhere: true },
    },
    rows: (Array.isArray(card?.town?.institutions) ? card.town.institutions : []).map((inst) => ({
      institution: str(inst?.name),
      category: str(inst?.category),
    })),
    siblings,
  };
  // ⛔ THE JOIN EDGES ARE ABSENT AND ARE LEFT ABSENT. The card carries no relation between two
  // institutions, so C6 declares itself NOT-EXECUTABLE. Supplying `[]` would read as "this town
  // holds no relations", which is a claim the card does not make.
  if (reads) {
    // C3's ground: does THIS pool read a field that can hold an event? Derived from the pool's
    // own read paths, which is the only event column the card carries.
    ground.eventProvenance = reads.some((r) => /histor|event|pulse|calamit|previousGovernments/i.test(r));
  }
  if (declared.length || filled.length) {
    ground.fill = {
      declared,
      variantUnion: declared,
      composed: pool?.slots?.recovered === true ? filled : null,
    };
  }
  return ground;
}

// ── the arms this module owns ───────────────────────────────────────────────────────

/** The mechanical bars. @param {string} id @param {string} text @param {object} out */
function armBars(id, text, out) {
  for (const bar of VOICE_BARS) {
    const hit = bar.re.exec(text);
    if (!hit) continue;
    emit(out, finding(id, bar.arm, 'FAIL', 'a mechanical bar', hit[0], bar.why));
  }
}

/** The setting-agnostic tell ban. @param {string} id @param {string} text @param {object} out */
function armTells(id, text, out) {
  for (const tell of AGNOSTIC_TELLS) {
    const hit = tell.re.exec(text);
    if (!hit) continue;
    emit(out, finding(id, 'TELL', 'FAIL', tell.name, hit[0],
      'the engine may not read as one publisher rulebook, and a generated face inherits no quarantine'));
  }
}

/** The engine-token leak classes. @param {string} id @param {string} text @param {object} out
 * @param {ReadonlySet<string>|null} flagKeys */
function armLeaks(id, text, out, flagKeys) {
  for (const leak of LEAK_CLASSES) {
    const re = new RegExp(leak.re.source, leak.re.flags);
    const hits = [...text.matchAll(re)].map((m) => m[0]);
    if (!hits.length) continue;
    emit(out, finding(id, 'LEAK', 'FAIL', leak.name, hits[0],
      'an engine token reached reader prose, which the chokepoint exists to prevent'));
  }
  if (!flagKeys) {
    emit(out, finding(id, 'LEAK', 'NOT-EXECUTABLE', 'flagKey', 'absent',
      'this caller brought no simulation-rule key set, so a leaked flag name cannot be recognised here'));
    return;
  }
  for (const m of text.matchAll(/\b[a-z][a-zA-Z0-9]*\b/g)) {
    if (!flagKeys.has(m[0])) continue;
    emit(out, finding(id, 'LEAK', 'FAIL', 'flagKey', m[0],
      'a simulation-rule flag key reached reader prose'));
    break;
  }
}

/** The six moves that exist nowhere in the estate. @param {string} id @param {string} text @param {object} out */
function armNonMoves(id, text, out) {
  for (const [name, spec] of Object.entries(NON_MOVES)) {
    const hit = spec.detect.exec(text);
    if (!hit) continue;
    emit(out, finding(id, 'NON-MOVE', 'FAIL', name, hit[0], spec.why));
  }
}

/**
 * The SPINE's order must be one of the eight LEVEL-1 orders.
 * @param {string} id @param {object} unitRow @param {string} stance @param {object} out
 */
function armOrder(id, unitRow, stance, out) {
  if (stance !== 'spine') {
    emit(out, finding(id, 'ORDER', 'NOT-EXECUTABLE', '(stance)', stance || 'absent',
      'the LEVEL1 closed set is the grammar of a SPINE; a face or a modifier realises part of one'));
    return;
  }
  const moves = classifyMoves(unitRow.text);
  const orderId = orderIdOf(moves);
  if (orderId !== '') {
    emit(out, finding(id, 'ORDER', 'REPORT', 'the level-1 order', orderId, 'the spine realises a closed level-1 order'));
    return;
  }
  // ⛔ WITHHELD AND NOT FAIL, AND THE NUMBER IS WHY. `composedOrderIdOf` says in terms that the
  // classifier REPORTS and does not refuse, because the share of units outside the two closed
  // sets is the measurement that says whether the sets are the right sets, and a gate that
  // failed every one of them would have settled that question by construction. MEASURED at this
  // tip over the whole shipped defense leaf (955 spine and face rows): 799 realise a level-1
  // order and 156 do not, so 83.7 per cent are inside and a FAIL here would refuse one line in
  // six OF THE CORPUS ITSELF. The corpus is the floor (design §9), so the channel is the one
  // the sitting named for a question a refuter owes an answer on.
  emit(out, finding(id, 'ORDER', 'WITHHELD', 'a move sequence outside the closed set', moves.join(' then '),
    'the spine realises none of the eight level-1 orders; 83.7 per cent of the shipped defense leaf does, so this is a question for the refuter and not a mechanical refusal'));
}

/** WALL 5 (dossier): CONTRAST needs the rejected alternative named by a sibling key or a band.
 * @param {string} id @param {string} text @param {object} card @param {object} out */
function armWall5(id, text, card, out) {
  const re = new RegExp(CONTRAST_SHAPES.source, CONTRAST_SHAPES.flags);
  const hits = [...text.matchAll(re)].map((m) => m[0]);
  if (!hits.length) return;
  const keys = (Array.isArray(card?.pools) ? card.pools : []).map((p) => str(p.poolKey).toLowerCase());
  if (!keys.length) {
    emit(out, finding(id, 'WALL-5', 'NOT-EXECUTABLE', 'the sibling pool keys', 'absent',
      'the card carries no fired pool, so the rejected alternative cannot be looked up'));
    return;
  }
  for (const hit of hits) {
    const words = hit.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3);
    const named = words.some((w) => keys.some((k) => k.includes(w)));
    emit(out, finding(id, 'WALL-5', named ? 'REPORT' : 'WITHHELD', 'a contrast', hit.trim(),
      named
        ? 'the rejected alternative is named by a sibling pool key on this page'
        : 'no sibling pool key on this page names the rejected alternative, so the contrast may reject something the town never had'));
  }
}

/** WALL 6 (dossier): QUALIFY never as a which-tail, never a third sentence.
 * @param {string} id @param {string} text @param {object} out */
function armWall6(id, text, out) {
  const tail = /,\s+(?:which|whose)\b/i.exec(text);
  if (tail) {
    emit(out, finding(id, 'WALL-6', 'FAIL', 'a qualifying which-tail', tail[0].trim(),
      'a qualifier rides the clause it qualifies; a which-tail hangs a second claim off the end of a first'));
  }
  const sentences = sentencesOf(text);
  if (sentences.length >= 3) {
    const third = sentences[2];
    if (/^\s*(?:though|although|even so|that said|but then|of course|to be sure|in any case)\b/i.test(third)) {
      emit(out, finding(id, 'WALL-6', 'FAIL', 'a qualifier as a third sentence', third.slice(0, 60),
        'the wall bars a qualifier from the third sentence: two sentences carry the unit, a third is a gloss'));
    }
  }
}

/** WALL 10 (dossier): the settlement token opens at most one face per pool, never two adjacent.
 * @param {string} id @param {object} card @param {string} blockId @param {string} poolKey @param {object} out */
function armWall10(id, card, blockId, poolKey, out) {
  const pool = poolOfCard(card, blockId, poolKey);
  const faces = Array.isArray(pool?.unit?.faces) ? pool.unit.faces.map(str) : [];
  const spine = str(pool?.unit?.spine);
  const all = spine ? [spine, ...faces] : faces;
  if (all.length < 2) {
    emit(out, finding(id, 'WALL-10', 'NOT-EXECUTABLE', '(the pool faces)', String(all.length),
      'the adjacency wall needs two rows of one pool; the card carries fewer for this key'));
    return;
  }
  const opens = all.map((t) => /^\s*\{settlement\}/.test(t));
  const count = opens.filter(Boolean).length;
  if (count > 1) {
    emit(out, finding(id, 'WALL-10', 'FAIL', 'the settlement token opens more than one row of the pool',
      `${count} of ${all.length}`,
      'the wall allows the token to open at most one variant per pool, so a reader does not meet the town name twice in one place'));
  }
  for (let i = 1; i < opens.length; i += 1) {
    if (opens[i] && opens[i - 1]) {
      emit(out, finding(id, 'WALL-10', 'FAIL', 'two adjacent rows open on the settlement token', `rows ${i - 1} and ${i}`,
        'the wall bars the adjacency outright'));
      break;
    }
  }
}

/**
 * ⭐ THE REFERENT SCAN, THE ROLE HALF (floor 1). Every office noun the text names must be a role
 * the card SEATS. This is the arm that makes floor 1 a lookup: the corpus walkers can only ask
 * whether a noun is in the ESTATE's union, and a role that exists somewhere but not HERE walks
 * straight past them.
 * @param {string} id @param {string} text @param {object} card @param {object} out
 */
function armReferentRole(id, text, card, out) {
  const seated = seatedRolesOf(card);
  const institutions = institutionsOfCard(card).map((n) => n.toLowerCase());
  // ⭐ THE THIRD LIST (W3d car 2). A named body the engine decided for this settlement — a faction,
  // a power bloc, a party to a conflict — is a seat as much as a role or an institution is, and
  // RUN 3 measured the cost of leaving it out at 8 roster refusals of the engine's own names.
  const bodies = bodiesOfCard(card).map((n) => n.toLowerCase());
  if (!seated.length) {
    emit(out, finding(id, 'REFERENT-role', 'NOT-EXECUTABLE', '(the seated roles)', '0',
      'the card seats no role, so a named office cannot be licensed or refused here'));
    return;
  }
  const low = text.toLowerCase();
  for (const noun of OFFICE_NOUN_CANDIDATES) {
    if (!new RegExp(`\\b${noun.replace(/ /g, '\\s+')}\\b`, 'i').test(low)) continue;
    if (seated.some((r) => r.includes(noun))) continue;
    if (institutions.some((n) => n.includes(noun))) continue;
    if (bodies.some((n) => n.includes(noun))) continue;
    emit(out, finding(id, 'REFERENT-role', 'FAIL', 'an office the card does not seat', noun,
      'the text names an office, and this town seats no role, holds no institution and names no body by that name; floor 1'));
  }
}

/**
 * ⭐ THE REFERENT SCAN, THE BODY HALF (floor 1). Every RECORD the text cites must have a holder
 * in the card's roster. The classifier's own PROVENANCE detector names the twelve holder kinds,
 * so the kinds are read from the move rather than from a second regex, and the holder is
 * resolved through `holdersFromCard`.
 * @param {string} id @param {string} text @param {object} card @param {object} out
 * @returns {Array<{kind: string, holder: string|null}>} the resolved citations, for A13
 */
function armReferentBody(id, text, card, out) {
  /** @type {Array<{kind: string, holder: string|null}>} */
  const cited = [];
  if (provenanceCount(text) === 0) return cited;
  const institutions = institutionsOfCard(card);
  if (!institutions.length) {
    emit(out, finding(id, 'REFERENT-body', 'NOT-EXECUTABLE', '(the institution roster)', '0',
      'the card holds no institution, so a cited record cannot be licensed or refused here'));
    return cited;
  }
  // ⛔ THE KIND IS READ OUT OF THE CLASSIFIER'S OWN MATCH AND NOT OUT OF THE WHOLE UNIT. A
  // composed unit can carry a licensed citation in its spine and the bare word `elders` in a
  // modifier; scanning the unit for each kind's noun would convict the second on the strength
  // of the first. `PROVENANCE_CLAUSE` is `moveGrammar.js`'s own PROVENANCE alternation, so a
  // kind is cited only where the shape that MAKES it a citation actually fired.
  // ⭐ A NAMED BODY KEEPS A RECORD TOO (W3d car 2). The institution roster is buildings and
  // services; `town.bodies` is the engine's own named bodies. A town that holds "The Order of the
  // Watch" holds a body by which the watch's roll is kept, and refusing that citation for want of
  // an institution row is the roster half of RUN 3's 8 measured refusals.
  const bodies = bodiesOfCard(card);
  for (const hit of text.matchAll(PROVENANCE_CLAUSE)) {
    const clause = hit[0];
    const record = HOLDER_RECORDS.find((r) => new RegExp(`\\b${r.kind}\\b`, 'i').test(clause));
    if (!record) continue;
    const kind = str(record.kind);
    const holders = holdersFromCard(kind, card);
    const named = holders.length ? holders : bodies.filter((b) => new RegExp(`\\b${kind}\\b`, 'i').test(b));
    cited.push({ kind, holder: named.length ? named[0] : null });
    if (holders.length) continue;
    if (named.length) {
      emit(out, finding(id, 'REFERENT-body', 'REPORT', 'a record kept by a named body rather than an institution', `${kind}: ${named[0]}`,
        'no institution on this card offers the service by which this record is kept, but the town names a body that does, and a body the engine named is a seat; floor 1 is satisfied by the body'));
      continue;
    }
    if (record.rosterBacked !== true || record.services.length === 0) {
      // The kind has no service any institution in the shipped roster can offer, so NO town
      // could ever hold it. That is a wiring debt of the holder table (its own `muster` note
      // records the same shape) and not a fault of this unit, so it is a question rather than
      // a refusal.
      emit(out, finding(id, 'REFERENT-body', 'WITHHELD', 'a record no institution anywhere keeps', kind,
        'the holder table carries no service by which any shipped institution keeps this record, so the citation cannot be licensed on any town and the debt is the table\'s'));
      continue;
    }
    emit(out, finding(id, 'REFERENT-body', 'FAIL', 'a record no body in this town keeps', kind,
      'the text cites a record, and no institution on this card offers the service by which it is kept; the citation names a body the town does not have, which is floor 1'));
  }
  return cited;
}

/**
 * ⭐ THE EPOCH SCAN (design §5b). Elapsed-course language asserts that time has passed and
 * something moved. On a card whose epoch has not advanced there is no such history, and on one
 * that has, the moved field must be a field the DELTA names.
 * @param {string} id @param {string} text @param {object} card @param {object|null} delta @param {object} out
 */
function armEpoch(id, text, card, delta, out) {
  const epoch = card?.epoch || null;
  if (!epoch) {
    emit(out, finding(id, 'EPOCH', 'NOT-EXECUTABLE', '(the epoch)', 'absent',
      'the card carries no epoch section, so an elapsed course cannot be judged'));
    return;
  }
  const hits = [...text.matchAll(new RegExp(ELAPSED_COURSE.source, 'gi'))].map((m) => m[0]);
  if (hits.length && epoch.advanced !== true) {
    for (const hit of hits) {
      emit(out, finding(id, 'EPOCH', 'FAIL', 'an elapsed course on an unadvanced world', hit,
        'the card holds no advance, so nothing has since changed and this clause asserts a history the world does not have'));
    }
  } else if (hits.length && !delta) {
    for (const hit of hits) {
      emit(out, finding(id, 'EPOCH', 'NOT-EXECUTABLE', '(the epoch delta)', hit,
        'this caller brought no delta, so the field this clause says moved cannot be checked against what actually moved'));
    }
  } else if (hits.length) {
    const moved = Object.keys(delta?.fields || {}).map((f) => f.toLowerCase());
    const low = text.toLowerCase();
    const names = moved.some((f) => f.split('.').some((seg) => seg.length > 3 && low.includes(seg.toLowerCase())));
    for (const hit of hits) {
      emit(out, finding(id, names ? 'EPOCH' : 'EPOCH', names ? 'REPORT' : 'FAIL',
        names ? 'an elapsed course over a field the delta names' : 'an elapsed course over a field that did not move', hit,
        names
          ? 'the delta names a field this clause can be about'
          : 'the delta names no field this clause could be about, so the clause reports a change the engine did not make'));
    }
  }
  // The calendar limb: a season the card's calendar does not hold.
  const calendar = str(epoch?.calendar?.season || epoch?.calendar?.seasonName).toLowerCase();
  if (!calendar) return;
  for (const season of SEASONS) {
    if (season === calendar) continue;
    if (!new RegExp(`\\bthis ${season}\\b`, 'i').test(text)) continue;
    emit(out, finding(id, 'EPOCH', 'FAIL', 'a season the calendar does not hold', season,
      `the card's calendar stands at ${calendar}, so a claim about this other season is about a time the world is not at`));
  }
}

/**
 * ⭐ THE CORPUS DIFF. Where the corpus holds a unit for this pool, the Scribe's unit is
 * classified against it exactly as the clarity sweep treats a re-cut line: a move ADDED is a
 * finding, and a level-1 order LOST on a spine is a finding. `walkPair` runs beside it so the
 * entry walker's own added-versus-inherited discipline applies to the same pair.
 * @param {string} id @param {object} unitRow @param {string} corpusText @param {string} stance
 * @param {import('./entryWalker.js').EntryGround} ground @param {object} out
 */
function armCorpusDiff(id, unitRow, corpusText, stance, ground, out) {
  const was = classifyMoves(corpusText);
  const now = classifyMoves(unitRow.text);
  for (const move of now) {
    if (was.includes(move)) continue;
    const heavy = move === 'PROVENANCE' || move === 'HISTORY';
    emit(out, finding(id, 'CORPUS-DIFF', heavy ? 'FAIL' : 'REPORT', 'a move the corpus unit does not make', move,
      heavy
        ? 'the unit adds a citation or a closed span the corpus line does not carry, which is a claim about the record rather than a rewording of the fact'
        : 'the unit makes a move the corpus line does not; reported, because a different move is what a rewrite is for'));
  }
  if (stance === 'spine') {
    const had = orderIdOf(was);
    const has = orderIdOf(now);
    if (had !== '' && has === '') {
      // ⭐ THE VERDICT SAYS WHAT WAS ASKED (chair ruling 27, W3a car 3). The channel STAYS FAIL:
      // with the order and its licence now printed on the card (`unit.order`), the arm is fair,
      // and ruling 27 re-measures it on the unified prompt before any demotion. What was NOT fair
      // was a reader of the verdict being told only that an order was lost, with no way to see
      // which order or what it licenses. Both are named here now.
      const spec = LEVEL1_ORDERS[had.split('|')[0]] || null;
      const realised = spec ? [...spec.order].join(' then ') : '';
      const licences = had.split('|').map((m) => LEVEL1_ORDERS[m]?.licences).filter(Boolean).join(' | ');
      emit(out, finding(id, 'CORPUS-DIFF', 'FAIL', 'a level-1 order lost on a spine', `${had} then none`,
        `the corpus spine realises the closed order ${had}, which is ${realised} (${licences}), and this one realises none, so the grammar the pool ships under is gone; the order and its licence are on the card at unit.order and are the thing to keep`));
    }
  }
  const pair = walkPair(
    { id: `${id}#corpus`, text: corpusText },
    { id, text: unitRow.text },
    ground,
  );
  for (const f of pair.added) {
    emit(out, finding(id, 'CORPUS-DIFF', 'FAIL', `an added ${f.klass} fault (${f.arm})`, str(f.clause).slice(0, 70), f.description));
  }
  for (const f of pair.preExisting) {
    emit(out, finding(id, 'CORPUS-DIFF', 'REPORT', `inherited from the corpus line (${f.arm})`, str(f.clause).slice(0, 70), f.description));
  }
}

/**
 * The clarity proxy and the block measures, as REPORT rows. Ruling 1: they refuse nothing.
 * @param {string} id @param {object} unitRow @param {ReadonlyArray<string>} faces @param {object} out
 */
function armReport(id, unitRow, faces, out) {
  const text = unitRow.text;
  // The three clarity-sweep proxy limbs, as `rewrite/clarity-sweep.mjs` spells them.
  if (text.includes(' and that ')) {
    emit(out, finding(id, 'CLARITY', 'REPORT', 'the and-that limb', 'and that',
      'a subordinated second claim; the clarity sweep counts it as a shape a reader pays twice for'));
  }
  const gloss = /\b(has it that|have it that|puts it that|the account is|the talk is that|'s position is|'s account is|'s own account|'s word is|own answer is|the word is that|the view is that|'s view is)\b/.exec(text);
  if (gloss) {
    emit(out, finding(id, 'CLARITY', 'REPORT', 'a mannered attribution frame', gloss[0],
      'ruling 42 struck these frames; the attribution names the source plainly instead'));
  }
  const arch = /\b(granary|infirmary|pedlar|factor|watchman|sexton|alehouse|bier|billhook|gaol|patrolman|tallow)\b/.exec(text);
  if (arch) {
    emit(out, finding(id, 'CLARITY', 'REPORT', 'an archaic noun', arch[0],
      'the clarity sweep counts the period vocabulary a scanning reader stops on'));
  }
  const sentences = sentencesOf(text);
  emit(out, finding(id, 'MEASURE', 'REPORT', 'opener class', openerOf(text) || '(none)', 'the opener the fingerprint counts'));
  emit(out, finding(id, 'MEASURE', 'REPORT', 'sentences', String(sentences.length), 'the two-sentence share is read off this'));
  emit(out, finding(id, 'MEASURE', 'REPORT', 'close kind', closeKindOf(sentences[sentences.length - 1] || text), 'the close variety the selector spends'));
  const presence = presenceOf([text]);
  emit(out, finding(id, 'MEASURE', 'REPORT', 'sensory nouns', String(presence?.total ?? 0), 'the presence lexicon, counted not judged'));
  const words = text.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  emit(out, finding(id, 'MEASURE', 'REPORT', 'words', String(words.length), 'the denominator every rate above is per'));
  if (faces.length >= 2) {
    const shared = new Set(faces[0].toLowerCase().split(/[^a-z]+/).filter(Boolean));
    const second = faces[1].toLowerCase().split(/[^a-z]+/).filter(Boolean);
    const overlap = second.filter((w) => shared.has(w)).length;
    emit(out, finding(id, 'MEASURE', 'REPORT', 'sibling overlap', `${overlap} of ${second.length}`,
      'the fourth block measure, at the one grain a single unit can carry it'));
  }
}

// ── the call ────────────────────────────────────────────────────────────────────────

/**
 * ⭐⭐ REFUTE ONE UNIT.
 *
 * @param {{text: string, stance?: string, source?: string, pair?: string, blockId?: string,
 *   poolKey?: string, marks?: ReadonlyArray<string>, slots?: ReadonlyArray<string>,
 *   faces?: ReadonlyArray<string>, pieces?: ReadonlyArray<object>}} unit
 * @param {object} card the town card (`townCard.js`)
 * @param {{corpusUnit?: {text: string}|string|null, options?: object}} [extra]
 *   `options` may carry `flagKeys` (a Set of simulation-rule flag names), `settlement` and
 *   `world` (which turn A13's INTERESTED limb on through `sourceOfForTown`), `delta` (the epoch
 *   delta from `epochRecord.js`), and anything `walkComposed` reads
 * @returns {{verdict: 'FAIL'|'WITHHELD'|'PASS', findings: RefuteFinding[],
 *   report: {arms: number, fails: number, withheld: number, reports: number,
 *     notExecutable: number, order: string, moves: string[]}}}
 */
export function refuteUnit(unit, card, extra = {}) {
  const opts = extra.options && typeof extra.options === 'object' ? extra.options : {};
  const row = unitRowOf(unit, card);
  const id = row.id;
  const stance = str(unit?.stance) || 'spine';
  const ground = groundOfCard(card, { blockId: row.blockId, poolKey: row.poolKey });
  const out = emptyResult();

  armBars(id, row.text, out);
  armTells(id, row.text, out);
  armLeaks(id, row.text, out, opts.flagKeys instanceof Set ? opts.flagKeys : null);
  armNonMoves(id, row.text, out);
  armOrder(id, row, stance, out);
  armWall5(id, row.text, card, out);
  armWall6(id, row.text, out);
  armWall10(id, card, row.blockId, row.poolKey, out);
  const cited = armReferentBody(id, row.text, card, out);
  armReferentRole(id, row.text, card, out);

  // ⭐ A13's holder reader. With the settlement in hand the real `sourceOfForTown` runs; with the
  // card alone the same standing is read off `town.holders`, which the card builder resolved
  // where the settlement WAS in hand. Only a card older than schema /2 leaves the limb unread,
  // and it says so rather than reading LICENSED by default.
  /** @type {object} */
  const walkOptions = { ...opts };
  // ONE spelling of "which fields does this pool declare it reads", shared by both branches so
  // the settlement-grounded reader and the card-grounded one can never drift apart.
  const poolReads = () => readsOfPool(poolOfCard(card, row.blockId, row.poolKey));

  // ⭐⭐ ARM Q'S TWO COLUMNS (chair ruling 28). See `fieldPathsOfPool`: the arm asked the corpus's
  // own question and this module brought it none of the corpus's own inputs, so it withheld every
  // second sentence on the page. A caller's own readers still win — `opts.readsOf` is honoured
  // where one is given, because the pilot and the wave gate may ground the arm on a census row
  // rather than on a card.
  const qPool = poolOfCard(card, row.blockId, row.poolKey);
  if (!walkOptions.readsOf) walkOptions.readsOf = () => fieldPathsOfPool(qPool);
  if (!walkOptions.vocabularyOf) walkOptions.vocabularyOf = () => vocabularyOfPool(qPool);
  if (opts.settlement) {
    walkOptions.sourceOf = () => sourceOfForTown({ reads: poolReads() }, opts.settlement, opts.world || {});
  } else if (cited.length) {
    // ⭐ THE CARD ANSWERS IT NOW (card schema /2, W2). `town.holders` carries each record kind's
    // holders and whether any of them is INTERESTED, resolved once where the settlement was in
    // hand. So the arm executes off the card alone — which is the only ground the SERVER-side
    // refuter ever has — instead of declaring itself unreachable. A card from the older shape
    // has no such row, and the arm still says NOT-EXECUTABLE rather than reading LICENSED by
    // default: a missing answer is not a clean one.
    const holderRows = holderRowsOfCard(card);
    if (holderRows === null) {
      emit(out, finding(id, 'A13', 'NOT-EXECUTABLE', '(the holder standing)', cited.map((c) => c.kind).join(', '),
        'this card carries no holder rows, so whether the body that keeps the cited record is INTERESTED in the fact it holds cannot be read here'));
    } else {
      walkOptions.sourceOf = () => sourceOfCardForReads(poolReads(), holderRows);
    }
  }

  const walk = walkComposed(row, ground, walkOptions);
  mergeResults(out, walk.composed);
  for (const f of walk.entry.fails) emit(out, finding(id, f.klass, 'FAIL', f.arm, str(f.clause).slice(0, 90), entryWhy(f)));
  for (const f of walk.entry.withheld) emit(out, finding(id, f.klass, 'WITHHELD', f.arm, str(f.clause).slice(0, 90), entryWhy(f)));
  for (const f of walk.entry.notExecutable) emit(out, finding(id, f.klass, 'NOT-EXECUTABLE', f.arm, str(f.column), f.description));
  for (const f of walk.entry.notes) emit(out, finding(id, f.klass, 'REPORT', f.arm, str(f.value), f.description));

  // A5 and A6 are not in the walk, so they are called beside it over the unit's own face set.
  //
  // ⛔ A6's PARENT MUST BE IN THE FACE'S OWN REGISTER, AND GETTING THAT WRONG IS A MANUFACTURED
  // FAIL. A6 compares SLOT SETS, and a slot set is only visible in text whose `{slot}` markers
  // are still in it. A rendered parent has none and a raw face has all of them, so comparing the
  // two convicts every face of naming a foreign slot: MEASURED at 30 of 264 DS-DEF-2 units
  // before this guard, every one of them a landed corpus line that names exactly the slots its
  // own spine names. So the parent is `unit.spine` where the caller supplies one, and where it
  // does not the arm runs only if the two registers agree on carrying markers at all.
  const faces = Array.isArray(unit?.faces) ? unit.faces.map(str) : [];
  mergeResults(out, armA5({ id, faces }));
  const parentText = str(unit?.spine) || row.text;
  const marked = (t) => /\{[a-zA-Z_][a-zA-Z0-9_]*\}/.test(t);
  for (const face of faces) {
    if (marked(face) && !marked(parentText)) {
      emit(out, finding(id, 'A6', 'NOT-EXECUTABLE', '(the parent register)', 'rendered',
        'the face still carries its slot markers and the parent does not, so the two are not in one register and their slot sets cannot be compared; supply `unit.spine` in the face\'s own register'));
      continue;
    }
    mergeResults(out, armA6({
      id,
      parent: { text: withoutRoleSlots(parentText), marks: Array.isArray(unit?.marks) ? unit.marks : [] },
      face: withoutRoleSlots(face),
      faceMarks: Array.isArray(unit?.marks) ? unit.marks : [],
    }));
  }

  const corpusText = typeof extra.corpusUnit === 'string' ? extra.corpusUnit : str(extra.corpusUnit?.text);
  if (corpusText) armCorpusDiff(id, row, corpusText, stance, ground, out);
  else {
    emit(out, finding(id, 'CORPUS-DIFF', 'NOT-EXECUTABLE', '(the corpus unit)', 'absent',
      'no corpus unit was supplied for this pool, so no move can be called added'));
  }

  armEpoch(id, row.text, card, opts.delta || null, out);
  armReport(id, row, faces, out);

  const verdict = composedVerdictOf({ entry: { fails: [], withheld: [] }, composed: out });
  const moves = classifyMoves(row.text);
  return {
    verdict,
    findings: [...out.fails, ...out.withheld, ...out.reports, ...out.notExecutable],
    report: {
      arms: REFUTE_ARMS.length,
      fails: out.fails.length,
      withheld: out.withheld.length,
      reports: out.reports.length,
      notExecutable: out.notExecutable.length,
      order: orderIdOf(moves),
      moves,
    },
  };
}

/**
 * ⭐ THE PAGE-LEVEL ARMS over a whole tab's units: C7's cross-block sibling agreement, the
 * opener-trigram repeats and the sibling overlap. None of the three is a property of ONE unit,
 * which is why they live here and not above.
 * @param {ReadonlyArray<object>} units
 * @param {object} card
 * @returns {{verdict: 'FAIL'|'WITHHELD'|'PASS', findings: RefuteFinding[],
 *   report: {units: number, openers: Array<{opener: string, n: number}>}}}
 */
export function refuteTab(units, card) {
  const rows = (Array.isArray(units) ? units : []).map((u) => unitRowOf(u, card));
  const out = emptyResult();
  mergeResults(out, armC7(rows));
  /** @type {Map<string, number>} */
  const trigrams = new Map();
  for (const row of rows) {
    const words = row.text.split(/\s+/).filter(Boolean).slice(0, 3).join(' ').toLowerCase();
    if (!words) continue;
    trigrams.set(words, (trigrams.get(words) || 0) + 1);
  }
  for (const [opener, n] of [...trigrams.entries()].sort((a, b) => compareCodepoint(a[0], b[0]))) {
    if (n < 2) continue;
    emit(out, finding('(tab)', 'C7-opener', 'REPORT', 'an opener trigram repeated on one page', `${opener}: ${n}`,
      'two units of one page open on the same three words, which is the measure the block fingerprint bands'));
  }
  return {
    verdict: composedVerdictOf({ entry: { fails: [], withheld: [] }, composed: out }),
    findings: [...out.fails, ...out.withheld, ...out.reports, ...out.notExecutable],
    report: {
      units: rows.length,
      openers: [...trigrams.entries()].map(([opener, n]) => ({ opener, n }))
        .sort((a, b) => compareCodepoint(a.opener, b.opener)),
    },
  };
}
