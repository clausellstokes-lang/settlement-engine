/**
 * domain/intentAtlas.js — THE AI INTENT ATLAS, Phase A (wave L-2a of
 * docs/DESIGN_AI_INTENT_ATLAS.md §3 and §5), carrying the EVIDENTIAL WEIGHTING amendment
 * (owner, 2026-07-27; design §7).
 *
 * The atlas is a versioned, id-free, k-anonymous AGGREGATE picture of how users actually
 * build: which registered buckets co-occur, where each kind of request gravitates. Injected
 * per request into stateless edge calls so intent inference gets sharper, and injected as
 * GROUNDING DATA, never as direction.
 *
 * PHASE A WAS INERT BY DESIGN, and the inert contract survives as a per-surface property
 * rather than a global one. The user corpus still does not exist: no cell here is a human
 * observation. What ships instead, under the owner's 2026-07-27 ruling, is a SOAK PRIOR
 * distilled from generated worlds (see below), which speaks to the two surfaces a generated
 * world can honestly speak to and leaves the others returning the EMPTY STRING exactly as
 * before. Phase B (post-cohort, after the owner deploys migration 134 and its cron) fills the
 * distillate with `users` cells from analytics_daily_rollups, and the supersession law below
 * governs what happens to the prior when it does.
 *
 * THE ACTIVATION CLIFF IS DISSOLVED (the amendment's sequencing consequence). Phase B no
 * longer needs a "is there enough data yet" moment, because a sparse corpus now SILENCES
 * ITSELF: a pattern with too few authors or too weak a signal cannot clear the evidence floor,
 * so it is never generated, so there is nothing to render. The atlas may therefore go live at
 * launch and simply say less on day one than on day ninety. What remains owner-gated is the
 * consent and legal disclosure line (T10 packet), which is a policy call, not a statistics one.
 *
 * EVIDENTIAL WEIGHTING, THE OWNER'S AMENDMENT (2026-07-27). Telemetry is allowed into a prompt
 * only alongside an honest claim about what it is worth. Every cell therefore carries three
 * numbers: `n`, the distinct authors behind it; `effect`, the strength and direction of the
 * association; and `weight`, a 0-to-1 confidence weight. Weights are computed AT DISTILLATION
 * by Phase B's script, from a Benjamini-Hochberg false-discovery-rate correction applied across
 * ALL cells of one generation run rather than per cell in isolation.
 *
 * CELLS BELOW THE FLOOR ARE DROPPED AT GENERATION AND NEVER SHIP: the model cannot be trusted
 * to ignore data on instruction, so the exclusion is structural rather than instructed. That is
 * the design's law. This module holds a belt over the distiller's braces anyway
 * (`buildIntentAtlasSectionFrom` filters again on WEIGHT_FLOOR and MIN_N), because a law that
 * lives only inside one generation script is one bad script away from being a lie, and the
 * failure would be silent: an under-evidenced line reads exactly like a well-evidenced one.
 *
 * THE SOAK PRIOR (owner ruling, 2026-07-27, wave L-8a). Until user telemetry clears the
 * statistical threshold, the atlas ships a PREMADE PRIOR distilled from generated worlds, for
 * the AI's purposes only. Every such cell is tagged `source: 'soak'`; every cell distilled from
 * real user telemetry is tagged `source: 'users'`. The tag is MANDATORY on both, because a
 * prompt that cannot tell the two apart is a prompt that reports simulator behaviour as human
 * behaviour, and that is a false claim about people. The soak prior answers a narrower question
 * than the corpus it stands in for: not "how do people build" but "how do generated worlds hang
 * together" — which is exactly what a construction clerk needs when it declares the constraint
 * bands it intends a generated result to satisfy.
 *
 * SOAK_WEIGHT_CAP: A PRIOR MUST NEVER OUTSHOUT OBSERVED EVIDENCE. A soak cell's weight is
 * capped, at distillation and again by the belt here, so the loudest possible prior line is
 * quieter than a mid-strength observed one. The cap is not a statement about the statistic (a
 * soak association can be perfectly real); it is a statement about STANDING. Simulator output
 * is evidence about the simulator, and the atlas exists to describe people.
 *
 * THE SUPERSESSION LAW: WHEN OBSERVED EVIDENCE ARRIVES, THE PRIOR IS REPLACED OUTRIGHT, NEVER
 * AVERAGED. If a users-cell and a soak-cell name the same (surface, dimension, bucket,
 * coBucket) key, the soak cell is EXCLUDED from the rendered section. Blending them would build
 * an ECHO CHAMBER with a statistical face: the AI suggests what the engine already produces,
 * users confirm the suggestion because it arrived pre-endorsed, the telemetry then records that
 * confirmation as a human preference, and the next distillation reads the engine's own prior
 * back as evidence about people. Each turn of that loop looks like converging evidence and is
 * actually one number talking to itself. Hard replacement breaks the loop at the only place it
 * can be broken cheaply: the moment real evidence exists for a key, the prior for that key stops
 * being spoken. Presence of a users-cell supersedes even when that users-cell is itself below
 * the floor and renders nothing, because the question the law answers is "has this key been
 * observed", not "has it been observed strongly".
 *
 * WHY A CONFIDENCE WEIGHT AND NOT A P-VALUE. A p-value conflates effect size with sample size,
 * so at a large enough n a meaningless association is still "significant"; weight and effect
 * ship as two separate numbers precisely so a reliably slight pattern reads as reliably slight.
 * And because the atlas tests many bucket pairs at once, uncorrected per-cell significance
 * would manufacture roughly one false pattern in twenty by construction, which is why the
 * correction is a false-discovery-rate correction across the whole run.
 *
 * THE OWNER CONSTRAINT, SATISFIED ARCHITECTURALLY: the AI must not remember this data after
 * use. There is nowhere for it to persist. The atlas rides a stateless edge request as text
 * and dies with it. That is a property of the transport, not a promise in a prompt.
 *
 * SUGGESTION ONLY, NEVER ENGINE MATH (design §4.1, and migration 134's own ENDOGENEITY
 * rule). Atlas-primed inference produces PROPOSED buckets a user confirms. Confirmed buckets
 * plus seed remain the world, exactly as before. Aggregate data touching post-authoring
 * engine behaviour is queue item G1: separately gated, golden-shifting, out of scope here.
 *
 * ID-FREE IS A GATE, NOT A HABIT. Every cell is enum tokens and counts. The k-anonymity
 * floor (ATLAS_K_FLOOR) is applied at GENERATION, and re-proven on the committed artifact by
 * tests/security/intentAtlasIdFree.test.js, which walks the raw JSON rather than this
 * module's view of it, so a module that filtered a bad cell out could not launder one in.
 *
 * BYTE-STABILITY IS THE CONTRACT, for the same reason it is in aiCharter.js: these strings
 * are destined for the static prompt prefixes where a provider prices a byte-identical
 * prefix once. Every rendering here sorts before it prints and reads no clock, no rng, and
 * no ambient state.
 *
 * PURITY / BUDGET: no transport, no React, no store, no side effects at import time. This
 * module must ONLY ever be LAZY-imported and must NEVER be statically imported by any boot
 * or first-paint module. It pulls its distillate in with it, and that file grows with the
 * cohort.
 *
 * DEPARTURE FROM THE SPEC, RECORDED: design §3.2 sketches
 * `buildIntentAtlasSection(surfaceKey, useCaseHint)`. The second parameter is DEFERRED to
 * Phase B and is absent here, because the v0 cell schema carries no use-case dimension to
 * select on. A parameter that provably cannot affect the output is worse than an absent one:
 * it reads as a working filter to every caller who does not open this file. It returns with
 * the dimension it filters on.
 */

import distillate from './data/intentAtlas.distillate.json';

/** Bump when the atlas SECTION FORMAT or the cell schema changes. The distillate carries its
 *  own `atlasVersion`, which moves with the DATA and is a separate number on purpose.
 *  1.1.0: the evidential-weighting amendment (n / effect / weight, and the weighting
 *  instruction block that tells a reader what to do with them).
 *  1.2.0: the soak prior (wave L-8a) — the mandatory `source` tag on every cell, the
 *  supersession law, the provenance paragraph a soak-bearing block carries, the per-line
 *  `generated` marker, and the top-K render cap. */
export const INTENT_ATLAS_FORMAT_VERSION = '1.2.0';

/**
 * The k-anonymity floor. A cell aggregating fewer than this many distinct actors is dropped
 * at generation and is a hard red on the committed artifact. Ten is the design's number
 * (§3.1); it is stated here so the generator, the gate, and the module can never hold three
 * different opinions about it.
 */
export const ATLAS_K_FLOOR = 10;

/**
 * THE EVIDENCE FLOOR: what a cell must clear to exist at all (the owner's amendment,
 * 2026-07-27, in machine-readable form).
 *
 * Stated once, here, for the same reason ATLAS_K_FLOOR is: the distillation script, the
 * id-free gate, and this module must never hold three different opinions about where the bar
 * sits. The distillate records the values it was generated under, and the gate pins those
 * against these, so a run under a laxer bar cannot ship quietly.
 *
 * THE WEIGHT CONVENTION these numbers define, which Phase B's script implements:
 *
 *   weight = 1 - (q / FDR_Q) * (1 - WEIGHT_FLOOR)
 *
 * clamped to [WEIGHT_FLOOR, 1] and rounded to two decimals, where q is the cell's
 * Benjamini-Hochberg corrected significance across the whole generation run. The mapping is
 * chosen so that WEIGHT_FLOOR is exactly the weight of a cell sitting ON the threshold
 * (q === FDR_Q). `weight >= WEIGHT_FLOOR` and `q <= FDR_Q` are therefore the same statement,
 * which is what lets a renderer enforce the statistic without recomputing it.
 *
 * MIN_N (30) is stricter than ATLAS_K_FLOOR (10) and so binds in practice, but the two are
 * NOT the same constant and must not be collapsed: k is a privacy floor and n is a sample
 * floor. A future ruling that lowers MIN_N cannot lower k below 10, and the gate checks both.
 */
export const EVIDENCE_FLOOR = Object.freeze({
  /** Manager-set default, owner-vetoable (delegated 2026-07-27): the false-discovery rate. */
  FDR_Q: 0.05,
  /** Manager-set default, owner-vetoable (delegated 2026-07-27): distinct authors per cell. */
  MIN_N: 30,
  /** Manager-set default, owner-vetoable (delegated 2026-07-27): weight at exact threshold. */
  WEIGHT_FLOOR: 0.25,
});

/**
 * THE CELL SOURCES, and the whole of them. `users` is a cell distilled from real telemetry;
 * `soak` is a cell distilled from generated worlds (the premade prior the owner ruled in on
 * 2026-07-27 for the AI's purposes, pending a corpus). Frozen and sorted, so a third source
 * cannot appear without moving this line and the gate that reads it.
 */
export const ATLAS_CELL_SOURCES = Object.freeze(['soak', 'users']);

/**
 * THE PRIOR'S CEILING. The largest weight a `soak` cell may carry, whatever its statistic says.
 *
 * Manager-set default, owner-vetoable (delegated 2026-07-27). Half of the scale, and therefore
 * strictly below the weight of any observed cell in the upper half: the loudest possible prior
 * line cannot outshout a mid-strength observed one. Two layers enforce it, matching the
 * evidence floor's posture — the distiller caps at generation, and this module's belt clamps
 * again at render. The gate reds on a committed soak cell above the cap, so a distiller that
 * forgot the cap is a failing test rather than a louder prompt.
 *
 * IT IS A STANDING RULE, NOT A STATISTICAL ONE. A soak association can be perfectly real and
 * still deserve to be quiet: it is evidence about the simulator, and the atlas exists to
 * describe people. The cap sits above WEIGHT_FLOOR by construction, so capping can never push a
 * cell below the floor and silently delete it.
 */
export const SOAK_WEIGHT_CAP = 0.5;

/**
 * TOKEN THRIFT: the most cells one surface's section may render, after the floor, the
 * supersession law, and the cap have all been applied. Cells are ranked by weight, then by
 * absolute effect, then by their own sort keys, and the top slice is printed.
 *
 * Manager-set default, owner-vetoable (delegated 2026-07-27). Twelve lines is roughly a
 * paragraph of prompt: enough that a surface's strongest regularities are all present, few
 * enough that the atlas cannot crowd out the charter and the user's actual request. The ranking
 * is what makes the cap safe to apply blind: what falls off the bottom is always the weakest
 * thing the corpus had to say, and the section already tells its reader that absence carries no
 * information.
 */
export const ATLAS_RENDER_CAP = 12;

/**
 * The surfaces an atlas section is built for: the walled Surveyor surfaces where intent
 * inference actually happens. Names match aiCharter.js CHARTER_SURFACES, minus
 * `styleOverhaul`, which compiles a cosmetic look rather than inferring intent and would
 * gain nothing from population data. Sorted, and frozen.
 */
export const ATLAS_SURFACES = Object.freeze([
  'autonomy',
  'construct',
  'customContent',
  'interpret',
]);

/**
 * THE ENUM-KEY ALLOWLIST: the complete set of keys a distillate cell may carry. Anything
 * else is a red, whatever it contains. This is the allowlist half of the id-free guarantee,
 * and it is an allowlist rather than a denylist for the obvious reason: a denylist has to
 * predict the shape of the leak, and an allowlist does not.
 *
 *   surface    one of ATLAS_SURFACES
 *   dimension  a controlled-vocabulary token naming what is being counted
 *   bucket     a registered vocabulary token, the thing counted
 *   coBucket   a registered vocabulary token this cell reports co-occurrence with
 *   n          the independent observations behind the cell, integer, at least MIN_N
 *   effect     the association's strength and direction, a phi coefficient in [-1, +1]
 *   weight     the confidence weight in [WEIGHT_FLOOR, 1], computed at distillation
 *   source     one of ATLAS_CELL_SOURCES: where the observations came from
 *
 * `source` IS MANDATORY, on every cell, including the users-cells that predate it. An optional
 * provenance tag defaults to whatever the reader assumes, and the reader here is a model that
 * will assume the friendlier reading: that a line describes people. A missing tag would let
 * simulator behaviour be reported as human behaviour by silence.
 *
 * WHAT `n` COUNTS DEPENDS ON `source`, and the two readings are not interchangeable. For a
 * users-cell it is a DISTINCT-ACTOR count, so it doubles as the k-anonymity set size. For a
 * soak-cell it is a count of GENERATED WORLDS, and it carries no anonymity meaning at all,
 * because no actor exists to be anonymous: the k-anonymity floor is inapplicable rather than
 * satisfied, and the gate exempts soak cells from it explicitly rather than letting MIN_N > k
 * make the distinction invisible. The sample floor MIN_N binds identically on both.
 *
 * ONE ACTOR IS ONE OBSERVATION, which is why `n` serves as both the anonymity set size and
 * the sample size. Counting raw events instead would inflate every statistic through
 * pseudo-replication: a single prolific author repeating a habit would read as a population
 * agreeing, which is the exact failure the weighting exists to prevent.
 *
 * EFFECT IS A PHI COEFFICIENT (the 2x2 case of Cramer's V): 0 is no association, +1 is
 * perfect co-occurrence, and a negative value means the pair travels together LESS often than
 * chance. Bounded and symmetric, unlike lift, where 0.5 and 2.0 are the same strength in
 * opposite directions while looking nothing alike to a reader.
 *
 * PROVISIONAL, and honestly so: the schema is fixed by what migration 134 already distills
 * (cluster signatures, op-kind totals, op-kind reverts). Phase B may need one more key. It
 * gets added HERE, and the gate follows it, in that order.
 */
export const ATLAS_CELL_KEYS = Object.freeze([
  'bucket',
  'coBucket',
  'dimension',
  'effect',
  'n',
  'source',
  'surface',
  'weight',
]);

/**
 * The cell keys carrying NUMBERS rather than controlled-vocabulary tokens. Stated here so the
 * id-free gate can apply the token and id-shape scans to exactly the string-valued keys and
 * range checks to exactly these, without either half guessing.
 */
export const ATLAS_NUMERIC_CELL_KEYS = Object.freeze(['effect', 'n', 'weight']);

/**
 * @typedef {{ surface: string, dimension: string, bucket: string, coBucket?: string,
 *             n: number, effect: number, weight: number, source: string }} AtlasCell
 * @typedef {{ fdrQ: number, minN: number, weightFloor: number,
 *             cellsTested: number, cellsKept: number, soakWeightCap?: number }} AtlasEvidenceProvenance
 * @typedef {{ kind: string, seedCount?: number, generatorVersion?: string }} AtlasGeneratedFrom
 * @typedef {{ atlasVersion: string, generatedFrom: string|AtlasGeneratedFrom|null,
 *             evidence: AtlasEvidenceProvenance,
 *             cells: readonly AtlasCell[] }} AtlasDistillate
 */

/** @type {AtlasDistillate} */
const ATLAS = /** @type {AtlasDistillate} */ (
  /** @type {unknown} */ (distillate)
);

/** Code-unit ordering, never locale-aware collation.
 *  @param {string} a @param {string} b @returns {number} */
function byText(a, b) {
  if (a < b) return -1;
  return a > b ? 1 : 0;
}

/** The distillate's own data version, for display and for the freshness pin.
 *  @returns {string} */
export function intentAtlasVersion() {
  return typeof ATLAS.atlasVersion === 'string' ? ATLAS.atlasVersion : '0.0.0';
}

/**
 * Every cell in the committed distillate, unfiltered and in file order. Exposed so the
 * id-free gate can cross-check that this module's view agrees with the raw artifact it
 * walks. Callers must treat it as read-only.
 * @returns {readonly AtlasCell[]}
 */
export function intentAtlasCells() {
  return Array.isArray(ATLAS.cells) ? ATLAS.cells : [];
}

/**
 * The evidence provenance the distillate declares it was generated under, or null when the
 * artifact carries none. Exposed for the gate, which pins it against EVIDENCE_FLOOR so a run
 * under a laxer bar cannot ship quietly.
 *
 * IT DOES NOT SUBSTITUTE THIS MODULE'S CONSTANTS for a missing block, which would be the
 * laundering failure this file warns about elsewhere: an artifact generated with no declared
 * thresholds would then read as compliant with whatever the module happened to believe.
 * @returns {AtlasEvidenceProvenance|null}
 */
export function intentAtlasEvidence() {
  const declared = ATLAS.evidence;
  return (declared && typeof declared === 'object' && !Array.isArray(declared))
    ? /** @type {AtlasEvidenceProvenance} */ (declared)
    : null;
}

/**
 * THE BELT over the distiller's braces. A cell renders only if it clears the evidence floor
 * on its own numbers, so a generation script that forgot to drop a weak cell still cannot put
 * one in front of a model. A cell missing either number, or carrying a non-finite one, is
 * treated as unevidenced and dropped: an unreadable weight is not a reason to trust a line.
 * @param {AtlasCell} cell @returns {boolean}
 */
function clearsEvidenceFloor(cell) {
  const { n, weight } = cell;
  if (typeof n !== 'number' || !Number.isFinite(n) || n < EVIDENCE_FLOOR.MIN_N) return false;
  if (typeof weight !== 'number' || !Number.isFinite(weight)) return false;
  return weight >= EVIDENCE_FLOOR.WEIGHT_FLOOR;
}

/** Two decimals, always, so a weight of 0.5 and a weight of 0.50 cannot render two ways.
 *  @param {number} value @returns {string} */
function fixed2(value) {
  return Number(value).toFixed(2);
}

/** Signed two decimals, with no negative zero: a rounded-away minus reads as a claim.
 *  @param {number} value @returns {string} */
function signed2(value) {
  const rounded = Number(Number(value).toFixed(2));
  return `${rounded >= 0 ? '+' : ''}${rounded.toFixed(2)}`;
}

/** Is this a soak-prior cell (a generated-world observation rather than a human one)?
 *  Anything that is not the literal 'soak' tag is treated as an observed cell, because the
 *  gate makes the tag mandatory and a missing tag is that gate's problem, not the renderer's.
 *  @param {AtlasCell} cell @returns {boolean} */
function isSoakCell(cell) {
  return cell.source === 'soak';
}

/** The identity a supersession collision is judged on: one association, named four ways.
 *  The pipe separator is outside the controlled-vocabulary token charset (letters, digits,
 *  underscore, dot, hyphen), so two different four-part keys can never compose the same
 *  string, and an unregistered value that tried to would have failed the gate long before it
 *  reached a renderer.
 *  @param {AtlasCell} cell @returns {string} */
function cellKey(cell) {
  return [cell.surface, cell.dimension, cell.bucket, cell.coBucket || ''].join('|');
}

/** The weight a cell may actually speak at: a soak cell is clamped to the prior's ceiling.
 *  CLAMPED, NOT DROPPED, and the distinction is deliberate. The evidence floor drops, because
 *  a below-floor line is a claim the corpus cannot support at all. The cap is not about support
 *  but about standing, so the honest treatment of an over-loud prior is to make it quieter,
 *  not to delete a real regularity. The gate still reds on an over-cap cell in the committed
 *  file, so this clamp can never be the only thing holding the ceiling up.
 *  @param {AtlasCell} cell @returns {number} */
function speakingWeight(cell) {
  return isSoakCell(cell) ? Math.min(cell.weight, SOAK_WEIGHT_CAP) : cell.weight;
}

/** One cell as one deterministic line.
 *  @param {AtlasCell} cell @returns {string} */
function renderCell(cell) {
  const withPart = typeof cell.coBucket === 'string' && cell.coBucket
    ? ` with ${cell.coBucket}`
    : '';
  // The per-line marker costs one word and prevents the one misreading the provenance
  // paragraph alone cannot: a block holding both kinds of line would otherwise leave a reader
  // to guess which of them the paragraph is about.
  const sourcePart = isSoakCell(cell) ? ', generated' : '';
  return `    ${cell.dimension}: ${cell.bucket}${withPart}`
    + ` (weight ${fixed2(speakingWeight(cell))}, effect ${signed2(cell.effect)},`
    + ` n=${String(cell.n)}${sourcePart})`;
}

/**
 * Build one surface's atlas section, or the EMPTY STRING when there is nothing to say.
 *
 * Returns '' when the atlas holds no cell for this surface that clears the evidence floor. A
 * caller appends the result unconditionally and the prompt is byte-identical either way. That
 * is the inert contract, and it covers three cases now: a distillate with no cells at all, a
 * distillate whose cells are all below the floor (which renders nothing rather than rendering
 * weak lines with a caveat attached), and a surface the corpus simply has nothing to say about.
 * The soak prior speaks to two surfaces; the other two stay inert until real telemetry lands,
 * and that silence is the correct output rather than a gap to fill.
 *
 * Returns '' rather than throwing on an unknown surface key, which is the opposite of
 * `buildSurfaceCharter`. The asymmetry is deliberate: a charter is load-bearing grounding
 * and a missing one must be loud, whereas the atlas is an optional sharpener whose absence
 * is a normal state on every surface every day of Phase A. Making absence throw would put a
 * crash between a user and a working feature in exchange for nothing.
 *
 * @param {string} surfaceKey one of ATLAS_SURFACES
 * @returns {string}
 */
export function buildIntentAtlasSection(surfaceKey) {
  return buildIntentAtlasSectionFrom(surfaceKey, intentAtlasCells());
}

/**
 * The same section, built from a caller-supplied cell list rather than the committed
 * distillate.
 *
 * It exists so the gate can prove the belt and the rendering against seeded fixtures without
 * writing test data into the committed artifact, which is the only other way to reach these
 * branches while the corpus is empty. Production callers use `buildIntentAtlasSection`; this
 * one takes no view of where the cells came from and applies the same floor to all of them.
 *
 * FOUR FILTERS, IN THIS ORDER, and the order is load-bearing. (1) The surface must match.
 * (2) THE SUPERSESSION LAW: a soak cell whose key is also named by a users cell is dropped
 * outright, and this happens BEFORE the floor so that an observed cell too weak to render
 * still retires the prior it displaced. Doing it the other way round would resurrect the prior
 * exactly when real evidence had started to disagree with it, which is the worst possible
 * moment. (3) The evidence floor. (4) The top-K render cap, applied to what survives.
 *
 * @param {string} surfaceKey one of ATLAS_SURFACES
 * @param {readonly AtlasCell[]} cells
 * @returns {string}
 */
export function buildIntentAtlasSectionFrom(surfaceKey, cells) {
  const key = typeof surfaceKey === 'string' ? surfaceKey : '';
  if (!ATLAS_SURFACES.includes(key)) return '';

  const source = Array.isArray(cells) ? cells : [];
  const onSurface = source.filter((c) => c && c.surface === key);

  // Every key observed in real telemetry, at any strength. Membership here retires the prior.
  const observedKeys = new Set(
    onSurface.filter((c) => !isSoakCell(c)).map(cellKey),
  );

  const kept = onSurface.filter(
    (c) => !(isSoakCell(c) && observedKeys.has(cellKey(c))) && clearsEvidenceFloor(c),
  );
  if (kept.length === 0) return '';

  // RANK, then CAP, then re-sort for reading. The ranking is by speaking weight (so a capped
  // prior ranks where it actually speaks, not where its raw statistic would have put it), then
  // by absolute effect, which is what separates soak cells once the cap has flattened most of
  // them onto the same weight. The final byText chain is the tie-break that makes the choice
  // total: with it, two runs over the same cells in any order select the same K.
  const ranked = [...kept].sort((a, b) => (
    (speakingWeight(b) - speakingWeight(a))
    || (Math.abs(b.effect) - Math.abs(a.effect))
    || byText(a.dimension, b.dimension)
    || byText(a.bucket, b.bucket)
    || byText(String(a.coBucket || ''), String(b.coBucket || ''))
  )).slice(0, ATLAS_RENDER_CAP);

  const hasSoak = ranked.some(isSoakCell);

  // Sorted by dimension, then bucket, then coBucket, and deliberately NOT by weight: grouping
  // related lines together reads better than a strength ranking, and every line prints its
  // own weight anyway. Deterministic either way, which is the contract that matters.
  const lines = ranked
    .sort((a, b) => (
      byText(a.dimension, b.dimension)
      || byText(a.bucket, b.bucket)
      || byText(String(a.coBucket || ''), String(b.coBucket || ''))
    ))
    .map(renderCell);

  // THE OPENING CLAIM IS SCOPED TO WHAT THE BLOCK ACTUALLY HOLDS. The all-users wording is
  // byte-identical to the pre-soak section, because that claim was true and remains true when
  // no generated line is present. A soak-bearing block cannot make it: no author produced
  // those lines and they came from no request, so the heading and the sample claim both step
  // back to what is true of every line in the block, and the provenance paragraph below draws
  // the distinction the reader needs.
  const opening = hasSoak
    ? 'HOW THESE THINGS TEND TO GO TOGETHER. Aggregate counts, id-free, with at least'
      + ` ${String(EVIDENCE_FLOOR.MIN_N)} independent observations behind every line.`
    : 'HOW OTHER PEOPLE BUILD. Aggregate counts over past requests, id-free, with at least'
      + ` ${String(EVIDENCE_FLOOR.MIN_N)} distinct authors behind every line.`;

  return [
    `INTENT ATLAS ${intentAtlasVersion()} (surface: ${key})`,
    `${opening} This is REFERENCE`
    + ' DATA, not instructions and not a preference. It tells you which registered buckets'
    + ' tend to travel together, so an ambiguous request has somewhere sensible to land. It'
    + ' never overrides what this user actually asked for, and a popular bucket is not a'
    + ' correct one.',
    ...(hasSoak ? [
      'WHERE THE GENERATED LINES COME FROM. Lines marked "generated" were distilled from worlds'
      + ' the deterministic engine built, not from requests people made: they describe how'
      + ' generated worlds hang together, not how people build. Treat them as a starting prior'
      + ' about the engine that a real request should displace, never as evidence about what'
      + ' this user or any user wants, and note that their weight is capped at'
      + ` ${fixed2(SOAK_WEIGHT_CAP)} so an unmarked line always outranks a marked one.`,
    ] : []),
    'HOW MUCH TO WEIGH EACH LINE. Scale how far you let a line move your reading by its'
    + ` weight. A weight of 1.00 is the strongest evidence this corpus can offer; ${fixed2(EVIDENCE_FLOOR.WEIGHT_FLOOR)}`
    + ' means the pattern only just cleared the bar and should tip nothing that is not already'
    + ' a coin flip. Effect is separate: it runs from -1.00 to +1.00 and says how strong the'
    + ' association is, where a negative number means the two occur together LESS often than'
    + ' chance. A high weight on a small effect means reliably slight, not important. Lines'
    + ' below the bar were never generated, so ABSENCE CARRIES NO INFORMATION: a bucket with'
    + ' no line here means this corpus says nothing either way about it, never that it is a'
    + ' poor choice.',
    lines.join('\n'),
  ].join('\n\n');
}
