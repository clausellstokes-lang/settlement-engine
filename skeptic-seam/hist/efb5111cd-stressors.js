/**
 * domain/display/stateProse/stressorsStateProse.js — DESK CAR 10: THE STRESSOR DESK.
 *
 * The third desk module, and the first on a leaf whose state is written AT GENERATION on
 * both of its wired blocks — so unlike the last three power blocks, these speak at birth.
 *
 *   DS-STR-1  Overview › Active crisis banners — `settlement.stress[] {type, label, …}`
 *   DS-CND-1  Overview › Active conditions — `settlement.activeConditions[] {archetype,
 *             severityBand, status, triggeredAt, duration, causes}`
 *   DS-STR-2  Stressor lifecycle and origin — `worldState.stressors[] {lifecycleStage,
 *             originContext}`, a CONDITIONAL SURFACE (play-time state)
 *
 * ── WHY THIS LEAF NEXT, MEASURED AT THE VARIANT LEVEL ────────────────────────────────
 *
 * The scoping recorded `stressors` as inheriting all three §0c-4 shape residues and flagged
 * `{band}`. Counted as variant USES rather than blocks that DECLARE one, the whole leaf
 * carries `{band}` ×1 and `{reason}` ×6 out of 246 variants — ten variant-uses of residue,
 * which is a handful of dropped sentences under anchored liveness rather than a gate. The
 * general lesson, now the metric this arc uses: A DECLARATION COUNT IS NOT A USAGE COUNT.
 *
 * ── THE IMPORTS ARE FREE, MEASURED ───────────────────────────────────────────────────
 * `data/stressTypes.js` and `domain/activeConditions.js` are ALREADY in the first-paint
 * static closure of `src/main.jsx` (233 modules; the walk is proven non-vacuous by the
 * `store/index.js` eager anchor), so importing their classifiers costs no additional bytes
 * anywhere. That is why this desk imports `severityBand` and `isEventSourcedCondition`
 * directly instead of taking them as readings: the reference desk's own precedent is to
 * IMPORT a canonical classifier (`prosperityRank`) and to take a derived VIEW-MODEL reading
 * as an argument (`foodBalance`). These are classifiers.
 * ⚠ FIRST-PAINT HEADROOM ITSELF REMAINS UNMEASURED — the 504 B figure in the scoping is
 * stale and is not acted on here. This note is about MEMBERSHIP, which is structural, not
 * about the budget, which needs a build gate.
 *
 * ── THE CRISIS BANNER KEYS ARE THE TYPE TOKEN, NOT THE LABEL, AND THAT IS A CURE ─────
 * `STRESS_TYPE_MAP` carries a reader-facing `label` per type, and 13 of the 15 labels
 * uppercase exactly onto a banner pool key. TWO DO NOT: `indebted` labels "Indebted to
 * Outside Power" against the pool `INDEBTED TO AN OUTSIDE POWER`, and
 * `religious_conversion` labels "Religious Conversion" against the pool `RELIGIOUS CRISIS`.
 * So a `label.toUpperCase()` route would have silently darkened 2 of 15 banners — the
 * quiet-degradation shape this subsystem exists to refuse. This desk keys on the TYPE
 * TOKEN, which is the stable machine identity (a label is display prose and may be
 * re-worded), through the closed map below, and the desk test asserts that map TOTAL in
 * both directions: every producer type has an entry, and every banner pool is claimed by
 * exactly one. ⚠ The two divergences are raised for the chair as a naming question — the
 * corpus and the label table disagree, and either side could be the one to move.
 *
 * ── §0d, THE DIGIT BAN ───────────────────────────────────────────────────────────────
 * The banner keeps its own datum (label, summary, hook); the prose bands the same fact.
 *
 * @enforced-by tests/domain/stressorsStateProseDesk.test.js
 */
import { STRESS_TYPE_MAP } from '../../../data/stressTypes.js';
import { severityBand } from '../../activeConditions.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../../data/dossierStateProse/stressors.generated.js';
import { composeStateProse } from './composeStateProse.js';
import { stressorsStateProseCandidates } from './stressorsStateProseCandidates.js';
import { legibilityRung } from './legibilityRung.js';

/**
 * The desk's corpus, typed at the import boundary — the generated leaves stay PURE DATA.
 * @type {import('./stateProseKernel.js').StateProseCorpus}
 */
const CORPUS = /** @type {import('./stateProseKernel.js').StateProseCorpus} */ (
  /** @type {unknown} */ (DOSSIER_STATE_PROSE_STRESSORS)
);

/**
 * THE SHAPES THIS DESK BELIEVES ITS SLOTS HAVE, mirroring §0c's Shape column. Only
 * `{settlement}` is filled; see SLOT_FILL_TABLES for what is deliberately left alone.
 * @type {Readonly<Record<string, string>>}
 */
export const SLOT_FILL_SHAPES = Object.freeze({ settlement: 'proper' });

/**
 * This desk owns NO literal fill table, and the empty object is the honest declaration.
 * ⚠ FOUR SLOTS ARE DELIBERATELY UNFILLED, each named by ONE OR FEW variants, so anchored
 * liveness drops those variants and no POOL is lost — measured, not assumed:
 *   `{season}` (FAMINE, 1 of 6) · `{band}` (MASS MIGRATION, 1 of 6, and RESERVED so it
 *   cannot be filled at all) · `{reason}` (PROVENANCE, bare-common with no producer) ·
 *   `{timeband_age}` (PROVENANCE — the former EXISTS; the refusal is measured below).
 * @type {Readonly<Record<string, Readonly<Record<string, string>>>>}
 */
export const SLOT_FILL_TABLES = Object.freeze({});

/**
 * stress `type` → its banner pool. CLOSED, and asserted total in both directions against
 * `STRESS_TYPE_MAP` and the shipped corpus, so neither a new stress type nor a renamed pool
 * can drift past this desk in silence.
 * ⚠ NOT EXPORTED, and the projection contract test is why. That guard walks this directory,
 * treats every exported string map as a candidate FILL TABLE, and refuses one that
 * `SLOT_FILL_TABLES` does not name — the mechanism that stops a desk landing a fill table
 * the shape check has never seen. This is a POOL-KEY map, not a fill table; declaring it as
 * one would submit banner pool names to fill-shape checking, which is a lie about what they
 * are. So the map stays private and `crisisBannerPoolKey` is the contract the desk test
 * asserts totality against — the FUNCTION is the surface, the table is an implementation
 * detail.
 * @type {Readonly<Record<string, string>>}
 */
const CRISIS_POOL_OF = Object.freeze({
  under_siege: 'UNDER SIEGE',
  famine: 'FAMINE',
  occupied: 'UNDER OCCUPATION',
  politically_fractured: 'POLITICALLY FRACTURED',
  // ⚠ The label says "Indebted to Outside Power"; the corpus pool says "…TO AN OUTSIDE
  // POWER". Keyed on the token so the wording difference costs nothing.
  indebted: 'INDEBTED TO AN OUTSIDE POWER',
  recently_betrayed: 'RECENTLY BETRAYED',
  infiltrated: 'INFILTRATED',
  plague_onset: 'DISEASE OUTBREAK',
  succession_void: 'SUCCESSION VOID',
  monster_pressure: 'BEAST & RAIDER THREAT',
  insurgency: 'INSURGENCY',
  // ⚠ The label says "Religious Conversion"; the corpus pool says "RELIGIOUS CRISIS".
  religious_conversion: 'RELIGIOUS CRISIS',
  slave_revolt: 'SLAVE REVOLT',
  wartime: 'WARTIME',
  mass_migration: 'MASS MIGRATION',
});

/** The two DS-STR-1 pools that are about the SECTION rather than about one banner. */
const CRISIS_ARITY_POOL = 'ARITY: several banners standing at once';
const CRISIS_FRAMING_POOL = "Overview's own section framing";

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

/**
 * DS-STR-1's banner key for ONE active crisis. An unknown type renders NOTHING rather than
 * falling into a neighbouring banner: a type this desk does not know is a producer change,
 * and guessing which crisis it meant is how a page states something false about a town.
 * @param {unknown} stressType @returns {string|null}
 */
export function crisisBannerPoolKey(stressType) {
  const token = text(stressType);
  if (!token) return null;
  const key = CRISIS_POOL_OF[token];
  return key && CORPUS['DS-STR-1'].pools[key] ? key : null;
}

/**
 * DS-STR-1's arity key — the sentence about several crises standing at once. One crisis is
 * not an arity story, and zero is no story at all.
 * @param {unknown} banners @returns {string|null}
 */
export function crisisArityPoolKey(banners) {
  const count = Array.isArray(banners) ? banners.length : 0;
  return count > 1 ? CRISIS_ARITY_POOL : null;
}

/**
 * DS-STR-1's section framing — the line the Overview's crisis section carries about itself.
 * It speaks whenever the section renders at all, which is whenever there is a crisis.
 * @param {unknown} banners @returns {string|null}
 */
export function crisisFramingPoolKey(banners) {
  return Array.isArray(banners) && banners.length > 0 ? CRISIS_FRAMING_POOL : null;
}

/**
 * DS-CND-1's severity key, read through the CANONICAL band derivation rather than a second
 * spelling of the cut. A record that already carries `severityBand` is trusted; one that
 * carries only the numeric `severity` is banded by `severityBand()`, which is the one
 * derivation of that ladder.
 * @param {{severityBand?: unknown, severity?: unknown}|null|undefined} condition
 * @returns {string|null}
 */
export function conditionSeverityPoolKey(condition) {
  const declared = text(condition?.severityBand);
  const band = declared || (typeof condition?.severity === 'number'
    ? severityBand(condition.severity)
    : '');
  if (!band) return null;
  const key = `SEVERITY: ${band}`;
  return CORPUS['DS-CND-1'].pools[key] ? key : null;
}

/** The FLAT case is the corpus's own spelling: stable, or no valid directional status. */
const DIRECTION_FLAT = 'DIRECTION: stable, and the FLAT case (no valid directional status)';

/**
 * DS-CND-1's direction key. `worsening` and `easing` are their own pools; everything else —
 * `stable`, an absent status, an unrecognised one — is the FLAT case, which the corpus names
 * that way on purpose. So this lens is TOTAL and never silent on a real condition.
 * @param {{status?: unknown}|null|undefined} condition @returns {string|null}
 */
export function conditionDirectionPoolKey(condition) {
  if (!condition) return null;
  const status = text(condition.status);
  if (status === 'worsening') return 'DIRECTION: worsening';
  if (status === 'easing') return 'DIRECTION: easing';
  return DIRECTION_FLAT;
}

/**
 * DS-CND-1's archetype key. The corpus writes a pool for THREE of the 46 archetypes —
 * `reconstruction`, `boom`, `flourishing`, the recovery-shaped ones — and nothing for the
 * other 43. That is the corpus choosing its subject, not a gap: a condition outside those
 * three renders no archetype line and the other four lenses still speak.
 * @param {{archetype?: unknown}|null|undefined} condition @returns {string|null}
 */
export function conditionArchetypePoolKey(condition) {
  const archetype = text(condition?.archetype);
  if (!archetype) return null;
  const key = `ARCHETYPE: ${archetype}`;
  return CORPUS['DS-CND-1'].pools[key] ? key : null;
}

/**
 * DS-CND-1's provenance key.
 *
 * ⚠ IT DOES NOT USE `isEventSourcedCondition`, AND THAT IS THE POINT. I reached for it
 * first, because "use the canonical reader rather than re-deriving" is the rule three lifts
 * in this arc were built on. It answers a DIFFERENT QUESTION: it requires
 * `causes.some(c => c.source === 'event')`, and its own docblock says generation,
 * world-pulse and regional causes are DELIBERATELY EXCLUDED because those layers re-derive
 * their own. So a generation-sourced condition WITH a full `causes[]` returns false from it
 * — and routing on that would have told a reader the condition has no traceable origin when
 * the record plainly carries one. A false statement, from correctly using the wrong reader.
 * ⇒ THE REFINEMENT TO THE ANTI-FORK RULE: use the canonical reader when it answers YOUR
 * question. Check what it answers, not just what it is named.
 * The two pools name their own split — `causes[] or triggeredAt.sourceEventType populated`
 * versus `no causes[] and no sourceEventType` — so this reads exactly that, and nothing in
 * the tree answers it more authoritatively.
 *
 * @param {{causes?: unknown, triggeredAt?: {sourceEventType?: unknown}|null}|null|undefined} condition
 * @returns {string|null}
 */
export function conditionProvenancePoolKey(condition) {
  if (!condition) return null;
  const causes = condition.causes;
  const traced = (Array.isArray(causes) && causes.length > 0)
    || text(condition.triggeredAt?.sourceEventType) !== '';
  return traced
    ? 'PROVENANCE: causes[] or triggeredAt.sourceEventType populated'
    : 'PROVENANCE: no causes[] and no sourceEventType';
}

/**
 * JUDGMENT (vetoable): the wind-down window is the last quarter of a condition's life.
 * `activeConditions.js` carries `SEVERITY_DRIFT_PER_TICK` and expiry bookkeeping but NO
 * wind-down boundary, so there was no canonical cut to reuse and inventing one silently
 * would have been the worse move. Say "veto" to move it.
 */
const WIND_DOWN_FRACTION = 0.25;

/**
 * DS-CND-1's duration key — the one pool about a condition that is running out.
 * A condition with no expiry never enters a wind-down, and says nothing.
 * @param {{duration?: {elapsedTicks?: unknown, expiresAtTicks?: unknown}|null}|null|undefined} condition
 * @returns {string|null}
 */
export function conditionDurationPoolKey(condition) {
  const duration = condition?.duration;
  const expires = duration?.expiresAtTicks;
  const elapsed = duration?.elapsedTicks;
  if (typeof expires !== 'number' || !Number.isFinite(expires) || expires <= 0) return null;
  if (typeof elapsed !== 'number' || !Number.isFinite(elapsed)) return null;
  const remaining = expires - elapsed;
  if (remaining < 0) return null;
  return remaining <= expires * WIND_DOWN_FRACTION
    ? 'DURATION: inside the expiry wind-down window'
    : null;
}

/**
 * ⛔ THE TRACED-PROVENANCE POOL IS ROUTED BUT SILENT, AND IT IS THE `{complexity}` SHAPE.
 *
 * ALL THREE variants of `PROVENANCE: causes[] or traceable…populated` name `{reason}` —
 * measured, there is no `{reason}`-free variant to degrade to — and `{reason}` is
 * `bare-common` with NO producer anywhere in the tree. The annex's own position is that it
 * "has no producer, so this is decidable at wiring"; but the VALUES are reader-facing words
 * in the dossier's own register, which is exactly the class §0c-3 records for `{complexity}`
 * and which the lane there deliberately did NOT choose. A desk inventing that vocabulary
 * would be a lane ruling reader-facing prose.
 *
 * So the desk ROUTES to the pool correctly and the kernel's anchored liveness holds it
 * silent — which is the honest state, and it costs nothing later: rule a `{reason}` fill
 * vocabulary and the pool lights with NO desk change at all. The untraced pool beside it
 * has `{settlement}`-only variants and speaks today.
 */

/**
 * ⛔ `{timeband_age}` STAYS UNFILLED — AND THE REASON THIS DESK FIRST GAVE WAS WRONG.
 *
 * The head of this file declined the slot "for want of a duration former in the tree".
 * THERE IS ONE: `heraldCausalGrammar.js`'s `timeBandOf`/`timeBandWord`, a zero-import
 * display leaf whose six-band × four-position table is IDENTICAL cell for cell to §0d's in
 * BOTH annexes (24 of 24 cells, measured). The stale reason is CORRECTED here rather than
 * deleted, because the reason a slot is refused is the thing the next lane re-derives —
 * and this one already sent a lane to fill a slot that must not be filled.
 *
 * THREE MEASUREMENTS REFUSE THE FILL, any one of them sufficient:
 *
 *  1. THE SLOT HAS EXACTLY ONE VARIANT AND ITS GRAMMAR CLAIMS DEEP ANTIQUITY. It is the
 *     `elder` #2 of `PROVENANCE: no causes[] and no sourceEventType`, and its second
 *     sentence is "Whatever caused it did so before anyone was writing things down."
 *  2. A CONDITION CAN NEVER BE OLD. All 46 `CONDITION_ARCHETYPE_TEMPLATES` carry a NUMERIC
 *     `defaultExpiresAtTicks` (5..18) — not one is null — and `withExpiredConditionsRemoved`
 *     drops a condition the tick it reaches its cap. So the oldest condition this estate can
 *     hold is EIGHTEEN ticks, and a tick here is about a month (`INTERVAL_TICK_INCREMENTS`:
 *     a per-week advance adds 0.25). EVERY band this slot could ever render therefore
 *     contradicts the sentence it sits in — "It is here and it is of this season. Whatever
 *     caused it did so before anyone was writing things down." A wrong sentence is worse
 *     than no sentence, which is the kernel's own law 5 reasoning.
 *  3. THERE IS NO HONEST WEEK CONVERSION TO BAND WITH. `timeBandOf(sinceTicks,
 *     intervalWeeks)` bands `sinceTicks * intervalWeeks` WEEKS. A condition tick is
 *     scale-weighted rather than calendar (one_week 0.25 · one_month 1.00 · one_season 2.25
 *     · one_year 6.00 — four seasons and one year disagree BY DESIGN), so no `intervalWeeks`
 *     is true of it and choosing one would coin the mapping §0d exists to forbid.
 *
 * ⚠ AND THE POOL IS NOT REACHED AT BIRTH ANYWAY. Over 48 generated towns (6 seeds × 8
 * configs) 14 carried a condition and all 14 routed to the TRACED pool; the untraced pool
 * was reached ZERO times, and every condition measured sat at `elapsedTicks: 0`. It is a
 * played-world surface, the DS-STR-2 class — so the note above that it "speaks today" is
 * true of its VARIANTS and not of its ROUTING.
 *
 * ⇒ THE CURE IS A CORPUS ACT AND THE WORDS ARE THE CHAIR'S: either an untraced-provenance
 * variant whose duration claim a sub-two-year condition can honour, or the removal of the
 * duration clause from that one sentence. A desk cannot repair a sentence by filling it.
 * — DESK-TIMEBAND 2026-09-05.
 */

/**
 * ⛔ THE FIVE `FAMILY:` POOLS ARE DARK, AND THE REASON IS A MISSING PRODUCER FIELD.
 *
 * DS-CND-1 writes five family pools — acute crisis, regional transmission, war layer
 * (aggressor side), occupation layer, recovery. `CONDITION_ARCHETYPE_TEMPLATES` carries
 * `label`, `description`, `affectedSystems`, `defaultExpiresAtTicks`, `defaultStatus` and
 * `defaultSeverity` — and NO family. So a family lens would have to invent a 46-archetype →
 * 5-family classification inside a display desk, which is a VOCABULARY decision and the
 * fork-that-drifts shape three lifts in this arc have already corrected.
 *
 * The pools stay dark BY DECLARATION rather than served by a guess, and the door is one
 * act wide: add a `family` field to `CONDITION_ARCHETYPE_TEMPLATES` — the producer owns the
 * vocabulary — and this desk lights all five with no corpus work at all, exactly as the
 * economic-base pools wait on one economy-generator field.
 */

/**
 * ── DS-STR-2, THE WORLD STRESSOR — a CONDITIONAL SURFACE, and two lenses of four ─────
 *
 * ⚠ PLAY-TIME STATE, the DS-POW-3 / DS-POW-7 class. `worldState.stressors[]` has no
 * generation writer, so this block is dark at birth and speaks in a played world. Its
 * aliveness proof therefore uses a SIMULATED fixture, normalized by the kernel's own
 * `normalizeStressor`, never a birth fixture — a dormancy proof here would be
 * indistinguishable from the dead arms this suite exists to refuse.
 *
 * ⭐ BOTH WIRED LENSES ARE IDENTITIES, AND BOTH READ PERSISTED FIELDS.
 *   LIFECYCLE (5 of the corpus's pools): `stressor.lifecycleStage`.
 *   `STRESSOR_LIFECYCLE_STAGES` holds SEVEN — `emerging active peaking easing resolved
 *   residual dormant` — and the corpus writes five. `resolved` and `dormant` get no pool,
 *   which is the corpus choosing its subject: a stressor that is over is not a story about
 *   a stressor. Those two render nothing and the origin lens still speaks.
 *   ORIGIN (17 pools): `stressor.originContext.variant`, a PERFECT 17/17 identity with
 *   `VARIANT_HOOKS` — asserted in the desk test, which can import that roster because a
 *   TEST import costs no production bytes.
 *
 * ⭐ THE PRODUCTION READ VALIDATES AGAINST THE CORPUS, NOT AGAINST THE ROSTER, AND THE
 * REASON IS MEASURED. `VARIANT_HOOKS` and `synergyAssessment` live in
 * `worldPulse/stressorDynamics.js`, which is 45,532 B — and whose import drags TWENTY-NINE
 * modules totalling 602,004 B that are not already in first paint. THE FILE SIZE UNDERSTATES
 * THE COUPLING COST BY THIRTEEN TIMES, which is only visible by walking the transitive
 * closure rather than reading the file. So production reads the persisted field and checks
 * it against the shipped corpus (the corpus is the authority a desk already holds), and the
 * identity with the producer's roster is asserted where it is free: in the test.
 * By contrast `worldPulse/stressorsCore.js` — the lifecycle vocabulary and
 * `normalizeStressor` — is ALREADY in the first-paint closure, so reaching it costs nothing.
 *
 * ⛔ TWO LENSES ARE DARK, TEN POOLS, each for a measured reason:
 *   • SYNERGY × 6. `synergyAssessment` sits behind that 602 KB transitive drag, on the
 *     OVERVIEW tab — the most-visited surface in the dossier. Six pools do not buy it.
 *   • COUNTERFORCE × 4. `counterforceAssessment(stressor, snapshot)` needs a WORLD SNAPSHOT
 *     (`{ byId, regionalGraph }`) that a dossier tab does not have and should not build; and
 *     one of its four pools additionally needs `{reason}`, the same unruled reader-facing
 *     vocabulary that holds the traced-provenance pool silent above.
 * THE CURE FOR BOTH IS THE ONE THE CHAIR ALREADY HAS DOCKETED FROM DS-POW-7: a small
 * display-layer projection, on the `display/politicsRead.js` precedent, that hands a
 * dossier what it needs without dragging a simulation kernel behind it.
 */

/**
 * The narrow slice of a normalized world stressor this desk reads. Declared rather than
 * left as `object`: the any-cast ratchet is right that a reader which types its input
 * loosely has given up the one check that would catch a renamed field, and both fields
 * below are real reads. (domain-strict caught the bare `object` here — the third time in
 * this arc it convicted a tree `typecheck:ratchet` called green.)
 * @typedef {object} WorldStressorView
 * @property {unknown} [lifecycleStage]
 * @property {{variant?: unknown}|null} [originContext]
 */

/**
 * DS-STR-2's lifecycle key. Validated against the shipped corpus rather than against the
 * seven-stage roster, so the two stages the corpus does not narrate render nothing instead
 * of a missing pool.
 * @param {{lifecycleStage?: unknown}|null|undefined} stressor @returns {string|null}
 */
export function stressorLifecyclePoolKey(stressor) {
  const stage = text(stressor?.lifecycleStage);
  if (!stage) return null;
  const key = `LIFECYCLE: ${stage}`;
  return CORPUS['DS-STR-2'].pools[key] ? key : null;
}

/**
 * DS-STR-2's origin key — `originContext.variant`, a 17/17 identity with the producer's own
 * variant roster. An unknown variant renders nothing rather than guessing an origin: a
 * stressor's origin is a claim about who did this to the town, and the wrong one is the
 * worst sentence this corpus could print.
 * @param {{originContext?: {variant?: unknown}|null}|null|undefined} stressor
 * @returns {string|null}
 */
export function stressorOriginPoolKey(stressor) {
  const variant = text(stressor?.originContext?.variant);
  if (!variant) return null;
  const key = `ORIGIN: ${variant}`;
  return CORPUS['DS-STR-2'].pools[key] ? key : null;
}

/**
 * THE DESK, page-wide. Named `stressorsStateProse` to match its DESK name (`stressors`, the
 * leaf's basename) — the public-dossier guard's ARM 2 derives `<desk>StateProse` from the
 * registry and caught the singular spelling I first used, which is the convention working. The per-banner rung is a separate entry point below, because a
 * settlement has several crises and folding a per-banner answer into a once-per-page object
 * would force the caller to pick one crisis and call it the town's.
 *
 * `conditions` is the CALLER'S reading: the Overview already holds the settlement, and the
 * FIRST condition is the one the lenses describe — the corpus writes one sentence per lens,
 * not a list, so narrating every condition would repeat one fact in several voices.
 *
 * @param {{name?: string, stress?: unknown, activeConditions?: unknown}|null|undefined} settlement
 * @param {{banners?: unknown, conditions?: ReadonlyArray<object>|null,
 *   worldStressor?: WorldStressorView|null}} [readings] the caller selects and normalizes
 *   the world stressor; see DS-STR-2 above for why the desk does not reach for it
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {Readonly<{crisisArity: object|null, crisisFraming: object|null,
 *   conditionSeverity: object|null, conditionDirection: object|null,
 *   conditionArchetype: object|null, conditionProvenance: object|null,
 *   conditionDuration: object|null, worldStressorLifecycle: object|null,
 *   worldStressorOrigin: object|null}>}
 */
export function stressorsStateProse(settlement, readings = {}, options = {}) {
  const town = properFill(text(settlement?.name));
  const slots = { settlement: town };
  const banners = readings.banners ?? null;
  const conditions = Array.isArray(readings.conditions) ? readings.conditions : [];
  const condition = conditions.length > 0 ? conditions[0] : null;

  // ⭐ ROUTED THROUGH THE COMPOSER (SEAM car 3b). The spine key is this desk's own key
  // function, exactly as before; the candidates leaf offers the modifier pools the state
  // earned, and is EMPTY until car 9 authors them. An empty list composes to the kernel's
  // own draw, which is why the manifest cannot move on this routing.
  /** @param {string} blockId @param {string|null} poolKey */
  const line = (blockId, poolKey) => (poolKey
    ? composeStateProse(CORPUS, blockId, {
      ...options,
      slots,
      spineKey: poolKey,
      candidates: stressorsStateProseCandidates(blockId, readings),
    })
    : null);

  const arityKey = crisisArityPoolKey(banners);
  const framingKey = crisisFramingPoolKey(banners);
  const severityKey = conditionSeverityPoolKey(condition);
  const directionKey = conditionDirectionPoolKey(condition);
  const archetypeKey = conditionArchetypePoolKey(condition);
  const provenanceKey = conditionProvenancePoolKey(condition);
  const durationKey = conditionDurationPoolKey(condition);
  const worldStressor = readings.worldStressor ?? null;
  const lifecycleKey = stressorLifecyclePoolKey(worldStressor);
  const originKey = stressorOriginPoolKey(worldStressor);

  return Object.freeze({
    crisisArity: arityKey ? legibilityRung('', line('DS-STR-1', arityKey), []) : null,
    crisisFraming: framingKey ? legibilityRung('', line('DS-STR-1', framingKey), []) : null,
    conditionSeverity: severityKey
      ? legibilityRung(text(condition?.severityBand), line('DS-CND-1', severityKey), [])
      : null,
    conditionDirection: directionKey ? legibilityRung('', line('DS-CND-1', directionKey), []) : null,
    conditionArchetype: archetypeKey ? legibilityRung('', line('DS-CND-1', archetypeKey), []) : null,
    conditionProvenance: provenanceKey ? legibilityRung('', line('DS-CND-1', provenanceKey), []) : null,
    conditionDuration: durationKey ? legibilityRung('', line('DS-CND-1', durationKey), []) : null,
    worldStressorLifecycle: lifecycleKey
      ? legibilityRung(text(worldStressor?.lifecycleStage), line('DS-STR-2', lifecycleKey), [])
      : null,
    worldStressorOrigin: originKey ? legibilityRung('', line('DS-STR-2', originKey), []) : null,
  });
}

/**
 * THE CRISIS BANNER DESK, per banner. Returns one rung, or null where the crisis type is
 * one this desk does not know.
 *
 * @param {{name?: string}|null|undefined} settlement
 * @param {{type?: unknown, label?: unknown}|null|undefined} banner one `settlement.stress[]` entry
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {object|null}
 */
export function crisisBannerRung(settlement, banner, options = {}) {
  const key = crisisBannerPoolKey(banner?.type);
  if (!key) return null;
  const slots = { settlement: properFill(text(settlement?.name)) };
  // The per-banner rung's whole reading IS the banner: this entry point takes no desk
  // readings, so the candidates leaf is offered the one fact this call site holds — the
  // banner ITSELF, never a fresh `{ banner }` wrapper. See the fence's own arm: an object
  // literal here mints its keys into the wiring census's PRODUCER INDEX, which reads every
  // object-literal key under src/domain as a write and would silently reclassify the
  // `absent` column of rows that have nothing to do with this desk.
  return legibilityRung(
    text(banner?.label),
    composeStateProse(CORPUS, 'DS-STR-1', {
      ...options,
      slots,
      spineKey: key,
      candidates: stressorsStateProseCandidates('DS-STR-1', banner),
    }),
    [],
  );
}
