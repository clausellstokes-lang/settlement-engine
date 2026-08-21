/**
 * domain/townMap/fabric/stateMarks.js — §10 THE STATE EXPRESSIONS, in the mapDress idiom.
 *
 * §10.B: "TRUTH-LAYER MARKERS (placed, calm-ink, restrained)" — the besieger's camp at the
 * invested gate, barred gates, trampled fields, the plague's quarantine, ONE calm-ink
 * expression per stressor catalog key AT ITS TRUE ANCHOR.
 *
 * ⭐⭐ THE REGISTER LAW IS ABSOLUTE AND IT IS WHAT MAKES THIS MODULE SHORT. A siege is the
 * most dramatic thing that can happen to a town and the correct drawing of it is a row of
 * small tents on the road outside a gate. Nothing here is red, nothing is animated, nothing
 * shouts; the surveyor recorded what stood on the ground the day he drew it. A state mark
 * that makes the leaf look like an illustration of a disaster has failed even if the
 * derivation behind it is perfect.
 *
 * ⭐⭐ THE TOTALITY CENSUS IS OVER THE LIVE CATALOG, NOT OVER A COPY OF IT (§10's own clause:
 * "the compile owes a TOTALITY CENSUS: every key of the real stressor catalog enumerated and
 * ruled expressed-or-cut — no axis left undispositioned"). `STRESSOR_DISPOSITION` is checked
 * against the imported `STRESS_TYPE_MAP` by a walker, so a key added to the catalog reds this
 * module's pin instead of silently becoming an axis nothing rules. ⚠ MEASURED AT THIS BASE:
 * the catalog carries **15** keys, not the 21 the charter's §10 quotes from 6b337fb1 — the
 * charter's figure is STALE and the census is built on the live table so it cannot inherit
 * the staleness.
 *
 * ⛔ AND SIX KEYS ARE CUT BY NAME. §8.2 says an axis with no ground expression cannot
 * express; §10.D says a tick-scale or non-physical fact does not belong on a year-scale
 * document. A debt, a betrayal, an empty throne and a conversion are all real and none of
 * them is a thing standing in a street.
 *
 * PURITY: pure functions. No Date, no Math.random, no runtime trig, no Math.pow.
 */

import { hashUnit } from './fabricRng.js';
import { cosI, sinI, TRIG_N } from './fabricGeometry.js';
import { STRESS_TYPE_MAP } from '../../../data/stressTypes.js';
// ⚠ ONE NEW EDGE INTO THE ESTATE'S OWN DOMAIN LAYER, and it is deliberate: see
// `stressorKeysOf`. `canonicalAccessors.js` is a LEAF (no imports of its own) and is
// purity-clean, so the fabric layer stays acyclic and the purity scan is unaffected.
import { canonStressors } from '../../canonicalAccessors.js';

/**
 * ⭐ EVERY CATALOG KEY, RULED. `express` names the ONE calm-ink expression; `anchor` names
 * the TRUE anchor §10.14 demands; `cut` names why a key does not reach the ground.
 * A class row is permitted only where the class IS the expression and every member key is
 * enumerated inside it (TC29's §10 census-shape ruling) — `barricades` is the one such row,
 * and both its members are listed.
 */
export const STRESSOR_DISPOSITION = Object.freeze({
  under_siege: { express: 'siegeCamp', anchor: 'the invested gate' },
  wartime: { express: 'trampled', anchor: "the fields on the approach the war comes by" },
  occupied: { express: 'garrisonBillet', anchor: "the ruling power's own seat" },
  plague_onset: { express: 'quarantineBars', anchor: 'every gate, and a lazar house beyond it' },
  famine: { express: 'famineStalls', anchor: 'the market place' },
  monster_pressure: { express: 'watchFires', anchor: 'the approach roads' },
  mass_migration: { express: 'gateCamp', anchor: 'outside the busiest gate' },
  insurgency: { express: 'barricades', anchor: 'the least-ordered quarter' },
  slave_revolt: { express: 'barricades', anchor: 'the least-ordered quarter' },
  politically_fractured: { express: null, cut: 'a split council is a fact about people in a room; §8.2 finds no ground for it' },
  indebted: { express: null, cut: 'an obligation is not a building — no canonical field puts a debt anywhere on the map' },
  recently_betrayed: { express: null, cut: 'a betrayal has no standing physical expression at year scale (§10.D.21)' },
  succession_void: { express: null, cut: 'the seat is empty and the seat-house is not — the building is unchanged' },
  infiltrated: { express: null, cut: 'DM-LENS BY NATURE (§10.C.17): infiltration renders as ordinary fabric on the default lens' },
  religious_conversion: { express: null, cut: 'doctrine content never expresses (§10.D.23 / the deity doctrine)' },
});

/**
 * ⭐ THE STRESSORS THAT NUCLEATE A COUNTRYSIDE (§16.5's incastellamento arm), AS A TYPED SET
 * RATHER THAN AS A REGEX OVER KEY NAMES.
 *
 * ⛔ WHAT THE REGEX ACTUALLY MATCHED, AND IT IS THE THIRD MEMBER OF THIS LANE'S OWN DEFECT
 * CLASS. The assembly tested `/monster_raider_pressure|wartime|siege|occupation|insurgency|
 * rebellion/` against CATALOG KEYS. Of its six alternatives, **three cannot match any catalog
 * key that exists**: `monster_raider_pressure` (the catalog says `monster_pressure`),
 * `occupation` (the catalog says `occupied`) and `rebellion` (an ARCHETYPE name, never a
 * catalog key). So a settlement under monster pressure or under occupation — two of the
 * three most obviously nucleating pressures in the whole catalog — did not nucleate, and a
 * settlement carrying the archetype `rebellion` was tested against a key it never has.
 *
 * ⭐ THE CURE IS THE SAME ONE THIS FILE ALREADY APPLIES TO EXPRESSION: enumerate the catalog,
 * rule every key, and let a walker hold the enumeration to the live table. `under_siege`
 * matched only by ACCIDENT (the substring 'siege'), which is what a name-matching test buys
 * you — a right answer with no reason behind it.
 *
 * THE ARGUMENT, key by key: incastellamento is people moving off dispersed holdings INTO a
 * defended place because the open country stopped being survivable. That is a question about
 * VIOLENCE ON THE LAND, not about hardship: a famine or a plague empties the countryside
 * without gathering it, and a debt does nothing to it at all.
 * @type {Readonly<Record<string, string>>}
 */
export const DANGER_STRESSORS = Object.freeze({
  under_siege: 'an army is on the ground outside; nobody sleeps on an outlying holding',
  wartime: 'the war passes through — requisition and foraging make the open country unsafe',
  occupied: 'a garrison holds the place; the countryside is where the reprisals happen',
  monster_pressure: 'the canonical reason a dispersed countryside gathers behind a wall',
  insurgency: 'armed factions in the streets and on the roads between them',
  slave_revolt: 'as insurgency — the violence is on the land as well as in the town',
});

/** The §10.B expressions this module can actually draw, for the walker's second arm. */
export const EXPRESSIONS = Object.freeze([
  'siegeCamp', 'trampled', 'garrisonBillet', 'quarantineBars', 'famineStalls',
  'watchFires', 'gateCamp', 'barricades',
]);

/**
 * ⭐ THE ACTIVE-CONDITION BRIDGE. The condition archetypes are a SECOND vocabulary for some
 * of the same facts; mapping them here (rather than pattern-matching at each use) keeps one
 * home and makes the mapping reviewable. A condition with no row simply does not express.
 *
 * ⛔⛔ THIS TABLE WAS ENTIRELY FICTIONAL AND THE MEASUREMENT IS IN THE RECEIPT. Lane
 * MF-W1(substrate) checked all nine of its former keys against the engine's own canonical
 * vocabulary — `activeConditions.js`'s `CONDITION_ARCHETYPE_TEMPLATES`, 46 keys — and
 * **1 of 9 was a real archetype**. `plague_outbreak`, `famine_risk`, `food_shortage`,
 * `siege`, `war_footing`, `monster_incursion`, `civil_unrest` and `migration_pressure` are
 * names no kernel in the estate has ever written. Meanwhile **13 of the 14 archetypes a
 * GENERATED settlement can actually carry** (conditionPromotion.js's own
 * `STRESSOR_ARCHETYPE_RULES` targets) had no row at all.
 *
 * ⭐⭐ THE CLASS, AND IT IS SHARPER THAN "A MISSING MAPPING": **A BRIDGE BETWEEN TWO
 * VOCABULARIES CAN BE WRITTEN IN A THIRD.** Both endpoints existed and were correct — the
 * stressor catalog on one side, the archetype templates on the other — and the table
 * between them named neither. Nothing could red, because a bridge whose keys never occur
 * simply never fires, and the exemplar corpus sets `stressors` and no `activeConditions`
 * at all, so the arm was never exercised from the live side.
 *
 * ⚠ EVERY ROW BELOW IS TAKEN FROM `conditionPromotion.js`'s OWN RULES, INVERTED — that is,
 * from the engine's statement of which generation-time stressor becomes which condition.
 * It is a re-reading of an existing decision, never a new one. Where promotion collapses
 * several stressors onto one archetype (siege, wartime and monster pressure all promote to
 * `war_pressure`) the inverse cannot recover which, so the bridge maps to the WIDEST
 * honest expression — `wartime`, whose §10 mark is the trampled approach — rather than
 * guessing a siege that may not be there. ⭐ *An inverse that is not a function must return
 * the fact both preimages share, never the more dramatic one.*
 *
 * ⛔ AND THE UNEXPRESSIBLE ARCHETYPES ARE LISTED BY NAME rather than omitted, so a reader
 * can see that they were ruled and not forgotten (§10's totality discipline, applied to
 * the second vocabulary as well as the first).
 * @type {Readonly<Record<string,string>>}
 */
export const CONDITION_TO_STRESSOR = Object.freeze({
  // ── The crises a generated settlement can carry (conditionPromotion.js's targets).
  plague: 'plague_onset',
  famine: 'famine',
  war_pressure: 'wartime',
  vassal_extraction: 'occupied',
  regional_migration_pressure: 'mass_migration',
  rebellion: 'insurgency',
  regional_religious_pressure: 'religious_conversion',
  regional_authority_instability: 'politically_fractured',
  regional_tax_revenue_disruption: 'indebted',
  regional_criminal_pressure: 'infiltrated',
  dominant_npc_removed: 'succession_void',
  faction_challenge: 'recently_betrayed',
  // ── World-pulse archetypes that reach the same catalog keys.
  occupation_seed: 'occupied',
  occupation_burden: 'occupied',
  occupation_resistance: 'insurgency',
  government_overthrown: 'insurgency',
  war_mobilization: 'wartime',
  war_exhaustion: 'wartime',
  army_deployed: 'wartime',
  regional_conflict_pressure: 'wartime',
  // ⭐ MF-W1b: the sixth member of the war family, added when the TOTALITY WALKER found it
  // unruled. A war that is draining the realm is a war passing through the countryside, and
  // `wartime`'s expression — trampled fields on the approach the war comes by — IS that.
  war_drain: 'wartime',
});

/**
 * ⚠⚠ `occupation_seed` IS REAL AND IS NOT IN `CONDITION_ARCHETYPE_TEMPLATES`, AND FINDING
 * THAT OUT IS WORTH A NOTE OF ITS OWN. It is minted directly by
 * `worldPulse/convergence.js:718` as `condition: { archetype: 'occupation_seed', … }`, so
 * **the engine has TWO writers of condition-archetype names and the template table is only
 * one of them.** MF-W1b's first totality audit keyed on the table alone and convicted this
 * row as fictional — the audit was wrong, not the row.
 * ⭐ THE CLASS, and it is the third-vocabulary defect wearing the AUDITOR's coat this time:
 * **a totality check is only as total as its vocabulary, and a vocabulary with two writers
 * makes a one-writer check produce false convictions as well as false clean bills.** The
 * walker therefore takes the UNION of the template table and the `condition: { archetype:` 
 * literals, and this constant names the second source so it cannot be lost again.
 * @type {ReadonlyArray<string>}
 */
export const ARCHETYPE_SOURCES = Object.freeze([
  'src/domain/activeConditions.js :: CONDITION_ARCHETYPE_TEMPLATES',
  "src/domain/worldPulse/**  ::  condition: { archetype: '…' } literals",
]);

/**
 * ⭐ THE ARCHETYPES RULED **UNBRIDGED**, each with its reason — the second half of §10's
 * totality discipline. An archetype here is a real engine fact with no ground expression;
 * it must never quietly acquire one by someone adding a row above without an argument.
 * @type {Readonly<Record<string,string>>}
 */
export const CONDITION_UNBRIDGED = Object.freeze({
  magical_instability: 'no canonical field puts arcane instability anywhere on the ground (§8.2)',
  regional_export_market_loss: 'a lost market is a fact about elsewhere; the §10.D tick-scale rule refuses it',
  trade_route_cut: 'the ROAD is already drawn; a cut route changes traffic, not fabric',
  siege_lifted: 'the lifting of a siege is the ABSENCE of a mark, and absence is the default',
  boom: 'prosperity expresses through the prosperity band, not as a state mark (one home)',
  flourishing: 'as boom — prosperity has ONE home, the prosperity band, and a second '
    + 'expression of it would be two answers to one question',
  reconstruction: 'expresses through §19 decay/repair state, not as a §10 mark',
  custom_crisis: 'untyped by construction — a free-text crisis has no bounded expression',
  stressor_residual: 'a residual is a memory of a stressor, not a thing standing in a street',
  // ── MF-W1b · THE SEVENTEEN THE TOTALITY WALKER FOUND UNRULED. Each is a real engine
  //    archetype that reached no row and no ruling, so the §10 arm was silently partial over
  //    a third of the vocabulary. ⚠ RULING THEM OUT IS A DECISION, NOT A DEFAULT: an
  //    archetype with no row and no ruling is a gap; an archetype with a ruling is a
  //    boundary somebody argued.
  //
  //  ⭐⭐ AND THE SHARPEST ONE FIRST, BECAUSE IT IS A REFUSAL AND NOT AN OMISSION:
  regional_protection_gap: 'the roads are unsafe because nobody is holding them — and the '
    + 'catalog has NO KEY FOR HUMAN RAIDING. The tempting row is `monster_pressure`, whose '
    + 'expression (watch-fires on the approach roads) is exactly right; the KEY is not. '
    + 'Bridging a bandit problem to a key literally named "monster" would be a bridge written '
    + 'in a THIRD VOCABULARY — the precise defect this whole table was rebuilt to cure. '
    + 'REFUSED until the catalog carries a raiding key; the expression is ready when it does',
  //  ── The market and fiscal facts. §10.D's tick-scale rule: a price is not a building.
  regional_import_shortage: 'a shortage of imports is a market fact; the famine it may cause '
    + 'is promoted separately and has its own row',
  trade_embargo: 'as regional_import_shortage — the quay and the warehouse are unchanged',
  trade_realignment: 'trade moving elsewhere changes traffic, not fabric (as trade_route_cut)',
  vassal_trade_coercion: 'coercion of TRADE is a market fact; coercion by GARRISON is '
    + '`vassal_extraction`, which has a row',
  cold_war_sanctions: 'a fact about elsewhere; nothing stands in a street because of it',
  food_anchor_lost: 'the loss of a supply anchor is a cause of hunger, not hunger — the '
    + 'engine promotes `famine` separately and that is the row that draws',
  relief_burden: 'relief GIVEN to somewhere else; the giving town looks the same',
  reinforcement_cost: 'a fiscal burden. The troops it pays for are expressed by '
    + '`war_pressure` / `army_deployed` WHERE THEY STAND; the cost of them is not a place',
  war_spoils: 'gains express through the prosperity band, not as a state mark (as boom)',
  //  ── The facts about people in rooms. §8.2 finds no ground for any of them.
  alliance_burden: 'an obligation between polities — as indebted, no canonical field puts it '
    + 'anywhere on the map',
  corruption_exposed: 'as politically_fractured: a fact about people in a room',
  coup_suppressed: 'order restored is the ABSENCE of a mark, and absence is the default',
  occupation_lifted: 'as siege_lifted — the lifting of a state is the absence of its mark',
  regional_information_shock: 'news travels; nothing is built or unbuilt by it',
  regional_service_disruption: 'a service is people, and the building they worked in stands',
  regional_route_disruption: 'the ROAD is already drawn; a disrupted route changes traffic, '
    + 'not fabric (as trade_route_cut)',
  // ⭐⭐ FOUR MORE, AND THE WALKER FOUND THEM WHERE THE LANE'S OWN INSTRUMENT COULD NOT. The
  // scratch audit grepped `condition: { archetype: '…'` on ONE LINE and reported a vocabulary
  // of 47; the pin's regex tolerates the newline the real source carries and reported 51.
  // ⭐ THE CLASS: **a one-line grep is a one-line vocabulary**, and an audit that undercounts
  // its own subject reports a totality it has not established. The PIN is the instrument.
  betrayal: 'a betrayal is a fact about people, and the seat-house it happened in is '
    + 'unchanged — the same ruling as recently_betrayed at the catalog end',
  faith_foothold: 'a faith gaining ground expresses as an INSTITUTION when the roster earns '
    + 'one; DOCTRINE CONTENT never expresses (the deity doctrine, §10.D.23)',
  faith_pact: 'as faith_foothold — a pact between faiths is an agreement, not a building',
  religious_conversion_fracture: 'as religious_conversion at the catalog end: doctrine '
    + 'content never expresses, and a fracture in it is doctrine content',
});

/**
 * ⭐⭐⭐ THE ONE STRESSOR READER FOR THE WHOLE FABRIC LAYER — and the shape it accepts is
 * the ESTATE'S OWN, not a second opinion about it.
 *
 * ⛔⛔ WHAT WAS WRONG, MEASURED BY MF-INT1 AGAINST THE REAL GENERATOR: this module and the
 * assembly both wrote `Array.isArray(s.stressors) ? … : []`. **A real dossier's `stressors`
 * is a SINGLE OBJECT** — `settlement.schema.js` declares `stressors: ['stress','stresses']`
 * as one alias group, and `canonStressors` (canonicalAccessors.js) has always handled the
 * bare-object case. `Array.isArray({…})` is `false`, so on every real settlement `active`
 * was empty and **the entire §10 state arm was dead**: no siege camp, no barred gate, no
 * lazar house, no empty famine market, no migrant camp. Four of the sixteen exemplar leaves
 * exist only because the harness synthesizes the array the generator never produces.
 *
 * ⭐⭐ THE CURE IS TO REUSE THE ESTATE'S CANONICAL ACCESSOR, NOT TO WIDEN THE TEST. This
 * programme's own G-34 ruling — one predicate, one home, and a check that reds on a second
 * spelling — applies verbatim: a fabric-local `typeof x === 'object'` test would be a
 * SECOND answer to a question `canonStressors` already answers, free to drift from it on
 * the next alias the schema gains. So the shape question is delegated and only the
 * KEY EXTRACTION lives here, because that part (a catalog key, not a stressor object) is
 * genuinely the map's own question.
 *
 * ⚠ THE ARRAY-OF-KEYS SHAPE IS DELIBERATELY STILL ACCEPTED. The exemplar corpus passes
 * `['under_siege']` — bare catalog keys, not stressor objects — and those sixteen leaves are
 * the programme's declared-shift baseline. Migrating them would restate every published
 * figure in the corpus for no gain; instead both shapes normalize to a key here, and the
 * pin below asserts a REAL-SHAPE fixture reaches the same expression as the synthesized one,
 * which is the arm the fixture-mirrors-the-reader hazard actually needs.
 *
 * @param {any} settlement
 * @returns {string[]} catalog keys, deterministically ordered
 */
export function stressorKeysOf(settlement) {
  /** @type {string[]} */ const keys = [];
  for (const entry of canonStressors(settlement)) {
    // ⚠ BOTH ARMS ARE FILTERED THROUGH THE CATALOG, and the string arm is filtered for the
    // same reason the object arm is: an unfiltered token would reach `danger`'s test as free
    // text, and §5.0's own rule — a prose regex may not stand in for a missing typed fact —
    // binds here exactly as it binds the founding kind. A key the catalog does not carry is
    // not a state this map can express, whichever shape it arrived in.
    if (typeof entry === 'string') { if (entry && STRESSOR_DISPOSITION[entry]) keys.push(entry); continue; }
    if (!entry || typeof entry !== 'object') continue;
    // A stressor OBJECT names its own catalog key in `type`; `name`/`label` are its prose
    // faces and are read only as a fallback, in the order the estate's own
    // `archetypeForStressor` reads them, so the two never disagree about which field wins.
    for (const v of [entry.type, entry.name, entry.label]) {
      if (typeof v === 'string' && v && STRESSOR_DISPOSITION[v]) { keys.push(v); break; }
    }
  }
  return keys.sort();
}

/**
 * Read the settlement's live state into typed, CITED flags. One reader, so the map can never
 * disagree with itself about whether a town is besieged.
 * @returns {{ active: Map<string,string>, reason:string }}
 */
export function readState(settlement) {
  const s = settlement || {};
  /** @type {Map<string,string>} */ const active = new Map();
  const raw = stressorKeysOf(s);
  for (const k of raw) {
    const key = String(k);
    if (STRESSOR_DISPOSITION[key]) active.set(key, `settlement.stressors[${key}]`);
  }
  const conds = Array.isArray(s.activeConditions) ? s.activeConditions : [];
  for (const c of conds) {
    if (!c) continue;
    const arch = String(c.archetype || '');
    const mapped = CONDITION_TO_STRESSOR[arch];
    // ⚠ SEVERITY GATES THE MARK. A condition the engine itself rates faint does not put
    // tents on the ground; the band is the engine's own, not a new dial.
    if (!mapped) continue;
    if (Number.isFinite(c.severity) && c.severity < 0.35) continue;
    if (!active.has(mapped)) active.set(mapped, `activeConditions[${arch}] severity ${c.severity}`);
  }
  return {
    active,
    reason: `§10 state read: ${raw.length} stressor(s) + ${conds.length} condition(s) ⇒ `
      + `${active.size} expressible axis/axes (${[...active.keys()].sort().join(', ') || 'none'})`,
  };
}

/** A small quad, centred, at a bearing. The one primitive every camp shape uses. */
function quad(cx, cy, w, h, ang) {
  const c = cosI(ang), s = sinI(ang);
  return [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]
    .map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]);
}

/**
 * ⭐⭐ THE §10 STATE EXPRESSIONS FOR ONE LEAF.
 * @returns {{
 *   bodies: Array<{key:string, polygon:number[][], kind:string, cite:string}>,
 *   marks: Array<any>, dress: {band:string, reason:string},
 *   expressed: string[], cut: string[], reason: string, groundLawReason: string
 * }}
 */
export function deriveStateMarks(args) {
  const { settlement, meta, walls, umbrella, web, seeding, prosperityRank, lawfulness } = args;
  const state = readState(settlement);
  const key = `${String(seeding.seed)}|state${seeding.variant ? `|v${seeding.variant}` : ''}`;
  const cx = meta.centre ? meta.centre.x : 500, cy = meta.centre ? meta.centre.y : 500;
  const frontage = meta.plotFrontage;
  /** @type {Array<any>} */ const bodies = [];
  /** @type {Array<any>} */ const marks = [];
  const expressed = [];

  // THE GATES, in a stable order, with an OUTWARD normal. Where a settlement has no circuit
  // the roads' own exits stand in for gates — a camp invests the way IN, walled or not.
  /** @type {Array<{x:number,y:number,dx:number,dy:number,rank:number}>} */ const ways = [];
  for (const ring of (walls || [])) {
    for (const g of ring.gates) {
      const nx = g.x - cx, ny = g.y - cy;
      const L = Math.sqrt(nx * nx + ny * ny) || 1;
      ways.push({ x: g.x, y: g.y, dx: nx / L, dy: ny / L, rank: g.bricked ? 1 : 0 });
    }
  }
  if (!ways.length) {
    for (const r of (web.roads || [])) {
      if (!r.line || r.line.length < 2) continue;
      const p = r.line[r.line.length - 1];
      const nx = p[0] - cx, ny = p[1] - cy;
      const L = Math.sqrt(nx * nx + ny * ny) || 1;
      ways.push({ x: cx + (nx / L) * meta.builtRadius, y: cy + (ny / L) * meta.builtRadius, dx: nx / L, dy: ny / L, rank: 2 });
    }
  }
  ways.sort((a, b) => (a.rank - b.rank) || (a.x - b.x) || (a.y - b.y));

  const cite = (k) => state.active.get(k) || '';

  // ── §10.12 THE SIEGE. An army camps ON the road it came by, at a bowshot from the wall,
  //    and the gate it invests is BARRED. Tents are FILLED BODIES and go through the ground
  //    law with everything else (buildFabric's third pass).
  if (state.active.has('under_siege') && ways.length) {
    const g = ways[0];
    // ⭐ THE STANDOFF IS A REAL DISTANCE, not a composition choice: a besieging camp stood
    // beyond bowshot of the walls, which is what made a siege a siege rather than an assault.
    const stand = Math.max(frontage * 5, meta.builtRadius * 0.16);
    // ⛔ THE CAMP LIES BESIDE THE ROAD, NOT ACROSS IT, and the first spelling had it the wrong
    // way round: nine tents spread PERPENDICULAR to the gate's own bearing put the middle of
    // the camp squarely in the approach road, and the ground law refused eight of nine —
    // correctly, since the besieger has not blockaded the road by pitching a tent in it.
    // ⭐ A siege camp is a LINE OF TENTS ALONG THE APPROACH, set back one camp's width from
    // the road so the army can use its own road. Both halves are the historical picture and
    // both halves are what makes the bodies survive the law.
    const off = frontage * 2.6;
    const bx = g.x + g.dx * stand - g.dy * off, by = g.y + g.dy * stand + g.dx * off;
    const across = bearingOf(-g.dy, g.dx);
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 5), col = i % 5;
      const t = (col - 2) * frontage * 1.5;
      const u = row * frontage * 1.5;
      const jitter = (hashUnit(`${key}|siege|${i}`) - 0.5) * frontage * 0.5;
      const px = bx + g.dx * t - g.dy * (u + jitter), py = by + g.dy * t + g.dx * (u + jitter);
      bodies.push({
        key: `state.siege.tent.${i}`, kind: 'tent', cite: cite('under_siege'),
        polygon: quad(px, py, frontage * 0.9, frontage * 0.75, across),
      });
    }
    marks.push({ kind: 'barredGate', x: g.x, y: g.y, dx: g.dx, dy: g.dy, cite: cite('under_siege'), label: 'INVESTED' });
    expressed.push('under_siege');
  }

  // ── §10.12 WARTIME — TRAMPLED FIELDS on the approach. A calm hatch, no more.
  if (state.active.has('wartime') && ways.length) {
    const g = ways[ways.length - 1];
    const r = meta.builtRadius * 0.30;
    marks.push({
      kind: 'trampled', cite: cite('wartime'),
      x: g.x + g.dx * r, y: g.y + g.dy * r, r: r * 0.8, ang: bearingOf(g.dx, g.dy),
    });
    expressed.push('wartime');
  }

  // ── §10.13 PLAGUE — the gates are BARRED and a lazar house stands beyond the last of them.
  if (state.active.has('plague_onset') && ways.length) {
    for (const g of ways) marks.push({ kind: 'quarantineBar', x: g.x, y: g.y, dx: g.dx, dy: g.dy, cite: cite('plague_onset') });
    const g = ways[ways.length - 1];
    const d = Math.max(frontage * 8, meta.builtRadius * 0.22);
    bodies.push({
      key: 'state.plague.lazar', kind: 'lazar', cite: cite('plague_onset'),
      polygon: quad(g.x + g.dx * d, g.y + g.dy * d, frontage * 2.2, frontage * 1.4, bearingOf(-g.dy, g.dx)),
    });
    expressed.push('plague_onset');
  }

  // ── §10.A2 FAMINE — the market place stands EMPTY. The stalls are drawn as HOLLOW
  //    outlines: the rows are still marked out on the ground and nothing is on them, which
  //    is exactly what a market in a hungry year looked like and is the calmest possible
  //    way to say it.
  if (state.active.has('famine') && web.squares && web.squares.length) {
    const sq = web.squares[0];
    const c = sqCentre(sq.polygon);
    for (let i = 0; i < 6; i++) {
      const t = (i - 2.5) * frontage * 1.4;
      marks.push({
        kind: 'emptyStall', cite: cite('famine'),
        polygon: quad(c[0] + t, c[1], frontage * 0.9, frontage * 1.7, 0),
      });
    }
    expressed.push('famine');
  }

  // ── §10.15 MONSTER PRESSURE — watch-fires and barricades where the roads come in.
  if (state.active.has('monster_pressure') && ways.length) {
    for (const g of ways.slice(0, 4)) {
      const d = Math.max(frontage * 3, meta.builtRadius * 0.10);
      marks.push({ kind: 'watchFire', x: g.x + g.dx * d, y: g.y + g.dy * d, r: frontage * 0.55, cite: cite('monster_pressure') });
    }
    expressed.push('monster_pressure');
  }

  // ── §10.A11 MIGRATION — a camp OUTSIDE the busiest gate, at the camp's own grain: huts,
  //    not houses, no yards, no rank (the §11.9 arc's first frame).
  if (state.active.has('mass_migration') && ways.length) {
    const g = ways[0];
    const d = Math.max(frontage * 3.5, meta.builtRadius * 0.09);
    const bx = g.x + g.dx * d, by = g.y + g.dy * d;
    const across = bearingOf(-g.dy, g.dx);
    for (let i = 0; i < 12; i++) {
      const row = Math.floor(i / 6), col = i % 6;
      const t = (col - 2.5) * frontage * 1.25;
      const u = row * frontage * 1.3;
      const jx = (hashUnit(`${key}|camp|${i}|x`) - 0.5) * frontage * 0.5;
      const jy = (hashUnit(`${key}|camp|${i}|y`) - 0.5) * frontage * 0.5;
      bodies.push({
        key: `state.camp.hut.${i}`, kind: 'camphut', cite: cite('mass_migration'),
        polygon: quad(bx - g.dy * t + g.dx * u + jx, by + g.dx * t + g.dy * u + jy,
          frontage * 0.72, frontage * 0.62, across),
      });
    }
    expressed.push('mass_migration');
  }

  // ── §10.B THE BARRICADE CLASS (insurgency + slave_revolt). One expression, two member
  //    keys, both enumerated — the class row TC29's §10 census shape permits.
  if (state.active.has('insurgency') || state.active.has('slave_revolt')) {
    const which = state.active.has('insurgency') ? 'insurgency' : 'slave_revolt';
    const chans = (web.channels || []).filter((c) => c.rank === 'lane' || c.rank === 'blockLane');
    const pick = chans.length ? chans[Math.floor(hashUnit(`${key}|barricade`) * chans.length)] : null;
    if (pick && pick.line && pick.line.length > 2) {
      for (const f of [0.35, 0.65]) {
        const p = pick.line[Math.floor(pick.line.length * f)];
        const q = pick.line[Math.min(pick.line.length - 1, Math.floor(pick.line.length * f) + 1)];
        marks.push({
          kind: 'barricade', x: p[0], y: p[1],
          dx: q[0] - p[0], dy: q[1] - p[1], w: pick.width, cite: cite(which),
        });
      }
      expressed.push(which);
    }
  }

  // ── §10.12 OCCUPATION — a garrison BILLET at the seat of power: a tented yard beside the
  //    strongest institution, because an occupier quarters itself on the government.
  if (state.active.has('occupied') && Array.isArray(args.landmarks)) {
    const seat = args.landmarks.filter((l) => l.monumental)
      .sort((a, b) => (b.prominent ? 1 : 0) - (a.prominent ? 1 : 0) || (b.size - a.size))[0];
    if (seat) {
      for (let i = 0; i < 4; i++) {
        const a = Math.round((i * TRIG_N) / 4 + 8);
        bodies.push({
          key: `state.billet.${i}`, kind: 'tent', cite: cite('occupied'),
          polygon: quad(seat.x + cosI(a) * seat.size * 2.0, seat.y + sinI(a) * seat.size * 2.0,
            frontage * 0.85, frontage * 0.70, a),
        });
      }
      expressed.push('occupied');
    }
  }

  // ── §10.A2 THE PROSPERITY DRESS. §11.4's own axis, expressed as a BAND rather than as a
  //    new mark: a prosperous town's market place is PAVED and carries its public work; a
  //    struggling one's is bare ground with its maintenance deferred. The palette already
  //    walks the material ladder; this is the one thing the GROUND says.
  const dressBand = prosperityRank >= 4 ? 'paved' : (prosperityRank <= 1 ? 'deferred' : 'plain');
  if (dressBand === 'paved' && web.squares && web.squares.length) {
    const c = sqCentre(web.squares[0].polygon);
    marks.push({ kind: 'publicWork', x: c[0], y: c[1], r: frontage * 1.1, cite: `economicState.prosperity rank ${prosperityRank}` });
  }

  const cut = Object.keys(STRESSOR_DISPOSITION).filter((k) => !STRESSOR_DISPOSITION[k].express).sort();
  return {
    bodies,
    marks,
    dress: {
      band: dressBand,
      reason: `§10.A2 prosperity dress: rank ${prosperityRank} ⇒ ${dressBand}`
        + (dressBand === 'paved' ? ' (the market place is paved and carries its public work)'
          : dressBand === 'deferred' ? ' (maintenance deferred; the ground is bare)' : ''),
    },
    expressed: expressed.sort(),
    cut,
    lawfulness,
    groundLawReason: 'not yet swept',
    reason: `${state.reason}. EXPRESSED: ${expressed.length ? expressed.sort().join(', ') : 'none'} `
      + `(${bodies.length} filled bodies, ${marks.length} calm-ink marks). `
      + `CUT BY NAME, with reasons in STRESSOR_DISPOSITION: ${cut.join(', ')}. `
      + `Catalog totality: ${Object.keys(STRESSOR_DISPOSITION).length} dispositions against `
      + `${Object.keys(STRESS_TYPE_MAP).length} live catalog keys.`,
  };
}

/** A bearing index from a direction vector, without runtime trig. */
function bearingOf(dx, dy) {
  let best = 0, bestDot = -Infinity;
  const L = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / L, uy = dy / L;
  for (let i = 0; i < TRIG_N; i++) {
    const d = cosI(i) * ux + sinI(i) * uy;
    if (d > bestDot) { bestDot = d; best = i; }
  }
  return best;
}

function sqCentre(poly) {
  let x = 0, y = 0;
  for (const p of poly) { x += p[0]; y += p[1]; }
  return [x / poly.length, y / poly.length];
}
