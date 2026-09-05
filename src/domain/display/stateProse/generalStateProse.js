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
 * ── THE ONE IMPORT IS FREE, AND IT IS THE CANONICAL LADDER ───────────────────────────
 * `defenseScoreBands.js` is a pure zero-import leaf already reached by three dossier chunks,
 * so `scoreBand` — the one 65/40/20 cut the PDF and the Defense tab already print — costs
 * nothing here. `prosperityRank.js` is deliberately NOT imported: this desk needs its
 * VOCABULARY, not its arithmetic, and the desk test asserts PROSPERITY_POOL_OF total against
 * `PROSPERITY_RANK` where a test import costs no production bytes.
 *
 * @enforced-by tests/domain/generalStateProseDesk.test.js
 */
import { DOSSIER_STATE_PROSE_GENERAL } from '../../../data/dossierStateProse/general.generated.js';
import { scoreBand } from '../defenseScoreBands.js';
import { readStateProse } from './stateProseKernel.js';
import { legibilityRung } from './legibilityRung.js';

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
export const SLOT_FILL_SHAPES = Object.freeze({ settlement: 'proper' });

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

/** tier → DS-GEN-6's tier-overlay pool. TOTAL: every tier resolves, including the others. */
const TIER_OVERLAY_OF = Object.freeze({
  metropolis: 'tier overlay: metropolis',
  city: 'tier overlay: city',
  thorp: 'tier overlay: thorp / hamlet',
  hamlet: 'tier overlay: thorp / hamlet',
});

/**
 * THE DEMOTED `deficit` DIMENSION, derived exactly as `generateSettlementReason` derives it:
 * the gap is the LARGER of the pre-import `rawDeficit` and the post-import residual
 * `deficit`, and it counts when it is positive and at or above five percent of daily need.
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
 * @param {{dailyNeed?: unknown, need?: unknown, deficit?: unknown, rawDeficit?: unknown}|null|undefined} foodBalance
 * @returns {string|null} a value of STATE_MARK_DIMENSIONS.deficit, or null
 */
export function foodDeficitDimension(foodBalance) {
  if (!foodBalance || typeof foodBalance !== 'object') return null;
  const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
  const gap = Math.max(num(foodBalance.rawDeficit), num(foodBalance.deficit));
  const need = num(foodBalance.dailyNeed) || num(foodBalance.need);
  return (gap > 0 && (need <= 0 || gap / need >= 0.05)) ? 'deficit' : 'no deficit';
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
 * be a second opinion about which rows count.
 * @param {{institutions?: unknown, tradeRouteAccess?: unknown, isEntrepot?: unknown}} state
 * @returns {string|null}
 */
export function marketPoolKey(state) {
  const rows = Array.isArray(state?.institutions) ? state.institutions : [];
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

// ── THE DESK ────────────────────────────────────────────────────────────────────────

/**
 * The projection a FREE, ANONYMOUS viewer gets: the same shape, silent at every position.
 *
 * §885.3 rules dossier corpus prose a PAID surface. Exported as a value rather than left to
 * each caller to spell, so the gate at the router is ONE expression and no caller can invent
 * a half-silent shape. Frozen at every level, so a caller cannot fill it in either.
 * @type {Readonly<{overview: Readonly<{systemsHealth: ReadonlyArray<object>, ground: object|null, market: object|null, institutions: object|null}>}>}
 */
export const GENERAL_STATE_PROSE_SILENT = Object.freeze({
  overview: Object.freeze({
    situation: null,
    origin: Object.freeze([]),
    systemsHealth: Object.freeze([]),
    ground: null,
    market: null,
    institutions: null,
  }),
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
 *   foodBalance?: object|null}} [readings] the caller's own reads off the settlement it
 *   already holds; see institutionsPoolKey for why `inst` is passed and not reached for
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {typeof GENERAL_STATE_PROSE_SILENT}
 */
export function generalStateProse(settlement, readings = {}, options = {}) {
  const slots = { settlement: properFill(text(settlement?.name)) };

  /** @param {string} blockId @param {string|null} poolKey @param {string} glance */
  const rung = (blockId, poolKey, glance = '') => (poolKey
    ? legibilityRung(glance, readStateProse(CORPUS, blockId, poolKey, { ...options, slots }), [])
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
  const originLine = (poolKey) => (poolKey && deficit
    ? legibilityRung('', readStateProse(CORPUS, 'DS-GEN-6', poolKey, {
      ...options, slots, dimensions: { deficit },
    }), [])
    : null);
  const origin = [
    originLine(originRoutePoolKey(readings.tradeRouteAccess)),
    originLine(originTierPoolKey(readings.tier)),
  ].filter((line) => line && line.sentence);

  return Object.freeze({
    overview: Object.freeze({
      situation: rung('DS-GEN-5', situationPoolKey(readings), ''),
      origin: Object.freeze(origin),
      systemsHealth: Object.freeze(health),
      ground: rung('DS-GEN-12', groundPoolKey(readings.terrainType), ''),
      market: rung('DS-GEN-13', marketPoolKey(readings), ''),
      institutions: rung('DS-GEN-17', institutionsPoolKey(readings.inst), ''),
    }),
  });
}
