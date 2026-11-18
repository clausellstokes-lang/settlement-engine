// BAR6-AUDIT-D · LAW 8 · ONE STATE FOR A THING ON EVERY SURFACE (M1; kind K1; it widens LAW 2 and LAW 3).
// For each THING the page prints (a house, a service, a good a house works, a ground it extracts, a harvest, an export,
// an income, a criminal operation, a person's trade) the WORST state any surface gives it — a card's or a chip's mark,
// "Needed, and not brought in", "Short of X", a Services row's "Needs X" under its mark, "Nothing more can be taken",
// a failed or scarce harvest, the siege's reach, the Outlook's list of houses critically impaired — is read once; an
// INSTANCE is the same thing printed on another surface with no mark and no word of it.
// CONSERVATIVE FIRST: every rule needs the page's own line for the worst state (the `against`), and the surface it
// fires on carries no mark of any kind (a chip under a marked card is covered by the card: the second check's rule 1).
// Pure: reads `readTown` of pageB.mjs (seat B's reader, unchanged) plus the parts below, read in this file.
import { CHIP_MARK, MARK_LEAD, economicsSections } from './pageB.mjs';
import { IMPLIED_GROUND, SOURCE_GROUNDS } from '../../../src/domain/facts/houseKinds.js';
import { SPENT_GROUND_YIELD } from '../../../src/data/crisisDependence.js';
import { catalogIdForName } from '../../../src/data/institutionalCatalog.js';
import { liveInstitutions } from '../../../src/domain/institutions/institutionRoster.js';

export const LAW = 'L8';
const lc = (s) => String(s || '').toLowerCase();
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ---------------------------------------------------------------- the goods a house works, and who works them
// key -> { words: how the page names the good; houses: the houses whose trade cannot go on without it }
export const GOODS = {
  iron: { words: /\b(metals?|iron(?: ore)?|metal ore)\b/i, houses: /\b(blacksmiths?|smithy|smiths?|smelters?|metalworkers?|armou?rers?|armou?ry|weaponsmiths?|swordsmiths?|toolsmiths?|farriers?|cutlers?|foundry|forges?)\b/i },
  grapes: { words: /\bgrapes?\b/i, houses: /\b(vintners?|winer(?:y|ies)|wine ?press)\b/i },
  clay: { words: /\bclay\b/i, houses: /\b(potters?|pottery|brickmakers?|brickworks|kilns?|tile ?makers?)\b/i },
  sand: { words: /\b(glass sand|silica)\b/i, houses: /\b(glassblowers?|glassworks|glaziers?|glassmakers?)\b/i },
  timber: { words: /\b(timber|lumber)\b/i, houses: /\b(carpenters?|sawmills?|shipwrights?|shipyards?|coopers?|joiners?|wheelwrights?|cartwrights?|woodworkers?|woodcarvers?)\b/i },
  stone: { words: /\bstone\b/i, houses: /\b(stonemasons?|masons?|stonecutters?|sculptors?)\b/i },
  herbs: { words: /\b(medicinal herbs|herbs)\b/i, houses: /\b(apothecar(?:y|ies)|herbalists?|physicians?|hospitals?|infirmar(?:y|ies)|healers?' (?:hall|house))\b/i },
  // precision draw 1 (720, seed 720): "spices" alone does not empty a luxury quarter that also deals in silk and precious things
  luxury: { words: /\b(luxury goods|luxury materials|silks?)\b/i, houses: /\b(luxury goods quarter|luxury|silk (?:merchants?|traders?))\b/i },
  spices: { words: /\bspices?\b/i, houses: /\bspice (?:merchants?|market|traders?|quarter)\b/i },
  grain: { words: /\b(grain|barley|wheat)\b/i, houses: /\b(bakers?|baker(?:y|ies)|brewer(?:y|ies|s)?|maltsters?|malthouse|distiller(?:y|ies|s)?|mills?|millers?)\b/i },
  livestock: { words: /\b(livestock|cattle|herds?)\b/i, houses: /\b(dairy|dairy farmers?|butchers?|butcher(?:y|ies)|shambles|slaughterhouses?|cheesemakers?|stockyards?)\b/i },
  hides: { words: /\b(animal hides|hides|leather)\b/i, houses: /\b(tanners?|tanner(?:y|ies)|leatherworkers?|saddlers?|cobblers?|cordwainers?)\b/i },
  wool: { words: /\b(wool|fleece)\b/i, houses: /\b(weavers?|fullers?|fulling mill|spinners?|wool (?:merchants?|staple))\b/i },
};
// precious metals are coin and plate, not iron; timber "for paper" and rags are the paper-maker's, not the carpenter's
const goodOf = (text) => {
  const t = String(text).replace(/\b(precious metals?(?: veins)?|gold and silver ore|gold or silver ore|gold|silver)\b/gi, ' ').replace(/\btimber or rags for paper\b|\btimber\/rags\b|\brags\b/gi, ' ')
    // "mountain timber" is the long spar a sawmill of the heights wants, and "timber (for large vessels)" the shipwright's:
    // neither says the joiner's or the cooper's wood is not had
    .replace(/\bmountain timber\b|\btimber \(for large vessels\)/gi, ' ');
  return Object.keys(GOODS).filter((k) => GOODS[k].words.test(t));
};
// a house that only TRADES or RECEIVES a good is no consumer of it (a market, a warehouse, a guild of merchants)
const NOT_A_WORKSHOP = /\b(market|merchants?'? (?:guild|quarter)|warehouse|exchange|granar(?:y|ies)|stores?|caravan|customs|guild hall|council|court|watch|garrison|temple|shrine|church|cathedral|monaster)\b/i;
const CRAFT_CATS = /^(Crafts|Economy|Industry|Trade|Commerce|Production|Magic)$/;

// ---------------------------------------------------------------- 8b's reading of a source house's grounds (RULING BR10)
/** The house that extracts (both forms of 8b.extract read a house by this name). */
export const EXTRACTS = /\b(mines?|quarr(?:y|ies)|pits?|diggings|workings|claims?|delvers?)\b/i;
const list = (x) => (Array.isArray(x) ? x : []);
/**
 * RE-KEYED BY RULING BR10 (2) (the sixth chair, 2026-11-17; LEFT-MARKS item 1): 8b.extract takes the supply rule's reading
 * of a source house (BIRTH-3's AMENDMENT 2 (A): worked out only when EVERY GROUND OF ITS OWN KIND IS SPENT). Read here from
 * the tables and the record, never through the story leaf under test (`supplyStory.js :: sourceStoryOf`): the house's own
 * kinds (`houseKinds.js :: SOURCE_GROUNDS`, by its catalogue id); the grounds of those kinds the record holds (its land lists
 * as the Nearby Resources section prints them: `config.nearbyResources` and `nearbyResourcesNative`, a ground the user
 * authored set aside, with every ground of `nearbyResourcesDepleted`), each spent where `nearbyResourcesDepleted` lists it;
 * and, where the land holds none of its kinds, the ground the house itself proves (the record's proven grounds,
 * `impliedGroundsOf`: there, or used up). A chain kept by magic feeds no house of a spent ground (the supply rule's reading).
 * LEFT-KEYS K7 (1), 2026-11-18 (the second reader of LEFT-MARKS): THE PROVEN GROUND'S STATE IS READ OFF THE HOUSE'S OWN STORED
 * GAP ROWS, not through `supplyStory.js :: impliedGroundsOf` (the leaf under test: with it mutated in scratch to read every
 * proven ground there, 12 quarries of the 720 printed bare beside their own gap row "missing: stone" and this reader found 0).
 * The ground the house proves (`houseKinds.js :: IMPLIED_GROUND`, by its catalogue id) is used up where the house has a
 * stored gap row of kind `missing` or `imported` naming that ground's yield (`crisisDependence.js :: SPENT_GROUND_YIELD`; a
 * peat cutter's peat; the mountain timber row's timber), else there; a house whose own row is the failed venture's line
 * proves nothing (BR6).
 * @param {any} record @param {{ name?: unknown, catalogId?: unknown } | null | undefined} house
 * @returns {{ held: string[], spent: string[] } | null} null where the house is no source house of the table
 */
/** The failed venture's stored line (`supplyStory.js :: VENTURE_WORDS`, in both versions and both numbers). */
const VENTURE_ROW = /^The .+? (?:stands abandoned|stand abandoned|is failing|are failing)\b.*: no .+? (?:lies|lie) near and none is brought in\.$/;
export function ownGroundsOnRecord(record, house) {
  const name = String(house?.name ?? '');
  const id = (typeof house?.catalogId === 'string' && house.catalogId) || catalogIdForName(name) || '';
  if (!Object.prototype.hasOwnProperty.call(SOURCE_GROUNDS, id)) return null;
  const cfg = record?.config || {};
  const custom = new Set(list(cfg.nearbyResourcesCustom).map(String));
  const depleted = new Set(list(cfg.nearbyResourcesDepleted).map(String).filter(Boolean));
  const land = new Set([...list(cfg.nearbyResources), ...list(cfg.nearbyResourcesNative)].map(String).filter((k) => !!k && !custom.has(k)));
  for (const k of depleted) land.add(k);
  /** @type {Map<string, boolean>} ground -> spent */
  const held = new Map();
  for (const g of SOURCE_GROUNDS[id]) if (land.has(g)) held.set(g, depleted.has(g));
  if (!held.size && Object.prototype.hasOwnProperty.call(IMPLIED_GROUND, id)) {
    const g = IMPLIED_GROUND[id];
    const rows = list(record?.resourceAnalysis?.gaps).filter((r) => r && r.institution === name);
    const venture = rows.some((r) => VENTURE_ROW.test(String(r.impact ?? '')));
    const good = id === 'peat_cutter' ? 'peat' : (SPENT_GROUND_YIELD[g] || '');
    const names = (chain) => { const c = String(chain ?? ''); return !!good && (c === good || (c === 'mountain_timber' && good === 'timber')); };
    if (!venture) held.set(g, rows.some((r) => (r.kind === 'missing' || r.kind === 'imported') && names(r.chain)));
  }
  return { held: [...held.keys()], spent: [...held].filter(([, s]) => s).map(([g]) => g) };
}
/** BR10 (2): every ground of the house's own kind the record holds is spent (one at least). @param {any} record @param {any} house */
export const everyOwnGroundSpent = (record, house) => { const g = ownGroundsOnRecord(record, house); return !!g && g.held.length > 0 && g.spent.length === g.held.length; };

// ---------------------------------------------------------------- the parts of the page this law reads
const isBlank = (l) => !l || !l.trim();

/** The failed venture's mark (BIRTH-3, `supplyStory.js :: ventureMarkText`), set where the short mark would be. */
export const VENTURE_LEAD = /^(?:Abandoned|Failing): a failed venture\./;
/** Every mark a house carries anywhere: its card (head, a description line's lead, a chip) or a Services row of it.
 * LEFT-MARKS M6 (the sixth chair's AMENDMENT 2, 2026-11-17): THE FAILED VENTURE'S MARK IS A MARK ("Abandoned: a failed
 * venture." / "Failing: a failed venture." leading a card's line or a Services row's description, as the short mark does). */
export function houseMarks(T, name) {
  const marks = [];
  const c = T.cards.find((x) => x.name === name);
  if (c) {
    if (/· (Impaired|Stopped)\b/.test(c.head)) marks.push({ tab: 'Systems/Institutions', i: c.headIdx, line: c.head });
    for (const l of c.lines) if (MARK_LEAD.test(l.text) || VENTURE_LEAD.test(l.text)) marks.push({ tab: 'Systems/Institutions', i: l.i, line: l.text });
    for (const ch of c.chips) if (ch.marked) marks.push({ tab: 'Systems/Institutions', i: c.chipIdx, line: c.chipLine });
  }
  for (const e of T.services) if (e.house === name && (e.marked || VENTURE_LEAD.test(String(e.desc ?? '')))) marks.push({ tab: 'Systems/Services', i: e.titleIdx, line: `${e.titleRaw} / ${e.desc}` });
  return marks;
}

/** A milder state the page gives the house: its card's " · Vulnerable", or a Services row titled "… Vulnerable" (precision
 * draw 1: a row so titled is not bare; where the page's worst state for it is "cannot be had", it is WEAK, counted apart). */
export function houseMild(T, name) {
  const c = T.cards.find((x) => x.name === name);
  if (c && /· Vulnerable\b/.test(c.head)) return { tab: 'Systems/Institutions', i: c.headIdx, line: c.head };
  const e = T.services.find((x) => x.house === name && /\sVulnerable$/.test(x.titleRaw));
  return e ? { tab: 'Systems/Services', i: e.titleIdx, line: e.titleRaw } : null;
}

/** The surfaces a house prints on: its card (chip line, or its head when it has no chips) and each Services row. */
function houseSurfaces(T, name) {
  const out = [];
  const c = T.cards.find((x) => x.name === name);
  if (c) out.push({ tab: 'Systems/Institutions', i: c.chipIdx >= 0 ? c.chipIdx : c.headIdx, line: c.chipLine || c.head,
    rowLines: [c.head, ...c.lines.map((l) => l.text), c.chipLine].filter(Boolean) });
  for (const e of T.services) if (e.house === name) out.push({ tab: 'Systems/Services', i: e.titleIdx, line: e.title,
    rowLines: [e.titleRaw, e.desc, e.needs, T.tabs['Systems/Services'][e.houseIdx + (e.needs ? 2 : 1)]].filter(Boolean) });
  return out;
}

/** The house's mark as a line of its own on a person's card (ruling CM1): a row's mark, or the failed venture's. */
export const CARD_MARK = /^(Stopped by|Curtailed by|Scarce in|Short of|Failing: a failed venture\.|Abandoned: a failed venture\.)/;
/** The people: { i, name, house, deal, cardMark } for each "How they deal" line, with the house the person's card names and
 * (LEFT-MARKS item 2, 2026-11-17; ruling CM1) the house's mark line the card prints under its house line, or null. */
export function readPeople(T) {
  const L = T.tabs['World/NPCs'] || [];
  const out = [];
  L.forEach((l, i) => {
    if (!/^How they deal\b/.test(l)) return;
    const deal = l === 'How they deal' ? (L[i + 1] || '') : l.replace(/^How they deal\s*/, '');
    let k = i; while (k > 0 && L[k] !== '▲') k--;
    const role = L[k + 1] || '';
    const house = role.split(' · ')[0].trim();
    let cardMark = null;
    for (let j = k + 2; j < i; j++) if (CARD_MARK.test(L[j])) { cardMark = { i: j, text: L[j] }; break; }
    out.push({ i: l === 'How they deal' ? i + 1 : i, line: l === 'How they deal' ? `How they deal ${deal}` : l, deal, house, name: (L[k - 1] || '').replace(/●+$/, '').trim(), cardMark });
  });
  return out;
}

/** The service economy's rows: { i, name, status, exportable, via, output, lines }. */
export function readServiceEconomy(T) {
  const L = T.tabs['Systems/Economics'] || [];
  const out = [];
  L.forEach((l, i) => {
    const m = l.match(/^(.+?) · Service( · Export)?(○ Operational|✓ Running| · Impaired| · Stopped)\s*$/);
    if (!m) return;
    const via = /^Via: /.test(L[i + 1] || '') ? L[i + 1].replace(/^Via:\s*·?\s*/, '').split(' · ').map((s) => s.trim()) : [];
    out.push({ i, line: l, name: m[1].trim(), exportable: !!m[2], status: m[3].replace(/^ · /, '').replace(/^[○✓] /, '').trim(), via, output: L[i + (via.length ? 2 : 1)] || '', rowLines: [l, L[i + 1], L[i + 2]].filter(Boolean) });
  });
  return out;
}

/** Income rows: { i, name, marked, line } (a row is "<name> <description>" or "<name> Stopped by the siege."). */
export function readIncome(T) {
  const sec = economicsSections(T.tabs['Systems/Economics'] || []);
  const rows = [];
  for (const x of sec['Income Sources'] || []) {
    if (/^\d+%$/.test(x.text)) continue;
    const m = x.text.match(/^(.+?)(?: (Stopped by the [a-z ]+\.|Curtailed by the [a-z ]+\.|Scarce in the [a-z ]+\.)|\s(?=[A-Z][a-z]+ [a-z])|$)/);
    rows.push({ i: x.i, line: x.text, name: (m?.[1] || x.text).trim(), marked: /(Stopped by|Curtailed by|Scarce in) the /.test(x.text) });
  }
  return rows;
}

// ---------------------------------------------------------------- the worst state, read once
/** The goods the page itself says are not had, each with the page line that says so. */
export function goodsNotHad(T) {
  const lack = new Map(); // key -> { tab, i, line, how }
  // a GLOBAL lack (the good itself is not had: every house that works it is starved) or a lack of ONE house (`only`)
  const put = (k, at, how, only) => { const key = only ? `${k}@${only}` : k; if (!lack.has(key)) lack.set(key, { ...at, how, good: k, only: only || null }); };
  const siegeShut = T.crises.has('under_siege') && T.all.some((x) => /since the siege nothing comes in|nothing comes in by road|Trade by road, gate and water has stopped|No food comes into .+ by trade/.test(x.text));
  for (const x of T.all) {
    let m;
    if ((m = x.text.match(/^Needed, and not brought in: (.+?)\.?$/))) for (const g of m[1].split(/, | and /)) for (const k of goodOf(g)) put(k, { tab: x.tab, i: x.i, line: x.text }, 'needed');
    if ((m = x.text.match(/depend on (.+?) from outside, which the siege has cut off/))) for (const k of goodOf(m[1])) put(k, { tab: x.tab, i: x.i, line: x.text }, 'cut off');
    if (/the smiths have nothing to mend tools with/.test(x.text)) put('iron', { tab: x.tab, i: x.i, line: x.text }, 'war');
    if ((m = x.text.match(/^No (.+?) reaches the (.+?)\.$/))) for (const k of goodOf(m[1])) put(k, { tab: x.tab, i: x.i, line: x.text }, 'gap', m[2]);
  }
  // a house's own "Short of X" or a marked row's "Needs X" says the GOOD is not had only while the siege shuts every import
  if (siegeShut) {
    for (const c of T.cards) for (const l of c.lines) { const m = l.text.match(/^(?:Curtailed by the [a-z ]+\. )?Short of ([a-z ]+?)\./); if (m) for (const k of goodOf(m[1])) put(k, { tab: 'Systems/Institutions', i: l.i, line: `${c.head} / ${l.text}` }, 'short'); }
    for (const e of T.services) if (e.marked && e.needs) for (const k of goodOf(e.needs.replace(/\..*$/, ''))) put(k, { tab: 'Systems/Services', i: e.titleIdx, line: `${e.titleRaw} / ${e.house} / ${e.needs}` }, 'needs');
  }
  return lack;
}

/** The goods the page says ARE had: produced locally, among the commodities available, or (no siege) imported. */
function goodsHad(T) {
  const res = T.tabs['Systems/Resources'] || [], eco = T.tabs['Systems/Economics'] || [];
  const after = (L, head) => { const i = L.indexOf(head); return i >= 0 ? (L[i + 1] || '') : ''; };
  const lists = [after(res, 'Commodities available'), after(eco, 'Produced locally')];
  if (!T.crises.has('under_siege')) lists.push(after(eco, 'Imports'));
  const had = new Set();
  for (const l of lists) for (const item of l.split(' · ')) for (const k of goodOf(item)) had.add(k);
  return had;
}

// ---------------------------------------------------------------- the rules
export function law8(T, town) {
  const out = [];
  const seen = new Set();
  const push = (rule, at, against, why, extra = {}) => {
    const key = `${rule}|${at.tab}|${at.i}`;
    if (seen.has(key)) return; seen.add(key);
    out.push({ law: LAW, rule, town, tab: at.tab, i: at.i, line: at.line, rowLines: at.rowLines || [at.line], against, why, ...extra });
  };
  const eco = T.tabs['Systems/Economics'] || [], res = T.tabs['Systems/Resources'] || [];
  const bare = (name) => houseMarks(T, name).length === 0;
  const siege = T.crises.has('under_siege'), famine = T.crises.has('famine');

  // ---- 8a · AN INPUT THE PAGE SAYS IS NOT HAD, on every house that works it
  const lack = goodsNotHad(T), had = goodsHad(T);
  const reasons = T.record?.resourceAnalysis?.imports?.reasons || {};
  const starved = new Map(); // house -> { good, against }
  for (const [, against] of lack) {
    const k = against.good;
    if (had.has(k) && against.how !== 'war' && against.how !== 'cut off') continue; // the page also says the good is made, found or brought in
    const named = new Set(Object.entries(reasons).filter(([g]) => goodOf(g).includes(k)).map(([, r]) => (String(r).match(/^Required by (.+?) but /) || [])[1]).filter(Boolean));
    for (const c of T.cards) {
      if (!CRAFT_CATS.test(c.cat.trim())) continue;
      if (against.only && lc(c.name) !== lc(against.only) && !lc(c.name).startsWith(lc(against.only))) continue;
      const works = named.has(c.name) || (GOODS[k].houses.test(c.name) && !NOT_A_WORKSHOP.test(c.name))
        || (k === 'luxury' && /\b(silks?|spices?|luxury goods)\b/i.test(c.lines.map((l) => l.text).join(' ')) && /\bluxury\b/i.test(c.name));
      if (!works || !bare(c.name)) continue;
      const mild = houseMild(T, c.name);
      if (!starved.has(c.name) && !mild) starved.set(c.name, { good: k, against });
      for (const at of houseSurfaces(T, c.name)) push(mild ? '8a.mild' : '8a.input', at, against, `the page says ${k} is not had (${against.how}); ${c.name}, whose trade cannot go on without it, carries no mark`, { thing: c.name, good: k, how: against.how, recordNamed: named.has(c.name) });
    }
  }

  // ---- 8b · A DEPLETED GROUND, on the house that extracts it and the person who sells it
  // LEFT-KEYS K7 (2), 2026-11-18: the page prints a spent ground in TWO sentences, "Nothing more can be taken from the …" and
  // the house's own "The mine is worked out: its own ground is depleted (…)." (`validationOnPage.js`); four of six newly held
  // towns print only the second (r2r-town-52, r2r-hamlet-3, r2r-metropolis-56, r2r-hamlet-23), where a planted bare mine read 0
  const SPENT_SENTENCE = /Nothing more can be taken from the |^The .+? (?:is|are) worked out: its own ground is depleted\b/;
  const depletedGround = res.some((l) => SPENT_SENTENCE.test(l)) || T.all.some((x) => SPENT_SENTENCE.test(x.text));
  const spentLine = T.all.find((x) => SPENT_SENTENCE.test(x.text));
  const recordHouses = T.record ? liveInstitutions(T.record) : [];
  for (const c of T.cards) {
    if (!EXTRACTS.test(c.name)) continue; // the house that extracts
    const chains = T.chains.filter((ch) => ch.via.includes(c.name) && ch.from.length);
    // RULING BR10 (2), 2026-11-17: a source house of the table is read by the supply rule's own reading (every ground of its
    // own kind the record holds is spent: `ownGroundsOnRecord`), not by the chains the page lists it on; a house outside the
    // table keeps the chains' reading (every chain it works printed depleted)
    const h = recordHouses.find((x) => x && x.name === c.name);
    const grounds = h ? ownGroundsOnRecord(T.record, h) : null;
    if (grounds ? !everyOwnGroundSpent(T.record, h) : (!chains.length || !chains.every((ch) => ch.from.every((f) => /\(depleted\)|\(exhausted\)/.test(f))))) continue;
    if (!bare(c.name) || !depletedGround) continue;
    const ch = chains[0];
    const ownSpent = T.all.find((x) => /^The .+? (?:is|are) worked out: its own ground is depleted\b/.test(x.text) && lc(x.text).includes(lc(c.name))) || spentLine;
    const against = ownSpent ? { tab: ownSpent.tab, i: ownSpent.i, line: ownSpent.text } : ch ? { tab: 'Systems/Economics', i: ch.headIdx, line: `${ch.head} / From ${ch.from.join(' · ')}` } : { tab: 'Systems/Resources', i: -1, line: `the record's grounds of ${c.name}'s kind: ${grounds?.spent.join(', ')} (spent)` };
    starved.set(c.name, { good: 'its ground', against });
    for (const at of houseSurfaces(T, c.name)) push('8b.extract', at, against, `every ground ${c.name} works is printed depleted; its extraction is offered with no mark`, { thing: c.name });
  }
  // the person who sells what the house cannot have
  for (const p of readPeople(T)) {
    if (!/\b(sells?|will sell|will grind|will mix|deals in|rents)\b/i.test(p.deal)) continue;
    // the line's own hedge on the input ("when there is clay to be had"), or a sale from stock already made, is true of a short house
    if (/to be had|what is on the shelves|from (?:the )?stores?\b/i.test(p.deal)) continue;
    let against = starved.get(p.house)?.against, how = starved.get(p.house) ? 'starved' : null;
    if (!against) {
      const c = T.cards.find((x) => x.name === p.house);
      const m = c && c.lines.find((l) => /^Short of [a-z]/.test(l.text) || /^Stopped by the /.test(l.text));
      if (m) { against = { tab: 'Systems/Institutions', i: m.i, line: `${c.head} / ${m.text}` }; how = /^Short/.test(m.text) ? 'short' : 'stopped'; }
    }
    // RULING CM1 (LEFT-MARKS item 2, 2026-11-17): the house's mark is ONE LINE OF ITS OWN on the card, under its house line;
    // a card that prints it covers its person lines (the second check's rule 1: a card's mark covers what its rows say)
    if (!against || MARK_LEAD.test(p.deal) || p.cardMark) continue;
    if (how !== 'starved' && /still give/.test(p.deal)) continue; // "from what the workings still give" is true of a short ground, not of a spent one
    push('8b.person', { tab: 'World/NPCs', i: p.i, line: p.line }, against, `${p.name}'s house (${p.house}) is printed short, stopped or starved of its input; the person's own trade line offers its goods with no word of it`, { thing: p.house, hedged: /\b(when|whenever|while|if) (?:there (?:is|are)|the|it)\b|still give/.test(p.deal) });
  }

  // ---- 8c · A HARVEST OR A FOOD SOURCE SCARCE OR FAILED, on the rows that sell it and the exports that carry it
  const harvestScarce = T.all.find((x) => x.tab === 'Systems/Economics' && /^Harvest (Scarce in the famine|Stopped by the|Curtailed by the)/.test(x.text));
  const failedLine = T.all.find((x) => /^✗ Failed this year · /.test(x.text));
  const failed = failedLine ? lc(failedLine.text.replace(/^✗ Failed this year · /, '')).trim() : null;
  const CROP = /\b(grain|harvest|wheat|barley|rye|oats|millet|rice|maize|dates?|desert grain|flour|produce|vegetables|fruits?|olives|palm sugar)\b/i;
  const FAILED_WORDS = { grain: /\b(grain|flour|wheat|barley)\b/i, livestock: /\b(livestock|cattle|herds?)\b/i, fish: /\b(fish|catch)\b/i };
  const cropAgainst = harvestScarce || (failed === 'grain' ? failedLine : null);
  if (cropAgainst) {
    const ag = { tab: cropAgainst.tab, i: cropAgainst.i, line: cropAgainst.text };
    for (const e of T.services) {
      if (e.marked || !bare(e.house)) continue;
      if (/^Grain at harvest$|^Grain sales?$/i.test(e.title) || /grain sold by the sack|straight from the field at harvest/i.test(e.desc))
        for (const at of houseSurfaces(T, e.house)) push('8c.harvest', at, ag, `the page marks the harvest ${failed === 'grain' ? 'failed' : 'scarce'}; the row that sells grain from the field carries no mark`, { thing: e.house });
    }
    const ex = eco.indexOf('Exports');
    if (ex >= 0 && eco[ex + 1] && !CHIP_MARK.test(eco[ex + 1]) && !MARK_LEAD.test(eco[ex + 1])) {
      const items = eco[ex + 1].split(' · ').filter((s) => CROP.test(s));
      if (items.length) push('8c.export', { tab: 'Systems/Economics', i: ex + 1, line: eco[ex + 1] }, ag, `the page marks the harvest scarce or failed; the export list carries ${items.join(', ')} with no mark`, { thing: 'exports' });
    }
  }
  if (failedLine && FAILED_WORDS[failed]) {
    const ag = { tab: failedLine.tab, i: failedLine.i, line: failedLine.text };
    for (const e of T.services) {
      if (e.marked || !bare(e.house)) continue;
      // a market's own wares (a cooper's barrels "for fish" sell no fish; an auction's "livestock" is a lot, not a stock)
      if (!/\b(market|fair)\b/i.test(e.house)) continue;
      if (FAILED_WORDS[failed].test(e.desc) && /\b(produce|goods|sold|sells?|trade)\b/i.test(e.desc) && !/\b(when|whenever)\b/i.test(e.desc))
        push('8c.failed', { tab: 'Systems/Services', i: e.descIdx, line: e.desc, rowLines: [e.titleRaw, e.desc] }, ag, `the page says the ${failed} failed this year; this unmarked row offers it`, { thing: e.house });
    }
  }
  if (famine) {
    const fam = T.all.find((x) => /^(Harvest Scarce in the famine|✗ Failed this year · )/.test(x.text)) || T.all.find((x) => /famine/i.test(x.text) && x.tab === 'Systems/Economics');
    for (const c of T.cards) {
      const l = c.lines.find((x) => /only runs when grain is in surplus/.test(x.text));
      if (l && bare(c.name) && fam) for (const at of houseSurfaces(T, c.name)) push('8c.surplus', at, { tab: fam.tab, i: fam.i, line: fam.text }, `${c.name} runs only on a grain surplus; the famine leaves none, and its rows carry no mark`, { thing: c.name });
    }
  }

  // ---- 8d · A SIEGE, on the service economy's export rows, the income rows and the transport rows
  if (siege) {
    const reach = T.all.find((x) => /none of them can reach a buyer now/.test(x.text));
    // the page's own export list, read against the record's export label of each service (the siege drops what cannot leave)
    const ex = eco.indexOf('Exports'), exLine = ex >= 0 ? (eco[ex + 1] || '') : '';
    const svcRec = T.record?.economicState?.institutionalServices || [];
    for (const r of readServiceEconomy(T)) {
      if (!r.exportable || !/Operational|Running/.test(r.status)) continue;
      const label = svcRec.find((x) => x.label === r.name)?.exportLabel || '';
      const dropped = ex >= 0 && label && !lc(exLine).includes(lc(label).replace(/\s*\(.*$/, ''));
      if (reach) push('8d.export', { tab: 'Systems/Economics', i: r.i, line: r.line, rowLines: r.rowLines }, { tab: reach.tab, i: reach.i, line: reach.text }, `the page says no export can reach a buyer under the siege; the service economy prints ${r.name} as an operating export`, { thing: r.name });
      else if (dropped) push('8d.export', { tab: 'Systems/Economics', i: r.i, line: r.line, rowLines: r.rowLines }, { tab: 'Systems/Economics', i: ex + 1, line: `Exports / ${exLine}` }, `under the siege the page's own export list leaves out ${label}; the service economy prints ${r.name} as an operating export`, { thing: r.name });
    }
    const road = T.all.find((x) => /Since the siege closed the road|nothing comes in by road|Trade by road, gate and water has stopped|they let nobody through/.test(x.text));
    if (road) {
      const svc = T.tabs['Systems/Services'] || [];
      const catOf = (i) => { for (let k = i; k >= 0; k--) { const m = svc[k].match(/^(.+?) · \(\d+\)/); if (m) return m[1]; } return ''; };
      const tr = T.services.filter((e) => catOf(e.titleIdx) === 'Transportation');
      const stopped = tr.filter((e) => e.marked);
      if (stopped.length) for (const e of tr) {
        if (e.marked || !bare(e.house)) continue;
        if (/\b(barges?|boats?|ships?|vessels?|ferr(?:y|ies)|rafts?)\b/i.test(`${e.title} ${e.house}`)) continue; // precision draw 1: the boatwright's work is no road's
        for (const at of houseSurfaces(T, e.house)) push('8d.transport', at, { tab: 'Systems/Services', i: stopped[0].titleIdx, line: `${stopped[0].titleRaw} / ${stopped[0].desc} | ${road.text}` }, `the siege closes the road and the page stops the other transport rows; ${e.title} carries no mark`, { thing: e.house });
      }
    }
  }
  // income rows: an unmarked income row whose chain of the same name the page prints Impaired, beside marked siblings
  const income = readIncome(T);
  // precision draw 1: outside a siege the row is WEAK (a famine town still works what it holds), and a row that says its
  // iron is imported is true beside a spent local ground
  if (siege && income.some((r) => r.marked)) for (const r of income) {
    if (r.marked || /\bimported\b/i.test(r.line)) continue;
    const ch = T.chains.find((c) => c.name === r.name && /Impaired|Stopped|Failed/.test(c.state) && c.from.length && c.from.every((f) => /\(depleted\)|\(exhausted\)/.test(f)));
    if (ch) push('8d.income', { tab: 'Systems/Economics', i: r.i, line: r.line }, { tab: 'Systems/Economics', i: ch.headIdx, line: `${ch.head} / From ${ch.from.join(' · ')}` }, `the chain ${ch.name} is printed ${ch.state} on depleted ground; its income row carries no mark while the rows beside it do`, { thing: r.name });
  }

  // ---- 8e · A THING STOPPED ON ITS CARD (or named critically impaired), on the other tabs' lists and sentences
  const stoppedCard = (name) => { const c = T.cards.find((x) => x.name === name); return c && (/· Stopped\b/.test(c.head) || /^Stopped by the /.test(c.lines[0]?.text || '')) ? c : null; };
  const def = T.tabs['Systems/Defense'] || [];
  const ops = def.indexOf('Active criminal operations');
  if (ops >= 0) for (let i = ops + 1; i < def.length; i += 2) {
    const name = def[i]; if (!name || /^[A-Z][a-z]+ [a-z]/.test(name) && name.split(' ').length > 4) break;
    const c = T.cards.find((x) => lc(x.name) === lc(name)) ; const sc = c && stoppedCard(c.name);
    if (sc && !MARK_LEAD.test(def[i + 1] || '')) push('8e.crime', { tab: 'Systems/Defense', i, line: name, rowLines: [name, def[i + 1]] }, { tab: 'Systems/Institutions', i: sc.headIdx, line: `${sc.head} / ${sc.lines[0]?.text}` }, `the page stops ${name} on its card; the Defense tab lists it among the active operations with no mark`, { thing: name });
  }
  const svcL = T.tabs['Systems/Services'] || [];
  svcL.forEach((l, i) => {
    const m = l.match(/^.+?'s (.+?) is open but short of supplies, and it can do less than it used to\.$/);
    if (!m) return;
    const c = stoppedCard(m[1]);
    const allStopped = c && c.chips.length > 0 && c.chips.every((x) => /\(stopped/.test(x.raw));
    if (c && allStopped) push('8e.open', { tab: 'Systems/Services', i, line: l }, { tab: 'Systems/Institutions', i: c.headIdx, line: `${c.head} / ${c.lines[0]?.text} / ${c.chipLine}` }, `${m[1]} is stopped on its card and every service of it is stopped; the Services row calls it open and doing less`, { thing: m[1] });
  });
  const outl = T.all.find((x) => x.tab === 'Systems/Outlook' && /^\d+ institutions? critically impaired by (?:the )?[a-z]+: /.test(x.text));
  if (outl) for (const name of outl.text.replace(/^.+?: /, '').replace(/\.$/, '').split(', ')) {
    const c = T.cards.find((x) => x.name === name.trim());
    if (c && bare(c.name)) for (const at of houseSurfaces(T, c.name)) push('8e.outlook', at, { tab: outl.tab, i: outl.i, line: outl.text }, `the Outlook names ${c.name} critically impaired; its rows carry no mark`, { thing: c.name });
  }
  // the service economy prints Operational a service the page stops, or over a house it marks
  const stoppedSvc = new Map();
  for (const c of T.cards) for (const ch of c.chips) if (/\(stopped/.test(ch.raw)) stoppedSvc.set(lc(ch.name), { tab: 'Systems/Institutions', i: c.chipIdx, line: `${c.head} / ${c.chipLine}` });
  for (const r of readServiceEconomy(T)) {
    if (!/Operational|Running/.test(r.status)) continue;
    const hit = [...stoppedSvc].find(([n]) => n.length >= 6 && new RegExp(`\\b${esc(n)}\\b`, 'i').test(r.output));
    if (hit) push('8e.svcOutput', { tab: 'Systems/Economics', i: r.i, line: r.line, rowLines: r.rowLines }, hit[1], `the service economy prints ${r.name} ${r.status} with the output "${r.output}"; the page stops "${hit[0]}"`, { thing: r.name });
  }
  return out;
}
