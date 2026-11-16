// BAR5-AUDIT-B · LAW 5 · A STATIC INVENTORY, NOT A SAMPLE: every crisis-sensitive clause in the prose source.
//   node law5-inventory.mjs <tree-root> <out.json> [controls-second-check.json]
// Reads every string and template literal under <tree>/src (tests left out), keeps the prose ones (four words or
// more), and matches each against the LEXICON below (one class a crisis can deny). For each hit it reads whether
// the line DECLARES its sensitivity:
//   line    the literal's own object carries `needs` / `excludes` / `crisis` / `twinOf` (or a `declaredSet(...)`),
//           or a declaration channel beside its table names it (a sibling set with a twin, a column with atoms),
//           or (the state annex's leaves) its `marks` carry a crisis mark
//   row     no line declaration, but the row it describes is marked by the crisis (crisisDependence: the service's
//           or house's declared dependence holds a word the siege stops: travellers, goods, beyond the gates)
//   colour  declared "presumes nothing" (a colour mark): a declaration that the lexicon says is wrong
//   none    nothing declares it
// Writes every hit to <out.json> and prints the table by file and pool. Static: no town is born.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [treeArg, outPath, controlsPath] = process.argv.slice(2);
if (!treeArg || !outPath) { console.error('usage: law5-inventory.mjs <tree> <out.json> [second-check.json]'); process.exit(2); }
const TREE = path.resolve(treeArg);

export const LEXICON = {
  outside: /\b(from abroad|abroad|imported|caravans?|caravanserai|travell?ers?|pilgrims?|pilgrimage|merchants? from|foreign (merchants|traders|goods)|passing trade|outside (buyers|customers|trade)|from (distant|far)|trade routes?|the roads? (in|out|bring|brings)|ships? (come|call|arrive|bring)|coach(es)? (depart|arrive)|visitors (come|arrive))\b/i,
  plenty: /\b(plenty|plentiful|abundan(t|ce)|feast(s|ing)?|well[- ]fed|never (goes |go )?hungry|without going hungry|fresh (meat|bread|fish|milk|produce|game)|full (larders|granaries|bellies|tables)|beef|pork|mutton|day's catch)\b/i,
  work: /\b(steady (work|trade|custom|living)|work never dries up|never (short of|without|wants for|lacks) (work|custom|trade)|always (has work|busy|in demand)|business is (good|brisk|steady)|plenty of work)\b/i,
  animals: /\b(horse hire|rent(s|ing)? (horses|animals|mounts)|fresh mounts?|draught (animals|horses)|cart hire|wagons? for hire|pack animals)\b/i,
  iron: /\b(reforge|mend(s|ing)? (tools|ironwork)|re-edge|tool manufacture|weapon smithing|ironwork|iron (tools|goods|bars))\b/i,
  law: /\b(thief is known|thieves are (caught|known)|until they make it right|crime is (rare|unknown)|doors (are )?(left )?unlocked|nobody steals|no one steals|justice (is )?(swift|sure)|the courts? (sit|sits|hear|hears)|disputes are settled)\b/i,
};
// what each class's crisis is: the rows' dependence words the siege stops, for the `row` reading
const SIEGE_STOPS = new Set(['travellers', 'goods', 'beyond the gates']);
// BAR5-MARKS (2026-11-16, W4): EACH CLASS READS ITS OWN CRISIS'S WORDS on the row (the mark leaf prints a mark for each):
// the outside, what a siege stops or curtails of trade (an imported input: "Curtailed by the siege."); the iron and the
// animals, the war's two words (the chair's WM1: "Curtailed by the war."); the plenty, the food a famine fails (and a siege
// stops where no herds are raised). The work and the law have no row word: a line of theirs declares itself or is excluded.
const ROW_WORDS = {
  outside: new Set([...SIEGE_STOPS, 'imported input']),
  iron: new Set(['iron']),
  animals: new Set(['working animals', 'travellers']), // a row of the travellers' animals stops with the travellers
  plenty: new Set(['food: grain', 'food: livestock', 'food: fish', 'food: game']),
};
// BAR5-MARKS (2026-11-16): THE REVIEWED EXCLUSIONS, a line a crisis cannot deny, each read against the row's own house and
// the crisis's reach (the text, whole or its opening, and the reason). Only shrinks by a reason struck.
export const EXCLUDED_LINES = [
  { text: "They change coin from abroad.", why: "the money-changers change the foreign coin the town holds; the line claims no arrival (no crisis denies a coin already in a purse)" },
  { text: "Warehouses where traders keep stock awaiting sale", why: "a store keeps what is in it; under a siege it holds more, not less, and the trade-route clause is the house's general worth" },
  { text: "Warehouse facilities for merchants storing goods awaiting sale", why: "the same house's catalogue line: a store keeps what is in it" },
  { text: "Wine pressed and matured from local fruit or imported must, when either comes to the cellar", why: "the import is conditioned on its arrival in the line's own words (\"when either comes\")" },
  { text: "Presses and ages wine from local grapes or imported must, in any year that either reaches the cellar", why: "the same house's catalogue line, conditioned the same way (\"in any year that either reaches\")" },
  { text: "Each congregation buries its own, and the sexton keeps the roll that inheritance disputes are settled from", why: "the law class's word is a register's use, not a claim that the law holds" },
  { text: "Every principal commodity and trade route has its guild", why: "the guild parliament sits whether or not a caravan comes: a body of the town's own" },
  { text: "A chartered school of the arcane, with a full course of study, laboratories, and scholars come from abroad", why: "scholars who have come: a present body, no arrival claimed" },
  { text: "Operates kilns in the surrounding woodland, supplying fuel for smithing, baking, and heating", why: "the plenty is of timber and conditioned (\"when timber is\"), no food" },
  { text: "Accurate maps of regions, trade routes, coastlines, and interiors", why: "a map of a route is accurate whether or not anyone travels it" },
  { text: "The great rites, feast day observances, and the rites of the faith for a whole region", why: "a feast day is a day of the calendar's rites, not a meal" },
  { text: "The most significant religious observances. Major feast days and state occasions", why: "the same: the calendar's great days, not a meal" },
  { text: "The congregations coordinate on feast days and city-wide observances", why: "the same: the calendar's great days, not a meal" },
  { text: "Distribution of food and aid to the poor on feast days", why: "alms given of what the house holds; a famine makes the line more needed, not false (the rite's day is the calendar's)" },
  { text: "City haulage is bonded through the caravan masters", why: "an arrangement between the town's own houses, true whether or not a caravan leaves" },
  { text: "Hot meals suited to travelers. Hearty portions", why: "the inn's table goes on for the town's own (SV1's free row, `SERVICE_FREE_OF_HOUSE.travelers_inn.Meals`); \"suited to travellers\" names the fare, not who comes" },
  { text: "Ask whether a named traveller passed through, and in whose company", why: "asked of the register's past arrivals; no arrival claimed" },
];

const walk = (d, acc = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!/^(__tests__|__mocks__)$/.test(e.name)) walk(p, acc); }
    else if (/\.(js|jsx|mjs)$/.test(e.name) && !/\.(test|spec)\./.test(e.name)) acc.push(p);
  }
  return acc;
};

/** literals of a source: [{ start, end, text }] (quotes and template bodies; comments skipped) */
function literals(src) {
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
      out.push({ start: i, end: j + 1, text: src.slice(i + 1, j) });
      i = j + 1; continue;
    }
    i++;
  }
  return out;
}

/** the innermost object literal around [start,end) (brace matching over the raw source, literals masked) */
function enclosingObject(masked, start, end) {
  let depth = 0, a = -1;
  for (let k = start - 1; k >= Math.max(0, start - 4000); k--) {
    const ch = masked[k];
    if (ch === '}' || ch === ']' || ch === ')') depth++;
    else if (ch === '{' || ch === '[' || ch === '(') { if (depth === 0) { if (ch === '{') { a = k; break; } if (ch === '[') return null; if (ch === '(') { /* inside a call: keep looking for its object */ } } else depth--; }
  }
  if (a < 0) return null;
  depth = 0;
  for (let k = a; k < Math.min(masked.length, end + 4000); k++) {
    const ch = masked[k];
    if (ch === '{') depth++; else if (ch === '}') { depth--; if (depth === 0) return [a, k + 1]; }
  }
  return null;
}

const poolOf = (src, at) => {
  const head = src.slice(0, at);
  const m = [...head.matchAll(/^(?:export\s+)?(?:const|let|function)\s+([A-Za-z_$][\w$]*)/gm)].pop();
  return m ? m[1] : '(module)';
};

// ---- the live declaration channels and the row dependences
const imp = async (rel) => import(pathToFileURL(path.join(TREE, rel)).href);
const { DECLARATION_CHANNELS } = await imp('scripts/lib/table-pools.mjs');
const chan = new Map(); // text -> { kind, decl }
const twinOriginal = new Map(); // BAR5-MARKS (W5): a twin's text -> its original's (the twin prints in its original's row)
for (const c of DECLARATION_CHANNELS) {
  let mod; try { mod = await imp(c.module); } catch (e) { console.error(`channel ${c.module} :: ${c.name} not loaded: ${e.message}`); continue; }
  const t = mod[c.name]; if (!t) continue;
  for (const [text, v] of Object.entries(t)) {
    if (c.kind === 'siblings') {
      const set = Array.isArray(v) ? v : [];
      const hasTwin = set.some((x) => typeof x?.twinOf === 'string');
      const own = set.find((x) => x?.text === text) || {};
      chan.set(text, { kind: 'siblings', twin: hasTwin, needs: own.needs, excludes: own.excludes, crisis: own.crisis, colour: own.colour });
      for (const x of set) if (typeof x?.text === 'string' && x.text !== text) { chan.set(x.text, { kind: 'siblings', twin: true, needs: x.needs, excludes: x.excludes, crisis: x.crisis, isTwin: typeof x.twinOf === 'string' }); if (typeof x.twinOf === 'string') twinOriginal.set(x.text, x.twinOf); }
    } else {
      // BAR5-MARKS (W1): a text in a sibling set AND a column declares the union (`institutionDescDraw.js :: lift`)
      const had = chan.get(text);
      const u = (f) => [...(had?.[f] || []), ...(v?.[f] || [])];
      chan.set(text, had ? { ...had, kind: `${had.kind}+column`, needs: u('needs'), excludes: u('excludes'), crisis: u('crisis') } : { kind: 'column', ...v });
    }
  }
}
const dep = await imp('src/data/crisisDependence.js');
const { INSTITUTION_SERVICES } = await imp('src/data/institutionServices.js');
const svcByDesc = new Map(); // desc -> [service names]
const svcHouseByDesc = new Map(); // BAR5-MARKS (W6): desc -> [the menus (houses) that carry it]
const walkSvc = (node, menu = null) => { if (!node || typeof node !== 'object') return; for (const [k, v] of Object.entries(node)) { if (v && typeof v === 'object' && typeof v.desc === 'string') { (svcByDesc.get(v.desc) || svcByDesc.set(v.desc, []).get(v.desc)).push(k); if (menu) (svcHouseByDesc.get(v.desc) || svcHouseByDesc.set(v.desc, []).get(v.desc)).push([menu, k]); } else walkSvc(v, k); } };
walkSvc(INSTITUTION_SERVICES);
const { INSTITUTION_DESC_VARIANTS } = await imp('src/data/institutionDescVariants.js');
const houseByDesc = new Map();
for (const [key, pair] of Object.entries(INSTITUTION_DESC_VARIANTS)) for (const t of [].concat(pair || [])) if (typeof t === 'string') (houseByDesc.get(t) || houseByDesc.set(t, []).get(t)).push(key.split('|').pop());
// BAR5-MARKS (W3): the catalogue's own description of a house is its draw pool's first member (`assembleInstitutions.js`):
// read it to the house too (by the catalogue's id, `catalogIdForName`)
const { INSTITUTION_FAMILIES, catalogIdForName } = await imp('src/data/institutionalCatalog.js');
const catalogByDesc = new Map();
const addCat = (desc, name) => { if (typeof desc === 'string' && typeof name === 'string') (catalogByDesc.get(desc) || catalogByDesc.set(desc, []).get(desc)).push(name); };
for (const fam of INSTITUTION_FAMILIES || []) {
  const sh = fam?.shared || {};
  addCat(sh.desc, sh.name);
  for (const row of Object.values(fam?.at || {})) addCat(row?.desc ?? sh.desc, row?.name ?? sh.name);
}
const houseId = (name) => name.toLowerCase().replace(/[’']/g, '_').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const rowCovered = (text, classes = ['outside']) => {
  // BAR5-MARKS (W4): a line is covered only where EVERY class it names has its crisis's word on the row
  const words = classes.map((k) => ROW_WORDS[k]);
  if (words.some((w) => !w)) return null;
  const covers = (d) => words.every((w) => d.some((x) => w.has(x)));
  const svcs = svcByDesc.get(text) || [];
  for (const s of svcs) { const byDesc = dep.SERVICE_DEPENDENCE_BY_DESC?.[s]?.[text]; const d = byDesc || dep.SERVICE_DEPENDENCE?.[s] || []; if (covers(d)) return `service ${s}: ${d.join(', ')}`; }
  for (const h of houseByDesc.get(text) || []) { const hid = houseId(h); const id = Object.keys(dep.HOUSE_DEPENDENCE || {}).find((k) => k === hid || k.startsWith(hid + '_')); const d = (id && dep.HOUSE_DEPENDENCE[id]) || []; if (covers(d)) return `house ${id}: ${d.join(', ')}`; }
  for (const h of catalogByDesc.get(text) || []) { const id = catalogIdForName(h); const d = (id && dep.HOUSE_DEPENDENCE?.[id]) || []; if (covers(d)) return `house ${id}: ${d.join(', ')}`; }
  // BAR5-MARKS (W6): a service row carries its house's mark (the chair's SV1, `crisisStoppedRow.js :: serviceRowDependence`),
  // but for what `SERVICE_FREE_OF_HOUSE` frees it of
  for (const [menu, svc] of svcHouseByDesc.get(text) || []) {
    const id = catalogIdForName(menu); const hd = (id && dep.HOUSE_DEPENDENCE?.[id]) || [];
    const free = (id && dep.SERVICE_FREE_OF_HOUSE?.[id]?.[svc]) || [];
    const own = dep.SERVICE_DEPENDENCE_BY_DESC?.[svc]?.[text] || dep.SERVICE_DEPENDENCE?.[svc] || [];
    const d = [...own, ...hd.filter((x) => !free.includes(x))];
    if (covers(d)) return `service ${svc} @ ${menu}: ${d.join(', ')}`;
  }
  // (W5) a twin is read in its original's row
  if (twinOriginal.has(text) && twinOriginal.get(text) !== text) return rowCovered(twinOriginal.get(text), classes);
  return null;
};
const atomsDeclare = (o) => o && ((o.needs && o.needs.length) || (o.excludes && o.excludes.length) || (o.crisis && o.crisis.length) || o.twin || o.isTwin);
const CRISIS_ATOM = /crisis|war: |famine|siege|threat|law/;

// ---- the walk
// THE POOLS THAT PRINT ON A PAGE (the brief's list: the houses' descriptions and variants, the services, the hooks,
// the ties, the scenes, the state annex's leaves, the food lines; and the defence lines). WIDE=1 reads all of src.
export const POOL_FILES = [
  /^src\/data\/institution(DescVariants|DescColour|alCatalog|Services)\.js$/,
  /^src\/data\/(arrivalProse|narrativeData|npcData|historyData|cultureProfiles|stressInstitutionEffects|foodwaysPrintSiblings)\.js$/,
  /^src\/data\/people\/handlerTieLines\.js$/,
  /^src\/data\/dossierStateProse\/[a-z]+\.generated\.js$/,
  /^src\/generators\/economy\/(foodBalance|outlookHookSiblings|incomeLineSiblings|prosperity)\.js$/,
  /^src\/generators\/(foodLand|safetyProfile)\.js$/,
  /^src\/generators\/power\/relationshipArchetypes\.js$/,
  /^src\/domain\/(foodways|dailyLife|hookEscalation)\.js$/,
  /^src\/domain\/dossier\/hookLines\.js$/,
  /^src\/domain\/crisis\/crisisHooks\.js$/,
  /^src\/components\/new\/(dailyLifeLogic\.js|tabs\/DailyLifeTab\.jsx)$/,
];
const files = walk(path.join(TREE, 'src')).filter((f) => process.env.WIDE || POOL_FILES.some((re) => re.test(path.relative(TREE, f))));
const hits = [];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const lits = literals(src);
  let masked = src.split('');
  for (const l of lits) for (let k = l.start + 1; k < l.end - 1; k++) masked[k] = ' ';
  masked = masked.join('');
  const rel = path.relative(TREE, f);
  for (const l of lits) {
    const t = l.text;
    if (t.split(/\s+/).length < 4 || !/[a-z]/.test(t) || /^[\w./-]+$/.test(t)) continue;
    if (/^\s*(import|export)\b|^[@#]|^(https?:|\.\/|\.\.\/)/.test(t)) continue;
    if (/^\s*:/.test(src.slice(l.end, l.end + 3))) continue; // a key of a declaration column or a sibling set: its line is read where it prints
    const classes = Object.entries(LEXICON).filter(([, re]) => re.test(t)).map(([k]) => k);
    if (!classes.length) continue;
    const plain = t.replace(/\$\{[^}]*\}/g, '…');
    const ob = enclosingObject(masked, l.start, l.end);
    const objText = ob ? src.slice(ob[0], ob[1]) : '';
    const near = src.slice(Math.max(0, l.start - 160), l.start);
    let status = 'none', via = '';
    const inlineDecl = /\b(needs|excludes|crisis|twinOf)\s*:\s*[[\w'"]/.test(objText) && objText.length < 1500;
    const marks = (objText.match(/"marks"\s*:\s*\[([^\]]*)\]|marks\s*:\s*\[([^\]]*)\]/) || [])[0] || '';
    const c = chan.get(t);
    if (/declaredSet\s*\(\s*$/.test(near) || /declaredSet\s*\([^)]*$/.test(near.slice(-80))) { status = 'line'; via = 'declaredSet'; }
    else if (/dossierStateProse/.test(rel) && marks) {
      // the annex: a line declares by its marks; else it is drawn by its pool's STATE KEY (a band of a measure),
      // which is crisis-aware only if that measure reads the crisis (not read here: reported apart as `state`)
      const before = src.slice(0, l.start).split('\n');
      let key = ''; for (let k = before.length - 1; k >= 0 && k > before.length - 400; k--) { const m = before[k].match(/^\s*"([^"]+)": \[$/); if (m && !/^(marks|slots)$/.test(m[1])) { key = m[1]; break; } }
      const mk = marks.replace(/\s+/g, ' ');
      status = /crisis/.test(mk) ? 'line' : /"colour"/.test(mk) ? 'colour' : 'state'; via = `pool "${key}" marks ${mk.replace(/^"?marks"?\s*:\s*/, '').slice(0, 100)}`;
    }
    else if (c && atomsDeclare(c)) { status = 'line'; via = `channel ${c.kind}${c.twin ? ' (twin)' : ''} ${JSON.stringify({ needs: c.needs, excludes: c.excludes, crisis: c.crisis }).slice(0, 120)}`; }
    else if (c && c.colour) { status = 'colour'; via = `channel ${c.kind} colour`; }
    else if (inlineDecl) { status = 'line'; via = `inline ${(objText.match(/\b(needs|excludes|crisis|twinOf)\s*:\s*[^,}]*/g) || []).join(' ; ').slice(0, 160)}`; }
    else if (/\bcolour\s*:\s*true\b|\bCOLOUR\b/.test(objText) && objText.length < 1500) { status = 'colour'; via = 'inline colour'; }
    let crisisDeclared = status === 'line' && CRISIS_ATOM.test(via);
    // BAR5-MARKS (W2): a line declaring another fact (walls, a guard) is still covered by its row; (W4) each class its words
    if (!crisisDeclared) { const rc = rowCovered(t, classes); if (rc) { status = status === 'colour' ? 'colour+row' : status === 'line' ? 'line+row' : 'row'; via = rc; } }
    const ex = !crisisDeclared && !/row/.test(status) ? EXCLUDED_LINES.find((e) => plain.startsWith(e.text)) : null;
    if (ex) { status = 'excluded'; via = ex.why; }
    hits.push({ file: rel, pool: poolOf(src, l.start), line: src.slice(0, l.start).split('\n').length, classes, status, crisisDeclared, via, text: plain.slice(0, 300) });
  }
}
// one row a DISTINCT text (a twin's original printed in its table and named again in its sibling set is one line)
const RANK = { line: 3, 'line+row': 3, row: 2, excluded: 2, state: 1, 'colour+row': 1, colour: 1, none: 0 };
const distinct = new Map();
for (const h of hits) {
  const d = distinct.get(h.text);
  if (!d) { distinct.set(h.text, { ...h, also: [] }); continue; }
  d.also.push(`${h.file}:${h.line}`);
  if (RANK[h.status] > RANK[d.status] || (RANK[h.status] === RANK[d.status] && h.crisisDeclared && !d.crisisDeclared)) Object.assign(d, { status: h.status, via: h.via, crisisDeclared: h.crisisDeclared }); // BAR5-MARKS: a declaring copy wins its tie
}
hits.length = 0; hits.push(...distinct.values());
fs.writeFileSync(outPath, JSON.stringify(hits, null, 1));

// ---- the table
const byFile = new Map();
for (const h of hits) {
  const k = `${h.file} :: ${h.pool}`;
  const v = byFile.get(k) || { n: 0, line: 0, lineCrisis: 0, row: 0, colour: 0, none: 0, classes: {} };
  v.n++; if (h.status === 'line') { v.line++; if (h.crisisDeclared) v.lineCrisis++; } else if (h.status === 'row') v.row++; else if (/colour/.test(h.status)) v.colour++; else v.none++;
  for (const c of h.classes) v.classes[c] = (v.classes[c] || 0) + 1;
  byFile.set(k, v);
}
for (const h of hits) h.crisisUndeclared = !(h.crisisDeclared || /row|excluded/.test(h.status));
// THE UNITED TOOL (the chair, 2026-11-16, for the join of the round BAR5): three seats each added a way for a line to leave the list by a
// reviewed reason, in three forms, at one place. ALL THREE STAND, one after another: BAR5-MARKS's (the row words of each crisis and
// `EXCLUDED_LINES`, read as the hits are built: status `excluded`), BAR5-SAFETY's (`REVIEWED`, by file and opening words: status
// `reviewed`), BAR5-WORLD's (a table a seat under `tables/B.law5.exclusions.<SEAT>.json`: BAR5-FOOD's and BAR5-WORLD's tables). A NEW
// exclusion is written in the last form only (the chair's ruling EX1).
// THE REVIEWED EXCLUSIONS (BRIEF-BAR5 L5: a line leaves the list by its declaration, its row's dependence, or a reviewed
// reason HERE). Keyed by file and the line's opening words; each reason says why no crisis can make the line false.
export const REVIEWED = Object.freeze([
  { file: 'src/generators/safetyProfile.js', starts: '… Disputes are settled by whoever is stronger.', by: 'BAR5-SAFETY',
    reason: 'the Lawlessness crime type: "disputes are settled by whoever is stronger" says the law FAILS; no crisis makes a lawless town lawful (the lexicon reads "disputes are settled" as order)' },
  { file: 'src/generators/safetyProfile.js', starts: 'A pilgrim paid a fortune for a holy relic', by: 'BAR5-SAFETY',
    reason: 'a plot hook (LAW 2 skips hooks: a hook states its own fact, the measure\'s rule 2); the pilgrim is in the town already, and a siege keeps them there' },
]);
for (const h of hits) {
  const r = REVIEWED.find((x) => x.file === h.file && h.text.startsWith(x.starts));
  if (r) { h.status = 'reviewed'; h.via = `reviewed (${r.by}): ${r.reason}`; h.crisisUndeclared = false; }
}
// THE REVIEWED EXCLUSIONS (BAR5-WORLD, 2026-11-16; BRIEF-BAR5 L5): a line that leaves the list by a reviewed reason, not a
// declaration. One file a seat (`tables/B.law5.exclusions.<SEAT>.json`: [{ file, text, reason }], `text` the row's own text or
// its first words); a row named there is `excluded` with its reason and counts as declared. A named row the walk no longer
// finds is reported, so a stale exclusion cannot stand unseen.
{
  const TD = path.join(path.dirname(new URL(import.meta.url).pathname), 'tables');
  const ex = fs.readdirSync(TD).filter((f) => /^B\.law5\.exclusions\.[A-Z0-9-]+\.json$/.test(f)).flatMap((f) => JSON.parse(fs.readFileSync(path.join(TD, f), 'utf8')).map((e) => ({ ...e, table: f })));
  for (const e of ex) {
    const h = hits.find((x) => x.file === e.file && x.text.startsWith(e.text));
    if (!h) { console.log(`EXCLUSION STALE (no such row): ${e.table} ${e.file} ${e.text.slice(0, 60)}`); continue; }
    h.excluded = `${e.table}: ${e.reason}`; h.crisisUndeclared = false;
  }
}
fs.writeFileSync(outPath, JSON.stringify(hits, null, 1));
const tot = { n: 0, line: 0, lineCrisis: 0, row: 0, colour: 0, none: 0 };
for (const v of byFile.values()) for (const k of Object.keys(tot)) tot[k] += v[k];
console.log(`files read ${files.length} · crisis-sensitive literals ${tot.n} · declared by the line ${tot.line} (of which a crisis atom ${tot.lineCrisis}) · row marked only ${tot.row} · colour ${tot.colour} · UNDECLARED ${tot.none}`);
console.log(`NOT DECLARED FOR A CRISIS (no crisis atom on the line, no crisis mark on its row): ${hits.filter((h) => h.crisisUndeclared).length} of ${hits.length}`);
const cls = {}; for (const h of hits) for (const c of h.classes) { const v = cls[c] || (cls[c] = { n: 0, none: 0 }); v.n++; if (h.status === 'none' || /colour/.test(h.status)) v.none++; }
console.log('by class (all · undeclared or colour): ' + Object.entries(cls).map(([k, v]) => `${k} ${v.n} · ${v.none}`).join(' | '));
for (const [k, v] of [...byFile].sort((a, b) => (b[1].none + b[1].colour) - (a[1].none + a[1].colour)).slice(0, 60))
  console.log(`${String(v.none).padStart(4)} none ${String(v.colour).padStart(3)} colour ${String(v.row).padStart(3)} row ${String(v.line).padStart(4)} line · ${k} · ${Object.entries(v.classes).map(([a, b]) => `${a} ${b}`).join(', ')}`);

// ---- the lexicon's misses on the controls (laws 2 and 3, STANDS)
if (controlsPath) {
  const ctl = JSON.parse(fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'controlsB.json'), 'utf8'));
  const rows = JSON.parse(fs.readFileSync(controlsPath, 'utf8'));
  const out = [];
  for (const [law, g] of Object.entries(ctl)) for (const id of g.STANDS || []) {
    const r = rows.find((x) => x.id === id); if (!r) continue;
    const classes = Object.entries(LEXICON).filter(([, re]) => re.test(r.text)).map(([k]) => k);
    out.push({ law, id, classes, text: r.text });
    const words = r.text.replace(/^Services · /, '').toLowerCase();
    const src = hits.filter((h) => { const t = h.text.toLowerCase().split('…')[0]; return (t.length > 20 && words.includes(t.slice(0, 40))) || (words.length > 20 && t.includes(words.slice(0, 40))); });
    out[out.length - 1].source = src.map((h) => ({ file: h.file, line: h.line, pool: h.pool, status: h.status, crisisDeclared: h.crisisDeclared, via: h.via }));
    console.log(`lexicon ${law} ${id} ${classes.length ? classes.join(',') : 'MISS'} · source: ${src.map((h) => `${h.file}:${h.line} ${h.status}${h.crisisDeclared ? '+crisis' : ''} ${h.via.slice(0, 70)}`).join(' ; ') || '-'} · ${r.text.slice(0, 60)}`);
  }
  fs.writeFileSync(outPath.replace(/\.json$/, '.lexicon-controls.json'), JSON.stringify(out, null, 1));
}
