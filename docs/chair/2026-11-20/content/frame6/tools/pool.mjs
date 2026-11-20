// Births the calm pool once and caches it (JSON), so every measure reads the same towns.
// The FRAME-1 pool script, with the tree's src/ as argv[4] (default: this worktree's).
import fs from 'node:fs';
const R = process.argv[4] || '/tmp/claude-0/-home-user-settlement-engine/a24e1eb5-d90d-5963-a121-dbebc78118f8/scratchpad/wt-b2/src/';
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const PER = Number(process.argv[2] || 55);
const out = process.argv[3];
const towns = []; let tried = 0, crisis = [];
for (const tier of TIERS) {
  let got = 0, i = 0;
  while (got < PER) {
    const seed = `frame-calm-${tier}-${i++}`; tried++;
    const s = generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} });
    const st = Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : []);
    if (st.length) { if (crisis.length < 12) crisis.push(seed + '|' + tier); continue; }
    towns.push({ seed, tier, s }); got++;
  }
}
fs.writeFileSync(out, JSON.stringify({ tried, crisis, towns }));
console.log('tried', tried, 'calm', towns.length);
