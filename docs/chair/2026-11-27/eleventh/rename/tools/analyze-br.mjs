import { readFileSync } from 'node:fs';
const B = readFileSync('/tmp/rename/work/bundle-roads.mjs', 'utf8').split('\n'); const MM = JSON.parse(readFileSync('/tmp/rename/work/modmap-roads.json', 'utf8'));
const mod = (l) => { let m = '?'; for (const [a, b] of MM) { if (a <= l) m = b; else break; } return m.replace(/^.*?src\//, 'src/'); };
const GEN = /proseHash|drawDeclared|rename-harness/;
const site = (fr) => { for (const l of String(fr).split(',').map(Number)) { const m = mod(l); if (!GEN.test(m)) { const t = B[l - 1].trim().slice(0, 60); return `${m} @ ${t}`; } } return '?'; };
const strip = (k) => k.replace(/^dp-[a-z]+-\d+/, '<SEED>').replace(/^s_[0-9a-f]+/, '<ID>').replace(/dp_[a-z]+_\d+/g, '<seedslug>').replace(/s_[0-9a-f]{16}/g, '<idslug>');
const tot = { R2: { pages: 0, lines: 0, byView: {}, sites: {} }, R4: { pages: 0, lines: 0, byView: {}, sites: {} } }; const ex = [];
for (const ln of readFileSync('BR.jsonl', 'utf8').split('\n').filter(Boolean)) {
  const j = JSON.parse(ln);
  const bp = new Map(); for (const p of j.basePicks) { const [k, fr, key, ch] = p.split('\t'); bp.set(`${k}|${site(fr)}|${strip(key)}`, { key, ch }); }
  for (const r of ['R2', 'R4']) {
    const T = tot[r]; const d = j[r].diff; const n = Object.values(d).reduce((a, x) => a + x.came.length + x.gone.length, 0);
    if (n) T.pages++; T.lines += Object.values(d).reduce((a, x) => a + x.came.length, 0);
    for (const [v, x] of Object.entries(d)) { T.byView[v] = (T.byView[v] || 0) + x.came.length; if (ex.length < 12 && r === 'R2') ex.push({ seed: j.seed, v, gone: x.gone[0]?.slice(0, 160), came: x.came[0]?.slice(0, 160) }); }
    for (const p of j[r].picks) { const [k, fr, key, ch] = p.split('\t'); const s = site(fr); const id = `${k}|${s}|${strip(key)}`; const b = bp.get(id);
      const S = (T.sites[`${k} ${s}`] ||= { calls: 0, keyChanged: 0, moved: 0, exKey: null });
      S.calls++; if (!b) { S.keyChanged++; S.exKey ||= key; } }
    for (const [id, b] of bp) { const [k, s] = id.split('|'); const S = (T.sites[`${k} ${s}`] ||= { calls: 0, keyChanged: 0, moved: 0, exKey: null }); if (!j[r].picks.some((p) => { const [k2, fr2, key2] = p.split('\t'); return `${k2}|${site(fr2)}|${strip(key2)}` === id; })) S.baseOnly = (S.baseOnly || 0) + 1, S.exBaseKey ||= b.key; }
  }
}
for (const r of ['R2', 'R4']) { const T = tot[r]; console.log(r, 'pages moved', T.pages, 'of 10, lines', T.lines, JSON.stringify(T.byView));
  for (const [s, S] of Object.entries(T.sites)) if (S.keyChanged || S.baseOnly) console.log('   ', s, JSON.stringify(S)); }
console.log(JSON.stringify(ex, null, 0).slice(0, 3000));
