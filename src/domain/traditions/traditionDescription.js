/**
 * domain/traditions/traditionDescription.js — TRAD-1 (the seventh chair, 2026-11-20): THE DESCRIPTION UNDER EACH
 * TRADITION. `describeTradition(rec, settlement, { audience })` composes two or three plain sentences from THIS town's own
 * record through the closed table of `data/traditionDescriptionTable.js`:
 *   S1 WHAT IS DONE   the act's lead and the element's gloss (always).
 *   S2 WHO KEEPS IT   in play the record's own owner; else a house of a fitting kind (and the person on that house card,
 *                     under the title the card holds), else a power of the fitting archetype; else nothing.
 *   S3 WHERE IT COMES FROM — a cause, on the two marked pairings only — else WHO PAYS: the town's income of a fitting
 *                     kind, by the rank the record holds; else nothing.
 * Where nothing fits, the description is shorter: S1 alone. Nothing is invented: a clause stands only on a fact the record
 * holds, and a cause only where the table marks the pairing (CTR2).
 *
 * THE AUDIENCE (CTR5) is explicit and FAILS CLOSED to the reader. For a reader who is not the owner the leaf composes
 * from the document it is handed and, as a second wall, BY CLASS: never a house the gallery veil may hide whole
 * (people/cardVeil.js :: isHideableHouse), never a criminal or hidden power (isVeiledPower), and never a person at all (a
 * card's tie to its house is a field a DM may hide card by card). So no byte of a reader's description depends on what a
 * DM has hidden. A hidden power is named for no one: the town does not know it is there.
 *
 * PURE, derived at render, nothing stored (CTR4): no draw (a frame is picked by kernel/proseHash.js :: pickVariant on the
 * record's stable id), no clock, no write, no new key on the town. Genesis is not read here and not changed (CTR3): the
 * record is the caller's, whichever set the surface already shows.
 */
import { pickVariant } from '../../kernel/proseHash.js';
import { powerNameInProse } from '../display/governanceAccount.js';
import { institutionHouseLabel } from '../display/institutionDisplayName.js';
import { factionArchetype, FACTION_ARCHETYPES } from '../factionArchetypes.js';
import { governingFactionOf, nameOf } from '../rulingPower.js';
import { isHideableHouse, isVeiledPower } from '../people/cardVeil.js';
import { catalogIdForName } from '../../data/institutionalCatalog.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { drawDeclared, lineText } from '../facts/drawDeclared.js';
import { factsOf } from '../facts/factsOf.js';
import {
  ACT_LEADS, CRISIS_SCOPED_ACTS, ELEMENT_GLOSS, CRISIS_SCOPED_ELEMENTS, KEEPER_HOUSES, HOUSE_FRAMES, POWER_FRAMES,
  OWNER_FRAMES, CAUSE_FRAMES, DEAD_EVENT_TYPES, DEAD_EVENT_SEVERITIES, ECONOMY_FIT, ECONOMY_FRAMES, ECONOMY_RANKS,
} from '../../data/traditionDescriptionTable.js';

/** @typedef {import('./genesis.js').TraditionRec} TraditionRec */
/** @typedef {import('../../data/traditionDescriptionTable.js').TraditionHouseRow} TraditionHouseRow */
/** @typedef {'owner'|'reader'} TraditionAudience */
/** @typedef {'seat'|'religious'|'merchantry'} TraditionPowerWant */
/** @typedef {Record<string, unknown>} Rec */
/** @typedef {import('../../data/traditionDescriptionTable.js').TraditionIncomeRow} TraditionIncomeRow */
/** @type {Readonly<Record<string, ReadonlyArray<TraditionHouseRow>>>} */
const HOUSES_BY_ELEMENT = KEEPER_HOUSES.element;
/** @type {Readonly<Record<string, ReadonlyArray<TraditionHouseRow>>>} */
const HOUSES_BY_ACT = KEEPER_HOUSES.act;
/** @type {Readonly<Record<string, ReadonlyArray<TraditionIncomeRow>>>} */
const INCOMES_BY_KEY = ECONOMY_FIT;
/** @type {Readonly<Record<string, ReadonlyArray<string>>>} */
const ECONOMY_BY_BAND = ECONOMY_FRAMES;
/**
 * @typedef {Object} TraditionDescription
 * @property {string} text  the description, two or three sentences, or one (the short form)
 * @property {{ houses: string[], persons: string[], powers: string[], events: string[] }} named  what the text names, by
 *   the record's own spelling (a house's raw catalogue name, a card's name, a power's name, an event's name)
 * @property {{ keeper: 'owner'|'house'|'power'|null, origin: 'cause'|'economy'|null }} parts  which clauses stand
 */

/** The audiences the leaf composes for; anything else reads as the reader. */
export const TRADITION_AUDIENCES = Object.freeze(['owner', 'reader']);

const FOUNDING_ELEMENTS = new Set(['founding', 'first-landing', 'charter']);
const DEVOTIONAL_ACTS = new Set(['offering', 'vigil']);
const DEVOTIONAL_ELEMENTS = new Set(['the-dead', 'stars']);
const DEAD_EVENTS = new Set(DEAD_EVENT_TYPES);

/** @param {unknown} v @returns {Rec} */
const recordOf = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Rec} */ (v) : {});
/** @param {unknown} v @returns {unknown[]} */
const listOf = (v) => (Array.isArray(v) ? v : []);
/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v : '');
/** @param {string} s @returns {string} */
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
/** @param {string} template @param {Record<string, string>} slots @returns {string} */
const fill = (template, slots) => template.replace(/\{(\w+)\}/g, (_, k) => slots[k] ?? '');
/**
 * THE ONE DRAW (CTR10): the composer's selector (`pickVariant` on the record's stable id) over the FULL pool, the drawn line
 * resolved through `drawDeclared` against the facts of the record the leaf was handed (a refused line moves to its twin,
 * else the admitted argmax, else nothing). Fail-closed as the house's draw is.
 * @template L
 * @param {ReadonlyArray<L>} pool @param {string} key @param {string} poolId @param {() => object|null} facts
 * @param {boolean} [crisisScoped] @returns {string}
 */
function draw(pool, key, poolId, facts, crisisScoped = false) {
  const drawn = drawDeclared(pool, {
    draw: (p) => pickVariant(p, key), facts, key, poolId: `traditionDescription:${poolId}`, surface: 'traditions', drawKind: 'H', crisisScoped,
  });
  const text = drawn.line == null ? null : lineText(drawn.line);
  return typeof text === 'string' ? text : '';
}

/**
 * The power archetype a rite wants: the engine's own owner table (politics.js :: desiredArchetype, design §6), less its
 * fallback (the seat for everything else): a description names no seat it has no fit for.
 * @param {Rec} rec @param {string} element @param {string} act @param {boolean} core @returns {TraditionPowerWant|null}
 */
function wantedPower(rec, element, act, core) {
  if (core || FOUNDING_ELEMENTS.has(element)) return 'seat';
  if (str(rec.deityRef) || DEVOTIONAL_ACTS.has(act) || DEVOTIONAL_ELEMENTS.has(element)) return 'religious';
  if (act === 'fair' || element === 'market') return 'merchantry';
  // politics gives a contest to the military; a description does not: a war party or an armed movement is no keeper
  // of games, and the Guard is the defence home's to name (facts/defence.js), so a contest names a house or nothing.
  return null;
}

/**
 * A house in a sentence, with its article: the house's display label (institutionHouseLabel), less a leading count word
 * ("Multiple", "Major"), a trailing qualifier in brackets and an alternative after a slash.
 * @param {Rec} inst @returns {string}
 */
function houseInProse(inst) {
  const label = institutionHouseLabel(inst).replace(/^(multiple|major)\s+/i, '').replace(/\s*\([^)]*\)\s*$/, '').replace(/\/.*$/, '').trim();
  if (!label) return '';
  const words = label.split(' ');
  const proper = words.length > 1 && words.every((w) => /^[A-Z]/.test(w));
  return `the ${proper ? label : label[0].toLowerCase() + label.slice(1)}`;
}

/**
 * The first house the town holds of a fitting kind, in the rows' order.
 * @param {ReadonlyArray<TraditionHouseRow>|undefined} rows @param {Rec} settlement @param {boolean} reader
 * @returns {{ inst: Rec, name: string, row: TraditionHouseRow, prose: string }|null}
 */
function houseFor(rows, settlement, reader) {
  // A ruined or inactive house keeps no rite: the live roster only (institutions/institutionRoster.js).
  const houses = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement)).map(recordOf).filter((i) => str(i.name));
  /** @param {Rec} i @returns {string} */
  const idOf = (i) => str(i.catalogId) || str(catalogIdForName(str(i.name)));
  for (const row of rows || []) {
    for (const id of row.ids) {
      const inst = houses.find((i) => idOf(i) === id && !(reader && isHideableHouse(i)));
      const prose = inst ? houseInProse(inst) : '';
      if (inst && prose) return { inst, name: str(inst.name), row, prose };
    }
  }
  return null;
}

/**
 * The person who presides: the first card whose house is this one and which carries the house's title, as the card holds it.
 * @param {string} houseName @param {Rec} settlement @param {boolean} reader @returns {{ name: string, title: string }|null}
 */
function presiderOf(houseName, settlement, reader) {
  // THE READER NAMES NO PERSON. A card's tie to its house (`institution`) is a field the DM may hide card by card
  // (galleryVeil.js, the npc kind's `ties`), while its name and title are on the floor: a reader's sentence linking a
  // person to a house would depend on what a DM hid. So the reader's description names houses and powers, never a face.
  if (reader) return null;
  for (const card of listOf(settlement.npcs).map(recordOf)) {
    const house = recordOf(card.institution);
    if (str(house.key) !== houseName || !str(house.title) || !str(card.name)) continue;
    return { name: str(card.name), title: str(house.title) };
  }
  return null;
}

/**
 * The power of the wanted archetype: the seat, or the strongest power of the kind. A hidden power is never named; a
 * criminal one never for a reader.
 * @param {TraditionPowerWant} want @param {Rec} settlement @param {boolean} reader @returns {string|null}
 */
function powerFor(want, settlement, reader) {
  /** @param {Rec} f @returns {boolean} */
  const barred = (f) => (reader ? isVeiledPower(f) : f.hidden === true);
  if (want === 'seat') {
    const seat = recordOf(governingFactionOf(/** @type {Parameters<typeof governingFactionOf>[0]} */ (settlement)));
    const name = str(nameOf(/** @type {Parameters<typeof nameOf>[0]} */ (seat)));
    return name && !barred(seat) ? name : null;
  }
  /** @param {Rec} f @returns {boolean} */
  const fits = (f) => {
    const a = factionArchetype(f);
    if (want === 'merchantry') return a === FACTION_ARCHETYPES.MERCHANT || a === FACTION_ARCHETYPES.CRAFT;
    return a === FACTION_ARCHETYPES.RELIGIOUS;
  };
  const candidates = listOf(recordOf(settlement.powerStructure).factions).map(recordOf).filter((f) => !barred(f) && fits(f));
  /** @param {Rec} f @returns {string} */
  const n = (f) => str(nameOf(/** @type {Parameters<typeof nameOf>[0]} */ (f)));
  const best = candidates.sort((x, y) => (Number(y.power) || 0) - (Number(x.power) || 0) || (n(x) < n(y) ? -1 : n(x) > n(y) ? 1 : 0))[0];
  return best && n(best) ? n(best) : null;
}

/**
 * The record's own owner, in play, as the document the leaf was handed holds it. A power must stand among the town's
 * powers by that exact name (and, for a reader, not veiled; for anyone, not hidden); a house among its houses (and, for a
 * reader, not hideable). Otherwise the owner is not named.
 * @param {Rec} rec @param {Rec} settlement @param {boolean} reader @returns {{ prose: string, name: string, power: boolean }|null}
 */
function ownerFor(rec, settlement, reader) {
  const label = str(rec.ownerLabel);
  if (!label) return null;
  const kind = str(rec.ownerKind);
  if (kind === 'faction' || kind === 'seat') {
    const power = listOf(recordOf(settlement.powerStructure).factions).map(recordOf)
      .find((f) => str(nameOf(/** @type {Parameters<typeof nameOf>[0]} */ (f))) === label);
    if (!power || power.hidden === true || (reader && isVeiledPower(power))) return null;
    const prose = powerNameInProse(label);
    return prose ? { prose, name: label, power: true } : null;
  }
  if (kind === 'institution') {
    const inst = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement)).map(recordOf).find((i) => str(i.name) === label);
    if (!inst || (reader && isHideableHouse(inst))) return null;
    const prose = houseInProse(inst);
    return prose ? { prose, name: label, power: false } : null;
  }
  return null;
}

/**
 * Describe one tradition for one audience. Null for a DM's authored custom tradition (the DM's truth stands as authored),
 * for a motif the table does not know, and for no record or no town.
 * @param {TraditionRec|Rec|null|undefined} recIn
 * @param {Rec|null|undefined} settlementIn
 * @param {{ audience?: TraditionAudience|string }} [options]  the audience; anything but 'owner' reads as the reader
 * @returns {TraditionDescription|null}
 */
export function describeTradition(recIn, settlementIn, options = {}) {
  if (!recIn || typeof recIn !== 'object' || !settlementIn || typeof settlementIn !== 'object') return null;
  const rec = recordOf(recIn);
  const settlement = recordOf(settlementIn);
  const id = str(rec.id) || str(rec.name);
  if (id.startsWith('custom:')) return null;
  const motif = recordOf(rec.coreMotif);
  const element = str(motif.element);
  const act = str(motif.act);
  const glossPool = /** @type {Record<string, ReadonlyArray<import('../../data/traditionDescriptionTable.js').TraditionLine>>} */ (ELEMENT_GLOSS)[element];
  const leadPool = /** @type {Record<string, ReadonlyArray<import('../../data/traditionDescriptionTable.js').TraditionLine>>} */ (ACT_LEADS)[act];
  if (!glossPool || !leadPool) return null;

  const reader = options.audience !== 'owner';
  const core = /\.0$/.test(id) && rec.foundedYear === 1;
  const town = str(settlement.name);
  /** @type {object|null|undefined} */
  let factsMemo;
  const facts = () => {
    if (factsMemo === undefined) factsMemo = factsOf(/** @type {Parameters<typeof factsOf>[0]} */ (settlement));
    return factsMemo ?? null;
  };
  /** @type {TraditionDescription['named']} */
  const named = { houses: [], persons: [], powers: [], events: [] };
  /** @type {TraditionDescription['parts']} */
  const parts = { keeper: null, origin: null };

  // S1 WHAT IS DONE: a lead (by act) and a gloss (by element), each a declared pool; a refused gloss and no twin: no S1
  // gloss, and the lead stands with what the name already says ("A procession.").
  const lead = draw(leadPool, `${id}#done`, `lead.${act}`, facts, CRISIS_SCOPED_ACTS.includes(act));
  const glossText = draw(glossPool, `${id}#gloss`, `gloss.${element}`, facts, CRISIS_SCOPED_ELEMENTS.includes(element));
  if (!lead) return null;
  const s1 = glossText ? `${lead} that ${glossText}.` : `${lead}.`;

  // S2 WHO KEEPS IT
  let s2 = '';
  const want = wantedPower(rec, element, act, core);
  const owner = ownerFor(rec, settlement, reader);
  if (owner) {
    s2 = fill(draw(OWNER_FRAMES, `${id}#owner`, 'owner', facts), { owner: owner.prose, Owner: cap(owner.prose) });
    parts.keeper = 'owner';
    (owner.power ? named.powers : named.houses).push(owner.name);
  } else if (!str(rec.ownerLabel)) {
    const house = want === 'seat' ? null
      : (houseFor(HOUSES_BY_ELEMENT[element], settlement, reader) || houseFor(HOUSES_BY_ACT[act], settlement, reader));
    if (house) {
      const person = presiderOf(house.name, settlement, reader);
      const power = !person && house.row.kind === 'place' && want ? powerFor(want, settlement, reader) : null;
      const key = house.row.kind === 'body' ? (person ? 'bodyPerson' : 'body') : (person ? 'placePerson' : (power ? 'placePower' : 'place'));
      s2 = fill(draw(HOUSE_FRAMES[key], `${id}#house`, `house.${key}`, facts), {
        house: house.prose, House: cap(house.prose), person: person ? person.name : '', title: person ? person.title : '',
        power: power ? powerNameInProse(power) : '',
      });
      parts.keeper = 'house';
      named.houses.push(house.name);
      if (person) named.persons.push(person.name);
      if (power) named.powers.push(power);
    } else if (want) {
      const power = powerFor(want, settlement, reader);
      if (power) {
        s2 = fill(draw(POWER_FRAMES[want], `${id}#power`, `power.${want}`, facts), { power: powerNameInProse(power), Power: powerNameInProse(power, true) });
        parts.keeper = 'power';
        named.powers.push(power);
      }
    }
  }

  // S3 WHERE IT COMES FROM (a cause, on a marked pairing only); else WHO PAYS (the economy)
  let s3 = '';
  const history = recordOf(settlement.history);
  const founding = recordOf(history.founding);
  const age = Number(founding.age);
  if (core && town && Number.isFinite(age) && age > 0) {
    const by = str(founding.foundedBy);
    s3 = fill(draw(by ? CAUSE_FRAMES.founding : CAUSE_FRAMES.foundingBare, `${id}#origin`, by ? 'cause.founding' : 'cause.foundingBare', facts),
      { town, Town: town, age: String(age), foundedBy: by });
    parts.origin = 'cause';
  } else if (element === 'the-dead') {
    /** @param {Rec} e @returns {boolean} */
    const graded = (e) => [e.severity].flat().some((v) => DEAD_EVENT_SEVERITIES.includes(str(v)));
    const event = listOf(history.historicalEvents).map(recordOf)
      .filter((e) => DEAD_EVENTS.has(str(e.templateType)) && graded(e) && str(e.name) && Number.isFinite(Number(e.yearsAgo)) && Number(e.yearsAgo) >= 1)
      .sort((a, b) => Number(a.yearsAgo) - Number(b.yearsAgo))[0];
    if (event && town) {
      const years = Number(event.yearsAgo);
      s3 = fill(draw(CAUSE_FRAMES.dead, `${id}#origin`, 'cause.dead', facts), {
        event: str(event.name).replace(/^The /, 'the '), when: years === 1 ? 'a year ago' : `${years} years ago`, Town: town,
      });
      parts.origin = 'cause';
      named.events.push(str(event.name));
    }
  }
  if (!s3 && town) {
    const incomes = listOf(recordOf(settlement.economicState).incomeSources).map(recordOf);
    const fits = [...(INCOMES_BY_KEY[element] || []), ...(INCOMES_BY_KEY[act] || [])];
    for (const fit of fits) {
      const rank = incomes.findIndex((i) => str(i.source) === fit.source);
      if (rank < 0 || rank >= ECONOMY_RANKS.length) continue;
      const band = incomes.length === 1 ? 'only' : ECONOMY_RANKS[rank];
      s3 = fill(draw(ECONOMY_BY_BAND[band] || [], `${id}#economy`, `economy.${band}`, facts), {
        income: fit.prose, Income: cap(fit.prose), is: fit.plural ? 'are' : 'is', brings: fit.plural ? 'bring' : 'brings', town, Town: town,
      });
      parts.origin = 'economy';
      break;
    }
  }

  return { text: [s1, s2, s3].filter(Boolean).join(' '), named, parts };
}
