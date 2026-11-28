// node an-ba.js <scratch> : per town, the printed lines that differ between base and cure (owner, share), the PDF and the Tonight sheet
const fs = require('fs'); const S = process.argv[2];
const read = (f) => new Map(fs.readFileSync(f, 'utf8').trim().split('\n').map(JSON.parse).map((l) => [l.seed, l]));
const strings = (v, out = []) => { if (typeof v === 'string') out.push(v); else if (Array.isArray(v)) v.forEach((x) => strings(x, out)); else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out)); return out; };
const diffViews = (a, b) => { const out = []; for (const v of new Set([...Object.keys(a || {}), ...Object.keys(b || {})])) { const A = new Set(a?.[v] || []), B = new Set(b?.[v] || []); for (const l of A) if (!B.has(l)) out.push(`${v} - ${l.slice(0, 110)}`); for (const l of B) if (!A.has(l)) out.push(`${v} + ${l.slice(0, 110)}`); } return out; };
const diffStr = (a, b) => { const A = strings(JSON.parse(a)), B = strings(JSON.parse(b)); const sa = new Set(A), sb = new Set(B); return [...A.filter((x) => !sb.has(x)).map((x) => `- ${x.slice(0, 110)}`), ...B.filter((x) => !sa.has(x)).map((x) => `+ ${x.slice(0, 110)}`)]; };
let towns = 0, ownerT = 0, shareT = 0, pdfT = 0, tonT = 0, errs = 0; const kinds = {};
for (const P of ['C', 'V']) {
  const base = read(`${S}/out/ba-base-${P}.jsonl`), cure = read(`${S}/out/ba-cure-${P}.jsonl`);
  for (const [seed, b] of base) {
    const c = cure.get(seed); towns++;
    if (b.error || !c || c.error) { errs++; console.log('ERR', P, seed, (b.error || c?.error || 'missing').slice(0, 200)); continue; }
    if (b.recordHash !== c.recordHash) console.log('RECORD MOVED', P, seed);
    const o = diffViews(b.views, c.views), s = diffViews(b.shareViews, c.shareViews), p = diffStr(b.pdf, c.pdf), t = b.tonight === c.tonight ? [] : diffStr(b.tonight, c.tonight);
    if (o.length) ownerT++; if (s.length) shareT++; if (p.length) pdfT++; if (t.length) tonT++;
    for (const [where, list] of [['owner', o], ['share', s], ['pdf', p], ['tonight', t]]) for (const x of list) { const k = `${where} ${x.replace(/^(\S+\/\S+ )?[-+] /, '$1').slice(0, 70)}`; kinds[k] = (kinds[k] || 0) + 1; }
    if (o.length || s.length || p.length || t.length) console.log(`${P}:${seed} owner ${o.length} share ${s.length} pdf ${p.length} tonight ${t.length}`);
  }
}
console.log(`towns ${towns} errors ${errs} | owner pages moved ${ownerT} | share ${shareT} | pdf ${pdfT} | tonight ${tonT}`);
for (const [k, v] of Object.entries(kinds).sort((a, b) => b[1] - a[1]).slice(0, 40)) console.log(v, k);
