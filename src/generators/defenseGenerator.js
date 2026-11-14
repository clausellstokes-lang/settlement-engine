/**
 * defenseGenerator.js — DEFENCE AS THE SUM OF ITS PARTS (COHERENCE-UPKEEP-5, V3 with the chair's
 * R13 and R14; the spec is docs/chair/2026-11-13/UPKEEP-DEFENCE-PARTS.md, section (b) and the
 * addendum; the reference is the probe's `parts.mjs :: itemise(settlement, keep, 'V4', months)`).
 *
 * The owner (2026-11-13): "I want defensibility to be derived from all of the supporting
 * contributions that prosperity sets the scale to in some. All of those add up to a score that
 * shows how defensible a place is."
 *
 * So readiness is a LIST OF PARTS, and the readiness score is their sum. Each part is in readiness
 * points: its points on the five scores (military, monsters, order, supply, magic) divided by the
 * number of scores the world has. Groups: BUILT (what stands), STANDS (who defends), SUSTAINS (what
 * keeps the force going), GROUND (the place itself, its size and its dangers), AGAINST (crime),
 * and LIMIT (the rules that hold a part, and each score's fullness). The parts are listed with
 * their points rounded to tenths, and the tenths sum EXACTLY to `readiness.score`, which is in whole
 * points, the figure the page prints (a LIMIT line carries the rounding; COHERENCE-UPKEEP-6).
 *
 * ONE SCALE, ONE LABEL. Pay reads `keep`, the STANDING label's keep (`keepOfRecord`, the label with
 * no crisis in force, R3): paid parts keep `floor + (1 - floor) × funded` per score, bought parts
 * keep `bought`, the stores are laid by at the standing share by their own writer, and magic keeps
 * `0.45 + 0.55 × funded` (R5). A crisis acts ONCE: it takes today's points from the parts it
 * touches, pro rata and no more than they hold — supply points from SUSTAINS (the famine sparing
 * the stores it already ate at their writer), military, order and monster points from STANDS. It
 * never acts through a label it capped, never multiplies the whole and never caps anything.
 *
 * THE RULES, in the reference's order: the traditions count 35 at most against monsters and a
 * hired-only place reads no more than the same place with a watch (R2); unmanned walls count half
 * (limit 2); the crises; the martial will held to the armed bodies that carry it (R13, only where
 * something is built or standing); what sustains held to the force (limit 1); each score full at
 * 100 or brought to 0 (R1, fullness last); readiness held to its scale.
 *
 * EVERY NUMBER lives in `src/data/defenceWeights.js :: DEFENCE_TUNING` (tests/lint/
 * defenceDerived.walker.test.js reds a numeric literal here other than the structural 0, 1, 2, 5,
 * 10 and 100). Every institution NAME question is the roster's defence home's
 * (`defenseInstitutionBuckets.js`). Nothing here draws, and nothing reads a stored defence value:
 * the profile is DERIVED from the record (tests/generators/defenceParts.test.js, the proof).
 */

import { getInstFlags, getPriorities } from './helpers.js';
import { computeEffectiveMagicPresence, neighbourMilitaryFactorOf } from './priorityHelpers.js';
import { hasTradeRouteConnection } from '../domain/tradeRouteSemantics.js';
import { partitionDefenseInstitutions, defenseTraditionNamesOf, defenseWallOf, defenceHeldOf } from '../domain/institutions/defenseInstitutionBuckets.js';
import { resolveGenerationWorldLaw } from './generationContext.js';
import { readinessBandOf } from '../data/bandLadders.js';
import { deriveMagicReliance } from '../domain/magicReliance.js';
import { keepOf, keepOfRecord, fundedGate } from '../domain/facts/keep.js';
import { DEFENCE_TUNING as W, DEFENCE_WORDS, WATCH_IN_STEAD } from '../data/defenceWeights.js';
import { houseRungsOf, jobRungAtTier } from '../domain/institutions/houseScale.js';
import { isFabricInstitution } from '../data/institutionalCatalog.js';

// ─── getDefenseInstitutions ───────────────────────────────────────────────────
/**
 * Partition institution list into defense-relevant groups: a one-line delegation to the roster's
 * defence home (`src/domain/institutions/defenseInstitutionBuckets.js`), its one writer. RUIN-BLIND
 * on purpose: `defenseProfile.institutions` is a generation-time record of what the town built; a
 * consumer that needs what the town can field TODAY reads `standingDefenseForces(settlement)`.
 * @param {Array} institutions
 * @returns {{ walls, garrison, militia, watch, mercenary, charter, magicDef }}
 */
const getDefenseInstitutions = (institutions) =>
  /** @type {any} */ (partitionDefenseInstitutions(institutions));

/** The five scores, in the reference's order; magic is counted only in a world with magic. */
const SCORE_KEYS = Object.freeze(['mil', 'mon', 'int', 'sup', 'mag']);
const SCORE_NAMES = Object.freeze({ mil: 'military', mon: 'monster', int: 'internal', sup: 'economic', mag: 'magical' });
/** What each crisis's points touch: supply from SUSTAINS, the rest from STANDS. */
const TOUCHES = Object.freeze({ sup: 'SUSTAINS', mil: 'STANDS', int: 'STANDS', mon: 'STANDS' });
/** The armed bodies: who mans a wall (R7) and who carries the martial will (R13). */
const ARMED = new Set(['garrison', 'militia', 'watch', 'company', 'charter', 'households', 'wardens']);
/** The small places (thorp, hamlet, village): the tiers the community's own defence is written for. */
const SMALL = W.community.arms;

/**
 * THE PARTS A HOUSE'S SCALE REACHES (UPKEEP-CAPACITY C1, the chair's ruling B), each with the opener it is read by
 * below, asked of one house alone: its flags and its tradition names. Walls keep their kind, arcane its own tower
 * and guild rows; the community rows, the crisis reliefs, the stores, the purse, the will and the ground take none.
 * @type {Readonly<Record<string, (inst: any, names: Readonly<Record<string, boolean>>) => boolean>>}
 */
const SCALED_PARTS = Object.freeze({
  garrison: (i) => i.hasGarrison, militia: (i) => i.hasMilitia, watch: (i) => i.hasWatch, court: (i) => i.hasCourtSystem,
  prison: (i) => i.hasPrison, wardens: (_, n) => n.wardens, company: (i) => i.hasMercenary, charter: (i) => i.hasCharterHall,
  clergy: (_, n) => n.divine, druids: (_, n) => n.druid, market: (i) => i.hasMarket, hospital: (i) => i.hasHospital,
  alchemists: (_, n) => n.alchemy,
});
/**
 * THE HOUSES THAT STAND IN THE PLACE (UPKEEP-CAPACITY C4, the chair's G3): the roster without its fabric rows. A fabric
 * row is the place, not a house (`institutionalCatalog.js :: isFabricInstitution`): "Access to parish church" is the walk
 * to another village's church, with no house, no power and no seat, so it opens no clergy part and no rung of the
 * clergy's ladder. The traditions' names are read over these alone; the small place's parish row (`hasChurch`, the
 * rallying point) still reads the whole roster.
 * @param {ReadonlyArray<unknown>} list
 */
const housedOf = (list) => list.filter((i) => !isFabricInstitution(/** @type {any} */ (i)));
/** The scaled parts one house opens, alone (the one `jobsOf` the house-scale reader is handed). @param {unknown} house */
const scaledPartsOfHouse = (house) => {
  const one = [house];
  const { inst } = getInstFlags({}, one);
  const names = defenseTraditionNamesOf(housedOf(one));
  return Object.keys(SCALED_PARTS).filter((id) => SCALED_PARTS[id](inst, names));
};

/** The months laid by → supply points, on diminishing returns (0..max). @param {number} months */
const storesPointsOf = (months) => {
  const S = W.stores;
  const atOne = S.firstMonth;
  const atSix = atOne + (S.sixMonths - 1) * S.toSixMonths;
  return Math.min(S.max, Math.round(months <= 1 ? months * S.firstMonth
    : months <= S.sixMonths ? atOne + (months - 1) * S.toSixMonths
      : atSix + (months - S.sixMonths) * S.afterSix));
};

/**
 * The crises, as today's code writes them: per crisis, the points it takes from each score, with
 * today's relief by faith, druids, arcana and alchemy. In the reference's order.
 * @param {(k: string) => boolean} has @param {any} t traditions @param {number} magPri
 * @returns {Array<[string, Record<string, number>]>}
 */
const crisisPointsOf = (has, t, magPri) => {
  /** @type {Record<string, Record<string, number>>} */
  const C = W.crises;
  /** @type {Array<[string, Record<string, number>]>} */
  const out = [];
  if (has('under_siege')) {
    const c = C.under_siege; let e = c.sup, i = c.int;
    // UPKEEP-MEASURE-2 X3: each relief is its own (a teleport circle eases supply, a guild eases order); one never
    // takes the other's away, so adding the circle to a guild town never raises what the siege takes from order.
    if (t.hasArcane && magPri >= c.teleportFrom && t.hasTeleport) e = Math.round(e * c.teleportEco);
    if (t.hasArcaneGuild && magPri >= c.guildFrom) i = Math.round(i * c.guildInt);
    if (t.hasDivineStrong) i = Math.round(i * c.strongInt);
    if (t.hasDruid && magPri >= c.druidFrom) e = Math.round(e * c.druidEco);
    out.push(['under_siege', { sup: e, int: i }]);
  }
  if (has('famine')) {
    const c = C.famine; let e = c.sup, m = c.mil, mo = c.mon; const i = c.int;
    if (t.hasDruid && magPri >= c.druidFrom) { e = Math.round(e * c.druidEco); m = Math.round(m * c.druidMil); mo = Math.round(mo * c.druidMon); }
    if (t.hasDivine) { e = Math.min(e, c.divineEco); m = Math.min(m, c.divineMil); }
    if (t.hasArcane && magPri >= c.arcaneFrom) e = Math.min(e, c.arcaneEco);
    if (t.hasAlchemy) e = Math.max(0, e - c.alchemyEco);
    out.push(['famine', { sup: e, mil: m, int: i, mon: mo }]);
  }
  if (has('occupied')) out.push(['occupied', { mil: C.occupied.mil, int: C.occupied.int }]);
  if (has('plague_onset')) {
    const c = C.plague_onset; let m = c.mil, e = c.sup;
    if (t.hasDivine) { m = Math.round(m * c.divineMil); e = Math.round(e * c.divineEco); }
    if (t.hasAlchemy) { m = Math.min(m, c.alchemyMil); e = Math.min(e, c.alchemyEco); }
    if (t.hasArcane && magPri >= c.arcaneFrom) m = Math.min(m, c.arcaneMil);
    out.push(['plague_onset', { mil: m, sup: e }]);
  }
  if (has('succession_void')) out.push(['succession_void', { mil: C.succession_void.mil, int: C.succession_void.int }]);
  if (has('politically_fractured')) out.push(['politically_fractured', { int: C.politically_fractured.int }]);
  if (has('recently_betrayed')) out.push(['recently_betrayed', { int: C.recently_betrayed.int, mil: C.recently_betrayed.mil }]);
  if (has('indebted')) out.push(['indebted', { sup: C.indebted.sup, mil: C.indebted.mil }]);
  if (has('infiltrated')) out.push(['infiltrated', { int: C.infiltrated.int, mil: C.infiltrated.mil }]);
  if (has('monster_pressure')) {
    const c = C.monster_pressure; let mo = c.mon;
    if (t.hasArcane && magPri >= c.arcaneFrom) mo = Math.round(mo * c.arcaneMon);
    if (t.hasDivine) mo = Math.round(mo * c.divineMon);
    if (t.hasDruid) mo = Math.round(mo * c.druidMon);
    out.push(['monster_pressure', { mon: mo, mil: c.mil }]);
  }
  // War drains (COHERENCE-UPKEEP-6, C: the chair's R16): men, grain and coin go to the army, so wartime takes
  // supply from what sustains the town; who stands and what is built it leaves alone (a supply point
  // touches SUSTAINS only). Last, so every crisis before it takes what it took before.
  if (has('wartime')) out.push(['wartime', { sup: C.wartime.sup }]);
  return out;
};

/**
 * The supply chains' readings: the garrison's provisions, the masons, the contract force and the
 * food processing. A military chain counts as healthy when it is operational/running, OR it is
 * vulnerable ONLY because its upstream is absent or strained and the place can provision by trade
 * (an isolated place cannot import, so there a missing upstream keeps the penalty).
 * @param {any} settlement @param {any} config
 */
const chainsOf = (settlement, config) => {
  const byId = Object.fromEntries((settlement.economicState?.activeChains || []).map((c) => [c.chainId, c]));
  const canProvision = hasTradeRouteConnection(config.tradeRouteAccess || settlement.tradeRoute || 'road');
  /** @param {any} c */
  const healthy = (c) => !!c && (c.status === 'operational' || c.status === 'running'
    || (c.status === 'vulnerable' && !c.dependency && !c.substituteActive && canProvision
      && ((c.upstreamMissing && c.upstreamMissing.length) || (c.upstreamWeak && c.upstreamWeak.length))));
  const g = byId.garrison, f = byId.fortification, fp = byId.food_processing;
  const C = W.chains;
  return {
    garrison: g ? (healthy(g) ? C.provisioned : (g.status === 'vulnerable' || g.status === 'impaired') ? C.unprovisioned : 0) : 0,
    fortification: f ? (healthy(f) ? C.masons : f.status === 'impaired' ? C.unmended : 0) : 0,
    contract: healthy(byId.mercenary),
    food: fp ? (fp.status === 'impaired' ? C.foodBroken : C.foodWorking) : 0,
  };
};

/**
 * Round a list of exact values to tenths so the tenths sum EXACTLY to `target` tenths (largest
 * remainder: each value moves by less than a tenth, ties to the earlier line).
 * @param {number[]} values @param {number} target integer tenths @returns {number[]} integer tenths
 */
const apportionTenths = (values, target) => {
  const scaled = values.map((v) => v * 10);
  const out = scaled.map((v) => Math.floor(v));
  let left = target - out.reduce((a, v) => a + v, 0);
  const order = scaled.map((v, i) => [v - out[i], i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  for (let k = 0; left > 0 && order.length; k = (k + 1) % order.length, left -= 1) out[order[k][1]] += 1;
  for (let k = order.length - 1; left < 0 && order.length; k = (k + order.length - 1) % order.length, left += 1) out[order[k][1]] -= 1;
  return out;
};

/** Tenths of a readiness point, as a number. @param {number} v */
const tenths = (v) => Math.round(v * 10) / 10;

// ─── computeDefenseScores ─────────────────────────────────────────────────────
/**
 * THE PARTS, and what they sum to (the reference's `itemise`, V4, with R2's hired-only rule run on
 * the product's own parts). Pure in the record and `keep`. `instead` replaces the roster's flags:
 * the counterfactual of R2 is THIS place, run through this same code, with a watch in its hired
 * force's stead.
 * @param {any} settlement @param {{ bought: number, funded: number }} keep @param {any} [instead]
 */
const computeDefenseScores = (settlement, keep, instead = null) => {
  const config = settlement.config || {};
  const institutions = settlement.institutions || [];
  const stressTypes = settlement.stress
    ? (Array.isArray(settlement.stress) ? settlement.stress : [settlement.stress]).map((s) => s?.type).filter(Boolean)
    : (config.stressTypes || config.intendedStressTypes || []);
  const stressSet = new Set(stressTypes);
  const flags = getInstFlags(config, institutions);
  const inst = instead || flags.inst;
  const pri = getPriorities(config);
  const tier = settlement.tier || 'town';
  const threat = config.monsterThreat || 'frontier';
  const route = config.tradeRouteAccess || 'road';
  const worldLaw = resolveGenerationWorldLaw(null, config);
  const magicOn = worldLaw.magicEnabled;
  const magicExists = config.magicExists !== false;
  const magPri = magicOn ? pri.magic : 0;
  const relPri = pri.religion;
  // Crime: the reading before the stress multiplier, then each crisis in force by its table row's `crime`
  // (COHERENCE-UPKEEP-6, the chair's ruling 3: every effect of a crisis on a defence score is a row of the one
  // crisis table; wartime has none). Floor and scale as the reading's own: 2 at least, 100 at most.
  /** @type {Array<[string, { crime: number }]>} */
  const crimeRows = /** @type {any} */ (Object.entries(W.crises).filter(([k, row]) => stressSet.has(k) && Object.hasOwn(row, 'crime')));
  const crimeOf = (/** @type {Array<[string, any]>} */ list) => Math.max(2, Math.min(100, list.reduce((a, [, row]) => a * row.crime, flags.criminalPreStress)));
  const crimEff = Math.round(crimeOf(crimeRows));
  const crimBase = Math.round(crimeOf([]));
  const names = defenseTraditionNamesOf(housedOf(institutions));
  const G = W.traditionGates;
  const t = {
    // UPKEEP-CAPACITY C6 (the chair's G5): the alchemist's shop and quarter are a trade, not retained casters, so the
    // arcane opener is the roster's casters alone (the defence home's `arcane` names, which hold every magic house of the
    // roster flags but the alchemist's); `hasMagicInst` itself is unchanged (other generators read it).
    hasArcane: magicOn && magPri >= G.arcane && names.arcane,
    hasArcaneGuild: magicOn && magPri >= G.arcaneGuild && names.arcaneGuild,
    hasDivine: magicOn && relPri >= G.divine && (names.divine || (relPri >= G.divineShrine && names.divineShrine)),
    hasDivineStrong: magicOn && relPri >= G.divineStrong && names.divineStrong,
    hasDruid: magicOn && magPri >= G.druid && names.druid,
    hasWardens: names.wardens,
    hasAlchemy: magicOn && magPri >= G.alchemy && names.alchemy,
    hasTower: names.tower,
    hasTeleport: names.teleport,
  };
  const isSmall = Object.hasOwn(SMALL, tier);
  const K = W.community;
  const c = { isolation: 0, arms: 0, churchMil: 0, churchInt: 0, elderMil: 0, elderInt: 0, close: 0 };
  if (isSmall) {
    c.isolation = Object.hasOwn(K.remoteness, route) ? K.remoteness[route] : K.remoteness.other;
    c.arms = K.arms[tier];
    c.close = K.close[tier];
    if (inst.hasChurch) { c.churchInt = K.parishInt; c.churchMil = K.parishMil; }
    if (names.elders) { c.elderInt = K.eldersInt; c.elderMil = K.eldersMil; }
  }
  // A small place has magical defence only where a magic house actually stands. The presence reads the WHOLE roster
  // (COHERENCE-UPKEEP-7, the chair's ruling W1: reading A withdrawn). The magic presence is the whole of the Magical
  // Capability score, and no named house feeds that score through a second part: a magic house stands in two roles,
  // force or craft (its named part) and magic (this one), each feeding scores of its own (count once, the design's
  // law: no house feeds ONE score through two parts; tests/generators/magicCountOnce.test.js).
  const hasActualMagic = inst.hasMagicInst || t.hasDruid || t.hasArcane || names.actualMagic;
  const presence = magicOn && !(isSmall && !hasActualMagic)
    ? computeEffectiveMagicPresence(institutions, { ...config, nearbyResources: config.nearbyResources || [] }).score
    : null;
  const chains = chainsOf(settlement, config);
  const terrainType = config.terrainType || 'plains';
  const terrain = Object.hasOwn(W.terrain, terrainType) ? W.terrain[terrainType] : 1;
  const fs = settlement.economicState?.foodSecurity;

  /** @type {any[]} */
  const parts = [];
  // A HOUSE'S SCALE (UPKEEP-CAPACITY C1, the chair's ruling B): a scaled part's weights × its greatest house's factor,
  // `least + (greatest - least) × (rung - 1) / (of - 1)` on that house's own ladder (a one-rung ladder 1), read from
  // the catalogue's ladder by `houseScale.js :: houseRungsOf`. Read once, when a scaled part is first added.
  /** @type {Record<string, Array<{ rung: number, of: number }>> | null} */
  let rungs = null;
  /** @param {string} id @returns {number} */
  const scaleOf = (id) => {
    if (!Object.hasOwn(SCALED_PARTS, id)) return 1;
    rungs = rungs || houseRungsOf(institutions, scaledPartsOfHouse);
    const S = W.houseScale;
    // R2's counterfactual watch (a hired-only place with a watch in its stead) is the watch its own tier's ladder
    // writes: a village's Village watch, a town's Town watch, a city's Professional city watch (the chair's ruling).
    const on = instead && id === 'watch' ? [jobRungAtTier(id, tier, scaledPartsOfHouse)] : (rungs[id] || []);
    return on.length ? Math.max(...on.map(({ rung, of }) => (of > 1 ? S.least + (S.greatest - S.least) * (rung - 1) / (of - 1) : 1))) : 1;
  };
  /** @param {Record<string, number>} dims @param {string} [id] the part, for its house's scale */
  const clean = (dims, id) => {
    const f = id ? scaleOf(id) : 1;
    return Object.fromEntries(Object.entries(dims).filter(([, v]) => v).map(([d, v]) => [d, v * f]));
  };
  /** A part kept at a share of its full points. @param {string} group @param {string} id @param {any} dims */
  const add = (group, id, dims, share = 1, extra = {}) => {
    const raw = clean(dims, id);
    if (!Object.keys(raw).length) return;
    parts.push({ group, id, raw, dims: Object.fromEntries(Object.entries(raw).map(([d, v]) => [d, v * share])), ...extra });
  };
  /** @param {number} floor */
  const F = (floor) => fundedGate(floor, keep);
  /** A paid part: each score kept at its funded floor. @param {string} group @param {string} id @param {any} dims */
  const paid = (group, id, dims) => {
    const raw = clean(dims, id);
    parts.push({ group, id, raw, dims: Object.fromEntries(Object.entries(raw).map(([d, v]) => [d, v * F(W.floors[d])])) });
  };
  const A = W.arcane;
  const arcMon = t.hasArcane ? Math.round(A.mon + Math.min(A.monMax, (magPri - G.arcane) * A.monPerDial)) : 0;
  // R2: the three traditions together count at most 35 against monsters (one job, once). UPKEEP-MEASURE-2 X2: held on
  // the points they COUNT (each house's scale and the casters' pay already in), after the three are added below, so one
  // more tradition never lowers the beasts score (the weights' share left the scaled and paid points out).
  const tradF = 1;
  const hasStanding = inst.hasGarrison || inst.hasMilitia || inst.hasWatch;
  const hired = inst.hasMercenary || inst.hasCharterHall;
  const law = inst.hasCourtSystem || inst.hasPrison || inst.hasGarrison || inst.hasWatch;
  const bos = inst.hasWalls || hasStanding;

  // BUILT: what already stands. Prosperity does not scale it. The walls count by their kind, read from the
  // roster's defence home (COHERENCE-UPKEEP-6, B): stone at its full value, the other kinds less (`W.wallKind`).
  const wallKind = defenseWallOf(institutions).kind;
  const wallShare = wallKind && Object.hasOwn(W.wallKind, wallKind) ? W.wallKind[wallKind] : W.wallKind.stone;
  if (inst.hasWalls) add('BUILT', 'walls', Object.fromEntries(Object.entries(W.walls).map(([d, v]) => [d, v * wallShare])));
  const wallsPart = inst.hasWalls ? parts[parts.length - 1] : null;
  if (chains.fortification) add('BUILT', chains.fortification > 0 ? 'masons' : 'unmended', { mil: chains.fortification });
  // STANDS: who defends. Paid forces at the funded share of their own scores' floors.
  if (inst.hasGarrison) paid('STANDS', 'garrison', W.garrison);
  if (inst.hasMilitia) paid('STANDS', 'militia', W.militia);
  if (inst.hasWatch) paid('STANDS', 'watch', W.watch);
  if (inst.hasCourtSystem) paid('STANDS', 'court', W.court);
  if (inst.hasPrison) paid('STANDS', 'prison', W.prison);
  if (t.hasWardens) paid('STANDS', 'wardens', W.wardens);
  // The martial will: the base configuration's slider (R9) × the neighbour factor (R14). NOT A PAID PART
  // (COHERENCE-UPKEEP-6, the chair's ruling 5): base configuration, held to the armed bodies that carry it
  // (R13, below); pay reaches it only through that hold.
  const D = W.dial;
  const dial = pri.military * neighbourMilitaryFactorOf(config);
  if (bos) {
    add('STANDS', 'will', { mil: Math.round(dial * D.mil), int: Math.round(dial * (law ? D.int : D.intNoLaw)) });
  } else {
    // The hired branch is not paid either (COHERENCE-UPKEEP-7, the chair's ruling W3 on the fourth read's E-M1): the
    // hired body's extra will is the base configuration's; pay reaches it only through the hold (R13), on the hired
    // parts that are themselves paid.
    const rate = hired ? D.none + D.hiredExtra : D.none;
    add('STANDS', 'will', { mil: Math.round(dial * rate), int: Math.round(dial * (law ? D.int : D.intNoLaw)) });
  }
  if (inst.hasMercenary) add('STANDS', 'company', { mil: W.company.mil + (chains.contract ? W.company.contract : 0) }, keep.bought);
  if (inst.hasCharterHall) add('STANDS', 'charter', W.charter, keep.bought);
  add('STANDS', 'households', { mil: c.arms });
  add('STANDS', 'parish', { mil: c.churchMil, int: c.churchInt });
  add('STANDS', 'elders', { mil: c.elderMil, int: c.elderInt });
  // Count once: the criminal houses count in Crime alone, with no bonus for their absence.
  add('STANDS', 'close', { int: c.close });
  // STANDS, the practitioners: arcane force is retained (paid); divine and druid force is a vocation.
  if (t.hasArcane) {
    paid('STANDS', 'arcane', {
      mil: Math.round(A.mil + Math.min(A.milMax, (magPri - G.arcane) * A.milPerDial)) + (t.hasTower ? A.tower : 0) + (t.hasArcaneGuild ? A.guild : 0),
      mon: arcMon * tradF,
      int: magPri >= A.intFrom ? Math.min(A.intMax, Math.round((magPri - A.intFrom) * A.intPerDial)) : 0,
    });
  }
  const P = W.clergy;
  if (t.hasDivine) {
    add('STANDS', 'clergy', {
      mil: t.hasDivineStrong && relPri >= P.blessingFrom ? P.blessing : 0,
      mon: P.mon * tradF,
      int: relPri >= P.intFrom ? Math.min(P.intMax, Math.round((relPri - P.intFrom) * P.intPerDial)) : 0,
    });
  }
  if (t.hasDruid) add('STANDS', 'druids', { mon: W.druids.mon * tradF });
  {
    const trad = parts.filter((q) => q.id === 'arcane' || q.id === 'clergy' || q.id === 'druids');
    const mon = trad.reduce((a, q) => a + (q.dims.mon || 0), 0);
    if (mon > W.traditionsMonsterMax) {
      const k = W.traditionsMonsterMax / mon;
      for (const q of trad) if (q.dims.mon) { q.dims.mon *= k; q.raw.mon *= k; }
    }
  }
  // SUSTAINS: what keeps the force going. The stores were laid by at the standing share by their writer.
  const months = fs?.storageMonths ?? (inst.hasGranary ? W.stores.granaryMonths : W.stores.noGranaryMonths);
  add('SUSTAINS', 'stores', { sup: storesPointsOf(months) }, 1, { months: tenths(months) });
  if (t.hasAlchemy && inst.hasGranary) paid('SUSTAINS', 'alchemists', W.alchemists);
  if (inst.hasHospital) paid('SUSTAINS', 'hospital', W.hospital);
  if (inst.hasMarket) paid('SUSTAINS', 'market', W.market);
  add('SUSTAINS', 'purse', W.purse, keep.bought);
  if (chains.food) add('SUSTAINS', chains.food > 0 ? 'foodWorking' : 'foodBroken', { sup: chains.food });
  if (chains.garrison) add('SUSTAINS', chains.garrison > 0 ? 'provisioned' : 'unprovisioned', { mil: chains.garrison });
  // Magic keeps what is funded (R5); the temple, grove and guild stand as their own parts (count once).
  if (presence !== null) add('SUSTAINS', 'magic', { mag: presence }, F(W.floors.mag));
  // GROUND: the place itself.
  add('GROUND', 'remoteness', { mil: c.isolation });
  if (route === 'port' && worldLaw.supportsMaritime()) add('GROUND', 'sea', W.sea);
  if (route === 'crossroads') add('GROUND', 'crossroads', W.crossroads);
  add('GROUND', 'folk', { mon: Object.hasOwn(W.threat.folk, threat) ? W.threat.folk[threat] : 0 });
  if (threat === 'plagued') add('GROUND', 'plaguedCountry', { mon: W.threat.plaguedCountry });
  // AGAINST: crime works against order.
  if (crimEff) {
    add('AGAINST', 'crime', { int: -Math.round(crimEff * W.crime.int) });
    // The record shows each crisis's share of what it added to crime (its row's `crime` above one).
    const added = Math.round(crimEff * W.crime.int) - Math.round(crimBase * W.crime.int);
    const weight = crimeRows.reduce((a, [, row]) => a + Math.abs(row.crime - 1), 0);
    if (added && weight) parts[parts.length - 1].crisis = Object.fromEntries(crimeRows.map(([k, row]) => [k, added * Math.abs(row.crime - 1) / weight]));
  }
  // Terrain strengthens what is built and stands (its military points).
  if (terrain !== 1) {
    const base = parts.filter((p) => p.group === 'BUILT' || p.group === 'STANDS').reduce((a, p) => a + Math.max(0, p.dims.mil || 0), 0);
    add('GROUND', 'terrain', { mil: base * (terrain - 1) }, 1, { terrain: terrainType });
  }

  // Limit 2: walls with no armed body to man them count half.
  const manned = parts.some((p) => p.group === 'STANDS' && ARMED.has(p.id) && Object.values(p.dims).some((v) => v > 0));
  /** @type {Record<string, number> | null} */
  let wallsFull = null;
  if (wallsPart && !manned) {
    wallsFull = { ...wallsPart.dims };
    wallsPart.dims = Object.fromEntries(Object.entries(wallsPart.dims).map(([d, v]) => [d, v / 2]));
  }

  // CRISES: each takes today's points from the parts it touches, pro rata, no more than they hold.
  const crises = [];
  for (const [name, pts] of crisisPointsOf((k) => stressSet.has(k), t, magPri)) {
    /** @type {Record<string, number>} */
    const took = {};
    for (const [d, p] of Object.entries(pts)) {
      // The famine already ate the stores at their own writer (what is in hand): not twice.
      const hit = parts.filter((q) => TOUCHES[d] === q.group && (q.dims[d] || 0) > 0 && !(name === 'famine' && d === 'sup' && q.id === 'stores'));
      const hold = hit.reduce((a, q) => a + q.dims[d], 0);
      const take = Math.min(p, hold);
      for (const q of hit) {
        const cut = take * q.dims[d] / hold;
        q.dims[d] -= cut;
        q.crisis = q.crisis || {};
        q.crisis[name] = (q.crisis[name] || 0) + cut;
      }
      took[d] = take;
    }
    crises.push({ name, points: pts, took });
  }

  const n = SCORE_KEYS.filter((d) => d !== 'mag' || magicExists).length;
  /** @param {Record<string, number>} dims */
  const sumOf = (dims) => Object.entries(dims).reduce((a, [d, v]) => a + (d === 'mag' && !magicExists ? 0 : v), 0);

  // R13: the will counts for no more than the armed bodies that carry it, where something is built or standing.
  // UPKEEP-MEASURE-2 X1: SCORE BY SCORE: the will's points on each score count for no more than the armed bodies' points
  // on that score (its military to their military, its order to their order), so a will that rises on one score (a
  // court's law) never lowers it on another. X4: and never below the will the same place has with nothing built or
  // standing (the base configuration's own rate, unheld), so a wall never lowers the will.
  let willHeld = 0;
  if (bos) {
    const armedParts = parts.filter((q) => ARMED.has(q.id));
    const will = parts.find((q) => q.id === 'will');
    if (will) {
      const before = sumOf(will.dims);
      const unheld = { mil: Math.round(dial * (hired ? D.none + D.hiredExtra : D.none)), int: Math.round(dial * (law ? D.int : D.intNoLaw)) };
      for (const d of Object.keys(will.dims)) {
        const armedOn = armedParts.reduce((a, q) => a + Math.max(0, q.dims[d] || 0), 0);
        const floor = Math.min(will.dims[d], Object.hasOwn(unheld, d) ? /** @type {any} */ (unheld)[d] : 0);
        will.dims[d] = Math.max(floor, Math.min(will.dims[d], armedOn));
      }
      willHeld = (before - sumOf(will.dims)) / n;
    }
  }

  for (const p of parts) { p.points = sumOf(p.dims) / n; p.listed = p.points; } // `listed`: its points before limit 1, which is its own line
  /** @param {string} g */
  const groupSum = (g) => parts.filter((p) => p.group === g).reduce((a, p) => a + p.points, 0);
  const sustains = groupSum('SUSTAINS');
  const force = groupSum('STANDS');
  // Limit 1, SCORE BY SCORE (UPKEEP-13: the chair's ruling (1) on UPKEEP-MEASURE-2's P2): on each score, what sustains the force counts
  // for no more than the force (the force's whole points, on that score's scale); the sustaining parts of that ONE score
  // are held together, so a part on another score never lowers it. A part's negative points (provisions short, food
  // processing broken) are not sustaining: they count in full, never relieved by the hold.
  const forcePts = Math.max(0, force) * n;
  /** @type {Record<string, number>} */
  const sustPos = {};
  for (const d of SCORE_KEYS) {
    const on = parts.filter((q) => q.group === 'SUSTAINS' && (q.dims[d] || 0) > 0);
    const held = on.reduce((a, q) => a + q.dims[d], 0);
    const k = held > forcePts ? forcePts / held : 1;
    if (k < 1) for (const q of on) q.dims[d] *= k;
    sustPos[d] = held * k;
  }
  for (const q of parts) if (q.group === 'SUSTAINS') q.points = sumOf(q.dims) / n;
  let sustainsHeld = groupSum('SUSTAINS') - sustains;
  // R2 (the owner's rule; the lane writer's ruling of 2026-11-13): a hired-only place's military never reads
  // above the same place with a watch in its hired force's stead — that place's REAL military, run through
  // this same code (the pay, the terrain, the crises, R13's hold, limit 1). Where it would, the hired parts'
  // military is held, together, to the difference; and where that is not enough, the martial will's military
  // as well (UPKEEP-CAPACITY C0, the chair's ruling on the stop at C1): the will is held to the armed bodies'
  // whole points (R13), so a hired body's beasts and order points carry will a watch's do not, and since the will
  // on the hired branch went unpaid (befa936dc) that will alone could lift the place above its watch. The last
  // rule before fullness, as the cap was today's last word on the military.
  if (!instead && hired && !hasStanding) {
    const watchInStead = computeDefenseScores(settlement, keep, { ...inst, ...WATCH_IN_STEAD });
    const hiredParts = parts.filter((q) => q.id === 'company' || q.id === 'charter');
    const will = parts.find((q) => q.id === 'will');
    const milNow = parts.reduce((a, q) => a + (q.dims.mil || 0), 0);
    const hm = hiredParts.reduce((a, q) => a + Math.max(0, q.dims.mil || 0), 0);
    const wm = will ? Math.max(0, will.dims.mil || 0) : 0;
    const cf = watchInStead.dims.mil || 0;
    if (milNow > cf && hm + wm > 0) {
      const cut = Math.min(hm, milNow - cf);
      if (cut > 0) {
        for (const q of hiredParts) {
          q.dims.mil = (q.dims.mil || 0) * (1 - cut / hm);
          q.points = sumOf(q.dims) / n;
          q.listed = q.points;
        }
      }
      const willCut = Math.min(wm, milNow - cf - cut);
      if (will && willCut > 0) {
        will.dims.mil -= willCut;
        will.points = sumOf(will.dims) / n;
        will.listed = will.points;
      }
    }
  }
  /** @type {Record<string, number>} */
  const dims = {};
  for (const q of parts) for (const [d, v] of Object.entries(q.dims)) if (!(d === 'mag' && !magicExists)) dims[d] = (dims[d] || 0) + v;
  // R1: each score full at 100 (the rest held in reserve) and never below nothing.
  const full = Object.fromEntries(Object.entries(dims).map(([d, v]) => [d, Math.min(100, Math.max(0, v))]));
  const size = Object.hasOwn(W.size, tier) ? W.size[tier] : 0;
  const danger = Object.hasOwn(W.threat.penalty, threat) ? W.threat.penalty[threat] : 0;
  // P2's second hold: READINESS's sustaining total counts for no more than the force. The scores' sum (each full at 100)
  // is held to the same sum without what sustains, plus the force; both sides only rise when a house is added, so their
  // least only rises. It is carried on limit 1's own line (no new word).
  const fullSum = Object.values(full).reduce((a, v) => a + v, 0) / n;
  const bare = Object.entries(dims).reduce((a, [d, v]) => a + Math.min(100, Math.max(0, v - (sustPos[d] || 0))), 0) / n;
  const readinessHeld = Math.max(0, fullSum - (bare + Math.max(0, force)));
  sustainsHeld -= readinessHeld;
  const raw = fullSum - readinessHeld + size - danger;
  const total = Math.min(100, Math.max(0, raw));

  return { parts, crises, n, dims, full, size, danger, raw, total, willHeld, sustainsHeld, wallsFull, wallsPart,
    t, inst, hasStanding, hired, law, chains, magicExists };
};

/** One line of the list, as the record stores it. @param {string} id @param {string} group */
const lineOf = (id, group) => ({ id, group, label: DEFENCE_WORDS[id].label, source: DEFENCE_WORDS[id].source });

/**
 * The list the record stores: every part, then the lines that make the sum exact (size, threat,
 * the limits, each score's fullness, the scale's ends), with points in tenths that sum EXACTLY to
 * the readiness score. A part's `full` is its points before pay, the rules and the crises; its
 * `crisis` is what each crisis took from it; the will's `held` is what R13 took from it.
 * @param {ReturnType<typeof computeDefenseScores>} r
 */
const listOf = (r) => {
  const { parts, n } = r;
  /** @param {Record<string, number>} dims */
  const pointsOf = (dims) => Object.entries(dims).reduce((a, [d, v]) => a + (d === 'mag' && !r.magicExists ? 0 : v), 0) / n;
  const rows = [];
  for (const p of parts) {
    const line = /** @type {any} */ (lineOf(p.id, p.group));
    if (p.id === 'stores') line.label = `${line.label} (${p.months} months)`;
    if (p.id === 'terrain') line.label = `${line.label} (${p.terrain})`;
    line.full = tenths(pointsOf(p.raw));
    // The scores this part feeds, by name (count once is a law per score: COHERENCE-UPKEEP-7, ruling W1). Computed, never stored.
    line.feeds = Object.keys(p.raw).map((d) => /** @type {Record<string, string>} */ (SCORE_NAMES)[d]);
    if (p.crisis) line.crisis = Object.fromEntries(Object.entries(p.crisis).map(([k, v]) => [k, -tenths(v / n)]));
    if (p.id === 'will' && r.willHeld) line.held = -tenths(r.willHeld);
    rows.push({ exact: p === r.wallsPart && r.wallsFull ? pointsOf(r.wallsFull) : p.listed, line });
  }
  if (r.size) rows.push({ exact: r.size, line: lineOf('size', 'GROUND') });
  if (r.danger) rows.push({ exact: -r.danger, line: lineOf('danger', 'GROUND') });
  if (r.wallsFull) rows.push({ exact: r.wallsPart.points - pointsOf(r.wallsFull), line: lineOf('wallsUnmanned', 'LIMIT') });
  if (r.sustainsHeld) rows.push({ exact: r.sustainsHeld, line: lineOf('sustainsHeld', 'LIMIT') });
  for (const [d, v] of Object.entries(r.dims)) {
    if (v === r.full[d]) continue;
    const kind = v > r.full[d] ? 'full' : 'floor';
    const line = /** @type {any} */ (lineOf(kind, 'LIMIT'));
    line.id = `${kind}:${SCORE_NAMES[d]}`;
    line.label = `${DEFENCE_WORDS.scores[d]}: ${line.label}`;
    rows.push({ exact: (r.full[d] - v) / n, line });
  }
  if (r.raw > 100) rows.push({ exact: r.total - r.raw, line: lineOf('scaleTop', 'LIMIT') });
  if (r.raw < 0) rows.push({ exact: r.total - r.raw, line: lineOf('scaleBottom', 'LIMIT') });
  // The score is the figure the page prints: whole points, the exact sum rounded once (COHERENCE-UPKEEP-6, the
  // chair's ruling on the fifth seat's call 1: the band is read from the score as the page shows it). The
  // rounding is its own line, so every part keeps its own measure and the tenths still sum to the score.
  const score = Math.round(Math.round(r.total * 100) / 100); // UPKEEP-MEASURE-2 X9: read at hundredths first
  if (score !== r.total) rows.push({ exact: score - r.total, line: lineOf('rounding', 'LIMIT') });
  const target = score * 10;
  const shares = apportionTenths(rows.map((x) => x.exact), target);
  return { list: rows.map((x, i) => ({ ...x.line, points: shares[i] / 10 })), score: target / 10 };
};

// ─── generateDefenseProfile ───────────────────────────────────────────────────
/**
 * Assemble the complete defense profile for a settlement. Pure in the record and `upkeep`.
 *
 * @param {Object} settlement - Full settlement object
 * @param {{ bought: number, funded: number }} [upkeep] - the standing label's keep (`keepOfRecord`)
 * @returns {{ scores:any, readiness:any, institutions:any, magicDependency:boolean, traditions:Object, chainModifiers:Object, economicGates:Object }}
 */
export function generateDefenseProfile(settlement, upkeep = keepOf(undefined)) {
  const s = /** @type {any} */ (settlement);
  const r = computeDefenseScores(s, upkeep);
  const { score } = listOf(r);
  // ⛔ THE ONE RELIANCE READING (lane DEFENSE-2): `magicReliance.js :: deriveMagicReliance` at
  // relied-upon or integral, read over the assembled settlement.
  const { reading: magicReading } = deriveMagicReliance(s);
  const magicDependency = magicReading === 'relied-upon' || magicReading === 'integral';
  const traditions = {
    hasArcane: r.t.hasArcane, hasArcaneGuild: r.t.hasArcaneGuild, hasDivine: r.t.hasDivine, hasDruid: r.t.hasDruid, hasAlchemy: r.t.hasAlchemy,
  };

  // The funded gates, each `fundedGate(its floor, upkeep)`: ×1.0 = fully funded; below 1.0 the
  // dossier can say "underfunded garrison". Each floor is named for the gate it opens.
  const { mil: military, mon: monster, int: internal, sup: economic, disaster } = W.floors;
  const militaryGate = fundedGate(military, upkeep);
  const monsterGate = fundedGate(monster, upkeep);
  const internalGate = fundedGate(internal, upkeep);
  const economicGate = fundedGate(economic, upkeep);
  const disasterGate = fundedGate(disaster, upkeep);

  // Disasters & Famine: the response costs money (relief purchases, granary logistics, work
  // crews), so the row reads the food record's resilience at the funded disaster gate.
  const resilience = s.economicState?.foodSecurity?.resilienceScore;
  const disasterScore = Number.isFinite(resilience) ? Math.round(Math.max(0, Math.min(100, resilience)) * disasterGate) : undefined;

  /** @type {any} */
  const scores = {
    // Each score in whole points, the form the page has always shown (the owner, record 328: V3 changes values, not forms).
    // UPKEEP-MEASURE-2 X9: read at hundredths before the whole point, so a sum held at the same value (a hold's parts
    // re-scaled) never prints two figures through the float's last digit.
    ...Object.fromEntries(SCORE_KEYS.map((d) => [SCORE_NAMES[d], Math.round(Math.round((r.full[d] ?? 0) * 100) / 100)])),
    magicDependency, traditions, ...(disasterScore !== undefined ? { disaster: disasterScore } : {}),
  };

  // THE LABEL READS THE ROSTER (UPKEEP-12, ruling (a)): walls or a force are never "Undefended".
  const defenceInstitutions = getDefenseInstitutions(s.institutions || []);
  const band = readinessBandOf(score, defenceHeldOf(defenceInstitutions));
  const hasAnyDefense = r.inst.hasWalls || r.hasStanding || r.hired;
  return {
    scores,
    readiness: { score, label: band.label, color: band.color, background: band.background, border: band.border },
    institutions: defenceInstitutions,
    magicDependency,
    traditions,
    // Informational: the chains' own readings, each also a part in the list.
    chainModifiers: {
      military: r.chains.garrison + r.chains.fortification + (r.chains.contract ? Math.round(W.company.contract * upkeep.bought) : 0),
      economic: r.chains.food,
    },
    economicGates: {
      ...(hasAnyDefense ? { military: Math.round(militaryGate * 100) / 100 } : {}),
      monster: Math.round(monsterGate * 100) / 100,
      ...(r.law ? { internal: Math.round(internalGate * 100) / 100 } : {}),
      economic: Math.round(economicGate * 100) / 100,
      ...(disasterScore !== undefined ? { disaster: Math.round(disasterGate * 100) / 100 } : {}),
    },
    // ⛔ NO `parts` HERE (COHERENCE-UPKEEP-6, the chair's ruling 2 on REVIEW-UPKEEP-2): defence holds no
    // fact of its own, so the itemised parts are NOT stored — they are computed from the record on demand
    // by `defencePartsOf`, for the tests, the probes and the owner's eight towns. The stored profile keeps
    // the shape it had before this lane, so the world export carries no part.
  };
}

/**
 * THE ITEMISED PARTS, computed from the record (COHERENCE-UPKEEP-6, the chair's ruling 2): every part, its
 * group, its label, its source and its points in tenths, summing EXACTLY to `readiness.score`. Nothing
 * stores this; it is re-derived from the record each time, for the tests, the probes and the eight towns.
 * Pure in the record. `upkeep` defaults to the record's own standing keep, so the parts match the stored
 * profile; a caller measuring a counterfactual may pass another.
 * @param {Object} settlement @param {{ bought: number, funded: number }} [upkeep] the standing keep
 * @returns {any[]} the parts list
 */
export function defencePartsOf(settlement, upkeep) {
  const s = /** @type {any} */ (settlement);
  return listOf(computeDefenseScores(s, upkeep ?? keepOfRecord(s.economicState))).list;
}
