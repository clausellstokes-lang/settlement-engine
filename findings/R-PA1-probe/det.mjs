const { generateSettlementPipeline } = await import('./mcr/src/generators/generateSettlementPipeline.js');
const diffs = (a, b, p = '', out = []) => {
  if (JSON.stringify(a) === JSON.stringify(b)) return out;
  if (a && b && typeof a === 'object' && typeof b === 'object') { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diffs(a[k], b[k], p + '.' + k, out); }
  else out.push(p + ' : ' + JSON.stringify(a)?.slice(0,60) + ' vs ' + JSON.stringify(b)?.slice(0,60));
  return out;
};
for (const tier of ['village','city']) {
  const a = generateSettlementPipeline({ settType: tier }, null, { seed: 'det-'+tier });
  await new Promise(r => setTimeout(r, 30));
  const b = generateSettlementPipeline({ settType: tier }, null, { seed: 'det-'+tier });
  const d = diffs(a, b);
  console.log(tier, 'whole-record diffs:', d.length, d.slice(0, 15));
  console.log('id', a.id, 'neighborRelationship', JSON.stringify(a.neighborRelationship), 'relationships', JSON.stringify(a.relationships)?.slice(0,200), 'userCanon', JSON.stringify(a.userCanon)?.slice(0,200));
  console.log('founding', JSON.stringify(a.history.founding));
  console.log('legacy', JSON.stringify(a.history.legacyAnnotations?.[0]));
  console.log('tension0', JSON.stringify(a.history.currentTensions[0]).slice(0,400));
  console.log('siege', a.history.siegeNarrative);
}
