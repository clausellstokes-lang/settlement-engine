// UPKEEP-11, step 1: the defence part labels (DEFENCE_WORDS masons, elders, alchemists) where defencePartsOf lists them, on a gz corpus, against the roster.
// usage: TREE=<tree> node m11dw.mjs <corpus.gz>
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T = process.env.TREE;
const { defencePartsOf } = await import(T + '/src/generators/defenseGenerator.js');
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()), crlfDelay: Infinity });
const RE = { masons: /mason|stone ?cutter|quarr/i, elders: /reeve|elder|headman|village council|moot/i, alchemists: /alchem/i };
const out = {}; const ex = {};
for await (const line of rl) {
  if (!line.trim()) continue;
  const { seed, s } = JSON.parse(line);
  const names = (s.institutions || []).map((i) => i.name).join(' | ');
  const ids = new Set(defencePartsOf(s).map((p) => p.id));
  for (const k of Object.keys(RE)) {
    if (!ids.has(k)) continue;
    const o = (out[k] ||= { listed: 0, rosterHas: 0, byTier: {} }); o.listed++;
    if (RE[k].test(names)) o.rosterHas++; else { o.byTier[s.tier] = (o.byTier[s.tier] || 0) + 1; (ex[k] ||= []).length < 3 && ex[k].push(seed); }
  }
}
console.log(JSON.stringify({ out, ex }, null, 1));
