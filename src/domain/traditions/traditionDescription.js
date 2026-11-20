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
 * CTR11 (the chair, 2026-11-20; vetoable by the owner): THE READER'S TEXT IS A FUNCTION ONLY OF FACTS NO ACT OF THE DM
 * CAN HIDE: not only what it names, every word it CHOOSES. The reader's text is composed over `readerView` (below): the
 * record less every row of a class the gallery veil withholds whole or the reader's wall never names (by the class, never
 * by name, never by today's settings). THE CENSUS of the clauses that rank, count, choose or exclude, and their rows:
 *   S1 lead and gloss   CHOOSE a line: `pickVariantMixed` on the key (identity, not a row), then `drawDeclared`'s admission over
 *                       `factsOf(view)`. The table's needs read `market` and `institution: smith` (the view's live roster: no
 *                       hideable house), `navigable`/`river`/`coast` (geography) and the crisis families (the
 *                       stress record); none is a row the veil withholds once the view is taken. `market` reads a house's
 *                       own `tags`, else the catalogue's for its NAME (facts/market.js :: isMarketInstitution): the view
 *                       strips every field the house's `function` eye can remove (TRAD-3 unit 4), so for a reader it reads
 *                       the house's name only (its floor).
 *   S2 owner            CHOOSES nothing: the record's own owner, named only where the view holds it by that exact name (a
 *                       veiled power or hideable house is out of the view); absent, the keeper slot stays empty (no other
 *                       keeper stands in), so the text is the same whether the withheld owner's row is there or not.
 *   S2 house (houseFor) CHOOSES the first live house of a fitting kind in the table's order, over the view's roster (no
 *                       hideable house: people/cardVeil.js :: isHideableHouse), so none can stand earlier in the order.
 *   S2 power (powerFor) CHOOSES the seat (rulingPower.js :: governingFactionOf over the view's powers, so a veiled power
 *                       flagged governing cannot stand ahead of the served seat) or the STRONGEST power of an archetype
 *                       (by `power`, over the view's powers: no isVeiledPower row can outrank the one named). The view
 *                       strips from every power every field any of its eyes can remove (galleryVeil.js ::
 *                       CARD_KINDS.faction.fields), so a power with no mapped category takes no archetype from its
 *                       `description` (factionArchetypes.js :: factionArchetype's fallback; TRAD-4 unit 7).
 *   S2 presider         none for a reader (a card's tie is a field the DM may hide card by card).
 *   S3 founding         for the OWNER, CHOOSES between the two founding pools by whether the record holds `foundedBy`; for a
 *                       READER, never reads `foundedBy` (always the bare pool: an editable field veil-22's name sweep
 *                       removes when it holds a hidden name; TRAD-3 unit 4). Both state the founding's `age`.
 *   S3 the dead         CHOOSES the most recent graded event by `yearsAgo` over history.historicalEvents: the veil hides an
 *                       event's fields, never its row, and the fields read (name, templateType, severity, yearsAgo) are on
 *                       the event card's floor (galleryVeil.js :: CARD_KINDS.event). But veil-22's name sweep removes an
 *                       event whole when its name holds a hidden name, so for a READER (TRAD-3 unit 4, the chair's item 3)
 *                       the choice is only among events whose name holds no house, person or power name the WHOLE record
 *                       holds (hidden or shown: heldNamesOf), and the event is named by its KIND (DEAD_EVENT_PHRASES),
 *                       never by `event.name`. "Holds" is the chair's WORD rule (TRAD-4 unit 7; 13:59 UTC, re-stated
 *                       15:10 UTC; holdsAName): the event's name shares no word with any held name (runs of letters and
 *                       apostrophes, case-folded, a held word less its end apostrophes and possessive 's, a qualifier's
 *                       words in, HELD_NAME_STOP_WORDS out, an event word that begins with a held word caught), with the
 *                       whole name, full and bare, as its floor: wider than any by-name withholding, a hidden house's
 *                       bare form (migration 212's sweep) among them.
 *   S3 economy          RANKS the fitting income (chief / lesser) and COUNTS the incomes ('only') over the view's
 *                       incomeSources: the criminal income row (`isCriminal: true`), the one row the veil withholds whole
 *                       (gallerySecondHomes.js :: withholdCriminalIncome, on the veil lane), is out of the view.
 *   The owner's audience reads the record whole: nothing here changes the owner's page.
 *
 * ONE TOWN PRINTS NO SENTENCE TWICE (TRAD-4 unit 10; the chair, reading the owner's thirty; vetoable by the owner): a
 * caller that shows a SET of rites passes it (`options.set`, the set the surface shows, in its order), and inside it a
 * frame slot's wording is taken BY ROTATION (drawTurn): the first rite takes its pick as alone; a later rite whose pick
 * would print a sentence an earlier rite of the set printed takes the first wording, going on from its pick, that none
 * printed; a KEEPER slot then goes on to its kind's two "too" wordings (KEEPER_FRAMES_TOO, never a pick; the chair,
 * 17:55 UTC) and only beyond them is the keeper sentence left out; where every wording is taken the PAYER sentence is
 * left out (a rite need not say twice what the town lives on); a cause keeps its pick. Keyed, no new draw, no clock, nothing stored; a rite alone, or with no set,
 * reads exactly as before. THE READER'S SET (CTR11) is the drawn set (shownTraditions.js :: descriptionSetOf), never a
 * row a DM can hide, and the reader's rotation reads only the reader's own compositions of its rites.
 *
 * PURE, derived at render, nothing stored (CTR4): no draw (a frame is picked by kernel/proseHash.js :: pickVariantMixed on
 * a key of the settlement's identity and the record's stable id; TRAD-4 unit 11: the FNV hash mixed before the modulo, so
 * keys that differ only in their characters' high bits no longer take one line), no clock, no write, no new key on the
 * town. Genesis is not read here and not changed (CTR3): the record is the caller's, whichever set the surface shows.
 * The record's `lastOutcome` and `lastHeldYear` are never read: the text never says what became of the rite this year
 * (TRAD-4 unit 5; tests/domain/traditionDescription.test.js holds it). Every pool the leaf draws, frames included, is a
 * table of declared lines (CTR10), drawn through the one `draw` below.
 */
import { pickVariantMixed } from '../../kernel/proseHash.js';
import { powerNameInProse } from '../display/governanceAccount.js';
import { institutionHouseLabel } from '../display/institutionDisplayName.js';
import { houseSentenceName } from '../../data/houseSentenceName.js';
import { powerVerb } from '../../data/people/powerSentenceName.js';
import { factionArchetype, FACTION_ARCHETYPES } from '../factionArchetypes.js';
import { governingFactionOf, nameOf } from '../rulingPower.js';
import { isHideableHouse, isVeiledPower } from '../people/cardVeil.js';
import { CARD_KINDS } from '../display/galleryVeil.js';
import { catalogIdForName } from '../../data/institutionalCatalog.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { drawDeclared, lineText } from '../facts/drawDeclared.js';
import { factsOf } from '../facts/factsOf.js';
import { isColourLine } from '../facts/factVocabulary.js';
import {
  ACT_LEADS, CRISIS_SCOPED_ACTS, ELEMENT_GLOSS, CRISIS_SCOPED_ELEMENTS, KEEPER_HOUSES, HOUSE_FRAMES, POWER_FRAMES,
  OWNER_FRAMES, CAUSE_FRAMES, DEAD_EVENT_TYPES, DEAD_EVENT_SEVERITIES, DEAD_EVENT_PHRASES, ECONOMY_FIT, ECONOMY_FRAMES,
  ECONOMY_RANKS, POWER_FRAME_VERBS, KEEPER_FRAMES_TOO,
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
/** @type {Readonly<Record<string, ReadonlyArray<import('../../data/traditionDescriptionTable.js').TraditionLine>>>} */
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
/** The veil's card kind of a house (galleryVeil.js :: CARD_KINDS), addressed by its name as the veil addresses its kinds. */
const HOUSE_CARD_KIND = 'institution';
/** The keys a house's `function` eye removes, as the veil declares them. @type {ReadonlyArray<string>} */
const FUNCTION_KEYS = CARD_KINDS[HOUSE_CARD_KIND].fields.function;
/**
 * A house less its function-eye fields (a copy; a house holding none is returned as it is): what a fact reads of a house
 * once the DM's `function` eye may be shut, its floor. The reader's view (below) and the shared page's drawn set
 * (shownTraditions.js :: sharedTraditionRowsOf) read houses through it.
 * @param {unknown} i @returns {unknown}
 */
export function withoutFunction(i) {
  const house = recordOf(i);
  if (!FUNCTION_KEYS.some((k) => k in house)) return i;
  /** @type {Rec} */
  const out = { ...house };
  for (const k of FUNCTION_KEYS) delete out[k];
  return out;
}

/**
 * THE READER'S VIEW (CTR11): the record less every row of a withheld class, so no rank, count or choice the reader's text
 * makes can be shifted by a row a DM may hide: hideable houses (people/cardVeil.js :: isHideableHouse, the class the
 * gallery veil removes whole), veiled powers (cardVeil.js :: isVeiledPower, the reader's wall) and the criminal income row
 * (`isCriminal: true`, gallerySecondHomes.js :: withholdCriminalIncome's class); and, from every house left, every field
 * its `function` eye can remove (galleryVeil.js :: CARD_KINDS.institution.fields.function, the veil's own declaration,
 * read here and never copied), so a fact the reader's text admits by reads a house's floor (TRAD-3 unit 4). The
 * hideable class is read on the house whole, before the strip (an illegal brokerage is known by its own tags). Likewise
 * every power left less every field any of its eyes can remove (CARD_KINDS.faction.fields; TRAD-4 unit 7), the veiled
 * class read on the power whole. Everything else is the record's own. A shallow copy: the record is never written.
 * @param {Rec} settlement @returns {Rec}
 */
function readerView(settlement) {
  const ps = recordOf(settlement.powerStructure);
  const economy = recordOf(settlement.economicState);
  // CTR11 (TRAD-4 unit 7): every field any eye of a power can remove (galleryVeil.js :: CARD_KINDS.faction.fields, the
  // veil's own declaration, read and never copied; none is the power's name or category), stripped from every power as
  // withoutFunction strips a house: a power with no mapped category takes no archetype from its `description`.
  const powerEyeKeys = Object.values(CARD_KINDS.faction.fields).flat();
  /** @param {unknown} f @returns {unknown} */
  const powerFloor = (f) => {
    const power = recordOf(f);
    if (!powerEyeKeys.some((k) => k in power)) return f;
    /** @type {Rec} */
    const out = { ...power };
    for (const k of powerEyeKeys) delete out[k];
    return out;
  };
  return {
    ...settlement,
    // the live roster (institutions/institutionRoster.js): every reader of the roster here reads it live already
    institutions: liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement))
      .filter((i) => !isHideableHouse(recordOf(i))).map(withoutFunction),
    powerStructure: { ...ps, factions: listOf(ps.factions).filter((f) => !isVeiledPower(f)).map(powerFloor) },
    economicState: { ...economy, incomeSources: listOf(economy.incomeSources).filter((r) => recordOf(r).isCriminal !== true) },
  };
}

/**
 * Every name of a house, a person or a power the WHOLE record holds, hidden or shown (lower-cased): every copy of the
 * gallery veil's institution, npc and faction kinds (galleryVeil.js :: CARD_KINDS[kind].lists, a `*` walking every
 * owner), read on the owner's record and never on the reader's view, so the set is no function of what a DM hides. Each
 * name is whole, its bracketed qualifier in ("Rookery (word of mouth)"): holdsAName cuts it into words.
 * @param {Rec} whole @returns {string[]}
 */
function heldNamesOf(whole) {
  /** @type {Set<string>} */
  const names = new Set();
  /** @param {unknown} v */
  const add = (v) => { const n = str(v).trim().toLowerCase(); if (n) names.add(n); };
  /** @param {unknown} root @param {ReadonlyArray<string>} path @returns {Rec[]} */
  const at = (root, path) => {
    const star = path.indexOf('*');
    if (star >= 0) return at(root, path.slice(0, star)).flatMap((owner) => at(owner, path.slice(star + 1)));
    let cur = root;
    for (const seg of path) cur = recordOf(cur)[seg];
    return listOf(cur).filter((x) => x && typeof x === 'object' && !Array.isArray(x)).map(recordOf);
  };
  for (const kind of ['institution', 'npc', 'faction']) {
    for (const path of CARD_KINDS[kind].lists) for (const card of at(whole, path)) { add(card.name); add(card.faction); }
  }
  return [...names];
}

/**
 * THE CLOSED STOP LIST of the reader's dead-cause word rule (the chair, 2026-11-20 13:59 UTC; vetoable by the owner): the
 * only held words that do not count. Pinned by tests/domain/traditionDescription.test.js.
 */
export const HELD_NAME_STOP_WORDS = Object.freeze(['the', 'a', 'an', 'of', 'and', 'in', 'on', 'at', 'by', 'for', 'to']);

/**
 * THE CHAIR'S WORD RULE (TRAD-4 unit 7; the chair, 13:59 UTC, re-stated 15:10 UTC, ADDENDUM 1): does an event's name
 * share a word with any of the names? (a) A WORD is a maximal run of letters and apostrophes (U+0027, U+2019 and U+02BC all
 * read as the apostrophe), case-folded: an apostrophe never splits a word; digits, marks and other punctuation separate.
 * (b) A HELD word: its end apostrophes dropped, then a trailing possessive 's, then every inner apostrophe deleted
 * ("Cobbler's" → cobbler; "Smiths'" → smiths; "O'Brien's" → obrien); every word of a name counts, its bracketed
 * qualifier's too, of any length, but HELD_NAME_STOP_WORDS. (c) An EVENT word: every apostrophe deleted, nothing dropped.
 * (d) An event word that BEGINS WITH a held word counts as that word. (e) THE WHOLE-NAME FLOOR: the event's name holding a
 * name whole, full or bare (less its bracketed qualifier), at the start of a word, as the rule before it read: a held name
 * of stop words alone is still caught.
 * @param {string} eventName @param {ReadonlyArray<string>} names @returns {boolean}
 */
export function holdsAName(eventName, names) {
  /** @param {string} s @returns {string[]} */
  const wordsOf = (s) => s.toUpperCase().toLowerCase().replace(/[\u2019\u02BC]/g, "'").match(/[\p{L}']+/gu) || [];
  const held = [...new Set(names.flatMap(wordsOf).map((w) => w.replace(/^'+|'+$/g, '').replace(/'s$/, '').replace(/'/g, '')))]
    .filter((w) => w && !HELD_NAME_STOP_WORDS.includes(w));
  const words = wordsOf(eventName).map((w) => w.replace(/'/g, ''));
  if (words.some((w) => held.some((h) => w.startsWith(h)))) return true;
  const text = eventName.toLowerCase();
  const whole = names.flatMap((n) => { const full = n.trim().toLowerCase(); return [full, full.replace(/\s*\([^)]*\)\s*$/, '')]; }).filter(Boolean);
  return whole.some((n) => {
    for (let i = text.indexOf(n); i >= 0; i = text.indexOf(n, i + 1)) if (i === 0 || !/[\p{L}\p{N}]/u.test(text[i - 1])) return true;
    return false;
  });
}

/**
 * The settlement's identity a draw is keyed on: the desks' own display convention (`String(s._seed ?? s.id)`,
 * domain/display/publicProse.js's law; components/new/powerDeskRead.js and its siblings read the same). The seed stands
 * first, so a record keeps its key when a save stamps its id, and the composer at save (shownTraditions.js ::
 * sharedTraditionRowsOf) runs on this same owner's record: the owner's page and the reader's drawn row share one key.
 * @param {Rec} settlement @returns {string}
 */
const settlementSeedOf = (settlement) => String(settlement._seed ?? settlement.id ?? '');

/**
 * THE ONE DRAW (CTR10): the composer's selector (`pickVariantMixed` on `seed::slot`, the settlement's identity then the
 * record's stable id and the slot) over the FULL pool, the drawn line resolved through `drawDeclared` against the facts of
 * the record the leaf was handed (a refused line moves to its twin, else the admitted argmax under the same key, else
 * nothing). Fail-closed as the house's draw is. `turned` (drawTurn's only): the line the rotation took in place of the pick.
 * @template L
 * @param {ReadonlyArray<L>} pool @param {string} seed the settlement's identity (settlementSeedOf)
 * @param {string} slot the record's id and the slot @param {string} poolId @param {() => object|null} facts
 * @param {boolean} [crisisScoped] @param {L} [turned] @returns {string}
 */
function draw(pool, seed, slot, poolId, facts, crisisScoped = false, turned = undefined) {
  const drawn = drawDeclared(pool, {
    draw: (p) => (turned === undefined ? pickVariantMixed(p, `${seed}::${slot}`) : turned), facts, key: `${seed}::${slot}`,
    poolId: `traditionDescription:${poolId}`, surface: 'traditions', drawKind: 'H', crisisScoped,
  });
  const text = drawn.line == null ? null : lineText(drawn.line);
  return typeof text === 'string' ? text : '';
}

/**
 * THE ROTATION (TRAD-4 unit 10): one frame slot's sentence, its wording taken by rotation inside the town's set. With no
 * sentence taken (a rite alone, or the first of its set) this is `render(draw(…))`, byte for byte. Otherwise, over a pool
 * of colour lines only (every frame table: a colour line is admitted everywhere, so the line taken is the line printed):
 * the first wording, going on from the pick (`pickVariantMixed` on the same key, the pool's own order, wrapping), then the
 * `again` wordings in their order (a keeper's KEEPER_FRAMES_TOO: never in the pick's domain), whose sentence is not among
 * `taken`, drawn through the one draw (over the pool and its `again` lines, so the ledger's line id indexes both). Every
 * wording taken: null where `leaveOut` (the payer, and a keeper beyond its fifth: the sentence is left out), else the
 * pick as alone. A pool with a declared line or a twin is drawn as alone.
 * @template L
 * @param {ReadonlyArray<L>} pool @param {string} seed @param {string} slot @param {string} poolId
 * @param {() => object|null} facts @param {(text: string) => string} render the frame filled with its slots
 * @param {Set<string>|null} taken the sentences the set's earlier rites printed @param {boolean} [leaveOut]
 * @param {ReadonlyArray<L>} [again] the wordings after the pool's own (a keeper's "too" lines), reached only here
 * @returns {string|null}
 */
function drawTurn(pool, seed, slot, poolId, facts, render, taken, leaveOut = false, again = []) {
  const all = [...pool, ...again];
  if (taken && taken.size > 0 && all.length > 1 && all.every((l) => isColourLine(l))) {
    const start = pool.indexOf(/** @type {L} */ (pickVariantMixed(pool, `${seed}::${slot}`)));
    const free = [...pool.keys()].map((k) => pool[(start + k) % pool.length]).concat(again)
      .find((l) => !taken.has(render(String(lineText(l)))));
    if (free === undefined) {
      if (leaveOut) return null;
    } else if (free !== pool[start]) {
      return render(draw(all, seed, slot, poolId, facts, false, free));
    }
  }
  return render(draw(pool, seed, slot, poolId, facts));
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
 * A house in a sentence, with its article: the house's prose form (data/houseSentenceName.js :: houseSentenceName over
 * its display label, institutionDisplayName.js :: institutionHouseLabel), so "Colosseum/arena" reads "the arena". The
 * helper covers the slash labels; two strips it does not cover stay, each for its own reason:
 *   - a leading count word ("Multiple market squares", "Major monasteries (5-10)" → "Major monasteries"):
 *     institutionHouseLabel keeps it as the roster's label, and the frame's article reads "the multiple market squares";
 *   - a trailing qualifier in brackets that is not catalogue machinery ("Priest (resident)", "Resident smith
 *     (part-time)"): institutionHouseLabel strips only machinery brackets, and a bracket inside a sentence is a gloss.
 * @param {Rec} inst @returns {string}
 */
function houseInProse(inst) {
  const label = houseSentenceName(institutionHouseLabel(inst)).replace(/^(multiple|major)\s+/i, '').replace(/\s*\([^)]*\)\s*$/, '').trim();
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

/** @typedef {{ audience?: TraditionAudience|string, set?: ReadonlyArray<unknown>|null }} TraditionDescribeOptions */

/**
 * Describe one tradition for one audience. Null for a DM's authored custom tradition (the DM's truth stands as authored),
 * for a motif the table does not know, and for no record or no town.
 * `set` (TRAD-4 unit 10): the rites the surface shows, in its order (shownTraditions.js :: descriptionSetOf for the
 * audience); the record is found in it (the same object, else the same id) and its frame slots take their wording by
 * rotation over the rites before it. Absent, or the record not in it: the rite is described alone.
 * @param {TraditionRec|Rec|null|undefined} recIn
 * @param {Rec|null|undefined} settlementIn
 * @param {TraditionDescribeOptions} [options]  the audience (anything but 'owner' reads as the reader), and the set
 * @returns {TraditionDescription|null}
 */
export function describeTradition(recIn, settlementIn, options = {}) {
  const set = Array.isArray(options.set) ? options.set : null;
  /** @param {unknown} r @returns {string} */
  const idOf = (r) => str(recordOf(r).id) || str(recordOf(r).name);
  const own = set && recIn ? set.indexOf(recIn) : -1;
  const at = own >= 0 || !set || !idOf(recIn) ? own : set.findIndex((r) => idOf(r) === idOf(recIn));
  if (!set || at < 0) return compose(recIn, settlementIn, options.audience, null);
  return describeTraditions(set.slice(0, at + 1), settlementIn, options)[at];
}

/**
 * Describe a town's set of rites in its order, for one audience (TRAD-4 unit 10): each as describeTradition would alone,
 * but a frame slot whose pick would print a sentence an earlier rite of the set printed takes its wording by rotation
 * (drawTurn). The set is the surface's (shownTraditions.js :: descriptionSetOf); one entry per rite, null where none.
 * @param {ReadonlyArray<unknown>|null|undefined} set @param {Rec|null|undefined} settlementIn
 * @param {TraditionDescribeOptions} [options] @returns {Array<TraditionDescription|null>}
 */
export function describeTraditions(set, settlementIn, options = {}) {
  /** @type {Set<string>} */
  const taken = new Set();
  return listOf(set).map((rec) => compose(/** @type {Rec|null|undefined} */ (rec), settlementIn, options.audience, taken));
}

/**
 * One rite composed for one audience; `taken` (the set's rotation, or null alone) gathers the sentences it printed.
 * @param {TraditionRec|Rec|null|undefined} recIn @param {Rec|null|undefined} settlementIn @param {unknown} audience
 * @param {Set<string>|null} taken @returns {TraditionDescription|null}
 */
function compose(recIn, settlementIn, audience, taken) {
  if (!recIn || typeof recIn !== 'object' || !settlementIn || typeof settlementIn !== 'object') return null;
  const rec = recordOf(recIn);
  const reader = audience !== 'owner';
  // CTR11: the reader's text is composed over the reader's view; the key (`seed`) is the whole record's identity, the
  // same on both pages.
  const whole = recordOf(settlementIn);
  const settlement = reader ? readerView(whole) : whole;
  const id = str(rec.id) || str(rec.name);
  if (id.startsWith('custom:')) return null;
  const motif = recordOf(rec.coreMotif);
  const element = str(motif.element);
  const act = str(motif.act);
  const glossPool = /** @type {Record<string, ReadonlyArray<import('../../data/traditionDescriptionTable.js').TraditionLine>>} */ (ELEMENT_GLOSS)[element];
  const leadPool = /** @type {Record<string, ReadonlyArray<import('../../data/traditionDescriptionTable.js').TraditionLine>>} */ (ACT_LEADS)[act];
  if (!glossPool || !leadPool) return null;

  const core = /\.0$/.test(id) && rec.foundedYear === 1;
  const town = str(settlement.name);
  const seed = settlementSeedOf(whole);
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
  const lead = draw(leadPool, seed, `${id}#done`, `lead.${act}`, facts, CRISIS_SCOPED_ACTS.includes(act));
  const glossText = draw(glossPool, seed, `${id}#gloss`, `gloss.${element}`, facts, CRISIS_SCOPED_ELEMENTS.includes(element));
  if (!lead) return null;
  const s1 = glossText ? `${lead} that ${glossText}.` : `${lead}.`;

  // S2 WHO KEEPS IT
  let s2 = '';
  const want = wantedPower(rec, element, act, core);
  const owner = ownerFor(rec, settlement, reader);
  if (owner) {
    // beyond the keeper's fifth wording in the set (TRAD-4 unit 10) the sentence is left out, and names nothing
    s2 = drawTurn(OWNER_FRAMES, seed, `${id}#owner`, 'owner', facts, (x) => fill(x, { owner: owner.prose, Owner: cap(owner.prose) }),
      taken, true, KEEPER_FRAMES_TOO.owner) ?? '';
    if (s2) {
      parts.keeper = 'owner';
      (owner.power ? named.powers : named.houses).push(owner.name);
    }
  } else if (!str(rec.ownerLabel)) {
    const house = want === 'seat' ? null
      : (houseFor(HOUSES_BY_ELEMENT[element], settlement, reader) || houseFor(HOUSES_BY_ACT[act], settlement, reader));
    if (house) {
      const person = presiderOf(house.name, settlement, reader);
      const power = !person && house.row.kind === 'place' && want ? powerFor(want, settlement, reader) : null;
      const key = house.row.kind === 'body' ? (person ? 'bodyPerson' : 'body') : (person ? 'placePerson' : (power ? 'placePower' : 'place'));
      s2 = drawTurn(HOUSE_FRAMES[key], seed, `${id}#house`, `house.${key}`, facts, (x) => fill(x, {
        house: house.prose, House: cap(house.prose), person: person ? person.name : '', title: person ? person.title : '',
        power: power ? powerNameInProse(power) : '',
      }), taken, true, KEEPER_FRAMES_TOO[key]) ?? '';
      if (s2) {
        parts.keeper = 'house';
        named.houses.push(house.name);
        // a "too" wording drops the presider's clause: the person is named only where the sentence names them
        if (person && s2.includes(person.name)) named.persons.push(person.name);
        if (power) named.powers.push(power);
      }
    } else if (want) {
      const power = powerFor(want, settlement, reader);
      if (power) {
        // the power's verb takes the power's number (the line's one reader, powerSentenceName.js :: powerVerb)
        /** @type {Record<string, string>} */
        const verbs = {};
        for (const [slot, [one, many]] of Object.entries(POWER_FRAME_VERBS)) verbs[slot] = powerVerb(power, one, many);
        s2 = drawTurn(POWER_FRAMES[want], seed, `${id}#power`, `power.${want}`, facts,
          (x) => fill(x, { ...verbs, power: powerNameInProse(power), Power: powerNameInProse(power, true) }), taken, true, KEEPER_FRAMES_TOO[want]) ?? '';
        if (s2) {
          parts.keeper = 'power';
          named.powers.push(power);
        }
      }
    }
  }

  // S3 WHERE IT COMES FROM (a cause, on a marked pairing only); else WHO PAYS (the economy)
  let s3 = '';
  const history = recordOf(settlement.history);
  const founding = recordOf(history.founding);
  const age = Number(founding.age);
  if (core && town && Number.isFinite(age) && age > 0) {
    // CTR11 (TRAD-3 unit 4): the reader's founding never reads `foundedBy`, an editable field a later sweep can withhold
    // (veil-22's name sweep removes it when it holds a hidden name): the bare pool always, its key and draw otherwise the same.
    const by = reader ? '' : str(founding.foundedBy);
    // The founding frames are chosen by their table key, as every other slot's pool is. A literal `CAUSE_FRAMES.founding`
    // read named the corpus's single-home shape `founding` (history.founding) to the observed-shape scanner
    // (scripts/lib/legacy-reader-shape-scan.mjs :: makeResolver, the ungrounded single-home rule), which carried it through
    // `draw`'s pool into drawDeclared and read every declared line there as a `founding` record.
    const cause = by ? 'founding' : 'foundingBare';
    s3 = drawTurn(CAUSE_FRAMES[cause], seed, `${id}#origin`, `cause.${cause}`, facts,
      (x) => fill(x, { town, Town: town, age: String(age), foundedBy: by }), taken) ?? '';
    parts.origin = 'cause';
  } else if (element === 'the-dead') {
    /** @param {Rec} e @returns {boolean} */
    const graded = (e) => [e.severity].flat().some((v) => DEAD_EVENT_SEVERITIES.includes(str(v)));
    // CTR11 (TRAD-3 unit 4, the chair's item 3): a reader chooses only among events whose name holds no house, person or
    // power name of the WHOLE record (a name veil-22's sweep would take the event whole by), and names it by its kind;
    // "holds" by the chair's word rule (TRAD-4 unit 7, holdsAName: no word shared, wider than 212's bare-form sweep).
    const held = reader ? heldNamesOf(whole) : [];
    const event = listOf(history.historicalEvents).map(recordOf)
      .filter((e) => DEAD_EVENTS.has(str(e.templateType)) && graded(e) && str(e.name) && Number.isFinite(Number(e.yearsAgo)) && Number(e.yearsAgo) >= 1)
      .filter((e) => !reader || !holdsAName(str(e.name), held))
      .sort((a, b) => Number(a.yearsAgo) - Number(b.yearsAgo))[0];
    /** @type {Record<string, string>} */
    const kinds = DEAD_EVENT_PHRASES;
    const eventProse = !event ? '' : reader ? str(kinds[str(event.templateType)]) : str(event.name).replace(/^The /, 'the ');
    if (event && eventProse && town) {
      const years = Number(event.yearsAgo);
      s3 = drawTurn(CAUSE_FRAMES.dead, seed, `${id}#origin`, 'cause.dead', facts, (x) => fill(x, {
        event: eventProse, when: years === 1 ? 'a year ago' : `${years} years ago`, Town: town,
      }), taken) ?? '';
      parts.origin = 'cause';
      // the reader's text names no event by its name: nothing is listed
      if (!reader) named.events.push(str(event.name));
    }
  }
  if (!s3 && town) {
    // the rank and the 'only' count: for a reader, over the view (no criminal income row; CTR11, the census above)
    const incomes = listOf(recordOf(settlement.economicState).incomeSources).map(recordOf);
    const fits = [...(INCOMES_BY_KEY[element] || []), ...(INCOMES_BY_KEY[act] || [])];
    for (const fit of fits) {
      const rank = incomes.findIndex((i) => str(i.source) === fit.source);
      if (rank < 0 || rank >= ECONOMY_RANKS.length) continue;
      const band = incomes.length === 1 ? 'only' : ECONOMY_RANKS[rank];
      // every payer wording taken by the set's earlier rites: the sentence is left out (TRAD-4 unit 10)
      const paid = drawTurn(ECONOMY_BY_BAND[band] || [], seed, `${id}#economy`, `economy.${band}`, facts, (x) => fill(x, {
        income: fit.prose, Income: cap(fit.prose), is: fit.plural ? 'are' : 'is', brings: fit.plural ? 'bring' : 'brings', town, Town: town,
      }), taken, true);
      if (paid !== null) { s3 = paid; parts.origin = 'economy'; }
      break;
    }
  }

  if (taken) for (const s of [s1, s2, s3]) if (s) taken.add(s);
  return { text: [s1, s2, s3].filter(Boolean).join(' '), named, parts };
}
