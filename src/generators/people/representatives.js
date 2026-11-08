/**
 * people/representatives.js — THE REPRESENTATIVE GENERATOR: one face per face-bearing house, the
 * seat minted where no house carries it (the people car, PEOPLE-1 CAST, 2026-11-07).
 *
 * THE OWNER'S CHARTER (ODQ §934.105, quoted in docs/chair/2026-11-07/PEOPLE-RULINGS-2026-11-07.md
 * §0): "for every appropriate institution, we generate one NPC … I think just one person per
 * institution. They act as the face. We are not building all the citizens of a settlement. That's
 * too granular and the DM can do that work themselves. We are simply making representatives."
 *
 * WHAT IT DOES. Given the roster (the institution rows the settlement carries) and the powers, in
 * ROSTER ORDER, it births one card per house whose registry face is a title
 * (src/data/institutionalCatalog.js :: faceOfInstitution — R-P1), the SEAT's face where no
 * Government-shelf house rolls (the hall or palace's face titled from the governing power, R-P1 c;
 * MINTED from the governing power where no hall rolls either, R-P2), each card drawn on its own
 * keyed fork of the caller's stream (`<stream>::people-faces::<card id>`, so a card's person does
 * not move when another house joins the roster), its body today's NPC record
 * (npcGenerator.js :: generateSingleNPC: name, gender, role, category, personality, physical,
 * goal, secret, plotHooks, influence, power, presentation — every field the surfaces read) PLUS
 *   institution   { kind: 'house' | 'power', key, family, title }
 *   title         the face's title ("the miller"; the seat's from the mint table)
 *   memberships   [] here; the powers' people (people/castPowers.js, step 3) fill it
 * and an id STABLE across regeneration of the same roster: derived from the house's key, never
 * from an array index (`npc_<house slug>`, `npc_seat` for the minted seat).
 *
 * THE POOLS (M-4, no new prose): the role and category a card draws its pools through come from
 * people/poolMap.js — title + shelf → role + category; the seat (housed or minted) takes the
 * tier's seat role so domain/dossier/seatHolder.js finds it as it finds today's.
 *
 * WHAT IT RETIRES FROM BIRTH. The named-NPC roster of npcGenerator.js :: generateNPCs (the tier's
 * mandatory roles, the guild figure, the weighted fills) and the density law's named-roster seams
 * (applyDensityLaw.js :: rollNamedMass at the population step and disperseNamedRoster's rungs at
 * the coherence seam) are no longer called at birth; the powers' count, flags, bands and
 * succession clocks from the same law STAY (resizePoliticalRoster, conserveSeatPower).
 * src/domain/density/densityBands.js is untouched (M-5, signed).
 *
 * Draws: each card's draws land on its own fork; this module takes no draw on the caller's stream
 * itself (a fork is a derivation, not a draw). The display-name pass is draw-free.
 */

import { PERSON_HOOKS_BY_TITLE } from '../../data/personHooksByTitle.js';
import { slugify } from '../../kernel/slugify.js';
import { clearActiveRng, getActiveRng, setActiveRng } from '../../kernel/rngContext.js';
import {
  FACE_SEAT, faceOfInstitution, familyOfInstitution, isFabricInstitution,
} from '../../data/institutionalCatalog.js';
import { backingRowFor } from '../../data/institutionBacking.js';
import { governingFactionOf, nameOf } from '../../domain/rulingPower.js';
import { drawPersonHook, generateSingleNPC } from '../npcGenerator.js';
import { NPC_FACTION_LOYALTY, NPC_HOOK_SIBLINGS } from '../../data/npcData.js';
import { lineText, resolveDeclared, resolveSibling } from '../../domain/facts/drawDeclared.js';
import { factsOf } from '../../domain/facts/factsOf.js';
import { deriveTradeCommodity } from '../tradeCommodity.js';
import { resolveGenerationWorldLaw } from '../generationContext.js';
import { disambiguateNPCDisplayNames } from '../npcDisplayNames.js';
import { hookPoolFor, poolFor, seatPoolFor } from './poolMap.js';
import { seatMintTitleFor } from './mintTitles.js';
import { isHideableHouse, isVeiledPower, veiledCardIdFor } from '../../domain/people/cardVeil.js';

/** The keyed fork every card is drawn under (declared in the fork census). */
export const FACES_FORK_LABEL = 'people-faces';
/**
 * The keyed fork every card's ONE hook is drawn under (PEOPLE-3 HOOKS; declared in the fork
 * census): `people-hooks::<card id>`, minted once per birth seam and keyed per card, drawn in
 * roster order after the cards, so a card's own body (people-faces) is not moved by its hook.
 */
export const HOOKS_FORK_LABEL = 'people-hooks';
/** The minted seat's stable id. */
export const SEAT_CARD_ID = 'npc_seat';
/**
 * The Government-shelf house that is NOT a seat house: the crier announces, he does not sit
 * (PEOPLE-0 §0 fact 2 measured the seat houses "the Government shelf, crier excluded").
 */
const NOT_A_SEAT_HOUSE = Object.freeze(['Town crier']);
/**
 * ONE PERSON, ONE FACE (the revised census at 68851cdd4, M-1b): a row that is the old faction ROLE
 * as an institution yields to the house whose person it names — the village's 'Priest (resident)'
 * row is a face only where no 'Parish church' row (the Access-to-parish-church family) is on the
 * roster; where the church rolls, the row says only that the church's priest is resident.
 * Keyed by the yielding family -> the family it yields to.
 */
export const YIELDS_TO = Object.freeze({ 'Priest (resident)': 'Access to parish church' });

/**
 * THE `other` MINT's card (R-P4), drawn here — the one file whose two `generateSingleNPC` call sites
 * the observed-shape register reads with the transient config spelled inline — for the seam
 * (castPowers.js), which decides WHICH powers are minted once the powers are final.
 * @param {{ role: string, titleKey: string, category: string }} row the title table's row
 * @param {{ tier: string, culture: string, config: Record<string, any>, economicState: Record<string, any> | null | undefined,
 *   powerStructure: { factions?: Array<{ faction?: string }> } | null | undefined, institutions: RosterRow[],
 *   hookRegistry: Record<string, Set<string>>, worldLaw: any }} ctx
 * @param {{ hook?: boolean }} [options] `{ hook: false }`: the seam draws the card's one hook itself
 *   (lane 3's `drawCardHooks`; MERGE-234, one writer per fact)
 */
export function mintPowerFace(row, ctx, options = {}) {
  const npcConfig = {
    ...ctx.config,
    _tradeCommodity: deriveTradeCommodity(ctx.economicState || {}, { firstWordFallback: true }),
    _dominantFaction: ctx.powerStructure?.factions?.[0]?.faction || null,
    _government: ctx.powerStructure?.government ?? null, // MERGE-CAR: CENSUS-4d (R-V) — the goal draw reads the ruler kind the record already has (generateNPCs' npcConfig carries it; the car's birth seams now do too)
    _prosperity: ctx.economicState?.prosperity || null,
  };
  return generateSingleNPC(row.role, row.titleKey, row.category, ctx.culture, ctx.tier, npcConfig, ctx.institutions, ctx.hookRegistry, ctx.worldLaw, options);
}

/** @typedef {{ name?: string, isCustom?: boolean, source?: string }} RosterRow */
/** @typedef {{ kind: 'house' | 'power', key: string, family: string | null, title: string, veiled: boolean }} CardInstitution */

/**
 * The house that carries the SEAT on this roster, or null where none does (the mint's case):
 * the highest-weight Government-shelf house with a titled face (the steward beside the headman),
 * else the first hall or palace (a `'seat'` face) in roster order.
 * @param {RosterRow[]} institutions
 * @returns {{ index: number, house: RosterRow, kind: 'government' | 'hall' } | null}
 */
export function seatHouseOf(institutions) {
  const rows = Array.isArray(institutions) ? institutions : [];
  /** @type {{ index: number, house: RosterRow, weight: number } | null} */
  let government = null;
  let hall = null;
  rows.forEach((house, index) => {
    if (!house || isFabricInstitution(house)) return;
    const face = faceOfInstitution(house);
    const family = familyOfInstitution(house);
    if (face === FACE_SEAT) { if (!hall) hall = { index, house, kind: /** @type {const} */ ('hall') }; return; }
    if (!face || !family || family.shelf !== 'Government' || NOT_A_SEAT_HOUSE.includes(family.key)) return;
    const weight = backingRowFor(house.name)?.weight ?? 1;
    if (!government || weight > government.weight) government = { index, house, weight };
  });
  if (government) return { index: government.index, house: government.house, kind: 'government' };
  return hall;
}

/**
 * A card's stable id from its house: the roster name's slug (the same name at every regeneration
 * of the same roster), suffixed only where the roster carries the name twice. A veiled house's face
 * (`veil` given) takes the opaque form of people/cardVeil.js :: veiledCardIdFor instead.
 * @param {string} name @param {Set<string>} taken @param {{ seed: unknown } | null} [veil]
 */
function cardIdFor(name, taken, veil = null) {
  const slug = slugify(name, { sep: '_', max: 60, fallback: 'house', empty: 'house' });
  // FIX-PUBLIC-VEIL (the second seat): a veiled house's face is born with an opaque id, so the slug
  // never names the house on a public payload; the loop below is the uniqueness guard for both forms.
  const base = veil ? veiledCardIdFor(veil.seed, slug) : `npc_${slug}`;
  let id = base;
  for (let n = 2; taken.has(id); n += 1) id = `${base}_${n}`;
  taken.add(id);
  return id;
}

/**
 * Run `draw` with `stream` as the ambient stream, restoring the caller's.
 * @template T @param {any} stream @param {() => T} draw @returns {T}
 */
export function onStream(stream, draw) {
  const previous = setActiveRng(stream);
  try { return draw(); } finally { clearActiveRng(previous); }
}

/**
 * THE PERSON HOOK, ONE PER CARD (PEOPLE-3 HOOKS, 2026-11-07; the owner: "one plot hook per NPC
 * rather than multiple"). Each card in the order given draws exactly one line from the hook pool
 * its face is keyed to, on `stream.fork(<card id>)`, refusing a text the roster already holds
 * (the shared registry); the card's `plotHooks` becomes that one line.
 * @param {Array<Record<string, any>>} cards
 * @param {(card: Record<string, any>) => string} poolOf the card's hook pool (poolMap.js :: hookPoolFor)
 * @param {{ fork: (label: string) => any } | null} stream the birth seam's `people-hooks` stream; ambient when null
 * @param {Record<string, any>} config @param {any} hookRegistry
 * @param {HookPlace} place the world law, the roster and the tier the hook lines' declarations read (MERGE-CAR)
 */
export function drawCardHooks(cards, poolOf, stream, config, hookRegistry, place) {
  /** @type {Set<string>} the lines the roster holds so far (the registry's titles, when threaded) */
  const held = hookRegistry?.titles instanceof Set ? hookRegistry.titles : new Set();
  for (const card of cards) {
    const pool = poolOf(card);
    const before = new Set(held);
    const draw = () => drawPersonHook(pool, config, hookRegistry, place);
    let line = stream ? onStream(stream.fork(String(card.id)), draw) : draw();
    // THE POOL RAN DRY (a city holds more faces of one kind than its pool has lines): the line
    // drawn is one the roster already holds, so the next unheld line is taken, DRAW-FREE, from
    // the card's own pool, then the other pools in `dryPoolWalk`'s order, each in authored order
    // from an offset keyed by the card's id. Where every one is held, the repeat stands (the
    // writing wave's W7 HOOKS authors by title; the lane's record counts them).
    if (before.has(String(line).trim())) {
      // W7 HOOKS (WAVE-RULINGS item 15): the card's TITLE pool is walked first, then the category walk.
      const spare = spareHookLine([titlePoolName(card.title), ...dryPoolWalk(pool)], before, String(card.id), place);
      if (spare !== null) line = spare;
    }
    held.add(String(line).trim());
    card.plotHooks = [line];
  }
}

/**
 * The pools a card whose own pool ran dry walks, in order: its own, then the portable pools whose
 * lines fit any keeper (`other`, the small settlement's, economy, government), then the
 * specialist ones (criminal, military, religious) — a repeated line on one page is the worse
 * fault (the soak's X-50). The MAGIC pool is walked by a magic face alone: its lines speak of
 * spells and wards, which the world law forbids where magic does not work (measured: walking it
 * put 27 settlements of the soak 1,000 on the receipt's `world_law_magic` check).
 * @param {string} own @returns {string[]}
 */
export function dryPoolWalk(own) {
  return [...new Set([own, 'other', 'small_settlement', 'economy', 'government', 'criminal', 'military', 'religious'])];
}

/**
 * THE TITLE POOL (W7 HOOKS, 2026-11-07; WAVE-RULINGS item 15): a dry-pool walk names a card's own
 * title pool as `title:<title>`; `spareHookLine` resolves it from data/personHooksByTitle.js. A title
 * with no authored pool resolves to an empty pool and the walk moves on to the category pools.
 * @param {unknown} title @returns {string}
 */
export function titlePoolName(title) {
  return `title:${String(title || '').trim().toLowerCase()}`;
}

/** @param {string} name @returns {ReadonlyArray<string> | null} the title pool's lines, or null for a category pool */
function titlePoolLines(name) {
  if (!name.startsWith('title:')) return null;
  return PERSON_HOOKS_BY_TITLE[name.slice('title:'.length)] || [];
}

/** A stable non-negative integer from a string (FNV-1a): a walk's offset, no stream read. @param {string} key */
export function hookOffsetOf(key) {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i += 1) { h ^= key.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h;
}

/**
 * Where a card's hook lines are drawn: the world law (its port kind), the roster and the tier — the
 * facts the census's declared rows read (MERGE-CAR).
 * @typedef {{ worldLaw?: { portKind?: string | null } | null, institutions?: unknown[], tier?: string }} HookPlace
 */

/**
 * The first line of `pools` (in order; each walked in authored order from the key's offset) that
 * `held` does not hold and `accept` admits; null when none. Draw-free. MERGE-CAR, composed with the
 * rung-2 landing's pool census: a row is a line or a declared `{ text, needs }` (CENSUS-3e), so a
 * row whose `needs` the place's facts refuse is skipped (MERGE-R2's ruling 2: the held set and the
 * declarations refuse together), and the wet line resolves through its declared sibling set
 * (`NPC_HOOK_SIBLINGS`, the F5 inland twin dissolved into its table by CENSUS-1c).
 * @param {string[]} pools @param {Set<string>} held @param {string} key
 * @param {HookPlace} [place] @param {(line: string) => boolean} [accept]
 * @returns {string | null}
 */
export function spareHookLine(pools, held, key, place = {}, accept = () => true) {
  const institutions = Array.isArray(place?.institutions) ? place.institutions : [];
  const facts = () => factsOf({ institutions, tier: place?.tier }, { waterKind: place?.worldLaw?.portKind });
  for (const name of [...new Set(pools)]) {
    const pool = /** @type {unknown[]} */ (titlePoolLines(name) ?? NPC_FACTION_LOYALTY[/** @type {keyof typeof NPC_FACTION_LOYALTY} */ (name)] ?? []);
    const start = pool.length ? hookOffsetOf(key) % pool.length : 0;
    for (let i = 0; i < pool.length; i += 1) {
      const row = pool[(start + i) % pool.length];
      const admitted = resolveDeclared(row, { facts, poolId: 'npcData:NPC_FACTION_LOYALTY', surface: 'npcs' }).line;
      if (admitted == null) continue;
      const line = /** @type {string} */ (resolveSibling(lineText(admitted), NPC_HOOK_SIBLINGS, { facts, poolId: 'npcData:NPC_HOOK_SIBLINGS', surface: 'npcs', drawKind: 'T' }));
      if (!held.has(String(line).trim()) && accept(line)) return line;
    }
  }
  return null;
}

/**
 * THE CAST: one card per face-bearing house in roster order, the seat always faced.
 *
 * @param {{ tier?: string, institutions?: RosterRow[], powerStructure?: { factions?: Array<Record<string, unknown>> } | null,
 *   economicState?: Record<string, any> | null, _seed?: unknown }} settlement the roster and the powers as they
 *   stand, and the record's seed (the salt of a veiled face's opaque id)
 * @param {string} culture
 * @param {Record<string, any>} config the effective config (stress, priorities, the world law's inputs)
 * @param {unknown} generationContext
 * @param {{ fork: (label: string) => any } | null} [rng] the caller's stream; the ambient stream when omitted
 * @returns {Array<Record<string, any>>} the cards, roster order, display names disambiguated
 */
export function generateRepresentatives(settlement, culture = 'germanic', config = {}, generationContext = null, rng = null) {
  const root = rng || getActiveRng();
  if (!root || typeof root.fork !== 'function') throw new Error('representatives: no stream to draw the cast on');
  const tier = String(settlement?.tier || 'town');
  const institutions = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  const powerStructure = settlement?.powerStructure || null;
  // FIX-PUBLIC-VEIL (the second seat): the record's seed salts a veiled face's opaque id. It rides the
  // first argument (never the config, whose seed-keyed pickers it would move): the population step
  // and the section regen pass `_seed`.
  const veil = { seed: settlement?._seed ?? null };
  const economicState = settlement?.economicState || {};
  const worldLaw = resolveGenerationWorldLaw(generationContext, config);
  const faces = root.fork(FACES_FORK_LABEL);
  const governing = governingFactionOf(/** @type {any} */ ({ powerStructure }));
  const governingName = nameOf(governing) || null;
  const seat = seatHouseOf(institutions);
  // The same config context generateNPCs handed every figure: the goal and secret pools read the
  // trade commodity, the dominant power and the prosperity through it.
  const npcConfig = {
    ...config,
    _tradeCommodity: deriveTradeCommodity(economicState, { firstWordFallback: true }),
    _dominantFaction: powerStructure?.factions?.[0]?.faction || null,
    _government: powerStructure?.government ?? null, // MERGE-CAR: CENSUS-4d (R-V) — the goal draw reads the ruler kind the record already has (generateNPCs' npcConfig carries it; the car's birth seams now do too)
    _prosperity: economicState?.prosperity || null,
  };
  // The settlement-scoped anti-repetition registry (see generateNPCs): one loyalty string, one
  // beat, one tell, one speech pattern, one goal, one secret per roster.
  const hookRegistry = { titles: new Set(), themes: new Set(), tells: new Set(), speech: new Set(), goals: new Set(), secrets: new Set() };
  const taken = new Set();
  /** @type {Array<Record<string, any>>} */
  const cards = [];
  // the face-bearing families on this roster, for the yield rule
  const facedFamilies = new Set(institutions
    .filter((house) => house && !isFabricInstitution(house) && typeof faceOfInstitution(house) === 'string' && faceOfInstitution(house) !== FACE_SEAT)
    .map((house) => familyOfInstitution(house)?.key)
    .filter(Boolean));

  /**
   * @param {string} id @param {{ role: string, category: string, titleKey: string }} pool
   * @param {string} title @param {CardInstitution} institution @param {string} hookPool
   */
  // the world law: where magic does not function, a `magic`-category pool (the alchemist, the fortune teller) draws
  // its body and hooks from the mundane `other` pools, as today's generator kept such roles mundane (allowsRole)
  const magicFunctions = typeof worldLaw?.magicFunctions === 'function' ? worldLaw.magicFunctions() : true;
  /** @type {Map<string, string>} card id → the person hook's pool (poolMap.js :: hookPoolFor) */
  const hookPools = new Map();
  const birth = (id, pool, title, institution, hookPool) => {
    const category = pool.category === 'magic' && !magicFunctions ? 'other' : pool.category;
    const card = onStream(faces.fork(id), () => generateSingleNPC(
      pool.role, pool.titleKey, category, culture, tier, npcConfig, institutions, hookRegistry, worldLaw, { hook: false },
    ));
    // MERGE-234 (the chair's ruling of 10:4x UTC): a magic-swapped face draws its hook from the pool its
    // EFFECTIVE category maps to after the swap (`other` has its own loyalty list, so no further fallback)
    hookPools.set(id, category !== pool.category ? hookPoolFor(title, null, { category }).pool : hookPool);
    card.id = id;
    card.title = title;
    // M-1b (the owner, 07:1x UTC): the faction roles dissolve — a representative's ROLE is its
    // institution's title; the pool's role was only the key the card's pools were drawn through.
    card.role = title;
    card.institution = institution;
    card.memberships = [];
    cards.push(card);
  };

  institutions.forEach((house, index) => {
    if (!house || isFabricInstitution(house)) return;
    const face = faceOfInstitution(house);
    if (!face) return;
    const family = familyOfInstitution(house);
    if (family && YIELDS_TO[family.key] && facedFamilies.has(YIELDS_TO[family.key])) return;
    const key = String(house.name || '');
    const isSeat = seat !== null && seat.index === index;
    if (face === FACE_SEAT) {
      // R-P1 (c): the hall is the seat's building. Where a Government-shelf house rolls, no face;
      // where none does, the hall IS the seat's house and its face is the seat, titled from the
      // governing power.
      if (!isSeat) return;
      const { title } = seatMintTitleFor(governingName || '');
      birth(cardIdFor(key, taken, isHideableHouse(house) ? veil : null), seatPoolFor(tier), title, { kind: 'house', key, family: family?.key ?? null, title, veiled: isHideableHouse(house) },
        hookPoolFor(title, null, { seat: true }).pool);
      return;
    }
    const pool = isSeat ? seatPoolFor(tier) : poolFor(face, family?.shelf ?? null);
    // FIX-PUBLIC-VEIL (the chair's ruling, shape (a)): the veil bit stamped at birth from the ONE predicate
    // (domain/people/cardVeil.js): a hideable house's face is never named on a public card.
    birth(cardIdFor(key, taken, isHideableHouse(house) ? veil : null), pool, face, { kind: 'house', key, family: family?.key ?? null, title: face, veiled: isHideableHouse(house) },
      hookPoolFor(face, family?.shelf ?? null, { seat: isSeat }).pool);
  });

  // R-P2: no seat house and no hall — the seat's face is minted from the governing power.
  if (!seat && governingName) {
    const { title } = seatMintTitleFor(governingName);
    taken.add(SEAT_CARD_ID);
    birth(SEAT_CARD_ID, seatPoolFor(tier), title, { kind: 'power', key: governingName, family: null, title, veiled: isVeiledPower(governing) },
      hookPoolFor(title, null, { seat: true }).pool);
  }

  // R-P4: the `other` powers' faces are minted at the coherence seam (castPowers.js), where the
  // POWERS ARE FINAL — the assembly's replay thins and adds powers after this step (a thorp's
  // Newcomers' Settlement is gone by the record; a stress faction arrives), so a mint here faced
  // powers the record does not carry (measured: 'minted other' 4 -> 109 a tier). Each seam mint is
  // tied to the seat so the social graph reaches it.
  // ONE HOOK PER CARD (PEOPLE-3 HOOKS), in roster order, each on its own keyed fork.
  drawCardHooks(cards, (card) => hookPools.get(card.id) || 'other', root.fork(HOOKS_FORK_LABEL), npcConfig, hookRegistry, { worldLaw, institutions, tier });

  // Draw-free: a name shared by two cards takes a role qualifier, never a second draw.
  return disambiguateNPCDisplayNames(cards);
}
