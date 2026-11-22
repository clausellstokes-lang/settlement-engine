/**
 * PROTOTYPE of the leaf TRAD-1 proposes (after BUILD: src/data/traditionDescriptionTable.js for the tables and
 * src/domain/traditions/traditionDescription.js for the composer).
 * describeTradition(rec, settlement, { audience }) -> { text, parts, facts } | null
 * Pure, zero-draw (kernel/proseHash.js :: pickVariant on stable ids), no clock, no write.
 */
import { pickVariant } from '../../../../../../src/kernel/proseHash.js';
import { powerNameInProse } from '../../../../../../src/domain/display/governanceAccount.js';
import { institutionHouseLabel } from '../../../../../../src/domain/display/institutionDisplayName.js';
import { factionArchetype, FACTION_ARCHETYPES as A } from '../../../../../../src/domain/factionArchetypes.js';
import { governingFactionOf, nameOf } from '../../../../../../src/domain/rulingPower.js';
import { isHideableHouse, isVeiledPower } from '../../../../../../src/domain/people/cardVeil.js';

// ── THE TABLE OF WHAT FITS WHAT (closed, authored) ───────────────────────────────────────────
/** WHAT IS DONE: the element's gloss, [after a singular lead, after a plural lead]. True by the element's meaning. */
export const ELEMENT_GLOSS = Object.freeze({
  founding: ['marks the founding', 'mark the founding'],
  'first-landing': ['marks the first landing', 'mark the first landing'],
  charter: ['honours the charter', 'honour the charter'],
  hearth: ['honours hearth and household', 'honour hearth and household'],
  harvest: ['gives thanks for the harvest', 'give thanks for the harvest'],
  river: ['honours the river', 'honour the river'],
  stone: ['honours the standing stones', 'honour the standing stones'],
  'the-dead': ['remembers the dead', 'remember the dead'],
  field: ['blesses the fields', 'bless the fields'],
  forge: ['honours the forge', 'honour the forge'],
  market: ['celebrates the market', 'celebrate the market'],
  hunt: ['honours the hunt', 'honour the hunt'],
  'long-sun': ['marks the long days of high summer', 'mark the long days of high summer'],
  tide: ['honours the tide', 'honour the tide'],
  greening: ['welcomes the year\'s new growth', 'welcome the year\'s new growth'],
  stars: ['is kept under the stars', 'are made under the stars'],
});
/** WHAT IS DONE: the act's lead (two frames an act). */
export const ACT_FRAMES = Object.freeze({
  feast: Object.freeze([{ lead: 'A common feast', plural: false }, { lead: 'A feast eaten in common', plural: false }]),
  procession: Object.freeze([{ lead: 'A procession', plural: false }, { lead: 'A walking procession', plural: false }]),
  vigil: Object.freeze([{ lead: 'A vigil', plural: false }, { lead: 'A night\'s vigil', plural: false }]),
  contest: Object.freeze([{ lead: 'A day of contests', plural: false }, { lead: 'Contests', plural: true }]),
  fair: Object.freeze([{ lead: 'A fair', plural: false }, { lead: 'A fair of stalls and trading', plural: false }]),
  offering: Object.freeze([{ lead: 'Offerings', plural: true }, { lead: 'A day of offerings', plural: false }]),
});

/** WHO KEEPS IT — element (then act) to the kinds of house. kind 'body' keeps a rite; kind 'place' holds one.
 *  `prose` null = "the " + the house's label (display/institutionDisplayName.js :: institutionHouseLabel). */
const BODY = (re, prose = null) => Object.freeze({ re, prose, kind: 'body' });
const PLACE = (re, prose = null) => Object.freeze({ re, prose, kind: 'place' });
const RELIGIOUS_HOUSES = Object.freeze([
  BODY(/^great cathedral$/i), BODY(/^cathedral\b/i, 'the cathedral'), BODY(/^(major |multiple )?monasteries/i, 'the monasteries'),
  BODY(/^monastery or friary$/i, 'the monastery'), BODY(/^parish church/i), BODY(/^priest \(resident\)$/i, 'the resident priest'),
  PLACE(/^wayside shrine$/i),
]);
const MARKET_PLACES = Object.freeze([
  PLACE(/^weekly market$/i), PLACE(/^market square$/i), PLACE(/^multiple market squares$/i, 'the market squares'),
  PLACE(/^daily markets$/i), PLACE(/^district markets/i, 'the district markets'), PLACE(/^periodic market$/i),
]);
export const KEEPER_HOUSES = Object.freeze({
  element: Object.freeze({
    'the-dead': Object.freeze([...RELIGIOUS_HOUSES, PLACE(/burial|graveyard|cemetery|charnel/i)]),
    stars: RELIGIOUS_HOUSES,
    greening: Object.freeze([BODY(/^elder grove council$/i), BODY(/^druid circle$/i)]),
    harvest: Object.freeze([PLACE(/granar/i), PLACE(/^communal root cellar$/i), PLACE(/^mills?\b/i)]),
    river: Object.freeze([BODY(/^river ferry$/i), BODY(/^barge and river transport company$/i), PLACE(/^river boatyard$/i)]),
    tide: Object.freeze([BODY(/^harbour master's office$/i), BODY(/^fishing community$/i), PLACE(/^fisher's landing$/i)]),
    forge: Object.freeze([BODY(/^blacksmiths?\b/i), BODY(/^resident smith/i), BODY(/^specialized metalworkers$/i)]),
    market: MARKET_PLACES,
    hunt: Object.freeze([BODY(/^hunter's lodge$/i), BODY(/^wildfowler$/i), PLACE(/^furrier's district$/i)]),
  }),
  act: Object.freeze({
    offering: RELIGIOUS_HOUSES,
    vigil: RELIGIOUS_HOUSES,
    fair: MARKET_PLACES,
    contest: Object.freeze([PLACE(/^colosseum\/arena$/i, 'the arena'), BODY(/^gladiatorial school$/i)]),
  }),
});

/** WHO PRESIDES OR PAYS — the power's archetype, the engine's own owner table (politics.js :: desiredArchetype, §6). */
const FOUNDING_ELEMENTS = new Set(['founding', 'first-landing', 'charter']);
const DEVOTIONAL_ACTS = new Set(['offering', 'vigil']);
const DEVOTIONAL_ELEMENTS = new Set(['the-dead', 'stars']);
function wantedArchetype(rec, core) {
  const el = rec.coreMotif?.element; const act = rec.coreMotif?.act;
  if (core || FOUNDING_ELEMENTS.has(el)) return 'seat';
  if (rec.deityRef || DEVOTIONAL_ACTS.has(act) || DEVOTIONAL_ELEMENTS.has(el)) return A.RELIGIOUS;
  if (act === 'fair' || el === 'market') return 'merchantry';
  if (act === 'contest') return A.MILITARY;
  return null; // politics' fallback is the seat; a description names no seat it has no fit for
}
export const POWER_FRAMES = Object.freeze({
  seat: Object.freeze(['It is overseen by {power}.', 'It falls to {power}.']),
  [A.RELIGIOUS]: Object.freeze(['It falls to {power}.', 'It is in the keeping of {power}.']),
  merchantry: Object.freeze(['Its cost is met by {power}.', 'It is paid for by {power}.']),
  [A.MILITARY]: Object.freeze(['It is overseen by {power}.', 'It falls to {power}.']),
});
export const HOUSE_FRAMES = Object.freeze({
  body: Object.freeze(['It is kept by {house}.', 'Its keeping falls to {house}.']),
  bodyPerson: Object.freeze(['It is kept by {house}, and {person}, {title}, presides.', 'Its keeping falls to {house}; {person}, {title}, presides.']),
  place: Object.freeze(['It is held at {house}.', 'It is kept at {house}.']),
  placePerson: Object.freeze(['It is held at {house}, where {person}, {title}, presides.', 'It is kept at {house}, where {person}, {title}, presides.']),
  placePower: Object.freeze(['It is held at {house}, in the keeping of {power}.', 'It is kept at {house} and falls to {power}.']),
});
export const OWNER_FRAMES = Object.freeze(['It is kept now by {owner}.', 'Its keeping falls now to {owner}.']);

/** WHERE IT COMES FROM — the only pairings that may carry a cause. */
export const CAUSE_FOUNDING = Object.freeze(['It has been kept since {town} was founded by {foundedBy}, {age} years ago.', '{Town} has kept it since its founding by {foundedBy}, {age} years ago.']);
export const CAUSE_FOUNDING_BARE = Object.freeze(['It has been kept since {town} was founded, {age} years ago.', '{Town} has kept it since its founding, {age} years ago.']);
const DEAD_EVENTS = new Set(['great_fire', 'great_flood', 'plague_years', 'external_threat']);
export const CAUSE_DEAD = Object.freeze(['It is kept in memory of {event}, {when}.', '{Town} keeps it in memory of {event}, {when}.']);

/** WHO PAYS — the economy the town lives on: element (or act) to income sources, with their prose forms. */
const INC = (source, prose, plural) => Object.freeze({ source, prose, plural });
export const ECONOMY_FIT = Object.freeze({
  harvest: Object.freeze([INC('Harvest', 'the harvest', false), INC('Grain Sales', 'grain sales', true), INC('Agricultural Rents', 'farm rents', true)]),
  field: Object.freeze([INC('Harvest', 'the harvest', false), INC('Grain Sales', 'grain sales', true), INC('Agricultural Rents', 'farm rents', true)]),
  river: Object.freeze([INC('River Tolls', 'river tolls', true)]),
  tide: Object.freeze([INC('Fish & Maritime Produce', 'fish and maritime produce', false), INC('Fish & Preserved Produce', 'fish and preserved produce', false), INC('Port Duties', 'port duties', true)]),
  'first-landing': Object.freeze([INC('Port Duties', 'port duties', true), INC('River Tolls', 'river tolls', true)]),
  forge: Object.freeze([INC('Iron & Metalwork', 'iron and metalwork', false), INC('Coal Sales', 'coal sales', true)]),
  market: Object.freeze([INC('Market Taxes', 'market taxes', true)]),
  fair: Object.freeze([INC('Market Taxes', 'market taxes', true)]),
});
const RANK = ['chief', 'second', 'third'];
export const ECONOMY_FRAMES = Object.freeze(['{Income} {is} {town}\'s {rank} income.', '{Income} {is} the {rank} of {town}\'s incomes.']);
export const ECONOMY_ONLY_FRAMES = Object.freeze(['{Income} {is} {town}\'s only income.']);

// ── helpers ─────────────────────────────────────────────────────────────────────────────
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const fill = (t, m) => t.replace(/\{(\w+)\}/g, (_, k) => (m[k] ?? ''));
const arr = (v) => (Array.isArray(v) ? v : []);
function houseProse(inst, row) {
  if (row.prose) return row.prose;
  const label = institutionHouseLabel(inst);
  const words = label.split(' ');
  const proper = words.length > 1 && words.every((w) => /^[A-Z]/.test(w));
  return `the ${proper ? label : label[0].toLowerCase() + label.slice(1)}`;
}
function findHouse(rows, settlement, reader) {
  const insts = arr(settlement.institutions).filter((i) => i && typeof i.name === 'string' && !/^access to /i.test(i.name));
  for (const row of rows || []) {
    // the table holds no hideable kind; the reader's guard is the second wall, not the first
    const inst = insts.find((i) => row.re.test(i.name) && !(reader && isHideableHouse(i)));
    if (inst) return { inst, row, prose: houseProse(inst, row) };
  }
  return null;
}
function personOf(inst, settlement, reader) {
  for (const c of arr(settlement.npcs)) {
    const ci = c && typeof c.institution === 'object' ? c.institution : null;
    if (!ci || ci.key !== inst.name || typeof ci.title !== 'string' || !ci.title) continue;
    if (reader && ci.veiled !== false) continue; // the card's own veil bit, read never re-derived (people/cardVeil.js)
    if (typeof c.name !== 'string' || !c.name) continue;
    return { name: c.name, title: ci.title };
  }
  return null;
}
function powerFor(want, settlement, reader) {
  // a hidden power is never named (the town does not know it is there); a criminal one only on the owner's page
  const barred = (f) => (reader ? isVeiledPower(f) : f?.hidden === true);
  if (want === 'seat') {
    const seat = governingFactionOf(settlement);
    return seat && !barred(seat) && nameOf(seat) ? nameOf(seat) : null;
  }
  const factions = arr(settlement.powerStructure?.factions).filter((f) => f && !barred(f));
  // the contest's power is the town's watch or guard, never a war party or an armed movement
  const ok = (f) => { const a = factionArchetype(f); return want === 'merchantry' ? (a === A.MERCHANT || a === A.CRAFT) : want === A.MILITARY ? (a === A.MILITARY && /guard|watch/i.test(String(nameOf(f)))) : a === want; };
  const best = factions.filter(ok).sort((x, y) => (Number(y.power) || 0) - (Number(x.power) || 0) || (String(nameOf(x)) < String(nameOf(y)) ? -1 : 1))[0];
  return best ? nameOf(best) : null;
}
const townName = (s) => (typeof s.name === 'string' && s.name) || 'the town';

/**
 * @param {any} rec a TraditionRec @param {any} settlement @param {{ audience: 'owner'|'reader' }} opts
 * @returns {{ text: string, parts: Record<string, string|null>, facts: string[] } | null}
 */
export function describeTradition(rec, settlement, { audience } = { audience: 'reader' }) {
  if (!rec || !settlement || String(rec.id || '').startsWith('custom:')) return null;
  const reader = audience !== 'owner';
  const el = rec.coreMotif?.element; const act = rec.coreMotif?.act;
  const gloss = ELEMENT_GLOSS[el]; const frames = ACT_FRAMES[act];
  if (!gloss || !frames) return null;
  const id = String(rec.id || rec.name || '');
  const core = /\.0$/.test(id) && rec.foundedYear === 1;
  const town = townName(settlement);
  const facts = [];
  if (core) facts.push('founding core (record index 0, foundedYear 1)');
  // S1 WHAT IS DONE
  const f = pickVariant(frames, `${id}#done`);
  const s1 = `${f.lead} that ${gloss[f.plural ? 1 : 0]}.`;
  // S2 WHO KEEPS IT: in play the record's own owner; else a house of a fitting kind, else a power of the fitting archetype
  let s2 = ''; let keeperKind = null;
  const want = wantedArchetype(rec, core);
  const ownerLabel = typeof rec.ownerLabel === 'string' && rec.ownerLabel ? rec.ownerLabel : null;
  if (ownerLabel) {
    const powers = arr(settlement.powerStructure?.factions);
    const asPower = powers.find((p) => nameOf(p) === ownerLabel);
    const inst = arr(settlement.institutions).find((i) => i?.name === ownerLabel);
    let named = '';
    if (rec.ownerKind === 'faction' || rec.ownerKind === 'seat') {
      if (asPower && (reader ? !isVeiledPower(asPower) : asPower.hidden !== true)) named = powerNameInProse(ownerLabel);
    } else if (rec.ownerKind === 'institution' && inst && !(reader && isHideableHouse(inst))) named = houseProse(inst, { prose: null });
    if (named) { s2 = fill(pickVariant(OWNER_FRAMES, `${id}#owner`), { owner: named }); keeperKind = 'owner'; facts.push(`owner (${rec.ownerKind}): ${ownerLabel}`); }
  }
  if (!s2 && !ownerLabel && want !== 'seat') {
    const house = findHouse(KEEPER_HOUSES.element[el], settlement, reader) || findHouse(KEEPER_HOUSES.act[act], settlement, reader);
    if (house) {
      const person = personOf(house.inst, settlement, reader);
      const power = !person && house.row.kind === 'place' && want ? powerFor(want, settlement, reader) : null;
      const key = house.row.kind === 'body' ? (person ? 'bodyPerson' : 'body') : (person ? 'placePerson' : (power ? 'placePower' : 'place'));
      s2 = fill(pickVariant(HOUSE_FRAMES[key], `${id}#house`), { house: house.prose, person: person?.name, title: person?.title, power: power ? powerNameInProse(power) : '' });
      keeperKind = 'house';
      facts.push(`house: ${house.inst.name} (${house.row.kind})`);
      if (person) facts.push(`person: ${person.name} (${person.title})`);
      if (power) facts.push(`power (${want}): ${power}`);
    }
  }
  if (!s2 && !ownerLabel && want) {
    const p = powerFor(want, settlement, reader);
    if (p) { s2 = fill(pickVariant(POWER_FRAMES[want], `${id}#power`), { power: powerNameInProse(p) }); keeperKind = 'power'; facts.push(`power (${want}): ${p}`); }
  }
  // S3 WHERE IT COMES FROM (a cause, only on a marked pairing); else WHO PAYS (the economy)
  let s3 = ''; let originKind = null;
  const fd = settlement.history?.founding;
  if (core && fd && Number.isFinite(Number(fd.age))) {
    const by = typeof fd.foundedBy === 'string' && fd.foundedBy ? fd.foundedBy : null;
    s3 = fill(pickVariant(by ? CAUSE_FOUNDING : CAUSE_FOUNDING_BARE, `${id}#origin`), { age: String(fd.age), foundedBy: by, town, Town: town });
    originKind = 'cause';
    facts.push(`history.founding: age ${fd.age}${by ? `, foundedBy "${by}"` : ''}`);
  } else if (el === 'the-dead') {
    const ev = arr(settlement.history?.historicalEvents).filter((e) => DEAD_EVENTS.has(e?.templateType) && typeof e.name === 'string' && Number.isFinite(Number(e.yearsAgo)))
      .sort((a, b) => Number(a.yearsAgo) - Number(b.yearsAgo))[0];
    if (ev) {
      const n = Number(ev.yearsAgo);
      s3 = fill(pickVariant(CAUSE_DEAD, `${id}#origin`), { event: ev.name.replace(/^The /, 'the '), when: n === 1 ? 'a year ago' : `${n} years ago`, Town: town });
      originKind = 'cause';
      facts.push(`history event: ${ev.name} (${ev.templateType}, ${n} years ago)`);
    }
  }
  if (!s3) {
    const fits = [...(ECONOMY_FIT[el] || []), ...(ECONOMY_FIT[act] || [])];
    const inc = arr(settlement.economicState?.incomeSources);
    for (const fit of fits) {
      const rank = inc.findIndex((i) => i?.source === fit.source);
      if (rank >= 0 && rank < RANK.length) {
        const only = inc.length === 1;
        s3 = fill(pickVariant(only ? ECONOMY_ONLY_FRAMES : ECONOMY_FRAMES, `${id}#econ`), { Income: cap(fit.prose), is: fit.plural ? 'are' : 'is', town, rank: RANK[rank] });
        originKind = 'economy';
        facts.push(`economicState.incomeSources[${rank}]: ${fit.source} (${inc[rank].percentage}%)`);
        break;
      }
    }
  }
  const text = [s1, s2, s3].filter(Boolean).join(' ');
  return { text, parts: { done: s1, keeper: s2, origin: s3, keeperKind, originKind }, facts };
}
