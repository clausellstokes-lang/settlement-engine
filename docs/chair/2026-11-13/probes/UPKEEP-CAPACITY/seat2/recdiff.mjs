// recdiff.mjs <treeA> <treeB> <key>...: the paths that differ in the born record, defence and powers aside
const [A, B, ...keys] = process.argv.slice(2);
const born = async (R) => {
  const { generateSettlementPipeline } = await import(R + '/src/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import(R + '/src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import(R + '/src/store/configSlice.js');
  await loadGenerationLawPayloads();
  const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  return (key) => { const m = /^[a-z0-9]+-(?:([a-z_]+)-)?(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(key);
    const cfg = m[1] ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[2], selectedStresses: [m[1]], selectedStressesRandom: false }) : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[2] });
    return JSON.parse(JSON.stringify(generateSettlementPipeline(cfg, null, { seed: key, customContent: {} }))); };
};
const walk = (a, b, p, out) => { if (JSON.stringify(a) === JSON.stringify(b)) return; if (a && b && typeof a === 'object' && typeof b === 'object') { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) walk(a[k], b[k], p + '.' + k, out); } else out.push([p, JSON.stringify(a)?.slice(0, 160), JSON.stringify(b)?.slice(0, 160)]); };
const ba = await born(A); const recs = keys.map((k) => ba(k));
const bb = await born(B);
keys.forEach((k, i) => { const x = recs[i], y = bb(k); delete x.defenseProfile; delete y.defenseProfile; delete x.powerStructure; delete y.powerStructure; const out = []; walk(x, y, '', out); console.log('##', k, out.length); for (const o of out.slice(0, 12)) console.log('  ', o.join(' | ')); });
