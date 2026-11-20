// BAR8-AUDIT-J · LAW 11 · THE SUPPLY STORY ON EVERY LINE (BRIEF-BAR8-AUDIT, seat J; family F1 of the seventh read).
// The owner's supply rule (BIRTH-1 to BIRTH-3; rulings BR3 to BR9): for each house and its material the seed picks ONE story at
// the birth and writes it into the rows the page stores (the import's word; a gap row; the failed venture's row). THE ONE
// READING is `src/domain/facts/supplyStory.js :: sourceStoryOf` (the source houses) with `src/domain/facts/houseInputAtHand.js`
// (the buyers; the marks through `src/domain/display/crisisStoppedRow.js :: rowShortOf`). The marks, the gap lines and the
// imports agree; THE LINES AROUND THEM DO NOT READ THE STORY. These rules read the page as printed against the story the
// record stores, material by material (`materialStory` below: the record's stored rows only, as BR8 has every view read):
//   11a.imported   "Needed, and not brought in: X" where the record's own story has X bought in (a gap row "runs on
//                  imported X", or the imports list naming X)
//   11a.atWork     "Needed, and not brought in: X" where a house that works X prints at work with no mark
//   11b.fishTitle  the fish market's service NAME alone ("Fresh fish retail") under the same stories, counted apart
//   11b.landOffers a tick of the Resources tab's "What the land offers" naming a material whose every ground is used up
//   11b.<fam>      a line that has material X caught, dug, felled, grown or landed HERE where X's story is used up and
//                  bought in, never there and bought in, or idle (by line kind: scene, service, income, person, other)
//   11c.venture    a line that has the failed venture's material brought in ("must come from elsewhere") where none is
//   11c.idle       the same line where X's story is idle (used up, nothing bought)
//   11d.warIron    the war's iron hook in a town no war is in force in (`houseInputAtHand.js :: warIronHookOutsideWar`):
//                  each line that says the iron is taken or wanting (the mark, a scene, the hook) against the import line
//                  the page prints for iron
//   11d.importShort  a house marked short of a material the town's imports print, in a town no siege shuts (the brief's
//                  fault case; outside the war's hook)
//   11g.gapLine    (the chair's note of 18:05 UTC) the Resources tab's GENERAL gap line "No X reaches the <house>." printed
//                  beside the supply story's own line for the same house ("The <house> is worked out: …", "… is failing: …",
//                  "… stands abandoned …"): two lines for one house and one material; for a source house the general line
//                  also misstates how it works (no ore "reaches" a mine). Writer: `validationOnPage.js :: resourceGapLines`
//   11e.siegeBought  under a siege, a bare house (no mark on card or chip) that makes its good of a material the record has
//                  bought in (its ground used up), while the page says the siege cuts that material off
//   11e.wantBuy    a person's Wants that buys a good at the market that the page says is needed and not brought in
//   11e.stalls     a scene selling a good whose only chain the page prints Impaired or Stopped under a siege, no house
//                  of the town making it
//   11e.available  a card's or a service's line that has a good available or on sale beside the need list naming it
// CONSERVATIVE FIRST: a line that carries its own mark, sits under a marked card, entry or chain, or hedges its own supply
// ("whenever fish can be had", "or the week's salted barrels", "bought in", "from elsewhere") is clear. Pure: reads seat B's
// `readTown` (pageB.mjs) and the earlier H reader's `cardMark` (law8H.mjs), unchanged, and the src leaves (read-only).
import { lineMarked, cardAt, MARK_LEAD, CHIP_MARK } from './pageB.mjs';
import { cardMark, readPersons } from './law8H.mjs';
import { ventureOnPage, impliedGroundsOf, idOfHouse } from '../../../src/domain/facts/supplyStory.js';
import { MATERIAL_OF, ALSO_USES } from '../../../src/domain/facts/houseKinds.js';
import { warIronHookOutsideWar } from '../../../src/domain/facts/houseInputAtHand.js';
import { GOAL_FAMILY_LINES } from '../../../src/data/people/goalFamilies.js';

/** THE WANTS LINES OF A HOUSE'S TRADE DEPENDENCY THAT PRESUME A SUPPLY (`goalFamilies.js :: GOAL_FAMILY_LINES.SUPPLY.dependency`):
 * a supplier, a market, a store laid in; each with `{resource}` captured. */
const DEP_WANTS = (() => {
  const out = [];
  const walk = (v) => { if (typeof v === 'string') { if (v.includes('{resource}') && /supplier|^Buy |^Lay in|steady supply|store of|share in the supply|who controls the supply/.test(v)) out.push(v); } else if (v && typeof v === 'object') { if (typeof v.line === 'string') walk(v.line); else for (const x of Object.values(v)) walk(x); } };
  walk(GOAL_FAMILY_LINES?.SUPPLY?.dependency);
  return out.map((t) => new RegExp(`^Wants ${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{resource\\\}/g, '(.+?)').replace(/\\\{[a-z_]+\\\}/g, '.+?')}$`));
})();

export const LAW = 'L11';
const arr = (x) => (Array.isArray(x) ? x : []);
const lc = (s) => String(s || '').toLowerCase();
const struck = (x) => lc(x).replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();

// ---------------------------------------------------------------- THE STORY OF A MATERIAL, as the record stores it
/** The materials of `houseKinds.js :: MATERIAL_OF` the brief names (fish, timber, ore, stone, clay, salt, wool, hides, grain, peat, herbs). */
export const MATERIALS = ['fish', 'timber', 'ironOre', 'stone', 'clay', 'desertSalt', 'wool', 'hides', 'grain', 'peat', 'herbs', 'livestock'];
/** The grounds that give each material (the record's land keys; `supplyStory.js :: GROUND_YIELD` and the timber and salt kin). */
const GROUNDS = {
  fish: ['fishing_grounds', 'river_fish'], timber: ['managed_forest', 'mountain_timber', 'coastal_timber', 'shipbuilding_timber'],
  ironOre: ['iron_deposits'], stone: ['stone_quarry'], clay: ['river_clay'], desertSalt: ['salt_flats', 'desert_salt'],
  wool: ['grazing_land', 'alpine_pasture'], hides: ['hunting_grounds', 'grazing_land', 'alpine_pasture'], grain: ['grain_fields', 'fertile_floodplain'],
  peat: ['marshlands'], herbs: ['foraging_areas'], livestock: ['grazing_land', 'alpine_pasture'],
};
/** A word of an import (its reason struck) or a gap row's chain that names the material. */
const NAMES = {
  fish: /\bfish\b/, timber: /\b(timber|lumber)\b/, ironOre: /\biron\b/, stone: /\bstone\b/, clay: /\bclay\b/, desertSalt: /^salt\b|\bsalt$/,
  wool: /\bwool\b/, hides: /\bhides?\b/, grain: /\bgrain\b/, peat: /\bpeat\b/, herbs: /\bherbs?\b/, livestock: /\blivestock\b/,
};
const onCoast = (rec) => lc(rec?.config?.tradeRouteAccess) === 'port' || lc(rec?.config?.terrainOverride) === 'coastal';
/**
 * THE STORY OF ONE MATERIAL: 'local' (a live ground of it, or a ground a house implies, there) · 'bought-used' (its grounds
 * used up, the imports or a gap row "runs on imported" bring it) · 'idle' (used up, nothing brings it) · 'bought-never' (no
 * ground, the imports bring it) · 'venture' (the failed venture's material) · 'none' (no ground and no import: the record
 * says nothing; never read as a story here, since a river or a coast may give fish no land row names). On a coast the sea is
 * the salt's brine (BIRTH-1's R5; the controls C41716, C42154).
 */
export function materialStory(rec, fam) {
  const c = rec?.config || {};
  const spent = new Set(arr(c.nearbyResourcesDepleted).map(String));
  const all = new Set([...arr(c.nearbyResources), ...arr(c.nearbyResourcesNative), ...spent].map(String));
  const g = GROUNDS[fam] || [];
  const live = [...all].filter((k) => !spent.has(k) && g.includes(k));
  const used = [...spent].filter((k) => g.includes(k));
  let implied = { states: new Map() };
  try { implied = impliedGroundsOf(rec); } catch { /* a record the leaf cannot read: no implied ground */ }
  for (const [k, st] of implied.states) if (g.includes(k)) (st === 'there' ? live : used).push(k);
  const imports = arr(rec?.economicState?.primaryImports).map(String).filter((x) => NAMES[fam].test(struck(x)));
  const gapsImported = arr(rec?.resourceAnalysis?.gaps).filter((x) => x?.kind === 'imported' && NAMES[fam].test(lc(x.chain)));
  const v = ventureOnPage(rec);
  const ventureFam = v ? (v.family === 'ironOre' || v.family === 'desertSalt' ? v.family : v.family) : null;
  const siege = siegeOf(rec);
  const base = { live, used, imports, gapsImported: gapsImported.map((x) => String(x.impact || '')), venture: v && ventureFam === fam ? v.name : null, siege };
  if (base.venture) return { ...base, story: 'venture' };
  if (fam === 'desertSalt' && onCoast(rec)) return { ...base, story: 'local' };
  if (live.length) return { ...base, story: 'local' };
  const brought = imports.length > 0 || gapsImported.length > 0;
  if (used.length) return { ...base, story: brought ? 'bought-used' : 'idle' };
  return { ...base, story: brought ? 'bought-never' : 'none' };
}
const crisesOf = (rec) => new Set((Array.isArray(rec?.stress) ? rec.stress : rec?.stress ? [rec.stress] : []).map((x) => x?.type).filter(Boolean));
const siegeOf = (rec) => crisesOf(rec).has('under_siege');

// ---------------------------------------------------------------- the page's lines: kinds, hedges, marks
const DOSSIER = /^(Summary|Systems|World|Notes)\//;
/** The line's kind, by its tab and its label (the brief's split: a description, a service row, a scene, an income line, a person's line). */
function kindOf(tab, line, T, i) {
  if (tab === 'Summary/Overview' || tab === 'World/Daily Life') return 'scene';
  if (tab === 'Summary/Plot Hooks') return 'hook';
  if (tab === 'World/NPCs' || tab === 'World/Relationships') return /^(How they deal|Wants|Secret:)/.test(line) ? `person.${line.split(/[ :]/)[0].toLowerCase()}` : 'person';
  if (tab === 'Systems/Services') return 'service';
  if (tab === 'Systems/Institutions') return /^Services · /.test(line) ? 'chip' : 'card';
  if (tab === 'Systems/Economics') {
    const prev = T.tabs[tab][i - 1] || '';
    if (/^\d+%$/.test(prev.trim())) return 'income';
    return 'economics';
  }
  return tab.split('/')[1].toLowerCase();
}
/** A line that hedges its own supply, or says the material is bought, gone or used up: it tells the story itself. */
const HEDGE = /\bwhenever [a-z ]+ can be had\b|\bor the week'?s salted\b|\bbought in\b|\bbrought in\b|\bfrom elsewhere\b|\bimported\b|\bcarted in\b|\bcome in by cart\b|\bworked out\b|\bfished out\b|\bused to\b|\bno longer\b|\bonce (?:was|were|had)\b|\bbefore the\b|\bexhausted\b|\bdepleted\b|\bspent\b|\bcleared\b|\bwhat (?:is|was) left\b|\bwhat little\b|\bfor want of\b/i;

/**
 * THE LOCAL-SOURCE WORDS of each material: the line has the material caught, dug, felled, grown or landed HERE. Each pattern
 * is a claim of local taking or of the taking's own work in full swing, not a mention of the good.
 */
export const LOCAL_SOURCE = {
  fish: /\b(the boats, the catch|fresh fish(?: retail)?$|morning'?s? catch|the day'?s catch|catch of the day|the catch (?:comes?|coming|keeps?)|keep the catch coming|landed (?:here|and sold)|gutting|racks of drying fish|drying fish|fresh(?:ly)? caught|boats? (?:come|bring) in (?:the|their) catch|smell of (?:salt and )?catch)\b/i,
  timber: /\b(felled (?:here|nearby|locally|in the)|felling|logs? (?:come|coming|are dragged|are floated) (?:down|in)|local (?:forest|woodland|wood)s? provides?|cut from the (?:local )?(?:woods?|forests?)|woodcutters? (?:are )?at work|the axes? (?:ring|carry))\b/i,
  ironOre: /\b(ore the workings (?:still )?give|ore (?:is )?(?:dug|mined|hauled up|comes? up)|(?:dug|mined) (?:here|from the (?:local )?(?:hills?|mines?))|from the (?:local )?mines?|the mines? (?:here )?(?:yield|give|produce)s?|miners? (?:come up|go down)|ore carts?)\b/i,
  stone: /\b(quarried (?:here|locally|nearby)|cut from the (?:local )?(?:hill|quarry|quarries)|from the (?:local )?quarr(?:y|ies)|quarry carts?|stone is cut here)\b/i,
  clay: /\b(clay (?:is )?dug|dug from the (?:river ?)?banks?|(?:local|riverbank|river) clay pits?|clay from the (?:river|banks?|pits?))\b/i,
  desertSalt: /\b(salt (?:is )?(?:won|raked|panned|cut) (?:here|from the (?:flats|pans))|the salt (?:flats|pans) (?:here )?(?:yield|give|work)|raking salt|salt from the flats)\b/i,
  wool: /\b(shearing|fleeces? (?:off|from) (?:the|local)|flocks? (?:graze|on the (?:hills?|pasture))|local wool)\b/i,
  hides: /\b(hides? (?:off|from) (?:the )?local|pelts? (?:off|from) the (?:local )?(?:hunt|traps?)|hunters? bring in (?:the )?(?:hides|pelts))\b/i,
  grain: /\b(fields? of (?:grain|wheat|barley|rye|oats)|grain (?:is )?grown (?:here|locally)|local grain|the harvest (?:comes|is brought) in|grown on the (?:town'?s|village'?s|local) fields)\b/i,
  peat: /\b(peat (?:is )?cut (?:here|from)|cutting peat|peat cut from the (?:bog|marsh))\b/i,
  herbs: /\b(herbs? (?:are )?(?:gathered|picked|foraged) (?:here|nearby|locally|in the|from the)|gathered (?:from|in) the (?:hills|woods|marsh)|local herbs)\b/i,
  livestock: /\b(herds? (?:graze|are driven in)|local (?:herds|cattle|livestock)|beasts? (?:raised|bred) here)\b/i,
};
const NOT_BOUGHT_STORIES = new Set(['bought-used', 'bought-never', 'idle', 'venture']);
/** The materials the town's own fields and herds give with no land row (Farmland, Common grazing land): read only where a ground of them is spent. */
const FIELD_FAMS = new Set(['grain', 'livestock']);
/** The Resources tab's ticks ("What the land offers"), by the material each names. */
const OFFERS = [[/^Fishing industry$/, 'fish'], [/^(Timber trade|Woodcraft|Logging)$/, 'timber'], [/^(Stoneworking|Quarrying)$/, 'stone'],
  [/^Salt (production|trade)$/, 'desertSalt'], [/^(Wool production|Sheep herding)$/, 'wool'], [/^(Agriculture|Grain production)$/, 'grain'], [/^Pottery$/, 'clay']];

// ---------------------------------------------------------------- the need list
const NEED_LINE = /^Needed, and not brought in: (.+?)\.?$/;
/** A need item's material (the need family words of `tradeListDisplay.js :: NEED_FAMILY_WORDS`, by material). */
const NEED_FAMILY = [
  ['ironOre', /\biron\b/], ['timber', /\b(timber|lumber)\b/], ['stone', /\bstone\b/], ['clay', /\bclay\b/], ['desertSalt', /^salt\b/],
  ['wool', /\bwool\b/], ['hides', /\b(hides?|leather)\b/], ['grain', /\b(grain|wheat|barley)\b/], ['fish', /\bfish\b/],
  ['herbs', /\bherbs?\b/], ['livestock', /\b(livestock|cattle)\b/], ['luxury', /\bluxury\b/],
];
const needFam = (item) => (NEED_FAMILY.find(([, re]) => re.test(lc(item))) || [])[0] || null;
/** The houses that WORK a material as their input (MATERIAL_OF's buyers and ALSO_USES), never its source house. */
const SOURCE_IDS = new Set(['mine', 'mine_open_cast', 'stone_quarry', 'peat_cutter', 'woodcutter_s_camp', 'shepherd', 'fisher_s_landing', 'fishing_community', 'hunter_s_lodge', 'wildfowler']);
const USERS = (() => {
  const out = {};
  for (const [id, f] of [...Object.entries(MATERIAL_OF), ...Object.entries(ALSO_USES)]) (out[f] ||= new Set()).add(id);
  out.ironOre = new Set([...out.ironOre].filter((id) => id !== 'mine' && id !== 'mine_open_cast'));
  return out;
})();
/** The need list as printed, with the line's place. */
function needList(T) {
  const ls = T.tabs['Systems/Economics'] || [];
  const i = ls.findIndex((l) => NEED_LINE.test(l));
  if (i < 0) return null;
  const items = ls[i].match(NEED_LINE)[1].split(/,\s*(?![^()]*\))/).map((s) => s.trim()).filter(Boolean);
  return { i, line: ls[i], items };
}

/** A line that has a good brought into the town (not out of it). */
const BROUGHT = /\b(?:comes?|are brought|is brought|arrives?|is carted|are carted) in by (?:cart|road|boat|barge|river|wagon)s?\b|\b(?:is|are) carted in\b/i;
/** The nouns of each material, for a brought-in line. */
const LOCAL_NOUN = { fish: /\bfish\b/i, timber: /\b(timber|lumber|logs?)\b/i, ironOre: /\b(iron|ore)\b/i, stone: /\bstone\b/i, clay: /\bclay\b/i, desertSalt: /\bsalt\b(?! ?(?:fish|cod|pork|beef|meat))/i,
  wool: /\bwool\b/i, hides: /\b(hides?|pelts?)\b/i, grain: /\bgrain\b/i, peat: /\bpeat\b/i, herbs: /\bherbs?\b/i, livestock: /\b(livestock|cattle)\b/i };

// ---------------------------------------------------------------- THE ROOTS, read off the record alone (the runner counts them)
/**
 * The record's own disagreements under the page's lines: (i) a gap row "<house> runs on imported X" (`resourceGenerator.js ::
 * gapRowOf`, kind 'imported', written where `houseInputAtHand` reads X as brought) whose X no import of the list names by its
 * material word; (ii) the war's iron hook outside a war (`houseInputAtHand.js :: warIronHookOutsideWar`) beside an iron
 * import; (iii) the failed venture's material on the imports.
 */
export function rootsOf(rec) {
  const out = [];
  const imports = arr(rec?.economicState?.primaryImports).map(String);
  for (const g of arr(rec?.resourceAnalysis?.gaps)) {
    if (g?.kind !== 'imported') continue;
    const fam = needFam(String(g.chain || '')) || (/hides?/.test(lc(g.chain)) ? 'hides' : null);
    if (!fam || !NAMES[fam]) continue;
    if (!imports.some((x) => NAMES[fam].test(struck(x)))) out.push({ root: 'gapImportedNoImport', fam, house: g.institution, gap: g.impact, imports: imports.join(' · ') });
  }
  let warIron = false;
  try { warIron = warIronHookOutsideWar(rec); } catch { warIron = false; }
  if (warIron) out.push({ root: 'warIronOutsideWar', siege: siegeOf(rec), crises: [...crisesOf(rec)].join('+'), ironImports: imports.filter((x) => /\biron\b/i.test(struck(x))).join(' · ') });
  const v = ventureOnPage(rec);
  if (v && NAMES[v.family] && imports.some((x) => NAMES[v.family].test(struck(x)))) out.push({ root: 'ventureImported', fam: v.family, house: v.name });
  return out;
}

// ---------------------------------------------------------------- the rule
/**
 * @param {ReturnType<import('./pageB.mjs').readTown>} T one town read (pageB.mjs :: readTown)
 * @param {string} town the seed
 * @returns {Array<object>} instances { law, rule, town, tab, line, against, why, kind, fam, story, cause }
 */
export function law11(T, town) {
  const rec = T.record || {};
  const out = [];
  const crises = crisesOf(rec);
  const cause = crises.has('under_siege') ? 'siege' : null;
  const stories = Object.fromEntries(MATERIALS.map((f) => [f, materialStory(rec, f)]));
  const spentAll = new Set(arr(rec.config?.nearbyResourcesDepleted).map(String));
  const liveOre = arr(rec.config?.nearbyResources).map(String).some((g) => !spentAll.has(g) && /ore|metal|iron|copper|tin|gold|silver|gem/.test(g));
  const push = (x) => out.push({ law: LAW, town, ...x, rowLines: x.rowLines || [x.line] });
  const bare = (n) => String(n || '').replace(/\s*\([^)]*\)\s*$/, '').trim();
  const cardOfHouse = (name) => T.cards.find((c) => c.name === name) || T.cards.find((c) => bare(c.name) === bare(name)) || null;
  const VENTURE_MARK = /^(Abandoned|Failing): a failed venture\./;
  const houseMarked = (c) => { if (!c) return false; const m = cardMark(c); return m.any || m.impaired || c.marked || c.lines.some((l) => VENTURE_MARK.test(l.text)); };
  // a person's card that carries the house's mark as a line of its own covers every line of the person (by design)
  const personCovered = new Set();
  for (const p of readPersons(T)) if (p.cardMark) for (const l of p.lines) personCovered.add(l.i);
  const liveHouses = arr(rec.institutions).filter((x) => x && x.name && x.status !== 'closed');
  const need = needList(T);
  const headNoun = (x) => lc(x).replace(/\s*\([^)]*\)/g, '').trim();
  const needHas = (noun) => (need ? need.items.find((it) => { const a = headNoun(it), b = headNoun(noun); return a === b || a.startsWith(`${b} `) || b.startsWith(`${a} `); }) : null) || null;
  const importNames = (noun) => arr(rec.economicState?.primaryImports).some((x) => struck(x).includes(headNoun(noun)));
  const storyCause = (st) => (st.story === 'venture' ? 'venture' : st.story === 'idle' ? 'idle' : st.siege && /^bought/.test(st.story) ? 'siege' : /^bought/.test(st.story) ? 'bought' : st.story);

  // 11a: THE NEED LIST AGAINST THE STORY
  if (need) {
    for (const item of need.items) {
      const fam = needFam(item);
      if (!fam || fam === 'luxury') continue;
      const gaps = arr(rec.resourceAnalysis?.gaps).filter((g) => g?.kind === 'imported' && NAMES[fam]?.test(lc(g.chain)));
      const st = stories[fam];
      if (gaps.length) {
        push({ rule: '11a.imported', tab: 'Systems/Economics', line: need.line, item, fam, story: st?.story, cause: cause || 'bought',
          against: { field: 'resourceAnalysis.gaps', value: gaps.map((g) => g.impact).join(' · ') },
          why: `"${item}" needed and not brought in; the record's own gap row says ${gaps.map((g) => `"${g.impact}"`).join(', ')}` });
      }
      // a house that works the material, printed at work with no mark
      // (a need qualified by a use or a grade, "timber (for large vessels)", "mountain timber", is not the house's own
      // material where the land gives the plain one; a chandler's tallow is no beast; the house's material must have no
      // local story)
      if (st?.story === 'local' || /\(for /.test(item)) continue;
      const users = liveHouses.filter((h) => USERS[fam]?.has(idOfHouse(h)) && !SOURCE_IDS.has(idOfHouse(h)) && idOfHouse(h) !== 'chandler');
      for (const h of users) {
        const c = cardOfHouse(h.name);
        if (!c || houseMarked(c)) continue;
        if (gaps.some((g) => g.institution === h.name)) continue; // counted above, by its own gap row
        push({ rule: '11a.atWork', tab: 'Systems/Economics', line: need.line, item, fam, story: st?.story, cause: cause || 'calm',
          against: { tab: 'Systems/Institutions', line: c.head, house: h.name },
          why: `"${item}" needed and not brought in; ${h.name} works it and its card carries no mark` });
      }
    }
  }

  // 11b: A LOCAL-SOURCE LINE UNDER A BOUGHT-IN OR AN IDLE STORY; 11c: A SUPPLY LINE UNDER THE FAILED VENTURE OR AN IDLE STORY
  const elsewhereRe = /\bA good part of the ([a-z ]+?) [A-Z][\w' -]*?'s? work uses must come from elsewhere\b|\b(?:most|much|some|a good part) of (?:its|the) ([a-z ]+?) (?:is|are|comes?) (?:brought|bought|carted) in\b/;
  for (const [tab, ls] of Object.entries(T.tabs)) {
    if (!DOSSIER.test(tab)) continue;
    ls.forEach((line, i) => {
      if (lineMarked(T, tab, i)) return;
      if (tab === 'World/NPCs' && personCovered.has(i)) return;
      for (const fam of MATERIALS) {
        const st = stories[fam];
        if (!NOT_BOUGHT_STORIES.has(st.story)) continue;
        if (FIELD_FAMS.has(fam) && st.story === 'bought-never') continue; // the town's own fields and herds stand on no land row
        const m = line.match(LOCAL_SOURCE[fam]);
        if (!m) continue;
        if (fam === 'ironOre' && liveOre) continue; // "ore", "the mine": a live ground of another ore (gold, silver, copper) keeps the workings at work
        // the sentence that carries the words, hedged or not
        const sent = line.split(/(?<=[.!?])\s+(?=[A-Z"“])/).find((s) => LOCAL_SOURCE[fam].test(s)) || line;
        if (HEDGE.test(sent)) continue;
        if (tab === 'Systems/Institutions') { const c = cardAt(T, i); if (c && houseMarked(c)) continue; }
        // a service's NAME alone ("Fresh fish retail", "Fresh fish": the catalogue's row title and its chip) is counted apart
        // from a line that says the catch is taken here: the row's own description is the line that tells it
        const sub = fam === 'fish' && /^fresh fish/i.test(m[0]) ? 'fishTitle' : fam;
        push({ rule: `11b.${sub}`, tab, line, sentence: sent, fam, story: st.story, cause: storyCause(st), kind: kindOf(tab, line, T, i),
          against: { field: 'story', value: `${st.story}: ${[...st.used.map((g) => `${g} (spent)`), ...st.imports, ...st.gapsImported, st.venture || ''].filter(Boolean).join(' · ')}` },
          why: `"${m[0]}": ${fam} taken here, where the record's story is ${st.story}` });
      }
      const e = line.match(elsewhereRe);
      if (e) {
        const noun = (e[1] || e[2] || '').trim();
        const fam = needFam(noun) || (noun === 'peat' ? 'peat' : null);
        const st = fam && stories[fam];
        const onNeed = needHas(noun);
        if (st && (st.story === 'venture' || st.story === 'idle')) {
          push({ rule: st.story === 'venture' ? '11c.venture' : '11c.idle', tab, line, fam, story: st.story, cause: st.story, kind: kindOf(tab, line, T, i),
            against: { field: st.story === 'venture' ? 'the failed venture' : 'story', value: st.venture || st.used.join(', ') },
            why: `"${noun}" said to come from elsewhere, where ${st.story === 'venture' ? `${st.venture} is a failed venture: none is brought in` : 'it is used up and nothing brings it'}` });
        } else if (onNeed && !importNames(noun) && !(fam && arr(rec.resourceAnalysis?.gaps).some((g) => g?.kind === 'imported' && NAMES[fam]?.test(lc(g.chain))))) {
          push({ rule: '11c.needed', tab, line, fam: fam || noun, story: st?.story || 'needed', cause: cause || 'needed', kind: kindOf(tab, line, T, i),
            against: { tab: 'Systems/Economics', line: need.line }, why: `"${noun}" said to come from elsewhere, where the page says "${onNeed}" is needed and not brought in and no import names it` });
        }
      }
      // a line that has a material brought in by cart or road, where no import names it and its story brings none
      const sentB = line.split(/(?<=[.!?])\s+(?=[A-Z"“])/).find((x) => BROUGHT.test(x));
      if (sentB) {
        for (const fam of MATERIALS) {
          if (!LOCAL_NOUN[fam].test(sentB)) continue;
          const st = stories[fam];
          if (!['none', 'idle', 'venture'].includes(st.story) || st.imports.length) continue;
          if (fam === 'fish' && !/\b(?:fish|herring|cod)\b/i.test(sentB)) continue;
          push({ rule: '11c.noImport', tab, line, sentence: sentB, fam, story: st.story, cause: st.story, kind: kindOf(tab, line, T, i),
            against: { field: 'economicState.primaryImports', value: 'no import names it' }, why: `${fam} brought in by cart or road, where the imports name none and the story is ${st.story}` });
        }
      }
    });
  }

  // 11b.landOffers: a tick of "What the land offers" naming a material whose every ground is used up
  {
    const ls = T.tabs['Systems/Resources'] || [];
    const i = ls.findIndex((l) => l === 'What the land offers');
    if (i >= 0 && ls[i + 1]) {
      for (const tick of ls[i + 1].split('✓').map((x) => x.trim()).filter(Boolean)) {
        const hit = OFFERS.find(([re]) => re.test(tick));
        if (!hit) continue;
        const st = stories[hit[1]];
        if (!(st.story === 'bought-used' || st.story === 'idle')) continue;
        push({ rule: '11b.landOffers', tab: 'Systems/Resources', line: ls[i + 1], sentence: `✓${tick}`, fam: hit[1], story: st.story, cause: storyCause(st), kind: 'tick',
          against: { field: 'config.nearbyResourcesDepleted', value: st.used.join(', ') }, why: `"✓ ${tick}" where every ground of ${hit[1]} is used up (${st.used.join(', ')})` });
      }
    }
  }

  // 11g: THE GENERAL GAP LINE BESIDE THE STORY'S OWN LINE, one house, one material (Resources tab)
  {
    const ls = T.tabs['Systems/Resources'] || [];
    ls.forEach((line, i) => {
      const m = line.match(/^No (.+?) reach(?:es)? (the .+?)\.$/);
      if (!m) return;
      const house = m[2];
      const cap = house.charAt(0).toUpperCase() + house.slice(1);
      // LEFT-KEYS K9 (2026-11-18; BAR8-J-ROWS's hand-back): a plural house tells its story in the plural ("The tanners are
      // failing: …", r2r-town-13 of the 720), so the verb is read in both numbers
      const own = ls.slice(i + 1, i + 3).find((l) => l.startsWith(`${cap} is worked out:`) || l.startsWith(`${cap} are worked out:`) || l.startsWith(`${cap} is failing:`) || l.startsWith(`${cap} are failing:`) || l.startsWith(`${cap} stands abandoned`) || l.startsWith(`${cap} stand abandoned`));
      if (!own) return;
      const story = /(?:is|are) worked out/.test(own) ? 'workedOut' : 'venture';
      push({ rule: '11g.gapLine', tab: 'Systems/Resources', line, fam: m[1], house: house.replace(/^the /, ''), story, cause: story, kind: house.replace(/^the /, ''),
        rowLines: [line, own], against: { tab: 'Systems/Resources', line: own }, why: `"${line}" beside "${own}": one house, one material, two lines` });
    });
  }

  // 11d: THE WAR'S IRON IN A TOWN THAT IS NOT AT WAR, and a house short of a material the imports print
  const ironImports = arr(rec.economicState?.primaryImports).map(String).filter((x) => /\biron\b/i.test(struck(x)));
  const ironImportLine = (T.tabs['Systems/Economics'] || []).find((l) => ironImports.some((x) => l.includes(x))) || null;
  let warIron = false;
  try { warIron = warIronHookOutsideWar(rec) && !siegeOf(rec); } catch { warIron = false; }
  if (warIron && ironImports.length) {
    const IRON_WANT = /\bShort of iron\b|\bfor want of iron\b|\bWar has taken the iron\b|\bnothing to mend tools with\b|\bno iron\b|\bforges? (?:are |stand )?(?:quiet|cold|idle)\b|\(short\)/;
    const ironHouses = new Set(liveHouses.filter((h) => MATERIAL_OF[idOfHouse(h)] === 'ironOre').map((h) => h.name));
    for (const [tab, ls] of Object.entries(T.tabs)) {
      if (!DOSSIER.test(tab)) continue;
      ls.forEach((line, i) => {
        const m = line.match(IRON_WANT);
        if (!m) return;
        if (m[0] === '(short)') { const c = cardAt(T, i); if (tab !== 'Systems/Institutions' || !c || !ironHouses.has(c.name)) return; }
        if (/Short of iron/.test(m[0]) && tab === 'Systems/Institutions') { const c = cardAt(T, i); if (!c || !ironHouses.has(c.name)) return; }
        push({ rule: '11d.warIron', tab, line, fam: 'ironOre', story: stories.ironOre.story, cause: 'warHook', kind: kindOf(tab, line, T, i), what: m[0],
          against: { tab: 'Systems/Economics', line: ironImportLine || ironImports.join(' · ') },
          why: `"${m[0]}" in a town no war is in force in (${[...crises].join('+') || 'calm'}), where the imports print ${ironImports.map((x) => `"${x}"`).join(', ')}` });
      });
    }
  }
  if (!siegeOf(rec)) {
    for (const c of T.cards) {
      const m = cardMark(c);
      if (!m.short) continue;
      const fam = needFam(m.short) || (/\biron\b/.test(m.short) ? 'ironOre' : null);
      if (!fam || fam === 'luxury') continue;
      const imp = arr(rec.economicState?.primaryImports).map(String).filter((x) => NAMES[fam]?.test(struck(x)));
      if (!imp.length) continue;
      if (fam === 'ironOre' && warIron) continue; // the war's hook, counted above
      const id = idOfHouse({ name: c.name });
      if (SOURCE_IDS.has(id)) continue; // a taker cannot buy in what it takes (by design)
      push({ rule: '11d.importShort', tab: 'Systems/Institutions', line: `${c.head} / Short of ${m.short}.`, fam, story: stories[fam]?.story, cause: 'calm', kind: 'card',
        against: { field: 'economicState.primaryImports', value: imp.join(' · ') },
        why: `${c.name} marked short of ${m.short}, in a town no siege shuts, whose imports print ${imp.map((x) => `"${x}"`).join(', ')}` });
    }
  }

  // 11e: A GOOD ON OFFER THAT THE STORY DENIES
  // (e1) under a siege a bare house that makes its good of a material bought in, its ground used up
  if (siegeOf(rec)) {
    const BULLION = /\b(precious metals?|gold|silver|bullion)\b/i;
    const preciousBought = arr(rec.economicState?.primaryImports).some((x) => BULLION.test(struck(x)));
    const preciousSpent = arr(rec.config?.nearbyResourcesDepleted).some((g) => /precious|gold|silver/.test(String(g)));
    const MAKERS = [[/\bmint\b/i, 'precious', preciousBought && preciousSpent], [/\b(goldsmiths?|silversmiths?|jewel(?:l)?ers?)\b/i, 'precious', preciousBought && preciousSpent]];
    for (const h of liveHouses) {
      const id = idOfHouse(h);
      const fam = MATERIAL_OF[id] || ALSO_USES[id];
      if (!fam || SOURCE_IDS.has(id) || FIELD_FAMS.has(fam) || fam === 'fish' || !stories[fam] || !/^bought/.test(stories[fam].story)) continue;
      const c = cardOfHouse(h.name);
      if (!c || houseMarked(c) || c.chips.some((x) => x.marked)) continue;
      push({ rule: '11e.siegeBought', tab: 'Systems/Institutions', line: c.chipLine || c.head, fam, story: stories[fam].story, cause: 'siege', kind: c.chipLine ? 'chip' : 'card',
        rowLines: [c.chipLine || c.head, c.head], against: { field: 'economicState.primaryImports', value: stories[fam].imports.join(' · ') || stories[fam].gapsImported.join(' · ') },
        why: `${h.name} bare under a siege; its ${fam} is bought in (${stories[fam].imports.join(', ') || stories[fam].gapsImported.join(', ')}) and the siege cuts the imports` });
    }
    for (const c of T.cards) {
      for (const [re, fam, on] of MAKERS) {
        if (!on || !re.test(c.name) || houseMarked(c)) continue;
        if (c.chips.some((x) => x.marked)) continue;
        const cut = T.all.find((x) => x.tab === 'Systems/Economics' && /which the siege has cut off/.test(x.text));
        push({ rule: '11e.siegeBought', tab: 'Systems/Institutions', line: c.chipLine || c.head, fam, story: 'bought-used', cause: 'siege', kind: c.chipLine ? 'chip' : 'card',
          rowLines: [c.chipLine || c.head, c.head], against: { tab: 'Systems/Economics', line: cut?.text || 'imports: precious metals (veins exhausted)' },
          why: `${c.name} bare under a siege; its ${fam} is bought in (its veins exhausted) and the page says the siege cuts it off` });
      }
    }
  }
  const needItems = need ? need.items.map((x) => x.replace(/\s*\([^)]*\)/g, '').trim()) : [];
  const needWord = (good) => needItems.find((it) => { const a = lc(good).trim(), b = lc(it).replace(/ for .*$/, '').trim(); return a === b || a.replace(/s$/, '') === b.replace(/s$/, ''); });
  // (e2) a person's Wants that presumes a supply (a supplier, the market, a store laid in) of a good the page says is
  // needed and not brought in, or whose material's story is idle or the failed venture
  for (const [tab, ls] of Object.entries(T.tabs)) {
    if (tab !== 'World/NPCs') continue;
    ls.forEach((line, i) => {
      if (personCovered.has(i)) return;
      const goods = [];
      const m = line.match(/^Wants (?:Buy|Corner|Stock up on) ([a-z, ]+?)(?: and ([a-z]+))? at the market\b/i);
      if (m) goods.push(...`${m[1]}${m[2] ? `, ${m[2]}` : ''}`.split(/,\s*|\s+and\s+/).map((x) => x.trim()).filter(Boolean));
      else for (const re of DEP_WANTS) { const d = line.match(re); if (d) { goods.push(...d[1].split(/,\s*|\s+and\s+/).map((x) => x.trim()).filter(Boolean)); break; } }
      for (const g of goods) {
        const hit = needWord(g);
        const fam = needFam(g);
        const st = fam && stories[fam];
        if (!hit && !(st && (st.story === 'idle' || st.story === 'venture'))) continue;
        push({ rule: '11e.wantBuy', tab, line, good: g, fam: fam || g, story: st?.story || 'needed', cause: cause || 'calm', kind: 'person.wants',
          against: hit ? { tab: 'Systems/Economics', line: need.line } : { field: 'story', value: `${st.story}: ${st.venture || st.used.join(', ')}` },
          why: hit ? `presumes a supply of "${g}"; the page says "${hit}" is needed and not brought in` : `presumes a supply of "${g}", whose story is ${st.story}` });
      }
    });
  }
  // (e3) a scene that has stalls selling a good whose only chain the page prints Impaired or Stopped, under a siege
  if (siegeOf(rec)) {
    const STALL_GOODS = [[/\breagents?\b/i, /\b(Alchemy|Reagent)/i, /\b(alchemist|apothecar|wizard|reagent)/i]];
    for (const x of T.all.filter((y) => y.tab === 'Summary/Overview' || y.tab === 'World/Daily Life')) {
      for (const [goodRe, chainRe, houseRe] of STALL_GOODS) {
        const sent = x.text.split(/(?<=[.!?])\s+(?=[A-Z"“])/).find((s) => /\b(stalls?|sell|sold)\b/i.test(s) && goodRe.test(s));
        if (!sent) continue;
        const chains = T.chains.filter((ch) => chainRe.test(ch.name));
        if (!chains.length || !chains.every((ch) => ch.marked)) continue;
        const makers = T.cards.filter((c) => houseRe.test(c.name) && !houseMarked(c));
        if (makers.length) continue;
        push({ rule: '11e.stalls', tab: x.tab, line: x.text, sentence: sent, fam: 'reagents', story: 'siege', cause: 'siege', kind: 'scene',
          against: { tab: 'Systems/Economics', line: chains.map((ch) => ch.head).join(' / ') }, why: `stalls sell a good whose only chain is ${chains.map((ch) => ch.state).join(', ')} under the siege, and no unmarked house makes it` });
      }
    }
  }
  // (e4) a card's line, a chip or a Services row that offers a good the need list names (its head noun), its house bare
  if (need) {
    const ADJ = new Set(['quality', 'fine', 'high', 'raw', 'rare', 'good', 'goods', 'major', 'construction', 'materials', 'and', 'for', 'meat', 'draft', 'other', 'basic', 'bulk', 'mineral', 'textiles', 'cloth', 'preserved', 'winter']);
    const goods = need.items.map((it) => ({ it, nouns: headNoun(it).replace(/ for .*$/, '').split(/[\s,]+/).filter((w) => w.length > 3 && !ADJ.has(w)) })).filter((g) => g.nouns.length);
    const stem = (w) => (w.endsWith('y') ? `${w.slice(0, -1)}(?:y|ies)` : `${w.replace(/s$/, '')}s?`);
    const nounRe = (g) => new RegExp(`\\b(?:${g.nouns.map(stem).join('|')})\\b`, 'i');
    const OFFER = /\b(available|for sale|on sale|sold|sells?|selling|auctions?|offers?|stocks?|trades? in|dealers? in|to be had|the trade in)\b/i;
    for (const c of T.cards) {
      if (houseMarked(c)) continue;
      const lines = [...c.lines.map((l) => ({ text: l.text, chip: false })), ...(c.chipLine ? [{ text: c.chipLine, chip: true }] : [])];
      for (const l of lines) {
        for (const g of goods) {
          const re = nounRe(g);
          if (!re.test(l.text)) continue;
          const sent = l.chip ? c.chips.find((x) => re.test(x.name) && !x.marked)?.raw : l.text.split(/(?<=[.!?])\s+(?=[A-Z"“])/).find((x) => re.test(x) && OFFER.test(x));
          if (!sent) continue;
          push({ rule: '11e.offer', tab: 'Systems/Institutions', line: l.text, sentence: sent, good: g.it, fam: needFam(g.it) || g.nouns[0], story: 'needed', cause: cause || 'calm', kind: l.chip ? 'chip' : 'card',
            rowLines: [l.text, sent], against: { tab: 'Systems/Economics', line: need.line }, why: `${c.name} offers "${sent}" beside "${g.it}" needed and not brought in` });
        }
      }
    }
  }
  return out;
}
