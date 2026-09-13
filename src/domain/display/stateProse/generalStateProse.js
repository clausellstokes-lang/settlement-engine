/**
 * domain/display/stateProse/generalStateProse.js — THE OVERVIEW / RELATIONS / POPULATION /
 * HOOKS DESK, and the largest leaf in the corpus.
 *
 * `general.generated.js` is 23 blocks and 634 variants — DS-GEN- plus DS-REL-, DS-POP- and
 * DS-HK- — every one of them dark before this file existed. This desk turns live settlement
 * state into pool keys for the blocks whose producers actually carry the evidence the prose
 * claims, and says in writing which ones do not.
 *
 * ── ⛔ THE ONE-CALLER RULE IS THIS LEAF'S BINDING CONSTRAINT, AND IT BOUNDS THIS CAR ──
 * The mount registry's ARM 2 requires EXACTLY ONE caller per desk — two call sites are two
 * places to forget the public-dossier gate, and that gate has already shipped broken twice.
 * Every desk before this one lived on ONE tab, so the tab was both the caller and the gate.
 *
 * THIS LEAF DOES NOT LIVE ON ONE TAB. Its 23 blocks address overview, history, viability,
 * relationships, population, power and economics. So the caller can be one of exactly two
 * things: the tab that owns the largest honest share of the leaf, or a single shared reader
 * that every tab renders. This car takes the FIRST, and `OverviewTab.jsx` is the caller: the
 * blocks below are the ones the Overview page already draws the state for — the Systems
 * Health dashboard, the ground, the market and the institution roster are all rendered
 * there today — so the mount rows name positions that exist rather than positions a later
 * car will have to build.
 *
 * ⭐ THE SECOND OPTION IS THE ONE THE REST OF THE LEAF NEEDS, AND IT IS COSTED HERE SO
 * NOBODY RE-DERIVES IT. A single `<GeneralStateProse mount=… publicDossier=… />` reader
 * under src/components, rendered by each owning tab, keeps ARM 2 satisfied while letting
 * `DS-GEN-9`, `DS-GEN-11`, `DS-GEN-18` and the relations blocks land on THEIR pages. It
 * costs nothing in bytes over this arrangement — the corpus leaf enters the bundle the
 * moment any desk imports it, and the tabs are per-tab lazy chunks either way — but it is a
 * new component and a router pass, so it is named as its own act rather than smuggled into
 * a desk car. What must NOT happen is the third option: putting the call in
 * `OutputContainer.jsx`, which would pull this 182 KB leaf into the eager 457 kB dossier
 * chunk instead of a tab's own lazy one.
 *
 * ── ⭐⭐ THREE LABEL TRAPS, MEASURED, ALL IN ONE BLOCK ────────────────────────────────
 * The standing rule in dossierMounts.js is KEY ON THE CANONICAL PRODUCER TOKEN, NEVER ON THE
 * CORPUS WORD. DS-GEN-3 carries three separate instances of the trap, and a `label` route
 * would have darkened a different pool in each:
 *
 *   1. FOOD. The producer writes `Deficit — Active Famine` (foodGenerator.js:342). The pool
 *      is spelled `foodSecurity.label: Deficit × Active Famine`. An em dash against a
 *      multiplication sign — and the pool it darkens is the FAMINE one, the single most
 *      consequential state the block describes. The other five labels are identities, so a
 *      label route would have looked correct on five of six towns.
 *   2. PROSPERITY. Every pool is a PAIR (`Struggling / Poor`), so no pool key equals any
 *      producer label. The bottom pool is `Poverty / Impoverished` and `deriveProsperityLabel`
 *      emits NEITHER word — see the dormancy note on PROSPERITY_POOL_OF.
 *   3. SAFETY. The pool keys name head-word SETS, and the producer's head-word vocabulary is
 *      larger than the union of them — see the residue note on SAFETY_POOL_OF. Six emitted
 *      head words reach no pool, and one corpus word is emitted by nothing.
 *
 * Every one of the maps below is asserted TOTAL IN BOTH DIRECTIONS in the desk test: every
 * producer token has a pool or is named as measured residue, and every pool of the block is
 * claimed by at least one token or is named as unreachable.
 *
 * ── ⭐ MEASUREMENT OR DEFAULT ────────────────────────────────────────────────────────
 * A key this desk cannot derive returns `null` and the surface renders NOTHING. Nothing here
 * falls back to a neighbouring pool: a wrong sentence about a town is worse than no sentence,
 * and every dead arm this subsystem has shipped was a default wearing a reading's clothes.
 *
 * ── THE TWO DOMAIN IMPORTS ARE FREE, AND BOTH ARE CANONICAL LADDERS ──────────────────
 * `defenseScoreBands.js` is a pure zero-import leaf already reached by three dossier chunks,
 * so `scoreBand` — the one 65/40/20 cut the PDF and the Defense tab already print — costs
 * nothing here. `institutionRoster.js` is the estate's single writer of the ruin question and
 * is reached by the whole roster-reading population already; `marketPoolKey` routes through
 * it for the reason written at that function. `prosperityRank.js` is deliberately NOT imported: this desk needs its
 * VOCABULARY, not its arithmetic, and the desk test asserts PROSPERITY_POOL_OF total against
 * `PROSPERITY_RANK` where a test import costs no production bytes.
 *
 * @enforced-by tests/domain/generalStateProseDesk.test.js
 */
import { DOSSIER_STATE_PROSE_GENERAL } from '../../../data/dossierStateProse/general.generated.js';
import { scoreBand } from '../defenseScoreBands.js';
import { liveInstitutions } from '../../institutions/institutionRoster.js';
// ⭐ DS-GEN-18's JOIN, AND THE WEIGHT IS ALREADY PAID. `homeFedChain` must reduce two
// ledgers that speak different resource vocabularies to one token, and this is the estate's
// single canonical reduction — the same one `computeActiveChains.js:190` applies to the
// chain side. Its whale, `data/resourceData.js`, is ALREADY in the eager `data` chunk with
// its own first-paint consumer (vite.config.js:806, FP-G11), so the desk takes on the
// reducer and not the table. A second, desk-local spelling of the reduction is the fork
// that drifts — and it is precisely the fork that darkened this pool for 768 towns.
import { resourceKeyForLabel } from '../../resourceSemantics.js';
// FREE: `heraldCausalGrammar.js` is a ZERO-IMPORT display leaf, and it holds §0d's own
// six-band duration table in its four print positions. ⚠ TWO SIBLING DESKS DECLINED
// `{timeband_age}` FOR WANT OF A "duration former in the tree" (powerStateProse.js:900,
// stressorsStateProse.js:78) — `timeBandOf`/`timeBandWord` ARE that former, and the
// declination is stale at this tip rather than wrong when it was written. Measured here,
// not assumed: see `yearBand` below.
import { timeBandOf, timeBandWord } from '../heraldCausalGrammar.js';
import { composeStateProse } from './composeStateProse.js';
import { withFaceSources } from './faceSources.js';
import { generalStateProseCandidates } from './generalStateProseCandidates.js';
import { legibilityRung } from './legibilityRung.js';

/** @typedef {import('./legibilityRung.js').LegibilityRung} LegibilityRung */

/**
 * The desk's corpus, typed at the import boundary — the generated leaves stay PURE DATA.
 * @type {import('./stateProseKernel.js').StateProseCorpus}
 */
const CORPUS = /** @type {import('./stateProseKernel.js').StateProseCorpus} */ (
  /** @type {unknown} */ (DOSSIER_STATE_PROSE_GENERAL)
);

/**
 * THE SHAPES THIS DESK BELIEVES ITS SLOTS HAVE, mirroring §0c's Shape column. The annex is
 * the authority; the projection contract test asserts this mirror against the parsed
 * register, so a drift reds rather than rendering.
 * @type {Readonly<Record<string, string>>}
 */
export const SLOT_FILL_SHAPES = Object.freeze({
  settlement: 'proper',
  govFaction: 'proper',
  faction: 'proper',
  faction2: 'proper',
  issue: 'phrase',
  stakes: 'phrase',
  // The history chapter. `{calamity}` is the annex's one `bare-common` fill in this leaf —
  // the seams supply their own article — and the two duration slots are `phrase` because
  // they land mid-sentence and must read lowercase there.
  event: 'proper',
  governing: 'proper',
  calamity: 'bare-common',
  timeband_since: 'phrase',
  timeband_age: 'phrase',
  // DS-GEN-18. `{institution}` is §0c's own row (a named house on the roster) and the two
  // supply slots are `bare-common` — the seams supply their articles ("the {resource}
  // stopped arriving", "works {good} it cannot raise").
  institution: 'proper',
  resource: 'bare-common',
  good: 'bare-common',
  // DS-GEN-8. `{steading}` and `{ruin}` are §0c-2 proper nouns — a satellite and a fallen
  // city, each by its own generated name.
  // ⛔ `{band}` IS NOT LISTED AND MUST NOT BE. §0c declares it RESERVED — one name for six
  // incompatible roles — and `fillShapeViolation` REFUSES a fill for it outright
  // (`RESERVED-SLOT-HAS-NO-DECLARABLE-FILL`). Four DS-GEN-8 variants name it and are dropped
  // by anchored liveness; every pool of the block keeps at least one variant that does not,
  // which the desk test asserts pool by pool. The steading head count therefore never
  // reaches a reader through this desk, which is also §0d's own answer.
  steading: 'proper',
  ruin: 'proper',
  // DS-REL-1. `{counterpart}` is the other end of a directed relation and `{npc}` is a cast
  // person named on a member receipt — both §0c `proper` rows, both filled from the link's
  // own record and never minted.
  counterpart: 'proper',
  npc: 'proper',
});

/**
 * This desk owns NO literal fill table, and the empty object is the honest declaration.
 * ⚠ `{good}` is named by ONE of DS-GEN-13's three ENTREPOT variants and is deliberately
 * unfilled: the pool's other two variants name only `{settlement}`, so anchored liveness
 * drops one sentence and no POOL is lost. Filling it would mean this desk choosing which
 * of a town's goods is THE good on the stalls, which is a content decision and not a
 * display one.
 * @type {Readonly<Record<string, Readonly<Record<string, string>>>>}
 */
export const SLOT_FILL_TABLES = Object.freeze({});

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * A `proper` fill, or `undefined` — the desk's own half of the shape contract, mirroring
 * `fillShapeViolation`'s PROPER branch in scripts/lib/dossier-slot-shapes.mjs.
 * @param {string} value @returns {string|undefined}
 */
function properFill(value) {
  if (!value) return undefined;
  if (/[—–]/.test(value)) return undefined;
  if (/[.!?]\s|[.!?]$/.test(value)) return undefined;
  if (/[0-9]/.test(value)) return undefined;
  if (/[a-z]+_[a-z]+/.test(value)) return undefined;
  return /^[A-Z]/.test(value) ? value : undefined;
}

// ── DS-GEN-3 · Overview › Systems Health ────────────────────────────────────────────

/**
 * The five score axes DS-GEN-3 bands, in the order the dashboard already prints them.
 * CLOSED: an axis the corpus does not write has no pool and would render nothing, so the
 * roster is stated here and asserted against the corpus in the desk test.
 * @type {ReadonlyArray<string>}
 */
const SCORE_AXES = Object.freeze(['military', 'monster', 'internal', 'economic', 'magical']);

/**
 * prosperity label → its DS-GEN-3 pool. CLOSED over `PROSPERITY_RANK`'s sixteen spellings.
 *
 * ⚠ NO POOL KEY IS A PRODUCER LABEL. Every pool is a PAIR of spellings (`Struggling / Poor`),
 * so `prosperity` can never be used as a pool key directly and a `label`-shaped route would
 * darken the block entirely rather than partially — which is the loud failure, and is
 * probably why nobody shipped one.
 *
 * ⛔ `Poverty / Impoverished` IS UNREACHABLE FROM A FRESHLY GENERATED SETTLEMENT, and that is
 * a FINDING rather than a defect of this map. `deriveProsperityLabel` emits exactly six
 * labels (`PROSPERITY_LABELS`), and neither `Poverty` nor `Impoverished` is among them;
 * `Poverty` is not even a `PROSPERITY_RANK` key, so it is a corpus word the tree never
 * writes. The three ALIASES that sit at or below the bottom emitted rung — `Subsistence`
 * (computeBaseProsperity's own bottom rung), `Impoverished` and `Destitute` — are routed
 * here, so the pool lights on a stored or hand-authored record that carries one, and stays
 * silent otherwise. Silence is correct: a town whose measured label is `Struggling` is not
 * impoverished, and printing the impoverished line over it would be a false statement.
 * @type {Readonly<Record<string, string>>}
 */
const PROSPERITY_POOL_OF = Object.freeze({
  // ── the six `deriveProsperityLabel` emits ──
  Struggling: 'prosperity: Struggling / Poor',
  Poor: 'prosperity: Struggling / Poor',
  Moderate: 'prosperity: Moderate / Modest',
  Comfortable: 'prosperity: Comfortable / Prosperous',
  Prosperous: 'prosperity: Comfortable / Prosperous',
  Wealthy: 'prosperity: Wealthy / Thriving',
  // ── the aliases, ordered by PROSPERITY_RANK rather than by guess ──
  Subsistence: 'prosperity: Poverty / Impoverished',
  Impoverished: 'prosperity: Poverty / Impoverished',
  Destitute: 'prosperity: Poverty / Impoverished',
  Meager: 'prosperity: Struggling / Poor',
  Modest: 'prosperity: Moderate / Modest',
  Stable: 'prosperity: Moderate / Modest',
  Thriving: 'prosperity: Wealthy / Thriving',
  Affluent: 'prosperity: Wealthy / Thriving',
  Opulent: 'prosperity: Wealthy / Thriving',
});

/**
 * safety HEAD WORD → its DS-GEN-3 pool. The head word is the part before the first em dash;
 * the suffix names a stressor and belongs to the stressor shape, which owns that prose.
 *
 * ⛔ THE RESIDUE IS THE FINDING, AND IT IS LARGER THAN THE ROUTE. `safetyProfile.js` can
 * emit FIFTEEN head words. Nine of them are named by the three pools and are routed below.
 * SIX ARE NOT NAMED BY ANY POOL — `Very Safe`, `Safe`, `Moderate` (the three no-stress base
 * labels) and `Critical`, `Volatile`, `Suspicious` (three strain labels) — and they render
 * NOTHING rather than falling into the nearest pool. And in the other direction the corpus
 * names `Secure`, which no branch of `safetyProfile.js` writes at all.
 *
 * ⚠ THE PRACTICAL CONSEQUENCE, STATED SO NOBODY READS THE SILENCE AS A BUG: the three
 * unrouted BASE labels are exactly what a town with no active stress reads, so this lens
 * speaks on troubled towns and is silent on calm ones. Mapping `Safe` onto the
 * `{Secure, Controlled, Quarantined}` pool would light it — and would be this lane deciding
 * that the corpus's `Secure` and the generator's `Safe` are the same reading, which is a
 * VOCABULARY ruling and belongs to whoever owns the words. Raised for the chair with both
 * directions measured; the desk test pins the residue so the day either side moves, the
 * number moves with it.
 * @type {Readonly<Record<string, string>>}
 */
const SAFETY_POOL_OF = Object.freeze({
  Secure: 'safetyProfile.safetyLabel: head word in {Secure, Controlled, Quarantined}',
  Controlled: 'safetyProfile.safetyLabel: head word in {Secure, Controlled, Quarantined}',
  Quarantined: 'safetyProfile.safetyLabel: head word in {Secure, Controlled, Quarantined}',
  Tense: 'safetyProfile.safetyLabel: head word in {Tense, Strained, Restricted, Unsafe}',
  Strained: 'safetyProfile.safetyLabel: head word in {Tense, Strained, Restricted, Unsafe}',
  Restricted: 'safetyProfile.safetyLabel: head word in {Tense, Strained, Restricted, Unsafe}',
  Unsafe: 'safetyProfile.safetyLabel: head word in {Tense, Strained, Restricted, Unsafe}',
  Dangerous: 'safetyProfile.safetyLabel: head word in {Dangerous, Desperate}',
  Desperate: 'safetyProfile.safetyLabel: head word in {Dangerous, Desperate}',
});

/**
 * food-security label → its DS-GEN-3 pool. A PERFECT six-for-six identity with
 * `foodGenerator.js`'s label ladder, and FIVE of the six are the label unchanged — which is
 * exactly why the sixth matters. The producer writes `Deficit — Active Famine`; the corpus
 * spells that pool `Deficit × Active Famine`. Keyed on the label through this closed map, so
 * the difference costs nothing and cannot drift back.
 * @type {Readonly<Record<string, string>>}
 */
const FOOD_POOL_OF = Object.freeze({
  Secure: 'foodSecurity.label: Secure',
  Surplus: 'foodSecurity.label: Surplus',
  Pressured: 'foodSecurity.label: Pressured',
  'Import-Dependent': 'foodSecurity.label: Import-Dependent',
  Deficit: 'foodSecurity.label: Deficit',
  'Deficit — Active Famine': 'foodSecurity.label: Deficit × Active Famine',
});

/**
 * readiness label → its DS-GEN-3 pool. A six-for-six identity with `defenseGenerator.js`'s
 * band table, written out rather than derived by concatenation so that RENAMING either side
 * reds the desk test instead of silently darkening one rung.
 * @type {Readonly<Record<string, string>>}
 */
const READINESS_POOL_OF = Object.freeze({
  Fortress: 'defenseProfile.readiness.label: Fortress',
  'Well-Defended': 'defenseProfile.readiness.label: Well-Defended',
  Defensible: 'defenseProfile.readiness.label: Defensible',
  'Lightly Defended': 'defenseProfile.readiness.label: Lightly Defended',
  Vulnerable: 'defenseProfile.readiness.label: Vulnerable',
  Undefended: 'defenseProfile.readiness.label: Undefended',
});

/**
 * One score axis's DS-GEN-3 pool, banded through the CANONICAL ladder. A non-numeric score
 * renders nothing: an absent score is not a zero, and banding 0 would report CRITICAL for a
 * settlement that simply has no defence profile — `avgScore`'s own stated reasoning.
 * @param {string} axis one of SCORE_AXES @param {unknown} score
 * @returns {string|null}
 */
export function systemsHealthScorePoolKey(axis, score) {
  if (!SCORE_AXES.includes(axis)) return null;
  if (typeof score !== 'number' || !Number.isFinite(score)) return null;
  const key = `scores.${axis}: ${scoreBand(score)}`;
  return CORPUS['DS-GEN-3'].pools[key] ? key : null;
}

/**
 * DS-GEN-3's prosperity pool. An unrecognised spelling renders NOTHING rather than reading
 * as the neutral rung: `PROSPERITY_RANK_NEUTRAL` exists so a CONSUMER of the 0..1 rank has a
 * middling number to compute with, and borrowing it here would print "neither rich nor poor"
 * over a town whose label this desk simply failed to recognise.
 * @param {unknown} label @returns {string|null}
 */
export function prosperityPoolKey(label) {
  const key = PROSPERITY_POOL_OF[text(label)];
  return key && CORPUS['DS-GEN-3'].pools[key] ? key : null;
}

/**
 * DS-GEN-3's safety pool, keyed on the HEAD WORD of a composite label.
 *
 * ⚠ THE SPLIT IS ON THE EM DASH AND ITS SPACES, matching the producer's own
 * `l.split(' — ')[1]` fold. One branch writes a strain label that ALREADY contains an em dash
 * (`Dangerous — Plague Unrest`) and then suffixes it again, so a real settlement can carry
 * `Dangerous — Plague Unrest — Plague Conditions`; taking the first segment is correct on
 * that shape and on every simpler one.
 * @param {unknown} safetyLabel @returns {string|null}
 */
export function safetyPoolKey(safetyLabel) {
  const label = text(safetyLabel);
  if (!label) return null;
  const head = label.split('—')[0].trim();
  const key = SAFETY_POOL_OF[head];
  return key && CORPUS['DS-GEN-3'].pools[key] ? key : null;
}

/**
 * DS-GEN-3's viability pool. STRICTLY BOOLEAN: `economicViability.viable` is a real boolean
 * on every generated settlement, and an absent one is a settlement with no viability verdict
 * rather than a settlement that failed. `undefined` renders nothing.
 * @param {unknown} viable @returns {string|null}
 */
export function viabilityPoolKey(viable) {
  if (viable !== true && viable !== false) return null;
  const key = `economicViability.viable: ${viable}`;
  return CORPUS['DS-GEN-3'].pools[key] ? key : null;
}

/**
 * DS-GEN-3's defence-readiness pool.
 * @param {unknown} label @returns {string|null}
 */
export function readinessPoolKey(label) {
  const key = READINESS_POOL_OF[text(label)];
  return key && CORPUS['DS-GEN-3'].pools[key] ? key : null;
}

/**
 * DS-GEN-3's food-security pool — THE LIVE FIELD, re-graded every tick, and the one lens of
 * the ten that is not a first-survey verdict.
 * @param {unknown} label @returns {string|null}
 */
export function foodSecurityPoolKey(label) {
  const key = FOOD_POOL_OF[text(label)];
  return key && CORPUS['DS-GEN-3'].pools[key] ? key : null;
}

/**
 * A `phrase` fill, or `undefined`. The adverbial/predicative shape: it supplies its own
 * everything, so it MAY carry a determiner, and it lands mid-sentence, so it must read
 * lowercase there.
 *
 * ⭐ IT DECAPITALISES AND IT REFUSES, AND THE SPLIT MATTERS. `conflicts.js` writes its
 * issues and stakes as sentence-case labels — `Control of the market licensing process`,
 * `Labor control` — and dropping them verbatim into "…disagree about {issue}" puts a
 * capital in the middle of a sentence, which `fillShapeViolation` convicts as
 * COMMON-FILL-IS-CAPITALISED. A leading `Xy` is therefore lowered, which is the ordinary
 * grammar of a mid-sentence noun phrase and nothing more.
 *
 * ⛔ ANYTHING ELSE IS REFUSED RATHER THAN REPAIRED — an acronym, an all-caps token, a
 * value starting with a digit or punctuation. Lowering `MP` to `mP` would be this desk
 * inventing a spelling, and anchored liveness dropping one variant is strictly better than
 * a mangled word in front of a reader. The desk test drives EVERY issue and stakes literal
 * the producer table carries through this function, so a future row that cannot conform is
 * a red here rather than a silent variant loss.
 * @param {unknown} value the raw producer field, normalised through `text` before any test
 *   — `unknown` and not `string` because both call sites read a conflict row off the
 *   caller's own record, where the field is whatever the producer wrote
 * @returns {string|undefined}
 */
function phraseFill(value) {
  const v = text(value);
  if (!v) return undefined;
  if (/[—–]/.test(v)) return undefined;
  if (/[.!?]\s|[.!?]$/.test(v)) return undefined;
  if (/[0-9]/.test(v)) return undefined;
  if (/[a-z]+_[a-z]+/.test(v)) return undefined;
  if (/^[A-Z][a-z]/.test(v)) return v[0].toLowerCase() + v.slice(1);
  return /^[a-z]/.test(v) ? v : undefined;
}

/**
 * ⛔ DS-GEN-1 IS LEFT DARK, AND THE REASON IS THAT ITS DIMENSION HAS NO PRODUCER.
 *
 * DS-GEN-1 (`history.currentTensions[]`) is the richest unlit block in this leaf — ten
 * tension types, fifty variants — and it sits one field away from speaking. It is not
 * mounted, deliberately, and this is the written reason so the next reader does not have to
 * re-derive it.
 *
 * THE MEASUREMENT. The projection demotes the block's `severity` into the kernel's law-5
 * dimension, whose vocabulary is one of `minor` / `major` / `catastrophic`. What the record
 * carries is an ARRAY — `["minor","major"]` — on 100 percent of tensions across 48 generated
 * settlements (8 seeds × 6 tiers, 90 tensions, 3 distinct shapes, 0 scalars).
 * `buildHistoricalEvent` spreads `{ ...tmpl }` out of `HISTORICAL_EVENTS_DATA` and never
 * collapses it, so the value is a property of the tension TYPE — the range that type may
 * take — identical on every settlement that carries it, and never a reading of this town.
 *
 * ⇒ ANY CHOICE HERE WOULD BE A DEFAULT WEARING A READING'S CLOTHES. `severity[0]` makes
 * every crime wave in every world MINOR and darkens three of the five variants in each of
 * the ten pools permanently; `severity[severity.length - 1]` does the same at the other end;
 * a seeded pick would be this desk inventing a fact about a town's crisis. And the kernel is
 * already right about this: it fails closed on an unanswered dimension, so the block stays
 * silent rather than half-true. Dormant is a true statement.
 *
 * THE ONE ACT THAT LIGHTS IT, and it is NOT a desk act. The producer must collapse the
 * template range to one value per settlement at generation, which the same file already does
 * twice — `generateEventNarrative` picks with `pick(eventTemplate.severity)`, and the
 * resource path collapses an array outright. It is one line. ⛔ BUT A GENERATION-SIDE
 * COLLAPSE MOVES SAME-SEED OUTPUT, and a seed is a starting world forever: that is the
 * owner's to sign, not a lane's and not a chair's.
 *
 * AND THERE IS A SECOND, INDEPENDENT GAP behind it, so the collapse alone is not the whole
 * cure: `HISTORICAL_EVENTS_DATA` can write more than twenty tension types and the corpus
 * writes ten pools, so fourteen of them would still reach no pool. Both halves are pinned in
 * the desk suite, so neither figure can decay unnoticed.
 */

// ── THE HISTORY CHAPTER · DS-GEN-9, DS-GEN-14, DS-GEN-16 ────────────────────────────

/**
 * The duration band for a span given in YEARS.
 *
 * `timeBandOf` takes elapsed TICKS and a tick length in weeks, which is exactly the
 * parameterisation a year needs — the estate's temporal constitution fixes a year at 52
 * weeks (`worldState.js`: "tick = 1 week and year = 52 weeks"). Nothing here re-derives the
 * band boundaries.
 *
 * ⚠ THE CONVERSION IS A CALL ARGUMENT AND NOT A NAMED CONSTANT THIS LEAF OWNS, deliberately:
 * a year in weeks is a CALENDAR FACT rather than a tuning knob, and a named one would enter
 * the tuning register as unregistered debt — raising that ceiling is the chair's act, not a
 * lane's, and it is the wrong shape of movement for a value nobody may tune.
 *
 * ⚠ THE LADDER TOPS OUT WELL BELOW THIS CHAPTER'S SUBJECT, AND THAT IS THE FINDING BELOW.
 * @param {number} years @returns {ReturnType<typeof timeBandOf>}
 */
function yearBand(years) {
  return timeBandOf(years, 52);
}

/**
 * `{timeband_since}` — the ADVERBIAL column ("the fire came {timeband_since}").
 *
 * ⛔ IT IS NULL BEYOND A GENERATION, BY DESIGN, AND THAT DARKENS REAL PROSE. The sixth band
 * (`older_than_bearers`) is PREDICATE-ONLY: its attributive, span and since columns are all
 * `null`, because "older than its bearers" cannot follow a preposition. MEASURED over 108
 * generated historical events: 89 of them (82 percent) are more than sixty years old, so
 * this returns `undefined` for most of the record and anchored liveness drops every variant
 * naming the slot. The pools still speak through their variants that do not name it —
 * except `event type: religious`, whose only unslotted variants are marked for the other
 * side of the anchor dimension, and which therefore falls silent on an anchored religious
 * event. Declared and pinned rather than papered over: the cure is a corpus or ladder act
 * (a seventh band, or event prose that does not lean on the adverbial), not a desk act.
 * @param {unknown} years @returns {string|undefined}
 */
function timebandSinceFill(years) {
  if (typeof years !== 'number' || !Number.isFinite(years)) return undefined;
  return timeBandWord(yearBand(years), 'since') || undefined;
}

/**
 * `{timeband_age}` — the PREDICATE column ("{settlement} is {timeband_age}"). Total over the
 * whole ladder: the sixth band exists precisely to fill this position, so unlike the
 * adverbial this never darkens on an old town.
 * @param {unknown} years @returns {string|undefined}
 */
function timebandAgeFill(years) {
  if (typeof years !== 'number' || !Number.isFinite(years)) return undefined;
  return timeBandWord(yearBand(years), 'predicate') || undefined;
}

/**
 * `{calamity}` — a BARE-COMMON fill: the recorded blow by its own word, with the article
 * stripped, because every seam supplies its own ("The {calamity} is {timeband_age} now").
 *
 * ⛔ THE DEFECT THIS REPLACES WAS MEASURED IN RENDERED PROSE, not reasoned about: filling
 * the slot with the event's name verbatim printed **"The The Economic Divide is older than
 * its bearers now"**. A doubled article in front of a reader is the label trap one layer
 * down from the pool.
 *
 * ⭐ AND IT INVENTS NOTHING, which the annex requires in the same breath as it forbids "a
 * baked or invented noun". The annex routes this slot from a `historicalEvents[]` row's
 * `type`; at this tip that field is the COARSE eight-value category (`disaster`,
 * `political`, `economic`, …), and every one of those is an ADJECTIVE that cannot be a bare
 * common noun without someone inventing the head noun for it. The row's `name` is the
 * estate's own type-to-word table one layer finer — `historyGenerator.js:291` writes
 * `EVENT_TYPE_NAMES[type]` into it — so the word is authored, not minted here. ⚠ THE
 * DEVIATION FROM THE ANNEX IS THEREFORE DELIBERATE AND IS RAISED FOR THE CHAIR, with the
 * alternative costed: routing the coarse `type` instead needs eight head nouns nobody has
 * authored, which is precisely the invention the same sentence forbids.
 *
 * REFUSED RATHER THAN REPAIRED where the name carries an embedded proper noun: the
 * opt-in ancient-ruin event is named "The Fall of <Ruin>", and lowercasing that would print
 * "the fall of ecserys". A name that is not article-plus-Title-Case yields `undefined` and
 * anchored liveness drops the variant. The desk test drives ALL THIRTY `EVENT_TYPE_NAMES`
 * values through this function and asserts a word comes back for every one.
 * @param {unknown} eventName @returns {string|undefined}
 */
export function calamityFill(eventName) {
  const match = /^The\s+(.+)$/i.exec(text(eventName));
  if (!match) return undefined;
  const rest = match[1];
  return /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/.test(rest) ? rest.toLowerCase() : undefined;
}

/**
 * THE EVENT THIS CHAPTER SPEAKS ABOUT — a SELECTION, not a derivation, and the distinction
 * is the same one `worldStressorFor` draws on the Overview tab. The record holds several
 * events and the corpus writes ONE sentence per lens, so somebody must choose which row the
 * lens is about. The choice is stated rather than left to array order: the most recent
 * ANCHORED event (the record's own word for "this still bears on the town"), and failing
 * that the most recent event at all. Ties go to the earlier array position, which is the
 * producer's own order.
 * @param {unknown} events @returns {HistoricalEventRow|null}
 */
export function significantEvent(events) {
  const rows = eventRows(events);
  if (rows.length === 0) return null;
  return nearestEvent(rows.filter((e) => e.anchored === true)) || nearestEvent(rows);
}

/**
 * One row of `history.historicalEvents[]`, as the producer writes it.
 * @typedef {{type?: unknown, name?: unknown, yearsAgo?: unknown, anchored?: unknown,
 *   lastingEffects?: unknown}} HistoricalEventRow
 */

/**
 * The record's event rows, object-shaped ones only.
 * @param {unknown} events @returns {ReadonlyArray<HistoricalEventRow>}
 */
function eventRows(events) {
  return /** @type {ReadonlyArray<HistoricalEventRow>} */ (
    (Array.isArray(events) ? events : []).filter((e) => e && typeof e === 'object')
  );
}

/**
 * The nearest row by `yearsAgo`, ties to the producer's own array order. Written as a loop
 * rather than a `reduce`, because a reduce over a possibly-empty list needs a seed and the
 * only honest seed is `null` — which is a type the accumulator has to carry explicitly.
 * @param {ReadonlyArray<HistoricalEventRow>} list @returns {HistoricalEventRow|null}
 */
function nearestEvent(list) {
  /** @type {HistoricalEventRow|null} */
  let best = null;
  for (const row of list) {
    if (best === null) { best = row; continue; }
    if (typeof row.yearsAgo === 'number' && typeof best.yearsAgo === 'number'
      && row.yearsAgo < best.yearsAgo) best = row;
  }
  return best;
}

/**
 * DS-GEN-9's demoted `anchor` dimension (kernel law 5). STRICTLY BOOLEAN, and `undefined` is
 * NOT "not anchored": measured over 202 generated events the field is a real boolean on most
 * rows and simply absent on others, and an absent flag is a record that has not answered the
 * question rather than one that answered no. An unanswered dimension reads as silence.
 * @param {unknown} anchored @returns {string|null} a value of STATE_MARK_DIMENSIONS.anchor
 */
export function eventAnchorDimension(anchored) {
  if (anchored === true) return 'anchored';
  if (anchored === false) return 'not anchored';
  return null;
}

/**
 * DS-GEN-9's per-event pool, keyed on the CANONICAL coarse `type` token. CLOSED over the
 * eight types the corpus writes a pool for, which are exactly the eight
 * `historicalEvents[].type` values measured across 202 events on 48 settlements — a rare
 * total identity, asserted in both directions by the desk test.
 * @param {unknown} type @returns {string|null}
 */
export function eventTypePoolKey(type) {
  const key = `event type: ${text(type)}`;
  return CORPUS['DS-GEN-9'].pools[key] ? key : null;
}

/**
 * The five recency labels DS-GEN-9 frames the record with.
 *
 * ⚠ THIS IS A MIRROR OF `HistoryTab.jsx`'s OWN LADDER, not a second opinion, and the desk
 * test extracts the component's literal through `mustExtract` and drives both sides of every
 * cut. The tab prints the label beside each event already; a desk that banded the same years
 * differently would put a sentence about "living memory" next to a row labelled "Ancient".
 * @param {unknown} yearsAgo @returns {string|null}
 */
export function recencyFramingPoolKey(yearsAgo) {
  if (typeof yearsAgo !== 'number' || !Number.isFinite(yearsAgo)) return null;
  const label = yearsAgo <= 10 ? 'Recent'
    : yearsAgo <= 30 ? 'Living memory'
      : yearsAgo <= 80 ? 'Last century'
        : yearsAgo <= 200 ? 'Ancient' : 'Deep history';
  const key = `recency framing: ${label}`;
  return CORPUS['DS-GEN-9'].pools[key] ? key : null;
}

/**
 * DS-GEN-14's pool — founded once, grown since. The cut between YOUNG and OLD is the time
 * band's own `a_generation` ceiling rather than a number invented here, so the sentence and
 * the `{timeband_age}` word inside it can never disagree about which side of a generation
 * the town sits on.
 *
 * ⛔ `GROWN-UNRECORDED` IS REACHABLE AND UNREACHED, and the distinction matters: it needs a
 * record with NO `history.founding`, and the generator wrote one on 48 of 48 settlements. It
 * lights on a stored or hand-authored record that lacks the block, which is a real shape the
 * estate can hold, so it is a FINDING rather than a defect. `FOUNDED-YOUNG` is the same
 * shape at the other end: the youngest town measured was 81 years old.
 * @param {{founding?: unknown, age?: unknown}|null|undefined} history @returns {string|null}
 */
export function foundedPoolKey(history) {
  if (!history || typeof history !== 'object') return null;
  const key = !history.founding ? 'GROWN-UNRECORDED'
    : (typeof history.age === 'number' && Number.isFinite(history.age)
      && yearBand(history.age).id !== 'older_than_bearers')
      ? 'FOUNDED-YOUNG' : 'FOUNDED-OLD';
  return CORPUS['DS-GEN-14'].pools[key] ? key : null;
}

/**
 * DS-GEN-16's pool — what the years left standing, read over the WHOLE record rather than
 * one row. The order is most-constrained first and the order is the argument: LAYERED is a
 * statement about the record having several anchored blows and cannot be told from a single
 * row; UNMARKED is the pure absence and must be tested before anything that assumes a blow.
 *
 * ⚠ `anchored` IS READ STRICTLY. An absent flag is not a `false`: it counts toward neither
 * the anchored nor the unanchored arm, so a record of unanswered rows reads UNMARKED, which
 * is the honest statement about a record that has not been asked the question.
 * @param {unknown} events @returns {string|null}
 */
export function eventRecordPoolKey(events) {
  const rows = eventRows(events);
  const anchored = rows.filter((e) => e.anchored === true
    && Array.isArray(e.lastingEffects) && e.lastingEffects.length > 0);
  const recorded = rows.filter((e) => e.anchored === false
    && Array.isArray(e.lastingEffects) && e.lastingEffects.length > 0);
  const key = anchored.length > 1 ? 'LAYERED-ANCHORED'
    : anchored.length === 1
      ? (yearBand(Number(anchored[0].yearsAgo) || 0).id === 'older_than_bearers'
        ? 'ANCHORED-OLD' : 'ANCHORED-RECENT')
      : recorded.length > 0 ? 'RECORDED-UNANCHORED' : 'UNMARKED';
  return CORPUS['DS-GEN-16'].pools[key] ? key : null;
}

/**
 * The event DS-GEN-16's `{calamity}` names — the one the pool key was decided by, so the
 * sentence and the word inside it describe the same blow. Null where the key is about an
 * absence, which is exactly where no variant names the slot.
 * @param {unknown} events @returns {HistoricalEventRow|null}
 */
function recordCalamityEvent(events) {
  const rows = eventRows(events).filter(
    (e) => Array.isArray(e.lastingEffects) && e.lastingEffects.length > 0,
  );
  return nearestEvent(rows.filter((e) => e.anchored === true))
    || nearestEvent(rows.filter((e) => e.anchored === false));
}

// ── DS-GEN-11 · Viability › The coherence verdict ───────────────────────────────────

/**
 * DS-GEN-11's verdict pool. TOTAL BY CONSTRUCTION over the three states
 * `economicViability.viable` can be in, and the third is the point: an ABSENT verdict is the
 * MARGINAL arm, not a missing reading. `ViabilityTab.jsx` prints exactly the same three-way
 * split as its own headline ("✗ NOT COHERENT" / "✓ COHERENT" / "MARGINAL COHERENCE"), so a
 * desk that treated `undefined` as silence would fall dumb on the one verdict the page
 * renders in amber.
 * @param {unknown} viable @returns {string|null}
 */
export function viabilityVerdictPoolKey(viable) {
  const key = viable === true ? 'viable: true: the arithmetic closes'
    : viable === false ? 'viable: false: the arithmetic does not close'
      : 'the MARGINAL arm: neither verdict returned';
  return CORPUS['DS-GEN-11'].pools[key] ? key : null;
}

/**
 * DS-GEN-11's critical-contradiction pool.
 *
 * ⚠ THE COUNT LIVES AT `economicViability.metrics.criticalIssueCount`, NOT at
 * `economicViability.criticalIssueCount`. The corpus title abbreviates the path to
 * `criticalIssueCount` and a desk that believed the abbreviation would read `undefined` on
 * every settlement ever generated and fall silent on both pools — the same trap DS-GEN-17's
 * `economicState.compound.inst` note records, and it cost this lane a first pass that
 * measured the field 0/24 present when it is 48/48. A non-number renders nothing: an absent
 * count is a record that was not asked, and reading it as zero would print "nothing here
 * contradicts anything" over a town nobody checked.
 * @param {unknown} count @returns {string|null}
 */
export function criticalIssuePoolKey(count) {
  if (typeof count !== 'number' || !Number.isFinite(count)) return null;
  const key = count > 0
    ? 'criticalIssueCount: critical contradictions on the record'
    : 'criticalIssueCount zero';
  return CORPUS['DS-GEN-11'].pools[key] ? key : null;
}

// ── DS-HK-1 · Plot hooks › The state a hook is framed FROM ──────────────────────────

/**
 * DS-HK-1's CATEGORY pool. A 7-for-7 identity with `PLOT_HOOK_CATEGORIES` — the estate's own
 * closed hook vocabulary — measured over 48 settlements carrying 18 to 68 hooks each, in
 * which every one of the seven categories appeared and nothing else did. Asserted total in
 * both directions by the desk test against the imported registry, so neither side can grow a
 * member the other does not have.
 *
 * ⛔ THIS IS THE FRAMING, NEVER THE HOOK. The corpus block's own title says so: "the state a
 * hook is framed FROM (never the hook prose itself)". The hooks keep their own words on the
 * page; this bands what having a page of them MEANS.
 * @param {unknown} category @returns {string|null}
 */
export function hookCategoryPoolKey(category) {
  const found = Object.keys(CORPUS['DS-HK-1'].pools)
    .find((key) => key.startsWith(`category ${text(category)}:`));
  return found || null;
}

/**
 * DS-HK-1's CLOCK pool, keyed on the CANONICAL TOKEN inside the clock's own id.
 *
 * ⚠ KEYED ON THE ID SEGMENT, NEVER THE LABEL, and this leaf's standing label trap is why.
 * `deriveEscalationClocks` writes `id: 'clock.bread_riot.<trigger>'` and `label: 'Bread Riot
 * Clock'`; the corpus pool is `clock bread_riot`. The id carries the producer's token and the
 * label carries a display string, and only one of those is a join key.
 * @param {unknown} clockId @returns {string|null}
 */
export function escalationClockPoolKey(clockId) {
  const parts = text(clockId).split('.');
  if (parts.length < 2 || parts[0] !== 'clock') return null;
  const key = `clock ${parts[1]}`;
  return CORPUS['DS-HK-1'].pools[key] ? key : null;
}

// ── DS-REL-2 · Overview › The connection the town names first ───────────────────────

/**
 * DS-REL-2's CONNECTION pool — the one tie the town names before it names a list.
 *
 * `narrativeGenerator.js` really writes `prominentRelationship` (measured on 16 of 48
 * generated settlements, carrying `npc1`, `npc2`, `type`, `phrasing`, `full` and `tension`),
 * and OverviewTab already prints its `phrasing` as the Notable Connection datum. A town
 * without one is a town whose ties are level — a true statement rather than a missing
 * reading — so the absence renders nothing.
 * @param {unknown} prominentRelationship @returns {string|null}
 */
export function notableConnectionPoolKey(prominentRelationship) {
  const phrasing = text(/** @type {{phrasing?: unknown}|null} */ (prominentRelationship)?.phrasing);
  if (!phrasing) return null;
  const key = 'prominentRelationship present';
  return CORPUS['DS-REL-2'].pools[key] ? key : null;
}

/**
 * DS-REL-2's EMERGENT-CONDITIONS pool — how much of the roll exists because of THIS town.
 *
 * ⛔⛔ THIS LANE FIRST RULED THIS LENS DEAD AND WAS WRONG, and the correction is recorded
 * because the mistake is the instructive part. A one-line grep for `flagDriven\s*[:=]`
 * found exactly ONE site — a READ in RelationshipsTab.jsx — so the lens looked like the
 * `economicBase: mixed` shape: a count that is always zero because nothing ever sets the
 * flag. It is not. `npcGenerator.js:1694` writes `flagDriven` on EVERY relationship row; the
 * grep missed it only because the value is a multi-line boolean expression and the key sits
 * alone on its line. What is true is narrower and is a FINDING rather than a defect: the
 * flag is `stressFlags.anyActive && archetype ∈ {six stress-economic effects}`, and across
 * 48 generated settlements it was `false` every time. So `count > 0` is REACHED ONLY IN A
 * STRESSED WORLD, and `count zero` is a real reading of a real field.
 *
 * ⇒ THE DISTINCTION THAT DECIDED IT, and it is the registry's own: a count of zero over a
 * field a producer WRITES is a MEASUREMENT; a count of zero over a field nothing writes is a
 * DEFAULT WEARING A READING'S CLOTHES. This is the first.
 *
 * NO ROLL AT ALL renders nothing, which is neither pool: a settlement carrying no
 * `relationships` array has not been asked the question.
 * @param {unknown} relationships @returns {string|null}
 */
export function flagDrivenPoolKey(relationships) {
  if (!Array.isArray(relationships) || relationships.length === 0) return null;
  const driven = relationships.filter(
    (row) => row && typeof row === 'object' && row.flagDriven === true,
  ).length;
  const key = driven > 0 ? 'flagDriven count > 0' : 'flagDriven count zero';
  return CORPUS['DS-REL-2'].pools[key] ? key : null;
}

// ── DS-GEN-2 · Overview/Power › Active conflicts ────────────────────────────────────

/**
 * DS-GEN-2's pool — the intensity of ONE standing quarrel. `generateConflicts` writes
 * `low` / `moderate` / `high` and nothing else, and all three are reached in a measured
 * sample; an unrecognised intensity renders nothing rather than picking a neighbour, because
 * how close two factions are to violence is not a thing to guess at.
 * @param {{intensity?: unknown}|null|undefined} conflict @returns {string|null}
 */
export function conflictIntensityPoolKey(conflict) {
  const intensity = text(conflict?.intensity);
  if (!intensity) return null;
  const key = `intensity: ${intensity}`;
  return CORPUS['DS-GEN-2'].pools[key] ? key : null;
}

// ── DS-GEN-5 · Overview › Situation (the live companion to the frozen scene) ────────

/**
 * `config.tradeRouteAccess` → the arrival SCENE key. A five-entry mirror of
 * `narrativeGenerator.js`'s exported `ROUTE_TO_SCENE`, asserted IDENTICAL to it in the desk
 * test rather than imported: `narrativeGenerator.js` is a generator module and this is a
 * display leaf, and the identity is free where a test can assert it.
 * @type {Readonly<Record<string, string>>}
 */
const SCENE_OF_ROUTE = Object.freeze({
  crossroads: 'market',
  port: 'port',
  river: 'river',
  isolated: 'smoke',
  mountain_pass: 'smoke',
});

/**
 * scene key → its DS-GEN-5 pool. THREE OF THE FIVE POOL KEYS CARRY A PARENTHETICAL GLOSS
 * (`market (route crossroads)`), so the scene key is not the pool key and a route that used
 * one as the other would darken three of five arms. The gloss is the corpus documenting its
 * own state-key inside the key, which is a spelling this desk must translate rather than
 * a fact it may re-derive.
 * @type {Readonly<Record<string, string>>}
 */
const SITUATION_POOL_OF_SCENE = Object.freeze({
  market: 'market (route crossroads)',
  port: 'port',
  river: 'river',
  smoke: 'smoke (route isolated / mountain_pass)',
  ordinary: 'ordinary (route road and the default)',
});

/**
 * DS-GEN-5's pool — the LIVE companion to the frozen `arrivalScene`, never a replacement
 * for it. Two sentences with two lifetimes: the persisted scene is a first-impression
 * artifact composed once at generation, and overwriting one with the other breaks THE
 * PROMISE. This desk composes only the companion; nothing here touches `arrivalScene`.
 *
 * ⛔ THE STRESS ARM IS A SUPPRESSION AND IT IS NOT OPTIONAL. Where a primary stress
 * resolves, the annex rules the stressor shape's `[visitor]` variant the correct companion
 * and these are suppressed: the page must not describe an ordinary market day underneath a
 * siege banner. The caller passes the answer from the canonical `resolvePrimaryStress`, so
 * the priority ladder cannot fork.
 *
 * ⚠ `port` ON RIVERSIDE TERRAIN RESOLVES TO `river`, which is `generateArrivalScene`'s own
 * `riverPort` branch and not an embellishment: an inland river port is not a seaport, and
 * the corpus's `river` pool says so in its own gloss.
 * @param {{tradeRouteAccess?: unknown, terrainType?: unknown, primaryStress?: unknown}} state
 * @returns {string|null}
 */
export function situationPoolKey(state) {
  if (typeof state?.primaryStress === 'string' && state.primaryStress !== '') return null;
  const route = text(state?.tradeRouteAccess);
  const riverPort = route === 'port' && text(state?.terrainType) === 'riverside';
  const scene = riverPort ? 'river' : (SCENE_OF_ROUTE[route] || 'ordinary');
  const key = SITUATION_POOL_OF_SCENE[scene];
  return key && CORPUS['DS-GEN-5'].pools[key] ? key : null;
}

// ── DS-GEN-6 · Overview › Settlement origin (why the town exists) ───────────────────

/**
 * `config.tradeRouteAccess` → DS-GEN-6's ROUTE pool. The four named routes, and everything
 * else — `road`, `mountain_pass`, `mountain_road`, `desert_road`, an absent value — founds
 * on the road arm, which is exactly what `originArmKey`'s trailing `return 'road'` does.
 *
 * ⭐ THE PRODUCER SPLITS FINER THAN THE CORPUS AND THAT IS THE JOIN. `ORIGIN_ARMS` carries
 * EIGHT arms because it sub-splits `port` by terrain and `isolated` by deficit; the corpus
 * carries five route pools and demotes the deficit split into the `deficit` DIMENSION, which
 * is the kernel's law-5 channel. So `port.generic`/`port.riverside`/`port.coastal` all fold
 * to `port` and `isolated.sustained`/`isolated.deficit` both fold to `isolated`, with the
 * split preserved where the corpus actually put it. The desk test asserts the fold is total
 * over `ORIGIN_ARMS` in both directions.
 * @type {Readonly<Record<string, string>>}
 */
const ORIGIN_POOL_OF_ROUTE = Object.freeze({
  crossroads: 'crossroads',
  river: 'river',
  port: 'port',
  isolated: 'isolated',
});

/**
 * tier → DS-GEN-6's tier-overlay pool. TOTAL: every tier resolves, including the others.
 * @type {Readonly<Record<string, string>>}
 */
const TIER_OVERLAY_OF = Object.freeze({
  metropolis: 'tier overlay: metropolis',
  city: 'tier overlay: city',
  thorp: 'tier overlay: thorp / hamlet',
  hamlet: 'tier overlay: thorp / hamlet',
});

/**
 * The share of daily need at or above which a food gap counts as a deficit.
 *
 * ⚠ NOT AUTHORED HERE, AND THAT IS THE WHOLE POINT. This is the producer's own cut,
 * `gap / need >= 0.05` at src/generators/narrativeGenerator.js, given a name on this side so
 * the re-derivation below reads as a mirror rather than as a second opinion. The desk test
 * pins the producer's literal through `mustExtract` and drives both sides of the boundary
 * (4/100 ⇒ no deficit, 5/100 ⇒ deficit), so the day the producer's threshold moves, this
 * file reds instead of quietly disagreeing with the sentence the page above it already
 * printed. Naming it changes no value: 0.05 is what shipped before this constant existed.
 */
const DEFICIT_FRACTION_FROM = 0.05;

/**
 * THE DEMOTED `deficit` DIMENSION, derived exactly as `generateSettlementReason` derives it:
 * the gap is the LARGER of the pre-import `rawDeficit` and the post-import residual
 * `deficit`, and it counts when it is positive and at or above `DEFICIT_FRACTION_FROM` of
 * daily need — five percent, the producer's own figure, named above rather than inlined.
 *
 * ⚠ THIS IS A RE-DERIVATION AND IT IS DECLARED AS ONE. The producer computes
 * `hasFoodDeficit` inline and persists nothing, so there is no canonical field to read; the
 * desk test extracts the five-percent literal from the producer's own source through
 * `mustExtract` and drives both sides of the cut, so the day the threshold moves this file
 * reds instead of quietly disagreeing with the sentence the page above it already printed.
 *
 * NO foodBalance ⇒ `no deficit` is NOT the answer — `null` is. A settlement with no food
 * arithmetic on the record has not been measured as feeding itself; the kernel's law 5 then
 * fails closed and the block renders nothing, which is the honest state.
 *
 * ⚠⚠ THE MIRROR IS OF THE PRODUCER'S ARITHMETIC, NOT OF ITS DEAD FALLBACK. This function
 * used to read `num(dailyNeed) || num(need)`, copying `generateSettlementReason`'s own
 * `foodBalance?.dailyNeed ?? foodBalance?.need ?? 0`. The `need` half is dead on both
 * sides: the single writer of this record — `deriveFoodBalanceAnalysis` at
 * src/generators/economy/foodBalance.js — returns a CLOSED object literal whose daily
 * figure is spelled `dailyNeed`, and nothing in the estate has ever written `need` onto it.
 * MEASURED, not reasoned: over 540 settlements generated across the whole settType × route
 * × terrain × seed spread, `dailyNeed` was present 540/540 and `need` 0/540. The producer's
 * own `?? need` is the legacy spelling `pdf/lib/viewModelPrimitives.js` also still carries
 * ("the engine emits dailyProduction/dailyNeed; the old .production/.need reads"), and both
 * are frozen rows in the reader-with-no-writer inventory. Copying a dead arm to keep a
 * mirror byte-exact is how a default gets to wear a reading's clothes, so the mirror keeps
 * the producer's CUT (five percent, pinned through `mustExtract`) and drops its fallback.
 * The two cannot disagree on any record this engine can build.
 * @param {{dailyNeed?: unknown, deficit?: unknown, rawDeficit?: unknown}|null|undefined} foodBalance
 * @returns {string|null} a value of STATE_MARK_DIMENSIONS.deficit, or null
 */
export function foodDeficitDimension(foodBalance) {
  if (!foodBalance || typeof foodBalance !== 'object') return null;
  /** @param {unknown} v @returns {number} */
  const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
  const gap = Math.max(num(foodBalance.rawDeficit), num(foodBalance.deficit));
  const need = num(foodBalance.dailyNeed);
  return (gap > 0 && (need <= 0 || gap / need >= DEFICIT_FRACTION_FROM)) ? 'deficit' : 'no deficit';
}

/**
 * DS-GEN-6's ROUTE pool — why the town is where it is.
 * @param {unknown} tradeRouteAccess @returns {string|null}
 */
export function originRoutePoolKey(tradeRouteAccess) {
  const key = ORIGIN_POOL_OF_ROUTE[text(tradeRouteAccess)] || 'road';
  return CORPUS['DS-GEN-6'].pools[key] ? key : null;
}

/**
 * DS-GEN-6's TIER OVERLAY pool — the second sentence, composed AFTER the route line and
 * never instead of it. This is the registry's one written exception to the one-fact-one-
 * sentence law: one mount renders two sentences from two POOLS of one block, which is one
 * fact reading at one position at one depth.
 * @param {unknown} tier @returns {string|null}
 */
export function originTierPoolKey(tier) {
  const key = TIER_OVERLAY_OF[text(tier)] || 'tier overlay: other tiers';
  return CORPUS['DS-GEN-6'].pools[key] ? key : null;
}

// ── DS-GEN-7 · Overview › Warnings and coherence notes ──────────────────────────────

/**
 * `${type}|${tab}` → DS-GEN-7's coherence pool. THE PAIR IS THE KEY AND THE TYPE ALONE IS
 * NOT: `genCoherence` writes THREE distinct notes under `type: 'power_economic'` — the
 * transit hub, the temple economy and the prosperous underworld — and they differ only by
 * the `tab` each routes to. A type-only route would collapse three pools into one and print
 * a sentence about a criminal transit hub over a note about a church-run economy.
 * @type {Readonly<Record<string, string>>}
 */
const COHERENCE_POOL_OF = Object.freeze({
  'power_economic|economics': 'power_economic: criminal faction in a transit hub',
  'power_economic|power': 'power_economic: temple economy under a secular seat',
  'power_economic|overview': 'power_economic: powerful criminal faction in a prosperous settlement',
  'stress_economic|economics': 'stress_economic: siege against trade income',
  'power_stress|power': 'power_stress: occupation against stated stability',
  'historical_economic|history': 'historical_economic: the recovery narrative',
});

/**
 * ⛔ FIVE OF THE SIX COHERENCE POOLS ARE ROUTED AND UNREACHED, AND THE CAUSE IS UPSTREAM.
 *
 * The routing above is total and correct. What is not correct is `genCoherence` itself, and
 * the numbers below are measured over generated settlements rather than reasoned about:
 *
 *   • THE TWO CRIMINAL NOTES ARE DEAD BY THRESHOLD. They require a crime-named faction with
 *     `power > 20` and `power > 35`. Across 291 factions on 48 settlements the generator
 *     wrote 48 crime-named factions and their power took exactly three values — 5, 6 and 7.
 *     The ceiling is a third of the lower threshold. Neither note can fire.
 *   • THE RECOVERY NARRATIVE IS DEAD BY NAME. It requires an event whose `name` contains
 *     `Boom` or `Trade Route Opened`. Across 708 generated historical events with 28
 *     distinct names, ZERO carry either string — the two spellings exist in the tree only
 *     inside `npcGenerator.js`'s related-event lookup, which never names an event on this
 *     record. The `Collapse`/`Famine` half of the same predicate matches 17 times, so the
 *     note is half-live and can never complete. This is a filter reading a key no writer
 *     writes, one layer up from the pool.
 *   • THE OCCUPATION NOTE never fired on 96 settlements carrying the `occupied` stress,
 *     because it additionally requires the stability text NOT to mention occupation.
 *   • THE TEMPLE-ECONOMY NOTE is the one of the five that is merely RARE rather than
 *     unreachable: `prosperity.js` really does write "The church controls most economic
 *     activity" into `situationDesc`, and none of the 384 sampled configs reached it.
 *
 * Only `stress_economic` fires in the wild — 79 instances in a 1,440-settlement sweep.
 *
 * ⇒ THE BLOCK IS STILL MOUNTED, and that is the right call rather than a compromise: its
 * other two pools (`structuralViolations[]` and `structuralSuggestions[]`) are written at
 * generation on ordinary settlements and are measured live, and the siege note is live. The
 * five unreached pools are a FINDING about the producer, declared and pinned, not a defect
 * in this desk — and every cure for them is a generation-side change to thresholds or to a
 * name predicate, which moves same-seed output and is not a display lane's to take.
 */

/**
 * DS-GEN-7's pool for ONE coherence note. An unknown `type`/`tab` pair renders nothing: a
 * note this desk does not recognise is a producer change, and guessing which contradiction
 * it meant is how a page states something false about a town.
 * @param {{type?: unknown, tab?: unknown}|null|undefined} note @returns {string|null}
 */
export function coherencePoolKey(note) {
  const key = COHERENCE_POOL_OF[`${text(note?.type)}|${text(note?.tab)}`];
  return key && CORPUS['DS-GEN-7'].pools[key] ? key : null;
}

/**
 * DS-GEN-7's pool for the structural-violation list AS A LIST. It speaks when the settlement
 * carries at least one violation — the corpus writes one sentence about the fact that the
 * record disagrees with itself, not one per row, and the rows themselves are already on the
 * page carrying their own words.
 * @param {unknown} violations @returns {string|null}
 */
export function structuralViolationsPoolKey(violations) {
  return Array.isArray(violations) && violations.length > 0 ? 'structuralViolations[]' : null;
}

/**
 * DS-GEN-7's pool for the structural-suggestion list. Same shape, opposite temper: a
 * suggestion is what the record says is MISSING rather than what it says is wrong.
 * @param {unknown} suggestions @returns {string|null}
 */
export function structuralSuggestionsPoolKey(suggestions) {
  return Array.isArray(suggestions) && suggestions.length > 0 ? 'structuralSuggestions[]' : null;
}

// ── DS-GEN-12 · Overview › The ground and the approaches ────────────────────────────

/**
 * `config.terrainType` → its terrain FAMILY pool. TOTAL over the live seven-value enum
 * (`TERRAIN_OPTIONS`, aligned to `getTerrainType`'s own table), so no settlement falls
 * through it — which is the annex's stated design and is asserted in the desk test against
 * `getTerrainType`'s route map rather than against a transcription of the enum.
 * @type {Readonly<Record<string, string>>}
 */
const TERRAIN_FAMILY_OF = Object.freeze({
  coastal: 'WATER-EDGE',
  riverside: 'WATER-EDGE',
  mountain: 'HIGH-GROUND',
  hills: 'HIGH-GROUND',
  forest: 'WOODLAND',
  plains: 'OPEN-GROUND',
  desert: 'DRY-GROUND',
});

/**
 * DS-GEN-12's pool. An unknown terrain renders nothing: the partition is total over the live
 * enum, so a miss means the enum grew and the corpus has not been asked about the new value.
 * @param {unknown} terrainType @returns {string|null}
 */
export function groundPoolKey(terrainType) {
  const key = TERRAIN_FAMILY_OF[text(terrainType)];
  return key && CORPUS['DS-GEN-12'].pools[key] ? key : null;
}

// ── DS-GEN-13 · Overview/Economics › The market and the roads ───────────────────────

/**
 * The three approaches DS-GEN-13 calls NARROW. This adopts DS-ECO-1's C2/C5 convention
 * (`isolated` / `mountain_pass`) and extends it by one spelling to `mountain_road` — the
 * same shape under a different name — exactly as the annex records. The remaining five
 * values of `getTerrainType`'s route table are OPEN.
 * @type {ReadonlyArray<string>}
 */
const NARROW_ACCESS = Object.freeze(['isolated', 'mountain_pass', 'mountain_road']);

/**
 * The engine's own market NAME CLASS, from `glyphAssign.js`'s stall-rows rule. Read as a
 * NAME test rather than a category test because that is what the annex's receipt names and
 * because `institutions[].category` is `economy` for a great deal more than a market.
 */
const MARKET_NAME = /\b(market|bazaar|exchange|shambles|stalls)\b/i;

/**
 * DS-GEN-13's pool.
 *
 * JUDGMENT (vetoable), because the annex lists the four keys without an evaluation order:
 * NO-MARKET is tested FIRST, because it is the only key that is about an ABSENCE and a town
 * with no market-class row cannot be an entrepôt of its own stalls; ENTREPOT then wins over
 * the two MARKET- keys, because `isEntrepot` is the more specific claim and its prose is
 * about goods that only pause here. OPEN and NARROW split the remainder by approach. Say
 * "veto" to reorder.
 *
 * ⚠ `institutions` IS THE CALLER'S READING and is passed in rather than reached for: the
 * roster is on the settlement the caller already holds, and a desk that re-derived it would
 * be a second opinion about WHICH ROWS the caller meant.
 *
 * ⛔ THAT IS NOT THE SAME QUESTION AS WHICH ROWS STILL STAND, and the two were fused here.
 * The roster arrives as the caller chose it, and this desk then asks the ONLY question it is
 * entitled to ask of it: `liveInstitutions()`, the estate's single writer of the ruin
 * question. Filtering the roster it was handed is not a second opinion about the roster — the
 * caller still chooses it — and `hasMarket` is a CREDITING read: it decides whether the town
 * is described as having a market at all. A calamity-flattened bazaar hosts no trade, and
 * "the stalls are busy" about a burnt row is a confident falsehood rather than a missing
 * sentence, which is the difference this whole desk exists to hold.
 * (Same defect class, same cure, as `standingDefenseForces` in
 * src/domain/institutions/defenseInstitutionBuckets.js.)
 * @param {{institutions?: unknown, tradeRouteAccess?: unknown, isEntrepot?: unknown}} state
 * @returns {string|null}
 */
export function marketPoolKey(state) {
  const rows = liveInstitutions(state);
  const hasMarket = rows.some((row) => MARKET_NAME.test(text(row?.name)));
  const key = !hasMarket
    ? 'NO-MARKET'
    : state?.isEntrepot === true
      ? 'ENTREPOT'
      : NARROW_ACCESS.includes(text(state?.tradeRouteAccess))
        ? 'MARKET-NARROW'
        : 'MARKET-OPEN';
  return CORPUS['DS-GEN-13'].pools[key] ? key : null;
}

// ── DS-GEN-17 · Overview/Power › The company the town keeps ─────────────────────────

/**
 * DS-GEN-17's pool — a TOTAL, DETERMINISTIC resolution over the institution-composition
 * booleans, evaluated IN THE ORDER THE ANNEX WRITES and stopping at the first antecedent
 * that holds. The order is most-constrained first and the order is the argument: `ADMINISTERED`
 * needs two booleans at once, `GARRISONED` needs a force the town PAYS for, `LETTERED` needs
 * the most tier-gated row in the set, and `PROVISIONED` needs either of the two commonest
 * rows and would swamp every other reading if it ran first.
 *
 * ⛔ `BARE` IS THE PURE ELSE-ARM AND CARRIES NO TIER CLAUSE. The compiled draft keyed it as
 * "few of the above, LOW TIER", and a tier-gated else-arm is not total: a high-tier town
 * whose roster happens to carry none of the four antecedents would resolve to NO KEY AT ALL,
 * and the block would fall silent on precisely the town whose empty roster is most worth
 * remarking. The annex records the same correction; this is it in code.
 *
 * ⚠ THE BOOLEANS LIVE AT `economicState.compound.inst`, NOT AT `settlement.compound.inst`.
 * The corpus title abbreviates the path to `compound.inst`, and a desk that believed the
 * abbreviation would read `undefined` on every settlement ever generated and resolve `BARE`
 * for all of them — a default wearing a reading's clothes, indistinguishable from a world of
 * empty rosters. The CALLER passes the record it already holds; `defenseDisplay.js` and
 * `threatAssessment.js` both read the same real path.
 * @param {{hasCourtSystem?: unknown, hasPrison?: unknown, hasMilitaryInst?: unknown,
 *   hasNavy?: unknown, hasWatch?: unknown, hasMagicInst?: unknown, hasGranary?: unknown,
 *   hasHospital?: unknown}|null|undefined} inst
 * @returns {string|null}
 */
export function institutionsPoolKey(inst) {
  if (!inst || typeof inst !== 'object') return null;
  const key = (inst.hasCourtSystem === true && inst.hasPrison === true) ? 'ADMINISTERED'
    : (inst.hasMilitaryInst === true || inst.hasNavy === true || inst.hasWatch === true) ? 'GARRISONED'
      : inst.hasMagicInst === true ? 'LETTERED'
        : (inst.hasGranary === true || inst.hasHospital === true) ? 'PROVISIONED'
          : 'BARE';
  return CORPUS['DS-GEN-17'].pools[key] ? key : null;
}

// ── DS-GEN-18 · Economics › Why these workshops (the crafts explained by their feed) ──

/**
 * A `bare-common` fill, or `undefined` — the desk's own half of the shape contract, mirroring
 * `fillShapeViolation`'s BARE-COMMON branch in scripts/lib/dossier-slot-shapes.mjs: the SEAM
 * supplies the article, so the fill must not, and it lands mid-sentence, so it reads lowercase.
 *
 * ⭐ IT DECAPITALISES AND IT REFUSES, on `phraseFill`'s reasoning one shape over. The producers
 * of these two slots write TITLE-CASED labels — `Iron ore deposits`, `Wool` — and dropping one
 * verbatim into "the {resource} stopped arriving" puts a capital mid-sentence, which
 * `fillShapeViolation` convicts as COMMON-FILL-IS-CAPITALISED.
 *
 * ⛔ AND IT REFUSES A PARENTHETICAL GLOSS, which is this desk's own addition to the shared
 * branch and is MEASURED rather than tasteful: `economicState.primaryImports[]` really writes
 * `Bulk grain (local fields depleted)` and `Iron ore (local mines exhausted)`, and the seam
 * "{settlement} works {good} it cannot raise" would render the engine's parenthetical
 * bookkeeping inside an authored sentence. That is the `{complexity}` defect §0c records —
 * an em-dashed gloss reaching a reader through a slot — in its round-bracket spelling, and
 * the shared branch does not catch it because the shared branch tests for the dash.
 * @param {unknown} value @returns {string|undefined}
 */
function bareCommonFill(value) {
  const v = text(value);
  if (!v) return undefined;
  if (/[—–]/.test(v)) return undefined;
  if (/[.!?]\s|[.!?]$/.test(v)) return undefined;
  if (/[0-9]/.test(v)) return undefined;
  if (/[a-z]+_[a-z]+/.test(v)) return undefined;
  if (/[()]/.test(v)) return undefined;
  if (/^(the|a|an|its|his|her|their|our|this|that|these|those)\b/i.test(v)) return undefined;
  if (/^[A-Z][a-z]/.test(v)) return v[0].toLowerCase() + v.slice(1);
  return /^[a-z]/.test(v) ? v : undefined;
}

/**
 * `{institution}` for DS-GEN-18 — A NAMED HOUSE THE SEAM MAY SAY "ITS" ABOUT.
 *
 * ⛔⛔ THE BLOCKER THIS BLOCK INHERITED WAS LOCATED IN THE WRONG PLACE, AND THE MEASUREMENT IS
 * THE FINDING. The standing account of DS-GEN-18 said `STALLED` could not light because its
 * only producer, `activeChains[].processingInstitutions`, writes plural category labels
 * carrying a count range — `Merchant guilds (3-8)` — which §0d's digit ban refuses. Measured
 * over 48 generated settlements at this tip: of 835 processing rows only 103 carry a digit,
 * and 489 of 558 distinct rows pass the `proper` shape unchanged. The digit is a MINORITY
 * shape and the shape contract already refuses it.
 *
 * ⛔ AND THE CURE THAT WAS PROPOSED FOR IT DOES NOT WORK, WHICH IS WHY IT IS RECORDED HERE.
 * Resolving the pattern through the town's own roster — matching an institution and taking
 * ITS name — cleans NOTHING: over the same sample, 0 of 103 digit-bearing patterns resolve to
 * a digit-free institution name, because the roster spells the same category the same way
 * (`Merchant guilds (3-8)` resolves to `Merchant guilds (50-100+)`, which is worse). The
 * roster join is also not free: `institutionMatchesProcessor` lives in a GENERATOR module and
 * importing it here would drag the chain generator into every tab chunk that draws this desk.
 * The annex already rules the fill without it — "a `processingInstitutions[]` row's own
 * recorded name" — and that row is ALREADY the matched subset (`computeActiveChains` returns
 * early where no institution matches), so the chain row alone is both sufficient and honest.
 *
 * ⛔ THE DEFECT THAT IS REAL IS NUMBER AGREEMENT, AND IT SURVIVES EVERY DIGIT CURE. Both
 * `STALLED` seams speak of ONE house — "outlived ITS feed", "the building stands, the skill
 * remains" — so a plural roster row renders "Glassmakers at Steinmark outlived its feed",
 * which is a disagreement in front of a reader. The head word is therefore tested and a
 * plural house is REFUSED rather than repaired: singularising a name would be this desk
 * inventing a spelling, and anchored liveness dropping the pool is strictly better.
 *
 * MEASURED CONSEQUENCE, so the silence is not read as a bug: over 48 settlements, 25 carry a
 * stalled chain; 25 of 25 offer a `proper`-conforming row and 20 of 25 offer a SINGULAR one.
 * The other five are offered only `City walls and gates` and `Glassmakers`, and on those five
 * towns `STALLED` is WITHHELD — silence, never a hole.
 * @param {unknown} processingInstitutions the chain row's own list, whatever the record
 *   wrote there — `unknown` because the caller reads it off a chain row it does not own
 * @returns {string|undefined}
 */
export function craftInstitutionFill(processingInstitutions) {
  const rows = Array.isArray(processingInstitutions) ? processingInstitutions : [];
  for (const row of rows) {
    const name = properFill(text(row));
    // The HEAD WORD carries the number: `Carriers' guild` is a guild, `Glassmakers` are many.
    // A trailing `ss` (`business`) and a possessive (`Cobbler's`) are not plural markers.
    if (name && !/[^s']s$/.test(name.split(/\s+/).pop() || '')) return name;
  }
  return undefined;
}

/**
 * The chain row DS-GEN-18's `STALLED` reading is about — a SELECTION, on `significantEvent`'s
 * own reasoning: the record holds many chains and the corpus writes one sentence, so the
 * choice is stated rather than left to array order. The first row whose `upstreamMissing[]` is
 * non-empty AND whose processing list can name a house, so the key and the fill cannot
 * disagree about which workshop the sentence is about.
 * @param {unknown} chains @returns {ChainRow|null}
 */
function stalledChain(chains) {
  const rows = chainRows(chains).filter(
    (c) => Array.isArray(c.upstreamMissing) && c.upstreamMissing.length > 0,
  );
  return rows.find((c) => craftInstitutionFill(c.processingInstitutions)) || rows[0] || null;
}

/**
 * One row of `economicState.activeChains[]`, as `computeActiveChains` writes it.
 * @typedef {{resource?: unknown, upstreamMissing?: unknown,
 *   processingInstitutions?: unknown}} ChainRow
 */

/**
 * The record's chain rows, object-shaped ones only.
 * @param {unknown} chains @returns {ReadonlyArray<ChainRow>}
 */
function chainRows(chains) {
  return /** @type {ReadonlyArray<ChainRow>} */ (
    (Array.isArray(chains) ? chains : []).filter((c) => c && typeof c === 'object')
  );
}

/**
 * DS-GEN-18's pool — the ANNEX'S OWN ORDERED RESOLUTION, evaluated in the order written and
 * stopping at the first key whose antecedent holds, with a STATED SILENCE where none does.
 *
 * ⛔ THE ORDER AND THE SILENCE ARE ONE RULE AND ARE COPIED, NOT INVENTED. `STALLED` first
 * because `upstreamMissing[]` is the narrowest antecedent and the only one naming a live
 * defect; `HOME-FED` next because it needs TWO records to agree; `BOUGHT-IN` next because
 * `isEntrepot` is a town-level flag true of every craft at once; `UNWORKED` last because the
 * exploitation residue is close to universal and would swamp every reading that explains a
 * workshop. Where none holds the block offers NO VARIANT — an else-arm here would put an
 * authored sentence on an empty record, and R-DST-K already means silence.
 *
 * ⛔⛔ `HOME-FED` WAS DARK, AND THE CAUSE WAS A DEFECT IN THIS FILE RATHER THAN THE FINDING
 * THIS NOTE USED TO RECORD. The paragraph that stood here said the desk "keys it on the
 * canonical token" and reported the join MEASURED "with the canonical `resourceKeyForLabel`
 * join applied". `homeFedChain` did no such thing: it compared a bare `.toLowerCase()` on
 * both sides. The measurement was therefore taken of a join the shipped code never performed,
 * and the note's confidence is exactly how a pool comes to be dark by argument. Corrected
 * 2026-09-13; the join now IS the canonical one and `homeFedChain`'s own docblock carries the
 * figures.
 *
 * ⚠ WHAT REMAINS IS THE ANNEX'S ORDER, AND IT IS A LAW QUESTION RATHER THAN A DEFECT. The
 * two ledgers do speak different vocabularies — `computeActiveChains` names a feed
 * `Camel Herds`, `Alpine Pastures`; the exploitation rows name theirs `camel_herds`,
 * `alpine_pasture` — and reduced to the canonical token they agree on 51 of the 768 RATE-grid
 * towns, against 0 before the cure. But `STALLED` is evaluated first and holds on 33 of those
 * 51, so the key resolves to `HOME-FED` on 18. The alternative — reading
 * `resourceActive === true` — stays refused: it is true of nearly every town and would be a
 * default wearing a reading's clothes, printing "the ground gives it, so the workshop is
 * here" over every town in every world. ⚠ RAISED FOR THE CHAIR, NOT TAKEN HERE: whether a
 * stalled chain should still speak first when the town's own ground demonstrably feeds
 * another chain is the ANNEX'S ordering to settle, not this desk's to reorder.
 * @param {{activeChains?: unknown, exploitation?: {fullyExploited?: unknown,
 *   partiallyExploited?: unknown, unexploited?: unknown}|null, isEntrepot?: unknown,
 *   primaryImports?: unknown}} readings
 * @returns {string|null}
 */
export function craftReasonPoolKey(readings) {
  const ex = readings?.exploitation && typeof readings.exploitation === 'object'
    ? readings.exploitation : {};
  const worked = rawResources(ex.fullyExploited).concat(rawResources(ex.partiallyExploited));
  const key = stalledChain(readings?.activeChains) ? 'STALLED'
    : homeFedChain(readings?.activeChains, worked) ? 'HOME-FED'
      : (readings?.isEntrepot === true || boughtGood(readings?.primaryImports)) ? 'BOUGHT-IN'
        : rawResources(ex.unexploited).length > 0 ? 'UNWORKED' : null;
  return key && CORPUS['DS-GEN-18'].pools[key] ? key : null;
}

/**
 * The `rawResource` words of one exploitation list. The engine writes a mix of prose labels
 * (`medicinal herbs`) and raw tokens (`mountain_timber`) into the same column; both are kept
 * here because the KEY only counts rows, and the shape contract refuses the token at the fill.
 * @param {unknown} list @returns {ReadonlyArray<string>}
 */
function rawResources(list) {
  return (Array.isArray(list) ? list : [])
    .map((row) => text(/** @type {{rawResource?: unknown}|null} */ (row)?.rawResource))
    .filter(Boolean);
}

/**
 * The chain row whose feed the town's own ground is measured to work. Keyed on the canonical
 * resource token both sides can be reduced to, never on either side's display label — the
 * standing label-trap rule, applied across two ledgers rather than within one.
 *
 * ⛔ THE DOCBLOCK ABOVE WAS THE SPECIFICATION AND THE CODE DID NOT MEET IT, WHICH IS WHY THIS
 * NOTE EXISTS. Until 2026-09-13 the body compared a bare `.toLowerCase()` on both sides. The
 * two ledgers do not merely differ in case: `computeActiveChains` writes DISPLAY LABELS
 * (`Camel Herds`, `Mountain Timber`, `Alpine Pastures`) and `resourceGenerator`'s exploitation
 * rows write CATALOGUE TOKENS (`camel_herds`, `mountain_timber`, `alpine_pasture`), so a
 * case-fold joins the two vocabularies never. Measured over the shipped 768-town RATE grid:
 *
 *   bare `.toLowerCase()` (as shipped)            0 of 768 towns join
 *   spaces → underscores                         20 of 768
 *   `resourceKeyForLabel` — THE CANONICAL TOKEN  51 of 768
 *
 * The canonical join is not merely the docblock's word, it is 31 towns better than the naive
 * normalisation, and the gap is the ALIASES: `Alpine Pastures` reduces to `alpine_pasture`
 * and `Fine Glass Sand` to `glass_sand`, which no space-substitution reaches. That function
 * is also the same reduction `computeActiveChains.js:190` applies to its own side, so this
 * desk now reads the chain ledger in the ledger's own terms rather than in its spelling.
 *
 * ⚠ THE FALLBACK IS DELIBERATE AND IS THE OLD BEHAVIOUR, NOT A WIDENING. `resourceKeyForLabel`
 * returns null for prose the catalogue does not know (its own docblock refuses fuzzy matching
 * on purpose). Such a row falls back to its lower-cased self, so an unknown resource joins
 * only its own identical spelling — exactly what the shipped compare did, and never a new
 * pairing invented by this cure.
 *
 * ⚠ CURING THE JOIN IS NECESSARY AND NOT SUFFICIENT, AND THE REST IS THE ANNEX'S ORDER, NOT
 * THIS FUNCTION'S: `craftReasonPoolKey` evaluates `STALLED` first and `BOUGHT-IN` third, and
 * on 33 of the 51 joining towns a stalled chain speaks first. See that function's docblock.
 * @param {unknown} chains @param {ReadonlyArray<string>} worked
 * @returns {ChainRow|null}
 */
function homeFedChain(chains, worked) {
  const canonical = (/** @type {string} */ r) => resourceKeyForLabel(r) || r.toLowerCase();
  const keys = new Set(worked.map(canonical));
  return chainRows(chains).find((c) => {
    const label = text(c.resource);
    return label !== '' && keys.has(canonical(label));
  }) || null;
}

/**
 * The imported feedstock DS-GEN-18's `BOUGHT-IN` names — the first `primaryImports[]` row that
 * can conform to `{good}`'s bare-common shape. An entrepôt with no conforming import still
 * resolves the KEY (its `isEntrepot` flag is the antecedent) and speaks through the one
 * variant that names no good.
 * @param {unknown} imports @returns {string|undefined}
 */
function boughtGood(imports) {
  for (const row of (Array.isArray(imports) ? imports : [])) {
    const good = bareCommonFill(row);
    if (good) return good;
  }
  return undefined;
}

// ── DS-GEN-8 · Overview › Steadings, remnant and ancient ruin (lifecycle) ────────────

/**
 * DS-GEN-8's REMNANT pool — the town's own lifecycle grade.
 *
 * ⭐ A LAWFUL DARK MOUNT, ON THE DS-STR-2 PRECEDENT. `lifecycleStatus` is 0 of 48 on a
 * freshly generated settlement and its writer is real: `settlementLifecycleFirstClass.js:619`
 * stamps the grade when a town dies during a played world. A block whose producer exists but
 * runs off the generation path is DORMANT, and dormant is a true statement rather than a
 * fallback — the mount registry's own general test.
 *
 * ⛔ THE VALUE IS PASSED IN, NEVER REACHED FOR, and the reason is layering rather than taste:
 * the canonical reader is `lifecycleStatusOf` in a WORLDPULSE kernel, and importing it into a
 * display leaf would drag the lifecycle engine into every tab chunk that draws this desk. The
 * caller already holds the record and already spells the same fallback
 * (`SteadingsSection.jsx:35`), so the reading crosses the boundary and the engine does not.
 * @param {unknown} lifecycleStatus @returns {string|null}
 */
export function remnantPoolKey(lifecycleStatus) {
  const grade = text(lifecycleStatus);
  if (!grade) return null;
  const key = `lifecycleStatus: ${grade}`;
  return CORPUS['DS-GEN-8'].pools[key] ? key : null;
}

/**
 * DS-GEN-8's ANCIENT-RUIN pool. STRICTLY OPT-IN, and the opt-in is the measurement:
 * `historyGenerator.js` writes `history.ancientRuin` only under `config.ancientRuinsEnabled`,
 * measured 2 of 48 with the flag on and 0 of 48 without. A town without one is a town with no
 * fallen city beside it, which is a true statement, so the absence renders nothing.
 * @param {{name?: unknown, yearsAgo?: unknown}|null|undefined} ancientRuin @returns {string|null}
 */
export function ancientRuinPoolKey(ancientRuin) {
  if (!properFill(text(ancientRuin?.name))) return null;
  const key = 'history.ancientRuin present';
  return CORPUS['DS-GEN-8'].pools[key] ? key : null;
}

/**
 * DS-GEN-8's PER-STEADING pool, resolved IN THE ANNEX'S OWN WRITTEN ORDER — `provenance ===
 * 'forced'`, then `charterPending`, then the organic else-arm.
 *
 * ⚠ THE ORDER IS A RULING AND IT IS RECORDED. A steading can be BOTH founded by decree and
 * awaiting a charter, and the two pools say different things about it. `forced` wins because
 * it is a fact about the steading's ORIGIN, which is permanent and which the other two arms
 * cannot state; `charterPending` is a fact about its present standing, which the record will
 * itself resolve at the charter (`settlementLifecycleKernel.js:876`). A permanent fact
 * outranks a transient one where one sentence must carry both.
 *
 * ⛔ `provenance` IS A CLOSED FOUR-WORD VOCABULARY — `growth` · `resource_strike` ·
 * `resettlement` · `forced` (`satellitesLedger.js`'s own `SatelliteRecord` typedef) — and the
 * corpus writes a pool for exactly ONE of them. The other three fold to the organic arm,
 * which is what that pool's own prose says: a place close enough to be counted and far enough
 * to be its own. The desk test asserts the fold total over the four.
 * @param {{provenance?: unknown, charterPending?: unknown}|null|undefined} steading
 * @returns {string|null}
 */
export function steadingPoolKey(steading) {
  if (!steading || typeof steading !== 'object') return null;
  const key = text(steading.provenance) === 'forced' ? "steading row: provenance: 'forced'"
    : steading.charterPending === true ? 'steading row: charterPending'
      : 'steading row: organic';
  return CORPUS['DS-GEN-8'].pools[key] ? key : null;
}

// ── DS-REL-1 · Relationships › The neighbour network ────────────────────────────────

/**
 * DS-REL-1's per-tie pool — the standing between this town and ONE neighbour.
 *
 * ⛔⛔ THE ARM IS THE WHOLE DIFFICULTY, AND THE ANNEX SAYS SO IN ITS OWN WORDS: "`patron`
 * and `client` are the two ends of one asymmetric tie and are DIFFERENT SENTENCES. A
 * selector that ignores the arm prints the wrong town's standing." The two pools say
 * opposite things about which hall decides — `{counterpart} looks to {settlement}` against
 * `{settlement}'s decisions are made with {counterpart} in the room` — and both read
 * perfectly fluent while being false about this town.
 *
 * ⇒ THE DIRECTION IS READ FROM `localRelationshipRole`, WHICH IS THE ONE FIELD THAT CARRIES
 * IT. `canonicalRelationship.js` stamps that per-side role from the canonical
 * `sourceRole`/`targetRole` at link time, and `directionalRelationshipLabel` — the estate's
 * own consumer of the same fact — reads exactly this field with `displayRelationshipType` as
 * its legacy fallback. This mirrors that read rather than inventing a second one.
 *
 * ⛔ AND A LINK WITH NO ROLE IS WITHHELD RATHER THAN GUESSED. A legacy row carrying only
 * `relationshipType: 'patron'` does not say WHICH END this town is; picking one would be
 * this desk deciding a town's standing by array position. Both asymmetric pools go silent on
 * such a row and the symmetric ones are unaffected, because a symmetric tie has no end to
 * get wrong.
 *
 * ⚠ MEASURED RESIDUE: `overlord` and `vassal` are real `localRelationshipRole` values and
 * the corpus writes NO pool for either. They render nothing rather than folding into
 * `patron`/`client` — a fold would be this desk ruling that a vassal and a client are the
 * same standing, which is a vocabulary decision and belongs to whoever owns the words. The
 * desk test pins the residue in both directions.
 * @param {{relationshipType?: unknown, localRelationshipRole?: unknown,
 *   displayRelationshipType?: unknown}|null|undefined} link
 * @returns {string|null}
 */
export function neighbourTiePoolKey(link) {
  if (!link || typeof link !== 'object') return null;
  const role = text(link.localRelationshipRole || link.displayRelationshipType).toLowerCase();
  const type = text(link.relationshipType).toLowerCase();
  // An ASYMMETRIC type is readable only through the role. A role that names one of the two
  // ends answers it outright; anything else on an asymmetric type is unanswered, and an
  // unanswered end is silence.
  const key = (role === 'patron' || role === 'client') ? role
    : (type === 'patron' || type === 'client' || type === 'vassal') ? ''
      : type;
  return key && CORPUS['DS-REL-1'].pools[key] ? key : null;
}

/**
 * DS-REL-1's CROSS-SETTLEMENT NPC pool — that some of what passes between the two towns
 * passes between named individuals. Keyed on the tie's own `npcConnections[]`, which is the
 * only record of it; a link with none has not been asked the question and renders nothing.
 * @param {{npcConnections?: unknown}|null|undefined} link @returns {string|null}
 */
export function crossSettlementNpcPoolKey(link) {
  const rows = Array.isArray(link?.npcConnections) ? link.npcConnections : [];
  if (rows.length === 0) return null;
  const key = 'cross-settlement NPC contacts';
  return CORPUS['DS-REL-1'].pools[key] ? key : null;
}

/**
 * DS-REL-1's CROSS-SETTLEMENT ENGAGEMENT pool — a quarrel running between named houses
 * rather than between the towns. `RelationshipsTab.jsx` already separates `faction_engagement`
 * from `conflict` in the same list, and only the first is what this pool is about: the two
 * variants that speak generally say "between named parties and no quarrel between the towns",
 * which is precisely the faction reading and not the NPC one.
 * @param {{type?: unknown}|null|undefined} row @returns {string|null}
 */
export function crossEngagementPoolKey(row) {
  if (text(row?.type) !== 'faction_engagement') return null;
  const key = 'cross-settlement engagements';
  return CORPUS['DS-REL-1'].pools[key] ? key : null;
}

/**
 * The NPC this desk names on a cross-settlement tie — THE ONE ON THIS TOWN'S SIDE.
 *
 * ⛔ THE SIDE IS PART OF THE SENTENCE, not a detail of it: the seam is "{npc} in {settlement}
 * keeps a standing tie in {counterpart}", so naming the NEIGHBOUR's person there would put a
 * stranger inside this town's walls. `npcConnections[]` rows carry both ends by name
 * (`primaryNPCName` is this settlement's, `neighbourNPCName` is theirs —
 * `RelationshipsTab.jsx`'s own npc→settlement map is built from exactly that split), so the
 * local end is read and the far end is never offered.
 * @param {{npcConnections?: unknown}|null|undefined} link @returns {string|undefined}
 */
function localNpcFill(link) {
  for (const row of (Array.isArray(link?.npcConnections) ? link.npcConnections : [])) {
    const name = properFill(text(/** @type {{primaryNPCName?: unknown}|null} */ (row)?.primaryNPCName));
    if (name) return name;
  }
  return undefined;
}

// ── DS-POP-3 · Overview › The direction of the roll, read against the approach ───────

/**
 * DS-POP-3's pool — the trend band's SIGN by the approach's width.
 *
 * ⛔⛔ THE WINDOW GATE IS THE WHOLE DIFFERENCE BETWEEN A READING AND A DEFAULT, and without
 * it this block would be the loudest dead arm in the leaf. `populationTrendBand` returns
 * `{band: 0, net: 0, window: 0}` for an EMPTY ring — its own docblock says "fewer than two
 * readings ⇒ band 0, window < 2 (nothing to trend)" — and `populationHistory` is 0 of 48 on
 * a freshly generated settlement. Keyed on the sign alone, `LEVEL` would fire on EVERY town
 * in EVERY world and print "{settlement}'s roll holds where it is" over a town whose roll
 * has never been read twice. That is a fail-soft default dressed as a reading, which is the
 * `economicBase: mixed` shape the registry's own general test refuses.
 *
 * ⇒ FEWER THAN TWO READINGS IS SILENCE. `DS-POP-2` owns the corpus's only honest sentence
 * about that state (`WINDOW under two readings`) and `DS-POP-2` is marked NO SURFACE, so
 * there is nowhere to say it and R-DST-K governs.
 *
 * ⚠ THE BAND IS PASSED IN, NEVER COMPUTED HERE, AND THE ANNEX REQUIRES IT: "THIS IS
 * `DS-POP-2`'s READER, DELIBERATELY… keying this block on the same one keeps the two POP
 * blocks reading one band rather than two." The canonical reader is
 * `populationTrendBand` in `domain/display/trendLens.js`, which imports `AXIS_TUNING` out of
 * a WORLDPULSE module; reaching for it here would drag the belief-axis chain into every tab
 * chunk that draws this desk, so the caller reads it and hands over the result — the
 * `hookCategories` arrangement, for the same reason.
 *
 * ⚠ THE BELIEVED `populationTrendBand` FIELD ON A BELIEF RECORD IS A DIFFERENT THING THAT
 * SHARES THE NAME and is never this block's source: a believed band is not engine truth.
 *
 * NARROW is `DS-GEN-13`'s convention unchanged — `isolated` · `mountain_pass` ·
 * `mountain_road` — read from the same frozen list one screen up rather than re-spelled.
 * @param {{band?: unknown, window?: unknown}|null|undefined} trend the canonical reader's
 *   own return value, handed over whole so a caller cannot pass a band without its window
 * @param {unknown} tradeRouteAccess
 * @returns {string|null}
 */
export function populationDirectionPoolKey(trend, tradeRouteAccess) {
  const window = typeof trend?.window === 'number' ? trend.window : 0;
  const band = typeof trend?.band === 'number' ? trend.band : null;
  if (window < 2 || band === null || !Number.isFinite(band)) return null;
  const narrow = NARROW_ACCESS.includes(text(tradeRouteAccess));
  const key = band > 0 ? (narrow ? 'RISING-NARROW' : 'RISING-OPEN')
    : band < 0 ? (narrow ? 'FALLING-NARROW' : 'FALLING-OPEN')
      : 'LEVEL';
  return CORPUS['DS-POP-3'].pools[key] ? key : null;
}

// ── THE DESK ────────────────────────────────────────────────────────────────────────

/**
 * The projection a FREE, ANONYMOUS viewer gets: the same shape, silent at every position.
 *
 * §885.3 rules dossier corpus prose a PAID surface. Exported as a value rather than left to
 * each caller to spell, so the gate at the router is ONE expression and no caller can invent
 * a half-silent shape. Frozen at every level, so a caller cannot fill it in either.
 * ⚠ THIS ANNOTATION IS THE DESK'S RETURN CONTRACT — `generalStateProse` declares
 * `@returns {typeof GENERAL_STATE_PROSE_SILENT}`, so any position missing here is a
 * position the desk is not allowed to fill. It named four of the eight and the value
 * carried all eight; the four unnamed ones (`conflicts`, `situation`, `origin`,
 * `warnings`) made the desk's own return unassignable to its own declared type.
 *
 * The list positions are `LegibilityRung|null` and not `LegibilityRung`: `conflicts`
 * keeps a `null` IN PLACE for a quarrel this desk cannot key on, so the index a caller
 * pairs against its own rows cannot slip, and that null is part of the contract.
 * @type {Readonly<{overview: Readonly<{
 *   conflicts: ReadonlyArray<LegibilityRung|null>,
 *   situation: LegibilityRung|null,
 *   origin: ReadonlyArray<LegibilityRung|null>,
 *   systemsHealth: ReadonlyArray<LegibilityRung|null>,
 *   warnings: ReadonlyArray<LegibilityRung|null>,
 *   ground: LegibilityRung|null,
 *   market: LegibilityRung|null,
 *   institutions: LegibilityRung|null,
 *   notableConnection: ReadonlyArray<LegibilityRung|null>,
 *   populationDirection: LegibilityRung|null,
 * }>, history: Readonly<{
 *   identity: ReadonlyArray<LegibilityRung|null>,
 *   founded: LegibilityRung|null,
 *   record: LegibilityRung|null,
 * }>, viability: Readonly<{
 *   verdict: ReadonlyArray<LegibilityRung|null>,
 * }>, hooks: Readonly<{
 *   framing: ReadonlyArray<LegibilityRung|null>,
 * }>, economics: Readonly<{
 *   craftReason: LegibilityRung|null,
 * }>, relationships: Readonly<{
 *   network: ReadonlyArray<ReadonlyArray<LegibilityRung|null>>,
 *   engagements: ReadonlyArray<LegibilityRung|null>,
 * }>, steadings: Readonly<{
 *   remnant: LegibilityRung|null,
 *   ruin: LegibilityRung|null,
 *   rows: ReadonlyArray<LegibilityRung|null>,
 * }>}>}
 */
export const GENERAL_STATE_PROSE_SILENT = Object.freeze({
  overview: Object.freeze({
    conflicts: Object.freeze([]),
    situation: null,
    origin: Object.freeze([]),
    systemsHealth: Object.freeze([]),
    warnings: Object.freeze([]),
    ground: null,
    market: null,
    institutions: null,
    notableConnection: Object.freeze([]),
    populationDirection: null,
  }),
  history: Object.freeze({
    identity: Object.freeze([]),
    founded: null,
    record: null,
  }),
  viability: Object.freeze({ verdict: Object.freeze([]) }),
  hooks: Object.freeze({ framing: Object.freeze([]) }),
  economics: Object.freeze({ craftReason: null }),
  steadings: Object.freeze({ remnant: null, ruin: null, rows: Object.freeze([]) }),
  relationships: Object.freeze({ network: Object.freeze([]), engagements: Object.freeze([]) }),
});

/**
 * THE DESK, page-wide, GROUPED BY POSITION rather than by lens.
 *
 * ⭐ THE GROUPING IS THE GUARD, and it is why this desk does not return a flat bag of rungs
 * the way the two single-tab desks do. This leaf's blocks land on seven different tabs, and a
 * flat bag would let a caller pass the ground line to the market position with nothing to
 * notice. A caller receives the frozen group for the position it is drawing and can pass
 * along only what that position owns, so the misplacement is unreachable rather than merely
 * detectable. `drawnAtMount` then applies the registry's own depth ruling on top.
 *
 * @param {{name?: string}|null|undefined} settlement
 * @param {{scores?: Record<string, unknown>|null, prosperity?: unknown, safetyLabel?: unknown,
 *   viable?: unknown, readinessLabel?: unknown, foodSecurityLabel?: unknown,
 *   terrainType?: unknown, institutions?: unknown, tradeRouteAccess?: unknown,
 *   isEntrepot?: unknown, inst?: object|null, tier?: unknown, primaryStress?: unknown,
 *   foodBalance?: object|null,
 *   conflicts?: Array<{intensity?: unknown, parties?: unknown, issue?: unknown,
 *     stakes?: unknown}|null>|null,
 *   govFaction?: unknown, structuralViolations?: unknown, structuralSuggestions?: unknown,
 *   coherenceNotes?: Array<{type?: unknown, tab?: unknown}|null>|null,
 *   criticalIssueCount?: unknown, prominentRelationship?: unknown,
 *   relationships?: ReadonlyArray<{flagDriven?: unknown}|null>|null,
 *   hookCategories?: ReadonlyArray<unknown>|null,
 *   clockIds?: ReadonlyArray<unknown>|null, governingName?: unknown,
 *   activeChains?: unknown, primaryImports?: unknown,
 *   lifecycleStatus?: unknown, steadings?: ReadonlyArray<unknown>|null,
 *   ancientRuin?: {name?: unknown, yearsAgo?: unknown}|null,
 *   neighbours?: ReadonlyArray<unknown>|null, crossEngagements?: ReadonlyArray<unknown>|null,
 *   populationTrend?: {band?: unknown, window?: unknown}|null,
 *   exploitation?: {fullyExploited?: unknown, partiallyExploited?: unknown,
 *     unexploited?: unknown}|null,
 *   history?: {age?: unknown, historicalCharacter?: unknown,
 *     founding?: {foundedBy?: unknown, initialChallenge?: unknown}|null,
 *     historicalEvents?: Array<{type?: unknown, name?: unknown, yearsAgo?: unknown,
 *       anchored?: unknown, lastingEffects?: unknown}|null>|null}|null}} [readings]
 *   the caller's own reads off the settlement it
 *   already holds; see institutionsPoolKey for why `inst` is passed and not reached for.
 *   ⚠ THE LAST FIVE ARE THE DS-GEN-2 AND DS-GEN-7 READS AND THEY WERE UNDECLARED. The body
 *   has always reached for `conflicts`, `govFaction`, `structuralViolations`,
 *   `structuralSuggestions` and `coherenceNotes`; leaving them off this list meant the one
 *   caller had no typed statement of what the desk needs handed to it. Each row names only
 *   the fields this desk actually reads off it — `intensity` for the pool cut, `parties` /
 *   `issue` / `stakes` for the slots — so a producer change to any of them lands here
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {typeof GENERAL_STATE_PROSE_SILENT}
 */
export function generalStateProse(settlement, readings = {}, options = {}) {
  // ONE FACE PER POWER (ADDENDUM 18 ruling 15; car 8b-W-18c): the town's roster of sources,
  // computed ONCE here and spread into every composer call below with the rest of `options`.
  options = withFaceSources(settlement, options);
  const slots = { settlement: properFill(text(settlement?.name)) };

  // ⭐ ROUTED THROUGH THE COMPOSER (SEAM car 3g), at all eleven of this desk's call sites.
  // The spine key is this desk's own key function and every bag, dimension answer and
  // per-lens override is unchanged; the candidates leaf offers the modifier pools the state
  // earned, and is EMPTY until car 9 authors them. An empty list composes to the kernel's
  // own draw, which is why the manifest cannot move on this routing.
  /** @param {string} blockId @param {string|null} poolKey @param {string} glance */
  const rung = (blockId, poolKey, glance = '') => (poolKey
    ? legibilityRung(glance, composeStateProse(CORPUS, blockId, {
      ...options, slots, spineKey: poolKey, candidates: generalStateProseCandidates(blockId, readings),
    }), [])
    : null);

  // DS-GEN-3's ten lenses, in the order the Systems Health dashboard already prints them:
  // the four status tags, the five score bars, then the live food band. The order is the
  // page's, so a reader meets each sentence beside the row it is about.
  const scores = readings.scores || {};
  const health = [
    rung('DS-GEN-3', prosperityPoolKey(readings.prosperity), text(readings.prosperity)),
    rung('DS-GEN-3', safetyPoolKey(readings.safetyLabel), text(readings.safetyLabel).split('—')[0].trim()),
    rung('DS-GEN-3', viabilityPoolKey(readings.viable), ''),
    rung('DS-GEN-3', readinessPoolKey(readings.readinessLabel), text(readings.readinessLabel)),
    ...SCORE_AXES.map((axis) => rung('DS-GEN-3', systemsHealthScorePoolKey(axis, scores[axis]), '')),
    rung('DS-GEN-3', foodSecurityPoolKey(readings.foodSecurityLabel), text(readings.foodSecurityLabel)),
  ].filter((line) => line && line.sentence);

  // DS-GEN-6's demoted STATE dimension (kernel law 5). An unanswered dimension reads as
  // silence, so the block renders nothing on a settlement with no food arithmetic — which
  // is what an unmeasured town honestly is, not a town that feeds itself.
  const deficit = foodDeficitDimension(readings.foodBalance);
  /** @param {string|null} poolKey */
  const originLine = (poolKey) => (poolKey && deficit
    ? legibilityRung('', composeStateProse(CORPUS, 'DS-GEN-6', {
      ...options, slots, dimensions: { deficit },
      spineKey: poolKey, candidates: generalStateProseCandidates('DS-GEN-6', readings),
    }), [])
    : null);
  const origin = [
    originLine(originRoutePoolKey(readings.tradeRouteAccess)),
    originLine(originTierPoolKey(readings.tier)),
  ].filter((line) => line && line.sentence);

  // DS-GEN-2, ONE LINE PER CONFLICT, in the caller's own order so a component can render
  // each beside the row it is about. Still ONE position on the page-set — the crisis-banner
  // precedent — and a conflict this desk cannot key on yields `null` in place rather than
  // shortening the list, so the index pairing a caller relies on cannot slip.
  const conflicts = Object.freeze((Array.isArray(readings.conflicts) ? readings.conflicts : [])
    .map((conflict) => {
      const key = conflictIntensityPoolKey(conflict);
      if (!key) return null;
      const parties = Array.isArray(conflict?.parties) ? conflict.parties : [];
      return legibilityRung('', composeStateProse(CORPUS, 'DS-GEN-2', {
        ...options,
        spineKey: key,
        candidates: generalStateProseCandidates('DS-GEN-2', readings),
        slots: {
          ...slots,
          faction: properFill(text(parties[0])),
          faction2: properFill(text(parties[1])),
          issue: phraseFill(conflict?.issue),
          stakes: phraseFill(conflict?.stakes),
        },
      }), []);
    }));

  // DS-GEN-7. The two list pools first — they are the ones an ordinary settlement carries —
  // then one line per coherence note in the record's own order.
  const warningSlots = { ...slots, govFaction: properFill(text(readings.govFaction)) };
  /** @param {string|null} poolKey */
  const warningLine = (poolKey) => (poolKey
    ? legibilityRung('', composeStateProse(CORPUS, 'DS-GEN-7', {
      ...options, slots: warningSlots,
      spineKey: poolKey, candidates: generalStateProseCandidates('DS-GEN-7', readings),
    }), [])
    : null);
  const warnings = Object.freeze([
    warningLine(structuralViolationsPoolKey(readings.structuralViolations)),
    warningLine(structuralSuggestionsPoolKey(readings.structuralSuggestions)),
    ...(Array.isArray(readings.coherenceNotes) ? readings.coherenceNotes : [])
      .map((note) => warningLine(coherencePoolKey(note))),
  ].filter((line) => line && line.sentence));

  // ── THE HISTORY CHAPTER ────────────────────────────────────────────────────────────
  // DS-GEN-9 speaks about the TOWN and about the one event it selects; DS-GEN-16 speaks
  // about the RECORD as a whole. Two blocks, two questions, two positions — the C3 law
  // forbids one BLOCK speaking twice, not two blocks reading one record, which the page
  // already does with `history.currentTensions` on three tabs.
  const hist = readings.history && typeof readings.history === 'object' ? readings.history : {};
  const events = Array.isArray(hist.historicalEvents) ? hist.historicalEvents : [];
  const marker = significantEvent(events);
  const anchor = eventAnchorDimension(marker?.anchored);
  // ⛔ THREE OF DS-GEN-9's SLOTS ARE DELIBERATELY UNFILLED, each for a MEASURED reason, and
  // together they cost ONE variant of the `founding` pool's five. The pool still speaks —
  // two of its variants name only `{settlement}` — which is the powerStateProse precedent
  // for `{timeband_age}` and is measured here rather than assumed.
  //   • `{founder}` — the annex declares it `proper` (A NAME). Its only producer,
  //     `history.founding.foundedBy`, writes a lowercase DESCRIPTIVE PHRASE: "a miller who
  //     built a mill and found customers before they found customers". Filling it would mean
  //     this desk declaring one shape and supplying another, which is the shape contract
  //     lying rather than holding. ⚠ RAISED FOR THE CHAIR: the annex's shape and the only
  //     writer of the field disagree, and only one of them can move.
  //   • `{challenge}` — `phrase` and fillable, but it is named by the SAME single variant
  //     `{founder}` is, so filling it alone buys nothing.
  //   • `{reason}` — this is the wiring-time decision the annex explicitly left open ("it
  //     has no producer, so this is decidable at wiring and not before"). DECIDED: the only
  //     candidate, `history.founding.reason`, is a PREDICATE CLAUSE — "was founded by
  //     foresters managing the woodland under charter" — and every seam wants a bare noun
  //     ("out by the {reason} that followed"). It is the wrong grammatical category, and a
  //     verb phrase in a noun's seam is a broken sentence in front of a reader.
  const identitySlots = {
    ...slots,
    timeband_age: timebandAgeFill(hist.age),
  };
  /** @param {string|null} poolKey @param {Record<string, unknown>} [extra] */
  const identityLine = (poolKey, extra = {}) => (poolKey
    ? legibilityRung('', composeStateProse(CORPUS, 'DS-GEN-9', {
      ...options, slots: { ...identitySlots, ...extra }, ...(anchor ? { dimensions: { anchor } } : {}),
      spineKey: poolKey, candidates: generalStateProseCandidates('DS-GEN-9', readings),
    }), [])
    : null);
  const markerSlots = marker ? {
    event: properFill(text(marker.name)),
    timeband_since: timebandSinceFill(marker.yearsAgo),
    timeband_age: timebandAgeFill(marker.yearsAgo),
  } : {};
  const identity = Object.freeze([
    identityLine(hist.founding ? 'founding' : null),
    identityLine(text(hist.historicalCharacter) ? 'historicalCharacter' : null),
    identityLine(marker ? eventTypePoolKey(marker.type) : null, markerSlots),
    identityLine(marker ? recencyFramingPoolKey(marker.yearsAgo) : null, markerSlots),
  ].filter((l) => l && l.sentence));

  const calamityRow = recordCalamityEvent(events);
  const recordKey = events.length > 0 ? eventRecordPoolKey(events) : null;

  // ── DS-GEN-18 ──────────────────────────────────────────────────────────────────────
  // The key first, then the slots FROM THE ROW THE KEY CHOSE. `{resource}` reads the chain's
  // own feed on the two chain-keyed arms and the exploitation ledger's residue on UNWORKED,
  // because those are the two records those keys are ABOUT; `{good}` is offered only where a
  // conforming import exists, and `{institution}` only where a singular house does.
  const craftKey = craftReasonPoolKey(readings);
  const stalledRow = craftKey === 'STALLED' ? stalledChain(readings.activeChains) : null;
  const workedRow = craftKey === 'HOME-FED'
    ? homeFedChain(readings.activeChains, rawResources(readings.exploitation?.fullyExploited)
      .concat(rawResources(readings.exploitation?.partiallyExploited)))
    : null;
  const craftRow = stalledRow || workedRow;
  const craftSlots = {
    ...slots,
    institution: craftInstitutionFill(craftRow?.processingInstitutions),
    // ⛔ `{resource}` IS NOT OFFERED ON `STALLED`, AND THE REASON WAS FOUND IN RENDERED
    // PROSE RATHER THAN IN REASONING. The seam is "the {resource} stopped arriving", so the
    // slot names THE FEED THAT FAILED — and the only producer of that fact is the chain's
    // `upstreamMissing[]`, which holds CHAIN IDS (`warehouse_logistics`, `food_processing`,
    // `precious_metals_mining`): raw engine tokens the shape contract refuses outright, and
    // not resource names in any case. Filling from the chain's own `resource` instead
    // printed **"the hunting grounds stopped arriving"** and **"the iron ore deposits
    // stopped arriving"** — the town's own standing ground, described as a delivery that
    // failed, which is false about the town and not merely awkward. The slot is left
    // UNFILLED and anchored liveness drops the one variant naming it; the `ledger` variant
    // names only `{settlement}` and `{institution}` and carries the pool.
    resource: craftKey === 'UNWORKED'
      ? bareCommonFill(rawResources(readings.exploitation?.unexploited)[0])
      : craftKey === 'HOME-FED' ? bareCommonFill(craftRow?.resource) : undefined,
    good: craftKey === 'BOUGHT-IN' ? boughtGood(readings.primaryImports) : undefined,
  };
  const craftReasonLine = craftKey
    ? legibilityRung('', composeStateProse(CORPUS, 'DS-GEN-18', {
      ...options, slots: craftSlots,
      spineKey: craftKey, candidates: generalStateProseCandidates('DS-GEN-18', readings),
    }), [])
    : null;

  // ── DS-GEN-8 ───────────────────────────────────────────────────────────────────────
  // THE REMNANT, THE ANCIENT RUIN, THEN ONE LINE PER STEADING — the order
  // `SteadingsSection.jsx` already renders those three things in, so each sentence meets the
  // reader beside the banner or the card it is about. Every one of them is DORMANT on a
  // freshly generated town and every one has a real writer off the generation path.
  // ⛔ THE RUIN IS ITS OWN READING, NOT A REACH INTO `history`, AND A RATCHET SAID SO.
  // Reading `hist.ancientRuin` here put a NEW identity into
  // `check-observed-shape-readers.mjs` — "ancientRuin on history, 3 read(s)" — because the
  // scanner's corpus never sets `config.ancientRuinsEnabled` and so has never observed the
  // key. Measured: the field appears on 1 of 12 seeds with the flag on and 0 of 12 without,
  // so the scan is right about its corpus and wrong about the writer. The estate has already
  // accepted this read at `SteadingsSection.jsx`, which carries a frozen row for it and
  // already spells it at its own line 36 — so the caller reads it and hands it over, exactly
  // as it hands over the grade and the steadings.
  const ruin = readings.ancientRuin && typeof readings.ancientRuin === 'object'
    ? readings.ancientRuin : null;
  const ruinSlots = ruin ? {
    ...slots,
    ruin: properFill(text(ruin.name)),
    timeband_since: timebandSinceFill(ruin.yearsAgo),
    timeband_age: timebandAgeFill(ruin.yearsAgo),
  } : slots;
  const ruinKey = ruin ? ancientRuinPoolKey(ruin) : null;
  // ⚠ ONE LINE PER STEADING, INDEX-PAIRED with the caller's own cards, and a steading this
  // desk cannot key on or cannot NAME keeps a `null` IN PLACE rather than shortening the
  // list — the DS-GEN-2 conflict-row rule, for the same reason: the caller renders each
  // sentence inside the card it is about, and a shortened list slips the pairing by one.
  const steadingRows = Object.freeze((Array.isArray(readings.steadings) ? readings.steadings : [])
    .map((row) => {
      const key = steadingPoolKey(row);
      if (!key) return null;
      const line = legibilityRung('', composeStateProse(CORPUS, 'DS-GEN-8', {
        ...options,
        slots: { ...slots, steading: properFill(text(/** @type {{name?: unknown}} */ (row)?.name)) },
        spineKey: key,
        candidates: generalStateProseCandidates('DS-GEN-8', readings),
      }), []);
      return line && line.sentence ? line : null;
    }));
  const remnantLine = rung('DS-GEN-8', remnantPoolKey(readings.lifecycleStatus), '');

  // ── DS-REL-1 ───────────────────────────────────────────────────────────────────────
  // ONE LINE PER NEIGHBOUR LINK, INDEX-PAIRED with the caller's own cards. Two lenses meet
  // at each tie — the standing, and whether the tie runs through named people — and the
  // standing leads because the card prints its badge directly above.
  /** @param {string|null} key @param {Record<string, unknown>} slotBag */
  const relLine = (key, slotBag) => (key
    ? legibilityRung('', composeStateProse(CORPUS, 'DS-REL-1', {
      ...options, slots: slotBag,
      spineKey: key, candidates: generalStateProseCandidates('DS-REL-1', readings),
    }), [])
    : null);
  // ⚠ ONE INNER GROUP PER LINK, never a flattened list: the caller renders each pair inside
  // the card it is about, and a flat array of two-per-link makes the pairing an arithmetic
  // the caller has to get right. The group is the guard, exactly as it is for the desk's
  // page-level positions.
  const network = Object.freeze((Array.isArray(readings.neighbours) ? readings.neighbours : [])
    .map((link) => {
      const bag = {
        ...slots,
        counterpart: properFill(text(/** @type {{neighbourName?: unknown}} */ (link)?.neighbourName)),
        npc: localNpcFill(link),
      };
      return Object.freeze([
        relLine(neighbourTiePoolKey(link), bag),
        relLine(crossSettlementNpcPoolKey(link), bag),
      ].map((l) => (l && l.sentence ? l : null)));
    }));
  const engagements = Object.freeze((Array.isArray(readings.crossEngagements) ? readings.crossEngagements : [])
    .map((row) => {
      const line = relLine(crossEngagementPoolKey(row), {
        ...slots,
        counterpart: properFill(text(/** @type {{partnerSettlement?: unknown}} */ (row)?.partnerSettlement)),
        faction: properFill(text(/** @type {{factionName?: unknown}} */ (row)?.factionName)),
      });
      return line && line.sentence ? line : null;
    }));
  const ruinLine = ruinKey
    ? legibilityRung('', composeStateProse(CORPUS, 'DS-GEN-8', {
      ...options, slots: ruinSlots,
      spineKey: ruinKey, candidates: generalStateProseCandidates('DS-GEN-8', readings),
    }), [])
    : null;

  return Object.freeze({
    // DS-REL-1 at ONE position: the neighbour network, two lines per tie, plus the
    // cross-settlement engagements the same tab prints below them.
    relationships: Object.freeze({ network, engagements }),
    // DS-GEN-8's three surfaces, kept APART rather than folded into one list: the remnant
    // banner, the ancient-ruin banner and the steading cards are three places on the page,
    // and a caller handed one flat list would have to guess which line belongs where.
    steadings: Object.freeze({
      remnant: remnantLine && remnantLine.sentence ? remnantLine : null,
      ruin: ruinLine && ruinLine.sentence ? ruinLine : null,
      rows: steadingRows,
    }),
    overview: Object.freeze({
      conflicts,
      situation: rung('DS-GEN-5', situationPoolKey(readings), ''),
      origin: Object.freeze(origin),
      systemsHealth: Object.freeze(health),
      warnings,
      ground: rung('DS-GEN-12', groundPoolKey(readings.terrainType), ''),
      market: rung('DS-GEN-13', marketPoolKey(readings), ''),
      institutions: rung('DS-GEN-17', institutionsPoolKey(readings.inst), ''),
      // DS-REL-2's two lenses at ONE position: the tie the town names first, then how much
      // of its roll this town's own conditions made. The connection line leads because the
      // page prints its datum directly beneath.
      // DS-POP-3 beside the population figure the identity strip already prints — the only
      // place in the dossier that head count reaches a reader.
      populationDirection: rung('DS-POP-3',
        populationDirectionPoolKey(readings.populationTrend, readings.tradeRouteAccess), ''),
      notableConnection: Object.freeze([
        rung('DS-REL-2', notableConnectionPoolKey(readings.prominentRelationship), ''),
        rung('DS-REL-2', flagDrivenPoolKey(readings.relationships), ''),
      ].filter((l) => l && l.sentence)),
    }),
    // DS-GEN-11's three lenses over one verdict, in the order ViabilityTab already prints
    // them: the verdict, the contradiction count, and the caveat about WHEN the reading was
    // taken — which the tab states as a datum in its own words directly beneath the headline.
    viability: Object.freeze({
      verdict: Object.freeze([
        rung('DS-GEN-11', viabilityVerdictPoolKey(readings.viable), ''),
        rung('DS-GEN-11', criticalIssuePoolKey(readings.criticalIssueCount), ''),
        rung('DS-GEN-11', 'THE FIRST-SURVEY QUALIFICATION', ''),
      ].filter((line) => line && line.sentence)),
    }),
    // DS-HK-1. ONE line per category the page actually carries hooks for, then one per live
    // escalation clock — the framing the hooks are read FROM, never the hook prose, which
    // keeps its own words on the rows below.
    hooks: Object.freeze({
      framing: Object.freeze([
        ...[...new Set((Array.isArray(readings.hookCategories) ? readings.hookCategories : [])
          .map((c) => hookCategoryPoolKey(c)).filter(Boolean))]
          .map((key) => rung('DS-HK-1', key, '')),
        ...[...new Set((Array.isArray(readings.clockIds) ? readings.clockIds : [])
          .map((id) => escalationClockPoolKey(id)).filter(Boolean))]
          .map((key) => (key
            ? legibilityRung('', composeStateProse(CORPUS, 'DS-HK-1', {
              ...options, slots: { ...slots, governing: properFill(text(readings.governingName)) },
              spineKey: key, candidates: generalStateProseCandidates('DS-HK-1', readings),
            }), [])
            : null)),
      ].filter((line) => line && line.sentence)),
    }),
    // DS-GEN-18 at ONE position on the economics page, beside the supply-chain rows the
    // reading is about. The slots are drawn from the SAME chain row the key was decided by,
    // so the sentence and the house it names cannot describe two different workshops.
    economics: Object.freeze({ craftReason: craftReasonLine }),
    history: Object.freeze({
      identity,
      founded: rung('DS-GEN-14', foundedPoolKey(hist), ''),
      record: recordKey
        ? legibilityRung('', composeStateProse(CORPUS, 'DS-GEN-16', {
          ...options,
          spineKey: recordKey,
          candidates: generalStateProseCandidates('DS-GEN-16', readings),
          slots: {
            ...slots,
            calamity: calamityFill(calamityRow?.name),
            timeband_age: timebandAgeFill(calamityRow?.yearsAgo),
          },
        }), [])
        : null,
    }),
  });
}
