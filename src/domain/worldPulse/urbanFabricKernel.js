/**
 * urbanFabricKernel.js — THE URBAN FABRIC LAYER (owner commission, task #39; the
 * growth layer for STONE — the map's memory).
 *
 * Owner verbatim (COMPREHENSIVE_REVIEW_PROGRAM.md): the map gains MEMORY: a pure
 * projection of current state cannot show gradual history ("buildings and city
 * designs are resistant to rapid change except in the case of catastrophe and
 * rebirth") — so THE FABRIC LAYER = the growth layer for stone: district
 * prominence integrators (deposits from ruling power / faith dominance / income
 * sources / trade volume / population / food disparity; SLOW decay — the merchant
 * quarter's prosperity lingers after the guild falls, gradually replaced) ·
 * ALIGNMENT = the drift rate of NEW fabric (lawful rubric-faithful; chaotic
 * encroachment over the old planned bones — the palimpsest) · STRESSOR SCARS as
 * decaying entries · CATASTROPHE the one fast path (calamityHistory → district
 * rebirth). Map = projection(dossier + fabric).
 *
 * THE ARCHITECTURE (the npcGrowth deposit/decay/sidecar machinery at DISTRICT
 * scale — masonry, not mood):
 *   • PROMINENCE IS A DEPOSIT LEDGER. `spatialLedgers.urbanFabric`, keyed by the
 *     canonical settlement id → per-district-class decaying STOCKS. The class
 *     vocabulary is the town map's district 12-enum (districtProfile
 *     DISTRICT_CATEGORIES) — PINNED by test, never imported (the zero
 *     engine→display-derivation coupling law: districtProfile pulls the
 *     causalState/activeConditions family, which stays out of the engine graph).
 *   • DEPOSITS ARE READS, NOT ROLLS: the durable POST-apply outcomes already in
 *     state — who holds power (factionArchetype of the governing faction), which
 *     institutions STAND (active, not ruined), the patron faith's adherent share,
 *     the income sources, the M6d trade throughput, the population tier, the food
 *     deficit — deposit deterministically each advance. NO rng.
 *   • TIME IS WEEKS, NOT ADVANCES: stocks decay (and deposits integrate) over
 *     calendar.elapsedWeeks deltas, so the fabric moves at the same STONE pace
 *     whether the owner advances by week or by year (interval-invariant — the
 *     masonry clock cannot depend on how often the sim is poked).
 *   • REGIME/FAITH TRANSITION = DECAY + DEPOSIT, NEVER FLIP: when the merchant
 *     guild falls, its quarter's stock stops receiving the ruling deposit and
 *     halves over ~5 years while the new regime's class accumulates — the old
 *     prominence visibly LINGERS (the acceptance fixture pins exactly this).
 *   • ALIGNMENT = THE DRIFT-RATE OF NEW FABRIC: a per-settlement chaos-grain
 *     scalar (0 lawful rubric … 1 chaotic encroachment) integrating slowly toward
 *     the live alignment climate (1 − lawfulness01) — the palimpsest input the v2
 *     layout engine reads for how NEW fabric is laid over the old bones.
 *   • STRESSOR SCARS: typed decaying records (burn_lots, plague_quarter,
 *     siege_repairs, …) minted from calamity stamps, lifted sieges/occupations,
 *     and live famine — each on its own masonry half-life, keyed by kind (the
 *     bounded-vocabulary size governor).
 *   • CATASTROPHE = THE ONE FAST PATH: a FRESH calamityHistory stamp (tick-high-
 *     water-marked) whose toll clears the rebirth floor RESETS the struck district
 *     classes' stocks (classified from the stamp's institution targets) and mints
 *     a rebirth marker — the single sanctioned rapid change.
 *
 * THE READ MODEL (#38 consumes when lit): the authoritative sidecar is projected
 * each advance onto a compact NON-core `settlement.urbanFabric` mirror (the
 * npcGrowth acquiredTraits idiom — self-healing, re-projected every advance, so
 * no settlement rebuild can ghost it). The v2 layout engine reads the mirror via
 * the pure townMap/fabricRead.js API; absent/dark ⇒ empty ⇒ the layout engine
 * falls back to current-state derivation.
 *
 * THE DORMANCY GATE (constitutional): behind the VIRTUAL urbanFabricEnabled flag
 * (ABSENT from DEFAULT_SIMULATION_RULES — the npcGrowthEnabled precedent). Absent
 * ⇒ an immediate no-op: zero deposits, zero ledger key, zero mirror,
 * byte-identical (the fabric dormancy golden proves it).
 *
 * THE PULSE SEAM (ceiling discipline): pulseKernel is AT its frozen effective-
 * line ceiling, so this leaf exports advanceNpcGrowthWithFabric — the growth
 * mover composed with the fabric mover (fabric runs LAST, over growth's outputs,
 * reading the fully-settled tick). pulseKernel's existing growth import/call is
 * NAME-SWAPPED (the provenanceKernel idiom — a swap, not a new line).
 *
 * FIRST-PAINT LAW: a LAZY worldPulse leaf — imported ONLY from the lazy pulse
 * engine (pulseKernel, at the mover seam). Never from the first-paint entry
 * closure. @enforced-by tests/build/vendorPdfLazy.test.js (first-paint budget +
 * engine-chunk-absent).
 *
 * Pure, deterministic, side-effect-free, rng-free, clock-free. AGGREGATE of
 * durable state → per-settlement fabric overlay; never a named soul's fate.
 *
 * @enforced-by tests/property/urbanFabricDormancyGolden.test.js (dormancy
 *   byte-identity + lit anti-vacuity), tests/domain/urbanFabricKernel.test.js
 *   (the two-regime lingering fixture, scar decay, catastrophe rebirth, drift
 *   derivation, size governor, determinism, vocabulary pin).
 */
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { factionArchetype, FACTION_ARCHETYPES } from '../factionArchetypes.js';
import { governingFactionOf } from '../rulingPower.js';
import { settlementAlignment } from './settlementAlignment.js';
import { famineFor } from './foodStockpile.js';
import { advanceNpcGrowth } from './npcGrowthKernel.js';
import { TIER_ORDER, popToTier } from '../../data/constants.js';
import { clamp, clamp01 } from '../../kernel/math.js';

// ── Kernel-local read shapes (0-hole discipline: no `any`) ────────────────────
/** @typedef {{ name?: string, category?: string, status?: string, required?: boolean }} FabInstitution */
/** @typedef {{ type?: string, name?: string, year?: number, tick?: number, deaths?: number,
 *   exodus?: number, k?: number, targets?: unknown[] }} FabCalStamp */
/** @typedef {{ name?: string, tier?: string, population?: number,
 *   institutions?: FabInstitution[], calamityHistory?: FabCalStamp[],
 *   economicState?: Record<string, unknown>, powerStructure?: Record<string, unknown>,
 *   config?: Record<string, unknown>, urbanFabric?: unknown }} FabSettlement */
/** @typedef {{ id?: (string|number), name?: string, settlement?: FabSettlement }} FabSnapItem */
/** @typedef {{ settlements?: FabSnapItem[] }} FabSnapshot */
/** @typedef {{ saveId?: (string|number), settlement?: FabSettlement }} FabUpdate */
/** @typedef {{ v: number, since: number, last: number }} FabStock */
/** @typedef {{ sev: number, tick: number, week: number }} FabScar */
/** @typedef {{ classes: string[], tick: number, type: string, week: number }} FabRebirth */
/** @typedef {{ drift: number, led: string, rebirths: FabRebirth[], scars: Record<string, FabScar>,
 *   seenTick: number, stocks: Record<string, FabStock>, week: number }} FabRecord */

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** Codepoint compare for byte-stable iteration. @param {string} a @param {string} b */
function compareCodepoint(a, b) { return a < b ? -1 : a > b ? 1 : 0; }
/** @param {number} v @returns {number} */
function round4(v) { return Math.round(num(v, 0) * 10000) / 10000; }

// ── THE DORMANCY GATE (constitutional) — a virtual, defensively-read flag ──────
/**
 * Is the fabric layer LIT? Reads simulationRules.urbanFabricEnabled === true,
 * defensively — ABSENT ⇒ false ⇒ DORMANT ⇒ the mover is never entered
 * (byte-identical; NO default in DEFAULT_SIMULATION_RULES, so goldens do not
 * move). Mirrors npcGrowthActive. Pure, total.
 * @param {{ simulationRules?: Record<string, unknown> }|null|undefined} worldState
 * @returns {boolean}
 */
export function urbanFabricActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object' && /** @type {Record<string, unknown>} */ (rules).urbanFabricEnabled === true);
}

// ── THE CLASS VOCABULARY (JUDGMENT — say "veto") ──────────────────────────────
//
// Stocks key on the town map's district 12-enum (districtProfile
// DISTRICT_CATEGORIES) — the ONE spine already shared by the district derivation,
// the placement priors (townMapModel CATEGORY_PLACEMENT), the institution
// affinity table, and every palette. PINNED equal by the vocabulary pin, never
// imported (engine decoupling — see header). The canonical faction-archetype
// detector (factionArchetypes.js — category wins, name-regex fallback) is the
// ONE classifier for both the ruling regime and standing institutions; this map
// carries each archetype onto its district class.
/** @type {Readonly<Record<string, string>>} */
export const ARCHETYPE_TO_DISTRICT = Object.freeze({
  [FACTION_ARCHETYPES.GOVERNMENT]: 'civic',
  [FACTION_ARCHETYPES.CIVIC]: 'civic',
  [FACTION_ARCHETYPES.NOBLE]: 'noble',
  [FACTION_ARCHETYPES.MILITARY]: 'military',
  [FACTION_ARCHETYPES.MERCHANT]: 'merchant',
  [FACTION_ARCHETYPES.RELIGIOUS]: 'religious',
  [FACTION_ARCHETYPES.CRIMINAL]: 'criminal',
  [FACTION_ARCHETYPES.ARCANE]: 'arcane',
  [FACTION_ARCHETYPES.CRAFT]: 'craft',
  [FACTION_ARCHETYPES.LABOR]: 'industrial',
  [FACTION_ARCHETYPES.OUTSIDER]: 'foreign',
  [FACTION_ARCHETYPES.OCCUPATION]: 'military',
  // OTHER intentionally unmapped: an unclassifiable institution deposits nothing
  // (never a dump into 'civic'); the RULING read alone falls back to 'civic' (a
  // generic seat of power still builds government fabric).
});

// Fabric-noun fallback for entities the faction detector cannot place — calamity
// TARGETS are bare institution names ('Tannery'), and the stone they occupied
// must classify for the rebirth path. Ordered; first match wins.
/** @type {ReadonlyArray<{ cls: string, re: RegExp }>} */
const FABRIC_NAME_RULES = Object.freeze([
  { cls: 'industrial', re: /tanner|dye|slaughter|smelt|kiln|foundr|warehouse|dock|wharf|shipyard|sawmill|brewery|charcoal/i },
  { cls: 'merchant', re: /inn\b|tavern|alehouse|bath|theat|arena|market|bazaar|exchange/i },
  { cls: 'civic', re: /granary|well\b|bridge|gate|wall|hall|court|prison|orphanage/i },
  { cls: 'noble', re: /manor|estate|villa|palace/i },
  { cls: 'residential', re: /hovel|tenement|slum|boarding|commons/i },
]);

/**
 * The district class of a faction/institution/name — the canonical archetype
 * detector first (category wins, name regex fallback), then the fabric-noun
 * rules, else null (deposits nothing / target unclassified).
 * @param {Record<string, unknown>|string|null|undefined} entity
 * @returns {string|null}
 */
export function districtClassOf(entity) {
  if (entity == null) return null;
  const arch = factionArchetype(/** @type {Parameters<typeof factionArchetype>[0]} */ (entity));
  const mapped = ARCHETYPE_TO_DISTRICT[arch];
  if (mapped) return mapped;
  const text = typeof entity === 'string'
    ? entity
    : [asObject(entity).name, asObject(entity).label].map((x) => String(x || '')).join(' ');
  for (const { cls, re } of FABRIC_NAME_RULES) if (re.test(text)) return cls;
  return null;
}

// Income-source classification (extramural livelihoods — farms, fisheries, herds
// — build no urban fabric and intentionally match nothing).
/** @type {ReadonlyArray<{ cls: string, re: RegExp }>} */
const INCOME_CLASS_RULES = Object.freeze([
  { cls: 'industrial', re: /mine|mining|quarr|smelt|forge|foundr|tanner|lumber|timber|mill|shipyard|kiln|ore\b/i },
  { cls: 'craft', re: /craft|artisan|smith|weav|brew|potter|carpen|mason|glass|leather/i },
  { cls: 'merchant', re: /trade|market|commerce|port\b|caravan|toll|merchant|export|tariff/i },
]);

// ── Tuning (JUDGMENT tables — say "veto" to retune) ───────────────────────────
//
// TIME-CONSTANTS: masonry, not mood — all half-lives in CALENDAR WEEKS (52/yr),
// integrated over each advance's elapsedWeeks delta (interval-invariant).
export const FABRIC_TUNING = Object.freeze({
  // Prominence stock half-life: ~5 years. The merchant quarter's stone halves a
  // decade after the guild falls only twice over — visibly lingering, gradually
  // replaced (the owner's acceptance example).
  STOCK_HALF_LIFE_WEEKS: 260,
  // Stock saturation + prune floor (spent ⇒ dropped ⇒ byte-identical-dormant).
  STOCK_MAX: 10,
  PRUNE_EPSILON: 0.05,
  // The alignment drift scalar's approach half-life toward the live climate:
  // ~2 years — new fabric's grain answers a regime's character only slowly.
  DRIFT_HALF_LIFE_WEEKS: 104,
  // A settlement first seen by the lit mover integrates ONE week of deposits
  // (a conservative first brick; its true delta is unknowable at first sight).
  FIRST_SIGHT_WEEKS: 1,
  // CATASTROPHE (the one fast path): a fresh stamp whose toll (deaths + exodus)
  // clears the floor rebirths its struck classes; a toll at/above the town-wide
  // bar with NO classifiable targets razes every class.
  REBIRTH_TOLL_FLOOR: 100,
  REBIRTH_TOWNWIDE_TOLL: 400,
  // Rebirth markers kept per settlement (latest first eviction — size governor).
  REBIRTH_CAP: 6,
  // Dominance-turn hysteresis: a rising class must exceed the incumbent by this
  // ratio (and clear the floor) before the chronicle calls the turn.
  LEAD_FLOOR: 1.0,
  TURN_MARGIN: 1.15,
  // Scar mint severities + the calamity severity model (below).
  SCAR_SIEGE_SEV: 0.6,
  SCAR_OCCUPATION_SEV: 0.5,
  SCAR_FAMINE_SEV: 0.45,
  SCAR_PRUNE_EPSILON: 0.05,
  // Trade throughput saturation: the M6d in+out tally that reads as "full
  // merchant fabric pressure" (upswing's BOOM_ENTER_THROUGHPUT).
  TRADE_FLOW_SAT: 3.0,
});

// THE DEPOSIT MAP (JUDGMENT — say "veto" to retune). Per-WEEK deposit rates
// (multiplied by each advance's elapsed weeks, then by the signal's own 0..1
// magnitude where noted). Steady-state stock ≈ rate × HALF_LIFE/ln2 ≈ rate × 375:
// a ruling class alone equilibrates ≈ 7.5 of STOCK_MAX 10; a merchant-ruled
// entrepôt saturates its quarter.
//
//   owner anchor           durable signal (existing surface)        → class      rate/wk
//   ─────────────────────────────────────────────────────────────────────────────────────
//   ruling power           factionArchetype(governingFactionOf)     → its class  0.020
//   institution standing   each ACTIVE institution, classified      → its class  0.006 ×n (≤3/class)
//   dominant faith         religionStates patron share01            → religious  0.015 ×share
//   income sources         incomeSources + economicBase, classified → ind/craft/merch 0.008 ×n (≤2/class)
//   trade volume           tradeFlow (in+out)/BOOM_ENTER sat        → merchant   0.012 ×thr01
//   trade volume           earned entrepôt (isEntrepot/centrality)  → foreign    0.008
//   population band        tier rank01 (TIER_ORDER)                 → residential 0.010 ×tier01
//   food disparity         foodSecurity.deficitPct/100 ∪ famine     → criminal   0.012 ×disp01
export const FABRIC_DEPOSIT_RATES = Object.freeze({
  RULING: 0.020,
  INSTITUTION: 0.006,
  INSTITUTION_CAP_PER_CLASS: 3,
  FAITH: 0.015,
  INCOME: 0.008,
  INCOME_CAP_PER_CLASS: 2,
  TRADE: 0.012,
  ENTREPOT: 0.008,
  POPULATION: 0.010,
  DISPARITY: 0.012,
});

// STRESSOR SCARS (JUDGMENT — say "veto"): typed, kind-keyed (the bounded-
// vocabulary size governor — one record per kind per settlement, refreshed on
// repeat), each on its own masonry half-life (weeks).
/** @type {Readonly<Record<string, number>>} */
export const SCAR_HALF_LIFE_WEEKS = Object.freeze({
  burn_lots: 104,        // fire: rebuilt in a couple of years
  plague_quarter: 156,   // plague: shunned houses linger ~3y
  flood_line: 104,       // flood: the water-mark fades with the repairs
  rubble_field: 208,     // earthquake: rubble is slow to clear (~4y)
  calamity_scar: 130,    // unclassified calamity
  siege_repairs: 260,    // siege: patched walls read for ~5y
  occupation_marks: 208, // occupation: the occupier's alterations (~4y)
  lean_years: 78,        // famine: neglect scars fade fastest (~1.5y)
});

/** Calamity stamp type → scar kind (default calamity_scar). */
/** @type {ReadonlyArray<{ kind: string, re: RegExp }>} */
const CAL_SCAR_RULES = Object.freeze([
  { kind: 'burn_lots', re: /fire|blaze|conflagration/i },
  { kind: 'plague_quarter', re: /plague|pestilence|pox|sickness|epidemic/i },
  { kind: 'flood_line', re: /flood|deluge|storm|tide/i },
  { kind: 'rubble_field', re: /earthquake|quake|tremor|collapse/i },
]);
/** @param {string} type @returns {string} */
function scarKindOf(type) {
  for (const { kind, re } of CAL_SCAR_RULES) if (re.test(type)) return kind;
  return 'calamity_scar';
}
/** Calamity scar severity: institutions ruined (k) + the human toll. */
/** @param {FabCalStamp} stamp @returns {number} */
function calamitySeverity(stamp) {
  const toll = Math.max(0, num(stamp.deaths, 0)) + Math.max(0, num(stamp.exodus, 0));
  return clamp01(0.35 + 0.1 * Math.max(0, num(stamp.k, 0)) + toll / 800);
}

// ── The weeks-anchored decay (exponential half-life over elapsed weeks) ───────
/** @param {number} v @param {number} deltaWeeks @param {number} halfLife @returns {number} */
function decayed(v, deltaWeeks, halfLife) {
  if (!(v > 0)) return 0;
  if (!(deltaWeeks > 0)) return v;
  return v * Math.pow(0.5, deltaWeeks / Math.max(1, halfLife));
}

// ── Durable-signal reads (all pure over the freshest settlement + worldState) ──
/** The per-class deposit rates (per week) for a settlement this advance.
 *  @param {FabSettlement} s @param {string} sid
 *  @param {Record<string, unknown>} worldState @returns {Map<string, number>} */
function depositRatesFor(s, sid, worldState) {
  const R = FABRIC_DEPOSIT_RATES;
  /** @type {Map<string, number>} */
  const rates = new Map();
  const add = (/** @type {string|null} */ cls, /** @type {number} */ rate) => {
    if (!cls || !(rate > 0)) return;
    rates.set(cls, (rates.get(cls) || 0) + rate);
  };

  // 1. RULING POWER — the regime deposit (the transition machinery: a fallen
  //    guild simply stops depositing; its stone decays while the successor's grows).
  const governing = governingFactionOf(/** @type {Parameters<typeof governingFactionOf>[0]} */ (/** @type {unknown} */ (s)));
  if (governing) add(districtClassOf(/** @type {Record<string, unknown>} */ (/** @type {unknown} */ (governing))) || 'civic', R.RULING);

  // 2. INSTITUTION STANDING — each ACTIVE institution deposits into its class
  //    (ruined/collapsed stone deposits nothing; standing is the signal).
  /** @type {Map<string, number>} */
  const perClassCount = new Map();
  const insts = Array.isArray(s?.institutions) ? s.institutions : [];
  for (const inst of insts) {
    if (String(inst?.status || 'active') !== 'active') continue;
    const cls = districtClassOf(/** @type {Record<string, unknown>} */ (/** @type {unknown} */ (inst)));
    if (!cls) continue;
    perClassCount.set(cls, (perClassCount.get(cls) || 0) + 1);
  }
  for (const [cls, count] of perClassCount) {
    add(cls, R.INSTITUTION * Math.min(count, R.INSTITUTION_CAP_PER_CLASS));
  }

  // 3. DOMINANT FAITH — the patron's adherent share (religion layer dark ⇒ 0;
  //    standing temples still deposit via #2).
  const religionStates = asObject(asObject(worldState).religionStates);
  const rel = asObject(religionStates[sid]);
  const patronRef = typeof rel.patronRef === 'string' ? rel.patronRef : '';
  if (patronRef) {
    const share = num(asObject(asObject(rel.deities)[patronRef]).share, 0);
    add('religious', R.FAITH * clamp01(share / 100));
  }

  // 4. INCOME SOURCES — classified livelihoods (extramural ones build nothing).
  const eco = asObject(s?.economicState);
  const sources = Array.isArray(eco.incomeSources) ? eco.incomeSources : [];
  const base = String(asObject(s?.config).economicBase || '');
  /** @type {Map<string, number>} */
  const incomeCount = new Map();
  for (const src of [...sources, base]) {
    const text = typeof src === 'string' ? src : String(asObject(src).name || '');
    if (!text) continue;
    for (const { cls, re } of INCOME_CLASS_RULES) {
      if (!re.test(text)) continue;
      incomeCount.set(cls, (incomeCount.get(cls) || 0) + 1);
      break;
    }
  }
  for (const [cls, count] of incomeCount) {
    add(cls, R.INCOME * Math.min(count, R.INCOME_CAP_PER_CLASS));
  }

  // 5. TRADE VOLUME — the M6d windowed throughput (dark ⇒ 0) + earned entrepôt.
  const tradeFlow = asObject(getSpatialLedger(worldState, 'tradeFlow'));
  const flow = asObject(tradeFlow[sid]);
  const throughput = Math.max(0, num(flow.in, 0)) + Math.max(0, num(flow.out, 0));
  if (throughput > 0) add('merchant', R.TRADE * clamp01(throughput / FABRIC_TUNING.TRADE_FLOW_SAT));
  const entrepots = asObject(getSpatialLedger(worldState, 'entrepots'));
  const centrality = clamp01(num(asObject(entrepots[sid]).centrality, 0));
  if (eco.isEntrepot === true || centrality > 0) add('foreign', R.ENTREPOT * Math.max(centrality, eco.isEntrepot === true ? 1 : 0));

  // 6. POPULATION BAND — bigger towns lay more residential fabric.
  const tier = typeof s?.tier === 'string' && TIER_ORDER.includes(s.tier) ? s.tier : popToTier(num(s?.population, 0));
  const tierRank = Math.max(0, TIER_ORDER.indexOf(tier));
  add('residential', R.POPULATION * (tierRank / Math.max(1, TIER_ORDER.length - 1)));

  // 7. FOOD DISPARITY — want breeds the shadow quarter (deficit ∪ live famine).
  const deficit01 = clamp01(num(asObject(eco.foodSecurity).deficitPct, 0) / 100);
  const stressors = Array.isArray(asObject(worldState).stressors) ? /** @type {unknown[]} */ (asObject(worldState).stressors) : [];
  const disparity01 = famineFor(/** @type {Parameters<typeof famineFor>[0]} */ (stressors), sid) ? 1 : deficit01;
  if (disparity01 > 0) add('criminal', R.DISPARITY * disparity01);

  return rates;
}

// ── Record normalization (defensive reads of the persisted shape) ─────────────
/** @param {unknown} v @param {number} tick @param {number} weeks @returns {FabRecord} */
function normalizeRecord(v, tick, weeks) {
  const o = asObject(v);
  /** @type {Record<string, FabStock>} */
  const stocks = {};
  const rawStocks = asObject(o.stocks);
  for (const cls of Object.keys(rawStocks)) {
    const st = asObject(rawStocks[cls]);
    const value = num(st.v, 0);
    if (!(value > 0)) continue;
    stocks[cls] = { v: value, since: num(st.since, weeks), last: num(st.last, weeks) };
  }
  /** @type {Record<string, FabScar>} */
  const scars = {};
  const rawScars = asObject(o.scars);
  for (const kind of Object.keys(rawScars)) {
    const sc = asObject(rawScars[kind]);
    const sev = num(sc.sev, 0);
    if (!(sev > 0)) continue;
    scars[kind] = { sev, tick: Math.floor(num(sc.tick, tick)), week: num(sc.week, weeks) };
  }
  const rebirthsRaw = Array.isArray(o.rebirths) ? o.rebirths : [];
  /** @type {FabRebirth[]} */
  const rebirths = rebirthsRaw.map((r) => {
    const rr = asObject(r);
    const classes = Array.isArray(rr.classes) ? rr.classes.filter((c) => typeof c === 'string').map(String) : [];
    return { classes, tick: Math.floor(num(rr.tick, 0)), type: String(rr.type || ''), week: num(rr.week, 0) };
  }).slice(-FABRIC_TUNING.REBIRTH_CAP);
  return {
    drift: clamp01(num(o.drift, 0.5)),
    led: typeof o.led === 'string' ? o.led : '',
    rebirths,
    scars,
    seenTick: Math.floor(num(o.seenTick, tick)),
    stocks,
    week: num(o.week, weeks),
  };
}

/** The dominant class of a stock map (argmax over v, floor-gated, codepoint tiebreak),
 *  or null. @param {Record<string, FabStock>} stocks @returns {string|null} */
function leaderOf(stocks) {
  let best = null;
  let bestV = 0;
  for (const cls of Object.keys(stocks).sort(compareCodepoint)) {
    const v = num(stocks[cls]?.v, 0);
    if (v >= FABRIC_TUNING.LEAD_FLOOR && v > bestV) { best = cls; bestV = v; }
  }
  return best;
}

/** Codepoint-sorted persisted record (byte-stable serialization).
 *  @param {FabRecord} rec @returns {Record<string, unknown>} */
function sortedRecord(rec) {
  /** @type {Record<string, FabStock>} */
  const stocks = {};
  for (const cls of Object.keys(rec.stocks).sort(compareCodepoint)) stocks[cls] = rec.stocks[cls];
  /** @type {Record<string, FabScar>} */
  const scars = {};
  for (const kind of Object.keys(rec.scars).sort(compareCodepoint)) scars[kind] = rec.scars[kind];
  return {
    drift: rec.drift,
    led: rec.led,
    rebirths: rec.rebirths,
    scars,
    seenTick: rec.seenTick,
    stocks,
    week: rec.week,
  };
}

// ── THE READ MODEL (engine-side; the display reads the mirror via fabricRead) ──
/**
 * The fabric record for a settlement id, normalized, or null when absent/dark.
 * EXPORTED for the pins + the dossier seam.
 * @param {{ spatialLedgers?: unknown }|null|undefined} worldState @param {string} sid
 * @returns {FabRecord|null}
 */
export function fabricRecordOf(worldState, sid) {
  const ledger = asObject(getSpatialLedger(/** @type {Record<string,unknown>} */ (worldState), 'urbanFabric'));
  const raw = ledger[String(sid)];
  if (raw == null) return null;
  return normalizeRecord(raw, 0, 0);
}

/** The compact settlement mirror for a record (the read-model projection #38
 *  consumes via townMap/fabricRead.js). Prominence normalized to 0..1.
 *  @param {FabRecord} rec @returns {Record<string, unknown>} */
function mirrorOf(rec) {
  /** @type {Record<string, number>} */
  const stocks = {};
  for (const cls of Object.keys(rec.stocks).sort(compareCodepoint)) {
    stocks[cls] = round4(clamp01(rec.stocks[cls].v / FABRIC_TUNING.STOCK_MAX));
  }
  const scars = Object.keys(rec.scars).sort(compareCodepoint).map((kind) => ({
    kind, severity: round4(rec.scars[kind].sev), week: rec.scars[kind].week,
  }));
  const rebirths = rec.rebirths.slice(-3).map((r) => ({ classes: r.classes, type: r.type, week: r.week }));
  return { drift: rec.drift, rebirths, scars, stocks };
}

// ── The advance ───────────────────────────────────────────────────────────────
/**
 * @typedef {Object} UrbanFabricAdvanceResult
 * @property {FabUpdate[]} settlementUpdates
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 */

/**
 * Advance the fabric layer one pulse. DORMANT (flag absent) ⇒ a complete no-op
 * (byte-identical). Lit ⇒ per settlement: decay stocks/scars over the elapsed
 * weeks, deposit this advance's durable signals, integrate the alignment drift,
 * mint scars from fresh stressor outcomes, execute catastrophe rebirths (the one
 * fast path), project the mirror, and narrate dominance turns + rebirths.
 * Deterministic; NO rng (deposits are reads). Codepoint-sorted throughout.
 * @param {Object} args
 * @param {FabSnapshot} args.snapshot
 * @param {Record<string, unknown>} args.worldState
 * @param {FabUpdate[]} args.settlementUpdates
 * @param {number} args.tick
 * @param {string|null} args.now
 * @returns {UrbanFabricAdvanceResult}
 */
export function advanceUrbanFabric({ snapshot, worldState, settlementUpdates, tick, now }) {
  const updates = Array.isArray(settlementUpdates) ? settlementUpdates : [];
  // ── DORMANCY GATE: the flag absent ⇒ an immediate no-op. No key, no mirror. ──
  if (!urbanFabricActive(worldState)) {
    return { worldState, settlementUpdates: updates, changed: false, newsEntries: [] };
  }

  const T = FABRIC_TUNING;
  const now2 = Math.max(0, Math.floor(num(tick, 0)));
  const weeks = num(asObject(asObject(worldState).calendar).elapsedWeeks, now2);
  const items = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  const itemById = new Map(items.map((it) => [String(it.id), it]));

  /** @type {Map<string, number>} */
  const updateIndex = new Map();
  updates.forEach((u, i) => updateIndex.set(String(u.saveId), i));
  const freshSettlement = (/** @type {string} */ id) => {
    const ui = updateIndex.get(String(id));
    if (ui !== undefined) return updates[ui]?.settlement;
    return itemById.get(String(id))?.settlement;
  };

  const priorLedger = asObject(getSpatialLedger(worldState, 'urbanFabric'));
  /** @type {Record<string, FabRecord>} */
  const nextLedger = {};
  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];

  const orderedIds = items.map((it) => String(it.id)).sort(compareCodepoint);

  // ── PASS 1: per live settlement — decay, deposit, drift, scar, rebirth. ──
  for (const sid of orderedIds) {
    const s = freshSettlement(sid);
    if (!s) continue;
    const item = itemById.get(sid);
    const townName = String(item?.name || s.name || sid);
    const hadPrior = Object.prototype.hasOwnProperty.call(priorLedger, sid);
    const prior = hadPrior ? normalizeRecord(priorLedger[sid], now2, weeks) : null;
    // The CALLED leader (persisted) — hysteresis holds across advances, so an
    // uncalled turn is still narrated later, once the margin is finally cleared.
    const priorLeader = prior && prior.led ? prior.led : null;
    const deltaWeeks = prior ? Math.max(0, weeks - prior.week) : T.FIRST_SIGHT_WEEKS;
    const prevSeenTick = prior ? prior.seenTick : now2 - 1;

    // Decay stocks over the elapsed weeks, then integrate this advance's deposits.
    /** @type {Record<string, FabStock>} */
    const stocks = {};
    if (prior) {
      for (const cls of Object.keys(prior.stocks)) {
        const st = prior.stocks[cls];
        const v = decayed(st.v, weeks - prior.week, T.STOCK_HALF_LIFE_WEEKS);
        if (v >= T.PRUNE_EPSILON) stocks[cls] = { v, since: st.since, last: st.last };
      }
    }
    const rates = depositRatesFor(s, sid, worldState);
    for (const cls of [...rates.keys()].sort(compareCodepoint)) {
      const dep = (rates.get(cls) || 0) * deltaWeeks;
      if (!(dep > 0)) continue;
      const st = stocks[cls];
      stocks[cls] = {
        v: clamp((st ? st.v : 0) + dep, 0, T.STOCK_MAX),
        since: st ? st.since : weeks,
        last: weeks,
      };
    }

    // ALIGNMENT DRIFT — new fabric's chaos-grain integrates toward the live
    // climate (1 − lawfulness01); a record born under a climate starts ON it.
    const align = settlementAlignment(
      /** @type {Parameters<typeof settlementAlignment>[0]} */ (/** @type {unknown} */ ({ id: sid, settlement: s })),
      /** @type {Parameters<typeof settlementAlignment>[1]} */ (/** @type {unknown} */ (worldState)),
    );
    const target = clamp01(1 - num(align.lawfulness01, 0.5));
    const drift = prior
      ? target + (prior.drift - target) * Math.pow(0.5, Math.max(0, weeks - prior.week) / T.DRIFT_HALF_LIFE_WEEKS)
      : target;

    // SCARS — decay each kind on its own masonry clock, then mint/refresh from
    // this advance's fresh outcomes.
    /** @type {Record<string, FabScar>} */
    const scars = {};
    if (prior) {
      for (const kind of Object.keys(prior.scars)) {
        const sc = prior.scars[kind];
        const sev = round4(decayed(sc.sev, weeks - prior.week, num(SCAR_HALF_LIFE_WEEKS[kind], 130)));
        if (sev >= T.SCAR_PRUNE_EPSILON) scars[kind] = { sev, tick: sc.tick, week: sc.week };
      }
    }
    const mintScar = (/** @type {string} */ kind, /** @type {number} */ sev) => {
      const existing = scars[kind];
      if (existing && existing.sev >= sev) return;
      scars[kind] = { sev: round4(clamp01(sev)), tick: now2, week: weeks };
    };

    // Fresh calamity stamps (tick high-water mark — the freshness cursor).
    const hist = Array.isArray(s.calamityHistory) ? s.calamityHistory : [];
    /** @type {FabCalStamp[]} */
    const freshStamps = [];
    for (const st of hist) {
      const stTick = num(st?.tick, -Infinity);
      if (Number.isFinite(stTick) && stTick > prevSeenTick && stTick <= now2) freshStamps.push(st);
    }
    for (const stamp of freshStamps) {
      mintScar(scarKindOf(String(stamp.type || '')), calamitySeverity(stamp));
    }

    // Lifted sieges/occupations + live famine (condition/stressor outcomes).
    const conds = Array.isArray(asObject(s).activeConditions) ? /** @type {Array<{archetype?: string}>} */ (asObject(s).activeConditions) : [];
    if (conds.some((c) => c?.archetype === 'siege_lifted')) mintScar('siege_repairs', T.SCAR_SIEGE_SEV);
    if (conds.some((c) => c?.archetype === 'occupation_lifted')) mintScar('occupation_marks', T.SCAR_OCCUPATION_SEV);
    const stressors = Array.isArray(asObject(worldState).stressors) ? /** @type {unknown[]} */ (asObject(worldState).stressors) : [];
    if (famineFor(/** @type {Parameters<typeof famineFor>[0]} */ (stressors), sid)) mintScar('lean_years', T.SCAR_FAMINE_SEV);

    // CATASTROPHE — the one fast path. A fresh stamp whose toll clears the floor
    // RESETS its struck classes' stocks (targets classified; a town-wide toll
    // with no classifiable targets razes all) + a rebirth marker.
    let rebirths = prior ? prior.rebirths : [];
    for (const stamp of freshStamps) {
      const toll = Math.max(0, num(stamp.deaths, 0)) + Math.max(0, num(stamp.exodus, 0));
      if (toll < T.REBIRTH_TOLL_FLOOR) continue;
      const targets = Array.isArray(stamp.targets) ? stamp.targets : [];
      /** @type {Set<string>} */
      const classSet = new Set();
      for (const t of targets) {
        const cls = districtClassOf(typeof t === 'string' ? t : null);
        if (cls) classSet.add(cls);
      }
      const classes = [...classSet].sort(compareCodepoint);
      const townWide = classes.length === 0 && toll >= T.REBIRTH_TOWNWIDE_TOLL;
      const struck = townWide ? Object.keys(stocks).sort(compareCodepoint) : classes;
      if (struck.length === 0) continue;
      for (const cls of struck) delete stocks[cls];
      rebirths = [...rebirths, { classes: /** @type {string[]} */ (classes), tick: now2, type: String(stamp.type || 'calamity'), week: weeks }]
        .slice(-T.REBIRTH_CAP);
      newsEntries.push(fabricNews(sid, townName, 'rebirth', {
        classes: struck, type: String(stamp.type || 'calamity'),
      }, now2, now));
    }

    // Round for byte-stable persistence.
    for (const cls of Object.keys(stocks)) stocks[cls] = { ...stocks[cls], v: round4(stocks[cls].v) };

    // Narrate the dominance turn (the major transition) — hysteresis-gated. A
    // turn is only CALLED past the margin — below it the incumbent's crown holds
    // (the stocks carry the race; the chronicle speaks on margin). The CALLED
    // leader persists (`led`), so an uncalled turn still narrates later, once
    // the margin is finally cleared.
    let led = priorLeader || '';
    const nextLeader = leaderOf(stocks);
    if (nextLeader && nextLeader !== priorLeader) {
      const incumbent = priorLeader && stocks[priorLeader] ? stocks[priorLeader].v : 0;
      const risen = stocks[nextLeader].v;
      if (!priorLeader || risen >= incumbent * T.TURN_MARGIN) {
        led = nextLeader;
        newsEntries.push(fabricNews(sid, townName, priorLeader ? 'turn' : 'rise', {
          from: priorLeader || null, to: nextLeader,
        }, now2, now));
      }
    }

    /** @type {FabRecord} */
    const rec = {
      drift: round4(clamp01(drift)),
      led,
      rebirths,
      scars,
      seenTick: now2,
      stocks,
      week: weeks,
    };
    nextLedger[sid] = rec;
  }

  // ── PASS 2: orphan records (settlement gone from the snapshot) — decay on the
  // base clocks; DROP the record once its stocks and scars are both spent
  // (markers alone never hold a dead settlement's record — the size governor). ──
  for (const sid of Object.keys(priorLedger).sort(compareCodepoint)) {
    if (nextLedger[sid]) continue;
    const prior = normalizeRecord(priorLedger[sid], now2, weeks);
    const dw = Math.max(0, weeks - prior.week);
    /** @type {Record<string, FabStock>} */
    const stocks = {};
    for (const cls of Object.keys(prior.stocks)) {
      const v = decayed(prior.stocks[cls].v, dw, T.STOCK_HALF_LIFE_WEEKS);
      if (v >= T.PRUNE_EPSILON) stocks[cls] = { ...prior.stocks[cls], v: round4(v) };
    }
    /** @type {Record<string, FabScar>} */
    const scars = {};
    for (const kind of Object.keys(prior.scars)) {
      const sev = decayed(prior.scars[kind].sev, dw, num(SCAR_HALF_LIFE_WEEKS[kind], 130));
      if (sev >= T.SCAR_PRUNE_EPSILON) scars[kind] = { ...prior.scars[kind], sev: round4(sev) };
    }
    if (Object.keys(stocks).length === 0 && Object.keys(scars).length === 0) continue;
    nextLedger[sid] = { ...prior, stocks, scars, week: weeks };
  }

  // ── PASS 3: mirror the read model onto the roster (self-healing projection). ──
  let nextUpdates = updates;
  let cloned = false;
  for (const sid of orderedIds) {
    const ui = updateIndex.get(sid);
    if (ui === undefined) continue;
    const s = freshSettlement(sid);
    if (!s) continue;
    const rec = nextLedger[sid];
    const desired = rec ? mirrorOf(rec) : null;
    const current = asObject(s).urbanFabric;
    const same = JSON.stringify(current ?? null) === JSON.stringify(desired ?? null);
    if (same) continue;
    if (!cloned) { nextUpdates = updates.slice(); cloned = true; }
    if (desired == null) {
      const { urbanFabric: _drop, ...rest } = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (s));
      nextUpdates[ui] = { ...nextUpdates[ui], settlement: /** @type {FabSettlement} */ (rest) };
    } else {
      nextUpdates[ui] = { ...nextUpdates[ui], settlement: { ...s, urbanFabric: desired } };
    }
  }

  // ── PERSIST (drop-when-empty). Nothing changed ⇒ byte-identical. ──
  /** @type {Record<string, unknown>} */
  const persisted = {};
  for (const sid of Object.keys(nextLedger).sort(compareCodepoint)) {
    persisted[sid] = sortedRecord(nextLedger[sid]);
  }
  let nextWorldState = worldState;
  let changed = cloned;
  const prevSerialized = JSON.stringify(Object.keys(priorLedger).length ? priorLedger : null);
  const nextSerialized = JSON.stringify(Object.keys(persisted).length ? persisted : null);
  if (prevSerialized !== nextSerialized) {
    nextWorldState = Object.keys(persisted).length
      ? setSpatialLedger(worldState, 'urbanFabric', persisted)
      : dropSpatialLedger(worldState, 'urbanFabric');
    changed = true;
  }
  if (newsEntries.length) changed = true;

  return { settlementUpdates: nextUpdates, worldState: nextWorldState, changed, newsEntries };
}

// ── THE PULSE SEAM — growth + fabric composed (the ceiling-safe name swap) ────
/**
 * The growth mover composed with the fabric mover: growth first (people), then
 * fabric (stone) over growth's outputs — the fabric reads the fully-settled
 * tick, LAST of the per-settlement movers. pulseKernel calls THIS in place of
 * advanceNpcGrowth (a name swap on the existing import/call — zero new
 * effective lines in the ceiling'd file; the provenanceKernel idiom). Either
 * layer dark ⇒ that layer is an exact no-op inside the composition.
 * @param {Object} args
 * @param {FabSnapshot} args.snapshot
 * @param {Record<string, unknown>} args.worldState
 * @param {FabUpdate[]} args.settlementUpdates
 * @param {{ edges?: unknown[] }|null|undefined} args.graph
 * @param {number} args.tick
 * @param {string|null} args.now
 * @returns {UrbanFabricAdvanceResult}
 */
export function advanceNpcGrowthWithFabric({ snapshot, worldState, settlementUpdates, graph, tick, now }) {
  const growth = advanceNpcGrowth({
    snapshot: /** @type {Parameters<typeof advanceNpcGrowth>[0]['snapshot']} */ (/** @type {unknown} */ (snapshot)),
    worldState, settlementUpdates, graph, tick, now,
  });
  const fabric = advanceUrbanFabric({
    snapshot,
    worldState: growth.worldState,
    settlementUpdates: /** @type {FabUpdate[]} */ (/** @type {unknown} */ (growth.settlementUpdates)),
    tick, now,
  });
  return {
    worldState: fabric.worldState,
    settlementUpdates: fabric.settlementUpdates,
    changed: growth.changed || fabric.changed,
    newsEntries: [...growth.newsEntries, ...fabric.newsEntries],
  };
}

// ── The fabric beat (house voice) ─────────────────────────────────────────────
/**
 * The urban-fabric transition beat — a settlement's stone turned (a quarter rose
 * to prominence, the dominant fabric changed hands, or a catastrophe rebirthed
 * struck quarters). AGGREGATE of durable outcomes projected onto the town's
 * fabric — never a named soul's fate.
 * @param {string} sid @param {string} townName
 * @param {'rise'|'turn'|'rebirth'} kind
 * @param {{ from?: string|null, to?: string, classes?: string[], type?: string }} detail
 * @param {number} tick @param {string|null} now
 * @returns {Record<string, unknown>}
 */
function fabricNews(sid, townName, kind, detail, tick, now) {
  let headline;
  let summary;
  let reason;
  let slug;
  if (kind === 'rebirth') {
    const classes = Array.isArray(detail.classes) && detail.classes.length ? detail.classes.join(', ') : 'its stricken';
    headline = `${townName} rebuilds from catastrophe`;
    summary = `The ${detail.type || 'calamity'} has unmade whole quarters of ${townName}; the ${classes} fabric is cleared and rises anew — the one fast change stone permits.`;
    reason = 'A catastrophe reset the struck district stocks and stamped a rebirth marker — buildings resist rapid change EXCEPT catastrophe and rebirth (the fabric law).';
    slug = `rebirth.${(detail.classes || []).join('_') || 'townwide'}`;
  } else if (kind === 'turn') {
    headline = `The face of ${townName} is turning`;
    summary = `Stone answers slowly, but it answers: the ${detail.to} quarter now overshadows the old ${detail.from} fabric of ${townName}, whose prominence lingers even as it fades.`;
    reason = 'The dominant district class changed hands — the old stock decays on the masonry clock while the new deposits; never a flip.';
    slug = `turn.${detail.from}.${detail.to}`;
  } else {
    headline = `The ${detail.to} quarter rises in ${townName}`;
    summary = `Years of steady patronage have told in stone: the ${detail.to} quarter of ${townName} has risen to prominence.`;
    reason = 'A district class crossed the prominence floor with no prior incumbent — the first fabric dominance.';
    slug = `rise.${detail.to}`;
  }
  return {
    id: `wizard_news.${tick}.urban_fabric.${sid}.${slug}`,
    tick, createdAt: now, scope: 'local', significance: 'notable', severity: 0.3, score: 46,
    headline,
    summary,
    kind: 'applied', impactKind: 'urban_fabric', channelType: 'settlement',
    settlementIds: [sid], impactIds: [], channelIds: [],
    sourceEventId: `urban_fabric.${sid}.${slug}.${tick}`,
    tags: ['world_pulse', 'urban_fabric', kind],
    reasons: [reason],
  };
}
