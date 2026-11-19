// TREE=<tree> OUT=<census out> node draw.mjs <findings.json> <word> <salt> [n=10] [quoteRegex]
// Ten distinct (town, sentence) findings of one word, ordered by sha256(salt|seed|quote), each with its town's record evidence.
import fs from 'node:fs'; import zlib from 'node:zlib'; import crypto from 'node:crypto';
const [file, word, salt, nArg, reArg] = process.argv.slice(2); const n = Number(nArg || 10);
const re = reArg ? new RegExp(reArg, 'i') : null;
const { factsOf } = await import(process.env.TREE + '/src/domain/facts/factsOf.js');
const { liveInstitutionNames } = await import(process.env.TREE + '/src/domain/facts/institutions.js');
const corpus = new Map(zlib.gunzipSync(fs.readFileSync(`${process.env.OUT}/corpus.ndjson.gz`)).toString().trim().split('\n').map((l) => { const r = JSON.parse(l); return [r.seed, r.s]; }));
const F = JSON.parse(fs.readFileSync(file, 'utf8')); const list = Array.isArray(F) ? F : F.findings;
const mine = list.filter((f) => f.word === word && (!re || re.test(f.quote)));
const uniq = new Map(); for (const f of mine) { const k = `${f.seed}|${f.quote}`; if (!uniq.has(k)) uniq.set(k, f); }
const h = (s) => crypto.createHash('sha256').update(`${salt}|${s}`).digest('hex');
const ordered = [...uniq.values()].sort((a, b) => (h(a.seed + '|' + a.quote) < h(b.seed + '|' + b.quote) ? -1 : 1));
console.log(`word ${word}: ${mine.length} findings, ${uniq.size} distinct (town, sentence), ${new Set(mine.map((f) => f.seed)).size} towns; salt "${salt}"`);
let i = 0;
for (const f of ordered.slice(0, n)) {
  const s = corpus.get(f.seed); const fa = factsOf(s); const names = liveInstitutionNames(s);
  const crisis = [].concat(s.stress || []).map((x) => x?.type || x).join(',') || 'calm';
  const ev = { tier: s.tier, pop: s.population, crisis, market: fa.market,
    roster: names.filter((x) => /market|fair|agora|bazaar|stall|alchem|apothec|herb|magic|wizard|mage|arcan|potion/i.test(x)).join(' · '),
    rosterSize: names.length, magic: s.config?.magicExists };
  console.log(`\n${++i}. ${f.seed} · ${f.view} · ${f.side}\n   "${f.quote.slice(0, 320)}"\n   ${JSON.stringify(ev)}`);
}
