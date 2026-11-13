// REVIEW-W2B-3: a top-up of the ROLE words the whole-list draw read below nine in ten (smith, prisoner, physician, guard
// captain, notary, mason, armoury): ten more (town, sentence) by the same salt, none already drawn. Then the exact count of
// the powers-count hedge ("two or three powers" where the town holds two or more).
//   TREE=<tip> OUT=<census out> node drawrole.mjs <pm.json> <draw.json> <out.json>
import fs from 'node:fs'; import zlib from 'node:zlib'; import crypto from 'node:crypto';
const SALT = 'review-w2b-3-precision-2026-11-13';
const res = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); const prev = JSON.parse(fs.readFileSync(process.argv[3], 'utf8')).drawn;
const done = new Set(prev.map((e) => `${e.seed}\t${e.quote}`));
const ROLE = new Set(['smith', 'prisoner', 'physician', 'guardCaptain', 'notary', 'mason', 'armoury']);
const h = (s) => crypto.createHash('sha256').update(s).digest('hex');
const m = new Map(); for (const f of res.findings) if (ROLE.has(f.word)) { const k = `${f.seed}\t${f.quote}`; if (!done.has(k) && !m.has(k)) m.set(k, f); }
const pick = [...m.values()].sort((a, b) => (h(`${SALT}|${a.seed}|${a.quote}`) < h(`${SALT}|${b.seed}|${b.quote}`) ? -1 : 1)).slice(0, 10);
const recs = new Map(); for (const l of zlib.gunzipSync(fs.readFileSync(`${process.env.OUT}/corpus.ndjson.gz`)).toString().trim().split('\n')) { const o = JSON.parse(l); recs.set(o.seed, o.s); }
const { liveInstitutionNames } = await import(process.env.TREE + '/src/domain/facts/institutions.js');
const out = pick.map((f, i) => { const s = recs.get(f.seed); const dump = fs.readFileSync(`${process.env.OUT}/dumps/${f.seed}.txt`, 'utf8').split('\n'); const at = dump.findIndex((l) => l.includes(f.quote.slice(0, 60)));
  return { n: `R${i + 1}`, word: f.word, view: f.view, seed: f.seed, source: f.source, file: f.file, quote: f.quote, tier: s.tier, population: s.population,
    roster: liveInstitutionNames(s), npcRoles: (s.npcs || []).map((c) => c.role).filter(Boolean).slice(0, 30), context: at < 0 ? [] : dump.slice(Math.max(0, at - 1), at + 2).map((l) => l.slice(0, 250)) }; });
const pc = res.findings.filter((f) => f.word === 'powersCount');
const hedge = pc.filter((f) => /two or three powers/i.test(f.quote));
const n = (seed) => (recs.get(seed)?.powerStructure?.factions || []).length;
const powers = { powersCountLines: pc.length, hedgeLines: hedge.length, hedgeWithTwoOrMore: hedge.filter((f) => n(f.seed) >= 2).length, hedgeWithOne: hedge.filter((f) => n(f.seed) < 2).length };
fs.writeFileSync(process.argv[4], JSON.stringify({ salt: SALT, roleLinesOnPage: m.size + prev.filter((e) => e.words.some((w) => ROLE.has(w.split('/')[0]))).length, drawn: out, powers }, null, 1));
console.log(JSON.stringify(powers));
for (const e of out) console.log(`${e.n} [${e.word}] ${e.view} ${e.seed} ${e.tier} ${e.population} (${e.source} ${e.file})\n   Q: ${e.quote}\n   roster: ${e.roster.join('; ').slice(0, 500)}\n   npcs: ${e.npcRoles.join('; ').slice(0, 200)}\n   C: ${e.context.join(' || ').slice(0, 300)}`);
