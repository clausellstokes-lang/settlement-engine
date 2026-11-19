// node bm.mjs <out>: the journal's "Black market (operational)" row: towns; with a Black market house on the roster; whether each tab view prints the chain
import fs from 'node:fs'; import zlib from 'node:zlib';
const out = process.argv[2]; const rec = {};
for (const l of zlib.gunzipSync(fs.readFileSync(out + '/corpus.ndjson.gz')).toString().split('\n')) { if (!l) continue; const o = JSON.parse(l); rec[o.seed] = o.s; }
const views = (t) => { const V = {}; let cur = '_'; for (const line of t.split('\n')) { const m = /^== (.+) ==$/.exec(line); if (m) { cur = m[1]; V[cur] = []; } else (V[cur] ||= []).push(line); } return V; };
const c = { journal: 0, house: 0, noHouse: 0, tabEcoPrints: 0, tabEcoPrintsNoHouse: 0 }; const tabViews = {}; const ex = [];
for (const f of fs.readdirSync(out + '/dumps')) { const seed = f.replace(/\.txt$/, ''); const V = views(fs.readFileSync(`${out}/dumps/${f}`, 'utf8'));
  if (!(V['Journal/Economics & Trade'] || []).includes('Black market (operational)')) continue; c.journal++;
  const s = rec[seed]; const house = (s.institutions || []).some((i) => /^black market/i.test(i.name)); house ? c.house++ : c.noHouse++;
  const tv = Object.keys(V).filter((v) => !/^(PDF|Journal|Table)\//.test(v) && V[v].some((x) => /^Black market/.test(x.trim())));
  for (const v of tv) tabViews[v] = (tabViews[v] || 0) + 1;
  const eco = tv.some((v) => /Econom/i.test(v)); if (eco) { c.tabEcoPrints++; if (!house) c.tabEcoPrintsNoHouse++; }
  if (!house && ex.length < 6) { const ch = s.economicState.activeChains.find((x) => x.chainId === 'black_market'); ex.push(`${seed} ${s.tier} ${s.population}: houses ${(ch?.processingInstitutions || []).join('/')} | roster crime: ${(s.institutions || []).filter((i) => /thie|smugg|fence|front|crim|guild of/i.test(i.name)).map((i) => i.name).join(', ')} | tab views: ${tv.join(', ') || 'none'}`); } }
console.log(c); console.log('tab views printing a "Black market" line:', tabViews); ex.forEach((e) => console.log('  ' + e));
