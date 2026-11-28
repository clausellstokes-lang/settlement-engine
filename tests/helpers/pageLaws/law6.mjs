// BAR6-AUDIT-C · LAW 6 · THE PAGE NAMES NO THING, NO SIZE AND NO TRADE THE TOWN LACKS (it widens LAW 4: law4.mjs).
// A pure detector over one town read by `pageC.mjs :: readTownC` (the dossier tabs and the stored record). Each rule
// fires only where the page itself (or the record behind it) holds the fact the line denies: the `against`.
// CONSERVATIVE FIRST: a house's or a person's name is no claim; a plot hook, a rumour and the history state their own
// facts (the second check's rules) and are read only where a rule says so. Instances:
//   { law: 'L6', rule, town, tab, i, line, against: { tab, line } , why }
import { sentencesOfPage, nameStripper, sentences } from './pageC.mjs';

const OWN_FACT_TABS = /^(Summary\/Plot Hooks|World\/Rumors & News|World\/History|Notes\/)/;
const inst = (rule, town, x, against, why) => ({ law: 'L6', rule, town, tab: x.tab, i: x.i, line: x.s ?? x.line, against, why });
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ---------------------------------------------------------------- 6a SIZE
// thorp and hamlet: no streets, alleys, quarters, districts or neighbourhoods; a village: no districts, quarters or
// neighbourhoods (a village's "streets" is WEAK by the second check, C206170: counted apart as 6a-w).
const SIZE_SMALL = /\b(streets|alleys|alleyways|back streets|side streets|neighbou?rhoods?|districts?|(old|merchant|craft|artisans?'?|poor|temple|foreign|market|eastern|western|northern|southern|lower|upper|river|dock|noble|guild) quarters?|quarters of the (town|city|village|hamlet|thorp|settlement))\b/i;
const SIZE_SMALL_WEAK = /\b(street kitchens|the street|a street|their street|its street|an alley|in an alley)\b/i; // one street, or a culture's foodways word: one loose word (WEAK)
const SIZE_VILLAGE = /\b(neighbou?rhoods?|districts?|(old|merchant|craft|artisans?'?|poor|temple|foreign|market|eastern|western|northern|southern|lower|upper|river|dock|noble|guild) quarters?|quarters of the (village|settlement))\b/i;
const SIZE_VILLAGE_WEAK = /\b(streets|alleys|back streets|side streets)\b/i;
// "sleeping quarters", "living quarters", "headquarters", "from all quarters": no place; "red light district" is a crime pattern's name
const SIZE_SPARED = /\b(reach|reached|take to|took to|onto|into|out on|not in|spill into|spilled into) the streets\b|\b(sleeping|living|crew|guest|winter|staff|servants'?) quarters\b|\bheadquarters\b|\b(all|some|many|other|certain) quarters\b|\bquarters? of an hour\b|\bthree.quarters\b|\bdistrict-wide\b/i;

export function law6a(T, town) {
  const out = [];
  if (T.rank > 2) return out;
  const strip = nameStripper(T);
  const against = { tab: 'record', line: `${T.tier} · population ${T.pop}` };
  for (const x of sentencesOfPage(T)) {
    if (/^(Services · |Connection:|Backs · )/.test(x.s)) continue;
    const s = strip(x.s).replace(SIZE_SPARED, ' ');
    if (T.rank <= 1) {
      const m = SIZE_SMALL.exec(s);
      if (m) out.push(inst('6a-size', town, x, against, `"${m[0]}" in a ${T.tier} of ${T.pop}`));
      else { const w = SIZE_SMALL_WEAK.exec(s); if (w) out.push(inst('6a-w', town, x, against, `"${w[0]}" in a ${T.tier} of ${T.pop} (one street, or a foodways word: WEAK)`)); }
    } else {
      const m = SIZE_VILLAGE.exec(s);
      if (m) out.push(inst('6a-size', town, x, against, `"${m[0]}" in a ${T.tier} of ${T.pop}`));
      else { const w = SIZE_VILLAGE_WEAK.exec(s); if (w) out.push(inst('6a-w', town, x, against, `"${w[0]}" in a ${T.tier} of ${T.pop} (WEAK by the second check: one loose word)`)); }
    }
  }
  return out;
}

// ---------------------------------------------------------------- 6b A GOOD SHOWN IN A SCENE
// The goods a scene can show, each with the houses that make it and the page words that carry it.
export const GOODS = {
  cloth: { word: /\b(bolts of cloth|bales of cloth|cloth hang|bolts of linen|bolts of silk|dyed (strips|cloth))\b/i, maker: /weaver|textile|fuller|dyer|draper|clothier|tailor|cloth|silk|linen/i, trade: /cloth|textile|linen|silk|fabric|garment|dye/i, input: /wool|flax|cotton|silk|fibre|fiber/i },
  wool: { word: /\bbales of wool|\bwool\b/i, maker: /shepherd|sheep|wool|weaver|textile|fuller/i, trade: /wool|fleece|sheep/i },
  pots: { word: /\b(pots|pottery|crockery|earthenware|fired clay)\b/i, maker: /potter|pottery|ceramic|tile|brick|kiln(?!.*charcoal)/i, trade: /pot|ceramic|earthenware|crockery|brick|tile/i, input: /clay/i },
  stone: { word: /\b(chisels? on stone|cut stone|dressed stone|stonecutters?|masons? at work)\b/i, maker: /quarry|mason|stonecutter|stone/i, trade: /stone|masonry|marble|granite|quarried/i, res: /stone|marble|granite/i },
  spice: { word: /\bspices?\b/i, maker: /spice/i, trade: /spice/i },
  herbs: { word: /\b(drying herbs|herbs)\b/i, maker: /herbal|apothecar|physic|healer|herb/i, trade: /herb|remed|medic/i },
  dairy: { word: /\b(butter|cheese|churning|fresh milk|milking)\b/i, maker: /dairy|cattle|cow|stockyard|cheese|herd|shepherd|goat|drover|livestock/i, trade: /dairy|butter|cheese|milk|livestock|cattle|goat/i },
  ironwork: { word: /\b(new ironwork|ironwork|anvils?|forge fires|forges)\b/i, maker: /smith|forge|foundry|smelter|armou?rer|metal/i, trade: /iron|metal|tool|weapon|armou?r|steel/i, input: /iron/i },
  flour: { word: /\b(sacks of flour|flour)\b/i, maker: /mill|baker/i, trade: /flour|grain|bread|baked/i, input: /grain/i },
  timber: { word: /\b(sawn timber|sawn planks|planks|sawdust)\b/i, maker: /sawmill|carpenter|woodcutter|lumber|joiner|cooper|shipwright|wheelwright|woodcarver|forester/i, trade: /timber|plank|lumber|wood/i, res: /timber|wood/i },
  fish: { word: /\b(drying fish|salt fish|fish, still flapping|basket of fish|the catch)\b/i, maker: /fish|fisher|harbou?r|dock|boat/i, trade: /fish|catch/i },
  leather: { word: /\b(hides|tanning|tanners?|leather)\b/i, maker: /tann|leather|saddler|furrier|cobbler/i, trade: /leather|hide|pelt|fur|boot|shoe|saddle/i, input: /hide/i },
};
// a scene of goods LEAVING: the good must be one the page exports
const OUT_SCENE = /\b(road out|carted out|for market abroad)\b/i; // "waiting for the carts" alone may be the army's carts (wartime)
// a scene of goods PILED: plenty that a siege denies for a good the town does not make
const PILED = /\b(piled|stacked|stand open|fill(s)? the|heaped)\b/i;
const NEGATED = /\b(no|not|nobody|none|empty|nearly bare|once|gone|thin|half empty|given up|short|little)\b/i;
const SCENE_TABS = /^(Summary\/Overview|World\/Daily Life)$/;

/** The page's own denial of a good: a Resources gap, a short mark on its maker, the need not brought in, a chain impaired. */
function denialOf(T, g, key) {
  const all = T.all;
  if (g.res) { const d = all.find((x) => x.tab === 'Systems/Resources' && new RegExp(`^No one here works the [a-z ]*(${g.res.source})`, 'i').test(x.text)); if (d) return d; }
  if (g.input) {
    const d = all.find((x) => x.tab === 'Systems/Institutions' && new RegExp(`^Short of [a-z ]*(${g.input.source})`, 'i').test(x.text) && g.maker.test(T.cards.find((c) => c.lines.some((l) => l.i === x.i))?.name || ''));
    if (d) return d;
    const r = all.find((x) => x.tab === 'Systems/Resources' && new RegExp(`^No (${g.input.source})[a-z ]* reaches the`, 'i').test(x.text));
    if (r) return r;
  }
  if (T.needed && g.word.test(T.needed)) return { tab: 'Systems/Economics', text: `Needed, and not brought in: ${T.needed}.` };
  return null;
}

export function law6b(T, town) {
  const out = [];
  const listed = (re) => [...T.produced, ...T.exports].some((e) => re.test(e));
  for (const x of sentencesOfPage(T, SCENE_TABS)) {
    if (/ · /.test(x.s) || NEGATED.test(x.s)) continue;
    for (const [key, g] of Object.entries(GOODS)) {
      const m = g.word.exec(x.s); if (!m) continue;
      const house = T.hasHouse(g.maker);
      const made = listed(g.trade) || !!house;
      const denied = denialOf(T, g, key);
      if (OUT_SCENE.test(x.s) && !T.exports.some((e) => g.trade.test(e))) {
        // every good the scene sends out, read against the exports: none exported STANDS; some exported is one loose word (WEAK)
        const shown = Object.values(GOODS).filter((h) => h.word.test(x.s));
        const some = shown.some((h) => T.exports.some((e) => h.trade.test(e)));
        out.push(inst(some ? '6b-w' : '6b-out', town, x, { tab: 'Systems/Economics', line: `Exports: ${T.exports.join(' · ') || '(none)'}` }, some ? `a scene sends ${m[0]} out; the exports carry only part of what it shows (WEAK)` : `a scene sends ${m[0]} out of the town; the page's exports carry none`));
      } else if (denied) {
        out.push(inst('6b-denied', town, x, { tab: denied.tab, line: denied.text }, `a scene shows ${m[0]}; the page itself says it is not made or not had`));
      } else if (!made && !((key === 'herbs' || key === 'spice') && T.imports.some((e) => g.trade.test(e)) && !T.crises.has('under_siege'))) {
        out.push(inst('6b-nomaker', town, x, { tab: 'record', line: `no house makes ${key}; Produced locally: ${T.produced.join(' · ') || '(none)'}` }, `a scene shows ${m[0]}; no house makes it and the page lists none made or sent out`));
      } else if (!listed(g.trade) && T.crises.has('under_siege') && PILED.test(x.s) && T.imports.some((e) => g.trade.test(e))) {
        out.push(inst('6b-cut', town, x, { tab: 'Systems/Economics', line: `Imports: ${T.imports.filter((e) => g.trade.test(e)).join(' · ')} (under siege)` }, `a scene shows ${m[0]} piled; the town brings it in and the siege has stopped what comes in`));
      } else continue;
      break; // one instance a sentence
    }
  }
  return out;
}

// ---------------------------------------------------------------- 6c AN EXPORT OR AN OUTPUT BEYOND THE HOUSE
const FINE_ARMS = /^(Advanced weapons and armou?r|Master-crafted weapons)$/i;
const FULL_SMITH = /\b(armou?rer|weaponsmith|bladesmith|foundry|smiths'? guild|metalworkers'? guild|specialized metalworker|smelter)\b|^Blacksmiths?\b/i;
const SMALL_SMITH = /\b(part-time|resident smith|village smith|farrier)\b/i;
export const RESOURCE_GOODS = { // a Resources word -> the goods its working makes
  'glass sand': /\b(raw sand|sand|glass)\b/i, sand: /\b(raw sand|sand)\b/i, stone: /\b(quarried stone|cut stone|stone|masonry|building materials)\b/i,
  timber: /\b(charcoal|timber|planks|lumber)\b/i, clay: /\b(pottery|bricks?|tiles?|ceramics?)\b/i, 'iron ore': /\b(iron|ore)\b/i,
  'animal hides': /\b(leather|boots|shoes|saddles?)\b/i, wool: /\b(wool|cloth)\b/i, fish: /\bfish\b/i, grapes: /\b(wine|grapes)\b/i,
};
// the finisher a half-way line names -> the goods only that finisher makes ("no sawmill finishes it": sawn timber)
const FINISHER = [
  [/sawmill/i, /\b(structural timber|planks|lumber|sawn timber)\b/i], [/charcoal burner/i, /\bcharcoal\b/i], [/carpenter|joiner/i, /\b(furniture|joinery|carpentry)\b/i],
  [/leatherworker|cobbler|saddler/i, /\b(leather goods|boots|shoes|saddles?|harness|leather armou?r)\b/i], [/stonemason|mason/i, /\b(cut stone|dressed stone|masonry|sculpture)\b/i],
  [/glass/i, /\b(glass|glassware|windows|bottles)\b/i], [/potter|kiln|brick/i, /\b(pottery|ceramics?|bricks?|tiles?)\b/i], [/weaver|fuller|textile|dyer/i, /\b(cloth|textiles?|linen|garments?)\b/i],
  [/smith|forge|foundry/i, /\b(tools|weapons|armou?r|ironwork)\b/i], [/tanner/i, /\b(leather|tanned hides)\b/i], [/vintner|winery|press/i, /\bwine\b/i], [/mill\b|miller/i, /\bflour\b/i],
];
const goodsFor = (res) => { const k = Object.keys(RESOURCE_GOODS).find((r) => res.toLowerCase().includes(r)); return k ? RESOURCE_GOODS[k] : null; };

export function law6c(T, town) {
  const out = [];
  const eco = T.tabs['Systems/Economics'] || [];
  // 6c-arms: fine arms exported or yielded where the only metal house is a small smith (or the gap says intermediate goods only)
  const metal = T.houses.filter((n) => /smith|forge|foundry|smelter|armou?r|metal/i.test(n));
  const full = metal.some((n) => FULL_SMITH.test(n) && !SMALL_SMITH.test(n));
  const ironGap = (T.record?.resourceAnalysis?.gaps || []).find((g) => /iron/i.test(String(g.chain)) && /intermediate|semi-finished|final goods/i.test(String(g.impact)));
  const gapIntermediate = ironGap ? { tab: 'record', text: `resourceAnalysis.gaps: ${ironGap.chain}: ${ironGap.impact}` } : null;
  if (!full || gapIntermediate) {
    const why = gapIntermediate ? gapIntermediate.text : `the metal houses: ${metal.join(', ') || 'none'}`;
    eco.forEach((line, i) => {
      if (!/ · /.test(line) && !FINE_ARMS.test(line)) return;
      const bad = line.split(' · ').map((s) => s.trim()).filter((s) => FINE_ARMS.test(s));
      if (!bad.length) return;
      const prev = eco[i - 1] || '';
      if (!/^(Exports|Outputs|Produced locally|Normally yields)$/.test(prev)) return;
      out.push(inst('6c-arms', town, { tab: 'Systems/Economics', i, line }, { tab: gapIntermediate ? gapIntermediate.tab : 'record', line: why }, `${bad.join(', ')} ${prev === 'Exports' ? 'exported' : 'yielded'}; no house of the town makes fine arms`));
    });
  }
  // 6c-unsold: the Resources tab says none of a resource leaves; the Exports list carries it
  const resSentences = T.resLines.flatMap((x) => sentences(x.text).map((s) => ({ ...x, text: s })));
  const exportsLine = `Exports: ${T.exports.join(' · ')}`;
  for (const x of resSentences) {
    const m = /^(?:There is (.+?) in .+? worth real money elsewhere, and none of it leaves|None of the (.+?) (?:around|near|in) .+? is sold beyond)/.exec(x.text);
    if (!m) continue;
    const res = (m[1] || m[2]).trim(); const g = goodsFor(res); if (!g) continue;
    const ex = T.exports.filter((e) => g.test(e) && !/\b(glassware|glass goods)\b/i.test(e));
    if (ex.length) out.push(inst('6c-unsold', town, { ...x, line: x.text }, { tab: 'Systems/Economics', line: exportsLine }, `the Resources tab says none of the ${res} leaves; the Exports list carries ${ex.join(', ')}`));
  }
  // 6c-halfway: "Work on the <R> here stops half-way: no <house> finishes it" while the page exports or yields the finished good
  for (const x of resSentences) {
    const m = /^Work on the (.+?) here stops half-way: no (.+?) finishes it\.?$/.exec(x.text);
    if (!m) continue;
    const fin = FINISHER.filter(([re]) => re.test(m[2])).map(([, goods]) => goods);
    if (!fin.length) continue;
    const finished = (s) => fin.some((re) => re.test(s));
    const ex = T.exports.filter(finished);
    const ch = T.chains.filter((c) => c.outputs && !c.yieldsNormally && !c.marked && c.outputs.split(' · ').some(finished));
    if (ex.length || ch.length) out.push(inst('6c-halfway', town, { ...x, line: x.text }, { tab: 'Systems/Economics', line: ex.length ? `Exports: ${ex.join(' · ')}` : `${ch[0].head} · Outputs ${ch[0].outputs}` }, `the page says the ${m[1]} is never finished here; it exports or yields the finished good`));
  }
  // 6c-unworked: "No one here works the <R>" while a chain over <R> prints Running with outputs
  for (const x of resSentences) {
    const m = /^No one here works the (.+?) (?:near|around|at|in) /.exec(x.text);
    if (!m) continue;
    const g = goodsFor(m[1]); if (!g) continue;
    const ch = T.chains.find((c) => /Running|Operational/.test(c.state) && !c.marked && c.outputs && !c.yieldsNormally && c.outputs.split(' · ').some((o) => g.test(o)) && !/glass/i.test(c.outputs.split(' · ').filter((o) => g.test(o)).join(' ')));
    if (ch) out.push(inst('6c-unworked', town, { ...x, line: x.text }, { tab: 'Systems/Economics', line: `${ch.head} · Outputs ${ch.outputs}` }, `the page says no one works the ${m[1]}; a chain over it prints Running and yields its goods`));
  }
  return out;
}

/** 6c-rec · on the RECORD: a small place exporting fine arms with no full smith (the four flags the readers raised). */
export function law6cRecord(record, town) {
  const ex = (record?.economicState?.primaryExports || []).filter((e) => FINE_ARMS.test(String(e)));
  if (!ex.length) return [];
  const names = (record?.institutions || []).map((i) => String(i?.name || ''));
  const full = names.some((n) => FULL_SMITH.test(n) && !SMALL_SMITH.test(n));
  if (full) return [];
  return [{ law: 'L6', rule: '6c-rec', town, tab: 'record', i: -1, line: `economicState.primaryExports: ${ex.join(' · ')}`, against: { tab: 'record', line: `institutions: ${names.filter((n) => /smith|forge|metal/i.test(n)).join(', ') || 'no metal house'}` }, why: `${record.tier} of ${record.population} exports fine arms; no full smith` }];
}

// ---------------------------------------------------------------- 6d AN OFFICE, A FORCE OR A BODY
const COURT_CLAIM = /\b(hall of justice|courthouse|law courts?|before the court|the court sits|tried at the court|the court can try|goes before the court|go before the court|before a magistrate|a court exists)\b/i;
const COURT_HOUSE = /court|magistrat|justic|tribunal|assize|judge|law hall|moot/i;
const PAID_CLAIM = /\b(forces are present and paid|pays wages for its defen[cs]e|paid soldiers|paid (guards|watchmen|garrison)|the guards are paid|well paid)\b/i;
const MEMBERS_CLAIM = /\b(its members|members cannot agree|cannot agree among themselves|divided among its members)\b/i;
// a power's stock blurb sized for another tier
const SMALL_BLURB = /\b(come on market days|a small group of traders|a handful of (families|traders|elders|households)|a few (households|families) who)\b/i;
const BIG_BLURB = /\b(dozens of|hundreds of|district-wide|citywide|city-wide|across the districts|a formal parliament|every quarter of)\b/i;
// a military power's stock blurb asserting a force the defence roster does not keep (BAR5-POWERS (b): C43925, C39734)
const FORCE_BLURB = /\b(Significant military force for this scale|Armed patrol of able-bodied residents|professional soldiers under arms|a standing garrison)\b/i;
const FIELD_FOODWAYS = /\b(intensive plots|terraces|raised fields|paddies|rice fields|grain fields|ploughed fields|tilled (fields|plots))\b/i;
const FARM_HOUSE = /farm|field|paddy|orchard|terrace|plough|vineyard|allotment|market garden/i; // a granary stores, it farms nothing

export function law6d(T, town) {
  const out = [];
  const strip = nameStripper(T);
  const S = sentencesOfPage(T).filter((x) => !OWN_FACT_TABS.test(x.tab) && !/^(Services · |Connection:|Backs · |Needs |Secret: )/.test(x.s));
  // court
  const legal = T.pageHas(/^Legal Infrastructure · /);
  const courtHouse = T.hasHouse(COURT_HOUSE);
  if (!courtHouse && legal && /· (Prison only|None)$/.test(legal.text)) {
    for (const x of S) { const m = COURT_CLAIM.exec(strip(x.s)); if (m && !/^World\//.test(x.tab) && !/\bno (court|courthouse|magistrate)\b|\bwithout (a )?court\b|outside the courts/i.test(x.s)) out.push(inst('6d-court', town, x, { tab: legal.tab, line: legal.text }, `"${m[0]}"; the town keeps no court`)); }
  }
  // paid forces
  const paidForce = T.forces.garrison + T.forces.watch + T.forces.mercenary;
  if (!paidForce) {
    const vol = T.pageHas(/Volunteers with other work to do|nobody paid to defend it|pays nobody to stand guard/);
    for (const x of S) { const m = PAID_CLAIM.exec(x.s); if (m) out.push(inst('6d-paid', town, x, { tab: vol ? vol.tab : 'record', line: vol ? vol.text : `defence roster: no garrison, watch or mercenaries${T.forces.militia ? '; militia only' : ''}` }, `"${m[0]}"; the town keeps no paid force`)); }
  }
  // a force blurb on an empty roster (no garrison, militia, watch or mercenaries)
  if (!(T.forces.garrison + T.forces.militia + T.forces.watch + T.forces.mercenary)) {
    for (const x of S) { const m = x.tab === 'Systems/Power' && FORCE_BLURB.exec(x.s); if (m) out.push(inst('6d-force', town, x, { tab: 'record', line: 'defence roster: no garrison, militia, watch or mercenaries' }, `"${m[0]}"; the town keeps no standing force`)); }
  }
  // one member, many members
  for (const p of T.powers.filter((p) => p.members === 1)) {
    const nameRe = new RegExp(esc(p.name), 'i');
    for (const x of S) if (x.tab === 'Systems/Power' && nameRe.test(x.s) && MEMBERS_CLAIM.test(x.s)) out.push(inst('6d-members', town, x, { tab: 'Systems/Power', line: `${p.name} · 1 member` }, `${p.name} has one member; the line speaks of its members`));
  }
  // a power's blurb sized for another tier
  for (const x of S) {
    if (x.tab !== 'Systems/Power') continue;
    if (T.rank >= 4 && SMALL_BLURB.test(x.s)) out.push(inst('6d-blurb', town, x, { tab: 'record', line: `${T.tier} · population ${T.pop}` }, `a village-sized description in a ${T.tier} of ${T.pop}`));
    else if (T.rank <= 1 && BIG_BLURB.test(strip(x.s))) out.push(inst('6d-blurb', town, x, { tab: 'record', line: `${T.tier} · population ${T.pop}` }, `a city-sized description in a ${T.tier} of ${T.pop}`));
  }
  // foodways crediting fields where nothing is farmed
  if (!T.hasHouse(FARM_HOUSE) && !T.produced.some((p) => /grain|wheat|barley|rice|maize|corn|vegetable|crop|flour/i.test(p))) {
    for (const x of S) { const m = FIELD_FOODWAYS.exec(x.s); if (m && /\b(support|feed|shape supply|food)\b/i.test(x.s) && !/\bno\b|\bnot\b/i.test(x.s)) out.push(inst('6d-fields', town, x, { tab: 'record', line: `no farm house; Produced locally: ${T.produced.join(' · ')}` }, `"${m[0]}" credited with feeding a town that farms no fields`)); }
  }
  return out;
}

// ---------------------------------------------------------------- 6e THE SOVEREIGN WORDS (the chair's ruling LD1)
const SOV = /\b(the lord'?s?|a lord'?s (dues|directives|steward|reeve)|lord'?s (dues|directives|properties)|liege|overlords?|the crown|crown[- ](appointed|officers?|supply|contracts?|authority|requisition|officials?|pays|lands?)|noble oversight|in the name of the crown)\b/; // case-sensitive: "Lord Mayor" is a title
const SOV_SPARED = /\bthe lord or\b|\bor the lord\b|\bcrown or\b|\bor (the )?crown\b|\bno (lord|overlord|liege|crown)\b|\bwithout (a )?(lord|overlord)\b|\b(rival|nearby|neighbou?ring|surrounding|distant|foreign|other) (lords?|crowns?)\b|\bthe lord of\b/i;
export const SOV_FACT = /\b(lords?|lord's|lordship|noble|nobles|nobility|feudal|baron\w*|duke|duchess|duchy|ducal|crown|royal|king|kings|kingdom|queen|prince|princess|manor|appointee|gentry|liege|seigneur\w*|vassal\w*|steward|castellan|earl|jarl|margrav\w*|governor|reeve|imperial|empire|realm)\b/i; // whole words: "making" holds no king

export function law6e(T, town) {
  const out = [];
  const rec = T.record || {}; const ps = rec.powerStructure || {};
  const facts = [ps.governingName, ps.government && JSON.stringify(ps.government), ...(ps.factions || []).map((f) => f.faction), ...T.houses,
    ...(rec.npcs || []).flatMap((n) => [n?.role, n?.title]), JSON.stringify(rec.neighborRelationship || ''), JSON.stringify(rec.history?.founding || '')].join(' | ');
  if (SOV_FACT.test(facts)) return out;
  // a war or an occupation supplies an outside sovereign (the realm's crown requisitions; an occupier rules)
  const outside = T.crises.has('wartime') || T.crises.has('occupied') || T.crises.has('occupation');
  for (const x of sentencesOfPage(T)) {
    if (/^(Connection:|Backs · )/.test(x.s)) continue;
    const m = SOV.exec(x.s); if (!m || SOV_SPARED.test(x.s)) continue;
    if (outside && /crown|overlord|liege/i.test(m[0])) continue;
    out.push(inst('6e-sovereign', town, x, { tab: 'record', line: 'government, powers, houses, people, neighbour and founding name no lord, crown or noble' }, `"${m[0]}"; the town has no such sovereign and no crisis supplies one`));
  }
  return out;
}

export function law6(T, town) {
  return [...law6a(T, town), ...law6b(T, town), ...law6c(T, town), ...law6cRecord(T.record, town), ...law6d(T, town), ...law6e(T, town)];
}
