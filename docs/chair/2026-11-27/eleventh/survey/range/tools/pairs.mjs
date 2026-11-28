// RANGE-MEASURE (C)(ii): sentences on one page that may say the same thing twice in other words (script candidates).
// node pairs.mjs <keys.json> <out.json> <seed> <name>:<matched.jsonl> ...
// A candidate: two different non-chrome sentences of one page whose content stems overlap (overlap coefficient >= 0.5 with
// 3+ shared stems, or Jaccard >= 0.4 with 2+), not from the same template. 30 pages are drawn (5 a size) for reading.
import { readFileSync, writeFileSync, createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
const [KEYS, OUT, SEED, ...CORP] = process.argv.slice(2);
const { keys, code } = JSON.parse(readFileSync(KEYS, 'utf8'));
const fileOf = (a) => (!a ? '' : a[0] === 'K' ? keys[+a.slice(1).split('.')[0]].file : code[+a.slice(1)].site.split(':')[0]);
const chromeA = (a) => a && (/^src\/(copy|components|pdf)\//.test(fileOf(a)) || (a[0] === 'X' && code[+a.slice(1)].jsx));
const STOP = new Set(`a an the and or but nor of to in on at by for with from as into onto than then so if when where while about over under out up down off here there place town thorp hamlet village city metropolis settlement is are was were be been being has have had do does did will would could should can may might must it its they them their he him his she her we us our you your i me my one this that these those what who which all any each every some most more many much no not never also still even just only very too now`.split(/\s+/));
const stem = (w) => w.replace(/'s$/, '').replace(/(ies)$/, 'y').replace(/(ing|ed|ly|es|s)$/, '');
const cs = (t) => new Set((t.toLowerCase().replace(/[‘’]/g, "'").match(/[a-z']+/g) || []).filter((w) => w.length > 2 && !STOP.has(w)).map(stem).filter((w) => w.length > 2));
let s = 0; for (const c of SEED) s = (s * 31 + c.charCodeAt(0)) >>> 0;
const rnd = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const all = []; const perSize = {};
for (const spec of CORP) {
  const [name, f, nf] = spec.split(':');
  const NAMES = nf ? JSON.parse(readFileSync(nf, 'utf8')).names : {}; const GEN = nf ? JSON.parse(readFileSync(nf, 'utf8')).generic : [];
  const rl = createInterface({ input: createReadStream(f), crlfDelay: Infinity });
  for await (const L of rl) {
    if (!L) continue; const r = JSON.parse(L); if (r.error) continue;
    const ss = []; const seen = new Set();
    const nameStems = new Set([...(NAMES[r.seed] || []), ...GEN].flatMap((n) => [...cs(n)]));
    for (const [tab, t, a] of r.sents) { if (chromeA(a) || seen.has(t)) continue; seen.add(t); ss.push({ tab, t, a, c: new Set([...cs(t)].filter((w) => !nameStems.has(w))) }); }
    const cands = [];
    for (let i = 0; i < ss.length; i++) for (let j = i + 1; j < ss.length; j++) {
      const A = ss[i]; const B = ss[j]; if (A.a && A.a === B.a) continue;
      let inter = 0; for (const w of A.c) if (B.c.has(w)) inter++;
      if (inter < 2) continue;
      const O = inter / Math.min(A.c.size, B.c.size); const J = inter / (A.c.size + B.c.size - inter);
      if ((O >= 0.5 && inter >= 3) || (J >= 0.4)) cands.push({ O: +O.toFixed(2), J: +J.toFixed(2), a: [A.tab, A.t, A.a], b: [B.tab, B.t, B.a] });
    }
    const row = { corpus: name, seed: r.seed, size: r.size, sents: ss.length, cands };
    all.push({ corpus: name, seed: r.seed, size: r.size, sents: ss.length, n: cands.length });
    (perSize[r.size] ||= []).push(row);
  }
}
const pick = [];
for (const [size, rows] of Object.entries(perSize)) {
  const sh = rows.map((r) => ({ r, k: rnd() })).sort((a, b) => a.k - b.k).slice(0, 5).map((x) => x.r);
  pick.push(...sh);
}
writeFileSync(OUT, JSON.stringify({ all, pick }));
const bySize = {}; for (const r of all) { const z = (bySize[r.size] ||= { pages: 0, cands: 0, sents: 0 }); z.pages++; z.cands += r.n; z.sents += r.sents; }
console.log(bySize);
