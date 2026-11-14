// Parse every town's Economic Flows section into cards; write cards.json keyed by seed.
const fs = require('fs');
const RUN = '/tmp/claude-0/rw2c/run';
const OUT = '/tmp/claude-0/rw2c/agents/out-econ-flows';
const CATS = ['Religion & civic', 'Food security', 'Criminal economy', 'Entertainment & culture', 'Raw materials & fuel', 'Trade & entrepôt', 'Arcane & magical', 'Healing & medicine', 'Manufacturing & crafts', 'Knowledge & information', 'Defense & security'];
const CHIPS = { '✓ Running': 'running', '○ Operational': 'operational', 'Vulnerable': 'vulnerable', 'Impaired': 'impaired', 'Entrepôt': 'entrepot', '✦ Magically Sustained': 'magically_sustained' };
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const HDR = new RegExp(`^(.+?)(${CATS.map(esc).join('|')})(${Object.keys(CHIPS).map(esc).join('|')})?$`);
const SVC = /^(.+?)Service(Export)?(Impaired|○ Operational)?$/;
const leaves = fs.readFileSync(RUN + '/leaves-tip.jsonl', 'utf8').trim().split('\n').map(JSON.parse);
const out = {};
for (const lv of leaves) {
  const d = fs.readFileSync(`${RUN}/tip/dumps/${lv.seed}.txt`, 'utf8').split('\n');
  const i = d.findIndex((x) => x.startsWith('Economic Flows ('));
  if (i < 0) { out[lv.seed] = null; continue; }
  const sec = [];
  for (let j = i; j < d.length && !d[j].startsWith('== ') && !d[j].startsWith('Shadow Economy'); j++) sec.push(d[j]);
  const cards = []; let cur = null; let inSvc = false;
  sec.forEach((line, k) => {
    if (k < 2) return;
    if (line === 'Service economy') { inSvc = true; cur = null; return; }
    const m = !inSvc && line.match(HDR);
    const s = inSvc && line.match(SVC);
    if (m) { cur = { kind: 'chain', name: m[1], cat: m[2], chip: m[3] ? CHIPS[m[3]] : '', header: line, idx: k, lines: [] }; cards.push(cur); return; }
    if (s) { cur = { kind: 'svc', name: s[1], chip: s[3] === 'Impaired' ? 'impaired' : s[3] ? 'operational' : '', header: line, idx: k, lines: [] }; cards.push(cur); return; }
    if (cur) cur.lines.push(line);
  });
  out[lv.seed] = { head: sec[0], tabs: sec[1], cards };
}
fs.writeFileSync(OUT + '/cards.json', JSON.stringify(out));
const n = Object.values(out).filter(Boolean);
console.log('towns', n.length, 'cards', n.reduce((a, t) => a + t.cards.length, 0));
// check matches with leaves chains
let unmatched = 0;
for (const lv of leaves) { const t = out[lv.seed]; if (!t) continue; const cc = t.cards.filter((c) => c.kind === 'chain');
  if (cc.length !== lv.chains.length) { unmatched++; if (unmatched < 5) console.log('mismatch', lv.seed, cc.length, lv.chains.length, cc.map((c) => c.name), lv.chains.map((c) => c.name)); } }
console.log('chain-count mismatches', unmatched);
