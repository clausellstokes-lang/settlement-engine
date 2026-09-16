/**
 * domain/display/engagementNarrative.js — THE BATTLE-KIND TAXONOMY, AND WHAT CAN
 * HONESTLY BE SAID ABOUT ONE.
 *
 * WEAVE NAME-3 (DESIGN_FMG_WEAVE A2.1), landed as enrichment of the existing
 * `warStatus.js` / `armyStrength.js` display family rather than as a new surface.
 * The engine already resolves seven kinds of engagement and narrates each one with
 * a SINGLE hardcoded headline and summary minted at tick. Those bytes persist, so
 * they are not this lane's to touch. What is missing is the second telling — the
 * one a chronicler writes afterwards, varying over the facts the record actually
 * kept — and that is what this leaf derives, at render time, writing nothing.
 *
 * ⛔ THIS LANE PERSISTS NOTHING, AND THAT DECIDES THE HARDEST QUESTION IN IT.
 * The obvious ask was a persisted `region` on the field-battle entry. It is
 * OWNER-GATED (the shrunken Q-W4 form) and is not taken here. Until it is granted,
 * a field-battle narrative may use ONLY record-standing facts.
 *
 * ── THE PLACE RULE (the load-bearing find, and it corrects the charter) ──────
 * A2.1 assumed field battles "carry `battle.region`". They do not: `region` exists
 * at MINT time only and is consumed by baking a DISPLAY NAME into `reasons[0]`;
 * the persisted entry has no `region` key, and `settlementIds` are the two
 * COMBATANTS, not the location. Reverse-mapping a name out of prose would be
 * parsing our own sentence back into a fact, which is worse than silence.
 *
 * So the rule this file enforces is simple and checkable: TERRAIN IS DERIVABLE
 * EXACTLY WHEN THE ENGAGEMENT HAS A PLACE ON THE RECORD.
 *   conquest / siege_lifted   → the besieged town (targetSaveId / targetId)   ✓
 *   blockade_declared/_lifted → the blockaded port (settlementIds[1])         ✓
 *   intervention_clash        → the CONTESTED SEAT (settlementIds[2])         ✓
 *   field_battle              → nothing. Two columns met on a road.           ✗
 *   sea_battle                → nothing. `region` is dropped at emit here too. ✗
 * ⭐ The third row is the discovery: `intervention_clash` is the ONE field-class
 * engagement that already carries its place, because the whole point of an
 * intervention clash is the seat both interveners were converging on. It has been
 * narratable all along and nobody had looked.
 * Where there is no place, the narrative SAYS there is none ("no town's fields, no
 * walls") rather than implying one. That is also what keeps it consistent with the
 * fogged rumor register, which says only "a battle in the field".
 *
 * ── ONE TERRAIN VOCABULARY, NEVER TWO ───────────────────────────────────────
 * This estate carries two terrain vocabularies that never shared a type:
 * `resolveTerrain.js`'s SEVEN canonical classes (plains | hills | forest |
 * riverside | coastal | mountain | desert) and `spatialCost.js`'s `terrainClassOf`
 * EIGHT (water | mountain | desert | grassland | forest | tundra | glacier |
 * wetland). They overlap on three tokens, which is exactly what makes a silent mix
 * possible. This file speaks the SEVEN and only the seven, through the one terrain
 * read (`resolveSettlementTerrain`). The seven are transcribed here rather than
 * imported because their only exported list lives in `components/gallery`, and a
 * domain leaf may not reach into components; the transcription carries a DRIFT
 * GUARD in its suite, which is the house cure for exactly this shape.
 *
 * ── NO NEW BATTLE-KIND TOKEN IS MINTED, DELIBERATELY ────────────────────────
 * A new kind must be registered in THREE tables (`chroniclersLetter.KIND_SECTION`,
 * `heraldRouting.EXACT_SECTION`, `rumorPhrasePools`'s desk roster) or it falls off
 * the chronicle. This taxonomy therefore CLASSIFIES kinds the engine already mints
 * and routes; it invents none. The suite asserts the containment in both routing
 * tables, so the day someone adds an eighth member without routing it, this reds
 * instead of the chronicle quietly dropping it.
 * ⚠ RECORDED, NOT FIXED: `sea_battle` is routed by both section tables and has its
 * live rumor phrase, but is ABSENT from `rumorPhrasePools.WAR_DESK_KINDS` — it is
 * the one engagement kind the rumor-phrase retrofit never wired, so a sea battle
 * gets its single anchor phrase where its six siblings get pools. That is a content
 * wave's work (a wired kind owes an authored pool and moves the unvoiced-token
 * backlog), it is outside NAME-3's charter, and it changes reader-visible rumor
 * phrasing — so it is DELIBERATELY DEFERRED and frozen as a named exception in the
 * suite rather than left to be rediscovered.
 * ⚠ TWO DELIBERATE EXCLUSIONS: `razing` is a terminal act against a town rather
 * than a contest of arms, and it is absent from the letter's own section table
 * anyway; `hostile_raid` is a raid on a settlement, not an engagement between
 * hosts. Neither is a gap.
 *
 * ── LAW CLAUSES ─────────────────────────────────────────────────────────────
 * PRESENTATION ONLY. Nothing mutates worldState, forks rng, or reads a wall clock.
 * EVERY NARRATED FACT STANDS IN THE RECORD. No strength, no roll, no capacity, no
 * tick reaches any string; the phase vocabularies are closed and per-kind.
 * INERT, NOT CRASH, WHEN ABSENT. A non-engagement entry ⇒ null; a dormant campaign
 * ⇒ []. FIRST-PAINT SAFE: this leaf imports only the zero-import terrain read and
 * the light `warStatus` projection — nothing here reaches `militaryStrength`, which
 * is the constraint `WarFaithTab` recorded (its own comment is stale in two ways:
 * `warStatus.js` does import `warFrontReads` now, and the constraint is about first
 * paint, not the PDF worker).
 * DETERMINISM. Every list output is codepoint-sorted.
 * Strict-clean (typecheck:domain:strict). No React/Zustand imports.
 */

import { resolveSettlementTerrain } from '../resolveTerrain.js';
import { liveSieges } from './warStatus.js';

/** @param {unknown} a @param {unknown} b @returns {number} */
const codepoint = (a, b) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);

/**
 * THE BATTLE-KIND TAXONOMY. Seven kinds the engine already mints and routes, in
 * four classes. Every member is registered in both section tables today; the suite
 * holds that, so this map can never grow a token the chronicle would drop.
 * @type {Readonly<Record<string, 'siege'|'field'|'naval'|'blockade'>>}
 */
export const ENGAGEMENT_KINDS = Object.freeze({
  blockade_declared: 'blockade',
  blockade_lifted: 'blockade',
  conquest: 'siege',
  field_battle: 'field',
  intervention_clash: 'field',
  sea_battle: 'naval',
  siege_lifted: 'siege',
});

/** The four engagement classes, codepoint-ordered. */
export const ENGAGEMENT_CLASSES = Object.freeze(['blockade', 'field', 'naval', 'siege']);

/**
 * The SEVEN canonical terrain classes in world words. Keys are `resolveTerrain.js`'s
 * vocabulary verbatim — transcribed, not imported, because the only exported list
 * sits in `components/gallery/galleryUtils.js` and domain may not reach into
 * components. The transcription is drift-guarded against that list by test.
 * ⛔ Not one of `spatialCost.terrainClassOf`'s exclusive tokens (water, grassland,
 * tundra, glacier, wetland) may ever appear here.
 * @type {Readonly<Record<string, string>>}
 */
export const TERRAIN_WORDS = Object.freeze({
  plains: 'open country',
  hills: 'broken hill country',
  forest: 'close forest',
  riverside: 'river country',
  coastal: 'shore country',
  mountain: 'mountain country',
  desert: 'dry country',
});

/**
 * The closed PER-KIND phase sequence — the shape an engagement of this kind takes,
 * in order, in world words. These are not events the record holds one by one; they
 * are the known ARC of that kind of fighting, which is why they are authored per
 * kind and never interpolated with a fact.
 * @type {Readonly<Record<string, readonly string[]>>}
 */
export const ENGAGEMENT_PHASES = Object.freeze({
  conquest: Object.freeze([
    'the lines close around the walls',
    'the fields outside are eaten bare',
    'the walls are tried',
    'the gate gives, and the town changes hands',
  ]),
  siege_lifted: Object.freeze([
    'the lines close around the walls',
    'the fields outside are eaten bare',
    'the besiegers run short before the besieged do',
    'the camp is struck and the road home taken',
  ]),
  field_battle: Object.freeze([
    'two columns on the march sight each other',
    'the lines are dressed where they stand',
    'the shock, and then the pushing',
    'one column gives ground and falls back to regroup',
  ]),
  intervention_clash: Object.freeze([
    'two foreign columns converge on the same seat',
    'neither will yield the approach to the other',
    'the shock, in country belonging to neither',
    'the survivor walks on to the contest alone',
  ]),
  sea_battle: Object.freeze([
    'sails are sighted across the lane',
    'the weather gauge is fought for',
    'the grapples go over and the decks are taken',
    'the beaten fleet runs for its own water',
  ]),
  blockade_declared: Object.freeze([
    'the fleet takes station off the approaches',
    'the harbour trade stops',
    'the warehouses are counted, and then the granaries',
    'the town learns what it cannot make itself',
  ]),
  blockade_lifted: Object.freeze([
    'the fleet stands down from the approaches',
    'the first hulls come in on the tide',
    'the harbour trade finds its old rhythm',
    'the town stops counting',
  ]),
});

/**
 * How each KIND opens its telling — per kind rather than per class, because a
 * blockade laid and a blockade lifted are the same class and opposite acts, and so
 * are a town stormed and a siege abandoned. `a` and `b` are the two parties in the
 * record's own order; the place clause and the fog clause are appended by the
 * composer when the record holds them.
 * @type {Readonly<Record<string, (a: string, b: string) => string>>}
 */
const KIND_OPENINGS = Object.freeze({
  conquest: (/** @type {string} */ a, /** @type {string} */ b) => `${a}'s army came over ${b}'s walls`,
  siege_lifted: (/** @type {string} */ a, /** @type {string} */ b) => `${a}'s army broke camp before ${b}'s walls`,
  field_battle: (/** @type {string} */ a, /** @type {string} */ b) => `${a}'s and ${b}'s columns met on the march`,
  intervention_clash: (/** @type {string} */ a, /** @type {string} */ b) => `${a}'s and ${b}'s columns collided on the same errand`,
  sea_battle: (/** @type {string} */ a, /** @type {string} */ b) => `${a}'s and ${b}'s war fleets met on the sea lanes`,
  blockade_declared: (/** @type {string} */ a, /** @type {string} */ b) => `${a}'s fleet closed ${b}'s sea approaches`,
  blockade_lifted: (/** @type {string} */ a, /** @type {string} */ b) => `${a}'s fleet stood down from ${b}'s sea approaches`,
});

/** The honest sentence for an engagement the record gives no place.
 * @type {Readonly<Record<string, string>>} */
const PLACELESS_CLAUSE = Object.freeze({
  field: "no town's fields and no walls, only the road both were already on",
  naval: 'open water, with no coast either fleet could name as its own',
});

/** The fogged register, minted only when the record carries the `fought_blind` tag. */
const FOG_CLAUSE = 'and one side fought half-blind, its couriers home cut';

/**
 * Coalition sizes in world words. A besieging coalition is bounded by alliance webs
 * in practice; past twelve the chronicler says "many", which is what a chronicler
 * would say rather than counting on.
 * @type {Readonly<Record<string, string>>}
 */
const COALITION_WORDS = Object.freeze({
  2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six',
  7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve',
});

/**
 * The settlement (or snapshot item) behind an id. Tolerates the `byId` Map shape
 * worldPulse snapshots use, a plain `settlements[]` array, and an explicit lookup.
 * Returns null rather than throwing when the world does not know the id.
 * @param {unknown} snapshot
 * @param {unknown} id
 * @param {((id: unknown) => unknown)|undefined} settlementFor
 * @returns {unknown}
 */
function itemFor(snapshot, id, settlementFor) {
  if (id == null) return null;
  if (typeof settlementFor === 'function') return settlementFor(id) || null;
  const snap = /** @type {{ byId?: { get?: (k: string) => unknown }, settlements?: unknown }} */ (snapshot || {});
  if (snap.byId && typeof snap.byId.get === 'function') return snap.byId.get(String(id)) || null;
  if (Array.isArray(snap.settlements)) {
    return snap.settlements.find((/** @type {{ id?: unknown }} */ s) => String(s?.id) === String(id)) || null;
  }
  return null;
}

/**
 * The PLACE an engagement of this kind stands on, read off the record only. Null
 * for the two kinds that genuinely carry none — never a guess, never a name parsed
 * back out of the minted prose.
 * @param {string} kind
 * @param {{ settlementIds?: unknown, targetId?: unknown, targetSaveId?: unknown }} entry
 * @returns {string|null}
 */
function placeIdOf(kind, entry) {
  const ids = Array.isArray(entry.settlementIds) ? entry.settlementIds.map(String) : [];
  if (kind === 'conquest' || kind === 'siege_lifted') {
    if (entry.targetSaveId != null) return String(entry.targetSaveId);
    if (entry.targetId != null) return String(entry.targetId);
    return ids.length ? ids[ids.length - 1] : null;
  }
  if (kind === 'blockade_declared' || kind === 'blockade_lifted') {
    if (entry.targetId != null) return String(entry.targetId);
    return ids.length > 1 ? ids[1] : null;
  }
  // The one field-class engagement that already carries its place: the contested
  // seat both interveners were converging on, third in the record's own order.
  if (kind === 'intervention_clash') return ids.length > 2 ? ids[2] : null;
  return null;
}

/**
 * The two PARTIES to an engagement, in the record's own order (the minters all
 * write `[winner, loser]` or `[owner, target]`). Never re-sorted: the order IS a
 * record-standing fact and sorting it would destroy the one thing it says.
 * @param {{ settlementIds?: unknown }} entry
 * @returns {[string|null, string|null]}
 */
function partiesOf(entry) {
  const ids = Array.isArray(entry.settlementIds) ? entry.settlementIds.map(String) : [];
  return [ids[0] != null ? ids[0] : null, ids[1] != null ? ids[1] : null];
}

/**
 * The engagement kind an entry declares, or null when it is not an engagement.
 * Reads the three spellings the producers actually use: `impactKind` (the five
 * minted news kinds), `candidateType` (the conquest power-transfer outcome), and a
 * bare `kind` for a caller that already normalised.
 * @param {unknown} entry
 * @returns {string|null}
 */
export function engagementKindOf(entry) {
  const e = /** @type {{ impactKind?: unknown, candidateType?: unknown, kind?: unknown }} */ (entry || {});
  for (const raw of [e.impactKind, e.candidateType, e.kind]) {
    const token = raw == null ? '' : String(raw);
    if (Object.prototype.hasOwnProperty.call(ENGAGEMENT_KINDS, token)) return token;
  }
  return null;
}

/**
 * THE DERIVER. The chronicler's telling of one engagement, from the record alone.
 *
 * Returns null when the entry is not an engagement this taxonomy covers — so a
 * caller may pass the whole news feed through it and keep what comes back.
 *
 * @param {Object} args
 * @param {unknown} [args.entry]  a minted news entry or power-transfer outcome.
 * @param {unknown} [args.snapshot]  the world snapshot, for the terrain read.
 * @param {(id: unknown) => unknown} [args.settlementFor]  explicit lookup, overrides the snapshot.
 * @param {(id: unknown) => string} [args.nameFor]
 * @returns {{ kind: string, engagementClass: string, placeId: string|null, terrain: string|null,
 *   terrainWord: string|null, parties: string[], fogged: boolean, phases: readonly string[], line: string } | null}
 */
export function deriveEngagementNarrative({ entry, snapshot, settlementFor, nameFor = (id) => String(id) } = {}) {
  const kind = engagementKindOf(entry);
  if (!kind) return null;
  const row = /** @type {{ settlementIds?: unknown, targetId?: unknown, targetSaveId?: unknown, tags?: unknown }} */ (entry || {});
  const engagementClass = ENGAGEMENT_KINDS[kind];
  const [firstId, secondId] = partiesOf(row);
  const placeId = placeIdOf(kind, row);
  const terrain = placeId != null
    ? resolveSettlementTerrain(itemFor(snapshot, placeId, settlementFor))
    : null;
  const terrainWord = terrain != null && Object.prototype.hasOwnProperty.call(TERRAIN_WORDS, terrain)
    ? TERRAIN_WORDS[terrain]
    : null;
  const tags = Array.isArray(row.tags) ? row.tags.map(String) : [];
  const fogged = tags.includes('fought_blind');

  const a = firstId != null ? nameFor(firstId) : 'one host';
  const b = secondId != null ? nameFor(secondId) : 'another';
  const opening = KIND_OPENINGS[kind](a, b);

  // THE PLACE CLAUSE, in the three shapes the record can support. A place that is
  // one of the PARTIES is already named by the opening, so only its ground is
  // added; a place that is a THIRD party (the contested seat of an intervention
  // clash) has to be named as well; and where the record holds no place at all the
  // sentence says so rather than implying one.
  const placeIsAParty = placeId != null && (placeId === firstId || placeId === secondId);
  /** @type {string} */
  let placeClause = '';
  if (placeId != null && placeIsAParty) placeClause = terrainWord ? `, in ${terrainWord}` : '';
  else if (placeId != null) placeClause = terrainWord ? `, over ${nameFor(placeId)} in ${terrainWord}` : `, over ${nameFor(placeId)}`;
  else if (PLACELESS_CLAUSE[engagementClass]) placeClause = ` — ${PLACELESS_CLAUSE[engagementClass]}`;

  const phases = ENGAGEMENT_PHASES[kind];
  const closing = phases[phases.length - 1].replace(/^./, (c) => c.toUpperCase());
  const line = `${opening}${placeClause}${fogged ? `, ${FOG_CLAUSE}` : ''}. ${closing}.`;

  return {
    kind,
    engagementClass,
    placeId,
    terrain,
    terrainWord,
    parties: [firstId, secondId].filter((/** @type {string|null} */ id) => id != null).map(String),
    fogged,
    phases,
    line,
  };
}

/**
 * Every LIVE siege on the map, narrated. Reads `warStatus.liveSieges` — the same
 * single-source siege gate the engine uses — and derives each besieged town's
 * terrain through the one terrain read, so a live siege is narratable with ZERO new
 * persisted bytes. Codepoint-sorted by target; [] when nothing is besieged.
 *
 * The coalition is the STORY, exactly as `liveSieges` intends: a single besieger
 * reads as one host at the walls, several read as a coalition, and the count is
 * given in world words because a coalition size is a thing a chronicler counts.
 *
 * @param {Object} args
 * @param {unknown} [args.worldState]
 * @param {unknown} [args.regionalGraph]
 * @param {unknown} [args.snapshot]
 * @param {(id: unknown) => unknown} [args.settlementFor]
 * @param {(id: unknown) => string} [args.nameFor]
 * @returns {Array<{ targetId: string, terrain: string|null, terrainWord: string|null, besiegers: string[], phases: readonly string[], line: string }>}
 */
export function liveSiegeNarratives({ worldState, regionalGraph, snapshot, settlementFor, nameFor = (id) => String(id) } = {}) {
  const sieges = liveSieges({ worldState, regionalGraph });
  return sieges.map((siege) => {
    const terrain = resolveSettlementTerrain(itemFor(snapshot, siege.targetId, settlementFor));
    const terrainWord = terrain != null && Object.prototype.hasOwnProperty.call(TERRAIN_WORDS, terrain)
      ? TERRAIN_WORDS[terrain]
      : null;
    const besiegers = [...siege.coalition].sort(codepoint);
    const target = nameFor(siege.targetId);
    const who = besiegers.length === 1
      ? `${nameFor(besiegers[0])}'s army`
      : `a coalition of ${COALITION_WORDS[String(besiegers.length)] || 'many'} realms`;
    const opening = `${who} sits before ${target}'s walls`.replace(/^./, (c) => c.toUpperCase());
    const ground = terrainWord ? `, in ${terrainWord}` : '';
    const phases = ENGAGEMENT_PHASES.conquest;
    return {
      targetId: siege.targetId,
      terrain,
      terrainWord,
      besiegers,
      phases,
      line: `${opening}${ground}. ${phases[0].replace(/^./, (c) => c.toUpperCase())}.`,
    };
  }).sort((x, y) => codepoint(x.targetId, y.targetId));
}
