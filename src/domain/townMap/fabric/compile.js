/**
 * domain/townMap/fabric/compile.js — §15.1 THE SPATIAL COMPILATION RECORD.
 *
 * ⭐⭐ "BETWEEN DOSSIER AND GEOMETRY, ONE NORMALIZATION PASS COMPILES THE RELEVANT FACTS
 * INTO EXPLICIT TYPED CONSTRAINTS — geometry reads the record, never raw simulation
 * records repeatedly." (§15.1, from the peer review.)
 *
 * ⛔ THE DEFECT IT REMOVES IS A REAL ONE IN THIS FAMILY, MEASURED BY GREP, not a
 * hypothetical: at MF-B1b the string `settlement.config.tradeRouteAccess` was read in
 * FOUR modules (`substrate.routeContract`, `waterMode.deriveWaterMode`,
 * `substrate.forcedConstraints`, and the fjord fixture), each with its own lower-casing and
 * its own default. `settlement.population` was read in six. Every one of those is a place a
 * future field rename half-lands, and every one is a place two modules can quietly disagree
 * about the same fact. The atlas and the premise machinery already do this normalization
 * for INSTITUTIONS; §15.1 generalizes it to the whole spatial derivation.
 *
 * ⭐ WHAT A CONSTRAINT IS HERE. Not a preference and not a hint: a TYPED, NAMED fact with
 * a stated SOURCE and a stated CONFIDENCE, in the peer review's own vocabulary —
 * `requires-navigable-water`, `wall-built-year-N`, `two-population-peaks`,
 * `principal-trade-bearing`. Each row carries:
 *   key         the constraint's name, from a closed vocabulary
 *   value       its typed value
 *   source      the dossier path it came from, or 'derived', or 'default'
 *   confidence  'canon' (the dossier states it) | 'derived' (this pass computed it)
 *             | 'default' (nothing said, and the degradation law applied)
 * A geometry stage that wants a fact asks the record; a fact the record does not carry is
 * a fact the geometry may not use.
 *
 * ⚠ THIS PASS ADDS NO NEW ENGINE READS. Every field below was already being read somewhere
 * in the fabric; the pass moves the reading, it does not widen the seam. That is deliberate:
 * §15.1 is a plumbing law, and a plumbing change that also grew the contract would be two
 * changes wearing one name.
 *
 * PURITY: pure reads and arithmetic. No draws, no Date, no Math.random.
 */

import { compareKeys } from './lineage.js';
import { tierScale } from './tierGrammar.js';

/**
 * THE CLOSED CONSTRAINT VOCABULARY. A key not in this list cannot be compiled, which is
 * what makes the record a contract rather than a bag. Each entry states what the constraint
 * MEANS to geometry, because a name without a consumer is decoration (§8.2).
 * @type {Readonly<Record<string, string>>}
 */
export const CONSTRAINT_KINDS = Object.freeze({
  'population-current': 'souls now — occupancy, roof count, life',
  'population-high-water': 'the largest population this deriver can SEE — built extent, wall circuit, rung',
  'population-peaks': 'how many distinct maxima the visible trajectory carries — §161g ruin rings',
  'tier-occupancy': 'the tier the current population implies',
  'tier-extent': 'the tier the high water implies — the streets a town has',
  'requires-navigable-water': 'the dossier asserts a port or a landing: the geometry MUST reach water',
  'water-kind': "the landed model's own answer: river | coast | null",
  'principal-trade-bearing': 'which frame edge the main route leaves by, or null where no canon exists',
  'route-arterial-count': 'how many regional corridors the trade access earns',
  'wall-present': 'defenseProfile says there is a circuit',
  'wall-built-year': 'the derived VINTAGE of the main circuit (§161m, MF-R2) — the fabric it traced against',
  'fire-years': 'dated burn events, by quarter where the record names one — §15.7 grain dating',
  'landform-family': 'the §5.-1c solver\'s answer after forced-fact reconciliation',
  'forced-facts': 'the constraint set the dossier asserted, in sorted order',
  'strained-facts': 'the forced facts the winning landform could NOT hold — rendered as work',
  'food-economy': 'what this settlement eats by: tillage | fish | trade — drives §161a field demand',
  'prosperity-rank': "the engine's own PROSPERITY_TIERS vocabulary, ranked 0..5",
  'civic-order': 'the lawfulness dial, 0..1 — §161m logistical satisfaction weight',
});

/**
 * @typedef {Object} Constraint
 * @property {string} key
 * @property {any} value
 * @property {string} source
 * @property {'canon'|'derived'|'default'} confidence
 */

/**
 * @typedef {Object} SpatialRecord
 * @property {Map<string, Constraint>} rows
 * @property {(key:string, fallback?:any) => any} get
 * @property {(key:string) => Constraint|null} row
 * @property {(key:string) => boolean} isCanon
 * @property {Constraint[]} all
 * @property {string[]} defaulted   every constraint that fell back — the degradation ledger
 */

/**
 * Compile the record.
 *
 * @param {any} settlement
 * @param {any} model                 the landed buildTownMapModel output
 * @param {{ routeLedger?: any }} [options]
 * @returns {SpatialRecord}
 */
export function compileSpatialRecord(settlement, model, options = {}) {
  const s = settlement || {};
  /** @type {Map<string, Constraint>} */ const rows = new Map();
  /** @type {string[]} */ const defaulted = [];
  const put = (key, value, source, confidence) => {
    if (!CONSTRAINT_KINDS[key]) {
      // A key outside the vocabulary is a programming error, and it fails LOUDLY rather
      // than becoming an untyped row nothing can consume.
      throw new Error(`compileSpatialRecord: '${key}' is not in CONSTRAINT_KINDS`);
    }
    rows.set(key, { key, value, source, confidence });
    if (confidence === 'default') defaulted.push(key);
  };

  // ── POPULATION AND TIER. One read, one home.
  const population = Number.isFinite(s.population) ? Number(s.population) : 0;
  const scale = tierScale(s);
  put('population-current', population, 'settlement.population',
    Number.isFinite(s.population) ? 'canon' : 'default');
  put('population-high-water', scale.highWater.population,
    scale.highWater.evidence.length ? scale.highWater.evidence.join('; ') : 'no history visible',
    scale.highWater.evidence.length ? 'derived' : 'default');
  put('tier-occupancy', scale.tier, 'popToTier(population)', 'derived');
  put('tier-extent', scale.extentTier, 'the high-water law', 'derived');

  // ⭐ TWO POPULATION PEAKS — the peer review's own example, and it is exactly the signal
  // §161g's re-promotion grammar needs: a settlement that fell and rose again threads NEW
  // fabric through OLD ruins, which is a different drawing from one that only fell.
  const history = Array.isArray(s.populationHistory) ? s.populationHistory : [];
  const peaks = countPeaks(history.map((h) => Number((h && h.population) || 0)));
  put('population-peaks', peaks,
    history.length ? `populationHistory (${history.length} entries — the ring caps at 11)` : 'absent',
    history.length ? 'derived' : 'default');

  // ── WATER. The one-decider rule: the landed model says WHETHER.
  const waterKind = model && model.frame && model.frame.water ? model.frame.water.kind : null;
  put('water-kind', waterKind, 'model.frame.water.kind (siteGenesis)', waterKind ? 'canon' : 'default');
  const access = String((s.config && s.config.tradeRouteAccess) || '').toLowerCase();
  const needsWater = /port|river|harbou?r/.test(access);
  put('requires-navigable-water', needsWater,
    access ? `config.tradeRouteAccess '${access}'` : 'unstated', access ? 'canon' : 'default');

  // ── ROUTES.
  put('route-arterial-count', arterialCount(access), `config.tradeRouteAccess '${access || 'unstated'}'`,
    access ? 'canon' : 'default');
  // ⚠ THE BEARING IS null UNLESS A CAMPAIGN CANON SUPPLIES ONE, and that null is the whole
  // point of the row. §2.4's correction is on the record at 6b337fb1: the landed model
  // fills road directions with evenly-spaced compass slots, so a bearing read from there is
  // SEEDED FURNITURE presented as survey. The record refuses to launder it: where the dress
  // channel carries a true neighbour bearing it is 'canon', and otherwise the row is null
  // and every consumer knows to seed its own and DECLARE that it did.
  const ledger = options.routeLedger || null;
  const bearing = ledger && Number.isFinite(ledger.principalBearing) ? ledger.principalBearing : null;
  put('principal-trade-bearing', bearing,
    bearing == null ? 'no campaign route ledger — seeded corridors, DECLARED' : 'route-network ledger (campaign canon)',
    bearing == null ? 'default' : 'canon');

  // ── THE CIRCUIT.
  const hasWalls = !!(model && model.meta && model.meta.hasWalls);
  put('wall-present', hasWalls, 'model.meta.hasWalls (defenseProfile)', 'canon');
  // ⭐ THE VINTAGE (§161m, MF-R2): no wall-construction event or date exists anywhere at
  // head, so the build year DERIVES from the reconstructed extent trajectory — the year the
  // high-water extent first earned this circuit's economy band. It UNDERSTATES where the
  // window does not reach and is never invented.
  put('wall-built-year', hasWalls ? deriveWallVintage(s, scale) : null,
    'derived from the extent trajectory (no construction event exists at head)',
    hasWalls ? 'derived' : 'default');

  // ── FIRE YEARS (§15.7's second path-dependence pin).
  const fires = readFireYears(s);
  put('fire-years', fires,
    fires.length ? 'settlement.eventLog / fabricScars burn records' : 'no burn record',
    fires.length ? 'canon' : 'default');

  // ── LANDFORM. Compiled from the model's terrain; the solver itself runs in substrate.js
  // and its ANSWER is what lands here, so nothing downstream re-solves.
  const terrain = (model && model.meta && model.meta.terrain) || 'plains';
  put('landform-family', terrain, 'model.meta.terrain (resolveTerrain)', 'canon');

  // ── THE FOOD ECONOMY (§161a's demand input).
  const food = readFoodEconomy(s, waterKind, access);
  put('food-economy', food.kind, food.source, food.confidence);

  const prosperity = String((s.economicState && s.economicState.prosperity) || '');
  put('prosperity-rank', PROSPERITY_RANK[prosperity] == null ? 2 : PROSPERITY_RANK[prosperity],
    prosperity ? `economicState.prosperity '${prosperity}'` : 'unstated',
    prosperity ? 'canon' : 'default');

  const all = [...rows.values()].sort((a, b) => compareKeys(a.key, b.key));
  return {
    rows,
    all,
    defaulted: defaulted.slice().sort(compareKeys),
    get(key, fallback) { const r = rows.get(key); return r ? r.value : fallback; },
    row(key) { return rows.get(key) || null; },
    isCanon(key) { const r = rows.get(key); return !!r && r.confidence === 'canon'; },
  };
}

/** The engine's own prosperity vocabulary — never FTG's squalid→aristocratic (§8.2). */
const PROSPERITY_RANK = Object.freeze({
  Destitute: 0, Poor: 1, Struggling: 1, Moderate: 2,
  Comfortable: 3, Prosperous: 4, Wealthy: 5, Thriving: 5,
});

/** tradeRouteAccess → how many REGIONAL arterials cross this leaf. Mirrors the substrate's
 * ROUTE_GROUND road count, which is the same fact seen from the settlement's side. */
function arterialCount(access) {
  if (/critical|crossroads|major|excellent/.test(access)) return 3;
  if (/good|port|river|moderate|road/.test(access)) return 2;
  return 1;
}

/**
 * How many distinct PEAKS a trajectory carries. A peak is a value strictly greater than
 * both its neighbours; the ends count when they exceed their single neighbour. Two peaks
 * means the settlement fell and rose — §161g's re-promotion grammar.
 */
export function countPeaks(series) {
  if (!series || series.length < 2) return series && series.length ? 1 : 0;
  let n = 0;
  for (let i = 0; i < series.length; i++) {
    const prev = i > 0 ? series[i - 1] : -Infinity;
    const next = i < series.length - 1 ? series[i + 1] : -Infinity;
    if (series[i] > prev && series[i] > next) n++;
  }
  return n;
}

/**
 * ⭐ THE WALL VINTAGE (§161m, MF-R2's derivation), and it is the input to §15.7's first
 * path-dependence pin: the wall traces against the fabric of its BUILD YEAR.
 *
 * No construction event or date exists at head, so the year derives from the settlement's
 * own age and the point in its life at which the extent first earned a circuit. A circuit
 * is earned when the settlement reaches TOWN scale — below that §5's table says "never
 * walled" as the prior and a wall is a truth override, not an economy.
 *
 * ⚠ IT UNDERSTATES. Where the founding age is unrecorded the vintage is the earliest the
 * record can defend, never a year invented to make the drawing more interesting.
 */
export function deriveWallVintage(settlement, scale) {
  const s = settlement || {};
  const founding = s.history && s.history.founding ? s.history.founding : null;
  const age = founding && Number.isFinite(founding.age) ? Math.trunc(founding.age) : null;
  if (age == null) return { year: null, ageAtBuild: null, source: 'no founding age recorded — vintage UNDERSTATED as unknown' };
  // The circuit is built when the settlement first reached the extent that could pay for
  // it. Growth is treated as monotone to the high water (the only shape the record can
  // defend), so the fraction of its life at which it crossed the town threshold is the
  // fraction of the town population over the high water.
  const TOWN_FLOOR = 901;
  const peak = Math.max(1, scale.highWater.population);
  const crossed = Math.min(1, TOWN_FLOOR / peak);
  const ageAtBuild = Math.round(age * crossed);
  return {
    year: age - ageAtBuild,             // years before the present, counting back
    ageAtBuild,
    source: `derived: ${age}y old, crossed the circuit-economy threshold at ${ageAtBuild}y`,
  };
}

/** Dated burn records, sorted. §7's history channel: fabricScars first, eventLog as the
 * supplementary source where the mirror is dark. */
export function readFireYears(settlement) {
  const s = settlement || {};
  /** @type {Array<{ year:number, quarter:string|null }>} */ const out = [];
  const scars = Array.isArray(s.fabricScars) ? s.fabricScars : [];
  for (const sc of scars) {
    if (sc && /fire|burn/i.test(String(sc.kind || sc.type || '')) && Number.isFinite(sc.year)) {
      out.push({ year: Math.trunc(sc.year), quarter: sc.districtId ? String(sc.districtId) : null });
    }
  }
  const log = Array.isArray(s.eventLog) ? s.eventLog : [];
  for (const e of log) {
    if (e && /fire|burn|conflagration/i.test(String(e.type || e.kind || e.summary || '')) && Number.isFinite(e.year)) {
      out.push({ year: Math.trunc(e.year), quarter: e.districtId ? String(e.districtId) : null });
    }
  }
  out.sort((a, b) => (a.year - b.year) || compareKeys(String(a.quarter), String(b.quarter)));
  return out;
}

/**
 * What this settlement eats by. §161a's demand input, and the row that makes a fjord's
 * low arable share READ as a fact rather than as a rendering shortfall.
 */
export function readFoodEconomy(settlement, waterKind, access) {
  const s = settlement || {};
  const eco = s.economicState || {};
  const words = [eco.tradeCommodity, eco.primaryIndustry, eco.economicBase]
    .filter((v) => typeof v === 'string' && v).map((v) => v.toLowerCase()).sort();
  const joined = words.join(' ');
  if (/fish|whal|seal/.test(joined)) return { kind: 'fish', source: `economicState '${joined}'`, confidence: 'canon' };
  if (/grain|wheat|corn|livestock|wool|farm/.test(joined)) return { kind: 'tillage', source: `economicState '${joined}'`, confidence: 'canon' };
  if (/trade|merchant|caravan|spice|silk/.test(joined) || /port|crossroads|major/.test(access)) {
    return { kind: 'trade', source: joined ? `economicState '${joined}'` : `tradeRouteAccess '${access}'`, confidence: joined ? 'canon' : 'derived' };
  }
  if (waterKind === 'coast') return { kind: 'fish', source: 'coastal site with no stated commodity', confidence: 'derived' };
  return { kind: 'tillage', source: 'no commodity stated — the default a landlocked settlement lives by', confidence: 'default' };
}
