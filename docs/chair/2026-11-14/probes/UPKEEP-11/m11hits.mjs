// UPKEEP-11, step 1: each fresh hit's text, where it prints on a gz corpus ({seed, s}), and where the walker's own
// absence reader (registeredWords THINGS[thing].absent over factsOf and the live roster) says the town lacks the thing.
// usage: TREE=<tree> node m11hits.mjs <corpus.gz> [--ex]
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T = process.env.TREE;
const { factsOf } = await import(T + '/src/domain/facts/factsOf.js');
const { liveInstitutionNames } = await import(T + '/src/domain/facts/institutions.js');
const { REGISTERED_WORDS: THINGS } = await import(T + '/src/domain/facts/registeredWords.js');
const { isPrinted } = await import(T + '/tests/lint/presumedThings.shared.mjs');
const HITS = [
  ['garrison', 'The garrison is present and responsive.'],
  ['watch', 'The watch is present and responsive.'],
  ['militia', 'The militia is present and responsive.'],
  ['house: street gang', 'A street gang controls part of the place, extorting local businesses and residents.'],
  ['mercenary', 'A mercenary company provides enforcement: professional and effective, but loyal to the contract, not the community.'],
  ['garrison', 'Hired swords back the garrison when the purse allows.'],
  ['garrison', 'Hired swords back the garrison.'],
  ["house: adventurers' charter", "The adventurers' charter hall takes bounty work against threats, as far as the purse runs."],
  ["house: adventurers' charter", "The adventurers' charter hall coordinates emergency response to threats."],
  ["house: adventurers' charter", "The adventurers' charter hall takes bounty work against threats, but the coin for bounties runs short."],
  ['house: hedge wizard', 'Traveling hedge wizard'],
  ['militia', ' and a citizen militia to hold it.'],
  ['house: alchemist', 'The local alchemist supplements conventional trade.'],
  ['mason', 'Stone masons work imported material'],
  ['temple', 'Mandatory tithes plus rent income from church-owned land'],
];
const leaves = (v, p, out) => { if (typeof v === 'string') out.push([p, v]); else if (Array.isArray(v)) for (const x of v) leaves(x, `${p}[]`, out); else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) leaves(x, `${p}.${k}`, out); return out; };
const out = HITS.map(([thing, text]) => ({ thing, text: text.slice(0, 70), prints: 0, absent: 0, paths: {}, ex: [], tiers: {} }));
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()), crlfDelay: Infinity });
let n = 0;
for await (const line of rl) {
  if (!line.trim()) continue; n++;
  const { seed, s } = JSON.parse(line);
  const L = leaves(s, '', []).filter(([p]) => isPrinted(p));
  let facts = null, names = null;
  HITS.forEach(([thing, text], i) => {
    const at = L.filter(([, v]) => v.includes(text.trim()));
    if (!at.length) return;
    const o = out[i]; o.prints++; o.tiers[s.tier] = (o.tiers[s.tier] || 0) + 1;
    for (const [p] of at) o.paths[p] = (o.paths[p] || 0) + 1;
    facts ??= factsOf(s); names ??= liveInstitutionNames(s);
    if (THINGS[thing].absent(facts, names)) { o.absent++; if (o.ex.length < 4) o.ex.push(seed); }
  });
}
console.log(JSON.stringify({ births: n, out }, null, 1));
