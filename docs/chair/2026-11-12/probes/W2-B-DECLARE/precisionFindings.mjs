// TREE=<tree> OUT=<census out> node findings.mjs <out.json>  — every page finding on the 720, with its family; prints counts only.
import fs from 'node:fs'; import zlib from 'node:zlib';
const TREE = process.env.TREE, OUT = process.env.OUT;
const { vocabularyPageFindings } = await import(TREE + '/src/domain/coherence/vocabularyPageFindings.js');
const RW = await import(TREE + '/src/domain/facts/registeredWords.js');
const family = (w) => {
  if (w.startsWith('house: ')) return 'house'; if (w.startsWith('resource: ')) return 'resource';
  if (RW.THINGS[w]) return 'thing';
  if (['clergy','armedForce','guardCaptain','notary','smith','mason','physician','armoury','prisoner'].includes(w)) return 'role';
  if (['openTrade','famineToCome'].includes(w)) return 'normal';
  const k = RW.NEW_WORDS[w]?.kind; return k === 'thing' ? 'handthing' : k;
};
const corpus = zlib.gunzipSync(fs.readFileSync(`${OUT}/corpus.ndjson.gz`)).toString().trim().split('\n').map((l) => JSON.parse(l));
const views = (txt) => { const o = {}; let cur = '_'; for (const l of txt.split('\n')) { const m = l.match(/^== (.*) ==/); if (m) { cur = m[1]; o[cur] = []; continue; } if (l) (o[cur] ||= []).push(l); } return o; };
const out = []; let read = 0;
for (const { seed, s } of corpus) {
  let txt; try { txt = fs.readFileSync(`${OUT}/dumps/${seed}.txt`, 'utf8'); } catch { continue; } read++;
  for (const f of vocabularyPageFindings(s, views(txt))) out.push({ seed, fam: family(f.word), ...f });
}
fs.writeFileSync(process.argv[2], JSON.stringify(out));
const c = {}; for (const f of out) c[f.fam] = (c[f.fam] || 0) + 1;
const w = {}; for (const f of out) w[f.word] = (w[f.word] || 0) + 1;
console.log('read', read, 'findings', out.length, 'towns', new Set(out.map((f) => f.seed)).size);
console.log('by family', JSON.stringify(c));
console.log('top words', JSON.stringify(Object.entries(w).sort((a, b) => b[1] - a[1]).slice(0, 40)));
