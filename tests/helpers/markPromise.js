/**
 * tests/helpers/markPromise.js — THE DETECTOR OF KIND S1, "THE MARK'S PROMISE" (BAR4-SERVICES, BRIEF-BAR4 amendment K;
 * the chair's direction of 2026-11-16; vetoable by the owner).
 *
 * The Services and Institutions tabs say, under a crisis, "a row it touches is marked", and beside a house short of its
 * input "a row marked short is what its house makes when supplied". THE KIND: a row printed BARE whose need the record
 * says is cut. This is a pure function over a town's RECORD and the lines its tabs PRINT (the marks each row carries, read
 * through the very leaves the tabs call: `crisisStoppedRow.js :: rowMarkText / rowStoppedBy / rowShortOf`, the pill sets
 * of `tabHelpers.js :: computeChainSets`, the house tag of `InstitutionsTab.jsx :: houseStatus`). It reads the record's
 * settled facts for the need, never the words of one flagged sentence, and returns EVERY instance:
 *
 *   siege-import  under a siege, a row of a house the record says runs on an IMPORTED input (`resourceAnalysis.gaps[]`,
 *                 `kind: 'imported'`) that lives on that input (declared `input`), bare: nothing comes in by road
 *   siege-travel  under a siege, a row whose own words are travel past the gates (an escort, a convoy, a caravan, a
 *                 journey, a ferry), bare
 *   famine-food   under a famine, a row whose own words name the food the famine failed (`foodRecord.failedSource`), bare
 *   gap-missing   a row of a house the record says LACKS its input (`gaps[]`, `kind: 'missing'`) that lives on that input,
 *                 bare (in ordinary times as in a crisis)
 *   spent-fishery (RULING FS1, the chair's, 2026-11-16) a row living on its house's input, of a fishing house (the
 *                 houses `crisisDependence.js :: GROUNDS_WORKED_OFF_CHAIN` names), in a town whose every fishery on the
 *                 record (`config.nearbyResources`) is on the Depleted list, bare of its shortage mark, whatever the food
 *                 ledger counts
 *   tab-split     one service row marked on one tab and bare on the other
 *   income-house  an income share of a house's trade whose every live house of that trade the leaf marks, bare
 *   magic-medical the Magic tab's "Medical role: absent" beside a service row the Services tab prints that heals by magic
 *
 * A row "marked" on the Services tab carries the pill (Impaired / Reduced / Vulnerable) or the leaf's mark; a door on the
 * Institutions tab carries the leaf's door word or its house's one tag (X-41: the house wears the worst state of its
 * rows). A custom row is the DM's and is not read.
 *
 * THE NAMED EXCLUSIONS (each a state the detector finds and judges TRUE, with its reason; never a narrowing to quiet it):
 *   EX-WITHIN      a travel row whose own words keep it inside the walls ("within the settlement's jurisdiction",
 *                  "beneath the walls"): a siege does not stop it
 *   EX-CARRIED     a famine row whose food words name what it carries or holds, not what it sells (the cooper's barrels "for
 *                  ale, wine, salted meat, and fish"; the river freight's "Grain, stone, timber, goods"): the famine does
 *                  not stop the making of barrels or the hauling of freight
 *   EX-SPLIT       gap-missing where the page's own gap reader answers the input (`validationOnPage.js ::
 *                  resourceGapLines` prints no "No … reaches …" line for the house: the record's trade lists hold what it
 *                  makes, or a connected route brings it). THE RECORD IS SPLIT (amendment K6: `resourceGenerator.js`'s gap
 *                  against the economy's production and exports): named for the chair, not marked here, so that a mark
 *                  never contradicts the page's own export list
 *   EX-BOUGHT      (BIRTH-3, 2026-11-17; the owner's rule as BR4 and BR5 rule it, built by BIRTH-2) spent-fishery where the
 *                  fishing house is A BUYER (`houseKinds.js :: BUYS_AND_WORKS`: the fish market, the fishmonger: "it sells
 *                  the catch brought to it"), the town's imports bring its fish by name (its fisheries' shortage word, the
 *                  owner's first story, "used up, bought in": the engine's own word, `IMPORT_WORD.fish`), no siege shuts the
 *                  town or the row carries the siege's mark, and the one reader answers it brought in (`imported`, or `route`
 *                  for a market whose trade is the road): its row bare is true (under a siege, its siege mark); a besieged
 *                  market's BARE row and the houses that fish the water themselves stay in the rule
 *
 * THE POSITIVE CONTROL'S DOOR: `blind`, the tabs whose printed marks the detector reads as bare (the record's needs are
 * read as ever), so that a guard can show the detector fires on the record's own instances where the marks are not there.
 *
 * Pure: no randomness, no clock, no write.
 */
import { rowMarkText, rowStoppedBy, rowShortOf, stoppingCrisesOf, serviceRowDependence, houseDependenceOf } from '../../src/domain/display/crisisStoppedRow.js';
import { incomeDescShown } from '../../src/domain/display/economicsCrisisMarks.js';
import { computeChainSets } from '../../src/components/new/tabHelpers.js';
import { serviceRowsOf } from '../../src/domain/dossier/entityLinks.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { resourceGapLines } from '../../src/domain/display/validationOnPage.js';
import { magicRoleBandShown, magicRoleHeld } from '../../src/domain/display/magicProvisionShown.js';
import { deriveMagicPosture } from '../../src/domain/display/dossierViewModel.js';
import { RESOURCE_ROW_TRADES } from '../../src/generators/economy/incomeLineSiblings.js';
import { INPUT, GROUNDS_WORKED_OFF_CHAIN } from '../../src/data/crisisDependence.js';
import { catalogIdForName } from '../../src/data/institutionalCatalog.js';
import { BUYS_AND_WORKS, IMPORT_WORD } from '../../src/domain/facts/houseKinds.js';
import { CHAIN_RAW_INPUT, houseInputAtHand } from '../../src/domain/facts/houseInputAtHand.js';

/** Travel past the gates, in a row's own words. */
export const TRAVEL_WORDS = /\b(escort(?:s|ed)?|convoys?|caravans?|expeditions?|through dangerous territory|overland|journeys?|voyages?|ferry|ferries|crossings?)\b/i;
/** A travel row that keeps inside the walls (EX-WITHIN). */
export const WITHIN_WORDS = /\bwithin the (?:settlement|walls|town|city)|\bbeneath the walls\b|\binside the walls\b/i;
/** The food a famine fails, in a row's own words, by the food record's failed source. */
export const FOOD_WORDS = Object.freeze({
  livestock: /\b(meats?|beef|pork|mutton|lamb|veal|bacon|hams?|sausages?|roast(?:ed)?|charcuterie|milk|cheeses?|butter|cream|dairy)\b/i,
  grain: /\b(bread|breads|flour|grain|ale|beer|porridge|pastr(?:y|ies)|pies?|loaf|loaves|biscuits?|malt)\b/i,
  mill: /\b(bread|breads|flour|grain|ale|beer|porridge|pastr(?:y|ies)|pies?|loaf|loaves|biscuits?|malt)\b/i,
  fish: /\b(fish|fishes|catch|herring|oysters?|eels?|seafood)\b/i,
  game: /\b(game|venison|boar|hares?|wildfowl)\b/i,
});
/** EX-CARRIED: the rows whose food words are what they carry or hold. */
export const CARRIED_ROWS = Object.freeze(['Barrel making', 'Cargo freight']);
/** A service row that heals by magic, in its own words. */
const MAGIC_HEALING = /\b(heal\w*|cure\w*|restor\w*)\b[^.]*\b(magic\w*|divine|spell\w*|prayer)\b|\b(magic\w*|divine|spell\w*)\b[^.]*\b(heal\w*|cure\w*)\b/i;

/** @param {any} r */
const isCustom = (r) => r?.custom === true || r?.source === 'custom' || r?.isCustom === true;

/**
 * Every instance of the kind in one town.
 * @param {any} s the settlement record
 * @param {{ blind?: ReadonlyArray<string> }} [opts] tabs read as printing no mark (the positive control): 'Services',
 *   'Institutions', 'Economics', 'Magic'
 * @returns {Array<{ kind: string, tab: string, row: string, house: string, need: string, excluded?: string }>}
 */
export function markPromiseInstances(s, opts = {}) {
  const blind = new Set(opts.blind || []);
  /** @type {Array<{ kind: string, tab: string, row: string, house: string, need: string, excluded?: string }>} */
  const out = [];
  if (!s || typeof s !== 'object') return out;
  const crises = stoppingCrisesOf(s);
  const sets = computeChainSets(s);
  const pill = (/** @type {any} */ svc) => ['impaired', 'degraded', 'vulnerable'].some((k) => sets[k].has(String(svc.name || '')) || sets[k].has(String(svc.institution || '')));
  const rows = serviceRowsOf(s.availableServices).map(({ svc }) => svc).filter((svc) => svc && typeof svc === 'object' && !isCustom(svc));
  const byHouse = new Map();
  for (const svc of rows) { const h = String(svc.institution || ''); if (!byHouse.has(h)) byHouse.set(h, []); byHouse.get(h).push(svc); }
  const tagOf = (/** @type {string} */ h) => (byHouse.get(h) || []).some(pill);
  const onServices = (/** @type {any} */ svc) => !blind.has('Services') && (pill(svc) || rowMarkText(s, 'service', svc, crises) !== null);
  const onDoor = (/** @type {any} */ svc) => !blind.has('Institutions') && (rowStoppedBy(s, 'service', svc, crises) !== null || rowShortOf(s, 'service', svc) !== null || tagOf(String(svc.institution || '')));
  const houses = new Set(liveInstitutions(s).map((i) => i?.name).filter(Boolean));
  const text = (/** @type {any} */ svc) => `${svc.name || ''}. ${svc.desc || ''}`;
  const gaps = Array.isArray(s.resourceAnalysis?.gaps) ? s.resourceAnalysis.gaps : [];
  const gapOf = (/** @type {string} */ kind) => new Map(gaps.filter((g) => g && g.institution && g.kind === kind).map((g) => [String(g.institution), String(g.chain)]));
  const push = (/** @type {any} */ o) => out.push(o);

  // tab-split: the same row, marked on one tab and bare on the other (a row prints on the Institutions tab where its house is live)
  for (const svc of rows) {
    if (!houses.has(svc.institution)) continue;
    if (onServices(svc) !== onDoor(svc)) push({ kind: 'tab-split', tab: onServices(svc) ? 'Institutions' : 'Services', row: svc.name, house: svc.institution, need: 'one mark on both tabs' });
  }
  // siege-import
  if (crises.includes('under_siege')) {
    const imported = gapOf('imported');
    for (const svc of rows) {
      const chain = imported.get(String(svc.institution || ''));
      if (!chain || !serviceRowDependence(s, svc).includes(INPUT)) continue;
      if (!onServices(svc)) push({ kind: 'siege-import', tab: 'Services', row: svc.name, house: svc.institution, need: `imported ${chain}` });
      if (houses.has(svc.institution) && !onDoor(svc)) push({ kind: 'siege-import', tab: 'Institutions', row: svc.name, house: svc.institution, need: `imported ${chain}` });
    }
    for (const inst of liveInstitutions(s)) {
      const chain = imported.get(String(inst?.name || ''));
      if (!chain || isCustom(inst) || !houseDependenceOf(inst).includes(INPUT)) continue;
      if (blind.has('Institutions') || (rowMarkText(s, 'house', inst, crises) === null && !tagOf(inst.name))) push({ kind: 'siege-import', tab: 'Institutions', row: '(house)', house: inst.name, need: `imported ${chain}` });
    }
    // siege-travel
    for (const svc of rows) {
      const t = text(svc);
      if (!TRAVEL_WORDS.test(t) || onServices(svc)) continue;
      push({ kind: 'siege-travel', tab: 'Services', row: svc.name, house: svc.institution, need: 'travel past the gates', ...(WITHIN_WORDS.test(t) ? { excluded: 'EX-WITHIN' } : {}) });
    }
  }
  // famine-food
  if (crises.includes('famine')) {
    const failed = s.economicState?.foodSecurity?.foodRecord?.failedSource;
    const re = FOOD_WORDS[typeof failed === 'string' ? failed : 'grain'];
    if (re) for (const svc of rows) if (re.test(text(svc)) && !onServices(svc)) push({ kind: 'famine-food', tab: 'Services', row: svc.name, house: svc.institution, need: `food: ${failed || 'grain'}`, ...(CARRIED_ROWS.includes(svc.name) ? { excluded: 'EX-CARRIED' } : {}) });
  }
  // gap-missing
  const missing = gapOf('missing');
  if (missing.size) {
    const said = new Set(resourceGapLines(s).map((l) => String(l?.impact || '')));
    const pageSaysShort = (/** @type {string} */ h) => [...said].some((line) => /^No .+ reach(?:es)? /.test(line) && line.toLowerCase().includes(String(h).toLowerCase().replace(/\s*\(.*\)$/, '')));
    for (const svc of rows) {
      const chain = missing.get(String(svc.institution || ''));
      if (!chain || !serviceRowDependence(s, svc).includes(INPUT)) continue;
      if (!blind.has('Services') && (rowShortOf(s, 'service', svc) !== null || pill(svc))) continue;
      push({ kind: 'gap-missing', tab: 'Services', row: svc.name, house: svc.institution, need: `lacks ${chain}`, ...(pageSaysShort(svc.institution) ? {} : { excluded: 'EX-SPLIT' }) });
    }
  }
  // spent-fishery (FS1)
  const fisheries = (Array.isArray(s.config?.nearbyResources) ? s.config.nearbyResources : []).filter((k) => Object.values(GROUNDS_WORKED_OFF_CHAIN).some((g) => g.includes(k)));
  const spent = new Set(Array.isArray(s.config?.nearbyResourcesDepleted) ? s.config.nearbyResourcesDepleted : []);
  if (fisheries.length && fisheries.every((k) => spent.has(k))) {
    for (const svc of rows) {
      const id = String(catalogIdForName(String(svc.institution || '')) || '');
      if (!Object.prototype.hasOwnProperty.call(GROUNDS_WORKED_OFF_CHAIN, id) || !serviceRowDependence(s, svc).includes(INPUT)) continue;
      if (!blind.has('Services') && rowShortOf(s, 'service', svc) !== null) continue;
      const house = liveInstitutions(s).find((i) => i?.name === svc.institution);
      // EX-BOUGHT (BIRTH-3; tightened by the chair's AMENDMENT 2 (C)): the owner's first story exactly: a buyer, in a town no
      // siege shuts, whose imports hold the engine's own word for its good (`houseKinds.js :: IMPORT_WORD.fish`, "Salted fish",
      // its bracketed reason struck: the fisheries' shortage word is that word), and which the one reader answers brought in
      // (`imported`, or `route`: a market's own trade is the road that brings the catch, answered only where no siege shuts it)
      const struckWord = (/** @type {unknown} */ x) => String(x).replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
      const besiegedHere = (Array.isArray(s.config?.stressTypes) ? s.config.stressTypes : []).includes('under_siege');
      const fishBought = (Array.isArray(s.economicState?.primaryImports) ? s.economicState.primaryImports : []).some((x) => struckWord(x) === struckWord(IMPORT_WORD.fish));
      const answer = house ? houseInputAtHand(s, 'fish', house, { rawResource: CHAIN_RAW_INPUT.fish }) : 'missing';
      // under a siege the bought catch is cut off: excused only where the row carries the siege's own mark (never bare)
      const sieged = besiegedHere && rowStoppedBy(s, 'service', svc, crises) !== null;
      const bought = BUYS_AND_WORKS.has(id) && (!besiegedHere || sieged) && fishBought && (answer === 'imported' || answer === 'route');
      push({ kind: 'spent-fishery', tab: 'Services', row: svc.name, house: svc.institution, need: `every fishery depleted (${fisheries.join(', ')})`, ...(bought ? { excluded: 'EX-BOUGHT' } : {}) });
    }
  }
  // income-house
  const eco = s.economicState || {};
  const live = liveInstitutions(s).filter((i) => i && typeof i.name === 'string' && !isCustom(i));
  for (const src of Array.isArray(eco.incomeSources) ? eco.incomeSources : []) {
    const trade = RESOURCE_ROW_TRADES[String(src?.source || '').trim()] || (String(src?.source || '').trim() === 'Fish & Maritime Produce' ? RESOURCE_ROW_TRADES['Fish & Preserved Produce'] : null);
    if (!trade) continue;
    const own = live.filter((i) => trade.house.test(String(i.name).toLowerCase()));
    if (!own.length || !own.every((i) => rowStoppedBy(s, 'house', i, crises) !== null)) continue;
    if (blind.has('Economics') || incomeDescShown(s, src) === String(src.desc || '').trim()) push({ kind: 'income-house', tab: 'Economics', row: src.source, house: own.map((i) => i.name).join(' + '), need: 'its house is marked' });
  }
  // magic-medical
  const posture = deriveMagicPosture(s);
  const band = posture?.roles?.medical;
  if (band !== undefined && (blind.has('Magic') || (String(magicRoleBandShown(s, 'medical', band)) === 'absent' && !magicRoleHeld(s, 'medical')))) {
    const healer = rows.find((svc) => MAGIC_HEALING.test(text(svc)));
    if (healer) push({ kind: 'magic-medical', tab: 'Magic', row: 'Medical role: absent', house: healer.institution, need: `${healer.name}: ${healer.desc}` });
  }
  return out;
}
