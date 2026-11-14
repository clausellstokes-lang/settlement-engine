// For each need sentence, which printed import carries each named good (by the tip's own matcher), to eyeball false matches.
import { needMetBy } from '/home/user/settlement-engine/src/domain/display/tradeListDisplay.js';
import fs from 'fs';
const RUN = '/tmp/claude-0/rw2c/run';
const lines = fs.readFileSync(RUN + '/fam-all/econ-flows.jsonl', 'utf8').trim().split('\n').map(JSON.parse).filter((r) => r.fam.startsWith('NEED'));
const LV = Object.fromEntries(fs.readFileSync(RUN + '/leaves-tip.jsonl', 'utf8').trim().split('\n').map((l) => { const r = JSON.parse(l); return [r.seed, r]; }));
const pairs = {};
for (const r of lines) {
  const R = JSON.parse(fs.readFileSync(`${RUN}/tip/records/${r.seed}.json`, 'utf8'));
  const arriving = LV[r.seed].trade.arriving.length ? LV[r.seed].trade.arriving : (R.economicState.primaryImports || []);
  const ch = R.economicState.activeChains.filter((c) => c.dependency && r.line.toLowerCase().startsWith((c.dependency.affectedServices || [])[0]?.toLowerCase() || '\u0000'));
  const parts = new Set(); for (const c of ch) for (const p of String(c.dependency.resource).split(/\s*\+\s*/)) parts.add(p.trim());
  for (const p of parts) {
    const m = arriving.filter((imp) => needMetBy(p, imp) || imp.toLowerCase().includes(p.toLowerCase().split(/[\s/]/)[0]));
    const k = `${p} <= ${m.length ? m.map((x) => x.replace(/\s*\(.*\)/, '')).sort().join(' | ') : '(none)'}`;
    (pairs[k] = pairs[k] || []).push(r.seed);
  }
}
const out = Object.entries(pairs).sort((a, b) => b[1].length - a[1].length);
fs.writeFileSync('/tmp/claude-0/rw2c/agents/out-econ-flows/pairs.json', JSON.stringify(out));
const byNeed = {};
for (const [k, v] of out) { const [p, m] = k.split(' <= '); (byNeed[p] = byNeed[p] || []).push(`${v.length}× ${m}`); }
for (const [p, v] of Object.entries(byNeed)) console.log(p, '\n   ', v.slice(0, 8).join('\n    '));
