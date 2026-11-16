/**
 * pageLaws/law4.mjs — LAW 4 · THE PAGE NAMES NO THING THE TOWN LACKS (BAR5-AUDIT, seat A).
 * Two passes over one town `{ record, tabs, town }` (DOSSIER tabs):
 *   4r · THE REGISTER'S VOCABULARY ON THE RENDERED PAGE: every printed sentence read by the presumed-things rule book's
 *        own matcher (`src/domain/facts/registeredWords.js :: thingsNamedIn / newWordsNamedIn`) and each thing's own
 *        reader of absence (`absent(factsOf(record), liveInstitutionNames(record), record, sentence)`). The register
 *        withdrew page reading for house words at 0 of 6 true (`PAGE_WITHDRAWN`): this pass is the base and the
 *        breadth, counted and sampled apart, never counted as law until its sample holds.
 *   4n · THE NAMED THINGS of the BAR5 brief, each drawn from a control's own note: a notary, a lord and his dues, fired
 *        clay, a patron's appointment the house card denies, a roadside founding the founding record denies, a count
 *        of weeks the crisis's own age denies, old buildings where the history says newly built.
 * Instances `{ law, town, tab, line, against, why }`. Pure; reads src, changes nothing.
 */
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { liveInstitutionNames } from '../../../src/domain/facts/institutions.js';
import { THINGS, NEW_WORDS, thingsNamedIn, newWordsNamedIn, sentencesOf } from '../../../src/domain/facts/registeredWords.js';

const inst = (law, town, tab, line, against, why) => ({ law, town, tab, line, against, why });
const linesOf = (tabs) => Object.entries(tabs).flatMap(([tab, ls]) => ls.map((line, i) => ({ tab, i, line })));
const namesOf = (record) => (record?.institutions || []).map((i) => String(i?.name || '')).filter((n) => !/^access to\b/i.test(n));
const servicesText = (record) => JSON.stringify(record?.availableServices || {});

/** 4r · the register's vocabulary over the rendered page. */
export function law4r({ record, tabs, town }) {
  if (!record) return [];
  const out = [];
  let facts, names;
  try { facts = factsOf(record); names = liveInstitutionNames(record); } catch { return out; }
  const seen = new Set();
  for (const { tab, line } of linesOf(tabs)) {
    for (const sentence of sentencesOf(line)) {
      const ids = [...thingsNamedIn(sentence).map((id) => ['thing', id, THINGS[id]]), ...newWordsNamedIn(sentence).map((id) => ['new', id, NEW_WORDS[id]])];
      for (const [, id, w] of ids) {
        let absent = false;
        try { absent = !!w.absent(facts, names, record, sentence); } catch { absent = false; }
        if (!absent) continue;
        const key = `${id}|${tab}|${line}`;
        if (seen.has(key)) continue; seen.add(key);
        out.push(inst(`4r-${w.kind ?? 'thing'}:${id}`, town, tab, line, { record: w.leaf || 'registeredWords.js :: ' + id, line: 'absent' }, `names ${id} (the register's words); the register's reader says the town lacks it`));
      }
    }
  }
  return out;
}

/** 4n NOTARY (C44306): a notary named where no legal or scribal house or service stands. */
const NOTARY = /\bnotar(?:y|ies)\b/i;
const LEGAL_HOUSE = /notar|scribe|court|magistrat|lawyer|advocate|registr|clerk|chancer|justic/i;
/** 4n LORD (C42840): a lord named where the government, the houses and the neighbours name no lord. */
const LORD = /\bthe lord(?:'s|s)?\b|\bliege\b|\boverlords?\b/; // lower case: "the Lord" of a faith is not read
/** PRECISION (720 draw, seed 516): "the lord or municipality" is a hedge (EXPLAINED); "No overlord" a denial. */
const LORD_SPARED = /\bthe lord or\b|\bor the lord\b|\bno overlord\b/i;
const LORD_FACT = /lord|noble|feudal|baron|count(?!ing|er|ry|y)|duk|ducal|crown|royal|king|queen|prince|manor|appointee|gentry|liege|seign|vassal|steward|castellan|earl|jarl|margrav|governor/i;
/** 4n FIRED CLAY (C15951): fired clay where no house fires clay. */
const FIRED_CLAY = /\bfired clay\b|\bbrick dust\b|\bpottery kilns?\b/i;
const CLAY_HOUSE = /potter|brick|tile|ceramic|kiln(?!s?\b.*charcoal)/i;
/** 4n PATRON (C30295): a hook gives a person a post owed to a patron; that person's house card says nobody named them. */
const PATRON = /\bowes? (?:their|his|her) (?:post|position|office|seat|appointment) to a patron\b/i;
const NOT_NAMED = /\bNobody named them to it\b|\bwith no appointment\b/i;
/** 4n FOUNDING (C22786): the Overview's founding claim against the History's origin. */
// PRECISION (720 draw, seed 516): "The road was here first. The settlement grew along its verge" read WEAK beside a stronghold's or
// a healer's founding (a growth along a road, not a founding for it); only the founding claim is read
const FOUNDED_ROAD = /^Founded roadside\b/;
const ROAD_ORIGIN = /road|route|crossroad|intersection|junction|waystation|waypoint|travel|toll|market|caravan|pass\b|bridge|ford|traffic|merchant|trade/i;
/** 4n WEEKS (C2000): a count of weeks before a crisis the page says is younger. */
const AGO = /\b(two|three|four|five|six|seven|eight|nine|ten|\d+) (weeks|months) ago\b/i;
const SIEGE_WORD = /besieg|\bsiege\b|blockad/i;
const SIEGE_AGE = /\bsiege has entered its (first|second|third|fourth|fifth|sixth) week\b/i;
const NUM = { two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6 };
/** 4n OLD BUILDINGS (C39999): old buildings patched beside a history that says most of it is newly built. */
const OLD_BUILDINGS = /\bthe old buildings are patched\b/i;
const NEW_BUILT = /\blooks recently built, because most of it was\b|\bnewly built\b/i;

export function law4n({ record, tabs, town }) {
  const out = [];
  const L = linesOf(tabs);
  const names = namesOf(record);
  // notary
  const legal = names.filter((n) => LEGAL_HOUSE.test(n));
  if (!legal.length && !/notar/i.test(servicesText(record))) {
    for (const h of L.filter((h) => NOTARY.test(h.line))) out.push(inst('4n-notary', town, h.tab, h.line, { record: 'institutions · availableServices', line: 'no notary, scribe, court or legal house' }, 'names a notary; no house or service of the record keeps one'));
  }
  // lord
  const ps = record?.powerStructure || {};
  const lordFacts = [ps.governingName, ps.government && JSON.stringify(ps.government), ...(ps.factions || []).map((f) => f.faction), ...names, ...(record?.npcs || []).flatMap((n) => [n?.role, n?.title]), JSON.stringify(record?.neighborRelationship || '')].join(' | ');
  if (!LORD_FACT.test(lordFacts)) {
    for (const h of L.filter((h) => LORD.test(h.line) && !LORD_SPARED.test(h.line))) out.push(inst('4n-lord', town, h.tab, h.line, { record: 'powerStructure · institutions · neighborRelationship', line: 'no lord, noble, crown or appointee' }, 'names a lord; the government, houses and neighbours name none'));
  }
  // fired clay
  if (!names.some((n) => CLAY_HOUSE.test(n) && !/charcoal/i.test(n))) {
    for (const h of L.filter((h) => FIRED_CLAY.test(h.line) && !h.line.includes('→'))) out.push( // a chain's rungs (→) are LAW 3's
     inst('4n-clay', town, h.tab, h.line, { record: 'institutions', line: 'no potter, brickmaker, tile-works or kiln for clay' }, 'names fired clay; no house fires clay'));
  }
  // patron: the hook's person (the line above it) against their own house card
  const hooks = tabs['Summary/Plot Hooks'] || [];
  const unnamed = new Set();
  for (const [tab, ls] of Object.entries(tabs)) ls.forEach((l, i) => {
    if (!NOT_NAMED.test(l)) return;
    for (let j = i; j < Math.min(ls.length, i + 4); j++) { const m = /^Connection: (.+)$/.exec(ls[j]); if (m) { unnamed.add(m[1].trim()); break; } }
  });
  hooks.forEach((l, i) => {
    if (!PATRON.test(l)) return;
    const who = (hooks[i - 1] || '').trim();
    const card = [...unnamed].find((c) => who && c.endsWith(who));
    if (card) out.push(inst('4n-patron', town, 'Summary/Plot Hooks', l, { tab: 'Systems/Institutions', line: `Nobody named them to it · Connection: ${card}` }, `the hook gives ${who} a post owed to a patron; their house card says nobody named them`));
  });
  // founding
  const origin = L.find((h) => /^Origin: · /.test(h.line));
  const reason = String(record?.history?.founding?.reason || '');
  if (origin && !ROAD_ORIGIN.test(origin.line) && !ROAD_ORIGIN.test(reason)) {
    for (const h of L.filter((h) => FOUNDED_ROAD.test(h.line))) out.push(inst('4n-founding', town, h.tab, h.line, { tab: origin.tab, line: origin.line }, 'the page says the town was founded on the road; the founding record says otherwise'));
  }
  // weeks before a crisis the page says is younger
  const age = L.map((h) => SIEGE_AGE.exec(h.line)).find(Boolean);
  if (age) {
    const weeks = NUM[age[1].toLowerCase()];
    for (const h of L) {
      const m = AGO.exec(h.line);
      if (!m || !SIEGE_WORD.test(h.line)) continue;
      const n = /^\d+$/.test(m[1]) ? Number(m[1]) : NUM[m[1].toLowerCase()];
      const asWeeks = m[2].toLowerCase() === 'months' ? n * 4 : n;
      if (asWeeks > weeks) out.push(inst('4n-weeks', town, h.tab, h.line, { tab: 'Summary/Overview', line: age[0] }, `a besieging camp ${m[0]}; the page says the siege is in its ${age[1]} week`));
    }
  }
  // old buildings beside a newly built place
  const fresh = L.find((h) => NEW_BUILT.test(h.line));
  if (fresh) for (const h of L.filter((h) => OLD_BUILDINGS.test(h.line))) out.push(inst('4n-oldnew', town, h.tab, h.line, { tab: fresh.tab, line: fresh.line }, 'old buildings patched; the history says most of the place is newly built'));
  return out;
}

export const LAW4 = { law4n, law4r };

/** The words of each 4n thing, for the census of lines that NAME it at all (the hand-back: distinct lines and towns). */
export const NAMES_4N = Object.freeze({ notary: NOTARY, lord: LORD, clay: FIRED_CLAY, patron: PATRON, founding: FOUNDED_ROAD, weeks: AGO, oldnew: OLD_BUILDINGS });
