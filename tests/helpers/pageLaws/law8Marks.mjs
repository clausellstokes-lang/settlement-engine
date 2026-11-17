// BAR6-MARKS · LAW 8'S MARK RULES, ON THE RECORD (BRIEF-BAR6 B2/L4: the detector kept as a guard).
// The page form (`law8.mjs`, auditor D) reads a census dump; a test corpus carries births, not dumps. This is the same
// rules of BAR6-MARKS's seat read off a born record and the one mark leaf the tabs print through
// (`display/crisisStoppedRow.js :: rowMarkText`): the WORST STATE each rule names, read from the record's own lines (the
// writer of each page line the page form reads, never a flagged sentence), and a house or a row of it printed bare.
//   8a.input    the page says a good is not had: "Needed, and not brought in: …" (`tradeListDisplay.js ::
//               tradeListsAsPrinted().needed`), "… depend on X from outside, which the siege has cut off"
//               (`chainNeedShown.js :: chainNeedLine`), the war's iron hook ("… the smiths have nothing to mend tools
//               with"), or a house's own gap line ("No X reaches the H.", `validationOnPage.js :: resourceGapLines`); a live
//               craft house whose trade cannot go on without it (`law8.mjs :: GOODS`, the page form's own words) prints bare
//   8a.mild     a house the leaf marks, whose card head still prints a milder state than Impaired
//               (`tabHelpers.js :: computeChainSets` through `setsWithMarkedHousesWorse`, as both tabs print it)
//   8b.extract  a mine or a quarry where EVERY GROUND OF ITS OWN KIND THE RECORD HOLDS IS SPENT; the house prints bare.
//               RE-KEYED BY RULING BR10 (2) (the sixth chair, 2026-11-17; LEFT-MARKS item 1): before, every CHAIN listing the
//               house on a spent ground; now the supply rule's own reading (BIRTH-3's AMENDMENT 2 (A)), read from the tables
//               (`law8.mjs :: ownGroundsOnRecord`: `houseKinds.js :: SOURCE_GROUNDS`, the record's land lists, its proven
//               grounds), never through the story leaf under test. A house outside the table keeps the chains' reading.
//   8c.harvest  a famine, the record's income share printed scarce (`rowStoppedBy(…, 'income', …)`); the row that sells grain
//               from the field prints bare
//   8c.failed   a famine whose food record names the failed source; a market's row that sells it prints bare
//   8c.surplus  a famine; a house whose own description says it runs only on a grain surplus prints bare
// `{ blind: true }` reads every row as bare (the positive control: the detector must find its rows with the marks hidden).
// NAMED EXCLUSIONS: each is a row of EXCLUDED below with its reason.
import { EXTRACTS, GOODS, everyOwnGroundSpent, ownGroundsOnRecord } from './law8.mjs';
import { rowMarkText, rowStoppedBy, setsWithMarkedHousesWorse } from '../../../src/domain/display/crisisStoppedRow.js';
import { chainNeedLine } from '../../../src/domain/display/chainNeedShown.js';
import { tradeListsAsPrinted } from '../../../src/domain/display/tradeListDisplay.js';
import { resourceGapLines } from '../../../src/domain/display/validationOnPage.js';
import { computeChainSets } from '../../../src/components/new/tabHelpers.js';
import { liveInstitutions } from '../../../src/domain/institutions/institutionRoster.js';
import { serviceRowsOf } from '../../../src/domain/dossier/entityLinks.js';
import { crisisOf } from '../../../src/domain/facts/crisisKind.js';

/** A named exclusion: { rule, house (a RegExp over the house's name), why }. */
export const EXCLUDED = Object.freeze([
  // r2s-indebted-metropolis-0: the smelter's own gap names its ore (gold or silver, brought in): the record's gap writer
  // speaks of this house, and its reading stands (`housesWantingTradeInput` reads no gapped house); the need list's iron
  // ore is the iron trade's, which no iron house of that town works
  { rule: '8a.input', house: /^Smelter$/, why: 'a smelter whose own gap names its ore: the gap writer spoke of it' },
]);

// `law8.mjs`'s own readings of a good's name and of a house that only trades it (copied: the page form exports GOODS alone)
const goodOf = (text) => {
  const t = String(text).replace(/\b(precious metals?(?: veins)?|gold and silver ore|gold or silver ore|gold|silver)\b/gi, ' ').replace(/\btimber or rags for paper\b|\btimber\/rags\b|\brags\b/gi, ' ')
    .replace(/\bmountain timber\b|\btimber \(for large vessels\)/gi, ' ');
  return Object.keys(GOODS).filter((k) => GOODS[k].words.test(t));
};
const NOT_A_WORKSHOP = /\b(market|merchants?'? (?:guild|quarter)|warehouse|exchange|granar(?:y|ies)|stores?|caravan|customs|guild hall|council|court|watch|garrison|temple|shrine|church|cathedral|monaster)\b/i;
const CRAFT_CATS = /^(Crafts|Economy|Industry|Trade|Commerce|Production|Magic)$/;
const isCustom = (h) => h?.custom === true || h?.source === 'custom' || h?.isCustom === true;

/** @param {any} s @returns {Map<string, { how: string, only: string | null }>} good -> how the page says it is not had */
export function goodsNotHadOnRecord(s) {
  const out = new Map();
  const put = (k, how, only = null) => { const key = only ? `${k}@${only}` : k; if (!out.has(key)) out.set(key, { good: k, how, only }); };
  for (const g of tradeListsAsPrinted(s).needed) for (const k of goodOf(g)) put(k, 'needed');
  for (const c of Array.isArray(s?.economicState?.activeChains) ? s.economicState.activeChains : []) {
    const m = /depend on (.+?) from outside, which the siege has cut off/.exec(chainNeedLine(c, s, true));
    if (m) for (const k of goodOf(m[1])) put(k, 'cut off');
  }
  const hooks = Array.isArray(s?.economicViability?.plotHooks) ? s.economicViability.plotHooks : [];
  if (hooks.some((h) => /the smiths have nothing to mend tools with/.test(String(h?.hook ?? '')))) put('iron', 'war');
  for (const l of resourceGapLines(s)) { const m = /^No (.+?) reaches the (.+?)\.$/.exec(String(l?.impact ?? '')); if (m) for (const k of goodOf(m[1])) put(k, 'gap', m[2]); }
  return out;
}

/** @param {any} s @returns {Set<string>} the goods the record says are made here or (no siege) brought in */
function goodsHadOnRecord(s) {
  const lists = tradeListsAsPrinted(s);
  const had = new Set();
  for (const item of [...lists.local, ...(crisisOf(s).has('under_siege') ? [] : lists.imports)]) for (const k of goodOf(item)) had.add(k);
  return had;
}

/**
 * Every instance of BAR6-MARKS's rules on one born record.
 * @param {any} s @param {{ blind?: boolean }} [opts]
 * @returns {Array<{ rule: string, house: string, why: string }>}
 */
export function law8MarksInstances(s, { blind = false } = {}) {
  const out = [];
  const houses = liveInstitutions(s).filter((h) => h && typeof h.name === 'string' && !isCustom(h));
  const rows = serviceRowsOf(s?.availableServices).map(({ svc }) => svc).filter((v) => v && !isCustom(v));
  const bareHouse = (h) => blind || (rowMarkText(s, 'house', h) === null && rows.filter((v) => v.institution === h.name).every((v) => rowMarkText(s, 'service', v) === null));
  const push = (rule, house, why) => { if (!EXCLUDED.some((x) => x.rule === rule && x.house.test(house))) out.push({ rule, house, why }); };

  // 8a.input
  const had = goodsHadOnRecord(s);
  for (const [, lack] of goodsNotHadOnRecord(s)) {
    if (had.has(lack.good) && lack.how !== 'war' && lack.how !== 'cut off') continue;
    for (const h of houses) {
      if (!CRAFT_CATS.test(String(h.category ?? '').trim())) continue;
      if (lack.only && !h.name.toLowerCase().startsWith(lack.only.toLowerCase())) continue;
      if (!GOODS[lack.good].houses.test(h.name) || NOT_A_WORKSHOP.test(h.name)) continue;
      if (bareHouse(h)) push('8a.input', h.name, `the page says ${lack.good} is not had (${lack.how}); ${h.name} prints bare`);
    }
  }
  // 8a.mild
  const sets = computeChainSets(s);
  const shown = blind ? sets : setsWithMarkedHousesWorse(s, sets); // blind: the head as the chain sets alone print it
  for (const h of houses) {
    if (!(shown.vulnerable.has(h.name) || shown.degraded.has(h.name)) || shown.impaired.has(h.name)) continue;
    if (rowMarkText(s, 'house', h) !== null) push('8a.mild', h.name, `${h.name} is marked "${rowMarkText(s, 'house', h)}" and its head prints a milder state`);
  }
  // 8b.extract
  const spent = new Set(Array.isArray(s?.config?.nearbyResourcesDepleted) ? s.config.nearbyResourcesDepleted : []);
  const chains = Array.isArray(s?.economicState?.activeChains) ? s.economicState.activeChains : [];
  for (const h of houses) {
    if (!EXTRACTS.test(h.name)) continue;
    if (ownGroundsOnRecord(s, h)) { // a source house of the table (ruling BR10 (2))
      if (everyOwnGroundSpent(s, h) && bareHouse(h)) push('8b.extract', h.name, `every ground of ${h.name}'s own kind the record holds is spent (${ownGroundsOnRecord(s, h)?.spent.join(', ')}); it prints bare`);
      continue;
    }
    const own = chains.filter((c) => Array.isArray(c?.processingInstitutions) && c.processingInstitutions.includes(h.name) && typeof c.resourceKey === 'string');
    if (own.length && own.every((c) => spent.has(c.resourceKey) && c.status !== 'magically_sustained') && bareHouse(h)) push('8b.extract', h.name, `every ground ${h.name} works is spent; it prints bare`);
  }
  // 8c
  if (crisisOf(s).has('famine')) {
    const shares = Array.isArray(s?.economicState?.incomeSources) ? s.economicState.incomeSources : [];
    const harvestScarce = shares.some((x) => String(x?.source ?? '').trim() === 'Harvest' && rowStoppedBy(s, 'income', x) !== null);
    const failed = String(s?.economicState?.foodSecurity?.foodRecord?.failedSource ?? '');
    const FAILED_WORDS = { grain: /\b(grain|flour|wheat|barley)\b/i, livestock: /\b(livestock|cattle|herds?)\b/i, fish: /\b(fish|catch)\b/i };
    for (const v of rows) {
      const h = houses.find((x) => x.name === v.institution);
      if (!h) continue;
      const bare = blind || (rowMarkText(s, 'service', v) === null && rowMarkText(s, 'house', h) === null);
      if (harvestScarce && bare && (/^Grain at harvest$|^Grain sales?$/i.test(String(v.name)) || /grain sold by the sack|straight from the field at harvest/i.test(String(v.desc ?? ''))))
        push('8c.harvest', h.name, `the harvest is printed scarce; ${v.name} prints bare`);
      if (FAILED_WORDS[failed] && bare && /\b(market|fair)\b/i.test(h.name) && FAILED_WORDS[failed].test(String(v.desc ?? '')) && /\b(produce|goods|sold|sells?|trade)\b/i.test(String(v.desc ?? '')) && !/\b(when|whenever)\b/i.test(String(v.desc ?? '')))
        push('8c.failed', h.name, `the ${failed} failed; ${v.name} offers it bare`);
    }
    for (const h of houses) if (/only runs when grain is in surplus/.test(String(h.desc ?? '')) && bareHouse(h)) push('8c.surplus', h.name, `${h.name} runs only on a grain surplus; it prints bare in a famine`);
  }
  return out;
}
