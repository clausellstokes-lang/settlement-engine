/**
 * domain/display/forceComposition.js — WHAT THE HOST IS MADE OF, read off the
 * record the army already carries.
 *
 * WEAVE NAME-4 (DESIGN_FMG_WEAVE A2.1). `armyStrength.js` answers "how strong is
 * this army and how worn is it"; nothing in the tree answers "what marched out".
 * A DM can be told a realm fields "a formidable host" and still has no idea
 * whether that is spearmen and a baggage train or men-at-arms and heavy horse.
 * This clerk mints the FIRST unit-type vocabulary this codebase has ever had
 * (`forceComposition` / `unitType` / `UNIT_TYPES` were all zero hits at base) and
 * derives a typed composition on read. It writes nothing, ever.
 *
 * ── §746.2 IS SATISFIED BY CONSTRUCTION, NOT BY DISCIPLINE ───────────────────
 * "Composition is derived FROM strength and NEVER feeds it." The clerk reads the
 * DEPLOYMENT RECORD, and that record is itself a one-hop projection of the six
 * strength facets (`warArmyRecord.js` seeds manpower/supply/morale/equipment/
 * magic/command straight off `cap.facets`). So the arrow can only point one way:
 * there is no path from anything here back into `militaryStrength`, because this
 * module exports pure functions of a record and nothing imports it engine-side.
 * The facet→role correspondence below is the record's OWN, reused rather than
 * re-invented — the same reason the bands mirror `armyStrength`'s cuts.
 *
 * ── THE COUNT IS OF CONTINGENTS, AND THAT IS A DELIBERATE REFUSAL ────────────
 * `currentEffectiveStrength` is a 0..100 CAPACITY figure, not a headcount. Turning
 * it into "1,400 spearmen" would be fabrication of the plainest kind — the engine
 * has never modelled a man. So the unit of account is the CONTINGENT (a company,
 * a troop, a train), which is a real medieval unit and one the record can honestly
 * support: the TOTAL bands off effective strength through the SAME floors
 * `armyStrength.STRENGTH_BANDS` uses (78/60/42/26/0), so the words a DM hears and
 * the contingents they count can never disagree about how big the army is.
 *
 * ── THIS FILE DEPARTS FROM THE HOUSE NO-DIGIT-LEAK TEST, ON PURPOSE ──────────
 * Every sibling display selector is pinned by `expect(phrase).not.toMatch(/\d/)`.
 * `deriveForceComposition` returns INTEGERS by design — that is its whole charter
 * (`{ type: count }`), so that assertion cannot apply to it and must not be
 * smuggled in by returning bands instead. The invariants that replace it are
 * pinned in its suite instead:
 *   (i)  every returned key is a member of the frozen UNIT_TYPES vocabulary;
 *   (ii) the counts sum EXACTLY to the banded total, for every reachable input.
 * The prose half (`forceCompositionLine`) is held to the ordinary law: the counts
 * reach the reader as NUMBER WORDS from a closed table, so no digit and no engine
 * scalar appears in any string this file mints.
 *
 * ── TWO TYPES THAT COULD HAVE BEEN FABRICATED, AND WERE NOT ──────────────────
 * `marines` IS DROPPED. There is no record-side signal for it at all: the
 * deployment record knows nothing about water, and `worldState.navalTransit` is a
 * separate ledger. The only real classifier is `NAVAL_INSTITUTION_PATTERN` behind
 * the spatial naval layer, whose import a display clerk has no business carrying
 * (it reaches embattlement, armyTransit and cohesionWeave). A marine contingent
 * is a naval-layer read and belongs to the naval display family if it is ever
 * wanted; inventing one here from a port flag would have been the fabrication the
 * charter forbids.
 * `war_mages` is GATED, not assumed. Magic is not a given in this estate: the gate
 * is `deriveMagicProfile().roles.military`, the ONE authority for whether a realm's
 * magic has a military role, and it already carries the `config.magicExists ===
 * false` hard-zero (a dead-magic world returns every role 'absent'). Only the
 * SIZE comes from the record, through its own `magicSupport` facet. One question,
 * one authority, each — a second magic gate here would be the shape that gives a
 * shared field a different meaning at every consumer.
 *
 * ⚠ LAZY / PDF-SIDE ONLY. `deriveMagicProfile` reaches faction profiles, the
 * institution roster, causal state and the capacity model. This module is
 * therefore NOT first-paint safe, exactly as `armyStrength.js` is not (it imports
 * `militaryStrength`). The house precedent for a display leaf importing it is
 * `display/dossierViewModel.js`. Do not import this module from a first-paint
 * surface.
 *
 * ── LAW CLAUSES ─────────────────────────────────────────────────────────────
 * PRESENTATION ONLY. Nothing mutates worldState, forks rng, or reads a wall clock.
 * INERT, NOT CRASH, WHEN ABSENT. No record ⇒ null. `readiness` is CONDITIONALLY
 * ABSENT on the record (omitted at 0) and is defaulted to 0, which reproduces the
 * pre-W-F8 composition exactly rather than guessing a drill level.
 * DETERMINISM. Apportionment ties break by codepoint, so no key order can move a
 * count. Total, pure, no rng.
 * Strict-clean (typecheck:domain:strict). No React/Zustand imports.
 */

import { clamp01 } from '../../kernel/math.js';
import { deriveMagicProfile, magicRoleBands } from '../magicProfile.js';
import { numberWord } from './numberWords.js';

/** @param {unknown} a @param {unknown} b @returns {number} */
const codepoint = (a, b) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);
// ⛔ `num()` IS NOT REDUNDANT NOW THAT THE KERNEL CLAMP IS IMPORTED — DO NOT DELETE IT
// AS TIDY-UP. The local clamp01 this replaced carried `num()` INSIDE itself, so it
// coerced a numeric string (`'0.5'` → 0.5); the kernel's `Number.isFinite` guard sends
// the same string to 0 instead. What makes the swap byte-neutral is that every call
// site already wraps its raw record read in `num(record.x, default)` FIRST, so the
// kernel clamp only ever sees a finite number. Remove one of those wrappers and that
// field silently starts reading 0 on any non-number the record happens to hold.
/** @param {unknown} v @param {number} [d] @returns {number} */
const num = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);

/**
 * THE CLOSED UNIT-TYPE VOCABULARY — minted here, spelled exactly once, ordered by
 * codepoint so the roster reads the same everywhere. `war_mages` is conditional on
 * the magic gate; every other member is derivable from a stateful record alone.
 * A seventh type may only be added with an authored weight row and a name word.
 */
export const UNIT_TYPES = Object.freeze([
  'baggage_train',
  'bowmen',
  'heavy_horse',
  'levy_spears',
  'men_at_arms',
  'siege_crew',
  'war_mages',
]);

/**
 * THE AUTHORED WEIGHT TABLE. Each row is a share weight over the deployment
 * record's OWN facets — the six the record already carries, in the correspondence
 * `warArmyRecord.js` seeded them by. Nothing here is tuned against an outcome;
 * these are authored proportions, and they move no engine number because nothing
 * engine-side reads this file.
 *
 *   levy_spears   the mass a realm can raise → manpower, and nothing else.
 *   bowmen        militia shot: numbers that will stand → manpower + morale.
 *   men_at_arms   the drilled professional core → command (the institutions
 *                 facet), stiffened by kit, and LIFTED BY READINESS when the
 *                 record carries it (absent ⇒ contributes nothing ⇒ the
 *                 pre-W-F8 composition, byte-identical).
 *   heavy_horse   the expensive arm → kit first, command second.
 *   siege_crew    engineers and the train that serves them → command + kit,
 *                 damped hard when the army did not march to take a place.
 *   baggage_train the supply column → supply integrity + food reserve.
 *   war_mages     gated by the magic profile's MILITARY role; sized by the
 *                 record's own magicSupport facet.
 */
const UNIT_WEIGHTS = Object.freeze({
  levy_spears: Object.freeze({ manpower: 1 }),
  bowmen: Object.freeze({ manpower: 0.34, morale: 0.26 }),
  men_at_arms: Object.freeze({ commandQuality: 0.34, equipmentCondition: 0.14 }),
  heavy_horse: Object.freeze({ equipmentCondition: 0.24, commandQuality: 0.16 }),
  siege_crew: Object.freeze({ commandQuality: 0.18, equipmentCondition: 0.18 }),
  baggage_train: Object.freeze({ supplyIntegrity: 0.22, foodReserve: 0.22 }),
});

/** Readiness lifts the professional core and nothing else. Absent ⇒ 0. */
const READINESS_LIFT_ON_MEN_AT_ARMS = 0.4;
/** An army that did not march to take a place still carries engineers, but few. */
const SIEGE_CREW_FIELD_DAMPING = 0.35;

/**
 * The magic role band → share weight for a mage contingent. 'absent' is not a
 * small share, it is NO contingent: the type never appears. Ranked against
 * `magicRoleBands()` so a widened ladder reds rather than defaulting to silence.
 *
 * ⭐ THE BANDS ARE MEASURED TO BE DISTINGUISHABLE, not merely ordered. A weight
 * table can be monotone and still collapse under apportionment — an 'integral'
 * realm and a 'common' one both rounding to one circle would make the top band a
 * word with no drawing behind it, which is the "taught but never drawn" failure
 * this estate has been bitten by. Measured against a 24-contingent host at
 * magicSupport 0.5: integral fields two circles, common one, occasional none —
 * and occasional STILL reaches one when the army's own magic support runs high,
 * so no band is dead. Its suite pins the ordering rather than the figures.
 */
/** @type {Readonly<Record<string, number>>} */
const MAGIC_ROLE_WEIGHTS = Object.freeze({
  absent: 0,
  occasional: 0.05,
  common: 0.15,
  integral: 0.35,
});

/**
 * How many CONTINGENTS a host of this effective strength fields. The floors are
 * `armyStrength.STRENGTH_BANDS`' floors verbatim (78/60/42/26/0), read against the
 * same 0..100 capacity axis the deployment record seeds from, so the band a DM
 * hears ("a formidable host") and the contingents they count are cut at the same
 * places. Total — every finite strength lands on a rung.
 */
const CONTINGENT_BANDS = Object.freeze([
  Object.freeze({ floor: 78, contingents: 24 }),
  Object.freeze({ floor: 60, contingents: 18 }),
  Object.freeze({ floor: 42, contingents: 12 }),
  Object.freeze({ floor: 26, contingents: 8 }),
  Object.freeze({ floor: 0, contingents: 4 }),
]);

/**
 * The banded contingent total for a 0..100 effective strength. Bands only — the
 * strength figure itself never leaves this function.
 * @param {number} effectiveStrength
 * @returns {number}
 */
export function contingentTotal(effectiveStrength) {
  const score = Math.max(0, Math.min(100, num(effectiveStrength)));
  const band = CONTINGENT_BANDS.find((b) => score >= b.floor) || CONTINGENT_BANDS[CONTINGENT_BANDS.length - 1];
  return band.contingents;
}

/**
 * The magic role band standing on a settlement, or 'absent' when magic has no
 * military role (which includes every dead-magic world, since `deriveMagicProfile`
 * returns all roles 'absent' when `config.magicExists === false`). Tolerates a
 * missing settlement and any band the profile might grow.
 * @param {unknown} settlement
 * @returns {string}
 */
function magicMilitaryBandOf(settlement) {
  if (!settlement) return 'absent';
  const profile = /** @type {{ roles?: { military?: unknown } }} */ (
    deriveMagicProfile(/** @type {never} */ (settlement))
  );
  const band = String(profile?.roles?.military || 'absent');
  return magicRoleBands().includes(band) ? band : 'absent';
}

/**
 * The share weight of every unit type for one record. Types with no weight are
 * ABSENT from the map, not zero-valued — an army with no mages has no mage row.
 * @param {Record<string, unknown>} record
 * @param {string} magicBand
 * @returns {Record<string, number>}
 */
function shareWeights(record, magicBand) {
  /** @type {Record<string, number>} */
  const facets = {
    manpower: clamp01(num(record.manpower, 0.5)),
    morale: clamp01(num(record.morale, 0.5)),
    commandQuality: clamp01(num(record.commandQuality, 0.5)),
    equipmentCondition: clamp01(num(record.equipmentCondition, 0.5)),
    supplyIntegrity: clamp01(num(record.supplyIntegrity, 0.5)),
    foodReserve: clamp01(num(record.foodReserve, 0.5)),
  };
  // CONDITIONALLY ABSENT on the record (omitted at 0) — defaulted, never guessed.
  const readiness = clamp01(num(record.readiness, 0));
  const siegeBound = String(record.objective || '') === 'conquest' || String(record.role || '') === 'siege';

  /** @type {Record<string, number>} */
  const weights = {};
  for (const type of Object.keys(UNIT_WEIGHTS).sort(codepoint)) {
    const row = /** @type {Record<string, number>} */ (UNIT_WEIGHTS[/** @type {keyof typeof UNIT_WEIGHTS} */ (type)]);
    let weight = 0;
    for (const facet of Object.keys(row).sort(codepoint)) weight += row[facet] * facets[facet];
    if (type === 'men_at_arms') weight += READINESS_LIFT_ON_MEN_AT_ARMS * readiness * facets.commandQuality;
    if (type === 'siege_crew' && !siegeBound) weight *= SIEGE_CREW_FIELD_DAMPING;
    if (weight > 0) weights[type] = weight;
  }
  const magicWeight = num(MAGIC_ROLE_WEIGHTS[magicBand], 0) * clamp01(num(record.magicSupport, 0));
  if (magicWeight > 0) weights.war_mages = magicWeight;
  return weights;
}

/**
 * Apportion `total` whole contingents across weighted types. Largest-remainder
 * (Hamilton): every type takes its floor, and the leftovers go to the largest
 * fractional parts, ties broken by CODEPOINT so no object key order can move a
 * count. The sum is EXACTLY `total` by construction — that is the invariant the
 * suite pins in place of the house no-digit assertion.
 * @param {Record<string, number>} weights
 * @param {number} total
 * @returns {Record<string, number>}
 */
function apportion(weights, total) {
  const types = Object.keys(weights).sort(codepoint);
  const sum = types.reduce((acc, type) => acc + weights[type], 0);
  if (!types.length || !(sum > 0) || total <= 0) return {};
  const exact = types.map((type) => ({ type, exact: (weights[type] / sum) * total }));
  /** @type {Record<string, number>} */
  const counts = {};
  let assigned = 0;
  for (const row of exact) {
    counts[row.type] = Math.floor(row.exact);
    assigned += counts[row.type];
  }
  const remainders = [...exact].sort((a, b) => {
    const fa = a.exact - Math.floor(a.exact);
    const fb = b.exact - Math.floor(b.exact);
    return fb - fa || codepoint(a.type, b.type);
  });
  let leftover = total - assigned;
  for (let i = 0; leftover > 0; i += 1) {
    counts[remainders[i % remainders.length].type] += 1;
    leftover -= 1;
  }
  /** @type {Record<string, number>} */
  const out = {};
  for (const type of types) if (counts[type] > 0) out[type] = counts[type];
  return out;
}

/**
 * THE CLERK. What one settlement's marched-out army is made of, as whole
 * contingents by type.
 *
 * SELF-GATING ON A STATEFUL RECORD. Returns null when there is no record, when
 * the record names no target, or when it carries no `currentEffectiveStrength` —
 * a LIGHT (legacy / hand-seeded) record has no strength to compose, and
 * `ensureStatefulRecord` enriches it on first engine contact, so reporting a
 * composition for one would be inventing an army the engine has not seeded.
 *
 * ⚠ SIGNATURE NOTE. A2.1 spelled this `deriveForceComposition(settlement,
 * deploymentRecord)`. A positional pair would be a THIRD signature shape in this
 * family (`latentStrength(item)` is positional-single; `deployedArmyStatus({...})`
 * is the named bag). The named bag is taken deliberately: it is the dominant house
 * shape, and it is the one that tolerates the magic gate's settlement argument
 * being optional. The RETURN shape the charter fixes — `{ type: count }` — is
 * unchanged.
 *
 * ⛔ A SETTLEMENT, NOT A SNAPSHOT ITEM. `deriveMagicProfile` reads `config.magicLevel`
 * and the institution roster off the settlement itself; a worldPulse `{ settlement }`
 * item carries neither, so it would silently band every realm's magic 'absent' and
 * field a mage-less army with no error. This clerk therefore takes the settlement and
 * the unwrap belongs at the call site (`item.settlement`). An earlier draft accepted
 * both and the reader-with-no-writer ratchet was right to red it: a `.settlement` read
 * on a settlement is a dead arm on every generated world, and the test that was
 * supposed to cover it passed for the wrong reason.
 *
 * @param {Object} args
 * @param {unknown} [args.settlement]  the SETTLEMENT fielding the army; omitted ⇒ no
 *   magic gate can be read ⇒ no mage contingent, never a guessed one.
 * @param {unknown} [args.record]  `worldState.deployments[homeId]`, the stateful record.
 * @returns {Record<string, number> | null}  contingents by unit type; keys ⊆ UNIT_TYPES.
 */
export function deriveForceComposition({ settlement, record } = {}) {
  const rec = /** @type {Record<string, unknown>} */ (
    record && typeof record === 'object' ? record : {}
  );
  if (rec.targetId == null) return null;
  const strength = Number(rec.currentEffectiveStrength);
  if (!Number.isFinite(strength)) return null;
  return apportion(shareWeights(rec, magicMilitaryBandOf(settlement || null)), contingentTotal(strength));
}

// ── THE PROSE HALF ───────────────────────────────────────────────────────────
// Counts reach the reader as NUMBER WORDS from a closed table, so this file mints
// no digit anywhere. The table covers 1..24, which is every value the contingent
// bands above can produce; anything outside it falls back to "several", which is
// honest rather than wrong.
//
// WEAVE SEAM-5 RE-HOMED THE TABLE. It needed the same spelling for a campaign
// settings surface, and a second copy of a twenty-four-word table is the shape the
// estate has already paid for once (six `fnv1a32` copies, now a chartered
// consolidation). The words and the function body are UNCHANGED — a re-home, not a
// re-write — so no prose this file mints has moved.

/**
 * The world word for each unit type, singular and plural. Catalog-anchored
 * generics only — never a canon proper noun, and never a rules term.
 */
const UNIT_WORDS = Object.freeze({
  levy_spears: Object.freeze({ one: 'company of spears', many: 'companies of spears' }),
  bowmen: Object.freeze({ one: 'company of bowmen', many: 'companies of bowmen' }),
  men_at_arms: Object.freeze({ one: 'company of men-at-arms', many: 'companies of men-at-arms' }),
  heavy_horse: Object.freeze({ one: 'troop of heavy horse', many: 'troops of heavy horse' }),
  siege_crew: Object.freeze({ one: 'siege crew', many: 'siege crews' }),
  baggage_train: Object.freeze({ one: 'baggage train', many: 'baggage trains' }),
  war_mages: Object.freeze({ one: 'circle of war mages', many: 'circles of war mages' }),
});

/**
 * The reading order a muster roll would use: the fighting line first, the
 * specialists behind it, the train last. Not codepoint order — a roll that opened
 * with the baggage would read as a joke — but a FROZEN order, so the sentence is
 * as deterministic as the counts.
 */
const MUSTER_ORDER = Object.freeze([
  'men_at_arms', 'heavy_horse', 'levy_spears', 'bowmen', 'war_mages', 'siege_crew', 'baggage_train',
]);

/**
 * The muster roll in world words. Actor, action and the composition it marched
 * with — no strength figure, no facet, no digit.
 *
 * Returns null exactly when `deriveForceComposition` does, so a peaceful
 * settlement surfaces nothing.
 *
 * @param {Object} args
 * @param {unknown} [args.settlement]
 * @param {unknown} [args.record]
 * @param {unknown} [args.homeId]  the settlement fielding the army (for the name).
 * @param {(id: unknown) => string} [args.nameFor]
 * @returns {string | null}
 */
export function forceCompositionLine({ settlement, record, homeId, nameFor = (id) => String(id) } = {}) {
  const composition = deriveForceComposition({ settlement, record });
  if (!composition) return null;
  const parts = MUSTER_ORDER
    .filter((type) => composition[type] > 0)
    .map((type) => {
      const count = composition[type];
      const word = UNIT_WORDS[/** @type {keyof typeof UNIT_WORDS} */ (type)];
      return `${numberWord(count)} ${count === 1 ? word.one : word.many}`;
    });
  if (!parts.length) return null;
  const roll = parts.length === 1
    ? parts[0]
    : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
  const rec = /** @type {{ targetId?: unknown }} */ (record || {});
  const home = homeId != null ? nameFor(homeId) : null;
  const target = rec.targetId != null ? nameFor(rec.targetId) : null;
  const banner = home ? `under ${home}'s banner` : 'under the banner';
  const errand = target ? ` before ${target}` : '';
  return `The muster ${banner}${errand}: ${roll}.`;
}

/**
 * The cross-settlement muster standings: one entry per settlement with a live
 * stateful army abroad, codepoint-sorted by home id. Returns [] when the
 * deployments ledger is absent or empty ⇒ byte-identical off-state.
 *
 * @param {Object} args
 * @param {unknown} [args.worldState]
 * @param {(id: unknown) => unknown} [args.settlementFor]  home id → settlement, for the magic gate.
 * @param {(id: unknown) => string} [args.nameFor]
 * @returns {Array<{ homeId: string, composition: Record<string, number>, line: string }>}
 */
export function forceCompositionStandings({ worldState, settlementFor, nameFor = (id) => String(id) } = {}) {
  const state = /** @type {{ deployments?: unknown }} */ (worldState || {});
  const deployments = /** @type {Record<string, unknown>} */ (
    state.deployments && typeof state.deployments === 'object' ? state.deployments : {}
  );
  /** @type {Array<{ homeId: string, composition: Record<string, number>, line: string }>} */
  const out = [];
  for (const homeId of Object.keys(deployments).sort(codepoint)) {
    const record = deployments[homeId];
    const settlement = typeof settlementFor === 'function' ? settlementFor(homeId) : null;
    const composition = deriveForceComposition({ settlement, record });
    if (!composition) continue;
    const line = forceCompositionLine({ settlement, record, homeId, nameFor });
    if (!line) continue;
    out.push({ homeId, composition, line });
  }
  return out;
}

/** The frozen tables, exported for the suite and for a future authoring surface. */
export const FORCE_COMPOSITION_TABLES = Object.freeze({
  UNIT_WEIGHTS, MAGIC_ROLE_WEIGHTS, CONTINGENT_BANDS, UNIT_WORDS, MUSTER_ORDER,
});
