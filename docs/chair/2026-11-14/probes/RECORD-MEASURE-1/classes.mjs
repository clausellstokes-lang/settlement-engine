// RECORD-MEASURE-1 · the record's own incoherence, as PREDICATES on the 720 census records.
// usage: node classes.mjs <tree> <corpus.ndjson.gz> <out.json>
//   <tree>: the tree that bore the corpus (its factsOf / founder tables are read, never copied)
// Writes <out.json>: { classes: { <id>: { towns: [seed...], byTier, byCrisis, detail: {seed: [...]} } } } and prints
// one row a class (and a sub-row a member predicate). A predicate is a fact of the RECORD (no page text is read here).
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const [TREE, CORPUS, OUT] = process.argv.slice(2);
const load = require('./load.cjs');
const { factsOf } = await import(TREE + '/src/domain/facts/factsOf.js');
const { FOUNDER_KIND } = await import(TREE + '/src/domain/facts/founder.js');

const C = load(CORPUS);
const lc = (x) => String(x ?? '').toLowerCase();
const names = (s) => (s.institutions || []).map((i) => String(i.name));
const has = (s, re) => names(s).some((n) => re.test(n));
const goods = (s) => [...(s.economicState?.localProduction || []), ...(s.economicState?.primaryExports || [])].map(String);
const tierIx = { thorp: 0, hamlet: 1, village: 2, town: 3, city: 4, metropolis: 5 };

// ── (a) FOUNDER vs ORIGIN ────────────────────────────────────────────────────────────────────────────────────
// The Origin row (history.founding.reason) that names WHO began the place, and the founder kinds (founder.js
// FOUNDER_KIND) that can be that who. A row not listed names no agent and is never a conflict here.
const ORIGIN_AGENT = {
  'began as a naval base protecting the coast': ['military', 'crown', 'noble'],
  'was established as a defensive stronghold that attracted dependents': ['military', 'crown', 'noble'],
  'was established as a frontier outpost that outlasted its original purpose': ['military', 'crown', 'noble'],
  'developed at a defensible position on the road': ['military', 'crown', 'noble', 'community'],
  'began as a toll collection point that became a permanent post': ['crown', 'noble', 'military', 'trade'],
  'began as a customs post where trade roads crossed': ['crown', 'noble', 'military', 'trade'],
  'began as a grain storage depot for a larger city that no longer exists': ['crown', 'noble', 'trade'],
  'developed around a sacred grove that attracted religious settlement': ['religious', 'healer', 'community', 'family'],
  'developed where herders gathered seasonally until the gathering became permanent': ['family', 'community'],
  'started as a seasonal camp for deep-water fishers who stopped bothering to go home between seasons': ['family', 'community'],
  'started as a seasonal camp beside a dependable river fishery and became permanent when traders began stopping there': ['family', 'community', 'trade'],
  'began as a mining camp that became permanent when families arrived': ['family', 'community', 'trade'],
  'was built where two rival mining operations agreed to share infrastructure': ['trade'],
  'grew from a logging camp': ['family', 'community', 'trade'],
  'grew from a seasonal fair that became year-round as traders chose to winter here': ['trade', 'community'],
  'developed from a hidden refuge community that emerged after a generation': ['community', 'religious', 'family'],
  'began as a hunting lodge settlement for a noble who died without heirs': ['noble'],
  'grew from a single household that others joined over decades until it became permanent': ['family'],
  'began when a merchant realised the local sheep produced finer wool than anything available on the open market': ['trade'],
  'began when a failed soldier received a land grant and discovered the soil was worth more than any battlefield': ['military'],
  'grew from a fishing village into a maritime hub': ['family', 'community', 'trade'],
};
function founderVsOrigin(s) {
  const f = s.history?.founding || {};
  const kind = FOUNDER_KIND[String(f.foundedBy || '').trim()] || 'other';
  const ok = ORIGIN_AGENT[String(f.reason || '')];
  return ok && !ok.includes(kind) ? [`${kind} founder · ${f.reason}`] : [];
}

// ── (b) WATER where none is ─────────────────────────────────────────────────────────────────────────────────
const WATER_HOUSE = /docks|harbou?r|shipyard|boatyard|fisher'?s landing|river ferry|barge|wharf|airship/i;
const WATER_HOUSE_STRICT = /docks|harbou?r|shipyard|boatyard|fisher'?s landing|river ferry|barge|wharf/i;
const WATER_GOOD = /waterborne|maritime|ship |ship$|ocean-going|barges?|river craft|ship passage|sea salt|salted fish|smoked seafood|fish oil|river fish|freshwater catch|^fish$/i;
function dryWater(s) {
  const w = factsOf(s).water?.kind || 'none';
  if (w !== 'none') return { house: [], good: [] };
  return {
    house: names(s).filter((n) => WATER_HOUSE_STRICT.test(n)),
    good: goods(s).filter((g) => WATER_GOOD.test(g)),
  };
}

// ── (c) MADE or EXPORTED with no house that makes it ────────────────────────────────────────────────────────
// good (regex on localProduction ∪ primaryExports) → the houses (regex on institution names) one of which makes it.
const NOT_ACCESS = (re) => (n) => !/^access to/i.test(n) && re.test(n);
const MAKER = [
  ['gems', /^gems$|gemstone|jewel/i, NOT_ACCESS(/mine|jewel|gem|assay/i)],
  ['iron/metal', /^iron$|^metalwork$|pig iron|iron ingots|iron ore/i, NOT_ACCESS(/mine|smelter|smith|metalwork/i)],
  ['coal', /^coal$/i, NOT_ACCESS(/mine/i)],
  ['glass', /^glass$|glassware|window glass|glass blanks/i, NOT_ACCESS(/glass/i)],
  ['education', /education/i, NOT_ACCESS(/school|academ|universit|college|librar|monaster|friary|scribe|sage|priest|^parish church|cathedral/i)],
  ['religious services', /religious services|pilgrimage/i, NOT_ACCESS(/church|shrine|temple|cathedral|monaster|friary|priest|grove|druid|healer \(divine/i)],
  ['hospitality', /hospitality|meals and drink/i, NOT_ACCESS(/\binns?\b|tavern|alehouse|ale house|caravanserai|waystation|hostel/i)],
  ['flour/bread', /flour|baked goods/i, NOT_ACCESS(/^mills?\b|^mill$|baker|maltster/i)],
  ['sea salt', /sea salt/i, NOT_ACCESS(/salt works/i)],
  ['leather', /leather/i, NOT_ACCESS(/tann/i)],
  ['barrels', /barrels/i, NOT_ACCESS(/cooper/i)],
  ['dyed cloth', /dyed cloth/i, NOT_ACCESS(/dyer/i)],
  ['textiles', /processed textiles|fine textiles|fulled cloth|finished clothing|fine wool cloth/i, NOT_ACCESS(/weaver|textile|fuller|tailor/i)],
  ['peat', /peat/i, NOT_ACCESS(/peat/i)],
  ['ships', /ship construction|ocean-going|river barges|^river craft$/i, NOT_ACCESS(/shipyard|boatyard|shipwright/i)],
  ['arms', /advanced weapons|weapons and armou?r|quality tools and weapons/i, NOT_ACCESS(/smith|metalwork|armou?r|weapon/i)],
  ['bows', /bows and crossbows|arrows/i, NOT_ACCESS(/bowyer|fletcher/i)],
  ['potions', /potions|alchemical/i, NOT_ACCESS(/alchem|apothecar|wizard|herbal/i)],
  ['books', /books and manuscripts|rare texts/i, NOT_ACCESS(/scribe|printing|librar|monaster|sage|chronicler/i)],
  ['coin', /coin minting/i, NOT_ACCESS(/\bmint\b/i)],
  ['milled timber', /milled (timber|lumber)|pine planks|hardwood beams/i, NOT_ACCESS(/sawmill/i)],
  ['stone', /quarried stone/i, NOT_ACCESS(/quarry/i)],
  ['toll', /toll (revenue|income)/i, NOT_ACCESS(/toll|customs|gate|bridge/i)],
];
// a category key or a revenue line printed as a GOOD made here
const NOT_A_GOOD = /^(trade access|maritime access|toll income|market taxes|luxury|strategic control|water)$/i;
// a house too fine for the place: advanced arms where the only smith is part-time, or in a thorp/hamlet
function madeNoHouse(s) {
  const n = names(s), g = goods(s), out = [];
  for (const [id, gre, mre] of MAKER) { const gg = g.filter((x) => gre.test(x)); if (gg.length && !n.some(mre)) out.push(id + '|' + gg.join('|')); }
  return out;
}
const categoryAsGood = (s) => (s.economicState?.localProduction || []).filter((x) => NOT_A_GOOD.test(String(x)));
function tooFine(s) {
  const g = goods(s), out = [];
  if (g.some((x) => /advanced weapons/i.test(x)) && (tierIx[s.tier] <= 1 || (has(s, /part-time/i) && !has(s, /blacksmiths|specialized metal|smith$/i)))) out.push('advanced arms');
  if (g.some((x) => /^luxury$|luxury manufactured/i.test(x)) && tierIx[s.tier] <= 1) out.push('luxury');
  if (g.some((x) => /^education/i.test(x)) && tierIx[s.tier] === 0) out.push('education in a thorp');
  return out;
}

// ── (d) a POWER with no body, a BODY with no power line ─────────────────────────────────────────────────────
function powerNoBody(s) {
  const out = [], F = s.powerStructure?.factions || [], D = s.defenseProfile?.institutions || {};
  const strong = (f) => ['Significant', 'Strong', 'Dominant'].includes(f.powerLabel);
  for (const f of F) {
    const nm = String(f.faction || '');
    if (/military|guard|garrison/i.test(nm) && strong(f) && !(D.garrison || []).length && !(D.watch || []).length) out.push(`power: ${nm} ${f.powerLabel}, no garrison or watch`);
    if (/headman/i.test(nm) && !has(s, /headman/i)) out.push(`power: ${nm}, no headman`);
    if (/thie|crimin|smuggl|underworld/i.test(nm) && strong(f) && !has(s, /thie|smuggl|black market|fence|gang|criminal|assassin|whisper|rookery|front business|contract killer/i)) out.push(`power: ${nm} ${f.powerLabel}, no criminal house`);
    if (/arcane|mage|wizard/i.test(nm) && strong(f) && !has(s, /mage|wizard|arcane|enchant|academy of magic|hedge wizard/i)) out.push(`power: ${nm} ${f.powerLabel}, no arcane house`);
  }
  const hired = D.mercenary || [];
  const merc = names(s).filter((n) => /free company|hired blades|mercenary|hireling hall/i.test(n));
  if (merc.length && !hired.length) out.push(`body: ${merc.join(', ')}, defence hired none`);
  const tg = names(s).find((n) => /thieves' guild \(powerful\)/i.test(n));
  const tf = F.find((f) => /thieves/i.test(String(f.faction)));
  if (tg && tf && /suppressed|minor/i.test(String(tf.powerLabel))) out.push(`body: ${tg}, power ${tf.powerLabel}`);
  return out;
}

// ── (e) a house the size cannot hold ────────────────────────────────────────────────────────────────────────
// a ranged house "(a-b)" whose LOWER bound a, at the declared people a unit needs, exceeds the population
const PER_UNIT = [[/craft guilds|merchant guilds/i, 60], [/parish churches/i, 250], [/taverns/i, 50], [/^mills/i, 100]];
function sizeCannot(s) {
  const out = [];
  for (const n of names(s)) {
    const m = /\((\d+)\s*-\s*(\d+)/.exec(n); if (!m) continue;
    const rule = PER_UNIT.find(([re]) => re.test(n)); if (!rule) continue;
    if (Number(m[1]) * rule[1] > s.population) out.push(`${n} in ${s.population}`);
  }
  return out;
}

// ── (f) the defence word against every line empty; (g) a stability or legitimacy word against its neighbours ─
function defenceWord(s) {
  const D = s.defenseProfile?.institutions || {};
  const empty = ['walls', 'garrison', 'militia', 'watch', 'mercenary'].every((k) => !(D[k] || []).length);
  const word = String(s.defenseProfile?.readiness?.label || '');
  return empty && !/^(undefended|vulnerable)$/i.test(word) ? [`${word} with every defence line empty`] : [];
}
function stabilityWord(s) {
  const p = s.powerStructure || {}, out = [];
  const st = String(p.stability || ''), gov = String(p.governingName || p.government || ''), F = p.factions || [];
  const relig = F.filter((f) => /relig|church|temple|theocra|clerg|faith/i.test(String(f.faction) + ' ' + String(f.category)));
  if (/theocra/i.test(st) && !/theocra|relig|church|temple|clerg|eccles|high priest/i.test(gov) && !relig.some((f) => ['Strong', 'Dominant'].includes(f.powerLabel))) out.push(`stability "${st}" under ${gov}`);
  const leg = String(p.publicLegitimacy?.label || '');
  if (/^stable/i.test(st) && /crisis/i.test(leg)) out.push(`"${st}" beside ${leg}`);
  const D = s.defenseProfile?.institutions || {};
  if (/military presence/i.test(st) && !(D.garrison || []).length) out.push(`"${st}" with no garrison`);
  if (F.filter((f) => f.powerLabel === 'Dominant').length > 1) out.push('two Dominant powers');
  const gh = names(s).find((n) => /mayor and council|democratic assembly|town council/i.test(n));
  if (gh && /theocra|eccles|high priest/i.test(gov)) out.push(`house ${gh} under ${gov}`);
  return out;
}

// ── (h) a house the land cannot have; (i) made and imported at once ─────────────────────────────────────────
const TERRAIN_HOUSE = [[/desert/i, /fish market|fisher|peat cutter|woodcutter|fishing community|marsh/i], [/mountain/i, /fish market/i]];
function landCannot(s) {
  const t = String(s.config?.terrainType || ''), w = factsOf(s).water?.kind || 'none', out = [];
  for (const [tr, hr] of TERRAIN_HOUSE) if (tr.test(t)) out.push(...names(s).filter((n) => hr.test(n)).map((n) => `${n} in ${t}`));
  if (w === 'none') out.push(...names(s).filter((n) => /fish market|fishing community|fishmonger/i.test(n)).map((n) => `${n}, no water`));
  return [...new Set(out)];
}
function madeAndImported(s) {
  const L = new Set((s.economicState?.localProduction || []).map(lc)), out = [];
  for (const i of s.economicState?.primaryImports || []) { const k = lc(i); if (L.has(k) || (k === 'salt' && has(s, /salt works/i))) out.push(i); }
  return out;
}


// ── (j) an office with nobody in it; (k) a gendered title against the holder ────────────────────────────────
function officeEmpty(s) {
  const held = new Set((s.npcs || []).flatMap((n) => [n.institution?.key, n.institution?.family].filter(Boolean).map(String)));
  return (s.institutions || []).filter((i) => i.category === 'Government' && !/^access to/i.test(String(i.name)) && !held.has(String(i.name))).map((i) => String(i.name));
}
function genderedTitle(s) {
  return (s.npcs || []).filter((n) => (n.gender === 'female' && /(?<!wo)man\b|\b(lord|king|brother|father)\b/i.test(String(n.title))) || (n.gender === 'male' && /\b(woman|mistress|lady|queen|sister|mother)\b/i.test(String(n.title)))).map((n) => `${n.gender} ${n.title}`);
}

const CLASSES = {
  a_founder_vs_origin: founderVsOrigin,
  b1_dry_water_house: (s) => dryWater(s).house,
  b2_dry_water_good: (s) => dryWater(s).good,
  c1_made_no_house: madeNoHouse,
  c2_category_as_good: categoryAsGood,
  c3_too_fine_for_size: tooFine,
  d_power_body: powerNoBody,
  e_size_cannot_hold: sizeCannot,
  f_defence_lines_empty: defenceWord,
  g_stability_word: stabilityWord,
  h_land_cannot: landCannot,
  i_made_and_imported: madeAndImported,
  j_office_empty: officeEmpty,
  k_gendered_title: genderedTitle,
};
const res = {};
for (const [id, fn] of Object.entries(CLASSES)) res[id] = { towns: [], byTier: {}, byCrisis: {}, detail: {}, members: {} };
for (const { seed, s } of C) {
  for (const [id, fn] of Object.entries(CLASSES)) {
    const d = fn(s); if (!d.length) continue;
    const r = res[id]; r.towns.push(seed); r.detail[seed] = d;
    r.byTier[s.tier] = (r.byTier[s.tier] || 0) + 1;
    for (const c of s.config?.stressTypes?.length ? s.config.stressTypes : ['calm']) r.byCrisis[c] = (r.byCrisis[c] || 0) + 1;
    for (const m of new Set(d.map((x) => String(x).split(/[ ,:·]/)[0] === 'power' || String(x).startsWith('body') ? String(x).split(',')[0].replace(/ (Significant|Strong|Dominant|Minor|Suppressed)$/, '') : id.startsWith('c1') || id.startsWith('c3') || id.startsWith('c2') || id.startsWith('b') ? String(x).split('|')[0] : String(x).replace(/\d+/g, 'N').split(' in ')[0]))) r.members[m] = (r.members[m] || 0) + 1;
  }
}
fs.writeFileSync(OUT, JSON.stringify({ n: C.length, classes: res }));
const T = Object.keys(tierIx);
console.log(`towns ${C.length}`);
for (const [id, r] of Object.entries(res)) {
  console.log(`${id}\t${r.towns.length}\t` + T.map((t) => `${t[0]}${r.byTier[t] || 0}`).join(' '));
  const top = Object.entries(r.members).sort((a, b) => b[1] - a[1]).slice(0, 12);
  console.log('   ' + top.map(([k, v]) => `${v}:${k.slice(0, 60)}`).join(' | '));
}
