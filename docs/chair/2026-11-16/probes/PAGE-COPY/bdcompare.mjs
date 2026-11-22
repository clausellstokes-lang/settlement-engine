// CENSUS-2, by the chair's ruling (2026-11-13 20:50Z): the instrument lane's page list (lane/w2-b-declare-2026-11-12,
// src/domain/coherence/vocabularyPageFindings.js over src/domain/facts/registeredWords.js) run on the SAME pages and
// records as CENSUS-2 (the readers' 80 towns re-born and re-rendered at the counted tree), and both joined to the cold
// readers' lines of the kinds they share (a: names what the town lacks; c: a size; e: denies what the town has).
// Read only: the lane's module is imported from a scratch worktree of that lane; nothing is changed or copied.
//   node bdcompare.mjs <bd-tree> <readers-out-dir> <ROUND-3-CUT.json> <ROUND-3-CUT-INCREMENT.json>
import fs from 'node:fs';
import { loadCorpus, views as viewsOf } from './load.mjs';
import { MECH } from './mech.mjs';
const [BD, OUTD, cutF, incF] = process.argv.slice(2);
const { vocabularyPageFindings } = await import(BD + '/src/domain/coherence/vocabularyPageFindings.js');
const corpus = loadCorpus(OUTD + '/corpus.ndjson.gz');
const norm = (t) => String(t).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
const F = {}; let n = 0, errs = 0;
for (const { seed, s } of corpus) { const V = viewsOf(fs.readFileSync(`${OUTD}/dumps/${seed}.txt`, 'utf8')); delete V._;
  try { F[seed] = vocabularyPageFindings(s, V).map((f) => ({ ...f, q: norm(f.quote) })); n += F[seed].length; } catch (e) { errs++; F[seed] = []; console.error(seed, e.message.slice(0, 120)); } }
const H = JSON.parse(fs.readFileSync(OUTD + '/hits.json', 'utf8')); const mine = {}; for (const h of H) (mine[`${h.seed}|${norm(h.line)}`] ||= new Set()).add(h.pattern);
const cut = JSON.parse(fs.readFileSync(cutF, 'utf8')).lines.map((x) => ({ ...x, id: `cut#${x.n}` }));
const inc = JSON.parse(fs.readFileSync(incF, 'utf8')).lines.map((x) => ({ ...x, id: `${x.list}#${x.i}` }));
const dl = {}; const lines = (seed) => dl[seed] ??= fs.readFileSync(`${OUTD}/dumps/${seed}.txt`, 'utf8').split('\n').filter((l) => !/^== /.test(l)).map(norm);
const rows = {}; const ex = {};
for (const x of [...cut, ...inc]) { if (!F[x.town]) continue; const sn = norm(x.sentence); const where = lines(x.town).filter((l) => l.includes(sn)); if (!where.length) continue;
  for (const k of ['a', 'c', 'e']) { if (!MECH[k](x)) continue; const r = (rows[k] ||= { printing: 0, both: 0, mineOnly: 0, bdOnly: 0, neither: 0, bdAny: 0, mineAny: 0 }); r.printing++;
    const m = where.some((l) => mine[`${x.town}|${l}`]?.has(k)); const mAny = where.some((l) => mine[`${x.town}|${l}`]?.size);
    const b = F[x.town].some((f) => sn.includes(f.q) || f.q.includes(sn) || where.some((l) => l.includes(f.q)));
    if (m && b) r.both++; else if (m) r.mineOnly++; else if (b) r.bdOnly++; else r.neither++; if (b) r.bdAny++; if (mAny) r.mineAny++;
    const key = m && !b ? 'mineOnly' : b && !m ? 'bdOnly' : null; if (key) ((ex[k] ||= {})[key] ||= []).push(`${x.id} ${x.tab} | ${x.sentence.slice(0, 110)}`); } }
console.log(`bd page list (${BD}): ${n} findings on ${corpus.length} towns; ${errs} towns threw`);
const words = {}; for (const fs2 of Object.values(F)) for (const f of fs2) words[`${f.side}:${f.word}`] = (words[`${f.side}:${f.word}`] || 0) + 1;
console.log('its findings by word:', Object.entries(words).sort((a, b) => b[1] - a[1]).slice(0, 25).map(([w, c]) => `${w} ${c}`).join(', '));
for (const [k, r] of Object.entries(rows)) { console.log(`kind ${k}: readers' lines printing ${r.printing}: both ${r.both} · CENSUS-2 only ${r.mineOnly} · page list only ${r.bdOnly} · neither ${r.neither}  (CENSUS-2 recall ${r.both + r.mineOnly}, page list recall ${r.bdAny})`);
  for (const [kk, v] of Object.entries(ex[k] || {})) for (const l of v.slice(0, 4)) console.log(`   ${kk}: ${l}`); }
fs.writeFileSync(OUTD + '/bdcompare.json', JSON.stringify({ rows, ex, words }, null, 1));
