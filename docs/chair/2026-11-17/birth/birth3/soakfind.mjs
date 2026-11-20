const T = process.env.TREE;
const { birth, ensureLaws } = await import(T + '/scripts/audit/soak-review/corpus.mjs');
await ensureLaws();
const found = [];
for (let i = 0; i < 1000 && found.length < 3; i++) {
  const s = birth(i).settlement;
  const g = (s.resourceAnalysis?.gaps || []).filter((x) => x.institution === 'Sawmill' && x.chain === 'timber');
  if (g.length && g.every((x) => x.kind === 'missing')) found.push(`soak1k-${i} ${JSON.stringify(g.map((x) => x.kind))} ${s.config?.tradeRouteAccess} ${s.config?.stressTypes}`);
}
console.log(found.join('\n'));
