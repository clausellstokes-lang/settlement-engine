/** @vitest-environment node */
// A5 probe (BIRTH-2): per power, the description at the power step BEFORE its standing is appended (the base), the final
// description, and the record's size. Wraps annotateFactionStanding to read the base; changes nothing in the tree.
import { test, vi } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
const T = process.env.A5_TREE || '/home/user/settlement-engine';
const FS = `${T}/src/generators/power/factionStanding.js`;
const { bases } = vi.hoisted(() => ({ bases: [] }));
vi.mock('/home/user/settlement-engine/src/generators/power/factionStanding.js', async (orig) => {
  const m = await orig();
  return { ...m, annotateFactionStanding: (factions, force, seat) => { bases.push(new Map(factions.map((f) => [f.faction, String(f.desc || '')]))); return m.annotateFactionStanding(factions, force, seat); } };
});
test('A5 bytes', async () => {
  const R = `${T}/src/`;
  const { generateSettlementPipeline } = await import(/* @vite-ignore */ R + 'generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import(/* @vite-ignore */ R + 'domain/density/densityCreateBoundary.js');
  await loadGenerationLawPayloads();
  const plan = JSON.parse(readFileSync(process.env.A5_PLAN, 'utf8')).filter((_, i) => i % 150 < Number(process.env.A5_N || 150));
  const out = [];
  for (const { seed, size, config } of plan) {
    bases.length = 0;
    const s = generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
    const first = bases[0] || new Map(); // the power step's own annotation (rulingStructure.js)
    const powers = (s.powerStructure?.factions || []).map((f) => {
      const d = String(f.desc || ''); const b = first.get(f.faction);
      const tail = b !== undefined && d.startsWith(b) ? d.slice(b.length).trim() : null;
      return { name: f.faction, descLen: d.length, baseLen: b === undefined ? null : b.length, tailLen: tail === null ? null : tail.length, baseIsPrefix: b !== undefined && d.startsWith(b) };
    });
    out.push(JSON.stringify({ seed, size, recordBytes: JSON.stringify(s).length, annotateCalls: bases.length, powers }));
  }
  writeFileSync(process.env.A5_OUT, out.join('\n') + '\n');
}, 3600000);
