/**
 * Legacy custom-content labels and compatibility helpers.
 *
 * `schema/custom-content.manifest.json` owns category admission, valid values,
 * and effect claims. The arrays here retain established display copy for those
 * values and support older readers that have not moved to the manifest adapter.
 * The pure helpers remain useful to generation, but this module must not be
 * treated as a second semantic schema.
 *
 * ⛔ WHY EVERY DERIVED `_KEYS` CONSTANT BELOW CARRIES A ROLLUP PURE ANNOTATION, AND
 * WHY THAT IS NOT DECORATION. SEVEN non-UI modules import this file, and all seven want
 * exactly two symbols from it (counted by grep, 2026-09-18; an earlier draft of this
 * paragraph said five and named four - it had missed `resolveResources`,
 * `customSupplyChainActivation` and `foldTradeCategories`, which is precisely the kind of
 * hand-kept roster this file should not have asserted without re-measuring. ⚠ EIGHT -> SEVEN
 * on 2026-09-20: `domain/region/foldTradeCategories.js` was RETIRED by FIX-D9 - it had no
 * importer at all, its work having moved to `content/customTradeEndpointProjection.js` at
 * c1ea091f7a. The roster is re-measured here rather than decremented on trust):
 *
 *   `passesTierGate`       - `lib/dependencyEngine.js`, `generators/steps/assembleInstitutions.js`,
 *                            `generators/steps/economyReconcilePass.js`,
 *                            `generators/steps/resolveResources.js`,
 *                            `generators/services/institutionServices.js`,
 *                            `domain/content/customSupplyChainActivation.js`
 *   `tradeCategoryLabelOf` - `domain/content/customTradeEndpointProjection.js`
 *
 * ALL SEVEN are now inside the generation worker's static graph. `foldTradeCategories.js`
 * used to be the one that was not, and that is exactly why it was retired: a module outside
 * every entry's reach is not a consumer. Not one engine, worker, kernel or data module reads
 * a single authoring vocabulary below - they are the compendium editor's, the deity panel's
 * and the gallery map's, and they are the main thread's alone.
 *
 * Rollup could not drop them all the same, and the reason is worth writing down
 * because it recurs: a `const X = Object.freeze(Y.map(f))` lets rollup drop the
 * BINDING while KEEPING THE CALL, since it cannot prove `Y.map(f)` is free of
 * effects - and the retained call keeps `Y` itself alive. The generation worker's
 * bundle carried the whole authoring vocabulary this way, as orphan statements
 * (a bare `Object.freeze(x.map(...));` with nothing assigned), for 3.6 kB the worker
 * can never read. The annotation says the call is free of effects; the UI chunks
 * that genuinely import these keys are unaffected, because there the binding is used.
 *
 * ⚠ `DEITY_MAX_CHART_POSITIONS` IS THE ONE THAT CANNOT TAKE THE ANNOTATION, recorded
 * so the gap does not read as an oversight: it is a property READ
 * (`DEITY_CHART_AXIS_IDS.length`), not a call, and `#__PURE__` annotates call and new
 * expressions only. It holds `DEITY_CHART_AXIS_IDS` (16 tokens) alive and nothing else.
 */

import { compareCodepoint } from './deterministicSort.js';

// Established labels for the category presentation taxonomy. Category-specific
// consumers may use the admitted value for dossier placement.
export const CONTENT_GROUPS = Object.freeze([
  { key: 'government',     label: 'Government & Law' },
  { key: 'infrastructure', label: 'Infrastructure' },
  { key: 'economic',       label: 'Economy & Trade' },
  { key: 'military',       label: 'Military & Defense' },
  { key: 'religious',      label: 'Religion' },
  { key: 'arcane',         label: 'Arcane & Magic' },
  { key: 'criminal',       label: 'Crime & Underworld' },
  { key: 'social',         label: 'Social & Cultural' },
]);
export const CONTENT_GROUP_KEYS = /*#__PURE__*/ Object.freeze(/*#__PURE__*/ CONTENT_GROUPS.map((g) => g.key));

// Criticality labels. Manifest-registered resource and service consumers treat
// `critical` as an inclusion signal; the same field is presentation-only where
// no category-specific consumer is registered.
export const CRITICALITY = Object.freeze([
  { key: 'critical',      label: 'Critical — food, water, timber' },
  { key: 'important',     label: 'Important' },
  { key: 'discretionary', label: 'Discretionary — luxury / comfort' },
]);
export const CRITICALITY_KEYS = /*#__PURE__*/ Object.freeze(/*#__PURE__*/ CRITICALITY.map((c) => c.key));

// Economic-weight labels. Institutions and trade goods use this value in the
// finished-goods supply path; services currently display it without mechanics.
export const ECONOMIC_WEIGHT = Object.freeze([
  { key: 'minor',    label: 'Minor' },
  { key: 'moderate', label: 'Moderate' },
  { key: 'major',    label: 'Major' },
  { key: 'backbone', label: 'Backbone of the economy' },
]);
export const ECONOMIC_WEIGHT_KEYS = /*#__PURE__*/ Object.freeze(/*#__PURE__*/ ECONOMIC_WEIGHT.map((w) => w.key));

// Reserved defense-role vocabulary. Custom-content records currently display
// this authorial classification; no defense-readiness mechanic consumes it.
export const DEFENSE_ROLES = Object.freeze([
  { key: 'none',          label: 'Does not contribute to defense' },
  { key: 'fortification', label: 'Fortification — walls, towers' },
  { key: 'garrison',      label: 'Garrison — standing troops' },
  { key: 'militia',       label: 'Militia — muster of locals' },
  { key: 'watch',         label: 'Watch — patrol & policing' },
  { key: 'arcane_ward',   label: 'Arcane wards' },
  { key: 'logistics',     label: 'Logistics — supply & siege endurance' },
  { key: 'intelligence',  label: 'Intelligence — scouting & spies' },
]);
export const DEFENSE_ROLE_KEYS = /*#__PURE__*/ Object.freeze(/*#__PURE__*/ DEFENSE_ROLES.map((d) => d.key));

// Reserved power-authority vocabulary. It describes an author's intent in the
// Compendium but does not currently alter legitimacy or faction power.
export const POWER_AUTHORITIES = Object.freeze([
  { key: 'religious', label: 'Religious authority' },
  { key: 'martial',   label: 'Martial authority' },
  { key: 'economic',  label: 'Economic authority' },
  { key: 'arcane',    label: 'Arcane authority' },
  { key: 'civic',     label: 'Civic / legal authority' },
  { key: 'popular',   label: 'Popular support' },
  { key: 'noble',     label: 'Noble / dynastic' },
  { key: 'criminal',  label: 'Criminal influence' },
]);
export const POWER_AUTHORITY_KEYS = /*#__PURE__*/ Object.freeze(/*#__PURE__*/ POWER_AUTHORITIES.map((a) => a.key));

// Whether an institution / good / service / resource moves the settlement's
// food balance. Feeds the food-security model (dailyProduction / dailyNeed) so a
// custom farm actually shrinks the deficit and a luxury-only economy widens it.
// Distinct from CRITICALITY (how essential a good is); this is supply vs demand.
export const FOOD_IMPACT = Object.freeze([
  { key: 'none',     label: 'No food impact' },
  { key: 'produces', label: 'Produces food — raises supply' },
  { key: 'consumes', label: 'Consumes food — raises demand' },
]);
export const FOOD_IMPACT_KEYS = /*#__PURE__*/ Object.freeze(/*#__PURE__*/ FOOD_IMPACT.map((f) => f.key));

// §14 — the unified TRADE-CATEGORY taxonomy a custom good/institution declares via
// `satisfies`. One list, two kinds:
//   • demandLive (military…alchemical): keys MUST match INSTITUTION_FINISHED_GOODS_DEMAND
//     in src/data/economicData.js — the generator counts the item as local supply
//     for that demand (shrinks the matching import, e.g. an institution needing arms
//     buys local Dragonbone Greatswords; exports the surplus once demand is met).
//   • classification (agricultural…food_processed): mirror GOODS_CATEGORIES. No demand
//     consumer, but a custom good still FOLDS into this category's trade line and
//     exports as surplus — so the Economics tab shows one bucket, not a pill per good.
// Free-text ("Other") values are allowed too: they fold under the typed label and
// persist in the picker as long as some item references them (see satisfiesOptions).
export const TRADE_CATEGORIES = Object.freeze([
  { key: 'military',      label: 'Weapons & armour',      demandLive: true },
  { key: 'religious',     label: 'Religious consumables', demandLive: true },
  { key: 'maritime',      label: 'Maritime supplies',     demandLive: true },
  { key: 'luxury',        label: 'Luxury goods',          demandLive: true },
  { key: 'alchemical',    label: 'Alchemical supplies',   demandLive: true },
  { key: 'agricultural',  label: 'Agricultural produce' },
  { key: 'raw_materials', label: 'Raw materials' },
  { key: 'manufactured',  label: 'Manufactured goods' },
  { key: 'food_processed', label: 'Processed food' },
]);
const _TRADE_CAT_BY_KEY = new Map(TRADE_CATEGORIES.map((c) => [c.key, c]));

/** Display label for a `satisfies` value: a known category key → its label; a
 *  free-text ("Other") value → returned as-is by the caller (this returns null).
 *  @param {unknown} value
 *  @returns {string|null} */
export function tradeCategoryLabelOf(value) {
  if (!value) return null;
  return _TRADE_CAT_BY_KEY.get(String(value))?.label || null;
}

/** Picker options for the `satisfies` field: the unified categories as builtins
 *  (value=key) + any free-text value currently in use across custom goods/
 *  institutions (the "Other" escape hatch — persists only while referenced).
 *  @param {Record<string, Array<{ satisfies?: unknown }> | undefined> | null | undefined} customContent  a customContent blob (institutions / tradeGoods buckets read here)
 *  @returns {{ builtins: Array<{ value: string, label: string }>, customs: string[] }} */
export function satisfiesOptions(customContent) {
  const builtins = TRADE_CATEGORIES.map((c) => ({ value: c.key, label: c.label }));
  const knownKeys = new Set(TRADE_CATEGORIES.map((c) => c.key));
  /** @type {Map<string, string>} */
  const seen = new Map();
  for (const type of ['institutions', 'tradeGoods']) {
    for (const item of (customContent?.[type] || [])) {
      const v = String(item?.satisfies || '').trim();
      if (!v || knownKeys.has(v)) continue;
      if (!seen.has(v.toLowerCase())) seen.set(v.toLowerCase(), v);
    }
  }
  return { builtins, customs: [...seen.values()].sort(compareCodepoint) };
}

// Back-compat: the DEMAND subset (the 5 categories that drive
// INSTITUTION_FINISHED_GOODS_DEMAND). finishedGoodsSupply + the demand engine
// match against these keys; the classification categories above are display/export
// buckets only.
export const SATISFIES_CATEGORIES = /*#__PURE__*/ Object.freeze(/*#__PURE__*/ TRADE_CATEGORIES.filter((c) => c.demandLive));
export const SATISFIES_KEYS = /*#__PURE__*/ Object.freeze(/*#__PURE__*/ SATISFIES_CATEGORIES.map((c) => c.key));

// ── Deities ─────────────────────────────────────────────────────────────────
// A homebrew deity is inert until assignment embeds a resolved snapshot on a
// settlement. Alignment, law, and rank then affect the religion substrate.
// `temperamentAxis` remains required compatibility metadata, but authoring
// derives it and engine reads derive temperament from alignment plus law.

// Moral alignment — good / evil / neutral. Feeds the good↔evil NPC substrate
// and the contest's alignment-direction match.
export const DEITY_ALIGNMENT = Object.freeze([
  { key: 'good',    label: 'Good' },
  { key: 'evil',    label: 'Evil' },
  { key: 'neutral', label: 'Neutral' },
]);
export const DEITY_ALIGNMENT_KEYS = /*#__PURE__*/ Object.freeze(/*#__PURE__*/ DEITY_ALIGNMENT.map((a) => a.key));

// Compatibility labels for the persisted temperament mirror. The engine does
// not read this stored value; deityAxes derives temperament from alignment/law.
export const DEITY_TEMPER = Object.freeze([
  { key: 'warlike',   label: 'Warlike' },
  { key: 'peacelike', label: 'Peacelike' },
  { key: 'neutral',   label: 'Neutral' },
]);
export const DEITY_TEMPER_KEYS = /*#__PURE__*/ Object.freeze(/*#__PURE__*/ DEITY_TEMPER.map((t) => t.key));

// Rank/scale — major / minor / cult. Scales how strongly the deity lifts
// religious_authority (a major pantheon-head outweighs a fringe cult).
export const DEITY_TIER = Object.freeze([
  { key: 'major', label: 'Major — a pillar of the pantheon' },
  { key: 'minor', label: 'Minor — a lesser god' },
  { key: 'cult',  label: 'Cult — a fringe or secret following' },
]);
export const DEITY_TIER_KEYS = /*#__PURE__*/ Object.freeze(/*#__PURE__*/ DEITY_TIER.map((r) => r.key));

// Law/chaos — lawful / chaotic / neutral. The 4th axis. Couples into the
// law_order causal variable: a lawful god RAISES order/legitimacy pressure; a
// chaotic god LOWERS order AND makes corruption more TOLERATED — a DISTINCT lever
// from the good/evil corruption knobs, which drive onset/exposure directly.
// `neutral` is the back-compat default: a 3-axis deity authored before this axis
// existed is tolerated as lawAxis === 'neutral' (no law_order term).
export const DEITY_LAW = Object.freeze([
  { key: 'lawful',  label: 'Lawful — upholds order and oaths' },
  { key: 'chaotic', label: 'Chaotic — erodes order, tolerates corruption' },
  { key: 'neutral', label: 'Neutral' },
]);
export const DEITY_LAW_KEYS = /*#__PURE__*/ Object.freeze(/*#__PURE__*/ DEITY_LAW.map((l) => l.key));

// Portfolio (Phase 4 W-F5, owner-ratified): an OPTIONAL FREE-TEXT FLAVOR FIELD —
// what the god is "of", in the author's own words. PURE CONTENT with ZERO
// mechanics: no engine module reads it; it rides the embed for display only.
// Absence is always tolerated (every pre-W-F5 deity has none); a present value
// must be free text within the authoring cap (exported for the authoring
// surface's counter — W-F6 wires the input field).
export const DEITY_PORTFOLIO_MAX_LENGTH = 500;

// ── W-FAITH F1c: the authored character surface (D1 / D3 / W_LIVES §6) ───────
// Three additions, all OPTIONAL, all inert to the engine at this car: an authored
// temper STANCE dial, leveled positions on the shared paradigm chart, and a typed
// boon/bane pair. Nothing here has an engine reader yet (the authored temper arm is
// W-FAITH F2c, the chart-position readers are W-LIVES car 5, the channel wiring is
// W-FAITH F4c), so every existing deity reads byte-identically: absent means absent.
//
// VOCABULARY MIRRORS, not imports. These arrays restate three closed vocabularies
// whose homes are elsewhere (`src/domain/npc/paradigmAxisCatalog.js` for the axes,
// levels and poles; `schema/custom-content.manifest.json` for the admitted values).
// The duplication is the module's established idiom and has the same reason as
// TRADITION_ELEMENT_KEYS below: this module rides the small lazy 'custom-schema'
// chunk that the store reaches by dynamic import at the validation chokepoint, and
// importing the axis catalog would haul its whole table into every validation. A
// drift guard pins each mirror to BOTH of its sources, so they cannot diverge.

/** The two sides of every paradigm axis. Sign, in the volume's language. */
export const DEITY_AXIS_POLES = Object.freeze(['virtue', 'vice']);

/** Band words per side, ascending (pack Register II; owner-taste, unsigned). */
export const DEITY_AXIS_LEVELS = Object.freeze(['a_touch', 'marked', 'defining']);

// The axes a deity may be authored onto. This is the catalog's roster MINUS every
// axis whose own EXISTENCE is a queued owner ruling: DEVOTION carries
// `ownerRulingPending: true` (DESIGN_W_LIVES 1.1 row 17 asks whether piety is a
// character axis at all), and admitting it here would freeze it into an authorable
// vocabulary, an AI output schema and a migration snapshot ahead of that ruling.
// The drift guard asserts exactly this rule against the catalog, so signing DEVOTION
// in is one flag flip plus a regenerate, and the pin names it.
export const DEITY_CHART_AXIS_IDS = Object.freeze([
  'CANDOR', 'MERCY', 'COURAGE', 'TEMPER', 'GENEROSITY', 'HUMILITY', 'FIDELITY',
  'INDUSTRY', 'JUSTICE', 'PRUDENCE', 'TRUST', 'CHEER', 'FORBEARANCE', 'PROTECTION',
  'TEMPERANCE', 'CONTENT',
]);

/** One position per axis, so the roster length IS the cap (W_LIVES 1: one signed
 *  leveled position per axis makes the no-same-axis rule arithmetic). */
export const DEITY_MAX_CHART_POSITIONS = DEITY_CHART_AXIS_IDS.length;

/** The admitted position tokens, `AXIS:pole:level`. DERIVED from the three
 *  vocabularies above rather than transcribed, so a token can never be mistyped;
 *  the drift guard pins the derived set against the manifest's own `values`. */
export const DEITY_CHART_POSITION_KEYS = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ DEITY_CHART_AXIS_IDS.flatMap((axisId) => DEITY_AXIS_POLES.flatMap(
    (pole) => DEITY_AXIS_LEVELS.map((level) => `${axisId}:${pole}:${level}`),
  )),
);

/** The axis id of a position token, or '' when the token is not one of ours.
 *  @param {unknown} token @returns {string} */
export function deityChartAxisOf(token) {
  const parts = String(token ?? '').split(':');
  return parts.length === 3 && DEITY_CHART_AXIS_IDS.includes(parts[0]) ? parts[0] : '';
}

// Boon and bane channels (DESIGN_W_FAITH D3 candidate register, owner-UNSIGNED).
// Each key names an EXISTING settlement causal quantity; none invents one. No
// mechanical consumer reads them at this car, so nothing double-counts yet.
export const DEITY_EFFECT_CHANNELS = Object.freeze([
  { key: 'harvest',       label: 'Harvest and field' },
  { key: 'trade',         label: 'Trade and markets' },
  { key: 'craft',         label: 'Craft and making' },
  { key: 'healing',       label: 'Healing and resistance to pestilence' },
  { key: 'sea',           label: 'Sea and storm' },
  { key: 'order',         label: 'Order and the keeping of law' },
  { key: 'war_readiness', label: 'Readiness for war' },
  { key: 'learning',      label: 'Learning and record' },
  { key: 'hearth',        label: 'Hearth and household' },
]);
export const DEITY_EFFECT_CHANNEL_KEYS = /*#__PURE__*/ Object.freeze(/*#__PURE__*/ DEITY_EFFECT_CHANNELS.map((c) => c.key));

// Banded magnitude, never a float (D3). These are the PULL bands of pack Register
// III (faint / firm / heavy), deliberately NOT the axis band words: a boon is a
// magnitude, not a position on a chart, and reusing the position ladder would
// invite the two to be read as the same scale.
export const DEITY_EFFECT_STRENGTHS = Object.freeze([
  { key: 'faint', label: 'Faint' },
  { key: 'firm',  label: 'Firm' },
  { key: 'heavy', label: 'Heavy' },
]);
export const DEITY_EFFECT_STRENGTH_KEYS = /*#__PURE__*/ Object.freeze(/*#__PURE__*/ DEITY_EFFECT_STRENGTHS.map((s) => s.key));

// DIVINE IMMUTABILITY, STRUCTURALLY (ODQ 800.3 J4 / DESIGN_W_LIVES 6): a deity has
// no drift state, and the drift writer accepts NPCs only. The canonical admission
// path already makes this unrepresentable, because it rejects EVERY unregistered
// field and no drift key is registered. These spellings are refused BY NAME as well,
// so the compat validator agrees with the chokepoint and the refusal is a stated law
// rather than a side effect of a generic mechanism.
export const DEITY_REFUSED_DRIFT_KEYS = Object.freeze([
  'characterDrift', 'drift', 'driftState', 'axisDrift', 'effectiveCharacter',
]);

/**
 * Validate the historical deity shape for compatibility callers. Canonical
 * custom-content writes use `admitCustomContentDefinition`; this helper remains
 * for old imports and focused enum diagnostics.
 *
 * The 4th axis `lawAxis` is BACK-COMPAT TOLERANT: a NEW deity should set it (the
 * authoring UI always does), but a deity authored before the axis existed carries
 * no lawAxis at all — that ABSENCE is tolerated and read as `neutral` (no
 * law_order term), so legacy deity content never breaks. An explicitly
 * PRESENT-but-invalid lawAxis is still rejected (a typo can't slip through). The
 * 056 DB CHECK mirrors exactly this: NULL/absent lawAxis is admitted, a present
 * bad value rejected.
 *
 * The `portfolio` field (Phase 4 W-F5) is likewise ADDITIVE-TOLERANT: an
 * optional free-text flavor field with zero mechanics. Absence is always fine;
 * a present value must be a string within DEITY_PORTFOLIO_MAX_LENGTH.
 *
 * W-FAITH F1c adds six more ADDITIVE-TOLERANT optional fields — `authoredTemper`,
 * `characterAxes`, and the two boon/bane pairs — plus one REFUSAL: no drift-state
 * key may attach to a deity, because a god's character does not move. Absence of
 * every one of them is the legacy shape, so an existing deity validates unchanged.
 *
 * @param {{ name?: unknown, alignmentAxis?: unknown, temperamentAxis?: unknown, rankAxis?: unknown, lawAxis?: unknown, portfolio?: unknown, authoredTemper?: unknown, characterAxes?: unknown, boonChannel?: unknown, boonStrength?: unknown, baneChannel?: unknown, baneStrength?: unknown }} [deity]
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateDeity(deity = {}) {
  /** @type {string[]} */
  const errors = [];
  const name = String(deity?.name || '').trim();
  if (!name) errors.push('A deity needs a name.');
  // The axis reads are `unknown`; cast to string only to satisfy the frozen-key
  // `.includes()` element type — a non-string value still compares unequal (fails
  // validation), so the cast is a pure type-level assertion, not a coercion.
  if (!DEITY_ALIGNMENT_KEYS.includes(/** @type {string} */ (deity?.alignmentAxis))) {
    errors.push(`alignmentAxis must be one of: ${DEITY_ALIGNMENT_KEYS.join(', ')}.`);
  }
  if (!DEITY_TEMPER_KEYS.includes(/** @type {string} */ (deity?.temperamentAxis))) {
    errors.push(`temperamentAxis must be one of: ${DEITY_TEMPER_KEYS.join(', ')}.`);
  }
  if (!DEITY_TIER_KEYS.includes(/** @type {string} */ (deity?.rankAxis))) {
    errors.push(`rankAxis must be one of: ${DEITY_TIER_KEYS.join(', ')}.`);
  }
  // lawAxis: tolerate ABSENCE (legacy 3-axis deity ⇒ neutral); reject only a
  // present-but-invalid value. `== null` covers both undefined and null.
  if (deity?.lawAxis != null && !DEITY_LAW_KEYS.includes(/** @type {string} */ (deity.lawAxis))) {
    errors.push(`lawAxis must be one of: ${DEITY_LAW_KEYS.join(', ')}.`);
  }
  // portfolio (W-F5): OPTIONAL free-text flavor, zero mechanics. Absence is
  // always tolerated; a present value must be free text within the cap.
  if (deity?.portfolio != null) {
    if (typeof deity.portfolio !== 'string') {
      errors.push('portfolio must be free text (a string).');
    } else if (deity.portfolio.length > DEITY_PORTFOLIO_MAX_LENGTH) {
      errors.push(`portfolio must stay within ${DEITY_PORTFOLIO_MAX_LENGTH} characters.`);
    }
  }
  // authoredTemper (W-FAITH D1): the authored STANCE dial. A separate field from the
  // retired temperamentAxis mirror on purpose, so re-arming the old stored value can
  // never shift content that was minted for compatibility rather than intent.
  if (deity?.authoredTemper != null
      && !DEITY_TEMPER_KEYS.includes(/** @type {string} */ (deity.authoredTemper))) {
    errors.push(`authoredTemper must be one of: ${DEITY_TEMPER_KEYS.join(', ')}.`);
  }
  collectDeityChartErrors(errors, deity);
  collectDeityAspectErrors(errors, deity);
  // DIVINE IMMUTABILITY (ODQ 800.3 J4): a deity holds positions, never drift.
  for (const key of DEITY_REFUSED_DRIFT_KEYS) {
    if (deity != null && Object.prototype.hasOwnProperty.call(deity, key)) {
      errors.push(`${key} cannot be stored on a deity: a god's character does not drift.`);
    }
  }
  return { ok: errors.length === 0, errors };
}

/**
 * The chart-position half of validateDeity, split out so the validator stays under
 * the module's complexity budget. Absent is always legal (a god at neutral on every
 * axis is a real authorial choice). A present value is a token or list of tokens
 * from the closed vocabulary, at most one position PER AXIS.
 *
 * The one-position-per-axis rule is the arithmetic the volume asks for, restated as
 * a refusal: the admitted shape is a list, and a list can name an axis twice, so
 * what is structural in the model has to be enforced here and in the DB CHECK.
 *
 * @param {string[]} errors  accumulator, appended in place
 * @param {{ characterAxes?: unknown }} [deity]
 */
function collectDeityChartErrors(errors, deity = {}) {
  const raw = deity?.characterAxes;
  if (raw == null) return;
  if (typeof raw !== 'string' && !Array.isArray(raw)) {
    errors.push('characterAxes must be one position token or a list of them.');
    return;
  }
  const tokens = Array.isArray(raw) ? raw : [raw];
  if (tokens.length > DEITY_MAX_CHART_POSITIONS) {
    errors.push(`characterAxes may carry at most ${DEITY_MAX_CHART_POSITIONS} positions.`);
  }
  /** @type {Set<string>} */
  const axesSeen = new Set();
  for (const token of tokens) {
    if (typeof token !== 'string'
        || !DEITY_CHART_POSITION_KEYS.includes(token)) {
      errors.push('characterAxes entries must read AXIS:pole:level from the chart vocabulary.');
      continue;
    }
    const axisId = deityChartAxisOf(token);
    if (axesSeen.has(axisId)) {
      errors.push(`characterAxes holds two positions on ${axisId}: an axis carries one position.`);
      continue;
    }
    axesSeen.add(axisId);
  }
}

/**
 * The boon/bane half of validateDeity. Pure buff, pure bane, both, and neither are
 * all legal (ODQ 797.4 — neutral is first-class), so the only structural rule is
 * that a channel and its strength travel together: a channel with no magnitude, or
 * a magnitude with no channel, is half a thought rather than a quiet default.
 *
 * @param {string[]} errors  accumulator, appended in place
 * @param {{ boonChannel?: unknown, boonStrength?: unknown, baneChannel?: unknown, baneStrength?: unknown }} [deity]
 */
function collectDeityAspectErrors(errors, deity = {}) {
  for (const aspect of ['boon', 'bane']) {
    const channel = /** @type {Record<string, unknown>} */ (deity ?? {})[`${aspect}Channel`];
    const strength = /** @type {Record<string, unknown>} */ (deity ?? {})[`${aspect}Strength`];
    if (channel != null && !DEITY_EFFECT_CHANNEL_KEYS.includes(/** @type {string} */ (channel))) {
      errors.push(`${aspect}Channel must be one of: ${DEITY_EFFECT_CHANNEL_KEYS.join(', ')}.`);
    }
    if (strength != null && !DEITY_EFFECT_STRENGTH_KEYS.includes(/** @type {string} */ (strength))) {
      errors.push(`${aspect}Strength must be one of: ${DEITY_EFFECT_STRENGTH_KEYS.join(', ')}.`);
    }
    if ((channel == null) !== (strength == null)) {
      errors.push(`${aspect}Channel and ${aspect}Strength must be authored together.`);
    }
  }
}

// ── Traditions (THE TRADITIONS wave, Engine Lift #4 / slice T-5) ───────────────
// The `traditions` custom-content bucket: a DECLARED per-settlement observance that,
// when a deep preset lights traditionsEnabled, can claim a genesis slot
// (declared-over-derived, DESIGN_TRADITIONS §11). Authored content is a
// NAME plus an OPTIONAL typed motif (element × act) drawn from the same vocabulary the
// derived founding traditions use, plus an optional free-text epithet.
//
// The two key arrays mirror src/data/traditionCorpus.js
// (TRADITION_ELEMENTS / TRADITION_ACTS ids) rather than importing it. Original reason (T5-c):
// this module was EAGER (the store slice imported it statically) and importing the corpus
// would have dragged its tables into first paint. Since the de-eager lane (2026-07-19) the
// module rides the lazy 'custom-schema' chunk (the store reaches it only by dynamic import
// at the validation chokepoint) — the duplication STAYS, now so the small validation chunk
// never hauls the corpus prose tables into compatibility readers. Canonical
// admission comes from the manifest; a drift-guard pins this display/legacy
// mirror to both vocabularies so it cannot silently diverge.
export const TRADITION_ELEMENT_KEYS = Object.freeze([
  'founding', 'first-landing', 'charter', 'hearth', 'harvest', 'river', 'stone', 'the-dead',
  'field', 'forge', 'market', 'hunt', 'long-sun', 'tide', 'greening', 'stars',
]);
export const TRADITION_ACT_KEYS = Object.freeze(['feast', 'procession', 'vigil', 'contest', 'fair', 'offering']);
export const TRADITION_EPITHET_MAX_LENGTH = 300;

/**
 * Validate the historical tradition shape for compatibility callers. Canonical
 * writes use manifest admission. A bare-name tradition remains valid; present
 * motif fields must use the mirrored corpus keys and epithet stays bounded.
 * @param {{ name?: unknown, motifElement?: unknown, motifAct?: unknown, epithet?: unknown }} [tradition]
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateTradition(tradition = {}) {
  /** @type {string[]} */
  const errors = [];
  const name = String(tradition?.name || '').trim();
  if (!name) errors.push('A tradition needs a name.');
  // The motif reads are `unknown`; cast to string only to satisfy the frozen-key
  // `.includes()` element type — a non-string value still compares unequal (rejected).
  if (tradition?.motifElement != null && !TRADITION_ELEMENT_KEYS.includes(/** @type {string} */ (tradition.motifElement))) {
    errors.push(`motifElement must be one of: ${TRADITION_ELEMENT_KEYS.join(', ')}.`);
  }
  if (tradition?.motifAct != null && !TRADITION_ACT_KEYS.includes(/** @type {string} */ (tradition.motifAct))) {
    errors.push(`motifAct must be one of: ${TRADITION_ACT_KEYS.join(', ')}.`);
  }
  if (tradition?.epithet != null) {
    if (typeof tradition.epithet !== 'string') {
      errors.push('epithet must be free text (a string).');
    } else if (tradition.epithet.length > TRADITION_EPITHET_MAX_LENGTH) {
      errors.push(`epithet must stay within ${TRADITION_EPITHET_MAX_LENGTH} characters.`);
    }
  }
  return { ok: errors.length === 0, errors };
}

// Settlement tiers, smallest → largest, for tier gates (min/max).
export const TIER_ORDER = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * A tag/toggle-bearing custom entity — the structural subset the tag helpers read.
 * @typedef {Object} TaggableEntity
 * @property {unknown} [tags]      comma-string or array of tag words
 * @property {unknown} [magical]   toggle folded into the tag set
 * @property {unknown} [criminal]  toggle folded into the tag set
 */

/**
 * Normalize a comma-string or array of tags to a clean lowercase array.
 * @param {unknown} raw
 * @returns {string[]}
 */
export function normalizeTags(raw) {
  if (Array.isArray(raw)) return raw.map((t) => String(t).trim().toLowerCase()).filter(Boolean);
  if (typeof raw === 'string') return raw.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
  return [];
}

/** Effective tags including the magical / criminal toggles folded in.
 *  @param {TaggableEntity} [entity]
 *  @returns {string[]} */
export function effectiveTags(entity = {}) {
  const tags = new Set(normalizeTags(entity?.tags));
  if (entity?.magical) tags.add('magical');
  if (entity?.criminal) tags.add('criminal');
  return Array.from(tags);
}

/** @param {TaggableEntity} [entity] @returns {boolean} */
export function isMagical(entity = {}) {
  return entity?.magical === true || normalizeTags(entity?.tags).includes('magical');
}

/** @param {TaggableEntity} [entity] @returns {boolean} */
export function isCriminal(entity = {}) {
  return entity?.criminal === true || normalizeTags(entity?.tags).includes('criminal');
}

/**
 * The buckets whose tier fields actually gate generation.
 *
 * Derived from schema/custom-content.manifest.json: exactly the categories that
 * declare tierMin/tierMax with effect 'mechanical' AND name `eligibleCustomContent`
 * among that field's consumers. The agreement between this list and the manifest
 * is pinned by tests/domain/customContentTierGates.test.js, so the manifest and
 * this filter can never silently disagree.
 *
 * Buckets OUTSIDE the list pass through UNFILTERED. That is the point: `factions`
 * declares a tierMin whose effect is 'presentation' (its only consumer is the
 * compendium attribute chip), and a presentation-classified field must never
 * quietly acquire a generation effect by riding a generic loop (capability-atlas
 * custom-content Gap 7c). A future bucket that genuinely needs gating declares
 * mechanical tier fields and joins this list — the agreement pin reds until it does.
 *
 * Hardcoded rather than imported from customContentManifest.generated.js on
 * purpose: this module sits inside the generation-time lazy boundary and must not
 * pull the generated manifest into its closure. Hardcode + agreement test is the
 * table-clerk pattern used elsewhere in this repo.
 */
export const TIER_GATED_BUCKETS = Object.freeze(['institutions', 'services', 'resources']);

/**
 * Filter a whole customContent blob to the items eligible for a settlement of
 * `tier`, honoring each item's tier gate (§14 P2 — gates honored in generation).
 * Only TIER_GATED_BUCKETS are filtered at all; every other bucket passes through
 * untouched. Inside a gated bucket an item with no gate of its own still passes.
 * Pure — never mutates the input; returns the blob unchanged when no tier is given.
 *
 * @param {Object|null} customContent
 * @param {{ tier?: string }} [opts]
 * @returns {Object|null}
 */
export function eligibleCustomContent(customContent, { tier } = {}) {
  if (!customContent || typeof customContent !== 'object' || !tier) return customContent;
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const [bucket, items] of Object.entries(customContent)) {
    out[bucket] = Array.isArray(items) && TIER_GATED_BUCKETS.includes(bucket)
      ? items.filter((it) => passesTierGate(it, tier))
      : items;
  }
  return out;
}

/**
 * Does `entity` satisfy its tier gate at the given settlement `tier`?
 * tierMin / tierMax are inclusive; missing gates mean "no bound". Unknown tiers
 * pass (fail-open — never hide content over a typo).
 *
 * @param {{ tierMin?: unknown, tierMax?: unknown }} [entity]
 * @param {string | null | undefined} [tier]
 * @returns {boolean}
 */
export function passesTierGate(entity = {}, tier) {
  if (!tier) return true;
  const ti = TIER_ORDER.indexOf(String(tier).toLowerCase());
  if (ti === -1) return true;
  const minRaw = entity?.tierMin ? TIER_ORDER.indexOf(String(entity.tierMin).toLowerCase()) : -1;
  const maxRaw = entity?.tierMax ? TIER_ORDER.indexOf(String(entity.tierMax).toLowerCase()) : -1;
  if (minRaw !== -1 && ti < minRaw) return false;
  if (maxRaw !== -1 && ti > maxRaw) return false;
  return true;
}
