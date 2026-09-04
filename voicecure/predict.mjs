// VOICECURE — PREDICTION SIMULATION. Read-only: nothing is written.
// Simulates the CHAIR'S register act (deleting the fallen EconomicsTab row from
// the Tier-3 baseline) in memory and recomputes the arm's three magnitudes.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const ROOT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree';
const { scanJsxTree } = await import(join(ROOT, 'tests/helpers/jsxLiteralWalk.js'));
const cur = {};
for (const { rel, strings } of scanJsxTree(join(ROOT, 'src'), ROOT)) {
  let em = 0, bang = 0;
  for (const t of strings) { em += (t.match(/—/g) || []).length; bang += (t.match(/!/g) || []).length; }
  if (em > 0 || bang > 0) cur[rel] = { em, bang };
}
const armOf = (base) => {
  const lines = [];
  for (const k of [...new Set([...Object.keys(base), ...Object.keys(cur)])].sort()) {
    const b = base[k] || { em: 0, bang: 0 }; const c = cur[k] || { em: 0, bang: 0 };
    if (b.em !== c.em || b.bang !== c.bang) lines.push(`${k}: baseline em:${b.em} bang:${b.bang} → current em:${c.em} bang:${c.bang}`);
  }
  // the gate's own magnitude patterns, applied to the failure message:
  const msg = `\n${lines.join('\n')}\n`;
  const em = [...msg.matchAll(/current em:(\d+)/g)].reduce((s, m) => s + Number(m[1]), 0);
  const bang = [...msg.matchAll(/current em:\d+ bang:(\d+)/g)].reduce((s, m) => s + Number(m[1]), 0);
  const files = (msg.match(/^\S+: baseline em:/gm) || []).length;
  return { em, bang, files, frozenRows: Object.keys(base).length, frozenEm: Object.values(base).reduce((s, r) => s + r.em, 0) };
};
const live = JSON.parse(readFileSync(join(ROOT, 'tests/copy/.voice-mechanics-jsx-baseline.json'), 'utf8'));
const banked = { ...live }; delete banked['src/components/new/tabs/EconomicsTab.jsx'];
const zeroed = { ...live, 'src/components/new/tabs/EconomicsTab.jsx': { em: 0, bang: 0 } };
console.log('CEILINGS                 em<=34  bang<=0  files<=15');
for (const [name, base] of [['AS COMMITTED NOW      ', live], ['CHAIR DELETES the row ', banked], ['CHAIR ZEROES the row  ', zeroed]]) {
  const a = armOf(base);
  console.log(`${name} em=${a.em} bang=${a.bang} files=${a.files}  | frozen rows=${a.frozenRows} frozen em total=${a.frozenEm}`);
}
console.log('repo-wide currentJsx total em =', Object.values(cur).reduce((s, c) => s + c.em, 0), '(total-arm magnitude ceiling 40)');
