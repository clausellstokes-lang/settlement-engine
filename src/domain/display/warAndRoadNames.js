/**
 * domain/display/warAndRoadNames.js — THE RENDER-TIME NAMES OF A WAR AND OF A ROAD.
 *
 * WEAVE NAME-1 (DESIGN_FMG_WEAVE A1.1.1, the D4 re-ruling). Two things this world
 * already has, and has never been able to say out loud: the war two courts are in,
 * and the road a DM chartered by hand. Both exist in the record only as an id PAIR.
 * This leaf turns each pair into a name at RENDER time and writes nothing.
 *
 * ── WHY RENDER TIME AND NOT MINT TIME (A1.1.1(a)) ───────────────────────────────
 * The obvious home was the prose registry, and it was ruled FALSE: those pools
 * interpolate at MINT and their picked string PERSISTS into save/golden data, so a
 * name minted there is a permanent byte and a same-seed shift. Nothing here is ever
 * written down. A campaign that never opens a war panel is byte-identical.
 *
 * ── THE WAR KEY, AND WHY IT DEGRADES (A1.1.1(b), R-NAME1's refutation) ──────────
 * The re-ruling wanted (sorted original pair + reason type + OPENING TICK). The
 * recon measured that the third leg does not exist and the first two are DELETED at
 * war end: `worldState.deployments[attackerId]` is the only war ledger, and
 * `warDeployment.js` deletes the row when the war concludes. `warId` has one reader
 * and no writer; `openingTick` has zero occurrences. So the fallback the ruling
 * pre-authorised is the shipped key:
 *
 *     sorted ORIGINAL belligerent pair + typed war reason,
 *     degrading gracefully to the PAIR ALONE when no reason stands.
 *
 * Same-pair + same-reason collisions are ACCEPTED and documented: two wars fought a
 * century apart over the same grievance between the same two seats carry the same
 * name, which is what a chronicler would do anyway. The consequence a reader must
 * know is the other one: a CONCLUDED war has no ledger row left, so it can only be
 * named through the degraded pair form by a caller that still holds the pair.
 *
 * ── COALITIONS COLLAPSE, THEY DO NOT MULTIPLY ───────────────────────────────────
 * A coalition joiner opens its OWN bilateral deployment whose `casusReasons` carry
 * the synthetic `alliance_obligation`. Keyed naively, one war would acquire a second
 * name the day an ally marched. `joinLedger[0]` carries `originAttackerId` /
 * `enemyId` / `sourceCauseTypes`, so a joiner is folded onto the ORIGIN pair and the
 * ORIGIN cause, and the coalition reads as ONE named war with several participants.
 *
 * ── THE FIRST NAMED ROAD (A1.1.1(c)/(d)) ────────────────────────────────────────
 * No route or road is displayed under a name anywhere in this codebase today; every
 * surface names the destination, the tier or the band, and `CharterRoadCard`'s
 * "Carters will know the road by name within a year" is the forward reference this
 * discharges. NOTHING MIGRATES — there is no legacy road name to preserve. The key
 * folds MODE, exactly as the durable `routeId` does.
 * The `{dest}` idiom is kept, not replaced (news-address law): given the end the
 * reader is standing at, a road is named for the OTHER end, and the same road is
 * "the Kelby road" from Ashford and "the Ashford road" from Kelby. Without a
 * standpoint it takes its stable codepoint-ordered pair form.
 *
 * ⚠ THREE MODE VOCABULARIES EXIST AND MUST NEVER MIX. `USER_ROUTE_MODES` is
 * `['land','water']` (userRoutes.js); `MissionRec.legModes` and the RoadsLayer style
 * key both spell the wet one `sea`. This leaf consumes the ROUTE row's vocabulary
 * only and REFUSES anything outside it (returns null) rather than naming a sea leg a
 * road. It does not import `USER_ROUTE_MODES`: `roads/userRoutes.js` statically
 * imports the 53 kB frozen-digest reader, and a display leaf that dragged it would
 * re-open the first-paint defect `userRouteIdentity.js` exists to cure. The two
 * tokens are mirrored below with that reason attached, and pinned by test.
 *
 * ── LAW CLAUSES ─────────────────────────────────────────────────────────────────
 * HEURISTIC DM LANGUAGE — NO INTERNALS. No tick, no score, no capacity, no cost, no
 * fraction reaches any string here; the reach band is a typed WORD from the row's
 * own closed vocabulary and is rendered as a haul, never as a number.
 * PRESENTATION ONLY. Nothing mutates worldState, forks rng, or reads a wall clock.
 * Selection is the FNV-1a kernel — pure, zero rng draws, canonical at a falsy seed.
 * INERT, NOT CRASH, WHEN ABSENT. A no-war, no-route campaign yields [] / null.
 * DETERMINISM. Every list output is codepoint-sorted.
 * Strict-clean (typecheck:domain:strict). No React/Zustand imports.
 *
 * @see src/domain/worldPulse/proseSelection.js — the zero-import selection kernel.
 * @see src/domain/worldPulse/warReasonTaxonomy.js — the closed 16-reason authority.
 */

import { pickLine } from '../worldPulse/proseSelection.js';
import { WAR_REASON_TYPES } from '../worldPulse/warReasonTaxonomy.js';

/** @param {unknown} a @param {unknown} b @returns {number} */
const codepoint = (a, b) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);

/** The two ids in codepoint order — the same convention the route edge id uses.
 * @param {unknown} aId @param {unknown} bId @returns {[string, string]} */
function orderedPair(aId, bId) {
  const a = String(aId);
  const b = String(bId);
  return a <= b ? [a, b] : [b, a];
}

// ── WAR NAMES ────────────────────────────────────────────────────────────────
// One pool per shipped casus type; TOTALITY over WAR_REASON_TYPES is pinned by
// test, so a seventeenth casus cannot be minted without authoring its names.
// Index 0 is the canonical telling (the falsy-seed pick). Every entry is a NAME
// — a noun phrase a chronicler would write on a spine — and every entry stays
// inside its own typed cause: a name never asserts an event the record does not
// hold (A1.1.1(e)). No settlement name is interpolated here; the pair is the
// ADDRESS and is carried alongside, never folded into the epithet, so the same
// war keeps one name on every surface that mentions it.
/** @type {Readonly<Record<string, readonly string[]>>} */
export const WAR_NAME_POOLS = Object.freeze({
  grievance: Object.freeze([
    'the War of the Old Grievance',
    'the War of the Unanswered Wrong',
    'the Grudge War',
    'the War of the Long Complaint',
  ]),
  revanchism: Object.freeze([
    'the War of Recovery',
    'the War of the Lost Ground',
    'the Reclamation War',
    'the War of Return',
  ]),
  resource_pressure: Object.freeze([
    'the War of the Lean Years',
    'the Granary War',
    'the War of Bread and Iron',
    'the Hungry War',
  ]),
  treaty_default: Object.freeze([
    'the War of the Broken Pact',
    'the War of the Torn Seal',
    'the Oathbreak War',
    'the War of the Forsworn Court',
  ]),
  encirclement: Object.freeze([
    'the War of the Closing Ring',
    'the War of the Shut Gates',
    'the Encirclement War',
    'the War of Narrow Doors',
  ]),
  legitimacy_hunger: Object.freeze([
    'the War of the Unsteady Crown',
    'the War of the New Seat',
    'the War of Proving',
    'the Hungry Crown War',
  ]),
  corruption_exposed: Object.freeze([
    'the War of the Opened Books',
    'the War of the Bought Court',
    'the Ledger War',
    'the War of the Rotten Office',
  ]),
  foreign_clash: Object.freeze([
    'the War of Distant Patrons',
    "the War of Other Courts' Quarrels",
    "the Patrons' War",
    'the Borrowed War',
  ]),
  fear_of_dominance: Object.freeze([
    'the War of the Balance',
    'the War of the Overgrown Neighbour',
    'the Balance War',
    'the War of the Long Shadow',
  ]),
  ingratitude_debt: Object.freeze([
    'the War of the Unpaid Debt',
    'the War of the Forgotten Favour',
    'the Reckoning of Debts',
    "the Ingrates' War",
  ]),
  dependency_by_design: Object.freeze([
    'the War of the Tightened Rope',
    'the War of the Narrowed Market',
    'the Tribute War',
    'the Leash War',
  ]),
  opportunism: Object.freeze([
    'the War of the Open Door',
    'the War of the Weak Hour',
    "the Opportunists' War",
    'the War of the Taken Chance',
  ]),
  sacred_claim: Object.freeze([
    'the War of the Holy Claim',
    'the War of the Contested Rite',
    "the Pilgrims' War",
    'the Sanctuary War',
  ]),
  lineage_claim: Object.freeze([
    'the War of Succession',
    'the War of the Rival Line',
    'the Blood-Claim War',
    'the Inheritance War',
  ]),
  alliance_obligation: Object.freeze([
    'the War of the Called Oath',
    'the War of the Summoned Banner',
    "the Allies' War",
    'the War of the Kept Promise',
  ]),
  atrocity_answer: Object.freeze([
    'the War of the Answer',
    'the War of the Burned Town',
    'the War of the Ashes',
    'the Vengeance War',
  ]),
});

// The DEGRADED form, used when no typed reason stands on the record — a concluded
// war whose ledger row is gone, a legacy/hand-seeded deployment, or a coalition
// anchor whose source causes did not survive normalization. It names the pair and
// claims nothing else, which is the honest thing to say when the cause is not in
// hand. Interpolates the world's OWN names (portable specificity).
/** @type {readonly ((interp: Record<string, unknown>) => string)[]} */
export const UNTYPED_WAR_NAME_MOLDS = Object.freeze([
  (/** @type {Record<string, unknown>} */ x) => `the ${String(x.a)}–${String(x.b)} War`,
  (/** @type {Record<string, unknown>} */ x) => `the War of ${String(x.a)} and ${String(x.b)}`,
  (/** @type {Record<string, unknown>} */ x) => `the War between ${String(x.a)} and ${String(x.b)}`,
]);

// The typed cause in world words — one clause per casus, TOTAL over the taxonomy
// (pinned by test). This is the "reason" leg of the news-address law; it says what
// the court says it is fighting over and nothing beyond it.
/** @type {Readonly<Record<string, string>>} */
export const WAR_REASON_CLAUSES = Object.freeze({
  grievance: 'an old wrong that was never answered',
  revanchism: 'ground lost in an earlier war',
  resource_pressure: 'fields and goods the realm can no longer do without',
  treaty_default: 'a pact the other court did not keep',
  encirclement: 'a ring of rivals closing on the realm',
  legitimacy_hunger: 'a seat that needs a victory to hold its court',
  corruption_exposed: "rot in the other court's offices, laid open",
  foreign_clash: 'a quarrel borrowed from distant patrons',
  fear_of_dominance: 'a neighbour grown too great to leave alone',
  ingratitude_debt: 'aid given and never repaid',
  dependency_by_design: 'a market drawn tight around the realm on purpose',
  opportunism: 'a neighbour caught at its weakest hour',
  sacred_claim: 'a holy place both courts claim',
  lineage_claim: 'a claim carried by blood',
  alliance_obligation: "an ally's call the realm was bound to answer",
  atrocity_answer: 'a town put to the sword, and the answer owed for it',
});

/** A typed casus, or null for anything outside the closed taxonomy.
 * @param {unknown} type @returns {string|null} */
function warReasonOrNull(type) {
  return typeof type === 'string' && WAR_REASON_TYPES.includes(type) ? type : null;
}

/**
 * The render-time war key: the codepoint-ordered ORIGINAL belligerent pair, plus
 * the typed reason when one stands. Stable for as long as the war's ledger row
 * lives, and reproducible afterwards by any caller still holding the pair.
 * @param {Object} args
 * @param {unknown} args.attackerId
 * @param {unknown} args.defenderId
 * @param {unknown} [args.reasonType]
 * @returns {string}
 */
export function warNameKey({ attackerId, defenderId, reasonType }) {
  const [low, high] = orderedPair(attackerId, defenderId);
  const typed = warReasonOrNull(reasonType);
  return typed ? `war.${low}.${high}.${typed}` : `war.${low}.${high}`;
}

/**
 * Name ONE war from the pair and the typed cause. Total — a pair always yields a
 * name, degrading to the pair form when the cause is absent or unrecognised.
 *
 * `line` is the addressed telling (news-address law): the name, the two courts in
 * their true roles, and the typed reason. It carries no tick, no score and no
 * capacity — the record's own words only.
 *
 * @param {Object} args
 * @param {unknown} args.attackerId  the ORIGINAL attacker (a coalition joiner passes the origin).
 * @param {unknown} args.defenderId  the ORIGINAL defender.
 * @param {unknown} [args.reasonType]  a WAR_REASON_TYPES member; anything else degrades.
 * @param {(id: unknown) => string} [args.nameFor]
 * @returns {{ key: string, reasonType: string|null, name: string, line: string, attackerName: string, defenderName: string }}
 */
export function deriveWarName({ attackerId, defenderId, reasonType, nameFor = (id) => String(id) }) {
  const typed = warReasonOrNull(reasonType);
  const key = warNameKey({ attackerId, defenderId, reasonType: typed });
  const [low, high] = orderedPair(attackerId, defenderId);
  const attackerName = nameFor(attackerId);
  const defenderName = nameFor(defenderId);
  const name = typed
    ? pickLine(WAR_NAME_POOLS[typed], key)
    : pickLine(UNTYPED_WAR_NAME_MOLDS, key, { a: nameFor(low), b: nameFor(high) });
  const clause = typed ? WAR_REASON_CLAUSES[typed] : null;
  const line = clause
    ? `${name}: ${attackerName} against ${defenderName}, over ${clause}.`
    : `${name}: ${attackerName} against ${defenderName}.`;
  return { key, reasonType: typed, name, line, attackerName, defenderName };
}

/**
 * The typed cause standing on ONE record carrying `casusReasons`: the highest-scored
 * pin, ties broken by codepoint so the pick never depends on array order. Null when
 * the record carries none (the dormant default, a legacy record, or a war whose pins
 * did not survive normalization).
 *
 * ⭐ EXPORTED because the pins outlive the deployment they were minted on. W-MEM's
 * concluded-war record copies `casusReasons` VERBATIM, so the Remembrance reader asks
 * the same question of a finished war that this file asks of a live one. One home per
 * datum: a second scoring rule would let a war change its cause the day it ended.
 * @param {unknown} record
 * @returns {string|null}
 */
export function pinnedWarReasonOf(record) {
  const rec = /** @type {{ casusReasons?: unknown }} */ (record || {});
  const pins = Array.isArray(rec.casusReasons) ? rec.casusReasons : [];
  /** @type {{ type: string, score: number }|null} */
  let best = null;
  for (const pin of pins) {
    const row = /** @type {{ type?: unknown, score?: unknown }} */ (pin || {});
    const type = warReasonOrNull(row.type);
    if (!type) continue;
    const score = Number.isFinite(Number(row.score)) ? Number(row.score) : 0;
    if (!best || score > best.score || (score === best.score && codepoint(type, best.type) < 0)) {
      best = { type, score };
    }
  }
  return best ? best.type : null;
}

/**
 * The ORIGIN war a deployment belongs to. A coalition joiner is folded onto the
 * anchor's origin pair and origin cause so the coalition reads as ONE war; everyone
 * else is their own origin. Reads the anchor's raw shape defensively rather than
 * importing the coalition validator (which is engine-side and far heavier than a
 * display leaf should carry); a malformed anchor simply falls through to the
 * bilateral reading.
 * @param {string} homeId
 * @param {unknown} record
 * @returns {{ attackerId: string, defenderId: string, reasonType: string|null }|null}
 */
function originWarOf(homeId, record) {
  const rec = /** @type {{ targetId?: unknown, joinLedger?: unknown }} */ (record || {});
  if (rec.targetId == null) return null;
  const anchor = /** @type {{ originAttackerId?: unknown, enemyId?: unknown, sourceCauseTypes?: unknown }} */ (
    Array.isArray(rec.joinLedger) && rec.joinLedger.length === 1 ? rec.joinLedger[0] || {} : {}
  );
  if (anchor.originAttackerId != null && anchor.enemyId != null) {
    const sourced = Array.isArray(anchor.sourceCauseTypes) ? anchor.sourceCauseTypes : [];
    const types = sourced.map(warReasonOrNull).filter(/** @returns {t is string} */ (/** @type {string|null} */ t) => t != null).sort(codepoint);
    return {
      attackerId: String(anchor.originAttackerId),
      defenderId: String(anchor.enemyId),
      reasonType: types.length ? types[0] : null,
    };
  }
  return { attackerId: String(homeId), defenderId: String(rec.targetId), reasonType: pinnedWarReasonOf(rec) };
}

/**
 * Every LIVE war on the map, named. One entry per distinct war — a coalition of
 * five armies is ONE row with five participants, not five wars — codepoint-sorted
 * by key. Returns [] when the deployments ledger is absent or empty ⇒ a dormant
 * campaign renders byte-identically.
 *
 * ⚠ THIS IS A LIVE READ AND ONLY A LIVE READ. `warDeployment.js` deletes the
 * deployment row at war end, so a concluded war leaves this list the tick it ends.
 * ⭐ THE RECORD THIS NOTE ONCE SAID DID NOT EXIST NOW DOES: W-MEM's
 * `worldState.concludedWars` is that durable shape, and its reader is
 * `display/warRemembrance.js`. The two are deliberately separate surfaces — this one
 * names wars that are being fought, that one names wars that are over — and they
 * share the naming deriver below so a war keeps its name across the boundary.
 *
 * @param {Object} args
 * @param {unknown} [args.worldState]
 * @param {(id: unknown) => string} [args.nameFor]
 * @returns {Array<{ key: string, name: string, line: string, reasonType: string|null, attackerId: string, defenderId: string, participants: string[] }>}
 */
export function liveWarNames({ worldState, nameFor = (id) => String(id) } = {}) {
  const state = /** @type {{ deployments?: unknown }} */ (worldState || {});
  const deployments = /** @type {Record<string, unknown>} */ (
    state.deployments && typeof state.deployments === 'object' ? state.deployments : {}
  );
  /** @type {Map<string, { attackerId: string, defenderId: string, reasonType: string|null, participants: Set<string> }>} */
  const wars = new Map();
  for (const homeId of Object.keys(deployments).sort(codepoint)) {
    const origin = originWarOf(homeId, deployments[homeId]);
    if (!origin) continue;
    const key = warNameKey(origin);
    const existing = wars.get(key);
    if (existing) existing.participants.add(String(homeId));
    else wars.set(key, { ...origin, participants: new Set([String(homeId)]) });
  }
  return [...wars.keys()].sort(codepoint).map((key) => {
    const war = /** @type {{ attackerId: string, defenderId: string, reasonType: string|null, participants: Set<string> }} */ (wars.get(key));
    const named = deriveWarName({ ...war, nameFor });
    return {
      key: named.key,
      name: named.name,
      line: named.line,
      reasonType: named.reasonType,
      attackerId: war.attackerId,
      defenderId: war.defenderId,
      participants: [...war.participants].sort(codepoint),
    };
  });
}

// ── ROAD NAMES ───────────────────────────────────────────────────────────────
// The closed route-mode vocabulary, MIRRORED from `USER_ROUTE_MODES`
// (src/domain/roads/userRoutes.js) rather than imported: that module statically
// imports the frozen-digest reader, and a display leaf must not re-open the
// first-paint defect. Pinned against the real vocabulary by test. Anything
// outside this pair — notably the `sea` spelling used by MissionRec.legModes and
// the RoadsLayer style key — is REFUSED, never renamed.
const ROUTE_MODE_LAND = 'land';
const ROUTE_MODE_WATER = 'water';

// Named for the far end (the `{dest}` idiom kept), and for the pair when the
// reader has no standpoint. Index 0 is the canonical telling in each pool.
/** @type {Readonly<Record<string, { addressed: readonly ((interp: Record<string, unknown>) => string)[], paired: readonly ((interp: Record<string, unknown>) => string)[] }>>} */
export const ROUTE_NAME_POOLS = Object.freeze({
  [ROUTE_MODE_LAND]: Object.freeze({
    addressed: Object.freeze([
      (/** @type {Record<string, unknown>} */ x) => `the ${String(x.dest)} road`,
      (/** @type {Record<string, unknown>} */ x) => `the road to ${String(x.dest)}`,
      (/** @type {Record<string, unknown>} */ x) => `the ${String(x.dest)} way`,
      (/** @type {Record<string, unknown>} */ x) => `the carters' road to ${String(x.dest)}`,
    ]),
    paired: Object.freeze([
      (/** @type {Record<string, unknown>} */ x) => `the ${String(x.a)}–${String(x.b)} road`,
      (/** @type {Record<string, unknown>} */ x) => `the road between ${String(x.a)} and ${String(x.b)}`,
      (/** @type {Record<string, unknown>} */ x) => `the ${String(x.a)}–${String(x.b)} way`,
    ]),
  }),
  [ROUTE_MODE_WATER]: Object.freeze({
    addressed: Object.freeze([
      (/** @type {Record<string, unknown>} */ x) => `the ${String(x.dest)} crossing`,
      (/** @type {Record<string, unknown>} */ x) => `the crossing to ${String(x.dest)}`,
      (/** @type {Record<string, unknown>} */ x) => `the ${String(x.dest)} passage`,
      (/** @type {Record<string, unknown>} */ x) => `the water road to ${String(x.dest)}`,
    ]),
    paired: Object.freeze([
      (/** @type {Record<string, unknown>} */ x) => `the ${String(x.a)}–${String(x.b)} crossing`,
      (/** @type {Record<string, unknown>} */ x) => `the crossing between ${String(x.a)} and ${String(x.b)}`,
      (/** @type {Record<string, unknown>} */ x) => `the ${String(x.a)}–${String(x.b)} passage`,
    ]),
  }),
});

/** How a route is travelled, in world words. @type {Readonly<Record<string, string>>} */
const ROUTE_MODE_CLAUSES = Object.freeze({
  [ROUTE_MODE_LAND]: 'overland',
  [ROUTE_MODE_WATER]: 'by water',
});

// The row's own closed reach band, rendered as a HAUL. The band is a typed word
// on the record (`USER_ROUTE_REACH_BANDS`), never the integer cost behind it, and
// an unknown/absent band simply drops the clause rather than guessing one.
/** @type {Readonly<Record<string, string>>} */
const ROUTE_HAUL_CLAUSES = Object.freeze({
  close: 'a short haul',
  steady: 'a steady haul',
  long: 'a long haul',
  arduous: 'a hard haul',
});

/**
 * Name ONE chartered route from its durable provenance row
 * (`config._userRoutes[]` — `{ routeId, a, b, mode, createdTick, band }`).
 *
 * Returns NULL rather than a name when the row is unusable: a missing endpoint, or
 * a mode outside the route vocabulary. The second is deliberate — the `sea` legs of
 * the mission/layer vocabularies must surface as UNNAMED, not as a road.
 *
 * @param {Object} args
 * @param {unknown} args.row  one `config._userRoutes` provenance row.
 * @param {unknown} [args.fromId]  the end the reader is standing at; omit for the pair form.
 * @param {(id: unknown) => string} [args.nameFor]
 * @returns {{ routeId: string, mode: string, name: string, line: string, aName: string, bName: string } | null}
 */
export function deriveRouteName({ row, fromId, nameFor = (id) => String(id) }) {
  const r = /** @type {{ routeId?: unknown, a?: unknown, b?: unknown, mode?: unknown, band?: unknown }} */ (row || {});
  if (r.a == null || r.b == null) return null;
  const mode = String(r.mode);
  if (mode !== ROUTE_MODE_LAND && mode !== ROUTE_MODE_WATER) return null;
  const [low, high] = orderedPair(r.a, r.b);
  const routeId = r.routeId != null ? String(r.routeId) : `route.${low}.${high}.${mode}`;
  const pools = ROUTE_NAME_POOLS[mode];
  const standpoint = fromId == null ? null : String(fromId);
  const far = standpoint === low ? high : (standpoint === high ? low : null);
  const name = far != null
    ? pickLine(pools.addressed, `${routeId}>${standpoint}`, { dest: nameFor(far) })
    : pickLine(pools.paired, routeId, { a: nameFor(low), b: nameFor(high) });
  const aName = nameFor(low);
  const bName = nameFor(high);
  const haul = ROUTE_HAUL_CLAUSES[String(r.band)] || null;
  const modeClause = ROUTE_MODE_CLAUSES[mode];
  const line = haul
    ? `${name}: ${aName} to ${bName}, ${modeClause}, ${haul}.`
    : `${name}: ${aName} to ${bName}, ${modeClause}.`;
  return { routeId, mode, name, line, aName, bName };
}

/**
 * Every hand-chartered route a settlement carries, named. Reads the durable
 * provenance ledger on the settlement's config twins and nothing else; a
 * settlement that never charted a road yields [] ⇒ byte-identical off-state.
 * Codepoint-sorted by routeId. Rows the vocabulary refuses are DROPPED, so an
 * unnameable leg is absent rather than misnamed.
 *
 * ⛔ A SETTLEMENT, NOT A SNAPSHOT ITEM. An earlier draft also unwrapped a worldPulse
 * `{ settlement }` item, and the reader-with-no-writer ratchet was right to red it: a
 * `.settlement` read on a settlement is a dead arm on every generated world. A caller
 * holding an item passes `item.settlement`.
 *
 * @param {Object} args
 * @param {unknown} args.settlement  the SETTLEMENT carrying the provenance ledger.
 * @param {unknown} [args.fromId]  the standpoint; defaults to the settlement's own id.
 * @param {(id: unknown) => string} [args.nameFor]
 * @returns {Array<{ routeId: string, mode: string, name: string, line: string, aName: string, bName: string }>}
 */
export function chartedRouteNames({ settlement, fromId, nameFor = (id) => String(id) }) {
  const s = /** @type {{ id?: unknown, config?: unknown, _config?: unknown }} */ (settlement || {});
  const config = /** @type {{ _userRoutes?: unknown }} */ (s.config || s._config || {});
  const rows = Array.isArray(config._userRoutes) ? config._userRoutes : [];
  const standpoint = fromId != null ? fromId : s.id;
  /** @type {Array<{ routeId: string, mode: string, name: string, line: string, aName: string, bName: string }>} */
  const out = [];
  for (const row of rows) {
    const named = deriveRouteName({ row, fromId: standpoint, nameFor });
    if (named) out.push(named);
  }
  return out.sort((a, b) => codepoint(a.routeId, b.routeId));
}
