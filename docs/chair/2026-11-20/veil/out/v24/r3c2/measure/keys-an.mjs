// keys-an.mjs <dir>: the Defense key per town (keys.probe.jsx's shards): per engine and Reveal setting, EQUAL / LOWER / HIGHER
// against the house-free counterfactual; each differing town with its drivers and the field whose counterfactual value alone closes the gap.
import { readFileSync } from 'node:fs';
const dir = process.argv[2]; const R = { organized: 3, 'semi-organized': 2, diffuse: 1, null: 0 };
const towns = [0, 1, 2, 3].flatMap((s) => JSON.parse(readFileSync(`${dir}/shard${s}.json`, 'utf8')));
const withB = towns.filter((t) => t.reads);
console.log(`births ${towns.length}; with a hidden house and a counterfactual ${withB.length}; threw ${towns.filter((t) => t.threw || t.Bthrew).length}`);
const tally = {}; const lines = []; const magic = [];
for (const t of withB) for (const [k, r] of Object.entries(t.reads)) {
  const c = R[String(r.key)] === R[String(r.cf)] ? 'EQUAL' : R[String(r.key)] > R[String(r.cf)] ? 'HIGHER' : 'LOWER';
  (tally[k] ||= { EQUAL: 0, LOWER: 0, HIGHER: 0 })[c] += 1;
  if (r.magic && !r.cfMagic) magic.push(`${t.seed} ${k}`);
  if (c !== 'EQUAL') lines.push(`${t.seed.replace(/^r3m-/, '')} ${k} | served ${r.key} cf ${r.cf} ${c} | closes: ${r.closes.join(', ') || '(no single field)'} | served ${JSON.stringify(r.why)} | cf ${JSON.stringify(r.cfWhy)}`);
}
console.log('tally (engine/Reveal):', JSON.stringify(tally));
console.log(`"Magical crime" served where the counterfactual has none: ${magic.length}${magic.length ? `: ${magic.join('; ')}` : ''}`);
console.log(lines.sort().join('\n'));
