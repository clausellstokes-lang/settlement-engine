// BD-r4 probe 2: deriveMilitaryCapacity on master's own sample settlements (realistic facets).
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src';
const { deriveMilitaryCapacity } = await import(M + '/domain/worldPulse/militaryStrength.js');
const mod = await import(M + '/data/sampleSettlements.js');
const list = Object.values(mod).flatMap(v => Array.isArray(v) ? v : (v && typeof v === 'object' ? Object.values(v) : []));
const rows = [];
for (const s of list) {
  if (!s || typeof s !== 'object') continue;
  const tier = s.tier || s.config?.tier; if (!tier) continue;
  const m = deriveMilitaryCapacity(s);
  rows.push([tier, s.name || s.config?.name || '?', m.currentCapacity]);
}
rows.sort((a, b) => a[2] - b[2]);
for (const r of rows) console.log(String(r[0]).padEnd(11), String(r[1]).slice(0, 28).padEnd(29), r[2].toFixed(1), ' raid-threshold x1.2 =', (r[2] * 1.2).toFixed(1));
console.log('body max strengths (midpoint, full readiness+cohesion): thin 13 · modest 34 · capable 51 · strong 69 · formidable 89');
