/**
 * people/allegiance.js — THE HIDDEN ALLEGIANCE: corruption as a card's secret loyalty to the town's
 * criminal powers, with ONE handler each (the allegiance train, car 1, ALLEGIANCE-CAR1, 2026-11-08;
 * the design docs/allegiance/ALLEGIANCE_DESIGN_2026-11-08.md §1.2–§1.5, §2 A2 / A4, §3.1; the
 * chair's rulings J-1 to J-10 in docs/allegiance/ALLEGIANCE_RULINGS_2026-11-08.md).
 *
 * THE OWNER (2026-11-08, verbatim): "this new structure also replaces the compromised tag as it
 * relates to criminals. Instead of saying compromised. An NPC simply has an allegiance to the
 * thieves guild … only certain personality types that are not already in a criminal institution
 * can become compromised. Keep that but now randomly (scaling to criminal slider and activity and
 * organized crime etc), randomly choose amongst the NPC and/or legitimate business to have this
 * hidden allegiance rather than a compromised tag." The governing principle: "plausibility with
 * confidence, not predictability" — a weighted roll, invariants as checks, a receipt per outcome.
 *
 * ONE FIELD, ONE READER (J-1). A card born with a hidden allegiance carries
 *   allegiance: { power, house, vector, via, handler, share, veiled: true, covert: true }
 * and a clean card carries none. `allegianceOf` is the ONE reader; `hiddenMembershipOf` its
 * membership-shaped view for the readers that loop memberships. `power` is set whenever the town
 * holds a criminal power (J-1's condition), so the guild's push (car 2) and patronage (car 3) read it.
 *
 * THE ROLL (A2, `dealAllegiances`), at the coherence seam between the memberships' landing and the
 * rank deal (generators/people/castPowers.js :: landMemberships → here → rankPowers), each card on its
 * own keyed fork `people-allegiance::<card id>` (removing a card never moves another's roll, I-13):
 *   gate (§1.3, I-4) — a corruptible flaw (corruption.js :: npcCorruptibleFlaw), NOT a criminal face
 *     (a crim-house face, or a criminal power's minted face: an OPEN member, the handler pool, J-3), and
 *     a criminal house WITH A FACE on the roster (J-4: no crim house on the roster, no allegiance);
 *   chance — corruption.js :: spawnCorruptionChance(climate, organizedCrime × ALLEGIANCE_TUNING.organizedCrime)
 *     (the organized-crime term added inside the clamp, J-5);
 *   the house — a roster criminal house drawn on the card's fork (today's pick, uniform);
 *   the vector — corruptionVectorForFlaw, unchanged (fanaticism stays the simulation's, J-6);
 *   `via` — draw-free from the card's own house (§1.4): office · front · retainer;
 *   the goal rewrite the retired corruptionPass did is KEPT here verbatim until car 4 replaces it.
 *
 * THE HANDLERS (A4, `assignHandlers`), after the rank deal, DRAW-FREE (J-10), so a save's migration
 * and a birth pick the same handler: agents by standing (best rank, importance, roster order) dealt
 * in order to handlers (the criminal power's second, third, other members, then the crim-house faces
 * by house weight, the boss last and only when no one else can); the remainder goes to the last.
 *
 * Pure apart from the keyed draws; no clock, no Math.random.
 */
import {
  CORRUPTION_TUNING, corruptionVectorForFlaw, isCriminalInstitution, npcCorruptibleFlaw,
  readCorruptionClimate, spawnCorruptionChance,
} from '../corruption.js';
import { backingRowFor } from '../../data/institutionBacking.js';
import { familyOfInstitution, frontClassOfInstitution } from '../../data/institutionalCatalog.js';
import { governingFactionOf, nameOf } from '../rulingPower.js';
import { membershipsOf } from './membership.js';
import { heldByOthers } from '../../generators/hookVariety.js';

/** @typedef {Record<string, unknown>} Rec */
/**
 * @typedef {'greed' | 'hunger_for_status' | 'fear' | 'forbidden_patron' | 'fanaticism'} AllegianceVector
 * @typedef {'office' | 'front' | 'retainer'} AllegianceVia
 * @typedef {{ power: string | null, house: string, vector: AllegianceVector, via: AllegianceVia,
 *   handler: string | null, share: number, veiled: true, covert: true }} Allegiance
 */

/** The keyed fork family the allegiance roll draws under (declared in the fork census). */
export const ALLEGIANCE_FORK_LABEL = 'people-allegiance';

/**
 * THE DIALS of the hidden allegiance (§3.1; a DRAFT row in tests/lint/.tuning-register.json until
 * the owner signs the estate). Units: organizedCrime probability · organizedFull points ·
 * powerBonus fraction01 · share share · frontWeight multiplier.
 */
export const ALLEGIANCE_TUNING = Object.freeze({
  /** organized crime's weight on the birth chance, added inside the spawn clamp (J-5) */
  organizedCrime: 0.10,
  /** the summed criminal-house backing weight at which organized crime reads 1 */
  organizedFull: 8,
  /** organized crime's step when an independent criminal power stands */
  powerBonus: 0.25,
  /** the allegiance's weight for patronage and the push (outside the open shares' sum) */
  share: 0.15,
  /** a PRIME front's roll weight — RESERVED (J-8): 1 does not weight car 1's roll */
  frontWeight: 1,
  /** a weight-0 criminal house's backing weight in the organized-crime sum (the design's "0 → 0.5") */
  weightZeroHouse: 0.5,
});

export const ALLEGIANCE_VECTORS = Object.freeze(['greed', 'hunger_for_status', 'fear', 'forbidden_patron', 'fanaticism']);
export const ALLEGIANCE_VIAS = Object.freeze(['office', 'front', 'retainer']);
/** The shelves whose houses are OFFICES: an office is corrupted, not used as a front (§1.4). */
export const OFFICE_SHELVES = Object.freeze(['Government', 'Defense', 'Religious', 'Magic', 'Infrastructure']);

/**
 * The compromised short goal by vector — MOVED VERBATIM from the retired steps/corruptionPass.js
 * (`CORRUPT_SHORT_GOAL`), kept until car 4's goal families replace it (the brief §4.4).
 */
export const CORRUPT_SHORT_GOAL = Object.freeze({
  greed: 'Skim what passes through their hands and call it a fee.',
  hunger_for_status: 'Trade quiet favours upward, buying a seat above their station.',
  fear: 'Stay useful to the wrong people so they stay breathing.',
  forbidden_patron: 'Answer, in secret, to a patron no one is meant to know.',
  fanaticism: 'Bend every rule for the cause and call the corruption devotion.',
});

const IMPORTANCE_ORDER = Object.freeze(['pillar', 'key', 'notable', 'minor']);

/** @param {unknown} v @returns {Rec} */
const rec = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Rec} */ (v) : {});
/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v : '');
/** @param {unknown} v @returns {unknown[]} */
const arr = (v) => (Array.isArray(v) ? v : []);
/** @param {number} x @returns {number} */
const n01 = (x) => (Number.isFinite(x) ? Math.max(0, Math.min(1, x)) : 0);

/**
 * THE ONE READER (J-1): the card's hidden allegiance, or null — for a card born clean, a card with no
 * `allegiance`, or a malformed record (no house, or a vector or `via` outside the vocabulary).
 * @param {unknown} card @returns {Allegiance | null}
 */
export function allegianceOf(card) {
  const a = rec(rec(card).allegiance);
  const house = str(a.house);
  const vector = str(a.vector);
  // a DM's foreign leash (IMPOSE_CORRUPTION's beneficiary, W-DOCTRINE-3b §6) names no local house
  const leashed = !!a.leash && typeof a.leash === 'object';
  if ((!house && !leashed) || !ALLEGIANCE_VECTORS.includes(vector)) return null;
  const via = str(a.via);
  return /** @type {Allegiance} */ ({
    ...a,
    power: str(a.power) || null,
    house,
    vector,
    via: ALLEGIANCE_VIAS.includes(via) ? via : 'retainer',
    handler: a.handler == null ? null : String(a.handler),
    share: typeof a.share === 'number' && Number.isFinite(a.share) ? a.share : ALLEGIANCE_TUNING.share,
    veiled: true,
    covert: true,
  });
}

/**
 * The allegiance as a membership-shaped row, so patronage and the push read memberships and the
 * allegiance through one loop: `{ power, rank: null, share, hidden: true }`, or null when the card
 * holds no allegiance or its allegiance names no power.
 * @param {unknown} card @returns {{ power: string, rank: null, share: number, hidden: true } | null}
 */
export function hiddenMembershipOf(card) {
  const a = allegianceOf(card);
  if (!a || !a.power) return null;
  return { power: a.power, rank: null, share: a.share, hidden: true };
}

/**
 * A power that is criminal: `category === 'criminal'`, or a name containing "thie" — the test
 * `factionDynamics.js :: computeCriminalCaptureState` uses (the design §0's definition).
 * @param {unknown} power @returns {boolean}
 */
export function isCriminalPower(power) {
  const p = rec(power);
  return str(p.category).toLowerCase() === 'criminal' || /thie/i.test(nameOf(p) || '');
}

/** @param {unknown} settlement @returns {Rec[]} */
const institutionsOf = (settlement) => arr(rec(settlement).institutions).map(rec);
/** @param {unknown} settlement @returns {Rec[]} */
const powersOf = (settlement) => arr(rec(rec(settlement).powerStructure).factions).map(rec);

/** The roster's criminal houses, in roster order. @param {unknown} settlement @returns {Rec[]} */
export function criminalHousesOf(settlement) {
  return institutionsOf(settlement).filter((inst) => isCriminalInstitution(/** @type {import('../settlement.schema.js').SimInstitution} */ (inst)));
}

/**
 * The town's criminal powers, the INDEPENDENT ones (not governing) first, each group by strength
 * descending then roster order.
 * @param {unknown} settlement @returns {Rec[]}
 */
export function criminalPowersOf(settlement) {
  const governing = nameOf(governingFactionOf(/** @type {import('../settlement.schema.js').SimSettlement} */ (/** @type {unknown} */ (settlement))));
  return powersOf(settlement)
    .map((p, at) => ({ p, at }))
    .filter(({ p }) => isCriminalPower(p))
    .sort((x, y) => (Number(nameOf(x.p) === governing) - Number(nameOf(y.p) === governing))
      || (Number(y.p.power) || 0) - (Number(x.p.power) || 0) || (x.at - y.at))
    .map(({ p }) => p);
}

/**
 * ORGANIZED CRIME (J-5): organization, not volume — the summed backing weight of the roster's criminal
 * houses (institutionBacking.js :: backingRowFor(name).weight, a weight-0 house 0.5) over
 * `organizedFull`, plus `powerBonus` when an independent criminal power stands, clamped to [0, 1].
 * Draw-free.
 * @param {unknown} settlement @returns {number}
 */
export function organizedCrimeOf(settlement) {
  const T = ALLEGIANCE_TUNING;
  const weights = criminalHousesOf(settlement).map((inst) => {
    const row = backingRowFor(str(inst.name));
    const w = row && typeof row.weight === 'number' ? row.weight : 1;
    return w === 0 ? T.weightZeroHouse : w;
  });
  const sum = weights.reduce((s, w) => s + w, 0);
  const governing = nameOf(governingFactionOf(/** @type {import('../settlement.schema.js').SimSettlement} */ (/** @type {unknown} */ (settlement))));
  const independent = criminalPowersOf(settlement).some((p) => nameOf(p) !== governing);
  return n01(n01(sum / T.organizedFull) + (independent ? T.powerBonus : 0));
}

/** @param {Rec[]} houses @returns {Map<string, Rec>} */
const byName = (houses) => new Map(houses.map((h) => [str(h.name), h]));

/**
 * A CRIMINAL FACE: an OPEN member of the underworld — the face of a roster criminal house, or a
 * criminal power's minted face. Never an agent (J-3); the handler pool.
 * @param {unknown} card @param {Map<string, Rec>} crimHouses @param {Set<string>} crimPowers
 * @returns {boolean}
 */
export function isCriminalFace(card, crimHouses, crimPowers) {
  const inst = rec(rec(card).institution);
  if (inst.kind === 'house') return crimHouses.has(str(inst.key));
  if (inst.kind === 'power') return crimPowers.has(str(inst.key));
  return false;
}

/**
 * `via` (§1.4), draw-free from the card's own house: OFFICE for a house on an office shelf, the seat
 * or a minted face; FRONT for a front-capable family (the catalog's `front` mark, J-7); RETAINER else.
 * @param {unknown} card @param {Map<string, Rec>} houseByName @returns {AllegianceVia}
 */
export function viaOf(card, houseByName) {
  const inst = rec(rec(card).institution);
  if (inst.kind !== 'house') return 'office';
  const house = houseByName.get(str(inst.key)) || { name: str(inst.key) };
  const family = familyOfInstitution(house);
  if (family && OFFICE_SHELVES.includes(family.shelf)) return 'office';
  if (frontClassOfInstitution(house)) return 'front';
  return 'retainer';
}

/**
 * The receipts the deal leaves for the record's trace, keyed by the settlement object the seam ran
 * over; the assembly step records them through `recordTrace` (its deterministic clock) and takes them.
 * @type {WeakMap<object, Rec[]>}
 */
const RECEIPTS = new WeakMap();

/**
 * Take (and forget) the allegiance receipts the seam left for `settlement`.
 * @param {unknown} settlement @returns {Rec[]}
 */
export function takeAllegianceReceipts(settlement) {
  if (!settlement || typeof settlement !== 'object') return [];
  const out = RECEIPTS.get(settlement) || [];
  RECEIPTS.delete(settlement);
  return out;
}

/**
 * A2 — THE DEAL. Writes `allegiance` (no handler yet) onto the cards the roll turns, rewrites their
 * short goal as the retired pass did, and returns the receipts' working rows (completed by
 * `assignHandlers`). A card already holding a well-formed allegiance (a held DM card) keeps it and
 * draws nothing. Mutates the cards in place.
 *
 * @param {Rec} settlement the settlement-shaped object at the coherence seam
 * @param {Rec[]} cards the cast, memberships landed (rank null)
 * @param {{ fork: (label: string) => any } | null} rng the seam's stream; null deals nothing
 * @returns {Array<{ card: Rec, flaw: string, p: number, organized: number, climate: Rec }>}
 */
export function dealAllegiances(settlement, cards, rng) {
  /** @type {Array<{ card: Rec, flaw: string, p: number, organized: number, climate: Rec }>} */
  const dealt = [];
  if (!rng || typeof rng.fork !== 'function' || !Array.isArray(cards) || !cards.length) return dealt;
  const crimHouses = criminalHousesOf(settlement);
  const crimHouseNames = new Map(crimHouses.map((h) => [str(h.name), h]));
  const crimPowerNames = new Set(criminalPowersOf(settlement).map((p) => nameOf(p)).filter(Boolean));
  // J-4 (and I-2's precondition): a criminal house WITH A FACE stands on the roster, so every agent has
  // a possible handler (a crim-house face is never an agent, J-3)
  const faced = cards.filter((c) => rec(rec(c).institution).kind === 'house' && crimHouseNames.has(str(rec(rec(c).institution).key)));
  if (!faced.length) return dealt;
  const houseByName = byName(institutionsOf(settlement));
  const climate = readCorruptionClimate(/** @type {import('../settlement.schema.js').SimSettlement} */ (/** @type {unknown} */ ({ institutions: settlement.institutions, economicState: settlement.economicState })));
  const organized = organizedCrimeOf(settlement);
  const p = spawnCorruptionChance(climate, organized * ALLEGIANCE_TUNING.organizedCrime);
  const housePool = crimHouses.map((h) => str(h.name)).filter(Boolean);
  const family = rng.fork(ALLEGIANCE_FORK_LABEL);
  // REVIEW-INTAKE-4 (kept verbatim from the retired pass): a compromised goal another figure carries
  // is refused, and the figure keeps its own. Draw-free.
  const goalsNow = cards.map((n) => rec(rec(n).goal).short);
  cards.forEach((card, k) => {
    if (!card || card.id == null) return;
    if (allegianceOf(card)) return;
    const flaw = npcCorruptibleFlaw(/** @type {import('../settlement.schema.js').SimNpc} */ (/** @type {unknown} */ (card)));
    if (!flaw) return;
    if (isCriminalFace(card, crimHouseNames, crimPowerNames)) return;
    const fork = family.fork(String(card.id));
    if (!fork.chance(p)) return;
    const house = /** @type {string} */ (fork.pick(housePool));
    const vector = /** @type {AllegianceVector} */ (corruptionVectorForFlaw(flaw));
    card.allegiance = {
      power: allegiancePowerFor(cards, house, settlement),
      house,
      vector,
      via: viaOf(card, houseByName),
      handler: null,
      share: ALLEGIANCE_TUNING.share,
      veiled: true,
      covert: true,
    };
    const corruptGoal = CORRUPT_SHORT_GOAL[vector] || CORRUPT_SHORT_GOAL.greed;
    const goal = card.goal;
    if (goal && typeof goal === 'object' && !heldByOthers(goalsNow, k).has(corruptGoal)) {
      card.goal = { ...rec(goal), short: corruptGoal };
      goalsNow[k] = corruptGoal;
    }
    dealt.push({ card, flaw, p, organized, climate: /** @type {Rec} */ (/** @type {unknown} */ (climate)) });
  });
  return dealt;
}

/**
 * The criminal power an allegiance to `house` names (J-1's condition: set whenever the town holds a
 * criminal power): the criminal power the house's own face holds its largest share in, else the
 * strongest independent criminal power, else the governing criminal power; null where none stands.
 * @param {Rec[]} cards @param {string} house @param {unknown} settlement @returns {string | null}
 */
export function allegiancePowerFor(cards, house, settlement) {
  const crimPowers = criminalPowersOf(settlement);
  if (!crimPowers.length) return null;
  const names = new Set(crimPowers.map((p) => nameOf(p)));
  const face = cards.find((c) => rec(rec(c).institution).kind === 'house' && str(rec(rec(c).institution).key) === house);
  const own = membershipsOf(face)
    .filter((m) => names.has(m.power))
    .sort((a, b) => (Number(b.share) || 0) - (Number(a.share) || 0))[0];
  return own ? own.power : (nameOf(crimPowers[0]) || null);
}

/** @param {unknown} card @returns {number} the card's best rank in any power, 4 for none */
const bestRank = (card) => membershipsOf(card).reduce((acc, m) => (Number.isInteger(m.rank) && /** @type {number} */ (m.rank) < acc ? /** @type {number} */ (m.rank) : acc), 4);
/** @param {unknown} card @returns {number} */
const importanceKey = (card) => { const i = IMPORTANCE_ORDER.indexOf(str(rec(card).importance)); return i < 0 ? IMPORTANCE_ORDER.length : i; };

/**
 * The handler pool of a criminal power or house, in dealing order (§1.5, J-10): the power's rank 2,
 * rank 3, its other members (roster order), then the crim-house faces by house weight descending
 * (roster order) — the boss (the power's rank 1) last and only when no one else can. Never a card
 * holding an allegiance.
 * @param {Rec[]} cards @param {string | null} power @param {Map<string, Rec>} crimHouses
 * @returns {Rec[]}
 */
export function handlerPoolOf(cards, power, crimHouses) {
  const free = cards.filter((c) => c && c.id != null && !allegianceOf(c));
  /** @type {Rec[]} */
  const order = [];
  /** @type {Rec | null} */
  let boss = null;
  if (power) {
    const members = free
      .map((card, at) => ({ card, at, m: membershipsOf(card).find((x) => x.power === power) }))
      .filter((x) => x.m);
    const rankOf = (/** @type {{ m: { rank?: unknown } | undefined }} */ x) => (Number.isInteger(x.m?.rank) ? /** @type {number} */ (x.m?.rank) : 4);
    boss = members.find((x) => rankOf(x) === 1)?.card || null;
    members.filter((x) => rankOf(x) !== 1)
      .sort((a, b) => (rankOf(a) - rankOf(b)) || (a.at - b.at))
      .forEach((x) => order.push(x.card));
  }
  const weightOf = (/** @type {Rec} */ c) => {
    const row = backingRowFor(str(rec(c.institution).key));
    return row && typeof row.weight === 'number' ? row.weight : 0;
  };
  free
    .map((card, at) => ({ card, at }))
    .filter(({ card }) => rec(card.institution).kind === 'house' && crimHouses.has(str(rec(card.institution).key)))
    .sort((a, b) => (weightOf(b.card) - weightOf(a.card)) || (a.at - b.at))
    .forEach(({ card }) => { if (!order.includes(card) && card !== boss) order.push(card); });
  return order.length ? order : (boss ? [boss] : []);
}

/**
 * A4 — THE HANDLERS, DRAW-FREE (J-10). Every allegiance on the cast whose handler is unset (or names
 * no card on the roster) is dealt one: per pool (the allegiance's power, else the houses), the agents
 * by standing — best rank (1 < 2 < 3 < none), importance (pillar > key > notable > minor), roster
 * order — go in order to the pool's handlers; when agents outnumber handlers the remainder goes to
 * the last. Returns the cards it dealt a handler to. Mutates `allegiance.handler` in place.
 * @param {Rec[]} cards @param {unknown} settlement @returns {Rec[]}
 */
export function assignHandlers(cards, settlement) {
  if (!Array.isArray(cards)) return [];
  const ids = new Set(cards.map((c) => (c && c.id != null ? String(c.id) : null)).filter(Boolean));
  const agents = cards
    .map((card, at) => ({ card, at, a: allegianceOf(card) }))
    .filter((x) => x.a && !(x.a.handler && ids.has(x.a.handler) && x.a.handler !== String(x.card.id)));
  if (!agents.length) return [];
  const crimHouses = byName(criminalHousesOf(settlement));
  /** @type {Map<string, typeof agents>} */
  const pools = new Map();
  for (const x of agents) {
    const key = x.a?.power ? `power:${x.a.power}` : 'houses';
    if (!pools.has(key)) pools.set(key, []);
    /** @type {typeof agents} */ (pools.get(key)).push(x);
  }
  /** @type {Rec[]} */
  const dealt = [];
  for (const [key, group] of pools) {
    const handlers = handlerPoolOf(cards, key.startsWith('power:') ? key.slice(6) : null, crimHouses);
    if (!handlers.length) continue;
    group.sort((x, y) => (bestRank(x.card) - bestRank(y.card)) || (importanceKey(x.card) - importanceKey(y.card)) || (x.at - y.at));
    group.forEach((x, i) => {
      const handler = handlers[Math.min(i, handlers.length - 1)];
      rec(x.card.allegiance).handler = String(handler.id);
      dealt.push(x.card);
    });
  }
  return dealt;
}

/**
 * The receipt per dealt allegiance (the retired pass's trace, plus the house, the handler, the `via`
 * mark and the chance's terms), left for the assembly step's `recordTrace` under the step label
 * `people-allegiance` (domain/edit/tracePartition.js :: TRACE_SUBJECTS).
 * @param {unknown} settlement the settlement object the seam ran over (the receipts' key)
 * @param {Array<{ card: Rec, flaw: string, p: number, organized: number, climate: Rec }>} dealt
 * @returns {Rec[]}
 */
export function leaveAllegianceReceipts(settlement, dealt) {
  const traces = dealt.map(({ card, flaw, p, organized, climate }) => {
    const a = /** @type {Allegiance} */ (allegianceOf(card));
    const handlerId = a.handler;
    const crime = Number(climate.crime) || 0;
    return {
      targetType: 'npc',
      targetId: String(card.id || card.name || 'npc'),
      step: ALLEGIANCE_FORK_LABEL,
      result: 'allegiance',
      causes: [
        { source: 'allegiance.gate', effect: 'eligible',
          reason: `A corruptible ${flaw} flaw, not a criminal face, and a criminal house with a face on the roster (${a.house}).` },
        { source: `flaw.${flaw}`, effect: `allegiance vector: ${a.vector}`, reason: `A ${flaw} flaw gave the guild its opening.` },
        { source: 'corruption.climate', effect: `onset chance ${p.toFixed(3)}`,
          reason: `Crime ${crime.toFixed(2)}, organized crime ${organized.toFixed(2)} (×${ALLEGIANCE_TUNING.organizedCrime}), clamped to [${CORRUPTION_TUNING.spawn.min}, ${CORRUPTION_TUNING.spawn.max}].` },
        { source: `via.${a.via}`, effect: `brings the guild ${a.via === 'office' ? 'protection and decisions' : a.via === 'front' ? 'a place for the money and the goods' : 'information and small favours'}`,
          reason: `Read from the card's own house.` },
      ],
      downstreamEffects: [
        { target: a.house, effect: 'gains a hidden ally' },
        ...(a.power ? [{ target: a.power, effect: 'holds a hidden allegiance', reason: 'The allegiance runs to the town\'s criminal power.' }] : []),
        ...(handlerId ? [{ target: handlerId, effect: 'handles the agent', reason: 'One handler per allegiance, dealt by standing.' }] : []),
      ],
    };
  });
  if (settlement && typeof settlement === 'object' && traces.length) RECEIPTS.set(settlement, traces);
  return traces;
}
