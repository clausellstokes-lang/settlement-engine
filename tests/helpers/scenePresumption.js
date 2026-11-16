/**
 * tests/helpers/scenePresumption.js — THE DETECTOR OF KIND A1, THE SCENE'S PRESUMPTION (BAR4-SCENES, BRIEF-BAR4's
 * amendment K1, 2026-11-16).
 *
 * THE KIND: an arrival vignette or an overview line that SHOWS a thing (a trade at work, herds on the road, a market
 * trading, a service on offer, where a stranger is lodged) printed where the town's PRESENT state denies it.
 *
 * THE DETECTOR is a pure function over a town's RECORD and its PRINTED LINES (the census's dump of the Overview, or a
 * composed scene): `scenePresumptionFindings(record, lines)` returns EVERY instance: the line, what it presumes, and
 * the state that makes it false. It does not grep a flagged sentence: each line of the two pools it reads (the arrival
 * pool's sense beat, `ARRIVAL_SENSES`; and the general desk's lines named in `GENERAL_PRESUMES`) DECLARES what it
 * shows in the table below, and the table is read against the record's own settled facts, through the leaves the page
 * itself prints from:
 *
 *   house at work   some house of the sense's trade stands on the live roster and the page marks it neither stopped,
 *                   scarce nor short of its input (`crisisStoppedRow.js :: rowMarkText`, the Institutions tab's own
 *                   mark; a house CURTAILED by a siege still works);
 *   timber reaches the saws  timber reaches the town's sawyers, its own or imported by name (`facts/timberAtHand.js`, on
 *                   BAR4-RECORD's `houseInputAtHand.js`, the page's own gap reader: BAR4-SCENES-2, one home): the whole place
 *                   sawing wants wood;
 *   herds live      the food record's herds are a source and not the source the famine failed
 *                   (`economicState.foodSecurity.foodRecord`);
 *   market open     a live market stands (`facts/market.js :: isMarketInstitution`) that the page does not mark
 *                   stopped (`rowMarkText`);
 *   enchanting      some house offers enchanting or identification on the record's services
 *                   (`availableServices`, the Services tab's rows);
 *   monks lodge     no house but a monastery (and the households' own hearths) lists lodging on the record's services,
 *                   or a monastery does (`availableServices.lodging`).
 *
 * A line of the sense pool with no row in the table, a colour line ("read; presumes nothing") and a line that is a
 * declared twin are read as presuming only their key's house. NAMED EXCLUSIONS (true where they print, with the
 * reason) are listed in `EXCLUDED` and nowhere else.
 *
 * Pure: no randomness, no clock, no write. The guard is tests/generators/bar4ScenePresumption.test.js.
 */
import { ARRIVAL_SENSES } from '../../src/data/arrivalProse.js';
import { rowMarkText } from '../../src/domain/display/crisisStoppedRow.js';
import { isMarketInstitution } from '../../src/domain/facts/market.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { nativeSemanticName } from '../../src/domain/content/customContentSemanticAuthority.js';
import { isColourLine } from '../../src/domain/facts/factVocabulary.js';
import { textOf } from '../../src/domain/facts/textOf.js';
import { timberReachesSawmillOf } from '../../src/domain/facts/timberAtHand.js';

/** @param {string} s */
const lower = (s) => String(s || '').toLowerCase();
/** A fragment at a word start of a name (arrivalScene.js :: anyAtWordStart's rule). @param {string} frag @param {string} name */
const atWordStart = (frag, name) => new RegExp(`(^|[^a-z])${frag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(name);

/** The live houses of a sense key, by its own name fragments (the picker's rule). @param {any} record @param {ReadonlyArray<string>} frags */
const housesOf = (record, frags) => liveInstitutions(record).filter((inst) => {
  const name = lower(nativeSemanticName(inst) || inst?.name);
  return frags.some((f) => atWordStart(f, name));
});

/** @param {any} record */
const foodRecordOf = (record) => record?.economicState?.foodSecurity?.foodRecord || null;

/** Every service row of the record, flattened. @param {any} record */
const serviceRows = (record) => Object.values(record?.availableServices || {}).flatMap((rows) => (Array.isArray(rows) ? rows : []));

/**
 * A house is at work unless the page marks it stopped, scarce or short of its input; a CURTAILED house still works
 * (the siege's own word for the land the town still works, SV8).
 * @param {any} record @param {any} house
 */
const atWork = (record, house) => {
  const mark = rowMarkText(record, 'house', house);
  return mark == null || /^Curtailed\b[^.]*\.$/.test(mark);
};

/** A house that gives a stranger a bed for the asking, not a trade (the dwellings' and the housing's hospitality). */
const HOUSEHOLD = /^(dwellings|housing)\b/i;
/** A sacred house that may take a guest in. */
const MONASTIC = /monaster|abbey|priory|friary/i;

/** THE PRESUMPTIONS, each a reader of the record: null where it holds, else the state that denies it. */
export const PRESUMES = Object.freeze({
  /** @param {any} record @param {string} key */
  'house at work': (record, key) => {
    const sense = ARRIVAL_SENSES.find((s) => s.key === key);
    if (!sense) return null;
    const houses = housesOf(record, sense.institutions);
    if (houses.length === 0) return null; // reached by the exports' trade words alone: the trade is the record's own
    const working = houses.filter((h) => atWork(record, h));
    return working.length ? null : `every ${key} house is marked: ${houses.map((h) => `${h.name} (${rowMarkText(record, 'house', h)})`).join('; ')}`;
  },
  /** @param {any} record */
  'herds live': (record) => {
    const fr = foodRecordOf(record);
    if (!fr) return null;
    if (fr.failedSource === 'livestock') return 'the famine failed the herds (foodRecord.failedSource: livestock)';
    return null;
  },
  /** @param {any} record (BAR4-SCENES-2: one home with BAR4-HOUSES' atom, `timberAtHand.js` on `houseInputAtHand.js`, the page's own gap reader) */
  'timber reaches the saws': (record) => (timberReachesSawmillOf(record) === false
    ? 'no timber reaches the saws: no timber ground worked here and none imported by name (houseInputAtHand)' : null),
  /** @param {any} record */
  'market open': (record) => {
    const markets = liveInstitutions(record).filter(isMarketInstitution);
    if (markets.length === 0) return 'no live market on the roster';
    const open = markets.filter((m) => atWork(record, m));
    return open.length ? null : `every market is marked: ${markets.map((m) => `${m.name} (${rowMarkText(record, 'house', m)})`).join('; ')}`;
  },
  /** @param {any} record */
  enchanting: (record) => (serviceRows(record).some((r) => /enchant|identif/i.test(String(r?.name || ''))) ? null
    : 'no house offers enchanting or identification (availableServices)'),
  /** @param {any} record */
  'monks lodge': (record) => {
    const rows = record?.availableServices?.lodging || [];
    const monks = rows.filter((r) => MONASTIC.test(String(r?.institution || '')));
    const others = rows.filter((r) => !MONASTIC.test(String(r?.institution || '')) && !HOUSEHOLD.test(String(r?.institution || '')));
    if (monks.length || others.length === 0) return null;
    return `other houses give the bed or the meal: ${[...new Set(others.map((r) => r.institution))].join('; ')}`;
  },
});

/**
 * THE SENSE POOL'S DECLARATIONS (beside the pool): what a line SHOWS beyond its key's house, by the line's template
 * (`{name}` for the settlement). A sense line not listed presumes its key's house at work.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const SENSE_PRESUMES = Object.freeze({
  'The smell of sawn timber is everywhere in {name}, and so is the sawdust.': ['timber reaches the saws'],
  'Stacks of seasoning planks line the road in, taller than the carts that wait for them.': ['timber reaches the saws'],
  'The rasp of the saws carries from yard to yard all through the day.': ['timber reaches the saws'],
  'Drovers push their herds along the road, and the whole place smells of the pens.': ['herds live'],
  'The lowing of penned cattle carries across {name} at every hour.': ['herds live'],
  'Hurdles and holding pens crowd the edge of the settlement, full and noisy.': ['herds live'],
  'Magic is a trade in {name} like any other: signs offer enchanting and identification by the hour.': ['enchanting'],
  'Stallholders call their wares over the noise of the market.': ['market open'],
  'The market is loud with haggling long before noon.': ['market open'],
  'A knot of buyers argues over a price, and the seller enjoys every word of it.': ['market open'],
  'A child weaves between the stalls with a basket bigger than she is.': ['market open'],
  'Pilgrims crowd the road in, and every second stall sells candles, tokens or someone\'s blessing.': ['market open'],
  'Spice and drying herbs scent every lane, and the stalls are piled with them.': ['market open'],
});

/**
 * THE GENERAL DESK'S DECLARATIONS (DS-GEN, DS-REL, DS-POP, DS-HK): the lines that SHOW a thing, by template
 * (`{settlement}` for the name).
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const GENERAL_PRESUMES = Object.freeze({
  'Anyone with goods and the stall fee can sell at {settlement}\'s market without a guild\'s leave.': ['market open'],
  'No guild keeps a house at {settlement}\'s market: the town\'s own hold on trade there is the stall fee.': ['market open'],
  'Buying and selling at {settlement} is done face to face at the market with no guild between seller and buyer.': ['market open'],
  'A stranger can set up and sell at {settlement} on the next market day with nobody\'s leave but the stall-keeper\'s.': ['market open'],
  'The guilds are a power at {settlement} all the same, and anyone trading at its market reckons with them.': ['market open'],
  'Anyone new to {settlement} who needs a meal or a bed is sent to the monks.': ['monks lodge'],
});

/** NAMED EXCLUSIONS: a (line, presumption) the detector finds and judges TRUE, with its reason. Empty at the base. */
export const EXCLUDED = Object.freeze(/** @type {ReadonlyArray<{ line: string, presumes: string, why: string }>} */ ([]));

/** Every sense line, with its key and its declared presumptions. */
const SENSE_LINES = ARRIVAL_SENSES.flatMap((sense) => [...sense.lines, ...sense.dominant].map((line) => {
  const t = textOf(line);
  const template = typeof t === 'function' ? t('{name}') : String(t);
  const own = SENSE_PRESUMES[template] || [];
  const house = isColourLine(line) || (line && typeof line === 'object' && typeof line.twinOf === 'string') ? [] : ['house at work'];
  return { key: sense.key, template, presumes: [...new Set([...house, ...own])] };
}));

/**
 * THE DETECTOR. Every instance of A1 in one town: a printed line of the two pools whose declared presumption the
 * record denies.
 * @param {any} record the settlement record
 * @param {ReadonlyArray<string>} lines the printed lines (the Overview's text, one entry a line or paragraph)
 * @returns {Array<{ line: string, presumes: string, state: string }>}
 */
export function scenePresumptionFindings(record, lines) {
  const name = String(record?.name || '');
  const page = (lines || []).join('\n');
  /** @type {Array<{ line: string, presumes: string, state: string }>} */
  const out = [];
  const check = (/** @type {string} */ text, /** @type {ReadonlyArray<string>} */ presumes, /** @type {string|null} */ key) => {
    if (!text || !page.includes(text)) return;
    for (const p of presumes) {
      if (EXCLUDED.some((x) => x.line === text && x.presumes === p)) continue;
      const state = PRESUMES[/** @type {keyof typeof PRESUMES} */ (p)](record, /** @type {any} */ (key));
      if (state) out.push({ line: text, presumes: p, state });
    }
  };
  for (const l of SENSE_LINES) check(l.template.split('{name}').join(name), l.presumes, l.key);
  for (const [template, presumes] of Object.entries(GENERAL_PRESUMES)) check(template.split('{settlement}').join(name), presumes, null);
  return out;
}
