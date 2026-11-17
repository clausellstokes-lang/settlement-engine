// BIRTH-2-COUNT items 5-6: THE LINES THAT MUST AGREE for each kept source house on no ground. The barren houses are taken
// from the BASE corpus (kind (ii), its ground absent: q2land.mjs's `absent`); each is then read in the RULE's corpus (same
// seed, same name), where it stands with its cause: 'worked out' (its ground now on the record, every one spent) or
// 'bought in' (still no ground; the import named). Per cause and kind, what the record says beside it: the mark and its
// reading, the gap line, the shortage import / the bought-in import, an export naming its good, the made list naming it,
// an income share of its trade, the record's chains it works and their state, its own services (availableServices).
//   BASE=<base root> TIP=<rule root> BIRTH_RULE=… BIRTH_SHARE=… node docs/chair/2026-11-17/birth/probes/b2lines.mjs <base.gz> <rule.gz> [<out.json>]
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
import { kindOf } from './kinds.mjs';
import { landOf } from './q2land.mjs';
const load = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const arr = (x) => (Array.isArray(x) ? x : []);
const TIP = path.resolve(process.env.TIP);
const F = await import(TIP + '/src/domain/facts/houseInputAtHand.js');
const { resourceGapLines } = await import(TIP + '/src/domain/display/validationOnPage.js');
const { catalogIdForName } = await import(TIP + '/src/data/institutionalCatalog.js');
const GOOD = { stone_quarry: /stone|masonry/i, charcoal_burner: /charcoal|fuel/i, dairy_farmer: /dairy|cheese|butter|milk/i, salt_works: /\bsalt\b/i, mine: /ore|iron|coal/i, mine_open_cast: /ore|iron|coal/i, peat_cutter: /peat/i };
const INCOME = { stone_quarry: /Stone/, salt_works: /Salt/, mine: /Ore|Coal/, mine_open_cast: /Ore|Coal/, charcoal_burner: /Coal|Timber/ };
const [fb, ft, outFile] = process.argv.slice(2); const B = load(fb), T = load(ft);
const tally = {}; const examples = {}; const svc = {};
for (const [seed, sb] of B) {
  const st = T.get(seed); if (!st) continue;
  const short = F.housesShortOf(st), spent = F.housesOnSpentGround(st);
  const gaps = resourceGapLines(st).map((l) => String(l.impact));
  const es = st.economicState || {};
  for (const inst of arr(sb.institutions)) {
    if (!inst || typeof inst.name !== 'string' || inst.status === 'ruined') continue;
    const id = String(inst.catalogId || catalogIdForName(inst.name) || '');
    if (kindOf(id) !== 'ii' || !GOOD[id] || landOf(sb, id).land !== 'absent') continue;
    const now = arr(st.institutions).find((i) => i?.name === inst.name);
    const land = now ? landOf(st, id).land : null;
    const cause = !now ? 'removed' : land === 'depleted' ? 'worked out' : 'no ground (bought in, or no cause)';
    const g = GOOD[id], low = inst.name.toLowerCase();
    const r = {
      marked: short.has(inst.name), byGround: spent.has(inst.name),
      gapLine: gaps.some((x) => x.toLowerCase().includes(low.replace(/\s*\(.*\)/, ''))),
      shortageImport: arr(es.primaryImports).some((x) => /depleted|exhausted|cleared/.test(x) && (g.test(x) || (id === 'charcoal_burner' && /^Timber/.test(x)) || (id === 'dairy_farmer' && /^Livestock/.test(x)))),
      anyImport: arr(es.primaryImports).some((x) => g.test(x) || (id === 'charcoal_burner' && /^Timber/.test(x)) || (id === 'dairy_farmer' && /Fodder|Livestock/.test(x))),
      exportNamesIt: arr(es.primaryExports).some((x) => g.test(String(x))),
      madeNamesIt: arr(es.localProduction).some((x) => g.test(String(x))),
      incomeShare: INCOME[id] ? arr(es.incomeSources).some((x) => INCOME[id].test(String(x?.source ?? x))) : false,
      chainRunning: arr(es.activeChains).some((c) => arr(c?.processingInstitutions).includes(inst.name) && c?.status && c.status !== 'impaired'),
      services: Object.values(st.availableServices || {}).flat().filter((x) => String(x?.institution ?? '') === inst.name).length,
    };
    const k = `${cause} · ${id}`; const t = (tally[k] ||= { houses: 0 });
    for (const x of Object.values(st.availableServices || {}).flat()) if (String(x?.institution ?? '') === inst.name) (svc[id] ||= new Set()).add(String(x.name));
    t.houses++; for (const [f, v] of Object.entries(r)) if (v === true || (typeof v === 'number' && v > 0)) t[f] = (t[f] || 0) + 1;
    (examples[k] ||= []).length < 3 && examples[k].push(seed);
  }
}
const cols = ['marked', 'byGround', 'gapLine', 'shortageImport', 'anyImport', 'exportNamesIt', 'madeNamesIt', 'incomeShare', 'chainRunning', 'services'];
console.log(`| cause · kind | houses | ${cols.join(' | ')} | three towns |`); console.log(`|---|---|${cols.map(() => '---').join('|')}|---|`);
for (const [k, t] of Object.entries(tally).sort()) console.log(`| ${k} | ${t.houses} | ${cols.map((c) => t[c] || 0).join(' | ')} | ${examples[k].join(', ')} |`);
for (const [id, v] of Object.entries(svc)) console.log(`services of ${id}: ${[...v].join('; ')}`);
if (outFile) fs.writeFileSync(outFile, JSON.stringify({ tally, examples }, null, 1));
