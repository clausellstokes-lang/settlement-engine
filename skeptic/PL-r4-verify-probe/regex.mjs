import fs from 'node:fs';
const M = process.argv[2];
const h = fs.readFileSync(M + '/src/domain/worldPulse/relationshipRuleHelpers.js', 'utf8');
const g = fs.readFileSync(M + '/src/domain/worldPulse/grievanceRead.js', 'utf8');
const pick = (src, name) => { const m = src.match(new RegExp('const ' + name + ' = (/.*/[a-z]*);')); return eval(m[1]); };
const RX = { ESCALATION_HINT: pick(h, 'ESCALATION_HINT'), DEESCALATION_HINT: pick(h, 'DEESCALATION_HINT'), WOUND_TYPE_RE: pick(g, 'WOUND_TYPE_RE') };
for (const w of ['riders_lent', 'riders_quartered', 'peace_unkept', 'protection_kept', 'protection_failed', 'raid', 'supply_raid']) {
  console.log(w, Object.fromEntries(Object.entries(RX).map(([k, r]) => [k, r.test(w)])));
}
