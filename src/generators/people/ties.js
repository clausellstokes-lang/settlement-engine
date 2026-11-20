/**
 * people/ties.js — THE ONE OUTGOING TIE PER CARD (the people car, PEOPLE-4 TIES, 2026-11-07;
 * the chair's ruling R-P7 in docs/chair/2026-11-07/PEOPLE-RULINGS-2026-11-07.md §1).
 *
 * THE OWNER (ODQ §934.105): "one relationship per NPC (allies rivals enemies leverage etc) per
 * NPC … in a single NPC card they can only have one relationship with another. But an NPC, if
 * called by two or more (including itself) unique NPCs could have multiple relationships."
 *
 * THE RULE (R-P7). In ROSTER ORDER each card draws ONE outgoing tie on its own keyed fork
 * (`people-ties::<card id>`, minted once as a family and keyed per card): the TARGET by weight =
 * the target's house weight (the backing catalogue's X-45 weight, 0.5 for a weight-0 house, 1 for
 * a minted face or a card of no house) × 3 when the two share a power (any membership in
 * common), never itself; the KIND from the archetype table (`power/relationshipArchetypes.js ::
 * computeRelTension`) on the pair's categories, power and personalities, as today. A lone face
 * (the only card in town) draws none. The in-degree is whatever falls out: reported, not tuned.
 *
 * THE RECORD is DIRECTED: `{ id, from, to, type, … }`. The undirected `npc1Id`/`npc2Id` pair is
 * NOT written. The display fields today's prose and surfaces read are kept, each named for the
 * end it describes: `npc1Name`/`npc1Role` are the `from` end's, `npc2Name`/`npc2Role` the `to`
 * end's (the rename ledgers, the search index, the gallery veil and the tie cards key on them);
 * the prose is the archetype's own template drawn with `from` leading (M-4: no new prose, the
 * direction chooses which name leads). `id` is `tie_<from>`: one outgoing tie per card makes it
 * unique and stable across a regeneration of the same cast.
 *
 * Runs at the coherence seam (narrativeGenerator.js :: generateCoherence) over the FINAL cast,
 * after the memberships are written (people/castPowers.js), and on the NPC section-regen's own
 * stream over the merged roster. Deterministic: the same cast and stream give the same ties.
 * The card's read of its ties (its own first, then the ties naming it) is
 * domain/relationships/cardTies.js :: tiesOfCard.
 */

import { getInstFlags, getStressFlags } from '../helpers.js';
import { computeRelTension, createTieProseDraw, handlerArchetypeFor, HANDLER_LEVERAGE_KINDS } from '../power/relationshipArchetypes.js';
import { allegianceOf } from '../../domain/people/allegiance.js';
import { STRESS_ECONOMIC_EFFECTS, TIE_TEMPER, tieIndexOf } from '../../data/npcData.js';
import { backingRowFor } from '../../data/institutionBacking.js';
import { defenseFactsOf, forceWordsOf } from '../../domain/defense/defenseFacts.js';
import { random as _rng } from '../../kernel/rngContext.js';
import { onStream, seatHouseOf, SEAT_CARD_ID } from './representatives.js';
import { birthFactsOf } from '../../domain/facts/factsOf.js';
import { pairSharesPlaceOf } from './pairPlace.js';
import { sharesPower } from '../../domain/facts/sharedPower.js';
import { tieArchetype } from '../npc/tieKind.js';
import { styledTitleOf } from '../../data/faceHonorifics.js';

/** The keyed fork family the ties draw under (declared in the fork census). */
export const TIES_FORK_LABEL = 'people-ties';
/** The multiplier on a target that shares a power with the source card (R-P7). */
export const SHARED_POWER_FACTOR = 3;

/** The strength labels per kind (moved whole from the retired pair writer). */
export const RELATIONSHIP_STRENGTHS = Object.freeze({
  ally: ['weak', 'moderate', 'strong'],
  rival: ['professional', 'personal', 'bitter'],
  enemy: ['mild', 'serious', 'mortal'],
  family: ['distant', 'close', 'inseparable'],
  patron_client: ['nominal', 'significant', 'total dependence'],
  lover: ['casual', 'serious', 'passionate'],
  mentor_student: ['formal', 'devoted', 'lifelong'],
  debtor_creditor: ['minor', 'substantial', 'crushing'],
  political: ['convenience', 'stable', 'unbreakable'],
  respect: ['grudging', 'genuine', 'deep'],
});

/** The stress archetypes that mark a tie `flagDriven` (as the retired writer marked them). */
const FLAG_DRIVEN = new Set([
  STRESS_ECONOMIC_EFFECTS.econ_crim_blur,
  STRESS_ECONOMIC_EFFECTS.mil_crim_corruption,
  STRESS_ECONOMIC_EFFECTS.rel_crim_fraud,
  STRESS_ECONOMIC_EFFECTS.mag_crim_market,
  STRESS_ECONOMIC_EFFECTS.rel_mil_crusader,
  STRESS_ECONOMIC_EFFECTS.econ_mil_contract,
]);

/**
 * A card's weight as a TARGET: its house's X-45 weight, 0.5 at weight 0, 1 for a minted face
 * (`institution.kind === 'power'`) or a card of no house (the DM's).
 * @param {Record<string, any> | null | undefined} card @returns {number}
 */
export function targetWeightOf(card) {
  const inst = card?.institution;
  if (!inst || inst.kind !== 'house') return 1;
  const row = backingRowFor(inst.key);
  const weight = row && typeof row.weight === 'number' ? row.weight : 1;
  return weight === 0 ? 0.5 : weight;
}

/** Whether two cards share a power (any membership in common): the shared-power home's own rule
 * (`domain/facts/sharedPower.js`, R2-CODE-A-14, the chair's ruling (s1)), moved there verbatim so the
 * target's weight here and the `shared power` atom a tie line declares are one reading; re-exported. */
export { sharesPower };

/**
 * THE TIES: one outgoing tie per card that has a peer, in roster order.
 *
 * @param {Array<Record<string, any>>} cards the final cast, roster order
 * @param {{ config?: Record<string, any>, institutions?: unknown[], tier?: unknown, government?: unknown }} place the effective
 *   config and the roster; the tier and the government are the declared tie lines' facts (CENSUS-1f, R-V / R-Z,
 *   composed at MERGE-CAR: the retired pair writer's `settled` argument, read here)
 * @param {{ fork: (label: string) => any }} rng the seam's stream; the family is forked off it once
 * @param {{ sources?: ReadonlySet<unknown> }} [only] draw only for these card ids (the pre-law
 *   appender's late cards, steps/assembleSettlement.js); every card stays a target
 * @returns {Array<Record<string, any>>}
 */
export function drawTies(cards, place, rng, only = {}) {
  const cast = (Array.isArray(cards) ? cards : []).filter((c) => c && c.id != null);
  if (cast.length < 2) return [];
  if (!rng || typeof rng.fork !== 'function') throw new Error('ties: no stream to draw the ties on');
  const config = place?.config || {};
  const institutions = Array.isArray(place?.institutions) ? place.institutions : [];
  const instFlags = getInstFlags(config, institutions);
  const stressFlags = getStressFlags(config, institutions);
  // GS-1: each tie's description and tension drawn WITHOUT REPLACEMENT across the town, draw-free.
  // MERGE-CAR: the facts thunk the rung-2 landing gave the retired pair writer (CENSUS-1f site 19; the
  // government only, R-Z) — without it every declared tie index is refused (fail-closed, R-N).
  const tier = place?.tier ?? config.tier;
  const government = place?.government ?? null;
  // BAR4-PEOPLE (the chair's ruling TI1): the draw's facts are the birth's, with the ties between each pair counted
  // BEFORE any prose is drawn (the `lone tie` atom: a line that says two do not speak needs them to carry no other)
  // and the `shared place` atom read in the order the line will be WRITTEN (a second tie of a pair's kind is written in the
  // first tie's order: `relationshipArchetypes.js`, TAIL-TIES-2 T6), so the one who names a successor is the one who heads
  /** @type {Map<string, number>} */
  const tieCount = new Map();
  /** @type {{ order: [any, any] | null }} the tie being written: its two cards in the order its line names them */
  const writing = { order: null };
  const drawTieProse = createTieProseDraw(forceWordsOf(defenseFactsOf({ institutions })), () => withPairTies(birthFactsOf({ institutions, config, tier, powerStructure: { government } }), tieCount, writing));
  const family = rng.fork(TIES_FORK_LABEL);
  const weightOf = new Map(cast.map((c) => [c, targetWeightOf(c)]));

  // THE SEAT (MERGE-234, the chair's ruling of 10:4x UTC, one tie writer): an `other` power's minted
  // face (people/castPowers.js, R-P4) ties to the seat's face — lane 1's target rule for the mints:
  // the seat house's face, else the minted seat, else the first card — and draws only its KIND here.
  const seat = seatHouseOf(/** @type {any} */ (institutions));
  const seatKey = seat ? String(seat.house.name || '') : null;
  // COHERENCE-POWERS: the seat is the governing power's FIRST (the dual-hat leader, a house's face, where a house
  // leads); a cast with no ranks (a pre-car save) reads the seat house's face, else the minted seat, as before
  const governingName = typeof government === 'string' ? government : null;
  const ledBy = governingName
    ? cast.find((c) => Array.isArray(c?.memberships) && c.memberships.some((m) => m?.power === governingName && m?.rank === 1))
    : null;
  const seatCard = ledBy || cast.find((c) => (seatKey ? c?.institution?.kind === 'house' && c?.institution?.key === seatKey : c?.id === SEAT_CARD_ID)) || cast[0];
  // a minted face that is not the seat (FIX-PUBLIC-VEIL: a veiled mint's id is opaque, so it is told by
  // its kind, not by the `npc_power_` prefix)
  const isOtherMint = (/** @type {Record<string, any>} */ c) => c?.institution?.kind === 'power' && c?.id !== SEAT_CARD_ID;

  // THE HANDLER TIE (ALLEGIANCE-CAR1, 2026-11-08; the allegiance design §1.5): a card with a hidden allegiance
  // (domain/people/allegiance.js) spends its ONE outgoing tie on its handler — the forced target, as the seat is
  // an `other` mint's — and the KIND follows the vector on the card, never rolled (fear's leverage sub-kind is
  // drawn on the card's own tie fork). The tie is `covert: true, handler: true`: the value-level covert drop
  // removes it from every public projection (publicSafe.js; SQL 142/206).
  const byId = new Map(cast.map((c) => [String(c.id), c]));
  /** @param {Record<string, any>} c @returns {Record<string, any> | null} */
  const handlerOf = (c) => {
    const h = allegianceOf(c)?.handler;
    const card = h ? byId.get(h) : null;
    return card && card !== c && card.id !== c.id ? card : null;
  };

  const sources = only?.sources ? cast.filter((c) => only.sources.has(c.id)) : cast;
  // BAR4-PEOPLE (the chair's ruling TI1 of 2026-11-16, vetoable by the owner): TWO PASSES. First EVERY DRAW, card by card on
  // its own fork exactly as before (the target, the kind, the strength); then the prose, which draws nothing, in the same
  // order. So the pair's ties are known before a line is chosen, and a pair's SECOND tie takes the temper of its first
  // (`inTemperOf`): no draw is added, moved or re-ordered.
  const drafts = sources.map((from) => {
    const others = cast.filter((c) => c !== from && c.id !== from.id);
    const weights = others.map((c) => weightOf.get(c) * (sharesPower(from, c) ? SHARED_POWER_FACTOR : 1));
    const fork = family.fork(String(from.id));
    const handler = handlerOf(from);
    const forced = handler || (isOtherMint(from) && seatCard && seatCard !== from && seatCard.id !== from.id ? seatCard : null);
    return onStream(fork, () => {
      const to = forced || fork.weightedPick(others, weights);
      const vector = handler ? allegianceOf(from)?.vector : null;
      const archetype = handler
        ? handlerArchetypeFor(String(vector), vector === 'fear' ? fork.pick(HANDLER_LEVERAGE_KINDS) : undefined)
        : tieArchetype(computeRelTension(from, to, stressFlags, instFlags), from, to); // CENSUS-4 R3: the tie rule, resolved after the roll (MERGE-CAR)
      const pool = RELATIONSHIP_STRENGTHS[archetype.type] || RELATIONSHIP_STRENGTHS.respect;
      const strength = pool[Math.floor(_rng() * pool.length)];
      return { from, to, archetype, strength, handler };
    });
  });
  for (const { from, to } of drafts) tieCount.set(pairKeyOf(from, to), (tieCount.get(pairKeyOf(from, to)) || 0) + 1);
  /** @type {Map<string, 'warm' | 'cold' | null>} each pair's first tie's temper, as drawn and printed */
  const firstTemper = new Map();
  /** @type {Map<object, Map<string, string>>} each kind's first tie of a pair, as `<from id>><to id>` (its written order) */
  const firstOrder = new Map();
  return drafts.map((draft) => {
    const { from, to, handler } = draft;
    const key = pairKeyOf(from, to);
    const { archetype, strength } = firstTemper.has(key) && !handler ? inTemperOf(firstTemper.get(key) ?? null, draft.archetype, draft.strength) : draft;
    const orders = firstOrder.get(archetype) || new Map();
    firstOrder.set(archetype, orders);
    writing.order = orders.get(key) === `${String(to.id)}>${String(from.id)}` ? [to, from] : [from, to];
    if (!orders.has(key)) orders.set(key, `${String(from.id)}>${String(to.id)}`);
    const { archetypeKey, proseVariant, description, tension } = drawTieProse(archetype, from, to);
    writing.order = null;
    if (!firstTemper.has(key)) firstTemper.set(key, temperOfTie(archetype, strength, proseVariant));
    return {
      id: `tie_${from.id}`,
      from: from.id,
      to: to.id,
      type: archetype.type,
      typeName: archetype.label,
      description,
      tension,
      strength,
      npc1Name: from.name,
      npc2Name: to.name,
      npc1Role: styledTitleOf(from.role, from.gender), // COHERENCE-POWERS-8 (R2): the role word her card styles her by
      npc2Role: styledTitleOf(to.role, to.gender),
      archetypeKey,
      proseVariant,
      flagDriven: stressFlags.anyActive && FLAG_DRIVEN.has(archetype),
      ...(handler ? { covert: true, handler: true } : {}),
    };
  });
}

/** The two ids of a pair, unordered. @param {Record<string, any>} a @param {Record<string, any>} b */
const pairKeyOf = (a, b) => [String(a?.id ?? ''), String(b?.id ?? '')].sort().join('\u0000');

/**
 * The birth's facts with the pair's lone tie answered from the ties this draw holds (`pairPlace.js :: pairIsLoneOf`
 * answers it from a record's relationships; the birth's record has none yet), and the pair's place read in the order the
 * tie being written names them. The (frozen) facts object is the prototype, so every other getter reads as before.
 * @param {object} facts @param {Map<string, number>} counts @param {{ order: [any, any] | null }} writing
 */
function withPairTies(facts, counts, writing) {
  /** @param {unknown} pair */
  const isPair = (pair) => Array.isArray(pair) && pair.length === 2;
  return Object.freeze(Object.create(facts, {
    loneTie: { enumerable: true, value: (/** @type {unknown} */ pair) => (isPair(pair) ? (counts.get(pairKeyOf(/** @type {any[]} */ (pair)[0], /** @type {any[]} */ (pair)[1])) ?? 0) <= 1 : undefined) },
    sharesPlace: { enumerable: true, value: (/** @type {unknown} */ pair) => {
      if (!isPair(pair)) return undefined;
      const p = /** @type {[any, any]} */ (pair);
      const order = writing.order && pairKeyOf(writing.order[0], writing.order[1]) === pairKeyOf(p[0], p[1]) ? writing.order : p;
      return pairSharesPlaceOf(null, order);
    } },
  }));
}

/** A kind and strength's temper (`npcData.js :: TIE_TEMPER`). @param {unknown} type @param {unknown} strength @returns {'warm' | 'cold' | null} */
function temperOfKind(type, strength) {
  const kind = typeof type === 'string' && Object.hasOwn(TIE_TEMPER, type) ? /** @type {Record<string, 'warm' | 'cold'>} */ (TIE_TEMPER[/** @type {keyof typeof TIE_TEMPER} */ (type)]) : null;
  if (!kind) return null;
  return (typeof strength === 'string' && Object.hasOwn(kind, strength) ? kind[strength] : kind['*']) ?? null;
}

/**
 * A drawn tie's temper: its kind and strength's, or warm where its printed line declares the pair's trust full.
 * @param {any} archetype @param {string} strength @param {number} variant
 */
function temperOfTie(archetype, strength, variant) {
  const index = Number.isInteger(variant) ? tieIndexOf(variant) : -1;
  const rows = index < 0 ? [] : [archetype?.desc?.lines, archetype?.tension?.lines].filter((l) => Array.isArray(l) && l.length).map((l) => l[index % l.length]);
  if (rows.some((r) => r && typeof r === 'object' && r.trust === 'full')) return 'warm';
  return temperOfKind(archetype?.type, strength);
}

/**
 * A pair's SECOND tie in the temper of its first (the chair's TI1; no draw): beside a warm first tie an enemy's or a
 * rival's kind is a respect's (BAR7-LINES: a rival is cold, so it no longer stands for "neither"); beside a cold first tie a
 * warm strength is its kind's first (a devoted teacher → a formal one; a deep respect → a grudging one), and a kind warm at
 * every strength (an ally's) is a rival's at its rung (BAR7-LINES, 10i: one pair, one sense). A line that
 * declares a trust the first denies is held by the prose draw itself (`relationshipArchetypes.js`, BAR2-PEOPLE PP4).
 * @param {'warm' | 'cold' | null} first @param {any} archetype @param {string} strength
 */
function inTemperOf(first, archetype, strength) {
  const own = temperOfKind(archetype?.type, strength);
  const rung = Math.max(0, (RELATIONSHIP_STRENGTHS[/** @type {keyof typeof RELATIONSHIP_STRENGTHS} */ (archetype?.type)] || []).indexOf(strength));
  if (first === 'warm' && own === 'cold') {
    // BAR7-LINES (10i, C19351): a rival is cold now (`TIE_TEMPER`), so beside a warm first tie an enemy's or a rival's kind
    // is a respect's, at its rung's strength short of deep (mild, serious, mortal → grudging, genuine, genuine): the second
    // tie says no more than the first allows, and names no rivalry beside an ally (was: a rival's, under TI1)
    return { archetype: STRESS_ECONOMIC_EFFECTS.genuine_respect, strength: RELATIONSHIP_STRENGTHS.respect[Math.min(rung, 1)] };
  }
  if (first === 'cold' && own === 'warm') {
    const pool = RELATIONSHIP_STRENGTHS[/** @type {keyof typeof RELATIONSHIP_STRENGTHS} */ (archetype.type)] || [];
    const cooler = pool.find((s) => temperOfKind(archetype.type, s) !== 'warm');
    // BAR7-LINES (10i): a kind warm at every strength (an ally's) has no cooler rung: beside a cold first tie it is a rival's,
    // at the same rung (weak, moderate, strong → professional, personal, bitter), as an enemy's kind turns the other way
    if (cooler === undefined) return { archetype: STRESS_ECONOMIC_EFFECTS.peer_rivalry, strength: RELATIONSHIP_STRENGTHS.rival[rung] ?? RELATIONSHIP_STRENGTHS.rival[0] };
    return { archetype, strength: cooler };
  }
  return { archetype, strength };
}
