// R5-DESC-MEASURE: the census query over the arm shards (M1 (c) strict on served descs: pages, towns, the distinct sentences; dmNote served; the masked tension party).   node q-desc-kind.mjs <arm outdir>
import { readFileSync, readdirSync } from 'node:fs';
const dir = process.argv[2];
const towns = readdirSync(dir).filter((f) => /^arm-shard\d+\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')).towns);
const J = JSON.stringify;
// pages (sv, by read) with a strict kind hit in a served desc; towns; and a(W) pages
const r = { off: { pages: 0, strings: 0, towns: new Set() }, dm: { pages: 0, strings: 0, towns: new Set() } };
const wP = { off: 0, dm: 0 }; let wStr = 0;
for (const t of towns) for (const [k, p] of Object.entries(t.pages)) { if (!k.endsWith('|sv')) continue; const d = k.split('|')[0];
  if (p.W.length) { wP[d] += 1; wStr += p.m1['powerStructure.factions[].desc']?.[0] || 0; }
  const c = p.cs['powerStructure.factions[].desc']; if (c) { r[d].pages += 1; r[d].strings += c.n; r[d].towns.add(t.seed); } }
console.log('W pages sv', J(wP), 'served desc strings on W pages (sv)', wStr);
for (const d of ['off', 'dm']) console.log(d, 'strict-kind desc pages', r[d].pages, 'strings', r[d].strings, 'towns', r[d].towns.size);
// distinct sentences: from ex where cs... ex lacks cs; use cs.ex (2 per page per path)
const sent = new Map();
for (const t of towns) for (const [k, p] of Object.entries(t.pages)) { if (!k.endsWith('|sv')) continue; for (const e of p.cs['powerStructure.factions[].desc']?.ex || []) for (const s of e.split(/(?<=[.;])\s+/)) if (/criminal|thiev|smuggl|underworld|cartel|bandit|assassin/i.test(s)) sent.set(s, (sent.get(s) || 0) + 1); }
for (const [s, n] of [...sent].sort((a, b) => b[1] - a[1])) console.log(n, s.slice(0, 200));
// dmNote by read
let dmn = { off: 0, dm: 0 }; for (const t of towns) for (const [k, p] of Object.entries(t.pages)) if (k.endsWith('|sv')) dmn[k.split('|')[0]] += p.m1['powerStructure.factionRelationships[].dmNote']?.[0] || 0;
console.log('dmNote served (sv)', J(dmn));
// masked tension party
for (const t of towns) { const ps = Object.entries(t.pages).filter(([k, p]) => p.wide?.['history.currentTensions[].factions[]']?.[2]); if (ps.length) console.log('mask party', t.seed, ps.length, J(t.recH), J(ps.map(([k]) => k).slice(0, 3))); }
