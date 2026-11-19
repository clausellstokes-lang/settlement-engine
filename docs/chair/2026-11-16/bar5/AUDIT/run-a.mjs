/**
 * BAR5-AUDIT seat A runner: LAW 1 and LAW 4 over a PAGE-COPY render (`dumps/<seed>.txt` + `corpus.ndjson.gz`).
 *   node run-a.mjs <render-dir> <out.json> [<final72.json> <final75.json>]
 * Writes every instance, the counts by sub-law (towns, instances, distinct lines) and, given the evidence files,
 * the controls table (found or not). Reads the DOSSIER tabs only (tests/helpers/pageLaws/page.mjs).
 */
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../..');
const { parseDump, dossierTabs, fold } = await import(path.join(ROOT, 'tests/helpers/pageLaws/page.mjs'));
const { LAW1 } = await import(path.join(ROOT, 'tests/helpers/pageLaws/law1.mjs'));
const law4 = await import(path.join(ROOT, 'tests/helpers/pageLaws/law4.mjs'));
const { CONTROLS } = await import(path.join(ROOT, 'docs/chair/2026-11-16/bar5/AUDIT/controls-a.mjs'));
const [, , dir, outFile, f72, f75] = process.argv;
const { deriveMagicReliance } = await import(path.join(ROOT, 'src/domain/magicReliance.js'));
const { deriveMagicRelianceView } = await import(path.join(ROOT, 'src/domain/display/dossierViewModel.js'));
const { foodWordShown } = await import(path.join(ROOT, 'src/domain/display/foodWordShown.js'));
const { impliedGroundsShown } = await import(path.join(ROOT, 'src/domain/facts/supplyStory.js'));
const { THINGS, NEW_WORDS } = await import(path.join(ROOT, 'src/domain/facts/registeredWords.js'));
const facts = [];
const DETECTORS = { ...LAW1, ...law4.LAW4 };
/**
 * LEFT-KEYS K6 (a), 2026-11-18: THE REGISTER'S READER OF A GROUND reads the STORED RECORD'S GROUNDS, listed AND proven. The
 * register's `resource:` reader (`registeredWords.js`) asks only `config.nearbyResources` less the depleted list, so a ground
 * the supply rule PROVED at the birth (BIRTH-3: a source house on no ground of its own proves its ground, there or used up;
 * the Resources tab prints it) read as lacked, and so did a spent ground the line itself tells as spent. A `4r-thing:resource:`
 * row stands only where the town holds the ground in no form: not listed live, not proven there, and, where it is listed or
 * proven used up, not told as spent IN THE CELL OR SENTENCE OF THE LINE THAT NAMES IT (by the register's own word for it).
 * (The src reader is not this seat's: a reading here, counted apart.)
 */
const SPENT_WORDS = /\b(?:depleted|exhausted|worked out|used up|spent|cleared|nothing more can be taken|no longer|little is left|is gone|are gone)\b/i;
function groundHeld(record, key, line) {
  const cfg = record?.config || {};
  const near = new Set((Array.isArray(cfg.nearbyResources) ? cfg.nearbyResources : []).map(String));
  const gone = new Set((Array.isArray(cfg.nearbyResourcesDepleted) ? cfg.nearbyResourcesDepleted : []).map(String));
  let proven = { there: [], used: [] };
  try { proven = impliedGroundsShown(record); } catch { /* a record the leaf cannot read proves nothing */ }
  if ((near.has(key) && !gone.has(key)) || proven.there.includes(key)) return 'held';
  const word = (NEW_WORDS[`resource: ${key}`] || THINGS[`resource: ${key}`])?.words;
  const units = String(line).split(' · ').flatMap((cell) => cell.split(/(?<=[.!?])\s+/));
  if ((gone.has(key) || proven.used.includes(key)) && units.some((u) => (!word || word.test(u)) && SPENT_WORDS.test(u))) return 'told spent';
  return null;
}
const RESOURCE_ROW = /^4r-thing:resource: (.+)$/;
const clearedK6a = [];
const corpus = new Map(zlib.gunzipSync(fs.readFileSync(path.join(dir, 'corpus.ndjson.gz'))).toString().split('\n').filter(Boolean).map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const instances = []; const pages = new Map(); const named = {};
for (const f of fs.readdirSync(path.join(dir, 'dumps')).sort()) {
  const town = f.replace(/\.txt$/, '');
  const { tabs } = parseDump(fs.readFileSync(path.join(dir, 'dumps', f), 'utf8'));
  const t = { record: corpus.get(town), tabs: dossierTabs(tabs), town }; pages.set(town, Object.values(t.tabs).flat().map(fold));
  for (const [name, d] of Object.entries(DETECTORS)) for (const x of d(t)) {
    const r = RESOURCE_ROW.exec(x.law); const held = r ? groundHeld(t.record, r[1], x.line) : null;
    if (held) { clearedK6a.push({ detector: name, ...x, cleared: held }); continue; }
    instances.push({ detector: name, ...x });
  }
  for (const [thing, re] of Object.entries(law4.NAMES_4N)) for (const ls of Object.values(t.tabs)) for (const l of ls) if (re.test(l)) { const e = (named[thing] ||= { towns: new Set(), lines: new Set() }); e.towns.add(town); e.lines.add(l.trim()); }
  const s = t.record; const page = (re) => { for (const ls of Object.values(t.tabs)) for (const l of ls) { const m = re.exec(l); if (m) return m[1]; } return null; };
  const fsec = s?.economicState?.foodSecurity || {};
  facts.push({ town, magicRecord: deriveMagicReliance(s).reading, magicShown: deriveMagicRelianceView(s).reading, magicPage: page(/^Reliance on magic: (None|Present|Relied upon|Integral)\b/), defenceFlag: s?.defenseProfile?.magicDependency ?? null,
    foodLabel: fsec.label ?? null, foodBand: fsec.foodRecord?.band ?? null, gapPct: fsec.foodRecord?.gapPct ?? null, foodShown: foodWordShown(s)?.label ?? null, foodPage: page(/^Food Security · ([A-Za-z-]+)/) });
}
const towns = fs.readdirSync(path.join(dir, 'dumps')).length;
const by = (key) => { const m = {}; for (const x of instances) { const k = key(x); (m[k] ||= []).push(x); } return m; };
const shape = (line) => fold(line).replace(/\b[a-z]+(?:ochorion|kastro|valli|ium)\b/g, '{name}');
const counts = Object.fromEntries(Object.entries(by((x) => x.law)).sort().map(([k, xs]) => [k, { towns: new Set(xs.map((x) => x.town)).size, instances: xs.length, distinct: new Set(xs.map((x) => x.line.trim())).size }]));
const lawKey = (x) => (x.law.startsWith('4r') ? x.law.split(':')[0] : x.law.slice(0, 2));
const lawTop = Object.fromEntries(Object.entries(by(lawKey)).map(([k, xs]) => {
  const m = {}; for (const x of xs) { (m[x.line.trim()] ||= new Set()).add(x.town); }
  return [k, { towns: new Set(xs.map((x) => x.town)).size, instances: xs.length, distinct: Object.keys(m).length, subs: [...new Set(xs.map((x) => x.law))].length, top: Object.entries(m).sort((a, b) => b[1].size - a[1].size).slice(0, 30).map(([l, s]) => ({ towns: s.size, line: l })) }];
}));
let controls = null;
if (f72) {
  const rowsOf = (f) => { const j = JSON.parse(fs.readFileSync(f, 'utf8')); return Array.isArray(j) ? j : Object.values(j).find(Array.isArray); };
  const rows = [...rowsOf(f72), ...(f75 ? rowsOf(f75) : [])];
  controls = CONTROLS.map((c) => {
    const r = rows.find((x) => x.id === c.id);
    const want = fold(String(r.text).replace(/^"/, '')).slice(0, 70);
    const found = instances.filter((x) => x.town === r.town && fold(x.line).includes(want) && x.law.startsWith(c.law));
    const inTowns = corpus.has(r.town); const whole = fold(String(r.text).replace(/^"/, '')).replace(/[."]+$/, '').slice(0, 160); const printed = inTowns && pages.get(r.town).some((l) => l.includes(whole));
    return { ...c, town: r.town, verdict: r.verdict || r.class, text: String(r.text).slice(0, 140), rendered: inTowns, printed, found: found.length > 0, as: found.map((x) => x.law) };
  });
}
const tally = (f) => { const m = {}; for (const x of facts) { const k = f(x); m[k] = (m[k] || 0) + 1; } return m; };
const splits = { magic: tally((x) => `record ${x.magicRecord} · shown ${x.magicShown} · page ${x.magicPage} · defenceFlag ${x.defenceFlag}`), food: tally((x) => `label ${x.foodLabel} · band ${x.foodBand} · shown ${x.foodShown} · page ${x.foodPage}`) };
const namedAt = Object.fromEntries(Object.entries(named).map(([k, e]) => [k, { townsNaming: e.towns.size, distinctLines: e.lines.size, townsWithout: new Set(instances.filter((x) => x.law === '4n-' + k).map((x) => x.town)).size }]));
fs.writeFileSync(outFile, JSON.stringify({ towns, counts, lawTop, splits, namedAt, controls, facts, instances, clearedK6a }, null, 1));
console.log(`  (K6 (a): ${clearedK6a.length} 4r-thing:resource rows cleared by the stored grounds: ${clearedK6a.filter((x) => x.cleared === 'held').length} held, ${clearedK6a.filter((x) => x.cleared === 'told spent').length} told spent)`);
console.log(`towns ${towns} · instances ${instances.length}`);
for (const [k, v] of Object.entries(counts)) console.log(`  ${k}: towns ${v.towns} · instances ${v.instances} · distinct ${v.distinct}`);
if (controls) for (const c of controls.filter((c) => c.rendered)) console.log(`  ${c.found ? 'FOUND' : '-----'} ${c.printed ? 'printed' : 'NOT-PRINTED'} ${c.id} ${c.verdict} want:${c.expect} law:${c.law} ${c.as.join(',')} :: ${c.text.slice(0, 80)}`);
