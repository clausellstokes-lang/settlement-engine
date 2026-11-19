// node readlines.mjs <diff.json> left|entered <corpus.ndjson.gz> — each line with its town's tier, population, powers, roster names
import fs from 'node:fs'; import zlib from 'node:zlib';
const [diff, side, corpusP] = process.argv.slice(2);
const d = JSON.parse(fs.readFileSync(diff, 'utf8'));
const lines = side === 'left' ? d.leftLines : d.enteredLines;
const want = new Set(lines.map((l) => l.seed));
const rec = new Map();
for (const l of zlib.gunzipSync(fs.readFileSync(corpusP)).toString().trim().split('\n')) { const o = JSON.parse(l); if (want.has(o.seed)) rec.set(o.seed, o.s); }
for (const l of lines) {
  const s = rec.get(l.seed) || {};
  const powers = (s.powerStructure?.factions || []).map((f) => f.faction || f.name);
  const names = (s.institutions || []).map((i) => i.name);
  console.log(JSON.stringify({ seed: l.seed, word: l.word, quote: l.quote, tier: s.tier, pop: s.population, powers, roster: process.env.ROSTER ? names.filter((n) => new RegExp(process.env.ROSTER, 'i').test(n)) : undefined }));
}
