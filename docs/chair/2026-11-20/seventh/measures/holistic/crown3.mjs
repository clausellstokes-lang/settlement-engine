const [, , L] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { DIALS } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { APPOINTED_GOVERNMENTS } = await import(`${L}/src/generators/people/representatives.js`);
await loadGenerationLawPayloads();
let n = 0, royal = 0, alone = 0, clear = 0; const mem = new Map(); const bySize = {};
for (const size of ['city', 'metropolis']) for (const [pre, k, cfg] of [['hxd', 50, {}], ['hxr', 25, DIALS]]) for (let i = 0; i < k; i++) {
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...cfg, settType: size }), null, { seed: `${pre}-${size}-${i}`, customContent: {} }); n++;
  if (t.powerStructure.government !== 'Royal Authority') continue; royal++; bySize[size] = (bySize[size] || 0) + 1;
  const card = (t.npcs || []).find((c) => c.institution?.key === 'Royal seat');
  const sig = (card?.memberships || []).map((m) => `${m.power} ${m.share}`).join(' + ') || 'NO CARD'; mem.set(sig, (mem.get(sig) || 0) + 1);
  if ((card?.memberships || []).length === 1) alone++;
  const others = (t.powerStructure.factions || []).map((f) => f.faction).filter((f) => f !== 'Royal Authority' && (APPOINTED_GOVERNMENTS.includes(f) || /occupation|foreign|regen|govern|steward|ducal|feudal/i.test(f)));
  const stress = [].concat(t.stress || [], t.stressTypes || [], t.config?.stressTypes || []).map((s) => (typeof s === 'string' ? s : s?.type || s?.id || '')).filter((s) => /war|occup|siege|conquer/i.test(s));
  if (!others.length && !stress.length) clear++; else console.log('  not the crown\'s own by a rough read:', t.name, size, JSON.stringify(others), JSON.stringify(stress));
}
console.log(`large places ${n}; royal seats ${royal} ${JSON.stringify(bySize)}; monarch belongs to one power only: ${alone}; rough count with no occupier, governor or war beside the crown: ${clear}`);
for (const [s, c] of mem) console.log(String(c).padStart(3), s);
