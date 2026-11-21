// SR1-P proof (b), the births of one tree. usage: node birthB.mjs <tree/> <out.jsonl>
// A forced two-crisis pool: config.stressTypes [a, b] for every unordered pair of the 15 kinds (105), one seed a tier
// (`sr1p-<a>-<b>-<tier>`): 630 towns. One JSON line per town: each crisis entry's kind, forced flag and cast whole.
import fs from 'node:fs';
const [R, OUT] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(R + 'src/generators/generateSettlementPipeline.js');
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const KINDS = 'famine,plague_onset,mass_migration,monster_pressure,politically_fractured,succession_void,insurgency,slave_revolt,religious_conversion,recently_betrayed,infiltrated,under_siege,occupied,wartime,indebted'.split(',');
const fd = fs.openSync(OUT, 'w');
let n = 0, err = 0;
for (let i = 0; i < KINDS.length; i++) for (let j = i + 1; j < KINDS.length; j++) for (const tier of SIZES) {
  const pair = [KINDS[i], KINDS[j]]; const seed = `sr1p-${pair[0]}-${pair[1]}-${tier}`; n++;
  let s;
  try { s = generateSettlementPipeline({ settType: tier, stressTypes: pair }, null, { seed, customContent: {} }); }
  catch (e) { err++; fs.writeSync(fd, JSON.stringify({ seed, pair, tier, err: String(e).slice(0, 200) }) + '\n'); continue; }
  const st = (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).filter(Boolean);
  fs.writeSync(fd, JSON.stringify({ seed, pair, tier, entries: st.map((e) => ({ kind: e.type, forced: !!e.forcedByConfig, cast: e.cast ?? null })) }) + '\n');
}
fs.closeSync(fd);
console.log('towns', n, 'err', err);
