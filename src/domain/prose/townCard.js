/**
 * domain/prose/townCard.js — THE TOWN CARD (W0 deliverable 1;
 * DESIGN_SCRIBE_GENERATION_TIME_PROSE §2, §3.3, §11 W0).
 *
 * WHAT THIS IS. The hand corpus's marker card must be lawful over EVERY town that can draw a
 * pool, which is why it runs to 107 KB for one pool and why 423 of its lines are sibling
 * sentences that CAN co-fire: §1 carries the key's PREIMAGE by tier, §2 the rows required at
 * EVERY tier, §5 the rosters the key leaves OPEN. All of it exists because the writer does not
 * know which town will draw the line. At generation time there is ONE town, and every one of
 * those questions has an answer rather than a range. The card is that collapse.
 *
 * ── ⭐⭐ THE PRINCIPLE (§3.3): THE CARD IS THE COMPOSER'S OWN TRACE ──────────────────
 * It is built by RUNNING THE SHIPPED PIPELINE over this settlement — the shipped desk-read
 * recipes, never `{}` readings, through `scribePage.js`'s page render — and HARVESTING what it
 * drew. It never re-derives a draw. That matters twice over:
 *   · a re-derivation is a SECOND OPINION about which variant fired, and the estate's whole
 *     prose programme is a record of what happens when two instruments measure two worlds while
 *     both report green;
 *   · the model must be TOLD the answer to every question the engine can answer (§3.3), and the
 *     only place those answers exist together is the render itself.
 * The two things it recomputes are recomputed because they are PURE FUNCTIONS OF DATA THE CARD
 * ALREADY HOLDS and the composer does not report them: the compromised roll (`compromisedSpeaks`
 * on the same seed, pool key, settlement id and year the page used) and the slot fills (below).
 * Both are pinned against the render in `tests/domain/townCard.test.js`.
 *
 * ── ⭐ HOW THE SLOT FILLS AND THE DRAWN ROLES ARE RECOVERED, AND WHY IT IS NOT A RE-DRAW ──
 * The composer reports `pieces` but not the slot bag and not the roles it printed, and the brief
 * prefers harvesting to touching the composer's duplicated `read` literal. So the card ALIGNS:
 * the corpus leaf holds the face's RAW text with its `{slot}` and `{source}` placeholders still
 * in it, the page holds the RENDERED text, and one lazy-capture regex built from the raw
 * recovers what each placeholder became. This is a READ of the render, not a second draw — the
 * values come from the page, not from a re-run of `drawRole`. It recovers the `{settlement}` and
 * `{defmaterial}` fills AND the drawn role for every `{hall}`-shaped slot in one pass, which is
 * why it is worth doing at all. It can fail (a compound pair rearranges its halves), and when it
 * does the row says `recovered: false` rather than guessing.
 *
 * ── ⚠ THE EPOCH, AND THE DEFECT FOUND WHILE LOOKING FOR IT ──────────────────────────
 * The card is per EPOCH, not per settlement: an advance of time reads a fresh card beside the
 * history of prior ones. Nothing on the settlement blob answers "which epoch is this":
 *   ⛔ `history.age` IS FROZEN AT GENERATION, and `faceSources.js:349-352` says the opposite in
 *      terms ("ADVANCES when the world advances"). MEASURED: thirty consecutive `one_year`
 *      advances of a real town move `calendar.year` 2 -> 31 and leave `history.age` at 215. It
 *      is written only by `historyGenerator.js` (:812, :826, :883) and every worldPulse writer
 *      spreads it through untouched. So `renderYearOf` — the year the COMPROMISED ROLL turns on
 *      (ruling 26 edge (h)) — is a constant, and the roll that was meant to be re-rolled at every
 *      advance never moves. REPORTED, NOT FIXED HERE: curing it changes who speaks on a town
 *      with a covert field, which is a rendered-text change and not W0's.
 *   ⛔ NO ADVANCE COUNTER, NONCE OR EPOCH FIELD EXISTS ON A SETTLEMENT. The engine's own
 *      per-advance stamps are `worldState.tick` and `campaignState.worldPulse.lastTick`, both on
 *      the campaign and neither reachable from a settlement.
 * So the epoch is read from `options.world` — the owning campaign's world state, which the
 * brief's signature already carries — exactly as `settlementWorldChronicle.js` takes `worldState`
 * as its FIRST argument rather than reaching for it. With no world the card records what the blob
 * alone can say and marks the epoch `advanced: false` with a null tick, which is the honest
 * answer for a town that belongs to no campaign.
 *
 * ── THE STATIC TABLE IS AN INPUT, NOT A HIDDEN READ ─────────────────────────────────
 * `docs/content/scribe-static-card.json` carries the clocks, the FROZEN/LIVE classification and
 * the wiring status. This module may not read a file — it is a domain leaf that will run in a
 * browser — so the table arrives as `options.staticCard`, the same seam `composeStateProse` puts
 * on its three frozen leaves and for the same reason. Absent is lawful: the card then carries no
 * `static` and no `fields` row and SAYS SO (`staticCardJoined: false`), rather than carrying a
 * half-answer nobody can tell from a whole one.
 *
 * ── WHAT THE CARD IS, AS DATA ───────────────────────────────────────────────────────
 * PLAIN, JSON-serialisable, KEY-SORTED and BYTE-STABLE: two calls on one settlement return
 * identical JSON, and `regenSection` on a non-locked section does not move it. No function, no
 * class instance, no Set, no Map. Every list is sorted by a rule written beside it, and the one
 * list that is NOT sorted is `pools`, which is in PAGE ORDER because page order is a fact.
 *
 * ⛔⛔ NO OBJECT LITERAL IN THIS FILE CARRIES A NON-COMPUTED KEY. Measured: the census's
 * `producerCitations` reads every `Property` key under `src/domain/**` as a WRITE of world state,
 * and eighteen identifiers are read by a desk while produced nowhere — `anyTreaty court doc eco
 * faith faithHidden forces hasPatron hist link magicWorks namedChain navy prison readings
 * structureKey war warBeat`. Two of them, `court` and `forces`, are words this card wants. So
 * every record is built through `rec()`, whose keys are computed, and the suite re-runs the
 * census's own `astTokens` over this file and asserts ZERO writes.
 *
 * PURE and HEADLESS: no clock, no RNG, no store, no file system, no DOM.
 *
 * @enforced-by tests/domain/townCard.test.js
 */
import { renderTabPage, SCRIBE_TABS, seedOf } from './scribePage.js';
import { classifyMoves, orderIdOf, LEVEL1_ORDERS } from './moveGrammar.js';
import {
  sourcesOf, rolesOf, compromisedSourcesOf, renderYearOf,
} from '../display/stateProse/faceSources.js';
import {
  compromisedSpeaks, COMPROMISED_SPEAKS, agreeVerb,
} from '../display/stateProse/stateProseKernel.js';
import { COMPROMISED_SYMPTOM_POOLS } from '../display/stateProse/composeStateProse.js';
import { DOSSIER_MOUNTS } from '../display/stateProse/dossierMounts.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { standingDefenseForces } from '../institutions/defenseInstitutionBuckets.js';
import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';
import { deriveArmedForces } from '../display/defenseDisplay.js';
import {
  HOLDER_KINDS, INTERESTED, holdersOf, recordOf, standingOf,
} from './holderTable.js';
import { GENERATOR_VERSION, SIMULATION_VERSION } from '../settlement.schema.js';
import { compareCodepoint } from '../deterministicSort.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../data/dossierStateProse/warFaith.generated.js';

/**
 * The card's schema id. A shape change takes the next number and says why.
 *
 * /2 (W2, 2026-09-14): `town.holders` added — the twelve holder kinds with the body that keeps
 * each record and whether that body is INTERESTED in the fact it holds. W1 measured that A13's
 * INTERESTED limb was NOT-EXECUTABLE from the card alone (it needs impairments and capture
 * state, which are settlement facts the card did not carry), and the server-side refuter has
 * only the card. Resolving the standing once, where the settlement is in hand, turns that arm
 * on. The golden was re-recorded for this cause and no other.
 *
 * /3 (W3a car 2, 2026-09-14): `pools[].unit.order` added — the LEVEL-1 move order the corpus
 * spine realises, its move list, and the licence that names it. Chair ruling 26: every rule the
 * tier-0 refuter can convict on is TOLD to the model. The simulation MEASURED four of five
 * fallbacks on one page as `CORPUS-DIFF · a level-1 order lost on a spine`, a corpus-register
 * property the card carried no trace of, so the model was refused for a rule it was never given.
 * The golden was re-recorded for this cause and no other.
 *
 * /4 (W3b car 2, 2026-09-14): `pools[].fields[].unknown` + `.state` and `pools[].writeable`
 * added. RUN 2 measured that the writer's commonest invention is an ABSENCE asserted where a
 * reading has no value, and the card printed `= null` for those readings without saying that a
 * null is not a fact. See `fieldState` and `writeableOf`. The golden was re-recorded for this
 * cause and no other: the only new bytes on any tab are those three keys and the schema string.
 */
export const TOWN_CARD_SCHEMA = 'scribe-town-card/4';

/**
 * The engine fingerprint the artefact is keyed to (§7). Spelled from the schema's own two
 * constants rather than imported from `intent/applyDispatch.js`, which would drag the whole
 * intent layer into a leaf that is meant to be lazy-loaded; the two files agree by construction
 * because `ENGINE_VERSION` is that same template over those same two constants.
 */
export const CARD_ENGINE_VERSION = `gen-${GENERATOR_VERSION}/sim-${SIMULATION_VERSION}`;

/**
 * ⭐ THE ONE RECORD BUILDER. See the header: no key of any record this module returns is a
 * non-computed `Property` key, so the census's producer walk cannot read one as a write.
 *
 * ⛔ IT SORTS, AND `rec` AND `sorted` ARE THE SAME FUNCTION FOR A MEASURED REASON. The first cut
 * had two — a plain one for small rows and a sorting one for the big sections — and the key-sort
 * arm convicted every `town.institutions[i]` row on all thirteen tabs, because a row built by the
 * plain one carries its keys in insertion order and a card whose sub-records are unsorted is a
 * card two builds of the same town can disagree about the moment a key is added. One builder, one
 * rule; the alias is kept only because the two names read differently at their call sites.
 */
const sorted = (pairs) => Object.fromEntries(
  pairs.filter(([, v]) => v !== undefined).sort((a, b) => compareCodepoint(a[0], b[0])),
);
/** @see sorted */
const rec = sorted;

/**
 * THE CORPUS, ALL SIX LEAVES, INDEXED BY BLOCK. Built once at module load from the same frozen
 * leaves the desks read, so the card's "the corpus unit as drawn" is the bytes the page drew
 * from and not a copy of them.
 * @type {Record<string, {pools?: Record<string, ReadonlyArray<object>>, poolMeta?: object}>}
 */
const CORPUS = Object.assign(
  Object.create(null),
  DOSSIER_STATE_PROSE_DEFENSE, DOSSIER_STATE_PROSE_ECONOMY, DOSSIER_STATE_PROSE_GENERAL,
  DOSSIER_STATE_PROSE_POWER, DOSSIER_STATE_PROSE_STRESSORS, DOSSIER_STATE_PROSE_WAR_FAITH,
);

/**
 * The variant a composed line drew, from the leaf. The page line's `vid` is the composer's own
 * coordinate — `pool.indexOf(variant)`, the position AS AUTHORED (`composedPieceOf`) — and NOT
 * the annex id, which is why this indexes rather than searches.
 * ⛔ THE TWO NUMBERS ARE DIFFERENT AND THE CARD CARRIES BOTH. `authoredIndex` is the position
 * the recorder and the manifest key on; `vid` is the ANNEX ROW NUMBER, the only field that names
 * a variant across a rewrite and the thing `drawVariant` hashes on. A card that carried one under
 * the other's name would make every determinism pin meaningless.
 * @param {string} blockId @param {string} poolKey @param {number|undefined} authoredIndex
 * @returns {object|null}
 */
export function variantAt(blockId, poolKey, authoredIndex) {
  const pool = CORPUS[blockId]?.pools?.[poolKey];
  if (!Array.isArray(pool) || typeof authoredIndex !== 'number') return null;
  return pool[authoredIndex] || null;
}

/** The raw text of one face: the spine for face 0, else the wording. The composer's own rule. */
export function faceRawOf(variant, face) {
  const wordings = variant?.wordings;
  return face === 0 || !Array.isArray(wordings) ? String(variant?.text ?? '') : String(wordings[face - 1] ?? '');
}

/** Escape a literal run for a regex. */
const escapeRun = (run) => run.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * ⭐ RECOVER WHAT EACH PLACEHOLDER BECAME, by aligning a face's RAW text against the rendered
 * page text. See the header: this is a read of the render, never a second draw.
 *
 * The raw is cut at every `{name}`; the literal runs between them are escaped and the gaps
 * become lazy captures. The match is UNANCHORED and case-insensitive at the head, because a
 * compound pair lowercases the second half's first letter (`openLowercased`) and drops the
 * first half's terminal stop (`joinPairFaces`), so an anchored or case-sensitive pattern would
 * miss exactly the units ruling 23 is about.
 *
 * ⛔ IT ANSWERS `null` RATHER THAN GUESSING. A raw whose literal runs are too short to anchor
 * on, or a rearrangement the pattern cannot follow, yields no match and the caller records
 * `recovered: false`. A wrong fill on the card would be a false fact handed to the model, which
 * is the one thing the whole boundary exists to prevent.
 * @param {string} raw the face's text with its placeholders
 * @param {string} rendered the page's text for the unit the face is in
 * @returns {Array<{slot: string, value: string}>|null} one row per placeholder in source order,
 *   a `{v:…}` verb row spelled with its `v:` prefix so the caller can keep the two apart
 */
export function recoverFills(raw, rendered) {
  const names = [];
  let pattern = '';
  let at = 0;
  // ⛔⛔ THE VERB SLOT IS IN THE CLASS, AND HOW IT ENTERS WAS A DEFECT CAUGHT TWICE.
  //   (i)  LEAVING IT OUT. `{v:say}` is not a fill — it is a verb agreed to the number of the
  //        role before it (`fillRoleSlots`) — so the first cut excluded it from the class. An
  //        excluded placeholder does not vanish: it stays in the LITERAL RUN, and `\{v:say\}`
  //        cannot match the rendered `says`. Four of 708 draws on a forty-town probe failed to
  //        align, and all four were v3 faces — the very ones whose ROLES the card most wants.
  //   (ii) CAPTURING IT LAZILY. Admitted as `(.+?)`, `{tavern} {v:name}` against "A driver off
  //        the coach names who…" recovered `tavern = "A"` and `v:name = "driver off the coach
  //        names"`. Both wrong, and a wrong fill on the card is a FALSE FACT handed to the
  //        model, which is the one thing this whole boundary exists to prevent.
  // THE CURE IS THAT A VERB IS NOT UNKNOWN. `agreeVerb` is total over a base and a number and
  // its two answers are the only two strings the slot can become, so the verb enters as an
  // ALTERNATION OF ITS OWN TWO FORMS rather than as a capture of anything. That anchors the
  // role slot beside it, and the `(.+?)` before it now ends exactly where the verb begins.
  const re = /\{(v:[a-z]+|[a-zA-Z_][a-zA-Z0-9_]*)\}/g;
  for (let m = re.exec(raw); m !== null; m = re.exec(raw)) {
    pattern += escapeRun(raw.slice(at, m.index));
    const verb = /^v:([a-z]+)$/.exec(m[1]);
    if (verb) {
      const forms = [...new Set([agreeVerb(verb[1], 'sg'), agreeVerb(verb[1], 'pl')])];
      pattern += `(${forms.map(escapeRun).join('|')})`;
    } else {
      pattern += '(.+?)';
    }
    names.push(m[1]);
    at = m.index + m[0].length;
  }
  if (names.length === 0) return [];
  // The tail loses a terminal stop when a compound pair takes the lead half, so it is optional.
  pattern += escapeRun(raw.slice(at)).replace(/\\\.$/, '\\.?');
  let match;
  try { match = new RegExp(pattern, 'i').exec(String(rendered)); } catch { return null; }
  if (!match) return null;
  return names.map((slot, i) => rec([['slot', slot], ['value', String(match[i + 1]).trim()]]));
}

/** A recovered row that is a VERB agreement rather than a slot value. */
const isVerbRow = (r) => String(r.slot).startsWith('v:');

/**
 * ⭐⭐ THE SPINE'S LEVEL-1 MOVE ORDER, AND THE LICENCE THAT NAMES IT (chair ruling 26, W3a car 2).
 *
 * ⛔ THE MEASUREMENT THAT PUT THIS ON THE CARD. On the first simulated page, FOUR of the five
 * units that fell back to the corpus fell for `CORPUS-DIFF · a level-1 order lost on a spine` —
 * the AI spine did not realise the closed move order the corpus spine realises. The card carried
 * the spine and not its ORDER, so the model was refused for a rule it was never given, which is
 * an instrument defect and not a model failure. It is also why the CONSERVATIVE writer scored
 * better than the freer one on that arm: the arm was measuring distance from the corpus, which
 * is a silent tax on the better rewrite rather than a truth rule.
 *
 * ⛔ AN AMBIGUOUS ID KEEPS BOTH LICENCES AND ONE MOVE LIST. `orderIdOf` answers `V3|V8` where two
 * orders share a move list and differ only in the ABSENCE CLASS (a world LACK against a record
 * GAP), which no lexical read settles. Both members have the SAME `order`, so the move list is
 * unambiguous; the licences are joined so the model is told what either reading would need, and
 * the card never picks one on the walker's behalf.
 *
 * @param {string} spine the variant's raw spine text
 * @returns {{id: string, moves: string[], licences: string}}
 */
function orderOf(spine) {
  const id = spine ? orderIdOf(classifyMoves(spine)) : '';
  const members = id ? id.split('|').filter((m) => LEVEL1_ORDERS[m]) : [];
  return rec([
    ['id', id],
    ['moves', members.length ? [...LEVEL1_ORDERS[members[0]].order] : []],
    ['licences', members.map((m) => LEVEL1_ORDERS[m].licences).join(' | ')],
  ]);
}

/**
 * Which compromised source of this town, if any, this pool's SYMPTOM marks — read off the
 * composer's own exported table, so the card and the page consult ONE list.
 * @param {string} blockId @param {string} poolKey @param {ReadonlySet<string>} compromised
 * @returns {string|null}
 */
export function symptomSourceOf(blockId, poolKey, compromised) {
  if (!compromised || compromised.size === 0) return null;
  for (const r of COMPROMISED_SYMPTOM_POOLS) {
    if (r.block !== blockId || !compromised.has(r.source)) continue;
    if (r.pools.includes(poolKey)) return r.source;
  }
  return null;
}

/**
 * Read a dotted engine field off a settlement. The static card's field names are the census's
 * spelling (`settlement.` already stripped), and a `[bucket=x]` roster projection is not a path
 * — those answer `undefined` rather than throwing.
 * @param {object} s @param {string} field
 * @returns {unknown}
 */
export function valueAt(s, field) {
  if (/[[(]/.test(field)) return undefined;
  let held = s;
  for (const seg of String(field).split('.')) {
    if (held === null || typeof held !== 'object') return undefined;
    held = held[seg];
  }
  return held;
}

/**
 * A value the card may carry. The card is plain data handed to a model, so a whole roster or a
 * deep object is summarised rather than inlined: the model is being told WHAT THE FIELD SAYS,
 * and a 40-row array says nothing a sentence can use. A primitive rides whole.
 * @param {unknown} value
 * @returns {string|number|boolean|null}
 */
export function fieldValue(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) return `[${value.length} rows]`;
  return `{${Object.keys(value).sort(compareCodepoint).join(', ')}}`;
}

/**
 * ⭐⭐ WHY A READING HAS NO VALUE — AND WHY THE CARD MAY NOT SAY "THE ENGINE HAS NOT DECIDED IT"
 * (W3b car 2).
 *
 * ⛔⛔ MEASURED, AND IT IS A FINDING ABOUT THE CARD RATHER THAN ABOUT THE ENGINE. RUN 2's second
 * reader named "an ABSENCE asserted on a NULL read" as the writer's commonest invention, citing
 * `prosperityRank = null` and a pool whose every read printed null. So the readings were counted.
 * Over the pinned town's THIRTEEN TABS, 34 field rows carry a value and 42 print `null` — and NOT
 * ONE of the 42 is a settlement path that resolves to nothing. Eight are EXPRESSIONS `valueAt`
 * refuses by construction (`magicWorksAt({ settlement })`, `prosperityRank(...)`,
 * `standingDefenseForces(settlement)`); the other 34 are not settlement paths at all — they are
 * the DESK'S OWN LOCAL NAMES as the census recorded them (`readings.scores`, `axis`,
 * `conflict.intensity`, `link.npcConnections`, `!hasPatron`), and a settlement has no `readings`
 * key to walk into. Over the whole static table: 125 field paths, 23 expressions and 65 whose root
 * is not a settlement key, so 88 of 125 can NEVER resolve here.
 *
 * ⛔ THAT MAKES THE OBVIOUS WORDING A FALSE FACT ON THE CARD. `overview :: scores.military:
 * STRONG` prints `readings.scores = null` beside a pool key that says STRONG in terms: the engine
 * decided it and the CARD cannot read it. Telling a model "the engine has not decided this" there
 * would hand it a falsehood, which is the one thing this whole boundary exists to prevent (see the
 * header on `recoverFills` answering null rather than guessing). So the card names the two cases
 * apart and asserts only what it knows:
 *   `decided`     — a value, printed.
 *   `not-decided` — a real settlement path whose leaf is absent here. The engine has not decided it.
 *   `unreadable`  — an expression, or a path whose ROOT is not a key of a settlement. The card
 *                   cannot resolve this reading; nothing follows about the engine.
 * Both of the last two set `unknown: true`, because from the WRITER's seat they are one fact: you
 * have not been told a value, so you may assert nothing that depends on one.
 *
 * REPORTED, NOT FIXED HERE: normalising the census's 65 desk-local field spellings to settlement
 * paths would give the model real values on about half the corpus's pools, and it is a census
 * change (`scripts/scribe-static-card.mjs` and the wiring census's `reads` column) rather than a
 * card change. It is the single largest lever left on the Scribe's coverage.
 *
 * @param {object} s the settlement @param {string} field the static table's field path
 * @param {string|number|boolean|null} value the card's own `fieldValue` reading
 * @returns {'decided'|'not-decided'|'unreadable'}
 */
export function fieldState(s, field, value) {
  if (value !== null) return 'decided';
  const path = String(field ?? '');
  // `valueAt` refuses a path carrying a call or an index by construction; so does this.
  if (path === '' || /[[(]/.test(path)) return 'unreadable';
  const root = path.split('.')[0];
  if (!s || typeof s !== 'object') return 'unreadable';
  return Object.prototype.hasOwnProperty.call(s, root) ? 'not-decided' : 'unreadable';
}

/**
 * ⭐ THE READINGS ONLY A CAMPAIGN WORLD DECIDES (W3b car 2). A pool every one of whose reads is
 * one of these is answering a question about a world the settlement does not belong to, and on a
 * headless town its key is the DEFAULT rather than a decision.
 *
 * ⛔ IT IS A NAMED TABLE AND NOT A SCATTERED HEURISTIC, and it is deliberately NARROW. Measured
 * over the pinned town's thirteen tabs it catches exactly three pools — `DS-DEF-4 :: capture none`
 * (the one the chair named; its only decided field is the town's own `name`, which licenses
 * nothing about capture), `DS-FTH-2 :: PRIVATE DOSSIER` and `DS-POW-7 :: layer DORMANT` — and the
 * last two carry no decided field either way. `capture` alone is NOT in the table: it would have
 * taken `DS-ECO-6`'s `eco.safetyProfile.blackMarketCapture`, which is this town's own economy and
 * a real decided value. The count is pinned in `tests/domain/townCard.test.js`.
 * @type {ReadonlyArray<string>}
 */
export const WORLD_ONLY_READINGS = Object.freeze([
  'capturestate', 'faction', 'blocs', 'politics', 'patron', 'realm', 'neighbour', 'neighbor', 'treaty',
]);

/**
 * ⭐⭐ CAN THIS POOL BE WRITTEN ON THIS TOWN AT ALL (W3b car 2)?
 *
 * ⛔ THE MEASUREMENT. RUN 2 shipped 51 of 198 units from one seat and 60 of 198 from the other,
 * and the shipped share tracked the CARD'S THINNESS exactly: defense 35 per cent, overview 33,
 * economics 21, power 13. The chair's reading is that the disease is GAP-FILLING ON A THIN CARD,
 * so a pool the card cannot license is better OMITTED than written and refused — the two land the
 * same line (the hand corpus draws the pool either way), and only one of them spends a model's
 * invention on it.
 *
 * FALSE on either count:
 *   (a) NO DECIDED FIELD. Every field row is unknown and no read resolved to a value here. With
 *       the static table's `fields` being the resolution of its `reads`, "no read resolves" and
 *       "no field is decided" are the same statement, and both are spelled so the rule reads like
 *       the rule. A pool with NO field rows at all is included: it has nothing either.
 *   (b) WORLD-ONLY ON A HEADLESS TOWN. Every read is a `WORLD_ONLY_READINGS` word and the card
 *       carries no world, so the pool key is the default and not a decision.
 *
 * ⛔ A POOL WITH NO STATIC ROW IS WRITEABLE, and that is not a loophole. Where the static table
 * was not joined the card carries no `fields` for ANY pool and says so in `staticCardJoined`;
 * answering "not writeable" for all of them would be a claim the card has no basis for, and would
 * silently turn the whole feature off on a client that forgot one input.
 *
 * @param {ReadonlyArray<object>} fields the pool's own field rows, already classified
 * @param {object|null} staticRow @param {boolean} hasWorld
 * @returns {boolean}
 */
function writeableOf(fields, staticRow, hasWorld) {
  if (!staticRow) return true;
  const reads = Array.isArray(staticRow.reads) ? staticRow.reads.map((r) => String(r).toLowerCase()) : [];
  const decided = fields.filter((f) => f.unknown !== true);
  if (decided.length === 0 && (reads.length === 0 || decided.length === 0)) return false;
  if (!hasWorld && reads.length > 0
    && reads.every((r) => WORLD_ONLY_READINGS.some((w) => r.includes(w)))) return false;
  return true;
}

/** The roles a source can speak through here, as a plain sorted list. */
function rosterRows(roles, source) {
  const held = roles.get(source);
  if (!Array.isArray(held)) return [];
  return held
    .map((r) => rec([['role', r.role], ['n', r.n]]))
    .sort((a, b) => compareCodepoint(String(a.role), String(b.role)));
}

/**
 * ⭐ THE TOWN'S OWN ROWS — corpus-card sections (2), (2b), (2c) and (7), collapsed to this town.
 * @param {object} s @param {object|null} world
 */
function townOf(s, world) {
  const sources = [...sourcesOf(s)].sort(compareCodepoint);
  const roles = rolesOf(s);
  const compromised = [...compromisedSourcesOf(s)].sort(compareCodepoint);
  const live = liveInstitutions(s);
  const forces = standingDefenseForces(s);
  const arms = deriveArmedForces(s);
  return sorted([
    ['id', String(s.id ?? '')],
    ['name', String(s.name ?? '')],
    ['tier', String(s.tier ?? '')],
    ['culture', String(s.config?.culture ?? '')],
    ['sources', sources],
    // ⛔ AN ARRAY OF ROWS, NEVER AN OBJECT KEYED ON A SOURCE WORD. `court`, `watch`, `market` and
    // `garrison` are fields the desks READ; see the header. The same discipline `faceSources.js`
    // keeps with `Set#add`, kept here with a sorted list.
    ['roles', sources.map((source) => rec([['source', source], ['roster', rosterRows(roles, source)]]))],
    ['compromised', compromised],
    ['compromisedRate', COMPROMISED_SPEAKS],
    // (2)/(2b): the rows the town HAS, with the services actually on each.
    ['institutions', live
      .map((inst) => rec([
        ['name', nativeSemanticName(inst)],
        ['category', String(inst?.priorityCategory ?? inst?.category ?? '')],
        ['services', [...new Set((Array.isArray(inst?.services) ? inst.services : [])
          .map((x) => (typeof x === 'string' ? x : x?.name)).filter(Boolean))].sort(compareCodepoint)],
      ]))
      .filter((r) => r.name !== '')
      .sort((a, b) => compareCodepoint(String(a.name), String(b.name)))],
    // (2b): the armed-forces filing the page derived, and the typed force buckets beside it.
    ['armedForces', sorted(Object.entries(arms).map(
      ([bucket, rows]) => [bucket, (Array.isArray(rows) ? rows : []).map((r) => String(r?.name ?? '')).filter(Boolean).sort(compareCodepoint)],
    ))],
    ['forceBuckets', sorted(['militia', 'watch', 'garrison'].map(
      (bucket) => [bucket, forces?.[bucket]?.present === true],
    ))],
    // ⭐ (7) THE HOLDER ROWS — added in W2 under the chair's ruling on W1's open item.
    // A13 asks whether the body that keeps a cited record is INTERESTED in the fact it holds.
    // Reading that needs impairments and capture state, which live on the SETTLEMENT, so a
    // refuter given the card alone could only say NOT-EXECUTABLE (W1 measured that gap). The
    // card builder has the settlement, so the standing is resolved HERE, once, and the
    // server-side refuter reads the answer instead of the question.
    //
    // ⛔ THE TWO ABSENCES ARE PRINTED, NOT GUESSED. `captured` and `controlled` are campaign
    // world facts (faction states, patronage) that a headless card does not hold; `standingOf`
    // names each gap in `absent` rather than reading false, and everything else the limb needs
    // — corruption, impairment, the birth-time capture of the ruling structure — is on the blob
    // and IS read. So this row is a partial but truthful standing, exactly as the arm is.
    ['holders', HOLDER_KINDS.map((kind) => holderRow(s, kind))],
    ['hasWorld', Boolean(world)],
  ]);
}

/**
 * One holder row: who in this town keeps the kind's record, and whether they have an interest
 * in it. This is `sourceOfForTown`'s pair loop read from the KIND rather than from a row's
 * `reads`, so the card can carry all twelve kinds without a pool to hang each one on.
 * @param {object} s @param {string} kind
 */
function holderRow(s, kind) {
  const named = holdersOf(kind, s);
  const record = recordOf(kind);
  /** @type {string[]} */
  const marks = [];
  /** @type {string[]} */
  const absent = [];
  let interested = false;
  for (const holder of named) {
    const standing = standingOf(holder, s, {}, kind);
    if (standing.interested) interested = true;
    for (const mark of standing.marks) marks.push(`${holder}: ${mark}`);
    for (const gap of standing.absent) if (!absent.includes(gap)) absent.push(gap);
  }
  return sorted([
    ['kind', kind],
    ['holders', named],
    ['rosterBacked', Boolean(record && record.rosterBacked)],
    ['standing', named.length === 0 ? 'SOURCE-UNRESOLVED' : (interested ? INTERESTED : 'LICENSED')],
    ['interested', interested],
    ['marks', marks],
    ['absent', absent],
  ]);
}

/**
 * ⭐ THE EPOCH IDENTITY. See the header: nothing on the blob changes once per advance, so the
 * epoch is the CAMPAIGN's and the blob's own numbers ride beside it as what they are.
 * @param {object} s @param {object|null} world
 */
function epochOf(s, world) {
  const campaignEra = (s.history?.historicalEvents || []).filter((e) => e?.campaignEra === true);
  return sorted([
    // ⚠ FROZEN, AND SAID SO ON THE CARD. `renderYearOf` is `history.age`, which the engine never
    // advances (see the header). It is carried because it is the number the compromised roll is
    // keyed on and the card must state what the page used, not what it should have used.
    ['renderYear', renderYearOf(s)],
    ['renderYearIsFrozen', true],
    ['tick', world && typeof world.tick === 'number' ? world.tick : null],
    ['calendar', world && world.calendar ? sorted(Object.entries(world.calendar)
      .filter(([, v]) => typeof v === 'string' || typeof v === 'number')) : null],
    ['advanced', Boolean(world && typeof world.tick === 'number' && world.tick > 0)],
    ['campaignEraEvents', campaignEra.length],
    // The one on-blob tick stamp there is. MEASURED to STALL: the granary reaches equilibrium
    // and this freezes while the world advances (20 mismatches over 240 driven ticks), so it is
    // a last-time-food-moved stamp and never an epoch. Carried as the diagnostic it is.
    ['foodStockpileLastTick', typeof s.economicState?.foodSecurity?.stockpile?.lastTick === 'number'
      ? s.economicState.foodSecurity.stockpile.lastTick : null],
  ]);
}

/**
 * ⭐ THE TYPED RECORD OF THE LAST ADVANCE, where it is cheaply reachable — which is ONLY through
 * the campaign's `worldState.pulseHistory`, capped at 80 rows (`worldState.js:16`) and appended
 * once per committed advance. Nothing equivalent lives on the settlement: `settlement.events`
 * does not exist, `recentEvents` has no writer, and `history.historicalEvents[campaignEra]` is a
 * 20-row MILESTONE tail most advances never touch. With no world this is `null`, which is the
 * true statement for a town that has never been advanced.
 * @param {object} s @param {object|null} world
 */
function lastAdvanceOf(s, world) {
  const history = world && Array.isArray(world.pulseHistory) ? world.pulseHistory : [];
  const record = history.length > 0 ? history[history.length - 1] : null;
  if (!record) return null;
  const id = String(s.id ?? '');
  const mine = (rows) => (Array.isArray(rows) ? rows : []).filter(
    (r) => !r || (r.saveId ?? r.settlementId ?? id) === id,
  );
  return sorted([
    ['id', String(record.id ?? '')],
    ['tick', typeof record.tick === 'number' ? record.tick : null],
    ['interval', String(record.interval ?? '')],
    ['committed', record.committed === true],
    ['calendar', record.calendar ? sorted(Object.entries(record.calendar)
      .filter(([, v]) => typeof v === 'string' || typeof v === 'number')) : null],
    // The per-settlement slice of the record, and only that: a card is about one town.
    ['summary', mine(record.timeTicks).flatMap((r) => (Array.isArray(r?.summary) ? r.summary : []))],
    ['outcomes', mine(record.mechanicalOutcomes).concat(mine(record.consequenceOutcomes))
      .map((o) => rec([
        ['id', String(o?.id ?? '')], ['type', String(o?.type ?? '')],
        ['ruleId', String(o?.ruleId ?? '')], ['headline', String(o?.headline ?? '')],
        ['summary', String(o?.summary ?? '')],
      ]))],
    ['corruption', mine(record.corruptionEvents).map((e) => rec([
      ['name', String(e?.name ?? '')], ['kind', String(e?.kind ?? '')],
    ]))],
    ['factionCapture', mine(record.factionCaptureEvents).map((e) => rec([
      ['name', String(e?.name ?? '')], ['kind', String(e?.kind ?? '')],
    ]))],
  ]);
}

/**
 * ⭐⭐ ONE FIRED POOL, AS THE CARD CARRIES IT — the design's §3.1 part 3, THE POOL DELTA.
 * @param {object} s @param {object} line one composed PageLine
 * @param {{seed: string, compromised: ReadonlySet<string>, roles: Map<string, object[]>,
 *   sources: string[], year: number, staticCard: object|null}} ctx
 */
function poolRow(s, line, ctx) {
  const blockId = String(line.block ?? '');
  const poolKey = String(line.pool ?? '');
  const variant = variantAt(blockId, poolKey, line.vid);
  const pieces = Array.isArray(line.pieces) ? line.pieces : [];
  const headRaw = variant ? faceRawOf(variant, typeof line.face === 'number' ? line.face : 0) : '';
  const fills = variant ? recoverFills(headRaw, line.text) : null;
  const forced = symptomSourceOf(blockId, poolKey, ctx.compromised);
  const faceSources = [...new Set(pieces.map((p) => p?.source).filter(Boolean))].sort(compareCodepoint);
  const staticRow = ctx.staticCard?.pools?.[`${blockId}::${poolKey}`] || null;
  // (d) THE FROZEN FIELDS' ACTUAL VALUES, with the classification from the static table — and,
  // since W3b, WHETHER THERE IS A VALUE AT ALL and why not. See `fieldState`.
  const fields = staticRow
    ? (staticRow.fields || []).map((field) => {
      const meta = ctx.staticCard?.fields?.[field] || null;
      const value = fieldValue(valueAt(s, field));
      const state = fieldState(s, field, value);
      return sorted([
        ['field', field],
        ['value', value],
        ['state', state],
        ['unknown', state !== 'decided'],
        ['clock', meta?.clock ?? null],
        ['writers', meta?.writers ?? null],
        ['status', meta?.status ?? null],
        ['grain', meta?.grain ?? null],
      ]);
    })
    : [];
  return sorted([
    ['blockId', blockId],
    ['poolKey', poolKey],
    ['mount', String(line.mount ?? '')],
    ['section', String(line.section ?? '')],
    // BOTH NUMBERS, under their own names. See `variantAt`.
    ['vid', variant && typeof variant.vid === 'number' ? variant.vid : null],
    ['authoredIndex', typeof line.vid === 'number' ? line.vid : null],
    ['face', typeof line.face === 'number' ? line.face : null],
    ['angle', String(variant?.angle ?? '')],
    ['marks', [...(variant?.marks || [])].sort(compareCodepoint)],
    ['pieces', pieces.map((p) => sorted(Object.entries(p || {})))],
    ['pairKinds', [...new Set(pieces.map((p) => p?.pairKind).filter(Boolean))].sort(compareCodepoint)],
    // The sources this unit's faces actually spoke through, and the roster each may draw from —
    // so the model may vary the person without inventing an office the town does not print.
    ['faceSources', faceSources],
    ['faceRoles', faceSources.map((source) => rec([
      ['source', source], ['roster', rosterRows(ctx.roles, source)],
    ]))],
    // ⭐ THE FILLS, THE DRAWN ROLES AND THE AGREED VERBS — all three out of ONE alignment.
    // `declared` is what the variant NAMES; `fills` is what each `{slot}` became on this town,
    // INCLUDING the person a `{hall}`-shaped role slot drew, which is how the card answers
    // ruling 25's "through whom" without a second draw; `verbs` is the number agreement, kept
    // apart because a verb is not a value.
    ['slots', sorted([
      ['declared', [...(variant?.slots || [])].sort(compareCodepoint)],
      ['fills', (fills || []).filter((r) => !isVerbRow(r))],
      ['verbs', (fills || []).filter(isVerbRow)],
      ['recovered', fills !== null],
    ])],
    // ⭐ THE COMPROMISED ROLL, on the SAME key the page used. Present only where this pool's
    // SYMPTOM marks a source the engine holds a secret about — on every other pool the mechanism
    // is inert and a row here would be noise the model might read as a signal.
    ['compromised', forced === null ? null : sorted([
      ['source', forced],
      ['speaks', compromisedSpeaks(ctx.seed, poolKey, String(s.id ?? s._seed ?? ''), ctx.year)],
      ['rate', COMPROMISED_SPEAKS],
      ['year', ctx.year],
    ])],
    // ⭐ THE CORPUS UNIT AS DRAWN — the exemplar and the fallback (§9). The spine and every face
    // the leaf holds, so the model sees the shape it is writing into and the line that ships if
    // it is refused — and, since W3a, the LEVEL-1 ORDER that spine realises, which is the one
    // rule the corpus-diff arm refuses on and the card did not carry. See `orderOf`.
    ['unit', sorted([
      ['rendered', String(line.text ?? '')],
      ['spine', String(variant?.text ?? '')],
      ['order', orderOf(String(variant?.text ?? ''))],
      ['faces', [...(variant?.wordings || [])].map(String)],
      ['faceSourceTags', [...(variant?.sources || [])].map((x) => (x === null ? null : String(x)))],
      ['pairs', [...(variant?.pairs || [])].map((p) => (p ? sorted(Object.entries(p)) : null))],
    ])],
    ['static', staticRow ? sorted([
      ['wiring', staticRow.wiring], ['keyFunction', staticRow.keyFunction],
      ['rung', staticRow.rung], ['reads', staticRow.reads], ['covert', staticRow.covert],
      ['variants', staticRow.variants], ['rateBp', staticRow.rateBp],
    ]) : null],
    ['fields', fields],
    // ⭐ CAN THIS POOL BE WRITTEN ON THIS TOWN AT ALL. See `writeableOf`: a pool the card cannot
    // license is OMITTED rather than written and refused, because both land the same hand-corpus
    // line and only one of them spends a model's invention on getting there.
    ['writeable', writeableOf(fields, staticRow, ctx.hasWorld === true)],
  ]);
}

/**
 * ⭐⭐ THE TOWN CARD.
 *
 * @param {object} settlement a generated settlement
 * @param {{tab: string, audience?: string, world?: object|null,
 *   staticCard?: object|null}} options
 *   `tab` is one of `SCRIBE_TABS`; `audience` is `dm` or `player` (an unrecognised one reads as
 *   the player's, kernel law 2); `world` is the OWNING CAMPAIGN's world state, which the epoch
 *   and the last advance are read from and which a headless town does not have; `staticCard` is
 *   the parsed `docs/content/scribe-static-card.json` — see the header on why it is an input
 * @returns {object} plain, key-sorted, JSON-serialisable, byte-stable
 */
export function townCard(settlement, options) {
  const s = settlement && typeof settlement === 'object' ? settlement : {};
  const opts = options && typeof options === 'object' ? options : {};
  const tab = String(opts.tab ?? '');
  const audience = opts.audience === 'dm' ? 'dm' : 'player';
  const world = opts.world || null;
  const staticCard = opts.staticCard || null;
  const seed = seedOf(s);
  const page = renderTabPage(s, tab, rec([['audience', audience], ['world', world]]));
  const ctx = rec([
    ['seed', seed],
    ['compromised', compromisedSourcesOf(s)],
    ['roles', rolesOf(s)],
    ['sources', [...sourcesOf(s)].sort(compareCodepoint)],
    ['year', renderYearOf(s)],
    ['staticCard', staticCard],
    // The one town-level fact a POOL row needs: `writeableOf`'s world-only limb is about a town
    // that belongs to no campaign, and the pool row has no other way to see it.
    ['hasWorld', Boolean(world)],
  ]);
  return sorted([
    ['schema', TOWN_CARD_SCHEMA],
    ['tab', tab],
    ['tabIsKnown', SCRIBE_TABS.includes(tab)],
    ['audience', audience],
    ['seed', seed],
    ['engineVersion', CARD_ENGINE_VERSION],
    ['staticCardJoined', staticCard !== null],
    ['epoch', epochOf(s, world)],
    ['lastAdvance', lastAdvanceOf(s, world)],
    ['town', townOf(s, world)],
    // ⛔ PAGE ORDER, NOT SORTED. Every other list on this card is sorted so two builds are
    // byte-equal; this one is byte-equal because the render is deterministic, and its ORDER is
    // a fact the refuter's page-level arms read. Sorting it would destroy the fact.
    ['pools', page.filter((l) => l.kind === 'composed').map((l) => poolRow(s, l, ctx))],
    // (c) THE MACHINE LINES ACTUALLY ON THE TAB, in page order — the marker card's (3)/(4)
    // collapsed to the literal page. The composed rows are here too, so the model reads the page
    // as a reader meets it rather than as two lists it must interleave itself.
    ['page', page.map((l) => sorted(Object.entries(l).filter(([k]) => k !== 'pieces')))],
    ['mounts', DOSSIER_MOUNTS.filter((m) => m.tab === tab)
      .map((m) => sorted([['mount', m.mount], ['blockId', m.blockId], ['rung', m.rung], ['desk', m.desk]]))],
  ]);
}

/**
 * The card as the bytes that cross the boundary. Named so the size pin, the pilot's token count
 * and the transport all measure ONE serialisation.
 * @param {object} card
 * @returns {string}
 */
export const townCardJson = (card) => JSON.stringify(card);
