// UPKEEP-11 step 1: which roster houses open each part where the label's own word is absent.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T = process.env.TREE;
const { defencePartsOf } = await import(T + '/src/generators/defenseGenerator.js');
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()), crlfDelay: Infinity });
const OPEN = { elders: /reeve|steward|elder|household council/i, alchemists: /alchemist|apothecary district/i, masons: /mason|quarr|stone/i };
const WORD = { elders: /reeve/i, alchemists: /alchemist/i, masons: /mason/i };
const o = {};
for await (const line of rl) {
  if (!line.trim()) continue; const { s } = JSON.parse(line);
  const ins = (s.institutions || []).map((i) => i.name);
  const ids = new Set(defencePartsOf(s).map((p) => p.id));
  for (const k of Object.keys(WORD)) if (ids.has(k) && !ins.some((n) => WORD[k].test(n))) {
    const key = k + ' :: ' + (ins.filter((n) => OPEN[k].test(n)).join(' + ') || '(none)'); o[key] = (o[key] || 0) + 1; }
}
console.log(o);
