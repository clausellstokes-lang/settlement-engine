// BAR7-AUDIT-I · LAW 9 WIDENED · a state the page's own words deny (rules 9g, 9h, 9i and 9a again).
// The sixth read (REVIEW-BAR-6, 2026-11-17) found sentences that LAW 9's rules (`law9.mjs`, BAR6-AUDIT-E) do not read:
// a plenty, margin or level word beside the state the page prints (9g), a list's empty line beside the list's own
// facts (9h), crime's turf-war prose beside the page's safety word (9i), and "the garrison keeps order" beside
// "Law & order · Collapsed" (9a.order). Each rule is drawn from the second check's own control rows
// (`SECOND-CHECK.final51.json`: STANDS are positives, EXPLAINED negatives) and names the page line (or the record field)
// it reads as the state (`against`). A pure function over one town read by `pageB.mjs :: readTown`; returns instances
// `{ law, rule, town, tab, line, sentence, against: { tab, line }, why, status, cause }`. `status` is 'apart' for a
// reading the second check would call WEAK or EXPLAINED (reported, never counted). Pure; no I/O; changes nothing.
import { sentences } from './pageB.mjs';
import { stateWords } from './law9.mjs';

const LAW = 'L9';
const DOSSIER = /^(Summary|Systems|World|Notes)\//;

/** every dossier sentence matching re: [{ tab, i, text, sentence }] */
function findAll(T, re, tabs = DOSSIER) {
  const out = [];
  for (const x of T.all) {
    if (!tabs.test(x.tab) || !re.test(x.text)) continue;
    for (const s of sentences(x.text)) if (re.test(s)) out.push({ ...x, sentence: s });
  }
  return out;
}
const find = (T, re, tabs) => findAll(T, re, tabs)[0] || null;

/** the food word the page prints (Foundations "Food · X", or a "Food Security · X" row) */
function foodWordOf(T) {
  const x = find(T, /^(?:Food|Food Security) · ([A-Z][\w -]+)$/);
  return x ? { ...x, word: x.text.split(' · ')[1].trim() } : null;
}
const FOOD_LOW = /^(Pressured|Strained|Deficit|Import-Dependent|Import dependent|Critical|Famine|Starving|Precarious)\b/;

/** months of stores the page prints ("about a month and a half in household stores", "about 5 months in store") */
const NUM = { a: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
export function storesMonths(T) {
  const x = find(T, /\babout (?:a few weeks|[\w.]+(?: and a half)? (?:months?|weeks?))(?: and a half)? (?:in household stores|in store|of stores|in the granary)\b/, /^Systems\/Economics$/)
    || find(T, /\babout (?:a few weeks|[\w.]+(?: and a half)? (?:months?|weeks?))(?: and a half)? (?:in household stores|in store|of stores|in the granary)\b/);
  if (!x) return null;
  const m = /\babout (a few weeks|([\w.]+)( and a half)? (months?|weeks?))( and a half)?/.exec(x.sentence);
  if (!m) return null;
  if (m[1] === 'a few weeks') return { ...x, months: 0.5 };
  const n = NUM[m[2]] ?? Number(m[2]);
  if (!Number.isFinite(n)) return null;
  const half = m[3] || m[5] ? 0.5 : 0;
  return { ...x, months: /^week/.test(m[4]) ? (n + half) / 4.3 : n + half };
}

/** the page's own lines that say the food falls short */
const FOOD_SHORT = /\b(falls (?:a little |well )?short of the food it needs|Most households go short|hunger is already here|Short: [\d,]+ lbs\/day|go short of food)\b/;

// ---------------------------------------------------------------- 9g · plenty, margin and level words
// (a) past subsistence (C18905), against the economy's own label
const PAST_SUBSIST = /\b(plainly past subsistence|well past subsistence|past subsistence)\b/;
const SUBSIST_LABEL = /^(Subsistence economy|Subsistence — survival economy)$/;
// (b) stores beyond the season, against the stores the page prints (a season is three months)
const STORES_DEEP = /\b(the stores are more than the season needs|reach past the turn of the year with room to spare|The stores go into \w+ deep|its stores are deep|reserves deep enough to ride out)\b/;
// (c) food enough for a hard year (C41011), against the food word or the page's own shortfall line
const FOOD_PLENTY = /\b(more than enough to get through a hard year|keeps itself supplied|eats well below what it raises|grows more food than it eats|With food to spare|reach past the turn of the year with room to spare)\b/;
const FOOD_SOFT = /\b(nobody looks hungry|eats well enough and does not talk about it|nobody goes hungry|never goes hungry)\b/;
// (d) the money margin (C15153; negatives C12371 C27960), against the page's own lines that the purse is thin
const MONEY_UP = /\b(closes every year ahead|there are reserves behind it|ends each year with money to spare|has reserves deep enough to ride out|With a little left over each year|pays its own way and has a little in hand|treasury takes in a little more than it pays out)\b/;
const MONEY_DOWN = /\b(It is also running thin|signed a requisition order [^.]*that it cannot afford|chronically underfunded\)|holds no reserve at all|treasury borrowed [^.]*every year since|cannot pay (?:its|the) (?:garrison|watch|soldiers))\b/;
const MONEY_WAR = /\bThe war takes most of the money\b/;
const MONEY_RECONCILED = /\b(had money laid by (?:before|when))\b/;
// (e) the first food source (C41850), against the page's own source line
const SOURCE_FIRST = /\b(?:own food )?comes first of all from its (\w+)/;
const SOURCE_LINE = /\bIts own (fields|herds|flocks|nets|boats|waters|gardens|orchards|pastures) give it (\w+), and beyond that its food is (\w+)/;
const SRC = (w) => (/^(fish|fishing|nets|boats|waters)$/.test(w) ? 'fish' : /^(fields|farming|harvest|grain|crops|gardens|orchards)$/.test(w) ? 'fields'
  : /^(herds|flocks|pastures|grazing|livestock|herding)$/.test(w) ? 'herds' : /^(hunting|game)$/.test(w) ? 'game' : /^(foraging|gathering)$/.test(w) ? 'forage' : w);

function rules9g(T, W) {
  const out = [];
  const crisis = T.crises.size > 0;
  // (a)
  const lab = find(T, SUBSIST_LABEL, /^Systems\/Economics$/);
  if (lab) for (const h of findAll(T, PAST_SUBSIST)) out.push({ rule: '9g.subsistence', at: h, against: lab, why: `the Economics tab prints "${lab.text}"; this line says the place is past subsistence` });
  // (b)
  const st = storesMonths(T);
  // PRECISION (720): two and a half months beside "more than the season needs" (1 of 9) is a matter of degree: apart
  if (st && st.months < 3) for (const h of findAll(T, STORES_DEEP)) out.push({ rule: st.months <= 2 ? '9g.stores' : '9g.stores-near', ...(st.months <= 2 ? {} : { status: 'apart' }), at: h, against: st, why: `the page prints "${st.sentence}" (${st.months} months: less than a season); this line says the stores are more than the season needs` });
  // (c)
  const fw = foodWordOf(T);
  const short = find(T, FOOD_SHORT);
  const ag = short || (fw && FOOD_LOW.test(fw.word) ? fw : null);
  if (ag) {
    for (const h of findAll(T, FOOD_PLENTY)) out.push({ rule: '9g.food', at: h, against: ag, why: `the page prints "${ag.sentence || ag.text}"; this line says the place has food to spare` });
    for (const h of findAll(T, FOOD_SOFT)) out.push({ rule: '9g.food-soft', status: 'apart', at: h, against: ag, why: `the page prints "${ag.sentence || ag.text}"; this softer line says nobody goes hungry (a matter of degree: apart)` });
  }
  // (d)
  const ups = findAll(T, MONEY_UP).filter((h) => !/^Embattled region/.test(h.sentence));
  if (ups.length) {
    const down = find(T, MONEY_DOWN);
    const war = find(T, MONEY_WAR);
    const reconciled = find(T, MONEY_RECONCILED);
    // THE MILD MARGIN ("With a little left over each year", "takes in a little more than it pays out") beside a war: the wide
    // read's C61967 was EXPLAINED by the page's own war-time prosperity word ("Comfortable before the war; Moderate while it
    // lasts"): apart. The strong margin ("closes every year ahead", "reserves behind it") stands beside a seat that cannot
    // afford its requisition (C15153).
    const MILD = /\b(With a little left over each year|treasury takes in a little more than it pays out|pays its own way and has a little in hand)\b/;
    for (const h of ups) {
      if (down && MILD.test(h.sentence)) out.push({ rule: '9g.margin-mild', status: 'apart', at: h, against: down, why: `the page prints "${down.sentence}"; this line says a little is left over (mild: the wide read's C61967 reading, apart)` });
      else if (down) out.push({ rule: '9g.margin', at: h, against: down, why: `the page prints "${down.sentence}"; this line says the town's purse runs ahead with reserves` });
      else if (war) out.push({ rule: '9g.margin-war', status: 'apart', at: h, against: war, why: `the page prints "${war.sentence}"${reconciled ? ` and "${reconciled.sentence}" (money laid by: reconciled)` : ''}; this line says the purse runs ahead (apart: the war line alone does not deny a margin)` });
    }
  }
  // (e)
  const src = find(T, SOURCE_LINE);
  if (src) {
    const m = SOURCE_LINE.exec(src.sentence);
    for (const h of findAll(T, SOURCE_FIRST)) {
      const first = SRC(SOURCE_FIRST.exec(h.sentence)[1]);
      if (first !== SRC(m[1])) out.push({ rule: '9g.source', at: h, against: src, why: `the page prints "${src.sentence}" (its ${m[1]} first); this line says its food comes first of all from its ${SOURCE_FIRST.exec(h.sentence)[1]}` });
    }
  }
  void crisis;
  return out;
}

// ---------------------------------------------------------------- 9h · the empty-list lines
const SOLD_OUTWARD = /\b(had (?:several|some|a few) trades selling outward|selling outward before the|none of them can reach a buyer now)\b/;
function rules9h(T) {
  const out = [];
  const eco = T.tabs['Systems/Economics'] || [];
  const rec = T.record?.economicState || {};
  const recEx = (rec.primaryExports || []).filter((x) => typeof x === 'string' && x.trim());
  // (a) "No significant exports." (C20830; the wide read's negative C93420)
  eco.forEach((text, i) => {
    if (text !== 'No significant exports.') return;
    const at = { tab: 'Systems/Economics', i, text, sentence: text };
    const sold = find(T, SOLD_OUTWARD);
    const siege = T.crises.has('under_siege');
    // THE LEGEND IS WHAT DIFFERS FROM THE WIDE READ (its negative C93420, the same two lines under a siege, EXPLAINED as "the
    // present" against "before the siege"): since BAR6 the tab says its rows are of ordinary times and marks a row the siege
    // touches, so an unmarked "No significant exports." now reads as the ordinary times the next line denies. Without the
    // legend the pair is the wide read's reading: apart.
    const legend = eco.some((l) => /^The descriptions here are of ordinary times\b/.test(l));
    if (sold) out.push({ rule: legend ? '9h.no-exports' : '9h.no-exports-nolegend', status: legend ? 'count' : 'apart', cause: siege ? 'crisis' : 'other', at, against: sold, why: `the page itself prints "${sold.sentence}"; the export row says there are none, with no mark${legend ? ', on a tab whose legend says its rows are of ordinary times' : ' (no legend: the wide read\'s reading, apart)'}` });
    // the record's own exports the column drops (`tradeListDisplay.js :: tradeListsAsPrinted`): the wide read's C211337 and
    // C217617 STOOD on raw wool a famine village still exports by its record; transit alone is not an export on this page
    // (the wide read's bar0-village-calm-rand-31): apart
    else if (recEx.length) {
      const made = recEx.filter((x) => !/^transit trade$/i.test(x.trim()));
      out.push({ rule: made.length ? '9h.no-exports-record' : '9h.no-exports-transit', status: made.length ? 'count' : 'apart', cause: T.crises.size ? 'crisis' : 'other', at,
        against: { tab: 'record', text: `economicState.primaryExports: ${recEx.slice(0, 4).join(' · ')}` },
        why: made.length ? `the record exports ${made.slice(0, 3).join(', ')}; the column prints none and no mark${T.crises.size ? ` (under ${[...T.crises].join(', ')}: the crisis's mark is what the row lacks)` : ''}` : 'the record exports transit trade only; the page treats transit as no export (apart)' });
    }
  });
  // (b) the entrepot line beside "No recorded imports." (C32912)
  const noImp = eco.findIndex((l) => l === 'No recorded imports.');
  if (noImp >= 0) for (const h of findAll(T, /\bsells on goods it never made\b/)) {
    out.push({ rule: '9h.entrepot', at: h, against: { tab: 'Systems/Economics', i: noImp, text: eco[noImp] }, why: `the Imports row prints "No recorded imports."; this line says goods leave that entered as imports${rec.isEntrepot ? ' (the record holds isEntrepot; the page prints no transit good)' : ''}` });
  }
  return out;
}

// ---------------------------------------------------------------- 9i · crime's prose against the safety word
const TURF_WAR = /\b(Rival crews at .+? are fighting over who runs the streets|fighting over who runs the streets|people pay both the cut and the brawling|open war between the gangs|the gangs are at war)\b/;
const SAFE_LINE = /\b(Visitors can walk anywhere at any hour|there is little crime|Nothing much happens to people at|Thieves are scarce now|nobody is out after curfew|organized crime has found no foothold)\b/;
function rules9i(T, W) {
  const hits = findAll(T, TURF_WAR);
  if (!hits.length) return [];
  const safe = find(T, SAFE_LINE);
  const word = W.safetyWord && /^(Very Safe|Safe)$/.test(W.safetyWord) ? W.safety : null;
  // PRECISION (720): the bare Safety word "Safe" beside the line (5 of 11) is a matter of degree (a safe city may hold a
  // turf war out of sight): apart. Counted: "Very Safe", or a page line that says crime is little or thieves scarce.
  const loose = !safe && W.safetyWord === 'Safe';
  const ag = safe || word;
  if (!ag) return [];
  // rival rings as the crime leaf reads them (`corruption.js :: rivalRingsOf`: two criminal seats that do not govern, or the
  // roster's "Multiple criminal factions"): where none stand, the line's key came from a lone semi-organised house
  // (`criminalStructureKey.js`'s ladder: smuggling, black market, gambling) and the rival crews are the line's own invention
  const rec = T.record || {};
  const rings = (rec.powerStructure?.factions || []).filter((f) => f?.category === 'criminal' && f?.isGoverning !== true).length >= 2
    || (rec.institutions || []).some((i) => /multiple criminal factions/i.test(String(i?.name || '')));
  const seen = new Set();
  return hits.filter((h) => { const k = `${h.tab}|${h.i}`; if (seen.has(k)) return false; seen.add(k); return true; })
    .map((h) => ({ rule: loose ? '9i.crews-safe' : '9i.crews', ...(loose ? { status: 'apart' } : {}), cause: T.crises.has('occupied') ? 'crisis' : 'other', rings, at: h, against: ag, why: `the page prints "${ag.sentence || ag.text}"${word && safe ? ` and Safety ${W.safetyWord}` : ''}; this line says rival crews brawl for the streets${rings ? '' : ' (and the record holds no rival rings: the key is a lone house\'s)'}` }));
}

// ---------------------------------------------------------------- 9a again · order kept, against the band
const ORDER_KEPT = /\b(?:The )?(?:garrison|watch|militia|guard|soldiers)(?: and (?:the )?(?:city )?watch)? keeps? (?:order|the peace)\b/i;
const ORDER_SPARED = /\b(nobody|no one|once kept|cannot keep|can no longer|could not keep|no longer)\b/i;
function rules9a(T, W) {
  if (W.bandWord !== 'Collapsed') return [];
  return findAll(T, ORDER_KEPT).filter((h) => !ORDER_SPARED.test(h.sentence) && !/^Law & order/.test(h.sentence))
    .map((h) => ({ rule: '9a.order', cause: T.crises.size ? 'crisis' : 'other', at: h, against: W.band, why: `the page prints Law & order · Collapsed; this unmarked line says the force keeps order` }));
}

export function law9w(T, town) {
  const W = stateWords(T);
  const xs = [...rules9g(T, W), ...rules9h(T), ...rules9i(T, W), ...rules9a(T, W)];
  return xs.map((x) => ({ law: LAW, rule: x.rule, town, tab: x.at.tab, line: x.at.text, sentence: x.at.sentence || x.at.text, ...(x.rings !== undefined ? { rings: x.rings } : {}),
    against: { tab: x.against.tab, line: x.against.sentence || x.against.text }, why: x.why, status: x.status || 'count',
    cause: x.cause || (T.crises.size ? 'crisis' : 'other') }));
}
