/**
 * presumptionClasses.shared.mjs — THE RULE BOOK of the presumption-classes walker
 * (`tests/lint/presumptionClasses.walker.test.js`; BAR6-GUARD, the chair's ruling BG1 of 2026-11-16, vetoable by the
 * owner). Designed, not written, by BAR6-AUDIT-G (`docs/chair/2026-11-16/bar6/AUDIT/BAR6-AUDIT-G-HANDBACK.md` §4); the
 * lexicon, the literal scanner and the declaration reading are that auditor's proved tools
 * (`tests/helpers/pageLaws/law5w.mjs`, `docs/chair/2026-11-16/bar6/AUDIT/law5w-inventory-g.mjs`), COPIED here, never
 * imported: a guard does not stand on an instrument another seat may change. Three things differ from the instrument,
 * each a design point of the hand-back:
 *   • THE LEXICON'S FOUR MISSES are added (its §3, row G): an ARRIVAL OF GOODS (`outside`), CROP FARMING (`resource`),
 *     SMALL FOR BIG and "FOR THIS SCALE" (`size`);
 *   • ARMS 3 AND 4 read the declaration's QUALITY: a crisis class answered by crisis KINDS that leave its family open
 *     (`one-kind`), a size word answered by a tier band that admits a place too small for it (`band`);
 *   • ARM 5 EXEMPTS BY RULE, NEVER BY ROW: a negated mention (`registeredWords.js :: negates`), a line bound to its own
 *     house, title or chain (a goods, resource, office, iron or animals word, never a size or a crisis word: BRIEF-BAR6
 *     B4/BAR6-HOUSES), and the record's own fact printed back (`RECORD_FACT_POOLS`, each with its reason).
 * Three word senses are narrowed (the hand-back's §4: "cured by narrowing the word, never by banking the line"):
 * `wards` as spells, `as ever` (of the land, not of ease), a bare "is paid" (no office in it).
 *
 * A LINE'S STATUS FOR A CLASS (one a class its words fall in):
 *   declared · twin · scoped · gate · keyed · bound · negated · record   — answered (not a hit)
 *   none · other · colour · any · one-kind · band                         — THE STOCK (a hit)
 * A hit's key is `file \t class \t literalHash(text)` (the presumed-things walker's hash). Today's stock is banked in
 * `tests/lint/presumptionClasses.register.json` (shrink-only) through `scripts/presumption-classes-door.mjs`.
 * Pure but for the reads of the tree it is pointed at.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { literalHash } from './presumedThings.shared.mjs';
import { negates, sentencesOf } from '../../src/domain/facts/registeredWords.js';
import { parseAtom, STATE_MARK_DIMENSIONS, TIER_WORDS, POPULATION_WORDS, CRISIS_FAMILY_KINDS, FACT_DIMENSIONS } from '../../src/domain/facts/factVocabulary.js';

export const REGISTER_REL = 'tests/lint/presumptionClasses.register.json';
export { literalHash };
export const hitKey = (file, cls, text) => `${file}\t${cls}\t${literalHash(text)}`;

// ---------------------------------------------------------------------------------------------------------------
// THE LEXICON (BAR6-AUDIT-G's thirteen classes; the four misses marked MISS)
const W = (s) => new RegExp(s, 'i');
const SIZE_TOWN = String.raw`quarters|(?:the|a|its|every|each|one|old|new|poor|rich|merchant|craft|artisan|temple|foreign|harbour|dock|river) quarter|districts?|neighbou?rhoods?|(?<!\b(?:protective|magical|magic|arcane|runic|holy|warding|spell|minor|binding|their|its) )wards\b(?! (?:off|against))|boroughs?|suburbs?|avenues?|boulevards?|plazas?|tenements?|city blocks?|thousands of|throngs?`;
const SIZE_VILLAGE = String.raw`streets|(?:particular|main|back|side|narrow|crowded|busy|cobbled|paved|few|which) streets?|alley(?:way)?s?`;
// MISS: SMALL FOR BIG (C128237: "a small group of traders who come on market days", printed in a metropolis)
const SIZE_SMALL = String.raw`small (?:group|band|number|handful|cluster) of|a handful of (?:traders|merchants|stalls|families|households|houses)|a few (?:families|households|traders|stalls|merchants|houses)|comes? on market days?|everyone knows everyone`;
// MISS: "FOR THIS SCALE" (C43925: "Significant military force for this scale")
const SIZE_SCALE = String.raw`for (?:this|its|a place of (?:this|its)|a settlement of (?:this|its)) (?:scale|size)`;
export const SIZE_BANDS = Object.freeze({ town: W(String.raw`\b(?:${SIZE_TOWN})\b`), village: W(String.raw`\b(?:${SIZE_VILLAGE})\b`), small: W(String.raw`\b(?:${SIZE_SMALL})\b`), scale: W(String.raw`\b(?:${SIZE_SCALE})\b`) });

export const CLASSES = Object.freeze({
  // law 5's six (BAR5-AUDIT-B), verbatim but for the MISS
  outside: W(String.raw`\b(from abroad|abroad|imported|caravans?|caravanserai|travell?ers?|pilgrims?|pilgrimage|merchants? from|foreign (merchants|traders|goods)|passing trade|outside (buyers|customers|trade)|from (distant|far)|trade routes?|the roads? (in|out|bring|brings)|ships? (come|call|arrive|bring)|coach(es)? (depart|arrive)|visitors (come|arrive)`
    // MISS: AN ARRIVAL OF GOODS (C150831: "Porters bent under loaded frames file past", printed under a famine)
    + String.raw`|porters|loaded (frames|carts|wagons|mules|barges|boats)|pack (trains?|mules|horses|animals) (come|arrive|file|wind|plod)|(carts|wagons|barges|mule trains?) (come|coming|roll|rolling|arrive|arriving)( in)?|goods (arrive|arriving|come in|coming in))\b`),
  plenty: W(String.raw`\b(plenty|plentiful|abundan(t|ce)|feast(s|ing)?|well[- ]fed|never (goes |go )?hungry|without going hungry|fresh (meat|bread|fish|milk|produce|game)|full (larders|granaries|bellies|tables)|beef|pork|mutton|day's catch|piled (high|with)|heaped|overflow(s|ing)?|more than (the|a) (village|town|city|hamlet|place|settlement) (could|can) (ever )?(use|eat|wear)|surplus|to spare|laid in|nobody (here )?(talks|worries) about the price|does not empty the|poor year (in one )?does not|a bad season .{0,30}without)\b`),
  work: W(String.raw`\b(steady (work|trade|custom|living)|work never dries up|never (short of|without|wants for|lacks) (work|custom|trade)|always (has work|busy|in demand)|business is (good|brisk|steady)|plenty of work)\b`),
  animals: W(String.raw`\b(horse hire|rent(s|ing)? (horses|animals|mounts)|fresh mounts?|draught (animals|horses)|cart hire|wagons? for hire|pack animals)\b`),
  iron: W(String.raw`\b(reforge|mend(s|ing)? (tools|ironwork)|re-edge|tool manufacture|weapon smithing|ironwork|iron (tools|goods|bars))\b`),
  law: W(String.raw`\b(thief is known|thieves are (caught|known)|until they make it right|crime is (rare|unknown)|doors (are )?(left )?unlocked|nobody steals|no one steals|justice (is )?(swift|sure)|the courts? (sit|sits|hear|hears)|disputes are settled)\b`),
  // the widening (BRIEF-BAR6-AUDIT seat G)
  size: W(String.raw`\b(?:${SIZE_TOWN}|${SIZE_VILLAGE}|${SIZE_SMALL}|${SIZE_SCALE})\b`),
  goods: W(String.raw`\b(cloth|wool|linen|silk|bolts of|bales? of|pots|pottery|crockery|glassware|cut stone|chisels?|spices?|herbs|butter|cheeses?|cream|wine|ale|beer|mead|cider|leather|hides|furs|pelts|candles|beeswax|rope|barrels|casks|horseshoes|ironware|weapons|armou?r|blades|arrows|jewel(le)?ry|perfumes?|incense|dyes?|dyed|parchment|books|salt fish|sugar|carts? (of|loaded|piled)|crates of|sacks of|loads of|cartloads?|goods (piled|stacked|go out|leave)|road out|kilns?|looms?|forge|anvil|bellows)\b`),
  // narrowed: `as ever` dropped (BAR6-AUDIT-G's precision read, its line 11: "as ever" of the land is no ease)
  ease: W(String.raw`\b(nobody hurries|unhurried|no one hurries|at (their )?leisure|idle(ly)?|lazily|singing|sings|laughter|laughing|gossip(s|ing)?|feast day|dancing|celebrat(e|es|ing|ion)|music (drifts|carries|plays)|a poet holds|children (play|run|chase)|ordinary (day|way|times)|as usual|the usual)\b`),
  threat: W(String.raw`\b(nothing (threatens|presses|troubles|disturbs)|no (one|body) (fears|threatens)|nothing to fear|without fear|no threat|safe (enough|here|place|roads?)|(is|feels|stays|remains) (safe|quiet|peaceful|calm)|peaceful|untroubled|in the ordinary way|the usual trouble|in (good|working) order|fresh repairs|kept up|raiders and rivals look elsewhere|would make any attack costly|nobody (worries|bothers))\b`),
  // narrowed: a bare "is paid" names no office (its line 36: "anyone who is paid"); a paid FORCE or a paid degree stays
  office: W(String.raw`\b(law ?courts?|courthouse|courts? of (law|justice)|hall of justice|the court (sits|hears|rules)|a hearing|justice (is|comes|here)|judges?|magistrates?|tribunal|the watch|watchm[ae]n|night watch|patrols?|garrison(ed)?|militia|soldiers|guardsmen|constables?|sheriffs?|bailiffs?|(are|is) (well|badly|poorly) paid|(watch|guards?|soldiers|militia|garrison|troops) (are|is) paid|forces are|troops|standing army|councillors?|aldermen|its members|members cannot|notar(y|ies)|lawyers?|tax collectors?)\b`),
  sovereign: W(String.raw`\b(lord(s|'s)?|liege|overlord|crown|king|king's|queen|monarch|throne|noble oversight|baron|duke|earl|vassals?|fealty|tribute to|emperor)\b`),
  // a resource WORKED, CUT, HELD OR TRADED (a bare 'stone', 'timber' or 'river' as material or landscape is no presumption)
  resource: W(String.raw`\b(ore|iron ore|quarr(y|ies|ied)|clay ?pits?|sand ?pits?|glass sand|raw sand|logging|lumber|sawn|timber (yard|stacked|cut|felled)|fishing (boats|nets|fleet)|nets|the catch|day's catch|herds?|flocks?|cattle|sheep|goats|pigs|swine|grapes|vines|vineyards?|orchards?|olive groves?|peat|coal|charcoal|salt pans?|honey|dairy|milk|wool|grazing|mines?|mining|miners|(works?|worked|working|cut|cutting|dressed) (the )?stone|stone ?(cutters?|masons?|yards?)|masons|deposits|seams?`
    // MISS: CROP FARMING (C113231: "Intensive plots, terraces, raised fields")
    + String.raw`|(intensive|their|the|its|small|kitchen|garden|family) plots|terrace[sd]?|terraced fields|raised (fields|beds)|furrows?|ploughed|plowed|tilled|tilling|crops?|sowing|reaping|threshing)\b`),
});
export const CLASS_IDS = Object.freeze(Object.keys(CLASSES));
export const CRISIS_CLASSES = Object.freeze(new Set(['outside', 'plenty', 'work', 'animals', 'iron', 'law', 'ease', 'threat']));
export const classesOf = (t) => CLASS_IDS.filter((k) => CLASSES[k].test(t));

// ---- which atom dimensions answer which class (BAR6-AUDIT-G's table, verbatim)
const C = ['crisis', 'famine', 'starving', 'failed', 'danger coming', 'food', 'stores', 'war', 'migration', 'source spent', 'threat', 'hunger', 'succession', 'unrest'];
const GOODS = ['trade at work', 'institution', 'exports', 'imports', 'market', 'guild', 'iron at hand', 'timber at hand', 'timber reaches the saws', 'fish', 'grain', 'game', 'livestock', 'failed', 'enchanting', 'magic supply', 'docks', 'port', 'navigable', 'own plots', 'source spent'];
export const CLASS_DIMS = Object.freeze({
  outside: [...C, 'route', 'imports', 'exports', 'port', 'navigable', 'docks', 'walls', 'gate'],
  plenty: [...C, 'prosperity', 'own plots', 'fish', 'grain', 'game', 'livestock'],
  work: [...C, 'prosperity'],
  animals: [...C, 'institution', 'livestock'],
  iron: [...C, 'iron at hand', 'trade at work', 'institution'],
  law: [...C, 'crime', 'organised crime', 'criminal income', 'watch', 'court', 'prison', 'patrol', 'garrison', 'militia'],
  ease: [...C, 'prosperity'],
  threat: [...C, 'walls', 'palisade', 'gate', 'organised crime', 'crime', 'ruler', 'rival power', 'watch', 'garrison', 'patrol', 'militia', 'soldiers'],
  size: ['tier', 'population'],
  goods: GOODS,
  resource: [...GOODS, 'terrain', 'coast', 'river'],
  office: ['court', 'prison', 'watch', 'militia', 'garrison', 'patrol', 'soldiers', 'commander', 'mercenary', 'institution', 'ruling body', 'guild', 'ruler', 'rival power', 'walls', 'palisade', 'gate', 'tier', 'population', 'temple', 'church', 'priest', 'clergy', 'crime', 'organised crime'],
  sovereign: ['ruler', 'war', 'crisis'],
});
/** ARM 3: the crisis FAMILIES a crisis class must be declared against when only crisis atoms answer it. */
export const CLASS_FAMILIES = Object.freeze({ plenty: ['hunger'], ease: ['threat', 'hunger'], threat: ['threat'], outside: ['threat'] });
/** The dimensions the lexicon names that the vocabulary holds (a mark dimension or a fact dimension). */
export const knownDimension = (d) => Object.prototype.hasOwnProperty.call(FACT_DIMENSIONS, d) || Object.prototype.hasOwnProperty.call(STATE_MARK_DIMENSIONS, d);

const MARK_DIM = new Map(); for (const [d, ws] of Object.entries(STATE_MARK_DIMENSIONS)) for (const w of ws) MARK_DIM.set(w, d);
const isAnyAtom = (a) => a && a.dimension === 'crisis' && a.values && a.values.length === 1 && a.values[0] === 'any';

/**
 * Read a declaration's words (atoms, `no <atom>` for an exclusion, mark words, `crisis: <v>`). Returns the dimensions
 * named (`crisis: any` alone is the claim `any`, not a dimension), the crisis atoms with their side, and the size
 * band the tier and population atoms leave (`lo`/`hi` as tier indices; `popLo`/`popHi` as population indices).
 */
export function readDeclaration(words) {
  const dims = new Set(); let anyOnly = false, real = 0; const crisis = []; const band = { lo: 0, hi: TIER_WORDS.length - 1, popLo: 0, popHi: POPULATION_WORDS.length - 1, sized: false };
  for (const raw of words) {
    const w = String(raw).trim(); if (!w || w === 'dm-only' || w === 'colour') continue;
    if (MARK_DIM.has(w)) { const d = MARK_DIM.get(w); if (['severity', 'deficit', 'anchor'].includes(d)) continue; dims.add(d); real++; if (d === 'crisis') crisis.push({ neg: /^no\s/i.test(w), values: null }); continue; }
    const negm = /^no\s+(.+)$/i.exec(w); const neg = !!negm; const body = negm ? negm[1] : w;
    const a = parseAtom(body);
    if (!a) {
      const cv = /^crisis:\s*(.+)$/i.exec(body) || (/^(any|calm|under_siege|famine|wartime|occupied)$/.test(body) ? [0, body] : null);
      if (cv) { if (/^\s*any\s*$/.test(cv[1]) && !neg) anyOnly = true; else { dims.add('crisis'); real++; crisis.push({ neg, values: String(cv[1]).split(',').map((s) => s.trim()) }); } }
      continue;
    }
    if (isAnyAtom(a) && !neg) { anyOnly = true; continue; }
    dims.add(a.dimension); real++;
    if (a.dimension === 'crisis') crisis.push({ neg, values: a.values ? [...a.values] : null });
    if ((a.dimension === 'tier' || a.dimension === 'population') && a.op && typeof a.value === 'string') {
      const order = a.dimension === 'tier' ? TIER_WORDS : POPULATION_WORDS; const i = order.indexOf(a.value); if (i < 0) continue;
      const [loK, hiK] = a.dimension === 'tier' ? ['lo', 'hi'] : ['popLo', 'popHi']; band.sized = true;
      // the admitted interval: needs `op v`, or excludes `op v` (its complement)
      let lo = 0, hi = order.length - 1;
      const op = a.op;
      if (!neg) { if (op === '≥') lo = i; else if (op === '>') lo = i + 1; else if (op === '≤') hi = i; else if (op === '<') hi = i - 1; else if (op === '=') { lo = i; hi = i; } }
      else { if (op === '≥') hi = i - 1; else if (op === '>') hi = i; else if (op === '≤') lo = i + 1; else if (op === '<') lo = i; else if (op === '=') { /* a hole: no band */ } }
      band[loK] = Math.max(band[loK], lo); band[hiK] = Math.min(band[hiK], hi);
    }
  }
  return { dims, any: anyOnly, real, crisis, band };
}

/** ARM 3: do the crisis atoms of a declaration close every family the class needs? */
export function crisisCoversFamilies(crisis, families) {
  if (crisis.some((c) => !c.neg && c.values && !(c.values.length === 1 && c.values[0] === 'any'))) return true; // scoped to named conditions
  if (crisis.some((c) => c.neg && c.values === null)) return true; // excludes bare `crisis`: no crisis active
  const out = new Set(crisis.filter((c) => c.neg && c.values).flatMap((c) => c.values));
  return families.every((f) => out.has(f) || (CRISIS_FAMILY_KINDS[f] || []).every((k) => out.has(k)));
}

/** ARM 4: does the band a declaration leaves answer every size word of the line? */
export function bandAnswers(text, band) {
  const town = TIER_WORDS.indexOf('town'), village = TIER_WORDS.indexOf('village'), middling = POPULATION_WORDS.indexOf('middling');
  if (SIZE_BANDS.town.test(text) && !(band.lo >= town || band.popLo >= middling)) return false;
  if (SIZE_BANDS.village.test(text) && !(band.lo >= village || band.popLo >= middling)) return false;
  if (SIZE_BANDS.small.test(text) && !(band.hi <= town || band.popHi <= middling)) return false;
  return true;
}

// ---- ARM 5: exempt by rule
// a house's own description or service, a title's own line, a chain's own name or label: drawn only where the house,
// the title or the chain stands, so the thing it names is answered by the binding (a goods, resource, office, iron or
// animals word; NEVER a size or a crisis word)
export const BOUND_FILES = /^src\/data\/(institutionServices|institutionDescVariants|institutionDescColour|institutionalCatalog|personHooksByTitle|people\/titleSecretsPresentations|institutionServiceKeys\.generated|supplyChainData)\.js$|^src\/domain\/display\/institutionVocabulary\.js$|^src\/generators\/computeActiveChains\.js$/;
export const BOUND_CLASSES = Object.freeze(new Set(['goods', 'resource', 'office', 'iron', 'animals']));
/** The record's own fact printed back: a pool whose key IS the fact the class word names. */
export const RECORD_FACT_POOLS = Object.freeze([
  { file: 'src/generators/demandProfile.js', pool: 'FACTION_DEMAND', classes: ['goods'], reason: 'a demand item: what a faction would buy, a want and no presence (BAR6-AUDIT-G precision lines 14, 49)' },
  { file: 'src/generators/narrativeGenerator.js', pool: 'genArrivalDetail', classes: ['resource', 'outside'], reason: 'the founding reason keyed by the record\'s own founding resource: a past, not a present (lines 10, 12, 21)' },
  { file: 'src/data/narrativeData.js', pool: 'TERRAIN_NARRATIVE_HOOKS', classes: ['resource', 'outside'], reason: 'the founding keyed by the record\'s own route and terrain: a past, not a present' },
]);
const recordFactRule = (file, pool, cls) => RECORD_FACT_POOLS.find((r) => r.file === file && pool.split('.')[0] === r.pool && r.classes.includes(cls)) || null;
/** Every sentence that names the class's word denies it (`negates`), or "little/nothing to spare" for plenty. */
export function negatedFor(cls, text) {
  const re = CLASSES[cls]; const hitSentences = sentencesOf(text).filter((s) => re.test(s));
  if (!hitSentences.length) return false;
  return hitSentences.every((s) => negates(s, re) || (cls === 'plenty' && [...s.matchAll(new RegExp(re.source, 'ig'))].every((m) => /\b(little|nothing|none|never anything)\s+(?:[\w'-]+\s+){0,1}$/i.test(s.slice(Math.max(0, (m.index ?? 0) - 30), m.index ?? 0)))));
}

export const ANSWERED = Object.freeze(new Set(['declared', 'twin', 'scoped', 'gate', 'keyed', 'bound', 'negated', 'record']));
export const STOCK_STATUSES = Object.freeze(['none', 'other', 'colour', 'any', 'one-kind', 'band']);

/** One status for one class of one line. @param {string} cls @param {object} d the line's declaration @param {{file:string,pool:string,text:string}} at */
export function statusFor(cls, d, at) {
  const { atoms = [], twin = false, scoped = false, colour = false, keyGate = false, tierKey = false } = d;
  const { dims, any, real, crisis, band } = readDeclaration(atoms);
  if (negatedFor(cls, at.text)) return 'negated';
  if (recordFactRule(at.file, at.pool, cls)) return 'record';
  const answering = CLASS_DIMS[cls].filter((x) => dims.has(x));
  if (cls === 'size' && answering.length) return bandAnswers(at.text, band) ? 'declared' : 'band';
  if (answering.length) {
    const fams = CLASS_FAMILIES[cls];
    if (fams && answering.every((x) => x === 'crisis') && !crisisCoversFamilies(crisis, fams)) return 'one-kind';
    return 'declared';
  }
  if (CRISIS_CLASSES.has(cls) && twin) return 'twin';
  if (CRISIS_CLASSES.has(cls) && scoped) return 'scoped';
  if (cls === 'size' && tierKey) return 'gate';
  if (['goods', 'resource', 'iron', 'animals'].includes(cls) && keyGate) return 'keyed';
  if (BOUND_CLASSES.has(cls) && BOUND_FILES.test(at.file)) return 'bound';
  if (colour) return 'colour';
  if (CRISIS_CLASSES.has(cls) && any) return 'any';
  if (real || any || twin) return 'other';
  return 'none';
}

// ---------------------------------------------------------------------------------------------------------------
// THE SCANNER (BAR6-AUDIT-G's, which is BAR5-AUDIT-B's, copied in behaviour)
export function literals(src) {
  const out = []; let i = 0; const n = src.length;
  while (i < n) {
    const c = src[i], d = src[i + 1];
    if (c === '/' && d === '/') { const j = src.indexOf('\n', i); i = j < 0 ? n : j; continue; }
    if (c === '/' && d === '*') { const j = src.indexOf('*/', i + 2); i = j < 0 ? n : j + 2; continue; }
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1, depth = 0;
      while (j < n) {
        if (src[j] === '\\') { j += 2; continue; }
        if (c === '`' && src[j] === '$' && src[j + 1] === '{') { depth++; j += 2; continue; }
        if (c === '`' && depth && src[j] === '}') { depth--; j++; continue; }
        if (!depth && src[j] === c) break;
        if (c !== '`' && src[j] === '\n') break;
        j++;
      }
      out.push({ start: i, end: j + 1, text: src.slice(i + 1, j) }); i = j + 1; continue;
    }
    i++;
  }
  return out;
}
function enclosingObject(masked, start, end) {
  let depth = 0, a = -1;
  for (let k = start - 1; k >= Math.max(0, start - 4000); k--) {
    const ch = masked[k];
    if (ch === '}' || ch === ']' || ch === ')') depth++;
    else if (ch === '{' || ch === '[' || ch === '(') { if (depth === 0) { if (ch === '{') { a = k; break; } if (ch === '[') return null; } else depth--; }
  }
  if (a < 0) return null;
  depth = 0;
  for (let k = a; k < Math.min(masked.length, end + 4000); k++) { const ch = masked[k]; if (ch === '{') depth++; else if (ch === '}') { depth--; if (depth === 0) return [a, k + 1]; } }
  return null;
}
const poolOf = (src, at) => { const m = [...src.slice(0, at).matchAll(/^(?:export\s+)?(?:const|let|function)\s+([A-Za-z_$][\w$]*)/gm)].pop(); return m ? m[1] : '(module)'; };
const subKeyOf = (src, at) => {
  const lines = src.slice(Math.max(0, at - 30000), at).split('\n'); let key = '', sub = '';
  for (let k = lines.length - 2; k >= 0 && k > lines.length - 600; k--) {
    const L = lines[k];
    const km = L.match(/\{\s*key:\s*'([^']+)'/); if (km) { key = km[1]; break; }
    if (!sub) { const sm = L.match(/^\s{2,8}['"]?([A-Za-z_][\w &:,'-]{0,40}?)['"]?\s*:\s*[[{]\s*(\/\/.*)?$/); if (sm) sub = sm[1]; }
    if (/^(export\s+)?(const|let|function)\s/.test(L)) break;
  }
  return [key, sub].filter(Boolean).join('/');
};
const TIER_KEY = /\b(thorp|hamlet|village|town|city|metropolis|small|large|tiny|tier)\b/i;
const crisisWord = (x) => (/^crisis:/.test(x) ? x : `crisis: ${x}`);

/** The rows of one source file's literals. @param {string} rel @param {string} src @param {Map<string, object>} chan the declaration channels */
export function scanSource(rel, src, chan = new Map()) {
  const rows = []; const lits = literals(src);
  let masked = src.split(''); for (const l of lits) for (let k = l.start + 1; k < l.end - 1; k++) masked[k] = ' '; masked = masked.join('');
  for (const l of lits) {
    const t = l.text;
    if (t.split(/\s+/).length < 4 || !/[a-z]/.test(t) || /^[\w./-]+$/.test(t)) continue;
    if (/^\s*(import|export)\b|^[@#]|^(https?:|\.\/|\.\.\/)/.test(t)) continue;
    if (/^\s*:/.test(src.slice(l.end, l.end + 3))) continue; // a key of a channel: read where it prints
    if (!classesOf(t).length) continue;
    const ob = enclosingObject(masked, l.start, l.end); const objText = ob && ob[1] - ob[0] < 1500 ? src.slice(ob[0], ob[1]) : '';
    const near = src.slice(Math.max(0, l.start - 200), l.start);
    const atoms = []; let twin = false, colour = false;
    for (const k of ['needs', 'excludes', 'crisis', 'tags', 'poolDeclares']) {
      const m = objText.match(new RegExp(`\\b${k}\\s*:\\s*\\[([^\\]]*)\\]`)); if (!m) continue;
      const ws = [...m[1].matchAll(/['"`]([^'"`]+)['"`]/g)].map((x) => x[1]);
      atoms.push(...ws.map((w) => (k === 'excludes' ? `no ${w}` : k === 'crisis' ? crisisWord(w) : w)));
    }
    if (/\btwinOf\s*:/.test(objText)) twin = true;
    if (/\bcolour\s*:\s*true\b/.test(objText)) colour = true;
    const ds = /declaredSet\s*\(\s*$/.test(near) || /declaredSet\s*\([^)]*$/.test(near.slice(-100));
    const c = chan.get(t);
    if (c) { atoms.push(...c.atoms); if (c.twin) twin = true; if (c.colour) colour = true; }
    else if (ds) { const m = src.slice(l.end, l.end + 600).match(/^\s*,\s*\[([^\]]*)\]/); if (m) atoms.push(...[...m[1].matchAll(/['"`]([^'"`]+)['"`]/g)].map((x) => x[1])); }
    const pool = poolOf(src, l.start); const sub = subKeyOf(src, l.start);
    let keyGate = false; { const ks = src.lastIndexOf('{ key: ', l.start); if (ks >= 0 && l.start - ks < 6000 && /institutions:\s*\[/.test(src.slice(ks, Math.min(l.start, ks + 1200)))) keyGate = true; }
    const tierKey = TIER_KEY.test(sub) || /\b(tier|TIER|population|isSmall|smallPlace|SMALL)\b/.test(src.slice(Math.max(0, l.start - 300), l.start));
    rows.push({ file: rel, pool: sub ? `${pool}.${sub}` : pool, line: src.slice(0, l.start).split('\n').length, text: t, decl: { atoms, twin, colour, keyGate, tierKey } });
  }
  return rows;
}

/** The rows of one annex module (`src/data/dossierStateProse/<desk>.generated.js`), read structurally. */
export function scanAnnex(rel, blocks) {
  const rows = [];
  for (const [bid, b] of Object.entries(blocks)) for (const [pk, arr] of Object.entries(b.pools || {})) {
    const pm = b.poolMeta?.[pk] || {};
    for (const v of arr) {
      if (typeof v.text !== 'string' || v.text.split(/\s+/).length < 4 || !classesOf(v.text).length) continue;
      const marks = Array.isArray(v.marks) ? v.marks : [];
      const poolAtoms = Array.isArray(pm.declares) ? pm.declares : (pm.declares && typeof pm.declares === 'object' ? Object.values(pm.declares).flat() : []);
      rows.push({ file: rel, pool: `${bid}::${pk}`, line: null, text: v.text,
        decl: { atoms: [...marks, ...poolAtoms.map(String)], scoped: pm.crisisScoped === true, colour: marks.includes('colour') || pm.colour === true, tierKey: TIER_KEY.test(pk) } });
    }
  }
  return rows;
}

/** The declaration channels of `scripts/lib/table-pools.mjs` (sibling sets and columns), read live from `root`. */
export async function readChannels(root) {
  const imp = (rel) => import(pathToFileURL(path.join(root, rel)).href);
  const { DECLARATION_CHANNELS } = await imp('scripts/lib/table-pools.mjs');
  const chan = new Map(); const atomsOfEntry = (x) => [...(x?.needs || []), ...(x?.excludes || []).map((a) => `no ${a}`), ...(x?.crisis || []).map(crisisWord)];
  for (const c of DECLARATION_CHANNELS) {
    const t = (await imp(c.module))[c.name]; if (!t) continue;
    for (const [text, v] of Object.entries(t)) {
      if (c.kind === 'siblings') {
        const set = Array.isArray(v) ? v : [];
        const own = set.find((x) => x?.text === text) || {};
        chan.set(text, { twin: set.some((x) => typeof x?.twinOf === 'string'), atoms: atomsOfEntry(own), colour: own.colour === true });
        for (const x of set) if (typeof x?.text === 'string' && x.text !== text) chan.set(x.text, { twin: true, atoms: atomsOfEntry(x), colour: false });
      } else chan.set(text, { twin: false, atoms: atomsOfEntry(v), colour: v?.colour === true });
    }
  }
  return chan;
}

// ---- THE SCOPE, by rule: every file under the four roots the presumed-things walker's arm 1 reads (`ARM1_ROOTS`)
export const ROOTS = Object.freeze(['src/data', 'src/generators', 'src/domain', 'src/components']);
export const ANNEX_DESKS = Object.freeze({ defense: 'DOSSIER_STATE_PROSE_DEFENSE', economy: 'DOSSIER_STATE_PROSE_ECONOMY', general: 'DOSSIER_STATE_PROSE_GENERAL', power: 'DOSSIER_STATE_PROSE_POWER', stressors: 'DOSSIER_STATE_PROSE_STRESSORS', warFaith: 'DOSSIER_STATE_PROSE_WAR_FAITH' });
const ANNEX_FILE = /^src\/data\/dossierStateProse\/[a-zA-Z]+\.generated\.js$/;
export function listFiles(root) {
  const acc = [];
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (!/^(__tests__|__mocks__)$/.test(e.name)) walk(p); } else if (/\.(js|jsx|mjs)$/.test(e.name) && !/\.(test|spec)\./.test(e.name)) acc.push(path.relative(root, p).split(path.sep).join('/')); } };
  for (const r of ROOTS) if (fs.existsSync(path.join(root, r))) walk(path.join(root, r));
  return acc.sort();
}

/**
 * Status every row, then fold by text (a channel key printed in its table and named in its set is one line: each
 * class takes the best status any occurrence earns), and return the HITS: one per (file, class, text) whose status
 * is stock. @param {Array<object>} rows
 */
const RANK = { declared: 6, twin: 5, scoped: 5, negated: 5, record: 5, gate: 4, keyed: 4, bound: 4, colour: 2, any: 2, 'one-kind': 2, band: 2, other: 1, none: 0 };
export function hitsOf(rows) {
  for (const r of rows) { r.classes = classesOf(r.text); r.status = Object.fromEntries(r.classes.map((c) => [c, statusFor(c, r.decl, r)])); }
  const best = new Map();
  for (const r of rows) { const b = best.get(r.text) || {}; for (const c of r.classes) if ((RANK[r.status[c]] ?? 0) > (RANK[b[c]] ?? -1)) b[c] = r.status[c]; best.set(r.text, b); }
  const out = new Map();
  for (const r of rows) for (const c of r.classes) {
    const s = best.get(r.text)[c]; if (ANSWERED.has(s)) continue;
    const k = hitKey(r.file, c, r.text); if (!out.has(k)) out.set(k, { key: k, file: r.file, cls: c, status: s, pool: r.pool, line: r.line, text: r.text });
  }
  return [...out.values()].sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

/** The whole tree's hits. @param {string} root */
export async function scanTree(root) {
  const chan = await readChannels(root);
  const rows = [];
  for (const [desk, name] of Object.entries(ANNEX_DESKS)) {
    const rel = `src/data/dossierStateProse/${desk}.generated.js`;
    rows.push(...scanAnnex(rel, (await import(pathToFileURL(path.join(root, rel)).href))[name]));
  }
  for (const rel of listFiles(root)) { if (ANNEX_FILE.test(rel)) continue; rows.push(...scanSource(rel, fs.readFileSync(path.join(root, rel), 'utf8'), chan)); }
  return hitsOf(rows);
}

// ---- THE REGISTER: { reasons, rows: { <file>: [[class, status, text (120), hash], …] } }
export const REASONS = Object.freeze({ 'debt-at-base': 'stood undeclared at the guard\'s base (afa46d644, the joined line lane/join-2026-11-14): banked once by the door, leaves only by its cure' });
export const bankRow = (hit) => [hit.cls, hit.status, String(hit.text).slice(0, 120), literalHash(hit.text)];
export const rowKey = (file, row) => `${file}\t${row[0]}\t${row[3]}`;
export const bankedKeys = (register) => new Set(Object.entries(register.rows).flatMap(([f, rs]) => rs.map((r) => rowKey(f, r))));
